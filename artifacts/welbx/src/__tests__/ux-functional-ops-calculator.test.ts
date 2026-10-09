import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT, type TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { summariseDeployment, summariseScenarioConfiguration } from "@/lib/deploymentOperation";
import {
  approveDecision, canTransition, captureEvidence, createExecution, transitionExecution, type ScenarioExecution,
} from "@/lib/runtimeEngine";
import { calculateTravelValue, DEFAULT_VALUE_ASSUMPTIONS, getValueTierIssues, type TravelValueAssumptions } from "@/lib/travelValueModel";

const active = (config: TravelDeploymentConfig = DEFAULT_DEPLOYMENT): TravelDeploymentConfig =>
  ({ ...structuredClone(config), deploymentStatus: "active-simulation", activatedAt: "2026-10-09T09:00:00.000Z" });

const scenarioFor = (id: string) => TRAVEL_SCENARIOS.find(s => s.id === id)!;
const playbookFor = (id: string) => TRAVEL_PLAYBOOKS.find(p => p.id === scenarioFor(id).playbookId)!;
const run = (deployment: TravelDeploymentConfig, id: string) =>
  createExecution({ deployment, scenario: scenarioFor(id), playbook: playbookFor(id) });

/** Drive an execution to "resolved" through the engine's own gates, with every required item recorded except `skip`. */
function resolveWithEvidence(exec: ScenarioExecution, id: string, skip?: string): ScenarioExecution {
  const scenario = scenarioFor(id);
  let next = transitionExecution(exec, "understanding", scenario)!;
  next = transitionExecution(next, "decision-required", scenario)!;
  next = transitionExecution(next, "approval-required", scenario)!;
  next = approveDecision(next, next.approvalRoleId, scenario);
  next = transitionExecution(next, "resolved", scenario)!;
  for (const ev of next.evidence) if (ev.required && ev.evidenceType !== skip) next = captureEvidence(next, ev.id, { capturedByRole: "operator" });
  return next;
}

describe("Deployment-aware Operations Centre summary", () => {
  it("reflects the activated deployment's name, category, roles and enabled scenarios", () => {
    const summary = summariseDeployment(active());
    expect(summary.name).toBe("Harbour Hotel Melbourne — Pilot Environment");
    expect(summary.category).toBe("Hotel · Owner-operated");
    expect(summary.roles).toContain("Duty Manager");
    expect(summary.roles).toHaveLength(DEFAULT_DEPLOYMENT.roles.filter(r => r.active).length);
    expect(summary.scenarios.map(s => s.scenarioId)).toEqual(["repeat-guest-room-not-ready", "service-backlog", "maintenance-defect"]);
    expect(summary.notRunning.map(s => s.reason)).toEqual(Array(3).fill("Switched off in this configuration"));
  });

  it("follows edits: a renamed deployment, local role titles and a different accountable owner", () => {
    const config = active();
    config.deploymentName = "Bayside Resort — Pilot";
    config.propertyType = "Resort";
    config.roles = config.roles.map(r => r.roleId === "maintenance-lead" ? { ...r, localTitle: "Chief Engineer" } : r);
    const summary = summariseDeployment(config);
    expect(summary.name).toBe("Bayside Resort — Pilot");
    expect(summary.category).toBe("Resort · Owner-operated");
    expect(summary.roles).toContain("Chief Engineer");
    expect(summary.scenarios.find(s => s.scenarioId === "maintenance-defect")!.owner).toBe("Chief Engineer");
  });

  it("summarises nothing for a deployment that has not been activated", () => {
    expect(summariseDeployment(structuredClone(DEFAULT_DEPLOYMENT)).scenarios).toEqual([]);
  });

  it("reports exactly the settings the engine runs with", () => {
    const deployment = active();
    for (const id of ["repeat-guest-room-not-ready", "service-backlog", "maintenance-defect"]) {
      const exec = run(deployment, id);
      const summary = summariseScenarioConfiguration(deployment, id)!;
      expect(summary.approvalGate).toBe(exec.approvalRequired);
      expect(summary.requiredEvidence).toEqual(exec.evidence.filter(e => e.required).map(e => e.evidenceType));
      expect(summary.draftsNeedingApproval).toEqual(exec.communications.filter(c => c.approvalRequired).map(c => c.purpose));
    }
  });
});

describe("A configuration change reaches execution and closure", () => {
  const ROOM = "repeat-guest-room-not-ready";
  const ESCALATION_RECORD = "Escalation notification record";

  it("making an optional evidence item required adds it to the closure gate", () => {
    const before = active();
    const after = active();
    after.evidence = after.evidence.map(e => e.id === "ev-09" ? { ...e, required: true } : e);

    expect(summariseScenarioConfiguration(before, ROOM)!.requiredEvidence).not.toContain(ESCALATION_RECORD);
    expect(summariseScenarioConfiguration(after, ROOM)!.requiredEvidence).toContain(ESCALATION_RECORD);

    const resolvedBefore = resolveWithEvidence(run(before, ROOM), ROOM);
    expect(canTransition(resolvedBefore, "closed", scenarioFor(ROOM)).allowed).toBe(true);

    const resolvedAfter = resolveWithEvidence(run(after, ROOM), ROOM, ESCALATION_RECORD);
    const blocked = canTransition(resolvedAfter, "closed", scenarioFor(ROOM));
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toContain(ESCALATION_RECORD);

    const item = resolvedAfter.evidence.find(e => e.evidenceType === ESCALATION_RECORD)!;
    expect(canTransition(captureEvidence(resolvedAfter, item.id, { capturedByRole: "operator" }), "closed", scenarioFor(ROOM)).allowed).toBe(true);
  });

  it("changing the accountable owner does not move the scenario's approval authority", () => {
    const config = active();
    config.scenarios = config.scenarios.map(s => s.scenarioId === "service-backlog" ? { ...s, accountableRoleId: "duty-manager" } : s);
    const summary = summariseScenarioConfiguration(config, "service-backlog")!;
    expect(summary.owner).toBe("Duty Manager");
    expect(summary.decider).toBe("Operations Manager");

    const scenario = scenarioFor("service-backlog");
    let exec = run(config, "service-backlog");
    exec = transitionExecution(exec, "understanding", scenario)!;
    exec = transitionExecution(exec, "decision-required", scenario)!;
    exec = transitionExecution(exec, "approval-required", scenario)!;
    expect(() => approveDecision(exec, "duty-manager", scenario)).toThrow();
    expect(approveDecision(exec, "operations-manager", scenario).decisions.at(-1)?.decision).toBe("approved");
  });
});

describe("Calculator value tiers", () => {
  const withTiers = (kind: string, value: { low: number; base: number; high: number }): TravelValueAssumptions => ({
    ...structuredClone(DEFAULT_VALUE_ASSUMPTIONS),
    moments: DEFAULT_VALUE_ASSUMPTIONS.moments.map(m => m.kind === kind ? { ...m, value } : m),
  });

  it("accepts the defaults and equal tiers", () => {
    expect(getValueTierIssues(DEFAULT_VALUE_ASSUMPTIONS)).toEqual([]);
    expect(getValueTierIssues(withTiers("opportunity", { low: 40, base: 40, high: 40 }))).toEqual([]);
  });

  it("names the tiers that are out of order with their entered values, without changing them", () => {
    const entered = withTiers("opportunity", { low: 900, base: 40, high: 80 });
    expect(getValueTierIssues(entered)).toEqual([{
      kind: "opportunity", label: "Service opportunities", tiers: ["low", "base"],
      message: "Low ($900) is higher than Base ($40). Enter values so Low ≤ Base ≤ High.",
    }]);
    expect(entered.moments.find(m => m.kind === "opportunity")!.value).toEqual({ low: 900, base: 40, high: 80 });

    expect(getValueTierIssues(withTiers("recovery", { low: 30, base: 200, high: 160 }))[0].message)
      .toBe("Base ($200) is higher than High ($160). Enter values so Low ≤ Base ≤ High.");
    expect(getValueTierIssues(withTiers("prevention", { low: 95, base: 90, high: 10 }))[0].tiers).toEqual(["low", "base", "high"]);
  });

  it("still refuses to calculate an unordered range", () => {
    expect(() => calculateTravelValue(withTiers("opportunity", { low: 900, base: 40, high: 80 }))).toThrow();
  });
});
