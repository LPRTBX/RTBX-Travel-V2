import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  dim2:   "hsl(215 16% 32%)",
};

type Category = "Guest" | "Workforce" | "Operational" | "Commercial" | "Strategic";

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

type FreqLabel = "Low" | "Medium" | "High";

interface Intervention {
  name: string;
  successRate: number;
  usageFrequency: FreqLabel;
  outcomeQuality: number;
}

interface Moment {
  id: string;
  name: string;
  interventions: Intervention[];
  expectedOutcomes: string[];
}

interface CategoryData {
  category: Category;
  moments: Moment[];
}

const FREQ_COLOR: Record<FreqLabel, string> = {
  Low:    C.slate,
  Medium: C.amber,
  High:   C.green,
};

const LIBRARY: CategoryData[] = [
  {
    category: "Guest",
    moments: [
      {
        id: "GM-001",
        name: "Guest Distress Signal",
        expectedOutcomes: ["Safety", "Retention", "Recovery"],
        interventions: [
          { name: "Recovery Pathway A — Immediate Manager Escalation", successRate: 94, usageFrequency: "High", outcomeQuality: 9.2 },
          { name: "Recovery Pathway B — Duty Manager Personal Response", successRate: 88, usageFrequency: "Medium", outcomeQuality: 8.7 },
          { name: "Service Credit + Personal Follow-Up", successRate: 79, usageFrequency: "Medium", outcomeQuality: 7.9 },
          { name: "Room Reassignment with Complimentary Upgrade", successRate: 85, usageFrequency: "Low", outcomeQuality: 8.4 },
        ],
      },
      {
        id: "GM-002",
        name: "VIP Arrival Misalignment",
        expectedOutcomes: ["Loyalty Protection", "Loyalty Recovery", "Reputation"],
        interventions: [
          { name: "GM Personal Greeting — Immediate Reacquisition", successRate: 97, usageFrequency: "High", outcomeQuality: 9.6 },
          { name: "Suite Upgrade with Complimentary Amenity Set", successRate: 91, usageFrequency: "Medium", outcomeQuality: 9.1 },
          { name: "Dedicated Concierge Assignment for Remainder of Stay", successRate: 86, usageFrequency: "Medium", outcomeQuality: 8.5 },
        ],
      },
      {
        id: "GM-003",
        name: "First-Stay Anxiety Pattern",
        expectedOutcomes: ["Loyalty", "NPS Uplift", "Repeat Booking"],
        interventions: [
          { name: "Proactive Orientation — Concierge-Led Welcome", successRate: 82, usageFrequency: "High", outcomeQuality: 8.1 },
          { name: "Digital Welcome Pack with Personalised Itinerary", successRate: 74, usageFrequency: "High", outcomeQuality: 7.4 },
          { name: "Mid-Stay Check-In by Guest Relations", successRate: 78, usageFrequency: "Medium", outcomeQuality: 7.8 },
          { name: "Curated Recommendation — Tailored to Profile", successRate: 71, usageFrequency: "Medium", outcomeQuality: 7.2 },
        ],
      },
      {
        id: "GM-004",
        name: "Service Recovery Window",
        expectedOutcomes: ["Retention", "Review Protection", "Loyalty Recovery"],
        interventions: [
          { name: "Manager Apology + Tangible Service Credit", successRate: 89, usageFrequency: "High", outcomeQuality: 8.8 },
          { name: "Complimentary Dining or Spa Experience", successRate: 84, usageFrequency: "Medium", outcomeQuality: 8.3 },
          { name: "Personal Follow-Up Letter from GM", successRate: 76, usageFrequency: "Low", outcomeQuality: 7.6 },
        ],
      },
      {
        id: "GM-005",
        name: "Loyalty Activation Window",
        expectedOutcomes: ["Value Uplift", "Loyalty", "Engagement"],
        interventions: [
          { name: "Exclusive Tier Offer — Limited Time", successRate: 76, usageFrequency: "Medium", outcomeQuality: 7.5 },
          { name: "Points Multiplier Event Notification", successRate: 68, usageFrequency: "High", outcomeQuality: 6.9 },
          { name: "Anniversary Recognition + Personalised Reward", successRate: 81, usageFrequency: "Low", outcomeQuality: 8.0 },
        ],
      },
    ],
  },
  {
    category: "Workforce",
    moments: [
      {
        id: "WF-001",
        name: "Staff Capacity Gap",
        expectedOutcomes: ["Service Continuity", "Quality Preservation", "Risk Mitigation"],
        interventions: [
          { name: "Cross-Department Redeployment Protocol", successRate: 88, usageFrequency: "High", outcomeQuality: 8.6 },
          { name: "On-Call Activation — Agreed Standby Roster", successRate: 82, usageFrequency: "Medium", outcomeQuality: 8.1 },
          { name: "Service Scope Reduction — Managed Downscale", successRate: 71, usageFrequency: "Medium", outcomeQuality: 7.0 },
          { name: "Agency Escalation — Pre-approved Supplier", successRate: 66, usageFrequency: "Low", outcomeQuality: 6.5 },
        ],
      },
      {
        id: "WF-002",
        name: "Shift Handover Risk",
        expectedOutcomes: ["Operational Continuity", "Quality Transfer", "Accountability"],
        interventions: [
          { name: "Structured Handover Briefing — BXOS Template", successRate: 91, usageFrequency: "High", outcomeQuality: 9.0 },
          { name: "Dual-Sign-Off Protocol for Active Moments", successRate: 85, usageFrequency: "Medium", outcomeQuality: 8.4 },
          { name: "Live Dashboard Walkthrough at Shift Change", successRate: 78, usageFrequency: "Medium", outcomeQuality: 7.7 },
        ],
      },
      {
        id: "WF-003",
        name: "Welfare Check Trigger",
        expectedOutcomes: ["Staff Wellbeing", "HR Compliance", "Retention"],
        interventions: [
          { name: "Manager 1:1 — Immediate Welfare Conversation", successRate: 91, usageFrequency: "High", outcomeQuality: 9.0 },
          { name: "HR Referral — EAP Programme Activation", successRate: 86, usageFrequency: "Medium", outcomeQuality: 8.5 },
          { name: "Schedule Adjustment — Temporary Workload Relief", successRate: 79, usageFrequency: "Medium", outcomeQuality: 7.8 },
          { name: "Confidential Peer Support Channel", successRate: 73, usageFrequency: "Low", outcomeQuality: 7.2 },
        ],
      },
      {
        id: "WF-004",
        name: "Team Performance Deviation",
        expectedOutcomes: ["Quality Recovery", "Capability Building", "Standards"],
        interventions: [
          { name: "Targeted Coaching Session — Identified Gap", successRate: 77, usageFrequency: "Medium", outcomeQuality: 7.6 },
          { name: "Refresher Training Module — Department-Specific", successRate: 71, usageFrequency: "Medium", outcomeQuality: 7.0 },
          { name: "Peer Shadowing Programme", successRate: 68, usageFrequency: "Low", outcomeQuality: 6.7 },
        ],
      },
    ],
  },
  {
    category: "Operational",
    moments: [
      {
        id: "OP-001",
        name: "Foyer Congestion Threshold",
        expectedOutcomes: ["Guest Flow", "Experience Protection", "Activation"],
        interventions: [
          { name: "Mobile Check-In Activation — Queue Diversion", successRate: 94, usageFrequency: "High", outcomeQuality: 9.3 },
          { name: "Express Lane Deployment — Dedicated Agent", successRate: 87, usageFrequency: "High", outcomeQuality: 8.6 },
          { name: "Lounge Holding Offer — Complimentary Refreshment", successRate: 81, usageFrequency: "Medium", outcomeQuality: 8.0 },
          { name: "Staggered Check-Out Incentive — Late Checkout Offer", successRate: 74, usageFrequency: "Medium", outcomeQuality: 7.3 },
        ],
      },
      {
        id: "OP-002",
        name: "Housekeeping Bottleneck",
        expectedOutcomes: ["Room Activation", "Occupancy Optimisation", "Guest Satisfaction"],
        interventions: [
          { name: "Priority Room Release — Value-Ranked Queue", successRate: 88, usageFrequency: "High", outcomeQuality: 8.7 },
          { name: "Cross-Team Deployment — F&B to HK Support", successRate: 76, usageFrequency: "Medium", outcomeQuality: 7.5 },
          { name: "Guest Communication — Proactive Delay Notice", successRate: 83, usageFrequency: "High", outcomeQuality: 8.2 },
        ],
      },
      {
        id: "OP-003",
        name: "Maintenance Escalation Risk",
        expectedOutcomes: ["Asset Protection", "Disruption Prevention", "Guest Safety"],
        interventions: [
          { name: "Preventive Work Order — Immediate Scheduling", successRate: 82, usageFrequency: "Medium", outcomeQuality: 8.1 },
          { name: "Room Block Protocol — Proactive Quarantine", successRate: 91, usageFrequency: "Low", outcomeQuality: 9.0 },
          { name: "Supplier Emergency Call-Out — Pre-Approved", successRate: 74, usageFrequency: "Low", outcomeQuality: 7.3 },
        ],
      },
      {
        id: "OP-004",
        name: "Supply Threshold Alert",
        expectedOutcomes: ["Service Continuity", "F&B Quality", "Value Protection"],
        interventions: [
          { name: "Emergency Re-Order — Priority Supplier", successRate: 86, usageFrequency: "Medium", outcomeQuality: 8.5 },
          { name: "Menu Adaptation — Availability-Led Substitution", successRate: 78, usageFrequency: "High", outcomeQuality: 7.7 },
          { name: "Cross-Property Transfer Request", successRate: 69, usageFrequency: "Low", outcomeQuality: 6.8 },
        ],
      },
    ],
  },
  {
    category: "Commercial",
    moments: [
      {
        id: "CM-001",
        name: "Suite Upgrade Window",
        expectedOutcomes: ["Value Uplift", "Loyalty", "Satisfaction"],
        interventions: [
          { name: "Pre-Arrival Upgrade Offer — Personalised Pricing", successRate: 79, usageFrequency: "High", outcomeQuality: 7.8 },
          { name: "Check-In Upgrade Conversation — Trained Upsell", successRate: 83, usageFrequency: "High", outcomeQuality: 8.2 },
          { name: "Complimentary Upgrade — Loyalty Recognition", successRate: 91, usageFrequency: "Medium", outcomeQuality: 9.0 },
          { name: "Suite Experience Preview — Concierge-Led", successRate: 71, usageFrequency: "Low", outcomeQuality: 7.0 },
        ],
      },
      {
        id: "CM-002",
        name: "F&B Activation Opportunity",
        expectedOutcomes: ["Activation", "Guest Experience", "Engagement"],
        interventions: [
          { name: "In-Room Dining Push — Behaviour-Triggered", successRate: 72, usageFrequency: "High", outcomeQuality: 7.1 },
          { name: "Restaurant Reservation Prompt — Preferred Time", successRate: 68, usageFrequency: "High", outcomeQuality: 6.7 },
          { name: "Chef's Table or Experience Offer — Premium", successRate: 84, usageFrequency: "Low", outcomeQuality: 8.3 },
          { name: "Bar Evening Event Invitation — Curated", successRate: 76, usageFrequency: "Medium", outcomeQuality: 7.5 },
        ],
      },
      {
        id: "CM-003",
        name: "Repeat Guest Recognition",
        expectedOutcomes: ["Loyalty Protection", "Activation", "Lifetime Value"],
        interventions: [
          { name: "Named Recognition at Arrival — GM or Concierge", successRate: 93, usageFrequency: "High", outcomeQuality: 9.2 },
          { name: "Preferences Pre-loaded — Room + Service Config", successRate: 89, usageFrequency: "High", outcomeQuality: 8.8 },
          { name: "Anniversary or Milestone Celebration Gesture", successRate: 86, usageFrequency: "Medium", outcomeQuality: 8.5 },
          { name: "Loyalty Tier Advancement Notification", successRate: 79, usageFrequency: "Medium", outcomeQuality: 7.8 },
        ],
      },
      {
        id: "CM-004",
        name: "Late Checkout Conversion",
        expectedOutcomes: ["Activation", "Occupancy", "Guest Satisfaction"],
        interventions: [
          { name: "Late Checkout Offer — Dynamic Pricing Window", successRate: 91, usageFrequency: "High", outcomeQuality: 9.0 },
          { name: "Complimentary Extension — Loyalty Reward", successRate: 84, usageFrequency: "Medium", outcomeQuality: 8.3 },
          { name: "Luggage Hold + Lounge Access Alternative", successRate: 77, usageFrequency: "Medium", outcomeQuality: 7.6 },
        ],
      },
    ],
  },
  {
    category: "Strategic",
    moments: [
      {
        id: "ST-001",
        name: "Portfolio Performance Deviation",
        expectedOutcomes: ["Governance", "Corrective Action", "Investment Alignment"],
        interventions: [
          { name: "COO Diagnostic Review — Root Cause Framework", successRate: 78, usageFrequency: "Medium", outcomeQuality: 7.7 },
          { name: "Property Performance Intervention Plan", successRate: 71, usageFrequency: "Low", outcomeQuality: 7.0 },
          { name: "WELBX Benchmarking Report — Peer Comparison", successRate: 82, usageFrequency: "Medium", outcomeQuality: 8.1 },
          { name: "Investment Governance Escalation Protocol", successRate: 65, usageFrequency: "Low", outcomeQuality: 6.4 },
        ],
      },
      {
        id: "ST-002",
        name: "Cross-Property Learning Signal",
        expectedOutcomes: ["Systemic Improvement", "Knowledge Transfer", "Competitive Advantage"],
        interventions: [
          { name: "Best Practice Codification — WELBX Playbook Update", successRate: 74, usageFrequency: "Medium", outcomeQuality: 7.3 },
          { name: "Cross-Property Workshop — GM Peer Exchange", successRate: 69, usageFrequency: "Low", outcomeQuality: 6.8 },
          { name: "BXOS Model Calibration — Signal Weighting Update", successRate: 83, usageFrequency: "Medium", outcomeQuality: 8.2 },
        ],
      },
      {
        id: "ST-003",
        name: "Outcome Pattern Recognition",
        expectedOutcomes: ["Competitive Advantage", "Model Refinement", "Strategic Intelligence"],
        interventions: [
          { name: "Executive Insight Brief — Pattern Summary", successRate: 86, usageFrequency: "High", outcomeQuality: 8.5 },
          { name: "Playbook Refinement — Outcome-Led Update Cycle", successRate: 79, usageFrequency: "Medium", outcomeQuality: 7.8 },
          { name: "Strategic Decision Record — Board Visibility", successRate: 72, usageFrequency: "Low", outcomeQuality: 7.1 },
          { name: "Competitive Intelligence Flag — Market Signal", successRate: 68, usageFrequency: "Low", outcomeQuality: 6.7 },
        ],
      },
    ],
  },
];

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

function OutcomeTag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: C.amber, border: `1px solid ${C.amber}33`, padding: "2px 8px",
      background: `${C.amber}0d`, flexShrink: 0,
    }}>{label}</span>
  );
}

function MetricPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 14px",
      background: "hsl(220 13% 6%)",
      border: `1px solid hsl(220 13% 11%)`,
      minWidth: 80,
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: "-0.01em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 5, textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}

function InterventionRow({ intervention, index }: { intervention: Intervention; index: number }) {
  const freqColor = FREQ_COLOR[intervention.usageFrequency];
  const qualColor = intervention.outcomeQuality >= 8.5 ? C.green
    : intervention.outcomeQuality >= 7.0 ? C.amber
    : C.slate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "12px 20px",
        borderBottom: "1px solid hsl(220 13% 8%)",
        background: index % 2 === 0 ? "hsl(220 13% 5%)" : "hsl(220 13% 6%)",
      }}
    >
      <div style={{
        fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed,
        minWidth: 18, flexShrink: 0,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
        {intervention.name}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <MetricPill label="Success Rate" value={`${intervention.successRate}%`} color={intervention.successRate >= 85 ? C.green : intervention.successRate >= 72 ? C.amber : C.slate} />
        <MetricPill label="Usage Freq" value={intervention.usageFrequency} color={freqColor} />
        <MetricPill label="Outcome Quality" value={intervention.outcomeQuality.toFixed(1)} color={qualColor} />
      </div>
    </motion.div>
  );
}

function MomentAccordion({ moment, catColor, globalIndex }: { moment: Moment; catColor: string; globalIndex: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.05, duration: 0.3 }}
      style={{
        border: `1px solid hsl(220 13% 9%)`,
        borderLeft: `2px solid ${catColor}`,
        marginBottom: 2,
        overflow: "hidden",
      }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 14px 18px",
          background: open ? "hsl(220 13% 8%)" : "hsl(220 13% 7%)",
          border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, minWidth: 44, textTransform: "uppercase", fontFamily: "var(--app-font-mono)" }}>
            {moment.id}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            {moment.name}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {moment.expectedOutcomes.map((o) => (
              <OutcomeTag key={o} label={o} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dim2, textTransform: "uppercase" }}>
            {moment.interventions.length} interventions
          </span>
          <div style={{
            width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid hsl(220 13% 12%)`,
            background: "hsl(220 13% 9%)",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 2.5L4 5.5L7 2.5" stroke={C.amber} strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Accordion body */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: `1px solid hsl(220 13% 9%)` }}>
              {/* Column headers */}
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "7px 20px 7px 18px",
                background: "hsl(220 13% 6%)",
                borderBottom: "1px solid hsl(220 13% 9%)",
              }}>
                <div style={{ minWidth: 18 }} />
                <div style={{ flex: 1, fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>
                  Intervention Option
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {["Success Rate", "Usage Frequency", "Outcome Quality"].map((h) => (
                    <div key={h} style={{ minWidth: 80, fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", textAlign: "center" }}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              {moment.interventions.map((iv, i) => (
                <InterventionRow key={iv.name} intervention={iv} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InterventionLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category>("Guest");
  const catData = LIBRARY.find((d) => d.category === activeCategory)!;
  const catColor = CAT_COLOR[activeCategory];

  let globalIndex = 0;

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Operating Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Intervention Library
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Behavioural response catalogue — what to do, how to do it, and why it works
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {LIBRARY.reduce((a, d) => a + d.moments.reduce((b, m) => b + m.interventions.length, 0), 0)} interventions
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              {LIBRARY.reduce((a, d) => a + d.moments.length, 0)} moments · 5 domains
            </div>
          </div>
        </motion.div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {LIBRARY.map((d) => {
            const cc = CAT_COLOR[d.category];
            const totalIvs = d.moments.reduce((a, m) => a + m.interventions.length, 0);
            const avgSuccess = Math.round(
              d.moments.flatMap((m) => m.interventions).reduce((a, iv) => a + iv.successRate, 0) / totalIvs
            );
            return (
              <div
                key={d.category}
                onClick={() => setActiveCategory(d.category)}
                style={{
                  padding: "16px 20px",
                  background: activeCategory === d.category ? "hsl(220 13% 9%)" : C.card,
                  borderTop: `2px solid ${cc}`,
                  border: `1px solid ${activeCategory === d.category ? cc + "44" : C.border}`,
                  borderTopColor: cc,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 5 }}>
                  {avgSuccess}%
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 3 }}>
                  {d.category}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: cc, textTransform: "uppercase" }}>
                  Avg success · {d.moments.length} moments
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}
          style={{ display: "flex", gap: 1, marginBottom: 0 }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color = CAT_COLOR[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
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
                  {LIBRARY.find((d) => d.category === cat)!.moments.length}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Accordion list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              border: `1px solid hsl(220 13% 9%)`,
              borderTop: `2px solid ${catColor}`,
              background: "hsl(220 13% 7%)",
              padding: "16px 16px",
            }}
          >
            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              paddingBottom: 12, borderBottom: `1px solid hsl(220 13% 9%)`,
            }}>
              <div style={{ width: 3, height: 18, background: catColor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase" }}>
                  {activeCategory} Domain
                </div>
                <div style={{ fontSize: 8.5, color: C.dim2, marginTop: 2 }}>
                  {catData.moments.length} moment categories · Expand to view intervention options
                </div>
              </div>
            </div>

            {catData.moments.map((moment) => {
              const idx = globalIndex++;
              return (
                <MomentAccordion
                  key={moment.id}
                  moment={moment}
                  catColor={catColor}
                  globalIndex={idx}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend / key */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 20, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}
        >
          {[
            { color: C.green, label: "Success Rate ≥ 85% · High confidence" },
            { color: C.amber, label: "Success Rate 72–84% · Strong confidence" },
            { color: C.slate, label: "Success Rate < 72% · Situational" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 20, height: 3, background: color }} />
              <span style={{ fontSize: 8.5, color: C.dimmed }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Outcome Quality scored 0–10 · Usage Frequency: observed operational pattern
          </div>
        </motion.div>

        {/* Engine footer */}
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
              { name: "BXOS", desc: "Moment classification · Intervention scoring · Outcome attribution" },
              { name: "NEXUS", desc: "Response routing · Escalation governance · Owner assignment" },
              { name: "VECTOR", desc: "Execution tracking · Success measurement · Library learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 14%)", textTransform: "uppercase" }}>
            Response Catalogue · v1.0
          </div>
        </motion.div>

      </div>
    </div>
  );
}
