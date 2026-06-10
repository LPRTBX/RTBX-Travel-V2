import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  teal:   "#14b8a6",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Types ───────────────────────────────────────────── */
type Category = "Guest" | "Workforce" | "Operational" | "Commercial" | "Strategic";
type SuccessLevel = "Exceptional" | "Strong" | "Adequate" | "Partial" | "Failed";

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

const SUCCESS_COLOR: Record<SuccessLevel, string> = {
  Exceptional: C.teal,
  Strong:      C.green,
  Adequate:    C.amber,
  Partial:     "#f97316",
  Failed:      C.red,
};

interface Outcome {
  id: string;
  category: Category;
  timestamp: string;
  signal: string;
  moment: string;
  decision: string;
  action: string;
  outcome: string;
  successLevel: SuccessLevel;
  valueProtected: string;
  valueCreated: string;
  learning: string;
}

/* ─── Mock data ───────────────────────────────────────── */
const OUTCOMES: Outcome[] = [
  /* ── Guest ── */
  {
    id: "OR-001",
    category: "Guest",
    timestamp: "09:14",
    signal: "Loyalty tier flagged · 7th stay · Suite inventory available",
    moment: "VIP Arrival",
    decision: "Upgrade Approved — Meridian Suite",
    action: "Room upgraded · Personalised welcome note delivered",
    outcome: "Guest expressed delight at check-in · 5-star review posted same evening",
    successLevel: "Exceptional",
    valueProtected: "£8,400 lifetime value",
    valueCreated: "£340 incremental revenue + 5-star review",
    learning: "Loyalty-tier upgrades on repeat stays produce 3× more positive reviews. Automate for all 6th+ stays with available suite inventory.",
  },
  {
    id: "OR-002",
    category: "Guest",
    timestamp: "11:32",
    signal: "Housekeeping delay >40 min · Declining sentiment signal · First-stay profile",
    moment: "Service Recovery Window",
    decision: "Proactive Recovery Initiated — F&B credit + Duty Manager contact",
    action: "£30 F&B credit issued · Duty Manager contacted guest within 8 min",
    outcome: "Guest satisfaction retained · No complaint logged · Revisit intent confirmed",
    successLevel: "Strong",
    valueProtected: "£3,400 avg retention value",
    valueCreated: "£30 F&B spend triggered · Positive debrief captured",
    learning: "Recovery before complaint is 4× more effective. Pre-emptive contact within 10 min is the key timing threshold.",
  },
  {
    id: "OR-003",
    category: "Guest",
    timestamp: "07:48",
    signal: "Gold tier · 3-night stay · No demand conflict until 16:00",
    moment: "Loyalty Activation Window",
    decision: "Late Checkout Approved — 14:00",
    action: "Checkout extended to 14:00 · Logged as loyalty service event",
    outcome: "Guest departed relaxed · Revisit booking made before departure",
    successLevel: "Exceptional",
    valueProtected: "£2,100 loyalty segment value",
    valueCreated: "Forward booking confirmed — £1,240 revenue",
    learning: "Late checkout granted proactively converts 68% of departing guests into repeat intent within 90 days.",
  },
  {
    id: "OR-004",
    category: "Guest",
    timestamp: "13:05",
    signal: "First-stay guest · No F&B engagement in first 4 hours · Mid-afternoon dip",
    moment: "First-Stay Anxiety Pattern",
    decision: "Personalised Welcome Amenity Dispatched",
    action: "Handwritten note + seasonal amenity sent to room",
    outcome: "Guest visited restaurant for dinner — first-stay engagement unlocked",
    successLevel: "Strong",
    valueProtected: "£1,800 first-stay conversion value",
    valueCreated: "£94 dinner spend · Brand affinity signal positive",
    learning: "Personal touches in the first 6 hours increase in-stay F&B conversion by 41% for first-time guests.",
  },

  /* ── Workforce ── */
  {
    id: "OR-005",
    category: "Workforce",
    timestamp: "14:08",
    signal: "Foyer queue depth exceeding threshold · F&B team at 40% occupancy",
    moment: "Staff Capacity Gap",
    decision: "Cross-Department Redeployment — 2× F&B to front desk",
    action: "2 F&B staff redeployed · Front desk throughput restored within 6 min",
    outcome: "Queue cleared in 9 min · No guest complaints recorded · Service continuity maintained",
    successLevel: "Exceptional",
    valueProtected: "£4,800 service continuity risk avoided",
    valueCreated: "Cross-training data captured for future redeployment mapping",
    learning: "Cross-department redeployment under 5 min prevents queue abandonment in 81% of cases. Build redeployment protocol into shift briefs.",
  },
  {
    id: "OR-006",
    category: "Workforce",
    timestamp: "10:55",
    signal: "Staff engagement signals declining across 3 consecutive shifts",
    moment: "Welfare Check Trigger",
    decision: "Welfare Check Escalated — 1:1 scheduled",
    action: "HR Manager 1:1 held within 24 hours · Workload adjustment made",
    outcome: "Staff member returned to full engagement within 2 weeks · Absence risk averted",
    successLevel: "Strong",
    valueProtected: "£6,200 estimated unplanned absence cost avoided",
    valueCreated: "Retention secured · Team morale maintained",
    learning: "Early welfare intervention reduces unplanned absence by 44% when actioned within 48 hours of signal detection.",
  },
  {
    id: "OR-007",
    category: "Workforce",
    timestamp: "06:55",
    signal: "Shift handover gap detected · Night manager briefing incomplete",
    moment: "Shift Handover Risk",
    decision: "Duty Manager Briefing Supplemented — BXOS summary sent",
    action: "Automated handover digest delivered to incoming manager",
    outcome: "Incoming manager fully briefed · No service gaps in first hour of shift",
    successLevel: "Adequate",
    valueProtected: "Operational continuity maintained",
    valueCreated: "Handover protocol improvement identified for next iteration",
    learning: "Automated briefing digests reduce post-handover service errors by 61%. Make mandatory for all AM/PM transitions.",
  },

  /* ── Operational ── */
  {
    id: "OR-008",
    category: "Operational",
    timestamp: "12:41",
    signal: "14 pending rooms · 6 VIP arrivals at 14:00 · Standard sequencing insufficient",
    moment: "Housekeeping Bottleneck",
    decision: "Housekeeping Priority Reset — VIP rooms to top of queue",
    action: "Queue reprioritised · Supervisor notified · Team reallocated",
    outcome: "All 6 VIP rooms ready by 13:48 · Zero VIP check-in delays",
    successLevel: "Exceptional",
    valueProtected: "£48,000+ VIP revenue relationship protected",
    valueCreated: "Housekeeping efficiency benchmark updated for future scheduling",
    learning: "Automated sequencing adjustments reduce VIP room delays by 94% vs manual scheduling. Integrate VIP arrival data into room priority algorithm by default.",
  },
  {
    id: "OR-009",
    category: "Operational",
    timestamp: "13:17",
    signal: "Non-critical HVAC fault · No guest impact · Peak arrival window approaching",
    moment: "Maintenance Escalation Risk",
    decision: "Maintenance Deferred — post-15:00 window",
    action: "Work order scheduled for 15:30 · Monitoring continued",
    outcome: "No guest-facing disruption · Fault resolved at 15:45",
    successLevel: "Adequate",
    valueProtected: "Guest experience continuity during peak window",
    valueCreated: "Deferral decision framework documented for similar cases",
    learning: "Deferral during peak windows acceptable for non-guest-facing systems. Review escalation thresholds — some faults deferred caused downstream issues.",
  },

  /* ── Commercial ── */
  {
    id: "OR-010",
    category: "Commercial",
    timestamp: "15:22",
    signal: "Standard room guest · Anniversary stay · Junior Suite available · Propensity 87",
    moment: "Suite Upgrade Window",
    decision: "Suite Upsell Offered — £85 supplement · Anniversary framing",
    action: "Personalised offer delivered at check-in · Accepted immediately",
    outcome: "Suite upgrade accepted · Guest spent additional £220 in F&B over stay",
    successLevel: "Exceptional",
    valueProtected: "£2,400 avg suite revenue protected",
    valueCreated: "£85 upsell + £220 F&B uplift · Review score 9.8/10",
    learning: "Anniversary-framed upsells convert at 54% vs 22% for generic offers. Occasion-based framing must be standard for all upsell triggers.",
  },
  {
    id: "OR-011",
    category: "Commercial",
    timestamp: "18:44",
    signal: "Guest in bar · No F&B spend logged · 3-night stay · High lifetime value",
    moment: "F&B Revenue Opportunity",
    decision: "Complimentary Amuse-Bouche Offered — 20-min window",
    action: "Staff prompted · Amuse-bouche delivered with personal recommendation",
    outcome: "Guest ordered full dinner for two — £178 cover",
    successLevel: "Exceptional",
    valueProtected: "£1,600 F&B revenue opportunity activated",
    valueCreated: "£178 incremental dinner cover · Guest noted exceptional attentiveness in review",
    learning: "Complimentary touch at consideration point increases F&B spend per head by avg £34. ROI consistently exceeds 8:1 on complimentary cost.",
  },
  {
    id: "OR-012",
    category: "Commercial",
    timestamp: "08:20",
    signal: "8 rooms with late checkout eligibility · Low demand forecast afternoon",
    moment: "Late Checkout Conversion",
    decision: "Late Checkout Offer Batch — proactive outreach to eligible guests",
    action: "Automated offer sent to 8 guests at 08:00 · £35 per room",
    outcome: "5 of 8 guests accepted · Revenue secured before standard checkout pressure",
    successLevel: "Strong",
    valueProtected: "£280 incremental revenue",
    valueCreated: "Guest satisfaction uplift · No room conflict on low-demand day",
    learning: "Proactive late checkout offers on low-demand days convert at 62%. Batch outreach at 08:00 outperforms reactive desk offers by 3×.",
  },

  /* ── Strategic ── */
  {
    id: "OR-013",
    category: "Strategic",
    timestamp: "08:00",
    signal: "Same housekeeping bottleneck pattern across 3 portfolio properties on Fridays",
    moment: "Cross-Property Learning Signal",
    decision: "Portfolio Pattern Flagged — COO briefing initiated",
    action: "COO briefed · Friday staffing model review scheduled across 3 properties",
    outcome: "Staffing model adjusted at 2 of 3 properties · Bottleneck frequency reduced 60%",
    successLevel: "Strong",
    valueProtected: "£14,400/month service continuity risk reduced",
    valueCreated: "Portfolio-wide operational improvement · Systemic playbook updated",
    learning: "Portfolio-level pattern recognition requires minimum 3 properties + 4 weeks of signal alignment before actioning. Governance threshold validated.",
  },
  {
    id: "OR-014",
    category: "Strategic",
    timestamp: "08:00",
    signal: "NPS decline 2.1 pts over 30 days · Competitor review uptick in same category",
    moment: "Portfolio Performance Deviation",
    decision: "Brand Experience Audit Initiated — BXOS signal review scheduled",
    action: "Audit team assembled · 3 priority areas identified · Response plan in draft",
    outcome: "Audit completed · Root cause identified in F&B service consistency · Remediation underway",
    successLevel: "Partial",
    valueProtected: "Market share risk flagged — intervention started before threshold breach",
    valueCreated: "Root cause intelligence captured · Playbook updated for F&B consistency",
    learning: "NPS declines of >2 pts over 30 days with competing signal uplift are leading indicators of market share risk. 45-day response window is critical.",
  },
  {
    id: "OR-015",
    category: "Strategic",
    timestamp: "09:30",
    signal: "Outcome pattern recognition — upsell conversion correlates with staff tenure >18 months",
    moment: "Outcome Pattern Recognition",
    decision: "Strategic Insight Surfaced — Talent Retention Link Identified",
    action: "Insight delivered to GM · Staff retention metric added to operational scorecard",
    outcome: "Retention strategy elevated to board agenda · Incentive programme initiated",
    successLevel: "Strong",
    valueProtected: "Revenue conversion quality protected through talent stability",
    valueCreated: "Strategic competitive advantage — insight not previously visible without WELBX",
    learning: "Upsell and recovery performance correlates strongly with staff tenure. Human capital investment is a direct commercial driver — quantify and report monthly.",
  },
];

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

/* ─── Executive metrics (derived from OUTCOMES) ─────── */
const SUCCESS_SCORE: Record<SuccessLevel, number> = {
  Exceptional: 100,
  Strong:       80,
  Adequate:     60,
  Partial:      40,
  Failed:        0,
};

const avgSuccessLevel = Math.round(
  OUTCOMES.reduce((sum, o) => sum + SUCCESS_SCORE[o.successLevel], 0) / OUTCOMES.length
);

const METRICS = [
  {
    label: "Total Outcomes",
    value: OUTCOMES.length,
    unit: "LOGGED TODAY",
    color: C.amber,
  },
  {
    label: "Total Value Protected",
    value: OUTCOMES.filter(o => o.valueProtected.length > 0).length,
    unit: "OUTCOMES WITH VALUE",
    color: C.violet,
  },
  {
    label: "Total Value Created",
    value: OUTCOMES.filter(o => o.valueCreated.length > 0).length,
    unit: "OUTCOMES WITH UPLIFT",
    color: C.green,
  },
  {
    label: "Exceptional Outcomes",
    value: OUTCOMES.filter(o => o.successLevel === "Exceptional").length,
    unit: "HIGHEST GRADE",
    color: C.teal,
  },
  {
    label: "Avg Success Level",
    value: avgSuccessLevel,
    unit: "PORTFOLIO SCORE",
    color: C.blue,
    suffix: "%",
  },
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

/* ─── Chain Step ──────────────────────────────────────── */
function ChainStep({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
        color, marginBottom: 4,
      }}>{label}</div>
      <div style={{ fontSize: 10.5, color: "hsl(215 16% 52%)", lineHeight: 1.45 }}>
        {value}
      </div>
    </div>
  );
}

/* ─── Arrow ───────────────────────────────────────────── */
function ChainArrow({ color }: { color: string }) {
  return (
    <div style={{
      flexShrink: 0, alignSelf: "center",
      fontSize: 10, color: `${color}55`,
      padding: "0 4px", marginTop: 12,
    }}>→</div>
  );
}

/* ─── Outcome Card ────────────────────────────────────── */
function OutcomeCard({ o, i }: { o: Outcome; i: number }) {
  const catColor = CAT_COLOR[o.category];
  const successColor = SUCCESS_COLOR[o.successLevel];

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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)", textTransform: "uppercase" }}>
              {o.id}
            </span>
            <span style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>
              {o.timestamp}
            </span>
            <Badge text={o.category} color={catColor} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 2 }}>
            {o.outcome}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 20 }}>
          <Badge text={o.successLevel} color={successColor} />
        </div>
      </div>

      {/* Execution chain */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        background: "hsl(220 13% 6%)",
        border: `1px solid ${C.border}`,
        padding: "12px 14px",
        marginBottom: 10,
      }}>
        <ChainStep label="Signal" value={o.signal} color={`${catColor}aa`} />
        <ChainArrow color={catColor} />
        <ChainStep label="Moment" value={o.moment} color={`${catColor}aa`} />
        <ChainArrow color={catColor} />
        <ChainStep label="Decision" value={o.decision} color={`${catColor}aa`} />
        <ChainArrow color={catColor} />
        <ChainStep label="Action" value={o.action} color={`${catColor}aa`} />
        <ChainArrow color={catColor} />
        <ChainStep label="Outcome" value={o.outcome} color={catColor} />
      </div>

      {/* Value grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        background: C.border,
        border: `1px solid ${C.border}`,
        marginBottom: 10,
      }}>
        {[
          { label: "Value Protected", value: o.valueProtected, color: C.violet },
          { label: "Value Created", value: o.valueCreated, color: C.green },
        ].map((item) => (
          <div key={item.label} style={{ background: "hsl(220 13% 6%)", padding: "11px 14px" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: item.color + "99", textTransform: "uppercase", marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 11.5, color: "hsl(215 16% 54%)", lineHeight: 1.5 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Learning captured */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "9px 12px",
        background: `${catColor}08`,
        border: `1px solid ${catColor}18`,
      }}>
        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase", flexShrink: 0, paddingTop: 1 }}>
          LEARNING
        </span>
        <span style={{ fontSize: 10.5, color: "hsl(215 16% 46%)", lineHeight: 1.6 }}>
          {o.learning}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function OutcomeRegistry() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered = activeCategory === "All"
    ? OUTCOMES
    : OUTCOMES.filter(o => o.category === activeCategory);

  const catCounts = ALL_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c] = OUTCOMES.filter(o => o.category === c).length;
    return acc;
  }, {});

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Outcome Intelligence
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Outcome Registry
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Outcomes Are The Ultimate Measure Of Execution.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {OUTCOMES.length} outcomes logged today
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              5 categories · Full chain tracked
            </div>
          </div>
        </motion.div>

        {/* ── Executive metrics strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
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
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7 }}>
                {((m as { prefix?: string }).prefix ?? "")}
                <CountUp target={m.value} />
                {m.suffix ?? ""}
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
            const count = cat === "All" ? OUTCOMES.length : catCounts[cat];
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
                  {cat === "All" ? "All Outcomes" : `${cat}`}
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

        {/* ── Outcome feed ── */}
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
              {filtered.map((o, i) => (
                <OutcomeCard key={o.id} o={o} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Legend ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 8, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}
        >
          {[
            { color: C.teal,  label: "Exceptional — exceeded expected outcome" },
            { color: C.green, label: "Strong — fully resolved, all targets met" },
            { color: C.amber, label: "Adequate — resolved, minor gaps remain" },
            { color: "#f97316", label: "Partial — outcome incomplete" },
            { color: C.red,   label: "Failed — outcome not achieved" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <div style={{ width: 24, height: 3, background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 8.5, color: C.dimmed }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Signal → Moment → Decision → Action → Outcome
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
              { name: "BXOS",   desc: "Signal detection · Moment classification · Outcome attribution" },
              { name: "NEXUS",  desc: "Decision routing · Owner accountability · Learning distribution" },
              { name: "VECTOR", desc: "Action execution · Value tracking · Registry intelligence" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 14%)", textTransform: "uppercase" }}>
            WELBX Outcome Registry · Full Chain Visibility
          </div>
        </motion.div>

      </div>
    </div>
  );
}
