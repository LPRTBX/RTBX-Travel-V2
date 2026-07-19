import { motion } from "framer-motion";

/* ─── Palette ──────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  blue:   "#3b82f6",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 38%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Data types ───────────────────────────────────── */
interface PatternItem {
  id: string;
  severity: string;
  severityColor: string;
  headline: string;
  detail: string;
  metrics: { label: string; value: string; direction?: "up" | "down"; positive?: boolean }[];
  properties: string[];
  onset: string;
}

interface RiskItem {
  id: string;
  level: string;
  levelColor: string;
  headline: string;
  detail: string;
  window: string;
  metrics: { label: string; value: string }[];
  properties: string[];
}

interface OpportunityItem {
  id: string;
  type: string;
  typeColor: string;
  headline: string;
  detail: string;
  value: string;
  window: string;
  properties: string[];
}

interface ActionItem {
  id: string;
  timing: "IMMEDIATE" | "THIS WEEK" | "REVIEW" | "MONITOR";
  headline: string;
  detail: string;
  owner: string;
  properties: string;
}

const TIMING_COLOR: Record<ActionItem["timing"], string> = {
  "IMMEDIATE": C.red,
  "THIS WEEK": C.amber,
  "REVIEW":    C.blue,
  "MONITOR":   C.muted,
};

/* ─── Section data ─────────────────────────────────── */

const PATTERNS: PatternItem[] = [
  {
    id: "PAT-01",
    severity: "INCREASING",
    severityColor: C.red,
    headline: "Complaint volume increasing",
    detail: "Guest complaint events up 23% over the past 14 days. Pattern concentrated around Wednesday–Thursday arrivals. Contributing factors: arrival clustering, staffing gaps, and mobile check-in inactive at two properties.",
    metrics: [
      { label: "14-day change",    value: "+23%",       direction: "up",   positive: false },
      { label: "Peak window",      value: "Wed–Thu AM"                                      },
      { label: "Complaint-to-stay",value: "4.1% → 5.1%", direction: "up",  positive: false },
    ],
    properties: ["Grand Meridian, Edinburgh", "Grand Meridian, Dubai"],
    onset: "14 days",
  },
  {
    id: "PAT-02",
    severity: "DECLINING",
    severityColor: C.amber,
    headline: "VIP satisfaction declining",
    detail: "M1-tier guest satisfaction has fallen 1.8 NPS points over 30 days. Four of six VIP arrival moments were not resolved within the target window. Pattern spans three properties. Root: inconsistent arrival protocol activation.",
    metrics: [
      { label: "NPS shift",        value: "−1.8 pts",   direction: "down", positive: false },
      { label: "Protocol miss rate",value: "4 of 6 events"                                 },
      { label: "Period",           value: "30 days"                                         },
    ],
    properties: ["Grand Meridian, London", "Hotel du Lac, Geneva", "Meridian Palace, Singapore"],
    onset: "30 days",
  },
  {
    id: "PAT-03",
    severity: "INCREASING",
    severityColor: C.amber,
    headline: "Staff fatigue pattern detected",
    detail: "Concierge and front desk response latency has increased 18% over three weeks. BXOS is detecting more unattended desk events, increased break-request clustering, and slower signal-to-response times — a composite pattern consistent with accumulated fatigue.",
    metrics: [
      { label: "Response latency",  value: "+18%",       direction: "up",   positive: false },
      { label: "Desk unattended",   value: "3.4× weekly avg"                                },
      { label: "Break clustering",  value: "Peak: 14:00–16:00"                              },
    ],
    properties: ["The Cartwright, Edinburgh", "Grand Meridian, London"],
    onset: "3 weeks",
  },
  {
    id: "PAT-04",
    severity: "WIDENING",
    severityColor: C.violet,
    headline: "First-stay engagement gap growing",
    detail: "41% of first-stay guests are not receiving proactive contact within the 10-minute target window. This gap has grown from 28% over the past 21 days. First-stay engagement directly predicts repeat booking probability — each missed contact reduces conversion by an estimated 14%.",
    metrics: [
      { label: "Miss rate (now)",   value: "41%",        direction: "up",   positive: false },
      { label: "Miss rate (21d ago)",value: "28%"                                           },
      { label: "Repeat booking risk",value: "−14% per miss"                                 },
    ],
    properties: ["Meridian Palace, Singapore", "Grand Meridian, Dubai"],
    onset: "21 days",
  },
];

const RISKS: RiskItem[] = [
  {
    id: "RSK-01",
    level: "HIGH",
    levelColor: C.red,
    headline: "Weekend arrival surge · Mobile check-in inactive",
    detail: "Grand Meridian Dubai is forecast to receive 28% above-average arrivals on Saturday. Mobile check-in is currently inactive. Without intervention, projected queue time exceeds 14 minutes at peak. Complaint probability: elevated. Intervention window closes Thursday.",
    window: "48 hours",
    metrics: [
      { label: "Arrival delta",  value: "+28% Saturday" },
      { label: "Queue forecast", value: "14+ min at peak" },
      { label: "Window",         value: "Thursday · 18:00" },
    ],
    properties: ["Grand Meridian, Dubai"],
  },
  {
    id: "RSK-02",
    level: "HIGH",
    levelColor: C.amber,
    headline: "Housekeeping bottleneck · VIP room readiness slipping",
    detail: "Hotel du Lac Geneva is averaging 47-minute room readiness (target: 30 minutes). Three VIP rooms were delayed last week. The root cause is an incomplete staffing realignment from two weeks ago. A further delay increases the risk of VIP arrival friction at the weekend.",
    window: "This week",
    metrics: [
      { label: "Readiness avg", value: "47 min (target 30)" },
      { label: "VIP delays",    value: "3 last week" },
      { label: "Root cause",    value: "Staffing realignment incomplete" },
    ],
    properties: ["Hotel du Lac, Geneva"],
  },
  {
    id: "RSK-03",
    level: "MEDIUM",
    levelColor: C.blue,
    headline: "Concierge desk gap · Recurring Thursday–Friday schedule",
    detail: "The Cartwright Edinburgh has recorded three concierge desk unattended events exceeding eight minutes in the past five days. The underlying cause is a scheduling gap on Thursday and Friday afternoons. Without correction, this will recur weekly and compound with the fatigue pattern already detected.",
    window: "Recurring",
    metrics: [
      { label: "Events (5 days)", value: "3 unattended >8 min" },
      { label: "Pattern",         value: "Thu–Fri PM · Recurring" },
      { label: "Related signal",  value: "Staff fatigue pattern" },
    ],
    properties: ["The Cartwright, Edinburgh"],
  },
  {
    id: "RSK-04",
    level: "MEDIUM",
    levelColor: C.blue,
    headline: "Maintenance backlog · Guest-facing room exposure",
    detail: "Meridian Palace Singapore has four maintenance requests unresolved beyond 24 hours, one of which is a guest-occupied room. At this stage the guest has not complained, but complaint risk is elevated. The guest is a returning M2-tier traveller — the reputational stakes are disproportionate to the maintenance cost.",
    window: "Today",
    metrics: [
      { label: "Unresolved >24h", value: "4 requests" },
      { label: "Guest-facing",    value: "1 occupied room" },
      { label: "Guest tier",      value: "M2 · Returning" },
    ],
    properties: ["Meridian Palace, Singapore"],
  },
];

const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "OPP-01",
    type: "ACTIVATION",
    typeColor: C.green,
    headline: "Upgrade pipeline · 14 M1/M2 guests arriving",
    detail: "14 loyalty-tier guests are arriving across the portfolio in the next 72 hours. Suite availability is confirmed at three properties. Prior upgrade acceptance rates for this cohort: 67%. This is the highest-value upgrade window of the month.",
    value: "Est. Score 92",
    window: "72 hours",
    properties: ["London", "Dubai", "Singapore"],
  },
  {
    id: "OPP-02",
    type: "COMMERCIAL",
    typeColor: C.amber,
    headline: "Spa low utilisation · VIP access opportunity",
    detail: "The Cartwright Edinburgh spa is running at 34% capacity on Friday morning. Three VIP-tier guests are on property with no spa booking on record. A targeted morning offer has a historical conversion rate of 58% for this guest profile.",
    value: "Est. Score 71",
    window: "36 hours",
    properties: ["The Cartwright, Edinburgh"],
  },
  {
    id: "OPP-03",
    type: "PERSONALISATION",
    typeColor: C.violet,
    headline: "F&B preference gap · 14 returning guests",
    detail: "Meridian Palace Singapore has 14 returning guests arriving this week whose F&B preferences are on file but no targeted offer has been issued. This is a low-effort, high-conversion activation — each personalised contact historically achieves high F&B activation.",
    value: "Est. Score 68",
    window: "This week",
    properties: ["Meridian Palace, Singapore"],
  },
  {
    id: "OPP-04",
    type: "RECOVERY",
    typeColor: C.blue,
    headline: "Late checkout conversion below target",
    detail: "Grand Meridian London has 22 departing rooms today. Late checkout conversion this week is running at 31% against a 68% target — an activation gap. The shortfall is not demand-driven: occupancy tonight is 72%. The gap is operational: no proactive offer has been issued before 10:00.",
    value: "Est. Score 79",
    window: "Today",
    properties: ["Grand Meridian, London"],
  },
];

const ACTIONS: ActionItem[] = [
  {
    id: "ACT-01",
    timing: "IMMEDIATE",
    headline: "Activate mobile check-in · Grand Meridian Dubai",
    detail: "Enable mobile check-in before Saturday's arrival peak. Forecast +28% arrivals. Without this, projected queue exceeds 14 minutes. This is a configuration action — estimated time to activate: 15 minutes.",
    owner: "Front Desk Lead · A. Osei",
    properties: "Grand Meridian, Dubai · Before Saturday 08:00",
  },
  {
    id: "ACT-02",
    timing: "IMMEDIATE",
    headline: "Escalate maintenance backlog · Singapore · Guest room priority",
    detail: "One of the four unresolved maintenance requests involves an occupied M2-tier guest room. Prioritise resolution today. If unresolved by 18:00, guest complaint probability crosses the elevated threshold.",
    owner: "Engineering Lead · On duty",
    properties: "Meridian Palace, Singapore · Today",
  },
  {
    id: "ACT-03",
    timing: "THIS WEEK",
    headline: "Issue upgrade offers · 14 arriving M1/M2 guests",
    detail: "Assign Guest Relations at London, Dubai, and Singapore to issue personalised upgrade offers to the 14 arriving M1/M2-tier guests. Use prior preference data. Historical conversion for this cohort is 67%. Estimated activation pipeline: Score 92.",
    owner: "Guest Relations · Portfolio",
    properties: "London · Dubai · Singapore · 72-hour window",
  },
  {
    id: "ACT-04",
    timing: "THIS WEEK",
    headline: "Correct Edinburgh Thursday–Friday staffing schedule",
    detail: "The concierge desk gap is a scheduling issue, not a headcount issue. A deputy or rotation assignment for Thu–Fri afternoons will close the recurring unattended event pattern and reduce the compounding fatigue risk signal.",
    owner: "Department Head · Edinburgh",
    properties: "The Cartwright, Edinburgh · Recurring fix",
  },
  {
    id: "ACT-05",
    timing: "REVIEW",
    headline: "Audit first-stay contact protocol · Reduce window to 8 minutes",
    detail: "The current 10-minute engagement window is being missed at 41%. Either the target is unrealistic given current staffing, or the process is broken. A review will determine whether the fix is protocol adjustment or resource reallocation. This directly affects loyalty conversion.",
    owner: "Operations Director",
    properties: "Singapore · Dubai · Portfolio-wide",
  },
  {
    id: "ACT-06",
    timing: "MONITOR",
    headline: "Track VIP satisfaction trend · Escalate if sustained",
    detail: "The −1.8 NPS point decline over 30 days is at the threshold for GM escalation. If the trend continues for a further 7 days, convene a protocol review across the three affected properties. The arrival protocol inconsistency is the likely root cause.",
    owner: "General Manager · London, Geneva, Singapore",
    properties: "Portfolio · 7-day monitor",
  },
];

/* ─── Sub-components ───────────────────────────────── */

function Metric({ label, value, direction, positive }: {
  label: string; value: string;
  direction?: "up" | "down"; positive?: boolean;
}) {
  const arrowColor = direction
    ? (positive === false ? C.red : C.green)
    : C.muted;
  const arrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "";
  return (
    <div>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: direction ? arrowColor : "hsl(215 16% 55%)" }}>
        {arrow && <span style={{ marginRight: 3 }}>{arrow}</span>}{value}
      </div>
    </div>
  );
}

function PropTag({ name }: { name: string }) {
  return (
    <span style={{
      fontSize: 8.5, color: C.dimmed, padding: "2px 8px",
      border: `1px solid ${C.border}`, background: "hsl(220 13% 8%)",
    }}>
      {name}
    </span>
  );
}

function SectionHeader({ label, color, count, note }: {
  label: string; color: string; count: number; note: string;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0 14px",
      borderBottom: `1px solid ${C.border}`,
      marginBottom: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 3, height: 18, background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
          {label}
        </span>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color, border: `1px solid ${color}33`, padding: "2px 8px", background: `${color}0d` }}>
          {count} {count === 1 ? "ITEM" : "ITEMS"}
        </span>
      </div>
      <span style={{ fontSize: 10, color: C.dimmed, letterSpacing: "0.04em" }}>{note}</span>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────── */
export default function StrategicVisibility() {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 },
  });

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div {...fade(0)} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
                WELBX · Strategic Intelligence
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
                Strategic Visibility
              </h1>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
                Patterns before they become problems &nbsp;·&nbsp; Portfolio-wide signal analysis
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
                Signal period
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 40%)" }}>
                Last 30 days · 5 properties
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Summary strip ── */}
        <motion.div {...fade(0.08)} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 36 }}>
          {[
            { label: "Emerging Patterns", value: PATTERNS.length, color: C.violet, note: "Require leadership attention" },
            { label: "Operational Risks",  value: RISKS.length,    color: C.red,    note: "Active risk window open" },
            { label: "Activation Opportunities", value: OPPORTUNITIES.length, color: C.green, note: "Pipeline identifiable" },
            { label: "Recommended Actions",   value: ACTIONS.length,       color: C.amber, note: "Across portfolio" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "16px 20px", background: C.card,
              borderTop: `2px solid ${s.color}`,
              border: `1px solid ${C.border}`, borderTopColor: s.color,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.025em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase" }}>{s.note}</div>
            </div>
          ))}
        </motion.div>

        {/* ══════════ EMERGING PATTERNS ══════════ */}
        <motion.div {...fade(0.14)} style={{ marginBottom: 40 }}>
          <SectionHeader
            label="Emerging Patterns"
            color={C.violet}
            count={PATTERNS.length}
            note="Trends identified before escalation threshold · BXOS Pattern Engine"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {PATTERNS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.06, duration: 0.35 }}
                style={{
                  padding: "18px 22px",
                  background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${p.severityColor}`,
                  borderTopWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: p.severityColor, border: `1px solid ${p.severityColor}30`, padding: "2px 7px", background: `${p.severityColor}0d`, textTransform: "uppercase" }}>
                    {p.severity}
                  </span>
                  <span style={{ fontSize: 7.5, letterSpacing: "0.08em", color: C.dimmed, textTransform: "uppercase" }}>
                    {p.id} · {p.onset} onset
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 8 }}>
                  {p.headline}
                </div>
                <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>
                  {p.detail}
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  {p.metrics.map(m => (
                    <Metric key={m.label} {...m} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.properties.map(prop => <PropTag key={prop} name={prop} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════ OPERATIONAL RISKS ══════════ */}
        <motion.div {...fade(0.2)} style={{ marginBottom: 40 }}>
          <SectionHeader
            label="Operational Risks"
            color={C.red}
            count={RISKS.length}
            note="Active risk windows · Require intervention within stated timeframe"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {RISKS.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 + i * 0.06, duration: 0.35 }}
                style={{
                  padding: "18px 22px",
                  background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${r.levelColor}`,
                  borderTopWidth: 0,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: r.levelColor, border: `1px solid ${r.levelColor}30`, padding: "2px 7px", background: `${r.levelColor}0d`, textTransform: "uppercase" }}>
                      {r.level}
                    </span>
                    <span style={{ fontSize: 7.5, letterSpacing: "0.08em", color: C.dimmed, textTransform: "uppercase" }}>{r.id}</span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: r.levelColor }}>
                    Window: {r.window}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 8 }}>
                  {r.headline}
                </div>
                <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>
                  {r.detail}
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  {r.metrics.map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 55%)" }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {r.properties.map(prop => <PropTag key={prop} name={prop} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════ REVENUE OPPORTUNITIES ══════════ */}
        <motion.div {...fade(0.26)} style={{ marginBottom: 40 }}>
          <SectionHeader
            label="Activation Opportunities"
            color={C.green}
            count={OPPORTUNITIES.length}
            note="Identified pipeline · Action required within stated window"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {OPPORTUNITIES.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                style={{
                  padding: "18px 22px",
                  background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${o.typeColor}`,
                  borderTopWidth: 0,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: o.typeColor, border: `1px solid ${o.typeColor}30`, padding: "2px 7px", background: `${o.typeColor}0d`, textTransform: "uppercase" }}>
                      {o.type}
                    </span>
                    <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>{o.id}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>{o.value}</div>
                    <div style={{ fontSize: 8, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>Window: {o.window}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 8 }}>
                  {o.headline}
                </div>
                <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
                  {o.detail}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {o.properties.map(prop => <PropTag key={prop} name={prop} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════ RECOMMENDED ACTIONS ══════════ */}
        <motion.div {...fade(0.32)}>
          <SectionHeader
            label="Recommended Actions"
            color={C.amber}
            count={ACTIONS.length}
            note="BXOS-prioritised · Ordered by urgency"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {ACTIONS.map((a, i) => {
              const timingColor = TIMING_COLOR[a.timing];
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.36 + i * 0.05, duration: 0.35 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 180px",
                    gap: 0,
                    background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                    border: `1px solid ${C.border}`,
                    borderTopWidth: 0,
                    borderLeft: `2px solid ${timingColor}`,
                    alignItems: "stretch",
                  }}
                >
                  {/* Timing */}
                  <div style={{
                    padding: "16px 14px",
                    borderRight: `1px solid ${C.border}`,
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-start", alignItems: "flex-start",
                    gap: 6,
                  }}>
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                      color: timingColor, textTransform: "uppercase",
                      border: `1px solid ${timingColor}30`, padding: "3px 7px",
                      background: `${timingColor}0d`,
                    }}>
                      {a.timing}
                    </span>
                    <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {a.id}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 6 }}>
                      {a.headline}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>
                      {a.detail}
                    </div>
                  </div>

                  {/* Owner + property */}
                  <div style={{
                    padding: "16px 18px",
                    borderLeft: `1px solid ${C.border}`,
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 2 }}>Owner</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 55%)", lineHeight: 1.4, marginBottom: 8 }}>
                      {a.owner}
                    </div>
                    <div style={{ fontSize: 9, color: C.dimmed, lineHeight: 1.5 }}>
                      {a.properties}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
          style={{ marginTop: 36, paddingTop: 18, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Pattern detection · Signal classification" },
              { name: "NEXUS", desc: "Risk routing · Escalation governance" },
              { name: "VECTOR", desc: "Action tracking · Outcome attribution" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Strategic Visibility · WELBX · Confidential
          </div>
        </motion.div>

      </div>
    </div>
  );
}
