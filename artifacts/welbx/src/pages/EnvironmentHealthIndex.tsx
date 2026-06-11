import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  AreaChart, Area, XAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  green:  "#10b981",
  blue:   "#3b82f6",
  red:    "#ef4444",
  violet: "#a78bfa",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Types ───────────────────────────────────────────── */
type ScoreCategory = "Excellent" | "Healthy" | "Watch" | "At Risk";

function scoreCategory(s: number): ScoreCategory {
  if (s >= 90) return "Excellent";
  if (s >= 75) return "Healthy";
  if (s >= 60) return "Watch";
  return "At Risk";
}

function scoreColor(s: number): string {
  if (s >= 90) return C.green;
  if (s >= 75) return C.amber;
  if (s >= 60) return "#f97316";
  return C.red;
}

function categoryColor(cat: ScoreCategory): string {
  if (cat === "Excellent") return C.green;
  if (cat === "Healthy") return C.amber;
  if (cat === "Watch") return "#f97316";
  return C.red;
}

/* ─── 30-day spark data generator ───────────────────────── */
function spark(base: number, variance: number, days = 30) {
  const result: { d: number; v: number }[] = [];
  let current = base - variance * 0.5;
  for (let i = 0; i < days; i++) {
    current = Math.min(100, Math.max(0, current + (Math.random() - 0.42) * variance));
    result.push({ d: i + 1, v: Math.round(current) });
  }
  result[days - 1].v = base;
  return result;
}

/* ─── Dimension data ─────────────────────────────────── */
const DIMENSIONS = [
  {
    id: "signal",
    label: "Signal Health",
    sub: "SENSING LAYER",
    score: 82,
    color: C.amber,
    description: "Quality and completeness of incoming behavioural signals",
    data: spark(82, 8),
  },
  {
    id: "moment",
    label: "Moment Health",
    sub: "DETECTION LAYER",
    score: 76,
    color: C.blue,
    description: "Accuracy and timeliness of moment detection and classification",
    data: spark(76, 10),
  },
  {
    id: "decision",
    label: "Decision Health",
    sub: "INTELLIGENCE LAYER",
    score: 88,
    color: C.violet,
    description: "Confidence and outcome quality of automated and human decisions",
    data: spark(88, 6),
  },
  {
    id: "execution",
    label: "Execution Health",
    sub: "RESPONSE LAYER",
    score: 91,
    color: C.green,
    description: "Playbook execution fidelity and staff response consistency",
    data: spark(91, 5),
  },
  {
    id: "communication",
    label: "Communication Health",
    sub: "DELIVERY LAYER",
    score: 71,
    color: "#f97316",
    description: "Message delivery speed, clarity, and acknowledgement rates",
    data: spark(71, 12),
  },
  {
    id: "activation",
    label: "Activation Health",
    sub: "OUTCOME LAYER",
    score: 84,
    color: C.amber,
    description: "Staff activation rates and commercial trigger conversion",
    data: spark(84, 7),
  },
];

const DEFAULT_WEIGHTS: Record<string, number> = Object.fromEntries(
  DIMENSIONS.map(d => [d.id, 100])
);

const LS_KEY = "welbx_env_weights";

function loadWeights(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_WEIGHTS };
    const parsed = JSON.parse(raw) as Record<string, number>;
    // ensure all dimension ids present
    const merged = { ...DEFAULT_WEIGHTS };
    for (const id of Object.keys(DEFAULT_WEIGHTS)) {
      if (typeof parsed[id] === "number") merged[id] = Math.max(0, Math.min(100, parsed[id]));
    }
    return merged;
  } catch {
    return { ...DEFAULT_WEIGHTS };
  }
}

function computeWeightedScore(weights: Record<string, number>): number {
  const totalWeight = DIMENSIONS.reduce((s, d) => s + weights[d.id], 0);
  if (totalWeight === 0) return 0;
  const weighted = DIMENSIONS.reduce((s, d) => s + d.score * weights[d.id], 0);
  return Math.round(weighted / totalWeight);
}

/* ─── Risk Areas ─────────────────────────────────────── */
const RISK_AREAS = [
  {
    severity: "HIGH",
    color: C.red,
    dimension: "Communication Health",
    factor: "Message acknowledgement rate",
    detail: "Only 61% of dispatched communications are confirmed as read within the expected window. Staff channel reliability is below threshold.",
    impact: "−9 pts on Communication Health",
  },
  {
    severity: "MEDIUM",
    color: "#f97316",
    dimension: "Moment Health",
    factor: "Late-shift detection lag",
    detail: "Moment classification latency increases by an average of 38% between 22:00 and 06:00, reducing the intervention window for overnight events.",
    impact: "−7 pts on Moment Health",
  },
  {
    severity: "MEDIUM",
    color: "#f97316",
    dimension: "Signal Health",
    factor: "F&B signal gap",
    detail: "Dining-area behavioural signal coverage is incomplete for the lounge and bar zones. Three sensing nodes offline for 6+ days.",
    impact: "−6 pts on Signal Health",
  },
  {
    severity: "LOW",
    color: C.blue,
    dimension: "Decision Health",
    factor: "Low-confidence escalation rate",
    detail: "12% of automated decisions are being escalated due to confidence scores below 70%, slightly above the 8% target threshold.",
    impact: "−4 pts on Decision Health",
  },
];

/* ─── Improvement Opportunities ─────────────────────── */
const IMPROVEMENTS = [
  {
    dimension: "Communication Health",
    color: C.red,
    action: "Audit and restore staff communication channel reliability",
    rationale: "Restoring acknowledgement rates to the 90%+ target would add ~9 points to Communication Health and lift the overall Environment Score by ~1.5 points.",
    effort: "Low",
    impact: "High",
    owner: "Operations Manager",
  },
  {
    dimension: "Moment Health",
    color: "#f97316",
    action: "Enable overnight detection accelerator in BXOS",
    rationale: "Activating the overnight classification fast-path reduces late-shift latency by an estimated 60%, closing the detection lag gap.",
    effort: "Low",
    impact: "Medium",
    owner: "BXOS Configuration",
  },
  {
    dimension: "Signal Health",
    color: C.amber,
    action: "Restore offline sensing nodes in lounge and bar zones",
    rationale: "Three offline nodes have been degrading F&B signal coverage for 6 days. Restoration closes the coverage gap and improves signal completeness to 97%+.",
    effort: "Medium",
    impact: "Medium",
    owner: "Engineering Lead",
  },
  {
    dimension: "Decision Health",
    color: C.violet,
    action: "Recalibrate confidence thresholds for hospitality edge cases",
    rationale: "Tightening the escalation trigger from 70% to 65% confidence would reduce unnecessary human escalations by ~40% without materially reducing decision accuracy.",
    effort: "Medium",
    impact: "Low",
    owner: "BXOS Intelligence",
  },
];

/* ─── Tooltip ─────────────────────────────────────────── */
function SparkTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "hsl(220 13% 10%)",
      border: "1px solid hsl(220 13% 16%)",
      padding: "5px 9px",
      fontSize: 10,
      color: "#fff",
      fontWeight: 700,
    }}>
      {payload[0].value}
    </div>
  );
}

/* ─── Sparkline ───────────────────────────────────────── */
function Sparkline({ data, color, id }: { data: { d: number; v: number }[]; color: string; id: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sgrad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Tooltip content={<SparkTooltip />} />
        <Area
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          fill={`url(#sgrad-${id})`}
          dot={false} activeDot={{ r: 2.5, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Trend area chart (larger) ───────────────────────── */
function TrendArea({ d }: { d: typeof DIMENSIONS[0] }) {
  const cat = scoreCategory(d.score);
  const col = scoreColor(d.score);
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      padding: "18px 20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
            {d.sub}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
            {d.label}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: col, letterSpacing: "-0.02em", lineHeight: 1 }}>
            {d.score}
          </div>
          <div style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em",
            color: col, textTransform: "uppercase", marginTop: 3,
            border: `1px solid ${col}33`,
            padding: "1px 6px",
            background: `${col}0d`,
            display: "inline-block",
          }}>
            {cat}
          </div>
        </div>
      </div>
      <div style={{ height: 80 }}>
        <Sparkline data={d.data} color={d.color} id={`trend-${d.id}`} />
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ flex: 1, height: 1, background: `${d.color}30` }} />
        <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>30-day trajectory</span>
        <div style={{ flex: 1, height: 1, background: `${d.color}30` }} />
      </div>
    </div>
  );
}

/* ─── Dimension card ─────────────────────────────────── */
function DimensionCard({ d, i }: { d: typeof DIMENSIONS[0]; i: number }) {
  const cat = scoreCategory(d.score);
  const col = scoreColor(d.score);
  const [, navigate] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + i * 0.06, duration: 0.35 }}
      onClick={() => navigate(`/environment-health/${d.id}`)}
      whileHover={{ scale: 1.005 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${col}`,
        padding: "20px 22px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute", top: 10, right: 14,
        fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em",
        color: C.dimmed, textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        Details →
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
            {d.sub}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
            {d.label}
          </div>
          <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
            {d.description}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 16, textAlign: "right", marginTop: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: col, letterSpacing: "-0.025em", lineHeight: 1 }}>
            {d.score}
          </div>
          <div style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em",
            color: col, textTransform: "uppercase", marginTop: 4,
            border: `1px solid ${col}33`,
            padding: "2px 7px",
            background: `${col}0d`,
            display: "inline-block",
          }}>
            {cat}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ height: 3, background: "hsl(220 13% 11%)", position: "relative", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${d.score}%` }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: "easeOut" }}
            style={{ height: "100%", background: col, position: "absolute", top: 0, left: 0 }}
          />
        </div>
      </div>

      <div style={{ height: 48 }}>
        <Sparkline data={d.data} color={d.color} id={d.id} />
      </div>
    </motion.div>
  );
}

/* ─── Overall score dial ─────────────────────────────── */
function OverallScoreDisplay({
  score,
  weights,
  onConfigureWeights,
}: {
  score: number;
  weights: Record<string, number>;
  onConfigureWeights: () => void;
}) {
  const cat = scoreCategory(score);
  const col = categoryColor(cat);
  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - score / 100);

  const totalWeight = DIMENSIONS.reduce((s, d) => s + weights[d.id], 0);
  const isCustom = DIMENSIONS.some(d => weights[d.id] !== 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      {/* SVG arc */}
      <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="56"
            fill="none"
            stroke="hsl(220 13% 10%)"
            strokeWidth="8"
          />
          <motion.circle
            cx="70" cy="70" r="56"
            fill="none"
            stroke={col}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <motion.div
            key={score}
            animate={{ opacity: [0.4, 1] }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 36, fontWeight: 900, color: col, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            {score}
          </motion.div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 3 }}>
            / 100
          </div>
        </div>
      </div>

      {/* Category + breakdown */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
            color: col, textTransform: "uppercase",
            border: `1px solid ${col}44`,
            padding: "4px 12px",
            background: `${col}10`,
            display: "inline-block",
          }}>
            {cat}
          </div>
          {isCustom && (
            <div style={{
              fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
              color: C.amber, textTransform: "uppercase",
              border: `1px solid ${C.amber}33`,
              padding: "3px 8px",
              background: `${C.amber}0d`,
            }}>
              Custom Weights
            </div>
          )}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Overall Environment Score
        </div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, maxWidth: 340 }}>
          {isCustom
            ? "Weighted composite of six operational health dimensions based on your configured priorities."
            : "Composite of six operational health dimensions. Updated continuously as signals, decisions, and outcomes are logged by BXOS."}
        </div>

        {/* Mini breakdown bars */}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
          {DIMENSIONS.map(dim => {
            const dc = scoreColor(dim.score);
            const wPct = totalWeight > 0 ? Math.round((weights[dim.id] / totalWeight) * 100) : 0;
            return (
              <div key={dim.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 120, fontSize: 9, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
                  {dim.label.replace(" Health", "")}
                </div>
                <div style={{ flex: 1, height: 3, background: "hsl(220 13% 10%)" }}>
                  <motion.div
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ height: "100%", background: dc }}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: dc, minWidth: 24, textAlign: "right" }}>
                  {dim.score}
                </span>
                {isCustom && (
                  <span style={{ fontSize: 8, color: C.dimmed, minWidth: 28, textAlign: "right" }}>
                    {wPct}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Configure weights button */}
      <div style={{ flexShrink: 0, alignSelf: "flex-start" }}>
        <button
          onClick={onConfigureWeights}
          style={{
            background: "hsl(220 13% 10%)",
            border: `1px solid ${C.border}`,
            color: C.muted,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "8px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.amber;
            (e.currentTarget as HTMLButtonElement).style.color = C.amber;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
            (e.currentTarget as HTMLButtonElement).style.color = C.muted;
          }}
        >
          <span style={{ fontSize: 10 }}>⚖</span>
          Configure Weights
        </button>
      </div>
    </div>
  );
}

/* ─── Weight Configuration Panel ─────────────────────── */
function WeightsPanel({
  weights,
  onWeightsChange,
  onClose,
}: {
  weights: Record<string, number>;
  onWeightsChange: (w: Record<string, number>) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Record<string, number>>({ ...weights });

  const totalWeight = DIMENSIONS.reduce((s, d) => s + local[d.id], 0);
  const previewScore = computeWeightedScore(local);
  const previewCat = scoreCategory(previewScore);
  const previewCol = categoryColor(previewCat);

  const handleSlider = useCallback((id: string, val: number) => {
    setLocal(prev => {
      const next = { ...prev, [id]: val };
      onWeightsChange(next);
      return next;
    });
  }, [onWeightsChange]);

  const handleReset = () => {
    setLocal({ ...DEFAULT_WEIGHTS });
    onWeightsChange({ ...DEFAULT_WEIGHTS });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 360,
        background: "hsl(220 13% 6%)",
        borderLeft: `1px solid ${C.border}`,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 5 }}>
              Score Configuration
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
              Dimension Weights
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.muted,
              fontSize: 12,
              fontWeight: 700,
              width: 28,
              height: 28,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
          Adjust how much each dimension contributes to the overall Environment Score. Weights are relative — higher values increase a dimension's influence.
        </div>
      </div>

      {/* Live score preview */}
      <div style={{
        padding: "14px 24px",
        borderBottom: `1px solid ${C.border}`,
        background: "hsl(220 13% 5%)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <motion.span
            key={previewScore}
            animate={{ opacity: [0.3, 1], scale: [0.95, 1] }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 32, fontWeight: 900, color: previewCol, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            {previewScore}
          </motion.span>
          <span style={{ fontSize: 10, color: C.dimmed, fontWeight: 600 }}>/100</span>
        </div>
        <div>
          <div style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
            color: previewCol, textTransform: "uppercase",
            border: `1px solid ${previewCol}44`,
            padding: "2px 8px",
            background: `${previewCol}10`,
            display: "inline-block",
            marginBottom: 4,
          }}>
            {previewCat}
          </div>
          <div style={{ fontSize: 9, color: C.muted }}>
            Live preview · updates as you adjust
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div style={{ fontSize: 8.5, color: C.dimmed, textAlign: "right", marginBottom: 2 }}>
            Total weight
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: totalWeight === 0 ? C.red : C.muted }}>
            {totalWeight}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {DIMENSIONS.map((dim, i) => {
          const w = local[dim.id];
          const totalW = DIMENSIONS.reduce((s, d) => s + local[d.id], 0);
          const effectivePct = totalW > 0 ? Math.round((w / totalW) * 100) : 0;
          const dc = scoreColor(dim.score);

          return (
            <div
              key={dim.id}
              style={{
                padding: "14px 24px",
                borderBottom: `1px solid ${C.border}`,
                background: i % 2 === 0 ? "transparent" : "hsl(220 13% 5%)",
              }}
            >
              {/* Dimension header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 3 }}>
                    {dim.sub}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    {dim.label}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: dc, lineHeight: 1 }}>
                    {dim.score}
                  </div>
                  <div style={{ fontSize: 8, color: C.dimmed, marginTop: 2 }}>
                    score
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div style={{ marginBottom: 8 }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={w}
                  onChange={e => handleSlider(dim.id, Number(e.target.value))}
                  style={{
                    width: "100%",
                    appearance: "none",
                    height: 3,
                    background: `linear-gradient(to right, ${dim.color} ${w}%, hsl(220 13% 14%) ${w}%)`,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Readout row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                      Weight
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: w === 0 ? C.dimmed : "#fff" }}>
                      {w}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                      Influence
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 800,
                      color: w === 0 ? C.dimmed : dim.color,
                    }}>
                      {effectivePct}%
                    </div>
                  </div>
                </div>
                {w === 0 && (
                  <div style={{
                    fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
                    color: C.dimmed, textTransform: "uppercase",
                    border: `1px solid ${C.border}`,
                    padding: "2px 7px",
                  }}>
                    Excluded
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div style={{
        padding: "14px 24px",
        borderTop: `1px solid ${C.border}`,
        flexShrink: 0,
        display: "flex",
        gap: 8,
      }}>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.muted,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "9px 0",
            cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.muted; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; }}
        >
          Reset to Equal
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            background: `${C.amber}18`,
            border: `1px solid ${C.amber}55`,
            color: C.amber,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "9px 0",
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function EnvironmentHealthIndex() {
  const [weights, setWeights] = useState<Record<string, number>>(loadWeights);
  const [panelOpen, setPanelOpen] = useState(false);

  const overallScore = computeWeightedScore(weights);

  const handleWeightsChange = useCallback((w: Record<string, number>) => {
    setWeights(w);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(w));
    } catch {
      /* ignore */
    }
  }, []);

  // close panel on Escape
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen]);

  const heroColor = categoryColor(scoreCategory(overallScore));

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Environment Intelligence
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            Environment Health Index
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
            The Health Of The Environment Determines The Quality Of Outcomes.
          </p>
        </motion.div>

        {/* ── Overall score hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38 }}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderTop: `2px solid ${heroColor}`,
            padding: "28px 32px",
            marginBottom: 32,
          }}
        >
          <OverallScoreDisplay
            score={overallScore}
            weights={weights}
            onConfigureWeights={() => setPanelOpen(true)}
          />
        </motion.div>

        {/* ── Six dimension cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.38 }}
          style={{ marginBottom: 4 }}
        >
          <div style={{
            padding: "10px 20px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderBottom: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              Health Dimensions
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              6 dimensions · Live
            </span>
          </div>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          marginBottom: 32,
        }}>
          {DIMENSIONS.map((d, i) => (
            <DimensionCard key={d.id} d={d} i={i} />
          ))}
        </div>

        {/* ── Trends section ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.38 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{
            padding: "10px 20px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderBottom: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              Dimension Score Trends
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Last 30 days
            </span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}>
            {DIMENSIONS.map(d => (
              <TrendArea key={d.id} d={d} />
            ))}
          </div>
        </motion.div>

        {/* ── Risk Areas + Improvement Opportunities ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
        >
          {/* Risk Areas */}
          <div>
            <div style={{
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderBottom: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Risk Areas
              </span>
              <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {RISK_AREAS.length} active
              </span>
            </div>
            {RISK_AREAS.map((r, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${r.color}`,
                borderTopWidth: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{
                    fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
                    color: r.color, border: `1px solid ${r.color}33`,
                    padding: "2px 7px", background: `${r.color}0d`,
                    textTransform: "uppercase",
                  }}>
                    {r.severity}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.muted }}>{r.dimension}</span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.4 }}>
                  {r.factor}
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>
                  {r.detail}
                </div>
                <div style={{ fontSize: 8, fontWeight: 700, color: r.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {r.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Improvement Opportunities */}
          <div>
            <div style={{
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderBottom: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Improvement Opportunities
              </span>
              <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {IMPROVEMENTS.length} actions
              </span>
            </div>
            {IMPROVEMENTS.map((o, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${o.color}`,
                borderTopWidth: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: o.color }}>{o.dimension}</span>
                  <span style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                    <span style={{
                      fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                      color: o.impact === "High" ? C.green : o.impact === "Medium" ? C.amber : C.muted,
                      border: `1px solid ${o.impact === "High" ? C.green + "33" : o.impact === "Medium" ? C.amber + "33" : "transparent"}`,
                      padding: "1px 5px",
                      background: o.impact === "High" ? C.green + "0d" : o.impact === "Medium" ? C.amber + "0d" : "transparent",
                      textTransform: "uppercase",
                    }}>
                      Impact: {o.impact}
                    </span>
                    <span style={{
                      fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                      color: o.effort === "Low" ? C.green : C.muted,
                      border: `1px solid ${o.effort === "Low" ? C.green + "33" : "transparent"}`,
                      padding: "1px 5px",
                      background: o.effort === "Low" ? C.green + "0d" : "transparent",
                      textTransform: "uppercase",
                    }}>
                      Effort: {o.effort}
                    </span>
                  </span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.4 }}>
                  {o.action}
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>
                  {o.rationale}
                </div>
                <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Owner: {o.owner}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Backdrop + Weights Panel ── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setPanelOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 65,
              }}
            />
            <WeightsPanel
              key="panel"
              weights={weights}
              onWeightsChange={handleWeightsChange}
              onClose={() => setPanelOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
