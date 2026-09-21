/**
 * travelPartnerEcosystem.ts — Sprint 5
 *
 * Canonical partner ecosystem data for JALDO Travel.
 *
 * Six partner lanes, ownership boundaries, partner selection criteria
 * and partnership pathway. All partnership descriptions are indicative —
 * no named partner relationship is represented as confirmed unless stated.
 *
 * Data is synthetic demonstration content. No partner agreement is implied.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type PartnerMaturityStatus =
  | "planned"
  | "in-development"
  | "demonstrated"
  | "pilot-ready"
  | "production";

export type TravelPartnerLane = {
  id: string;
  name: string;
  summary: string;
  partnerTypes: string[];
  examples: string[];
  partnerContribution: string[];
  rtbxContribution: string[];
  customerContribution: string[];
  connectionRequirements: string[];
  commercialModels: string[];
  maturityStatus: PartnerMaturityStatus;
  maturityNote: string;
};

export type PartnerOwnershipRow = {
  partnerType: string;
  partnerOwns: string;
  rtbxOwns: string;
  customerOwns: string;
};

export type PartnerSelectionCategory = {
  id: string;
  label: string;
  criteria: string[];
};

export type PartnershipPathwayStage = {
  id: string;
  label: string;
  description: string;
  actions: string[];
};

// ── Six partner lanes ─────────────────────────────────────────────────────────

export const TRAVEL_PARTNER_LANES: TravelPartnerLane[] = [
  {
    id: "signal-partners",
    name: "Signal Partners",
    summary:
      "Partners that provide operational, guest or environmental signals. Signal partners give JALDO the real-time and contextual data needed to detect moments, assemble context and initiate governed responses.",
    partnerTypes: [
      "Property management system providers",
      "Reservation platforms",
      "Housekeeping system providers",
      "Task-management platform providers",
      "CRM and loyalty system providers",
      "Maintenance and asset management systems",
      "Guest messaging platforms",
      "Transport and disruption data providers",
      "Building management and IoT platform providers",
    ],
    examples: [
      "Opera Cloud (PMS)",
      "Agilysys (PMS / POS)",
      "Amadeus (reservations)",
      "HotSOS / ALICE (housekeeping and task)",
      "Salesforce Hospitality",
      "Kipsu / Zingle (guest messaging)",
      "FlightAware / OAG (transport disruption)",
    ],
    partnerContribution: [
      "Source-system functionality",
      "Source-system data access and API availability",
      "System authentication and credential support",
      "Platform-specific technical support",
      "Interface reliability and change notification",
    ],
    rtbxContribution: [
      "Integration Hub and signal mapping",
      "Signal Registry and normalisation",
      "Context assembly from multiple signals",
      "Moment detection and classification",
      "Decision and action orchestration",
      "Evidence and outcome linkage",
    ],
    customerContribution: [
      "Data-access approval and system credentials",
      "Data governance and privacy compliance",
      "System configuration for integration scope",
      "Operational use approval",
      "Internal change communication",
    ],
    connectionRequirements: [
      "API or webhook interface from source system",
      "Defined data schema or mapping agreement",
      "Authentication and credential handoff",
      "Agreed failure and gap-handling protocol",
      "Change notification process",
    ],
    commercialModels: [
      "Connector fee (subject to proposal)",
      "Integration service fee via deployment partner",
      "Usage-based signal fee where volume applies",
      "Platform integration arrangement (subject to agreement)",
    ],
    maturityStatus: "pilot-ready",
    maturityNote:
      "Signal mapping and context assembly are architecturally defined and demonstrated in simulation. Production connectors require approved integration engineering. Connector-ready status is only claimed where the Sprint 2 proof standard is met.",
  },
  {
    id: "governance-partners",
    name: "Governance Partners",
    summary:
      "Partners that contribute specialist policies, standards or decision controls. Governance partners provide the domain expertise that shapes JALDO decision rules, approval thresholds and escalation pathways.",
    partnerTypes: [
      "Hotel brand owners and brand standard owners",
      "Safety and emergency management specialists",
      "Welfare and safeguarding specialists",
      "Privacy and legal advisers",
      "Risk and insurance partners",
      "Industry standards bodies",
      "Regulatory compliance advisers",
    ],
    examples: [
      "Hotel brand governance teams",
      "State or national safety regulators",
      "Duty of care or welfare advisers",
      "Privacy law advisers (AU Privacy Act, GDPR)",
      "Insurance and risk advisers",
      "Tourism and hospitality industry associations",
    ],
    partnerContribution: [
      "Specialist standards and policy interpretation",
      "Approved decision guidance for domain-specific scenarios",
      "Domain-specific escalation advice",
      "Review of high-risk decision controls",
      "Ongoing policy update and governance review",
    ],
    rtbxContribution: [
      "Decision Spine and rule representation",
      "Threshold configuration and governance model",
      "Approval logic and accountability routing",
      "Decision records and audit trail",
      "Evidence requirements linked to decision rules",
    ],
    customerContribution: [
      "Final policy approval for property-specific procedures",
      "Local legal and operational requirements",
      "Assigned accountable roles for each decision domain",
      "Brand standard adoption and governance oversight",
    ],
    connectionRequirements: [
      "Documented policy or standard provided to JALDO configuration",
      "Agreed review cadence for rule updates",
      "Named governance contacts for escalation pathways",
      "Approval process defined for high-risk decision types",
    ],
    commercialModels: [
      "Advisory engagement fee (subject to proposal)",
      "Governance review retainer (subject to agreement)",
      "Brand standard licensing arrangement (where applicable)",
      "Training and alignment support fee",
    ],
    maturityStatus: "in-development",
    maturityNote:
      "Governance structures are architecturally defined. Named specialist governance partner relationships are not confirmed. The JALDO Decision Spine is implemented for configuration. Domain specialist engagement is a pilot requirement.",
  },
  {
    id: "intervention-partners",
    name: "Intervention Partners",
    summary:
      "Partners that deliver a service or intervention after JALDO identifies a need. Intervention partners act on the trigger and context JALDO provides, delivering the physical or human response the scenario requires.",
    partnerTypes: [
      "Maintenance and facilities management providers",
      "Security services",
      "Welfare, medical or emergency response",
      "Transport providers",
      "Guest experience providers",
      "Local service and concierge providers",
      "Experience and activity partners",
    ],
    examples: [
      "On-property maintenance teams",
      "Third-party security or emergency response",
      "Medical assistance coordinators",
      "Airport transfer and taxi providers",
      "Concierge and guest experience services",
      "Local tourism and activity operators",
    ],
    partnerContribution: [
      "Service delivery and resource availability",
      "Service standards and delivery evidence",
      "Service-level performance and reliability",
      "Communication of delivery status to JALDO",
    ],
    rtbxContribution: [
      "Triggering, routing and context package",
      "Governance checks before intervention dispatch",
      "Communication coordination across channels",
      "Evidence and outcome record for the intervention",
      "Escalation logic if response threshold is exceeded",
    ],
    customerContribution: [
      "Partner approval and commercial relationship",
      "Operating authority for intervention types",
      "On-property coordination and access",
      "Outcome review and service approval",
    ],
    connectionRequirements: [
      "Agreed trigger and notification method",
      "Defined context package format",
      "Delivery confirmation or evidence mechanism",
      "Escalation contact and fallback process",
    ],
    commercialModels: [
      "Service fee per intervention (subject to agreement)",
      "Qualified lead fee where applicable",
      "Transaction or revenue share where attribution is credible",
      "Retainer for on-call availability",
    ],
    maturityStatus: "pilot-ready",
    maturityNote:
      "Intervention triggering and routing are architecturally defined and demonstrated in simulation. Named intervention partner relationships are not confirmed. Production intervention dispatch requires operational approval and coordination.",
  },
  {
    id: "technology-partners",
    name: "Technology Partners",
    summary:
      "Partners that provide the technical infrastructure supporting JALDO deployment. Technology partners support JALDO infrastructure or deployment — they do not own the JALDO intelligence and operating-system model.",
    partnerTypes: [
      "Cloud infrastructure providers",
      "Identity and access management",
      "Communications platform providers",
      "AI model providers",
      "Integration platform providers",
      "Observability and monitoring",
      "Data infrastructure providers",
    ],
    examples: [
      "AWS / Azure / GCP (cloud infrastructure)",
      "Auth0 / Clerk (identity)",
      "Twilio / Vonage (communications)",
      "Anthropic / OpenAI (AI models)",
      "MuleSoft / Workato (integration platforms)",
      "Datadog / Sentry (observability)",
    ],
    partnerContribution: [
      "Reliable technical infrastructure and services",
      "Security, compliance and availability guarantees",
      "Defined APIs and integration support",
      "Performance and capacity management",
    ],
    rtbxContribution: [
      "JALDO intelligence engine and product architecture",
      "Operating system design and configuration model",
      "Governance, playbook and scenario framework",
      "Learning and value model",
    ],
    customerContribution: [
      "Commercial and security approval for technology choices",
      "Data residency and privacy requirements",
      "Compliance and audit obligations",
      "Internal IT governance",
    ],
    connectionRequirements: [
      "Agreed infrastructure specification",
      "Security and compliance review",
      "Data processing agreement where applicable",
      "Performance and availability SLA",
    ],
    commercialModels: [
      "Infrastructure usage fees (technology provider charges)",
      "API usage fees per volume",
      "AI model costs per token or request",
      "SaaS platform licence",
    ],
    maturityStatus: "in-development",
    maturityNote:
      "Technology partner architecture is defined. Production technology partner agreements are not confirmed. Current demonstration environment uses prototype infrastructure. Production deployment requires approved technology agreements.",
  },
  {
    id: "deployment-partners",
    name: "Deployment Partners",
    summary:
      "Partners that implement, configure and support JALDO Travel within a customer environment. Deployment partners deliver the services that make a pilot or production deployment possible at scale.",
    partnerTypes: [
      "Hotel technology consultants",
      "Systems integrators",
      "Transformation advisers",
      "Training and change management partners",
      "Regional implementation partners",
      "Managed-service providers",
    ],
    examples: [
      "Hotel technology implementation consultants",
      "Regional or national systems integrators",
      "Hospitality transformation advisers",
      "Staff training and change management specialists",
      "Managed technology service providers",
    ],
    partnerContribution: [
      "Implementation services and project management",
      "Customer coordination and stakeholder engagement",
      "System discovery and integration scoping",
      "Configuration support and testing",
      "Staff training and change management",
      "Local rollout assistance and support",
    ],
    rtbxContribution: [
      "Platform architecture and configuration model",
      "Operating systems, scenarios and playbooks",
      "Governance structure and proof framework",
      "Deployment standards and partner enablement",
      "Technical documentation and support",
    ],
    customerContribution: [
      "Internal change decisions and deployment authority",
      "System access and stakeholder time",
      "Internal training coordination",
      "Operational adoption decisions",
    ],
    connectionRequirements: [
      "JALDO partner enablement programme",
      "Signed deployment partner agreement",
      "Defined scope of services",
      "Customer agreement for deployment engagement",
    ],
    commercialModels: [
      "Partner charges customer for implementation services",
      "JALDO charges platform and licence fees directly",
      "Joint delivery package (subject to proposal)",
      "Managed-service arrangement (subject to agreement)",
    ],
    maturityStatus: "in-development",
    maturityNote:
      "Deployment partner model is architecturally defined. No named deployment partner relationships are confirmed. Deployment partner enablement programme is in development.",
  },
  {
    id: "distribution-partners",
    name: "Distribution Partners",
    summary:
      "Partners that provide market access, channel reach or embedded distribution for JALDO Travel. Distribution partners accelerate reach to hotel operators, groups or markets that JALDO cannot efficiently reach directly.",
    partnerTypes: [
      "Hotel groups and operating companies",
      "Travel technology resellers and channels",
      "Industry associations and networks",
      "PMS and CRM partner networks",
      "Property-management groups",
      "Advisory and consulting networks",
    ],
    examples: [
      "Hotel group technology programmes",
      "Hospitality industry associations",
      "PMS partner programme channels",
      "Travel technology advisory networks",
      "Regional hotel management groups",
    ],
    partnerContribution: [
      "Market access and qualified customer introductions",
      "Channel or distribution reach",
      "Customer relationships and trust",
      "Market-specific knowledge",
      "Reseller commercial capability where applicable",
    ],
    rtbxContribution: [
      "JALDO platform, product and enablement",
      "Partner commercial structure and pricing (subject to agreement)",
      "Sales and marketing support",
      "Technical and product onboarding",
    ],
    customerContribution: [
      "Purchase and deployment agreement",
      "Engagement with distribution partner",
      "Internal deployment approval",
    ],
    connectionRequirements: [
      "Agreed distribution or reseller terms",
      "Defined territory or segment scope",
      "Customer pipeline and qualification process",
      "Marketing and sales enablement",
    ],
    commercialModels: [
      "Referral fee — introduction fee or percentage of first-year contract (subject to agreement)",
      "Reseller margin — wholesale licence plus reseller margin (subject to agreement; no exclusivity implied)",
      "Co-selling arrangement — joint proposition and shared pipeline (subject to agreement)",
      "Embedded distribution — integrated offering (subject to agreement)",
    ],
    maturityStatus: "planned",
    maturityNote:
      "Distribution partner model is defined. No named distribution partner agreements are confirmed. Do not represent any relationship as active unless confirmed. Channel strategy is in development.",
  },
];

// ── Ownership boundaries ──────────────────────────────────────────────────────

export const RTBX_OWNED_CAPABILITIES: string[] = [
  "JALDO Intelligence Engine",
  "Connect → Understand → Decide → Act → Learn",
  "Six intelligence layers",
  "Integration Hub",
  "Signal Registry",
  "Context and Moment Layer",
  "Decision Spine",
  "Playbook Engine",
  "Prompt & Nudge Engine",
  "Central Comms OS",
  "Evidence Ledger",
  "Outcome Ledger",
  "Build & Configure",
  "Execution Centre",
  "Cross-system orchestration",
  "Travel operating-system configuration",
  "Scenario and playbook framework",
  "Learning and value model",
];

export const CUSTOMER_OWNED_CAPABILITIES: string[] = [
  "Existing systems and vendor contracts",
  "Customer data",
  "Property policies",
  "Brand standards",
  "Local procedures",
  "Role assignments",
  "Approval authority",
  "Operational decisions",
  "Data-access permissions",
  "Intervention-provider relationships",
  "Final deployment governance",
  "Pilot approval",
  "Production security requirements",
];

export const PARTNER_OWNERSHIP_MATRIX: PartnerOwnershipRow[] = [
  {
    partnerType: "Signal partner",
    partnerOwns: "Source platform and access interface",
    rtbxOwns: "Mapping, context and orchestration",
    customerOwns: "Permission and source-system governance",
  },
  {
    partnerType: "Governance partner",
    partnerOwns: "Specialist standard or policy advice",
    rtbxOwns: "Decision Spine implementation",
    customerOwns: "Final rule approval",
  },
  {
    partnerType: "Intervention partner",
    partnerOwns: "Service delivery",
    rtbxOwns: "Trigger, routing and evidence flow",
    customerOwns: "Provider relationship and authority",
  },
  {
    partnerType: "Technology partner",
    partnerOwns: "Supporting technical capability",
    rtbxOwns: "JALDO product and operating logic",
    customerOwns: "Commercial and security approval",
  },
  {
    partnerType: "Deployment partner",
    partnerOwns: "Implementation service",
    rtbxOwns: "Platform standards and configuration model",
    customerOwns: "Internal change and deployment decisions",
  },
  {
    partnerType: "Distribution partner",
    partnerOwns: "Market access or channel",
    rtbxOwns: "JALDO platform and enablement",
    customerOwns: "Purchase and deployment agreement",
  },
];

// ── Partner selection criteria ────────────────────────────────────────────────

export const PARTNER_SELECTION_CRITERIA: PartnerSelectionCategory[] = [
  {
    id: "strategic-fit",
    label: "Strategic Fit",
    criteria: [
      "Solves a real Travel operational problem",
      "Complements rather than duplicates JALDO",
      "Supports the current hotel and resort wedge",
      "Has a credible customer or distribution pathway",
    ],
  },
  {
    id: "technical-fit",
    label: "Technical Fit",
    criteria: [
      "Provides reliable data or service interfaces",
      "Supports appropriate security and data controls",
      "Can define ownership and support responsibilities",
      "Can support testing and failure handling",
    ],
  },
  {
    id: "governance-fit",
    label: "Governance Fit",
    criteria: [
      "Accepts accountable human decision-making",
      "Supports privacy and evidence requirements",
      "Has clear escalation responsibilities",
      "Does not require misleading automation claims",
    ],
  },
  {
    id: "commercial-fit",
    label: "Commercial Fit",
    criteria: [
      "Clear customer value proposition",
      "Clear ownership and responsibility allocation",
      "Clear revenue logic",
      "Scalable deployment pathway",
      "No unresolved channel conflict",
    ],
  },
];

// ── Partnership pathway stages ────────────────────────────────────────────────

export const PARTNERSHIP_PATHWAY_STAGES: PartnershipPathwayStage[] = [
  {
    id: "identify",
    label: "Identify",
    description: "Confirm strategic fit and initial interest.",
    actions: [
      "Review JALDO partner lane alignment",
      "Confirm partner type and contribution scope",
      "Initial conversation and fit assessment",
      "Confirm technical and governance compatibility",
    ],
  },
  {
    id: "align",
    label: "Align",
    description: "Agree scope, responsibilities and commercial model.",
    actions: [
      "Define partner contribution and JALDO contribution",
      "Agree customer ownership and approval model",
      "Define commercial model and structure",
      "Identify first customer or pilot opportunity",
    ],
  },
  {
    id: "pilot",
    label: "Pilot",
    description: "Run a controlled engagement within an agreed scope.",
    actions: [
      "Define pilot scope and success criteria",
      "Establish technical or service integration",
      "Execute within agreed boundary",
      "Capture evidence and outcomes",
    ],
  },
  {
    id: "prove",
    label: "Prove",
    description: "Review evidence and confirm scalable partnership model.",
    actions: [
      "Review pilot evidence and outcomes",
      "Confirm responsibility model",
      "Refine commercial terms",
      "Agree expansion scope",
    ],
  },
  {
    id: "expand",
    label: "Expand",
    description: "Scale partnership across customers, markets or capability.",
    actions: [
      "Expand to additional customers or properties",
      "Activate additional partner types",
      "Develop deeper integration or co-selling",
      "Contribute to JALDO learning model where appropriate",
    ],
  },
];

// ── Validation helpers ────────────────────────────────────────────────────────

export const VALID_PARTNER_LANE_IDS: string[] = TRAVEL_PARTNER_LANES.map(l => l.id);

export const VALID_PARTNER_MATURITY_STATUSES: PartnerMaturityStatus[] = [
  "planned",
  "in-development",
  "demonstrated",
  "pilot-ready",
  "production",
];
