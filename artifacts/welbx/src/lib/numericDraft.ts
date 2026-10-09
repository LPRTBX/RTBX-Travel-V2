/**
 * Parsing for typed numeric entry. Values are only clamped when editing ends,
 * so intermediate keystrokes (e.g. "3" on the way to "30" with a minimum of 28)
 * are never rewritten.
 */
export type DraftStatus = "valid" | "empty" | "invalid" | "out-of-range";

export interface ParsedDraft {
  status: DraftStatus;
  value: number | null;
}

export function parseNumericDraft(raw: string, min: number, max: number): ParsedDraft {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return { status: "empty", value: null };
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(trimmed)) return { status: "invalid", value: null };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { status: "invalid", value: null };
  if (value < min || value > max) return { status: "out-of-range", value };
  return { status: "valid", value };
}

/** Value to keep when editing ends: in-range values as typed, out-of-range clamped, empty or invalid reverts. */
export function resolveNumericDraft(raw: string, current: number, min: number, max: number): number {
  const parsed = parseNumericDraft(raw, min, max);
  if (parsed.value === null) return current;
  return Math.min(max, Math.max(min, parsed.value));
}
