import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from "recharts";

/* ─── Palette ────────────────────────────────────────────── */
const C = {
  amber:   "#c9a84c",
  emerald: "#10b981",
  crimson: "#ef4444",
  blue:    "#3b82f6",
  violet:  "#a78bfa",
  border:  "hsl(220 13% 9%)",
  card:    "hsl(220 13% 7%)",
  bg:      "hsl(220 13% 5%)",
  muted:   "hsl(215 16% 36%)",
  dimmed:  "hsl(215 16% 22%)",
};

/* ─── Score colour helper ────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 80) return C.emerald;
  if (s >= 60) return C.amber;
  return C.crimson;
}

/* ─── Mock data ──────────────────────────────────────────── */
const METRICS = [
  {
    id: "visibility",
    label: "Visibility Score",
    score: 88,
    trend: [72, 76, 79, 82, 85, 88],
    trendDir: "up" as const,
    delta: "+16 pts",
    description: "Breadth and depth of real-time behavioural sensing across all guest and operational touchpoints.",
  },
  {
    id: "decision",
    label: "Decision Quality",
    score: 82,
    trend: [65, 68, 72, 76, 79, 82],
    trendDir: "up" as const,
    delta: "+17 pts",
    description: "Accuracy and confidence of automated routing decisions against subsequent outcome data.",
  },
  {
    id: "consistency",
    label: "Response Consistency",
    score: 91,
    trend: [71, 74, 79, 83, 89, 91],
    trendDir: "up" as const,
    delta: "+20 pts",
    description: "Percentage of moments resolved using the correct playbook action within the response window.",
  },
  {
    id: "recovery",
    label: "Recovery Performance",
    score: 76,
    trend: [58, 62, 66, 70, 73, 76],
    trendDir: "up" as const,
    delta: "+18 pts",
    description: "Success rate of service recovery interventions measured against guest sentiment shift post-action.",
  },
  {
    id: "activation",
    label: "Activation Success",
    score: 84,
    trend: [64, 68, 72, 77, 81, 84],
    trendDir: "up" as const,
    delta: "+20 pts",
    description: "Rate of staff-activation moments completed within the prescribed execution window.",
  },
];

const OVERALL_SCORE = 84;
const OVERALL_DELTA = "+3";
const OVERALL_DIR = "up";
const PERIODS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

/* ─── Improvement areas (lowest 2) ──────────────────────── */
const IMPROVEMENTS = [...METRICS]
  .sort((a, b) => a.score - b.score)
  .slice(0, 2)
  .map((m) => ({
    ...m,
    action: m.id === "recovery"
      ? "Expand service-recovery playbook coverage for rooms 4–6. Current resolution pathway lacks fallback escalation branch."
      : m.id === "decision"
      ? "Increase training signal volume for mid-tier loyalty moments. Decision confidence sits below threshold for edge-case routing."
      : "Review activation cadence for weekend arrival surges. Staffing alignment with moment triggers needs recalibration.",
  }));

/* ─── Radar data ─────────────────────────────────────────── */
const RADAR_DATA = METRICS.map((m) => ({
  subject: m.label.split(" ")[0],
  score: m.score,
  fullMark: 100,
}));

/* ─── Animated count-up ──────────────────────────────────── */
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return <>{val}</>;
}

/* ─── Custom tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 16%)",
      padding: "7px 11px", fontSize: 11, color: "#fff",
    }}>
      <div style={{ color: C.muted, marginBottom: 3, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value}</div>
    </div>
  );
}

/* ─── Metric score card ──────────────────────────────────── */
function MetricCard({ m, delay }: { m: typeof METRICS[0]; delay: number }) {
  const color = scoreColor(m.score);
  const chartData = m.trend.map((v, i) => ({ p: PERIODS[i], v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${color}`,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Label */}
      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 10 }}>
        {m.label}
      </div>

      {/* Score + delta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <div style={{ fontSize: 42, fontWeight: 900, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {m.score}
          <span style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginLeft: 2 }}>/100</span>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: C.emerald,
          padding: "3px 8px",
          background: `${C.emerald}12`,
          border: `1px solid ${C.emerald}30`,
          marginBottom: 2,
        }}>
          ↑ {m.delta}
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 3, background: "hsl(220 13% 11%)", marginBottom: 14 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${m.score}%` }}
          transition={{ delay: delay + 0.2, duration: 0.7, ease: "easeOut" }}
          style={{ height: "100%", background: color }}
        />
      </div>

      {/* Sparkline */}
      <div style={{ height: 56, marginBottom: 12 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="p" tick={{ fontSize: 7, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone" dataKey="v"
              stroke={color} strokeWidth={1.5}
              fill={`url(#grad-${m.id})`}
              dot={false} activeDot={{ r: 2.5, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Description */}
      <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
        {m.description}
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ExecutionIndex() {
  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Execution Intelligence
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
            EXECUTION INDEX
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em", maxWidth: 560 }}>
            A composite measurement of operational execution quality across five scored dimensions.
            Not activity volume — execution precision.
          </p>
        </motion.div>

        {/* ── Overall Score Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          style={{
            background: "hsl(220 13% 7%)",
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${C.amber}`,
            padding: "32px 40px",
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* Big score */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              Overall Execution Score
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 88, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <CountUp target={OVERALL_SCORE} duration={1400} />
              </span>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.muted }}>/100</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                padding: "5px 12px",
                background: `${C.emerald}14`,
                border: `1px solid ${C.emerald}35`,
                fontSize: 11, fontWeight: 800, color: C.emerald, letterSpacing: "0.06em",
              }}>
                ↑ +{OVERALL_DELTA} this period
              </div>
              <span style={{ fontSize: 10, color: C.muted }}>Strong execution. Improving across 5/5 dimensions.</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, alignSelf: "stretch", background: C.border, flexShrink: 0 }} />

          {/* Per-dimension summary bars */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {METRICS.map((m) => {
              const color = scoreColor(m.score);
              return (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 40px", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.04em" }}>{m.label}</div>
                  <div style={{ height: 4, background: "hsl(220 13% 11%)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", background: color }}
                    />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color, textAlign: "right" }}>{m.score}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Period label strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          style={{
            padding: "8px 40px",
            background: "hsl(220 13% 6%)",
            border: `1px solid ${C.border}`,
            borderTop: "none",
            marginBottom: 32,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>Period</span>
          <span style={{ fontSize: 8.5, color: "hsl(215 16% 30%)", letterSpacing: "0.08em" }}>Jan – Jun 2026 &nbsp;·&nbsp; 6-month trailing window</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            {[
              { label: "≥ 80", color: C.emerald },
              { label: "60–79", color: C.amber },
              { label: "< 60", color: C.crimson },
            ].map((leg) => (
              <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, background: leg.color }} />
                <span style={{ fontSize: 8, color: C.muted, letterSpacing: "0.08em" }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Five metric cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 32 }}>
          {METRICS.map((m, i) => (
            <MetricCard key={m.id} m={m} delay={0.2 + i * 0.07} />
          ))}
        </div>

        {/* ── Improvement Areas ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase" }}>
              Improvement Areas
            </div>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              2 Prioritised Dimensions
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {IMPROVEMENTS.map((imp, i) => {
              const color = scoreColor(imp.score);
              return (
                <motion.div
                  key={imp.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.62 + i * 0.08, duration: 0.38 }}
                  style={{
                    padding: "20px 22px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${C.amber}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase", marginBottom: 5 }}>
                        Priority {i + 1} · Improvement
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{imp.label}</div>
                    </div>
                    <div style={{
                      fontSize: 28, fontWeight: 900, color,
                      letterSpacing: "-0.03em", lineHeight: 1,
                    }}>
                      {imp.score}
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>/100</span>
                    </div>
                  </div>
                  <div style={{ height: 3, background: "hsl(220 13% 11%)", marginBottom: 14 }}>
                    <div style={{ width: `${imp.score}%`, height: "100%", background: color }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
                    {imp.action}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.amber, textTransform: "uppercase" }}>
                    → Recommended Action
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Executive Insight Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.45 }}
          style={{
            background: "hsl(220 13% 6%)",
            border: `1px solid ${C.amber}25`,
            padding: "36px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Left: insight copy */}
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 14 }}>
              Executive Insight Panel
            </div>
            <div style={{
              fontSize: 20, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 20,
            }}>
              "WELBX Measures Execution, Not Activity."
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                With an overall Execution Index of <strong style={{ color: "#fff" }}>{OVERALL_SCORE}/100</strong> — 
                up {OVERALL_DELTA} points this period — The Grand Meridian is operating in the upper performance tier 
                across all five dimensions. Response Consistency leads at <strong style={{ color: C.emerald }}>91</strong>, 
                reflecting near-uniform playbook adherence across every active moment.
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                Recovery Performance at <strong style={{ color: C.amber }}>76</strong> remains the primary lever for 
                score improvement. Targeted playbook expansion in this dimension represents the highest-yield 
                opportunity to advance the overall index above 87 within the next operating quarter.
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                Every point on this index represents a closed loop: a signal sensed, a decision made, an action 
                executed, and an outcome confirmed. This is what separates execution measurement from activity reporting.
              </p>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
              {[
                { label: "Leading Dimension", value: "Response Consistency", score: 91, color: C.emerald },
                { label: "Improvement Lever", value: "Recovery Performance", score: 76, color: C.amber },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: "12px 16px",
                  background: "hsl(220 13% 8%)",
                  border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${stat.color}`,
                  minWidth: 160,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.score}<span style={{ fontSize: 9, fontWeight: 600, color: C.muted }}>/100</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Radar chart */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              Dimension Radar
            </div>
            <ResponsiveContainer width={240} height={220}>
              <RadarChart data={RADAR_DATA} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke="hsl(220 13% 13%)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 8.5, fill: "hsl(215 16% 38%)", fontFamily: "inherit" }}
                />
                <Radar
                  name="score"
                  dataKey="score"
                  stroke={C.amber}
                  fill={C.amber}
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                  dot={{ fill: C.amber, r: 2.5 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textAlign: "center" }}>
              All five dimensions · Current period
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
