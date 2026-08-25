/**
 * Travel Intelligence Pack — the domain-specific configuration of RTBX Core for
 * travel, hospitality and guest-service environments.
 *
 * RTBX Core is one platform. This file does not describe a separate system —
 * it describes how RTBX Core's shared signal, moment, governance, role,
 * communication, outcome and value systems are tuned for Travel:
 * knowledge sources, signal taxonomy, moment taxonomy, governance sources,
 * playbooks, roles, communication rules, AI assistant boundaries,
 * integrations and outcomes/value measures.
 */

// ── 1. TRAVEL SIGNAL TAXONOMY ──────────────────────────────────────────────

export type TravelSignalDomain = "Guest Experience" | "Operations" | "Safety & Welfare" | "Commercial" | "Partner";

export interface TravelSignal {
  id: string;
  name: string;
  domain: TravelSignalDomain;
  description: string;
}

export const TRAVEL_SIGNAL_TAXONOMY: TravelSignal[] = [
  // Guest experience
  { id: "sig-guest-frustration",      name: "Guest frustration",        domain: "Guest Experience", description: "Verbal, written or behavioural sign of guest dissatisfaction during a stay." },
  { id: "sig-negative-sentiment",     name: "Negative sentiment",       domain: "Guest Experience", description: "Sentiment-scored guest communication trending negative across a channel." },
  { id: "sig-repeat-complaint",       name: "Repeat complaint",         domain: "Guest Experience", description: "A second or subsequent complaint from the same guest within a stay." },
  { id: "sig-room-readiness-delay",   name: "Room readiness delay",     domain: "Guest Experience", description: "Room not released to housekeeping-complete status ahead of guest arrival." },
  { id: "sig-loyalty-risk",           name: "Loyalty risk",             domain: "Guest Experience", description: "Behaviour or sentiment pattern indicating risk of loyalty tier attrition." },
  { id: "sig-service-request-delay",  name: "Service request delay",    domain: "Guest Experience", description: "An open guest service request exceeding its expected response window." },

  // Operations
  { id: "sig-housekeeping-backlog",   name: "Housekeeping backlog",     domain: "Operations", description: "Room turnaround queue exceeding capacity against arrivals or departures." },
  { id: "sig-maintenance-issue",      name: "Maintenance issue",        domain: "Operations", description: "A reported or sensor-detected fault requiring a maintenance response." },
  { id: "sig-staffing-pressure",      name: "Staffing pressure",        domain: "Operations", description: "Rostered capacity falling below the level required for current demand." },
  { id: "sig-queue-build-up",         name: "Queue build-up",           domain: "Operations", description: "Wait time or queue depth exceeding an operational threshold at a service point." },
  { id: "sig-service-disruption",     name: "Service disruption",       domain: "Operations", description: "An amenity, system or service temporarily unavailable to guests." },
  { id: "sig-missed-handover",        name: "Missed handover",          domain: "Operations", description: "A shift handover item not acknowledged or actioned by the incoming team." },

  // Safety and welfare
  { id: "sig-guest-distress",         name: "Guest distress",           domain: "Safety & Welfare", description: "Signal indicating a guest may be in physical or emotional distress." },
  { id: "sig-medical-assistance",     name: "Medical assistance request", domain: "Safety & Welfare", description: "A guest or staff member has requested or requires medical assistance." },
  { id: "sig-security-concern",       name: "Security concern",         domain: "Safety & Welfare", description: "A reported or observed security risk to guests, staff or property." },
  { id: "sig-vulnerable-guest",       name: "Vulnerable guest signal",  domain: "Safety & Welfare", description: "Context indicating a guest may need additional duty-of-care attention." },
  { id: "sig-staff-safety",           name: "Staff safety concern",     domain: "Safety & Welfare", description: "A reported or observed risk to staff safety or wellbeing on shift." },

  // Commercial
  { id: "sig-upsell-opportunity",     name: "Upsell opportunity",       domain: "Commercial", description: "Guest context indicating readiness for a room, package or experience upgrade." },
  { id: "sig-local-experience-interest", name: "Local experience interest", domain: "Commercial", description: "Guest behaviour indicating interest in local tours, activities or attractions." },
  { id: "sig-transport-requirement",  name: "Transport requirement",    domain: "Commercial", description: "A guest need for airport, local or event transport has been identified." },
  { id: "sig-dining-interest",        name: "Dining interest",          domain: "Commercial", description: "Guest behaviour or booking pattern indicating dining propensity." },
  { id: "sig-loyalty-activation",     name: "Loyalty activation",       domain: "Commercial", description: "An opportunity to enrol, recognise or upgrade a guest within the loyalty programme." },
  { id: "sig-business-traveller-need", name: "Business traveller need", domain: "Commercial", description: "A context-specific need (meeting space, late check-out, express service) tied to business travel." },

  // Partner
  { id: "sig-local-provider-availability", name: "Local provider availability", domain: "Partner", description: "A change in a local experience or service partner's available capacity." },
  { id: "sig-partner-service-failure", name: "Service failure",         domain: "Partner", description: "A partner-delivered service has failed to meet its committed standard." },
  { id: "sig-partner-capacity",       name: "Partner capacity",         domain: "Partner", description: "Signal on a partner's current capacity to accept referrals or bookings." },
  { id: "sig-booking-conversion",     name: "Booking conversion",       domain: "Partner", description: "A guest referral to a partner has converted into a confirmed booking." },
  { id: "sig-partner-quality",        name: "Partner quality signal",   domain: "Partner", description: "Feedback or performance data on the quality of a partner's delivered experience." },
];

// ── 2. TRAVEL MOMENT TAXONOMY ──────────────────────────────────────────────

export type TravelRiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface TravelMoment {
  id: string;
  name: string;
  triggeringSignals: string[];
  riskLevel: TravelRiskLevel;
  valueAtStake: string;
  governanceSources: string[];
  likelyPlaybooks: string[];
  primaryOwner: string;
  escalationThreshold: string;
  aiSupportAllowed: string[];
  humanApprovalRequired: boolean;
  outcomeMeasures: string[];
}

export const TRAVEL_MOMENT_TAXONOMY: TravelMoment[] = [
  {
    id: "moment-service-recovery",
    name: "Service Recovery Moment",
    triggeringSignals: ["Guest frustration", "Repeat complaint", "Service request delay"],
    riskLevel: "High",
    valueAtStake: "Guest retention, review outcome, immediate compensation cost",
    governanceSources: ["Guest Service Recovery Policy", "Compensation Approval Matrix"],
    likelyPlaybooks: ["Service Recovery Gesture", "Duty Manager Callback", "Room Recovery Offer"],
    primaryOwner: "Duty Manager",
    escalationThreshold: "Unresolved after 15 minutes or second complaint received",
    aiSupportAllowed: ["Classify", "Draft recovery message", "Recommend gesture tier"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Guest recovered", "Compensation approved", "Review prevention"],
  },
  {
    id: "moment-guest-welfare",
    name: "Guest Welfare Moment",
    triggeringSignals: ["Guest distress", "Vulnerable guest signal"],
    riskLevel: "High",
    valueAtStake: "Guest wellbeing, duty of care, brand reputation",
    governanceSources: ["Guest Safety Procedure", "Privacy and Consent Rules"],
    likelyPlaybooks: ["Welfare Check", "Discreet Support Escalation"],
    primaryOwner: "Duty Manager",
    escalationThreshold: "Immediate escalation on any welfare signal above Low",
    aiSupportAllowed: ["Classify", "Summarise context for the responding human"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Guest acknowledged", "Issue resolved", "Evidence captured"],
  },
  {
    id: "moment-safety-escalation",
    name: "Safety Escalation Moment",
    triggeringSignals: ["Medical assistance request", "Security concern", "Staff safety concern"],
    riskLevel: "Critical",
    valueAtStake: "Life safety, legal exposure, critical incident record",
    governanceSources: ["Guest Safety Procedure", "Medical Assistance Procedure", "Critical Incident Procedure"],
    likelyPlaybooks: ["Medical Response Protocol", "Security Response Protocol"],
    primaryOwner: "Security / Duty Manager",
    escalationThreshold: "Immediate — routed in parallel to on-site and emergency services where required",
    aiSupportAllowed: ["Classify", "Coordinate parallel notification to required roles"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Response completed", "Escalation completed", "Evidence captured"],
  },
  {
    id: "moment-loyalty-protection",
    name: "Loyalty Protection Moment",
    triggeringSignals: ["Loyalty risk", "Negative sentiment"],
    riskLevel: "Medium",
    valueAtStake: "Lifetime value, tier retention, referral value",
    governanceSources: ["Loyalty Treatment Standard"],
    likelyPlaybooks: ["Loyalty Recognition Gesture", "Tier Retention Offer"],
    primaryOwner: "Revenue / Loyalty Lead",
    escalationThreshold: "Escalate to General Manager for top-tier members",
    aiSupportAllowed: ["Classify", "Draft recognition message", "Recommend gesture"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Loyalty protection", "Guest acknowledged", "Commercial conversion"],
  },
  {
    id: "moment-operational-pressure",
    name: "Operational Pressure Moment",
    triggeringSignals: ["Housekeeping backlog", "Queue build-up", "Staffing pressure"],
    riskLevel: "Medium",
    valueAtStake: "Service consistency, downstream guest impact, staff strain",
    governanceSources: ["Room Readiness SOP"],
    likelyPlaybooks: ["Staff Reallocation", "Secondary Channel Activation"],
    primaryOwner: "Front Desk / Housekeeping Lead",
    escalationThreshold: "Escalate to Duty Manager if unresolved within shift window",
    aiSupportAllowed: ["Classify", "Recommend reallocation", "Forecast breach risk"],
    humanApprovalRequired: false,
    outcomeMeasures: ["Response completed", "Follow-up required"],
  },
  {
    id: "moment-staff-support",
    name: "Staff Support Moment",
    triggeringSignals: ["Staff safety concern", "Missed handover", "Staffing pressure"],
    riskLevel: "Medium",
    valueAtStake: "Staff wellbeing, service continuity, retention",
    governanceSources: ["Staff Safety Procedure"],
    likelyPlaybooks: ["Handover Recovery", "Staff Welfare Check"],
    primaryOwner: "Duty Manager",
    escalationThreshold: "Escalate to General Manager for repeated safety concerns",
    aiSupportAllowed: ["Classify", "Summarise handover gap"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Response completed", "Issue resolved"],
  },
  {
    id: "moment-commercial-opportunity",
    name: "Commercial Opportunity Moment",
    triggeringSignals: ["Upsell opportunity", "Dining interest", "Local experience interest"],
    riskLevel: "Low",
    valueAtStake: "Ancillary revenue, guest experience enhancement",
    governanceSources: ["Loyalty Treatment Standard"],
    likelyPlaybooks: ["Upsell Offer", "Local Experience Referral"],
    primaryOwner: "Concierge / Front Desk",
    escalationThreshold: "No escalation required — informational only",
    aiSupportAllowed: ["Classify", "Draft offer", "Rank propensity"],
    humanApprovalRequired: false,
    outcomeMeasures: ["Commercial conversion", "Guest acknowledged"],
  },
  {
    id: "moment-partner-activation",
    name: "Partner Activation Moment",
    triggeringSignals: ["Local provider availability", "Transport requirement", "Booking conversion"],
    riskLevel: "Low",
    valueAtStake: "Partner revenue share, guest experience, partner relationship",
    governanceSources: ["Partner Approval Standard"],
    likelyPlaybooks: ["Partner Referral", "Partner Capacity Match"],
    primaryOwner: "Partner Provider / Concierge",
    escalationThreshold: "Escalate to Regional Operator on repeated partner service failure",
    aiSupportAllowed: ["Classify", "Match guest need to available partner"],
    humanApprovalRequired: false,
    outcomeMeasures: ["Partner activated", "Commercial conversion"],
  },
  {
    id: "moment-post-stay-recovery",
    name: "Post-Stay Recovery Moment",
    triggeringSignals: ["Negative sentiment", "Repeat complaint"],
    riskLevel: "Medium",
    valueAtStake: "Review outcome, repeat-stay likelihood, brand reputation",
    governanceSources: ["Guest Service Recovery Policy", "Complaint Escalation SOP"],
    likelyPlaybooks: ["Post-Stay Outreach", "Compensation Follow-up"],
    primaryOwner: "Guest Relations / General Manager",
    escalationThreshold: "Escalate to General Manager for public review risk",
    aiSupportAllowed: ["Classify", "Draft outreach message"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Post-stay outcome", "Review prevention", "Unresolved / further review"],
  },
  {
    id: "moment-reputation-risk",
    name: "Reputation Risk Moment",
    triggeringSignals: ["Negative sentiment", "Repeat complaint", "Service disruption"],
    riskLevel: "High",
    valueAtStake: "Public review exposure, brand and portfolio reputation",
    governanceSources: ["Complaint Escalation SOP", "Guest Service Recovery Policy"],
    likelyPlaybooks: ["Executive Recovery Escalation", "Public Response Coordination"],
    primaryOwner: "General Manager / Brand Executive",
    escalationThreshold: "Immediate escalation on any public or social signal",
    aiSupportAllowed: ["Classify", "Summarise exposure", "Draft coordinated response"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Escalation completed", "Evidence captured", "Review prevention"],
  },
];

// ── 3. TRAVEL GOVERNANCE SOURCES ───────────────────────────────────────────

export interface TravelGovernanceSource {
  id: string;
  name: string;
  description: string;
}

export const TRAVEL_GOVERNANCE_SOURCES: TravelGovernanceSource[] = [
  { id: "gov-service-recovery",     name: "Guest Service Recovery Policy",  description: "Defines approved recovery gestures, tone and escalation path for guest dissatisfaction." },
  { id: "gov-compensation-matrix",  name: "Compensation Approval Matrix",   description: "Sets the compensation tiers each role is authorised to approve without further sign-off." },
  { id: "gov-guest-safety",         name: "Guest Safety Procedure",         description: "The governed procedure for any guest safety or welfare signal." },
  { id: "gov-medical-assistance",   name: "Medical Assistance Procedure",   description: "The governed procedure for medical assistance requests, including required notifications." },
  { id: "gov-room-readiness",       name: "Room Readiness SOP",             description: "Standard operating procedure for room turnaround and readiness against arrival schedule." },
  { id: "gov-complaint-escalation", name: "Complaint Escalation SOP",       description: "Defines when and how a guest complaint is escalated beyond front-line staff." },
  { id: "gov-loyalty-treatment",    name: "Loyalty Treatment Standard",     description: "The recognition and treatment standard owed to each loyalty tier." },
  { id: "gov-staff-safety",         name: "Staff Safety Procedure",         description: "The governed procedure for any staff safety concern raised on shift." },
  { id: "gov-partner-approval",     name: "Partner Approval Standard",      description: "The approval standard a partner must meet before receiving guest referrals." },
  { id: "gov-privacy-consent",      name: "Privacy and Consent Rules",      description: "Governs what guest and staff data may be captured, stored and acted on, and under what consent." },
  { id: "gov-critical-incident",    name: "Critical Incident Procedure",    description: "The governed procedure for any critical safety or security incident, including reporting obligations." },
];

// ── 4. TRAVEL ROLE MODEL ───────────────────────────────────────────────────

export interface TravelRole {
  id: string;
  name: string;
  sees: string;
  canDo: string;
  cannotDo: string;
  owns: string;
  canApprove: string;
  triggersEscalation: string;
  linkedPlaybooks: string[];
  linkedCommunications: string;
  outcomeResponsibility: string;
}

export const TRAVEL_ROLE_MODEL: TravelRole[] = [
  {
    id: "role-guest",
    name: "Guest",
    sees: "The Guest-facing Experience — support prompts, recovery offers, in-stay nudges.",
    canDo: "Raise a request, respond to a prompt, accept or decline an offer.",
    cannotDo: "See operator data, other guests' data, or internal governance and playbook detail.",
    owns: "Their own request and response to any offer made to them.",
    canApprove: "Nothing on the operator side — approvals are one-directional to the guest.",
    triggersEscalation: "A distress, safety or repeated dissatisfaction signal.",
    linkedPlaybooks: ["Service Recovery Gesture", "Welfare Check"],
    linkedCommunications: "Approved Guest Channel push, SMS, or in-app messages, drafted within approved tone.",
    outcomeResponsibility: "None — outcome ownership sits with the responding role.",
  },
  {
    id: "role-front-desk",
    name: "Front Desk",
    sees: "Live moment queue for arrivals, check-in and lobby-facing signals.",
    canDo: "Action low/medium-risk moments, issue standard-tier gestures, log service requests.",
    cannotDo: "Approve compensation above standard tier, close a safety or welfare moment.",
    owns: "Arrival experience and lobby-facing service moments.",
    canApprove: "Standard-tier compensation gestures per the Compensation Approval Matrix.",
    triggersEscalation: "Any welfare, safety or above-standard compensation need.",
    linkedPlaybooks: ["Service Recovery Gesture", "Upsell Offer"],
    linkedCommunications: "Guest-facing Experience messages; staff task assignment.",
    outcomeResponsibility: "Response time and completion for lobby and check-in moments.",
  },
  {
    id: "role-housekeeping",
    name: "Housekeeping",
    sees: "Room readiness pipeline, task queue, maintenance flags for assigned rooms.",
    canDo: "Update room status, flag maintenance issues, reprioritise assigned tasks.",
    cannotDo: "Approve guest compensation or communicate directly with guests on service recovery.",
    owns: "Room readiness and room-level maintenance flagging.",
    canApprove: "Nothing guest-facing — operational task changes only.",
    triggersEscalation: "A backlog risk against upcoming arrivals, or a safety-relevant maintenance issue.",
    linkedPlaybooks: ["Staff Reallocation", "Room Recovery Offer"],
    linkedCommunications: "Internal task and handover messages.",
    outcomeResponsibility: "Room readiness completion rate.",
  },
  {
    id: "role-concierge",
    name: "Concierge",
    sees: "Commercial opportunity and partner activation moments for their assigned guests.",
    canDo: "Recommend and book local experiences, dining and transport; refer to partners.",
    cannotDo: "Approve compensation or override loyalty treatment standards.",
    owns: "Guest experience recommendations and partner referrals.",
    canApprove: "Standard partner bookings within pre-approved partner list.",
    triggersEscalation: "A partner service failure or capacity shortfall.",
    linkedPlaybooks: ["Local Experience Referral", "Partner Referral"],
    linkedCommunications: "Guest-facing recommendation messages; partner coordination messages.",
    outcomeResponsibility: "Partner activation and commercial conversion for referred guests.",
  },
  {
    id: "role-duty-manager",
    name: "Duty Manager",
    sees: "All open moments on shift across guest, staff and safety categories for the property.",
    canDo: "Approve mid-tier compensation, action welfare and staff-support moments, reallocate resources.",
    cannotDo: "Override Critical Incident Procedure or approve top-tier compensation without General Manager sign-off.",
    owns: "Shift-level moment resolution across all categories.",
    canApprove: "Mid-tier compensation and welfare-check dispatch per governance.",
    triggersEscalation: "Any Critical-risk moment or unresolved High-risk moment past threshold.",
    linkedPlaybooks: ["Duty Manager Callback", "Welfare Check", "Staff Welfare Check"],
    linkedCommunications: "Guest recovery calls/messages; staff coordination messages.",
    outcomeResponsibility: "Shift-level recovery rate and escalation quality.",
  },
  {
    id: "role-general-manager",
    name: "General Manager",
    sees: "Property-level moment dashboard, escalations, evidence trail, value reporting.",
    canDo: "Approve top-tier compensation, authorise executive-level recovery, own reputation-risk response.",
    cannotDo: "Bypass Critical Incident Procedure reporting obligations.",
    owns: "Property-level outcome, reputation and value performance.",
    canApprove: "Top-tier compensation and executive-level recovery gestures.",
    triggersEscalation: "Reputation-risk or portfolio-visible incidents, to Brand / Group Executive.",
    linkedPlaybooks: ["Executive Recovery Escalation", "Post-Stay Outreach"],
    linkedCommunications: "Executive-level guest outreach; portfolio reporting.",
    outcomeResponsibility: "Property-wide outcome, evidence completeness and value proof.",
  },
  {
    id: "role-security",
    name: "Security",
    sees: "Safety and security moment queue, incident reports, restricted-access signals.",
    canDo: "Respond to and log security concerns, coordinate with emergency services where required.",
    cannotDo: "Approve guest compensation or override medical response protocol ownership.",
    owns: "Physical safety and security response.",
    canApprove: "Access and restriction decisions within security policy.",
    triggersEscalation: "Any Critical-risk safety or security signal.",
    linkedPlaybooks: ["Security Response Protocol", "Medical Response Protocol"],
    linkedCommunications: "Internal incident coordination; emergency services liaison where required.",
    outcomeResponsibility: "Incident response time and evidence capture completeness.",
  },
  {
    id: "role-maintenance",
    name: "Maintenance",
    sees: "Maintenance issue queue with priority and safety flags.",
    canDo: "Action and close maintenance tasks, flag safety-relevant faults.",
    cannotDo: "Approve compensation or communicate directly with guests on service recovery.",
    owns: "Physical asset and equipment fault resolution.",
    canApprove: "Nothing guest-facing.",
    triggersEscalation: "A safety-relevant fault or a fault affecting multiple rooms.",
    linkedPlaybooks: ["Staff Reallocation"],
    linkedCommunications: "Internal task and handover messages.",
    outcomeResponsibility: "Maintenance issue resolution time.",
  },
  {
    id: "role-revenue-loyalty-lead",
    name: "Revenue / Loyalty Lead",
    sees: "Loyalty risk signals, tier movement, commercial opportunity moments.",
    canDo: "Approve loyalty recognition gestures and tier retention offers within standard.",
    cannotDo: "Override safety or welfare governance.",
    owns: "Loyalty protection and ancillary revenue performance.",
    canApprove: "Loyalty recognition and retention gestures per the Loyalty Treatment Standard.",
    triggersEscalation: "A top-tier member at risk requiring General Manager visibility.",
    linkedPlaybooks: ["Loyalty Recognition Gesture", "Tier Retention Offer", "Upsell Offer"],
    linkedCommunications: "Loyalty recognition messages; commercial offer messages.",
    outcomeResponsibility: "Loyalty protection rate and ancillary revenue.",
  },
  {
    id: "role-partner-provider",
    name: "Partner Provider",
    sees: "Referrals and capacity requests relevant to their service.",
    canDo: "Accept or decline referrals, report capacity and service delivery status.",
    cannotDo: "Access guest data beyond what is required to deliver the referred service.",
    owns: "Delivery quality of their referred service.",
    canApprove: "Their own capacity availability.",
    triggersEscalation: "A service failure or repeated quality signal.",
    linkedPlaybooks: ["Partner Referral", "Partner Capacity Match"],
    linkedCommunications: "Referral confirmation and delivery status messages.",
    outcomeResponsibility: "Partner-side service delivery and quality signal.",
  },
  {
    id: "role-regional-operator",
    name: "Regional Operator",
    sees: "Portfolio-level moment and value performance across managed properties.",
    canDo: "Approve cross-property resource decisions and partner standard changes.",
    cannotDo: "Override a single property's live safety or welfare response.",
    owns: "Portfolio-level consistency and partner network quality.",
    canApprove: "Partner approval standard changes across the region.",
    triggersEscalation: "A cross-property pattern requiring Brand / Group Executive visibility.",
    linkedPlaybooks: ["Partner Capacity Match"],
    linkedCommunications: "Portfolio reporting and partner network communications.",
    outcomeResponsibility: "Portfolio-level consistency and partner performance.",
  },
  {
    id: "role-brand-group-executive",
    name: "Brand / Group Executive",
    sees: "Group-level value proof, reputation risk exposure, governance alignment reporting.",
    canDo: "Set governance policy, approve group-level reputation response.",
    cannotDo: "Act as the first responder to a live property-level moment.",
    owns: "Brand reputation and group-level governance standard.",
    canApprove: "Governance policy changes and group-level public response.",
    triggersEscalation: "Not an escalation recipient beyond — highest point of the ownership chain.",
    linkedPlaybooks: ["Executive Recovery Escalation", "Public Response Coordination"],
    linkedCommunications: "Group and public-facing communications where required.",
    outcomeResponsibility: "Group-level reputation, governance alignment and value proof.",
  },
];

// ── 5. TRAVEL AI ASSISTANT MODEL ───────────────────────────────────────────

export interface TravelAiBoundary {
  allowed: string[];
  requiresHumanApproval: string[];
  statement: string;
}

export const TRAVEL_AI_ASSISTANT_MODEL: TravelAiBoundary = {
  allowed: [
    "Classify a signal into a moment type",
    "Summarise context for a human owner",
    "Recommend a governed playbook or response tier",
    "Draft a guest or staff communication for human or policy-approved send",
    "Coordinate routing and notification to the correct role owner",
  ],
  requiresHumanApproval: [
    "Safety decisions",
    "Guest or staff welfare decisions",
    "Compensation approval above the pre-authorised standard tier",
    "Legal or regulatory matters",
    "Security response actions",
    "Critical operational decisions with material guest, staff or brand impact",
  ],
  statement: "AI may classify, summarise, recommend, draft and coordinate. Human approval remains required for safety, welfare, compensation, legal, security and critical operational decisions.",
};

// ── 6. TRAVEL OUTCOME MODEL ────────────────────────────────────────────────

export interface TravelOutcome {
  id: string;
  name: string;
  description: string;
}

export const TRAVEL_OUTCOME_MODEL: TravelOutcome[] = [
  { id: "out-response-started",       name: "Response started",        description: "A role owner has begun acting on a classified moment." },
  { id: "out-response-completed",     name: "Response completed",      description: "The governed response to a moment has been carried out." },
  { id: "out-guest-acknowledged",     name: "Guest acknowledged",      description: "The guest has received confirmation their signal was seen and understood." },
  { id: "out-issue-resolved",         name: "Issue resolved",          description: "The underlying issue behind the moment has been resolved." },
  { id: "out-guest-recovered",        name: "Guest recovered",         description: "The guest's sentiment or experience has been restored following a recovery response." },
  { id: "out-compensation-approved",  name: "Compensation approved",   description: "A compensation gesture has been approved by the authorised role owner." },
  { id: "out-escalation-completed",   name: "Escalation completed",    description: "An escalated moment has reached and been actioned by the correct escalation owner." },
  { id: "out-follow-up-required",     name: "Follow-up required",      description: "The moment requires a further scheduled action beyond the immediate response." },
  { id: "out-partner-activated",      name: "Partner activated",       description: "A partner has been engaged to deliver part of the response." },
  { id: "out-commercial-conversion",  name: "Commercial conversion",   description: "A commercial opportunity moment has converted into revenue." },
  { id: "out-evidence-captured",      name: "Evidence captured",       description: "The signal, moment, action and outcome have been logged to the assurance record." },
  { id: "out-post-stay-outcome",      name: "Post-stay outcome",       description: "The final recorded result of a moment that extended beyond checkout." },
  { id: "out-unresolved",             name: "Unresolved / further review", description: "The moment could not be closed and requires further review." },
];

// ── 7. TRAVEL VALUE MODEL ──────────────────────────────────────────────────

export interface TravelValueMeasure {
  id: string;
  name: string;
}

export interface TravelValueCategory {
  id: string;
  label: string;
  measures: TravelValueMeasure[];
}

export const TRAVEL_VALUE_MODEL: TravelValueCategory[] = [
  {
    id: "value-operational",
    label: "Operational",
    measures: [
      { id: "val-response-time",         name: "Response time" },
      { id: "val-completion-rate",       name: "Completion rate" },
      { id: "val-staff-time-saved",      name: "Staff time saved" },
      { id: "val-consistency",           name: "Consistency across properties" },
    ],
  },
  {
    id: "value-guest",
    label: "Guest",
    measures: [
      { id: "val-recovery-rate",         name: "Recovery rate" },
      { id: "val-satisfaction-movement", name: "Satisfaction movement" },
      { id: "val-loyalty-protection",    name: "Loyalty protection" },
      { id: "val-complaint-closure",     name: "Complaint closure" },
      { id: "val-review-prevention",     name: "Review prevention" },
    ],
  },
  {
    id: "value-commercial",
    label: "Commercial",
    measures: [
      { id: "val-ancillary-revenue",     name: "Ancillary revenue" },
      { id: "val-partner-conversion",    name: "Partner conversion" },
      { id: "val-loyalty-activation",    name: "Loyalty activation" },
      { id: "val-repeat-stay",           name: "Repeat-stay protection" },
    ],
  },
  {
    id: "value-risk",
    label: "Risk",
    measures: [
      { id: "val-safety-quality",        name: "Safety escalation quality" },
      { id: "val-evidence-completeness", name: "Evidence completeness" },
      { id: "val-governance-alignment",  name: "Governance alignment" },
      { id: "val-unresolved-high-risk",  name: "Unresolved high-risk moments" },
    ],
  },
];

// ── 8. TRAVEL INTEGRATION MAP ──────────────────────────────────────────────

export interface TravelIntegration {
  id: string;
  name: string;
  description: string;
}

export const TRAVEL_INTEGRATION_MAP: TravelIntegration[] = [
  { id: "int-pms",          name: "Property Management System (PMS)", description: "Reservation, arrival, departure and room-status signal source." },
  { id: "int-crm",          name: "CRM / Loyalty Platform",            description: "Guest profile, loyalty tier and history signal source." },
  { id: "int-housekeeping", name: "Housekeeping Software",             description: "Room readiness and task-status signal source." },
  { id: "int-staff-app",    name: "Staff Task / Comms App",            description: "Delivery channel for staff task assignment and role-owner notification." },
  { id: "int-guest-app",    name: "Guest Interface",                   description: "Guest-facing delivery surface for prompts, offers and recovery communication." },
  { id: "int-pos",          name: "Point of Sale (POS)",               description: "Dining, retail and ancillary spend signal source." },
  { id: "int-sensor-iot",   name: "Sensor / IoT & Building Management", description: "Queue depth, environmental and facility signal source." },
  { id: "int-partner-network", name: "Local Partner Network",          description: "Referral, capacity and quality signal exchange with approved local partners." },
];
