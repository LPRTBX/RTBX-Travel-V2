/**
 * travelDeploymentPathway.ts — Sprint 5
 *
 * Canonical deployment and integration responsibility data for JALDO Travel.
 *
 * Covers:
 * - Integration responsibility matrix (per source system)
 * - Deployment responsibility matrix (across parties)
 *
 * All connector maturity is labelled accurately.
 * Connector-ready status is only claimed where the Sprint 2 proof standard is met.
 * No production integration is implied where it does not exist.
 * All data is synthetic demonstration content.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type IntegrationMaturity =
  | "planned"
  | "mapped"
  | "mocked"
  | "tested"
  | "integrated"
  | "production";

export type IntegrationProofStatus =
  | "none"
  | "test"
  | "log"
  | "screenshot"
  | "customer-deployment";

export type IntegrationRecord = {
  id: string;
  system: string;
  provider?: string;
  purpose: string;
  signalsReceived: string[];
  actionsSent: string[];
  interfaceType: string;
  authenticationOwner: string;
  mappingOwner: string;
  customerResponsibility: string;
  partnerResponsibility: string;
  rtbxResponsibility: string;
  failureOwner: string;
  maturity: IntegrationMaturity;
  proof: IntegrationProofStatus;
  maturityNote?: string;
};

export type DeploymentActivity = {
  id: string;
  label: string;
  rtbx: string;
  customer: string;
  technologyPartner: string;
  deploymentPartner: string;
  interventionPartner: string;
};

// ── Integration responsibility matrix ─────────────────────────────────────────

export const INTEGRATION_RECORDS: IntegrationRecord[] = [
  {
    id: "int-pms",
    system: "Property Management System (PMS)",
    provider: "Opera Cloud / PMS provider",
    purpose: "Core operational signal source — room status, reservation data, check-in and check-out events",
    signalsReceived: ["Room status", "Reservation status", "Guest profile", "Check-in / check-out events", "VIP and loyalty flag"],
    actionsSent: ["Room status update requests (planned)", "Task creation (planned)"],
    interfaceType: "API or webhook (planned — not production)",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "System access approval, credentials, data governance",
    partnerResponsibility: "API documentation, interface support, change notification",
    rtbxResponsibility: "Signal mapping, context assembly, moment detection",
    failureOwner: "JALDO (signal gap handling) / Partner (interface failure)",
    maturity: "mapped",
    proof: "none",
    maturityNote:
      "Signal mapping is architecturally defined. Production PMS connector requires approved integration engineering.",
  },
  {
    id: "int-housekeeping",
    system: "Housekeeping System",
    provider: "HotSOS / ALICE / property-specific",
    purpose: "Room readiness and housekeeping task signals",
    signalsReceived: ["Room ready status", "Housekeeping task status", "Cleaning completion"],
    actionsSent: ["Housekeeping task creation (planned)", "Priority task flag (planned)"],
    interfaceType: "API or manual input",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "System credentials, operational use approval",
    partnerResponsibility: "API interface, change notification",
    rtbxResponsibility: "Signal receipt, context update, moment trigger",
    failureOwner: "JALDO (fallback to manual) / Partner (interface)",
    maturity: "mapped",
    proof: "none",
    maturityNote:
      "Housekeeping signals are simulated in the demonstration environment. Production connector requires approved integration.",
  },
  {
    id: "int-crm-guest-profile",
    system: "CRM / Guest Profile",
    provider: "Salesforce / Opera / property-specific",
    purpose: "Guest context — loyalty status, preferences, history, VIP flag",
    signalsReceived: ["Guest profile", "Loyalty tier", "Guest preferences", "Stay history", "VIP and complaint history"],
    actionsSent: ["Guest note creation (planned)"],
    interfaceType: "Manual input — no production connector",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "Data governance, GDPR/Privacy Act compliance, access approval",
    partnerResponsibility: "Data access interface",
    rtbxResponsibility: "Context assembly from guest profile data",
    failureOwner: "Customer (data quality) / JALDO (context fallback)",
    maturity: "mapped",
    proof: "none",
    maturityNote:
      "Guest profile data is entered manually in the demonstration environment. Production integration requires data processing agreement and security review.",
  },
  {
    id: "int-task-management",
    system: "Task Management System",
    provider: "HotSOS / ALICE / property-specific",
    purpose: "Operational task creation, routing and completion tracking",
    signalsReceived: ["Task status", "Task completion", "Backlog level"],
    actionsSent: ["Task creation (planned)", "Task priority update (planned)"],
    interfaceType: "API (planned — not production)",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "System access, operational use approval",
    partnerResponsibility: "Task creation API, status webhook",
    rtbxResponsibility: "Task routing, playbook step mapping, evidence linkage",
    failureOwner: "JALDO (fallback) / Partner (API)",
    maturity: "mocked",
    proof: "screenshot",
    maturityNote:
      "Task queue simulated in the demonstration environment. Production integration planned.",
  },
  {
    id: "int-loyalty",
    system: "Loyalty Platform",
    provider: "Property or group loyalty system",
    purpose: "Loyalty tier, points balance and eligibility signals for guest decisions",
    signalsReceived: ["Loyalty tier", "Points balance", "Eligibility status"],
    actionsSent: ["Points award trigger (planned for Marketplace OS)"],
    interfaceType: "Manual input — no production connector",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "Loyalty programme approval, data governance",
    partnerResponsibility: "Loyalty data interface (where applicable)",
    rtbxResponsibility: "Context integration, Marketplace OS activation",
    failureOwner: "Customer (data quality) / JALDO (context fallback)",
    maturity: "mapped",
    proof: "none",
    maturityNote:
      "Loyalty data entered manually in demonstration. Marketplace and Loyalty OS requires production integration and commercial approval before activation.",
  },
  {
    id: "int-maintenance",
    system: "Maintenance / CMMS",
    provider: "Property-specific CMMS",
    purpose: "Maintenance defect signals and work order creation",
    signalsReceived: ["Defect reports", "Work order status", "Asset failure alerts"],
    actionsSent: ["Work order creation (planned)", "Escalation notification (planned)"],
    interfaceType: "Manual input — no production connector",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "System access, operational approval",
    partnerResponsibility: "CMMS interface, work order API",
    rtbxResponsibility: "Defect signal handling, playbook activation, evidence linkage",
    failureOwner: "JALDO (fallback) / Customer (operational)",
    maturity: "mapped",
    proof: "none",
    maturityNote: "Maintenance defects entered manually in demonstration. Production integration requires CMMS API assessment.",
  },
  {
    id: "int-guest-messaging",
    system: "Guest Messaging / SMS",
    provider: "Kipsu / Zingle / Twilio",
    purpose: "Guest-facing communication delivery — SMS, messaging and notification",
    signalsReceived: ["Guest message replies", "Opt-in/opt-out status"],
    actionsSent: ["SMS / message send (simulated in demonstration)", "Acknowledgement messages"],
    interfaceType: "API (simulated in demonstration — not production)",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "Guest consent, messaging compliance, channel approval",
    partnerResponsibility: "Message delivery API, delivery receipt",
    rtbxResponsibility: "Communication governance, template management, delivery tracking",
    failureOwner: "JALDO (escalation) / Partner (delivery)",
    maturity: "mocked",
    proof: "screenshot",
    maturityNote:
      "Guest messaging simulated in demonstration. Production communication dispatch requires approved provider, authentication and compliance review.",
  },
  {
    id: "int-staff-app",
    system: "Staff Communication App",
    provider: "Property-specific / HotSOS / custom",
    purpose: "Staff notification, prompt delivery and task handoff",
    signalsReceived: ["Staff acknowledgement", "Task acceptance"],
    actionsSent: ["Staff prompt or task notification (demonstrated)", "Escalation alert"],
    interfaceType: "Demonstrated interface — not full production connector",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "Staff onboarding, app deployment, role assignment",
    partnerResponsibility: "App interface, notification API",
    rtbxResponsibility: "Prompt generation, role routing, acknowledgement tracking",
    failureOwner: "JALDO (escalation) / Customer (staff response)",
    maturity: "tested",
    proof: "screenshot",
    maturityNote:
      "Staff prompt delivery is demonstrated in the working environment. Full production connector requires authentication integration.",
  },
  {
    id: "int-iot-sensors",
    system: "IoT / Sensor Network",
    provider: "Building management provider",
    purpose: "Environmental and asset signals — temperature, occupancy, sensor alerts",
    signalsReceived: ["Environmental alerts", "Occupancy signals", "Asset condition"],
    actionsSent: [],
    interfaceType: "Planned — not connected",
    authenticationOwner: "Customer",
    mappingOwner: "JALDO",
    customerResponsibility: "IoT network deployment, data governance",
    partnerResponsibility: "Sensor network and data interface",
    rtbxResponsibility: "Signal receipt and moment detection (when connected)",
    failureOwner: "Partner (sensor) / Customer (physical)",
    maturity: "planned",
    proof: "none",
    maturityNote:
      "IoT integration is planned. Not connected in the demonstration environment.",
  },
];


// ── Deployment responsibility matrix ──────────────────────────────────────────

export const DEPLOYMENT_RESPONSIBILITIES: DeploymentActivity[] = [
  {
    id: "dep-discovery",
    label: "Discovery",
    rtbx: "Facilitates discovery workshop; provides operating-system model and scenario framework",
    customer: "Provides system inventory, operational context, stakeholder access",
    technologyPartner: "Provides technical assessment of source systems",
    deploymentPartner: "Coordinates discovery process; manages customer stakeholders",
    interventionPartner: "Not typically involved at this stage",
  },
  {
    id: "dep-system-access",
    label: "System Access",
    rtbx: "Defines integration requirements and signal mapping",
    customer: "Provides and approves system credentials; manages internal IT governance",
    technologyPartner: "Provides technical interface and authentication support",
    deploymentPartner: "Assists with system access coordination",
    interventionPartner: "Not typically involved",
  },
  {
    id: "dep-governance-approval",
    label: "Governance Approval",
    rtbx: "Configures Decision Spine rules; provides governance framework",
    customer: "Approves all governance rules, decision thresholds and escalation pathways",
    technologyPartner: "Not typically involved",
    deploymentPartner: "Assists with governance documentation",
    interventionPartner: "Confirms service and escalation rules where applicable",
  },
  {
    id: "dep-configuration",
    label: "Configuration",
    rtbx: "Owns configuration model; delivers Build & Configure interface; provides configuration standards",
    customer: "Approves configuration outputs; provides property-specific data",
    technologyPartner: "Infrastructure provisioning",
    deploymentPartner: "Delivers configuration services; maps roles and scenarios",
    interventionPartner: "Not typically involved",
  },
  {
    id: "dep-integration",
    label: "Integration",
    rtbx: "Owns integration hub and signal mapping; validates connectors against proof standard",
    customer: "Approves data access; provides change control authority",
    technologyPartner: "Provides technical interface, API support and authentication",
    deploymentPartner: "Manages integration project; coordinates system discovery",
    interventionPartner: "Provides service API where intervention delivery is automated",
  },
  {
    id: "dep-testing",
    label: "Testing",
    rtbx: "Validates signal integrity, scenario logic, governance rules and evidence flows",
    customer: "Participates in user acceptance testing; approves go-live readiness",
    technologyPartner: "Infrastructure and performance testing",
    deploymentPartner: "Coordinates testing plan; manages test data and reporting",
    interventionPartner: "Validates intervention trigger and delivery workflow",
  },
  {
    id: "dep-training",
    label: "Training",
    rtbx: "Provides platform documentation and onboarding materials",
    customer: "Internal training coordination; operational adoption decisions",
    technologyPartner: "Not typically involved",
    deploymentPartner: "Delivers staff training and change management",
    interventionPartner: "Not typically involved",
  },
  {
    id: "dep-operational-activation",
    label: "Operational Activation",
    rtbx: "Monitors platform stability; validates governance and scenario activation",
    customer: "Operational go-live approval; staff readiness sign-off",
    technologyPartner: "Infrastructure readiness and monitoring",
    deploymentPartner: "Manages rollout; provides on-site activation support",
    interventionPartner: "Confirms operational availability for triggered interventions",
  },
  {
    id: "dep-support",
    label: "Support",
    rtbx: "Platform issue resolution; governance and playbook updates",
    customer: "Internal operational support coordination",
    technologyPartner: "Infrastructure and technical support",
    deploymentPartner: "Managed service support where engaged",
    interventionPartner: "Service delivery support for triggered interventions",
  },
  {
    id: "dep-evidence-review",
    label: "Evidence Review",
    rtbx: "Provides Evidence Ledger and review tooling",
    customer: "Conducts evidence review; approves evidence completeness",
    technologyPartner: "Not typically involved",
    deploymentPartner: "Facilitates evidence review sessions",
    interventionPartner: "Provides delivery evidence for triggered interventions",
  },
  {
    id: "dep-outcome-review",
    label: "Outcome Review",
    rtbx: "Provides Outcome Ledger, Value Dashboard and learning model",
    customer: "Conducts outcome review against agreed success measures",
    technologyPartner: "Not typically involved",
    deploymentPartner: "Facilitates outcome review sessions; prepares reporting",
    interventionPartner: "Provides service outcome data",
  },
  {
    id: "dep-expansion",
    label: "Expansion",
    rtbx: "Provides expansion framework, additional operating systems and playbooks",
    customer: "Approves expansion scope and commercial agreement",
    technologyPartner: "Infrastructure scaling",
    deploymentPartner: "Manages expansion rollout across properties",
    interventionPartner: "Expands service coverage as scope grows",
  },
];

// ── Validation helpers ────────────────────────────────────────────────────────

export const VALID_INTEGRATION_MATURITY_STATUSES: IntegrationMaturity[] = [
  "planned", "mapped", "mocked", "tested", "integrated", "production",
];

export const VALID_INTEGRATION_PROOF_STATUSES: IntegrationProofStatus[] = [
  "none", "test", "log", "screenshot", "customer-deployment",
];

export const INTEGRATION_MATURITY_LABELS: Record<IntegrationMaturity, string> = {
  "planned":    "Planned",
  "mapped":     "Mapped",
  "mocked":     "Mocked",
  "tested":     "Tested",
  "integrated": "Integrated",
  "production": "Production",
};

export const INTEGRATION_MATURITY_COLORS: Record<IntegrationMaturity, string> = {
  "planned":    "rgba(255,255,255,0.3)",
  "mapped":     "#3b82f6",
  "mocked":     "#a8dedb",
  "tested":     "#10b981",
  "integrated": "#10b981",
  "production": "#10b981",
};
