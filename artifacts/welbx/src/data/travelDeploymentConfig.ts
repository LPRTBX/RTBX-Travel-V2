/**
 * RTBX Travel — Deployment Configuration Model.
 *
 * Defines the canonical typed model for a Travel deployment environment.
 * All data is local synthetic demonstration data — not a production customer
 * environment and not connected to any live system.
 *
 * Sprint 4. Persisted via DeploymentContext → localStorage.
 */

// ── Status & Maturity types ────────────────────────────────────────────────────

export type DeploymentStatus =
  | "draft"
  | "incomplete"
  | "ready-for-simulation"
  | "ready-for-pilot-design"
  | "active-simulation"
  | "active-pilot"
  | "blocked"
  | "production-engineering-required";

/** Signal/system connection maturity. "integrated" is never a default. */
export type SystemMaturity =
  | "simulated"
  | "manual"
  | "demonstrated"
  | "connector-ready"
  | "planned";

export type GovernanceRuleSource =
  | "brand-standard"
  | "property-procedure"
  | "demo-default"
  | "regulatory"
  | "to-be-agreed";

export type OutcomeTargetType =
  | "customer-configured"
  | "pilot-defined"
  | "indicative"
  | "to-be-agreed";

export type CommunicationGenerationMode =
  | "ai-draft-human-review"
  | "template-human-review"
  | "human-authored"
  | "restricted";

/** Execution state machine — used by RuntimeEngine in Sprint 4B. */
export type ScenarioExecutionState =
  | "signal-received"
  | "understanding"
  | "decision-required"
  | "approval-required"
  | "in-action"
  | "escalated"
  | "resolved"
  | "closed";

// ── Sub-configuration types ────────────────────────────────────────────────────

export interface SystemConfig {
  id: string;
  name: string;
  category: string;
  maturity: SystemMaturity;
  notes?: string;
}

export interface DeploymentRoleConfig {
  roleId: string;   // matches TRAVEL_ROLES[*].id
  active: boolean;
  localTitle?: string;  // optional override for the property's naming
}

export interface DeploymentOSConfig {
  osId: string;     // matches TRAVEL_OPERATING_SYSTEMS[*].id
  active: boolean;
}

export interface GovernanceRule {
  id: string;
  label: string;
  value: string;
  source: GovernanceRuleSource;
  required: boolean;
}

export interface DeploymentScenarioConfig {
  scenarioId: string;   // matches TRAVEL_SCENARIOS[*].id
  playbookId: string;   // matches TRAVEL_PLAYBOOKS[*].id
  active: boolean;
  accountableRoleId: string;
  syntheticSignalOverride: boolean;  // if true, always show a "Synthetic signal" label
  notes?: string;
}

export interface DeploymentCommunicationConfig {
  id: string;
  communicationType: string;
  audience: string;
  channel: string;
  approvalRequired: boolean;
  generationMode: CommunicationGenerationMode;
  distressedGuestRestricted: boolean;  // must be true for welfare scenarios
}

export interface DeploymentEvidenceConfig {
  id: string;
  evidenceType: string;
  required: boolean;
  ownerRoleId: string;
  completionRule: string;
}

export interface DeploymentOutcomeConfig {
  id: string;
  metric: string;
  targetType: OutcomeTargetType;
  targetValue?: string;
  measurementMethod: string;
}

// ── Main deployment configuration ─────────────────────────────────────────────

export interface TravelDeploymentConfig {
  // Identity
  id: string;
  deploymentName: string;
  organisationName: string;

  // Environment
  propertyType: string;
  roomCount: number;
  region: string;
  timezone: string;
  operatingModel: string;
  deploymentMode: string;

  // Configuration sections
  systems: SystemConfig[];
  roles: DeploymentRoleConfig[];
  operatingSystems: DeploymentOSConfig[];
  governance: GovernanceRule[];
  scenarios: DeploymentScenarioConfig[];
  communications: DeploymentCommunicationConfig[];
  evidence: DeploymentEvidenceConfig[];
  outcomes: DeploymentOutcomeConfig[];

  // Status & lifecycle
  deploymentStatus: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;

  /** Always true — all data is synthetic demonstration data. */
  synthetic: true;
}

// ── Default deployment — "Harbour Hotel Melbourne — Pilot Environment" ─────────

export const DEFAULT_DEPLOYMENT: TravelDeploymentConfig = {
  id: "dep-harbour-hotel-melbourne",
  deploymentName: "Harbour Hotel Melbourne — Pilot Environment",
  organisationName: "Harbour Hotel Group",

  propertyType: "Hotel",
  roomCount: 220,
  region: "Melbourne, Victoria, Australia",
  timezone: "Australia/Melbourne",
  operatingModel: "Owner-operated",
  deploymentMode: "Demo environment",

  systems: [
    { id: "sys-pms",           name: "Property Management System (PMS)",  category: "Core Operations",     maturity: "simulated",  notes: "Opera Cloud — connection simulated for demo" },
    { id: "sys-housekeeping",  name: "Housekeeping System",               category: "Core Operations",     maturity: "simulated",  notes: "Housekeeping tasks simulated via task queue" },
    { id: "sys-guest-app",     name: "Guest Interface",                   category: "Guest Communication", maturity: "demonstrated", notes: "Guest Interface — working demo" },
    { id: "sys-crm",           name: "CRM / Guest Profile",               category: "Guest Intelligence",  maturity: "manual",     notes: "Guest data entered manually for pilot" },
    { id: "sys-task",          name: "Task Management System",            category: "Core Operations",     maturity: "simulated",  notes: "Task queue simulated" },
    { id: "sys-loyalty",       name: "Loyalty Platform",                  category: "Guest Intelligence",  maturity: "manual",     notes: "Loyalty tier status supplied manually" },
    { id: "sys-maintenance",   name: "Maintenance / CMMS",                category: "Property Operations", maturity: "manual",     notes: "Maintenance defects logged manually" },
    { id: "sys-guest-msg",     name: "Guest Messaging / SMS",             category: "Guest Communication", maturity: "simulated",  notes: "SMS delivery simulated" },
    { id: "sys-staff-app",     name: "Staff Communication App",           category: "Staff Operations",    maturity: "demonstrated", notes: "Demonstrated — staff prompt delivery" },
    { id: "sys-iot",           name: "IoT / Sensor Network",              category: "Property Operations", maturity: "planned",    notes: "Not connected in this deployment" },
  ],

  roles: [
    { roleId: "front-office",          active: true  },
    { roleId: "guest-services",        active: true  },
    { roleId: "concierge",             active: true  },
    { roleId: "housekeeping",          active: true  },
    { roleId: "maintenance-lead",      active: true  },
    { roleId: "duty-manager",          active: true  },
    { roleId: "operations-manager",    active: true  },
    { roleId: "safety-security-lead",  active: true  },
    { roleId: "revenue-loyalty-lead",  active: true  },
    { roleId: "general-manager",       active: true  },
    { roleId: "regional-operations",   active: false },
    { roleId: "group-operations",      active: false },
    { roleId: "partner-service-provider", active: false },
  ],

  operatingSystems: [
    { osId: "guest-experience-os",                active: true  },
    { osId: "service-recovery-staff-response-os", active: true  },
    { osId: "operator-intelligence-os",           active: true  },
    { osId: "safety-guest-welfare-os",            active: true  },
    { osId: "marketplace-loyalty-activation-os",  active: false },
  ],

  governance: [
    { id: "gov-01", label: "Service Recovery Threshold",       value: "Guest acknowledgement within 10 minutes of signal receipt", source: "demo-default",        required: true  },
    { id: "gov-02", label: "Compensation Approval Authority",  value: "Duty Manager approval required for all compensation and upgrades", source: "property-procedure", required: true  },
    { id: "gov-03", label: "Guest Communication Approval",     value: "Standard messages do not require approval; recovery and compensation messages require Duty Manager approval", source: "demo-default", required: true },
    { id: "gov-04", label: "Evidence Retention",               value: "All scenario evidence retained for 90 days in the assurance record", source: "property-procedure", required: true },
    { id: "gov-05", label: "Welfare Escalation Rule",          value: "Welfare and safety events: mandatory human escalation to Duty Manager within 2 minutes; AI cannot close welfare events", source: "brand-standard", required: true },
    { id: "gov-06", label: "Escalation Timeframe",             value: "No Duty Manager response within 3 minutes triggers General Manager escalation", source: "demo-default", required: false },
    { id: "gov-07", label: "Privacy and Data Controls",        value: "Welfare-sensitive evidence restricted to minimum necessary; no personal data retained beyond operational use", source: "regulatory", required: true },
    { id: "gov-08", label: "Commercial Activation Gate",       value: "Marketplace OS disabled: commercial activation only after trust and signal accuracy are established", source: "property-procedure", required: false },
  ],

  scenarios: [
    {
      scenarioId: "repeat-guest-room-not-ready",
      playbookId: "pb-repeat-guest-room-not-ready",
      active: true,
      accountableRoleId: "duty-manager",
      syntheticSignalOverride: true,
      notes: "Active — room delay signals simulated via PMS stub",
    },
    {
      scenarioId: "service-backlog",
      playbookId: "pb-service-backlog",
      active: true,
      accountableRoleId: "operations-manager",
      syntheticSignalOverride: true,
      notes: "Active — backlog signals simulated via task queue stub",
    },
    {
      scenarioId: "maintenance-defect",
      playbookId: "pb-maintenance-defect",
      active: true,
      accountableRoleId: "maintenance-lead",
      syntheticSignalOverride: true,
      notes: "Active — defect reports entered manually",
    },
    {
      scenarioId: "distressed-guest",
      playbookId: "pb-distressed-guest",
      active: false,
      accountableRoleId: "duty-manager",
      syntheticSignalOverride: false,
      notes: "Inactive in this deployment — activate via Safety & Guest Welfare OS",
    },
    {
      scenarioId: "transport-disruption",
      playbookId: "pb-transport-disruption",
      active: false,
      accountableRoleId: "guest-services",
      syntheticSignalOverride: false,
      notes: "Inactive — transport integration not configured for this deployment",
    },
    {
      scenarioId: "premium-guest-opportunity",
      playbookId: "pb-premium-guest-opportunity",
      active: false,
      accountableRoleId: "revenue-loyalty-lead",
      syntheticSignalOverride: false,
      notes: "Inactive — Marketplace OS disabled; prototype maturity",
    },
  ],

  communications: [
    { id: "comm-01", communicationType: "Guest Acknowledgement",       audience: "Guest",           channel: "Approved Guest Channel", approvalRequired: false, generationMode: "ai-draft-human-review",  distressedGuestRestricted: false },
    { id: "comm-02", communicationType: "Recovery Offer",              audience: "Guest",           channel: "Approved Guest Channel", approvalRequired: true,  generationMode: "template-human-review",  distressedGuestRestricted: false },
    { id: "comm-03", communicationType: "Internal Staff Prompt",       audience: "Frontline Staff", channel: "Staff App",         approvalRequired: false, generationMode: "ai-draft-human-review",  distressedGuestRestricted: false },
    { id: "comm-04", communicationType: "Manager Escalation Alert",    audience: "Duty Manager",    channel: "In-app Alert",      approvalRequired: false, generationMode: "ai-draft-human-review",  distressedGuestRestricted: false },
    { id: "comm-05", communicationType: "Welfare Escalation",          audience: "Duty Manager",    channel: "In-app Alert",      approvalRequired: false, generationMode: "human-authored",         distressedGuestRestricted: true  },
    { id: "comm-06", communicationType: "Room Ready Notification",     audience: "Guest",           channel: "Approved Guest Channel", approvalRequired: true,  generationMode: "template-human-review",  distressedGuestRestricted: false },
    { id: "comm-07", communicationType: "Reallocation Briefing",       audience: "Staff",           channel: "Staff App",         approvalRequired: false, generationMode: "ai-draft-human-review",  distressedGuestRestricted: false },
  ],

  evidence: [
    { id: "ev-01", evidenceType: "Signal verification record",         required: true,  ownerRoleId: "front-office",        completionRule: "Recorded before action is taken" },
    { id: "ev-02", evidenceType: "Guest acknowledgement delivery",     required: true,  ownerRoleId: "front-office",        completionRule: "Delivery confirmation recorded" },
    { id: "ev-03", evidenceType: "Recovery decision and approval",     required: true,  ownerRoleId: "duty-manager",        completionRule: "Recorded at time of decision — not retrospectively" },
    { id: "ev-04", evidenceType: "Room readiness confirmation",        required: true,  ownerRoleId: "housekeeping",        completionRule: "Housekeeping system updated before guest notified" },
    { id: "ev-05", evidenceType: "Owner assignment record",            required: true,  ownerRoleId: "duty-manager",        completionRule: "Named owner confirmed before action" },
    { id: "ev-06", evidenceType: "Task assignment confirmation",       required: true,  ownerRoleId: "operations-manager",  completionRule: "Recorded when task is assigned" },
    { id: "ev-07", evidenceType: "Welfare signal record",              required: true,  ownerRoleId: "front-office",        completionRule: "Minimum necessary — privacy boundaries applied" },
    { id: "ev-08", evidenceType: "Defect report and classification",   required: true,  ownerRoleId: "maintenance-lead",    completionRule: "Recorded when defect is identified" },
    { id: "ev-09", evidenceType: "Escalation notification record",     required: false, ownerRoleId: "duty-manager",        completionRule: "Recorded when escalation is triggered" },
    { id: "ev-10", evidenceType: "Guest outcome record",               required: true,  ownerRoleId: "duty-manager",        completionRule: "Recorded within 15 minutes of resolution" },
  ],

  outcomes: [
    { id: "out-01", metric: "Time from signal to guest acknowledgement", targetType: "customer-configured", targetValue: "Within 10 minutes",     measurementMethod: "Timestamp delta: signal → first guest message delivered" },
    { id: "out-02", metric: "Time from signal to resolution",            targetType: "indicative",           targetValue: "Within 30 minutes",     measurementMethod: "Timestamp delta: signal → scenario closed" },
    { id: "out-03", metric: "Escalation rate",                           targetType: "pilot-defined",        measurementMethod: "Percentage of scenarios requiring Duty Manager escalation" },
    { id: "out-04", metric: "Evidence completion rate",                  targetType: "indicative",           targetValue: "100%",                  measurementMethod: "Required evidence fields completed vs total required" },
    { id: "out-05", metric: "Guest outcome recorded",                    targetType: "indicative",           targetValue: "100% of closed scenarios", measurementMethod: "Boolean: outcome record present on closure" },
    { id: "out-06", metric: "Repeat pattern detection",                  targetType: "to-be-agreed",         measurementMethod: "Flag if same scenario type occurs more than twice in 7 days" },
  ],

  deploymentStatus: "ready-for-simulation",
  createdAt: "2026-07-20T09:00:00.000Z",
  updatedAt: "2026-07-20T09:00:00.000Z",
  synthetic: true,
};

// ── Readiness calculation ────────────────────────────────────────────────────

export type ReadinessState =
  | "Incomplete"
  | "Ready for simulation"
  | "Ready for pilot design"
  | "Blocked"
  | "Production engineering required";

export const READINESS_COLORS: Record<ReadinessState, string> = {
  "Incomplete":                    "#f97316",
  "Ready for simulation":          "#10b981",
  "Ready for pilot design":        "#3b82f6",
  "Blocked":                       "#ef4444",
  "Production engineering required": "#a78bfa",
};

export function computeReadiness(draft: TravelDeploymentConfig): ReadinessState {
  const activeOSes    = draft.operatingSystems.filter(o => o.active);
  const activeScenarios = draft.scenarios.filter(s => s.active);
  const activeRoles   = draft.roles.filter(r => r.active);

  if (activeOSes.length === 0)     return "Incomplete";
  if (activeScenarios.length === 0) return "Incomplete";
  if (activeRoles.length === 0)    return "Incomplete";

  // Check for scenario without its OS active
  for (const ds of activeScenarios) {
    // We allow checking without importing travelScenarios to avoid circular deps.
    // The validation in DeploymentContext will do full checks.
    if (!ds.accountableRoleId) return "Incomplete";
  }

  // Check required governance is filled
  const missingGov = draft.governance.filter(g => g.required && !g.value.trim());
  if (missingGov.length > 0) return "Incomplete";

  return "Ready for simulation";
}

// ── Approved system maturity options (never "integrated" in defaults) ──────────

export const SYSTEM_MATURITY_OPTIONS: { value: SystemMaturity; label: string; description: string }[] = [
  { value: "simulated",      label: "Simulated",       description: "Signal data simulated via stub — no real system connected" },
  { value: "manual",         label: "Manual",          description: "Data entered manually by staff — no automated connection" },
  { value: "demonstrated",   label: "Demonstrated",    description: "Working interface demonstrated — not in production" },
  { value: "connector-ready", label: "Connector-ready", description: "Connector built and tested — pending activation" },
  { value: "planned",        label: "Planned",         description: "Integration planned — not yet built" },
];

export const GOVERNANCE_SOURCE_LABELS: Record<GovernanceRuleSource, string> = {
  "brand-standard":     "Brand Standard",
  "property-procedure": "Property Procedure",
  "demo-default":       "Demo Default",
  "regulatory":         "Regulatory",
  "to-be-agreed":       "To Be Agreed",
};

export const GOVERNANCE_SOURCE_COLORS: Record<GovernanceRuleSource, string> = {
  "brand-standard":     "#3b82f6",
  "property-procedure": "#10b981",
  "demo-default":       "#c9a84c",
  "regulatory":         "#ef4444",
  "to-be-agreed":       "rgba(255,255,255,0.4)",
};

export const OUTCOME_TARGET_LABELS: Record<OutcomeTargetType, string> = {
  "customer-configured": "Customer-configured",
  "pilot-defined":       "Pilot-defined",
  "indicative":          "Indicative",
  "to-be-agreed":        "To be agreed",
};

export const COMM_MODE_LABELS: Record<CommunicationGenerationMode, string> = {
  "ai-draft-human-review": "AI draft — human review",
  "template-human-review": "Template — human review",
  "human-authored":        "Human-authored only",
  "restricted":            "Restricted — human only",
};
