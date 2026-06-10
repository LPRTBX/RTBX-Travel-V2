import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYBOOKS, type Playbook } from "@/data/playbooks";

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

/* ─── Flow bar ────────────────────────────────────────── */
const FLOW_STEPS = [
  { label: "Signal",            desc: "Environment detected" },
  { label: "Moment",            desc: "Pattern recognised"   },
  { label: "Playbook Triggered",desc: "Policy activated"     },
  { label: "Actions",           desc: "Execution deployed"   },
  { label: "Outcome",           desc: "Result attributed"    },
];

function CausalChain() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      style={{
        display: "flex", alignItems: "stretch",
        border: `1px solid ${C.border}`,
        background: C.card,
        marginBottom: 32,
        overflow: "hidden",
      }}
    >
      {FLOW_STEPS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.09, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1,
              padding: "18px 20px",
              borderRight: i < FLOW_STEPS.length - 1 ? `1px solid ${C.border}` : "none",
              borderTop: `2px solid ${i === 2 ? C.amber : i === 4 ? C.green : "hsl(220 13% 14%)"}`,
              position: "relative",
            }}
          >
            <div style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
              color: C.dimmed, textTransform: "uppercase", marginBottom: 7,
            }}>
              Step {i + 1}
            </div>
            <div style={{
              fontSize: 11.5, fontWeight: 700, color: i === 2 ? C.amber : i === 4 ? C.green : "#fff",
              letterSpacing: "0.03em", marginBottom: 5, lineHeight: 1.3,
            }}>
              {step.label}
            </div>
            <div style={{ fontSize: 9.5, color: C.muted, letterSpacing: "0.02em" }}>
              {step.desc}
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div style={{
                position: "absolute", right: -7, top: "50%",
                width: 13, height: 13, background: C.card,
                border: `1px solid ${C.border}`,
                borderTop: "none", borderLeft: "none",
                transform: "translateY(-50%) rotate(-45deg)",
                zIndex: 2,
              }} />
            )}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Category / status colours ──────────────────────── */
const CAT_COLOR: Record<Playbook["category"], string> = {
  Guest:       C.amber,
  VIP:         C.violet,
  Recovery:    C.blue,
  Workforce:   "#06b6d4",
  Operational: C.slate,
};

const STATUS_COLOR: Record<Playbook["status"], string> = {
  ACTIVE:    C.green,
  STANDBY:   C.amber,
  ESCALATED: C.red,
};

/* ─── Tab types ────────────────────────────────────────── */
type Tab = "trigger" | "actions" | "owners" | "escalation" | "success";

const TABS: { key: Tab; label: string }[] = [
  { key: "trigger",    label: "Trigger Conditions"   },
  { key: "actions",    label: "Recommended Actions"  },
  { key: "owners",     label: "Owners"               },
  { key: "escalation", label: "Escalation Rules"     },
  { key: "success",    label: "Success Criteria"     },
];

/* ─── Playbook card ─────────────────────────────────── */
function PlaybookCard({ playbook, index }: { playbook: Playbook; index: number }) {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");
  const catColor = CAT_COLOR[playbook.category];
  const statusColor = STATUS_COLOR[playbook.status];

  const tabContent: Record<Tab, string[]> = {
    trigger:    playbook.triggerConditions,
    actions:    playbook.recommendedActions,
    owners:     playbook.owners,
    escalation: playbook.escalationRules,
    success:    playbook.successCriteria,
  };

  const dotColor: Record<Tab, string> = {
    trigger:    C.red,
    actions:    C.amber,
    owners:     C.blue,
    escalation: C.violet,
    success:    C.green,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{
        border: `1px solid ${C.border}`,
        borderLeft: `2px solid ${catColor}`,
        background: C.card,
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div style={{
        padding: "18px 22px 16px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
            color: C.dimmed, textTransform: "uppercase", marginBottom: 6,
            fontFamily: "var(--app-font-mono)",
          }}>
            {playbook.id}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 5 }}>
            {playbook.name}
          </div>
          <div style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
            color: catColor, textTransform: "uppercase",
          }}>
            {playbook.category}
          </div>
        </div>
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: statusColor, border: `1px solid ${statusColor}33`,
          padding: "3px 9px", background: `${statusColor}0d`, flexShrink: 0,
          marginTop: 2,
        }}>
          {playbook.status}
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${C.border}`,
        overflowX: "auto",
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 16px",
                background: isActive ? "hsl(220 13% 9%)" : "transparent",
                border: "none",
                borderBottom: isActive ? `2px solid ${dotColor[tab.key]}` : "2px solid transparent",
                cursor: "pointer", transition: "all 0.14s",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: isActive ? "#fff" : "hsl(215 16% 30%)",
                textTransform: "uppercase",
                transition: "color 0.14s",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          style={{ padding: "18px 22px 20px" }}
        >
          {tabContent[activeTab].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                paddingBottom: i < tabContent[activeTab].length - 1 ? 12 : 0,
                marginBottom: i < tabContent[activeTab].length - 1 ? 12 : 0,
                borderBottom: i < tabContent[activeTab].length - 1 ? `1px solid hsl(220 13% 8%)` : "none",
              }}
            >
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: dotColor[activeTab],
                flexShrink: 0, marginTop: 5,
              }} />
              <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, letterSpacing: "0.01em" }}>
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Summary KPIs ───────────────────────────────────── */
const SUMMARY = [
  { label: "Active Playbooks",  value: "4",  sub: "RUNNING NOW",      color: C.green  },
  { label: "Standby",           value: "1",  sub: "CONDITION WATCH",  color: C.amber  },
  { label: "Playbook Steps",    value: "24", sub: "TOTAL ACTIONS",    color: C.blue   },
  { label: "Owner Roles",       value: "9",  sub: "ACCOUNTABLE",      color: C.violet },
  { label: "Consistency Rate",  value: "97%",sub: "EXECUTION SCORE",  color: C.amber  },
];

/* ─── Page ─────────────────────────────────────────── */
export default function PlaybookEngine() {
  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em",
              color: C.amber, textTransform: "uppercase", marginBottom: 10,
            }}>
              WELBX · Execution Layer
            </div>
            <h1 style={{
              fontSize: 26, fontWeight: 800, color: "#fff",
              letterSpacing: "-0.02em", margin: 0, marginBottom: 6,
            }}>
              Playbook Engine
            </h1>
            <p style={{
              fontSize: 14, fontWeight: 600, color: "hsl(215 16% 52%)",
              margin: 0, letterSpacing: "-0.01em",
            }}>
              Turning Policy Into Consistent Execution.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
              color: C.dimmed, textTransform: "uppercase", marginBottom: 4,
            }}>
              {PLAYBOOKS.length} playbooks configured
            </div>
            <div style={{
              fontSize: 8, letterSpacing: "0.1em",
              color: "hsl(215 16% 18%)", textTransform: "uppercase",
            }}>
              5 categories · Portfolio-wide
            </div>
          </div>
        </motion.div>

        {/* ── Summary strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.38 }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1, marginBottom: 28,
          }}
        >
          {SUMMARY.map((s) => (
            <div key={s.label} style={{
              padding: "16px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderTop: `2px solid ${s.color}`,
            }}>
              <div style={{
                fontSize: 26, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                color: C.dimmed, textTransform: "uppercase",
              }}>
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Causal chain flow bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em",
            color: C.amber, textTransform: "uppercase", marginBottom: 12,
          }}
        >
          Execution Flow
        </motion.div>
        <CausalChain />

        {/* ── Playbook grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em",
            color: C.amber, textTransform: "uppercase", marginBottom: 16,
          }}
        >
          Configured Playbooks
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          {PLAYBOOKS.map((pb, i) => (
            <PlaybookCard key={pb.id} playbook={pb} index={i} />
          ))}
        </div>

        {/* ── Engine footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          style={{
            marginTop: 28, paddingTop: 18,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS",   desc: "Signal detection · Moment classification · Playbook activation" },
              { name: "NEXUS",  desc: "Owner routing · Escalation governance · Accountability chain" },
              { name: "VECTOR", desc: "Action execution · Outcome attribution · Playbook learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 14%)" }}>
            WELBX · Playbook Engine · v2.4
          </div>
        </motion.div>

      </div>
    </div>
  );
}
