import { motion } from "framer-motion";
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
  if (s >= 60) return "#f97316"; // orange
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
  // nudge last point to be the target score
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

const OVERALL_SCORE = Math.round(
  DIMENSIONS.reduce((sum, d) => sum + d.score, 0) / DIMENSIONS.length
);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + i * 0.06, duration: 0.35 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${col}`,
        padding: "20px 22px",
      }}
    >
      {/* Header */}
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
        <div style={{ flexShrink: 0, marginLeft: 16, textAlign: "right" }}>
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

      {/* Score bar */}
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

      {/* Sparkline */}
      <div style={{ height: 48 }}>
        <Sparkline data={d.data} color={d.color} id={d.id} />
      </div>
    </motion.div>
  );
}

/* ─── Overall score dial ─────────────────────────────── */
function OverallScoreDisplay({ score }: { score: number }) {
  const cat = scoreCategory(score);
  const col = categoryColor(cat);
  const circumference = 2 * Math.PI * 56;
  const dashOffset = circumference * (1 - score / 100);

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
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: col, letterSpacing: "-0.04em", lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 3 }}>
            / 100
          </div>
        </div>
      </div>

      {/* Category + breakdown */}
      <div>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
          color: col, textTransform: "uppercase",
          border: `1px solid ${col}44`,
          padding: "4px 12px",
          background: `${col}10`,
          display: "inline-block",
          marginBottom: 10,
        }}>
          {cat}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Overall Environment Score
        </div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, maxWidth: 340 }}>
          Composite of six operational health dimensions. Updated continuously as signals, decisions, and outcomes are logged by BXOS.
        </div>

        {/* Mini breakdown bars */}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
          {DIMENSIONS.map(dim => {
            const dc = scoreColor(dim.score);
            return (
              <div key={dim.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 120, fontSize: 9, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
                  {dim.label.replace(" Health", "")}
                </div>
                <div style={{ flex: 1, height: 3, background: "hsl(220 13% 10%)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    style={{ height: "100%", background: dc }}
                  />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: dc, minWidth: 24, textAlign: "right" }}>
                  {dim.score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function EnvironmentHealthIndex() {
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
            borderTop: `2px solid ${categoryColor(scoreCategory(OVERALL_SCORE))}`,
            padding: "28px 32px",
            marginBottom: 32,
          }}
        >
          <OverallScoreDisplay score={OVERALL_SCORE} />
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
    </div>
  );
}
