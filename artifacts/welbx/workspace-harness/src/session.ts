// The session adapter. Every transition, refusal and projection comes from the actual Core kernel (orchestrateMoment,
// applyCommand and the kernel's own views). This file holds NO lifecycle rule: it keeps the kernel's state, supplies
// synthetic facts (a clock and unit capacity), and hands commands to Core.
import {
  applyCommand, deriveAssuranceState, loadConfiguration, orchestrateMoment, ownerOf,
  type Actor, type AssuranceState, type Command, type CoordinationState, type DeploymentConfiguration, type EvidenceRecord, type Facts,
  type MomentReport, type TransitionResult,
} from "@workspace/jaldo-orchestration";
import { TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION } from "@workspace/jaldo-orchestration/deployments";

export const SCOPE = { organisationId: "org-demo", deploymentId: "dep-demo" };
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

export class Session {
  readonly config: DeploymentConfiguration = loadConfiguration(TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION);
  state!: CoordinationState;
  evidence: EvidenceRecord[] = [];
  report!: MomentReport;
  clock = new Date("2026-11-02T09:00:00.000Z");
  readonly unavailable = new Set<string>();
  private n = 0;

  constructor() { this.reset(); }

  facts(): Facts { return { now: this.clock, unavailable: this.unavailable, eligibleHolders: ["member-a", "member-b"] }; }

  /** Starts again from the guest's request. Everything after this is the kernel's. */
  reset() {
    this.clock = new Date("2026-11-02T09:00:00.000Z");
    this.unavailable.clear();
    this.evidence = [];
    const def = this.config.events.find((e) => e.effect === "open-request")!;
    const event = {
      schema: "jaldo.event", id: "evt-request", idempotencyKey: "req-1", type: def.type, occurredAt: this.clock.toISOString(), scope: SCOPE,
      source: { system: "review-workspace" }, provenance: { method: "party-channel" }, purpose: def.purpose, classification: def.maxClassification,
      context: { who: "Alex (fictional guest)", ask: "A quiet place to wait, and some practical help", preferences: "Somewhere calm, water, help with luggage", contact: "Message to the guest app (fictional)" },
    };
    const r = orchestrateMoment(this.config, null, { kind: "event", event, actor: roleOf("guest").actor, routing: { destination: "member-a" } }, this.facts(), this.cycle());
    if (!r.ok) throw new Error(r.message);
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
  }

  private cycle = () => `cycle-${++this.n}`;

  /** Hands one command to Core, as the selected demo role's actor. Automation configured in Core runs as Core decides. */
  apply(roleId: DemoRoleId, command: Command): ApplyResult {
    const r = orchestrateMoment(this.config, this.state, { kind: "command", envelope: { id: `cmd-${++this.n}`, command }, actor: roleOf(roleId).actor }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  /** A dry run: asks Core whether it would accept this command from this role, without changing anything. */
  ask(roleId: DemoRoleId, command: Command): TransitionResult {
    return applyCommand(this.config, this.state, { id: `ask-${++this.n}`, command }, roleOf(roleId).actor, this.facts());
  }

  /** A synthetic capacity fact for a unit, applied through Core's own event path. */
  setCapacity(party: string, unavailable: boolean): ApplyResult {
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
    const r = orchestrateMoment(this.config, this.state, { kind: "tick" }, this.facts(), this.cycle());
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    this.state = r.state; this.evidence.push(...r.evidence); this.report = r.report;
    return { ok: true, evidence: r.evidence, automated: r.report.automated };
  }

  assurance(): AssuranceState { return deriveAssuranceState(this.config, this.state, this.evidence, this.facts()); }
  holder(): string | null { return ownerOf(this.state); }
}
