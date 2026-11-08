// The session adapter. Every transition, refusal and projection comes from the actual Core kernel (orchestrateMoment,
// applyCommand and the kernel's own views). This file holds NO lifecycle rule: it keeps the kernel's state, supplies
// synthetic facts (a clock and unit capacity), and hands commands to Core.
import {
  admitEvent, applyCommand, deriveAssuranceState, orchestrateMoment, ownerOf,
  type Actor, type AssuranceState, type Command, type CoordinationState, type DeploymentConfiguration, type EvidenceRecord, type Facts,
  type MomentReport, type TransitionResult,
} from "@workspace/jaldo-orchestration";
import { PROACTIVE_EVENT_TYPE, loadDerived } from "./config";
import { CONFLICTING_PMS, GUEST_ALREADY_ASKED, MAINTENANCE_EVENT, PMS_EVENT, SHORT_REPAIR, STALE_PMS, SignalDesk, type Signal } from "./signals";

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

export type ApplyResult = { ok: true; evidence: EvidenceRecord[]; automated: string[] } | { ok: false; code: string; message: string };

/** Where the response begins: the guest asks (the original path), or system signals are recognised first (the proactive scenario). */
export type Origin = "guest" | "signals";

export class Session {
  readonly config: DeploymentConfiguration = loadDerived();
  origin: Origin;
  desk = new SignalDesk();
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
    this.desk = new SignalDesk();
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
  }

  /** Reviewer controls for the signal checks. They change only the desk, and only before a request exists. */
  signalAction(kind: string): { ok: boolean; text: string } {
    if (this.opened) return { ok: false, text: "A request is already open. Start again to change the signals." };
    const say = (r: { outcome: string; reason: string }) => ({ ok: true, text: `Signal handled: ${r.outcome}. ${r.reason}` });
    const fresh = (...list: Signal[]) => { this.desk = new SignalDesk(); for (const g of list) this.desk.ingest(g, this.clock); };
    switch (kind) {
      case "duplicate": return say(this.receiveSignal(PMS_EVENT));
      case "conflict": return say(this.receiveSignal(CONFLICTING_PMS));
      case "stale": return say(this.receiveSignal(STALE_PMS));
      case "asked": return say(this.receiveSignal(GUEST_ALREADY_ASKED));
      case "maintenance": return say(this.receiveSignal(MAINTENANCE_EVENT));
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
   * The Duty lead adopts a recognised moment. Core's configured system actor (the configuration's `prepare-plan` automation lets it
   * prepare) records ONE opening event. Core admits it, opens a request addressed to the Duty lead, and nothing is approved, shared
   * or released: the Duty lead still has to accept responsibility, and the guest still has to choose.
   */
  adopt(roleId: DemoRoleId): ApplyResult {
    if (this.opened) return { ok: false, code: "invalid_state", message: "A request is already open." };
    if (roleOf(roleId).kind !== "holder") return { ok: false, code: "not_permitted", message: "Only the Duty lead decides whether to open a proactive check-in." };
    const a = this.desk.assess(this.clock);
    if (!a.recognised) return { ok: false, code: "event_not_permitted", message: `Nothing to adopt: ${a.missing.join("; ")}.` };
    const def = this.config.events.find((e) => e.type === PROACTIVE_EVENT_TYPE)!;
    const event = {
      schema: "jaldo.event", id: "evt-proactive", idempotencyKey: "proactive-412", type: def.type, occurredAt: this.clock.toISOString(), scope: SCOPE,
      source: { system: "signal-desk-fictional", reference: this.desk.sourceRefs().join("+") }, provenance: { method: "integration" }, purpose: def.purpose, classification: def.maxClassification,
      context: this.desk.openingContext(),
    };
    const r = orchestrateMoment(this.config, null, { kind: "event", event, actor: { kind: "system", scope: SCOPE }, routing: { destination: "member-a" } }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report; this.opened = true; this.adoptedAt = this.clock.toISOString();
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  private cycle = () => `cycle-${++this.n}`;

  /** Hands one command to Core, as the selected demo role's actor. Automation configured in Core runs as Core decides. */
  apply(roleId: DemoRoleId, command: Command): ApplyResult {
    if (!this.opened) return { ok: false, code: "not_found", message: "No request exists yet: the signals have not been adopted." };
    const r = orchestrateMoment(this.config, this.state, { kind: "command", envelope: { id: `cmd-${++this.n}`, command }, actor: roleOf(roleId).actor }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  /** A dry run: asks Core whether it would accept this command from this role, without changing anything. */
  ask(roleId: DemoRoleId, command: Command): TransitionResult {
    if (!this.opened) return { ok: false, code: "not_found", message: "No request exists yet." } as TransitionResult;
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
    if (!this.opened) return { ok: true, evidence: [], automated: [] };
    const r = orchestrateMoment(this.config, this.state, { kind: "tick" }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  assurance(): AssuranceState { return deriveAssuranceState(this.config, this.state, this.evidence, this.facts()); }
  holder(): string | null { return ownerOf(this.state); }
}
