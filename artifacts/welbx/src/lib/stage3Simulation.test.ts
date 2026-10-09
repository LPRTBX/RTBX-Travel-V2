import { describe, expect, it } from "vitest";
import {
  initialPortfolio, initialWellbeing, portfolioReducer, wellbeingReducer,
  portfolioReady, wellbeingReady, portfolioPlan, portfolioOutcomes,
  portfolioConfirmations, supportConfirmations, HUMAN_REVIEW, FOLLOWUP_LEADS,
  type PortfolioChoice, type SupportChoice, type PortfolioState, type WellbeingState,
} from "./stage3Simulation";

function portfolioAuthorised(choice: PortfolioChoice) {
  let s = portfolioReducer(initialPortfolio(), { type: "next" });
  s = portfolioReducer(s, { type: "choose", choice });
  s = portfolioReducer(s, { type: "next" });
  for (const c of portfolioConfirmations(choice, false)) s = portfolioReducer(s, { type: "confirm", id: c.id });
  return s;
}
function supportReviewed(): WellbeingState {
  let s = initialWellbeing();
  for (let i = 0; i < 3; i++) s = wellbeingReducer(s, { type: "reveal" });
  s = wellbeingReducer(s, { type: "next" });
  for (const c of HUMAN_REVIEW) s = wellbeingReducer(s, { type: "review", id: c.id });
  return wellbeingReducer(s, { type: "next" });
}
function supportAuthorised(choice: SupportChoice): WellbeingState {
  let s = wellbeingReducer(supportReviewed(), { type: "choose", choice });
  for (const c of supportConfirmations(choice, false)) s = wellbeingReducer(s, { type: "confirm", id: c.id });
  return s;
}
describe("Portfolio fictional scenario", () => {
  it("calculates every specified plan and cost assumption", () => {
    expect(portfolioPlan("network")).toMatchObject({ city: 8, park: 6, relocated: 14, local: 10, seats: 28, transport: 240, relocationCost: 560, localCost: 150, cost: 950 });
    expect(portfolioPlan("network", true)).toMatchObject({ city: 4, park: 6, relocated: 10, local: 14, seats: 20, transport: 240, relocationCost: 400, localCost: 210, cost: 850 });
    for (const revised of [false, true]) expect(portfolioPlan("local", revised)).toMatchObject({ relocated: 0, local: 24, seats: 0, transport: 0, cost: 360 });
  });
  for (const choice of ["network", "local"] as PortfolioChoice[]) {
    it(`${choice}: each missing owner confirmation independently holds authorisation`, () => {
      const authorised = portfolioAuthorised(choice);
      expect(portfolioReady(authorised)).toBe(true);
      for (const c of portfolioConfirmations(choice, false)) {
        const missing = portfolioReducer(authorised, { type: "confirm", id: c.id });
        expect(portfolioReady(missing)).toBe(false);
        expect(portfolioReducer(missing, { type: "next" })).toEqual(missing);
      }
    });
    for (const revised of ["network", "local"] as PortfolioChoice[]) {
      it(`${choice} -> ${revised}: capacity failure invalidates approval, all revised confirmations and receipt review are required`, () => {
        let s = portfolioReducer(portfolioAuthorised(choice), { type: "next" });
        expect(s).toMatchObject({ step: 3, revision: 1, revisedChoice: null, confirmations: [] });
        expect(s.initialAuthorisation.length).toBeGreaterThan(0);
        expect(portfolioReducer(s, { type: "next" })).toEqual(s);
        s = portfolioReducer(s, { type: "replan", choice: revised });
        for (const c of portfolioConfirmations(revised, true)) {
          expect(portfolioReady(s)).toBe(false);
          s = portfolioReducer(s, { type: "confirm", id: c.id });
        }
        const authorised = s;
        for (const c of portfolioConfirmations(revised, true)) {
          const missing = portfolioReducer(authorised, { type: "confirm", id: c.id });
          expect(portfolioReducer(missing, { type: "next" })).toEqual(missing);
        }
        s = portfolioReducer(s, { type: "next" });
        expect(s.step).toBe(4);
        expect(portfolioReady(s)).toBe(false);
        s = portfolioReducer(s, { type: "reviewReceipts" });
        expect(portfolioReady(s)).toBe(false);
        s = portfolioReducer(s, { type: "acceptFollowup" });
        expect(portfolioReducer(s, { type: "next" }).step).toBe(5);
        expect(portfolioReducer(authorised, { type: "replan", choice: revised }).confirmations).toEqual([]);
      });
    }
  }
  it("pairs waiting evidence on the same 46 confirmed guests, excludes the open booking and does not equate waiting with ROI", () => {
    const network = portfolioOutcomes("network"), local = portfolioOutcomes("local");
    expect(network).toMatchObject({ confirmedBookings: 23, confirmedGuests: 46, transportedGuests: 20, localConfirmedBookings: 13, guestMinutes: 3240, referenceGuestMinutes: 4140, fewerMinutes: 900, modelledCost: 850 });
    expect(local).toMatchObject({ confirmedBookings: 23, confirmedGuests: 46, localConfirmedBookings: 23, guestMinutes: 4140, referenceGuestMinutes: 4140, fewerMinutes: 0, modelledCost: 360 });
    expect(network.guestMinutes).toBe(20 * 45 + 26 * 90);
    expect(local.guestMinutes).toBe(46 * 90);
    expect(network.totalBookings - network.confirmedBookings).toBe(1);
  });
});
describe("Safety & wellbeing fictional scenario", () => {
  it("reveals one case progressively, holds until every reading and human review, ignores forged confirmations", () => {
    let s = initialWellbeing();
    expect(wellbeingReducer(s, { type: "next" })).toEqual(s);
    for (let i = 0; i < 3; i++) {
      expect(wellbeingReady(s)).toBe(false);
      s = wellbeingReducer(s, { type: "reveal" });
    }
    expect(s.revealed).toBe(4);
    expect(wellbeingReducer(s, { type: "reveal" }).revealed).toBe(4);
    s = wellbeingReducer(s, { type: "next" });
    expect(wellbeingReducer(s, { type: "review", id: "fake" })).toEqual(s);
    for (const c of HUMAN_REVIEW) {
      expect(wellbeingReady(s)).toBe(false);
      s = wellbeingReducer(s, { type: "review", id: c.id });
    }
    expect(wellbeingReady(s)).toBe(true);
    for (const c of HUMAN_REVIEW) {
      const missing = wellbeingReducer(s, { type: "review", id: c.id });
      expect(wellbeingReducer(missing, { type: "next" })).toEqual(missing);
    }
  });
  for (const choice of ["onsite", "transfer"] as SupportChoice[]) {
    it(`${choice}: every missing intervention confirmation including consent holds`, () => {
      const s = supportAuthorised(choice);
      expect(wellbeingReady(s)).toBe(true);
      expect(supportConfirmations(choice, false).map(c => c.id)).toContain("consent");
      for (const c of supportConfirmations(choice, false)) {
        const missing = wellbeingReducer(s, { type: "confirm", id: c.id });
        expect(wellbeingReducer(missing, { type: "next" })).toEqual(missing);
      }
    });
    for (const revised of ["onsite", "transfer"] as SupportChoice[]) {
      for (const response of ["accept", "decline"] as const) {
        it(`${choice} failure -> ${revised}, guest ${response}: renew handoff, review receipts and accept a named 20-minute follow-up`, () => {
          let s = wellbeingReducer(supportAuthorised(choice), { type: "next" });
          expect(s).toMatchObject({ step: 3, revision: 1, revisedChoice: null, confirmations: [] });
          expect(wellbeingReducer(s, { type: "next" })).toEqual(s);
          s = wellbeingReducer(s, { type: "replan", choice: revised });
          for (const c of supportConfirmations(revised, true)) s = wellbeingReducer(s, { type: "confirm", id: c.id });
          const authorised = s;
          for (const c of supportConfirmations(revised, true)) {
            const missing = wellbeingReducer(s, { type: "confirm", id: c.id });
            expect(wellbeingReducer(missing, { type: "next" })).toEqual(missing);
          }
          expect(wellbeingReducer(s, { type: "replan", choice: revised }).confirmations).toEqual([]);
          s = wellbeingReducer(s, { type: "next" });
          expect(s.step).toBe(4);
          s = wellbeingReducer(s, { type: "reviewReceipts" });
          expect(wellbeingReady(s)).toBe(false);
          s = wellbeingReducer(s, { type: "response", response });
          expect(wellbeingReducer(s, { type: "acceptFollowup" })).toEqual(s);
          s = wellbeingReducer(s, { type: "lead", lead: FOLLOWUP_LEADS[0] });
          if (response === "decline") {
            expect(wellbeingReducer(s, { type: "acceptFollowup" })).toEqual(s);
            s = wellbeingReducer(s, { type: "helpRoute" });
          }
          expect(wellbeingReady(s)).toBe(false);
          s = wellbeingReducer(s, { type: "acceptFollowup" });
          expect(wellbeingReady(s)).toBe(true);
          const withoutLead = wellbeingReducer(s, { type: "lead", lead: "" });
          expect(withoutLead).toMatchObject({ followupLead: "", followupAccepted: false });
          expect(wellbeingReady(withoutLead)).toBe(false);
          expect(wellbeingReducer(s, { type: "lead", lead: "unknown" })).toEqual(s);
          expect(wellbeingReducer(s, { type: "lead", lead: FOLLOWUP_LEADS[1] }).followupAccepted).toBe(false);
          expect(wellbeingReducer(s, { type: "response", response }).followupAccepted).toBe(false);
          expect(wellbeingReducer(s, { type: "next" }).step).toBe(5);
          expect(authorised.guestResponse).toBeNull();
        });
      }
    }
  }
});
describe("Reset and decision isolation", () => {
  it("resetting one scenario cannot modify the other or retain its own decisions", () => {
    const portfolio: PortfolioState = portfolioAuthorised("network");
    const wellbeing = supportAuthorised("transfer");
    const portfolioSnapshot = structuredClone(portfolio);
    expect(wellbeingReducer(wellbeing, { type: "reset" })).toEqual(initialWellbeing());
    expect(portfolio).toEqual(portfolioSnapshot);
    const supportSnapshot = structuredClone(wellbeing);
    expect(portfolioReducer(portfolio, { type: "reset" })).toEqual(initialPortfolio());
    expect(wellbeing).toEqual(supportSnapshot);
  });
  it("rejects out-of-step events and never advances beyond Learn", () => {
    const p = initialPortfolio(), w = initialWellbeing();
    expect(portfolioReducer(p, { type: "confirm", id: "harbour" })).toEqual(p);
    expect(wellbeingReducer(w, { type: "confirm", id: "consent" })).toEqual(w);
    expect(portfolioReducer({ ...p, step: 5 }, { type: "next" }).step).toBe(5);
    expect(wellbeingReducer({ ...w, step: 5 }, { type: "next" }).step).toBe(5);
  });
});
