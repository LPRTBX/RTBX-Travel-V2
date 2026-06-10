export type SignalStatus = "ACTIVE" | "MONITORING" | "EMERGING" | "ALERT";
export type SignalWeight = "Critical" | "High" | "Medium" | "Low";

export interface Signal {
  name: string;
  type: string;
  source: string;
  frequency: string;
  confidence: number;
  weighting: SignalWeight;
  moments: string[];
  status: SignalStatus;
}

export interface SignalCategory {
  id: string;
  label: string;
  count: number;
  signals: Signal[];
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
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
      { name: "Dining Intent Signal", type: "Propensity", source: "CRM / Behaviour Model", frequency: "Hourly", confidence: 76, weighting: "Medium", moments: ["F&B Activation Moment", "Upsell Window"], status: "EMERGING" },
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
      { name: "Activation Exposure Index", type: "Commercial", source: "RMS / Moment Value Model", frequency: "Real-time", confidence: 93, weighting: "Critical", moments: ["High-Value Moment", "Commercial Recovery"], status: "ACTIVE" },
      { name: "F&B Propensity Score", type: "Propensity", source: "CRM / Behaviour Model", frequency: "Hourly", confidence: 77, weighting: "High", moments: ["F&B Activation Moment", "Personalisation Window"], status: "ACTIVE" },
      { name: "Upsell Conversion Window", type: "Behavioural", source: "PMS / Front Office", frequency: "Per Interaction", confidence: 82, weighting: "High", moments: ["Upgrade Moment", "Activation Opportunity"], status: "EMERGING" },
      { name: "Cancellation Risk Score", type: "Predictive", source: "PMS / CRM", frequency: "Daily", confidence: 71, weighting: "High", moments: ["Retention Moment", "Loyalty Recovery"], status: "MONITORING" },
      { name: "Rate Sensitivity Signal", type: "Commercial", source: "RMS / Booking Patterns", frequency: "Hourly", confidence: 85, weighting: "Medium", moments: ["Pricing Moment", "Channel Shift Risk"], status: "ACTIVE" },
      { name: "Group Spend Velocity", type: "Commercial", source: "POS / PMS", frequency: "Daily", confidence: 88, weighting: "Medium", moments: ["Group Activation Moment", "Event Activation"], status: "MONITORING" },
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

export const SIGNAL_SUMMARY = {
  total: 247,
  new24h: 18,
  critical: 6,
  emerging: 23,
  confidenceAvg: 91,
};
