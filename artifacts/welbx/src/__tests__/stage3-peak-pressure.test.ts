import { describe, expect, it } from "vitest";
import {
  ACTORS, actionState, approveDraft, approvePortfolioSupport, assessPattern, buildSignals, capacity, completeAction,
  decideLearning, decideReview, followThrough, initialPeakState, outcome, planFor, portfolioSummary, receiveInformation,
  recordMeasures, recordMissingEvidence, reviewAgain, type ChallengeId, type PeakState,
} from "@/lib/peakPressure";

const approved = (challenge: ChallengeId = "standard", reason?: string) =>
  decideReview(initialPeakState(challenge), "duty-manager", { kind: "approve", reason });

function runPlan(state: PeakState): PeakState {
  let next = approveDraft(state, "duty-manager");
  if (next.challenge === "capacity") next = approvePortfolioSupport(next);
  for (let i = 0; i < 4; i += 1) {
    for (const action of planFor(next)) {
      if (actionState(next, action) === "ready") next = completeAction(next, action.id, action.owner, "14:00");
    }
  }
  return next;
}

describe("Peak-pressure signals and the review rule", () => {
  it("shows each signal's source, time and reliability", () => {
    for (const signal of buildSignals("standard")) {
      expect(signal.source).toBeTruthy();
      expect(signal.observedAt).toBeTruthy();
      expect(["high", "medium", "low"]).toContain(signal.reliability);
    }
  });

  it("asks for human review only when several kinds of signal agree", () => {
    const standard = assessPattern(buildSignals("standard"));
    expect(standard.warrantsReview).toBe(true);
    expect(standard.confidence).toBe("normal");
    expect(assessPattern(buildSignals("standard").filter(s => s.kind === "demand" || s.kind === "service")).warrantsReview).toBe(false);
  });

  it("never names, scores or diagnoses a person", () => {
    const text = JSON.stringify([buildSignals("standard"), buildSignals("signals"), assessPattern(buildSignals("standard"))]);
    expect(text).not.toMatch(/\b(burn(ed|t)?[- ]?out|stress(ed)?|anxious|depress|exhaust|fatigu|ill(ness)?|diagnos(is|ed)|at[- ]risk employee)\b/i);
    expect(assessPattern(buildSignals("standard")).explanation).toMatch(/the operation, not any person/);
  });

  it("challenge 1: missing or conflicting signals lower confidence and are never counted as evidence", () => {
    const signals = buildSignals("signals");
    expect(signals.find(s => s.id === "breaks")?.status).toBe("missing");
    expect(signals.find(s => s.id === "roster")?.status).toBe("conflicting");
    const assessment = assessPattern(signals);
    expect(assessment.elevatedKinds).not.toContain("recovery");
    expect(assessment.confidence).toBe("reduced");
    expect(() => decideReview(initialPeakState("signals"), "duty-manager", { kind: "approve" })).toThrow(/Request more information first/);
    let state = decideReview(initialPeakState("signals"), "duty-manager", { kind: "request-information", request: "Confirm who is on the desk and the break log" });
    expect(state.review.status).toBe("awaiting-information");
    expect(() => decideReview(state, "duty-manager", { kind: "approve" })).toThrow(/Waiting for the requested information/);
    state = receiveInformation(state);
    expect(assessPattern(buildSignals("signals", true)).confidence).toBe("normal");
    expect(decideReview(state, "duty-manager", { kind: "approve" }).review.status).toBe("approved");
  });
});

describe("Authority, deferral and the intervention plan", () => {
  it("challenge 3: refuses the wrong approval role and leaves the state unchanged", () => {
    const state = initialPeakState("role");
    for (const actor of ["fo-supervisor", "general-manager", "regional-ops", "people-lead"] as const) {
      expect(() => decideReview(state, actor, { kind: "approve" }), actor).toThrow(/Only the Duty Manager · Harbour Hotel may/);
    }
    expect(state).toEqual(initialPeakState("role"));
  });

  it("challenge 4: monitoring and declining need a reason, set a review time and execute nothing", () => {
    expect(() => decideReview(initialPeakState("declined"), "duty-manager", { kind: "monitor", reason: "ok", reviewInMinutes: 30 })).toThrow(/reason/);
    let state = decideReview(initialPeakState("declined"), "duty-manager", { kind: "monitor", reason: "Two agents return from lunch at 13:45", reviewInMinutes: 30 });
    expect(state.review).toMatchObject({ status: "monitoring", reviewInMinutes: 30 });
    expect(planFor(state).every(a => actionState(state, a) === "waiting")).toBe(true);
    state = reviewAgain(state);
    const declined = decideReview(state, "duty-manager", { kind: "decline", reason: "Agency cover already arranged by the GM" });
    expect(declined.review.status).toBe("declined");
    expect(() => completeAction(declined, "redistribute", "fo-supervisor", "13:40")).toThrow(/Waiting for: Duty Manager approval/);
    expect(portfolioSummary(declined).response).toBe("Declined with a reason");
  });

  it("gives every action an owner, deadline, dependency and evidence, and enforces them", () => {
    let state = approved();
    for (const action of planFor(state)) {
      expect(action.owner in ACTORS && action.deadline && action.dependsOn.length && action.evidence, action.id).toBeTruthy();
    }
    expect(() => completeAction(state, "breaks", "fo-supervisor", "14:00")).toThrow(/Staff moved to the front desk/);
    expect(() => completeAction(state, "redistribute", "duty-manager", "13:40")).toThrow(/Only the Front Office Supervisor/);
    expect(() => completeAction(state, "expectations", "guest-services", "13:50")).toThrow(/approval of the draft/);
    expect(() => approveDraft(state, "guest-services")).toThrow(/Only the Duty Manager/);
    state = completeAction(state, "redistribute", "fo-supervisor", "13:40");
    expect(actionState(state, planFor(state).find(a => a.id === "breaks")!)).toBe("ready");
  });

  it("challenge 2: the redistribution plan matches the local staff actually available", () => {
    const short = approved("capacity");
    expect(capacity(short)).toMatchObject({ needed: 2, available: 1, gap: 1 });
    const redistribute = planFor(short).find(a => a.id === "redistribute")!;
    expect(redistribute.title).toMatch(/Move the reservations agent to the front desk/);
    expect(redistribute.title).not.toMatch(/concierge to the front desk/);
    expect(redistribute.evidence).toMatch(/1 person moved/);
    expect(planFor(approved()).find(a => a.id === "redistribute")!.evidence).toMatch(/2 people moved/);
    expect(planFor(short).map(a => a.id)).toEqual(expect.arrayContaining(["escalate", "release", "arrival"]));
  });

  it("challenge 2: both portfolio approvals authorise the loan but do not unlock break cover", () => {
    let state = completeAction(approved("capacity"), "redistribute", "fo-supervisor", "13:40");
    state = completeAction(state, "escalate", "duty-manager", "13:50");
    expect(portfolioSummary(state).outstanding).toContain("Portfolio decision on cross-property cover");
    expect(() => completeAction(state, "release", "coastal-gm", "13:55")).toThrow(/Portfolio authorisation/);

    state = approvePortfolioSupport(state);
    expect(capacity(state)).toMatchObject({ authorised: true, lentInPlace: 0, gap: 1 });
    expect(actionState(state, planFor(state).find(a => a.id === "breaks")!)).toBe("waiting");
    expect(() => completeAction(state, "breaks", "fo-supervisor", "14:00")).toThrow(/Cover in place: the lent team member's arrival recorded/);
    expect(portfolioSummary(state).outstanding).toContain("Cross-property cover authorised but not yet in place");

    // Release alone is not cover either; only the recorded arrival closes the gap.
    expect(() => completeAction(state, "release", "regional-ops", "13:55")).toThrow(/Only the General Manager · Coastal Resort/);
    expect(() => completeAction(state, "arrival", "fo-supervisor", "14:05")).toThrow(/Release recorded at Coastal Resort/);
    state = completeAction(state, "release", "coastal-gm", "13:55");
    expect(capacity(state).gap).toBe(1);
    expect(() => completeAction(state, "breaks", "fo-supervisor", "14:00")).toThrow(/arrival recorded/);
  });

  it("challenge 2: recorded cover closes the gap and unlocks break cover", () => {
    let state = approvePortfolioSupport(completeAction(approved("capacity"), "redistribute", "fo-supervisor", "13:40"));
    state = completeAction(state, "release", "coastal-gm", "13:55");
    state = completeAction(state, "arrival", "fo-supervisor", "14:05");
    expect(capacity(state)).toMatchObject({ lentInPlace: 1, gap: 0 });
    expect(portfolioSummary(state).outstanding).not.toContain("Cross-property cover authorised but not yet in place");
    expect(completeAction(state, "breaks", "fo-supervisor", "14:10").done.breaks).toBe("14:10");
  });
});

describe("Outcome and learning", () => {
  it("keeps approval, execution and outcome separate: nothing is measured until every action is recorded", () => {
    const state = approved();
    expect(outcome(state).label).toBe("Not measured yet");
    expect(() => recordMeasures(state)).toThrow(/Every action must be recorded/);
    const finished = recordMeasures(runPlan(state));
    expect(followThrough(finished)).toEqual({ done: 5, total: 5 });
    expect(outcome(finished)).toMatchObject({ canClose: true });
  });

  it("challenge 5: a missing follow-up measurement stays unconfirmed and blocks closure", () => {
    const measured = recordMeasures(runPlan(approved("evidence")));
    const breaks = measured.measures!.find(m => m.id === "breaks")!;
    expect(breaks).toMatchObject({ value: null, met: null });
    expect(outcome(measured)).toMatchObject({ canClose: false, unconfirmed: ["Team members with a recorded break by 15:00"] });
    expect(measured.learning?.basis).toBe("incomplete");
    expect(() => decideLearning(measured, "general-manager", true)).toThrow(/reason/);
    const late = recordMissingEvidence(measured);
    expect(outcome(late).canClose).toBe(true);
    expect(late.learning?.basis).toBe("complete");
  });

  it("applies nothing until the right role approves the learning proposal", () => {
    const measured = recordMeasures(runPlan(approved()));
    expect(measured.learning?.status).toBe("proposed");
    expect(() => decideLearning(measured, "duty-manager", true)).toThrow(/Only the General Manager/);
    expect(() => decideLearning(measured, "general-manager", false, "no")).toThrow(/reason/);
    expect(decideLearning(measured, "general-manager", true).learning).toMatchObject({ status: "approved", decidedBy: "general-manager" });
  });

  it("shows the portfolio aggregate exposure, response status and open decisions, never people", () => {
    const summary = portfolioSummary(initialPeakState("standard"));
    expect(summary.exposure).toMatch(/1 property under peak pressure/);
    expect(summary.outstanding).toEqual(["Duty Manager review of the peak-pressure pattern"]);
    const text = JSON.stringify(portfolioSummary(recordMeasures(runPlan(approved()))));
    expect(text).not.toMatch(/support contact|People & Culture|who uses/i);
  });
});
