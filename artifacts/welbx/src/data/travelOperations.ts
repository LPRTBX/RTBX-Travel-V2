/**
 * JALDO Execution Centre — Travel Environment, Outcome Ledger, Evidence Ledger and Value Dashboard.
 *
 * Synthetic demo data only. Values marked `demo: true` in the value
 * dashboard are illustrative/estimated and must be labelled as such in the
 * UI — never presented as verified financial performance, and never used
 * to imply regulatory, safety or insurer outcomes.
 */

export type ActionStatus =
  | "New" | "Acknowledged" | "In progress" | "Approval Required"
  | "Escalated" | "Completed" | "Follow-up required" | "Closed";

export const ACTION_STATUS_SEQUENCE: ActionStatus[] = [
  "New", "Acknowledged", "In progress", "Approval Required", "Completed", "Closed",
];

export type TravelOperatingSystemName =
  | "Guest Experience OS" | "Service Recovery & Staff Response OS"
  | "Marketplace & Loyalty Activation OS" | "Operator Intelligence OS" | "Safety & Guest Welfare OS";

export type TravelRole = "Guest" | "Frontline" | "Manager" | "Operator" | "Partner" | "Executive";

export const TRAVEL_PROPERTIES = ["Harbourview Hotel", "Coastal Retreat Resort", "Metro City Suites", "Alpine Lodge & Spa"] as const;
export type TravelProperty = typeof TRAVEL_PROPERTIES[number];

export const TRAVEL_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type TravelPriority = typeof TRAVEL_PRIORITIES[number];

export interface TravelActionCard {
  id: string;
  property: TravelProperty;
  moment: string;
  linkedSignal: string;
  linkedPlaybook: string;
  owner: string;
  supportingRoles: TravelRole[];
  priority: TravelPriority;
  dueTime: string;
  communicationStatus: string;
  escalationStatus: string;
  evidenceRequired: string;
  outcomeRequired: string;
  operatingSystem: TravelOperatingSystemName;
  status: ActionStatus;
  linkedCommunicationIds: string[];
  linkedEvidenceIds: string[];
  linkedOutcomeId: string;
}

export const TRAVEL_ACTION_CARDS: TravelActionCard[] = [
  {
    id: "act-room-readiness-recovery",
    property: "Harbourview Hotel",
    moment: "Room Readiness Recovery",
    linkedSignal: "Room not ready at check-in — queue exceeded 8 minutes",
    linkedPlaybook: "Pre-Arrival Readiness Check",
    owner: "Front Desk Lead — J. Ahmadi",
    supportingRoles: ["Frontline", "Manager"],
    priority: "Medium",
    dueTime: "14:30 today",
    communicationStatus: "Guest notified · Housekeeping tasked",
    escalationStatus: "Not escalated",
    evidenceRequired: "Task completion timestamp, guest notification receipt",
    outcomeRequired: "Room ready and guest checked in",
    operatingSystem: "Guest Experience OS",
    status: "In progress",
    linkedCommunicationIds: ["comm-room-delay-ack"],
    linkedEvidenceIds: ["ev-room-readiness-1", "ev-room-readiness-2"],
    linkedOutcomeId: "out-room-readiness-recovery",
  },
  {
    id: "act-guest-distress-followup",
    property: "Coastal Retreat Resort",
    moment: "Guest Distress Follow-Up",
    linkedSignal: "Guest sentiment drop detected in-app — score 2.1",
    linkedPlaybook: "Service Recovery Gesture",
    owner: "Duty Manager — R. Coleman",
    supportingRoles: ["Manager", "Frontline"],
    priority: "High",
    dueTime: "15:15 today",
    communicationStatus: "Recovery message drafted — awaiting approval",
    escalationStatus: "Escalated to Duty Manager",
    evidenceRequired: "Approval record, guest acknowledgement",
    outcomeRequired: "Guest recovered and sentiment restored",
    operatingSystem: "Service Recovery & Staff Response OS",
    status: "Approval Required",
    linkedCommunicationIds: ["comm-recovery-followup"],
    linkedEvidenceIds: ["ev-guest-distress-1"],
    linkedOutcomeId: "out-guest-distress-followup",
  },
  {
    id: "act-loyalty-protection",
    property: "Metro City Suites",
    moment: "Repeat Guest Loyalty Protection",
    linkedSignal: "Platinum-tier guest flagged mid-stay friction",
    linkedPlaybook: "Loyalty Recognition Gesture",
    owner: "Revenue & Loyalty Lead — S. Okafor",
    supportingRoles: ["Manager", "Executive"],
    priority: "High",
    dueTime: "17:00 today",
    communicationStatus: "Loyalty protection message sent",
    escalationStatus: "Not escalated",
    evidenceRequired: "Message delivery record, gesture approval",
    outcomeRequired: "Loyalty risk protected and logged",
    operatingSystem: "Marketplace & Loyalty Activation OS",
    status: "Completed",
    linkedCommunicationIds: ["comm-loyalty-protection"],
    linkedEvidenceIds: ["ev-loyalty-protection-1", "ev-loyalty-protection-2"],
    linkedOutcomeId: "out-loyalty-protection",
  },
  {
    id: "act-maintenance-escalation",
    property: "Alpine Lodge & Spa",
    moment: "Maintenance Escalation",
    linkedSignal: "Repeat maintenance fault — Room 214 heating, 2nd report",
    linkedPlaybook: "Staff Reallocation",
    owner: "Facilities Supervisor — T. Nguyen",
    supportingRoles: ["Frontline", "Operator"],
    priority: "Critical",
    dueTime: "13:45 today",
    communicationStatus: "Staff pressure nudge sent",
    escalationStatus: "Escalated to Operator Intelligence review",
    evidenceRequired: "Repair confirmation, guest relocation record if unresolved",
    outcomeRequired: "Fault resolved or guest relocated",
    operatingSystem: "Operator Intelligence OS",
    status: "Escalated",
    linkedCommunicationIds: ["comm-staff-pressure-nudge"],
    linkedEvidenceIds: ["ev-maintenance-1"],
    linkedOutcomeId: "out-maintenance-escalation",
  },
  {
    id: "act-staff-pressure-response",
    property: "Harbourview Hotel",
    moment: "Staff Pressure Response",
    linkedSignal: "Housekeeping backlog against arrivals — 6 rooms overdue",
    linkedPlaybook: "Staff Reallocation",
    owner: "Duty Manager — J. Ahmadi",
    supportingRoles: ["Manager", "Frontline"],
    priority: "Medium",
    dueTime: "14:00 today",
    communicationStatus: "Reallocation nudge actioned",
    escalationStatus: "Not escalated",
    evidenceRequired: "Reallocation confirmation, backlog clearance timestamp",
    outcomeRequired: "Backlog cleared before arrivals peak",
    operatingSystem: "Operator Intelligence OS",
    status: "Acknowledged",
    linkedCommunicationIds: ["comm-staff-pressure-nudge"],
    linkedEvidenceIds: ["ev-staff-pressure-1"],
    linkedOutcomeId: "out-staff-pressure-response",
  },
  {
    id: "act-partner-transport-activation",
    property: "Coastal Retreat Resort",
    moment: "Partner Transport Activation",
    linkedSignal: "Guest requested airport transfer inside 90-minute window",
    linkedPlaybook: "Partner Referral",
    owner: "Concierge — M. Villanueva",
    supportingRoles: ["Frontline", "Partner"],
    priority: "Medium",
    dueTime: "16:30 today",
    communicationStatus: "Booking confirmation sent to guest and partner",
    escalationStatus: "Not escalated",
    evidenceRequired: "Partner confirmation, booking record",
    outcomeRequired: "Transfer confirmed and guest notified",
    operatingSystem: "Marketplace & Loyalty Activation OS",
    status: "New",
    linkedCommunicationIds: ["comm-partner-booking-confirmation"],
    linkedEvidenceIds: [],
    linkedOutcomeId: "out-partner-transport-activation",
  },
  {
    id: "act-poststay-complaint-recovery",
    property: "Metro City Suites",
    moment: "Post-Stay Complaint Recovery",
    linkedSignal: "Unresolved complaint referenced in post-stay survey response",
    linkedPlaybook: "Post-Stay Outreach",
    owner: "Guest Relations — A. Petrova",
    supportingRoles: ["Manager", "Executive"],
    priority: "High",
    dueTime: "Tomorrow, 12:00",
    communicationStatus: "Post-stay recovery message drafted — awaiting approval",
    escalationStatus: "Escalated to General Manager",
    evidenceRequired: "Approval record, closure review",
    outcomeRequired: "Complaint resolved or formally logged for review",
    operatingSystem: "Service Recovery & Staff Response OS",
    status: "Follow-up required",
    linkedCommunicationIds: ["comm-unresolved-complaint-escalation", "comm-post-stay-recovery"],
    linkedEvidenceIds: ["ev-poststay-1"],
    linkedOutcomeId: "out-poststay-complaint-recovery",
  },
];

// ── Outcome ledger ──────────────────────────────────────────────────────────

export interface TravelOutcomeRecord {
  id: string;
  actionId: string;
  signal: string;
  moment: string;
  governanceRule: string;
  playbook: string;
  owner: string;
  actionsTaken: string;
  communicationsSent: string;
  approval: string;
  timeToResponse: string;
  timeToCompletion: string;
  guestConfirmation: string;
  operatorOutcome: string;
  commercialOutcome: string;
  followUp: string;
  learningNote: string;
}

export const TRAVEL_OUTCOME_LEDGER: TravelOutcomeRecord[] = [
  {
    id: "out-room-readiness-recovery",
    actionId: "act-room-readiness-recovery",
    signal: "Room not ready at check-in — queue exceeded 8 minutes",
    moment: "Room Readiness Recovery",
    governanceRule: "Room Readiness SOP",
    playbook: "Pre-Arrival Readiness Check",
    owner: "Front Desk Lead — J. Ahmadi",
    actionsTaken: "Guest offered lounge with refreshments, housekeeping prioritised room",
    communicationsSent: "Room delay acknowledgement (guest), priority task (housekeeping)",
    approval: "Not required — pre-approved template",
    timeToResponse: "2 minutes",
    timeToCompletion: "20 minutes",
    guestConfirmation: "Acknowledged, no further contact required",
    operatorOutcome: "Room turned in line with recovery window",
    commercialOutcome: "No compensation issued",
    followUp: "None required",
    learningNote: "Lounge offer reduced perceived wait — pattern candidate for standard check-in delay response.",
  },
  {
    id: "out-guest-distress-followup",
    actionId: "act-guest-distress-followup",
    signal: "Guest sentiment drop detected in-app — score 2.1",
    moment: "Guest Distress Follow-Up",
    governanceRule: "Guest Service Recovery Policy",
    playbook: "Service Recovery Gesture",
    owner: "Duty Manager — R. Coleman",
    actionsTaken: "Recovery message drafted, gesture pending approval",
    communicationsSent: "Recovery follow-up (draft, not yet sent)",
    approval: "Pending — General Manager sign-off required for gesture value",
    timeToResponse: "6 minutes",
    timeToCompletion: "In progress",
    guestConfirmation: "Not yet received",
    operatorOutcome: "In progress",
    commercialOutcome: "Estimated gesture cost pending approval",
    followUp: "Awaiting approval before send",
    learningNote: "Approval step is the current bottleneck for same-shift recovery — flagged for playbook review.",
  },
  {
    id: "out-loyalty-protection",
    actionId: "act-loyalty-protection",
    signal: "Platinum-tier guest flagged mid-stay friction",
    moment: "Repeat Guest Loyalty Protection",
    governanceRule: "Loyalty Treatment Standard",
    playbook: "Loyalty Recognition Gesture",
    owner: "Revenue & Loyalty Lead — S. Okafor",
    actionsTaken: "Personal outreach and recognition gesture confirmed",
    communicationsSent: "Loyalty protection message (guest)",
    approval: "Approved by Duty Manager",
    timeToResponse: "9 minutes",
    timeToCompletion: "38 minutes",
    guestConfirmation: "Guest replied positively",
    operatorOutcome: "Loyalty risk closed",
    commercialOutcome: "Estimated lifetime value protected — demo estimate",
    followUp: "None required",
    learningNote: "Early friction detection allowed recovery before guest raised a formal complaint.",
  },
  {
    id: "out-maintenance-escalation",
    actionId: "act-maintenance-escalation",
    signal: "Repeat maintenance fault — Room 214 heating, 2nd report",
    moment: "Maintenance Escalation",
    governanceRule: "Room Readiness SOP",
    playbook: "Staff Reallocation",
    owner: "Facilities Supervisor — T. Nguyen",
    actionsTaken: "Escalated to Operator Intelligence for repeat-fault review",
    communicationsSent: "Staff pressure nudge (facilities team)",
    approval: "Not required for escalation step",
    timeToResponse: "4 minutes",
    timeToCompletion: "In progress",
    guestConfirmation: "Not yet contacted",
    operatorOutcome: "Under active escalation",
    commercialOutcome: "Not yet determined",
    followUp: "Relocation to be offered if unresolved by deadline",
    learningNote: "Second repeat fault on same unit — candidate for asset-level maintenance flag.",
  },
  {
    id: "out-staff-pressure-response",
    actionId: "act-staff-pressure-response",
    signal: "Housekeeping backlog against arrivals — 6 rooms overdue",
    moment: "Staff Pressure Response",
    governanceRule: "Room Readiness SOP",
    playbook: "Staff Reallocation",
    owner: "Duty Manager — J. Ahmadi",
    actionsTaken: "Backup staff reallocated to priority rooms",
    communicationsSent: "Staff pressure nudge (staff dashboard)",
    approval: "Auto-suggested, manager confirmed",
    timeToResponse: "3 minutes",
    timeToCompletion: "26 minutes",
    guestConfirmation: "Not applicable — internal action",
    operatorOutcome: "Backlog cleared before arrivals peak",
    commercialOutcome: "Not applicable",
    followUp: "None required",
    learningNote: "Nudge-to-reallocation pattern reduced arrival-window pressure without guest-facing impact.",
  },
  {
    id: "out-partner-transport-activation",
    actionId: "act-partner-transport-activation",
    signal: "Guest requested airport transfer inside 90-minute window",
    moment: "Partner Transport Activation",
    governanceRule: "Partner Approval Standard",
    playbook: "Partner Referral",
    owner: "Concierge — M. Villanueva",
    actionsTaken: "Booking not yet confirmed",
    communicationsSent: "Not yet sent",
    approval: "Not required for listed partner",
    timeToResponse: "Not yet started",
    timeToCompletion: "Not yet started",
    guestConfirmation: "Not yet contacted",
    operatorOutcome: "Not yet started",
    commercialOutcome: "Not yet determined",
    followUp: "Pending action",
    learningNote: "New — no learning captured yet.",
  },
  {
    id: "out-poststay-complaint-recovery",
    actionId: "act-poststay-complaint-recovery",
    signal: "Unresolved complaint referenced in post-stay survey response",
    moment: "Post-Stay Complaint Recovery",
    governanceRule: "Complaint Escalation SOP",
    playbook: "Post-Stay Outreach",
    owner: "Guest Relations — A. Petrova",
    actionsTaken: "Escalated to General Manager, recovery message drafted",
    communicationsSent: "Unresolved complaint escalation (internal), post-stay recovery (draft)",
    approval: "Pending — General Manager review",
    timeToResponse: "1 hour 40 minutes",
    timeToCompletion: "In progress",
    guestConfirmation: "Not yet received",
    operatorOutcome: "Under executive review",
    commercialOutcome: "Not yet determined",
    followUp: "Closure review required once guest responds",
    learningNote: "Complaint surfaced only at post-stay survey — signal candidate for earlier in-stay detection.",
  },
];

// ── Evidence ledger ──────────────────────────────────────────────────────────

export interface TravelEvidenceRecord {
  id: string;
  actionId: string;
  label: string;
  timestamp: string;
  owner: string;
  actionConfirmation: string;
  messageDelivery: string;
  approvalRecord: string;
  escalationRecord: string;
  supportingEvidence: string;
  guestAcknowledgement: string;
  closureReview: string;
}

export const TRAVEL_EVIDENCE_LEDGER: TravelEvidenceRecord[] = [
  {
    id: "ev-room-readiness-1",
    actionId: "act-room-readiness-recovery",
    label: "Housekeeping task assignment",
    timestamp: "14:02 today",
    owner: "Front Desk Lead — J. Ahmadi",
    actionConfirmation: "Task marked complete by housekeeping app",
    messageDelivery: "Delivered to guest device — read receipt captured",
    approvalRecord: "Not required — pre-approved template",
    escalationRecord: "None",
    supportingEvidence: "Room status log entry",
    guestAcknowledgement: "Guest checked in without further contact",
    closureReview: "Not yet reviewed",
  },
  {
    id: "ev-room-readiness-2",
    actionId: "act-room-readiness-recovery",
    label: "Room ready notification",
    timestamp: "14:22 today",
    owner: "Housekeeping — shift team",
    actionConfirmation: "Confirmed via PMS room-status change",
    messageDelivery: "Delivered to guest device",
    approvalRecord: "Not required",
    escalationRecord: "None",
    supportingEvidence: "PMS timestamped status change",
    guestAcknowledgement: "Guest proceeded to room",
    closureReview: "Not yet reviewed",
  },
  {
    id: "ev-guest-distress-1",
    actionId: "act-guest-distress-followup",
    label: "Recovery gesture approval request",
    timestamp: "14:41 today",
    owner: "Duty Manager — R. Coleman",
    actionConfirmation: "Message drafted, not yet sent",
    messageDelivery: "Not yet sent — pending approval",
    approvalRecord: "Submitted to General Manager, awaiting decision",
    escalationRecord: "Escalated to Duty Manager",
    supportingEvidence: "In-app sentiment score log",
    guestAcknowledgement: "Not yet received",
    closureReview: "Not yet reviewed",
  },
  {
    id: "ev-loyalty-protection-1",
    actionId: "act-loyalty-protection",
    label: "Loyalty gesture approval",
    timestamp: "16:05 today",
    owner: "Duty Manager — on shift",
    actionConfirmation: "Approved and actioned",
    messageDelivery: "Delivered to guest, opened",
    approvalRecord: "Approved by Duty Manager",
    escalationRecord: "None",
    supportingEvidence: "CRM loyalty-tier flag and interaction log",
    guestAcknowledgement: "Guest replied positively",
    closureReview: "Reviewed and closed",
  },
  {
    id: "ev-loyalty-protection-2",
    actionId: "act-loyalty-protection",
    label: "Guest response record",
    timestamp: "16:22 today",
    owner: "Revenue & Loyalty Lead — S. Okafor",
    actionConfirmation: "Response logged in CRM",
    messageDelivery: "N/A — inbound guest reply",
    approvalRecord: "N/A",
    escalationRecord: "None",
    supportingEvidence: "Guest reply transcript",
    guestAcknowledgement: "Positive reply captured",
    closureReview: "Reviewed and closed",
  },
  {
    id: "ev-maintenance-1",
    actionId: "act-maintenance-escalation",
    label: "Repeat-fault escalation record",
    timestamp: "13:41 today",
    owner: "Facilities Supervisor — T. Nguyen",
    actionConfirmation: "Escalation logged, repair in progress",
    messageDelivery: "Delivered to facilities team dashboard",
    approvalRecord: "Not required for escalation",
    escalationRecord: "Escalated to Operator Intelligence review",
    supportingEvidence: "Maintenance ticket history (2 reports, same unit)",
    guestAcknowledgement: "Not yet contacted",
    closureReview: "Not yet reviewed",
  },
  {
    id: "ev-staff-pressure-1",
    actionId: "act-staff-pressure-response",
    label: "Reallocation confirmation",
    timestamp: "13:58 today",
    owner: "Duty Manager — J. Ahmadi",
    actionConfirmation: "Reallocation confirmed by backup staff",
    messageDelivery: "Delivered to staff dashboard",
    approvalRecord: "Auto-suggested, manager confirmed",
    escalationRecord: "None",
    supportingEvidence: "Staff task log",
    guestAcknowledgement: "Not applicable",
    closureReview: "Reviewed and closed",
  },
  {
    id: "ev-poststay-1",
    actionId: "act-poststay-complaint-recovery",
    label: "General Manager escalation record",
    timestamp: "Yesterday, 18:20",
    owner: "Guest Relations — A. Petrova",
    actionConfirmation: "Escalation submitted, review pending",
    messageDelivery: "Not yet sent — recovery message pending approval",
    approvalRecord: "Submitted, awaiting General Manager decision",
    escalationRecord: "Escalated to General Manager",
    supportingEvidence: "Post-stay survey response text",
    guestAcknowledgement: "Not yet received",
    closureReview: "Not yet reviewed",
  },
];

export const EVIDENCE_WORDING_NOTE =
  "Every evidence record is traceable, reviewable and timestamped — supporting an internal audit trail. It is not a claim of tamper-proof storage, automatic compliance, insurer-grade certification, or audit-readiness by default.";

// ── Value dashboard ──────────────────────────────────────────────────────────

export interface TravelValueMeasure {
  id: string;
  label: string;
  value: string;
  demo: boolean;
  note?: string;
}

export interface TravelValueCategory {
  id: string;
  label: string;
  color: string;
  measures: TravelValueMeasure[];
}

export const TRAVEL_VALUE_CATEGORIES: TravelValueCategory[] = [
  {
    id: "guest",
    label: "Guest",
    color: "#3b82f6",
    measures: [
      { id: "recovery-completion",  label: "Recovery completion",       value: "88%",     demo: true },
      { id: "guest-ack",            label: "Guest acknowledgement",     value: "94%",     demo: true },
      { id: "satisfaction-move",    label: "Satisfaction movement",     value: "+1.6 pts", demo: true },
      { id: "loyalty-protected",    label: "Loyalty risk protected",    value: "6 guests", demo: true },
      { id: "unresolved-complaints", label: "Unresolved complaints",     value: "1 open",  demo: true },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    color: "#10b981",
    measures: [
      { id: "avg-response",         label: "Average response time",     value: "5.4 min", demo: true },
      { id: "avg-completion",       label: "Average completion time",   value: "27 min",  demo: true },
      { id: "staff-adoption",       label: "Staff adoption",            value: "76%",     demo: true },
      { id: "playbook-completion",  label: "Playbook completion",       value: "91%",     demo: true },
      { id: "cross-dept-handoff",   label: "Cross-department handoff",  value: "3 active", demo: true },
      { id: "open-overdue",         label: "Open overdue actions",      value: "1",       demo: true },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    color: "#c9a84c",
    measures: [
      { id: "partner-activations",  label: "Partner activations",       value: "4 this week", demo: true },
      { id: "ancillary-opportunities", label: "Ancillary revenue opportunities", value: "9 identified", demo: true },
      { id: "conversion-rate",      label: "Conversion rate",           value: "28%",     demo: true, note: "Estimated — not a verified financial figure" },
      { id: "loyalty-activations",  label: "Loyalty activations",       value: "3",       demo: true },
      { id: "recovered-guest-value", label: "Recovered guest value",     value: "$1,240 (est.)", demo: true, note: "Estimated — not a verified financial figure" },
    ],
  },
  {
    id: "risk",
    label: "Risk and Governance",
    color: "#ef4444",
    measures: [
      { id: "high-risk-escalations", label: "High-risk escalations",    value: "2 active", demo: true },
      { id: "approval-completeness", label: "Approval completeness",    value: "83%",     demo: true },
      { id: "evidence-completeness", label: "Evidence completeness",    value: "79%",     demo: true },
      { id: "unresolved-welfare",    label: "Unresolved safety/welfare moments", value: "0", demo: true },
    ],
  },
];

export const VALUE_DEMO_LABEL_NOTE =
  "All figures on this dashboard are demo or estimated values from synthetic scenario data. They illustrate what a live deployment would measure and are not verified financial or operational performance.";

// ── Feedback loop ────────────────────────────────────────────────────────────

export const TRAVEL_FEEDBACK_LOOP: string[] = [
  "Outcome",
  "Signal Registry",
  "Travel Playbook Performance",
  "Communication Performance",
  "Evidence and Outcome Layer",
  "Travel Intelligence",
];

export const TRAVEL_FEEDBACK_LOOP_STATEMENT =
  "Every outcome improves the signal pattern, tests the playbook, measures execution and strengthens Travel Intelligence.";
