import { describe, expect, it } from "vitest";
import { CURRENCIES, DEFAULT_CURRENCY, currencyInfo, formatMoney } from "./currency";
import { scopeSummary, defaultPilotScope } from "./pilotScope";

describe("currency display", () => {
  it("labels money with the chosen currency and never converts it", () => {
    expect(formatMoney(1240, "AUD")).toBe("A$1,240");
    expect(formatMoney(1240, "EUR")).toBe("€1,240");
    expect(formatMoney(-80.4, "GBP")).toBe("−£80");
    expect(formatMoney(1240.6, "USD")).toBe("US$1,241");
  });

  it("keeps the previous bare-dollar format when no currency is given", () => {
    expect(formatMoney(1000)).toBe("$1,000");
    expect(formatMoney(-5, undefined, "-")).toBe("-$5");
  });

  it("offers each currency once, with a default", () => {
    expect(new Set(CURRENCIES.map(c => c.code)).size).toBe(CURRENCIES.length);
    expect(currencyInfo(DEFAULT_CURRENCY).code).toBe(DEFAULT_CURRENCY);
  });

  it("carries the calculator's currency into the pilot scope summary", () => {
    const summary = scopeSummary(defaultPilotScope(), { sites: 1, roomsPerSite: 120, lowMonthly: 1000, baseMonthly: 2000, highMonthly: 4000, costIncluded: true, currency: "NZD" });
    expect(summary).toMatch(/NZ\$1,000 \/ NZ\$2,000 \/ NZ\$4,000 .*\(low \/ base \/ high\) in NZD/);
  });
});
