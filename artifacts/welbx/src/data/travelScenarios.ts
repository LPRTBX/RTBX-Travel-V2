/**
 * JALDO Travel Synthetic Scenarios — Canonical Contract.
 *
 * Sprint 3 upgrade: every scenario now carries the full canonical field set
 * (operatingSystemId, trigger, context, governance, decision, rolesConfig,
 * actionSteps, communicationDetails, escalation, evidenceRequirements,
 * outcomes, learningConfig, proof, maturityStatus, playbookId).
 *
 * Legacy fields (existingSystem, signals, moment, momentClassification,
 * governance, playbook, roles, comms, requiresEscalation, escalationNote,
 * actionLabel, actionDetail, evidence, outcome, value, learning) remain for
 * controlled replay and compatibility surfaces. The Travel Scenario Library
 * itself is read-only; runtime execution belongs to the Execution Centre.
 *
 * Synthetic demo data only — no live customer or personal data.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type MaturityStatus =
  | "working-proof"
  | "prototype"
  | "simulation"
  | "connector-ready"
  | "integrated"
  | "production"
  | "planned";

export type ProofType =
  | "working-interface"
  | "synthetic-replay"
  | "prototype"
  | "technical-test"
  | "customer-pilot"
  | "production";

export type SignalStatus =
  | "simulated"
  | "manual"
  | "demonstrated"
  | "connector-ready"
  | "integrated"
  | "planned";

export type MessageType =
  | "draft"
  | "recommendation"
  | "internal-notification"
  | "guest-message"
  | "escalation"
  | "confirmation";

// ── Legacy compatibility types ───────────────────────────────────────────────

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

// ── Canonical contract sub-types ─────────────────────────────────────────────

export interface ScenarioTrigger {
  type: string;
  description: string;
  threshold?: string;
}

export interface ScenarioSignalDetail {
  id: string;
  source: string;
  name: string;
  status: SignalStatus;
  dataRequired: string[];
}

export interface ScenarioContext {
  relevantFacts: string[];
  riskOrOpportunity: string;
  confidence?: string;
}

export interface ScenarioGovernanceConfig {
  sources: string[];
  rules: string[];
  permissions: string[];
  humanApprovalRequired: boolean;
  approvalRole?: string;
  prohibitedActions?: string[];
}

export interface ScenarioDecision {
  decisionRequired: string;
  recommendedDecision: string;
  accountableRoleId: string;
  decisionDeadline?: string;
}

export interface ScenarioRolesConfig {
  accountableRoleId: string;
  supportingRoleIds: string[];
  informedRoleIds?: string[];
}

export interface ScenarioActionStep {
  step: number;
  action: string;
  ownerRoleId: string;
  timing: string;
  channelOrSystem?: string;
  approvalRequired?: boolean;
  evidenceRequired?: string[];
}

export interface ScenarioCommunicationDetail {
  audience: string;
  purpose: string;
  channel: string;
  approvalRequired: boolean;
  messageType: MessageType;
}

export interface ScenarioEscalation {
  trigger: string;
  threshold: string;
  escalateToRoleId: string;
  action: string;
  maximumDelay?: string;
}

export interface ScenarioEvidenceRequirement {
  evidenceType: string;
  required: boolean;
  ownerRoleId: string;
  completionRule: string;
}

export interface ScenarioOutcome {
  metric: string;
  target?: string;
  measure: string;
  ownerRoleId?: string;
}

export interface ScenarioLearningConfig {
  reviewTrigger: string;
  patternToDetect: string;
  improvementAction: string;
}

export interface ScenarioProof {
  proofType: ProofType;
  source: string;
  limitations: string[];
}

// ── Full scenario interface ───────────────────────────────────────────────────

export interface TravelScenario {
  // ── Identity ──
  id: string;
  num: string;
  title: string;
  category: string;

  // ── Canonical Sprint 3 fields ──
  operatingSystemId: string;
  secondaryOperatingSystemIds?: string[];
  maturityStatus: MaturityStatus;
  trigger: ScenarioTrigger;
  signalDetails: ScenarioSignalDetail[];
  context: ScenarioContext;
  governanceConfig: ScenarioGovernanceConfig;
  decision: ScenarioDecision;
  playbookId: string;
  rolesConfig: ScenarioRolesConfig;
  actionSteps: ScenarioActionStep[];
  communicationDetails: ScenarioCommunicationDetail[];
  escalation: ScenarioEscalation[];
  evidenceRequirements: ScenarioEvidenceRequirement[];
  outcomes: ScenarioOutcome[];
  learningConfig: ScenarioLearningConfig;
  proof: ScenarioProof;

  // ── Legacy compatibility fields used by controlled replay surfaces ──
  existingSystem: string;
  signals: string[];
  moment: string;
  momentClassification: string;
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

// ── Scenario data ─────────────────────────────────────────────────────────────

export const TRAVEL_SCENARIOS: TravelScenario[] = [
  // ── 01: Repeat Guest — Room Not Ready ─────────────────────────────────────
  {
    id: "repeat-guest-room-not-ready",
    num: "01",
    title: "Repeat Guest — Room Not Ready",
    category: "Loyalty Protection & Service Recovery",

    operatingSystemId: "guest-experience-os",
    secondaryOperatingSystemIds: ["service-recovery-staff-response-os"],
    maturityStatus: "working-proof",

    trigger: {
      type: "signal-threshold",
      description: "A recognised repeat or loyalty guest is approaching or has arrived, and their assigned room is not ready within the configured readiness threshold.",
      threshold: "Room not confirmed ready within 15 minutes of expected guest arrival",
    },

    signalDetails: [
      { id: "sig-rg-1", source: "PMS", name: "Reservation confirmed", status: "simulated", dataRequired: ["reservation_id", "arrival_time", "room_number"] },
      { id: "sig-rg-2", source: "PMS", name: "Arrival time", status: "simulated", dataRequired: ["expected_arrival", "actual_arrival"] },
      { id: "sig-rg-3", source: "Housekeeping App", name: "Room status", status: "simulated", dataRequired: ["room_number", "status", "assigned_housekeeper"] },
      { id: "sig-rg-4", source: "CRM / Loyalty Platform", name: "Guest profile and loyalty status", status: "simulated", dataRequired: ["guest_id", "loyalty_tier", "stay_count", "preferences"] },
      { id: "sig-rg-5", source: "PMS", name: "Available alternative rooms", status: "simulated", dataRequired: ["available_room_numbers", "categories"] },
      { id: "sig-rg-6", source: "Guest Interface", name: "Guest communication channel", status: "demonstrated", dataRequired: ["guest_device_token", "channel_preference"] },
    ],

    context: {
      relevantFacts: [
        "Guest is a confirmed repeat or loyalty guest with a stay history",
        "Assigned room is not ready within the configured threshold",
        "Alternative rooms may or may not be available at the same or higher category",
        "Guest sentiment is unknown until acknowledged — early contact reduces negative signals",
      ],
      riskOrOpportunity: "Risk: loyalty impact, negative review, trust erosion for a high-value repeat guest. Opportunity: proactive recovery that reinforces the guest relationship.",
      confidence: "92% — Repeat Guest Room Delay pattern (simulated classification)",
    },

    governanceConfig: {
      sources: ["Room Readiness SOP", "Guest Service Recovery Policy", "Compensation Approval Matrix", "Loyalty Treatment Standard"],
      rules: [
        "Acknowledge the repeat guest before avoidable uncertainty arises",
        "Compensation or upgrade requires Duty Manager approval",
        "Guest communication must use approved message templates",
        "Recovery action must be closed with full evidence",
      ],
      permissions: [
        "Front Office may offer lounge access and standard support without approval",
        "Duty Manager must approve upgrades, compensation and extended recovery",
      ],
      humanApprovalRequired: true,
      approvalRole: "duty-manager",
      prohibitedActions: [
        "Do not promise a specific upgrade without Duty Manager confirmation",
        "Do not send compensation commitments without Compensation Approval Matrix review",
      ],
    },

    decision: {
      decisionRequired: "Whether to offer an alternative room, wait and monitor, or activate compensation — and who owns the recovery.",
      recommendedDecision: "Acknowledge the guest immediately, offer lounge access, fast-track the room, and escalate to Duty Manager if no resolution within the window.",
      accountableRoleId: "duty-manager",
      decisionDeadline: "Within 10 minutes of signal receipt",
    },

    playbookId: "pb-repeat-guest-room-not-ready",

    rolesConfig: {
      accountableRoleId: "duty-manager",
      supportingRoleIds: ["front-office", "housekeeping"],
      informedRoleIds: ["general-manager"],
    },

    actionSteps: [
      { step: 1, action: "Verify room delay signal against PMS and housekeeping status", ownerRoleId: "front-office", timing: "Immediately", channelOrSystem: "PMS · Housekeeping App", evidenceRequired: ["Signal verification record"] },
      { step: 2, action: "Assess room readiness ETA from Housekeeping", ownerRoleId: "housekeeping", timing: "Within 2 minutes", channelOrSystem: "Housekeeping App", evidenceRequired: ["ETA record"] },
      { step: 3, action: "Check alternative room availability at same or higher category", ownerRoleId: "front-office", timing: "Within 3 minutes", channelOrSystem: "PMS" },
      { step: 4, action: "Determine whether recovery action requires Duty Manager approval", ownerRoleId: "front-office", timing: "Within 4 minutes", approvalRequired: true },
      { step: 5, action: "Notify Duty Manager and assign operational ownership", ownerRoleId: "duty-manager", timing: "Within 5 minutes", channelOrSystem: "In-app alert", evidenceRequired: ["Owner assignment record"] },
      { step: 6, action: "Send approved guest acknowledgement — offer lounge access or alternative", ownerRoleId: "front-office", timing: "Before arrival or within 2 minutes of arrival", channelOrSystem: "Guest App · Front desk", evidenceRequired: ["Communication delivery record"] },
      { step: 7, action: "Arrange interim guest support", ownerRoleId: "front-office", timing: "Immediately after acknowledgement", channelOrSystem: "Front desk" },
      { step: 8, action: "Fast-track room preparation", ownerRoleId: "housekeeping", timing: "On priority reassignment", channelOrSystem: "Housekeeping App" },
      { step: 9, action: "Confirm room readiness and notify guest", ownerRoleId: "housekeeping", timing: "On completion", channelOrSystem: "Housekeeping App · Guest App", evidenceRequired: ["Room readiness confirmation"] },
      { step: 10, action: "Record full evidence trail and close scenario", ownerRoleId: "duty-manager", timing: "Within 15 minutes of resolution", channelOrSystem: "Evidence Ledger", evidenceRequired: ["Full evidence trail", "Guest outcome record"] },
    ],

    communicationDetails: [
      { audience: "Guest", purpose: "Acknowledge delay and offer lounge access", channel: "Approved Guest Channel", approvalRequired: false, messageType: "guest-message" },
      { audience: "Housekeeping", purpose: "Priority room preparation prompt", channel: "Housekeeping App", approvalRequired: false, messageType: "internal-notification" },
      { audience: "Duty Manager", purpose: "Escalation notification", channel: "In-app alert", approvalRequired: false, messageType: "escalation" },
      { audience: "Guest", purpose: "Room ready — follow-up confirmation", channel: "Approved Guest Channel", approvalRequired: true, messageType: "guest-message" },
    ],

    escalation: [
      {
        trigger: "Delay exceeds configured recovery window",
        threshold: "30 minutes beyond expected room readiness",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager takes direct ownership. Compensation or relocation decision required.",
        maximumDelay: "Immediately on threshold breach",
      },
      {
        trigger: "No alternative room is available",
        threshold: "Immediately on assessment",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager activates compensation pathway and confirms guest communication.",
      },
      {
        trigger: "Guest sentiment deteriorates or complaint escalates",
        threshold: "Any direct complaint or sentiment signal below threshold",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager takes personal ownership of the guest interaction.",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Signal verification record", required: true, ownerRoleId: "front-office", completionRule: "Recorded before any action is taken" },
      { evidenceType: "Guest acknowledgement delivery", required: true, ownerRoleId: "front-office", completionRule: "Delivery confirmation from Guest App or front desk log" },
      { evidenceType: "Recovery decision and approval", required: true, ownerRoleId: "duty-manager", completionRule: "Recorded at the time of decision — not retrospectively" },
      { evidenceType: "Room readiness confirmation", required: true, ownerRoleId: "housekeeping", completionRule: "Status updated in Housekeeping App before guest is notified" },
      { evidenceType: "Guest outcome record", required: true, ownerRoleId: "duty-manager", completionRule: "Recorded within 15 minutes of resolution" },
    ],

    outcomes: [
      { metric: "Time from signal to guest acknowledgement", target: "Customer-configured", measure: "Timestamp delta: signal → first guest message delivered", ownerRoleId: "front-office" },
      { metric: "Time from signal to room provision", target: "Customer-configured", measure: "Timestamp delta: signal → room readiness confirmed", ownerRoleId: "housekeeping" },
      { metric: "Escalation required", measure: "Boolean: Duty Manager direct ownership triggered (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Guest outcome", measure: "Recorded status: satisfied / recovered / escalated / unresolved", ownerRoleId: "duty-manager" },
      { metric: "Repeat delay pattern", measure: "Flag if same room category delayed more than twice in 7 days", ownerRoleId: "duty-manager" },
    ],

    learningConfig: {
      reviewTrigger: "Delay event recurs for the same room category more than twice in 7 days",
      patternToDetect: "Whether early acknowledgement consistently reduced negative sentiment; whether alternative room identification speed improved",
      improvementAction: "Update housekeeping priority threshold and review early-acknowledgement timing in the playbook",
    },

    proof: {
      proofType: "working-interface",
      source: "JALDO Travel Partner Room — interactive scenario runner",
      limitations: [
        "Signals are simulated — no live PMS or housekeeping system is connected",
        "Communications are demonstrated, not sent to real guests",
        "Compensation decisions are illustrative — no real approval workflow",
        "Production engineering required for live signal ingestion and real-time housekeeping integration",
      ],
    },

    // ── Legacy compatibility fields ─────────────────────────────────────────
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

  // ── 02: Distressed Guest ──────────────────────────────────────────────────
  {
    id: "distressed-guest",
    num: "02",
    title: "Distressed Guest",
    category: "Guest Welfare",

    operatingSystemId: "safety-guest-welfare-os",
    secondaryOperatingSystemIds: ["guest-experience-os"],
    maturityStatus: "working-proof",

    trigger: {
      type: "welfare-signal",
      description: "A guest displays or communicates distress, vulnerability, safety concern or welfare risk through any channel — staff observation, guest message, keyword flag or request pattern.",
    },

    signalDetails: [
      { id: "sig-dg-1", source: "Guest Interface", name: "Guest message — distress keywords", status: "simulated", dataRequired: ["message_content", "guest_id", "timestamp"] },
      { id: "sig-dg-2", source: "Staff Console", name: "Staff welfare observation", status: "manual", dataRequired: ["staff_id", "observation_description", "location"] },
      { id: "sig-dg-3", source: "Front Desk Console", name: "Repeated help request", status: "simulated", dataRequired: ["request_count", "request_type", "time_window"] },
      { id: "sig-dg-4", source: "Security System", name: "Security report or concern", status: "planned", dataRequired: ["report_type", "location", "time"] },
    ],

    context: {
      relevantFacts: [
        "Welfare events require immediate human escalation — AI cannot diagnose, decide or resolve",
        "Automated guest communications must be paused during an active welfare event",
        "Privacy and data-retention rules restrict what evidence can be recorded",
        "The accountable role must be a named human, not a system",
      ],
      riskOrOpportunity: "Risk: duty of care failure, guest harm, legal or reputational exposure. Every welfare event must be treated as requiring immediate human attention.",
      confidence: "87% — Guest Welfare pattern. Flagged for mandatory human review. AI cannot close this event.",
    },

    governanceConfig: {
      sources: ["Guest Welfare Procedure", "Safety Escalation Rule", "Medical Assistance Procedure", "Critical Incident Procedure", "Privacy and Consent Rules", "Emergency Service Threshold Policy"],
      rules: [
        "Human review is mandatory before any response action",
        "AI may not diagnose, determine severity or close a welfare event",
        "No autonomous emergency decision is permitted",
        "Automated guest-facing communications are suspended for the duration",
        "Evidence must follow privacy and minimum-necessary rules",
      ],
      permissions: [
        "Duty Manager may approve all welfare response actions",
        "Safety and Security Lead activates security and emergency pathways",
      ],
      humanApprovalRequired: true,
      approvalRole: "duty-manager",
      prohibitedActions: [
        "AI may not autonomously respond to a guest in distress",
        "AI may not close or resolve a welfare event",
        "Do not record welfare-sensitive details beyond minimum necessary evidence",
        "Do not send commercial or promotional communications during an active welfare event",
      ],
    },

    decision: {
      decisionRequired: "What level of support is required — welfare check, medical assistance, security or emergency services — and who is the accountable owner.",
      recommendedDecision: "Duty Manager takes direct ownership immediately. No further action without Duty Manager assessment and authorisation.",
      accountableRoleId: "duty-manager",
      decisionDeadline: "Immediate — no delay permitted",
    },

    playbookId: "pb-distressed-guest",

    rolesConfig: {
      accountableRoleId: "duty-manager",
      supportingRoleIds: ["front-office", "safety-security-lead"],
      informedRoleIds: ["general-manager"],
    },

    actionSteps: [
      { step: 1, action: "Confirm immediate physical safety", ownerRoleId: "front-office", timing: "Immediately on signal", evidenceRequired: ["Initial welfare signal record"] },
      { step: 2, action: "Route to Duty Manager — mandatory human escalation", ownerRoleId: "duty-manager", timing: "Within 2 minutes — no delay permitted", channelOrSystem: "In-app alert · Direct escalation", evidenceRequired: ["Escalation timestamp and receiving owner"] },
      { step: 3, action: "Suspend automated guest communications for this guest", ownerRoleId: "duty-manager", timing: "Immediately on escalation", channelOrSystem: "JALDO Communication Control" },
      { step: 4, action: "Assess nature and severity of welfare concern", ownerRoleId: "duty-manager", timing: "Within 5 minutes", approvalRequired: true, evidenceRequired: ["Assessment record and decision"] },
      { step: 5, action: "Activate appropriate welfare, security, medical or emergency pathway", ownerRoleId: "safety-security-lead", timing: "Immediately on assessment", channelOrSystem: "Internal referral · Emergency services where required", evidenceRequired: ["Pathway activation record"] },
      { step: 6, action: "Record minimum necessary evidence within privacy constraints", ownerRoleId: "duty-manager", timing: "During and immediately after the event", channelOrSystem: "Evidence Ledger — welfare-restricted access", evidenceRequired: ["Welfare event record (minimum necessary)"] },
      { step: 7, action: "Confirm safe handoff — guest is safe and responsibility is transferred", ownerRoleId: "duty-manager", timing: "Before closing active phase", evidenceRequired: ["Handoff confirmation"] },
      { step: 8, action: "Record resolution status — Duty Manager sign-off required", ownerRoleId: "duty-manager", timing: "On resolution or stabilisation", evidenceRequired: ["Resolution record signed off by Duty Manager"] },
      { step: 9, action: "Conduct post-incident review within 24 hours", ownerRoleId: "safety-security-lead", timing: "Within 24 hours of resolution", evidenceRequired: ["Post-incident review record"] },
    ],

    communicationDetails: [
      { audience: "Duty Manager", purpose: "Mandatory welfare escalation", channel: "In-app alert", approvalRequired: false, messageType: "escalation" },
      { audience: "Safety and Security Lead", purpose: "Security or emergency pathway activation", channel: "Internal referral", approvalRequired: true, messageType: "escalation" },
      { audience: "General Manager", purpose: "High-impact welfare event notification", channel: "Direct notification", approvalRequired: false, messageType: "internal-notification" },
    ],

    escalation: [
      {
        trigger: "Immediate physical danger or medical emergency",
        threshold: "Any indication of physical harm or medical need",
        escalateToRoleId: "safety-security-lead",
        action: "Emergency services contacted immediately. Duty Manager and Safety and Security Lead take joint ownership.",
        maximumDelay: "Zero — immediate",
      },
      {
        trigger: "Child or vulnerable person concern",
        threshold: "Any welfare signal involving a minor or vulnerable adult",
        escalateToRoleId: "safety-security-lead",
        action: "Mandatory Safety and Security Lead involvement. External referral assessed.",
        maximumDelay: "Zero — immediate",
      },
      {
        trigger: "Duty Manager unavailable",
        threshold: "No Duty Manager response within 3 minutes",
        escalateToRoleId: "general-manager",
        action: "General Manager activated immediately.",
        maximumDelay: "3 minutes",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Initial welfare signal (source and timestamp)", required: true, ownerRoleId: "front-office", completionRule: "Recorded at time of signal — source and channel identified" },
      { evidenceType: "Escalation notification and receiving owner", required: true, ownerRoleId: "duty-manager", completionRule: "Timestamp of escalation and named receiving owner recorded" },
      { evidenceType: "Assessment and decision record", required: true, ownerRoleId: "duty-manager", completionRule: "Duty Manager records assessment decision before action" },
      { evidenceType: "Pathway activation record", required: true, ownerRoleId: "safety-security-lead", completionRule: "Pathway type and activation timestamp recorded" },
      { evidenceType: "Handoff confirmation", required: true, ownerRoleId: "duty-manager", completionRule: "Confirmed before active phase is closed" },
      { evidenceType: "Resolution record — Duty Manager sign-off", required: true, ownerRoleId: "duty-manager", completionRule: "Named Duty Manager sign-off required to close event" },
      { evidenceType: "Post-incident review record", required: true, ownerRoleId: "safety-security-lead", completionRule: "Completed within 24 hours of resolution" },
    ],

    outcomes: [
      { metric: "Time from signal to Duty Manager escalation", target: "Within 2 minutes", measure: "Timestamp delta: signal → Duty Manager escalation confirmed", ownerRoleId: "duty-manager" },
      { metric: "Appropriate human intervention confirmed", measure: "Boolean: Duty Manager took direct ownership (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Safe handoff completed", measure: "Boolean: handoff confirmation recorded (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Evidence complete", measure: "All required evidence fields completed (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Post-incident review completed", measure: "Review record filed within 24 hours (yes/no)", ownerRoleId: "safety-security-lead" },
    ],

    learningConfig: {
      reviewTrigger: "Any welfare event where escalation reached Duty Manager outside the 2-minute window, or where automated communication was sent during the event",
      patternToDetect: "Escalation pathway speed; whether automated communication controls activated correctly; post-incident review completion rate",
      improvementAction: "Update escalation routing if Duty Manager window is consistently missed; review communication suspension controls if breach detected",
    },

    proof: {
      proofType: "working-interface",
      source: "JALDO Travel Partner Room — interactive scenario runner with mandatory human-escalation demonstration",
      limitations: [
        "Signals are simulated — no live guest message or staff observation system is connected",
        "Escalation routing is demonstrated, not live",
        "AI boundary enforcement is shown in the interface — production enforcement requires runtime controls",
        "Production engineering required for real-time welfare signal processing and emergency-services integration",
      ],
    },

    // ── Legacy fields ────────────────────────────────────────────────────────
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

  // ── 03: Service Backlog ───────────────────────────────────────────────────
  {
    id: "service-backlog",
    num: "03",
    title: "Service Backlog",
    category: "Operational Pressure",

    operatingSystemId: "service-recovery-staff-response-os",
    secondaryOperatingSystemIds: ["operator-intelligence-os"],
    maturityStatus: "working-proof",

    trigger: {
      type: "threshold-breach",
      description: "Service requests, housekeeping tasks or operational actions exceed a configured volume, age or SLA threshold — indicating a backlog that risks guest impact.",
      threshold: "Open task count or average task age exceeds the configured SLA threshold for the current occupancy level",
    },

    signalDetails: [
      { id: "sig-sb-1", source: "Task Management System", name: "Open task count", status: "simulated", dataRequired: ["task_count", "task_types", "created_timestamps"] },
      { id: "sig-sb-2", source: "Task Management System", name: "Task age", status: "simulated", dataRequired: ["task_id", "created_at", "sla_deadline"] },
      { id: "sig-sb-3", source: "Staffing Roster", name: "Current staffing level", status: "manual", dataRequired: ["shift_headcount", "department"] },
      { id: "sig-sb-4", source: "PMS", name: "Current occupancy", status: "simulated", dataRequired: ["occupancy_rate", "arrivals_expected"] },
      { id: "sig-sb-5", source: "Task Management System", name: "Priority and repeat requests", status: "simulated", dataRequired: ["priority_flag", "repeat_count"] },
    ],

    context: {
      relevantFacts: [
        "Backlog volume and task age both exceed configured thresholds",
        "Guest-impacting tasks (room readiness, in-room requests) must be prioritised",
        "Staffing level and occupancy indicate whether reallocation is feasible",
        "Repeat backlogs at the same time window indicate a structural capacity issue",
      ],
      riskOrOpportunity: "Risk: guest-visible service failures, SLA breaches, escalation volume. Opportunity: early detection allows reallocation before guest impact occurs.",
      confidence: "90% — Service Backlog pattern across task queue (simulated classification)",
    },

    governanceConfig: {
      sources: ["Service Level Standard", "Staffing Escalation Protocol", "Guest Service Recovery Policy"],
      rules: [
        "Guest-impacting tasks take priority over back-of-house tasks",
        "Staff reallocation requires Operations Manager approval",
        "Guest communications require Duty Manager approval",
        "Backlog data and SLA breach records must be retained",
      ],
      permissions: [
        "Operations Manager may approve cross-department staff reallocation",
        "Duty Manager may approve guest-facing communications and escalation",
      ],
      humanApprovalRequired: true,
      approvalRole: "operations-manager",
      prohibitedActions: [
        "Do not defer guest-impacting tasks to protect non-guest operational tasks",
        "Do not send guest communications without Duty Manager approval",
      ],
    },

    decision: {
      decisionRequired: "Which tasks require priority, which staff can be reallocated, and whether guests need to be communicated with.",
      recommendedDecision: "Prioritise guest-impacting tasks, reallocate available cross-trained staff, escalate to Duty Manager if backlog cannot be cleared before the next arrivals peak.",
      accountableRoleId: "operations-manager",
      decisionDeadline: "Within 8 minutes of backlog alert",
    },

    playbookId: "pb-service-backlog",

    rolesConfig: {
      accountableRoleId: "operations-manager",
      supportingRoleIds: ["housekeeping", "front-office", "duty-manager"],
    },

    actionSteps: [
      { step: 1, action: "Validate backlog against actual task queue", ownerRoleId: "operations-manager", timing: "Within 3 minutes", channelOrSystem: "Task Management System", evidenceRequired: ["Backlog validation record"] },
      { step: 2, action: "Categorise tasks by urgency: guest-impacting, SLA-breached, deferred", ownerRoleId: "operations-manager", timing: "Within 5 minutes", channelOrSystem: "Task Management System" },
      { step: 3, action: "Identify guest-impacting tasks and notify Front Office and Duty Manager", ownerRoleId: "operations-manager", timing: "Within 5 minutes", channelOrSystem: "Staff console · In-app alert", evidenceRequired: ["Guest-impact identification record"] },
      { step: 4, action: "Approve cross-department staff reallocation", ownerRoleId: "operations-manager", timing: "Within 8 minutes", approvalRequired: true, evidenceRequired: ["Reallocation decision and approval"] },
      { step: 5, action: "Assign reallocated staff to priority tasks", ownerRoleId: "operations-manager", timing: "Within 10 minutes", channelOrSystem: "Task Management System", evidenceRequired: ["Task assignment confirmations"] },
      { step: 6, action: "Send operational briefing to Duty Manager and department leads", ownerRoleId: "duty-manager", timing: "Within 10 minutes", channelOrSystem: "In-app briefing" },
      { step: 7, action: "Send approved guest acknowledgement where delay is guest-facing", ownerRoleId: "front-office", timing: "Within 12 minutes of guest-impact identification", channelOrSystem: "Guest App · Front desk", approvalRequired: true, evidenceRequired: ["Guest communication delivery record"] },
      { step: 8, action: "Escalate unresolved critical tasks to Duty Manager", ownerRoleId: "duty-manager", timing: "If unresolved within 20 minutes", channelOrSystem: "In-app escalation", evidenceRequired: ["Escalation record"] },
      { step: 9, action: "Record backlog clearance and SLA breach data", ownerRoleId: "operations-manager", timing: "On clearance", channelOrSystem: "Task Management System · Evidence Ledger", evidenceRequired: ["Backlog clearance confirmation", "SLA breach log"] },
      { step: 10, action: "Flag recurring pattern for capacity review", ownerRoleId: "operations-manager", timing: "Within 24 hours", evidenceRequired: ["Pattern review note"] },
    ],

    communicationDetails: [
      { audience: "Housekeeping team", purpose: "Reallocation prompt — priority tasks reassigned", channel: "Staff dashboard", approvalRequired: false, messageType: "internal-notification" },
      { audience: "Duty Manager", purpose: "Backlog status and reallocation briefing", channel: "In-app briefing", approvalRequired: false, messageType: "internal-notification" },
      { audience: "Operations Manager", purpose: "Backlog alert and reallocation request", channel: "Operator console", approvalRequired: false, messageType: "recommendation" },
      { audience: "Affected guest", purpose: "Approved delay acknowledgement", channel: "Guest App", approvalRequired: true, messageType: "guest-message" },
    ],

    escalation: [
      {
        trigger: "Backlog cannot be cleared before next arrivals peak",
        threshold: "90 minutes before next peak",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager takes direct ownership. Guest communications activated.",
      },
      {
        trigger: "Critical guest-facing task breaches SLA",
        threshold: "Immediately on SLA breach",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager escalates to General Manager if operational capacity cannot be restored.",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Backlog validation record", required: true, ownerRoleId: "operations-manager", completionRule: "Validated against live task queue before action" },
      { evidenceType: "Guest-impact identification", required: true, ownerRoleId: "operations-manager", completionRule: "Recorded before reallocation decisions" },
      { evidenceType: "Reallocation approval record", required: true, ownerRoleId: "operations-manager", completionRule: "Approval recorded at time of decision" },
      { evidenceType: "Task assignment confirmations", required: true, ownerRoleId: "operations-manager", completionRule: "Each assigned task confirmed in Task Management System" },
      { evidenceType: "Backlog clearance and SLA breach log", required: true, ownerRoleId: "operations-manager", completionRule: "Recorded on clearance — SLA breach count included" },
    ],

    outcomes: [
      { metric: "Time from alert to backlog clearance", target: "Customer-configured", measure: "Timestamp delta: alert → clearance confirmed", ownerRoleId: "operations-manager" },
      { metric: "SLA breaches recorded", measure: "Count of tasks that breached their SLA deadline", ownerRoleId: "operations-manager" },
      { metric: "Guest-impacting tasks addressed", measure: "Count of guest-facing tasks resolved within window", ownerRoleId: "operations-manager" },
      { metric: "Guest communications sent", measure: "Boolean: guest acknowledgement sent where required (yes/no)", ownerRoleId: "front-office" },
      { metric: "Repeat pattern detected", measure: "Boolean: same time window / team / occupancy triggered event before (yes/no)", ownerRoleId: "operations-manager" },
    ],

    learningConfig: {
      reviewTrigger: "Backlog event recurs in the same operational window more than twice in 14 days",
      patternToDetect: "Whether earlier intervention (pre-threshold nudge) would have prevented the backlog; whether the same team or shift generates repeated events",
      improvementAction: "Review staffing levels for the affected window; assess whether the SLA threshold is calibrated correctly for current occupancy patterns",
    },

    proof: {
      proofType: "working-interface",
      source: "JALDO Travel Partner Room — interactive scenario runner",
      limitations: [
        "Signals are simulated — no live task management or staffing system is connected",
        "Reallocation is demonstrated, not executed in a real operational system",
        "SLA thresholds are illustrative — customer configuration required in production",
        "Production engineering required for live task system integration",
      ],
    },

    // ── Legacy fields ────────────────────────────────────────────────────────
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

  // ── 04: Maintenance Defect ────────────────────────────────────────────────
  {
    id: "maintenance-defect",
    num: "04",
    title: "Maintenance Defect",
    category: "Room Safety and Maintenance Escalation",

    operatingSystemId: "service-recovery-staff-response-os",
    secondaryOperatingSystemIds: ["guest-experience-os", "safety-guest-welfare-os", "operator-intelligence-os"],
    maturityStatus: "working-proof",

    trigger: {
      type: "defect-report",
      description: "A maintenance defect affecting a guest room, shared asset or safety condition is reported by a guest, staff member or operational system.",
    },

    signalDetails: [
      { id: "sig-md-1", source: "Maintenance Ticketing System", name: "Maintenance report", status: "simulated", dataRequired: ["defect_type", "asset_id", "room_number", "reported_by"] },
      { id: "sig-md-2", source: "PMS", name: "Guest complaint or room flag", status: "simulated", dataRequired: ["guest_id", "room_number", "complaint_description"] },
      { id: "sig-md-3", source: "Maintenance Ticketing System", name: "Asset type and safety classification", status: "simulated", dataRequired: ["asset_type", "safety_class"] },
      { id: "sig-md-4", source: "PMS", name: "Alternative room availability", status: "simulated", dataRequired: ["available_rooms", "categories"] },
      { id: "sig-md-5", source: "Maintenance Ticketing System", name: "Repeat defect history", status: "simulated", dataRequired: ["asset_id", "prior_reports", "prior_dates"] },
    ],

    context: {
      relevantFacts: [
        "Defect may affect guest comfort, safety or room availability",
        "Safety defects require immediate isolation — guest relocation takes priority",
        "Repeat defects on the same asset indicate a systemic maintenance issue",
        "Two accountable roles are required: Maintenance Lead for remediation; Duty Manager for guest recovery",
      ],
      riskOrOpportunity: "Risk: safety exposure, guest harm, reputation damage, repeat failure. Opportunity: swift response and transparent communication can protect the guest relationship.",
      confidence: "95% — Repeat Maintenance Defect pattern, second report on same unit (simulated classification)",
    },

    governanceConfig: {
      sources: ["Room Safety and Maintenance SOP", "Guest Service Recovery Policy", "Compensation Approval Matrix"],
      rules: [
        "Safety defects require immediate isolation before any guest use",
        "Relocation or recovery decisions require Duty Manager approval",
        "Guest updates must be honest about the situation and timeline",
        "Repeat defects must be escalated to General Manager for asset review",
      ],
      permissions: [
        "Maintenance Lead may classify and isolate defects without prior approval",
        "Duty Manager approves guest relocation, recovery and compensation",
        "General Manager reviews repeat-defect patterns and asset decisions",
      ],
      humanApprovalRequired: true,
      approvalRole: "duty-manager",
      prohibitedActions: [
        "Do not allow a guest to remain in a room classified as a safety defect",
        "Do not promise repair timelines that have not been confirmed by Maintenance Lead",
      ],
    },

    decision: {
      decisionRequired: "Whether to repair within the guest's tolerance window or relocate, and what recovery action the guest requires.",
      recommendedDecision: "Duty Manager decides repair or relocation based on Maintenance Lead ETA and guest impact. Communication to the guest requires approval.",
      accountableRoleId: "duty-manager",
      decisionDeadline: "Within 12 minutes of defect report",
    },

    playbookId: "pb-maintenance-defect",

    rolesConfig: {
      accountableRoleId: "duty-manager",
      supportingRoleIds: ["maintenance-lead", "front-office", "housekeeping"],
      informedRoleIds: ["general-manager"],
    },

    actionSteps: [
      { step: 1, action: "Classify defect by type, severity and safety impact", ownerRoleId: "maintenance-lead", timing: "Within 5 minutes", channelOrSystem: "Maintenance Ticketing System", evidenceRequired: ["Defect classification record"] },
      { step: 2, action: "Determine whether defect creates a safety risk", ownerRoleId: "maintenance-lead", timing: "Within 7 minutes", approvalRequired: true, evidenceRequired: ["Safety assessment record"] },
      { step: 3, action: "Isolate room or asset if safety risk is confirmed", ownerRoleId: "maintenance-lead", timing: "Immediately on safety classification", channelOrSystem: "PMS · Housekeeping App", evidenceRequired: ["Isolation record"] },
      { step: 4, action: "Assign repair task with priority and ETA", ownerRoleId: "maintenance-lead", timing: "Within 10 minutes", channelOrSystem: "Maintenance Ticketing System", evidenceRequired: ["Repair assignment record"] },
      { step: 5, action: "Assess guest impact against stay stage and guest profile", ownerRoleId: "duty-manager", timing: "Within 10 minutes", channelOrSystem: "PMS" },
      { step: 6, action: "Approve relocation, room change or recovery gesture", ownerRoleId: "duty-manager", timing: "Within 12 minutes", approvalRequired: true, evidenceRequired: ["Relocation or recovery approval"] },
      { step: 7, action: "Send approved guest update — honest and with a clear resolution", ownerRoleId: "front-office", timing: "Within 15 minutes of report", channelOrSystem: "Guest App · Front desk", approvalRequired: true, evidenceRequired: ["Guest communication delivery record"] },
      { step: 8, action: "Confirm repair completion and asset status", ownerRoleId: "maintenance-lead", timing: "On completion", channelOrSystem: "Maintenance Ticketing System · PMS", evidenceRequired: ["Repair completion record"] },
      { step: 9, action: "Record full evidence trail and close", ownerRoleId: "duty-manager", timing: "Within 30 minutes of resolution", channelOrSystem: "Evidence Ledger", evidenceRequired: ["Full evidence trail"] },
      { step: 10, action: "Flag repeat defect to General Manager if applicable", ownerRoleId: "maintenance-lead", timing: "Within 24 hours", evidenceRequired: ["Repeat defect flag (if applicable)"] },
    ],

    communicationDetails: [
      { audience: "Maintenance team", purpose: "Priority repair task assignment", channel: "Facilities dashboard", approvalRequired: false, messageType: "internal-notification" },
      { audience: "Duty Manager", purpose: "Defect escalation and guest impact notification", channel: "In-app alert", approvalRequired: false, messageType: "escalation" },
      { audience: "Affected guest", purpose: "Honest defect update and resolution offer", channel: "Guest App", approvalRequired: true, messageType: "guest-message" },
      { audience: "Housekeeping", purpose: "Room isolation or status update", channel: "Housekeeping App", approvalRequired: false, messageType: "internal-notification" },
    ],

    escalation: [
      {
        trigger: "Safety defect confirmed",
        threshold: "Immediately on safety classification",
        escalateToRoleId: "duty-manager",
        action: "Room isolated. Guest relocation required. Safety and Security Lead notified if risk extends beyond the room.",
        maximumDelay: "Zero — immediate",
      },
      {
        trigger: "Repair will not complete within guest tolerance window",
        threshold: "On ETA confirmation from Maintenance Lead",
        escalateToRoleId: "duty-manager",
        action: "Relocation approved. Guest communicated immediately.",
      },
      {
        trigger: "Repeat defect on same asset",
        threshold: "Second report on the same asset",
        escalateToRoleId: "general-manager",
        action: "General Manager reviews asset and schedules permanent repair or replacement.",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Defect classification record", required: true, ownerRoleId: "maintenance-lead", completionRule: "Recorded before any guest-facing action" },
      { evidenceType: "Safety assessment record", required: true, ownerRoleId: "maintenance-lead", completionRule: "Required for all defects — safety class must be recorded" },
      { evidenceType: "Repair assignment and completion", required: true, ownerRoleId: "maintenance-lead", completionRule: "Completion confirmed in Maintenance Ticketing System" },
      { evidenceType: "Guest communication delivery record", required: true, ownerRoleId: "front-office", completionRule: "Delivery confirmed before closing the scenario" },
      { evidenceType: "Relocation or recovery approval", required: false, ownerRoleId: "duty-manager", completionRule: "Required if relocation or compensation is activated" },
      { evidenceType: "Repeat-defect flag", required: false, ownerRoleId: "maintenance-lead", completionRule: "Required if this is the second or subsequent report on the same asset" },
    ],

    outcomes: [
      { metric: "Time from report to repair completion", target: "Customer-configured", measure: "Timestamp delta: defect report → repair confirmed", ownerRoleId: "maintenance-lead" },
      { metric: "Guest relocation required", measure: "Boolean: relocation activated (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Safety risk confirmed", measure: "Boolean: safety defect classification (yes/no)", ownerRoleId: "maintenance-lead" },
      { metric: "Guest informed within 15 minutes", measure: "Boolean: communication delivered within SLA (yes/no)", ownerRoleId: "front-office" },
      { metric: "Repeat defect flagged", measure: "Boolean: second or subsequent report on same asset (yes/no)", ownerRoleId: "maintenance-lead" },
    ],

    learningConfig: {
      reviewTrigger: "Asset generates more than one defect report in 30 days, or repair ETA is consistently exceeded",
      patternToDetect: "Repeat defect frequency by asset type and location; whether first-report escalation reduced guest impact in subsequent events",
      improvementAction: "Flag assets for proactive maintenance scheduling; review repair ETA accuracy with Maintenance Lead",
    },

    proof: {
      proofType: "working-interface",
      source: "JALDO Travel Partner Room — interactive scenario runner",
      limitations: [
        "Signals are simulated — no live maintenance ticketing or PMS integration",
        "Safety classification is illustrated, not assessed by a real safety system",
        "Repair ETA and completion are demonstrated, not live",
        "Production engineering required for live defect signal ingestion and maintenance system integration",
      ],
    },

    // ── Legacy fields ────────────────────────────────────────────────────────
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

  // ── 05: Transport Disruption ──────────────────────────────────────────────
  {
    id: "transport-disruption",
    num: "05",
    title: "Transport Disruption",
    category: "Guest Journey Disruption",

    operatingSystemId: "guest-experience-os",
    secondaryOperatingSystemIds: ["service-recovery-staff-response-os", "operator-intelligence-os"],
    maturityStatus: "working-proof",

    trigger: {
      type: "external-disruption-alert",
      description: "A transport disruption — flight delay, cancellation, transfer failure or severe weather — materially affects confirmed guest arrivals, departures or service delivery timing.",
    },

    signalDetails: [
      { id: "sig-td-1", source: "Flight and Transfer Tracking", name: "Transport disruption alert", status: "simulated", dataRequired: ["flight_number", "disruption_type", "revised_eta"] },
      { id: "sig-td-2", source: "PMS / Booking System", name: "Affected guest bookings", status: "simulated", dataRequired: ["guest_ids", "booking_ids", "arrival_window"] },
      { id: "sig-td-3", source: "Partner Channel", name: "Transfer booking status", status: "manual", dataRequired: ["transfer_booking_id", "partner_id", "status"] },
      { id: "sig-td-4", source: "Guest Interface", name: "Guest communication channel", status: "demonstrated", dataRequired: ["guest_device_token", "channel_preference"] },
    ],

    context: {
      relevantFacts: [
        "Disruption affects confirmed guest arrivals or departures",
        "Revised arrival windows affect room readiness, staffing and service timing",
        "Partner transport alternatives may or may not be available within the required window",
        "High-impact guests (VIP, loyalty, group) require senior ownership",
      ],
      riskOrOpportunity: "Risk: avoidable service failure, guest frustration, missed arrivals. Opportunity: early proactive communication significantly reduces negative impact.",
      confidence: "89% — Transport Disruption pattern, arrival window shifted (simulated classification)",
    },

    governanceConfig: {
      sources: ["Partner Activation Policy", "Guest Communication Standard", "Service Level Standard"],
      rules: [
        "Guest must be notified before avoidable uncertainty arises",
        "Partner activations require confirmation before guest delivery",
        "High-impact guests require Duty Manager ownership",
        "All partner activations must use approved channels",
      ],
      permissions: [
        "Guest Services may send approved guest disruption notices without Duty Manager approval",
        "Concierge may activate approved transport partners after confirmation",
        "Duty Manager escalation required for high-impact guests or unavailable alternatives",
      ],
      humanApprovalRequired: false,
      prohibitedActions: [
        "Do not confirm a transport alternative before partner has accepted the booking",
        "Do not overstate certainty about revised arrival timing",
      ],
    },

    decision: {
      decisionRequired: "Whether to activate a partner alternative, hold and monitor, or escalate due to unavailability or high guest impact.",
      recommendedDecision: "Notify the guest immediately with an honest assessment; activate an approved partner transport alternative in parallel.",
      accountableRoleId: "guest-services",
      decisionDeadline: "Within 15 minutes of disruption verification",
    },

    playbookId: "pb-transport-disruption",

    rolesConfig: {
      accountableRoleId: "guest-services",
      supportingRoleIds: ["concierge", "duty-manager", "partner-service-provider"],
    },

    actionSteps: [
      { step: 1, action: "Verify the disruption against transport tracking system", ownerRoleId: "guest-services", timing: "Within 5 minutes of alert", channelOrSystem: "Flight and Transfer Tracking System", evidenceRequired: ["Disruption verification record"] },
      { step: 2, action: "Identify affected guests and bookings", ownerRoleId: "guest-services", timing: "Within 8 minutes", channelOrSystem: "PMS · Booking System", evidenceRequired: ["Affected guest list"] },
      { step: 3, action: "Assess revised arrival windows and service impact", ownerRoleId: "guest-services", timing: "Within 10 minutes", channelOrSystem: "PMS · Housekeeping App" },
      { step: 4, action: "Identify alternative transport from approved partner network", ownerRoleId: "concierge", timing: "Within 15 minutes", channelOrSystem: "Partner channel", evidenceRequired: ["Alternative plan record"] },
      { step: 5, action: "Notify operational roles of revised arrival timing", ownerRoleId: "guest-services", timing: "Within 15 minutes", channelOrSystem: "In-app briefing · Staff console", evidenceRequired: ["Internal notification record"] },
      { step: 6, action: "Send approved guest disruption notice — honest, no overclaiming", ownerRoleId: "guest-services", timing: "Within 15 minutes", channelOrSystem: "Approved Guest Channel", evidenceRequired: ["Guest notification delivery record"] },
      { step: 7, action: "Activate approved partner transport and confirm booking", ownerRoleId: "concierge", timing: "Within 20 minutes", channelOrSystem: "Partner channel", approvalRequired: true, evidenceRequired: ["Partner activation confirmation"] },
      { step: 8, action: "Escalate high-impact cases to Duty Manager", ownerRoleId: "duty-manager", timing: "Immediately on identification", channelOrSystem: "In-app escalation", evidenceRequired: ["Escalation record"] },
      { step: 9, action: "Record final outcome: guest informed, alternative confirmed, arrival updated", ownerRoleId: "guest-services", timing: "On guest arrival confirmation", channelOrSystem: "Evidence Ledger", evidenceRequired: ["Full outcome record"] },
      { step: 10, action: "Flag repeat disruption pattern for future planning", ownerRoleId: "guest-services", timing: "Within 48 hours", evidenceRequired: ["Pattern review note"] },
    ],

    communicationDetails: [
      { audience: "Affected guest", purpose: "Disruption notice with honest assessment", channel: "Approved Guest Channel", approvalRequired: false, messageType: "guest-message" },
      { audience: "Partner transport provider", purpose: "Alternative transport activation request", channel: "Partner channel", approvalRequired: true, messageType: "recommendation" },
      { audience: "Duty Manager", purpose: "Disruption status and operational impact briefing", channel: "In-app briefing", approvalRequired: false, messageType: "internal-notification" },
      { audience: "Housekeeping and Front Office", purpose: "Revised arrival timing and service adjustments", channel: "Staff console", approvalRequired: false, messageType: "internal-notification" },
    ],

    escalation: [
      {
        trigger: "No approved alternative transport available within the window",
        threshold: "25 minutes from disruption confirmation",
        escalateToRoleId: "duty-manager",
        action: "Duty Manager communicates directly with guest. Property support options assessed.",
      },
      {
        trigger: "High-impact guest significantly delayed",
        threshold: "VIP, loyalty or group booking delayed more than 60 minutes",
        escalateToRoleId: "duty-manager",
        action: "Concierge and Duty Manager take joint ownership. General Manager briefed if appropriate.",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Disruption verification record", required: true, ownerRoleId: "guest-services", completionRule: "Confirmed against transport tracking before guest notification" },
      { evidenceType: "Affected guest list", required: true, ownerRoleId: "guest-services", completionRule: "Generated from PMS before any communication" },
      { evidenceType: "Guest notification delivery record", required: true, ownerRoleId: "guest-services", completionRule: "Delivery confirmed in Guest App system" },
      { evidenceType: "Partner activation confirmation", required: false, ownerRoleId: "concierge", completionRule: "Required where a partner transport alternative is activated" },
      { evidenceType: "Arrival confirmation", required: true, ownerRoleId: "guest-services", completionRule: "Recorded when guest arrival is confirmed" },
    ],

    outcomes: [
      { metric: "Time from disruption to guest notification", target: "Customer-configured", measure: "Timestamp delta: disruption alert → guest notification delivered", ownerRoleId: "guest-services" },
      { metric: "Alternative transport provided", measure: "Boolean: partner alternative confirmed (yes/no)", ownerRoleId: "concierge" },
      { metric: "Escalation required", measure: "Boolean: Duty Manager direct ownership triggered (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Guest arrival confirmed", measure: "Boolean: arrival recorded in PMS (yes/no)", ownerRoleId: "guest-services" },
      { metric: "Disruption pattern flagged", measure: "Boolean: same route or carrier flagged for review (yes/no)", ownerRoleId: "guest-services" },
    ],

    learningConfig: {
      reviewTrigger: "Same route, carrier or time window generates more than two disruption events in 30 days",
      patternToDetect: "Whether early guest notification (before partner confirmation) reduced negative sentiment; whether partner activation speed improved in subsequent events",
      improvementAction: "Update partner preference for affected routes; assess whether pre-disruption monitoring would provide earlier alert",
    },

    proof: {
      proofType: "working-interface",
      source: "JALDO Travel Partner Room — interactive scenario runner",
      limitations: [
        "Disruption signals are simulated — no live flight or transfer tracking integration",
        "Partner activation is demonstrated, not executed in a live partner system",
        "Guest notifications are illustrated — not sent to real guests",
        "Production engineering required for live transport API integration and real-time partner activation",
      ],
    },

    // ── Legacy fields ────────────────────────────────────────────────────────
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

  // ── 06: Premium Guest Opportunity ────────────────────────────────────────
  {
    id: "premium-guest-opportunity",
    num: "06",
    title: "Premium Guest Opportunity",
    category: "Loyalty and Commercial Opportunity",

    operatingSystemId: "marketplace-loyalty-activation-os",
    secondaryOperatingSystemIds: ["guest-experience-os"],
    maturityStatus: "prototype",

    trigger: {
      type: "opportunity-signal",
      description: "A permitted guest context indicates a relevant service or experience opportunity that can be delivered without disrupting guest trust, welfare or active service-recovery moments.",
    },

    signalDetails: [
      { id: "sig-pg-1", source: "CRM / Loyalty Platform", name: "Permission status", status: "simulated", dataRequired: ["guest_id", "consent_type", "consent_date"] },
      { id: "sig-pg-2", source: "CRM / Loyalty Platform", name: "Guest profile and interests", status: "simulated", dataRequired: ["guest_id", "loyalty_tier", "stated_interests"] },
      { id: "sig-pg-3", source: "JALDO Context Layer", name: "Current guest context", status: "simulated", dataRequired: ["active_events", "stay_stage", "sentiment"] },
      { id: "sig-pg-4", source: "POS / Partner System", name: "Available inventory", status: "manual", dataRequired: ["offer_type", "availability", "capacity"] },
    ],

    context: {
      relevantFacts: [
        "Guest has provided relevant permission for commercial communication",
        "No active welfare, safety or service-recovery event is present",
        "Inventory and delivery capacity have been confirmed",
        "Offer is relevant to stated guest interests — not tier alone",
      ],
      riskOrOpportunity: "Opportunity: relevant, timely and consented commercial activation that strengthens the guest relationship. Risk: trust erosion if consent, context or timing controls fail.",
      confidence: "84% — Premium Guest Opportunity match against active partner offer (simulated classification)",
    },

    governanceConfig: {
      sources: ["Loyalty Treatment Standard", "Partner Commercial Policy", "Privacy and Consent Rules", "Brand Standards"],
      rules: [
        "No commercial activation without confirmed guest consent",
        "No activation during an active welfare, safety or service-recovery event",
        "Inventory must be confirmed before offer delivery",
        "Revenue and Loyalty Lead approval required before any guest-facing message",
        "Frequency controls must be respected",
      ],
      permissions: [
        "Revenue and Loyalty Lead approves all guest-facing commercial communications",
        "Concierge delivers approved messages and partner activations",
      ],
      humanApprovalRequired: true,
      approvalRole: "revenue-loyalty-lead",
      prohibitedActions: [
        "Do not send commercial offers during active welfare or service-recovery events",
        "Do not deliver an offer where inventory has not been confirmed",
        "Do not send guest-facing commercial messages without Revenue and Loyalty Lead approval",
        "Do not represent commercial results as guaranteed or typical",
      ],
    },

    decision: {
      decisionRequired: "Whether to proceed with offer delivery — consent, context, inventory and brand standards all confirmed.",
      recommendedDecision: "Revenue and Loyalty Lead approves; Concierge delivers approved message. Hold if any entry condition fails.",
      accountableRoleId: "concierge",
      decisionDeadline: "Within 10 minutes of opportunity signal",
    },

    playbookId: "pb-premium-guest-opportunity",

    rolesConfig: {
      accountableRoleId: "concierge",
      supportingRoleIds: ["revenue-loyalty-lead", "partner-service-provider"],
    },

    actionSteps: [
      { step: 1, action: "Confirm guest permission for commercial communication", ownerRoleId: "revenue-loyalty-lead", timing: "Before any other step", channelOrSystem: "CRM · Loyalty Platform", evidenceRequired: ["Consent confirmation record"] },
      { step: 2, action: "Confirm context accuracy — no welfare or recovery event active", ownerRoleId: "revenue-loyalty-lead", timing: "Within 2 minutes", channelOrSystem: "JALDO Context Layer", evidenceRequired: ["Context confirmation record"] },
      { step: 3, action: "Confirm inventory or delivery capacity", ownerRoleId: "concierge", timing: "Within 5 minutes", channelOrSystem: "POS · Partner channel", evidenceRequired: ["Inventory confirmation"] },
      { step: 4, action: "Exclude conflicting welfare or service-recovery moments", ownerRoleId: "revenue-loyalty-lead", timing: "Within 5 minutes", channelOrSystem: "JALDO Context Layer" },
      { step: 5, action: "Select and approve communication type, channel and message", ownerRoleId: "revenue-loyalty-lead", timing: "Within 8 minutes", approvalRequired: true, evidenceRequired: ["Communication approval record"] },
      { step: 6, action: "Confirm partner activation if required", ownerRoleId: "concierge", timing: "Before guest delivery", channelOrSystem: "Partner channel", approvalRequired: true, evidenceRequired: ["Partner confirmation"] },
      { step: 7, action: "Deliver approved guest message or staff prompt", ownerRoleId: "concierge", timing: "Within 12 minutes of approval", channelOrSystem: "Approved Guest Channel · Front desk", evidenceRequired: ["Offer delivery record"] },
      { step: 8, action: "Record guest response: accepted, declined or no response", ownerRoleId: "concierge", timing: "On response or after offer expiry", channelOrSystem: "CRM · Partner channel", evidenceRequired: ["Guest response record"] },
      { step: 9, action: "Attribute value where a confirmed booking results", ownerRoleId: "revenue-loyalty-lead", timing: "On confirmed booking", channelOrSystem: "POS · Loyalty Platform", evidenceRequired: ["Value attribution record (if applicable)"] },
      { step: 10, action: "Review offer relevance and frequency controls", ownerRoleId: "revenue-loyalty-lead", timing: "Within 48 hours", evidenceRequired: ["Offer review note"] },
    ],

    communicationDetails: [
      { audience: "Guest", purpose: "Approved personalised offer or service recommendation", channel: "Approved Guest Channel", approvalRequired: true, messageType: "guest-message" },
      { audience: "Partner provider", purpose: "Activation request with booking details", channel: "Partner channel", approvalRequired: true, messageType: "recommendation" },
      { audience: "Revenue and Loyalty Lead", purpose: "Commercial opportunity brief", channel: "In-app briefing", approvalRequired: false, messageType: "internal-notification" },
    ],

    escalation: [
      {
        trigger: "Guest raises complaint or trust concern during or after offer delivery",
        threshold: "Any negative response or explicit complaint",
        escalateToRoleId: "duty-manager",
        action: "Commercial activation suspended. Duty Manager takes ownership of guest interaction.",
      },
      {
        trigger: "Partner cannot fulfil confirmed booking",
        threshold: "On partner cancellation or unavailability post-confirmation",
        escalateToRoleId: "concierge",
        action: "Concierge contacts guest immediately with honest update and alternative.",
      },
    ],

    evidenceRequirements: [
      { evidenceType: "Consent confirmation", required: true, ownerRoleId: "revenue-loyalty-lead", completionRule: "Confirmed in CRM before any action is taken" },
      { evidenceType: "Context confirmation (no active welfare or recovery event)", required: true, ownerRoleId: "revenue-loyalty-lead", completionRule: "Confirmed via JALDO Context Layer immediately before approval" },
      { evidenceType: "Inventory confirmation", required: true, ownerRoleId: "concierge", completionRule: "Confirmed with partner or POS before offer delivery" },
      { evidenceType: "Approval record", required: true, ownerRoleId: "revenue-loyalty-lead", completionRule: "Revenue and Loyalty Lead approval recorded before message delivery" },
      { evidenceType: "Offer delivery record", required: true, ownerRoleId: "concierge", completionRule: "Delivery confirmed in Guest App system" },
      { evidenceType: "Guest response record", required: true, ownerRoleId: "concierge", completionRule: "Recorded within the offer validity window" },
      { evidenceType: "Value attribution record", required: false, ownerRoleId: "revenue-loyalty-lead", completionRule: "Required only where a confirmed booking results. Do not invent values." },
    ],

    outcomes: [
      { metric: "Offer delivered with consent confirmed", measure: "Boolean: consent confirmed before delivery (yes/no)", ownerRoleId: "revenue-loyalty-lead" },
      { metric: "Guest response", measure: "Categorical: accepted / declined / no response", ownerRoleId: "concierge" },
      { metric: "Confirmed booking", measure: "Boolean: booking completed (yes/no)", ownerRoleId: "concierge" },
      { metric: "Trust concern or complaint raised", measure: "Boolean: guest complaint or negative response triggered (yes/no)", ownerRoleId: "duty-manager" },
      { metric: "Frequency compliance", measure: "Boolean: within approved frequency window (compliant/non-compliant)", ownerRoleId: "revenue-loyalty-lead" },
    ],

    learningConfig: {
      reviewTrigger: "Decline rate exceeds threshold, or any case where an offer was delivered during an undetected welfare or recovery event",
      patternToDetect: "Whether relevance (stated interest vs tier alone) affected acceptance rate; whether frequency controls are calibrated correctly",
      improvementAction: "Update offer-matching criteria to weight stated interests more heavily; review frequency window if decline rate is high",
    },

    proof: {
      proofType: "prototype",
      source: "JALDO Travel Partner Room — interactive scenario runner (prototype)",
      limitations: [
        "Consent and context checks are illustrated, not enforced by a live system",
        "Inventory confirmation is simulated — no live POS or partner integration",
        "Offer delivery is demonstrated — not sent to real guests",
        "Commercial outcomes are not real — value attribution is illustrative only",
        "Production engineering required for live consent management, context control and partner integration",
      ],
    },

    // ── Legacy fields ────────────────────────────────────────────────────────
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

// ── Utility exports ───────────────────────────────────────────────────────────

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

export const VALID_MATURITY_STATUSES: MaturityStatus[] = [
  "working-proof", "prototype", "simulation", "connector-ready", "integrated", "production", "planned",
];

export const MATURITY_LABELS: Record<MaturityStatus, string> = {
  "working-proof": "Working Proof",
  "prototype": "Prototype",
  "simulation": "Simulation",
  "connector-ready": "Connector-Ready",
  "integrated": "Integrated",
  "production": "Production",
  "planned": "Planned",
};

export const MATURITY_COLORS: Record<MaturityStatus, string> = {
  "working-proof": "#10b981",
  "prototype": "#f97316",
  "simulation": "#a78bfa",
  "connector-ready": "#3b82f6",
  "integrated": "#06b6d4",
  "production": "#c9a84c",
  "planned": "rgba(255,255,255,0.3)",
};
