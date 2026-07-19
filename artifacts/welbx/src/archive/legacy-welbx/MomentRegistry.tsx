import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getPlaybookById } from "../data/playbooks";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  cyan:   "#22d3ee",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Types ───────────────────────────────────────────── */
type Category = "Guest" | "Workforce" | "Operational" | "Commercial" | "Strategic";
type Activation = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Status = "ACTIVE" | "EMERGING" | "CRITICAL" | "PROTECTED" | "INACTIVE";

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

const ACT_COLOR: Record<Activation, string> = {
  CRITICAL: C.red,
  HIGH:     C.amber,
  MEDIUM:   C.blue,
  LOW:      C.slate,
};

const STATUS_COLOR: Record<Status, string> = {
  ACTIVE:    C.green,
  EMERGING:  C.blue,
  CRITICAL:  C.red,
  PROTECTED: C.amber,
  INACTIVE:  C.dimmed,
};

interface Moment {
  id: string;
  name: string;
  category: Category;
  impact: string;
  frequency: string;
  visibility: number;
  consistency: number;
  activation: Activation;
  owner: string;
  status: Status;
  playbookId?: string;
}

/* ─── Registry data ───────────────────────────────────── */
const MOMENTS: Moment[] = [
  /* ── Guest ── */
  {
    id: "GM-001", name: "Guest Distress Signal",
    category: "Guest", impact: "Safety + Loyalty",
    frequency: "3–4× weekly", visibility: 28, consistency: 94,
    activation: "CRITICAL", owner: "Duty Manager", status: "CRITICAL",
    playbookId: "PB-001",
  },
  {
    id: "GM-002", name: "VIP Arrival Misalignment",
    category: "Guest", impact: "Activation · High value",
    frequency: "2–3× weekly", visibility: 44, consistency: 97,
    activation: "HIGH", owner: "General Manager", status: "ACTIVE",
    playbookId: "PB-002",
  },
  {
    id: "GM-003", name: "First-Stay Anxiety Pattern",
    category: "Guest", impact: "Loyalty · NPS +1.2 avg",
    frequency: "8–12× daily", visibility: 19, consistency: 82,
    activation: "HIGH", owner: "Concierge", status: "ACTIVE",
    playbookId: "PB-003",
  },
  {
    id: "GM-004", name: "Service Recovery Window",
    category: "Guest", impact: "Retention · Protected value",
    frequency: "5–8× weekly", visibility: 61, consistency: 89,
    activation: "HIGH", owner: "Front Desk Lead", status: "ACTIVE",
    playbookId: "PB-003",
  },
  {
    id: "GM-005", name: "Loyalty Activation Window",
    category: "Guest", impact: "Activation · Loyalty uplift",
    frequency: "4–6× daily", visibility: 38, consistency: 76,
    activation: "MEDIUM", owner: "Guest Relations", status: "EMERGING",
    playbookId: "PB-002",
  },

  /* ── Workforce ── */
  {
    id: "WF-001", name: "Staff Capacity Gap",
    category: "Workforce", impact: "Service continuity",
    frequency: "3–4× weekly", visibility: 52, consistency: 88,
    activation: "HIGH", owner: "Duty Manager", status: "ACTIVE",
    playbookId: "PB-004",
  },
  {
    id: "WF-002", name: "Shift Handover Risk",
    category: "Workforce", impact: "Operational continuity",
    frequency: "2× daily", visibility: 34, consistency: 71,
    activation: "MEDIUM", owner: "Department Head", status: "EMERGING",
    playbookId: "PB-004",
  },
  {
    id: "WF-003", name: "Welfare Check Trigger",
    category: "Workforce", impact: "HR + Legal risk",
    frequency: "2–3× weekly", visibility: 22, consistency: 91,
    activation: "HIGH", owner: "HR Manager", status: "ACTIVE",
    playbookId: "PB-004",
  },
  {
    id: "WF-004", name: "Team Performance Deviation",
    category: "Workforce", impact: "Quality assurance",
    frequency: "Weekly", visibility: 41, consistency: 64,
    activation: "MEDIUM", owner: "Operations Director", status: "EMERGING",
    playbookId: "PB-004",
  },

  /* ── Operational ── */
  {
    id: "OP-001", name: "Foyer Congestion Threshold",
    category: "Operational", impact: "Guest flow · Operational risk",
    frequency: "2–3× weekly", visibility: 67, consistency: 94,
    activation: "HIGH", owner: "Front Desk Lead", status: "ACTIVE",
    playbookId: "PB-003",
  },
  {
    id: "OP-002", name: "Housekeeping Bottleneck",
    category: "Operational", impact: "Room activation · High value",
    frequency: "Daily", visibility: 58, consistency: 81,
    activation: "MEDIUM", owner: "Housekeeping Manager", status: "ACTIVE",
    playbookId: "PB-005",
  },
  {
    id: "OP-003", name: "Maintenance Escalation Risk",
    category: "Operational", impact: "Asset + disruption",
    frequency: "Weekly", visibility: 44, consistency: 74,
    activation: "MEDIUM", owner: "Engineering Lead", status: "EMERGING",
    playbookId: "PB-005",
  },
  {
    id: "OP-004", name: "Supply Threshold Alert",
    category: "Operational", impact: "F&B service continuity",
    frequency: "2–3× weekly", visibility: 71, consistency: 68,
    activation: "LOW", owner: "F&B Manager", status: "EMERGING",
    playbookId: "PB-005",
  },

  /* ── Commercial ── */
  {
    id: "CM-001", name: "Suite Upgrade Window",
    category: "Commercial", impact: "Activation · High value",
    frequency: "2–3× daily", visibility: 48, consistency: 79,
    activation: "HIGH", owner: "Guest Relations", status: "ACTIVE",
    playbookId: "PB-002",
  },
  {
    id: "CM-002", name: "F&B Activation Opportunity",
    category: "Commercial", impact: "Activation · Value uplift",
    frequency: "4–6× daily", visibility: 54, consistency: 72,
    activation: "MEDIUM", owner: "F&B Manager", status: "ACTIVE",
    playbookId: "PB-002",
  },
  {
    id: "CM-003", name: "Repeat Guest Recognition",
    category: "Commercial", impact: "Loyalty · Lifetime value",
    frequency: "6–10× daily", visibility: 62, consistency: 83,
    activation: "HIGH", owner: "Concierge", status: "ACTIVE",
    playbookId: "PB-002",
  },
  {
    id: "CM-004", name: "Late Checkout Conversion",
    category: "Commercial", impact: "Activation · Per room uplift",
    frequency: "8–12× daily", visibility: 76, consistency: 91,
    activation: "MEDIUM", owner: "Front Desk Lead", status: "ACTIVE",
    playbookId: "PB-003",
  },

  /* ── Strategic ── */
  {
    id: "ST-001", name: "Portfolio Performance Deviation",
    category: "Strategic", impact: "Investment governance",
    frequency: "Weekly", visibility: 29, consistency: 58,
    activation: "HIGH", owner: "COO", status: "EMERGING",
    playbookId: "PB-001",
  },
  {
    id: "ST-002", name: "Cross-Property Learning Signal",
    category: "Strategic", impact: "Systemic improvement",
    frequency: "Monthly", visibility: 18, consistency: 44,
    activation: "MEDIUM", owner: "WELBX Platform", status: "EMERGING",
  },
  {
    id: "ST-003", name: "Outcome Pattern Recognition",
    category: "Strategic", impact: "Competitive advantage",
    frequency: "Continuous", visibility: 12, consistency: 88,
    activation: "HIGH", owner: "WELBX Platform", status: "ACTIVE",
  },
];

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

/* ─── Summary KPIs ───────────────────────────────────── */
const SUMMARY = [
  { label: "Active Moments",   value: "13", sub: "BXOS MONITORING",    color: C.green  },
  { label: "Emerging Moments", value: "7",  sub: "SIGNAL DETECTED",    color: C.blue   },
  { label: "Critical Moments", value: "3",  sub: "REQUIRES ACTION",    color: C.red    },
  { label: "Protected Value",  value: "94",  sub: "VALUE SCORE · 30 DAYS",  color: C.amber },
  { label: "Opportunity Score",value: "71",  sub: "ACTIVATION PIPELINE",    color: C.violet},
];

/* ─── Score bar ─────────────────────────────────────── */
function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 52, height: 3, background: "hsl(220 13% 11%)", flexShrink: 0 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color }} />
      </div>
      <span style={{ fontSize: 10.5, fontWeight: 700, color, minWidth: 24 }}>{value}</span>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color, border: `1px solid ${color}33`, padding: "2px 7px", background: `${color}0d`,
      flexShrink: 0,
    }}>{text}</span>
  );
}

/* ─── Page ─────────────────────────────────────────── */
export default function MomentRegistry() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [, navigate] = useLocation();
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;

    const moment = MOMENTS.find(m => m.id === id);
    if (!moment) return;

    setHighlightId(id);
    setActiveCategory(moment.category);

    const scrollAndClear = () => {
      const el = document.getElementById(`moment-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      highlightTimerRef.current = setTimeout(() => setHighlightId(null), 3500);
    };

    const delay = setTimeout(scrollAndClear, 180);
    return () => {
      clearTimeout(delay);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const filtered = activeCategory === "All"
    ? MOMENTS
    : MOMENTS.filter(m => m.category === activeCategory);

  const catCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c] = MOMENTS.filter(m => m.category === c).length;
    return acc;
  }, {});

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Operating Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Moment Registry
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              The canonical taxonomy of every moment WELBX identifies, governs, and resolves
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {MOMENTS.length} moments registered
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              5 categories · Portfolio-wide
            </div>
          </div>
        </motion.div>

        {/* ── Summary strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {SUMMARY.map((s) => (
            <div key={s.label} style={{
              padding: "18px 20px",
              background: C.card,
              borderTop: `2px solid ${s.color}`,
              border: `1px solid ${C.border}`,
              borderTopColor: s.color,
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}
          style={{ display: "flex", gap: 1, marginBottom: 0 }}
        >
          {(["All", ...ALL_CATEGORIES] as Array<"All" | Category>).map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat === "All" ? C.amber : CAT_COLOR[cat];
            const count = cat === "All" ? MOMENTS.length : catCounts[cat];
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
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
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
        </motion.div>

        {/* ── Table ── */}
        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 110px 130px 130px 110px 120px 80px",
          padding: "9px 20px 9px 22px",
          background: "hsl(220 13% 7%)",
          border: `1px solid ${C.border}`,
          borderTop: "none",
          gap: 0,
        }}>
          {[
            "Moment", "Impact", "Frequency", "Visibility ↓", "Consistency ↑", "Activation", "Owner", "Status"
          ].map((h, i) => (
            <div key={h} style={{
              fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
              color: i === 3 ? C.red + "bb"
                   : i === 4 ? C.green + "bb"
                   : C.dimmed,
              textTransform: "uppercase",
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((m, i) => {
              const catColor  = CAT_COLOR[m.category];
              const visColor  = m.visibility < 40 ? C.red : m.visibility < 65 ? C.amber : C.green;
              const conColor  = m.consistency < 60 ? C.red : m.consistency < 80 ? C.amber : C.green;
              const isHighlit = highlightId === m.id;

              return (
                <motion.div
                  key={m.id}
                  id={`moment-${m.id}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr 110px 130px 130px 110px 120px 80px",
                    padding: "13px 20px 13px 0",
                    paddingLeft: 0,
                    background: isHighlit
                      ? `${C.cyan}12`
                      : i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                    border: isHighlit
                      ? `1px solid ${C.cyan}55`
                      : `1px solid ${C.border}`,
                    borderTopWidth: 0,
                    borderLeft: isHighlit ? `3px solid ${C.cyan}` : `2px solid ${catColor}`,
                    alignItems: "center",
                    gap: 0,
                    transition: "background 0.4s, border-color 0.4s",
                  }}
                >
                  {/* Name + ID */}
                  <div style={{ paddingLeft: 18, paddingRight: 12 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--app-font-mono)" }}>
                      {m.id}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 3 }}>
                      {m.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: catColor, textTransform: "uppercase", opacity: 0.7 }}>
                        {m.category}
                      </div>
                      {m.playbookId && (() => {
                        const pb = getPlaybookById(m.playbookId);
                        if (!pb) return null;
                        return (
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/playbook-engine#${pb.id}`); }}
                            style={{
                              fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                              color: C.violet, textTransform: "uppercase",
                              background: `${C.violet}10`, border: `1px solid ${C.violet}33`,
                              padding: "2px 6px", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 4,
                              lineHeight: 1.5,
                            }}
                          >
                            <span style={{ opacity: 0.6 }}>▶</span>
                            {pb.name}
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Impact */}
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, paddingRight: 12 }}>
                    {m.impact}
                  </div>

                  {/* Frequency */}
                  <div style={{ fontSize: 10.5, color: "hsl(215 16% 44%)", paddingRight: 12 }}>
                    {m.frequency}
                  </div>

                  {/* Visibility (low = bad = red) */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
                      Without WELBX
                    </div>
                    <ScoreBar value={m.visibility} color={visColor} />
                  </div>

                  {/* Consistency (high = good = green) */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
                      With WELBX
                    </div>
                    <ScoreBar value={m.consistency} color={conColor} />
                  </div>

                  {/* Activation */}
                  <div style={{ paddingRight: 12 }}>
                    <Badge text={m.activation} color={ACT_COLOR[m.activation]} />
                  </div>

                  {/* Owner */}
                  <div style={{ fontSize: 10.5, color: "hsl(215 16% 50%)", paddingRight: 12, lineHeight: 1.4 }}>
                    {m.owner}
                  </div>

                  {/* Status */}
                  <div>
                    <Badge text={m.status} color={STATUS_COLOR[m.status]} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Scoring legend ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 24, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 28, height: 3, background: C.red }} />
            <span style={{ fontSize: 8.5, color: C.dimmed }}>Visibility &lt; 40 · High blind-spot risk</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 28, height: 3, background: C.amber }} />
            <span style={{ fontSize: 8.5, color: C.dimmed }}>Visibility 40–65 · Partial coverage</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 28, height: 3, background: C.green }} />
            <span style={{ fontSize: 8.5, color: C.dimmed }}>Consistency &gt; 80 · WELBX governed</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Visibility = without WELBX · Consistency = with WELBX active
          </div>
        </motion.div>

        {/* ── Engine footer ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}
          style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Signal classification · Moment scoring · Activation trigger" },
              { name: "NEXUS", desc: "Owner routing · Escalation governance" },
              { name: "VECTOR", desc: "Action execution · Outcome attribution · Registry learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            WELBX Moment Registry · {MOMENTS.length} canonical moments
          </div>
        </motion.div>

      </div>
    </div>
  );
}
