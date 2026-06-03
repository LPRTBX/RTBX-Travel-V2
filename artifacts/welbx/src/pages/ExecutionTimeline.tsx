import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─────────────────────────────────────────── */

type StageKey = "signal" | "assessment" | "decision" | "action" | "outcome";

interface Detail {
  label: string;
  value: string;
}

interface Stage {
  key: StageKey;
  label: string;
  engine: string;
  timestamp: string;
  status: string;
  statusColor: string;
  headline: string;
  body: string;
  details: Detail[];
}

interface Scenario {
  id: string;
  label: string;
  sublabel: string;
  priority: string;
  priorityColor: string;
  stages: Stage[];
}

/* ─── Palette ────────────────────────────────────────── */

const C = {
  amber: "#c9a84c",
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  muted: "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 24%)",
  border: "hsl(220 13% 9%)",
  card: "hsl(220 13% 7%)",
  bg: "hsl(220 13% 5%)",
};

const STAGE_COLOR: Record<StageKey, string> = {
  signal:     C.amber,
  assessment: C.blue,
  decision:   "#a78bfa",
  action:     C.amber,
  outcome:    C.green,
};

/* ─── Scenario data ──────────────────────────────────── */

const SCENARIOS: Scenario[] = [
  {
    id: "distress",
    label: "Guest Distress",
    sublabel: "Room 412 · Welfare Protocol",
    priority: "CRITICAL",
    priorityColor: C.red,
    stages: [
      {
        key: "signal",
        label: "Signal",
        engine: "BXOS · Sensor Array",
        timestamp: "12:46:03",
        status: "RECEIVED",
        statusColor: C.amber,
        headline: "In-room distress signal detected · Room 412",
        body: "Motion sensor recorded zero movement over a 22-minute window. No door activity. No room service request. Guest check-in time indicates they should be active.",
        details: [
          { label: "Signal ID", value: "SIG-4471" },
          { label: "Source", value: "In-room motion sensor" },
          { label: "Trigger threshold", value: "No movement · 20 min" },
          { label: "Corroborating signal", value: "No door open event · 38 min" },
          { label: "Guest check-in", value: "10:14 — 2h 32m prior" },
          { label: "Risk window", value: "Active" },
        ],
      },
      {
        key: "assessment",
        label: "Assessment",
        engine: "BXOS · Pattern Engine",
        timestamp: "12:46:05",
        status: "CLASSIFIED",
        statusColor: C.blue,
        headline: "Welfare concern — Level 2 · 96% confidence",
        body: "BXOS cross-referenced the motion pattern against guest profile, check-in time, and historical baseline. Stillness duration exceeds the 20-minute welfare threshold. Pattern matched: unresponsive guest profile.",
        details: [
          { label: "Classification", value: "Welfare Concern · Level 2" },
          { label: "Confidence", value: "96%" },
          { label: "Pattern matched", value: "Extended stillness + no egress" },
          { label: "Guest profile cross-ref", value: "Solo traveller · Business" },
          { label: "Historical baseline", value: "3.2 min average room activity" },
          { label: "Assessment latency", value: "2.1 seconds" },
        ],
      },
      {
        key: "decision",
        label: "Decision",
        engine: "BXOS · Decision Engine",
        timestamp: "12:46:09",
        status: "GOVERNED",
        statusColor: "#a78bfa",
        headline: "Welfare Protocol WP-02 initiated · Duty manager dispatch",
        body: "Three response options evaluated. BXOS selected immediate physical dispatch over phone call or door alert, governed by Protocol WP-02 (solo guest, extended stillness). No escalation delay permitted.",
        details: [
          { label: "Protocol", value: "WP-02 · Welfare Response" },
          { label: "Options evaluated", value: "3" },
          { label: "Selected response", value: "Physical dispatch · Silent" },
          { label: "Rejected options", value: "Room call, Door alert" },
          { label: "Governing rule", value: "Solo guest · Stillness > 20 min" },
          { label: "Decision latency", value: "4.3 seconds" },
        ],
      },
      {
        key: "action",
        label: "Action",
        engine: "NEXUS · VECTOR",
        timestamp: "12:46:12",
        status: "EXECUTED",
        statusColor: C.amber,
        headline: "Duty manager dispatched · Silent protocol active",
        body: "NEXUS routed the response to the on-duty manager. VECTOR coordinated simultaneous notifications without triggering a guest-visible alert. Concierge activated as secondary contact.",
        details: [
          { label: "Primary responder", value: "J. Halliday · Duty Manager" },
          { label: "Dispatch time", value: "12:46:12" },
          { label: "Alert type", value: "Silent · Staff-only" },
          { label: "Secondary contact", value: "Concierge · M. Vance" },
          { label: "Concierge notified", value: "12:46:14" },
          { label: "Response en route", value: "12:46:18" },
        ],
      },
      {
        key: "outcome",
        label: "Outcome",
        engine: "VECTOR · Tracking",
        timestamp: "12:58:41",
        status: "RESOLVED",
        statusColor: C.green,
        headline: "Guest located safely · Protocol closed",
        body: "Duty manager arrived at Room 412 at 12:50:22. Guest was safe. No medical event. Staff response completed without escalation. No complaint filed. Protocol closed at 12:58:41.",
        details: [
          { label: "Staff on scene", value: "12:50:22 · 4m 10s from dispatch" },
          { label: "Guest status", value: "Safe · No medical event" },
          { label: "Complaint filed", value: "None" },
          { label: "Guest NPS signal", value: "No negative indicator" },
          { label: "Protocol closed", value: "12:58:41" },
          { label: "Total response time", value: "12 minutes 38 seconds" },
        ],
      },
    ],
  },

  {
    id: "service",
    label: "Service Recovery",
    sublabel: "Foyer Congestion · Queue Pressure",
    priority: "HIGH",
    priorityColor: C.amber,
    stages: [
      {
        key: "signal",
        label: "Signal",
        engine: "BXOS · Sensor Array",
        timestamp: "12:43:18",
        status: "RECEIVED",
        statusColor: C.amber,
        headline: "Foyer capacity threshold exceeded · 87% occupancy",
        body: "Lobby occupancy sensor recorded 87 of 100 capacity. Arrival rate running 34% above forecast. Flight BA0173 arrived 14 minutes early with 31 simultaneous check-ins pending.",
        details: [
          { label: "Signal ID", value: "SIG-4468" },
          { label: "Foyer occupancy", value: "87 / 100 · 87%" },
          { label: "Arrival rate delta", value: "+34% above forecast" },
          { label: "Contributing event", value: "BA0173 · 14 min early arrival" },
          { label: "Desks at capacity", value: "4 of 4 · Maxed" },
          { label: "Mobile check-in", value: "Not active" },
        ],
      },
      {
        key: "assessment",
        label: "Assessment",
        engine: "BXOS · Pattern Engine",
        timestamp: "12:43:21",
        status: "CLASSIFIED",
        statusColor: C.blue,
        headline: "Service disruption risk · High · 89% confidence",
        body: "Three converging signals: arrival rate spike, desk capacity at maximum, mobile check-in inactive. Pattern matches historic peak-stress events. Predicted queue time: 12+ minutes within 4 minutes if unaddressed.",
        details: [
          { label: "Classification", value: "Service Disruption · High" },
          { label: "Confidence", value: "89%" },
          { label: "Predicted queue time", value: "12+ min without action" },
          { label: "Intervention window", value: "T+4 minutes" },
          { label: "Historical match", value: "Peak-stress event · June 2024" },
          { label: "Assessment latency", value: "2.8 seconds" },
        ],
      },
      {
        key: "decision",
        label: "Decision",
        engine: "BXOS · Decision Engine",
        timestamp: "12:43:27",
        status: "GOVERNED",
        statusColor: "#a78bfa",
        headline: "Full overflow response · Mobile redirect + staff redeployment",
        body: "BXOS evaluated three options: monitor only, mobile redirect only, or full overflow activation. Full response selected based on arrival cluster size and intervention window. Desk D3 overflow authorised.",
        details: [
          { label: "Protocol", value: "OP-03 · Overflow Response" },
          { label: "Options evaluated", value: "3" },
          { label: "Selected response", value: "Full overflow + mobile redirect" },
          { label: "Rejected options", value: "Monitor only, Redirect only" },
          { label: "Governing rule", value: "Arrival cluster > 30 + desks maxed" },
          { label: "Decision latency", value: "6.1 seconds" },
        ],
      },
      {
        key: "action",
        label: "Action",
        engine: "NEXUS · VECTOR",
        timestamp: "12:43:33",
        status: "EXECUTED",
        statusColor: C.amber,
        headline: "Desk D3 activated · Mobile enabled · Staff redeployed",
        body: "NEXUS simultaneously activated overflow desk D3, enabled mobile check-in, and redeployed two staff from the conference level. Guest SMS sent to arriving guests with mobile check-in option.",
        details: [
          { label: "Desk D3 activated", value: "12:43:33" },
          { label: "Mobile check-in", value: "Enabled · 12:43:35" },
          { label: "Staff redeployed", value: "2 · From conference level" },
          { label: "Guest SMS sent", value: "12:43:38 · 28 recipients" },
          { label: "Coordination time", value: "5 seconds end-to-end" },
          { label: "VECTOR status", value: "All actions confirmed" },
        ],
      },
      {
        key: "outcome",
        label: "Outcome",
        engine: "VECTOR · Tracking",
        timestamp: "12:49:44",
        status: "RESOLVED",
        statusColor: C.green,
        headline: "Queue cleared · Wait time 12 min → 3 min",
        body: "Queue cleared within 6 minutes. No guest escalations. Wait time reduced from predicted 12+ minutes to 3 minutes. NPS signal remained positive. Zero operational complaints recorded.",
        details: [
          { label: "Queue cleared", value: "12:49:44 · 6m 11s" },
          { label: "Wait time (before)", value: "12+ min predicted" },
          { label: "Wait time (achieved)", value: "3 minutes" },
          { label: "Escalations", value: "0" },
          { label: "NPS signal", value: "Positive · No negative indicator" },
          { label: "Revenue protected", value: "$4,800 (estimated)" },
        ],
      },
    ],
  },

  {
    id: "staff",
    label: "Staff Support",
    sublabel: "Concierge Coverage · Internal Redeployment",
    priority: "ELEVATED",
    priorityColor: "hsl(43 60% 46%)",
    stages: [
      {
        key: "signal",
        label: "Signal",
        engine: "BXOS · Sensor Array",
        timestamp: "11:52:44",
        status: "RECEIVED",
        statusColor: C.amber,
        headline: "Concierge desk unattended · 8+ minutes · Lobby pressure building",
        body: "Concierge desk unattended for 8 minutes 22 seconds. Front desk reduced to single staff. Lobby approaching service threshold. Weather delay at Heathrow compounding arrival clustering.",
        details: [
          { label: "Signal ID", value: "SIG-4421" },
          { label: "Concierge unattended", value: "8m 22s" },
          { label: "Front desk staffing", value: "1 of 3 scheduled" },
          { label: "Lobby load", value: "71% · Approaching threshold" },
          { label: "Contributing factor", value: "Heathrow delay · Flight LH4482" },
          { label: "Convergence", value: "3-signal event" },
        ],
      },
      {
        key: "assessment",
        label: "Assessment",
        engine: "BXOS · Pattern Engine",
        timestamp: "11:52:47",
        status: "CLASSIFIED",
        statusColor: C.blue,
        headline: "Staff capacity risk · Elevated · 74% confidence",
        body: "BXOS identified multi-signal convergence: unattended desk, reduced front desk coverage, and rising lobby load. Pattern matches service degradation precursor events. Guest-facing gap risk within 4 minutes.",
        details: [
          { label: "Classification", value: "Staff Capacity Risk · Elevated" },
          { label: "Confidence", value: "74%" },
          { label: "Pattern matched", value: "Multi-signal convergence · Staff gap" },
          { label: "Guest-facing gap risk", value: "Within 4 minutes" },
          { label: "Historical match", value: "Precursor to service complaint · 63%" },
          { label: "Assessment latency", value: "2.4 seconds" },
        ],
      },
      {
        key: "decision",
        label: "Decision",
        engine: "BXOS · Decision Engine",
        timestamp: "11:52:50",
        status: "GOVERNED",
        statusColor: "#a78bfa",
        headline: "Internal redeployment · F&B supervisor redirected to lobby",
        body: "BXOS evaluated three options: wait for scheduled staff, external call-in, or internal redeployment. Internal move selected as fastest response within staffing protocol. F&B supervisor identified as closest qualified resource.",
        details: [
          { label: "Protocol", value: "SF-01 · Internal Redeployment" },
          { label: "Options evaluated", value: "3" },
          { label: "Selected response", value: "Internal redeployment · F&B floor" },
          { label: "Rejected options", value: "Wait, External call-in" },
          { label: "Governing rule", value: "Guest-facing gap risk within window" },
          { label: "Decision latency", value: "3.2 seconds" },
        ],
      },
      {
        key: "action",
        label: "Action",
        engine: "NEXUS · VECTOR",
        timestamp: "11:52:53",
        status: "EXECUTED",
        statusColor: C.amber,
        headline: "R. Santos redirected · Concierge desk covered in 28 seconds",
        body: "NEXUS notified R. Santos (F&B Supervisor) via staff app. Duty manager received a parallel awareness alert. F&B floor coverage maintained by team rotation. Concierge desk operational within 28 seconds.",
        details: [
          { label: "Responder", value: "R. Santos · F&B Supervisor" },
          { label: "Notification sent", value: "11:52:53" },
          { label: "Desk coverage restored", value: "11:53:21 · 28 seconds" },
          { label: "Duty manager alerted", value: "Parallel awareness only" },
          { label: "F&B floor maintained", value: "Team rotation activated" },
          { label: "VECTOR status", value: "All actions confirmed" },
        ],
      },
      {
        key: "outcome",
        label: "Outcome",
        engine: "VECTOR · Tracking",
        timestamp: "12:04:00",
        status: "RESOLVED",
        statusColor: C.green,
        headline: "Desk covered · No guest wait · Incident closed",
        body: "Concierge desk covered within 28 seconds. No guest waited without assistance. F&B service maintained throughout. No complaint raised. Incident closed at 12:04:00. BXOS logged for staffing pattern review.",
        details: [
          { label: "Desk covered in", value: "28 seconds" },
          { label: "Guests waiting", value: "0" },
          { label: "Service maintained", value: "F&B uninterrupted" },
          { label: "Complaints raised", value: "None" },
          { label: "Incident closed", value: "12:04:00" },
          { label: "BXOS note", value: "Pattern logged · Staffing review" },
        ],
      },
    ],
  },
];

/* ─── Sub-components ─────────────────────────────────── */

function ScenarioTab({ s, active, onClick }: { s: Scenario; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 22px",
        background: active ? "hsl(220 13% 9%)" : "transparent",
        border: `1px solid ${active ? s.priorityColor + "50" : "hsl(220 13% 10%)"}`,
        borderTop: active ? `2px solid ${s.priorityColor}` : "2px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.18s",
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: active ? s.priorityColor : "hsl(215 16% 28%)", textTransform: "uppercase", marginBottom: 5 }}>
        {s.priority}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: active ? "#fff" : "hsl(215 16% 44%)", marginBottom: 2 }}>
        {s.label}
      </div>
      <div style={{ fontSize: 10, color: "hsl(215 16% 30%)" }}>
        {s.sublabel}
      </div>
    </button>
  );
}

function StageRow({ stage, index, isLast }: { stage: Stage; index: number; isLast: boolean }) {
  const accentColor = STAGE_COLOR[stage.key];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.38 }}
      style={{ display: "flex", gap: 0 }}
    >
      {/* Timeline spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%", flexShrink: 0,
          background: accentColor,
          boxShadow: `0 0 8px ${accentColor}55`,
          marginTop: 20,
          zIndex: 1,
        }} />
        {!isLast && (
          <div style={{ width: 1, flex: 1, background: "hsl(220 13% 11%)", minHeight: 24, marginTop: 4 }} />
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        marginBottom: isLast ? 0 : 4,
        paddingBottom: isLast ? 0 : 20,
      }}>
        {/* Stage header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 10, paddingTop: 14,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
            color: accentColor, textTransform: "uppercase",
          }}>
            {String(index + 1).padStart(2, "0")} · {stage.label}
          </span>
          <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", fontFamily: "var(--app-font-mono)" }}>
            {stage.timestamp}
          </span>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
            color: stage.statusColor, textTransform: "uppercase",
            border: `1px solid ${stage.statusColor}33`,
            padding: "2px 7px",
            background: `${stage.statusColor}0d`,
          }}>
            {stage.status}
          </span>
          <span style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>
            {stage.engine}
          </span>
        </div>

        {/* Card body */}
        <div style={{
          background: "hsl(220 13% 7%)",
          border: "1px solid hsl(220 13% 10%)",
          borderLeft: `2px solid ${accentColor}`,
          padding: "18px 22px",
        }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>
            {stage.headline}
          </div>
          <div style={{ fontSize: 12, color: "hsl(215 16% 48%)", lineHeight: 1.7, marginBottom: 16 }}>
            {stage.body}
          </div>

          {/* Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 24px", paddingTop: 14, borderTop: "1px solid hsl(220 13% 10%)" }}>
            {stage.details.map(d => (
              <div key={d.label}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 3 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 11, color: "hsl(215 16% 56%)", letterSpacing: "0.02em" }}>
                  {d.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function ExecutionTimeline() {
  const [active, setActive] = useState(0);
  const scenario = SCENARIOS[active];

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 40px 72px" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Operating Layer
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            Execution Timeline
          </h1>
          <p style={{ fontSize: 12, color: "hsl(215 16% 36%)", margin: 0, letterSpacing: "0.04em" }}>
            Signal → Assessment → Decision → Action → Outcome &nbsp;·&nbsp; Live scenario replay
          </p>
        </motion.div>

        {/* Scenario selector */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "flex", gap: 1, marginBottom: 40 }}
        >
          {SCENARIOS.map((s, i) => (
            <ScenarioTab key={s.id} s={s} active={active === i} onClick={() => setActive(i)} />
          ))}
        </motion.div>

        {/* Active scenario label */}
        <motion.div
          key={scenario.id + "-label"}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 28, paddingBottom: 14,
            borderBottom: "1px solid hsl(220 13% 9%)",
          }}
        >
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: scenario.priorityColor, border: `1px solid ${scenario.priorityColor}40`,
            padding: "3px 8px", background: `${scenario.priorityColor}0d`,
          }}>
            {scenario.priority}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{scenario.label}</span>
          <span style={{ fontSize: 11, color: "hsl(215 16% 36%)" }}>·</span>
          <span style={{ fontSize: 11, color: "hsl(215 16% 36%)" }}>{scenario.sublabel}</span>
          <span style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>
            5 stages · Full resolution
          </span>
        </motion.div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {scenario.stages.map((stage, i) => (
              <StageRow
                key={stage.key}
                stage={stage}
                index={i}
                isLast={i === scenario.stages.length - 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
          style={{
            marginTop: 36, paddingTop: 18,
            borderTop: "1px solid hsl(220 13% 8%)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Signal intelligence · Classification · Decision" },
              { name: "NEXUS", desc: "Owner routing · Notification" },
              { name: "VECTOR", desc: "Execution coordination · Outcome tracking" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            WELBX · Confidential · Scenario Replay
          </div>
        </motion.div>

      </div>
    </div>
  );
}
