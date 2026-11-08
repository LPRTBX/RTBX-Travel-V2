// The signal desk: a TRAVEL-SIDE adapter that holds fictional system events, applies the checks an adapter can honestly apply,
// and prepares ONE opening event for Core. It owns no lifecycle: it never approves, shares, releases or completes anything,
// and after an opening event is handed to Core, Core owns the response.
//
// What Core does and does not give this layer (precisely) is in CORE-GAPS.md:
//  - Core defines the `jaldo.event` envelope (used here to validate every signal) and admits an opening event (used at adoption).
//  - Core has NO accepted pre-request signal store, freshness, business-field validation, ordering or cross-source correlation
//    contract, and its recognition only works inside an opened coordination. Everything below the envelope check is therefore a
//    demonstration adapter, labelled as such, never presented as a JALDO Core capability.
import { EventEnvelopeSchema, classificationRank } from "@workspace/jaldo-orchestration";
import { SCOPE } from "./session-scope";

export type SourceKey = "pms" | "maintenance";
export const SOURCES: Record<SourceKey, { label: string; system: string; type: string }> = {
  pms: { label: "Property management system", system: "pms-fictional", type: "room.status-reported" },
  maintenance: { label: "Maintenance work orders", system: "maintenance-fictional", type: "work-order.updated" },
};

/** Freshness and clock tolerance, per source, as configuration. A reading older than its maximum age supports nothing. */
export interface Freshness { maxAgeMinutes: Record<SourceKey, number>; futureToleranceSeconds: number }
export const DEFAULT_FRESHNESS: Freshness = { maxAgeMinutes: { pms: 30, maintenance: 60 }, futureToleranceSeconds: 60 };

/** The interpretation rule, as data: reviewable and versioned, not hidden in code. */
export const RULE = {
  id: "proactive-checkin-demo", version: "0.2",
  label: "Room still unavailable after the promised time, with a repair that is not expected to finish soon",
  minimumRepairWaitMinutes: 60,
  requires: [
    "PMS: a fresh reading says the room is not ready (or out of order) and its promised ready time has passed",
    "Maintenance (independent source): a fresh reading for the same room says a work order is open with an estimated completion more than 60 minutes away",
    "No help request from the guest is open",
  ],
};

/** The allowed business values. Anything else is refused, not guessed at. */
export const PMS_STATUS: Record<string, string> = { ready: "Ready", "not-ready": "Not ready", "out-of-order": "Out of order" };
export const WORK_STATUS: Record<string, string> = { open: "Open", "in-progress": "In progress", completed: "Completed", cancelled: "Cancelled" };
export const HELP_REQUEST: Record<string, string> = { none: "None", open: "Open" };
const REQUIRED: Record<SourceKey, string[]> = { pms: ["room", "status", "promisedReady", "guestArrived", "guestHelpRequest"], maintenance: ["room", "workOrder", "status", "estimatedCompletion"] };
const TIME_FIELDS: Record<SourceKey, string[]> = { pms: ["promisedReady", "guestArrived"], maintenance: ["estimatedCompletion"] };

export interface Signal { id: string; key: string; source: SourceKey; type: string; occurredAt: string; context: Record<string, string> }
export type Outcome = "taken-in" | "duplicate" | "conflict" | "superseded" | "refused";
export interface Received { signal: Signal; order: number; outcome: Outcome; reason: string }

const ENVELOPE_PURPOSE = "room-readiness";
const envelopeOf = (s: Signal) => ({
  schema: "jaldo.event", id: s.id, idempotencyKey: s.key, type: s.type, occurredAt: s.occurredAt, scope: SCOPE,
  source: { system: SOURCES[s.source].system }, provenance: { method: "integration" }, purpose: ENVELOPE_PURPOSE, classification: "internal", context: s.context,
});

/** A full UTC timestamp with a date, so midnight and date changes are exact. Nothing here accepts a bare clock time. */
const FULL_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?Z$/;
export function parseFullTime(v: unknown): number | null {
  if (typeof v !== "string") return null;
  const m = FULL_TIME.exec(v);
  if (!m) return null;
  const t = Date.parse(v);
  if (Number.isNaN(t)) return null;
  const d = new Date(t); // reject impossible dates such as 31 February, which Date would roll over
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() + 1 === +m[2] && d.getUTCDate() === +m[3] && d.getUTCHours() === +m[4] && d.getUTCMinutes() === +m[5] ? t : null;
}

/** Business validation beyond Core's envelope. Returns every problem found (empty when valid). */
export function validateBusiness(s: Signal): string[] {
  const errs: string[] = [];
  const src = SOURCES[s.source];
  if (s.type !== src.type) errs.push(`The event type must be ${src.type} for ${src.label}`);
  const at = parseFullTime(s.occurredAt);
  if (at === null) errs.push("The event time is missing or is not a full UTC timestamp (date and time)");
  const c = s.context;
  for (const k of REQUIRED[s.source]) if (typeof c[k] !== "string" || c[k].trim() === "") errs.push(`Required field “${k}” is missing`);
  for (const k of Object.keys(c)) if (!REQUIRED[s.source].includes(k)) errs.push(`Unexpected field “${k}”`);
  if (c.room !== undefined && c.room.trim() !== "" && !/^\d{1,5}$/.test(c.room)) errs.push("The room must be a room number");
  for (const k of TIME_FIELDS[s.source]) if (c[k] !== undefined && c[k].trim() !== "" && parseFullTime(c[k]) === null) errs.push(`“${k}” is not a full UTC timestamp (date and time)`);
  if (s.source === "pms") {
    const { status: roomStatus = "" } = c;
    if (roomStatus !== "" && !(roomStatus in PMS_STATUS)) errs.push(`Unknown room status “${roomStatus}”`);
    if (c.guestHelpRequest !== undefined && c.guestHelpRequest !== "" && !(c.guestHelpRequest in HELP_REQUEST)) errs.push(`Unknown help-request value “${c.guestHelpRequest}”`);
    const arrived = parseFullTime(c.guestArrived);
    if (at !== null && arrived !== null && arrived > at) errs.push("The guest cannot have arrived after the event");
  } else {
    const { status: orderStatus = "" } = c;
    if (orderStatus !== "" && !(orderStatus in WORK_STATUS)) errs.push(`Unknown work-order status “${orderStatus}”`);
    if (c.workOrder !== undefined && c.workOrder !== "" && !/^WO-\d+$/.test(c.workOrder)) errs.push("The work order must look like WO-1234");
    const eta = parseFullTime(c.estimatedCompletion);
    if (at !== null && eta !== null && eta <= at) errs.push("The estimated completion cannot precede the event");
  }
  return errs;
}

/** The fictional events. */
const iso = (hhmm: string, day = "2026-11-02") => `${day}T${hhmm}:00.000Z`;
export const PMS_EVENT: Signal = { id: "pms-evt-1", key: "pms-412-0850", source: "pms", type: SOURCES.pms.type, occurredAt: iso("08:50"),
  context: { room: "412", status: "not-ready", promisedReady: iso("08:45"), guestArrived: iso("08:10"), guestHelpRequest: "none" } };
export const MAINTENANCE_EVENT: Signal = { id: "mnt-evt-1", key: "wo-1182-0855", source: "maintenance", type: SOURCES.maintenance.type, occurredAt: iso("08:55"),
  context: { room: "412", workOrder: "WO-1182", status: "open", estimatedCompletion: iso("11:30") } };
export const STALE_PMS: Signal = { id: "pms-evt-0", key: "pms-412-0820", source: "pms", type: SOURCES.pms.type, occurredAt: iso("08:20"),
  context: { room: "412", status: "ready", promisedReady: iso("08:45"), guestArrived: iso("08:10"), guestHelpRequest: "none" } };
export const CONFLICTING_PMS: Signal = { ...PMS_EVENT, context: { ...PMS_EVENT.context, status: "ready" } };
export const SHORT_REPAIR: Signal = { ...MAINTENANCE_EVENT, id: "mnt-evt-2", key: "wo-1182-0856", occurredAt: iso("08:56"), context: { ...MAINTENANCE_EVENT.context, estimatedCompletion: iso("09:20") } };
export const GUEST_ALREADY_ASKED: Signal = { ...PMS_EVENT, id: "pms-evt-3", key: "pms-412-0858", occurredAt: iso("08:58"), context: { ...PMS_EVENT.context, guestHelpRequest: "open" } };
export const FUTURE_PMS: Signal = { ...PMS_EVENT, id: "pms-evt-4", key: "pms-412-1100", occurredAt: iso("11:00") };
export const MALFORMED_TIME_PMS: Signal = { ...PMS_EVENT, id: "pms-evt-5", key: "pms-412-bad", occurredAt: iso("08:59"), context: { ...PMS_EVENT.context, promisedReady: "08:45" } };
export const MISSING_FIELD_MNT: Signal = { ...MAINTENANCE_EVENT, id: "mnt-evt-5", key: "wo-1182-missing", occurredAt: iso("08:59"), context: { room: "412", workOrder: "WO-1182", status: "open", estimatedCompletion: "" } };
export const BAD_STATUS_PMS: Signal = { ...PMS_EVENT, id: "pms-evt-6", key: "pms-412-status", occurredAt: iso("08:59"), context: { ...PMS_EVENT.context, status: "maybe-ready" } };

export interface FreshnessLine { source: SourceKey; label: string; eventAt: string; ageMinutes: number; maxAgeMinutes: number; freshUntil: string; fresh: boolean }
export interface Assessment {
  recognised: boolean;
  /** Why, in a sentence, whichever way it went. */
  reason: string;
  evidence: { source: string; time: string; facts: { label: string; value: string }[]; fresh: boolean }[];
  freshness: FreshnessLine[];
  /** Always stated. A delay does not establish distress. */
  uncertainty: string[];
  /** What would change the outcome, when not recognised. */
  missing: string[];
}

/** Short stable hash of what the recommendation currently rests on, so adoption can tell that the evidence changed. */
function hash32(text: string): string { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); }

export class SignalDesk {
  received: Received[] = [];
  private seen = new Map<string, string>();
  private n = 0;
  /** When the moment was most recently recognised (cleared whenever it stops being recognised). */
  recognisedAt: string | null = null;
  constructor(readonly freshness: Freshness = DEFAULT_FRESHNESS) {}

  ingest(signal: Signal, now: Date): Received {
    const order = ++this.n;
    const done = (outcome: Outcome, reason: string): Received => { const r = { signal, order, outcome, reason }; this.received.push(r); this.track(now); return r; };
    const parsed = EventEnvelopeSchema.safeParse(envelopeOf(signal));
    if (!parsed.success) return done("refused", "Not a valid event.");
    if (classificationRank(parsed.data.classification) > classificationRank("internal")) return done("refused", "More sensitive than this feed may carry.");
    const errs = validateBusiness(signal);
    if (errs.length) return done("refused", `${errs.join("; ")}.`);
    const at = Date.parse(signal.occurredAt);
    if (at > now.getTime() + this.freshness.futureToleranceSeconds * 1000) return done("refused", `Dated in the future (${signal.occurredAt}): nothing is recorded from a time that has not happened.`);
    const body = JSON.stringify([signal.type, signal.occurredAt, signal.context]);
    const prior = this.seen.get(signal.key);
    if (prior !== undefined) return prior === body ? done("duplicate", "Same idempotency key and content: acknowledged, no second effect.") : done("conflict", "Same idempotency key with different content: nothing recorded.");
    this.seen.set(signal.key, body);
    const newest = this.current(signal.source);
    if (newest && at < Date.parse(newest.signal.occurredAt)) return done("superseded", `Older than the current ${SOURCES[signal.source].label} reading: kept on record, changes nothing.`);
    return done("taken-in", signal.source === "maintenance" ? "Valid; an independent source." : "Valid; now the current property reading.");
  }

  /** The reading currently relied on for a source: the taken-in signal with the latest EVENT time, whatever order they arrived in. */
  current(source: SourceKey): Received | null {
    return this.received.filter((r) => r.signal.source === source && r.outcome === "taken-in").sort((a, b) => Date.parse(b.signal.occurredAt) - Date.parse(a.signal.occurredAt))[0] ?? null;
  }

  /** Re-evaluates everything from the readings and `now`. Freshness is recomputed every time: an old reading stops supporting without any new event. */
  assess(now: Date): Assessment {
    const pms = this.current("pms"), mnt = this.current("maintenance");
    const line = (source: SourceKey, r: Received): FreshnessLine => {
      const max = this.freshness.maxAgeMinutes[source];
      const ageMinutes = Math.floor((now.getTime() - Date.parse(r.signal.occurredAt)) / 60000);
      return { source, label: SOURCES[source].label, eventAt: r.signal.occurredAt, ageMinutes, maxAgeMinutes: max, freshUntil: new Date(Date.parse(r.signal.occurredAt) + max * 60000).toISOString(), fresh: now.getTime() - Date.parse(r.signal.occurredAt) <= max * 60000 };
    };
    const fl: FreshnessLine[] = [pms && line("pms", pms), mnt && line("maintenance", mnt)].filter(Boolean) as FreshnessLine[];
    const isFresh = (s: SourceKey) => fl.find((f) => f.source === s)?.fresh ?? false;
    const evidence: Assessment["evidence"] = [];
    const facts = (source: SourceKey, c: Record<string, string>) => Object.entries(c).map(([k, v]) => ({ label: LABEL[k] ?? k, value: display(source, k, v) }));
    if (pms) evidence.push({ source: SOURCES.pms.label, time: pms.signal.occurredAt, facts: facts("pms", pms.signal.context), fresh: isFresh("pms") });
    if (mnt) evidence.push({ source: SOURCES.maintenance.label, time: mnt.signal.occurredAt, facts: facts("maintenance", mnt.signal.context), fresh: isFresh("maintenance") });
    const uncertainty = [
      "Whether the guest wants any help: only the guest can say.",
      "Whether the guest has already been told about the delay.",
      "Whether the guest is distressed. An operational delay does not establish distress, and nothing here infers it.",
      "Whether the repair estimate will hold (one source).",
    ];
    const missing: string[] = [];
    if (!pms) missing.push("A valid property-system reading for the room");
    if (!mnt) missing.push("A valid, independent maintenance reading for the same room");
    for (const f of fl) if (!f.fresh) missing.push(`The ${f.label.toLowerCase()} reading is ${f.ageMinutes} minutes old; the maximum is ${f.maxAgeMinutes}. An old reading supports nothing`);
    if (pms && isFresh("pms")) {
      const { status, promisedReady, guestHelpRequest } = pms.signal.context;
      if (status === "ready") missing.push("The room is reported ready: no delay to act on");
      else if (Date.parse(promisedReady) > now.getTime()) missing.push("The promised ready time has not passed yet");
      if (guestHelpRequest !== "none") missing.push("The guest already has a help request open: it is theirs to lead");
    }
    if (mnt && pms && mnt.signal.context.room !== pms.signal.context.room) missing.push("The maintenance reading is for a different room");
    if (mnt && isFresh("maintenance")) {
      const { status, estimatedCompletion } = mnt.signal.context;
      if (status !== "open" && status !== "in-progress") missing.push("The work order is not open");
      else if (Date.parse(estimatedCompletion) - now.getTime() <= RULE.minimumRepairWaitMinutes * 60_000) missing.push(`The repair is expected within ${RULE.minimumRepairWaitMinutes} minutes: a short wait, not enough to recommend a check-in`);
    }
    const recognised = missing.length === 0;
    return {
      recognised, evidence, freshness: fl, uncertainty, missing: recognised ? [] : missing,
      reason: recognised ? "Two independent, fresh sources agree the room is still unavailable past its promised time, and the repair is not expected to finish soon. A proactive check-in may be appropriate before the guest has to ask." : "Not enough to recommend anything. Nothing is opened and nobody is contacted.",
    };
  }

  /** Keeps `recognisedAt` honest as time and readings change. Called on every ingest and every time the clock moves. */
  track(now: Date) {
    const a = this.assess(now);
    if (a.recognised) { if (this.recognisedAt === null) this.recognisedAt = now.toISOString(); } else this.recognisedAt = null;
  }

  /** What the recommendation rests on right now (readings, not the clock). Adoption compares it with what the person saw. */
  digest(): string {
    return hash32(JSON.stringify([this.current("pms"), this.current("maintenance")].map((r) => r && [r.signal.id, r.signal.key, r.signal.occurredAt, r.signal.context])));
  }

  /** The permitted facts of the opening event, in the request's own fields. The guest has not asked, and the request says so. */
  openingContext(): Record<string, string> {
    return {
      who: "Alex (fictional guest)",
      ask: "Nothing yet: the hotel is offering a check-in because the room is delayed",
      preferences: "Not yet asked: the guest decides whether help is wanted",
      contact: "Message to the guest app (fictional)",
    };
  }
  sources(now: Date) { return [this.current("pms"), this.current("maintenance")].filter(Boolean).map((r) => ({ id: r!.signal.id, key: r!.signal.key, source: r!.signal.source, label: SOURCES[r!.signal.source].label, occurredAt: r!.signal.occurredAt, ageMinutes: Math.floor((now.getTime() - Date.parse(r!.signal.occurredAt)) / 60000), maxAgeMinutes: this.freshness.maxAgeMinutes[r!.signal.source] })); }
  sourceRefs(): string[] { return [this.current("pms"), this.current("maintenance")].filter(Boolean).map((r) => r!.signal.id); }
}

const LABEL: Record<string, string> = { room: "Room", status: "Status", promisedReady: "Promised ready", guestArrived: "Guest arrived", guestHelpRequest: "Help request from guest", workOrder: "Work order", estimatedCompletion: "Estimated completion" };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2 Nov 08:50 UTC": always with the date, so a change of day is never hidden. */
export function fullTime(iso: string | number): string { const d = new Date(iso); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`; }

/** A field's value for people: codes become words, timestamps become dates with times. */
export function display(source: SourceKey, key: string, value: string): string {
  if (TIME_FIELDS[source].includes(key) && parseFullTime(value) !== null) return fullTime(value);
  if (key === "status") return (source === "pms" ? PMS_STATUS : WORK_STATUS)[value] ?? value;
  if (key === "guestHelpRequest") return HELP_REQUEST[value] ?? value;
  if (key === "room") return `Room ${value} (fictional)`;
  return value;
}
