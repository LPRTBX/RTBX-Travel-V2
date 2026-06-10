import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, ResponsiveContainer, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

/* ─── Palette ──────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  card2:  "hsl(220 13% 8%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 38%)",
  dimmed: "hsl(215 16% 24%)",
};

/* ─── Types ────────────────────────────────────────── */
type Category = "Guest" | "Workforce" | "Operational" | "Commercial";

interface Signal {
  name: string;
  source: string;
  weight: number;
}

interface MomentData {
  id: string;
  name: string;
  category: Category;
  confidence: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priorityReasoning: string;
  frequency: string;
  signals: Signal[];
  impact: { guest: number; revenue: number; operational: number; strategic: number };
  impactNote: string;
  riskScore: number;
  riskNote: string;
  trendData: { m: string; v: number }[];
  relationships: string[];
  whyItMatters: string;
}

const CAT_COLOR: Record<Category, string> = {
  Guest: C.amber, Workforce: C.blue, Operational: C.muted, Commercial: C.green,
};

const PRIORITY_COLOR = { CRITICAL: C.red, HIGH: C.amber, MEDIUM: C.blue, LOW: C.muted };

/* ─── Moment intelligence data ─────────────────────── */
const MOMENTS: MomentData[] = [
  {
    id: "MI-001",
    name: "Guest Complaint Escalation",
    category: "Guest",
    confidence: 87,
    priority: "HIGH",
    priorityReasoning: "Three converging complaint signals within a single guest journey. Historical pattern shows 74% escalation to formal complaint if unaddressed within 18 minutes.",
    frequency: "4–6× weekly",
    signals: [
      { name: "Check-In Delay",      source: "PMS + Door Sensor",         weight: 82 },
      { name: "Negative Sentiment",  source: "Staff Interaction Log",      weight: 76 },
      { name: "Repeat Contact",      source: "Front Desk System (3+ touches)", weight: 91 },
    ],
    impact: { guest: 92, revenue: 78, operational: 64, strategic: 71 },
    impactNote: "Unresolved complaints convert at 31% to public review. Each formal complaint carries an estimated $3,400 retention cost and NPS impact of −2.1 points.",
    riskScore: 84,
    riskNote: "If missed: 74% probability of escalation to formal complaint. Average recovery cost $3,400. Public review risk: HIGH. Repeat booking probability falls by 61%.",
    trendData: [
      { m: "Jan", v: 7 }, { m: "Feb", v: 8 }, { m: "Mar", v: 6 },
      { m: "Apr", v: 5 }, { m: "May", v: 4 }, { m: "Jun", v: 4 },
    ],
    relationships: ["Service Recovery Window", "First-Stay Anxiety", "VIP Arrival Risk"],
    whyItMatters: "A complaint is not a moment — it is the end of a chain of unaddressed signals. WELBX intercepts the chain before it closes.",
  },
  {
    id: "MI-002",
    name: "VIP Arrival Misalignment",
    category: "Guest",
    confidence: 99,
    priority: "CRITICAL",
    priorityReasoning: "Suite not yet ready at confirmed arrival window. VIP tier guest with zero-tolerance expectation. Flight data confirms early arrival. Protocol window: 38 minutes.",
    frequency: "2–3× weekly",
    signals: [
      { name: "PMS Arrival Window",       source: "Property Management System",  weight: 94 },
      { name: "Flight Data Deviation",    source: "Aviation API · BA0173 −14m",   weight: 99 },
      { name: "Suite Readiness Gap",      source: "Housekeeping Status Feed",     weight: 97 },
    ],
    impact: { guest: 98, revenue: 96, operational: 72, strategic: 88 },
    impactNote: "VIP misalignment carries a $8,000+ direct booking risk. Each unresolved VIP event correlates with −0.8 loyalty tier retention. Portfolio-level, this affects referral and group booking pipelines.",
    riskScore: 97,
    riskNote: "If missed: VIP receives a degraded arrival. 88% probability of loyalty tier review. Estimated booking pipeline risk: $8,000–$24,000 across future stays and referrals.",
    trendData: [
      { m: "Jan", v: 5 }, { m: "Feb", v: 4 }, { m: "Mar", v: 3 },
      { m: "Apr", v: 3 }, { m: "May", v: 2 }, { m: "Jun", v: 2 },
    ],
    relationships: ["Suite Readiness", "Loyalty Activation", "Revenue Protection"],
    whyItMatters: "The arrival moment is the most consequential minute of a VIP stay. WELBX ensures the property is always ahead of it.",
  },
  {
    id: "MI-003",
    name: "Queue Pressure Threshold",
    category: "Operational",
    confidence: 89,
    priority: "HIGH",
    priorityReasoning: "Foyer at 87% occupancy. Check-in desks at maximum. Arrival rate 34% above forecast. Predicted queue time exceeds 12 minutes within 4 minutes if no action.",
    frequency: "2–3× weekly",
    signals: [
      { name: "Foyer Occupancy Sensor",   source: "Lobby Grid · Sensor Array",      weight: 87 },
      { name: "Arrival Rate Deviation",   source: "PMS + Flight Feed · +34%",       weight: 89 },
      { name: "Desk Capacity Monitor",    source: "Front Desk System · 4/4 maxed",  weight: 96 },
    ],
    impact: { guest: 74, revenue: 88, operational: 96, strategic: 62 },
    impactNote: "12-minute wait times at check-in correlate with −1.4 NPS points. At 87% capacity, service failure risk compounds every 90 seconds without intervention.",
    riskScore: 81,
    riskNote: "If missed: projected queue 12+ min, 18% complaint rate, 3 lost mobile check-in opportunities, estimated $4,800 service disruption cost.",
    trendData: [
      { m: "Jan", v: 9 }, { m: "Feb", v: 11 }, { m: "Mar", v: 10 },
      { m: "Apr", v: 8 }, { m: "May", v: 7  }, { m: "Jun", v: 6  },
    ],
    relationships: ["Staff Capacity Gap", "Mobile Check-In Opportunity", "Service Recovery"],
    whyItMatters: "Queue pressure is invisible until it is already a problem. WELBX surfaces the threshold before the queue forms.",
  },
  {
    id: "MI-004",
    name: "Welfare Alert Trigger",
    category: "Guest",
    confidence: 96,
    priority: "CRITICAL",
    priorityReasoning: "Zero movement recorded over 22 minutes. No door open event. No room service contact. Solo traveller. Pattern matches welfare concern threshold per Protocol WP-02.",
    frequency: "3–4× weekly",
    signals: [
      { name: "Motion Sensor (Stillness)", source: "In-room sensor · 22 min",           weight: 96 },
      { name: "Door Activity Absent",      source: "Entry sensor · No event 38 min",     weight: 88 },
      { name: "Guest Profile Risk Factor", source: "PMS · Solo · Business · No request", weight: 74 },
    ],
    impact: { guest: 99, revenue: 41, operational: 58, strategic: 82 },
    impactNote: "Welfare failures carry unlimited liability and reputational consequence. Beyond legal exposure, each undetected welfare event represents a systemic operational failure. No financial metric captures this fully.",
    riskScore: 99,
    riskNote: "If missed: potential welfare emergency without timely response. Legal liability: High. Reputational consequence: Severe. Protocol WP-02 exists precisely because the cost of inaction is unacceptable.",
    trendData: [
      { m: "Jan", v: 5 }, { m: "Feb", v: 6 }, { m: "Mar", v: 4 },
      { m: "Apr", v: 4 }, { m: "May", v: 3 }, { m: "Jun", v: 3 },
    ],
    relationships: ["Guest Distress Protocol", "Duty Manager Dispatch", "Legal Risk Register"],
    whyItMatters: "Some moments are not about revenue. This is one of them. WELBX detects what no human can reliably monitor across a full property.",
  },
  {
    id: "MI-005",
    name: "Revenue Opportunity Window",
    category: "Commercial",
    confidence: 78,
    priority: "MEDIUM",
    priorityReasoning: "Suite availability confirmed. Guest tier M1 with prior upgrade acceptance on record. Arrival window open. Three converging signals indicate high conversion probability.",
    frequency: "2–3× daily",
    signals: [
      { name: "Suite Availability",         source: "PMS · Room Status Feed",          weight: 98 },
      { name: "Guest Tier (M1)",            source: "CRM · Profile · Returning",       weight: 84 },
      { name: "Prior Upgrade Acceptance",   source: "Stay History · 2 of 3 accepted",  weight: 78 },
    ],
    impact: { guest: 68, revenue: 94, operational: 44, strategic: 76 },
    impactNote: "Each captured upgrade represents $2,400 average revenue uplift. Across a portfolio of 5 properties, uncaptured upgrade windows represent $180,000–$240,000 in annual missed revenue.",
    riskScore: 52,
    riskNote: "If missed: revenue opportunity expires at check-in closure. No guest harm. Financial cost is opportunity cost only. Low urgency but high cumulative value across volume.",
    trendData: [
      { m: "Jan", v: 38 }, { m: "Feb", v: 44 }, { m: "Mar", v: 51 },
      { m: "Apr", v: 58 }, { m: "May", v: 71 }, { m: "Jun", v: 82 },
    ],
    relationships: ["Loyalty Activation", "F&B Opportunity", "Repeat Guest Recognition"],
    whyItMatters: "Revenue moments are quiet. No alarm sounds when an upgrade window expires. WELBX makes invisible opportunity visible.",
  },
  {
    id: "MI-006",
    name: "Staff Capacity Gap",
    category: "Workforce",
    confidence: 82,
    priority: "HIGH",
    priorityReasoning: "Concierge desk unattended 8+ minutes. Front desk reduced to single staff. Lobby approaching service threshold. Multi-signal convergence indicates guest-facing failure within 4 minutes.",
    frequency: "3–4× weekly",
    signals: [
      { name: "Desk Unattended Timer",     source: "Staff Presence Sensor",            weight: 88 },
      { name: "Front Desk Staffing Level", source: "Scheduling System · 1 of 3",       weight: 82 },
      { name: "Lobby Load Index",          source: "Occupancy Sensor · 71% threshold", weight: 74 },
    ],
    impact: { guest: 82, revenue: 74, operational: 96, strategic: 58 },
    impactNote: "Unattended service points create a 3.8× increase in complaint probability. Each service gap costs an average 4.2 minutes of guest recovery time and degrades perceived service quality across the full stay.",
    riskScore: 78,
    riskNote: "If missed: guest-facing service gap within 4 minutes. Complaint probability: 38%. Service perception impact: −1.7 NPS equivalent. Cost of recovery: $1,800 average.",
    trendData: [
      { m: "Jan", v: 14 }, { m: "Feb", v: 12 }, { m: "Mar", v: 11 },
      { m: "Apr", v: 9  }, { m: "May", v: 8  }, { m: "Jun", v: 7  },
    ],
    relationships: ["Foyer Congestion", "Service Recovery Window", "Team Performance Deviation"],
    whyItMatters: "Staffing gaps are structural vulnerabilities that no individual can see in real time. WELBX sees the pattern before the gap becomes visible to the guest.",
  },
];

/* ─── Custom tooltip ────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "hsl(220 13% 10%)", border: `1px solid ${C.border}`, padding: "7px 11px", fontSize: 10, color: "#fff" }}>
      <div style={{ color: C.muted, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value}</div>
    </div>
  );
}

/* ─── Score bar ────────────────────────────────────── */
function WeightBar({ weight, color = C.amber }: { weight: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <div style={{ flex: 1, height: 3, background: "hsl(220 13% 11%)" }}>
        <div style={{ width: `${weight}%`, height: "100%", background: color }} />
      </div>
      <span style={{ fontSize: 10.5, fontWeight: 700, color, minWidth: 24, textAlign: "right" }}>{weight}</span>
    </div>
  );
}

/* ─── Impact radar ─────────────────────────────────── */
function ImpactRadar({ data, color }: { data: MomentData["impact"]; color: string }) {
  const chartData = [
    { subject: "Guest",       value: data.guest       },
    { subject: "Revenue",     value: data.revenue     },
    { subject: "Operational", value: data.operational },
    { subject: "Strategic",   value: data.strategic   },
  ];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadarChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
        <PolarGrid stroke="hsl(220 13% 13%)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 9, fill: C.muted, fontWeight: 600, letterSpacing: "0.1em" }}
        />
        <Radar
          dataKey="value" stroke={color} fill={color}
          fillOpacity={0.15} strokeWidth={1.5}
          dot={{ fill: color, r: 2 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ─── Risk ring ────────────────────────────────────── */
function RiskRing({ score }: { score: number }) {
  const color = score >= 85 ? C.red : score >= 65 ? C.amber : C.blue;
  const r = 28; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={72} height={72} viewBox="0 0 72 72">
      <circle cx={36} cy={36} r={r} fill="none" stroke="hsl(220 13% 11%)" strokeWidth={5} />
      <circle
        cx={36} cy={36} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="butt"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={36} y={36} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={14} fontWeight={800} fontFamily="inherit">
        {score}
      </text>
    </svg>
  );
}

/* ─── Moment list item ─────────────────────────────── */
function ListItem({ m, active, onClick }: { m: MomentData; active: boolean; onClick: () => void }) {
  const catColor = CAT_COLOR[m.category];
  const priColor = PRIORITY_COLOR[m.priority];
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        padding: "12px 16px",
        background: active ? "hsl(220 13% 9%)" : "transparent",
        border: "none",
        borderLeft: `2px solid ${active ? catColor : "transparent"}`,
        borderBottom: `1px solid ${C.border}`,
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)" }}>
          {m.id}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: priColor }}>
          {m.priority}
        </span>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? "#fff" : "hsl(215 16% 55%)", lineHeight: 1.35, marginBottom: 4 }}>
        {m.name}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: catColor, textTransform: "uppercase", opacity: 0.7 }}>
          {m.category}
        </span>
        <span style={{ fontSize: 9, color: C.muted }}>
          {m.confidence}% conf.
        </span>
      </div>
    </button>
  );
}

/* ─── Page ─────────────────────────────────────────── */
export default function MomentIntelligence() {
  const [selected, setSelected] = useState(0);
  const m = MOMENTS[selected];
  const catColor = CAT_COLOR[m.category];
  const priColor = PRIORITY_COLOR[m.priority];
  const confColor = m.confidence >= 90 ? C.green : m.confidence >= 75 ? C.amber : C.red;

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 0" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · BXOS Intelligence Layer
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            Moment Intelligence
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
            Signal composition · Confidence scoring · Impact analysis · Why moments matter
          </p>
        </motion.div>

      </div>

      {/* ── Master / Detail ── */}
      <div style={{
        paddingLeft: 224, display: "flex", height: "calc(100vh - 130px)",
        borderTop: `1px solid ${C.border}`,
      }}>

        {/* ── Left: Moment list ── */}
        <div style={{
          width: 260, flexShrink: 0,
          borderRight: `1px solid ${C.border}`,
          overflowY: "auto",
          background: C.bg,
        }}>
          <div style={{
            padding: "10px 16px 8px",
            borderBottom: `1px solid ${C.border}`,
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em",
            color: C.dimmed, textTransform: "uppercase",
          }}>
            {MOMENTS.length} Moments · Select to analyse
          </div>
          {MOMENTS.map((item, i) => (
            <ListItem key={item.id} m={item} active={selected === i} onClick={() => setSelected(i)} />
          ))}
        </div>

        {/* ── Right: Detail panel ── */}
        <div style={{ flex: 1, overflowY: "auto", background: "hsl(220 13% 5%)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── Identity bar ── */}
              <div style={{
                padding: "20px 32px",
                borderBottom: `1px solid ${C.border}`,
                borderLeft: `3px solid ${catColor}`,
                background: C.card2,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)" }}>{m.id}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase", border: `1px solid ${catColor}30`, padding: "2px 7px", background: `${catColor}0d` }}>{m.category}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: priColor, textTransform: "uppercase", border: `1px solid ${priColor}30`, padding: "2px 7px", background: `${priColor}0d` }}>{m.priority}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
                    {m.name}
                  </div>
                  <div style={{
                    fontSize: 12, color: "hsl(215 16% 48%)", lineHeight: 1.6,
                    maxWidth: 560, padding: "12px 16px",
                    borderLeft: `2px solid ${catColor}60`,
                    background: `${catColor}06`,
                    fontStyle: "italic",
                  }}>
                    {`"${m.whyItMatters}"`}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>BXOS Confidence</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: confColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {m.confidence}%
                  </div>
                  <div style={{ fontSize: 9, color: C.dimmed, marginTop: 4 }}>{m.frequency}</div>
                </div>
              </div>

              {/* ── Priority reasoning ── */}
              <div style={{ padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 8 }}>
                  Priority Reasoning · BXOS Classification
                </div>
                <div style={{ fontSize: 12, color: "hsl(215 16% 55%)", lineHeight: 1.7, maxWidth: 700 }}>
                  {m.priorityReasoning}
                </div>
              </div>

              {/* ── Main 3-col grid ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: C.border }}>

                {/* Signals contributing */}
                <div style={{ background: C.bg, padding: "20px 24px" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 16 }}>
                    Signals Contributing
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {m.signals.map((s, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.name}</span>
                        </div>
                        <div style={{ fontSize: 9.5, color: C.muted, marginBottom: 6 }}>
                          {s.source}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontSize: 7.5, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", minWidth: 48 }}>Weight</div>
                          <WeightBar weight={s.weight} color={catColor} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact radar + scores */}
                <div style={{ background: C.bg, padding: "20px 24px" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
                    Impact Scores
                  </div>
                  <ImpactRadar data={m.impact} color={catColor} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginTop: 4 }}>
                    {(["guest", "revenue", "operational", "strategic"] as const).map(k => {
                      const colors = { guest: C.amber, revenue: C.green, operational: C.blue, strategic: C.violet };
                      return (
                        <div key={k}>
                          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 2, background: "hsl(220 13% 12%)" }}>
                              <div style={{ width: `${m.impact[k]}%`, height: "100%", background: colors[k] }} />
                            </div>
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: colors[k], minWidth: 20 }}>{m.impact[k]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk score */}
                <div style={{ background: C.bg, padding: "20px 24px" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 16 }}>
                    Risk Score · If Missed
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                    <RiskRing score={m.riskScore} />
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: m.riskScore >= 85 ? C.red : m.riskScore >= 65 ? C.amber : C.blue, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                        {m.riskScore >= 85 ? "CRITICAL RISK" : m.riskScore >= 65 ? "HIGH RISK" : "MODERATE RISK"}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>
                        Consequence if<br />unaddressed
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "hsl(215 16% 44%)", lineHeight: 1.65 }}>
                    {m.riskNote}
                  </div>
                </div>
              </div>

              {/* ── Frequency trend + impact note ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.border }}>

                {/* Frequency trend */}
                <div style={{ background: C.bg, padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase" }}>
                      Frequency Trend · Jan–Jun
                    </div>
                    <span style={{ fontSize: 9, color: C.green }}>↓ Declining = WELBX working</span>
                  </div>
                  <div style={{ height: 88 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={m.trendData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id={`grad-trend-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={catColor} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={catColor} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="v" stroke={catColor} strokeWidth={1.5} fill={`url(#grad-trend-${m.id})`} dot={false} activeDot={{ r: 3, fill: catColor }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: C.muted }}>
                    Declining frequency reflects intervention efficacy. WELBX prevents recurrence through pattern learning.
                  </div>
                </div>

                {/* Impact note */}
                <div style={{ background: C.bg, padding: "20px 24px" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 12 }}>
                    Value Score · Impact Analysis
                  </div>
                  <div style={{ fontSize: 12, color: "hsl(215 16% 52%)", lineHeight: 1.75, marginBottom: 16 }}>
                    {m.impactNote}
                  </div>
                  <div style={{
                    padding: "12px 14px",
                    border: `1px solid ${catColor}22`,
                    background: `${catColor}08`,
                    borderLeft: `2px solid ${catColor}`,
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: catColor, textTransform: "uppercase", marginBottom: 4 }}>
                      Recommended Priority
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: priColor }}>{m.priority}</div>
                  </div>
                </div>
              </div>

              {/* ── Moment relationships ── */}
              <div style={{ padding: "18px 32px 32px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 12 }}>
                  Moment Relationships · Connected Signals
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {m.relationships.map((r) => (
                    <span key={r} style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                      color: "hsl(215 16% 50%)", padding: "6px 14px",
                      border: `1px solid ${C.border}`,
                      background: "hsl(220 13% 7%)",
                    }}>
                      {r}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 10, color: C.dimmed, lineHeight: 1.6 }}>
                  Moments do not exist in isolation. WELBX tracks causal chains — where one unresolved moment creates conditions for the next.
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
