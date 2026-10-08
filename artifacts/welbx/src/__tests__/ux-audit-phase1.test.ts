import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT, computeReadiness, getMissingEnvironmentFields } from "@/data/travelDeploymentConfig";
import { getDeploymentActivationReadiness } from "@/lib/travelScenarioRouting";
import { parseNumericDraft, resolveNumericDraft } from "@/lib/numericDraft";
import { createHotelSignals } from "@/simulation/mockHotel";
import { hotelFaultForSignal, proposeHotelLearning, replayHotelLearning, reviewHotelLearning, simulateHotelCase } from "@/simulation/hotelLearning";
import { describeJourneyOutcome, summariseLearningRows } from "@/simulation/hotelLearningSummary";

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
