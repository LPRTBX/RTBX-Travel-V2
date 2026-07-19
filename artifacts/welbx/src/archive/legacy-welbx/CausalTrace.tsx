import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEEDED_MOMENTS } from "@/data/moments";

const C = {
  amber: "#c9a84c", green: "#10b981", blue: "#3b82f6", violet: "#a78bfa",
  red: "#ef4444", cyan: "#22d3ee",
  border: "hsl(220 13% 9%)", card: "hsl(220 13% 7%)", card2: "hsl(220 13% 8%)",
  bg: "hsl(220 13% 5%)", muted: "hsl(215 16% 38%)", dimmed: "hsl(215 16% 22%)",
};

interface ChainStage {
  stage: string;
  engine: string;
  color: string;
  items: { label: string; value: string; sub?: string }[];
  summary: string;
}

interface TraceEntry {
  momentId: string;
  momentTitle: string;
  category: string;
  categoryColor: string;
  chain: ChainStage[];
}

const TRACES: TraceEntry[] = [
  {
    momentId: "m1",
    momentTitle: "Queue Pressure Building",
    category: "OPERATIONAL",
    categoryColor: C.blue,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "Three converging operational signals crossed threshold simultaneously at 14:31:12.",
        items: [
          { label: "Queue Depth",       value: "14 guests",  sub: "Sensor Array · Lobby grid" },
          { label: "Average Wait",      value: "9.2 min",    sub: "PMS + Sensor · Threshold: 8 min" },
          { label: "Agents Active",     value: "3 of 4",     sub: "Scheduling System" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified a Queue Pressure event (GM-003) at 94% confidence. Pattern: linear queue growth with no natural relief.",
        items: [
          { label: "Moment ID",         value: "GM-003",    sub: "Queue Pressure Building" },
          { label: "Confidence",        value: "94%",       sub: "3-signal convergence" },
          { label: "Priority",          value: "HIGH",      sub: "Protocol window: 6 min" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-007 issued: open secondary lane, reallocate nearest available host. Automated, no human override.",
        items: [
          { label: "Decision ID",       value: "DR-007",    sub: "Automated · NEXUS" },
          { label: "Recommended Action","value": "Open secondary lane + host reallocation", sub: "" },
          { label: "Confidence",        value: "91%",       sub: "Decision quality score" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-003 (Complaint Recovery) fired. Trigger: queue > 11 guests + wait > 8 min. Execution delegated to VECTOR.",
        items: [
          { label: "Playbook",          value: "PB-003",    sub: "Complaint Recovery" },
          { label: "Actions Queued",    value: "3",         sub: "Prioritised by urgency" },
          { label: "Time to Fire",      value: "8 sec",     sub: "From moment classification" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Two communications dispatched: Front Desk Lead (app push, 9-sec delivery), Lobby Host (SMS, 14-sec delivery).",
        items: [
          { label: "Message 1",         value: "Front Desk Lead",  sub: "App push · Delivered 9s" },
          { label: "Message 2",         value: "Lobby Host B",     sub: "SMS · Delivered 14s" },
          { label: "Acknowledgement",   value: "Both confirmed",   sub: "Within 45 sec" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "Secondary lane opened within 72 seconds. Wait time reduced from 9.2 to 3.4 minutes. No complaint registered.",
        items: [
          { label: "Wait Time",         value: "9.2 → 3.4 min",  sub: "↓ 63% reduction" },
          { label: "Complaints",        value: "0",              sub: "None escalated" },
          { label: "Value Protected",   value: "$2,400",         sub: "Est. complaint avoidance" },
        ],
      },
    ],
  },
  {
    momentId: "m2",
    momentTitle: "VIP Arrival Risk",
    category: "GUEST",
    categoryColor: C.amber,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "Four signals converged at 14:32:07. Flight data confirmed early arrival. Room status flagged occupied overstay.",
        items: [
          { label: "Guest Tier",        value: "DIAMOND",    sub: "CRM · Loyalty Profile" },
          { label: "ETA",               value: "12 min",     sub: "Aviation API · BA0173" },
          { label: "Room Status",       value: "OCCUPIED",   sub: "PMS · Overstay flag" },
          { label: "HK ETA",            value: "22 min",     sub: "Housekeeping System" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified VIP Arrival Risk (GM-001) at 99% confidence. Arrival window collision detected 10 minutes before impact.",
        items: [
          { label: "Moment ID",         value: "GM-001",     sub: "VIP Arrival Risk" },
          { label: "Confidence",        value: "99%",        sub: "4-signal convergence" },
          { label: "Priority",          value: "CRITICAL",   sub: "Protocol window: 10 min" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-004 issued: prioritise housekeeping on Room 847, activate VIP welcome protocol. DIAMOND tier override applied.",
        items: [
          { label: "Decision ID",       value: "DR-004",     sub: "Automated · VIP override" },
          { label: "Action 1",          value: "HK priority push: Room 847",  sub: "" },
          { label: "Action 2",          value: "VIP welcome protocol activated", sub: "" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-002 (VIP Arrival) fired. Five steps executed across Housekeeping, Guest Relations, and Front Desk.",
        items: [
          { label: "Playbook",          value: "PB-002",     sub: "VIP Arrival" },
          { label: "Steps Executed",    value: "5 of 5",     sub: "Full execution" },
          { label: "Departments",       value: "3",          sub: "HK · GR · Front Desk" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Three communications dispatched in 45 seconds: Housekeeping Lead, Guest Relations Host, Duty Manager.",
        items: [
          { label: "HK Lead",           value: "Priority alert",  sub: "App · 12s" },
          { label: "Guest Relations",   value: "Welcome brief",   sub: "App · 18s" },
          { label: "Duty Manager",      value: "Status update",   sub: "Dashboard · 45s" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "Room 847 released 2 minutes before guest arrival. VIP received uninterrupted welcome. $8,000 loyalty value protected.",
        items: [
          { label: "Room Released",     value: "2 min early",  sub: "Before VIP arrival" },
          { label: "Service Failure",   value: "None",         sub: "Zero visible friction" },
          { label: "Value Protected",   value: "$8,000",       sub: "Loyalty + future booking" },
        ],
      },
    ],
  },
  {
    momentId: "m3",
    momentTitle: "Housekeeping Bottleneck",
    category: "OPERATIONAL",
    categoryColor: C.blue,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "Supply-demand gap detected: 7 rooms queued, 4 arrivals within 60 minutes, housekeeping at 91% capacity.",
        items: [
          { label: "Rooms Queued",      value: "7",          sub: "Housekeeping System" },
          { label: "Priority Arrivals", value: "4 in 60 min",sub: "PMS Arrival Forecast" },
          { label: "HK Capacity",       value: "91%",        sub: "Task Management System" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified Housekeeping Bottleneck (GM-011) at 88% confidence. Pipeline misalignment detected 55 minutes before first arrival.",
        items: [
          { label: "Moment ID",         value: "GM-011",     sub: "Housekeeping Bottleneck" },
          { label: "Confidence",        value: "88%",        sub: "3-signal convergence" },
          { label: "Priority",          value: "HIGH",       sub: "55-min intervention window" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-011 issued: reallocate 2 staff from morning tasks, reprioritise room sequence by arrival order.",
        items: [
          { label: "Decision ID",       value: "DR-011",     sub: "Automated · NEXUS" },
          { label: "Action",            value: "Reallocate 2 staff + resequence", sub: "" },
          { label: "Confidence",        value: "87%",        sub: "Resource model" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-005 (Maintenance Escalation) fired for room priority pipeline. Sequence algorithm applied.",
        items: [
          { label: "Playbook",          value: "PB-005",     sub: "Maintenance Escalation" },
          { label: "Steps Executed",    value: "4 of 4",     sub: "" },
          { label: "Time to Fire",      value: "18 sec",     sub: "From moment classification" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Single targeted communication to Housekeeping Lead with full priority sequence and reallocation brief.",
        items: [
          { label: "HK Lead",           value: "Priority resequence",  sub: "App · 22s" },
          { label: "AM Task Crew",      value: "Reallocation notice",  sub: "App · 28s" },
          { label: "Acknowledgement",   value: "Confirmed",            sub: "2m 30s total" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "Pipeline aligned with arrivals. All 4 priority arrivals received rooms on time. No cascade disruption.",
        items: [
          { label: "Rooms Ready",       value: "4 of 4",     sub: "All priority arrivals served" },
          { label: "Cascade Risk",      value: "Avoided",    sub: "No downstream delays" },
          { label: "Cost Protected",    value: "$5,200",     sub: "Est. disruption cost" },
        ],
      },
    ],
  },
  {
    momentId: "m4",
    momentTitle: "Guest Sentiment Drop",
    category: "GUEST",
    categoryColor: C.amber,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "Unaddressed wait converting to active dissatisfaction. 3 guests in lobby 18+ minutes with verbal complaint signals.",
        items: [
          { label: "Lobby Wait",        value: "18+ min",    sub: "3 guests · Sensor" },
          { label: "Verbal Complaints", value: "2 detected", sub: "Staff Input Log" },
          { label: "Staff Engagement",  value: "40%",        sub: "Response Latency Monitor" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified Guest Sentiment Drop (GM-002) at 87% confidence. Recovery window: 8 minutes before complaint formalisation.",
        items: [
          { label: "Moment ID",         value: "GM-002",     sub: "Guest Sentiment Drop" },
          { label: "Confidence",        value: "87%",        sub: "" },
          { label: "Recovery Window",   value: "8 min",      sub: "Before complaint formalises" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-009 issued: deploy lobby ambassador, initiate service recovery gesture. F&B offer selected over room credit.",
        items: [
          { label: "Decision ID",       value: "DR-009",     sub: "Automated · Learning-updated" },
          { label: "Gesture",           value: "F&B offer (lobby drinks)", sub: "Pattern LE-003 applied" },
          { label: "Confidence",        value: "84%",        sub: "" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-003 (Complaint Recovery) fired. Lobby Ambassador role assigned. Recovery sequence initiated.",
        items: [
          { label: "Playbook",          value: "PB-003",     sub: "Complaint Recovery" },
          { label: "Steps Executed",    value: "3 of 5",     sub: "In progress" },
          { label: "Owner",             value: "Lobby Manager", sub: "Assigned 1m 05s" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Lobby Manager notified with full context brief. Drinks offer authorised. Guest Relations on standby.",
        items: [
          { label: "Lobby Manager",     value: "Context brief + authority", sub: "App · 8s" },
          { label: "F&B Station",       value: "Complimentary order queued", sub: "App · 12s" },
          { label: "Resolution",        value: "1m 05s total",              sub: "From moment detection" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "Sentiment stabilised. No formal complaint registered. All 3 guests engaged. NPS risk neutralised.",
        items: [
          { label: "Complaints",        value: "0 escalated",  sub: "Recovery effective" },
          { label: "Sentiment",         value: "Stabilised",   sub: "Within 8 min window" },
          { label: "Value Protected",   value: "$1,800",       sub: "Est. recovery cost avoided" },
        ],
      },
    ],
  },
  {
    momentId: "m5",
    momentTitle: "Service Recovery Opportunity",
    category: "GUEST",
    categoryColor: C.amber,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "Recovery window still open. Complaint logged 09:47. No follow-up by 10:31. Guest checking out tomorrow.",
        items: [
          { label: "Complaint Logged",  value: "09:47",      sub: "Room 604 · HK delay 40 min" },
          { label: "Follow-up",         value: "None by 10:31", sub: "44 min elapsed" },
          { label: "Checkout",          value: "Tomorrow",   sub: "Recovery window open" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified Service Recovery Opportunity (GM-004) at 82% confidence. Silent detractor pattern detected — guest has not re-engaged.",
        items: [
          { label: "Moment ID",         value: "GM-004",     sub: "Service Recovery Opportunity" },
          { label: "Confidence",        value: "82%",        sub: "Silent detractor pattern" },
          { label: "Priority",          value: "MEDIUM",     sub: "Window: pre-checkout" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-012 issued: personal contact from Duty Manager, complimentary dinner. Cost/impact ratio 1:28.",
        items: [
          { label: "Decision ID",       value: "DR-012",     sub: "" },
          { label: "Action",            value: "Duty Manager call + dinner offer", sub: "" },
          { label: "ROI",               value: "$120 cost vs $3,400 risk", sub: "28× leverage" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-003 (Complaint Recovery) fired for pre-checkout service recovery flow. Three-step sequence.",
        items: [
          { label: "Playbook",          value: "PB-003",     sub: "Complaint Recovery" },
          { label: "Flow",              value: "Pre-checkout recovery",   sub: "Variant B" },
          { label: "Owner",             value: "Duty Manager",            sub: "" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Duty Manager called guest directly. F&B team notified of complimentary dinner reservation.",
        items: [
          { label: "Duty Manager",      value: "Personal call brief",  sub: "App · 3m 10s" },
          { label: "F&B Team",          value: "Complimentary dinner", sub: "POS · Authorised" },
          { label: "Outcome",           value: "Guest accepted",       sub: "Dinner confirmed" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "Guest accepted dinner offer. NPS protected. No public review posted. Retention probability restored.",
        items: [
          { label: "Review Risk",       value: "Neutralised",     sub: "No negative review" },
          { label: "NPS",               value: "Protected",       sub: "Estimated +22pt delta" },
          { label: "Cost",              value: "$120",            sub: "vs. $3,400 risk" },
        ],
      },
    ],
  },
  {
    momentId: "m6",
    momentTitle: "Dining Activation Opportunity",
    category: "COMMERCIAL",
    categoryColor: C.green,
    chain: [
      {
        stage: "01  SIGNALS",
        engine: "BXOS · Sensing",
        color: C.blue,
        summary: "8 checked-in guests with no F&B bookings. Restaurant at 67% capacity. 3 guests in spa zone showing high F&B propensity.",
        items: [
          { label: "Eligible Guests",   value: "8",          sub: "No dinner booking on file" },
          { label: "Restaurant",        value: "67% capacity", sub: "Dinner service opening" },
          { label: "Propensity Signal", value: "3 guests",   sub: "Spa zone · High F&B profile" },
        ],
      },
      {
        stage: "02  MOMENT",
        engine: "BXOS · Classification",
        color: C.amber,
        summary: "BXOS classified Dining Activation Opportunity (GM-009) at 79% confidence. Optimal outreach window: next 20 minutes.",
        items: [
          { label: "Moment ID",         value: "GM-009",     sub: "Dining Activation Opportunity" },
          { label: "Confidence",        value: "79%",        sub: "3-signal propensity model" },
          { label: "Window",            value: "20 min",     sub: "16:00–18:00 peak (PAT-005)" },
        ],
      },
      {
        stage: "03  DECISION",
        engine: "NEXUS · Routing",
        color: C.violet,
        summary: "Decision DR-019 issued: personalised dining recommendations via concierge touchpoint. Highest-propensity guests prioritised.",
        items: [
          { label: "Decision ID",       value: "DR-019",     sub: "Revenue opportunity" },
          { label: "Action",            value: "Concierge personalised outreach", sub: "" },
          { label: "Priority Order",    value: "3 spa guests first", sub: "Propensity-ranked" },
        ],
      },
      {
        stage: "04  PLAYBOOK",
        engine: "NEXUS · Execution Rules",
        color: C.amber,
        summary: "Playbook PB-002 (VIP Arrival) variant triggered for commercial activation flow. Concierge assigned.",
        items: [
          { label: "Playbook",          value: "PB-002",     sub: "VIP Arrival · Commercial variant" },
          { label: "Steps",             value: "2 of 3",     sub: "Outreach + follow-up" },
          { label: "Owner",             value: "Concierge Team", sub: "" },
        ],
      },
      {
        stage: "05  COMMUNICATION",
        engine: "NEXUS · Comms Orchestration",
        color: C.cyan,
        summary: "Concierge team contacted 8 guests with personalised dinner recommendations. 3 spa guests contacted first.",
        items: [
          { label: "Messages Sent",     value: "8",          sub: "In-app + verbal" },
          { label: "Priority 3",        value: "Spa guests contacted first", sub: "" },
          { label: "Response Time",     value: "15 min",     sub: "From moment detection" },
        ],
      },
      {
        stage: "06  OUTCOME",
        engine: "VECTOR · Attribution",
        color: C.green,
        summary: "3 bookings confirmed from 8 outreach contacts. $420 revenue captured. 37.5% conversion rate.",
        items: [
          { label: "Bookings",          value: "3 confirmed",  sub: "37.5% conversion" },
          { label: "Revenue",           value: "$420",         sub: "Against $960 opportunity" },
          { label: "Learning",          value: "Spa-zone guests +2× response vs. room outreach", sub: "" },
        ],
      },
    ],
  },
];

function StageNode({ stage, active }: { stage: ChainStage; active: boolean }) {
  return (
    <div style={{
      padding: "16px 20px",
      background: active ? "hsl(220 13% 7%)" : "hsl(220 13% 6%)",
      border: `1px solid ${active ? stage.color + "33" : C.border}`,
      borderLeft: `3px solid ${active ? stage.color : "hsl(220 13% 10%)"}`,
      transition: "all 0.25s",
      marginBottom: 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: active ? 10 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: active ? stage.color : "hsl(215 16% 28%)", textTransform: "uppercase", fontFamily: "var(--app-font-mono)" }}>
            {stage.stage}
          </span>
          <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.06em", textTransform: "uppercase" }}>{stage.engine}</span>
        </div>
      </div>
      {active && (
        <>
          <div style={{ fontSize: 11, color: "hsl(215 16% 50%)", lineHeight: 1.65, marginBottom: 12 }}>
            {stage.summary}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {stage.items.map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", minWidth: 120 }}>{item.label}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 9, color: C.muted }}>{item.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CausalTrace() {
  const [selected, setSelected] = useState(0);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const trace = TRACES[selected];
  const moment = SEEDED_MOMENTS.find(m => m.id === trace.momentId)!;

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 0" }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · GHSOL Full Chain
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            Causal Trace
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
            Every outcome has a cause. Every cause has a chain. Signal → Moment → Decision → Playbook → Communication → Outcome
          </p>
        </motion.div>
      </div>

      <div style={{ paddingLeft: 224, display: "flex", height: "calc(100vh - 130px)", borderTop: `1px solid ${C.border}` }}>

        {/* Left: moment list */}
        <div style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${C.border}`, overflowY: "auto", background: C.bg }}>
          <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.border}`, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase" }}>
            {TRACES.length} Moments · Full chain available
          </div>
          {TRACES.map((t, i) => {
            const active = selected === i;
            return (
              <button
                key={t.momentId}
                onClick={() => { setSelected(i); setActiveStage(null); }}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer", padding: "12px 16px",
                  background: active ? "hsl(220 13% 9%)" : "transparent",
                  border: "none", borderLeft: `2px solid ${active ? t.categoryColor : "transparent"}`,
                  borderBottom: `1px solid ${C.border}`, transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)" }}>
                    {SEEDED_MOMENTS.find(m => m.id === t.momentId)?.id?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: t.categoryColor, letterSpacing: "0.1em" }}>{t.category}</span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? "#fff" : "hsl(215 16% 50%)", lineHeight: 1.35 }}>
                  {t.momentTitle}
                </div>
                <div style={{ fontSize: 9, color: C.dimmed, marginTop: 4 }}>6-stage chain · Click to trace</div>
              </button>
            );
          })}
        </div>

        {/* Right: chain detail */}
        <div style={{ flex: 1, overflowY: "auto", background: "hsl(220 13% 5%)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={trace.momentId} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* Identity bar */}
              <div style={{
                padding: "18px 28px", borderBottom: `1px solid ${C.border}`,
                borderLeft: `3px solid ${trace.categoryColor}`,
                background: "hsl(220 13% 8%)",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: trace.categoryColor, border: `1px solid ${trace.categoryColor}30`, padding: "2px 7px", background: `${trace.categoryColor}0d`, textTransform: "uppercase" }}>{trace.category}</span>
                    <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em" }}>MOMENT ID: {moment.id.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>{trace.momentTitle}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{moment.whySurfaced}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>BXOS Confidence</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: moment.confidence >= 90 ? C.green : C.amber, letterSpacing: "-0.02em" }}>{moment.confidence}%</div>
                  <div style={{ fontSize: 8, color: C.dimmed, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>{moment.urgency}</div>
                </div>
              </div>

              {/* Instruction */}
              <div style={{ padding: "12px 28px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.dimmed }}>
                Click any stage to expand the chain detail. The full GHSOL loop from sensing to outcome is recorded below.
              </div>

              {/* Chain stages */}
              <div style={{ padding: "16px 28px" }}>
                {trace.chain.map((stage, i) => (
                  <div
                    key={stage.stage}
                    onClick={() => setActiveStage(activeStage === i ? null : i)}
                    style={{ cursor: "pointer" }}
                  >
                    <StageNode stage={stage} active={activeStage === i} />
                    {i < trace.chain.length - 1 && (
                      <div style={{ display: "flex", justifyContent: "center", padding: "3px 0", color: `${C.amber}40`, fontSize: 10 }}>↓</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Value summary */}
              <div style={{ margin: "0 28px 28px", padding: "16px 20px", background: "hsl(220 13% 7%)", border: `1px solid ${C.border}`, borderTop: `2px solid ${C.green}` }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.green, textTransform: "uppercase", marginBottom: 8 }}>Chain Outcome Summary</div>
                <div style={{ fontSize: 11.5, color: "hsl(215 16% 52%)", lineHeight: 1.7 }}>
                  {moment.executionFeedback?.whatHappened}. Response time: {moment.executionFeedback?.responseTime}.
                  Outcome: {moment.executionFeedback?.outcomeDelta}. Commercial exposure: {moment.commercialExposure}.
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
