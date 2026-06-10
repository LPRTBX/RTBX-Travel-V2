import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { PLAYBOOKS, type Playbook, type PlaybookExecution } from "@/data/playbooks";

/* ─── Filter types ────────────────────────────────────── */
type CategoryFilter = Playbook["category"] | "All";
type StatusFilter   = Playbook["status"]   | "All";

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

const OUTCOME_COLOR: Record<PlaybookExecution["outcome"], string> = {
  Resolved:  C.green,
  Escalated: C.red,
  Partial:   C.amber,
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

/* ─── Helpers ─────────────────────────────────────────── */
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatResolution(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ─── Outcome filter types ────────────────────────────── */
type OutcomeFilter = PlaybookExecution["outcome"] | "All";
const OUTCOME_FILTERS: OutcomeFilter[] = ["All", "Resolved", "Escalated", "Partial"];

/* ─── Execution timeline ──────────────────────────────── */
function ExecutionTimeline({ executions }: { executions: PlaybookExecution[] }) {
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("All");
  const [, navigate] = useLocation();

  const filtered = outcomeFilter === "All"
    ? executions
    : executions.filter((ex) => ex.outcome === outcomeFilter);

  return (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        background: "hsl(220 13% 5%)",
        padding: "16px 22px 20px",
        maxHeight: 340,
        overflowY: "auto",
      }}
    >
      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 14, flexWrap: "wrap",
      }}>
        {OUTCOME_FILTERS.map((f) => {
          const isActive = outcomeFilter === f;
          const count = f === "All"
            ? executions.length
            : executions.filter((ex) => ex.outcome === f).length;
          const accentColor = f === "All" ? C.blue : OUTCOME_COLOR[f as PlaybookExecution["outcome"]];
          return (
            <button
              key={f}
              onClick={() => setOutcomeFilter(f)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "3px 9px",
                background: isActive ? `${accentColor}18` : "transparent",
                border: `1px solid ${isActive ? accentColor + "55" : "hsl(220 13% 11%)"}`,
                cursor: "pointer",
                transition: "all 0.14s",
              }}
            >
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
                color: isActive ? accentColor : "hsl(215 16% 30%)",
                textTransform: "uppercase", transition: "color 0.14s",
              }}>
                {f}
              </span>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.06em",
                color: isActive ? accentColor : "hsl(215 16% 22%)",
                background: isActive ? `${accentColor}22` : "hsl(220 13% 9%)",
                padding: "0px 5px", minWidth: 16, textAlign: "center",
                transition: "all 0.14s",
              }}>
                {count}
              </span>
            </button>
          );
        })}
        {outcomeFilter !== "All" && (
          <span style={{
            fontSize: 8, color: "hsl(215 16% 24%)", letterSpacing: "0.04em", marginLeft: 2,
          }}>
            {filtered.length === 0
              ? "No matching runs"
              : `${filtered.length} of ${executions.length} run${executions.length !== 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      <div style={{ position: "relative" }}>
        {/* vertical line */}
        <div style={{
          position: "absolute", left: 6, top: 0, bottom: 0,
          width: 1, background: "hsl(220 13% 10%)",
        }} />
        {filtered.length === 0 ? (
          <div style={{
            paddingLeft: 22, fontSize: 10, color: "hsl(215 16% 26%)",
            letterSpacing: "0.04em", fontStyle: "italic",
          }}>
            No {outcomeFilter.toLowerCase()} runs in this history.
          </div>
        ) : filtered.map((ex, i) => {
          const outcomeColor = OUTCOME_COLOR[ex.outcome];
          return (
            <div
              key={ex.id}
              style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                paddingLeft: 22,
                paddingBottom: i < filtered.length - 1 ? 16 : 0,
                position: "relative",
              }}
            >
              {/* dot */}
              <div style={{
                position: "absolute", left: 2, top: 5,
                width: 9, height: 9, borderRadius: "50%",
                background: outcomeColor,
                boxShadow: `0 0 0 2px hsl(220 13% 5%), 0 0 6px ${outcomeColor}55`,
                flexShrink: 0,
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* top row: id + timestamp */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "baseline", marginBottom: 4, gap: 8,
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                    color: C.dimmed, fontFamily: "var(--app-font-mono)",
                    flexShrink: 0,
                  }}>
                    {ex.id}
                  </span>
                  <span style={{
                    fontSize: 8.5, color: "hsl(215 16% 28%)",
                    letterSpacing: "0.02em", textAlign: "right",
                  }}>
                    {formatTimestamp(ex.timestamp)}
                  </span>
                </div>

                {/* trigger */}
                <div style={{
                  fontSize: 11, fontWeight: 600, color: "#bcc8d8",
                  lineHeight: 1.4, marginBottom: 6, letterSpacing: "0.01em",
                }}>
                  {ex.trigger}
                </div>

                {/* meta row */}
                <div style={{
                  display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 9.5, color: C.muted, letterSpacing: "0.01em" }}>
                    {ex.owner}
                  </span>
                  <span style={{
                    fontSize: 8, color: "hsl(215 16% 24%)",
                    letterSpacing: "0.06em",
                  }}>
                    ·
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                    color: outcomeColor, textTransform: "uppercase",
                    border: `1px solid ${outcomeColor}33`,
                    background: `${outcomeColor}0d`,
                    padding: "2px 7px",
                  }}>
                    {ex.outcome}
                  </span>
                  <span style={{
                    fontSize: 8, color: "hsl(215 16% 26%)",
                    letterSpacing: "0.06em",
                  }}>
                    ·
                  </span>
                  <span style={{ fontSize: 9, color: "hsl(215 16% 34%)", letterSpacing: "0.04em" }}>
                    {formatResolution(ex.resolutionMinutes)} resolution
                  </span>
                  {ex.momentId && (
                    <>
                      <span style={{
                        fontSize: 8, color: "hsl(215 16% 26%)",
                        letterSpacing: "0.06em",
                      }}>
                        ·
                      </span>
                      <button
                        onClick={() => navigate(`/live-moments#${ex.momentId}`)}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: C.amber,
                          textTransform: "uppercase",
                          opacity: 0.85,
                          transition: "opacity 0.14s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        View Moment →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Stats strip ─────────────────────────────────────── */
function PlaybookStatsStrip({ playbook }: { playbook: Playbook }) {
  const { stats } = playbook;
  const successColor = stats.successRate >= 90 ? C.green : stats.successRate >= 75 ? C.amber : C.red;
  return (
    <div style={{
      display: "flex",
      borderBottom: `1px solid ${C.border}`,
      background: "hsl(220 13% 6%)",
    }}>
      {[
        {
          label: "Fires (30 days)",
          value: String(stats.firesLast30Days),
          color: C.blue,
        },
        {
          label: "Avg Resolution",
          value: formatResolution(stats.avgResolutionMinutes),
          color: C.violet,
        },
        {
          label: "Success Rate",
          value: `${stats.successRate}%`,
          color: successColor,
        },
      ].map((s, i, arr) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            padding: "10px 18px",
            borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
          }}
        >
          <div style={{
            fontSize: 15, fontWeight: 800, color: s.color,
            letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 4,
          }}>
            {s.value}
          </div>
          <div style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
            color: C.dimmed, textTransform: "uppercase",
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Playbook card ─────────────────────────────────── */
function PlaybookCard({ playbook, index }: { playbook: Playbook; index: number }) {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const catColor = CAT_COLOR[playbook.category];
  const statusColor = STATUS_COLOR[playbook.status];

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash !== playbook.id) return;
    setHighlighted(true);
    const timer = setTimeout(() => setHighlighted(false), 2000);
    return () => clearTimeout(timer);
  }, [playbook.id]);

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
      id={playbook.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: highlighted
          ? `0 0 0 1px ${C.amber}, 0 0 18px ${C.amber}55`
          : "0 0 0 0px transparent",
      }}
      transition={{
        opacity: { delay: 0.25 + index * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        y:       { delay: 0.25 + index * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        boxShadow: highlighted
          ? { duration: 0.25, ease: "easeOut" }
          : { duration: 0.8, ease: "easeOut" },
      }}
      style={{
        border: `1px solid ${highlighted ? C.amber : C.border}`,
        borderLeft: `2px solid ${catColor}`,
        background: C.card,
        overflow: "hidden",
        scrollMarginTop: 24,
        transition: "border-color 0.25s ease",
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

      {/* Stats strip */}
      <PlaybookStatsStrip playbook={playbook} />

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

      {/* Run History toggle */}
      <button
        onClick={() => setHistoryOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 22px",
          background: historyOpen ? "hsl(220 13% 6%)" : "transparent",
          border: "none",
          borderTop: `1px solid ${C.border}`,
          cursor: "pointer",
          transition: "background 0.14s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
            color: C.dimmed, textTransform: "uppercase",
          }}>
            Run History
          </span>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
            color: C.blue, background: `${C.blue}18`,
            border: `1px solid ${C.blue}33`,
            padding: "1px 6px",
          }}>
            {playbook.executions.length} runs
          </span>
        </div>
        <span style={{
          fontSize: 10, color: C.dimmed,
          transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          display: "inline-block",
        }}>
          ▾
        </span>
      </button>

      {/* Execution timeline */}
      <AnimatePresence initial={false}>
        {historyOpen && (
          <motion.div
            key="history"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ExecutionTimeline executions={playbook.executions} />
          </motion.div>
        )}
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

/* ─── Filter constants ───────────────────────────────── */
const ALL_CATEGORIES: Playbook["category"][] = ["Guest", "VIP", "Recovery", "Workforce", "Operational"];
const ALL_STATUSES:   Playbook["status"][]   = ["ACTIVE", "STANDBY", "ESCALATED"];

/* ─── Page ─────────────────────────────────────────── */
export default function PlaybookEngine() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activeStatus,   setActiveStatus]   = useState<StatusFilter>("All");

  const filtered = PLAYBOOKS.filter((pb) => {
    const catMatch = activeCategory === "All" || pb.category === activeCategory;
    const stsMatch = activeStatus   === "All" || pb.status   === activeStatus;
    return catMatch && stsMatch;
  });

  const catCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    const stsMask = activeStatus === "All"
      ? PLAYBOOKS
      : PLAYBOOKS.filter(pb => pb.status === activeStatus);
    acc[c] = stsMask.filter(pb => pb.category === c).length;
    return acc;
  }, {});

  const stsCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    const catMask = activeCategory === "All"
      ? PLAYBOOKS
      : PLAYBOOKS.filter(pb => pb.category === activeCategory);
    acc[s] = catMask.filter(pb => pb.status === s).length;
    return acc;
  }, {});

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

        {/* ── Filter bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          style={{
            display: "flex", flexDirection: "column", gap: 1, marginBottom: 0,
          }}
        >
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 1 }}>
            {(["All", ...ALL_CATEGORIES] as CategoryFilter[]).map((cat) => {
              const isActive = activeCategory === cat;
              const color = cat === "All" ? C.amber : CAT_COLOR[cat as Playbook["category"]];
              const count = cat === "All"
                ? (activeStatus === "All" ? PLAYBOOKS.length : PLAYBOOKS.filter(pb => pb.status === activeStatus).length)
                : catCounts[cat as Playbook["category"]];
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
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    color: isActive ? "#fff" : "hsl(215 16% 36%)",
                  }}>
                    {cat}
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
          </div>

          {/* Status toggle + count */}
          <div style={{
            display: "flex", alignItems: "center", gap: 1,
            padding: "10px 16px",
            background: "hsl(220 13% 7%)",
            border: `1px solid ${C.border}`,
            borderTop: "none",
          }}>
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
              color: C.dimmed, textTransform: "uppercase", marginRight: 12,
            }}>
              Status
            </span>
            {(["All", ...ALL_STATUSES] as StatusFilter[]).map((sts) => {
              const isActive = activeStatus === sts;
              const color = sts === "All" ? C.amber : STATUS_COLOR[sts as Playbook["status"]];
              const count = sts === "All"
                ? (activeCategory === "All" ? PLAYBOOKS.length : PLAYBOOKS.filter(pb => pb.category === activeCategory).length)
                : stsCounts[sts as Playbook["status"]];
              return (
                <button
                  key={sts}
                  onClick={() => setActiveStatus(sts)}
                  style={{
                    padding: "5px 13px",
                    background: isActive ? `${color}15` : "transparent",
                    border: `1px solid ${isActive ? color + "55" : "hsl(220 13% 12%)"}`,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 7, marginRight: 2,
                  }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    color: isActive ? color : "hsl(215 16% 30%)",
                    textTransform: "uppercase",
                  }}>
                    {sts}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
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

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                color: filtered.length > 0 ? C.amber : C.dimmed,
                textTransform: "uppercase",
              }}>
                {filtered.length} playbook{filtered.length !== 1 ? "s" : ""}
              </span>
              {(activeCategory !== "All" || activeStatus !== "All") && (
                <button
                  onClick={() => { setActiveCategory("All"); setActiveStatus("All"); }}
                  style={{
                    padding: "3px 9px", background: "transparent",
                    border: `1px solid hsl(220 13% 13%)`, cursor: "pointer",
                  }}
                >
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                    color: C.dimmed, textTransform: "uppercase",
                  }}>
                    Clear
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Playbook grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeStatus}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: 1 }}
          >
            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {filtered.map((pb, i) => (
                  <PlaybookCard key={pb.id} playbook={pb} index={i} />
                ))}
              </div>
            ) : (
              <div style={{
                padding: "48px 24px",
                background: C.card,
                border: `1px solid ${C.border}`,
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  color: C.dimmed, textTransform: "uppercase", marginBottom: 10,
                }}>
                  No Playbooks Match
                </div>
                <div style={{ fontSize: 12, color: "hsl(215 16% 26%)", letterSpacing: "0.02em" }}>
                  No playbooks match the selected category and status filters.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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
