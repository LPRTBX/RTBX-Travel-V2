import { describe, expect, it } from "vitest";
import { calculateTravelValue, DEFAULT_VALUE_ASSUMPTIONS } from "./travelValueModel";
const inputs = () => structuredClone(DEFAULT_VALUE_ASSUMPTIONS);

describe("Travel operating value model", () => {
  it("counts room nights, stays and arrivals separately", () => {
    const r = calculateTravelValue(inputs());
    expect([r.rooms, r.occupiedRoomNights, r.stays, r.guests, r.interactions]).toEqual([120, 2700, 900, 1350, 8100]);
    expect(r.rows.find(m => m.kind === "recovery")?.moments).toBe(72);
    expect(r.moments).toBe(3240);
  });
  it("propagates occupancy to every downstream moment and value", () => {
    const a = inputs(); const full = calculateTravelValue(a);
    a.occupancy /= 2; const half = calculateTravelValue(a);
    expect(half.guests).toBe(full.guests / 2);
    expect(half.moments).toBe(full.moments / 2);
    expect(half.adjusted.base).toBeCloseTo(full.adjusted.base / 2);
    expect(half.staffHours).toBeCloseTo(full.staffHours / 2);
  });
  it("scales a portfolio by sites and rooms without conflating the two", () => {
    const a = inputs(); const one = calculateTravelValue(a);
    a.sites = 3; a.roomsPerSite = 240;
    const portfolio = calculateTravelValue(a);
    expect(portfolio.rooms).toBe(720);
    expect(portfolio.stays).toBe(one.stays * 6);
    expect(portfolio.adjusted.high).toBeCloseTo(one.adjusted.high * 6);
  });
  it("does not count the same stay again for every occupied night", () => {
    const a = inputs(); const before = calculateTravelValue(a);
    a.lengthOfStay *= 2; const after = calculateTravelValue(a);
    expect(after.occupiedRoomNights).toBe(before.occupiedRoomNights);
    expect(after.guests).toBe(before.guests / 2);
    expect(after.moments).toBe(before.moments / 2);
  });
  it("treats interactions as activity, not extra financial moments", () => {
    const a = inputs(); const before = calculateTravelValue(a);
    a.interactionsPerGuest = 50; const after = calculateTravelValue(a);
    expect(after.interactions).toBeGreaterThan(before.interactions);
    expect(after.gross).toEqual(before.gross);
    expect(after.moments).toBe(before.moments);
    a.guestsPerRoom = 3;
    expect(calculateTravelValue(a).stays).toBe(before.stays);
  });
  it("keeps welfare and routine capacity outside the monetary sum", () => {
    const a = inputs(); const before = calculateTravelValue(a);
    a.moments.find(m => m.kind === "welfare")!.value = { low: 10000, base: 10000, high: 10000 };
    a.moments.find(m => m.kind === "welfare")!.minutesSaved = 120;
    a.moments.find(m => m.kind === "coordination")!.value = { low: 10000, base: 10000, high: 10000 };
    const after = calculateTravelValue(a);
    expect(after.gross).toEqual(before.gross);
    expect(after.rows.find(m => m.kind === "welfare")!.staffHours).toBe(0);
  });
  it("applies success rates, attribution, overlap and programme cost transparently", () => {
    const a = inputs(); a.incrementalShare = 0.4; a.overlapAllowance = 0.25; a.monthlyCost = 2000;
    const r = calculateTravelValue(a);
    expect(r.rows.find(m => m.kind === "recovery")!.gross.base).toBeCloseTo(72 * 0.8 * 80);
    expect(r.adjusted.base).toBeCloseTo(r.gross.base * 0.4 * 0.75);
    expect(r.net.base).toBeCloseTo(r.adjusted.base - 2000);
    expect(r.net.low).toBeLessThanOrEqual(r.net.base);
    expect(r.net.base).toBeLessThanOrEqual(r.net.high);
  });
  it("supports zero activity and negative net estimates", () => {
    const a = inputs(); a.occupancy = 0; a.monthlyCost = 1000;
    const r = calculateTravelValue(a);
    expect([r.stays, r.guests, r.interactions, r.moments, r.actions, r.staffHours]).toEqual([0, 0, 0, 0, 0, 0]);
    expect(r.net).toEqual({ low: -1000, base: -1000, high: -1000 });
  });
  it("allows activity without issues and makes zero rates hold their category", () => {
    const a = inputs(); a.moments.find(m => m.kind === "recovery")!.momentsPer100Stays = 0;
    a.moments.find(m => m.kind === "opportunity")!.actionRate = 0;
    const r = calculateTravelValue(a);
    expect(r.moments).toBeGreaterThan(0);
    expect(r.staffHours).toBeGreaterThan(0);
    expect(r.rows.find(m => m.kind === "recovery")!.gross.base).toBe(0);
    expect(r.rows.find(m => m.kind === "opportunity")!.gross.base).toBe(0);
  });
  it("rejects invalid occupancy, duration, categories and unordered tiers", () => {
    for (const value of [NaN, Infinity, -0.1, 1.1]) {
      const a = inputs(); a.occupancy = value; expect(() => calculateTravelValue(a)).toThrow();
    }
    const a = inputs(); a.lengthOfStay = 0; expect(() => calculateTravelValue(a)).toThrow();
    const b = inputs(); b.moments[1].kind = "coordination"; expect(() => calculateTravelValue(b)).toThrow();
    const c = inputs(); c.moments[1].value!.low = 1000; expect(() => calculateTravelValue(c)).toThrow(/ordered/);
  });
});
