import { describe, expect, it } from "vitest";
import { transitionExecution } from "@/lib/runtimeEngine";
import { createHotelCase, approveHotelDecision, dispatchHotelAction } from "@/simulation/hotelLearning";
import { ARCHITECTURE_SCENARIOS, architectureContext, architectureSignalFor, buildArchitectureNodes } from "@/lib/architectureLabModel";

describe("Travel Architecture Lab", () => {
  it("maps each featured trace to the canonical scenario and playbook", () => {
    for (const [id] of ARCHITECTURE_SCENARIOS) {
      const { scenario, playbook } = architectureContext(id);
      expect(scenario.playbookId).toBe(playbook.id);
      expect(architectureSignalFor(id)).toBeTruthy();
    }
  });

  it("exposes the full architecture inspector chain", () => {
    const id = "repeat-guest-room-not-ready";
    const hotelCase = createHotelCase(architectureSignalFor(id));
    const nodes = buildArchitectureNodes(id, hotelCase);
    expect(nodes.map(node => node.id)).toEqual([
      "connections", "signal", "moment", "governance", "decision", "playbook",
      "authority", "comms", "evidence", "outcome", "learning",
    ]);
  });

  it("keeps action behind the human approval gate", () => {
    const id = "repeat-guest-room-not-ready";
    const { scenario } = architectureContext(id);
    let hotelCase = createHotelCase(architectureSignalFor(id));
    for (const state of ["understanding", "decision-required", "approval-required"] as const) {
      const next = transitionExecution(hotelCase.execution, state, scenario, "architecture-lab-test");
      expect(next).not.toBeNull();
      hotelCase = { ...hotelCase, execution: next! };
    }
    expect(hotelCase.approved).toBe(false);
    expect(() => dispatchHotelAction(hotelCase)).toThrow();
    hotelCase = approveHotelDecision(hotelCase, hotelCase.execution.accountableRoleId);
    expect(dispatchHotelAction(hotelCase).execution.state).toBe("in-action");
  });
});
