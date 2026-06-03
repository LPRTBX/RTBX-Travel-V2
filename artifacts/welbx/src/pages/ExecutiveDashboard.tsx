import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
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

/* ─── KPI data ────────────────────────────────────────── */
const KPIS = [
  { label: "Critical Events",     value: "14",       delta: "↓ 18%",  note: "vs last 30 days", positive: true,  color: C.red    },
  { label: "Escalations",         value: "3",        delta: "↓ 67%",  note: "vs last 30 days", positive: true,  color: C.amber  },
  { label: "Recovery Success",    value: "94%",      delta: "↑ 12pts",note: "vs last 30 days", positive: true,  color: C.green  },
  { label: "Staff Activations",   value: "28",       delta: "↑ 8%",   note: "vs last 30 days", positive: true,  color: C.blue   },
  { label: "Revenue Captured",    value: "$124,200", delta: "↑ 31%",  note: "vs last 30 days", positive: true,  color: C.green  },
];

/* ─── Properties ─────────────────────────────────────── */
const PROPERTIES = [
  "All Properties",
  "Grand Meridian, London",
  "Grand Meridian, Dubai",
  "The Cartwright, Edinburgh",
  "Hotel du Lac, Geneva",
  "Meridian Palace, Singapore",
];

/* ─── Emerging Risks ─────────────────────────────────── */
const RISKS = [
  {
    priority: "HIGH",
    color: C.red,
    property: "Hotel du Lac, Geneva",
    headline: "Repeated welfare signal cluster detected",
    detail: "Three welfare-threshold events in 8 days. Floor 5, rooms 512–518. Pattern not yet attributed to a systemic cause. BXOS confidence: 88%.",
    engine: "BXOS · Pattern Engine",
    since: "8 days",
  },
  {
    priority: "MEDIUM",
    color: C.amber,
    property: "The Cartwright, Edinburgh",
    headline: "Front-of-house staffing below service minimum",
    detail: "Thursday–Friday scheduling gap recurring. Desk coverage falling below threshold on peak arrival window. Service risk: Elevated.",
    engine: "BXOS · Capacity Engine",
    since: "3 weeks",
  },
  {
    priority: "MEDIUM",
    color: C.amber,
    property: "Grand Meridian, Dubai",
    headline: "Weekend arrival surge · Mobile check-in not enabled",
    detail: "Forecast +28% arrival volume Saturday. Mobile check-in inactive. If unaddressed: projected queue 14+ minutes at peak. Intervention window: 48 hours.",
    engine: "BXOS · Forecast Engine",
    since: "Forecast",
  },
  {
    priority: "LOW",
    color: C.blue,
    property: "Meridian Palace, Singapore",
    headline: "Concierge response time trending upward",
    detail: "Average response time up 22% over 14 days. Below complaint threshold, but trajectory warrants review before peak season.",
    engine: "BXOS · Service Engine",
    since: "14 days",
  },
];

/* ─── Emerging Opportunities ─────────────────────────── */
const OPPORTUNITIES = [
  {
    type: "REVENUE",
    color: C.green,
    property: "Grand Meridian, London",
    headline: "Suite upgrade window · 3 high-value returning guests",
    detail: "Suite 501 and 503 available. Three M1-tier guests arriving this week with prior upgrade acceptance on record.",
    value: "Est. $2,400",
    engine: "BXOS · CRM Engine",
    window: "72 hours",
  },
  {
    type: "PERSONALISATION",
    color: C.violet,
    property: "Meridian Palace, Singapore",
    headline: "14 returning guests arriving · Personalisation gap",
    detail: "Guest profiles contain prior preferences not yet activated for current stays. Personalisation window open before arrival.",
    value: "NPS +0.9 est.",
    engine: "BXOS · Guest Engine",
    window: "72 hours",
  },
  {
    type: "COMMERCIAL",
    color: C.amber,
    property: "The Cartwright, Edinburgh",
    headline: "Spa occupancy 34% Friday AM · VIP access opportunity",
    detail: "Low utilisation Friday 08:00–12:00. Three VIP-tier guests on property with no spa booking. Targeted offer window available.",
    value: "Est. $960",
    engine: "BXOS · Revenue Engine",
    window: "36 hours",
  },
  {
    type: "LOYALTY",
    color: C.blue,
    property: "Grand Meridian, Dubai",
    headline: "6 guests with unresolved prior-stay complaint",
    detail: "Guests returning who filed complaints on last visit, none of which received follow-up. Recovery activation window open at check-in.",
    value: "Retention risk",
    engine: "BXOS · CRM Engine",
    window: "At arrival",
  },
];

/* ─── Property performance table ─────────────────────── */
const PROPERTY_PERFORMANCE = [
  { name: "Grand Meridian, London",    signals: 312, resolution: "96%", avgResponse: "3.8 min", revenue: "$42,100",  score: 94 },
  { name: "Grand Meridian, Dubai",     signals: 274, resolution: "91%", avgResponse: "4.4 min", revenue: "$31,400",  score: 88 },
  { name: "The Cartwright, Edinburgh", signals: 188, resolution: "89%", avgResponse: "5.1 min", revenue: "$18,200",  score: 82 },
  { name: "Hotel du Lac, Geneva",      signals: 241, resolution: "93%", avgResponse: "4.1 min", revenue: "$22,300",  score: 86 },
  { name: "Meridian Palace, Singapore",signals: 198, resolution: "94%", avgResponse: "3.9 min", revenue: "$10,200",  score: 90 },
];

/* ─── Trend data (6 months) ──────────────────────────── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const TRENDS = [
  {
    id: "consistency",
    label: "Response Consistency",
    unit: "%",
    color: C.amber,
    data: [
      { m: "Jan", v: 71 }, { m: "Feb", v: 74 }, { m: "Mar", v: 79 },
      { m: "Apr", v: 83 }, { m: "May", v: 89 }, { m: "Jun", v: 94 },
    ],
    current: "94%",
    delta: "↑ 23pts",
    positive: true,
  },
  {
    id: "escalation",
    label: "Escalation Rate",
    unit: "%",
    color: C.green,
    data: [
      { m: "Jan", v: 14 }, { m: "Feb", v: 12 }, { m: "Mar", v: 10 },
      { m: "Apr", v: 8  }, { m: "May", v: 5  }, { m: "Jun", v: 3  },
    ],
    current: "3%",
    delta: "↓ 79%",
    positive: true,
    invertGood: true,
  },
  {
    id: "recovery",
    label: "Recovery Success Rate",
    unit: "%",
    color: C.blue,
    data: [
      { m: "Jan", v: 72 }, { m: "Feb", v: 76 }, { m: "Mar", v: 81 },
      { m: "Apr", v: 86 }, { m: "May", v: 91 }, { m: "Jun", v: 94 },
    ],
    current: "94%",
    delta: "↑ 22pts",
    positive: true,
  },
  {
    id: "commercial",
    label: "Commercial Activation",
    unit: "k",
    prefix: "$",
    color: C.violet,
    data: [
      { m: "Jan", v: 28 }, { m: "Feb", v: 41 }, { m: "Mar", v: 55 },
      { m: "Apr", v: 72 }, { m: "May", v: 98 }, { m: "Jun", v: 124 },
    ],
    current: "$124k",
    delta: "↑ 343%",
    positive: true,
  },
];

/* ─── Custom tooltip ─────────────────────────────────── */
function ChartTooltip({ active, payload, label, prefix = "", unit = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 16%)",
      padding: "8px 12px", fontSize: 11, color: "#fff",
    }}>
      <div style={{ color: C.muted, marginBottom: 4, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{prefix}{payload[0].value}{unit}</div>
    </div>
  );
}

/* ─── Trend card ─────────────────────────────────────── */
function TrendCard({ t }: { t: typeof TRENDS[0] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>
            {t.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
            {t.current}
          </div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, color: t.positive ? C.green : C.red,
          padding: "4px 8px", background: t.positive ? `${C.green}12` : `${C.red}12`,
          border: `1px solid ${t.positive ? C.green : C.red}30`,
        }}>
          {t.delta}
        </div>
      </div>
      <div style={{ height: 72 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={t.data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${t.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={t.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={t.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip prefix={t.prefix ?? ""} unit={t.unit} />} />
            <Area
              type="monotone" dataKey="v"
              stroke={t.color} strokeWidth={1.5}
              fill={`url(#grad-${t.id})`}
              dot={false} activeDot={{ r: 3, fill: t.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        {MONTHS.map((m, i) => (
          <div key={m} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: 2, background: i === 5 ? t.color : "hsl(220 13% 12%)",
              marginBottom: 3,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Score bar ──────────────────────────────────────── */
function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? C.green : score >= 80 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: "hsl(220 13% 11%)" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, transition: "width 0.4s" }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ExecutiveDashboard() {
  const [property, setProperty] = useState(0);
  const [period, setPeriod] = useState("30d");

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Executive View
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Executive Operating Dashboard
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Portfolio-level behavioural intelligence &nbsp;·&nbsp; Risk, opportunity, and performance insight
            </p>
          </div>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            {["7d", "30d", "90d"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", cursor: "pointer", border: "1px solid hsl(220 13% 12%)",
                background: period === p ? "hsl(220 13% 10%)" : "transparent",
                color: period === p ? "#fff" : C.dimmed,
                borderTop: period === p ? `1px solid ${C.amber}60` : "1px solid hsl(220 13% 12%)",
                transition: "all 0.15s",
              }}>{p}</button>
            ))}
          </div>
        </motion.div>

        {/* ── Property filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.38 }}
          style={{ display: "flex", gap: 1, marginBottom: 28, flexWrap: "wrap" }}
        >
          {PROPERTIES.map((p, i) => (
            <button key={p} onClick={() => setProperty(i)} style={{
              padding: "7px 14px", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
              cursor: "pointer", border: "1px solid hsl(220 13% 11%)",
              background: property === i ? "hsl(220 13% 10%)" : "transparent",
              color: property === i ? C.amber : "hsl(215 16% 34%)",
              transition: "all 0.15s",
              borderBottom: property === i ? `1px solid ${C.amber}` : "1px solid hsl(220 13% 11%)",
            }}>{p}</button>
          ))}
        </motion.div>

        {/* ── KPI strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 32 }}
        >
          {KPIS.map((k, i) => (
            <div key={k.label} style={{
              padding: "20px 22px 18px",
              background: C.card,
              borderTop: `2px solid ${k.color}`,
              border: `1px solid ${C.border}`,
              borderTopColor: k.color,
            }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 8 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 50%)", marginBottom: 6 }}>
                {k.label}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: k.positive ? C.green : C.red }}>
                  {k.delta}
                </span>
                <span style={{ fontSize: 8.5, color: C.dimmed }}>{k.note}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Emerging Risks | Emerging Opportunities ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, marginBottom: 1 }}
        >
          {/* Risks */}
          <div>
            <div style={{ padding: "12px 20px", background: "hsl(220 13% 7%)", borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Emerging Risks
              </span>
              <span style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>
                4 active
              </span>
            </div>
            {RISKS.map((r, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                borderLeft: `2px solid ${r.color}`,
                border: `1px solid ${C.border}`,
                borderLeftColor: r.color,
                borderTopWidth: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: r.color, border: `1px solid ${r.color}33`, padding: "2px 7px", background: `${r.color}0d`, textTransform: "uppercase" }}>
                    {r.priority}
                  </span>
                  <span style={{ fontSize: 8.5, color: C.dimmed }}>{r.property}</span>
                  <span style={{ marginLeft: "auto", fontSize: 7.5, color: "hsl(215 16% 20%)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {r.since}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.4 }}>
                  {r.headline}
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>
                  {r.detail}
                </div>
                <div style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {r.engine}
                </div>
              </div>
            ))}
          </div>

          {/* Opportunities */}
          <div>
            <div style={{ padding: "12px 20px", background: "hsl(220 13% 7%)", borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Emerging Opportunities
              </span>
              <span style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>
                4 active
              </span>
            </div>
            {OPPORTUNITIES.map((o, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                borderLeft: `2px solid ${o.color}`,
                border: `1px solid ${C.border}`,
                borderLeftColor: o.color,
                borderTopWidth: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: o.color, border: `1px solid ${o.color}33`, padding: "2px 7px", background: `${o.color}0d`, textTransform: "uppercase" }}>
                    {o.type}
                  </span>
                  <span style={{ fontSize: 8.5, color: C.dimmed }}>{o.property}</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: o.color }}>
                    {o.value}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.4 }}>
                  {o.headline}
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>
                  {o.detail}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>{o.engine}</span>
                  <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>Window: {o.window}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Performance Insights ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.38 }}
          style={{ marginTop: 32 }}
        >
          <div style={{ padding: "12px 20px", background: C.card, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "none" }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              Performance Insights · By Property
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Last {period} · All signals
            </span>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 96px 110px 120px 120px 160px",
            padding: "9px 20px", background: "hsl(220 13% 7%)",
            border: `1px solid ${C.border}`, borderBottom: "none",
          }}>
            {["Property", "Signals", "Resolution", "Avg Response", "Rev Captured", "WELBX Score"].map(h => (
              <div key={h} style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {PROPERTY_PERFORMANCE.map((p, i) => (
            <div key={p.name} style={{
              display: "grid", gridTemplateColumns: "1fr 96px 110px 120px 120px 160px",
              padding: "14px 20px",
              background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
              border: `1px solid ${C.border}`,
              borderTopWidth: 0,
              alignItems: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "hsl(215 16% 55%)", fontFamily: "var(--app-font-mono)" }}>{p.signals}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{p.resolution}</div>
              <div style={{ fontSize: 12, color: "hsl(215 16% 55%)" }}>{p.avgResponse}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>{p.revenue}</div>
              <ScoreBar score={p.score} />
            </div>
          ))}
        </motion.div>

        {/* ── Trend charts ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.38 }}
          style={{ marginTop: 32 }}
        >
          <div style={{ padding: "12px 20px", background: C.card, border: `1px solid ${C.border}`, borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              6-Month Trajectory · Portfolio
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Jan – Jun 2026
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, border: `1px solid ${C.border}` }}>
            {TRENDS.map(t => (
              <div key={t.id} style={{ borderRight: "1px solid hsl(220 13% 9%)" }}>
                <TrendCard t={t} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Positioning footnote ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 40, padding: "18px 24px",
            border: `1px solid ${C.amber}20`,
            background: `${C.amber}06`,
          }}
        >
          <div style={{ fontSize: 11.5, color: C.amber, fontStyle: "italic", lineHeight: 1.7, maxWidth: 820 }}>
            {`"WELBX does not surface information. It governs what happens next — across every property, every signal, every moment that matters to the guest and to the business."`}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Behavioural intelligence · Signal classification · Decision governance" },
              { name: "NEXUS", desc: "Routing · Escalation · Owner assignment" },
              { name: "VECTOR", desc: "Execution coordination · Outcome tracking · Pattern learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 24%)", textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
