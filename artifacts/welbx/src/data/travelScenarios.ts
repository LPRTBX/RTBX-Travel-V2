/**
 * RTBX Travel Live Scenarios.
 *
 * Synthetic demo data only — no live customer or personal data.
 * Each scenario walks the same governed chain used throughout RTBX Travel:
 * existing system/input → signal → moment → governance → playbook → role →
 * communication → action → evidence → outcome → value → learning.
 */

export type TravelScenarioRole =
  | "Front Desk" | "Duty Manager" | "Housekeeping" | "Guest"
  | "Security / Specialist Support" | "Operator" | "Concierge" | "Partner" | "Revenue & Loyalty Lead";

export interface ScenarioComm {
  id: string;
  label: string;
  channel: string;
  toRole: TravelScenarioRole;
  requiresApproval: boolean;
}

export interface TravelScenario {
  id: string;
  num: string;
  title: string;
  category: string;
  existingSystem: string;
  signals: string[];
  moment: string;
  momentClassification: string; // AI-assisted classification line
  governance: string[];
  playbook: string;
  roles: TravelScenarioRole[];
  aiBoundary?: string;
  comms: ScenarioComm[];
  requiresEscalation: boolean;
  escalationNote: string;
  actionLabel: string;
  actionDetail: string;
  evidence: string[];
  outcome: string[];
  value: string[];
  learning: string;
}

export const TRAVEL_SCENARIOS: TravelScenario[] = [
  {
    id: "repeat-guest-room-not-ready",
    num: "01",
    title: "Repeat Guest — Room Not Ready",
    category: "Loyalty Protection & Service Recovery",
    existingSystem: "PMS + Housekeeping App + Guest App",
    signals: ["Early arrival", "Room delay", "Repeat guest", "Negative sentiment"],
    moment: "Loyalty Protection and Service Recovery Moment",
    momentClassification: "AI classification: 92% confidence — Repeat Guest Room Delay pattern",
    governance: ["Room Readiness SOP", "Guest Recovery Policy", "Compensation Approval Matrix"],
    playbook: "Repeat Guest Room Delay Recovery",
    roles: ["Front Desk", "Duty Manager", "Housekeeping", "Guest"],
    comms: [
      { id: "c1", label: "Guest acknowledgement", channel: "Guest app", toRole: "Guest", requiresApproval: false },
      { id: "c2", label: "Housekeeping priority prompt", channel: "Housekeeping app", toRole: "Housekeeping", requiresApproval: false },
      { id: "c3", label: "Manager escalation", channel: "In-app alert", toRole: "Duty Manager", requiresApproval: false },
      { id: "c4", label: "Follow-up message", channel: "Guest app", toRole: "Guest", requiresApproval: true },
    ],
    requiresEscalation: false,
    escalationNote: "Escalates to Duty Manager only if room is not ready within the recovery window.",
    actionLabel: "Confirm recovery action",
    actionDetail: "Front Desk confirms guest is offered a lounge wait, Housekeeping fast-tracks the room, and a compensation option is prepared for Duty Manager approval if the window is breached.",
    evidence: ["Guest acknowledgement delivery record", "Housekeeping task timestamp", "Compensation approval record (if used)"],
    outcome: ["Guest informed", "Recovery option approved", "Room prioritised", "Follow-up completed"],
    value: ["Loyalty protected", "Negative review risk reduced", "Response time recorded"],
    learning: "Recovery worked fastest when the guest acknowledgement was sent before housekeeping confirmed — pattern reinforced for future repeat-guest delays.",
  },
  {
    id: "distressed-guest",
    num: "02",
    title: "Distressed Guest",
    category: "Guest Welfare",
    existingSystem: "Guest App + Front Desk Console",
    signals: ["Guest distress", "Unusual request", "Staff concern"],
    moment: "Guest Welfare Moment",
    momentClassification: "AI classification: 87% confidence — Guest Welfare pattern. Flagged for mandatory human review.",
    governance: ["Guest Welfare Procedure", "Safety Escalation Rule"],
    playbook: "Guest Welfare Support and Escalation",
    roles: ["Front Desk", "Duty Manager", "Security / Specialist Support"],
    aiBoundary: "AI may guide approved questions and communication. Human escalation is mandatory — this moment cannot be closed by AI or auto-resolved.",
    comms: [
      { id: "c1", label: "Front Desk welfare check prompt", channel: "Staff console", toRole: "Front Desk", requiresApproval: false },
      { id: "c2", label: "Duty Manager welfare escalation", channel: "In-app alert", toRole: "Duty Manager", requiresApproval: false },
      { id: "c3", label: "Specialist support referral", channel: "Internal referral", toRole: "Security / Specialist Support", requiresApproval: true },
    ],
    requiresEscalation: true,
    escalationNote: "Mandatory human escalation to Duty Manager before any further step — AI cannot approve or close this moment.",
    actionLabel: "Confirm human escalation",
    actionDetail: "Duty Manager takes direct ownership of the guest interaction. Specialist support is engaged where the welfare procedure requires it. AI continues to suggest approved language only.",
    evidence: ["Escalation timestamp and owner", "Specialist referral record", "Closure sign-off by Duty Manager"],
    outcome: ["Guest safely supported", "Escalation actioned by a human", "Welfare procedure followed", "Closure reviewed"],
    value: ["Duty of care upheld", "Risk exposure reduced", "Response fully attributable to a named person"],
    learning: "Guest welfare moments must never be presented as resolvable by AI alone — the boundary is enforced at the moment level, not left to operator judgement.",
  },
  {
    id: "service-backlog",
    num: "03",
    title: "Service Backlog",
    category: "Operational Pressure",
    existingSystem: "Task Management System + Staffing Roster",
    signals: ["Multiple open requests", "Staffing pressure", "Delayed completion"],
    moment: "Operational Pressure Moment",
    momentClassification: "AI classification: 90% confidence — Service Backlog pattern across Housekeeping queue.",
    governance: ["Staffing Escalation Protocol", "Service Level Standard"],
    playbook: "Service Backlog Coordination",
    roles: ["Front Desk", "Housekeeping", "Duty Manager", "Operator"],
    comms: [
      { id: "c1", label: "Staff reallocation nudge", channel: "Staff dashboard", toRole: "Housekeeping", requiresApproval: false },
      { id: "c2", label: "Backlog briefing", channel: "In-app briefing", toRole: "Duty Manager", requiresApproval: false },
      { id: "c3", label: "Operator capacity alert", channel: "Operator console", toRole: "Operator", requiresApproval: false },
    ],
    requiresEscalation: false,
    escalationNote: "Escalates to Duty Manager only if backlog is not cleared before the next arrivals peak.",
    actionLabel: "Confirm reallocation",
    actionDetail: "Duty Manager confirms backup staff reallocation to the highest-priority open requests, prioritised against arrivals and guest impact.",
    evidence: ["Reallocation confirmation", "Backlog clearance timestamp", "Staff task log"],
    outcome: ["Backlog cleared or reduced before impact", "Staff reallocated", "No guest-facing escalation required"],
    value: ["Staff coordination", "Response improvement", "Guest-impact reduction"],
    learning: "Backlog nudges sent before staffing pressure peaked (rather than after) cleared the queue faster — timing of the nudge is now a tracked variable.",
  },
  {
    id: "maintenance-defect",
    num: "04",
    title: "Maintenance Defect",
    category: "Room Safety and Maintenance Escalation",
    existingSystem: "Maintenance Ticketing System + PMS",
    signals: ["Guest report", "Repeat maintenance issue", "Room impact"],
    moment: "Room Safety and Maintenance Escalation",
    momentClassification: "AI classification: 95% confidence — Repeat Maintenance Defect pattern (2nd report, same unit).",
    governance: ["Room Safety and Maintenance SOP", "Guest Recovery Policy"],
    playbook: "Maintenance Response and Guest Recovery",
    roles: ["Housekeeping", "Duty Manager", "Front Desk", "Guest"],
    comms: [
      { id: "c1", label: "Maintenance priority ticket", channel: "Facilities dashboard", toRole: "Housekeeping", requiresApproval: false },
      { id: "c2", label: "Repeat-fault escalation", channel: "In-app alert", toRole: "Duty Manager", requiresApproval: false },
      { id: "c3", label: "Guest update", channel: "Guest app", toRole: "Guest", requiresApproval: true },
    ],
    requiresEscalation: true,
    escalationNote: "Second report on the same unit triggers mandatory escalation to Duty Manager for a repair-or-relocate decision.",
    actionLabel: "Confirm repair or relocation",
    actionDetail: "Duty Manager confirms whether the fault can be resolved within the guest's tolerance window or whether the guest should be relocated, with Front Desk actioning the guest-facing update.",
    evidence: ["Repair confirmation or relocation record", "Maintenance ticket history", "Guest update delivery record"],
    outcome: ["Fault resolved or guest relocated", "Guest kept informed", "Escalation reviewed"],
    value: ["Guest disruption minimised", "Repeat-fault pattern flagged for asset review", "Response time recorded"],
    learning: "Repeat faults on the same unit are now flagged at the first report for proactive scheduling, rather than waiting for a second guest report.",
  },
  {
    id: "transport-disruption",
    num: "05",
    title: "Transport Disruption",
    category: "Guest Journey Disruption",
    existingSystem: "Flight & Transfer Tracking + Guest App",
    signals: ["Flight delay", "Transfer failure", "Guest arrival change"],
    moment: "Guest Journey Disruption",
    momentClassification: "AI classification: 89% confidence — Transport Disruption pattern, arrival window shifted.",
    governance: ["Partner Activation Policy", "Guest Communication Standard"],
    playbook: "Transport Recovery and Communication",
    roles: ["Concierge", "Duty Manager", "Partner", "Guest"],
    comms: [
      { id: "c1", label: "Guest disruption notice", channel: "Guest app", toRole: "Guest", requiresApproval: false },
      { id: "c2", label: "Partner transport activation", channel: "Partner channel", toRole: "Partner", requiresApproval: true },
      { id: "c3", label: "Arrival change briefing", channel: "In-app briefing", toRole: "Duty Manager", requiresApproval: false },
    ],
    requiresEscalation: false,
    escalationNote: "Escalates to Duty Manager only if no approved transport partner can be activated in time.",
    actionLabel: "Confirm partner activation",
    actionDetail: "Concierge activates an approved transport provider and confirms the revised arrival plan is reflected in the guest's itinerary and room-readiness schedule.",
    evidence: ["Partner activation confirmation", "Revised arrival record", "Guest notification delivery record"],
    outcome: ["Transport recovered", "Guest kept informed", "Arrival plan updated"],
    value: ["Guest journey continuity protected", "Partner activation logged", "Response time recorded"],
    learning: "Notifying the guest before partner confirmation lands reduced anxiety without overstating certainty — wording pattern reused for future disruptions.",
  },
  {
    id: "premium-guest-opportunity",
    num: "06",
    title: "Premium Guest Opportunity",
    category: "Loyalty and Commercial Opportunity",
    existingSystem: "CRM + Loyalty Platform + Partner Marketplace",
    signals: ["Loyalty status", "Guest interests", "Available partner offer"],
    moment: "Loyalty and Commercial Opportunity",
    momentClassification: "AI classification: 84% confidence — Premium Guest Opportunity match against active partner offer.",
    governance: ["Loyalty Treatment Standard", "Partner Commercial Policy"],
    playbook: "Guest Experience and Partner Activation",
    roles: ["Concierge", "Revenue & Loyalty Lead", "Partner", "Guest"],
    comms: [
      { id: "c1", label: "Personalised offer", channel: "Guest app", toRole: "Guest", requiresApproval: true },
      { id: "c2", label: "Partner activation request", channel: "Partner channel", toRole: "Partner", requiresApproval: true },
      { id: "c3", label: "Loyalty opportunity briefing", channel: "In-app briefing", toRole: "Revenue & Loyalty Lead", requiresApproval: false },
    ],
    requiresEscalation: false,
    escalationNote: "No escalation required — commercial offers require approval, not escalation.",
    actionLabel: "Confirm offer and partner activation",
    actionDetail: "Revenue & Loyalty Lead approves the personalised offer and the partner activation before the guest-facing message is sent by Concierge.",
    evidence: ["Offer approval record", "Partner activation confirmation", "Guest response record"],
    outcome: ["Offer presented", "Partner activated where accepted", "Guest response logged"],
    value: ["Ancillary revenue opportunity created", "Loyalty relationship strengthened", "Partner activation logged"],
    learning: "Offers tied to a guest's stated interests (rather than tier alone) produced a materially higher acceptance rate in this pattern — tracked for playbook refinement.",
  },
];

export const SCENARIO_LABELS = {
  demo: "Demo",
  synthetic: "Synthetic data",
  approval: "Human approval required",
  aiAssisted: "AI-assisted",
};

export const ALL_SCENARIO_ROLES: TravelScenarioRole[] = [
  "Front Desk", "Duty Manager", "Housekeeping", "Guest",
  "Security / Specialist Support", "Operator", "Concierge", "Partner", "Revenue & Loyalty Lead",
];
