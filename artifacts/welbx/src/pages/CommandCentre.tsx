import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { PLAYBOOKS } from "@/data/playbooks";
import { DECISIONS } from "@/data/decisions";
import { getMomentById } from "@/data/interventions";

const SUMMARY = [
  { label: "Total Signals", value: "12", sub: "BXOS MONITORING", color: "hsl(215 16% 38%)" },
  { label: "High Priority", value: "3", sub: "REQUIRES ACTION", color: "#c9a84c" },
  { label: "Actions In Progress", value: "2", sub: "VECTOR COORDINATING", color: "#3b82f6" },
  { label: "Outcomes Completed", value: "7", sub: "TODAY", color: "#10b981" },
];

type Priority = "CRITICAL" | "HIGH" | "ELEVATED" | "STANDARD";
type Status = "EXECUTING" | "ROUTED" | "RESOLVED" | "MONITORING" | "ACTIVE";

interface Row {
  id: string;
  time: string;
  signal: string;
  source: string;
  priority: Priority;
  conf: number;
  action: string;
  engine: string;
  owner: string;
  ownerRole: string;
  status: Status;
  outcome: string;
  playbookId: string;
  relatedMoment?: string;
  momentId: string;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#c9a84c",
  ELEVATED: "hsl(43 50% 45%)",
  STANDARD: "#10b981",
};

const STATUS_COLOR: Record<Status, string> = {
  EXECUTING: "#3b82f6",
  ROUTED: "#c9a84c",
  RESOLVED: "#10b981",
  MONITORING: "hsl(215 16% 42%)",
  ACTIVE: "#ef4444",
};

const ROWS: Row[] = [
  {
    id: "SIG-4471",
    time: "12:46",
    signal: "Guest distress detected · Room 412",
    source: "In-room sensor + zero movement 22 min",
    priority: "CRITICAL",
    conf: 96,
    action: "Initiate welfare protocol. Dispatch duty manager. Activate silent alert.",
    engine: "BXOS · 96% conf",
    owner: "J. Halliday",
    ownerRole: "Duty Manager",
    status: "EXECUTING",
    outcome: "—",
    playbookId: "PB-001",
    momentId: "GM-001",
  },
  {
    id: "SIG-4468",
    time: "12:43",
    signal: "Foyer capacity threshold exceeded",
    source: "Occupancy sensor + PMS arrival forecast +34%",
    priority: "HIGH",
    conf: 89,
    action: "Open overflow desk. Redirect to mobile check-in. Assign 2 additional floor staff.",
    engine: "BXOS · 89% conf",
    owner: "A. Osei",
    ownerRole: "Front Desk Lead",
    status: "ROUTED",
    outcome: "—",
    playbookId: "PB-005",
    relatedMoment: "Staff Capacity Gap",
    momentId: "OP-001",
  },
  {
    id: "SIG-4461",
    time: "12:38",
    signal: "First-stay guest disengagement · Ms. P. Chen",
    source: "No staff contact after check-in · 8 min elapsed",
    priority: "HIGH",
    conf: 82,
    action: "Proactive welcome contact. Service introduction. Assign guest liaison.",
    engine: "BXOS · 82% conf",
    owner: "M. Vance",
    ownerRole: "Concierge",
    status: "RESOLVED",
    outcome: "Guest engagement confirmed. Satisfaction signal positive.",
    playbookId: "PB-003",
    relatedMoment: "Loyalty Activation Window",
    momentId: "GM-003",
  },
  {
    id: "SIG-4449",
    time: "12:21",
    signal: "VIP arrival window misalignment · Mr. R. Nakamura",
    source: "PMS + flight data · ETA moved forward 40 min",
    priority: "CRITICAL",
    conf: 99,
    action: "Pre-stage suite. Brief escort team. Initiate arrival protocol.",
    engine: "BXOS · 99% conf",
    owner: "D. Pearce",
    ownerRole: "General Manager",
    status: "RESOLVED",
    outcome: "Arrival handled. Zero friction. Value protected.",
    playbookId: "PB-002",
    relatedMoment: "VIP Arrival",
    momentId: "GM-002",
  },
  {
    id: "SIG-4437",
    time: "11:58",
    signal: "Suite upgrade opportunity · Mr. J. Hartley",
    source: "Room 308 → Suite 501 · Returning guest + availability",
    priority: "STANDARD",
    conf: 78,
    action: "Offer complimentary upgrade. Personalise with prior preferences on file.",
    engine: "BXOS · 78% conf",
    owner: "C. Lim",
    ownerRole: "Guest Relations",
    status: "MONITORING",
    outcome: "Offer accepted. Activation confirmed. NPS impact positive.",
    playbookId: "PB-002",
    relatedMoment: "Suite Upgrade Window",
    momentId: "CM-001",
  },
];

function PriorityBadge({ p }: { p: Priority }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 8px",
      fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: PRIORITY_COLOR[p],
      border: `1px solid ${PRIORITY_COLOR[p]}40`,
      background: `${PRIORITY_COLOR[p]}0d`,
    }}>{p}</span>
  );
}

function StatusBadge({ s }: { s: Status }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 8px",
      fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: STATUS_COLOR[s],
      border: `1px solid ${STATUS_COLOR[s]}33`,
      background: `${STATUS_COLOR[s]}0a`,
    }}>{s}</span>
  );
}

interface InterventionsPanelProps {
  row: Row;
  actioned: Set<string>;
  onAction: (key: string) => void;
}

function InterventionsPanel({ row, actioned, onAction }: InterventionsPanelProps) {
  const moment = getMomentById(row.momentId);
  if (!moment) return null;

  const actionedCount = moment.interventions.filter((iv) =>
    actioned.has(`${row.id}:${iv.name}`)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      style={{ overflow: "hidden" }}
    >
      <div style={{
        borderLeft: "2px solid #a78bfa",
        borderBottom: "1px solid hsl(220 13% 8%)",
        background: "hsl(220 13% 6%)",
      }}>
        {/* Panel header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "12px 20px 12px 18px",
          borderBottom: "1px solid hsl(220 13% 8%)",
        }}>
          <div style={{ width: 3, height: 16, background: "#a78bfa", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a78bfa" }}>
                Suggested Interventions
              </span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 28%)", fontFamily: "var(--app-font-mono)", textTransform: "uppercase" }}>
                {moment.id}
              </span>
              <span style={{ fontSize: 7.5, fontWeight: 600, color: "hsl(215 16% 40%)" }}>
                · {moment.name}
              </span>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
              {moment.expectedOutcomes.map((o) => (
                <span key={o} style={{
                  fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#a78bfa", border: "1px solid #a78bfa33", padding: "1px 6px",
                  background: "#a78bfa0d",
                }}>{o}</span>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            {actionedCount > 0 ? (
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "#10b981", textTransform: "uppercase" }}>
                {actionedCount} of {moment.interventions.length} actioned
              </div>
            ) : (
              <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 24%)", textTransform: "uppercase" }}>
                {moment.interventions.length} options · select to action
              </div>
            )}
          </div>
        </div>

        {/* Intervention rows */}
        <div>
          {moment.interventions.map((iv, i) => {
            const key = `${row.id}:${iv.name}`;
            const isActioned = actioned.has(key);
            const srColor = iv.successRate >= 85 ? "#10b981" : iv.successRate >= 72 ? "#c9a84c" : "hsl(215 16% 44%)";
            const qColor = iv.outcomeQuality >= 8.5 ? "#10b981" : iv.outcomeQuality >= 7.0 ? "#c9a84c" : "hsl(215 16% 44%)";

            return (
              <div
                key={iv.name}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "10px 20px 10px 24px",
                  borderBottom: i < moment.interventions.length - 1 ? "1px solid hsl(220 13% 8%)" : "none",
                  background: isActioned
                    ? "rgba(16,185,129,0.04)"
                    : i % 2 === 0 ? "transparent" : "hsl(220 13% 7%)",
                  transition: "background 0.15s",
                }}
              >
                {/* Rank */}
                <div style={{
                  fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 22%)",
                  minWidth: 16, flexShrink: 0, fontFamily: "var(--app-font-mono)",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Name */}
                <div style={{ flex: 1, fontSize: 11.5, fontWeight: isActioned ? 700 : 600, color: isActioned ? "#fff" : "hsl(215 16% 64%)", lineHeight: 1.4 }}>
                  {iv.name}
                  {isActioned && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      marginLeft: 10,
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "#10b981",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="square"/>
                      </svg>
                      Actioned
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div style={{ display: "flex", gap: 16, flexShrink: 0, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: srColor, lineHeight: 1 }}>
                      {iv.successRate}%
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 24%)", textTransform: "uppercase", marginTop: 3 }}>
                      Success
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: qColor, lineHeight: 1 }}>
                      {iv.outcomeQuality.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 24%)", textTransform: "uppercase", marginTop: 3 }}>
                      Quality
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: iv.usageFrequency === "High" ? "#10b981" : iv.usageFrequency === "Medium" ? "#c9a84c" : "hsl(215 16% 44%)", lineHeight: 1 }}>
                      {iv.usageFrequency}
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 24%)", textTransform: "uppercase", marginTop: 3 }}>
                      Freq
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onAction(key)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 12px",
                    fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: isActioned ? "#10b981" : "#a78bfa",
                    border: `1px solid ${isActioned ? "#10b98133" : "#a78bfa33"}`,
                    background: isActioned ? "rgba(16,185,129,0.06)" : "rgba(167,139,250,0.06)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    if (!isActioned) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.14)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#a78bfa66";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActioned) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.06)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#a78bfa33";
                    }
                  }}
                >
                  {isActioned ? "✓ Actioned" : "Mark Actioned"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommandCentre() {
  const [, navigate] = useLocation();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [actioned, setActioned] = useState<Set<string>>(new Set());

  function handleToggleInterventions(rowId: string) {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  }

  function handleAction(key: string) {
    setActioned((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="pl-56 min-h-screen" style={{ background: "hsl(220 13% 5%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 60px" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Operating Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Command Centre
            </h1>
            <p style={{ fontSize: 12, color: "hsl(215 16% 36%)", margin: 0, letterSpacing: "0.04em" }}>
              The Grand Meridian, London &nbsp;·&nbsp; Signal-to-outcome operating view
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "hsl(215 16% 24%)", textTransform: "uppercase", marginBottom: 6 }}>
              System Time
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "hsl(215 16% 50%)", letterSpacing: "0.08em", fontFamily: "var(--app-font-mono)" }}>
              12:47:14
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 6 }}>
              <div className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>
                BXOS Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Summary row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 32 }}
        >
          {SUMMARY.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "20px 24px",
                background: "hsl(220 13% 7%)",
                borderTop: `2px solid ${s.color}`,
                borderRight: i < 3 ? "1px solid hsl(220 13% 9%)" : "none",
                borderBottom: "1px solid hsl(220 13% 9%)",
                borderLeft: i === 0 ? "1px solid hsl(220 13% 9%)" : "none",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(215 16% 55%)", marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Table section header */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.35 }}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 0, paddingBottom: 12,
            borderBottom: "1px solid hsl(220 13% 9%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "hsl(215 16% 32%)", textTransform: "uppercase" }}>
              Operating Layer · Signal to Outcome
            </span>
            <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>
              BXOS · NEXUS · VECTOR
            </span>
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>
            Updated 12:47:14
          </div>
        </motion.div>

        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 96px 1fr 140px 104px 1fr",
          gap: 0,
          padding: "10px 16px 10px 20px",
          borderBottom: "1px solid hsl(220 13% 9%)",
        }}>
          {["Signal", "Priority", "Recommended Action", "Owner", "Status", "Outcome"].map(col => (
            <div key={col} style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {ROWS.map((row, i) => {
            const isExpanded = expandedRow === row.id;
            const moment = getMomentById(row.momentId);
            const actionedCount = moment
              ? moment.interventions.filter((iv) => actioned.has(`${row.id}:${iv.name}`)).length
              : 0;

            return (
              <div key={row.id}>
                <motion.div
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.38 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 96px 1fr 140px 104px 1fr",
                    gap: 0,
                    padding: "16px 16px 16px 0",
                    borderBottom: isExpanded ? "none" : "1px solid hsl(220 13% 8%)",
                    borderLeft: `2px solid ${PRIORITY_COLOR[row.priority]}`,
                    paddingLeft: 18,
                    background: isExpanded
                      ? "hsl(220 13% 7%)"
                      : i % 2 === 0 ? "transparent" : "hsl(220 13% 6%)",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Signal */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 5, fontFamily: "var(--app-font-mono)" }}>
                      {row.id} · {row.time}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>
                      {row.signal}
                    </div>
                    <div style={{ fontSize: 10, color: "hsl(215 16% 36%)", lineHeight: 1.45, marginBottom: 6 }}>
                      {row.source}
                    </div>

                    {/* Playbook badge */}
                    {(() => {
                      const pb = PLAYBOOKS.find(p => p.id === row.playbookId);
                      if (!pb) return null;
                      return (
                        <button
                          onClick={() => navigate(`/playbook-engine#${pb.id}`)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 8px",
                            background: "rgba(201,168,76,0.06)",
                            border: "1px solid rgba(201,168,76,0.22)",
                            cursor: "pointer",
                            transition: "background 0.15s, border-color 0.15s",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.12)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.4)";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.06)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.22)";
                          }}
                        >
                          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c" }}>
                            Playbook:
                          </span>
                          <span style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(215 16% 52%)" }}>
                            {pb.name}
                          </span>
                        </button>
                      );
                    })()}

                    {/* Decision badge */}
                    {(() => {
                      if (!row.relatedMoment) return null;
                      const dr = DECISIONS.find(d => d.relatedMoment === row.relatedMoment);
                      if (!dr) return null;
                      const confColor = dr.confidence >= 85 ? "#10b981" : dr.confidence >= 70 ? "#c9a84c" : "#ef4444";
                      const outcomeColor: Record<string, string> = {
                        Positive: "#10b981", Pending: "#c9a84c", Negative: "#ef4444", Inconclusive: "hsl(215 16% 32%)",
                      };
                      return (
                        <button
                          onClick={() => navigate(`/decision-registry?moment=${encodeURIComponent(row.relatedMoment!)}`)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 9px",
                            marginTop: 5,
                            background: "rgba(59,130,246,0.05)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            cursor: "pointer",
                            transition: "background 0.15s, border-color 0.15s",
                            width: "100%",
                            maxWidth: 188,
                            boxSizing: "border-box",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.1)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(59,130,246,0.38)";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(59,130,246,0.05)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(59,130,246,0.2)";
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0, textAlign: "left" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                              <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6" }}>
                                Decision:
                              </span>
                              <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(215 16% 28%)", fontFamily: "var(--app-font-mono)" }}>
                                {dr.id}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, paddingLeft: 8 }}>
                              <span style={{ fontSize: 7.5, color: "hsl(215 16% 44%)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {dr.name}
                              </span>
                              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: confColor, flexShrink: 0 }}>
                                {dr.confidence}%
                              </span>
                              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: outcomeColor[dr.outcome] ?? "hsl(215 16% 32%)", flexShrink: 0 }}>
                                {dr.outcome}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })()}

                    {/* Suggested Interventions button */}
                    {moment && (
                      <button
                        onClick={() => handleToggleInterventions(row.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 9px",
                          marginTop: 5,
                          background: isExpanded
                            ? "rgba(167,139,250,0.12)"
                            : actionedCount > 0
                              ? "rgba(16,185,129,0.06)"
                              : "rgba(167,139,250,0.06)",
                          border: `1px solid ${isExpanded
                            ? "rgba(167,139,250,0.4)"
                            : actionedCount > 0
                              ? "rgba(16,185,129,0.3)"
                              : "rgba(167,139,250,0.22)"}`,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          width: "100%",
                          maxWidth: 188,
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={e => {
                          if (!isExpanded) {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.12)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(167,139,250,0.4)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isExpanded) {
                            (e.currentTarget as HTMLButtonElement).style.background = actionedCount > 0
                              ? "rgba(16,185,129,0.06)"
                              : "rgba(167,139,250,0.06)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = actionedCount > 0
                              ? "rgba(16,185,129,0.3)"
                              : "rgba(167,139,250,0.22)";
                          }
                        }}
                      >
                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                          <div style={{ width: 3, height: 3, borderRadius: "50%", background: actionedCount > 0 ? "#10b981" : "#a78bfa", flexShrink: 0 }} />
                          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: actionedCount > 0 ? "#10b981" : "#a78bfa" }}>
                            {actionedCount > 0 ? `${actionedCount} Actioned` : "Interventions"}
                          </span>
                          <span style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(215 16% 44%)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            · {moment.interventions.length} options
                          </span>
                        </div>
                        <div style={{
                          width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}>
                          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                            <path d="M1 2L3.5 5L6 2" stroke={actionedCount > 0 ? "#10b981" : "#a78bfa"} strokeWidth="1.5" strokeLinecap="square"/>
                          </svg>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Priority */}
                  <div style={{ paddingTop: 18, paddingRight: 10 }}>
                    <PriorityBadge p={row.priority} />
                  </div>

                  {/* Recommended Action */}
                  <div style={{ paddingRight: 16, paddingTop: 2 }}>
                    <div style={{ fontSize: 11.5, color: "hsl(215 16% 70%)", lineHeight: 1.55, marginBottom: 6 }}>
                      {row.action}
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 600, opacity: 0.7 }}>
                      {row.engine}
                    </div>
                  </div>

                  {/* Owner */}
                  <div style={{ paddingTop: 2, paddingRight: 12 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "hsl(215 16% 60%)", marginBottom: 3 }}>
                      {row.owner}
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: "0.06em", color: "hsl(215 16% 32%)", textTransform: "uppercase" }}>
                      {row.ownerRole}
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 22%)", textTransform: "uppercase", marginTop: 4 }}>
                      NEXUS · Routed
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ paddingTop: 18, paddingRight: 10 }}>
                    <StatusBadge s={row.status} />
                  </div>

                  {/* Outcome */}
                  <div style={{ paddingTop: 4 }}>
                    {row.outcome === "—" ? (
                      <span style={{ fontSize: 11.5, color: "hsl(215 16% 26%)", letterSpacing: "0.08em" }}>—</span>
                    ) : (
                      <div style={{ fontSize: 11.5, color: "hsl(215 16% 52%)", lineHeight: 1.55 }}>
                        {row.outcome}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Interventions panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <InterventionsPanel
                      row={row}
                      actioned={actioned}
                      onAction={handleAction}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer attribution */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}
          style={{
            marginTop: 28, paddingTop: 18,
            borderTop: "1px solid hsl(220 13% 8%)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Signal intelligence · Confidence scoring · Decision recommendation" },
              { name: "NEXUS", desc: "Owner routing · Escalation pathways" },
              { name: "VECTOR", desc: "Execution coordination · Outcome tracking" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 24%)", textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 18%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 18%)" }}>
            Showing 5 of 12 active signals
          </div>
        </motion.div>

      </div>
    </div>
  );
}
