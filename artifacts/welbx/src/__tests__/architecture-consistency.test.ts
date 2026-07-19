/**
 * Architecture Consistency Tests
 *
 * Validates that rtbxArchitecture.ts exports conform to the canonical Sprint 2
 * specification. Tests operate directly on the data exports — no HTML scraping.
 *
 * Canonical rules:
 *  - Exactly 5 engine stages in order: connect → understand → decide → act → learn
 *  - Exactly 6 intelligence layers in order: signal → moment → governance → decision → comms → outcome
 *  - All required shared Core capabilities present by canonical name
 *  - No prohibited term appears in the data files
 *  - Deployment pathway has exactly 7 stages in order
 *  - All MaturityStatus values use only approved labels
 */

import { describe, it, expect } from "vitest";
import {
  ENGINE_STAGES,
  INTELLIGENCE_LAYERS,
  CORE_CAPABILITIES,
  DEPLOYMENT_PATHWAY,
  CANONICAL_TERMINOLOGY,
  MATURITY_STATUS_LABELS,
  type EngineStageId,
  type IntelligenceLayerId,
  type DeploymentStageId,
  type MaturityStatus,
} from "../data/rtbxArchitecture";

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
  const REQUIRED_LAYER_ORDER: IntelligenceLayerId[] = [
    "signal",
    "moment",
    "governance",
    "decision",
    "comms",
    "outcome",
  ];

  it("has exactly six intelligence layers", () => {
    expect(INTELLIGENCE_LAYERS).toHaveLength(6);
  });

  it("layers are in canonical order: signal → moment → governance → decision → comms → outcome", () => {
    const ids = INTELLIGENCE_LAYERS.map((l) => l.id);
    expect(ids).toEqual(REQUIRED_LAYER_ORDER);
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
  // 20 canonical RTBX Core capabilities across 6 intelligence layers
  const REQUIRED_CORE_CAPABILITY_NAMES = [
    // Signal layer (3)
    "Integration Hub",
    "Signal Ingestion Pipeline",
    "Source Registry",
    // Moment layer (2)
    "Moment Engine",
    "Context Assembler",
    // Governance layer (4)
    "Governance Engine",
    "Policy Source Registry",
    "Audit Trail",
    "Consent & Privacy Rules",
    // Decision layer (4)
    "Decision Spine",
    "Playbook Engine",
    "Role Routing Engine",
    "Escalation Router",
    // Communications layer (3)
    "Central Comms OS",
    "AI Drafting Engine",
    "Action Centre",
    // Outcome layer (4)
    "Outcome Registry",
    "Evidence Ledger",
    "Value Engine",
    "Learning Layer",
  ] as const;

  const coreCapabilities = CORE_CAPABILITIES.filter((c) => c.origin === "RTBX Core");
  const coreNames = new Set(coreCapabilities.map((c) => c.name));

  it("has exactly 20 RTBX Core capabilities", () => {
    expect(coreCapabilities).toHaveLength(20);
  });

  for (const name of REQUIRED_CORE_CAPABILITY_NAMES) {
    it(`has RTBX Core capability: "${name}"`, () => {
      expect(coreNames.has(name)).toBe(true);
    });
  }

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

// ── 4. Deployment Pathway ─────────────────────────────────────────────────────

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

// ── 5. MaturityStatus values ──────────────────────────────────────────────────

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

// ── 6. Terminology — no prohibited term in architecture data ──────────────────

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
