/**
 * Sprint 4 data integrity and runtime engine tests.
 *
 * Run with: pnpm --filter @workspace/welbx test
 *
 * Tests validate:
 * - DEFAULT_DEPLOYMENT integrity (referential cross-checks against Sprint 3 data)
 * - Runtime engine state transitions (valid and blocked)
 * - Welfare scenario constraints
 * - Evidence/outcome/learning engine behaviour
 */

import { describe, it, expect } from "vitest";
import { validateSprint4 } from "./validateSprint4";
import {
  DEFAULT_DEPLOYMENT,
  SYSTEM_MATURITY_OPTIONS,
  type SystemMaturity,
} from "../data/travelDeploymentConfig";
import { TRAVEL_ROLE_IDS } from "../data/travelRoles";
import { TRAVEL_OPERATING_SYSTEMS } from "../data/travelOperatingSystems";
import { TRAVEL_SCENARIOS } from "../data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "../data/travelPlaybooks";
import {
  createExecution,
  transitionExecution,
  captureEvidence,
  uncaptureEvidence,
  recordOutcome,
  sendCommunication,
  triggerEscalation,
  generateLearning,
  getAvailableActions,
  getMandatoryEvidenceGaps,
  getEvidenceCompleteness,
  getStateLabel,
  getStateColor,
  canTransition,
  VALID_TRANSITIONS,
  OUTCOME_STATUS_LABELS,
  STATE_TO_STEP,
  TRACE_STEPS,
  type ScenarioExecution,
  type OutcomeStatus,
} from "./runtimeEngine";

// ── Master validation ─────────────────────────────────────────────────────────

describe("Sprint 4 Data Integrity", () => {
  it("passes all validation checks with zero errors", () => {
    const result = validateSprint4();
    if (!result.passed) {
      for (const issue of result.issues.filter(i => i.severity === "error")) {
        console.error(`✗ [${issue.category}] ${issue.message}`);
      }
    }
    expect(result.errorCount).toBe(0);
  });
});

// ── DEFAULT_DEPLOYMENT checks ─────────────────────────────────────────────────

describe("DEFAULT_DEPLOYMENT", () => {
  it("has required top-level fields", () => {
    expect(DEFAULT_DEPLOYMENT.id).toBeTruthy();
    expect(DEFAULT_DEPLOYMENT.deploymentName).toBeTruthy();
    expect(DEFAULT_DEPLOYMENT.organisationName).toBeTruthy();
    expect(DEFAULT_DEPLOYMENT.propertyType).toBeTruthy();
    expect(DEFAULT_DEPLOYMENT.roomCount).toBeGreaterThan(0);
  });

  it("is always marked synthetic:true", () => {
    expect(DEFAULT_DEPLOYMENT.synthetic).toBe(true);
  });

  it("has at least one system", () => {
    expect(DEFAULT_DEPLOYMENT.systems.length).toBeGreaterThan(0);
  });

  it("all system maturity values are in SYSTEM_MATURITY_OPTIONS", () => {
    const approvedValues = new Set(SYSTEM_MATURITY_OPTIONS.map(o => o.value));
    for (const sys of DEFAULT_DEPLOYMENT.systems) {
      expect(approvedValues.has(sys.maturity as SystemMaturity)).toBe(true);
    }
  });

  it("no system uses 'integrated' maturity (not permitted in defaults)", () => {
    for (const sys of DEFAULT_DEPLOYMENT.systems) {
      expect(sys.maturity).not.toBe("integrated");
    }
  });

  it("all deployment role IDs resolve in TRAVEL_ROLE_IDS", () => {
    for (const dr of DEFAULT_DEPLOYMENT.roles) {
      expect(TRAVEL_ROLE_IDS).toContain(dr.roleId);
    }
  });

  it("all deployment OS IDs resolve in TRAVEL_OPERATING_SYSTEMS", () => {
    const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(o => o.id));
    for (const dos of DEFAULT_DEPLOYMENT.operatingSystems) {
      expect(osIds.has(dos.osId)).toBe(true);
    }
  });

  it("all deployment scenario IDs resolve in TRAVEL_SCENARIOS", () => {
    const scenarioIds = new Set(TRAVEL_SCENARIOS.map(s => s.id));
    for (const ds of DEFAULT_DEPLOYMENT.scenarios) {
      expect(scenarioIds.has(ds.scenarioId)).toBe(true);
    }
  });

  it("all deployment playbook IDs resolve in TRAVEL_PLAYBOOKS", () => {
    const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
    for (const ds of DEFAULT_DEPLOYMENT.scenarios) {
      expect(playbookIds.has(ds.playbookId)).toBe(true);
    }
  });

  it("all deployment scenario accountableRoleIds resolve", () => {
    for (const ds of DEFAULT_DEPLOYMENT.scenarios) {
      if (ds.accountableRoleId) {
        expect(TRAVEL_ROLE_IDS).toContain(ds.accountableRoleId);
      }
    }
  });

  it("all deployment evidence ownerRoleIds resolve", () => {
    for (const ev of DEFAULT_DEPLOYMENT.evidence) {
      if (ev.ownerRoleId) {
        expect(TRAVEL_ROLE_IDS).toContain(ev.ownerRoleId);
      }
    }
  });

  it("has at least one active operating system", () => {
    const activeCount = DEFAULT_DEPLOYMENT.operatingSystems.filter(o => o.active).length;
    expect(activeCount).toBeGreaterThan(0);
  });

  it("has at least one active scenario", () => {
    const activeCount = DEFAULT_DEPLOYMENT.scenarios.filter(s => s.active).length;
    expect(activeCount).toBeGreaterThan(0);
  });

  it("marketplace OS is inactive by default (expansion-only)", () => {
    const marketplace = DEFAULT_DEPLOYMENT.operatingSystems.find(o => o.osId === "marketplace-loyalty-activation-os");
    expect(marketplace).toBeDefined();
    expect(marketplace?.active).toBe(false);
  });
});

// ── Runtime engine: createExecution ──────────────────────────────────────────

describe("RuntimeEngine.createExecution", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("returns a valid execution with signal-received initial state", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.state).toBe("signal-received");
    expect(exec.id).toBeTruthy();
    expect(exec.scenarioId).toBe("repeat-guest-room-not-ready");
  });

  it("sets isSynthetic:true on all executions", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.isSynthetic).toBe(true);
  });

  it("initialises evidence from scenario evidenceRequirements", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.evidence.length).toBeGreaterThan(0);
    expect(exec.evidence.length).toBe(scenario.evidenceRequirements.length);
    for (const ev of exec.evidence) {
      expect(ev.captured).toBe(false);
    }
  });

  it("initialises outcomes from scenario outcomes with status pending", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.outcomes.length).toBeGreaterThan(0);
    for (const o of exec.outcomes) {
      expect(o.status).toBe("pending");
    }
  });

  it("initialises communications from scenario communicationDetails", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.communications.length).toBeGreaterThan(0);
    for (const c of exec.communications) {
      expect(c.sent).toBe(false);
    }
  });

  it("marks welfare scenario correctly", () => {
    const welfareScenario = TRAVEL_SCENARIOS.find(s => s.id === "distressed-guest")!;
    const welfarePlaybook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-distressed-guest")!;
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario: welfareScenario, playbook: welfarePlaybook });
    expect(exec.isWelfareScenario).toBe(true);
  });
});

// ── Runtime engine: state transitions ────────────────────────────────────────

describe("RuntimeEngine.transitionExecution — valid transitions", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
  const base = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });

  it("signal-received → understanding", () => {
    const next = transitionExecution(base, "understanding", scenario);
    expect(next).not.toBeNull();
    expect(next?.state).toBe("understanding");
  });

  it("adds state history entry on transition", () => {
    const next = transitionExecution(base, "understanding", scenario);
    expect(next?.stateHistory.length).toBe(2);
    expect(next?.stateHistory[1].state).toBe("understanding");
  });

  it("can advance through full happy-path (non-welfare): signal-received → closed", () => {
    let exec: ScenarioExecution | null = base;
    const path = ["understanding", "decision-required", "in-action", "resolved"] as const;
    for (const st of path) {
      exec = transitionExecution(exec!, st, scenario);
      expect(exec).not.toBeNull();
    }
    // Capture all mandatory evidence
    if (exec) {
      for (const ev of exec.evidence.filter(e => e.required)) {
        exec = captureEvidence(exec!, ev.id, { capturedByRole: "duty-manager", note: "Test" });
      }
    }
    const closed = transitionExecution(exec!, "closed", scenario);
    expect(closed).not.toBeNull();
    expect(closed?.state).toBe("closed");
    expect(closed?.closedAt).toBeTruthy();
  });

  it("can transition through escalation pathway: in-action → escalated → resolved", () => {
    let exec: ScenarioExecution | null = base;
    for (const st of ["understanding", "decision-required", "in-action"] as const) {
      exec = transitionExecution(exec!, st, scenario);
    }
    const escalated = transitionExecution(exec!, "escalated", scenario);
    expect(escalated?.state).toBe("escalated");
    const returned = transitionExecution(escalated!, "in-action", scenario);
    expect(returned?.state).toBe("in-action");
    const resolved = transitionExecution(returned!, "resolved", scenario);
    expect(resolved?.state).toBe("resolved");
  });
});

describe("RuntimeEngine.transitionExecution — blocked transitions", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
  const base = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });

  it("blocks signal-received → in-action (must progress through states)", () => {
    const result = transitionExecution(base, "in-action", scenario);
    expect(result).toBeNull();
  });

  it("blocks signal-received → closed", () => {
    const result = transitionExecution(base, "closed", scenario);
    expect(result).toBeNull();
  });

  it("blocks backwards transition understanding → signal-received", () => {
    const inUnderstanding = transitionExecution(base, "understanding", scenario)!;
    const back = transitionExecution(inUnderstanding, "signal-received", scenario);
    expect(back).toBeNull();
  });

  it("blocks closure when mandatory evidence is incomplete", () => {
    let exec: ScenarioExecution | null = base;
    for (const st of ["understanding", "decision-required", "in-action", "resolved"] as const) {
      exec = transitionExecution(exec!, st, scenario);
    }
    // Do NOT capture evidence
    const closed = transitionExecution(exec!, "closed", scenario);
    expect(closed).toBeNull();
  });
});

// ── Runtime engine: welfare constraints ──────────────────────────────────────

describe("RuntimeEngine — welfare scenario constraints", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "distressed-guest")!;
  const playbook  = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-distressed-guest")!;

  it("is marked as a welfare scenario", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.isWelfareScenario).toBe(true);
  });

  it("blocks decision-required → in-action (approval mandatory for welfare)", () => {
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec!, "understanding", scenario);
    exec = transitionExecution(exec!, "decision-required", scenario);
    const skip = transitionExecution(exec!, "in-action", scenario);
    expect(skip).toBeNull();
  });

  it("allows decision-required → approval-required", () => {
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec!, "understanding", scenario);
    exec = transitionExecution(exec!, "decision-required", scenario);
    const approved = transitionExecution(exec!, "approval-required", scenario);
    expect(approved).not.toBeNull();
    expect(approved?.state).toBe("approval-required");
  });

  it("allows approval-required → in-action after explicit approval", () => {
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec!, "understanding", scenario);
    exec = transitionExecution(exec!, "decision-required", scenario);
    exec = transitionExecution(exec!, "approval-required", scenario);
    const actioned = transitionExecution(exec!, "in-action", scenario);
    expect(actioned).not.toBeNull();
    expect(actioned?.state).toBe("in-action");
  });

  it("allows approval-required → escalated (approver unreachable / welfare escalation)", () => {
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec!, "understanding", scenario);
    exec = transitionExecution(exec!, "decision-required", scenario);
    exec = transitionExecution(exec!, "approval-required", scenario);
    const escalated = transitionExecution(exec!, "escalated", scenario);
    expect(escalated).not.toBeNull();
    expect(escalated?.state).toBe("escalated");
  });

  it("canTransition correctly permits approval-required → escalated", () => {
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec!, "understanding", scenario);
    exec = transitionExecution(exec!, "decision-required", scenario);
    exec = transitionExecution(exec!, "approval-required", scenario);
    const result = canTransition(exec!, "escalated", scenario);
    expect(result.allowed).toBe(true);
  });
});

// ── Runtime engine: evidence capture ─────────────────────────────────────────

describe("RuntimeEngine.captureEvidence", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("marks evidence as captured with timestamp", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const ev = exec.evidence[0];
    const updated = captureEvidence(exec, ev.id, { capturedByRole: "front-office", note: "Done" });
    const captured = updated.evidence.find(e => e.id === ev.id);
    expect(captured?.captured).toBe(true);
    expect(captured?.capturedAt).toBeTruthy();
    expect(captured?.capturedByRole).toBe("front-office");
  });

  it("uncaptureEvidence reverts captured state", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const ev = exec.evidence[0];
    const captured = captureEvidence(exec, ev.id, { capturedByRole: "front-office" });
    const reverted = uncaptureEvidence(captured, ev.id);
    expect(reverted.evidence.find(e => e.id === ev.id)?.captured).toBe(false);
  });

  it("getMandatoryEvidenceGaps lists all uncaptured required items", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const gaps = getMandatoryEvidenceGaps(exec);
    const requiredCount = exec.evidence.filter(e => e.required).length;
    expect(gaps.length).toBe(requiredCount);
  });

  it("getEvidenceCompleteness returns 0 when nothing captured", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(getEvidenceCompleteness(exec)).toBe(0);
  });

  it("getEvidenceCompleteness returns 100 when all required items captured", () => {
    let exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    for (const ev of exec.evidence.filter(e => e.required)) {
      exec = captureEvidence(exec, ev.id, {});
    }
    expect(getEvidenceCompleteness(exec)).toBe(100);
  });
});

// ── Runtime engine: outcomes and communications ───────────────────────────────

describe("RuntimeEngine.recordOutcome", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("records outcome status correctly", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const out = exec.outcomes[0];
    const updated = recordOutcome(exec, out.id, "met", "Guest was satisfied");
    const recorded = updated.outcomes.find(o => o.id === out.id);
    expect(recorded?.status).toBe("met");
    expect(recorded?.note).toBe("Guest was satisfied");
    expect(recorded?.recordedAt).toBeTruthy();
  });

  it("OUTCOME_STATUS_LABELS has entries for all outcome statuses", () => {
    const statuses: OutcomeStatus[] = ["pending", "met", "partially-met", "not-met", "not-measured"];
    for (const s of statuses) {
      expect(OUTCOME_STATUS_LABELS[s]).toBeTruthy();
    }
  });
});

describe("RuntimeEngine.sendCommunication", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("marks communication as sent with timestamp", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const comm = exec.communications[0];
    const updated = sendCommunication(exec, comm.id, "duty-manager");
    const sent = updated.communications.find(c => c.id === comm.id);
    expect(sent?.sent).toBe(true);
    expect(sent?.sentAt).toBeTruthy();
    expect(sent?.approvedBy).toBe("duty-manager");
  });
});

// ── Runtime engine: escalation ────────────────────────────────────────────────

describe("RuntimeEngine.triggerEscalation", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("adds an escalation entry", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const updated = triggerEscalation(exec, "Delay exceeded threshold", "duty-manager");
    expect(updated.escalations.length).toBe(1);
    expect(updated.escalations[0].trigger).toBe("Delay exceeded threshold");
    expect(updated.escalations[0].acknowledged).toBe(false);
  });
});

// ── Runtime engine: learning generation ──────────────────────────────────────

describe("RuntimeEngine.generateLearning", () => {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;

  it("generates non-empty learning output", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const learning = generateLearning(exec, scenario, playbook);
    expect(learning.patterns.length).toBeGreaterThan(0);
    expect(learning.improvements.length).toBeGreaterThan(0);
    expect(learning.generatedAt).toBeTruthy();
  });

  it("marks incomplete evidence quality when nothing captured", () => {
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const learning = generateLearning(exec, scenario, playbook);
    expect(learning.evidenceQuality).toBe("incomplete");
  });

  it("marks complete evidence quality when all required items captured", () => {
    let exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    for (const ev of exec.evidence.filter(e => e.required)) {
      exec = captureEvidence(exec, ev.id, {});
    }
    const learning = generateLearning(exec, scenario, playbook);
    expect(learning.evidenceQuality).toBe("complete");
  });
});

// ── Runtime engine: state helpers ────────────────────────────────────────────

describe("RuntimeEngine helpers", () => {
  it("VALID_TRANSITIONS covers all 8 execution states", () => {
    const allStates = [
      "signal-received", "understanding", "decision-required", "approval-required",
      "in-action", "escalated", "resolved", "closed",
    ];
    for (const st of allStates) {
      expect(st in VALID_TRANSITIONS).toBe(true);
    }
  });

  it("getStateLabel returns a non-empty label for every state", () => {
    const allStates = [
      "signal-received", "understanding", "decision-required", "approval-required",
      "in-action", "escalated", "resolved", "closed",
    ] as const;
    for (const st of allStates) {
      expect(getStateLabel(st)).toBeTruthy();
    }
  });

  it("getStateColor returns a non-empty color for every state", () => {
    const allStates = [
      "signal-received", "understanding", "decision-required", "approval-required",
      "in-action", "escalated", "resolved", "closed",
    ] as const;
    for (const st of allStates) {
      expect(getStateColor(st)).toBeTruthy();
    }
  });

  it("STATE_TO_STEP maps all 8 states to step indices 0-4", () => {
    const allStates = [
      "signal-received", "understanding", "decision-required", "approval-required",
      "in-action", "escalated", "resolved", "closed",
    ] as const;
    for (const st of allStates) {
      const step = STATE_TO_STEP[st];
      expect(step).toBeGreaterThanOrEqual(0);
      expect(step).toBeLessThanOrEqual(4);
    }
  });

  it("TRACE_STEPS has exactly 5 steps", () => {
    expect(TRACE_STEPS.length).toBe(5);
  });

  it("getAvailableActions returns actions for signal-received state", () => {
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const actions = getAvailableActions(exec, scenario);
    expect(actions.length).toBeGreaterThan(0);
  });

  it("getAvailableActions returns no actions for closed state", () => {
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
    let exec: ScenarioExecution | null = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    for (const st of ["understanding", "decision-required", "in-action", "resolved"] as const) {
      exec = transitionExecution(exec!, st, scenario);
    }
    for (const ev of exec!.evidence.filter(e => e.required)) {
      exec = captureEvidence(exec!, ev.id, {});
    }
    exec = transitionExecution(exec!, "closed", scenario);
    const actions = getAvailableActions(exec!, scenario);
    expect(actions.length).toBe(0);
  });

  it("canTransition correctly identifies valid transition", () => {
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const result = canTransition(exec, "understanding", scenario);
    expect(result.allowed).toBe(true);
  });

  it("canTransition correctly blocks invalid transition", () => {
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready")!;
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready")!;
    const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    const result = canTransition(exec, "closed", scenario);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });
});
