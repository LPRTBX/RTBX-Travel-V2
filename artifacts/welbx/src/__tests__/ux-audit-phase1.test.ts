import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT, computeReadiness, getMissingEnvironmentFields } from "@/data/travelDeploymentConfig";
import { getDeploymentActivationReadiness } from "@/lib/travelScenarioRouting";
import { parseNumericDraft, resolveNumericDraft } from "@/lib/numericDraft";
import { createHotelSignals } from "@/simulation/mockHotel";
import { hotelFaultForSignal, proposeHotelLearning, replayHotelLearning, reviewHotelLearning, simulateHotelCase } from "@/simulation/hotelLearning";
import { describeJourneyOutcome, summariseLearningRows } from "@/simulation/hotelLearningSummary";
import { DEFAULT_CYCLE_CONDITIONS, EVOLUTION_REVIEWER, describeArrival, describeConditions, initialEvolution, isMeaningfulReason, reviewEvolution, runEvolutionCycle } from "@/simulation/operatingEvolution";
import { DEFAULT_VALUE_ASSUMPTIONS, calculateTravelValue } from "@/lib/travelValueModel";

describe("Build & Configure required environment fields", () => {
  it("accepts the default deployment", () => {
    expect(getMissingEnvironmentFields(DEFAULT_DEPLOYMENT)).toEqual([]);
    expect(getDeploymentActivationReadiness(DEFAULT_DEPLOYMENT).ready).toBe(true);
  });

  it("blocks activation when a required Stage 1 field is blank and names the field", () => {
    const draft = { ...DEFAULT_DEPLOYMENT, deploymentName: "   ", roomCount: 0 };
    expect(getMissingEnvironmentFields(draft)).toEqual(["deploymentName", "roomCount"]);
    expect(computeReadiness(draft)).toBe("Incomplete");
    const readiness = getDeploymentActivationReadiness(draft);
    expect(readiness.ready).toBe(false);
    expect(readiness.readiness).toBe("Incomplete");
    expect(readiness.issues[0].code).toBe("environment-incomplete");
    expect(readiness.issues[0].reason).toContain("Deployment name");
    expect(readiness.issues[0].reason).toContain("Room / unit count");
  });
});

describe("Calculator numeric entry", () => {
  it("does not rewrite a partial value that is below the minimum", () => {
    expect(parseNumericDraft("3", 28, 31).status).toBe("out-of-range");
    expect(parseNumericDraft("30", 28, 31)).toEqual({ status: "valid", value: 30 });
  });

  it("keeps typed values exactly and only clamps or reverts when editing ends", () => {
    expect(resolveNumericDraft("30", 31, 28, 31)).toBe(30);
    expect(resolveNumericDraft("2.5", 3, 0.5, 30)).toBe(2.5);
    expect(resolveNumericDraft("1,000", 120, 1, 1000)).toBe(1000);
    expect(resolveNumericDraft("3", 30, 28, 31)).toBe(28);
    expect(resolveNumericDraft("5000", 120, 1, 1000)).toBe(1000);
    expect(resolveNumericDraft("", 120, 1, 1000)).toBe(120);
    expect(resolveNumericDraft("abc", 120, 1, 1000)).toBe(120);
  });
});

describe("Simulation Lab recorded evidence", () => {
  const labels = { met: "Outcome met", "not-met": "Outcome not met", pending: "Pending evidence" } as const;
  const baselineRows = () => createHotelSignals().map((signal, index) => {
    const baseline = simulateHotelCase(signal, hotelFaultForSignal(index));
    return { baseline, proposal: proposeHotelLearning(baseline), index };
  });

  it("keeps cycle 1 recorded outcomes unchanged after every proposal is approved and replayed", () => {
    const rows = baselineRows();
    const recorded = summariseLearningRows(rows).recorded;
    const reviewed = rows.map(row => {
      if (!row.proposal) return row;
      const proposal = reviewHotelLearning(row.proposal, "approved", "synthetic-duty-manager");
      return { ...row, proposal, replay: replayHotelLearning(row.baseline, proposal, hotelFaultForSignal(row.index)) };
    });
    const after = summariseLearningRows(reviewed);

    expect(after.recorded).toEqual(recorded);
    expect(after.replays.journeys).toBeGreaterThan(0);
    expect(after.replays.outcomes.met).toBeGreaterThan(0);
  });

  it("labels a journey with its recorded outcome first and names the later source", () => {
    expect(describeJourneyOutcome({ baseline: { outcome: "not-met" }, replay: { outcome: "met" } }, labels))
      .toBe("Outcome not met → replay outcome met");
    expect(describeJourneyOutcome({ baseline: { outcome: "pending" }, reconciled: { outcome: "met" } }, labels))
      .toBe("Pending evidence → late evidence outcome met");
    expect(describeJourneyOutcome({ baseline: { outcome: "met" } }, labels)).toBe("Outcome met");
  });
});

describe("Operating Evolution review and cycle records", () => {
  const measured = { ...DEFAULT_CYCLE_CONDITIONS };
  const baseline = () => runEvolutionCycle(runEvolutionCycle(initialEvolution(), measured), measured);

  it("requires a meaningful reviewer reason in the model, not only the UI", () => {
    expect(isMeaningfulReason("")).toBe(false);
    expect(isMeaningfulReason("          ")).toBe(false);
    expect(isMeaningfulReason("ok")).toBe(false);
    expect(isMeaningfulReason("1234567890")).toBe(false);
    expect(isMeaningfulReason("Two cycles show 20 delays")).toBe(true);
    expect(() => reviewEvolution(baseline(), EVOLUTION_REVIEWER, true, "ok")).toThrow();
    expect(reviewEvolution(baseline(), EVOLUTION_REVIEWER, true, "  Two cycles show 20 delays  ").reviews[0].reason).toBe("Two cycles show 20 delays");
  });

  it("keeps each cycle's conditions as they were when it ran", () => {
    const settings = { ...DEFAULT_CYCLE_CONDITIONS };
    const first = runEvolutionCycle(initialEvolution(), settings);
    settings.capacity = 5;
    settings.forecastAvailable = false;
    const second = runEvolutionCycle(first, settings);
    expect(describeConditions(second.cycles[0].conditions)).toBe("Capacity 20 · forecast available · measured");
    expect(describeConditions(second.cycles[1].conditions)).toBe("Capacity 5 · no forecast · measured");
  });

  it("labels each arrival with its readiness, action and outcome", () => {
    const labels = baseline().cycles[0].traces.map(describeArrival);
    expect(labels[0]).toBe("Arrival 1 · room not ready · no preparation · delayed");
    expect(labels[2]).toBe("Arrival 3 · room ready · no preparation · on time");
    const unmeasured = runEvolutionCycle(initialEvolution(), { ...DEFAULT_CYCLE_CONDITIONS, measured: false });
    expect(describeArrival(unmeasured.cycles[0].traces[0], 0)).toContain("outcome unconfirmed");
  });
});

describe("Calculator programme cost", () => {
  it("leaves the net calculation unchanged when no programme cost is entered", () => {
    const result = calculateTravelValue({ ...structuredClone(DEFAULT_VALUE_ASSUMPTIONS), monthlyCost: 0 });
    expect(result.net).toEqual(result.adjusted);
    const withCost = calculateTravelValue({ ...structuredClone(DEFAULT_VALUE_ASSUMPTIONS), monthlyCost: 1000 });
    expect(withCost.net.base).toBe(result.adjusted.base - 1000);
  });
});
