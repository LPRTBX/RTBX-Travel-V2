import { useId, useState } from "react";
import { parseNumericDraft, resolveNumericDraft } from "@/lib/numericDraft";

interface NumberFieldProps {
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
  "aria-label": string;
  className?: string;
  /** False when a partial value would disturb related inputs (e.g. ordered low/base/high tiers). */
  commitWhileTyping?: boolean;
}

/**
 * Exact numeric entry. In-range values apply as you type; anything else is held
 * as a draft with a visible range message and resolved on blur or Enter.
 */
export function NumberField({ value, min, max, onCommit, "aria-label": ariaLabel, className, commitWhileTyping = true }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const hintId = useId();
  const parsed = draft === null ? null : parseNumericDraft(draft, min, max);
  const showHint = parsed !== null && parsed.status !== "valid" && parsed.status !== "empty";

  const finish = () => {
    if (draft === null) return;
    const next = resolveNumericDraft(draft, value, min, max);
    if (next !== value) onCommit(next);
    setDraft(null);
  };

  return <>
    <input
      type="text"
      inputMode="decimal"
      className={className}
      aria-label={ariaLabel}
      aria-invalid={showHint || undefined}
      aria-describedby={showHint ? hintId : undefined}
      value={draft ?? String(value)}
      onFocus={e => e.currentTarget.select()}
      onChange={e => {
        const raw = e.target.value;
        setDraft(raw);
        const next = parseNumericDraft(raw, min, max);
        if (commitWhileTyping && next.status === "valid" && next.value !== null && next.value !== value) onCommit(next.value);
      }}
      onBlur={finish}
      onKeyDown={e => {
        if (e.key === "Enter") { e.preventDefault(); finish(); }
        if (e.key === "Escape") setDraft(null);
      }}
    />
    {showHint && <span id={hintId} role="status" className="number-field-hint">Enter {min.toLocaleString()}–{max.toLocaleString()}</span>}
  </>;
}
