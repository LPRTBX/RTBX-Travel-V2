import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT } from "@/data/travelDeploymentConfig";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { getMandatoryEvidenceGaps, transitionExecution, createExecution } from "./runtimeEngine";
import { startLabRun, advanceLabRun, approveLabRun, acknowledgeLabEscalation, supplyLabEvidence } from "./visualSimulation";
import { getScenarioRuntimeReadiness } from "./travelScenarioRouting";
import { architectureSignalFor, ARCHITECTURE_SCENARIOS } from "./architectureLabModel";
import { simulateHotelCase, proposeHotelLearning, reviewHotelLearning, replayHotelLearning } from "@/simulation/hotelLearning";

const deployment = structuredClone(DEFAULT_DEPLOYMENT);
deployment.deploymentStatus = "active-simulation";
deployment.operatingSystems.forEach(s => { s.active = true; });
deployment.scenarios.forEach(s => { s.active = true; s.syntheticSignalOverride = true; });

describe("Complete canonical Travel scenario audit", () => {
  for (const scenario of TRAVEL_SCENARIOS) {
    it(`${scenario.id}: enforces configured approval at the reducer boundary`, () => {
      const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)!;
      let exec = createExecution({ deployment, scenario, playbook });
      exec = transitionExecution(exec, "understanding", scenario)!;
      exec = transitionExecution(exec, "decision-required", scenario)!;
      const shortcut = transitionExecution(exec, "in-action", scenario);
      expect(shortcut === null).toBe(scenario.governanceConfig.humanApprovalRequired);
    });
    for (const condition of ["normal", "escalation", "missing-evidence"] as const) {
      it(`${scenario.id}: ${condition} preserves approvals, evidence and unmeasured outcomes`, () => {
        expect(getScenarioRuntimeReadiness(deployment, scenario.id).ready).toBe(true);
        let run = startLabRun(deployment, scenario.id, 1, condition);
        for (let step = 0; step < 4; step++) run = advanceLabRun(run, false);
        expect(run.execution.state).toBe("approval-required");
        expect(run.execution.communications.every(c => !c.sent)).toBe(true);
        run = approveLabRun(run, "visitor");
        for (let step = 0; step < 10; step++) run = advanceLabRun(run, false);
        if (condition === "escalation") {
          expect(run.execution.state).toBe("escalated");
          expect(run.execution.escalations.some(e => !e.acknowledged)).toBe(true);
          run = acknowledgeLabEscalation(run);
        }
        if (condition === "missing-evidence") {
          expect(run.execution.state).toBe("resolved");
          expect(getMandatoryEvidenceGaps(run.execution).length).toBeGreaterThan(0);
          run = supplyLabEvidence(run);
        }
        for (let step = 0; step < 10; step++) run = advanceLabRun(run, false);
        expect(run.error).toBeUndefined();
        expect(run.execution.state).toBe("closed");
        expect(getMandatoryEvidenceGaps(run.execution)).toEqual([]);
        expect(run.execution.outcomes.every(o => o.status === "not-measured")).toBe(true);
        expect(advanceLabRun(run, false)).toBe(run);
      });
    }
  }
  for (const [id] of ARCHITECTURE_SCENARIOS) {
    for (const fault of ["late-response", "ineffective-action", "missing-receipt"] as const) {
      it(`${id}: reviewed ${fault} correction passes normal replay but preserves capacity failures`, () => {
        const baseline = simulateHotelCase(architectureSignalFor(id), fault);
        const original = JSON.stringify(baseline);
        const candidate = proposeHotelLearning(baseline)!;
        const rejected = reviewHotelLearning(candidate, "rejected", "synthetic-duty-manager");
        expect(() => replayHotelLearning(baseline, rejected, fault)).toThrow();
        const reviewed = reviewHotelLearning(candidate, "approved", "synthetic-duty-manager");
        expect(replayHotelLearning(baseline, reviewed, fault).outcome).toBe("met");
        const constraints = fault === "late-response" ? { minimumResponseMinutes: 35 }
          : fault === "ineffective-action" ? { requiredInterventionAttempts: 3 } : { requiredReceiptAttempts: 3 };
        const challenged = replayHotelLearning(baseline, reviewed, fault, constraints);
        expect(challenged.outcome).toBe(fault === "missing-receipt" ? "pending" : "not-met");
        expect(challenged.execution.id).not.toBe(baseline.execution.id);
        expect(challenged.audit.some(e => e.step === "reviewed-learning-replay")).toBe(true);
        expect(JSON.stringify(baseline)).toBe(original);
      });
    }
  }
});
