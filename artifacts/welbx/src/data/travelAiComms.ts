/**
 * Travel AI & Central Comms.
 *
 * Central Comms OS turns governed Travel decisions into coordinated
 * communication. AI assistants are interfaces inside Central Comms OS — not
 * a separate product, and not the operating system itself. They classify,
 * summarise, draft and route; a named human role approves anything that
 * matters (compensation, safety, security, medical, legal, critical
 * escalation).
 */

// ── Flow ────────────────────────────────────────────────────────────────────

export const TRAVEL_AI_COMMS_FLOW: string[] = [
  "Travel Signal",
  "Travel Moment",
  "Governance Rule",
  "Travel Playbook",
  "Role Routing",
  "Central Comms OS",
  "AI Assistant / Nudge / Message / Escalation",
  "Action Centre",
  "Outcome and Evidence",
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
      "Answer approved property and stay questions",
      "Support guest requests",
      "Guide service-recovery communication",
      "Surface approved local experiences",
      "Collect guest feedback",
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
      "Summarise guest context",
      "Suggest approved playbooks",
      "Draft recovery messages",
      "Prioritise open requests",
      "Identify escalation requirements",
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
      "Summarise active high-priority moments",
      "Recommend escalation pathways",
      "Identify incomplete actions",
      "Draft approved communication",
      "Surface cross-department pressure",
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
      "Identify relevant guest interests",
      "Surface approved partner options",
      "Coordinate bookings",
      "Record conversion and outcome",
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
      "Summarise property trends",
      "Compare response performance",
      "Identify high-performing playbooks",
      "Generate executive summaries",
      "Highlight value leakage",
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
  { id: "in-app",           name: "In-app" },
  { id: "guest-web-qr",     name: "Guest Web / QR" },
  { id: "chatbot",          name: "Chatbot" },
  { id: "email",            name: "Email" },
  { id: "sms",              name: "SMS" },
  { id: "whatsapp",         name: "WhatsApp (where approved)" },
  { id: "staff-dashboard",  name: "Staff Dashboard" },
  { id: "manager-dashboard", name: "Manager Dashboard" },
  { id: "teams-slack",      name: "Teams / Slack (where configured)" },
  { id: "partner-portal",   name: "Partner Portal" },
  { id: "post-stay",        name: "Post-Stay Communication" },
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
    channel: "Guest Web / QR, In-app",
    template: "Your room is being prepared — we've reserved a comfortable space for you and will send your key as soon as it's ready.",
    tone: "Warm, reassuring",
    approvalRule: "Pre-approved template — no human sign-off required to send",
    escalationRule: "Escalate to Duty Manager if unresolved past 30 minutes",
    linkedPlaybook: "Pre-Arrival Readiness Check",
    linkedGovernance: "Room Readiness SOP",
    deliveryStatus: "Delivered",
    responseStatus: "Acknowledged",
    outcomeRequirement: "Room readiness confirmed and guest notified",
  },
  {
    id: "comm-duty-manager-escalation",
    name: "Duty Manager Escalation",
    momentType: "Service Recovery Moment",
    audience: "Manager",
    role: "Duty Manager",
    channel: "Manager Dashboard, Teams / Slack",
    template: "ESCALATION: [Moment] unresolved past threshold — guest [name], room [n]. Action required.",
    tone: "Direct, operational",
    approvalRule: "Auto-routed — no approval required to notify",
    escalationRule: "Re-escalate to General Manager if unactioned within 15 minutes",
    linkedPlaybook: "Duty Manager Callback",
    linkedGovernance: "Complaint Escalation SOP",
    deliveryStatus: "Delivered",
    responseStatus: "Awaiting action",
    outcomeRequirement: "Response completed and logged",
  },
  {
    id: "comm-guest-welfare-checkin",
    name: "Guest Welfare Check-In",
    momentType: "Guest Welfare Moment",
    audience: "Guest",
    role: "Duty Manager",
    channel: "In-app, Staff Dashboard",
    template: "Good [morning/afternoon] [name] — we wanted to check you're comfortable and have everything you need.",
    tone: "Discreet, caring",
    approvalRule: "Human approval required before send",
    escalationRule: "Immediate escalation if guest does not respond within 20 minutes",
    linkedPlaybook: "Welfare Check",
    linkedGovernance: "Guest Safety Procedure",
    deliveryStatus: "Delivered",
    responseStatus: "Response received",
    outcomeRequirement: "Guest acknowledged and welfare confirmed",
  },
  {
    id: "comm-recovery-followup",
    name: "Recovery Follow-Up",
    momentType: "Service Recovery Moment",
    audience: "Guest",
    role: "Guest Relations",
    channel: "Email, In-app",
    template: "Thank you for your patience earlier — we wanted to follow up and confirm everything is now resolved to your satisfaction.",
    tone: "Sincere, accountable",
    approvalRule: "Human approval required for any compensation reference",
    escalationRule: "Escalate to General Manager if guest remains dissatisfied",
    linkedPlaybook: "Service Recovery Gesture",
    linkedGovernance: "Guest Service Recovery Policy",
    deliveryStatus: "Delivered",
    responseStatus: "Awaiting response",
    outcomeRequirement: "Guest recovered or further review flagged",
  },
  {
    id: "comm-partner-booking-confirmation",
    name: "Partner Booking Confirmation",
    momentType: "Partner Activation Moment",
    audience: "Guest, Partner",
    role: "Concierge",
    channel: "In-app, Partner Portal, SMS",
    template: "Your booking with [partner] is confirmed for [time]. We'll notify you of any changes.",
    tone: "Efficient, confident",
    approvalRule: "Pre-approved template — no sign-off required for listed partners",
    escalationRule: "Escalate to Concierge Lead if partner cannot confirm capacity",
    linkedPlaybook: "Partner Referral",
    linkedGovernance: "Partner Approval Standard",
    deliveryStatus: "Delivered",
    responseStatus: "Confirmed",
    outcomeRequirement: "Partner activated and booking logged",
  },
  {
    id: "comm-loyalty-protection",
    name: "Loyalty Protection Message",
    momentType: "Loyalty Protection Moment",
    audience: "Guest",
    role: "Revenue / Loyalty Lead",
    channel: "Email, In-app",
    template: "As a valued [tier] member, we'd like to make sure your stay reflects that — let us know if there's anything we can do.",
    tone: "Recognising, personal",
    approvalRule: "Human approval required for top-tier gestures",
    escalationRule: "Escalate to General Manager for top-tier members at risk",
    linkedPlaybook: "Loyalty Recognition Gesture",
    linkedGovernance: "Loyalty Treatment Standard",
    deliveryStatus: "Delivered",
    responseStatus: "Acknowledged",
    outcomeRequirement: "Loyalty protection recorded",
  },
  {
    id: "comm-unresolved-complaint-escalation",
    name: "Unresolved Complaint Escalation",
    momentType: "Reputation Risk Moment",
    audience: "Executive",
    role: "General Manager",
    channel: "Manager Dashboard, Teams / Slack, Email",
    template: "UNRESOLVED: [complaint summary] has passed the escalation threshold without resolution. Executive review required.",
    tone: "Urgent, factual",
    approvalRule: "Human approval required for any public or executive-level response",
    escalationRule: "Immediate — no further escalation tier beyond Executive",
    linkedPlaybook: "Executive Recovery Escalation",
    linkedGovernance: "Complaint Escalation SOP",
    deliveryStatus: "Delivered",
    responseStatus: "Under review",
    outcomeRequirement: "Escalation completed and evidence captured",
  },
  {
    id: "comm-staff-pressure-nudge",
    name: "Staff Pressure Nudge",
    momentType: "Operational Pressure Moment",
    audience: "Frontline, Manager",
    role: "Duty Manager",
    channel: "Staff Dashboard, In-app",
    template: "Housekeeping is running behind against arrivals — consider reallocating support to rooms flagged priority.",
    tone: "Supportive, practical",
    approvalRule: "Auto-suggested — manager confirms reallocation",
    escalationRule: "Escalate to Duty Manager if backlog persists past shift window",
    linkedPlaybook: "Staff Reallocation",
    linkedGovernance: "Room Readiness SOP",
    deliveryStatus: "Delivered",
    responseStatus: "Actioned",
    outcomeRequirement: "Response completed",
  },
  {
    id: "comm-post-stay-recovery",
    name: "Post-Stay Recovery Message",
    momentType: "Post-Stay Recovery Moment",
    audience: "Guest",
    role: "Guest Relations",
    channel: "Email, Post-Stay Communication",
    template: "We noticed your stay didn't go as planned — we'd welcome the chance to make it right and hear how we can improve.",
    tone: "Genuine, non-defensive",
    approvalRule: "Human approval required before send",
    escalationRule: "Escalate to General Manager for public review risk",
    linkedPlaybook: "Post-Stay Outreach",
    linkedGovernance: "Guest Service Recovery Policy",
    deliveryStatus: "Delivered",
    responseStatus: "Awaiting response",
    outcomeRequirement: "Post-stay outcome recorded",
  },
];

// ── AI operating model ───────────────────────────────────────────────────

export const TRAVEL_AI_OPERATING_MODEL_STAGES: string[] = [
  "External AI Capability",
  "RTBX AI Gateway",
  "Travel Knowledge and Retrieval",
  "Governance and Policy Controls",
  "Travel Assistant Boundaries",
  "Human Approval",
  "Communication / Action",
  "Outcome Logging",
  "Evaluation and Learning",
];

export const TRAVEL_AI_OPERATING_MODEL_STATEMENT =
  "External AI models provide capability. RTBX Travel provides the context, governance, role permissions, action pathways and memory.";

export const TRAVEL_AI_COMMS_POSITIONING_STATEMENT =
  "Central Comms OS turns governed Travel decisions into coordinated communication. AI assistants are interfaces inside Central Comms OS.";
