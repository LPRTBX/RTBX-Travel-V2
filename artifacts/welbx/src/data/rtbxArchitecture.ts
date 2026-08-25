/**
 * RTBX Intelligence Engine — Canonical Architecture Data
 *
 * This is the single source of truth for RTBX architecture terminology,
 * structure, and hierarchy across all pages. All page files and components
 * should import from here rather than hardcoding architecture strings.
 *
 * Sections:
 *  1. MaturityStatus type
 *  2. Engine Stages (Connect → Understand → Decide → Act → Learn)
 *  3. Intelligence Layers (six shared RTBX intelligence layers)
 *  4. Core Capabilities (shared RTBX Core capabilities with layer/stage mappings)
 *  5. Deployment Pathway (seven-stage: Explore → … → Expand)
 *  6. Platform Hierarchy (five levels: Shared Core → Active Deployment)
 *  7. Canonical Terminology Map (prohibited → required)
 */

// ── 1. MATURITY STATUS ───────────────────────────────────────────────────────

export type MaturityStatus =
  | "Foundation"
  | "Emerging"
  | "Established"
  | "Advanced"
  | "Leading";

export const MATURITY_STATUS_LABELS: Record<MaturityStatus, string> = {
  Foundation: "Foundation",
  Emerging: "Emerging",
  Established: "Established",
  Advanced: "Advanced",
  Leading: "Leading",
};

// ── 2. ENGINE STAGES ─────────────────────────────────────────────────────────

export type EngineStageId = "connect" | "understand" | "decide" | "act" | "learn";

export interface EngineStage {
  id: EngineStageId;
  /** Display label */
  label: string;
  /** Short summary shown in compact and five-step modes */
  summary: string;
  /** Core capabilities delivered by this stage */
  coreCapabilities: string[];
  /** Travel-specific configuration examples */
  travelExamples: string[];
  /** What this stage produces */
  outputs: string[];
}

export const ENGINE_STAGES: EngineStage[] = [
  {
    id: "connect",
    label: "Connect",
    summary: "Ingest signals from every guest, staff, system and partner touchpoint.",
    coreCapabilities: [
      "Integration Hub",
      "Signal Registry",
    ],
    travelExamples: [
      "PMS check-in and departure feeds",
      "Guest app and WELBX interaction events",
      "Housekeeping task completion status",
      "Staff communications app updates",
      "IoT and building management alerts",
    ],
    outputs: [
      "Normalised signal stream",
      "Source health status",
      "Integration registry",
    ],
  },
  {
    id: "understand",
    label: "Understand",
    summary: "Classify incoming signals into known moment types using Travel taxonomy.",
    coreCapabilities: [
      "Signal Registry",
    ],
    travelExamples: [
      "Guest frustration signal → Service Recovery Moment",
      "Housekeeping backlog signal → Operational Pressure Moment",
      "Guest distress signal → Guest Welfare Moment",
      "Upsell opportunity signal → Commercial Opportunity Moment",
    ],
    outputs: [
      "Classified moment record",
      "Risk level assignment",
      "Value at stake estimate",
    ],
  },
  {
    id: "decide",
    label: "Decide",
    summary: "Apply governance rules to determine the permitted response path.",
    coreCapabilities: [
      "Decision Spine",
      "Playbook Engine",
      "Build & Configure",
    ],
    travelExamples: [
      "Guest Service Recovery Policy gates compensation level",
      "Compensation Approval Matrix determines role authorisation",
      "Critical Incident Procedure mandates immediate escalation path",
      "Privacy and Consent Rules gate data use in any response",
    ],
    outputs: [
      "Governing rule set",
      "Permitted playbook selection",
      "Role ownership assignment",
      "Escalation path (if required)",
    ],
  },
  {
    id: "act",
    label: "Act",
    summary: "Route the governed response to the correct human role owner via the right channel.",
    coreCapabilities: [
      "Prompt & Nudge Engine",
      "Central Comms OS",
      "Execution Centre",
    ],
    travelExamples: [
      "Duty Manager receives welfare check prompt via staff app",
      "Front Desk receives room recovery recommendation",
      "Guest receives AI-drafted recovery message (human approved)",
      "Partner receives referral request with guest context",
    ],
    outputs: [
      "Delivered instruction or communication",
      "Action confirmation",
      "Evidence record",
    ],
  },
  {
    id: "learn",
    label: "Learn",
    summary: "Turn every actioned outcome into measurable, compounding value.",
    coreCapabilities: [
      "Evidence Ledger",
      "Outcome Ledger",
    ],
    travelExamples: [
      "Guest recovered → contribution to satisfaction movement",
      "Escalation completed → evidence completeness score",
      "Commercial conversion → ancillary revenue attribution",
      "Playbook performance trends by property and portfolio",
    ],
    outputs: [
      "Outcome record",
      "Value attribution",
      "Performance intelligence",
      "Learning signal",
    ],
  },
];

// ── 3. INTELLIGENCE LAYERS ───────────────────────────────────────────────────

export type IntelligenceLayerId =
  | "connection"
  | "context-moment"
  | "governance-decision"
  | "execution-communication"
  | "evidence-outcome-value"
  | "learning-intelligence";

export interface IntelligenceLayer {
  id: IntelligenceLayerId;
  /** Display label */
  label: string;
  /** Short summary */
  summary: string;
  /** Capabilities shared across all RTBX verticals */
  sharedCapabilities: string[];
  /** How this layer is configured specifically for Travel */
  travelExamples: string[];
  /** Which engine stage this layer primarily belongs to */
  primaryStage: EngineStageId;
}

export const INTELLIGENCE_LAYERS: IntelligenceLayer[] = [
  {
    id: "connection",
    label: "Connection Layer",
    summary: "Connects RTBX Core to the systems, sources and touchpoints that produce relevant signals.",
    sharedCapabilities: [
      "Integration Hub",
      "Signal Registry",
    ],
    travelExamples: [
      "Travel Signal Registry: 30+ representative signal types across Guest Experience, Operations, Safety & Welfare, Commercial and Partner domains",
      "Sensor and IoT integration for physical environment signals",
      "Guest app and WELBX interaction signals",
    ],
    primaryStage: "connect",
  },
  {
    id: "context-moment",
    label: "Context and Moment Layer",
    summary: "Builds context around connected signals and recognises the Travel moment they represent.",
    sharedCapabilities: [
      "Signal Registry",
    ],
    travelExamples: [
      "Travel Moment Taxonomy: 10 canonical moment types from Service Recovery to Post-Stay Recovery",
      "Risk levels: Low / Medium / High / Critical",
      "Primary owner and escalation threshold per moment type",
    ],
    primaryStage: "understand",
  },
  {
    id: "governance-decision",
    label: "Governance and Decision Layer",
    summary: "Applies governance and determines the permitted response path for each classified moment.",
    sharedCapabilities: [
      "Decision Spine",
      "Playbook Engine",
      "Build & Configure",
    ],
    travelExamples: [
      "Travel Governance Sources: 11 canonical policies including Guest Safety Procedure, Compensation Approval Matrix, Loyalty Treatment Standard",
      "Every moment response gated by at least one governance source",
      "AI may not act without governance clearance",
    ],
    primaryStage: "decide",
  },
  {
    id: "execution-communication",
    label: "Execution and Communication Layer",
    summary: "Coordinates the governed response through role owners, prompts, nudges and approved communications.",
    sharedCapabilities: [
      "Prompt & Nudge Engine",
      "Central Comms OS",
      "Execution Centre",
    ],
    travelExamples: [
      "Travel Playbook Library: matched to moment type and governance clearance",
      "Travel Role Model: 12 roles with defined scope, approval authority and escalation triggers",
      "No autonomous decision — every response path terminates at a named human role",
    ],
    primaryStage: "act",
  },
  {
    id: "evidence-outcome-value",
    label: "Evidence, Outcome and Value Layer",
    summary: "Records what happened, the outcome achieved and the value attributable to the governed response.",
    sharedCapabilities: [
      "Evidence Ledger",
      "Outcome Ledger",
    ],
    travelExamples: [
      "Central Comms OS routes instructions to staff roles and approved messages to guests",
      "WELBX is the guest-facing delivery channel",
      "AI drafts; human or pre-authorised policy approves send",
    ],
    primaryStage: "learn",
  },
  {
    id: "learning-intelligence",
    label: "Learning and Intelligence Layer",
    summary: "Turns evidenced outcomes into reusable intelligence that improves future configuration and governed responses.",
    sharedCapabilities: [
      "Evidence Ledger",
      "Outcome Ledger",
    ],
    travelExamples: [
      "Travel Outcome Model: 12 canonical outcome types",
      "Travel Value Model: Guest Experience, Operational, Commercial and Safety value categories",
      "Value Proof: measurable ROI evidence for operator and executive reporting",
    ],
    primaryStage: "learn",
  },
];

// ── 4. CORE CAPABILITIES ─────────────────────────────────────────────────────

export type CapabilityOrigin = "RTBX Core" | "Travel Configuration" | "Property Configuration";

export interface CoreCapability {
  id: string;
  name: string;
  description: string;
  /** Whether this capability is shared RTBX Core, Travel config, or property-specific */
  origin: CapabilityOrigin;
  /** Which intelligence layer this capability belongs to */
  layer: IntelligenceLayerId;
  /** Which engine stage this capability operates in */
  stage: EngineStageId;
  /** Implementation detail retained beneath a canonical shared RTBX Core capability. */
  parentCapabilityId?: string;
}

export const CORE_CAPABILITIES: CoreCapability[] = [
  // Canonical shared RTBX Core capabilities — the only peer-level Core modules.
  { id: "cap-integration-hub",     name: "Integration Hub",          description: "Unified connector layer across PMS, CRM, loyalty, apps and IoT.", origin: "RTBX Core", layer: "connection", stage: "connect" },
  { id: "cap-signal-registry",     name: "Signal Registry",          description: "Authoritative registry and classification surface for connected signal types.", origin: "RTBX Core", layer: "connection", stage: "connect" },
  { id: "cap-decision-spine",      name: "Decision Spine",           description: "Structured decision tree from classified moment to permitted response path.", origin: "RTBX Core", layer: "governance-decision", stage: "decide" },
  { id: "cap-playbook-engine",     name: "Playbook Engine",          description: "Selects and surfaces the governed response pattern for a classified moment.", origin: "RTBX Core", layer: "governance-decision", stage: "decide" },
  { id: "cap-prompt-nudge-engine", name: "Prompt & Nudge Engine",    description: "Coordinates governed prompts and nudges for the named role owner.", origin: "RTBX Core", layer: "execution-communication", stage: "act" },
  { id: "cap-central-comms-os",    name: "Central Comms OS",         description: "Coordinates approved multi-channel instructions and communications.", origin: "RTBX Core", layer: "execution-communication", stage: "act" },
  { id: "cap-evidence-ledger",     name: "Evidence Ledger",          description: "Immutable record of signal, governance, action and outcome evidence.", origin: "RTBX Core", layer: "evidence-outcome-value", stage: "learn" },
  { id: "cap-outcome-ledger",      name: "Outcome Ledger",           description: "Canonical record of outcomes and value measures from actioned moments.", origin: "RTBX Core", layer: "evidence-outcome-value", stage: "learn" },
  { id: "cap-build-configure",     name: "Build & Configure",        description: "Shared surface for configuring governed capabilities for a deployment.", origin: "RTBX Core", layer: "governance-decision", stage: "decide" },
  { id: "cap-execution-centre",    name: "Execution Centre",          description: "Shared operator surface for governed role-owned execution.", origin: "RTBX Core", layer: "execution-communication", stage: "act" },

  // Retained implementation sub-capabilities — always subordinate to a Core capability.
  { id: "cap-signal-ingestion",    name: "Signal Ingestion Pipeline", description: "Real-time and batch signal normalisation across connected sources.", origin: "RTBX Core", layer: "connection", stage: "connect", parentCapabilityId: "cap-integration-hub" },
  { id: "cap-source-registry",     name: "Source Registry",           description: "Authoritative registry of connected systems and their signal types.", origin: "RTBX Core", layer: "connection", stage: "connect", parentCapabilityId: "cap-integration-hub" },
  { id: "cap-moment-engine",       name: "Moment Engine",              description: "Pattern-based classification of signal clusters into known moment types.", origin: "RTBX Core", layer: "context-moment", stage: "understand", parentCapabilityId: "cap-signal-registry" },
  { id: "cap-context-assembler",   name: "Context Assembler",          description: "Assembles multi-signal clusters into a structured moment record.", origin: "RTBX Core", layer: "context-moment", stage: "understand", parentCapabilityId: "cap-signal-registry" },
  { id: "cap-governance-engine",   name: "Governance Engine",           description: "Applies pre-approved governance sources before any response is permitted.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-policy-registry",     name: "Policy Source Registry",      description: "Canonical registry of governance sources and applicability.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-audit-trail",         name: "Audit Trail",                 description: "Immutable governance decision log per moment.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-consent-rules",       name: "Consent & Privacy Rules",      description: "Governs what data may be captured, stored and acted on under consent.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-role-router",         name: "Role Routing Engine",          description: "Assigns moment ownership to the correct named human role.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-escalation-router",   name: "Escalation Router",            description: "Routes moments requiring elevated approval to the correct path.", origin: "RTBX Core", layer: "governance-decision", stage: "decide", parentCapabilityId: "cap-decision-spine" },
  { id: "cap-ai-drafting",         name: "AI Drafting Engine",            description: "AI-assisted message drafting within the governed communications workflow.", origin: "RTBX Core", layer: "execution-communication", stage: "act", parentCapabilityId: "cap-prompt-nudge-engine" },
  { id: "cap-action-centre",       name: "Action Centre",                 description: "Role-owner queue for governed moments and actions.", origin: "RTBX Core", layer: "execution-communication", stage: "act", parentCapabilityId: "cap-execution-centre" },
  { id: "cap-outcome-registry",    name: "Outcome Registry",               description: "Canonical taxonomy beneath the Outcome Ledger.", origin: "RTBX Core", layer: "evidence-outcome-value", stage: "learn", parentCapabilityId: "cap-outcome-ledger" },
  { id: "cap-value-engine",        name: "Value Engine",                   description: "Maps actioned outcomes to financial and experience value measures.", origin: "RTBX Core", layer: "evidence-outcome-value", stage: "learn", parentCapabilityId: "cap-outcome-ledger" },
  { id: "cap-learning-layer",      name: "Learning Layer",                 description: "Improves classification and playbook selection from evidenced outcome history.", origin: "RTBX Core", layer: "learning-intelligence", stage: "learn", parentCapabilityId: "cap-outcome-ledger" },

  // Travel configuration — domain-specific, not shared Core modules.
  { id: "cap-travel-signal-reg",   name: "Travel Signal Registry",     description: "Classified travel signal library across guest, operations, safety, commercial and partner domains.", origin: "Travel Configuration", layer: "connection", stage: "connect" },
  { id: "cap-travel-moment-tax",   name: "Travel Moment Taxonomy",      description: "10 canonical travel moment types from Service Recovery to Post-Stay Recovery.", origin: "Travel Configuration", layer: "context-moment", stage: "understand" },
  { id: "cap-travel-governance",   name: "Travel Governance Sources",   description: "11 canonical travel policies including Guest Safety and Compensation Approval.", origin: "Travel Configuration", layer: "governance-decision", stage: "decide" },
  { id: "cap-travel-playbooks",    name: "Travel Playbook Library",     description: "Response patterns matched to travel moment types and governance clearance.", origin: "Travel Configuration", layer: "governance-decision", stage: "decide" },
  { id: "cap-travel-roles",        name: "Travel Role Model",           description: "Travel roles with defined scope, approval authority and escalation triggers.", origin: "Travel Configuration", layer: "governance-decision", stage: "decide" },
  { id: "cap-travel-comms",        name: "Travel Communications",       description: "Travel-specific communication channels, message types and approval rules.", origin: "Travel Configuration", layer: "execution-communication", stage: "act" },
  { id: "cap-travel-evidence",     name: "Travel Evidence",              description: "Travel-specific evidence requirements and capture rules.", origin: "Travel Configuration", layer: "evidence-outcome-value", stage: "learn" },
  { id: "cap-travel-outcomes",     name: "Travel Outcome Model",         description: "12 canonical travel outcome types from Response Started to Post-Stay Outcome.", origin: "Travel Configuration", layer: "evidence-outcome-value", stage: "learn" },
  { id: "cap-travel-value",        name: "Travel Value Model",            description: "Travel value categories: Guest Experience, Operational, Commercial and Safety.", origin: "Travel Configuration", layer: "evidence-outcome-value", stage: "learn" },
  { id: "cap-welbx-channel",       name: "WELBX Guest Channel",           description: "Subordinate guest-facing delivery surface for approved travel communications.", origin: "Travel Configuration", layer: "execution-communication", stage: "act" },
];

// ── 5. DEPLOYMENT PATHWAY ────────────────────────────────────────────────────

export type DeploymentStageId =
  | "explore"
  | "align"
  | "configure"
  | "pilot"
  | "prove"
  | "deploy"
  | "expand";

export interface DeploymentStage {
  id: DeploymentStageId;
  label: string;
  summary: string;
  /** Key activities in this stage */
  activities: string[];
  /** What is produced or proven at this stage */
  outputs: string[];
}

export const DEPLOYMENT_PATHWAY: DeploymentStage[] = [
  {
    id: "explore",
    label: "Explore",
    summary: "Understand the operator's environment, current systems and priority problem areas.",
    activities: [
      "Discovery workshop with operator and key roles",
      "Current systems and integration inventory",
      "Priority moment and value-at-stake mapping",
    ],
    outputs: ["Discovery report", "Integration feasibility assessment", "Priority moment shortlist"],
  },
  {
    id: "align",
    label: "Align",
    summary: "Confirm the operating systems, modules and governance rules for the pilot scope.",
    activities: [
      "Operating system selection",
      "Governance source review and sign-off",
      "Role mapping and approval authority confirmation",
    ],
    outputs: ["Pilot scope agreement", "Governance configuration", "Role and approval matrix"],
  },
  {
    id: "configure",
    label: "Configure",
    summary: "Build and test the Travel Intelligence configuration against the agreed scope.",
    activities: [
      "Integration connection and testing",
      "Signal taxonomy configuration",
      "Playbook and governance rules configuration",
      "Role and communications channel setup",
    ],
    outputs: ["Configured environment", "Integration test report", "Role access provisioned"],
  },
  {
    id: "pilot",
    label: "Pilot",
    summary: "Run the platform live on a contained scope — typically a single property or department.",
    activities: [
      "Staff onboarding and role training",
      "Live moment handling under observation",
      "Daily performance and evidence review",
    ],
    outputs: ["Pilot performance data", "Evidence record", "Role feedback"],
  },
  {
    id: "prove",
    label: "Prove",
    summary: "Demonstrate measurable value against the agreed baseline metrics.",
    activities: [
      "Value proof against pre-agreed measures",
      "Governance alignment review",
      "Operator and executive sign-off",
    ],
    outputs: ["Value proof report", "Governance compliance record", "Expansion recommendation"],
  },
  {
    id: "deploy",
    label: "Deploy",
    summary: "Roll the proven configuration out to the full property or initial portfolio.",
    activities: [
      "Full property go-live",
      "Complete role and channel activation",
      "Operator Intelligence OS activation",
    ],
    outputs: ["Full deployment live", "Property dashboard active", "Performance baseline set"],
  },
  {
    id: "expand",
    label: "Expand",
    summary: "Grow by adding operating systems, modules, properties or intelligence depth.",
    activities: [
      "Additional operating system activation",
      "Portfolio property rollout",
      "Advanced intelligence and benchmarking enablement",
    ],
    outputs: ["Portfolio coverage", "Module expansion record", "Benchmarking active"],
  },
];

// ── 6. PLATFORM HIERARCHY ────────────────────────────────────────────────────

export type HierarchyLevelId =
  | "shared-core"
  | "travel-config"
  | "travel-os"
  | "property-config"
  | "active-deployment";

export interface HierarchyLevel {
  id: HierarchyLevelId;
  /** Display label */
  label: string;
  /** Short description */
  summary: string;
  /** Visual origin category — drives colour treatment in the component */
  origin: CapabilityOrigin;
  /** Examples of what lives at this level */
  examples: string[];
}

export const PLATFORM_HIERARCHY: HierarchyLevel[] = [
  {
    id: "shared-core",
    label: "RTBX Core",
    summary: "Shared signal-to-action infrastructure. One platform across all RTBX verticals.",
    origin: "RTBX Core",
    examples: [
      "Integration Hub",
      "Signal Registry",
      "Decision Spine",
      "Playbook Engine",
      "Prompt & Nudge Engine",
      "Central Comms OS",
      "Evidence Ledger",
      "Outcome Ledger",
      "Build & Configure",
      "Execution Centre",
    ],
  },
  {
    id: "travel-config",
    label: "Travel Configuration",
    summary: "Domain-specific configuration: signals, moments, governance, roles, playbooks, communications, evidence and outcomes tuned for travel and hospitality.",
    origin: "Travel Configuration",
    examples: [
      "Travel Signal Registry",
      "Travel Moment Taxonomy",
      "Travel Governance Sources",
      "Travel Playbook Library",
      "Travel Role Model",
      "Travel Communications",
      "Travel Evidence",
      "Travel Outcome Model",
    ],
  },
  {
    id: "travel-os",
    label: "Travel Operating Systems",
    summary: "Five packaged operating systems grouping modules around major hotel operating problems.",
    origin: "Travel Configuration",
    examples: [
      "Guest Experience OS",
      "Service Recovery & Staff Response OS",
      "Marketplace & Loyalty Activation OS",
      "Operator Intelligence OS",
      "Safety & Guest Welfare OS",
    ],
  },
  {
    id: "property-config",
    label: "Property Configuration",
    summary: "Operator and property-specific rules, activated modules, roles and channels.",
    origin: "Property Configuration",
    examples: [
      "Selected operating systems and modules",
      "Property-specific governance rules",
      "Role assignments and approval authorities",
      "Communication channel configuration",
    ],
  },
  {
    id: "active-deployment",
    label: "Active Deployment",
    summary: "The active system for a specific property — every signal, moment, action and outcome governed in context.",
    origin: "Property Configuration",
    examples: [
      "Live moment queue",
      "Active evidence ledger",
      "Value reporting dashboard",
      "Operator and executive intelligence views",
    ],
  },
];

// ── 7. CANONICAL TERMINOLOGY MAP ─────────────────────────────────────────────

export interface TerminologyEntry {
  /** The prohibited or deprecated term */
  prohibited: string;
  /** The required canonical term */
  canonical: string;
  /** Why the prohibited term is incorrect */
  reason: string;
}

export const CANONICAL_TERMINOLOGY: TerminologyEntry[] = [
  {
    prohibited: "RTBX Travel platform",
    canonical: "RTBX Core configured for Travel",
    reason: "RTBX Travel is not a separate platform. It is RTBX Core with Travel configuration applied.",
  },
  {
    prohibited: "Travel Intelligence Pack platform",
    canonical: "Travel Intelligence Pack",
    reason: "The Travel Intelligence Pack is a configuration layer, not a platform in its own right.",
  },
  {
    prohibited: "WELBX platform",
    canonical: "WELBX guest-facing layer",
    reason: "WELBX is the guest-facing experience layer of RTBX Travel — not a standalone platform.",
  },
  {
    prohibited: "WELBX operating system",
    canonical: "WELBX guest-facing layer",
    reason: "WELBX is not an operating system. The operating systems are Guest Experience OS, Service Recovery OS, etc.",
  },
  {
    prohibited: "AI agent",
    canonical: "AI assistant",
    reason: "RTBX AI does not act as an agent — it assists classification, drafting and routing. Humans own every decision.",
  },
  {
    prohibited: "autonomous decision",
    canonical: "governed response",
    reason: "RTBX does not make autonomous decisions. Every response passes through governance to a human role owner.",
  },
  {
    prohibited: "AI decides",
    canonical: "AI recommends; human decides",
    reason: "AI may classify, summarise, recommend, draft and coordinate. Safety, compensation, legal and welfare decisions require human approval.",
  },
  {
    prohibited: "RTBX Group platform",
    canonical: "RTBX Group",
    reason: "RTBX Group is the parent entity. RTBX Core is the platform. Avoid conflating the company with the product.",
  },
  {
    prohibited: "Travel OS",
    canonical: "Travel Operating System",
    reason: "Use the full term 'Travel Operating System' on first use; 'OS' is acceptable as a short form after introduction.",
  },
  {
    prohibited: "signal-based AI",
    canonical: "RTBX Intelligence Engine",
    reason: "The canonical name for the overall engine is the RTBX Intelligence Engine.",
  },
  {
    prohibited: "intervention",
    canonical: "playbook",
    reason: "The canonical term for a governed response pattern is 'playbook'. 'Intervention' is legacy terminology.",
  },
  {
    prohibited: "alert",
    canonical: "moment",
    reason: "The canonical term for a classified signal cluster requiring response is 'moment'. 'Alert' implies simple notification rather than governed response.",
  },
];
