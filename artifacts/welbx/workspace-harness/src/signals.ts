// The signal desk: a TRAVEL-SIDE adapter that holds fictional system events, applies the checks an adapter can honestly apply,
// and prepares ONE opening event for Core. It owns no lifecycle: it never approves, shares, releases or completes anything,
// and after an opening event is handed to Core, Core owns the response.
//
// What Core does and does not give this layer (precisely) is in CORE-GAPS.md:
//  - Core defines the `jaldo.event` envelope (used here to validate every signal) and admits an opening event (used at adoption).
//  - Core has NO accepted pre-request signal store, cross-source correlation, ordering or staleness contract, and its recognition
//    only works inside an opened coordination. The checks below therefore mirror Core's own idempotency rule and are labelled as
//    a demonstration interpretation, never as a JALDO Core capability.
import { EventEnvelopeSchema, classificationRank } from "@workspace/jaldo-orchestration";
import { SCOPE } from "./session-scope";

export type SourceKey = "pms" | "maintenance";
export const SOURCES: Record<SourceKey, { label: string; system: string }> = {
  pms: { label: "Property management system", system: "pms-fictional" },
  maintenance: { label: "Maintenance work orders", system: "maintenance-fictional" },
};

/** The interpretation rule, as data: reviewable and versioned, not hidden in code. */
export const RULE = {
  id: "proactive-checkin-demo", version: "0.1",
  label: "Room still unavailable after the promised time, with a repair that is not expected to finish soon",
  minimumRepairWaitMinutes: 60,
  requires: ["PMS: the room is not ready and its promised ready time has passed", "Maintenance (independent source): an open work order for the same room with an estimated completion more than 60 minutes away", "No help request from the guest is open"],
};

export interface Signal { id: string; key: string; source: SourceKey; type: string; occurredAt: string; context: Record<string, string> }
export type Outcome = "taken-in" | "duplicate" | "conflict" | "superseded" | "refused";
export interface Received { signal: Signal; order: number; outcome: Outcome; reason: string }

const ENVELOPE_PURPOSE = "room-readiness";
const envelopeOf = (s: Signal) => ({
  schema: "jaldo.event", id: s.id, idempotencyKey: s.key, type: s.type, occurredAt: s.occurredAt, scope: SCOPE,
  source: { system: SOURCES[s.source].system }, provenance: { method: "integration" }, purpose: ENVELOPE_PURPOSE, classification: "internal", context: s.context,
});

/** The fictional events. Times are UTC on the synthetic day. */
export const PMS_EVENT: Signal = { id: "pms-evt-1", key: "pms-412-0850", source: "pms", type: "room.status-reported", occurredAt: "2026-11-02T08:50:00.000Z",
  context: { room: "Room 412 (fictional)", status: "Not ready", promisedReady: "08:45", guestArrived: "08:10", guestHelpRequest: "none" } };
export const MAINTENANCE_EVENT: Signal = { id: "mnt-evt-1", key: "wo-1182-0855", source: "maintenance", type: "work-order.updated", occurredAt: "2026-11-02T08:55:00.000Z",
  context: { room: "Room 412 (fictional)", workOrder: "WO-1182", status: "Open: air-handling fault", estimatedCompletion: "11:30" } };
/** Variants the reviewer can send. */
export const STALE_PMS: Signal = { id: "pms-evt-0", key: "pms-412-0820", source: "pms", type: "room.status-reported", occurredAt: "2026-11-02T08:20:00.000Z",
  context: { room: "Room 412 (fictional)", status: "Ready", promisedReady: "08:45", guestArrived: "08:10", guestHelpRequest: "none" } };
export const CONFLICTING_PMS: Signal = { ...PMS_EVENT, context: { ...PMS_EVENT.context, status: "Ready" } };
export const SHORT_REPAIR: Signal = { ...MAINTENANCE_EVENT, id: "mnt-evt-2", key: "wo-1182-0856", occurredAt: "2026-11-02T08:56:00.000Z", context: { ...MAINTENANCE_EVENT.context, estimatedCompletion: "09:20", status: "Open: filter change" } };
export const GUEST_ALREADY_ASKED: Signal = { ...PMS_EVENT, id: "pms-evt-3", key: "pms-412-0858", occurredAt: "2026-11-02T08:58:00.000Z", context: { ...PMS_EVENT.context, guestHelpRequest: "open" } };

const minutes = (hhmm: string, relativeTo: Date) => { const [h, m] = hhmm.split(":").map(Number); const d = new Date(relativeTo); d.setUTCHours(h, m, 0, 0); return d.getTime(); };

export interface Assessment {
  recognised: boolean;
  /** Why, in a sentence, whichever way it went. */
  reason: string;
  evidence: { source: string; time: string; facts: { label: string; value: string }[]; note?: string }[];
  /** Always stated. A delay does not establish distress. */
  uncertainty: string[];
  /** What would change the outcome, when not recognised. */
  missing: string[];
  recognisedAt: string | null;
}

export class SignalDesk {
  received: Received[] = [];
  private seen = new Map<string, string>();
  private n = 0;
  recognisedAt: string | null = null;

  ingest(signal: Signal, now: Date): Received {
    const order = ++this.n;
    const done = (outcome: Outcome, reason: string): Received => { const r = { signal, order, outcome, reason }; this.received.push(r); return r; };
    const parsed = EventEnvelopeSchema.safeParse(envelopeOf(signal));
    if (!parsed.success) return done("refused", "Core's event envelope refuses it (not a valid jaldo.event).");
    if (classificationRank(parsed.data.classification) > classificationRank("internal")) return done("refused", "More sensitive than this feed may carry.");
    const body = JSON.stringify([signal.type, signal.occurredAt, signal.context]);
    const prior = this.seen.get(signal.key);
    if (prior !== undefined) return prior === body ? done("duplicate", "Same idempotency key and content: acknowledged, no second effect.") : done("conflict", "Same idempotency key with different content: nothing recorded.");
    this.seen.set(signal.key, body);
    const newest = this.current(signal.source);
    if (newest && Date.parse(signal.occurredAt) < Date.parse(newest.signal.occurredAt)) return done("superseded", `Older (${signal.occurredAt.slice(11, 16)} UTC) than the current ${SOURCES[signal.source].label} reading (${newest.signal.occurredAt.slice(11, 16)} UTC): kept on record, changes nothing.`);
    const r = done("taken-in", signal.source === "maintenance" ? "Valid under Core's event envelope; an independent source." : "Valid under Core's event envelope; now the current property reading.");
    const a = this.assess(now);
    if (a.recognised && this.recognisedAt === null) this.recognisedAt = now.toISOString();
    return r;
  }

  /** The reading currently relied on for a source: the accepted signal with the latest EVENT time, whatever order they arrived in. */
  current(source: SourceKey): Received | null {
    return this.received.filter((r) => r.signal.source === source && r.outcome === "taken-in").sort((a, b) => Date.parse(b.signal.occurredAt) - Date.parse(a.signal.occurredAt))[0] ?? null;
  }

  assess(now: Date): Assessment {
    const pms = this.current("pms"), mnt = this.current("maintenance");
    const evidence: Assessment["evidence"] = [];
    const facts = (c: Record<string, string>) => Object.entries(c).map(([k, v]) => ({ label: LABEL[k] ?? k, value: v }));
    if (pms) evidence.push({ source: SOURCES.pms.label, time: pms.signal.occurredAt, facts: facts(pms.signal.context) });
    if (mnt) evidence.push({ source: SOURCES.maintenance.label, time: mnt.signal.occurredAt, facts: facts(mnt.signal.context) });
    const uncertainty = [
      "Whether the guest wants any help: only the guest can say.",
      "Whether the guest has already been told about the delay.",
      "Whether the guest is distressed. An operational delay does not establish distress, and nothing here infers it.",
      "Whether the repair estimate will hold (one source).",
    ];
    const missing: string[] = [];
    if (!pms) missing.push("A property-system reading for the room");
    if (!mnt) missing.push("An independent maintenance reading for the same room");
    if (pms) {
      const { status: roomReading, promisedReady, guestHelpRequest } = pms.signal.context;
      if (roomReading !== "Not ready") missing.push("The room is reported ready: no delay to act on");
      else if (minutes(promisedReady, now) > now.getTime()) missing.push("The promised ready time has not passed yet");
      if (guestHelpRequest !== "none") missing.push("The guest already has a help request open: it is theirs to lead");
    }
    const { status: orderReading, estimatedCompletion, room: orderRoom } = mnt?.signal.context ?? { status: "", estimatedCompletion: "00:00", room: "" };
    if (mnt && !/^open/i.test(orderReading)) missing.push("The work order is not open");
    if (mnt && pms && orderRoom !== pms.signal.context.room) missing.push("The maintenance reading is for a different room");
    if (mnt && /^open/i.test(orderReading) && minutes(estimatedCompletion, now) - now.getTime() <= RULE.minimumRepairWaitMinutes * 60_000) missing.push(`The repair is expected within ${RULE.minimumRepairWaitMinutes} minutes: a short wait, not enough to recommend a check-in`);
    const recognised = missing.length === 0;
    return {
      recognised, evidence, uncertainty, missing: recognised ? [] : missing, recognisedAt: recognised ? this.recognisedAt ?? now.toISOString() : null,
      reason: recognised ? "Two independent sources agree the room is still unavailable past its promised time, and the repair is not expected to finish soon. A proactive check-in may be appropriate before the guest has to ask." : "Not enough to recommend anything. Nothing is opened and nobody is contacted.",
    };
  }

  /** The one thing handed to Core on adoption: the permitted facts of the opening event, in the request's own fields. */
  openingContext(): Record<string, string> {
    return {
      who: "Alex (fictional guest)",
      ask: "Nothing yet: the hotel is offering a check-in because the room is delayed",
      preferences: "Not yet asked: the guest decides whether help is wanted",
      contact: "Message to the guest app (fictional)",
    };
  }
  sourceRefs(): string[] { return [this.current("pms"), this.current("maintenance")].filter(Boolean).map((r) => r!.signal.id); }
}

const LABEL: Record<string, string> = { room: "Location", status: "Status", promisedReady: "Promised ready", guestArrived: "Guest arrived", guestHelpRequest: "Help request from guest", workOrder: "Work order", estimatedCompletion: "Estimated completion" };
