import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { DECISIONS } from "@/data/decisions";
import type { Category, OutcomeStatus, Decision } from "@/data/decisions";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

const OUTCOME_COLOR: Record<OutcomeStatus, string> = {
  Positive:    C.green,
  Pending:     C.amber,
  Negative:    C.red,
  Inconclusive: "hsl(215 16% 32%)",
};


const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

/* ─── Confidence trend data (hourly, current day) ─────── */
const CONFIDENCE_TREND = [
  { time: "06:00", Guest: 72, Workforce: 68, Operational: 75, Commercial: 70, Strategic: 65 },
  { time: "07:00", Guest: 74, Workforce: 71, Operational: 76, Commercial: 72, Strategic: 68 },
  { time: "08:00", Guest: 78, Workforce: 74, Operational: 79, Commercial: 75, Strategic: 71 },
  { time: "09:00", Guest: 80, Workforce: 77, Operational: 81, Commercial: 78, Strategic: 74 },
  { time: "10:00", Guest: 83, Workforce: 79, Operational: 84, Commercial: 81, Strategic: 77 },
  { time: "11:00", Guest: 85, Workforce: 82, Operational: 86, Commercial: 83, Strategic: 80 },
  { time: "12:00", Guest: 84, Workforce: 80, Operational: 85, Commercial: 82, Strategic: 79 },
  { time: "13:00", Guest: 87, Workforce: 83, Operational: 88, Commercial: 86, Strategic: 82 },
  { time: "14:00", Guest: 89, Workforce: 85, Operational: 90, Commercial: 88, Strategic: 84 },
  { time: "15:00", Guest: 88, Workforce: 84, Operational: 89, Commercial: 87, Strategic: 83 },
  { time: "16:00", Guest: 91, Workforce: 87, Operational: 91, Commercial: 90, Strategic: 86 },
];

/* ─── Confidence Trend Chart ──────────────────────────── */
function ConfidenceTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.38 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        padding: "20px 24px 16px",
        marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
            BXOS · Decision Intelligence
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            Confidence Trend by Category
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {ALL_CATEGORIES.map(cat => (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 2, background: CAT_COLOR[cat], flexShrink: 0 }} />
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", color: C.muted, textTransform: "uppercase" }}>
                {cat}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 22%)", textTransform: "uppercase", marginLeft: 8 }}>
            06:00 — 16:00
          </div>
        </div>
      </div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CONFIDENCE_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="hsl(220 13% 10%)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(215 16% 34%)", fontSize: 9.5, fontFamily: "var(--app-font-mono)", letterSpacing: "0.04em" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[60, 95]}
              ticks={[65, 70, 75, 80, 85, 90, 95]}
              tick={{ fill: "hsl(215 16% 34%)", fontSize: 9.5, fontFamily: "var(--app-font-mono)" }}
              tickLine={false}
              axisLine={false}
              width={28}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              cursor={{ stroke: "hsl(220 13% 16%)", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "hsl(220 13% 8%)",
                border: "1px solid hsl(220 13% 14%)",
                borderRadius: 0,
                fontSize: 11,
                fontFamily: "var(--app-font-mono)",
                color: "#fff",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "hsl(215 16% 50%)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            {ALL_CATEGORIES.map(cat => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={CAT_COLOR[cat]}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: CAT_COLOR[cat] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <span style={{ fontSize: 8, color: "hsl(215 16% 18%)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Confidence threshold · green ≥ 85% · amber ≥ 70% · red &lt; 70%
        </span>
      </div>
    </motion.div>
  );
}

/* ─── KPI Metrics ─────────────────────────────────────── */
const METRICS = [
  { label: "Decisions Made Today", value: 11, unit: "TOTAL", color: C.amber },
  { label: "Automated Recommendations", value: 7, unit: "BXOS DRIVEN", color: C.violet },
  { label: "Human Decisions", value: 4, unit: "OPERATOR APPROVED", color: C.blue },
  { label: "Successful Decisions", value: 9, unit: "POSITIVE OUTCOME", color: C.green },
  { label: "Decision Confidence Score", value: 82, unit: "AVG CONFIDENCE", color: C.amber, suffix: "%" },
];

/* ─── Animated count-up ───────────────────────────────── */
function CountUp({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{count}</>;
}

/* ─── Confidence bar ─────────────────────────────────── */
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? C.green : value >= 70 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 64, height: 3, background: "hsl(220 13% 11%)", flexShrink: 0, position: "relative" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ height: "100%", background: color, position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────── */
function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color, border: `1px solid ${color}33`, padding: "2px 7px", background: `${color}0d`,
      flexShrink: 0, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

/* ─── Decision Card ───────────────────────────────────── */
function DecisionCard({ d, i }: { d: Decision; i: number }) {
  const catColor = CAT_COLOR[d.category];
  const outcomeColor = OUTCOME_COLOR[d.outcome];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.32 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${catColor}`,
        padding: "20px 22px",
        marginBottom: 1,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)", textTransform: "uppercase" }}>
              {d.id}
            </span>
            <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>
              {d.timestamp}
            </span>
            <Badge
              text={d.decisionType === "Automated" ? "AUTOMATED" : "HUMAN"}
              color={d.decisionType === "Automated" ? C.violet : C.blue}
            />
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 3 }}>
            {d.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9.5, color: catColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>
              {d.category}
            </span>
            <span style={{ fontSize: 9, color: C.dimmed }}>·</span>
            <span style={{ fontSize: 10, color: C.muted }}>
              {d.relatedMoment}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, marginLeft: 16 }}>
          <Badge text={d.outcome} color={outcomeColor} />
          <ConfidenceBar value={d.confidence} />
        </div>
      </div>

      {/* Detail grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 1,
        background: C.border,
        border: `1px solid ${C.border}`,
        marginBottom: 10,
      }}>
        {[
          { label: "Reasoning", value: d.reasoning },
          { label: "Recommended Action", value: d.recommendedAction },
          { label: "Decision Owner", value: d.owner },
        ].map((item) => (
          <div key={item.label} style={{ background: "hsl(220 13% 6%)", padding: "12px 14px" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 11, color: "hsl(215 16% 52%)", lineHeight: 1.55 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Learning captured */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "9px 12px",
        background: `${catColor}08`,
        border: `1px solid ${catColor}18`,
      }}>
        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase", flexShrink: 0, paddingTop: 1 }}>
          LEARNING
        </span>
        <span style={{ fontSize: 10.5, color: "hsl(215 16% 46%)", lineHeight: 1.6 }}>
          {d.learning}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function DecisionRegistry() {
  const { refreshHealthScores } = useApp();
  useEffect(() => { refreshHealthScores(); }, [refreshHealthScores]);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [momentFilter, setMomentFilter] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("moment");
    if (m) setMomentFilter(m);
  }, []);

  const base = momentFilter
    ? DECISIONS.filter(d => d.relatedMoment === momentFilter)
    : DECISIONS;

  const filtered = activeCategory === "All"
    ? base
    : base.filter(d => d.category === activeCategory);

  const catCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c] = base.filter(d => d.category === c).length;
    return acc;
  }, {});

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Decision Intelligence
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Decision Registry
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Better Outcomes Begin With Better Decisions.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {DECISIONS.length} decisions logged today
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              5 categories · BXOS governed
            </div>
          </div>
        </motion.div>

        {/* ── Moment filter banner ── */}
        <AnimatePresence>
          {momentFilter && (
            <motion.div
              key="moment-filter"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                marginBottom: 16,
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.22)",
                borderLeft: "3px solid #3b82f6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3b82f6" }}>
                  Filtered by Moment
                </span>
                <span style={{ fontSize: 10, color: "hsl(215 16% 58%)", letterSpacing: "0.04em" }}>
                  {momentFilter}
                </span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 28%)", letterSpacing: "0.06em" }}>
                  · {base.length} decision{base.length !== 1 ? "s" : ""} linked
                </span>
              </div>
              <button
                onClick={() => {
                  setMomentFilter(null);
                  const url = new URL(window.location.href);
                  url.searchParams.delete("moment");
                  window.history.replaceState({}, "", url.toString());
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  background: "transparent",
                  border: "1px solid rgba(59,130,246,0.25)",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(59,130,246,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(59,130,246,0.25)";
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "hsl(215 16% 44%)" }}>
                  Clear Filter
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Executive metrics strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
              style={{
                padding: "18px 20px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${m.color}`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7 }}>
                <CountUp target={m.value} />{m.suffix ?? ""}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
                {m.unit}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Confidence trend chart ── */}
        <ConfidenceTrendChart />

        {/* ── Category filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          style={{ display: "flex", gap: 1, marginBottom: 0 }}
        >
          {(["All", ...ALL_CATEGORIES] as Array<"All" | Category>).map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat === "All" ? C.amber : CAT_COLOR[cat];
            const count = cat === "All" ? DECISIONS.length : catCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 18px",
                  background: isActive ? "hsl(220 13% 9%)" : "transparent",
                  border: `1px solid ${isActive ? color + "44" : "hsl(220 13% 10%)"}`,
                  borderBottom: isActive ? `1px solid hsl(220 13% 9%)` : `1px solid hsl(220 13% 10%)`,
                  borderTop: isActive ? `2px solid ${color}` : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                  {cat === "All" ? "All Decisions" : `${cat} Decisions`}
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                  color: isActive ? color : C.dimmed,
                  border: `1px solid ${isActive ? color + "33" : "transparent"}`,
                  padding: "1px 5px",
                  background: isActive ? `${color}0d` : "transparent",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Decision feed ── */}
        <div style={{
          border: `1px solid ${C.border}`,
          borderTop: "none",
          background: "hsl(220 13% 6%)",
          padding: "1px 0 0",
          marginBottom: 24,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {filtered.map((d, i) => (
                <DecisionCard key={d.id} d={d} i={i} />
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center", color: C.dimmed, fontSize: 12 }}>
                  No decisions recorded in this category today.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Outcome legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap",
          }}
        >
          {(Object.entries(OUTCOME_COLOR) as [OutcomeStatus, string][]).map(([status, color]) => (
            <div key={status} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 8.5, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{status}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Confidence bar: green ≥ 85% · amber ≥ 70% · red &lt; 70%
          </div>
        </motion.div>

        {/* ── Engine footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.56, duration: 0.4 }}
          style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Decision scoring · Confidence modelling · Recommendation generation" },
              { name: "NEXUS", desc: "Owner routing · Escalation governance · Human-in-loop triggers" },
              { name: "VECTOR", desc: "Action execution · Outcome attribution · Learning capture" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
