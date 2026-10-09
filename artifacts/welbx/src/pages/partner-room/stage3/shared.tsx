import type { ReactNode } from "react";
import type { Confirmation } from "@/lib/stage3Simulation";

export function Stepper({ steps, step }: { steps: string[]; step: number }) {
  return (
    <ol className="s3-stepper" aria-label="Scenario progress">
      {steps.map((label, i) => (
        <li key={label} className="s3-step-item" data-completed={step > i} aria-current={step === i ? "step" : undefined}>
          <span className="s3-step-indicator">{i + 1}</span>
          <span className="s3-step-label">{label}<span className="sr-only">{step > i ? " (complete)" : step === i ? " (current)" : " (locked)"}</span></span>
        </li>
      ))}
    </ol>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div>
      <div className="s3-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label="Scenario reading progress">
        <div style={{ width: `${pct}%` }} />
      </div>
      <div className="s3-progress-text">Step {step + 1} of {total}</div>
    </div>
  );
}

export function Boundary({ children }: { children?: ReactNode }) {
  return (
    <p className="s3-boundary">
      <strong>Fictional demonstration.</strong> No real guests, staff, bookings, messages or actions. Nothing is saved or sent. {children}
    </p>
  );
}

export function Checks({ items, checked, onToggle, prefix }: { items: Confirmation[]; checked: string[]; onToggle: (id: string) => void; prefix: string }) {
  const missing = items.filter(i => !checked.includes(i.id));
  return (
    <>
      <ul className="s3-checks">
        {items.map(c => (
          <li key={c.id}>
            <label className="s3-check" data-on={checked.includes(c.id)}>
              <input type="checkbox" data-testid={`${prefix}-${c.id}`} checked={checked.includes(c.id)} onChange={() => onToggle(c.id)} />
              <span>{c.label}<small>Accountable owner: {c.owner}</small></span>
            </label>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <p className={`s3-hold ${missing.length === 0 ? "s3-ok" : ""}`} role="status">
          {missing.length === 0 ? "All individual confirmations recorded. Next is available." : `On hold: ${missing.length} of ${items.length} confirmations missing (${missing.map(m => m.owner).join("; ")}).`}
        </p>
      )}
    </>
  );
}

export function Opt({ on, onClick, title, children, testid }: { on: boolean; onClick: () => void; title: string; children: ReactNode; testid: string }) {
  return (
    <button type="button" className="s3-opt" aria-pressed={on} onClick={onClick} data-testid={testid}>
      <h4>{title}</h4>{children}
    </button>
  );
}

export function Table({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption: string }) {
  return (
    <div className="s3-tbl-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="s3-tbl">
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
