export type Category = "Guest" | "Workforce" | "Operational" | "Commercial" | "Strategic";
export type OutcomeStatus = "Positive" | "Pending" | "Negative" | "Inconclusive";

export interface Decision {
  id: string;
  name: string;
  relatedMoment: string;
  category: Category;
  reasoning: string;
  confidence: number;
  owner: string;
  recommendedAction: string;
  outcome: OutcomeStatus;
  learning: string;
  timestamp: string;
  decisionType: "Automated" | "Human";
}

export const DECISIONS: Decision[] = [
  /* ── Guest ── */
  {
    id: "DR-001",
    name: "Upgrade Approved",
    relatedMoment: "VIP Arrival",
    category: "Guest",
    reasoning: "Loyalty Tier + Repeat Guest · 7th stay · Suite inventory available",
    confidence: 96,
    owner: "BXOS · Auto",
    recommendedAction: "Upgrade to Meridian Suite · Personalised welcome note",
    outcome: "Positive",
    learning: "Loyalty-tier upgrades on repeat stays produce 3× more positive reviews than first-time upgrades.",
    timestamp: "09:14",
    decisionType: "Automated",
  },
  {
    id: "DR-002",
    name: "Proactive Recovery Initiated",
    relatedMoment: "Service Recovery Window",
    category: "Guest",
    reasoning: "Housekeeping delay > 40 min detected · Guest sentiment signal declining · First-stay profile",
    confidence: 88,
    owner: "Duty Manager",
    recommendedAction: "Complimentary F&B credit · Duty Manager contact within 10 min",
    outcome: "Positive",
    learning: "Recovery initiated before complaint logged is 4× more effective at retaining satisfaction score.",
    timestamp: "11:32",
    decisionType: "Human",
  },
  {
    id: "DR-003",
    name: "Late Checkout Approved",
    relatedMoment: "Loyalty Activation Window",
    category: "Guest",
    reasoning: "Gold tier member · 3-night stay · No room demand conflict until 16:00",
    confidence: 91,
    owner: "BXOS · Auto",
    recommendedAction: "Grant 14:00 checkout · Log as loyalty service event",
    outcome: "Positive",
    learning: "Late checkout granted proactively converts 68% of departing guests into repeat intent within 90 days.",
    timestamp: "07:48",
    decisionType: "Automated",
  },

  /* ── Workforce ── */
  {
    id: "DR-004",
    name: "Cross-Department Redeployment",
    relatedMoment: "Staff Capacity Gap",
    category: "Workforce",
    reasoning: "Foyer queue depth > threshold · F&B team at 40% occupancy · 3-min deployment window",
    confidence: 84,
    owner: "Duty Manager",
    recommendedAction: "Redeploy 2× F&B staff to front desk assist · Duration 45 min",
    outcome: "Positive",
    learning: "Cross-department redeployment in under 5 minutes prevents queue abandonment in 81% of cases.",
    timestamp: "14:08",
    decisionType: "Human",
  },
  {
    id: "DR-005",
    name: "Welfare Check Escalated",
    relatedMoment: "Welfare Check Trigger",
    category: "Workforce",
    reasoning: "Staff member flagged declining engagement signals for 3 consecutive shifts",
    confidence: 72,
    owner: "HR Manager",
    recommendedAction: "1:1 check-in scheduled · Workload review initiated",
    outcome: "Pending",
    learning: "Early welfare intervention reduces unplanned absence by 44% when actioned within 48 hours.",
    timestamp: "10:55",
    decisionType: "Human",
  },

  /* ── Operational ── */
  {
    id: "DR-006",
    name: "Housekeeping Priority Reset",
    relatedMoment: "Housekeeping Bottleneck",
    category: "Operational",
    reasoning: "14 pending rooms · 6 VIP arrivals at 14:00 · Standard sequencing would delay 3 VIPs",
    confidence: 97,
    owner: "BXOS · Auto",
    recommendedAction: "Reprioritise VIP rooms to top of queue · Notify housekeeping supervisor",
    outcome: "Positive",
    learning: "Automated sequencing adjustments reduce VIP room delays by 94% vs manual scheduling.",
    timestamp: "12:41",
    decisionType: "Automated",
  },
  {
    id: "DR-007",
    name: "Maintenance Escalation Deferred",
    relatedMoment: "Maintenance Escalation Risk",
    category: "Operational",
    reasoning: "Non-critical HVAC fault detected · No guest impact · Peak arrival window in 2 hours",
    confidence: 79,
    owner: "Engineering Lead",
    recommendedAction: "Schedule maintenance post-15:00 · Monitor for escalation signals",
    outcome: "Inconclusive",
    learning: "Deferral during peak windows acceptable for non-guest-facing systems; review escalation thresholds.",
    timestamp: "13:17",
    decisionType: "Human",
  },

  /* ── Commercial ── */
  {
    id: "DR-008",
    name: "Suite Upsell Offered",
    relatedMoment: "Suite Upgrade Window",
    category: "Commercial",
    reasoning: "Standard room guest · Anniversary stay detected · Junior Suite available · Propensity score 87",
    confidence: 87,
    owner: "BXOS · Auto",
    recommendedAction: "Offer Junior Suite upgrade at £85 supplement · Personalised framing",
    outcome: "Positive",
    learning: "Anniversary-framed upsells convert at 54% vs 22% for generic offers at equivalent price points.",
    timestamp: "15:22",
    decisionType: "Automated",
  },
  {
    id: "DR-009",
    name: "F&B Incentive Triggered",
    relatedMoment: "F&B Revenue Opportunity",
    category: "Commercial",
    reasoning: "Guest in bar area · No F&B spend logged · 3-night stay · High lifetime value profile",
    confidence: 78,
    owner: "BXOS · Auto",
    recommendedAction: "Staff prompted to offer complimentary amuse-bouche · Incentive window: 20 min",
    outcome: "Positive",
    learning: "Complimentary touch at point of consideration increases F&B spend per head by an average of £34.",
    timestamp: "18:44",
    decisionType: "Automated",
  },

  /* ── Strategic ── */
  {
    id: "DR-010",
    name: "Cross-Property Pattern Flagged",
    relatedMoment: "Cross-Property Learning Signal",
    category: "Strategic",
    reasoning: "Same housekeeping bottleneck pattern observed across 3 portfolio properties on Fridays",
    confidence: 68,
    owner: "WELBX Platform",
    recommendedAction: "Surface to COO · Review Friday staffing model portfolio-wide",
    outcome: "Pending",
    learning: "Portfolio-level pattern recognition requires minimum 3 properties + 4 weeks of signal alignment before actioning.",
    timestamp: "08:00",
    decisionType: "Automated",
  },
  {
    id: "DR-011",
    name: "Competitive Displacement Risk Identified",
    relatedMoment: "Portfolio Performance Deviation",
    category: "Strategic",
    reasoning: "NPS decline of 2.1 pts over 30 days · Competitor review uptick in same category",
    confidence: 61,
    owner: "COO",
    recommendedAction: "Initiate brand experience audit · BXOS signal review scheduled",
    outcome: "Negative",
    learning: "NPS declines of > 2 pts over 30 days with competing signal uplift are leading indicators of market share risk.",
    timestamp: "08:00",
    decisionType: "Human",
  },
];
