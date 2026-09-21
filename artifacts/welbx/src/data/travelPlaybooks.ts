/**
 * JALDO Travel — Canonical Playbook Register.
 *
 * One playbook per core scenario. Each playbook describes an ordered,
 * governed and accountable response — not a summary of the scenario.
 * IDs must match the playbookId field in travelScenarios.ts.
 *
 * Synthetic demo data only — no live customer or operational data.
 */

import type { MaturityStatus } from "./travelScenarios";

export interface TravelPlaybookStep {
  step: number;
  title: string;
  action: string;
  ownerRoleId: string;
  timing: string;
  systemOrChannel?: string;
  approvalRequired?: boolean;
  evidenceRequired?: string[];
}

export interface TravelPlaybookDecisionRule {
  rule: string;
  outcome: string;
}

export interface TravelPlaybookCommunicationTemplate {
  id: string;
  audience: string;
  channel: string;
  purpose: string;
  approvalRequired: boolean;
}

export interface TravelPlaybookEscalationRule {
  condition: string;
  threshold: string;
  escalateToRoleId: string;
  response: string;
}

export interface TravelPlaybook {
  id: string;
  name: string;
  operatingSystemId: string;
  summary: string;
  purpose: string;

  entryConditions: string[];
  exclusionConditions?: string[];

  governanceSources: string[];
  accountableRoleId: string;
  supportingRoleIds: string[];

  decisionRules: TravelPlaybookDecisionRule[];

  steps: TravelPlaybookStep[];

  communicationTemplates: TravelPlaybookCommunicationTemplate[];

  escalationRules: TravelPlaybookEscalationRule[];

  completionCriteria: string[];
  evidenceRequirements: string[];
  outcomeMetrics: string[];
  learningRules: string[];

  maturityStatus: MaturityStatus;
}

export const TRAVEL_PLAYBOOKS: TravelPlaybook[] = [
  // ── PB-01: Repeat Guest Room Not Ready ──────────────────────────────────
  {
    id: "pb-repeat-guest-room-not-ready",
    name: "Repeat Guest Room Delay Recovery",
    operatingSystemId: "guest-experience-os",
    summary: "Governed response to a recognised repeat guest arriving when their assigned room is not ready within the configured readiness threshold.",
    purpose: "Ensure the guest is informed before avoidable uncertainty, offered credible alternatives, and that the delay is resolved or escalated within the defined window.",
    entryConditions: [
      "Guest is identified as a repeat or loyalty guest",
      "Assigned room is not ready within the configured pre-arrival threshold",
      "PMS confirms active arrival or imminent arrival",
    ],
    exclusionConditions: [
      "Guest has not yet confirmed arrival intent",
      "Room delay is resolved before the threshold is breached",
    ],
    governanceSources: [
      "Room Readiness SOP",
      "Guest Service Recovery Policy",
      "Compensation Approval Matrix",
      "Loyalty Treatment Standard",
      "Guest Privacy Policy",
    ],
    accountableRoleId: "duty-manager",
    supportingRoleIds: ["front-office", "housekeeping"],
    decisionRules: [
      { rule: "Alternative room available at same or higher category", outcome: "Offer alternative — Front Office to present with Duty Manager awareness" },
      { rule: "No alternative available and delay exceeds threshold", outcome: "Escalate to Duty Manager — lounge or compensation offer required" },
      { rule: "Delay within threshold and room progressing", outcome: "Acknowledge guest, provide lounge access, monitor" },
      { rule: "Premium or vulnerable guest status", outcome: "Escalate immediately regardless of delay window" },
    ],
    steps: [
      {
        step: 1,
        title: "Verify signal accuracy",
        action: "Confirm the room delay signal against PMS and housekeeping status. Validate guest loyalty or repeat status.",
        ownerRoleId: "front-office",
        timing: "Immediately on signal receipt",
        systemOrChannel: "PMS · Housekeeping App",
        evidenceRequired: ["Signal verification record"],
      },
      {
        step: 2,
        title: "Assess room readiness timing",
        action: "Determine estimated room readiness time from Housekeeping. Assess whether it falls within the guest's tolerance window.",
        ownerRoleId: "housekeeping",
        timing: "Within 2 minutes of signal",
        systemOrChannel: "Housekeeping App",
        evidenceRequired: ["ETA confirmation from Housekeeping"],
      },
      {
        step: 3,
        title: "Check alternative room options",
        action: "Identify available alternative rooms at same or higher category. Confirm suitability against guest preferences where known.",
        ownerRoleId: "front-office",
        timing: "Within 3 minutes of signal",
        systemOrChannel: "PMS",
      },
      {
        step: 4,
        title: "Determine approval requirement",
        action: "Assess whether the recovery action (upgrade, compensation, gesture) requires Duty Manager approval per the Compensation Approval Matrix.",
        ownerRoleId: "front-office",
        timing: "Within 4 minutes",
        approvalRequired: true,
      },
      {
        step: 5,
        title: "Assign operational owner",
        action: "Assign Front Office as operational owner. Notify Duty Manager of status and expected action.",
        ownerRoleId: "duty-manager",
        timing: "Within 5 minutes",
        systemOrChannel: "In-app alert",
        evidenceRequired: ["Owner assignment record"],
      },
      {
        step: 6,
        title: "Prepare staff prompt",
        action: "JALDO generates an operational prompt for Front Office with approved recovery options and decision context.",
        ownerRoleId: "front-office",
        timing: "Within 5 minutes",
        systemOrChannel: "Staff console · JALDO Prompt Engine",
      },
      {
        step: 7,
        title: "Send guest acknowledgement",
        action: "Front Office sends the approved guest acknowledgement — confirming awareness of the delay and offering lounge access or an alternative.",
        ownerRoleId: "front-office",
        timing: "Before guest arrival or within 2 minutes of arrival detection",
        systemOrChannel: "Approved Guest Channel · Front desk",
        evidenceRequired: ["Guest communication delivery record"],
      },
      {
        step: 8,
        title: "Provide interim support",
        action: "Arrange lounge access, refreshments or other approved support. Confirm timeline to guest.",
        ownerRoleId: "front-office",
        timing: "Immediately following guest acknowledgement",
        systemOrChannel: "Front desk",
      },
      {
        step: 9,
        title: "Confirm room readiness",
        action: "Housekeeping confirms room ready. Front Office notifies guest and escorts or directs as appropriate.",
        ownerRoleId: "housekeeping",
        timing: "As soon as room is ready",
        systemOrChannel: "Housekeeping App · Guest App",
        evidenceRequired: ["Room readiness confirmation"],
      },
      {
        step: 10,
        title: "Record evidence and close",
        action: "Duty Manager or Front Office records full evidence trail: signal, action, communication, resolution and guest outcome. Flags repeat delay pattern if applicable.",
        ownerRoleId: "duty-manager",
        timing: "Within 15 minutes of resolution",
        systemOrChannel: "Evidence Ledger",
        evidenceRequired: [
          "Guest acknowledgement delivery",
          "Action taken and approval record",
          "Room readiness confirmation",
          "Guest outcome record",
        ],
      },
    ],
    communicationTemplates: [
      { id: "ct-rg-1", audience: "Guest", channel: "Approved Guest Channel", purpose: "Acknowledge delay and offer lounge access", approvalRequired: false },
      { id: "ct-rg-2", audience: "Housekeeping", channel: "Housekeeping App", purpose: "Priority room preparation prompt", approvalRequired: false },
      { id: "ct-rg-3", audience: "Duty Manager", channel: "In-app alert", purpose: "Escalation notification — threshold breach or premium guest", approvalRequired: false },
      { id: "ct-rg-4", audience: "Guest", channel: "Approved Guest Channel", purpose: "Room ready notification and follow-up", approvalRequired: true },
    ],
    escalationRules: [
      {
        condition: "Delay exceeds configured recovery window",
        threshold: "30 minutes beyond expected readiness",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager takes direct ownership. Compensation or relocation decision required.",
      },
      {
        condition: "No alternative room available",
        threshold: "Immediately on assessment",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager activates compensation pathway and confirms guest communication.",
      },
      {
        condition: "Guest sentiment deteriorates or complaint escalates",
        threshold: "Any sentiment signal below threshold or direct complaint",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager takes personal ownership of guest interaction.",
      },
    ],
    completionCriteria: [
      "Guest has been informed before avoidable uncertainty",
      "Room or credible alternative has been provided",
      "Duty Manager has approved any recovery action",
      "Evidence trail is complete",
      "Guest outcome is recorded",
    ],
    evidenceRequirements: [
      "Signal receipt and verification record",
      "Guest acknowledgement delivery",
      "Action decision and approval record",
      "Room readiness confirmation",
      "Guest outcome (satisfied, recovered, escalated)",
    ],
    outcomeMetrics: [
      "Time from signal to guest acknowledgement",
      "Time from signal to room provision",
      "Whether escalation was required",
      "Guest outcome recorded (yes/no)",
      "Repeat delay pattern detected (yes/no)",
    ],
    learningRules: [
      "Flag if delay pattern recurs for the same room category more than twice in a 7-day window",
      "Review whether early acknowledgement reduced negative sentiment in repeat cases",
      "Assess whether alternative room options were identified faster in subsequent events",
    ],
    maturityStatus: "working-proof",
  },

  // ── PB-02: Distressed Guest ──────────────────────────────────────────────
  {
    id: "pb-distressed-guest",
    name: "Guest Welfare Support and Escalation",
    operatingSystemId: "safety-guest-welfare-os",
    summary: "Governed welfare and safety response when a guest displays or communicates distress, vulnerability or welfare risk. Human escalation is mandatory. AI cannot close this event.",
    purpose: "Ensure that any guest welfare or safety concern receives immediate, appropriate and human-led response — protecting the guest, maintaining duty of care and controlling evidence.",
    entryConditions: [
      "Staff observation, guest message or system signal indicates guest distress, vulnerability or welfare concern",
      "Welfare signal is flagged for mandatory human review",
    ],
    exclusionConditions: [
      "Standard service request with no welfare component — route to Guest Experience OS instead",
    ],
    governanceSources: [
      "Guest Welfare Procedure",
      "Safety Escalation Rule",
      "Medical Assistance Procedure",
      "Critical Incident Procedure",
      "Privacy and Consent Rules",
      "Emergency Service Threshold Policy",
    ],
    accountableRoleId: "duty-manager",
    supportingRoleIds: ["front-office", "safety-security-lead"],
    decisionRules: [
      { rule: "Immediate physical danger or medical emergency", outcome: "Emergency services pathway — Safety and Security Lead + Duty Manager + emergency services" },
      { rule: "Child or vulnerable person concern", outcome: "Mandatory Safety and Security Lead involvement. External referral if required." },
      { rule: "Emotional distress without physical risk", outcome: "Duty Manager takes personal ownership. Discreet welfare check. No autonomous AI action." },
      { rule: "Security risk to other guests or staff", outcome: "Safety and Security Lead activates security protocol immediately." },
    ],
    steps: [
      {
        step: 1,
        title: "Confirm immediate safety",
        action: "Front Office or receiving staff assesses whether the guest is in immediate physical danger. If yes, emergency services pathway activates immediately.",
        ownerRoleId: "front-office",
        timing: "Immediately on signal receipt",
        approvalRequired: false,
        evidenceRequired: ["Initial welfare signal record"],
      },
      {
        step: 2,
        title: "Route to accountable human",
        action: "JALDO routes the welfare event to the Duty Manager without autonomous action. AI does not diagnose, decide or respond to the guest.",
        ownerRoleId: "duty-manager",
        timing: "Within 2 minutes — no delay permitted",
        systemOrChannel: "In-app alert · Direct escalation",
        approvalRequired: false,
        evidenceRequired: ["Escalation timestamp and receiving owner"],
      },
      {
        step: 3,
        title: "Restrict automated communications",
        action: "All automated guest-facing communications are paused for this guest. No further AI-generated messages until Duty Manager clears the event.",
        ownerRoleId: "duty-manager",
        timing: "Immediately on escalation",
        systemOrChannel: "JALDO Communication Control",
      },
      {
        step: 4,
        title: "Assess required support",
        action: "Duty Manager assesses the nature and severity of the welfare concern. Determines whether standard welfare check, medical support, security or emergency services are required.",
        ownerRoleId: "duty-manager",
        timing: "Within 5 minutes of escalation",
        approvalRequired: true,
        evidenceRequired: ["Assessment record and decision"],
      },
      {
        step: 5,
        title: "Activate appropriate pathway",
        action: "Activate welfare check, security, medical or emergency pathway as determined by Duty Manager. Safety and Security Lead takes ownership of security or emergency pathways.",
        ownerRoleId: "safety-security-lead",
        timing: "Immediately on assessment",
        systemOrChannel: "Internal referral · Emergency services where required",
        evidenceRequired: ["Pathway activation record"],
      },
      {
        step: 6,
        title: "Record minimum necessary evidence",
        action: "Record the minimum evidence required for duty of care compliance. Do not record welfare-sensitive details beyond what is required. Follow privacy and data-retention rules.",
        ownerRoleId: "duty-manager",
        timing: "During and immediately after the event",
        systemOrChannel: "Evidence Ledger — welfare-restricted access",
        evidenceRequired: ["Welfare event record (minimum necessary)", "Pathway record"],
      },
      {
        step: 7,
        title: "Confirm safe handoff",
        action: "Duty Manager confirms that the guest is safe, that responsibility has been handed to the correct person or service, and that the event is under control.",
        ownerRoleId: "duty-manager",
        timing: "Before closing active phase",
        evidenceRequired: ["Handoff confirmation"],
      },
      {
        step: 8,
        title: "Record resolution status",
        action: "Duty Manager records resolution status. Do not close the event until all required actions are confirmed. General Manager notified of high-impact events.",
        ownerRoleId: "duty-manager",
        timing: "On resolution or stabilisation",
        evidenceRequired: ["Resolution record signed off by Duty Manager"],
      },
      {
        step: 9,
        title: "Conduct controlled post-incident review",
        action: "Safety and Security Lead or Duty Manager conducts a post-incident review within 24 hours. Review is documented and shared with General Manager. Privacy boundaries maintained.",
        ownerRoleId: "safety-security-lead",
        timing: "Within 24 hours of resolution",
        evidenceRequired: ["Post-incident review record"],
      },
    ],
    communicationTemplates: [
      { id: "ct-dg-1", audience: "Duty Manager", channel: "In-app alert", purpose: "Mandatory welfare escalation notification", approvalRequired: false },
      { id: "ct-dg-2", audience: "Safety and Security Lead", channel: "Internal referral", purpose: "Security or emergency pathway activation", approvalRequired: true },
      { id: "ct-dg-3", audience: "General Manager", channel: "Direct notification", purpose: "High-impact welfare event notification", approvalRequired: false },
    ],
    escalationRules: [
      {
        condition: "Immediate physical danger or medical emergency",
        threshold: "Any indication of physical harm or medical need",
        escalateToRoleId: "safety-security-lead",
        response: "Emergency services contacted immediately. Duty Manager and Safety Lead take joint ownership.",
      },
      {
        condition: "Duty Manager unavailable",
        threshold: "No Duty Manager response within 3 minutes",
        escalateToRoleId: "general-manager",
        response: "General Manager activated immediately.",
      },
      {
        condition: "Child or vulnerable person concern",
        threshold: "Any welfare signal involving a minor or vulnerable adult",
        escalateToRoleId: "safety-security-lead",
        response: "Mandatory Safety and Security Lead involvement. External referral assessed.",
      },
    ],
    completionCriteria: [
      "Guest is confirmed safe",
      "Duty Manager has signed off the event",
      "Minimum necessary evidence is recorded",
      "Automated communications remain restricted until cleared",
      "Post-incident review is scheduled or completed",
    ],
    evidenceRequirements: [
      "Initial welfare signal (source and timestamp)",
      "Escalation notification and receiving owner",
      "Assessment and decision record",
      "Pathway activation record",
      "Handoff confirmation",
      "Resolution status signed off by Duty Manager",
      "Post-incident review record",
    ],
    outcomeMetrics: [
      "Time from signal to Duty Manager escalation",
      "Appropriate human intervention confirmed (yes/no)",
      "Safe handoff completed (yes/no)",
      "Evidence complete (yes/no)",
      "Privacy boundaries maintained (yes/no)",
      "Post-incident review completed (yes/no)",
    ],
    learningRules: [
      "Review whether the escalation pathway reached Duty Manager within the required window",
      "Identify whether any automated communication was sent before the welfare event was controlled",
      "Assess whether the post-incident review identified any playbook improvement",
    ],
    maturityStatus: "working-proof",
  },

  // ── PB-03: Service Backlog ───────────────────────────────────────────────
  {
    id: "pb-service-backlog",
    name: "Service Backlog Coordination",
    operatingSystemId: "service-recovery-staff-response-os",
    summary: "Operational response to a service task backlog that has exceeded the configured volume, age or SLA threshold and risks guest impact.",
    purpose: "Restore service throughput, address guest-impacting tasks first, and prevent backlog escalation through governed reallocation and prioritisation.",
    entryConditions: [
      "Open task count or task age exceeds configured SLA threshold",
      "Queue growth pattern detected across housekeeping, maintenance or service requests",
      "Priority guest requests are included in the backlog",
    ],
    governanceSources: [
      "Service Level Standard",
      "Staffing Escalation Protocol",
      "Guest Recovery Policy",
    ],
    accountableRoleId: "operations-manager",
    supportingRoleIds: ["housekeeping", "front-office", "duty-manager"],
    decisionRules: [
      { rule: "Guest-impacting tasks in backlog", outcome: "Prioritise guest-facing tasks before back-of-house tasks" },
      { rule: "Staffing capacity is the root cause", outcome: "Reallocate available cross-trained staff — escalate to Operations Manager" },
      { rule: "Backlog cannot be cleared before next arrivals peak", outcome: "Escalate to Duty Manager — guest communications may be required" },
      { rule: "Repeat backlog pattern detected", outcome: "Flag for capacity review and playbook update" },
    ],
    steps: [
      {
        step: 1,
        title: "Validate backlog",
        action: "Confirm the backlog signal against actual open task queue. Verify task age, type and volume.",
        ownerRoleId: "operations-manager",
        timing: "Within 3 minutes of alert",
        systemOrChannel: "Task Management System",
        evidenceRequired: ["Backlog validation record"],
      },
      {
        step: 2,
        title: "Categorise urgency",
        action: "Sort open tasks by urgency: guest-impacting, safety-related, SLA-breached, and deferred.",
        ownerRoleId: "operations-manager",
        timing: "Within 5 minutes",
        systemOrChannel: "Task Management System",
      },
      {
        step: 3,
        title: "Identify guest-impacting tasks",
        action: "Identify any tasks directly affecting guests in-stay. Elevate these to highest priority. Notify Front Office and Duty Manager.",
        ownerRoleId: "operations-manager",
        timing: "Within 5 minutes",
        systemOrChannel: "Staff console · In-app alert",
        evidenceRequired: ["Guest-impact identification record"],
      },
      {
        step: 4,
        title: "Reallocate capacity",
        action: "Identify available cross-trained staff. Operations Manager approves reallocation across departments. Non-urgent tasks are deferred.",
        ownerRoleId: "operations-manager",
        timing: "Within 8 minutes",
        systemOrChannel: "Staffing system · Staff console",
        approvalRequired: true,
        evidenceRequired: ["Reallocation decision and approval record"],
      },
      {
        step: 5,
        title: "Assign owners to priority tasks",
        action: "Assign reallocated staff to guest-impacting and SLA-breached tasks. Confirm acceptance.",
        ownerRoleId: "operations-manager",
        timing: "Within 10 minutes",
        systemOrChannel: "Task Management System",
        evidenceRequired: ["Task assignment confirmations"],
      },
      {
        step: 6,
        title: "Notify affected roles",
        action: "JALDO sends operational briefing to Duty Manager and department leads. Staff receive reallocation prompts.",
        ownerRoleId: "duty-manager",
        timing: "Within 10 minutes",
        systemOrChannel: "In-app briefing · Staff console",
        evidenceRequired: ["Notification delivery record"],
      },
      {
        step: 7,
        title: "Communicate with affected guests where required",
        action: "Where a guest-impacting delay cannot be resolved quickly, Front Office sends an approved guest acknowledgement. Duty Manager approval required.",
        ownerRoleId: "front-office",
        timing: "As needed — within 12 minutes of guest-impact identification",
        systemOrChannel: "Guest App · Front desk",
        approvalRequired: true,
        evidenceRequired: ["Guest communication delivery record"],
      },
      {
        step: 8,
        title: "Escalate unresolved critical tasks",
        action: "Any critical task not progressing within the window is escalated to Duty Manager for direct intervention.",
        ownerRoleId: "duty-manager",
        timing: "If not resolved within 20 minutes",
        systemOrChannel: "In-app escalation",
        evidenceRequired: ["Escalation record"],
      },
      {
        step: 9,
        title: "Record completion",
        action: "Operations Manager confirms backlog clearance. SLA breach data and reallocation outcome are logged.",
        ownerRoleId: "operations-manager",
        timing: "On backlog clearance",
        systemOrChannel: "Task Management System · Evidence Ledger",
        evidenceRequired: ["Backlog clearance confirmation", "SLA breach log"],
      },
      {
        step: 10,
        title: "Review capacity pattern",
        action: "Flag recurring backlog events for capacity review. Identify whether the same time, team or occupancy combination triggers repeated events.",
        ownerRoleId: "operations-manager",
        timing: "Within 24 hours",
        evidenceRequired: ["Pattern review record"],
      },
    ],
    communicationTemplates: [
      { id: "ct-sb-1", audience: "Housekeeping team", channel: "Staff dashboard", purpose: "Reallocation prompt — reassigned to priority tasks", approvalRequired: false },
      { id: "ct-sb-2", audience: "Duty Manager", channel: "In-app briefing", purpose: "Backlog status and reallocation briefing", approvalRequired: false },
      { id: "ct-sb-3", audience: "Operations Manager", channel: "Operator console", purpose: "Backlog alert and reallocation request", approvalRequired: false },
      { id: "ct-sb-4", audience: "Affected guest", channel: "Guest App", purpose: "Approved delay acknowledgement", approvalRequired: true },
    ],
    escalationRules: [
      {
        condition: "Backlog not cleared before next arrival peak",
        threshold: "90 minutes before next peak",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager takes direct ownership. Guest communications activated.",
      },
      {
        condition: "Critical guest-facing task unresolved beyond SLA",
        threshold: "Immediately on SLA breach",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager escalates to General Manager if operational capacity cannot be restored.",
      },
    ],
    completionCriteria: [
      "Backlog is cleared or reduced below threshold",
      "Guest-impacting tasks are addressed",
      "Reallocation is confirmed and documented",
      "SLA breach data is logged",
      "Pattern review is scheduled",
    ],
    evidenceRequirements: [
      "Backlog validation record",
      "Guest-impact identification",
      "Reallocation approval record",
      "Task assignment confirmations",
      "Backlog clearance confirmation",
      "SLA breach log",
    ],
    outcomeMetrics: [
      "Time from alert to backlog clearance",
      "Number of SLA breaches recorded",
      "Guest-impacting tasks addressed (count)",
      "Guest communications sent (yes/no)",
      "Repeat pattern detected (yes/no)",
    ],
    learningRules: [
      "Flag if backlog events repeat in the same operational window more than twice in 14 days",
      "Review whether reallocation reduced task age in subsequent events",
      "Assess whether earlier nudging (pre-threshold) would have prevented the backlog",
    ],
    maturityStatus: "working-proof",
  },

  // ── PB-04: Maintenance Defect ────────────────────────────────────────────
  {
    id: "pb-maintenance-defect",
    name: "Maintenance Defect and Guest Recovery",
    operatingSystemId: "service-recovery-staff-response-os",
    summary: "Governed response to a maintenance defect affecting a guest room, shared asset or safety condition — combining technical remediation with guest recovery.",
    purpose: "Control the defect, assess safety impact, resolve or relocate, and close with complete evidence to prevent repeat guest impact.",
    entryConditions: [
      "Maintenance defect is reported by guest, staff or system",
      "Defect affects a guest room, service or safety condition",
    ],
    governanceSources: [
      "Room Safety and Maintenance SOP",
      "Guest Service Recovery Policy",
      "Compensation Approval Matrix",
    ],
    accountableRoleId: "duty-manager",
    supportingRoleIds: ["maintenance-lead", "front-office", "housekeeping"],
    decisionRules: [
      { rule: "Defect is a safety risk", outcome: "Isolate room immediately. Safety classification required before guest return." },
      { rule: "Defect can be repaired within guest tolerance window", outcome: "Proceed with repair. Monitor. Offer interim support to guest." },
      { rule: "Repair will exceed tolerance window", outcome: "Duty Manager approves relocation. Front Office actions guest update." },
      { rule: "Defect is a repeat on the same asset", outcome: "Maintenance Lead flags for General Manager review and asset scheduling." },
    ],
    steps: [
      {
        step: 1,
        title: "Classify the defect",
        action: "Maintenance Lead reviews the defect report and classifies by type, severity and safety impact. Assigns initial priority.",
        ownerRoleId: "maintenance-lead",
        timing: "Within 5 minutes of report",
        systemOrChannel: "Maintenance Ticketing System",
        evidenceRequired: ["Defect classification record"],
      },
      {
        step: 2,
        title: "Determine safety impact",
        action: "Maintenance Lead assesses whether the defect creates a safety risk for the guest or others. If yes, safety pathway activates.",
        ownerRoleId: "maintenance-lead",
        timing: "Within 7 minutes",
        approvalRequired: true,
        evidenceRequired: ["Safety assessment record"],
      },
      {
        step: 3,
        title: "Isolate asset or room where required",
        action: "Where a safety defect is confirmed, Maintenance Lead isolates the room or asset and notifies Housekeeping and Duty Manager immediately.",
        ownerRoleId: "maintenance-lead",
        timing: "Immediately on safety classification",
        systemOrChannel: "PMS · Housekeeping App",
        evidenceRequired: ["Isolation record"],
      },
      {
        step: 4,
        title: "Assign maintenance response",
        action: "Maintenance Lead assigns repair task to appropriate technician with priority and estimated completion time.",
        ownerRoleId: "maintenance-lead",
        timing: "Within 10 minutes",
        systemOrChannel: "Maintenance Ticketing System",
        evidenceRequired: ["Repair assignment record"],
      },
      {
        step: 5,
        title: "Assess guest impact",
        action: "Duty Manager reviews the defect against the affected guest's stay stage, preferences and any vulnerability indicators.",
        ownerRoleId: "duty-manager",
        timing: "Within 10 minutes",
        systemOrChannel: "PMS",
      },
      {
        step: 6,
        title: "Approve relocation or recovery action",
        action: "Duty Manager approves relocation, room change or recovery gesture within the Compensation Approval Matrix.",
        ownerRoleId: "duty-manager",
        timing: "Within 12 minutes",
        approvalRequired: true,
        evidenceRequired: ["Relocation or recovery approval record"],
      },
      {
        step: 7,
        title: "Communicate with the guest",
        action: "Front Office delivers approved guest update. Message is honest about the situation and offers a clear resolution.",
        ownerRoleId: "front-office",
        timing: "Within 15 minutes of defect report",
        systemOrChannel: "Guest App · Front desk",
        approvalRequired: true,
        evidenceRequired: ["Guest communication delivery record"],
      },
      {
        step: 8,
        title: "Confirm repair completion",
        action: "Maintenance Lead confirms repair is complete and the asset is safe for use. Updates PMS status.",
        ownerRoleId: "maintenance-lead",
        timing: "On repair completion",
        systemOrChannel: "Maintenance Ticketing System · PMS",
        evidenceRequired: ["Repair completion record"],
      },
      {
        step: 9,
        title: "Capture evidence",
        action: "Duty Manager confirms full evidence trail: defect report, safety assessment, repair record, guest communication and outcome.",
        ownerRoleId: "duty-manager",
        timing: "Within 30 minutes of resolution",
        systemOrChannel: "Evidence Ledger",
        evidenceRequired: [
          "Defect report and classification",
          "Safety assessment",
          "Repair completion",
          "Guest communication record",
          "Resolution confirmation",
        ],
      },
      {
        step: 10,
        title: "Review repeat-defect pattern",
        action: "Maintenance Lead flags if this is a repeat defect on the same asset. Escalates to General Manager for asset scheduling or replacement review.",
        ownerRoleId: "maintenance-lead",
        timing: "Within 24 hours",
        evidenceRequired: ["Repeat defect flag (if applicable)"],
      },
    ],
    communicationTemplates: [
      { id: "ct-md-1", audience: "Maintenance team", channel: "Facilities dashboard", purpose: "Priority repair task assignment", approvalRequired: false },
      { id: "ct-md-2", audience: "Duty Manager", channel: "In-app alert", purpose: "Defect escalation and guest impact notification", approvalRequired: false },
      { id: "ct-md-3", audience: "Affected guest", channel: "Guest App", purpose: "Approved defect update and resolution offer", approvalRequired: true },
      { id: "ct-md-4", audience: "Housekeeping", channel: "Housekeeping App", purpose: "Room isolation or status update", approvalRequired: false },
    ],
    escalationRules: [
      {
        condition: "Safety defect confirmed",
        threshold: "Immediately on safety classification",
        escalateToRoleId: "duty-manager",
        response: "Room isolated. Guest relocation required. Safety and Security Lead notified if risk extends beyond the room.",
      },
      {
        condition: "Repair will not complete within guest tolerance window",
        threshold: "On ETA confirmation from maintenance",
        escalateToRoleId: "duty-manager",
        response: "Relocation approved. Guest communicated immediately.",
      },
      {
        condition: "Repeat defect on same asset",
        threshold: "Second report on the same asset",
        escalateToRoleId: "general-manager",
        response: "General Manager reviews asset and schedules permanent repair or replacement.",
      },
    ],
    completionCriteria: [
      "Defect is repaired or asset is isolated",
      "Guest impact is addressed and guest is informed",
      "Safety assessment is documented",
      "Evidence trail is complete",
      "Repeat defect pattern is flagged where applicable",
    ],
    evidenceRequirements: [
      "Defect report with asset and room details",
      "Safety assessment record",
      "Repair assignment and completion record",
      "Guest communication delivery record",
      "Relocation or recovery approval (if applicable)",
      "Repeat-defect flag (if applicable)",
    ],
    outcomeMetrics: [
      "Time from defect report to repair completion",
      "Guest relocation required (yes/no)",
      "Safety risk confirmed (yes/no)",
      "Guest informed within 15 minutes (yes/no)",
      "Repeat defect flagged (yes/no)",
      "Evidence complete (yes/no)",
    ],
    learningRules: [
      "Flag assets with more than one defect report in 30 days for proactive scheduling",
      "Review whether first-report escalation to Duty Manager reduced guest impact in repeat cases",
      "Assess whether repair ETA accuracy improved over successive events",
    ],
    maturityStatus: "working-proof",
  },

  // ── PB-05: Transport Disruption ──────────────────────────────────────────
  {
    id: "pb-transport-disruption",
    name: "Transport Disruption and Arrival Management",
    operatingSystemId: "guest-experience-os",
    summary: "Governed response to a transport disruption affecting guest arrivals, departures or staff schedules — coordinating alternatives and keeping guests informed.",
    purpose: "Minimise avoidable service failure caused by transport disruption through early guest communication, partner coordination and internal operational alignment.",
    entryConditions: [
      "Transport disruption alert received affecting a confirmed guest arrival, departure or transfer",
      "Disruption is verified as materially affecting timing or service delivery",
    ],
    governanceSources: [
      "Partner Activation Policy",
      "Guest Communication Standard",
      "Service Level Standard",
    ],
    accountableRoleId: "guest-services",
    supportingRoleIds: ["concierge", "duty-manager", "partner-service-provider"],
    decisionRules: [
      { rule: "Alternative transport available within approved partner network", outcome: "Guest Services activates partner. Guest notified immediately." },
      { rule: "No alternative available within window", outcome: "Escalate to Duty Manager. Guest communicated with honest assessment and options." },
      { rule: "High-impact guest (VIP, loyalty, group)", outcome: "Escalate to Duty Manager. Concierge takes personal ownership." },
      { rule: "Disruption affects staff schedule", outcome: "Operations Manager notified for internal reallocation." },
    ],
    steps: [
      {
        step: 1,
        title: "Verify the disruption",
        action: "Guest Services confirms the disruption against the transport tracking system. Validates which confirmed guests or bookings are affected.",
        ownerRoleId: "guest-services",
        timing: "Within 5 minutes of alert",
        systemOrChannel: "Flight and Transfer Tracking System",
        evidenceRequired: ["Disruption verification record"],
      },
      {
        step: 2,
        title: "Identify affected guests and operations",
        action: "Cross-reference affected transport with confirmed guest bookings. Identify number of guests, arrival windows and booking types.",
        ownerRoleId: "guest-services",
        timing: "Within 8 minutes",
        systemOrChannel: "PMS · Booking System",
        evidenceRequired: ["Affected guest list"],
      },
      {
        step: 3,
        title: "Assess timing and service impact",
        action: "Determine revised arrival windows, impact on room readiness, staffing schedules and other dependent services.",
        ownerRoleId: "guest-services",
        timing: "Within 10 minutes",
        systemOrChannel: "PMS · Housekeeping App",
      },
      {
        step: 4,
        title: "Update arrival or transfer plan",
        action: "Concierge or Guest Services identifies alternative transport options from the approved partner network and confirms availability.",
        ownerRoleId: "concierge",
        timing: "Within 15 minutes",
        systemOrChannel: "Partner channel",
        evidenceRequired: ["Alternative plan record"],
      },
      {
        step: 5,
        title: "Notify operational roles",
        action: "Guest Services notifies Duty Manager, Housekeeping and Front Office of revised arrival timing and any service changes.",
        ownerRoleId: "guest-services",
        timing: "Within 15 minutes",
        systemOrChannel: "In-app briefing · Staff console",
        evidenceRequired: ["Internal notification record"],
      },
      {
        step: 6,
        title: "Prepare guest communication",
        action: "JALDO generates an approved guest disruption notice. Guest Services reviews before sending. Wording is honest and avoids overstating certainty.",
        ownerRoleId: "guest-services",
        timing: "Within 15 minutes",
        systemOrChannel: "Approved Guest Channel",
        evidenceRequired: ["Guest notification delivery record"],
      },
      {
        step: 7,
        title: "Activate partner transport or service",
        action: "Concierge activates the approved transport partner. Confirms booking reference and revised itinerary.",
        ownerRoleId: "concierge",
        timing: "Within 20 minutes",
        systemOrChannel: "Partner channel",
        approvalRequired: true,
        evidenceRequired: ["Partner activation confirmation"],
      },
      {
        step: 8,
        title: "Escalate high-impact cases",
        action: "Any case where no alternative is available, or where a high-impact guest is significantly delayed, is escalated to Duty Manager for direct ownership.",
        ownerRoleId: "duty-manager",
        timing: "Immediately on identification",
        systemOrChannel: "In-app escalation",
        evidenceRequired: ["Escalation record"],
      },
      {
        step: 9,
        title: "Record outcome",
        action: "Guest Services records the full outcome: guest informed, alternative provided or not, partner activated, and guest arrival confirmation.",
        ownerRoleId: "guest-services",
        timing: "On guest arrival confirmation",
        systemOrChannel: "Evidence Ledger",
        evidenceRequired: [
          "Disruption verification record",
          "Guest notification record",
          "Partner activation record",
          "Arrival confirmation",
        ],
      },
      {
        step: 10,
        title: "Review disruption pattern",
        action: "Flag if the same route, carrier or time window generates repeated disruption events. Surface for future planning.",
        ownerRoleId: "guest-services",
        timing: "Within 48 hours",
        evidenceRequired: ["Pattern review note"],
      },
    ],
    communicationTemplates: [
      { id: "ct-td-1", audience: "Affected guest", channel: "Approved Guest Channel", purpose: "Disruption notice with honest assessment and options", approvalRequired: false },
      { id: "ct-td-2", audience: "Partner transport provider", channel: "Partner channel", purpose: "Alternative transport activation request", approvalRequired: true },
      { id: "ct-td-3", audience: "Duty Manager", channel: "In-app briefing", purpose: "Disruption status and operational impact", approvalRequired: false },
      { id: "ct-td-4", audience: "Housekeeping and Front Office", channel: "Staff console", purpose: "Revised arrival timing and service impact", approvalRequired: false },
    ],
    escalationRules: [
      {
        condition: "No approved transport alternative available within the window",
        threshold: "25 minutes from disruption confirmation",
        escalateToRoleId: "duty-manager",
        response: "Duty Manager communicates directly with guest. Property support options assessed.",
      },
      {
        condition: "High-impact guest significantly delayed",
        threshold: "VIP, loyalty or group booking with delay exceeding 60 minutes",
        escalateToRoleId: "duty-manager",
        response: "Concierge and Duty Manager take joint ownership. General Manager briefed if appropriate.",
      },
    ],
    completionCriteria: [
      "Guest has been informed before avoidable uncertainty",
      "Alternative transport is confirmed or honest escalation provided",
      "Internal teams are aligned on revised arrival plan",
      "Evidence is complete",
      "Disruption outcome is recorded",
    ],
    evidenceRequirements: [
      "Disruption verification record",
      "Affected guest list",
      "Guest notification delivery record",
      "Partner activation confirmation",
      "Revised arrival confirmation",
    ],
    outcomeMetrics: [
      "Time from disruption to guest notification",
      "Alternative transport provided (yes/no)",
      "Escalation required (yes/no)",
      "Guest arrival confirmed (yes/no)",
      "Disruption pattern flagged (yes/no)",
    ],
    learningRules: [
      "Review whether early guest notification (before partner confirmation) reduced negative sentiment",
      "Flag routes or carriers generating more than two disruption events in 30 days",
      "Assess whether partner activation speed improved in subsequent events",
    ],
    maturityStatus: "working-proof",
  },

  // ── PB-06: Premium Guest Opportunity ────────────────────────────────────
  {
    id: "pb-premium-guest-opportunity",
    name: "Governed Guest Opportunity and Service Activation",
    operatingSystemId: "marketplace-loyalty-activation-os",
    summary: "Governed activation of a relevant guest offer or service experience where consent, context, inventory and brand standards are confirmed and no safety or welfare event is active.",
    purpose: "Deliver relevant, approved guest opportunities without disrupting trust — with explicit consent, inventory validation and attribution tracking.",
    entryConditions: [
      "Guest has provided relevant permission for commercial or offer communication",
      "Context is accurate and guest is not in a distress, service-recovery or welfare moment",
      "Inventory or delivery capacity is confirmed",
      "Offer meets brand and suitability standards",
    ],
    exclusionConditions: [
      "Guest welfare, safety or distress event is active — do not activate commercial pathway",
      "Guest is in service recovery — commercial activation is deferred until resolution",
      "Guest consent is absent or expired",
      "Inventory or delivery capacity cannot be confirmed",
    ],
    governanceSources: [
      "Loyalty Treatment Standard",
      "Partner Commercial Policy",
      "Privacy and Consent Rules",
      "Brand Standards",
      "Compensation Approval Matrix (for recovery exclusions)",
    ],
    accountableRoleId: "concierge",
    supportingRoleIds: ["revenue-loyalty-lead", "partner-service-provider"],
    decisionRules: [
      { rule: "Consent confirmed, context accurate, inventory available", outcome: "Proceed to Revenue and Loyalty Lead approval before delivery" },
      { rule: "Context conflict — service or welfare event active", outcome: "Hold activation until event is resolved" },
      { rule: "Inventory unavailable at time of activation", outcome: "Do not present offer — reschedule for next valid window" },
      { rule: "Offer requires partner activation", outcome: "Partner confirmation required before guest delivery" },
    ],
    steps: [
      {
        step: 1,
        title: "Confirm guest permission",
        action: "Revenue and Loyalty Lead confirms the guest has active permission for the relevant communication type. No activation without confirmed consent.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Before any other step",
        systemOrChannel: "CRM · Loyalty Platform",
        evidenceRequired: ["Consent confirmation record"],
      },
      {
        step: 2,
        title: "Confirm context accuracy",
        action: "JALDO confirms the guest context signal is current and accurate. Verify that no welfare, safety or service-recovery event is active.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Within 2 minutes",
        systemOrChannel: "JALDO Context Layer",
        evidenceRequired: ["Context confirmation record"],
      },
      {
        step: 3,
        title: "Confirm inventory or delivery capacity",
        action: "Concierge or partner confirms that the service, offer or experience can be delivered at the proposed time.",
        ownerRoleId: "concierge",
        timing: "Within 5 minutes",
        systemOrChannel: "POS · Partner channel",
        evidenceRequired: ["Inventory confirmation record"],
      },
      {
        step: 4,
        title: "Exclude conflicting moments",
        action: "Verify the guest is not concurrently subject to a service recovery, welfare or safety event. If so, hold activation.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Within 5 minutes",
        systemOrChannel: "JALDO Context Layer",
      },
      {
        step: 5,
        title: "Select appropriate communication",
        action: "Revenue and Loyalty Lead selects or approves the communication type, channel and message for the guest.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Within 8 minutes",
        systemOrChannel: "JALDO Prompt Engine",
        approvalRequired: true,
        evidenceRequired: ["Communication approval record"],
      },
      {
        step: 6,
        title: "Route for approval",
        action: "All guest-facing commercial communications require Revenue and Loyalty Lead approval before delivery. Partner activations require partner confirmation.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Within 10 minutes",
        approvalRequired: true,
        evidenceRequired: ["Approval record"],
      },
      {
        step: 7,
        title: "Deliver approved message or staff prompt",
        action: "Concierge delivers the approved guest message or acts on the approved staff prompt. No autonomous delivery.",
        ownerRoleId: "concierge",
        timing: "Within 12 minutes of approval",
        systemOrChannel: "Approved Guest Channel · Front desk",
        evidenceRequired: ["Offer delivery record"],
      },
      {
        step: 8,
        title: "Record guest response",
        action: "Concierge or system records the guest response: accepted, declined, no response. Partner notified of outcome.",
        ownerRoleId: "concierge",
        timing: "On response or after offer expiry",
        systemOrChannel: "CRM · Partner channel",
        evidenceRequired: ["Guest response record"],
      },
      {
        step: 9,
        title: "Attribute value where appropriate",
        action: "Revenue and Loyalty Lead records commercial outcome where a booking or conversion results. Do not invent or project commercial values.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "On confirmed booking",
        systemOrChannel: "POS · Loyalty Platform",
        evidenceRequired: ["Value attribution record"],
      },
      {
        step: 10,
        title: "Review relevance and frequency",
        action: "Revenue and Loyalty Lead reviews whether the offer type and timing matched guest response. Feeds into offer frequency and relevance controls.",
        ownerRoleId: "revenue-loyalty-lead",
        timing: "Within 48 hours",
        evidenceRequired: ["Offer review note"],
      },
    ],
    communicationTemplates: [
      { id: "ct-pg-1", audience: "Guest", channel: "Approved Guest Channel", purpose: "Approved personalised offer or service recommendation", approvalRequired: true },
      { id: "ct-pg-2", audience: "Partner provider", channel: "Partner channel", purpose: "Partner activation request with booking details", approvalRequired: true },
      { id: "ct-pg-3", audience: "Revenue and Loyalty Lead", channel: "In-app briefing", purpose: "Commercial opportunity brief", approvalRequired: false },
    ],
    escalationRules: [
      {
        condition: "Guest raises a complaint or trust concern during or after offer delivery",
        threshold: "Any negative response or explicit complaint",
        escalateToRoleId: "duty-manager",
        response: "Commercial activation suspended. Duty Manager takes ownership of guest interaction.",
      },
      {
        condition: "Partner cannot deliver confirmed booking",
        threshold: "On partner cancellation or unavailability after guest confirmation",
        escalateToRoleId: "concierge",
        response: "Concierge contacts guest immediately with honest update and alternative.",
      },
    ],
    completionCriteria: [
      "Consent is confirmed before activation",
      "No conflicting welfare or recovery event is active",
      "Offer is approved by Revenue and Loyalty Lead",
      "Guest response is recorded",
      "Value is attributed only where a confirmed booking results",
    ],
    evidenceRequirements: [
      "Consent confirmation",
      "Context confirmation (no active welfare or recovery event)",
      "Inventory confirmation",
      "Approval record",
      "Offer delivery record",
      "Guest response record",
      "Value attribution record (if applicable)",
    ],
    outcomeMetrics: [
      "Offer delivered with consent confirmed (yes/no)",
      "Guest response: accepted / declined / no response",
      "Confirmed booking (yes/no)",
      "Trust concern or complaint raised (yes/no)",
      "Frequency within approved window (compliant/non-compliant)",
    ],
    learningRules: [
      "Review whether offer relevance (based on stated interest vs tier alone) affected acceptance rate",
      "Flag any case where an offer was delivered during an undetected service-recovery or welfare event",
      "Review frequency controls if decline rate exceeds threshold",
    ],
    maturityStatus: "prototype",
  },
];

/** Lookup a playbook by ID. */
export function getTravelPlaybook(id: string): TravelPlaybook | undefined {
  return TRAVEL_PLAYBOOKS.find(p => p.id === id);
}

/** All valid playbook IDs. */
export const TRAVEL_PLAYBOOK_IDS = TRAVEL_PLAYBOOKS.map(p => p.id);
