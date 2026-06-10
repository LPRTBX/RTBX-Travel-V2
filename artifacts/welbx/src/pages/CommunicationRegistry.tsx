import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

/* ─── Types ───────────────────────────────────────────── */
type Category = "Guest" | "Workforce" | "Operations" | "Executive";
type Channel = "App" | "SMS" | "Email" | "Radio" | "Dashboard" | "PMS";
type CommStatus = "Sent" | "Delivered" | "Opened" | "Actioned";

const CAT_COLOR: Record<Category, string> = {
  Guest:     C.amber,
  Workforce: C.blue,
  Operations: C.slate,
  Executive: C.violet,
};

const STATUS_COLOR: Record<CommStatus, string> = {
  Sent:      "hsl(215 16% 40%)",
  Delivered: C.blue,
  Opened:    C.amber,
  Actioned:  C.green,
};

const CHANNEL_COLOR: Record<Channel, string> = {
  App:       C.violet,
  SMS:       C.green,
  Email:     C.blue,
  Radio:     C.amber,
  Dashboard: C.slate,
  PMS:       "hsl(215 16% 40%)",
};

interface CommRecord {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  channel: Channel;
  category: Category;
  status: CommStatus;
  outcome: string;
  timestamp: string;
}

/* ─── Mock data ───────────────────────────────────────── */
const COMMS: CommRecord[] = [
  /* ── Guest ── */
  {
    id: "CR-001",
    name: "VIP Welcome",
    trigger: "VIP Arrival · Loyalty Tier Gold+",
    audience: "Arriving VIP Guest",
    channel: "App",
    category: "Guest",
    status: "Actioned",
    outcome: "Guest upgraded · Welcome gift acknowledged · NPS +1 logged",
    timestamp: "09:14",
  },
  {
    id: "CR-002",
    name: "Complaint Recovery",
    trigger: "Service Recovery Window · Sentiment decline detected",
    audience: "Affected Guest",
    channel: "SMS",
    category: "Guest",
    status: "Actioned",
    outcome: "Duty Manager contact initiated · F&B credit redeemed within 18 min",
    timestamp: "11:32",
  },
  {
    id: "CR-003",
    name: "First-Stay Welcome",
    trigger: "First-Stay Anxiety Pattern · Check-in complete",
    audience: "First-time Guest",
    channel: "App",
    category: "Guest",
    status: "Opened",
    outcome: "Concierge introduction viewed · Room preferences confirmed",
    timestamp: "12:05",
  },
  {
    id: "CR-004",
    name: "Late Checkout Offer",
    trigger: "Loyalty Activation Window · Departure day detected",
    audience: "Gold Tier Member",
    channel: "App",
    category: "Guest",
    status: "Actioned",
    outcome: "14:00 checkout accepted · Revenue £0 · Loyalty value preserved",
    timestamp: "07:48",
  },
  {
    id: "CR-005",
    name: "Suite Upsell Prompt",
    trigger: "Suite Upgrade Window · Anniversary stay · Propensity 87",
    audience: "Standard Room Guest",
    channel: "App",
    category: "Guest",
    status: "Actioned",
    outcome: "Junior Suite accepted · £85 supplement captured",
    timestamp: "15:22",
  },

  /* ── Workforce ── */
  {
    id: "CR-006",
    name: "Staff Alert",
    trigger: "Staff Capacity Gap · Foyer queue > threshold",
    audience: "F&B Team Lead",
    channel: "Radio",
    category: "Workforce",
    status: "Actioned",
    outcome: "2 staff redeployed · Queue resolved in 8 min",
    timestamp: "14:08",
  },
  {
    id: "CR-007",
    name: "Welfare Check Request",
    trigger: "Welfare Check Trigger · 3 consecutive low-engagement shifts",
    audience: "HR Manager",
    channel: "Dashboard",
    category: "Workforce",
    status: "Delivered",
    outcome: "1:1 scheduled for 16:00 · Workload review pending",
    timestamp: "10:55",
  },
  {
    id: "CR-008",
    name: "Shift Handover Brief",
    trigger: "Shift Handover Risk · Automated at shift boundary",
    audience: "Incoming Shift Lead",
    channel: "App",
    category: "Workforce",
    status: "Opened",
    outcome: "3 open moments acknowledged · Escalations flagged",
    timestamp: "14:58",
  },

  /* ── Operations ── */
  {
    id: "CR-009",
    name: "Housekeeping Priority Alert",
    trigger: "Housekeeping Bottleneck · 6 VIP rooms pending at 12:41",
    audience: "Housekeeping Supervisor",
    channel: "PMS",
    category: "Operations",
    status: "Actioned",
    outcome: "VIP rooms prioritised · 0 VIP delays at 14:00 arrival",
    timestamp: "12:41",
  },
  {
    id: "CR-010",
    name: "Maintenance Deferral Notice",
    trigger: "Maintenance Escalation Risk · Non-critical HVAC fault",
    audience: "Engineering Lead",
    channel: "Dashboard",
    category: "Operations",
    status: "Delivered",
    outcome: "Post-15:00 maintenance slot confirmed · Monitoring active",
    timestamp: "13:17",
  },
  {
    id: "CR-011",
    name: "Supply Threshold Warning",
    trigger: "Supply Threshold Alert · F&B stock below 20%",
    audience: "F&B Manager",
    channel: "App",
    category: "Operations",
    status: "Actioned",
    outcome: "Emergency order placed · ETA 16:30 confirmed",
    timestamp: "11:48",
  },

  /* ── Executive ── */
  {
    id: "CR-012",
    name: "Executive Notification",
    trigger: "Portfolio Performance Deviation · NPS -2.1 pts over 30 days",
    audience: "COO",
    channel: "Email",
    category: "Executive",
    status: "Opened",
    outcome: "Brand experience audit initiated · BXOS review scheduled",
    timestamp: "08:00",
  },
  {
    id: "CR-013",
    name: "Cross-Property Pattern Brief",
    trigger: "Cross-Property Learning Signal · 3 properties · 4-week alignment",
    audience: "General Manager + COO",
    channel: "Dashboard",
    category: "Executive",
    status: "Delivered",
    outcome: "Friday staffing model review added to board agenda",
    timestamp: "08:00",
  },
  {
    id: "CR-014",
    name: "Daily Execution Summary",
    trigger: "Automated · End of operational day",
    audience: "Executive Team",
    channel: "Email",
    category: "Executive",
    status: "Actioned",
    outcome: "11 decisions reviewed · 4 follow-ups assigned",
    timestamp: "22:00",
  },
];

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operations", "Executive"];

/* ─── KPI Metrics ─────────────────────────────────────── */
const METRICS = [
  { label: "Messages Sent",       value: 14, unit: "TODAY",           color: C.amber },
  { label: "Messages Opened",     value: 11, unit: "79% OPEN RATE",   color: C.blue  },
  { label: "Actions Triggered",   value: 8,  unit: "57% ACTION RATE", color: C.green },
  { label: "Outcomes Influenced", value: 12, unit: "TRACKED",         color: C.violet },
];

/* ─── Animated count-up ───────────────────────────────── */
function CountUp({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{count}</>;
}

/* ─── Badge ───────────────────────────────────────────── */
function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color, border: `1px solid ${color}33`, padding: "2px 7px", background: `${color}0d`,
      flexShrink: 0, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

/* ─── Status pipeline ─────────────────────────────────── */
const STATUS_STEPS: CommStatus[] = ["Sent", "Delivered", "Opened", "Actioned"];

function StatusPipeline({ status }: { status: CommStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {STATUS_STEPS.map((step, i) => {
        const reached = i <= currentIdx;
        const color = reached ? STATUS_COLOR[status] : "hsl(220 13% 12%)";
        const textColor = reached ? STATUS_COLOR[status] : "hsl(215 16% 28%)";
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: reached ? color : "transparent",
              border: `1px solid ${reached ? color : "hsl(220 13% 18%)"}`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: textColor, textTransform: "uppercase" }}>
              {step}
            </span>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{ width: 8, height: 1, background: reached && i < currentIdx ? color : "hsl(220 13% 14%)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Comm Card ───────────────────────────────────────── */
function CommCard({ c, i }: { c: CommRecord; i: number }) {
  const catColor = CAT_COLOR[c.category];
  const statusColor = STATUS_COLOR[c.status];
  const channelColor = CHANNEL_COLOR[c.channel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.32 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${catColor}`,
        padding: "20px 22px",
        marginBottom: 1,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)", textTransform: "uppercase" }}>
              {c.id}
            </span>
            <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>
              {c.timestamp}
            </span>
            <Badge text={c.channel} color={channelColor} />
            <Badge text={c.category} color={catColor} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 4 }}>
            {c.name}
          </div>
          <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.5 }}>
            {c.trigger}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 20 }}>
          <Badge text={c.status} color={statusColor} />
        </div>
      </div>

      {/* Detail grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        background: C.border,
        border: `1px solid ${C.border}`,
        marginBottom: 12,
      }}>
        {[
          { label: "Audience", value: c.audience },
          { label: "Outcome", value: c.outcome },
        ].map((item) => (
          <div key={item.label} style={{ background: "hsl(220 13% 6%)", padding: "11px 14px" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 5 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 11, color: "hsl(215 16% 52%)", lineHeight: 1.55 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Status pipeline */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "9px 12px",
        background: `${catColor}06`,
        border: `1px solid ${catColor}14`,
      }}>
        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase", flexShrink: 0 }}>
          DELIVERY
        </span>
        <StatusPipeline status={c.status} />
      </div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function CommunicationRegistry() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered = activeCategory === "All"
    ? COMMS
    : COMMS.filter(c => c.category === activeCategory);

  const catCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = COMMS.filter(c => c.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Communication Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Communication Registry
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Every outbound communication — tracked from trigger to outcome.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {COMMS.length} communications logged today
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              4 categories · NEXUS routed
            </div>
          </div>
        </motion.div>

        {/* ── KPI strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
              style={{
                padding: "18px 20px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${m.color}`,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7 }}>
                <CountUp target={m.value} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
                {m.unit}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Category filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          style={{ display: "flex", gap: 1, marginBottom: 0 }}
        >
          {(["All", ...ALL_CATEGORIES] as Array<"All" | Category>).map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat === "All" ? C.amber : CAT_COLOR[cat];
            const count = cat === "All" ? COMMS.length : catCounts[cat];
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
                  {cat === "All" ? "All Communications" : `${cat}`}
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

        {/* ── Comm feed ── */}
        <div style={{
          border: `1px solid ${C.border}`,
          borderTop: "none",
          background: "hsl(220 13% 6%)",
          padding: "1px 0 0",
          marginBottom: 24,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ padding: "1px" }}
            >
              {filtered.map((c, i) => (
                <CommCard key={c.id} c={c} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Channel legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 8, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", flexShrink: 0 }}>Channels</span>
          {(Object.entries(CHANNEL_COLOR) as [Channel, string][]).map(([ch, col]) => (
            <div key={ch} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
              <span style={{ fontSize: 8.5, color: C.dimmed, letterSpacing: "0.06em" }}>{ch}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Status: Sent → Delivered → Opened → Actioned
          </div>
        </motion.div>

        {/* ── Engine footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "NEXUS",  desc: "Trigger routing · Audience selection · Channel assignment" },
              { name: "VECTOR", desc: "Delivery execution · Status tracking · Outcome attribution" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 14%)", textTransform: "uppercase" }}>
            WELBX Communication Registry · {COMMS.length} records
          </div>
        </motion.div>

      </div>
    </div>
  );
}
