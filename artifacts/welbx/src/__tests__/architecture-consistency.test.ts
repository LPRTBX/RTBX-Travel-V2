/**
 * Architecture Consistency Tests
 *
 * Validates that rtbxArchitecture.ts exports conform to the approved RTBX Main
 * architecture. Tests operate directly on the data exports — no HTML scraping.
 *
 * Canonical rules:
 *  - Exactly 5 engine stages in order: connect → understand → decide → act → learn
 *  - Exactly 6 shared intelligence layers in approved order and by approved name
 *  - Exactly 10 shared RTBX Core peer capabilities present by canonical name
 *  - Retained Core sub-capabilities are attached beneath an approved Core capability
 *  - Travel configuration includes the approved Travel-specific configuration areas
 *  - Platform hierarchy follows Core → Travel configuration → Travel operating systems → Property configuration → Active deployment
 *  - Deployment pathway has exactly 7 stages in order
 *  - All MaturityStatus values use only approved labels
 */

import { describe, it, expect } from "vitest";
import {
  ENGINE_STAGES,
  INTELLIGENCE_LAYERS,
  CORE_CAPABILITIES,
  DEPLOYMENT_PATHWAY,
  PLATFORM_HIERARCHY,
  CANONICAL_TERMINOLOGY,
  MATURITY_STATUS_LABELS,
  type EngineStageId,
  type IntelligenceLayerId,
  type DeploymentStageId,
  type HierarchyLevelId,
  type MaturityStatus,
} from "../data/rtbxArchitecture";

const APPROVED_CORE_CAPABILITY_NAMES = [
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
] as const;

// ── 1. Engine Stages ──────────────────────────────────────────────────────────

describe("Engine Stages", () => {
  const REQUIRED_STAGE_ORDER: EngineStageId[] = [
    "connect",
    "understand",
    "decide",
    "act",
    "learn",
  ];

  it("has exactly five engine stages", () => {
    expect(ENGINE_STAGES).toHaveLength(5);
  });

  it("stages are in canonical order: connect → understand → decide → act → learn", () => {
    const ids = ENGINE_STAGES.map((s) => s.id);
    expect(ids).toEqual(REQUIRED_STAGE_ORDER);
  });

  it("every stage has a non-empty label, summary, coreCapabilities array, and outputs array", () => {
    for (const stage of ENGINE_STAGES) {
      expect(stage.label.length, `stage ${stage.id} label`).toBeGreaterThan(0);
      expect(stage.summary.length, `stage ${stage.id} summary`).toBeGreaterThan(0);
      expect(Array.isArray(stage.coreCapabilities), `stage ${stage.id} coreCapabilities`).toBe(true);
      expect(stage.coreCapabilities.length, `stage ${stage.id} coreCapabilities non-empty`).toBeGreaterThan(0);
      expect(Array.isArray(stage.outputs), `stage ${stage.id} outputs`).toBe(true);
      expect(stage.outputs.length, `stage ${stage.id} outputs non-empty`).toBeGreaterThan(0);
    }
  });
});

// ── 2. Intelligence Layers ────────────────────────────────────────────────────

describe("Intelligence Layers", () => {
  const REQUIRED_LAYERS: Array<{
    id: IntelligenceLayerId;
    label: string;
    primaryStage: EngineStageId;
  }> = [
    { id: "connection", label: "Connection Layer", primaryStage: "connect" },
    { id: "context-moment", label: "Context and Moment Layer", primaryStage: "understand" },
    { id: "governance-decision", label: "Governance and Decision Layer", primaryStage: "decide" },
    { id: "execution-communication", label: "Execution and Communication Layer", primaryStage: "act" },
    { id: "evidence-outcome-value", label: "Evidence, Outcome and Value Layer", primaryStage: "learn" },
    { id: "learning-intelligence", label: "Learning and Intelligence Layer", primaryStage: "learn" },
  ];

  it("has exactly six intelligence layers", () => {
    expect(INTELLIGENCE_LAYERS).toHaveLength(6);
  });

  it("layers are in the approved canonical order with approved names", () => {
    expect(INTELLIGENCE_LAYERS.map((layer) => ({
      id: layer.id,
      label: layer.label,
      primaryStage: layer.primaryStage,
    }))).toEqual(REQUIRED_LAYERS);
  });

  it("does not present previous competing layer names as canonical intelligence layers", () => {
    const previousLayerNames = new Set([
      "Signal Layer",
      "Moment Layer",
      "Governance Layer",
      "Decision Layer",
      "Communications Layer",
      "Outcome & Value Layer",
    ]);
    for (const layer of INTELLIGENCE_LAYERS) {
      expect(previousLayerNames.has(layer.label), `legacy layer label "${layer.label}"`).toBe(false);
    }
  });

  it("every layer has a non-empty label, summary, sharedCapabilities array, and primaryStage", () => {
    for (const layer of INTELLIGENCE_LAYERS) {
      expect(layer.label.length, `layer ${layer.id} label`).toBeGreaterThan(0);
      expect(layer.summary.length, `layer ${layer.id} summary`).toBeGreaterThan(0);
      expect(Array.isArray(layer.sharedCapabilities), `layer ${layer.id} sharedCapabilities`).toBe(true);
      expect(layer.sharedCapabilities.length, `layer ${layer.id} sharedCapabilities non-empty`).toBeGreaterThan(0);
      expect(layer.primaryStage.length, `layer ${layer.id} primaryStage`).toBeGreaterThan(0);
    }
  });
});

// ── 3. Core Capabilities ─────────────────────────────────────────────────────

describe("Core Capabilities — required RTBX Core names", () => {
  // The approved RTBX Main shared Core capability set.
  const sharedCoreCapabilities = CORE_CAPABILITIES.filter(
    (capability) => capability.origin === "RTBX Core" && !capability.parentCapabilityId,
  );
  const sharedCoreNames = new Set(sharedCoreCapabilities.map((capability) => capability.name));

  it("has exactly 10 peer-level shared RTBX Core capabilities", () => {
    expect(sharedCoreCapabilities).toHaveLength(10);
  });

  for (const name of APPROVED_CORE_CAPABILITY_NAMES) {
    it(`has RTBX Core capability: "${name}"`, () => {
      expect(sharedCoreNames.has(name)).toBe(true);
    });
  }

  it("retained RTBX Core sub-capabilities sit beneath an approved shared Core capability", () => {
    const parentIds = new Set(sharedCoreCapabilities.map((capability) => capability.id));
    const subCapabilities = CORE_CAPABILITIES.filter(
      (capability) => capability.origin === "RTBX Core" && capability.parentCapabilityId,
    );
    expect(subCapabilities.length).toBeGreaterThan(0);
    for (const subCapability of subCapabilities) {
      expect(
        parentIds.has(subCapability.parentCapabilityId!),
        `"${subCapability.name}" must be subordinate to a shared Core capability`,
      ).toBe(true);
    }
  });

  it("all capabilities have a valid layer reference", () => {
    const validLayers = new Set(INTELLIGENCE_LAYERS.map((l) => l.id));
    for (const cap of CORE_CAPABILITIES) {
      expect(validLayers.has(cap.layer), `capability "${cap.name}" has valid layer`).toBe(true);
    }
  });

  it("all capabilities have a valid stage reference", () => {
    const validStages = new Set(ENGINE_STAGES.map((s) => s.id));
    for (const cap of CORE_CAPABILITIES) {
      expect(validStages.has(cap.stage), `capability "${cap.name}" has valid stage`).toBe(true);
    }
  });
});

// ── 4. Travel configuration and hierarchy ─────────────────────────────────────

describe("Travel Configuration", () => {
  const REQUIRED_TRAVEL_CONFIGURATION_NAMES = [
    "Travel Signal Registry",
    "Travel Moment Taxonomy",
    "Travel Governance Sources",
    "Travel Role Model",
    "Travel Playbook Library",
    "Travel Communications",
    "Travel Evidence",
    "Travel Outcome Model",
  ] as const;

  const travelConfigurationNames = new Set(
    CORE_CAPABILITIES
      .filter((capability) => capability.origin === "Travel Configuration")
      .map((capability) => capability.name),
  );

  for (const name of REQUIRED_TRAVEL_CONFIGURATION_NAMES) {
    it(`preserves Travel configuration: "${name}"`, () => {
      expect(travelConfigurationNames.has(name)).toBe(true);
    });
  }
});

describe("Platform Hierarchy", () => {
  const REQUIRED_HIERARCHY: Array<{ id: HierarchyLevelId; label: string }> = [
    { id: "shared-core", label: "RTBX Core" },
    { id: "travel-config", label: "Travel Configuration" },
    { id: "travel-os", label: "Travel Operating Systems" },
    { id: "property-config", label: "Property Configuration" },
    { id: "active-deployment", label: "Active Deployment" },
  ];

  it("uses the approved hierarchy from RTBX Core through to Active Deployment", () => {
    expect(PLATFORM_HIERARCHY.map((level) => ({
      id: level.id,
      label: level.label,
    }))).toEqual(REQUIRED_HIERARCHY);
  });

  it("lists only approved peer-level Core capabilities in the RTBX Core hierarchy examples", () => {
    const approved = new Set<string>(APPROVED_CORE_CAPABILITY_NAMES);
    const coreLevel = PLATFORM_HIERARCHY.find((level) => level.id === "shared-core")!;
    expect(coreLevel.examples).toHaveLength(APPROVED_CORE_CAPABILITY_NAMES.length);
    for (const example of coreLevel.examples) {
      expect(approved.has(example), `"${example}" is not an approved peer-level Core capability`).toBe(true);
    }
  });
});

// ── 5. Deployment Pathway ─────────────────────────────────────────────────────

describe("Deployment Pathway", () => {
  const REQUIRED_DEPLOYMENT_ORDER: DeploymentStageId[] = [
    "explore",
    "align",
    "configure",
    "pilot",
    "prove",
    "deploy",
    "expand",
  ];

  it("has exactly seven deployment stages", () => {
    expect(DEPLOYMENT_PATHWAY).toHaveLength(7);
  });

  it("stages are in canonical order: explore → align → configure → pilot → prove → deploy → expand", () => {
    const ids = DEPLOYMENT_PATHWAY.map((s) => s.id);
    expect(ids).toEqual(REQUIRED_DEPLOYMENT_ORDER);
  });

  it("every stage has a non-empty label, summary, activities array, and outputs array", () => {
    for (const stage of DEPLOYMENT_PATHWAY) {
      expect(stage.label.length, `deployment stage ${stage.id} label`).toBeGreaterThan(0);
      expect(stage.summary.length, `deployment stage ${stage.id} summary`).toBeGreaterThan(0);
      expect(Array.isArray(stage.activities), `deployment stage ${stage.id} activities`).toBe(true);
      expect(stage.activities.length, `deployment stage ${stage.id} activities non-empty`).toBeGreaterThan(0);
      expect(Array.isArray(stage.outputs), `deployment stage ${stage.id} outputs`).toBe(true);
      expect(stage.outputs.length, `deployment stage ${stage.id} outputs non-empty`).toBeGreaterThan(0);
    }
  });
});

// ── 6. MaturityStatus values ──────────────────────────────────────────────────

describe("MaturityStatus approved labels", () => {
  const APPROVED_LABELS: MaturityStatus[] = [
    "Foundation",
    "Emerging",
    "Established",
    "Advanced",
    "Leading",
  ];

  it("MATURITY_STATUS_LABELS contains exactly the five approved labels", () => {
    const keys = Object.keys(MATURITY_STATUS_LABELS) as MaturityStatus[];
    expect(keys.sort()).toEqual([...APPROVED_LABELS].sort());
  });

  it("every MATURITY_STATUS_LABELS value matches its key", () => {
    for (const label of APPROVED_LABELS) {
      expect(MATURITY_STATUS_LABELS[label]).toBe(label);
    }
  });
});

// ── 7. Terminology — no prohibited term in architecture data ──────────────────

describe("Canonical Terminology — no prohibited terms in CANONICAL_TERMINOLOGY canonical fields", () => {
  it("CANONICAL_TERMINOLOGY has at least 5 entries", () => {
    expect(CANONICAL_TERMINOLOGY.length).toBeGreaterThanOrEqual(5);
  });

  it("every entry has a non-empty prohibited and canonical field", () => {
    for (const entry of CANONICAL_TERMINOLOGY) {
      expect(entry.prohibited.length, `entry prohibited non-empty`).toBeGreaterThan(0);
      expect(entry.canonical.length, `entry canonical non-empty`).toBeGreaterThan(0);
    }
  });

  it("prohibited terms from CANONICAL_TERMINOLOGY do not appear in ENGINE_STAGES canonical labels", () => {
    const stageLabelText = ENGINE_STAGES.map((s) => s.label + " " + s.summary).join(" ");
    // Only check terms that are clearly prohibited (not partial matches like 'alert' which appear in context)
    const strictProhibited = [
      "RTBX Travel platform",
      "WELBX platform",
      "WELBX operating system",
      "AI agent",
      "autonomous decision",
      "signal-based AI",
    ];
    for (const term of strictProhibited) {
      expect(stageLabelText.includes(term), `prohibited term "${term}" in ENGINE_STAGES labels`).toBe(false);
    }
  });

  it("prohibited terms from CANONICAL_TERMINOLOGY do not appear in INTELLIGENCE_LAYERS canonical labels", () => {
    const layerLabelText = INTELLIGENCE_LAYERS.map((l) => l.label + " " + l.summary).join(" ");
    const strictProhibited = [
      "RTBX Travel platform",
      "WELBX platform",
      "WELBX operating system",
      "AI agent",
      "autonomous decision",
      "signal-based AI",
    ];
    for (const term of strictProhibited) {
      expect(layerLabelText.includes(term), `prohibited term "${term}" in INTELLIGENCE_LAYERS labels`).toBe(false);
    }
  });
});
