import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#c9a84c";

const SUMMARY = [
  { label: "Total Signals", value: "247", delta: "+12 this week", color: "#fff" },
  { label: "New Signals", value: "18", delta: "Last 24 hours", color: ACCENT },
  { label: "Critical Signals", value: "6", delta: "Require attention", color: "#ef4444" },
  { label: "Emerging Signals", value: "23", delta: "Pattern forming", color: "#f59e0b" },
  { label: "Signal Confidence", value: "91%", delta: "Avg across registry", color: "#10b981" },
];

type Status = "ACTIVE" | "MONITORING" | "EMERGING" | "ALERT";
type Weight = "Critical" | "High" | "Medium" | "Low";

interface Signal {
  name: string;
  type: string;
  source: string;
  frequency: string;
  confidence: number;
  weighting: Weight;
  moments: string[];
  status: Status;
}

interface Category {
  id: string;
  label: string;
  count: number;
  signals: Signal[];
}

const CATEGORIES: Category[] = [
  {
    id: "guest",
    label: "Guest Signals",
    count: 52,
    signals: [
      { name: "Arrival Sentiment", type: "Behavioural", source: "Staff Input / App", frequency: "Real-time", confidence: 88, weighting: "High", moments: ["First Impression Risk", "Recovery Window"], status: "ACTIVE" },
      { name: "Wait Anxiety", type: "Physiological-Proxy", source: "Sensor / Queue Depth", frequency: "Real-time", confidence: 94, weighting: "Critical", moments: ["Queue Pressure Building", "Service Delay Alert"], status: "ALERT" },
      { name: "Departure Mood", type: "Behavioural", source: "Guest App / Checkout", frequency: "Per Event", confidence: 79, weighting: "High", moments: ["Review Risk", "Loyalty Decision"], status: "ACTIVE" },
      { name: "Loyalty Recognition Gap", type: "Contextual", source: "CRM / PMS", frequency: "Per Arrival", confidence: 97, weighting: "Critical", moments: ["VIP Acknowledgement", "Tier Downgrade Risk"], status: "ACTIVE" },
      { name: "Service Request Pattern", type: "Behavioural", source: "Guest App", frequency: "Continuous", confidence: 83, weighting: "Medium", moments: ["Unmet Expectation", "Personalisation Opportunity"], status: "MONITORING" },
      { name: "Dining Intent Signal", type: "Propensity", source: "CRM / Behaviour Model", frequency: "Hourly", confidence: 76, weighting: "Medium", moments: ["F&B Revenue Moment", "Upsell Window"], status: "EMERGING" },
    ],
  },
  {
    id: "workforce",
    label: "Workforce Signals",
    count: 44,
    signals: [
      { name: "Staff Capacity Ratio", type: "Operational", source: "Task Management", frequency: "Real-time", confidence: 98, weighting: "Critical", moments: ["Resource Constraint", "Reallocation Required"], status: "ACTIVE" },
      { name: "Handover Quality Index", type: "Behavioural", source: "Shift Logs / Staff Input", frequency: "Per Shift", confidence: 72, weighting: "High", moments: ["Knowledge Transfer Gap", "Service Continuity Risk"], status: "MONITORING" },
      { name: "Engagement Velocity", type: "Behavioural", source: "Staff App / Response Times", frequency: "Hourly", confidence: 81, weighting: "Medium", moments: ["Disengagement Risk", "Performance Moment"], status: "ACTIVE" },
      { name: "Response Latency", type: "Operational", source: "Task Management / Comms", frequency: "Real-time", confidence: 95, weighting: "Critical", moments: ["Service Failure Risk", "Complaint Lag"], status: "ACTIVE" },
      { name: "Burnout Indicator", type: "Wellbeing-Proxy", source: "Scheduling / Sentiment", frequency: "Daily", confidence: 67, weighting: "High", moments: ["Staff Attrition Risk", "Care Deficit Moment"], status: "EMERGING" },
      { name: "Skill Deployment Match", type: "Operational", source: "HR / Task Management", frequency: "Per Shift", confidence: 84, weighting: "Medium", moments: ["Capability Gap", "Training Trigger"], status: "MONITORING" },
    ],
  },
  {
    id: "operational",
    label: "Operational Signals",
    count: 61,
    signals: [
      { name: "Room Readiness Pipeline", type: "Operational", source: "Housekeeping Software", frequency: "Real-time", confidence: 99, weighting: "Critical", moments: ["Arrival Delay Risk", "Room Readiness Alert"], status: "ACTIVE" },
      { name: "Queue Depth", type: "Environmental", source: "Sensor Array", frequency: "Real-time", confidence: 96, weighting: "Critical", moments: ["Queue Pressure Building", "Service Delay"], status: "ALERT" },
      { name: "System Latency", type: "Technical", source: "Infrastructure Monitor", frequency: "Continuous", confidence: 99, weighting: "High", moments: ["Technology Failure Risk", "Staff Friction Point"], status: "ACTIVE" },
      { name: "Inventory Threshold", type: "Operational", source: "F&B / Procurement", frequency: "Hourly", confidence: 91, weighting: "Medium", moments: ["Supply Shortfall", "Menu Constraint Moment"], status: "MONITORING" },
      { name: "Compliance Flag", type: "Regulatory", source: "Audit / Systems", frequency: "Daily", confidence: 87, weighting: "High", moments: ["Regulatory Exposure", "Incident Report Required"], status: "MONITORING" },
      { name: "Energy Anomaly", type: "Environmental", source: "BMS / IoT", frequency: "Hourly", confidence: 78, weighting: "Low", moments: ["Environmental Alert", "Sustainability Flag"], status: "EMERGING" },
    ],
  },
  {
    id: "commercial",
    label: "Commercial Signals",
    count: 48,
    signals: [
      { name: "Revenue Exposure Index", type: "Commercial", source: "RMS / Moment Value Model", frequency: "Real-time", confidence: 93, weighting: "Critical", moments: ["High-Value Moment", "Commercial Recovery"], status: "ACTIVE" },
      { name: "F&B Propensity Score", type: "Propensity", source: "CRM / Behaviour Model", frequency: "Hourly", confidence: 77, weighting: "High", moments: ["F&B Revenue Moment", "Personalisation Window"], status: "ACTIVE" },
      { name: "Upsell Conversion Window", type: "Behavioural", source: "PMS / Front Office", frequency: "Per Interaction", confidence: 82, weighting: "High", moments: ["Upgrade Moment", "Revenue Opportunity"], status: "EMERGING" },
      { name: "Cancellation Risk Score", type: "Predictive", source: "PMS / CRM", frequency: "Daily", confidence: 71, weighting: "High", moments: ["Retention Moment", "Loyalty Recovery"], status: "MONITORING" },
      { name: "Rate Sensitivity Signal", type: "Commercial", source: "RMS / Booking Patterns", frequency: "Hourly", confidence: 85, weighting: "Medium", moments: ["Pricing Moment", "Channel Shift Risk"], status: "ACTIVE" },
      { name: "Group Spend Velocity", type: "Commercial", source: "POS / PMS", frequency: "Daily", confidence: 88, weighting: "Medium", moments: ["Group Revenue Moment", "Event Activation"], status: "MONITORING" },
    ],
  },
  {
    id: "strategic",
    label: "Strategic Signals",
    count: 42,
    signals: [
      { name: "Portfolio Performance Delta", type: "Strategic", source: "BI / RMS", frequency: "Daily", confidence: 92, weighting: "Critical", moments: ["Executive Escalation", "Intervention Required"], status: "ACTIVE" },
      { name: "Brand Sentiment Drift", type: "Reputational", source: "Review Platforms / NLP", frequency: "Hourly", confidence: 74, weighting: "High", moments: ["Reputation Risk", "Brand Recovery Moment"], status: "MONITORING" },
      { name: "Competitive Rate Position", type: "Market", source: "Rate Intelligence", frequency: "Daily", confidence: 89, weighting: "High", moments: ["Market Disadvantage", "Yield Opportunity"], status: "ACTIVE" },
      { name: "Guest Lifetime Value Shift", type: "Predictive", source: "CRM / Analytics", frequency: "Weekly", confidence: 81, weighting: "Critical", moments: ["Loyalty Cliff Moment", "VIP Re-engagement"], status: "EMERGING" },
      { name: "Regulatory Risk Exposure", type: "Compliance", source: "Legal / Audit", frequency: "Daily", confidence: 95, weighting: "High", moments: ["Compliance Alert", "Liability Moment"], status: "MONITORING" },
      { name: "Market Demand Signal", type: "Market", source: "STR / External Data", frequency: "Daily", confidence: 86, weighting: "Medium", moments: ["Demand Surge Moment", "Yield Adjustment"], status: "ACTIVE" },
    ],
  },
];

const STATUS_COLOR: Record<Status, string> = {
  ACTIVE: "#10b981",
  MONITORING: ACCENT,
  EMERGING: "#f59e0b",
  ALERT: "#ef4444",
};

const WEIGHT_COLOR: Record<Weight, string> = {
  Critical: "#ef4444",
  High: ACCENT,
  Medium: "hsl(215 16% 46%)",
  Low: "hsl(215 16% 30%)",
};

export default function SignalRegistry() {
  const [activeCategory, setActiveCategory] = useState("guest");

  const active = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Sensing Layer
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 10 }}>
            Signal Registry
          </h1>
          <p style={{ fontSize: 12, color: "hsl(215 16% 44%)", lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
            Every behavioural, operational, and commercial signal catalogued, weighted, and mapped to the moments they activate. The sensing layer of every WELBX deployment.
          </p>
        </motion.header>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 36 }}>
          {SUMMARY.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.06, duration: 0.38 }}
              style={{
                padding: "18px 20px 20px",
                background: "hsl(220 13% 6%)",
                border: "1px solid hsl(220 13% 10%)",
                borderTop: `2px solid ${s.color === "#fff" ? "hsl(220 13% 16%)" : s.color}`,
                display: "flex", flexDirection: "column", gap: 6,
              }}
            >
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9.5, color: "hsl(215 16% 36%)", letterSpacing: "0.02em" }}>
                {s.delta}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: "flex", gap: 1, marginBottom: 1 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: isActive ? "hsl(220 13% 8%)" : "hsl(220 13% 5%)",
                  border: "1px solid hsl(220 13% 10%)",
                  borderBottom: isActive ? "1px solid hsl(220 13% 8%)" : "1px solid hsl(220 13% 10%)",
                  borderTop: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                  color: isActive ? "#fff" : "hsl(215 16% 38%)",
                  textTransform: "uppercase", marginBottom: 3,
                }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 9, color: isActive ? ACCENT : "hsl(215 16% 28%)", fontWeight: 600 }}>
                  {cat.count} signals
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Signal table */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}
          style={{ background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 10%)" }}
        >
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 0.9fr 1fr 0.8fr 0.7fr 0.7fr 1.4fr 0.8fr",
            padding: "10px 20px",
            borderBottom: "1px solid hsl(220 13% 10%)",
            gap: 12,
          }}>
            {["Signal Name", "Type", "Source", "Frequency", "Confidence", "Weighting", "Related Moments", "Status"].map((h) => (
              <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {active.signals.map((sig, i) => (
            <motion.div
              key={sig.name}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 0.9fr 1fr 0.8fr 0.7fr 0.7fr 1.4fr 0.8fr",
                padding: "16px 20px",
                borderBottom: i < active.signals.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                gap: 12,
                alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 7%)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Signal Name */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                {sig.name}
              </div>

              {/* Type */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 46%)" }}>
                {sig.type}
              </div>

              {/* Source */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 38%)" }}>
                {sig.source}
              </div>

              {/* Frequency */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 42%)" }}>
                {sig.frequency}
              </div>

              {/* Confidence bar */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {sig.confidence}%
                </div>
                <div style={{ height: 2, background: "hsl(220 13% 12%)", width: "100%" }}>
                  <div style={{
                    height: "100%",
                    width: `${sig.confidence}%`,
                    background: sig.confidence >= 90 ? "#10b981" : sig.confidence >= 75 ? ACCENT : "#f59e0b",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>

              {/* Weighting */}
              <div style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
                color: WEIGHT_COLOR[sig.weighting], textTransform: "uppercase",
              }}>
                {sig.weighting}
              </div>

              {/* Moments */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {sig.moments.map((m) => (
                  <div key={m} style={{
                    fontSize: 9, color: "hsl(215 16% 42%)",
                    background: "hsl(220 13% 9%)",
                    padding: "2px 6px", lineHeight: 1.4,
                  }}>
                    {m}
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[sig.status], flexShrink: 0 }} />
                <span style={{
                  fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
                  color: STATUS_COLOR[sig.status], textTransform: "uppercase",
                }}>
                  {sig.status}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <div style={{ marginTop: 20, fontSize: 10, color: "hsl(215 16% 24%)", letterSpacing: "0.04em", lineHeight: 1.7 }}>
          Showing {active.signals.length} of {active.count} signals in {active.label}. Signals are continuously updated based on live data streams.
        </div>

      </div>
    </div>
  );
}
