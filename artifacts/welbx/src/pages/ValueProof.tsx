import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { useApp } from "@/context/AppContext";
import { PERIODS } from "@/data/entities";

const C = {
  amber: "#c9a84c", green: "#10b981", blue: "#3b82f6",
  violet: "#a78bfa", red: "#ef4444", cyan: "#22d3ee",
  border: "hsl(220 13% 9%)", card: "hsl(220 13% 7%)",
  bg: "hsl(220 13% 5%)", muted: "hsl(215 16% 38%)", dimmed: "hsl(215 16% 22%)",
};

const DATA_BY_PERIOD: Record<string, {
  protected: string; created: string; avoided: string; successRate: string; moments: string; roi: string;
  categories: { label: string; protected: number; created: number; avoided: number; color: string }[];
  properties: { name: string; city: string; protected: number; created: number; avoided: number; moments: number; successRate: number }[];
  monthlyTrend: { m: string; protected: number; created: number }[];
}> = {
  "7d": {
    protected: "$52,400", created: "$18,800", avoided: "$9,200", successRate: "93%", moments: "94", roi: "8.2×",
    categories: [
      { label: "Guest",        protected: 24400, created: 4200,  avoided: 3100, color: C.amber },
      { label: "Workforce",    protected: 8200,  created: 1800,  avoided: 2400, color: C.blue  },
      { label: "Operational",  protected: 9600,  created: 3400,  avoided: 1800, color: C.muted },
      { label: "Commercial",   protected: 6400,  created: 7200,  avoided: 900,  color: C.green },
      { label: "Strategic",    protected: 3800,  created: 2200,  avoided: 1000, color: C.violet},
    ],
    properties: [
      { name: "Grand Meridian",  city: "London",    protected: 18400, created: 6800, avoided: 3200, moments: 28, successRate: 96 },
      { name: "Meridian Palace", city: "Singapore", protected: 12200, created: 4400, avoided: 2100, moments: 22, successRate: 91 },
      { name: "Grand Meridian",  city: "Dubai",     protected: 9600,  created: 3200, avoided: 1800, moments: 18, successRate: 94 },
      { name: "Hotel du Lac",    city: "Geneva",    protected: 7400,  created: 2800, avoided: 1400, moments: 14, successRate: 93 },
      { name: "The Cartwright",  city: "Edinburgh", protected: 4800,  created: 1600, avoided: 700,  moments: 12, successRate: 89 },
    ],
    monthlyTrend: [
      { m: "Mon", protected: 6800, created: 2400 },
      { m: "Tue", protected: 7200, created: 2600 },
      { m: "Wed", protected: 8100, created: 3200 },
      { m: "Thu", protected: 9400, created: 2900 },
      { m: "Fri", protected: 8600, created: 3400 },
      { m: "Sat", protected: 7100, created: 2100 },
      { m: "Sun", protected: 5200, created: 2200 },
    ],
  },
  "30d": {
    protected: "$284,400", created: "$68,200", avoided: "$31,800", successRate: "94%", moments: "412", roi: "9.4×",
    categories: [
      { label: "Guest",        protected: 124400, created: 18200, avoided: 12100, color: C.amber },
      { label: "Workforce",    protected: 48200,  created: 8800,  avoided: 9400,  color: C.blue  },
      { label: "Operational",  protected: 52600,  created: 14400, avoided: 6800,  color: C.muted },
      { label: "Commercial",   protected: 36400,  created: 20200, avoided: 2100,  color: C.green },
      { label: "Strategic",    protected: 22800,  created: 6600,  avoided: 1400,  color: C.violet},
    ],
    properties: [
      { name: "Grand Meridian",  city: "London",    protected: 98400,  created: 24800, avoided: 11200, moments: 124, successRate: 96 },
      { name: "Meridian Palace", city: "Singapore", protected: 72200,  created: 18400, avoided: 8100,  moments: 98,  successRate: 92 },
      { name: "Grand Meridian",  city: "Dubai",     protected: 56600,  created: 12200, avoided: 6800,  moments: 84,  successRate: 95 },
      { name: "Hotel du Lac",    city: "Geneva",    protected: 34400,  created: 8200,  avoided: 4100,  moments: 62,  successRate: 94 },
      { name: "The Cartwright",  city: "Edinburgh", protected: 22800,  created: 4600,  avoided: 1600,  moments: 44,  successRate: 91 },
    ],
    monthlyTrend: [
      { m: "Wk 1", protected: 62400, created: 14800 },
      { m: "Wk 2", protected: 68200, created: 16200 },
      { m: "Wk 3", protected: 74800, created: 18600 },
      { m: "Wk 4", protected: 79000, created: 18600 },
    ],
  },
  "90d": {
    protected: "$814,200", created: "$196,400", avoided: "$88,600", successRate: "93%", moments: "1,247", roi: "10.1×",
    categories: [
      { label: "Guest",        protected: 342400, created: 52200, avoided: 34100, color: C.amber },
      { label: "Workforce",    protected: 148200, created: 24800, avoided: 22400, color: C.blue  },
      { label: "Operational",  protected: 154600, created: 44400, avoided: 18800, color: C.muted },
      { label: "Commercial",   protected: 106400, created: 58200, avoided: 8100,  color: C.green },
      { label: "Strategic",    protected: 62600,  created: 16800, avoided: 5200,  color: C.violet},
    ],
    properties: [
      { name: "Grand Meridian",  city: "London",    protected: 284400, created: 72800, avoided: 32200, moments: 384, successRate: 96 },
      { name: "Meridian Palace", city: "Singapore", protected: 208200, created: 52400, avoided: 24100, moments: 298, successRate: 93 },
      { name: "Grand Meridian",  city: "Dubai",     protected: 162600, created: 36200, avoided: 18800, moments: 254, successRate: 94 },
      { name: "Hotel du Lac",    city: "Geneva",    protected: 98400,  created: 24200, avoided: 9400,  moments: 188, successRate: 93 },
      { name: "The Cartwright",  city: "Edinburgh", protected: 60600,  created: 10800, avoided: 4100,  moments: 123, successRate: 90 },
    ],
    monthlyTrend: [
      { m: "Jan", protected: 248400, created: 58800 },
      { m: "Feb", protected: 272200, created: 64200 },
      { m: "Mar", protected: 293600, created: 73400 },
    ],
  },
};

const WITHOUT_DATA = [
  { label: "Revenue Visibility",      without: "End-of-day summary",    with: "Real-time + predictive",   delta: "Decisions 4+ hours earlier" },
  { label: "Incident Detection",      without: "Guest/staff report",     with: "BXOS pattern detection",   delta: "3–10 min faster" },
  { label: "Response Coordination",   without: "Phone/radio + verbal",   with: "NEXUS routed in 8–45s",    delta: "7–94× faster routing" },
  { label: "Outcome Tracking",        without: "End-of-shift log",       with: "VECTOR real-time capture", delta: "100% moment attribution" },
  { label: "Recovery Success Rate",   without: "41% (estimated)",        with: "84%+ (Learning-updated)",  delta: "+43 percentage points" },
  { label: "Complaint Rate",          without: "5.1% of stays",          with: "2.4% of stays",            delta: "−53% complaint volume" },
];

const RADAR_DATA = [
  { subject: "Detection", value: 97 },
  { subject: "Decision",  value: 88 },
  { subject: "Execution", value: 91 },
  { subject: "Comms",     value: 84 },
  { subject: "Outcomes",  value: 93 },
  { subject: "Learning",  value: 79 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "hsl(220 13% 10%)", border: `1px solid ${C.border}`, padding: "8px 12px", fontSize: 10 }}>
      <div style={{ color: C.muted, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.fill, fontWeight: 700 }}>
          ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function ValueProof() {
  const { activePeriod, setActivePeriod } = useApp();
  const d = DATA_BY_PERIOD[activePeriod];
  const fade = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4 } });

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Header */}
        <motion.div {...fade(0)} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Commercial Proof
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Value Proof
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
              Board-ready ROI · What WELBX is worth, in numbers
            </p>
          </div>
          {/* Period selector */}
          <div style={{ display: "flex", gap: 1 }}>
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => setActivePeriod(p.id as any)}
                style={{
                  padding: "8px 16px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                  background: activePeriod === p.id ? "hsl(220 13% 10%)" : "transparent",
                  color: activePeriod === p.id ? C.amber : "hsl(215 16% 36%)",
                  border: `1px solid ${activePeriod === p.id ? C.amber + "40" : C.border}`,
                  transition: "all 0.15s",
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hero KPIs */}
        <motion.div {...fade(0.06)} style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1, marginBottom: 36 }}>
          {[
            { label: "Protected Value",  value: d.protected, color: C.amber, note: "Revenue risk neutralised" },
            { label: "Revenue Created",  value: d.created,   color: C.green, note: "Net new revenue captured" },
            { label: "Cost Avoided",     value: d.avoided,   color: C.blue,  note: "Service failure cost" },
            { label: "Outcome Success",  value: d.successRate, color: C.green, note: "Moment success rate" },
            { label: "Moments Handled",  value: d.moments,   color: "#fff",  note: "Across portfolio" },
            { label: "WELBX ROI",        value: d.roi,       color: C.cyan,  note: "Return on deployment" },
          ].map(k => (
            <div key={k.label} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${k.color}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 5 }}>{k.value}</div>
              <div style={{ fontSize: 8.5, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.note}</div>
            </div>
          ))}
        </motion.div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginBottom: 1 }}>

          {/* Value by category */}
          <motion.div {...fade(0.1)} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 14 }}>Value by Category</div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.categories} barGap={2} barCategoryGap="20%">
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="protected" radius={[1,1,0,0]}>
                    {d.categories.map(c => <Cell key={c.label} fill={c.color} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 6, fontSize: 8.5, color: C.dimmed }}>Protected value per domain</div>
          </motion.div>

          {/* Trend chart */}
          <motion.div {...fade(0.12)} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 14 }}>
              Value Trend · {activePeriod === "7d" ? "Daily" : activePeriod === "30d" ? "Weekly" : "Monthly"}
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.monthlyTrend} barGap={2}>
                  <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="protected" fill={C.amber} fillOpacity={0.6} radius={[1,1,0,0]} />
                  <Bar dataKey="created"   fill={C.green} fillOpacity={0.7} radius={[1,1,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 3, background: C.amber }} />
                <span style={{ fontSize: 8, color: C.dimmed }}>Protected</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 3, background: C.green }} />
                <span style={{ fontSize: 8, color: C.dimmed }}>Created</span>
              </div>
            </div>
          </motion.div>

          {/* Radar */}
          <motion.div {...fade(0.14)} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              Platform Performance Index
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="hsl(220 13% 12%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: C.muted }} />
                  <Radar dataKey="value" stroke={C.amber} fill={C.amber} fillOpacity={0.12} strokeWidth={1.5} dot={{ fill: C.amber, r: 2 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Property performance table */}
        <motion.div {...fade(0.18)} style={{ marginTop: 1, marginBottom: 1 }}>
          <div style={{ padding: "9px 20px", background: "hsl(220 13% 8%)", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>Property Performance · {activePeriod}</span>
            <span style={{ fontSize: 8.5, color: C.muted }}>5 properties · Portfolio view</span>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTopWidth: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.9fr 0.7fr 0.9fr", padding: "8px 20px", borderBottom: `1px solid ${C.border}`, gap: 12 }}>
              {["Property", "Protected Value", "Revenue Created", "Cost Avoided", "Moments", "Success Rate"].map(h => (
                <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {d.properties.map((p, i) => (
              <motion.div key={p.city} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.9fr 0.9fr 0.7fr 0.9fr", padding: "14px 20px", borderBottom: i < d.properties.length - 1 ? `1px solid ${C.border}` : "none", gap: 12, alignItems: "center" }}
                onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 8%)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.city}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>${p.protected.toLocaleString()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>${p.created.toLocaleString()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.blue }}>${p.avoided.toLocaleString()}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(215 16% 55%)" }}>{p.moments}</div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: p.successRate >= 95 ? C.green : p.successRate >= 90 ? C.amber : C.muted, marginBottom: 3 }}>{p.successRate}%</div>
                  <div style={{ height: 2, background: "hsl(220 13% 11%)" }}>
                    <div style={{ width: `${p.successRate}%`, height: "100%", background: p.successRate >= 95 ? C.green : C.amber }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Without WELBX comparison */}
        <motion.div {...fade(0.24)} style={{ marginTop: 20 }}>
          <div style={{ padding: "9px 0 12px", borderBottom: `1px solid ${C.border}`, marginBottom: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 3, height: 16, background: C.red }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Without WELBX — Standard Operations</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
            {WITHOUT_DATA.map((w, i) => (
              <div key={w.label} style={{ padding: "14px 18px", background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)", border: `1px solid ${C.border}`, borderTopWidth: 0 }}>
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 8 }}>{w.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 7.5, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Without</div>
                    <div style={{ fontSize: 11, color: "hsl(215 16% 44%)" }}>{w.without}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7.5, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>With WELBX</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{w.with}</div>
                  </div>
                </div>
                <div style={{ padding: "6px 10px", background: `${C.green}07`, borderLeft: `2px solid ${C.green}40`, fontSize: 9, fontWeight: 700, color: C.green }}>
                  ↑ {w.delta}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Executive briefing */}
        <motion.div {...fade(0.3)} style={{ marginTop: 20, padding: "22px 28px", background: `${C.amber}06`, border: `1px solid ${C.amber}20`, borderLeft: `2px solid ${C.amber}` }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            Executive Summary · WELBX Value Proof
          </div>
          <p style={{ fontSize: 13, color: "hsl(215 16% 52%)", lineHeight: 1.8, maxWidth: 860, margin: 0 }}>
            Across {d.moments} operational moments in the last {activePeriod === "7d" ? "7 days" : activePeriod === "30d" ? "30 days" : "90 days"},
            WELBX protected {d.protected} in guest lifetime value, created {d.created} in new revenue, and avoided {d.avoided} in
            operational cost. At a {d.successRate} moment success rate, WELBX is delivering an {d.roi} return on deployment cost.
            The platform detects incidents 3–10 minutes before staff awareness, routes coordinated responses in under 45 seconds,
            and captures every outcome — creating an institutional learning loop that continuously improves system performance.
            Without WELBX, this value exists as invisible risk.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ n: "BXOS", d: "Pattern detection · Value attribution" }, { n: "NEXUS", d: "Routing efficiency · Response time" }, { n: "VECTOR", d: "Outcome capture · ROI tracking" }].map(e => (
              <div key={e.n} style={{ display: "flex", gap: 7, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.n}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 14%)", letterSpacing: "0.04em" }}>· {e.d}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, color: "hsl(215 16% 14%)" }}>Value Proof · WELBX · Confidential</div>
        </motion.div>

      </div>
    </div>
  );
}
