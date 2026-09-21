/**
 * Travel Operating Systems & Module Catalogue.
 *
 * JALDO Core provides the shared execution architecture (signal ingestion,
 * moment classification, governance, decision spine, action routing,
 * communications and the assurance/outcome registry). JALDO Travel extends
 * that same core through tailored operating systems — each one grouping
 * vertical-specific modules around a major hotel or travel operating problem.
 *
 * This file does not define a new engine. It configures how the existing
 * JALDO Core systems are packaged, scoped and rolled out for Travel.
 */

import type { MaturityStatus } from "./travelScenarios";

export type TravelRoleColumn = "Guest" | "Frontline" | "Manager" | "Operator" | "Partner" | "Executive";

/** Position in the Travel OS hierarchy — drives UI ordering and presentation. */
export type TravelOSPosition = "lead" | "cross-cutting" | "expansion";

export interface TravelOperatingSystem {
  id: string;
  name: string;
  /** Visual accent colour used in the UI. */
  color: string;
  /** Position in the Travel proposition: 3 lead OSes front the pilot; Safety is cross-cutting; Marketplace is expansion. */
  position: TravelOSPosition;
  /** The operating problem this OS solves. */
  problem: string;
  purpose: string;
  primaryUsers: TravelRoleColumn[];
  /** Cross-references to canonical signal types. */
  signalIds: string[];
  /** Canonical scenario IDs covered by this OS. */
  scenarioIds: string[];
  /** Canonical playbook IDs belonging to this OS. */
  playbookIds: string[];
  /** Governance documents and policies governing this OS. */
  governanceSources: string[];
  /** Evidence types this OS must capture. */
  evidenceRequirements: string[];
  /** Measurable outcome metrics for this OS. */
  outcomeMetrics: string[];
  /** Honest maturity status of this OS in the current build. */
  maturityStatus: MaturityStatus;
  inputSystems: string[];
  signals: string[];
  moments: string[];
  governance: string[];
  playbooks: string[];
  communications: string[];
  actions: string[];
  outcomes: string[];
  valueMeasures: string[];
  modules: string[];
  pilotEntryPoint: string;
  expansionPathway: string;
}

export const TRAVEL_OPERATING_SYSTEMS: TravelOperatingSystem[] = [
  // ── LEAD OS 1 ────────────────────────────────────────────────────────────
  {
    id: "guest-experience-os",
    name: "Guest Experience OS",
    color: "#3b82f6",
    position: "lead",
    problem: "Hotels miss meaningful guest moments because signals are fragmented across PMS, housekeeping, loyalty and guest apps — leaving staff without the right information at the right time.",
    purpose: "Model how guest needs, experience signals and draft service-response suggestions could be coordinated across a stay, subject to a named accountable person's approval.",
    primaryUsers: ["Guest", "Frontline", "Manager", "Operator"],
    signalIds: ["arrival-status", "room-readiness", "guest-request", "repeat-request", "loyalty-status", "sentiment", "delay", "disruption"],
    scenarioIds: ["repeat-guest-room-not-ready", "transport-disruption"],
    playbookIds: ["pb-repeat-guest-room-not-ready", "pb-transport-disruption"],
    governanceSources: ["Guest Service Recovery Policy", "Loyalty Treatment Standard", "Room Readiness SOP", "Guest Privacy Policy"],
    evidenceRequirements: [
      "Signal receipt and verification",
      "Planned evidence: guest communication delivery by an approved external channel",
      "Planned evidence: named accountable person's decision and approval",
      "Planned evidence: resolution confirmation from the responsible person",
      "Planned evidence: guest outcome record",
    ],
    outcomeMetrics: [
      "Proposed metric (unmeasured): time from signal to guest acknowledgement",
      "Proposed metric (unmeasured): time from signal to resolution",
      "Proposed metric (unmeasured): whether escalation was required",
      "Proposed metric (unmeasured): guest outcome recorded",
      "Proposed metric (unmeasured): repeat pattern detected",
    ],
    maturityStatus: "working-proof",
    inputSystems: ["PMS", "Guest Interface", "CRM / Loyalty Platform"],
    signals: ["Guest frustration", "Room readiness delay", "Guest sentiment shift", "Special occasion flag"],
    moments: ["Service Recovery Moment", "Loyalty Protection Moment", "Post-Stay Recovery Moment"],
    governance: ["Guest Service Recovery Policy", "Loyalty Treatment Standard"],
    playbooks: ["Pre-Arrival Readiness Check", "In-Stay Request Routing", "Post-Stay Outreach"],
    communications: ["Draft Guest Channel messages (not sent)", "Illustrative front desk task handoff (not dispatched)"],
    actions: ["Draft request routing for named owner approval", "Proposed recognition gesture", "Draft follow-up suggestion"],
    outcomes: ["Illustrative target: guest acknowledgement", "Illustrative target: issue resolution", "Illustrative target: guest recovery"],
    valueMeasures: ["Proposed, unmeasured satisfaction movement", "Proposed, unmeasured request response time", "Proposed, unmeasured loyalty protection"],
    modules: [
      "Guest Signal Capture",
      "Guest Assistant",
      "Pre-Arrival Readiness",
      "In-Stay Request Coordination",
      "Guest Sentiment",
      "Loyalty Recognition",
      "Special Occasion Recognition",
      "Post-Stay Follow-Up",
    ],
    pilotEntryPoint: "Proposed future pilot: Pre-Arrival Readiness + In-Stay Request Coordination on a single property.",
    expansionPathway: "Add Guest Sentiment and Loyalty Recognition once request routing is stable, then Post-Stay Follow-Up for full-stay coverage.",
  },

  // ── LEAD OS 2 ────────────────────────────────────────────────────────────
  {
    id: "service-recovery-staff-response-os",
    name: "Service Recovery & Staff Response OS",
    color: "#10b981",
    position: "lead",
    problem: "Service failures, maintenance issues and staff backlogs escalate unpredictably because there is no governed, accountable recovery pathway — leaving the response to individual initiative.",
    purpose: "Model governed recovery pathways for guest issues and staff pressure; current outputs are rules-based drafts for a named accountable person's review.",
    primaryUsers: ["Frontline", "Manager", "Operator"],
    signalIds: ["sla-breach", "task-backlog", "repeat-complaint", "maintenance-issue", "delayed-room", "service-queue", "staffing-pressure", "escalation-threshold"],
    scenarioIds: ["service-backlog", "maintenance-defect"],
    playbookIds: ["pb-service-backlog", "pb-maintenance-defect"],
    governanceSources: ["Guest Service Recovery Policy", "Compensation Approval Matrix", "Complaint Escalation SOP", "Room Safety and Maintenance SOP", "Staffing Escalation Protocol"],
    evidenceRequirements: [
      "Planned evidence: named accountable person's reallocation decision and approval",
      "Planned evidence: external task assignment and responsible person's completion confirmation",
      "Defect report and safety assessment",
      "Planned evidence: repair completion record from the responsible person",
      "SLA breach log",
      "Guest communication record",
    ],
    outcomeMetrics: [
      "Proposed metric (unmeasured): time from backlog alert to clearance",
      "Proposed metric (unmeasured): SLA breaches recorded",
      "Proposed metric (unmeasured): guest-impacting tasks addressed",
      "Proposed metric (unmeasured): defects repaired or isolated",
      "Proposed metric (unmeasured): repeat pattern detected",
    ],
    maturityStatus: "working-proof",
    inputSystems: ["Staff Task / Comms App", "PMS", "Housekeeping Software"],
    signals: ["Repeat complaint", "Queue build-up", "Staffing pressure", "Service disruption"],
    moments: ["Service Recovery Moment", "Operational Pressure Moment", "Staff Support Moment"],
    governance: ["Guest Service Recovery Policy", "Compensation Approval Matrix", "Complaint Escalation SOP"],
    playbooks: ["Duty Manager Callback", "Staff Reallocation", "Recovery Communication"],
    communications: ["Draft staff nudges (not sent)", "Draft manager escalation alerts (not sent)", "Draft guest recovery messages (not sent)"],
    actions: ["Proposed recovery gesture for named approval", "Illustrative staff reallocation", "Draft escalation route (not dispatched)"],
    outcomes: ["Illustrative target: response completion", "Illustrative target: guest recovery", "Illustrative target: escalation completion"],
    valueMeasures: ["Proposed, unmeasured recovery rate", "Proposed, unmeasured response time", "Proposed, unmeasured escalation quality"],
    modules: [
      "Service Recovery",
      "Complaint Escalation",
      "Compensation Rules",
      "Duty Manager Routing",
      "Staff Nudges",
      "Queue / Backlog Detection",
      "Recovery Communication",
      "Escalation Tracking",
    ],
    pilotEntryPoint: "Proposed future pilot pairing: Service Recovery + Duty Manager Routing with Guest Experience OS.",
    expansionPathway: "Add Queue / Backlog Detection and Compensation Rules as escalation volume and complexity grow.",
  },

  // ── LEAD OS 3 ────────────────────────────────────────────────────────────
  {
    id: "operator-intelligence-os",
    name: "Operator Intelligence OS",
    color: "#a78bfa",
    position: "lead",
    problem: "Property and group leaders may lack consolidated visibility over scenarios, decisions, response quality and recurring patterns; this proof uses synthetic data to model a possible future view.",
    purpose: "Model proposed operator intelligence across response, potential value and consistency; no live systems or measured outcomes are represented.",
    primaryUsers: ["Manager", "Operator", "Executive"],
    signalIds: ["open-actions", "sla-breaches", "escalation-volume", "repeated-defects", "response-time", "evidence-completion"],
    scenarioIds: ["service-backlog"],
    playbookIds: ["pb-service-backlog"],
    governanceSources: ["Complaint Escalation SOP", "Room Readiness SOP", "Service Level Standard"],
    evidenceRequirements: [
      "Planned evidence: externally sourced scenario summary",
      "Planned evidence: response time log",
      "Planned evidence: escalation records",
      "Planned evidence: evidence-completion status",
      "Planned evidence: outcome records",
    ],
    outcomeMetrics: [
      "Proposed metric (unmeasured): scenarios by type",
      "Proposed metric (unmeasured): average response time",
      "Proposed metric (unmeasured): SLA breach count",
      "Proposed metric (unmeasured): evidence completion rate",
      "Proposed metric (unmeasured): repeat issue frequency",
    ],
    maturityStatus: "working-proof",
    inputSystems: ["PMS", "Staff Task / Comms App", "Assurance / Outcome Registry"],
    signals: ["Response time drift", "Playbook effectiveness", "Staffing pressure", "Guest pattern cluster"],
    moments: ["Operational Pressure Moment", "Reputation Risk Moment"],
    governance: ["Complaint Escalation SOP", "Room Readiness SOP"],
    playbooks: ["Staff Reallocation", "Executive Recovery Escalation"],
    communications: ["Illustrative property and portfolio dashboards", "Draft executive reporting"],
    actions: ["Proposed resource reallocation for named approval", "Draft escalation for named authorisation", "Illustrative benchmark review"],
    outcomes: ["Illustrative target: response completion", "Illustrative target: evidence capture"],
    valueMeasures: ["Proposed, unmeasured response performance", "Proposed, unmeasured consistency across properties", "Proposed, unmeasured evidence completeness"],
    modules: [
      "Property Dashboard",
      "Portfolio Dashboard",
      "Response Performance",
      "Playbook Performance",
      "Staffing Pressure",
      "Guest Pattern Intelligence",
      "Value Reporting",
      "Benchmarking",
      "Executive Reporting",
    ],
    pilotEntryPoint: "Proposed future pilot: Property Dashboard + Response Performance after an initial operating-system trial produces governed evidence.",
    expansionPathway: "Potentially add Portfolio Dashboard and Benchmarking after multiple properties have completed governed trials of the same operating systems.",
  },

  // ── CROSS-CUTTING OS ─────────────────────────────────────────────────────
  {
    id: "safety-guest-welfare-os",
    name: "Safety & Guest Welfare OS",
    color: "#ef4444",
    position: "cross-cutting",
    problem: "Welfare, safety and high-risk escalation moments require human control and explicit governance — they cannot be managed through standard service recovery pathways or automated decisions.",
    purpose: "Model a proposed governed pathway for guest welfare, staff safety and critical incidents. Current rules only surface drafts for a named accountable person; they do not dispatch help or coordinate incidents.",
    primaryUsers: ["Frontline", "Manager", "Operator", "Executive"],
    signalIds: ["guest-distress", "welfare-concern", "security-concern", "medical-request", "vulnerability-flag"],
    scenarioIds: ["distressed-guest"],
    playbookIds: ["pb-distressed-guest"],
    governanceSources: ["Guest Safety Procedure", "Medical Assistance Procedure", "Critical Incident Procedure", "Privacy and Consent Rules", "Emergency Service Threshold Policy", "Guest Welfare Procedure"],
    evidenceRequirements: [
      "Welfare signal record",
      "Planned evidence: escalation notification and named accountable owner",
      "Planned evidence: human assessment and decision record",
      "Planned evidence: externally activated pathway",
      "Planned evidence: handoff confirmation from the responsible person",
      "Planned evidence: resolution signed off by the named Duty Manager",
      "Planned evidence: post-incident review record",
    ],
    outcomeMetrics: [
      "Proposed metric (unmeasured): time from signal to Duty Manager escalation",
      "Proposed metric (unmeasured): human intervention confirmation",
      "Proposed metric (unmeasured): safe handoff confirmation",
      "Proposed metric (unmeasured): evidence completeness",
      "Proposed metric (unmeasured): post-incident review completion",
    ],
    maturityStatus: "working-proof",
    inputSystems: ["Staff Task / Comms App", "Sensor / IoT & Building Management", "Guest Interface"],
    signals: ["Guest distress", "Medical assistance request", "Security concern", "Staff safety concern"],
    moments: ["Guest Welfare Moment", "Safety Escalation Moment", "Staff Support Moment"],
    governance: ["Guest Safety Procedure", "Medical Assistance Procedure", "Critical Incident Procedure", "Privacy and Consent Rules"],
    playbooks: ["Welfare Check", "Medical Response Protocol", "Security Response Protocol"],
    communications: ["Draft critical-incident communications (not sent)", "Draft escalation notifications (not sent)"],
    actions: ["Proposed welfare check for named human dispatch outside JALDO", "Draft incident pathway for human coordination outside JALDO", "Illustrative evidence entry"],
    outcomes: ["Illustrative target: response completion", "Illustrative target: escalation completion", "Illustrative target: evidence capture"],
    valueMeasures: ["Proposed, unmeasured safety escalation quality", "Proposed, unmeasured evidence completeness", "Proposed, unmeasured governance alignment"],
    modules: [
      "Guest Distress",
      "Medical Assistance",
      "Vulnerable Guest Support",
      "Security Escalation",
      "Staff Safety",
      "Critical Incident Comms",
      "Evidence Capture",
      "Post-Incident Review",
    ],
    pilotEntryPoint: "Proposed future pilot control: Guest Distress + Medical Assistance, with named human ownership and no automated dispatch.",
    expansionPathway: "Add Vulnerable Guest Support and Post-Incident Review as escalation history accumulates.",
  },

  // ── EXPANSION OS ─────────────────────────────────────────────────────────
  {
    id: "marketplace-loyalty-activation-os",
    name: "Marketplace & Loyalty Activation OS",
    color: "#c9a84c",
    position: "expansion",
    problem: "Commercial and loyalty opportunities may be poorly timed or irrelevant without accurate governed context, creating trust risk rather than value.",
    purpose: "Model possible commercial and loyalty moments without delivery. Future activation would require evidenced trust, signal accuracy, consent, governance and a named accountable owner.",
    primaryUsers: ["Guest", "Frontline", "Partner", "Operator", "Executive"],
    signalIds: ["permission-status", "loyalty-status", "available-inventory", "timing-signal", "previous-response"],
    scenarioIds: ["premium-guest-opportunity"],
    playbookIds: ["pb-premium-guest-opportunity"],
    governanceSources: ["Loyalty Treatment Standard", "Partner Commercial Policy", "Privacy and Consent Rules", "Brand Standards"],
    evidenceRequirements: [
      "Planned evidence: consent confirmation",
      "Planned evidence: context confirmation (no welfare or recovery event)",
      "Planned evidence: externally verified inventory",
      "Planned evidence: named accountable person's approval record",
      "Planned evidence: offer delivery record from an external channel",
      "Planned evidence: guest response record",
      "Planned evidence: value attribution record",
    ],
    outcomeMetrics: [
      "Proposed metric (unmeasured): consented offer delivery",
      "Proposed metric (unmeasured): guest response",
      "Proposed metric (unmeasured): externally confirmed booking",
      "Proposed metric (unmeasured): trust concern raised",
      "Proposed metric (unmeasured): frequency compliance",
    ],
    maturityStatus: "prototype",
    inputSystems: ["POS", "CRM / Loyalty Platform", "Local Partner Network"],
    signals: ["Upsell opportunity", "Local experience interest", "Dining interest", "Loyalty activation"],
    moments: ["Commercial Opportunity Moment", "Partner Activation Moment", "Loyalty Protection Moment"],
    governance: ["Loyalty Treatment Standard", "Partner Approval Standard"],
    playbooks: ["Upsell Offer", "Local Experience Referral", "Partner Referral"],
    communications: ["Draft guest offer messages (not sent)", "Illustrative partner referral confirmations (not sent)"],
    actions: ["Draft offer for named approval (not presented)", "Proposed referral route (not dispatched)", "Illustrative booking state (not externally confirmed)"],
    outcomes: ["Illustrative target: commercial conversion", "Illustrative target: partner activation", "Illustrative target: loyalty protection"],
    valueMeasures: ["Proposed, unmeasured ancillary revenue", "Proposed, unmeasured partner conversion", "Proposed, unmeasured loyalty activation"],
    modules: [
      "Local Experience Activation",
      "Transport Activation",
      "Dining and Wellness Offers",
      "Loyalty Prompting",
      "Ancillary Revenue",
      "Partner Routing",
      "Conversion Tracking",
      "Partner Quality Feedback",
    ],
    pilotEntryPoint: "Planned future option: Dining and Wellness Offers + Loyalty Prompting after Guest Experience OS evidence is independently reviewed.",
    expansionPathway: "Layer in Local Experience Activation and Partner Routing as the approved partner network grows.",
  },
];

// ── Optional specialist extensions (future / optional, not core) ──────────

export interface TravelSpecialistExtension {
  id: string;
  name: string;
  description: string;
}

export const TRAVEL_SPECIALIST_EXTENSIONS: TravelSpecialistExtension[] = [
  { id: "ext-business-traveller",      name: "Business Traveller OS",           description: "Meeting-space readiness, express service and corporate account signals — future extension for business-travel-heavy properties." },
  { id: "ext-holiday-park",            name: "Holiday Park Operations OS",       description: "Pitch/unit turnaround, amenity queueing and outdoor-environment signals — future extension for holiday parks and outdoor accommodation." },
  { id: "ext-group-travel",            name: "Group Travel Coordination OS",     description: "Group itinerary, multi-room coordination and group-leader communication — future extension for group and tour travel." },
  { id: "ext-destination-intelligence", name: "Destination Intelligence OS",     description: "Cross-property, destination-level demand and experience intelligence — future extension for multi-property destinations." },
];

// ── Hierarchy visual ────────────────────────────────────────────────────────

export const TRAVEL_HIERARCHY_STAGES: string[] = [
  "JALDO Core",
  "Travel Intelligence Pack",
  "Travel Operating System",
  "Proposed Modules",
  "Property Configuration",
  "Planned Operating Environment",
];

// ── Module matrix (role coverage) ────────────────────────────────────────────

export const TRAVEL_ROLE_COLUMNS: TravelRoleColumn[] = ["Guest", "Frontline", "Manager", "Operator", "Partner", "Executive"];

// ── Deployment logic ────────────────────────────────────────────────────────

export interface TravelDeploymentPhase {
  phase: string;
  operatingSystems: string[];
}

export const TRAVEL_DEPLOYMENT_PHASES: TravelDeploymentPhase[] = [
  { phase: "Phase 1", operatingSystems: ["Guest Experience OS", "Service Recovery & Staff Response OS"] },
  { phase: "Phase 2", operatingSystems: ["Operator Intelligence OS", "Safety & Guest Welfare OS"] },
  { phase: "Phase 3", operatingSystems: ["Marketplace & Loyalty Activation OS", "Advanced Portfolio Intelligence"] },
];

export const TRAVEL_DEPLOYMENT_STATEMENT =
  "A future hotel pilot would not need to trial every proposed operating system at once.";

export const TRAVEL_EXPANSION_STATEMENT =
  "Proposed expansion would be considered only after governed trials produce measured evidence; current outcomes and value are unmeasured.";

/** OS position labels for UI display. */
export const OS_POSITION_LABELS: Record<string, string> = {
  lead: "Lead OS",
  "cross-cutting": "Cross-Cutting Control",
  expansion: "Expansion Capability",
};

export const OS_POSITION_COLORS: Record<string, string> = {
  lead: "#3b82f6",
  "cross-cutting": "#ef4444",
  expansion: "#c9a84c",
};
