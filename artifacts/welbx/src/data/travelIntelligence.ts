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
  { id: "sig-partner-capacity",       name: "Partner capacity",         domain: "Partner", description: "Synthetic input modelling partner capacity that a named human could review before any future referral or booking." },
  { id: "sig-booking-conversion",     name: "Modelled booking-conversion signal", domain: "Partner", description: "Synthetic input representing a possible future confirmation from an integrated booking system; no booking or referral occurs." },
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
    aiSupportAllowed: ["Propose a classification", "Propose a recovery-message draft", "Propose a gesture tier for Duty Manager review"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled guest recovery", "Proposed compensation awaiting authorised human review", "Indicative review prevention"],
  },
  {
    id: "moment-guest-welfare",
    name: "Guest Welfare Moment",
    triggeringSignals: ["Guest distress", "Vulnerable guest signal"],
    riskLevel: "High",
    valueAtStake: "Guest wellbeing, duty of care, brand reputation",
    governanceSources: ["Guest Safety Procedure", "Privacy and Consent Rules"],
    likelyPlaybooks: ["Proposed human-led Welfare Check", "Proposed Discreet Support Escalation"],
    primaryOwner: "Duty Manager",
    escalationThreshold: "Immediate escalation on any welfare signal above Low",
    aiSupportAllowed: ["Propose a classification", "Propose a context summary for the Duty Manager"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled guest acknowledgement", "Modelled issue resolution", "Simulated evidence record"],
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
    escalationThreshold: "Immediate proposed escalation to the named Security / Duty Manager, who alone decides whether to contact on-site or emergency services",
    aiSupportAllowed: ["Propose a classification", "Propose notifications for named-human review; send nothing"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled response state", "Modelled escalation state", "Simulated evidence record"],
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
    aiSupportAllowed: ["Propose a classification", "Propose a recognition-message draft", "Propose a gesture for Revenue / Loyalty Lead review"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Indicative loyalty protection", "Modelled guest acknowledgement", "Modelled commercial-conversion state"],
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
    aiSupportAllowed: ["Propose a classification", "Propose reallocation for the Front Desk / Housekeeping Lead", "Propose a breach-risk forecast"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled response state", "Proposed human follow-up"],
  },
  {
    id: "moment-staff-support",
    name: "Staff Support Moment",
    triggeringSignals: ["Staff safety concern", "Missed handover", "Staffing pressure"],
    riskLevel: "Medium",
    valueAtStake: "Staff wellbeing, service continuity, retention",
    governanceSources: ["Staff Safety Procedure"],
    likelyPlaybooks: ["Proposed Handover Recovery", "Proposed human-led Staff Welfare Check"],
    primaryOwner: "Duty Manager",
    escalationThreshold: "Escalate to General Manager for repeated safety concerns",
    aiSupportAllowed: ["Propose a classification", "Propose a handover-gap summary for the Duty Manager"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled response state", "Modelled issue resolution"],
  },
  {
    id: "moment-commercial-opportunity",
    name: "Commercial Opportunity Moment",
    triggeringSignals: ["Upsell opportunity", "Dining interest", "Local experience interest"],
    riskLevel: "Low",
    valueAtStake: "Ancillary revenue, guest experience enhancement",
    governanceSources: ["Loyalty Treatment Standard"],
    likelyPlaybooks: ["Proposed Upsell Offer", "Proposed human-reviewed Local Experience Referral"],
    primaryOwner: "Concierge / Front Desk",
    escalationThreshold: "No escalation required — informational only",
    aiSupportAllowed: ["Propose a classification", "Propose an offer draft for Concierge / Front Desk review", "Propose a propensity ranking"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled commercial-conversion state", "Modelled guest acknowledgement"],
  },
  {
    id: "moment-partner-activation",
    name: "Partner Activation Moment",
    triggeringSignals: ["Local provider availability", "Transport requirement", "Booking conversion"],
    riskLevel: "Low",
    valueAtStake: "Partner revenue share, guest experience, partner relationship",
    governanceSources: ["Partner Approval Standard"],
    likelyPlaybooks: ["Proposed human-reviewed Partner Referral", "Proposed Partner Capacity Match"],
    primaryOwner: "Partner Provider / Concierge",
    escalationThreshold: "Escalate to Regional Operator on repeated partner service failure",
    aiSupportAllowed: ["Propose a classification", "Propose a partner match for Partner Provider / Concierge review; make no referral or booking"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled partner-activation state", "Modelled commercial-conversion state"],
  },
  {
    id: "moment-post-stay-recovery",
    name: "Post-Stay Recovery Moment",
    triggeringSignals: ["Negative sentiment", "Repeat complaint"],
    riskLevel: "Medium",
    valueAtStake: "Review outcome, repeat-stay likelihood, brand reputation",
    governanceSources: ["Guest Service Recovery Policy", "Complaint Escalation SOP"],
    likelyPlaybooks: ["Proposed human-reviewed Post-Stay Outreach", "Proposed compensation follow-up"],
    primaryOwner: "Guest Relations / General Manager",
    escalationThreshold: "Escalate to General Manager for public review risk",
    aiSupportAllowed: ["Propose a classification", "Propose an outreach-message draft for Guest Relations / General Manager review"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled post-stay outcome", "Indicative review prevention", "Modelled unresolved / further-review state"],
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
    aiSupportAllowed: ["Propose a classification", "Propose an exposure summary", "Propose a response draft for General Manager / Brand Executive review"],
    humanApprovalRequired: true,
    outcomeMeasures: ["Modelled escalation state", "Simulated evidence record", "Indicative review prevention"],
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
  { id: "gov-compensation-matrix",  name: "Compensation Approval Matrix",   description: "Proposed policy source for the tiers a named human could review; this proof approves or issues no compensation." },
  { id: "gov-guest-safety",         name: "Guest Safety Procedure",         description: "The governed procedure for any guest safety or welfare signal." },
  { id: "gov-medical-assistance",   name: "Medical Assistance Procedure",   description: "Proposed reference for named-human handling of medical requests; this proof sends no notification or emergency-service contact." },
  { id: "gov-room-readiness",       name: "Room Readiness SOP",             description: "Standard operating procedure for room turnaround and readiness against arrival schedule." },
  { id: "gov-complaint-escalation", name: "Complaint Escalation SOP",       description: "Defines when and how a guest complaint is escalated beyond front-line staff." },
  { id: "gov-loyalty-treatment",    name: "Loyalty Treatment Standard",     description: "The recognition and treatment standard owed to each loyalty tier." },
  { id: "gov-staff-safety",         name: "Staff Safety Procedure",         description: "The governed procedure for any staff safety concern raised on shift." },
  { id: "gov-partner-approval",     name: "Partner Approval Standard",      description: "Proposed standard for human review before any future external referral; this proof refers no guest." },
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
    canDo: "In a future deployment, raise a request and submit a proposed response to a prompt or offer for operator review.",
    cannotDo: "See operator data, other guests' data, or internal governance and playbook detail.",
    owns: "In the proposed operating model, their own request and response to a human-approved offer.",
    canApprove: "Nothing on the operator side — approvals are one-directional to the guest.",
    triggersEscalation: "Proposed named-human review on a synthetic distress, safety or repeated-dissatisfaction signal.",
    linkedPlaybooks: ["Service Recovery Gesture", "Welfare Check"],
    linkedCommunications: "Planned Guest Channel push, SMS or in-app drafts; a named operator must review and send through an external system.",
    outcomeResponsibility: "None — outcome ownership sits with the responding role.",
  },
  {
    id: "role-front-desk",
    name: "Front Desk",
    sees: "Simulated moment queue built from synthetic arrival, check-in and lobby-facing inputs.",
    canDo: "Proposed future capability: review low/medium-risk moments, propose standard-tier gestures and log service-request drafts.",
    cannotDo: "Approve compensation above standard tier, close a safety or welfare moment.",
    owns: "Arrival experience and lobby-facing service moments.",
    canApprove: "Proposed human authority: review standard-tier compensation under the Compensation Approval Matrix; this proof approves or issues nothing.",
    triggersEscalation: "Proposed escalation to the Duty Manager for human review of any welfare, safety or compensation need.",
    linkedPlaybooks: ["Service Recovery Gesture", "Upsell Offer"],
    linkedCommunications: "Planned guest-message drafts and proposed staff-task assignments; no message or task is sent.",
    outcomeResponsibility: "Named human accountable for future lobby/check-in responses; displayed completion is modelled.",
  },
  {
    id: "role-housekeeping",
    name: "Housekeeping",
    sees: "Room readiness pipeline, task queue, maintenance flags for assigned rooms.",
    canDo: "Proposed future capability: submit room-status updates, flag issues and propose task reprioritisation for human review.",
    cannotDo: "Approve guest compensation or communicate directly with guests on service recovery.",
    owns: "Room readiness and room-level maintenance flagging.",
    canApprove: "Proposed human authority covers operational task changes only; this proof changes no external task.",
    triggersEscalation: "A backlog risk against upcoming arrivals, or a safety-relevant maintenance issue.",
    linkedPlaybooks: ["Staff Reallocation", "Room Recovery Offer"],
    linkedCommunications: "Internal task and handover messages.",
    outcomeResponsibility: "Named human accountable for room readiness; displayed completion rate is modelled and unmeasured.",
  },
  {
    id: "role-concierge",
    name: "Concierge",
    sees: "Commercial opportunity and partner activation moments for their assigned guests.",
    canDo: "Proposed future capability: review recommendations and proposed local-experience, dining, transport or partner referrals; booking and referral remain external human actions.",
    cannotDo: "Approve compensation or override loyalty treatment standards.",
    owns: "In the proposed operating model, human review of guest recommendations and partner referrals.",
    canApprove: "Proposed human authority to approve a booking request for execution in an external system; this proof books nothing.",
    triggersEscalation: "Proposed escalation to a named human for a modelled partner failure or capacity shortfall.",
    linkedPlaybooks: ["Local Experience Referral", "Partner Referral"],
    linkedCommunications: "Planned guest recommendation and partner-coordination drafts; no external update is sent.",
    outcomeResponsibility: "Named human accountable for future referrals; activation and conversion shown here are modelled, not achieved.",
  },
  {
    id: "role-duty-manager",
    name: "Duty Manager",
    sees: "All simulated open moments across synthetic guest, staff and safety categories for the modelled property.",
    canDo: "Proposed future human capability: review mid-tier compensation, decide welfare/staff-support actions and authorise resource reallocation outside this proof.",
    cannotDo: "Override Critical Incident Procedure or approve top-tier compensation without General Manager sign-off.",
    owns: "In the proposed operating model, human accountability for shift-level moment resolution.",
    canApprove: "Proposed human authority to approve compensation or a welfare check under governance; this proof approves and dispatches nothing.",
    triggersEscalation: "Proposed named-human escalation for any modelled Critical-risk or overdue High-risk moment.",
    linkedPlaybooks: ["Duty Manager Callback", "Welfare Check", "Staff Welfare Check"],
    linkedCommunications: "Planned guest-recovery and staff-coordination drafts; the Duty Manager decides and sends externally.",
    outcomeResponsibility: "Named human accountable for future shift recovery; displayed results are modelled.",
  },
  {
    id: "role-general-manager",
    name: "General Manager",
    sees: "Property-level moment dashboard, escalations, evidence trail, value reporting.",
    canDo: "Proposed future human capability: review top-tier compensation, authorise recovery actions and decide reputation-risk responses outside this proof.",
    cannotDo: "Bypass Critical Incident Procedure reporting obligations.",
    owns: "Property-level outcome, reputation and value performance.",
    canApprove: "Proposed human authority for top-tier compensation and recovery gestures; this proof approves or issues nothing.",
    triggersEscalation: "Reputation-risk or portfolio-visible incidents, to Brand / Group Executive.",
    linkedPlaybooks: ["Executive Recovery Escalation", "Post-Stay Outreach"],
    linkedCommunications: "Planned executive outreach and reporting drafts; no external update is sent.",
    outcomeResponsibility: "Named human accountable for future property outcomes; evidence and value shown are simulated and unmeasured.",
  },
  {
    id: "role-security",
    name: "Security",
    sees: "Safety and security moment queue, incident reports, restricted-access signals.",
    canDo: "Proposed future human capability: assess and log security concerns and independently decide whether to contact emergency services outside this proof.",
    cannotDo: "Approve guest compensation or override medical response protocol ownership.",
    owns: "In the proposed operating model, human accountability for physical safety and security response.",
    canApprove: "Proposed human authority for access and restriction decisions outside this proof.",
    triggersEscalation: "Proposed immediate review by the named Security / Duty Manager for any synthetic Critical-risk signal.",
    linkedPlaybooks: ["Security Response Protocol", "Medical Response Protocol"],
    linkedCommunications: "Planned incident-coordination drafts only; this proof never contacts emergency services or sends external updates.",
    outcomeResponsibility: "Named human accountable for future incident response; displayed timing and evidence are modelled.",
  },
  {
    id: "role-maintenance",
    name: "Maintenance",
    sees: "Maintenance issue queue with priority and safety flags.",
    canDo: "Proposed future capability: review maintenance tasks, propose closure and flag safety-relevant faults for named-human action.",
    cannotDo: "Approve compensation or communicate directly with guests on service recovery.",
    owns: "In the proposed operating model, human accountability for physical-asset and equipment-fault resolution.",
    canApprove: "Nothing guest-facing.",
    triggersEscalation: "A safety-relevant fault or a fault affecting multiple rooms.",
    linkedPlaybooks: ["Staff Reallocation"],
    linkedCommunications: "Planned internal task and handover drafts; no task is dispatched, updated or closed.",
    outcomeResponsibility: "Named human accountable for future maintenance resolution; displayed timing is modelled.",
  },
  {
    id: "role-revenue-loyalty-lead",
    name: "Revenue / Loyalty Lead",
    sees: "Loyalty risk signals, tier movement, commercial opportunity moments.",
    canDo: "Proposed future human capability: review loyalty gestures and tier-retention offers under the standard; this proof approves nothing.",
    cannotDo: "Override safety or welfare governance.",
    owns: "Loyalty protection and ancillary revenue performance.",
    canApprove: "Proposed human authority for loyalty gestures under the Loyalty Treatment Standard; execution remains external.",
    triggersEscalation: "A top-tier member at risk requiring General Manager visibility.",
    linkedPlaybooks: ["Loyalty Recognition Gesture", "Tier Retention Offer", "Upsell Offer"],
    linkedCommunications: "Loyalty recognition messages; commercial offer messages.",
    outcomeResponsibility: "Named human accountable for future loyalty activity; protection and revenue shown are indicative and unmeasured.",
  },
  {
    id: "role-partner-provider",
    name: "Partner Provider",
    sees: "Synthetic, modelled referrals and capacity requests relevant to their service.",
    canDo: "Proposed future capability: review referral drafts and submit capacity or delivery updates through an external system.",
    cannotDo: "Access guest data beyond what is required to deliver the referred service.",
    owns: "In the proposed operating model, delivery quality for human-approved external referrals.",
    canApprove: "Proposed human authority over capacity availability; this proof changes no external availability.",
    triggersEscalation: "A service failure or repeated quality signal.",
    linkedPlaybooks: ["Partner Referral", "Partner Capacity Match"],
    linkedCommunications: "Planned referral and delivery-status drafts; no confirmation or external update is sent.",
    outcomeResponsibility: "Named human accountable for future partner delivery; displayed results are modelled.",
  },
  {
    id: "role-regional-operator",
    name: "Regional Operator",
    sees: "Portfolio-level moment and value performance across managed properties.",
    canDo: "Proposed future human capability: review cross-property resource decisions and partner-standard changes outside this proof.",
    cannotDo: "Override a property's real-world safety or welfare response; this proof performs neither.",
    owns: "Portfolio-level consistency and partner network quality.",
    canApprove: "Proposed human authority for regional partner-standard changes; this proof updates no partner.",
    triggersEscalation: "A cross-property pattern requiring Brand / Group Executive visibility.",
    linkedPlaybooks: ["Partner Capacity Match"],
    linkedCommunications: "Planned portfolio and partner-network drafts; no external communication is sent.",
    outcomeResponsibility: "Named human accountable for future portfolio consistency; displayed partner performance is modelled.",
  },
  {
    id: "role-brand-group-executive",
    name: "Brand / Group Executive",
    sees: "Group-level value proof, reputation risk exposure, governance alignment reporting.",
    canDo: "Proposed future human capability: set governance policy and approve group-level reputation responses outside this proof.",
    cannotDo: "Act as the first responder to a real-world property-level moment; this proof contains none.",
    owns: "Brand reputation and group-level governance standard.",
    canApprove: "Proposed human authority for policy changes and public responses; this proof publishes no update.",
    triggersEscalation: "Not an escalation recipient beyond — highest point of the ownership chain.",
    linkedPlaybooks: ["Executive Recovery Escalation", "Public Response Coordination"],
    linkedCommunications: "Planned group and public-facing drafts; no external communication is sent.",
    outcomeResponsibility: "Named human accountable for future group outcomes; reputation and value shown are modelled and unmeasured.",
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
    "Planned: propose a signal classification for a named human owner; deterministic rules are the fallback",
    "Planned: propose a context summary for a named human owner",
    "Planned: propose a governed playbook or response tier for human review",
    "Planned: propose a guest or staff communication draft; send nothing",
    "Planned: propose routing to the named human owner; dispatch no task or notification",
  ],
  requiresHumanApproval: [
    "All safety decisions and any emergency-service contact",
    "All guest or staff welfare decisions and checks",
    "All compensation approval and execution",
    "All bookings and partner referrals",
    "All task closure and external updates",
    "Legal or regulatory matters",
    "Security response actions",
    "Critical operational decisions with material guest, staff or brand impact",
  ],
  statement: "AI is Planned only. Current classification is deterministic and rules-based, and those rules remain the fallback. Planned AI could only propose classifications, summaries, recommendations, drafts or routing to a named accountable human. No dispatch, booking, referral, welfare check, compensation, emergency-service contact, task closure or external update occurs.",
};

// ── 6. TRAVEL OUTCOME MODEL ────────────────────────────────────────────────

export interface TravelOutcome {
  id: string;
  name: string;
  description: string;
}

export const TRAVEL_OUTCOME_MODEL: TravelOutcome[] = [
  { id: "out-response-started",       name: "Modelled response-start state", description: "Simulation of a named role owner beginning review; no external action is evidenced." },
  { id: "out-response-completed",     name: "Modelled response-completion state", description: "Simulation state only; no real response or task has been completed." },
  { id: "out-guest-acknowledged",     name: "Modelled guest acknowledgement", description: "Simulation of acknowledgement; no guest communication is sent." },
  { id: "out-issue-resolved",         name: "Modelled issue-resolution state", description: "Simulation state only; it does not claim the underlying issue was resolved." },
  { id: "out-guest-recovered",        name: "Modelled guest-recovery state", description: "Indicative simulation of possible recovery, not an observed guest outcome." },
  { id: "out-compensation-approved",  name: "Proposed compensation for human review", description: "A modelled proposal only; no compensation is approved or issued." },
  { id: "out-escalation-completed",   name: "Modelled escalation state", description: "Simulation of a proposed escalation reaching a named human; nothing is dispatched." },
  { id: "out-follow-up-required",     name: "Proposed human follow-up", description: "A modelled prompt for a named human to consider; no action is scheduled externally." },
  { id: "out-partner-activated",      name: "Modelled partner-activation state", description: "Simulation state only; no partner is referred, booked, contacted or activated." },
  { id: "out-commercial-conversion",  name: "Modelled commercial-conversion state", description: "Indicative simulation only; no booking, transaction or revenue conversion occurs." },
  { id: "out-evidence-captured",      name: "Simulated evidence record", description: "Synthetic signal, moment, action and outcome data shown only within the proof." },
  { id: "out-post-stay-outcome",      name: "Modelled post-stay outcome", description: "Indicative simulation of a possible result, not an observed external outcome." },
  { id: "out-unresolved",             name: "Modelled further-review state", description: "Simulation state proposing further named-human review; no task is closed." },
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
      { id: "val-response-time",         name: "Indicative response time (unmeasured)" },
      { id: "val-completion-rate",       name: "Modelled completion rate (unmeasured)" },
      { id: "val-staff-time-saved",      name: "Indicative staff time saved (unmeasured)" },
      { id: "val-consistency",           name: "Indicative consistency across properties (unmeasured)" },
    ],
  },
  {
    id: "value-guest",
    label: "Guest",
    measures: [
      { id: "val-recovery-rate",         name: "Modelled recovery rate (unmeasured)" },
      { id: "val-satisfaction-movement", name: "Indicative satisfaction movement (unmeasured)" },
      { id: "val-loyalty-protection",    name: "Indicative loyalty protection (unmeasured)" },
      { id: "val-complaint-closure",     name: "Modelled complaint-closure state (unmeasured)" },
      { id: "val-review-prevention",     name: "Indicative review prevention (unmeasured)" },
    ],
  },
  {
    id: "value-commercial",
    label: "Commercial",
    measures: [
      { id: "val-ancillary-revenue",     name: "Indicative ancillary revenue (unmeasured)" },
      { id: "val-partner-conversion",    name: "Modelled partner conversion (unmeasured)" },
      { id: "val-loyalty-activation",    name: "Modelled loyalty activation (unmeasured)" },
      { id: "val-repeat-stay",           name: "Indicative repeat-stay protection (unmeasured)" },
    ],
  },
  {
    id: "value-risk",
    label: "Risk",
    measures: [
      { id: "val-safety-quality",        name: "Modelled safety-escalation quality (unmeasured)" },
      { id: "val-evidence-completeness", name: "Simulated evidence completeness (unmeasured)" },
      { id: "val-governance-alignment",  name: "Indicative governance alignment (unmeasured)" },
      { id: "val-unresolved-high-risk",  name: "Modelled unresolved high-risk moments (unmeasured)" },
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
  { id: "int-pms",          name: "Property Management System (PMS)", description: "Planned connector; this proof uses synthetic reservation, arrival, departure and room-status inputs." },
  { id: "int-crm",          name: "CRM / Loyalty Platform",            description: "Planned connector; this proof uses synthetic guest, loyalty-tier and history inputs." },
  { id: "int-housekeeping", name: "Housekeeping Software",             description: "Planned connector; this proof uses synthetic room-readiness and task-status inputs and updates nothing." },
  { id: "int-staff-app",    name: "Staff Task / Comms App",            description: "Planned connector only; no staff task or role-owner notification is dispatched." },
  { id: "int-guest-app",    name: "Guest Interface",                   description: "Planned connector only; no guest prompt, offer or recovery communication is sent." },
  { id: "int-pos",          name: "Point of Sale (POS)",               description: "Planned connector; this proof uses synthetic dining, retail and spend inputs and records no transaction." },
  { id: "int-sensor-iot",   name: "Sensor / IoT & Building Management", description: "Planned connector; this proof uses synthetic queue, environmental and facility inputs." },
  { id: "int-partner-network", name: "Local Partner Network",          description: "Planned connector only; no referral, booking, capacity request or quality update is exchanged externally." },
];
