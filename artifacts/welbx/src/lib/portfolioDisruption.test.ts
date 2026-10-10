import { describe, expect, it } from "vitest";
import {
  initialPortfolio, portfolioReducer, portfolioReady, portfolioPlan, portfolioConfirmations, portfolioOutcomes,
  type PortfolioChoice,
} from "./portfolioDisruption";
import { initialPeakState, decideReview, completeAction, approvePortfolioSupport, planFor, actionState, capacity } from "./peakPressure";

function authorised(choice: PortfolioChoice) {
  let state = portfolioReducer(initialPortfolio(), { type: "next" });
  state = portfolioReducer(state, { type: "choose", choice });
  state = portfolioReducer(state, { type: "next" });
  for (const c of portfolioConfirmations(choice, false)) state = portfolioReducer(state, { type: "confirm", id: c.id });
  return state;
}
describe("Retained local Portfolio disruption", () => {
  it("preserves the booking, transport and modelled-cost alternatives", () => {
    expect(portfolioPlan("network")).toMatchObject({ city: 8, park: 6, local: 10, relocated: 14, seats: 28, cost: 950 });
    expect(portfolioPlan("network", true)).toMatchObject({ city: 4, park: 6, local: 14, relocated: 10, seats: 20, transport: 240, relocationCost: 400, localCost: 210, cost: 850 });
    expect(portfolioPlan("local")).toMatchObject({ city: 0, park: 0, local: 24, relocated: 0, seats: 0, transport: 0, cost: 360 });
  });
  for (const initial of ["network", "local"] as PortfolioChoice[]) {
    it(`${initial}: any missing initial owner/guest confirmation holds progress`, () => {
      const state = authorised(initial);
      for (const c of portfolioConfirmations(initial, false)) {
        const missing = portfolioReducer(state, { type: "confirm", id: c.id });
        expect(portfolioReady(missing)).toBe(false);
        expect(portfolioReducer(missing, { type: "next" })).toEqual(missing);
      }
      expect(portfolioReducer(state, { type: "confirm", id: "unknown" })).toEqual(state);
    });
    for (const revised of ["network", "local"] as PortfolioChoice[]) {
      it(`${initial} -> ${revised}: withdrawal reopens gates; evidence and named follow-up are mandatory`, () => {
        let state = portfolioReducer(authorised(initial), { type: "next" });
        expect(state).toMatchObject({ step: 3, revision: 1, revisedChoice: null, confirmations: [] });
        expect(state.initialAuthorisation.length).toBeGreaterThan(0);
        expect(portfolioReady(state)).toBe(false);
        state = portfolioReducer(state, { type: "replan", choice: revised });
        for (const c of portfolioConfirmations(revised, true)) {
          expect(portfolioReady(state)).toBe(false);
          state = portfolioReducer(state, { type: "confirm", id: c.id });
        }
        const approved = state;
        for (const c of portfolioConfirmations(revised, true)) {
          const missing = portfolioReducer(state, { type: "confirm", id: c.id });
          expect(portfolioReducer(missing, { type: "next" })).toEqual(missing);
        }
        expect(portfolioReducer(state, { type: "replan", choice: revised }).confirmations).toEqual([]);
        state = portfolioReducer(approved, { type: "next" });
        expect(state.step).toBe(4);
        expect(portfolioReducer(state, { type: "next" })).toEqual(state);
        state = portfolioReducer(state, { type: "reviewReceipts" });
        expect(portfolioReady(state)).toBe(false);
        state = portfolioReducer(state, { type: "acceptFollowup" });
        expect(portfolioReady(state)).toBe(true);
        expect(portfolioReady(portfolioReducer(state, { type: "reviewReceipts" }))).toBe(false);
        expect(portfolioReady(portfolioReducer(state, { type: "acceptFollowup" }))).toBe(false);
        state = portfolioReducer(state, { type: "next" });
        expect(state.step).toBe(5);
        expect(portfolioReducer(state, { type: "next" })).toEqual(state);
        expect(portfolioReducer(state, { type: "trial", id: "group" }).trialApprovals).toEqual(["group"]);
        expect(portfolioReducer(state, { type: "trial", id: "unknown" })).toEqual(state);
        expect(portfolioReducer(state, { type: "reset" })).toEqual(initialPortfolio());
      });
    }
  }
  it("pairs the same 46 confirmed guests, retains one open booking and never counts a missing outcome", () => {
    expect(portfolioOutcomes("network")).toMatchObject({ confirmedBookings: 23, totalBookings: 24, confirmedGuests: 46, transportedGuests: 20, localConfirmedBookings: 13, guestMinutes: 3240, referenceGuestMinutes: 4140, fewerMinutes: 900, modelledCost: 850 });
    expect(portfolioOutcomes("local")).toMatchObject({ confirmedBookings: 23, totalBookings: 24, confirmedGuests: 46, guestMinutes: 4140, referenceGuestMinutes: 4140, fewerMinutes: 0, modelledCost: 360 });
    expect(portfolioOutcomes("network").guestMinutes).toBe(20 * 45 + 26 * 90);
  });
  it("resetting either model cannot change the other scenario's decisions", () => {
    const portfolio = authorised("network");
    const peak = decideReview(initialPeakState("capacity"), "duty-manager", { kind: "approve" });
    const portfolioSnapshot = structuredClone(portfolio), peakSnapshot = structuredClone(peak);
    portfolioReducer(portfolio, { type: "reset" });
    expect(peak).toEqual(peakSnapshot);
    initialPeakState("standard");
    expect(portfolio).toEqual(portfolioSnapshot);
  });
});
describe("Merged peak-pressure release/arrival safeguard", () => {
  it("approvals and release alone cannot unlock break cover; recorded arrival is required", () => {
    let state = decideReview(initialPeakState("capacity"), "duty-manager", { kind: "approve" });
    state = completeAction(state, "redistribute", "fo-supervisor", "13:45");
    state = completeAction(state, "escalate", "duty-manager", "13:50");
    state = approvePortfolioSupport(state);
    const breaks = planFor(state).find(a => a.id === "breaks")!;
    expect(capacity(state).gap).toBe(1);
    expect(actionState(state, breaks)).toBe("waiting");
    expect(() => completeAction(state, "breaks", "fo-supervisor", "14:00")).toThrow(/arrival/);
    state = completeAction(state, "release", "coastal-gm", "13:55");
    expect(capacity(state).gap).toBe(1);
    expect(actionState(state, breaks)).toBe("waiting");
    expect(() => completeAction(state, "breaks", "fo-supervisor", "14:00")).toThrow(/arrival/);
    state = completeAction(state, "arrival", "fo-supervisor", "14:10");
    expect(capacity(state).gap).toBe(0);
    expect(actionState(state, breaks)).toBe("ready");
    expect(completeAction(state, "breaks", "fo-supervisor", "15:00").done.breaks).toBe("15:00");
  });
});
