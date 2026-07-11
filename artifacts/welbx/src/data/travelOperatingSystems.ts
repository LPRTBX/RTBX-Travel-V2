/**
 * Travel Operating Systems & Module Catalogue.
 *
 * RTBX Core provides the shared execution architecture (signal ingestion,
 * moment classification, governance, decision spine, action routing,
 * communications and the assurance/outcome registry). RTBX Travel extends
 * that same core through tailored operating systems — each one grouping
 * vertical-specific modules around a major hotel or travel operating problem.
 *
 * This file does not define a new engine. It configures how the existing
 * RTBX Core systems are packaged, scoped and rolled out for Travel.
 */

export type TravelRoleColumn = "Guest" | "Frontline" | "Manager" | "Operator" | "Partner" | "Executive";

export interface TravelOperatingSystem {
  id: string;
  name: string;
  color: string;
  purpose: string;
  primaryUsers: TravelRoleColumn[];
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
  {
    id: "guest-experience-os",
    name: "Guest Experience OS",
    color: "#3b82f6",
    purpose: "Coordinate guest needs, experience signals and service response across the stay.",
    primaryUsers: ["Guest", "Frontline", "Manager", "Operator"],
    inputSystems: ["PMS", "Guest App / WELBX", "CRM / Loyalty Platform"],
    signals: ["Guest frustration", "Room readiness delay", "Guest sentiment shift", "Special occasion flag"],
    moments: ["Service Recovery Moment", "Loyalty Protection Moment", "Post-Stay Recovery Moment"],
    governance: ["Guest Service Recovery Policy", "Loyalty Treatment Standard"],
    playbooks: ["Pre-Arrival Readiness Check", "In-Stay Request Routing", "Post-Stay Outreach"],
    communications: ["WELBX guest messages", "Front desk task handoff"],
    actions: ["Request routed to owner", "Recognition gesture issued", "Follow-up scheduled"],
    outcomes: ["Guest acknowledged", "Issue resolved", "Guest recovered"],
    valueMeasures: ["Satisfaction movement", "Request response time", "Loyalty protection"],
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
    pilotEntryPoint: "Pre-Arrival Readiness + In-Stay Request Coordination on a single property.",
    expansionPathway: "Add Guest Sentiment and Loyalty Recognition once request routing is stable, then Post-Stay Follow-Up for full-stay coverage.",
  },
  {
    id: "service-recovery-staff-response-os",
    name: "Service Recovery & Staff Response OS",
    color: "#10b981",
    purpose: "Turn guest issues and staff pressure into governed recovery pathways.",
    primaryUsers: ["Frontline", "Manager", "Operator"],
    inputSystems: ["Staff Task / Comms App", "PMS", "Housekeeping Software"],
    signals: ["Repeat complaint", "Queue build-up", "Staffing pressure", "Service disruption"],
    moments: ["Service Recovery Moment", "Operational Pressure Moment", "Staff Support Moment"],
    governance: ["Guest Service Recovery Policy", "Compensation Approval Matrix", "Complaint Escalation SOP"],
    playbooks: ["Duty Manager Callback", "Staff Reallocation", "Recovery Communication"],
    communications: ["Staff nudges", "Manager escalation alerts", "Guest recovery messages"],
    actions: ["Recovery gesture approved", "Staff reallocated", "Escalation routed"],
    outcomes: ["Response completed", "Guest recovered", "Escalation completed"],
    valueMeasures: ["Recovery rate", "Response time", "Escalation quality"],
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
    pilotEntryPoint: "Service Recovery + Duty Manager Routing paired with Guest Experience OS on day one.",
    expansionPathway: "Add Queue / Backlog Detection and Compensation Rules as escalation volume and complexity grow.",
  },
  {
    id: "marketplace-loyalty-activation-os",
    name: "Marketplace & Loyalty Activation OS",
    color: "#c9a84c",
    purpose: "Identify relevant commercial and loyalty moments without compromising the guest experience.",
    primaryUsers: ["Guest", "Frontline", "Partner", "Operator", "Executive"],
    inputSystems: ["POS", "CRM / Loyalty Platform", "Local Partner Network"],
    signals: ["Upsell opportunity", "Local experience interest", "Dining interest", "Loyalty activation"],
    moments: ["Commercial Opportunity Moment", "Partner Activation Moment", "Loyalty Protection Moment"],
    governance: ["Loyalty Treatment Standard", "Partner Approval Standard"],
    playbooks: ["Upsell Offer", "Local Experience Referral", "Partner Referral"],
    communications: ["Guest offer messages", "Partner referral confirmations"],
    actions: ["Offer presented", "Referral routed", "Booking confirmed"],
    outcomes: ["Commercial conversion", "Partner activated", "Loyalty protection"],
    valueMeasures: ["Ancillary revenue", "Partner conversion", "Loyalty activation"],
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
    pilotEntryPoint: "Dining and Wellness Offers + Loyalty Prompting once Guest Experience OS is proven.",
    expansionPathway: "Layer in Local Experience Activation and Partner Routing as the approved partner network grows.",
  },
  {
    id: "operator-intelligence-os",
    name: "Operator Intelligence OS",
    color: "#a78bfa",
    purpose: "Give property and group operators live intelligence across response, value and consistency.",
    primaryUsers: ["Manager", "Operator", "Executive"],
    inputSystems: ["PMS", "Staff Task / Comms App", "Assurance / Outcome Registry"],
    signals: ["Response time drift", "Playbook effectiveness", "Staffing pressure", "Guest pattern cluster"],
    moments: ["Operational Pressure Moment", "Reputation Risk Moment"],
    governance: ["Complaint Escalation SOP", "Room Readiness SOP"],
    playbooks: ["Staff Reallocation", "Executive Recovery Escalation"],
    communications: ["Property and portfolio dashboards", "Executive reporting"],
    actions: ["Resource reallocated", "Escalation authorised", "Benchmark reviewed"],
    outcomes: ["Response completed", "Evidence captured"],
    valueMeasures: ["Response performance", "Consistency across properties", "Evidence completeness"],
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
    pilotEntryPoint: "Property Dashboard + Response Performance as soon as the first operating system is live.",
    expansionPathway: "Add Portfolio Dashboard and Benchmarking once multiple properties are running the same operating systems.",
  },
  {
    id: "safety-guest-welfare-os",
    name: "Safety & Guest Welfare OS",
    color: "#ef4444",
    purpose: "Support governed response to guest welfare, staff safety and critical incidents.",
    primaryUsers: ["Frontline", "Manager", "Operator", "Executive"],
    inputSystems: ["Staff Task / Comms App", "Sensor / IoT & Building Management", "Guest App / WELBX"],
    signals: ["Guest distress", "Medical assistance request", "Security concern", "Staff safety concern"],
    moments: ["Guest Welfare Moment", "Safety Escalation Moment", "Staff Support Moment"],
    governance: ["Guest Safety Procedure", "Medical Assistance Procedure", "Critical Incident Procedure", "Privacy and Consent Rules"],
    playbooks: ["Welfare Check", "Medical Response Protocol", "Security Response Protocol"],
    communications: ["Critical incident comms", "Escalation notifications"],
    actions: ["Welfare check dispatched", "Incident coordinated", "Evidence logged"],
    outcomes: ["Response completed", "Escalation completed", "Evidence captured"],
    valueMeasures: ["Safety escalation quality", "Evidence completeness", "Governance alignment"],
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
    pilotEntryPoint: "Guest Distress + Medical Assistance as a mandatory pairing wherever the platform runs live.",
    expansionPathway: "Add Vulnerable Guest Support and Post-Incident Review as escalation history accumulates.",
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
  "RTBX Core",
  "Travel Intelligence Pack",
  "Travel Operating System",
  "Activated Modules",
  "Property Configuration",
  "Live Operating Environment",
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
  "A hotel does not need to activate every operating system on day one.";

export const TRAVEL_EXPANSION_STATEMENT =
  "RTBX Travel expands through more properties, more operating systems, more modules and deeper intelligence.";
