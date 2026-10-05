/**
 * Operating-loop guarantees: signal → interpretation → authorised decision → action
 * → evidence → outcome → learning → next action. Synthetic engine checks only.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT } from "@/data/travelDeploymentConfig";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import {
  createExecution, transitionExecution, approveDecision, returnDecision, triggerEscalation,
  acknowledgeEscalation, captureEvidence, recordOutcome, sendCommunication, generateLearning,
  getScenarioRuntimeRequirements, type ScenarioExecution,
} from "@/lib/runtimeEngine";
import { simulateHotelCase, proposeHotelLearning, reviewHotelLearning, mergeApprovedHotelPolicy,
  runHotelLearningCycle, BASELINE_POLICY, hotelFaultForSignal } from "@/simulation/hotelLearning";
import { createHotelSignals } from "@/simulation/mockHotel";

const scenarioById = (id: string) => TRAVEL_SCENARIOS.find(s => s.id === id)!;
function start(id: string): ScenarioExecution {
  const scenario = scenarioById(id);
  const deployment = structuredClone(DEFAULT_DEPLOYMENT);
  for (const s of deployment.scenarios) if (s.scenarioId === id) s.active = true;
  return createExecution({ deployment, scenario, playbook: TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)! });
}
const toGate = (exec: ScenarioExecution, id: string) => {
  const scenario = scenarioById(id);
  let e = transitionExecution(exec, "understanding", scenario)!;
  e = transitionExecution(e, "decision-required", scenario)!;
  return transitionExecution(e, exec.approvalRequired ? "approval-required" : "in-action", scenario)!;
};

describe("Scenario-scoped runtime requirements", () => {
  it("welfare cases receive only restricted, human-authored communications — never a guest recovery offer", () => {
    const exec = start("distressed-guest");
    expect(exec.communications.length).toBeGreaterThan(0);
    expect(exec.communications.some(c => c.isGuestFacing)).toBe(false);
    expect(exec.communications.map(c => c.purpose)).not.toContain("Recovery Offer");
    expect(exec.evidence.map(e => e.evidenceType)).toContain("Post-incident review record");
  });

  it("non-welfare cases never receive restricted welfare communications", () => {
    for (const s of TRAVEL_SCENARIOS.filter(s => s.id !== "distressed-guest")) {
      const req = getScenarioRuntimeRequirements(DEFAULT_DEPLOYMENT, s);
      expect(req.communications.every(c => !c.distressedGuestRestricted), s.id).toBe(true);
    }
  });

  it("a maintenance defect does not require room-readiness evidence, and a room delay does not require a defect report", () => {
    const maintenance = start("maintenance-defect").evidence.map(e => e.evidenceType);
    const room = start("repeat-guest-room-not-ready").evidence.map(e => e.evidenceType);
    expect(maintenance).toContain("Defect report and classification");
    expect(maintenance).not.toContain("Room readiness confirmation");
    expect(room).toContain("Room readiness confirmation");
    expect(room).not.toContain("Defect report and classification");
  });

  it("every scenario keeps at least one required evidence item and one outcome metric", () => {
    for (const s of TRAVEL_SCENARIOS) {
      const req = getScenarioRuntimeRequirements(DEFAULT_DEPLOYMENT, s);
      expect(req.evidence.some(e => e.required), s.id).toBe(true);
      expect(req.outcomes.length, s.id).toBeGreaterThan(0);
    }
  });
});

describe("Authorised decision", () => {
  it("uses the scenario's governance approval role, not the accountable owner, when they differ", () => {
    const exec = start("maintenance-defect");
    expect(exec.accountableRoleId).toBe("maintenance-lead");
    expect(exec.approvalRoleId).toBe("duty-manager");
    const gate = toGate(exec, "maintenance-defect");
    expect(() => approveDecision(gate, "maintenance-lead", scenarioById("maintenance-defect"))).toThrow(/authority/);
    expect(approveDecision(gate, "duty-manager", scenarioById("maintenance-defect")).state).toBe("in-action");
  });

  it("delegated-authority scenarios act without an approval gate", () => {
    const exec = toGate(start("transport-disruption"), "transport-disruption");
    expect(exec.approvalRequired).toBe(false);
    expect(exec.state).toBe("in-action");
    expect(exec.stateHistory.some(h => h.state === "approval-required")).toBe(false);
  });

  it("an approver cannot decide twice at the same gate", () => {
    const scenario = scenarioById("repeat-guest-room-not-ready");
    const gate = toGate(start(scenario.id), scenario.id);
    const returned = returnDecision(gate, gate.approvalRoleId, "Try lounge access first", scenario);
    expect(() => returnDecision({ ...returned, state: "approval-required" }, gate.approvalRoleId, "again", scenario)).toThrow(/already/);
  });

  it("delay at the gate escalates, and the case cannot move until the escalation is acknowledged", () => {
    const scenario = scenarioById("repeat-guest-room-not-ready");
    const gate = toGate(start(scenario.id), scenario.id);
    let e = transitionExecution(triggerEscalation(gate, "No decision within 10 minutes", "general-manager"), "escalated", scenario)!;
    expect(transitionExecution(e, "in-action", scenario)).toBeNull();
    expect(transitionExecution(e, "resolved", scenario)).toBeNull();
    e = acknowledgeEscalation(e, e.escalations[0].id);
    expect(transitionExecution(e, "in-action", scenario)?.state).toBe("in-action");
  });
});

describe("Learning statements match the recorded trace", () => {
  function closeRoomCase(opts: { escalate: boolean; outcome?: "met" | "not-met" }) {
    const scenario = scenarioById("repeat-guest-room-not-ready");
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)!;
    let e = toGate(start(scenario.id), scenario.id);
    if (opts.escalate) {
      e = transitionExecution(triggerEscalation(e, "No decision", "general-manager"), "escalated", scenario)!;
      e = acknowledgeEscalation(e, e.escalations[0].id);
      e = transitionExecution(e, "in-action", scenario)!;
    } else {
      e = approveDecision(e, e.approvalRoleId, scenario);
    }
    e = sendCommunication(e, e.communications[0].id);
    if (opts.outcome) e = recordOutcome(e, e.outcomes[0].id, opts.outcome);
    e = transitionExecution(e, "resolved", scenario)!;
    for (const ev of e.evidence) e = captureEvidence(e, ev.id, {});
    e = transitionExecution(e, "closed", scenario)!;
    return generateLearning(e, scenario, playbook);
  }

  it("never claims communications were delivered", () => {
    const learning = closeRoomCase({ escalate: false });
    expect(learning.patterns.join(" ")).not.toMatch(/\bdelivered\b/i);
    expect(learning.patterns.join(" ")).toMatch(/None were sent/);
  });

  it("reports a missing approval rather than claiming one", () => {
    const learning = closeRoomCase({ escalate: true });
    expect(learning.patterns.join(" ")).toMatch(/No approval by Duty Manager was recorded/);
  });

  it("labels outcome evidence honestly and prioritises an unmet outcome as the next action", () => {
    expect(closeRoomCase({ escalate: false }).outcomeEvidence).toBe("not-measured");
    const failed = closeRoomCase({ escalate: false, outcome: "not-met" });
    expect(failed.outcomeEvidence).toBe("measured");
    expect(failed.nextAction).toMatch(/^Proposed for review by Duty Manager: Investigate why 1 outcome/);
  });
});

describe("Reviewed learning changes the next cycle", () => {
  const baseline = createHotelSignals(1).map((s, i) => simulateHotelCase(s, hotelFaultForSignal(i)));
  const proposals = baseline.map(proposeHotelLearning);

  it("ignores unreviewed and rejected proposals", () => {
    const rejected = proposals.map(p => p && reviewHotelLearning(p, "rejected", "synthetic-duty-manager"));
    const policy = mergeApprovedHotelPolicy(rejected);
    expect({ ...policy, version: BASELINE_POLICY.version }).toEqual(BASELINE_POLICY);
    expect(mergeApprovedHotelPolicy(proposals).responseMinutes).toBe(BASELINE_POLICY.responseMinutes);
  });

  it("applies approved changes to 100 fresh signals and leaves unmeasurable cases pending", () => {
    const approved = proposals.map(p => p && reviewHotelLearning(p, "approved", "synthetic-duty-manager"));
    const policy = mergeApprovedHotelPolicy(approved);
    const next = runHotelLearningCycle(2, policy);
    expect(next).toHaveLength(100);
    expect(new Set(next.map(c => c.signal.eventId)).size).toBe(100);
    expect(next.every(c => c.signal.eventId.startsWith("hotel-cycle-2-"))).toBe(true);
    const tally = (cases: typeof next, o: string) => cases.filter(c => c.outcome === o).length;
    expect([tally(baseline, "met"), tally(baseline, "not-met"), tally(baseline, "pending")]).toEqual([20, 40, 40]);
    expect([tally(next, "met"), tally(next, "not-met"), tally(next, "pending")]).toEqual([80, 0, 20]);
    expect(next.filter(c => c.outcome === "pending").every(c => c.reasons.includes("missing-measurement"))).toBe(true);
  });
});

describe("Operations Centre evidence snapshot", () => {
  it("reports the figures the engine actually produces", async () => {
    const { getTravelEvidenceSnapshot } = await import("@/simulation/evidenceSnapshot");
    expect(getTravelEvidenceSnapshot()).toEqual({
      signals: 100, paths: 4, closed: 63, approvalHeld: 17, evidenceHeld: 20, gateFailures: 0,
      cycle1: { met: 20, notMet: 40, pending: 40 }, cycle2: { met: 80, notMet: 0, pending: 20 }, approvedChanges: 60,
    });
  });
});
