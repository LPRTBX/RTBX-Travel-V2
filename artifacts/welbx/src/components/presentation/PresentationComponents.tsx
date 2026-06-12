import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, X, Printer } from "lucide-react";

export const C = {
  bg:     "hsl(220 13% 5%)",
  card:   "hsl(220 13% 8%)",
  card2:  "hsl(220 13% 11%)",
  border: "hsl(220 13% 11%)",
  amber:  "#c9a84c",
  white:  "#ffffff",
  muted:  "hsl(215 16% 52%)",
  dimmed: "hsl(215 16% 28%)",
  green:  "#10b981",
  blue:   "#3b82f6",
  red:    "#ef4444",
  violet: "#a78bfa",
  cyan:   "#22d3ee",
};

export const FOOTER = "WELBX Behavioural Infrastructure  |  The Operating Layer Between Signal And Action";

/* ─── Slide Shell ─────────────────────────────────────────────────── */
export function PresentationSlide({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        padding: "44px 64px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.amber} 0%, transparent 55%)` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: `${C.amber}04`, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────────────── */
export function SlideHeader({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.24em", color: C.white, textTransform: "uppercase" }}>WELBX</span>
        {label && (
          <>
            <span style={{ color: C.dimmed, fontSize: 10 }}>·</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase" }}>{label}</span>
          </>
        )}
      </div>
      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>BEHAVIOURAL INFRASTRUCTURE</span>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────── */
export function SlideFooter({ slide, total }: { slide: number; total: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginTop: "auto", paddingTop: 20,
      borderTop: `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>{FOOTER}</span>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", color: C.dimmed }}>{slide} / {total}</span>
    </div>
  );
}

/* ─── Framework Flow ──────────────────────────────────────────────── */
interface FlowStep { label: string; sub?: string; color?: string; }

export function FrameworkFlow({ steps, vertical, gap }: { steps: FlowStep[]; vertical?: boolean; gap?: number }) {
  if (vertical) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
        {steps.map((step, i) => (
          <div key={i}>
            <div style={{
              padding: "11px 22px",
              border: `1px solid ${(step.color ?? C.amber)}33`,
              background: `${(step.color ?? C.amber)}07`,
              minWidth: 220,
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", color: step.color ?? C.amber, textTransform: "uppercase" }}>{step.label}</span>
              {step.sub && <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{step.sub}</div>}
            </div>
            {i < steps.length - 1 && (
              <div style={{ padding: "3px 22px", color: C.amber, fontSize: 13, opacity: 0.5, lineHeight: 1 }}>↓</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: 0 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            padding: `13px ${gap ?? 20}px`,
            border: `1px solid ${(step.color ?? C.amber)}40`,
            background: `${(step.color ?? C.amber)}08`,
            textAlign: "center",
            minWidth: 90,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", color: step.color ?? C.amber, textTransform: "uppercase" }}>{step.label}</div>
            {step.sub && <div style={{ fontSize: 7.5, color: C.muted, marginTop: 3, letterSpacing: "0.05em" }}>{step.sub}</div>}
          </div>
          {i < steps.length - 1 && (
            <span style={{ color: C.amber, fontSize: 16, padding: "0 6px", opacity: 0.5 }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Screenshot Card ─────────────────────────────────────────────── */
export function ScreenshotCard({ title, subtitle, children, flex, minHeight }: {
  title: string; subtitle?: string; children: ReactNode; flex?: number; minHeight?: number;
}) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      flex: flex ?? 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: minHeight,
    }}>
      <div style={{
        padding: "9px 14px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.amber, flexShrink: 0 }} />
          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase" }}>{title}</span>
        </div>
        {subtitle && <span style={{ fontSize: 7, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>{subtitle}</span>}
      </div>
      <div style={{ flex: 1, padding: "12px 14px", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Impact Card ─────────────────────────────────────────────────── */
export function ImpactCard({ category, color, items }: { category: string; color: string; items: string[] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${color}1A`, padding: "18px 20px", flex: 1 }}>
      <div style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: "0.22em", color, textTransform: "uppercase", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${color}18` }}>
        {category}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: C.muted, lineHeight: 1.45 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Executive Metric Card ───────────────────────────────────────── */
export function ExecutiveMetricCard({ label, value, delta, note, color }: {
  label: string; value: string; delta?: string; note?: string; color?: string;
}) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "18px 22px", flex: 1 }}>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 9 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", color: color ?? C.white, lineHeight: 1 }}>{value}</div>
      {delta && <div style={{ fontSize: 9.5, color: C.green, marginTop: 6, fontWeight: 600 }}>{delta}</div>}
      {note && <div style={{ fontSize: 7.5, color: C.dimmed, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{note}</div>}
    </div>
  );
}

/* ─── Row ─────────────────────────────────────────────────────────── */
export function DataRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 9.5, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 9.5, fontWeight: 600, color: accent ?? C.white }}>{value}</span>
    </div>
  );
}

/* ─── Pill Badge ──────────────────────────────────────────────────── */
export function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "2px 8px",
      border: `1px solid ${color}44`,
      background: `${color}10`,
      fontSize: 7.5,
      fontWeight: 700,
      letterSpacing: "0.12em",
      color,
      textTransform: "uppercase" as const,
    }}>
      {label}
    </span>
  );
}

/* ─── Slide Navigation ────────────────────────────────────────────── */
export function SlideNav({ current, total, onPrev, onNext, onClose, onPrint, showExport = true, closeLabel }: {
  current: number; total: number;
  onPrev: () => void; onNext: () => void;
  onClose: () => void; onPrint: () => void;
  showExport?: boolean; closeLabel?: string;
}) {
  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    background: C.card, border: `1px solid ${C.border}`,
    color: C.muted, cursor: "pointer",
    transition: "all 0.15s",
  };

  return (
    <div
      className="no-print"
      style={{ position: "fixed", bottom: 28, right: 28, display: "flex", alignItems: "center", gap: 6, zIndex: 200 }}
    >
      {showExport && (
        <button
          onClick={onPrint}
          style={{ ...btnBase, gap: 6, padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.amber; (e.currentTarget as HTMLButtonElement).style.color = C.amber; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.muted; }}
        >
          <Printer size={10} /> Export PDF
        </button>
      )}
      <button onClick={onClose} style={{ ...btnBase, width: 32, height: 32 }}>
        <X size={12} />
      </button>
      <button onClick={onPrev} disabled={current === 0} style={{ ...btnBase, width: 32, height: 32, opacity: current === 0 ? 0.3 : 1, cursor: current === 0 ? "not-allowed" : "pointer" }}>
        <ChevronLeft size={13} />
      </button>
      <span style={{ fontSize: 10, color: C.dimmed, fontWeight: 600, minWidth: 38, textAlign: "center" }}>
        {current + 1} / {total}
      </span>
      <button onClick={onNext} disabled={current === total - 1} style={{ ...btnBase, width: 32, height: 32, opacity: current === total - 1 ? 0.3 : 1, cursor: current === total - 1 ? "not-allowed" : "pointer" }}>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

/* ─── Print Styles Injector ───────────────────────────────────────── */
export const PRINT_STYLES = `
  @media print {
    @page { size: A4 landscape; margin: 0; }
    .no-print { display: none !important; }
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .print-slide { page-break-after: always; page-break-inside: avoid; min-height: 100vh; }
  }
  @media screen {
    .print-only { display: none; }
  }
`;
