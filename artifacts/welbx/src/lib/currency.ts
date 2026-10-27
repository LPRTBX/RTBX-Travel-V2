/**
 * The currency a visitor works in for the Value Calculator and the pilot scope.
 * A display label only: amounts are entered and shown in this currency and never converted.
 */
export const CURRENCIES = [
  { code: "AUD", symbol: "A$", name: "Australian dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand dollar" },
  { code: "USD", symbol: "US$", name: "US dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore dollar" },
  { code: "GBP", symbol: "£", name: "Pound sterling" },
  { code: "EUR", symbol: "€", name: "Euro" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "AUD";

export function currencyInfo(code: CurrencyCode) {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

/** Whole units with the currency symbol, e.g. "A$1,240" or "−€80". Without a currency, a bare "$" as before. */
export function formatMoney(amount: number, code?: CurrencyCode, minus = "−"): string {
  const symbol = code ? currencyInfo(code).symbol : "$";
  return `${amount < 0 ? minus : ""}${symbol}${Math.round(Math.abs(amount)).toLocaleString("en-AU")}`;
}
