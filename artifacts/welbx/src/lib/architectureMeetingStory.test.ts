import { describe, expect, it } from "vitest";
import { ARCHITECTURE_SCENARIOS, advanceArchitectureTrace, architectureNextLabel, architectureSignalFor, buildArchitectureNodes } from "./architectureLabModel";
import { createHotelCase, proposeHotelLearning, reconcileHotelFollowUp, replayHotelLearning, reviewHotelLearning, type Fault } from "@/simulation/hotelLearning";

function run(fault: Fault) {
  let result = createHotelCase(architectureSignalFor("repeat-guest-room-not-ready"));
  for (let i = 0; i < 10 && architectureNextLabel(result); i++) {
    result = advanceArchitectureTrace(result, fault)!.hotelCase;
  }
  return result;
}

describe("Architecture Lab partnership meeting story", () => {
  it.each(ARCHITECTURE_SCENARIOS)("keeps five phases, eleven layers and honest classification for %s", (id) => {
    const nodes = buildArchitectureNodes(id, createHotelCase(architectureSignalFor(id)));
    expect(nodes).toHaveLength(11);
    expect(new Set(nodes.map(node => node.stage)).size).toBe(5);
    const classification = nodes.find(node => node.id === "moment")!;
    expect(classification.text).toContain("Rules-based simulation");
    expect(classification.details.join(" ")).toContain("not live AI inference");
    expect(classification.details.join(" ")).toContain("Illustrative confidence");
    expect(classification.text).not.toContain("AI classification");
  });

  it.each([
    ["none", "met", "closed"],
    ["late-response", "not-met", "closed"],
    ["ineffective-action", "not-met", "in-action"],
    ["missing-receipt", "pending", "in-action"],
    ["missing-measurement", "pending", "in-action"],
  ] as const)("reports %s as %s with case %s", (fault, outcome, state) => {
    const result = run(fault);
    expect(result.outcome).toBe(outcome);
    expect(result.execution.state).toBe(state);
  });

  it("does not propose learning or close without measurement; retains the earlier observation", () => {
    const original = run("missing-measurement");
    const snapshot = JSON.stringify(original);
    expect(proposeHotelLearning(original)).toBeNull();
    const measured = reconcileHotelFollowUp(original, { ...original.observation!, measured: true });
    expect(measured.outcome).toBe("met");
    expect(measured.execution.state).toBe("closed");
    expect(measured.audit.some(entry => entry.step === "prior-observation-retained")).toBe(true);
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it("requires review, separately replays the same signal and retains the original and review", () => {
    const original = run("late-response");
    const snapshot = JSON.stringify(original);
    const proposal = proposeHotelLearning(original)!;
    expect(() => replayHotelLearning(original, proposal, "late-response")).toThrow();
    const rejected = reviewHotelLearning(proposal, "rejected", "synthetic-duty-manager");
    expect(() => replayHotelLearning(original, rejected, "late-response")).toThrow();
    const reviewed = reviewHotelLearning(proposal, "approved", "synthetic-duty-manager");
    const reviewSnapshot = JSON.stringify(reviewed);
    const replay = replayHotelLearning(original, reviewed, "late-response");
    expect(replay.signal.eventId).toBe(original.signal.eventId);
    expect(replay.execution.id).not.toBe(original.execution.id);
    expect(replay.outcome).toBe("met");
    const challenged = replayHotelLearning(original, reviewed, "late-response", { minimumResponseMinutes: 35 });
    expect(challenged.outcome).toBe("not-met");
    expect(JSON.stringify(original)).toBe(snapshot);
    expect(JSON.stringify(reviewed)).toBe(reviewSnapshot);
    expect(replay.deployment).toEqual(original.deployment);
  });
});
