/**
 * travelPilotModel.ts — Sprint 5
 *
 * Canonical pilot model data for JALDO Travel.
 *
 * Covers the Hotel Moment Response and Service Recovery Pilot proposition,
 * delivery stages (Explore → Expand), success framework, readiness checklist,
 * deployment package and expansion pathway.
 *
 * Do not represent pilot outcomes as confirmed results.
 * All durations and figures are indicative unless labelled otherwise.
 * All data is synthetic demonstration content.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type PilotStage = {
  id: string;
  label: string;
  name: string;
  purpose: string;
  activities: string[];
  outputs: string[];
  ownerGroups: string[];
  readinessRequirements: string[];
};

export type ReadinessState =
  | "not-started"
  | "in-progress"
  | "ready"
  | "blocked"
  | "requires-production-engineering";

export type ReadinessItem = {
  id: string;
  label: string;
  category: string;
  defaultState: ReadinessState;
};

export type SuccessMeasureTargetType =
  | "customer-baseline"
  | "pilot-target"
  | "indicative-target"
  | "to-be-agreed"
  | "not-yet-measured";

export type SuccessMeasure = {
  id: string;
  category: string;
  label: string;
  targetType: SuccessMeasureTargetType;
  note?: string;
};

export type ExpansionStage = {
  id: string;
  label: string;
  description: string;
  examples: string[];
  maturityGate: string;
};

export type DeploymentPackageSection = {
  id: string;
  name: string;
  items: string[];
  productionOnly?: boolean;
  productionNote?: string;
};

// ── Canonical pilot proposition ───────────────────────────────────────────────

export const PILOT_PROPOSITION = {
  name: "Hotel Moment Response and Service Recovery Pilot",
  tagline: "Connect signals. Govern action. Prove value.",
  summary:
    "A controlled working pilot that activates JALDO Travel across a hotel or resort environment. Signals from existing systems are mapped to scenarios, playbooks and governed responses. Evidence and outcomes are captured throughout. The pilot proves operational feasibility, staff adoption and the JALDO governance and execution model before production deployment.",
  primaryMarket: "Hotels and resorts",
  primaryBuyers: [
    "Chief Operating Officer",
    "Group or Regional Operations Director",
    "General Manager",
    "Guest Experience Director",
    "Digital or Transformation Director",
    "Technology or Systems Leader",
    "Risk, Safety or Service Excellence Leader",
  ],
  targetEnvironment: "One to five properties — one hotel group or operating partner",
  durationNote:
    "Indicative pilot structure: 8–10 weeks of implementation and readiness, followed by a 2–3 month controlled pilot. Final duration agreed during alignment.",
} as const;

// ── Pilot operating systems ───────────────────────────────────────────────────

export const PILOT_OPERATING_SYSTEMS = [
  {
    id: "guest-experience-os",
    role: "primary-wedge",
    note: "Lead operating system — activated in all pilots",
  },
  {
    id: "service-recovery-staff-response-os",
    role: "primary-wedge",
    note: "Lead operating system — activated in all pilots",
  },
  {
    id: "operator-intelligence-os",
    role: "primary-wedge",
    note: "Lead operating system — activated in all pilots",
  },
  {
    id: "safety-guest-welfare-os",
    role: "cross-cutting-control",
    note: "Cross-cutting welfare and safety control — always active",
  },
  {
    id: "marketplace-loyalty-activation-os",
    role: "expansion-only",
    note: "Expansion operating system — not activated in initial pilot. Activated after operational trust and permission are established.",
  },
] as const;

// ── Pilot scenarios ───────────────────────────────────────────────────────────

export const PILOT_SCENARIOS = [
  {
    scenarioId: "repeat-guest-room-not-ready",
    role: "primary",
    note: "Core pilot scenario — service recovery and guest communication",
  },
  {
    scenarioId: "service-backlog",
    role: "primary",
    note: "Core pilot scenario — operational backlog and escalation",
  },
  {
    scenarioId: "maintenance-defect",
    role: "primary",
    note: "Core pilot scenario — maintenance response and evidence",
  },
  {
    scenarioId: "transport-disruption",
    role: "optional",
    note: "Optional fourth scenario — transport signal and guest communication",
  },
] as const;

// ── Pilot users ───────────────────────────────────────────────────────────────

export const PILOT_USERS: string[] = [
  "General Manager",
  "Duty Manager",
  "Front Office",
  "Guest Services",
  "Housekeeping",
  "Maintenance",
  "Regional Operations",
  "Transformation or project lead",
];

// ── Pilot stages (Explore → Expand) ──────────────────────────────────────────

export const PILOT_STAGES: PilotStage[] = [
  {
    id: "explore",
    label: "01",
    name: "Explore",
    purpose: "Understand the customer environment and identify the right operational starting point.",
    activities: [
      "Understand the customer environment and operational challenges",
      "Identify the operational problem JALDO will address",
      "Review existing systems, signals and roles",
      "Confirm the first operating-system wedge",
      "Confirm decision-makers and stakeholders",
    ],
    outputs: [
      "Confirmed operating-system selection",
      "Identified signal sources",
      "Named stakeholders and decision-makers",
      "Initial scope and fit assessment",
    ],
    ownerGroups: ["JALDO", "Customer — COO / GM / Transformation lead"],
    readinessRequirements: [
      "Executive sponsor confirmed",
      "Pilot owner confirmed",
      "Property leadership available",
    ],
  },
  {
    id: "align",
    label: "02",
    name: "Align",
    purpose: "Agree pilot scope, governance, roles, systems and success measures before configuration begins.",
    activities: [
      "Agree pilot scope and boundaries",
      "Confirm governance rules and approval requirements",
      "Confirm participating roles and accountabilities",
      "Confirm systems and connection maturity",
      "Confirm proof requirements and success measures",
    ],
    outputs: [
      "Signed pilot scope agreement",
      "Governance alignment document",
      "Role and accountability map",
      "System and signal maturity map",
      "Agreed success measures",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — COO / GM / Governance owner",
      "Deployment partner where engaged",
    ],
    readinessRequirements: [
      "Participating roles confirmed",
      "Data and system approvals confirmed",
      "Governance owner confirmed",
      "Pilot measures approved",
    ],
  },
  {
    id: "configure",
    label: "03",
    name: "Configure",
    purpose: "Configure the JALDO Travel environment for the agreed pilot scope.",
    activities: [
      "Configure the Travel environment in Build & Configure",
      "Activate agreed operating systems",
      "Map roles and accountabilities",
      "Configure governance rules",
      "Select and activate scenarios",
      "Configure playbooks",
      "Configure communications and channels",
      "Configure evidence and outcome requirements",
    ],
    outputs: [
      "Configured Travel environment",
      "Activated operating systems",
      "Configured scenarios and playbooks",
      "Configured communications",
      "Evidence and outcome framework",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — Technology / operations lead",
      "Deployment partner where engaged",
    ],
    readinessRequirements: [
      "Scenarios approved",
      "Playbooks approved",
      "Accountable roles mapped",
      "Escalation pathways approved",
      "Communication channels agreed",
    ],
  },
  {
    id: "pilot",
    label: "04",
    name: "Pilot",
    purpose: "Run agreed workflows in a controlled environment with active staff participation.",
    activities: [
      "Run agreed workflows using configured scenarios",
      "Support staff adoption and onboarding",
      "Monitor active scenarios and signal handling",
      "Record decisions, actions, communications and evidence",
      "Identify operating issues and governance gaps",
    ],
    outputs: [
      "Executed scenario traces",
      "Captured evidence records",
      "Recorded decisions and actions",
      "Staff adoption assessment",
      "Operating issue log",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — GM / Duty Manager / Operations team",
      "Deployment partner where engaged",
    ],
    readinessRequirements: [
      "Staff walkthrough completed",
      "Support model confirmed",
      "Baseline identified",
      "Evidence requirements agreed",
    ],
  },
  {
    id: "prove",
    label: "05",
    name: "Prove",
    purpose: "Review evidence and outcomes against agreed measures. Confirm technical and operational feasibility.",
    activities: [
      "Review captured evidence against agreed requirements",
      "Review outcomes against agreed measures",
      "Compare performance with agreed baseline",
      "Identify repeat patterns and learning",
      "Confirm technical and operational feasibility",
    ],
    outputs: [
      "Evidence review report",
      "Outcome report",
      "Performance comparison",
      "Learning register",
      "Feasibility assessment",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — COO / GM / Outcome owners",
    ],
    readinessRequirements: [
      "Outcome owners confirmed",
      "Review cadence agreed",
      "Evidence completion reviewed",
    ],
  },
  {
    id: "deploy",
    label: "06",
    name: "Deploy",
    purpose: "Complete production engineering and expand to approved operational deployment.",
    activities: [
      "Complete production engineering",
      "Implement authentication and data controls",
      "Implement approved production integrations",
      "Establish support and service levels",
      "Expand users and properties",
    ],
    outputs: [
      "Production deployment",
      "Approved integrations",
      "Agreed support model",
      "Expanded user base",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — Technology / IT",
      "Technology partner",
      "Deployment partner",
    ],
    readinessRequirements: [
      "Production security requirements identified",
      "Systems identified for production integration",
      "Deployment partner engaged",
    ],
  },
  {
    id: "expand",
    label: "07",
    name: "Expand",
    purpose: "Add operating systems, properties, scenarios, partners and learning after proof.",
    activities: [
      "Add additional operating systems",
      "Add properties to the deployment",
      "Add scenarios within proven operating systems",
      "Add approved partner services",
      "Activate Marketplace and Loyalty where approved",
      "Improve playbooks through learning data",
    ],
    outputs: [
      "Expanded deployment",
      "Additional operating systems",
      "Partner integrations",
      "Learning-improved playbooks",
    ],
    ownerGroups: [
      "JALDO",
      "Customer — COO / Group Operations",
      "Deployment partner",
      "Partner ecosystem",
    ],
    readinessRequirements: [
      "Pilot proven and approved",
      "Expansion scope agreed",
      "Commercial expansion terms agreed",
    ],
  },
];

// ── Success framework ─────────────────────────────────────────────────────────

export const PILOT_SUCCESS_MEASURES: SuccessMeasure[] = [
  // Operational
  { id: "sm-signal-captured",     category: "Operational", label: "Signal captured successfully",       targetType: "to-be-agreed" },
  { id: "sm-signal-to-owner",     category: "Operational", label: "Signal-to-owner time",               targetType: "customer-baseline" },
  { id: "sm-time-to-ack",         category: "Operational", label: "Time to acknowledge",                targetType: "pilot-target" },
  { id: "sm-time-to-assign",      category: "Operational", label: "Time to assign",                     targetType: "pilot-target" },
  { id: "sm-time-to-resolve",     category: "Operational", label: "Time to resolve",                    targetType: "pilot-target" },
  { id: "sm-sla-performance",     category: "Operational", label: "SLA performance",                    targetType: "to-be-agreed" },
  { id: "sm-escalation-accuracy", category: "Operational", label: "Escalation accuracy",                targetType: "indicative-target" },
  { id: "sm-playbook-completion", category: "Operational", label: "Playbook completion",                targetType: "indicative-target" },
  { id: "sm-evidence-completion", category: "Operational", label: "Evidence completion",                targetType: "to-be-agreed" },
  { id: "sm-role-accountability", category: "Operational", label: "Role accountability",                targetType: "to-be-agreed" },
  // Guest
  { id: "sm-guest-contacted",     category: "Guest",       label: "Guest contacted",                    targetType: "to-be-agreed" },
  { id: "sm-comm-timeliness",     category: "Guest",       label: "Communication timeliness",           targetType: "pilot-target" },
  { id: "sm-recovery-completed",  category: "Guest",       label: "Recovery completed",                 targetType: "to-be-agreed" },
  { id: "sm-uncertainty-reduced", category: "Guest",       label: "Avoidable uncertainty reduced",      targetType: "not-yet-measured" },
  { id: "sm-guest-outcome",       category: "Guest",       label: "Guest outcome recorded",             targetType: "to-be-agreed" },
  { id: "sm-repeat-avoided",      category: "Guest",       label: "Repeat issue avoided where measurable", targetType: "not-yet-measured" },
  // Staff
  { id: "sm-workflow-adoption",   category: "Staff",       label: "Workflow adoption",                  targetType: "to-be-agreed" },
  { id: "sm-role-clarity",        category: "Staff",       label: "Role clarity",                       targetType: "indicative-target" },
  { id: "sm-handoff-quality",     category: "Staff",       label: "Handoff quality",                    targetType: "to-be-agreed" },
  { id: "sm-reduced-dup-comms",   category: "Staff",       label: "Reduced duplicate communication",   targetType: "not-yet-measured" },
  { id: "sm-manager-visibility",  category: "Staff",       label: "Manager visibility",                 targetType: "indicative-target" },
  { id: "sm-staff-feedback",      category: "Staff",       label: "Staff feedback",                     targetType: "to-be-agreed" },
  // Governance
  { id: "sm-correct-rule",        category: "Governance",  label: "Correct rule applied",               targetType: "to-be-agreed" },
  { id: "sm-approval-completed",  category: "Governance",  label: "Required approval completed",        targetType: "to-be-agreed" },
  { id: "sm-restricted-comms",    category: "Governance",  label: "Restricted communication controlled", targetType: "to-be-agreed" },
  { id: "sm-escalation-correct",  category: "Governance",  label: "Escalation completed correctly",     targetType: "to-be-agreed" },
  { id: "sm-trace-complete",      category: "Governance",  label: "Evidence and decision trace complete", targetType: "to-be-agreed" },
  // Value
  { id: "sm-time-saved",          category: "Value",       label: "Time saved",                         targetType: "not-yet-measured" },
  { id: "sm-unresolved-reduced",  category: "Value",       label: "Reduced unresolved work",            targetType: "not-yet-measured" },
  { id: "sm-repeat-reduced",      category: "Value",       label: "Reduced repeat incidents",           targetType: "not-yet-measured" },
  { id: "sm-recovery-consistent", category: "Value",       label: "Improved recovery consistency",      targetType: "indicative-target" },
  { id: "sm-failure-avoided",     category: "Value",       label: "Avoided service failure",            targetType: "not-yet-measured" },
  { id: "sm-revenue-attr",        category: "Value",       label: "Attributable revenue where valid",   targetType: "not-yet-measured", note: "Only where attribution, permission and measurement are credible" },
  { id: "sm-friction-reduced",    category: "Value",       label: "Reduced operating friction",         targetType: "indicative-target" },
];

// ── Readiness checklist ───────────────────────────────────────────────────────

export const READINESS_CHECKLIST: ReadinessItem[] = [
  // Customer readiness
  { id: "rc-exec-sponsor",       label: "Executive sponsor confirmed",              category: "Customer",    defaultState: "not-started" },
  { id: "rc-pilot-owner",        label: "Pilot owner confirmed",                    category: "Customer",    defaultState: "not-started" },
  { id: "rc-property-leadership",label: "Property leadership confirmed",             category: "Customer",    defaultState: "not-started" },
  { id: "rc-roles-confirmed",    label: "Participating roles confirmed",             category: "Customer",    defaultState: "not-started" },
  { id: "rc-data-approvals",     label: "Data and system approvals confirmed",       category: "Customer",    defaultState: "not-started" },
  { id: "rc-governance-owner",   label: "Governance owner confirmed",               category: "Customer",    defaultState: "not-started" },
  // Technical readiness
  { id: "rt-systems-identified", label: "Systems identified",                        category: "Technical",   defaultState: "not-started" },
  { id: "rt-signal-sources",     label: "Signal sources mapped",                    category: "Technical",   defaultState: "not-started" },
  { id: "rt-maturity-classified",label: "Integration maturity classified",           category: "Technical",   defaultState: "not-started" },
  { id: "rt-synthetic-fallbacks",label: "Synthetic fallbacks agreed",               category: "Technical",   defaultState: "not-started" },
  { id: "rt-comms-channels",     label: "Communication channels agreed",            category: "Technical",   defaultState: "not-started" },
  { id: "rt-security-req",       label: "Security requirements identified",          category: "Technical",   defaultState: "requires-production-engineering" },
  // Operational readiness
  { id: "ro-scenarios-approved", label: "Scenarios approved",                       category: "Operational", defaultState: "not-started" },
  { id: "ro-playbooks-approved", label: "Playbooks approved",                       category: "Operational", defaultState: "not-started" },
  { id: "ro-roles-mapped",       label: "Accountable roles mapped",                 category: "Operational", defaultState: "not-started" },
  { id: "ro-escalation-approved",label: "Escalation pathways approved",             category: "Operational", defaultState: "not-started" },
  { id: "ro-walkthrough",        label: "Staff walkthrough completed",              category: "Operational", defaultState: "not-started" },
  { id: "ro-support-model",      label: "Support model confirmed",                  category: "Operational", defaultState: "not-started" },
  // Measurement readiness
  { id: "rm-baseline",           label: "Baseline identified",                      category: "Measurement", defaultState: "not-started" },
  { id: "rm-measures-approved",  label: "Pilot measures approved",                  category: "Measurement", defaultState: "not-started" },
  { id: "rm-evidence-agreed",    label: "Evidence requirements agreed",             category: "Measurement", defaultState: "not-started" },
  { id: "rm-outcome-owners",     label: "Outcome owners confirmed",                 category: "Measurement", defaultState: "not-started" },
  { id: "rm-review-cadence",     label: "Review cadence agreed",                    category: "Measurement", defaultState: "not-started" },
];

export const VALID_READINESS_STATES: ReadinessState[] = [
  "not-started",
  "in-progress",
  "ready",
  "blocked",
  "requires-production-engineering",
];

export const READINESS_STATE_LABELS: Record<ReadinessState, string> = {
  "not-started":                   "Not started",
  "in-progress":                   "In progress",
  "ready":                         "Ready",
  "blocked":                       "Blocked",
  "requires-production-engineering": "Production engineering required",
};

// ── Deployment package ────────────────────────────────────────────────────────

export const DEPLOYMENT_PACKAGE: DeploymentPackageSection[] = [
  {
    id: "alignment-package",
    name: "Alignment Package",
    items: [
      "Discovery workshop",
      "Operating-system selection",
      "Systems and signal map",
      "Governance map",
      "Role and accountability map",
      "Pilot plan",
      "Outcome framework",
    ],
  },
  {
    id: "configuration-package",
    name: "Configuration Package",
    items: [
      "Travel environment configuration",
      "Scenario selection",
      "Playbook configuration",
      "Role mapping",
      "Communication configuration",
      "Evidence and outcome configuration",
    ],
  },
  {
    id: "pilot-package",
    name: "Pilot Package",
    items: [
      "Working proof environment",
      "Scenario simulation",
      "Staff walkthrough",
      "Controlled activation",
      "Pilot support",
      "Evidence and outcome review",
    ],
  },
  {
    id: "production-package",
    name: "Production Deployment Package",
    productionOnly: true,
    productionNote:
      "Described at requirements level only. Production components require approved engineering, security review and commercial agreement.",
    items: [
      "Production integrations",
      "Authentication and permissions",
      "Data controls",
      "Monitoring and alerting",
      "Audit storage",
      "Support model and service levels",
      "Change management and training",
    ],
  },
];

// ── Expansion pathway ─────────────────────────────────────────────────────────

export const EXPANSION_STAGES: ExpansionStage[] = [
  {
    id: "expand-scenarios",
    label: "Stage 1 — Expand scenarios",
    description: "Add additional scenarios within the same operating systems already activated.",
    examples: ["Premium guest opportunity", "Service backlog variation", "Additional maintenance types"],
    maturityGate: "Pilot proven and operating systems established",
  },
  {
    id: "expand-roles",
    label: "Stage 2 — Expand roles",
    description: "Include more departments, properties or regional leadership in the active deployment.",
    examples: ["Regional operations", "Group operations", "Additional property roles"],
    maturityGate: "Core roles proven and confident in the platform",
  },
  {
    id: "expand-properties",
    label: "Stage 3 — Expand properties",
    description: "Move from one property to multi-property deployment within the same group.",
    examples: ["Second property in the same group", "Regional cluster", "Group-wide rollout"],
    maturityGate: "Property model proven and staff adoption confirmed",
  },
  {
    id: "expand-operating-systems",
    label: "Stage 4 — Expand operating systems",
    description: "Activate additional capability after operational trust is established.",
    examples: [
      "Safety and Guest Welfare (cross-cutting — can activate earlier if welfare use case is the driver)",
      "Broader Operator Intelligence",
      "Marketplace and Loyalty Activation (after operational trust and permission are established)",
    ],
    maturityGate: "Operational trust established; Marketplace requires approved governance and commercial model",
  },
  {
    id: "expand-integrations",
    label: "Stage 5 — Expand integrations",
    description: "Replace synthetic or manual signal sources with approved production connectors.",
    examples: ["PMS production connector", "Guest messaging production connector", "IoT sensor integration"],
    maturityGate: "Production engineering completed and security approved",
  },
  {
    id: "expand-partners",
    label: "Stage 6 — Expand partners",
    description: "Activate intervention, service, distribution or technology partner ecosystem.",
    examples: ["Intervention partner service routing", "Distribution channel activation", "Co-selling arrangement"],
    maturityGate: "Partner agreements in place and commercial model approved",
  },
  {
    id: "expand-cross-property-learning",
    label: "Stage 7 — Cross-property learning",
    description:
      "Apply learning across properties. Only position as a production capability after appropriate data boundaries, privacy controls, customer permissions and governance are established.",
    examples: ["Group-level pattern detection", "Playbook improvement from multi-property evidence"],
    maturityGate:
      "Requires data boundaries, privacy controls, customer permissions, governance and technical infrastructure. Do not represent as an existing capability.",
  },
];

// ── Validation helpers ────────────────────────────────────────────────────────

export const VALID_SUCCESS_MEASURE_TARGET_TYPES: SuccessMeasureTargetType[] = [
  "customer-baseline",
  "pilot-target",
  "indicative-target",
  "to-be-agreed",
  "not-yet-measured",
];

export const PILOT_STAGE_IDS: string[] = PILOT_STAGES.map(s => s.id);

export const PILOT_SCENARIO_IDS: string[] = PILOT_SCENARIOS.map(s => s.scenarioId);

export const PILOT_OS_IDS: string[] = PILOT_OPERATING_SYSTEMS.map(o => o.id);
