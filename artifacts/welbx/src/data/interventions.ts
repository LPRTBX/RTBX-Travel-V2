export type Category = "Guest" | "Workforce" | "Operational" | "Commercial" | "Strategic";

export type FreqLabel = "Low" | "Medium" | "High";

export interface Intervention {
  name: string;
  successRate: number;
  usageFrequency: FreqLabel;
  outcomeQuality: number;
}

export interface LibraryMoment {
  id: string;
  name: string;
  interventions: Intervention[];
  expectedOutcomes: string[];
}

export interface CategoryData {
  category: Category;
  moments: LibraryMoment[];
}

export const INTERVENTION_LIBRARY: CategoryData[] = [
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

export function getMomentById(id: string): LibraryMoment | undefined {
  for (const cat of INTERVENTION_LIBRARY) {
    const found = cat.moments.find((m) => m.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getCategoryForMoment(id: string): Category | undefined {
  for (const cat of INTERVENTION_LIBRARY) {
    if (cat.moments.some((m) => m.id === id)) return cat.category;
  }
  return undefined;
}
