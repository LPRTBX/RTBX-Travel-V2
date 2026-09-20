/**
 * Travel AI & Central Comms.
 *
 * The current Working Proof uses deterministic rules and synthetic scenarios
 * to show draft communications. AI assistance and external-channel delivery
 * are Planned; a named human role remains accountable for every approval.
 */

// ── Flow ────────────────────────────────────────────────────────────────────

export const TRAVEL_AI_COMMS_FLOW: string[] = [
  "Synthetic Travel Signal",
  "Rules-Based Moment",
  "Deterministic Governance Rule",
  "Proposed Playbook",
  "Named Human Owner",
  "Draft Comms View",
  "Planned AI Assistance",
  "Proposed Action",
  "Illustrative Outcome",
];

// ── Travel AI assistants ──────────────────────────────────────────────────

export interface TravelAiAssistant {
  id: string;
  name: string;
  color: string;
  role: string;
  can: string[];
  mustEscalate?: string[];
  mustNot?: string[];
}

export const TRAVEL_AI_ASSISTANTS: TravelAiAssistant[] = [
  {
    id: "guest-assistant",
    name: "Guest Assistant",
    color: "#3b82f6",
    role: "Guest",
    can: [
      "Planned: draft answers from approved property content",
      "Planned: draft support for guest requests",
      "Planned: suggest service-recovery wording",
      "Planned: surface approved local options for human review",
      "Planned: draft feedback prompts",
    ],
    mustEscalate: [
      "Medical concerns",
      "Safety concerns",
      "Formal complaints",
      "Compensation above threshold",
      "Vulnerable guest concerns",
      "Legal or security issues",
    ],
  },
  {
    id: "front-desk-assistant",
    name: "Front Desk Assistant",
    color: "#10b981",
    role: "Frontline",
    can: [
      "Planned: summarise guest context",
      "Planned: suggest approved playbooks",
      "Planned: draft recovery messages",
      "Planned: suggest request priorities",
      "Planned: identify escalation requirements",
    ],
    mustNot: [
      "Independently approve compensation",
      "Close a high-risk safety issue",
      "Override hotel policy",
      "Access information outside role permission",
    ],
  },
  {
    id: "duty-manager-assistant",
    name: "Duty Manager Assistant",
    color: "#f97316",
    role: "Manager",
    can: [
      "Planned: summarise modelled high-priority moments",
      "Planned: recommend escalation pathways",
      "Planned: identify proposed actions awaiting review",
      "Planned: draft communication for approval",
      "Planned: surface modelled cross-department pressure",
    ],
    mustEscalate: [
      "Critical incidents",
      "Legal matters",
      "Significant compensation",
      "Security and welfare matters",
    ],
  },
  {
    id: "concierge-partner-assistant",
    name: "Concierge / Partner Assistant",
    color: "#c9a84c",
    role: "Concierge / Partner",
    can: [
      "Planned: suggest relevant guest interests for review",
      "Planned: surface approved partner options",
      "Planned: draft a referral for concierge approval",
      "Planned: model potential conversion indicators",
    ],
    mustNot: [
      "Promote unapproved partners",
      "Share sensitive guest data",
      "Make unsupported guarantees",
    ],
  },
  {
    id: "operator-intelligence-assistant",
    name: "Operator Intelligence Assistant",
    color: "#a78bfa",
    role: "Operator / Executive",
    can: [
      "Planned: summarise modelled property trends",
      "Planned: compare simulated response indicators",
      "Planned: identify candidate playbooks for review",
      "Planned: draft executive summaries",
      "Planned: highlight modelled value leakage",
    ],
    mustNot: [
      "Make employment, legal or safety determinations",
      "Expose personal data outside authorised roles",
    ],
  },
];

// ── Central comms channels ──────────────────────────────────────────────────

export interface TravelCommsChannel {
  id: string;
  name: string;
}

export const TRAVEL_CENTRAL_COMMS_CHANNELS: TravelCommsChannel[] = [
  { id: "in-app",           name: "In-app (proposed target)" },
  { id: "guest-web-qr",     name: "Guest Web / QR (proposed target)" },
  { id: "chatbot",          name: "Chatbot (planned)" },
  { id: "email",            name: "Email (proposed target)" },
  { id: "sms",              name: "SMS (proposed target)" },
  { id: "whatsapp",         name: "WhatsApp (proposed target)" },
  { id: "staff-dashboard",  name: "Staff Dashboard (illustrative)" },
  { id: "manager-dashboard", name: "Manager Dashboard (illustrative)" },
  { id: "teams-slack",      name: "Teams / Slack (proposed target)" },
  { id: "partner-portal",   name: "Partner Portal (proposed target)" },
  { id: "post-stay",        name: "Post-Stay Communication (proposed target)" },
];

// ── Communication registry ──────────────────────────────────────────────────

export interface TravelCommunicationRecord {
  id: string;
  name: string;
  momentType: string;
  audience: string;
  role: string;
  channel: string;
  template: string;
  tone: string;
  approvalRule: string;
  escalationRule: string;
  linkedPlaybook: string;
  linkedGovernance: string;
  deliveryStatus: string;
  responseStatus: string;
  outcomeRequirement: string;
}

export const TRAVEL_COMMUNICATION_REGISTRY: TravelCommunicationRecord[] = [
  {
    id: "comm-room-delay-ack",
    name: "Room Delay Acknowledgement",
    momentType: "Operational Pressure Moment",
    audience: "Guest",
    role: "Front Desk",
    channel: "Proposed target: Guest Web / QR, In-app",
    template: "Your room is being prepared — a team member will review readiness and update you when more information is available.",
    tone: "Warm, reassuring",
    approvalRule: "Draft only — named Front Desk owner must approve any use",
    escalationRule: "Proposed: Duty Manager review if modelled delay passes 30 minutes",
    linkedPlaybook: "Pre-Arrival Readiness Check",
    linkedGovernance: "Room Readiness SOP",
    deliveryStatus: "Draft Shown",
    responseStatus: "Illustrative",
    outcomeRequirement: "Modelled: human verifies readiness and separately approves any update",
  },
  {
    id: "comm-duty-manager-escalation",
    name: "Duty Manager Escalation",
    momentType: "Service Recovery Moment",
    audience: "Manager",
    role: "Duty Manager",
    channel: "Illustrative dashboard; Teams / Slack is a proposed target",
    template: "ESCALATION: [Moment] unresolved past threshold — guest [name], room [n]. Action required.",
    tone: "Direct, operational",
    approvalRule: "Draft only — named Duty Manager must review and initiate any notification",
    escalationRule: "Proposed: General Manager review if modelled threshold passes 15 minutes",
    linkedPlaybook: "Duty Manager Callback",
    linkedGovernance: "Complaint Escalation SOP",
    deliveryStatus: "Draft Shown",
    responseStatus: "Proposed",
    outcomeRequirement: "Illustrative: named owner reviews and documents externally if adopted",
  },
  {
    id: "comm-guest-welfare-checkin",
    name: "Guest Welfare Check-In",
    momentType: "Guest Welfare Moment",
    audience: "Guest",
    role: "Duty Manager",
    channel: "Proposed target: In-app; illustrative Staff Dashboard",
    template: "Good [morning/afternoon] [name] — we wanted to check you're comfortable and have everything you need.",
    tone: "Discreet, caring",
    approvalRule: "Draft only — named Duty Manager approval and accountability required",
    escalationRule: "Proposed: immediate human welfare review; simulation does not monitor responses",
    linkedPlaybook: "Welfare Check",
    linkedGovernance: "Guest Safety Procedure",
    deliveryStatus: "Draft Shown",
    responseStatus: "Illustrative",
    outcomeRequirement: "Modelled only: welfare remains for trained staff to assess and document",
  },
  {
    id: "comm-recovery-followup",
    name: "Recovery Follow-Up",
    momentType: "Service Recovery Moment",
    audience: "Guest",
    role: "Guest Relations",
    channel: "Proposed target: Email, In-app",
    template: "Thank you for your patience earlier — we wanted to ask whether anything still needs attention.",
    tone: "Sincere, accountable",
    approvalRule: "Draft only — named Guest Relations owner must approve; compensation requires separate authority",
    escalationRule: "Proposed: General Manager review if dissatisfaction is reported externally",
    linkedPlaybook: "Service Recovery Gesture",
    linkedGovernance: "Guest Service Recovery Policy",
    deliveryStatus: "Draft Shown",
    responseStatus: "Proposed",
    outcomeRequirement: "Illustrative: human owner assesses whether further review is needed",
  },
  {
    id: "comm-partner-option-draft",
    name: "Partner Option Draft",
    momentType: "Partner Referral Simulation",
    audience: "Guest, Partner",
    role: "Concierge",
    channel: "Proposed target: In-app, Partner Portal, SMS",
    template: "A [partner] option is available for your consideration. A concierge can help you contact the partner directly.",
    tone: "Clear, provisional",
    approvalRule: "Draft only — named Concierge must approve; no partner contact or transaction occurs here",
    escalationRule: "Proposed: Concierge Lead review if capacity cannot be independently verified",
    linkedPlaybook: "Partner Referral",
    linkedGovernance: "Partner Approval Standard",
    deliveryStatus: "Draft Shown",
    responseStatus: "Illustrative",
    outcomeRequirement: "Modelled referral only; no partner activation, transaction or record is created",
  },
  {
    id: "comm-loyalty-protection",
    name: "Loyalty Protection Message",
    momentType: "Loyalty Protection Moment",
    audience: "Guest",
    role: "Revenue / Loyalty Lead",
    channel: "Proposed target: Email, In-app",
    template: "As a valued [tier] member, we'd like to make sure your stay reflects that — let us know if there's anything we can do.",
    tone: "Recognising, personal",
    approvalRule: "Draft only — named Loyalty Lead approves any use and all gestures",
    escalationRule: "Proposed: General Manager review for modelled top-tier risk",
    linkedPlaybook: "Loyalty Recognition Gesture",
    linkedGovernance: "Loyalty Treatment Standard",
    deliveryStatus: "Draft Shown",
    responseStatus: "Illustrative",
    outcomeRequirement: "Modelled: Loyalty Lead reviews the proposed intervention",
  },
  {
    id: "comm-unresolved-complaint-escalation",
    name: "Unresolved Complaint Escalation",
    momentType: "Reputation Risk Moment",
    audience: "Executive",
    role: "General Manager",
    channel: "Illustrative dashboard; Teams / Slack and Email are proposed targets",
    template: "UNRESOLVED: [complaint summary] has passed the escalation threshold without resolution. Executive review required.",
    tone: "Urgent, factual",
    approvalRule: "Draft only — named General Manager owns review and any external response",
    escalationRule: "Proposed immediate Executive review by an accountable human",
    linkedPlaybook: "Executive Recovery Escalation",
    linkedGovernance: "Complaint Escalation SOP",
    deliveryStatus: "Draft Shown",
    responseStatus: "Proposed",
    outcomeRequirement: "Illustrative: accountable owner determines any evidence process outside this proof",
  },
  {
    id: "comm-staff-pressure-nudge",
    name: "Staff Pressure Nudge",
    momentType: "Operational Pressure Moment",
    audience: "Frontline, Manager",
    role: "Duty Manager",
    channel: "Illustrative Staff Dashboard and In-app view",
    template: "Housekeeping is running behind against arrivals — consider reallocating support to rooms flagged priority.",
    tone: "Supportive, practical",
    approvalRule: "Deterministic draft — named Duty Manager decides any reallocation",
    escalationRule: "Proposed: Duty Manager review if a modelled backlog passes the shift window",
    linkedPlaybook: "Staff Reallocation",
    linkedGovernance: "Room Readiness SOP",
    deliveryStatus: "Draft Shown",
    responseStatus: "Proposed",
    outcomeRequirement: "Modelled: Duty Manager reviews the suggested response",
  },
  {
    id: "comm-post-stay-recovery",
    name: "Post-Stay Recovery Message",
    momentType: "Post-Stay Recovery Moment",
    audience: "Guest",
    role: "Guest Relations",
    channel: "Proposed target: Email, Post-Stay Communication",
    template: "We noticed your stay didn't go as planned — we'd welcome the chance to make it right and hear how we can improve.",
    tone: "Genuine, non-defensive",
    approvalRule: "Draft only — named Guest Relations owner must approve any outreach",
    escalationRule: "Proposed: General Manager review for modelled public-review risk",
    linkedPlaybook: "Post-Stay Outreach",
    linkedGovernance: "Guest Service Recovery Policy",
    deliveryStatus: "Draft Shown",
    responseStatus: "Proposed",
    outcomeRequirement: "Illustrative: human owner determines follow-up outside this proof",
  },
];

// ── AI operating model ───────────────────────────────────────────────────

export const TRAVEL_AI_OPERATING_MODEL_STAGES: string[] = [
  "Synthetic Scenario",
  "Deterministic Rules",
  "Draft Shown",
  "Named Human Approval",
  "Proposed External Action",
  "Illustrative Outcome",
  "Planned AI Assistance",
];

export const TRAVEL_AI_OPERATING_MODEL_STATEMENT =
  "Current behaviour is a deterministic Working Proof using synthetic scenarios. AI assistance is Planned only; deterministic rules remain the fallback, and a named human owner approves and remains accountable for every real-world action.";

export const TRAVEL_AI_COMMS_POSITIONING_STATEMENT =
  "Central Comms OS currently shows governed draft communications only. AI assistance, external integrations and delivery are Planned.";
