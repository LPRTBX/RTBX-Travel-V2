// The session adapter. Every transition, refusal and projection comes from the actual Core kernel (orchestrateMoment,
// applyCommand and the kernel's own views). This file holds NO lifecycle rule: it keeps the kernel's state, supplies
// synthetic facts (a clock and unit capacity), and hands commands to Core.
import {
  admitEvent, applyCommand, deriveAssuranceState, orchestrateMoment, ownerOf,
  type Actor, type AssuranceState, type Command, type CoordinationState, type DeploymentConfiguration, type EvidenceRecord, type Facts,
  type MomentReport, type TransitionResult,
} from "@workspace/jaldo-orchestration";
import { PROACTIVE_EVENT_TYPE, loadDerived } from "./config";
import { BAD_STATUS_PMS, CONFLICTING_PMS, DEFAULT_FRESHNESS, FUTURE_PMS, GUEST_ALREADY_ASKED, MAINTENANCE_EVENT, MALFORMED_TIME_PMS, MISSING_FIELD_MNT, PMS_EVENT, RULE, SHORT_REPAIR, STALE_PMS, SignalDesk, type Freshness, type Signal } from "./signals";

export { SCOPE } from "./session-scope";
import { SCOPE } from "./session-scope";
const grant = (responsibility: string) => ({ responsibility, grantedAt: "2026-11-01T00:00:00.000Z", expiresAt: null, revokedAt: null });
const member = (id: string, responsibility: string, onBehalfOf?: string): Actor => ({ kind: "member", id, coreRole: "operator", scope: SCOPE, grants: [grant(responsibility)], ...(onBehalfOf ? { onBehalfOf } : {}) });

/** Demonstration roles only. Each is an Actor value handed to the kernel. This is not authentication or access control. */
export type DemoRoleId = "duty-lead" | "guest" | "reception" | "housekeeping" | "guest-services" | "maintenance";
export interface DemoRole { id: DemoRoleId; label: string; kind: "holder" | "subject" | "unit" | "linked"; party: string | null; actor: Actor }
export const DEMO_ROLES: DemoRole[] = [
  { id: "duty-lead", label: "Duty lead", kind: "holder", party: null, actor: member("member-a", "duty-lead") },
  { id: "guest", label: "Guest", kind: "subject", party: "guest", actor: { kind: "party", key: "guest", scope: SCOPE } },
  { id: "reception", label: "Reception", kind: "unit", party: "reception", actor: member("member-b", "unit-liaison", "reception") },
  { id: "housekeeping", label: "Housekeeping", kind: "unit", party: "housekeeping", actor: member("member-b", "unit-liaison", "housekeeping") },
  { id: "guest-services", label: "Guest services", kind: "unit", party: "guest-services", actor: member("member-b", "unit-liaison", "guest-services") },
  { id: "maintenance", label: "Maintenance", kind: "linked", party: "maintenance", actor: member("member-b", "unit-liaison", "maintenance") },
];
export const roleOf = (id: DemoRoleId) => DEMO_ROLES.find((r) => r.id === id)!;
/** Display names for member ids in attributions. */
export const MEMBER_NAMES: Record<string, string> = { "member-a": "the duty lead", "member-b": "a unit liaison" };

/**
 * The Duty lead's decision to open a proactive check-in, with its reason, sources and rule version. This is a DEMONSTRATION decision
 * record held by this adapter. Core does not have an adoption contract: its own evidence holds the opening event (id, sequence,
 * idempotency key) but has no field for who decided, why, on what sources, or under which interpretation-rule version.
 */
export interface AdoptionRecord {
  kind: "demonstration-decision-record";
  id: string;
  decidedBy: { role: DemoRoleId; label: string; actorId: string; note: string };
  decidedAt: string;
  reason: string;
  rule: { id: string; version: string };
  sources: { id: string; key: string; source: string; label: string; occurredAt: string; ageMinutes: number; maxAgeMinutes: number }[];
  evidenceDigest: string;
  recognisedAt: string | null;
  /** The link to Core's own record: the opening event and the evidence it produced. */
  core: { eventId: string; idempotencyKey: string; evidenceSequence: number | null };
}

/** The guest's answer to "Would you like practical help?". Kept apart from every sharing decision. Held by this adapter, not Core. */
export type HelpStatus = "unanswered" | "yes" | "no";
export interface HelpAnswer { status: HelpStatus; at: string; /** True when something had already been released to a recipient when the answer was given. */ afterDisclosure: boolean }

export type ApplyResult = { ok: true; evidence: EvidenceRecord[]; automated: string[] } | { ok: false; code: string; message: string };

/** Where the response begins: the guest asks (the original path), or system signals are recognised first (the proactive scenario). */
export type Origin = "guest" | "signals";

export class Session {
  readonly config: DeploymentConfiguration = loadDerived();
  origin: Origin;
  desk = new SignalDesk();
  freshness: Freshness = DEFAULT_FRESHNESS;
  adoptions: AdoptionRecord[] = [];
  /** What the guest answered about help, newest last. Empty means no response, which is not a "no". */
  helpHistory: HelpAnswer[] = [];
  offeredAt: string | null = null;
  /** True once a request exists in Core. Before that there is NO coordination: only signals the desk holds. */
  opened = false;
  adoptedAt: string | null = null;
  private st: CoordinationState | null = null;
  get state(): CoordinationState { if (!this.st) throw new Error("No coordination exists yet: the signals have not been adopted."); return this.st; }
  set state(v: CoordinationState) { this.st = v; }
  evidence: EvidenceRecord[] = [];
  report!: MomentReport;
  clock = new Date("2026-11-02T09:00:00.000Z");
  readonly unavailable = new Set<string>();
  private n = 0;

  constructor(origin: Origin = "guest") { this.origin = origin; this.reset(); }

  facts(): Facts { return { now: this.clock, unavailable: this.unavailable, eligibleHolders: ["member-a", "member-b"] }; }

  /** Starts again from the guest's request. Everything after this is the kernel's. */
  reset() {
    this.clock = new Date("2026-11-02T09:00:00.000Z");
    this.unavailable.clear();
    this.evidence = [];
    this.st = null; this.opened = false; this.adoptedAt = null;
    this.desk = new SignalDesk(this.freshness);
    this.adoptions = []; this.helpHistory = []; this.offeredAt = null;
    if (this.origin === "signals") { this.desk.ingest(PMS_EVENT, this.clock); this.desk.ingest(MAINTENANCE_EVENT, this.clock); return; }
    const def = this.config.events.find((e) => e.effect === "open-request")!;
    const event = {
      schema: "jaldo.event", id: "evt-request", idempotencyKey: "req-1", type: def.type, occurredAt: this.clock.toISOString(), scope: SCOPE,
      source: { system: "review-workspace" }, provenance: { method: "party-channel" }, purpose: def.purpose, classification: def.maxClassification,
      context: { who: "Alex (fictional guest)", ask: "A quiet place to wait, and some practical help", preferences: "Somewhere calm, water, help with luggage", contact: "Message to the guest app (fictional)" },
    };
    const r = orchestrateMoment(this.config, null, { kind: "event", event, actor: roleOf("guest").actor, routing: { destination: "member-a" } }, this.facts(), this.cycle());
    if (!r.ok) throw new Error(r.message);
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report; this.opened = true;
    this.helpHistory = [{ status: "yes", at: this.clock.toISOString(), afterDisclosure: false }]; // the guest asked directly: that is a request for help
  }

  /** Reviewer controls for the signal checks. They change only the desk, and only before a request exists. */
  signalAction(kind: string): { ok: boolean; text: string } {
    if (this.opened) return { ok: false, text: "A request is already open. Start again to change the signals." };
    const say = (r: { outcome: string; reason: string }) => ({ ok: true, text: `Signal handled: ${r.outcome}. ${r.reason}` });
    const fresh = (...list: Signal[]) => { this.desk = new SignalDesk(this.freshness); for (const g of list) this.desk.ingest(g, this.clock); };
    switch (kind) {
      case "duplicate": return say(this.receiveSignal(PMS_EVENT));
      case "conflict": return say(this.receiveSignal(CONFLICTING_PMS));
      case "stale": return say(this.receiveSignal(STALE_PMS));
      case "asked": return say(this.receiveSignal(GUEST_ALREADY_ASKED));
      case "maintenance": return say(this.receiveSignal(MAINTENANCE_EVENT));
      case "future": return say(this.receiveSignal(FUTURE_PMS));
      case "malformed": return say(this.receiveSignal(MALFORMED_TIME_PMS));
      case "missing": return say(this.receiveSignal(MISSING_FIELD_MNT));
      case "bad-status": return say(this.receiveSignal(BAD_STATUS_PMS));
      case "out-of-order": fresh(MAINTENANCE_EVENT, PMS_EVENT); return { ok: true, text: "Signals restarted: the maintenance event arrived first, then the property system's. Both are read in event-time order." };
      case "pms-only": fresh(PMS_EVENT); return { ok: true, text: "Signals restarted with only the property system's event. One source is not enough to recommend anything." };
      case "short-repair": fresh(PMS_EVENT, SHORT_REPAIR); return { ok: true, text: "Signals restarted: the repair is expected within the hour." };
      default: fresh(PMS_EVENT, MAINTENANCE_EVENT); return { ok: true, text: "Signals restarted with both events." };
    }
  }

  /** What Core itself says when asked to admit the maintenance event type (shown, not assumed). */
  coreRefusesMaintenance(): string {
    const r = admitEvent(this.config, { schema: "jaldo.event", id: "probe-mnt", idempotencyKey: "probe-mnt", type: MAINTENANCE_EVENT.type, occurredAt: MAINTENANCE_EVENT.occurredAt, scope: SCOPE, source: { system: "maintenance-fictional" }, provenance: { method: "integration" }, purpose: "room-readiness", classification: "internal", context: MAINTENANCE_EVENT.context });
    return r.ok ? "Core admitted it." : `${r.code}: ${r.message}`;
  }

  /** A signal reaches the desk. Before adoption only the desk changes; Core is not involved. */
  receiveSignal(signal: Signal) { return this.desk.ingest(signal, this.clock); }

  /**
   * The Duty lead adopts a recognised moment. Freshness and the evidence are re-evaluated HERE, immediately before adoption, and the
   * evidence must be what the person saw. A reason is required and recorded. Core's configured system actor (the configuration's
   * `prepare-plan` automation lets it prepare) then records ONE opening event; Core admits it and opens a request addressed to the
   * Duty lead. Nothing is approved, shared or released: the Duty lead still has to accept responsibility, and the guest still has to
   * say whether help is wanted and what may be shared.
   */
  adopt(roleId: DemoRoleId, input: { reason?: string; expectedDigest?: string } = {}): ApplyResult {
    if (this.opened) return { ok: false, code: "invalid_state", message: "A request is already open. A second adoption is refused and records nothing." };
    if (roleOf(roleId).kind !== "holder") return { ok: false, code: "not_permitted", message: "Only the Duty lead decides whether to open a proactive check-in." };
    const reason = (input.reason ?? "").trim();
    if (reason.length < 8) return { ok: false, code: "reason_required", message: "Say why you are opening it (at least a short sentence). The reason is recorded with your decision." };
    this.desk.track(this.clock);
    const a = this.desk.assess(this.clock);
    if (!a.recognised) return { ok: false, code: "event_not_permitted", message: `Nothing to adopt now: ${a.missing.join("; ")}.` };
    if (input.expectedDigest !== undefined && input.expectedDigest !== this.desk.digest()) return { ok: false, code: "evidence_changed", message: "The evidence changed after you looked at it. Review the recommendation again before deciding." };
    const def = this.config.events.find((e) => e.type === PROACTIVE_EVENT_TYPE)!;
    const id = `adopt-${this.adoptions.length + 1}`;
    const event = {
      schema: "jaldo.event", id: `evt-${id}`, idempotencyKey: `proactive-${id}`, type: def.type, occurredAt: this.clock.toISOString(), scope: SCOPE,
      source: { system: "signal-desk-fictional", reference: this.desk.sourceRefs().join("+") }, provenance: { method: "integration" }, purpose: def.purpose, classification: def.maxClassification,
      context: this.desk.openingContext(),
    };
    const r = orchestrateMoment(this.config, null, { kind: "event", event, actor: { kind: "system", scope: SCOPE }, routing: { destination: "member-a" } }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report; this.opened = true; this.adoptedAt = this.clock.toISOString();
    this.adoptions.push({
      kind: "demonstration-decision-record", id, decidedBy: { role: roleId, label: roleOf(roleId).label, actorId: "member-a", note: "A demo role, not an authenticated identity" }, decidedAt: this.adoptedAt, reason,
      rule: { id: RULE.id, version: RULE.version }, sources: this.desk.sources(this.clock), evidenceDigest: this.desk.digest(), recognisedAt: this.desk.recognisedAt,
      core: { eventId: event.id, idempotencyKey: event.idempotencyKey, evidenceSequence: r.evidence.find((e) => e.kind === "request.opened")?.sequence ?? null },
    });
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  /** True once the Duty lead has accepted responsibility, when the offer of help reaches the guest. Always false from a guest's own request. */
  get helpOffered(): boolean { return this.opened && this.origin === "signals" && ownerOf(this.state) !== null; }
  get help(): HelpStatus { return this.origin === "guest" ? "yes" : (this.helpHistory.at(-1)?.status ?? "unanswered"); }
  /** Whether the guest's sharing choices are open: only after they have said yes to help. Agreement to share never stands in for this. */
  get sharingOpen(): boolean { return this.help === "yes"; }

  /** True once any disclosure has been recorded by Core. Read from Core's evidence, never decided here. */
  get disclosed(): boolean { return this.evidence.some((e) => e.kind === "disclosure.made"); }

  /**
   * The guest answers "Would you like practical help?", or later says they do not want further help. This is NOT a Core command:
   * Core has no contract for accepting or declining help, or for stopping released work. Recording the answer adds nothing to Core's
   * evidence and changes nothing in Core: it does not cancel dispatched work, recall information or withdraw any permission. Those
   * stay separate (refusing or taking back a sharing approval, where Core permits it, is a Core command and is never gated).
   */
  chooseHelp(choice: "yes" | "no"): ApplyResult {
    if (!this.helpOffered) return { ok: false, code: "invalid_state", message: "No offer of help has reached the guest yet." };
    if (this.help === choice) return { ok: true, evidence: [], automated: [] };
    this.helpHistory.push({ status: choice, at: this.clock.toISOString(), afterDisclosure: this.disclosed });
    return { ok: true, evidence: [], automated: [] };
  }
  /**
   * The demonstration gate in front of NEW sharing approval only (not a Core rule): no approval before the guest says yes to help.
   * Refusing and taking back an approval are never gated; whether they are allowed is Core's decision alone.
   */
  private gate(roleId: DemoRoleId, command: Command): { code: string; message: string } | null {
    if (this.origin !== "signals" || roleOf(roleId).kind !== "subject" || this.sharingOpen) return null;
    if (command.type !== "approve") return null;
    return { code: "help_not_accepted", message: `Demonstration gate, not Core: no new sharing approval is open because the guest has ${this.help === "no" ? "not accepted help (they declined it)" : "not yet said whether help is wanted"}. Declining or taking back sharing stays available wherever Core permits it. Agreeing to share is never taken as accepting help.` };
  }

  private cycle = () => `cycle-${++this.n}`;

  /** Hands one command to Core, as the selected demo role's actor. Automation configured in Core runs as Core decides. */
  apply(roleId: DemoRoleId, command: Command): ApplyResult {
    if (!this.opened) return { ok: false, code: "not_found", message: "No request exists yet: the signals have not been adopted." };
    const gated = this.gate(roleId, command); if (gated) return { ok: false, ...gated };
    const r = orchestrateMoment(this.config, this.state, { kind: "command", envelope: { id: `cmd-${++this.n}`, command }, actor: roleOf(roleId).actor }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    if (this.helpOffered && this.offeredAt === null) this.offeredAt = this.clock.toISOString();
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  /** A dry run: asks Core whether it would accept this command from this role, without changing anything. */
  ask(roleId: DemoRoleId, command: Command): TransitionResult {
    if (!this.opened) return { ok: false, code: "not_found", message: "No request exists yet." } as TransitionResult;
    const gated = this.gate(roleId, command); if (gated) return { ok: false, ...gated } as TransitionResult;
    return applyCommand(this.config, this.state, { id: `ask-${++this.n}`, command }, roleOf(roleId).actor, this.facts());
  }

  /** A synthetic capacity fact for a unit, applied through Core's own event path. */
  setCapacity(party: string, unavailable: boolean): ApplyResult {
    if (!this.opened) return { ok: false, code: "not_found", message: "No request exists yet: capacity matters once there is work to depend on it." };
    if (unavailable) this.unavailable.add(party); else this.unavailable.delete(party);
    const def = this.config.events.find((e) => e.effect === "capacity-change")!;
    const event = { schema: "jaldo.event", id: `cap-${++this.n}`, idempotencyKey: `cap-${this.n}`, type: def.type, occurredAt: this.clock.toISOString(), scope: SCOPE, source: { system: "review-workspace" }, provenance: { method: "member-recorded" }, purpose: def.purpose, classification: "internal", context: { party, status: unavailable ? "unavailable" : "available" } };
    const r = orchestrateMoment(this.config, this.state, { kind: "event", event, actor: member("member-b", "unit-liaison") }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  /** Moves the synthetic clock and asks Core to evaluate. Nothing here schedules anything: Core evaluates when asked. */
  advance(minutes: number): ApplyResult {
    this.clock = new Date(this.clock.getTime() + minutes * 60_000);
    this.desk.track(this.clock);
    if (!this.opened) return { ok: true, evidence: [], automated: [] };
    const r = orchestrateMoment(this.config, this.state, { kind: "tick" }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  assurance(): AssuranceState { return deriveAssuranceState(this.config, this.state, this.evidence, this.facts()); }
  holder(): string | null { return ownerOf(this.state); }
}
