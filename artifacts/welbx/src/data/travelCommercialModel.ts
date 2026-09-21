/**
 * travelCommercialModel.ts — Sprint 5
 *
 * Canonical commercial model data for JALDO Travel.
 *
 * Covers commercial components, commercial proof boundaries, value framework,
 * partner commercial models and commercial status labelling.
 *
 * IMPORTANT: Every commercial figure or claim must identify its source status.
 * Do not use unlabelled figures. Do not invent approved pricing.
 * Do not represent indicative assumptions as commitments.
 * All data is synthetic demonstration content.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type CommercialStatus =
  | "approved"
  | "indicative"
  | "configurable"
  | "subject-to-proposal"
  | "partner-specific"
  | "customer-specific";

export type CommercialSourceStatus =
  | "customer-provided"
  | "rtbx-approved"
  | "partner-provided"
  | "external-source"
  | "indicative-assumption"
  | "demonstration-input"
  | "pilot-target"
  | "unapproved"
  | "to-be-validated";

export type CommercialComponent = {
  id: string;
  name: string;
  summary: string;
  appliesTo: string[];
  status: CommercialStatus;
  sourceStatus: CommercialSourceStatus;
  mandatory: false;
  note?: string;
};

export type PartnerCommercialModel = {
  id: string;
  partnerType: string;
  summary: string;
  potentialModels: string[];
  statusNote: string;
};

export type ValueFrameworkCategory = {
  id: string;
  label: string;
  items: ValueFrameworkItem[];
};

export type ValueFrameworkItem = {
  id: string;
  label: string;
  evidenceSource: string;
  outcomeMetric: string;
  targetStatus: CommercialSourceStatus;
  maturity: "demonstrated" | "architecturally-defined" | "pilot-dependent" | "not-yet-measured";
};

export type ProofBoundaryCategory = {
  id: string;
  label: string;
  color: string;
  items: string[];
};

// ── Commercial components ─────────────────────────────────────────────────────

export const COMMERCIAL_COMPONENTS: CommercialComponent[] = [
  {
    id: "cc-alignment-discovery",
    name: "Alignment and Discovery Fee",
    summary:
      "Covers the discovery workshop, operating-system selection, systems and signal mapping, governance alignment and pilot planning. Charged before configuration begins.",
    appliesTo: ["All pilots and deployments"],
    status: "subject-to-proposal",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Scope and fee structure are subject to proposal. Not approved pricing.",
  },
  {
    id: "cc-configuration-implementation",
    name: "Configuration and Implementation Fee",
    summary:
      "Covers Travel environment configuration, scenario and playbook setup, role mapping, communication configuration, evidence and outcome configuration. May be delivered by JALDO or a deployment partner.",
    appliesTo: ["All pilots and deployments"],
    status: "subject-to-proposal",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Subject to proposal. May be split between JALDO and a deployment partner.",
  },
  {
    id: "cc-platform-licence",
    name: "Platform Licence",
    summary:
      "Access to the JALDO Travel platform, intelligence engine, operating systems, scenario and playbook framework, Build & Configure and Execution Centre.",
    appliesTo: ["All deployments"],
    status: "indicative",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Indicative licence model. Final terms subject to commercial proposal.",
  },
  {
    id: "cc-property-deployment-licence",
    name: "Property or Deployment Licence",
    summary:
      "A per-property or per-deployment licence applied after the pilot is proven. Scope and pricing are configurable to the property count and operating systems activated.",
    appliesTo: ["Proven properties", "Multi-property deployments"],
    status: "configurable",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Configurable based on property count, operating-system scope and deployment model. Subject to proposal.",
  },
  {
    id: "cc-connector-integration",
    name: "Connector or Integration Fee",
    summary:
      "Fee for approved production connector engineering and activation. Applied when a source system moves from simulated or manual to a production integration.",
    appliesTo: ["Production deployments"],
    status: "subject-to-proposal",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Subject to proposal. Connector-ready status is only claimed where the approved proof standard is met.",
  },
  {
    id: "cc-managed-intelligence",
    name: "Managed Intelligence or Support Service",
    summary:
      "Ongoing intelligence review, playbook improvement, governance update and operational support service delivered by JALDO or a deployment partner.",
    appliesTo: ["Ongoing deployments"],
    status: "subject-to-proposal",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Subject to proposal. Service scope and model are not yet approved.",
  },
  {
    id: "cc-training-change",
    name: "Training and Change Support",
    summary:
      "Staff training, change management and adoption support. May be delivered by JALDO or a deployment partner.",
    appliesTo: ["Pilots", "Production deployments"],
    status: "subject-to-proposal",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Subject to proposal. May form part of a deployment partner engagement.",
  },
  {
    id: "cc-expansion-os-licence",
    name: "Expansion Operating-System Licence",
    summary:
      "Licence for activating additional operating systems beyond the initial wedge. Marketplace and Loyalty Activation is the primary expansion operating system.",
    appliesTo: ["Expanding deployments"],
    status: "indicative",
    sourceStatus: "indicative-assumption",
    mandatory: false,
    note: "Indicative. Marketplace and Loyalty Activation is an expansion pathway — not activated in initial pilots.",
  },
  {
    id: "cc-partner-service-revenue",
    name: "Partner Service Revenue",
    summary:
      "Revenue from intervention, marketplace or distribution partner services delivered through the JALDO platform where attribution, governance and commercial approval are in place.",
    appliesTo: ["Mature deployments with active partner ecosystem"],
    status: "customer-specific",
    sourceStatus: "unapproved",
    mandatory: false,
    note: "Unapproved. Only applicable where attribution, permission and governance are credible and commercially agreed.",
  },
  {
    id: "cc-transaction-revenue-share",
    name: "Transaction or Revenue Share",
    summary:
      "A transaction fee or revenue-share arrangement where commercial activation is attributed to JALDO and approved by customer and partner.",
    appliesTo: ["Marketplace and Loyalty Activation", "Approved partner services"],
    status: "partner-specific",
    sourceStatus: "unapproved",
    mandatory: false,
    note: "Unapproved. Only use where attribution, permission and governance are credible. Do not present as a default component.",
  },
];

export const COMMERCIAL_STATUS_LABELS: Record<CommercialStatus, string> = {
  "approved":            "Approved",
  "indicative":          "Indicative",
  "configurable":        "Configurable",
  "subject-to-proposal": "Subject to proposal",
  "partner-specific":    "Partner-specific",
  "customer-specific":   "Customer-specific",
};

export const COMMERCIAL_STATUS_COLORS: Record<CommercialStatus, string> = {
  "approved":            "#10b981",
  "indicative":          "#c9a84c",
  "configurable":        "#3b82f6",
  "subject-to-proposal": "#a78bfa",
  "partner-specific":    "#f97316",
  "customer-specific":   "#f97316",
};

export const SOURCE_STATUS_LABELS: Record<CommercialSourceStatus, string> = {
  "customer-provided":    "Customer-provided",
  "rtbx-approved":        "JALDO-approved",
  "partner-provided":     "Partner-provided",
  "external-source":      "External source",
  "indicative-assumption":"Indicative assumption",
  "demonstration-input":  "Demonstration input",
  "pilot-target":         "Pilot target",
  "unapproved":           "Unapproved",
  "to-be-validated":      "To be validated",
};

// ── Partner commercial models ─────────────────────────────────────────────────

export const PARTNER_COMMERCIAL_MODELS: PartnerCommercialModel[] = [
  {
    id: "referral",
    partnerType: "Referral",
    summary:
      "Partner introduces a qualified customer who proceeds to an JALDO engagement.",
    potentialModels: [
      "Referral fee — fixed introduction fee (subject to agreement)",
      "Percentage of first-year contract value (subject to agreement)",
    ],
    statusNote:
      "Subject to agreement. No referral terms are confirmed. No referral arrangement is implied.",
  },
  {
    id: "reseller",
    partnerType: "Reseller",
    summary:
      "Partner sells JALDO Travel under agreed commercial terms within a defined market or territory.",
    potentialModels: [
      "Wholesale licence with reseller margin (subject to agreement)",
      "Market or territory conditions (subject to agreement)",
    ],
    statusNote:
      "Subject to agreement. No exclusivity is implied. No reseller arrangement is confirmed.",
  },
  {
    id: "implementation-partner",
    partnerType: "Implementation Partner",
    summary:
      "Partner delivers configuration, integration, training or rollout services to the customer.",
    potentialModels: [
      "Partner charges customer for implementation services",
      "JALDO charges platform and licence fees to the customer",
      "Joint delivery package (subject to proposal)",
    ],
    statusNote:
      "Implementation partner model is architecturally defined. No specific implementation partner is confirmed.",
  },
  {
    id: "strategic-technology",
    partnerType: "Strategic Technology Partner",
    summary:
      "Partner provides signals, distribution or embedded technology that extends JALDO capability.",
    potentialModels: [
      "Joint proposition (subject to agreement)",
      "Connector fee or co-selling arrangement",
      "Shared deployment revenue (subject to agreement)",
      "Usage or transaction economics (where attribution is credible)",
    ],
    statusNote:
      "Subject to agreement. Technology partner model is defined. No strategic technology partner is confirmed.",
  },
  {
    id: "intervention-marketplace",
    partnerType: "Intervention or Marketplace Partner",
    summary:
      "Partner delivers services or goods through JALDO-triggered moments where attribution and governance are in place.",
    potentialModels: [
      "Service fee per delivery",
      "Qualified lead fee",
      "Transaction fee (where attribution is credible)",
      "Revenue share (where attribution, permission and governance are credible)",
    ],
    statusNote:
      "Only use where attribution, permission and governance are commercially credible and approved. No arrangement is confirmed.",
  },
];

// ── Proof boundaries ──────────────────────────────────────────────────────────

export const COMMERCIAL_PROOF_BOUNDARIES: ProofBoundaryCategory[] = [
  {
    id: "demonstrated",
    label: "Demonstrated",
    color: "#10b981",
    items: [
      "Interactive deployment configuration",
      "Scenario execution",
      "Playbook activation",
      "Role-based views",
      "Evidence and outcome flows",
    ],
  },
  {
    id: "architecturally-defined",
    label: "Architecturally Defined",
    color: "#3b82f6",
    items: [
      "Integration patterns and signal mapping",
      "Partner responsibilities model",
      "Production controls design",
      "Scale deployment model",
      "Governance and evidence architecture",
    ],
  },
  {
    id: "pilot-dependent",
    label: "Pilot-Dependent",
    color: "#c9a84c",
    items: [
      "Staff adoption and workflow acceptance",
      "Operational outcomes and performance",
      "Customer-specific value measurement",
      "Integration feasibility per system",
      "Property-level performance",
    ],
  },
  {
    id: "production-engineering-required",
    label: "Requires Production Engineering",
    color: "#f97316",
    items: [
      "External system integrations (production connectors)",
      "Enterprise authentication and access control",
      "Production communication dispatch",
      "Durable audit storage",
      "Monitoring, alerting and support",
      "Multi-tenant data controls and service levels",
    ],
  },
];

// ── Value framework ───────────────────────────────────────────────────────────

export const VALUE_FRAMEWORK: ValueFrameworkCategory[] = [
  {
    id: "operational",
    label: "Operational Value",
    items: [
      { id: "vf-faster-ack",      label: "Faster acknowledgement",                   evidenceSource: "Scenario trace",       outcomeMetric: "Time to acknowledge",        targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-faster-assign",   label: "Faster assignment",                        evidenceSource: "Scenario trace",       outcomeMetric: "Time to assign",             targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-better-esc",      label: "Better escalation",                        evidenceSource: "Execution Centre",     outcomeMetric: "Escalation accuracy",        targetStatus: "indicative-assumption", maturity: "architecturally-defined" },
      { id: "vf-unresolved",      label: "Reduced unresolved actions",               evidenceSource: "Outcome Ledger",       outcomeMetric: "Unresolved action rate",     targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-handoffs",        label: "Improved handoffs",                        evidenceSource: "Evidence Ledger",      outcomeMetric: "Handoff quality score",      targetStatus: "to-be-validated",      maturity: "pilot-dependent" },
      { id: "vf-mgr-visibility",  label: "Better management visibility",             evidenceSource: "Operator Intelligence OS", outcomeMetric: "Manager visibility score", targetStatus: "indicative-assumption", maturity: "architecturally-defined" },
    ],
  },
  {
    id: "guest",
    label: "Guest Value",
    items: [
      { id: "vf-better-comms",    label: "Better communication",                     evidenceSource: "Comms OS",             outcomeMetric: "Communication timeliness",   targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-faster-recovery", label: "Faster recovery",                          evidenceSource: "Scenario trace",       outcomeMetric: "Time to resolve",            targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-uncertainty",     label: "Reduced uncertainty",                      evidenceSource: "Guest comms",          outcomeMetric: "Avoidable uncertainty",      targetStatus: "to-be-validated",      maturity: "pilot-dependent" },
      { id: "vf-consistency",     label: "More consistent service",                  evidenceSource: "Playbook completion",  outcomeMetric: "Playbook completion rate",   targetStatus: "indicative-assumption", maturity: "pilot-dependent" },
      { id: "vf-personalisation", label: "Appropriate personalisation",              evidenceSource: "Guest Experience OS",  outcomeMetric: "Guest personalisation events", targetStatus: "to-be-validated",   maturity: "pilot-dependent" },
    ],
  },
  {
    id: "governance",
    label: "Governance Value",
    items: [
      { id: "vf-traceability",    label: "Decision traceability",                    evidenceSource: "Evidence Ledger",      outcomeMetric: "Decision trace completeness", targetStatus: "indicative-assumption", maturity: "demonstrated" },
      { id: "vf-accountability",  label: "Clear accountability",                     evidenceSource: "Role assignment",      outcomeMetric: "Role accountability rate",   targetStatus: "indicative-assumption", maturity: "demonstrated" },
      { id: "vf-controlled-comms",label: "Controlled communication",                 evidenceSource: "Comms OS",             outcomeMetric: "Restricted comms compliance", targetStatus: "indicative-assumption", maturity: "demonstrated" },
      { id: "vf-evidence",        label: "Complete evidence",                        evidenceSource: "Evidence Ledger",      outcomeMetric: "Evidence completeness",      targetStatus: "to-be-validated",      maturity: "pilot-dependent" },
      { id: "vf-escalation-rel",  label: "Reliable escalation",                      evidenceSource: "Execution Centre",     outcomeMetric: "Escalation completion rate", targetStatus: "indicative-assumption", maturity: "demonstrated" },
      { id: "vf-assurance",       label: "Better assurance",                         evidenceSource: "Governance framework", outcomeMetric: "Governance check pass rate", targetStatus: "to-be-validated",      maturity: "architecturally-defined" },
    ],
  },
  {
    id: "workforce",
    label: "Workforce Value",
    items: [
      { id: "vf-role-clarity",    label: "Role clarity",                             evidenceSource: "Role model",           outcomeMetric: "Role clarity score",         targetStatus: "indicative-assumption", maturity: "pilot-dependent" },
      { id: "vf-less-searching",  label: "Reduced searching",                        evidenceSource: "Scenario trace",       outcomeMetric: "Time to find owner",         targetStatus: "to-be-validated",      maturity: "pilot-dependent" },
      { id: "vf-dup-comms",       label: "Reduced duplicate communication",          evidenceSource: "Comms OS",             outcomeMetric: "Duplicate comms rate",       targetStatus: "to-be-validated",      maturity: "pilot-dependent" },
      { id: "vf-playbook-use",    label: "More consistent playbook use",             evidenceSource: "Playbook completion",  outcomeMetric: "Playbook adherence rate",    targetStatus: "indicative-assumption", maturity: "pilot-dependent" },
      { id: "vf-frontline-dec",   label: "Better support for frontline decisions",   evidenceSource: "Decision Spine",       outcomeMetric: "Decision quality score",     targetStatus: "to-be-validated",      maturity: "architecturally-defined" },
    ],
  },
  {
    id: "commercial",
    label: "Commercial Value",
    items: [
      { id: "vf-service-failure", label: "Avoided service failure",                  evidenceSource: "Outcome Ledger",       outcomeMetric: "Service failure rate",       targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-repeat-work",     label: "Reduced repeat work",                      evidenceSource: "Evidence Ledger",      outcomeMetric: "Repeat incident rate",       targetStatus: "pilot-target",         maturity: "pilot-dependent" },
      { id: "vf-retention",       label: "Improved retention where measurable",       evidenceSource: "Guest outcomes",       outcomeMetric: "Guest return rate",          targetStatus: "to-be-validated",      maturity: "not-yet-measured" },
      { id: "vf-activation",      label: "Attributable activation where valid",       evidenceSource: "Marketplace OS",       outcomeMetric: "Activation revenue",         targetStatus: "unapproved",           maturity: "not-yet-measured" },
      { id: "vf-property-perf",   label: "Improved property or group performance",   evidenceSource: "Value Dashboard",      outcomeMetric: "Operating performance index", targetStatus: "to-be-validated",     maturity: "pilot-dependent" },
    ],
  },
];

// ── Validation helpers ────────────────────────────────────────────────────────

export const VALID_COMMERCIAL_STATUSES: CommercialStatus[] = [
  "approved",
  "indicative",
  "configurable",
  "subject-to-proposal",
  "partner-specific",
  "customer-specific",
];

export const VALID_SOURCE_STATUSES: CommercialSourceStatus[] = [
  "customer-provided",
  "rtbx-approved",
  "partner-provided",
  "external-source",
  "indicative-assumption",
  "demonstration-input",
  "pilot-target",
  "unapproved",
  "to-be-validated",
];

export const UNAPPROVED_STATUSES: CommercialStatus[] = [
  "subject-to-proposal",
  "partner-specific",
  "customer-specific",
];
