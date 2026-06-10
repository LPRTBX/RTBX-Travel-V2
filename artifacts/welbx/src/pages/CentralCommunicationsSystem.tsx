import { motion } from "framer-motion";

const C = {
  amber:  "#c9a84c",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  blue:   "#3b82f6",
  cyan:   "#06b6d4",
  rose:   "#f43f5e",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 38%)",
  dimmed: "hsl(215 16% 22%)",
  dim2:   "hsl(215 16% 32%)",
};

const PIPELINE_STEPS = [
  { label: "Signal",        sub: "SENSING LAYER",   color: C.blue,   icon: "◈" },
  { label: "Moment",        sub: "CONTEXT ENGINE",  color: C.violet, icon: "◉" },
  { label: "Decision",      sub: "BXOS LOGIC",      color: C.amber,  icon: "◇" },
  { label: "Communication", sub: "NEXUS ROUTER",    color: C.cyan,   icon: "◎" },
  { label: "Outcome",       sub: "RESULT LAYER",    color: C.green,  icon: "◆" },
];

type LaneType = "Guest" | "Workforce" | "Operational" | "Executive" | "Partner";

interface Lane {
  type: LaneType;
  color: string;
  accentBg: string;
  trigger: string;
  audience: string;
  channel: string;
  priority: string;
  priorityColor: string;
  outcome: string;
  volume: string;
  latency: string;
}

const LANES: Lane[] = [
  {
    type: "Guest",
    color: C.amber,
    accentBg: `${C.amber}0d`,
    trigger: "Arrival distress signal, service gap detected, loyalty tier milestone, complaint pattern threshold exceeded",
    audience: "Individual guest — personalised to profile, tier, and behavioural history",
    channel: "In-app message, concierge call, front-desk intercept, room note, email",
    priority: "CRITICAL",
    priorityColor: C.red,
    outcome: "Experience recovery, loyalty protection, NPS uplift, repeat booking probability",
    volume: "12–18 / day",
    latency: "< 4 min",
  },
  {
    type: "Workforce",
    color: C.blue,
    accentBg: `${C.blue}0d`,
    trigger: "Shift gap detected, welfare signal above threshold, capacity alert, performance deviation logged",
    audience: "Department lead, duty manager, or HR partner — role-scoped routing",
    channel: "Ops dashboard alert, push notification, manager briefing note, handover log",
    priority: "ELEVATED",
    priorityColor: C.amber,
    outcome: "Service continuity, staff wellbeing, performance recovery, retention signal improvement",
    volume: "6–9 / day",
    latency: "< 7 min",
  },
  {
    type: "Operational",
    color: C.violet,
    accentBg: `${C.violet}0d`,
    trigger: "Foyer congestion threshold, housekeeping bottleneck, maintenance risk escalation, supply alert",
    audience: "Head of department, on-shift supervisor, facilities lead — property-scoped",
    channel: "Command Centre alert, operations board, SMS, radio dispatch",
    priority: "HIGH",
    priorityColor: C.violet,
    outcome: "Service flow restored, asset protection, guest disruption prevented, occupancy optimised",
    volume: "9–14 / day",
    latency: "< 3 min",
  },
  {
    type: "Executive",
    color: C.rose,
    accentBg: `${C.rose}0d`,
    trigger: "Portfolio risk threshold, VIP incident, NPS trend deviation, revenue variance above tolerance",
    audience: "General Manager, COO, Chief Experience Officer — governance-tier routing",
    channel: "Executive digest, secure push, daily brief, Board intelligence note",
    priority: "STRATEGIC",
    priorityColor: C.rose,
    outcome: "Governance visibility, informed decision-making, risk mitigation, investor-grade reporting",
    volume: "2–4 / day",
    latency: "< 15 min",
  },
  {
    type: "Partner",
    color: C.green,
    accentBg: `${C.green}0d`,
    trigger: "Supplier SLA breach, partner venue availability gap, co-activation revenue window opens",
    audience: "Approved external partners, concierge network, supplier contacts — access-controlled",
    channel: "Secure partner portal, API webhook, account manager email, scheduled digest",
    priority: "STANDARD",
    priorityColor: C.green,
    outcome: "Supply continuity, partner experience quality, revenue activation, SLA compliance",
    volume: "3–6 / day",
    latency: "< 20 min",
  },
];

const ROUTING_RULES = [
  { rule: "Guest tier ≥ M1 AND complaint signal", action: "Escalate to GM Personal Response protocol", color: C.red },
  { rule: "Workforce welfare score < 3.5", action: "Route to HR partner + schedule manager 1:1", color: C.amber },
  { rule: "Foyer occupancy > 85% for 8 min", action: "Activate mobile check-in + express lane", color: C.violet },
  { rule: "Revenue gap > £2,000 in window", action: "Issue upgrade offer to qualifying guests", color: C.green },
  { rule: "Partner SLA breach detected", action: "Alert account manager + log incident record", color: C.blue },
  { rule: "Executive NPS delta > −2.0 pts", action: "Compile executive intelligence brief (auto)", color: C.rose },
];

const STATS = [
  { label: "Messages Routed Today",  value: "47",    color: C.cyan,   note: "Across all lanes" },
  { label: "Avg Routing Latency",    value: "3.8m",  color: C.green,  note: "Signal to delivery" },
  { label: "Active Routing Rules",   value: "24",    color: C.violet, note: "Logic layer rules" },
  { label: "Channel Success Rate",   value: "96.2%", color: C.amber,  note: "Delivery confirmed" },
];

function fade(delay: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 },
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
      {children}
    </div>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11.5, color: "hsl(215 16% 60%)", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

export default function CentralCommunicationsSystem() {
  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div {...fade(0)} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
                WELBX · Communications Layer
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
                Central Communications System
              </h1>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "hsl(215 16% 52%)", margin: 0, letterSpacing: "0.03em", fontStyle: "italic" }}>
                "The Right Message. The Right Person. The Right Time."
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
                Engine
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 40%)" }}>
                Nexus Router · Active
              </div>
              <div style={{ fontSize: 8, letterSpacing: "0.08em", color: C.dimmed, marginTop: 2 }}>
                5 lanes · 24 rules
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div {...fade(0.07)} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginBottom: 36 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              padding: "16px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderTop: `2px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase" }}>{s.note}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Flow Pipeline ── */}
        <motion.div {...fade(0.12)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 3, height: 18, background: C.cyan, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                Orchestration Pipeline
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.cyan, border: `1px solid ${C.cyan}33`, padding: "2px 8px", background: `${C.cyan}0d` }}>
                5 STAGES
              </span>
            </div>
            <span style={{ fontSize: 10, color: C.dimmed, letterSpacing: "0.04em" }}>Signal-to-outcome routing chain · Nexus Engine</span>
          </div>

          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + i * 0.08, duration: 0.38 }}
                  style={{
                    flex: 1,
                    padding: "22px 20px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderTop: `2px solid ${step.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: 22, color: step.color, marginBottom: 10, lineHeight: 1 }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>
                    STAGE {i + 1}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>
                    {step.sub}
                  </div>
                </motion.div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.24 + i * 0.08, duration: 0.4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 2px",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${PIPELINE_STEPS[i].color}55, ${PIPELINE_STEPS[i+1].color}55)` }} />
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M0 4H10M10 4L7 1M10 4L7 7" stroke={C.dim2} strokeWidth="1" strokeLinecap="square" />
                      </svg>
                      <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${PIPELINE_STEPS[i].color}55, ${PIPELINE_STEPS[i+1].color}55)` }} />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Communication Type Lanes ── */}
        <motion.div {...fade(0.22)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 3, height: 18, background: C.amber, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                Communication Type Lanes
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.amber, border: `1px solid ${C.amber}33`, padding: "2px 8px", background: `${C.amber}0d` }}>
                5 LANES
              </span>
            </div>
            <span style={{ fontSize: 10, color: C.dimmed, letterSpacing: "0.04em" }}>Audience-segmented routing logic · Nexus Engine</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {LANES.map((lane, i) => (
              <motion.div
                key={lane.type}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.07, duration: 0.35 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr 1fr 1fr 120px 1fr",
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${lane.color}`,
                  background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                  overflow: "hidden",
                }}
              >
                {/* Lane header cell */}
                <div style={{
                  padding: "18px 20px",
                  background: lane.accentBg,
                  borderRight: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: lane.color, letterSpacing: "0.04em", marginBottom: 6 }}>
                    {lane.type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: lane.color, opacity: 0.6, textTransform: "uppercase", marginBottom: 10 }}>
                    LANE
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{lane.volume}</div>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginTop: 2 }}>Vol/day</div>
                    </div>
                    <div style={{ width: 1, background: C.border }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{lane.latency}</div>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginTop: 2 }}>Latency</div>
                    </div>
                  </div>
                </div>

                {/* Trigger */}
                <div style={{ padding: "16px 18px", borderRight: `1px solid ${C.border}` }}>
                  <FieldLabel>Trigger</FieldLabel>
                  <FieldValue>{lane.trigger}</FieldValue>
                </div>

                {/* Audience */}
                <div style={{ padding: "16px 18px", borderRight: `1px solid ${C.border}` }}>
                  <FieldLabel>Audience</FieldLabel>
                  <FieldValue>{lane.audience}</FieldValue>
                </div>

                {/* Channel */}
                <div style={{ padding: "16px 18px", borderRight: `1px solid ${C.border}` }}>
                  <FieldLabel>Channel</FieldLabel>
                  <FieldValue>{lane.channel}</FieldValue>
                </div>

                {/* Priority */}
                <div style={{ padding: "16px 18px", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                  <FieldLabel>Priority</FieldLabel>
                  <div style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: lane.priorityColor,
                    border: `1px solid ${lane.priorityColor}40`,
                    background: `${lane.priorityColor}10`,
                    padding: "4px 10px",
                    marginTop: 2,
                  }}>
                    {lane.priority}
                  </div>
                </div>

                {/* Outcome */}
                <div style={{ padding: "16px 18px" }}>
                  <FieldLabel>Outcome</FieldLabel>
                  <FieldValue>{lane.outcome}</FieldValue>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Routing Intelligence Rules ── */}
        <motion.div {...fade(0.38)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 3, height: 18, background: C.violet, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                Routing Intelligence Rules
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.violet, border: `1px solid ${C.violet}33`, padding: "2px 8px", background: `${C.violet}0d` }}>
                ACTIVE
              </span>
            </div>
            <span style={{ fontSize: 10, color: C.dimmed, letterSpacing: "0.04em" }}>Condition-action logic · When X detected → route to Y</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {ROUTING_RULES.map((r, i) => (
              <motion.div
                key={r.rule}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 + i * 0.05, duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${r.color}`,
                  background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "14px 18px", flex: 1, borderRight: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
                    IF CONDITION
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "hsl(215 16% 60%)", lineHeight: 1.5 }}>
                    {r.rule}
                  </div>
                </div>
                <div style={{ padding: "14px 18px", flex: 1 }}>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: r.color, textTransform: "uppercase", marginBottom: 5 }}>
                    THEN ACTION
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>
                    {r.action}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
