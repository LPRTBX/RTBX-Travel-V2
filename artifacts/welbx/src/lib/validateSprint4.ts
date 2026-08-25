/**
 * RTBX Travel — Sprint 4 Data Integrity Validation.
 *
 * Validates the deployment configuration model and runtime engine against
 * the canonical Sprint 3 data. All checks must pass before Sprint 4 is complete.
 *
 * Run from this artifact directory: pnpm test
 */

import { DEFAULT_DEPLOYMENT, SYSTEM_MATURITY_OPTIONS, type ScenarioExecutionState } from "../data/travelDeploymentConfig";
import { TRAVEL_ROLES, TRAVEL_ROLE_IDS } from "../data/travelRoles";
import { TRAVEL_OPERATING_SYSTEMS } from "../data/travelOperatingSystems";
import { TRAVEL_SCENARIOS } from "../data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "../data/travelPlaybooks";
import {
  createExecution,
  transitionExecution,
  captureEvidence,
  getMandatoryEvidenceGaps,
  getAvailableActions,
  VALID_TRANSITIONS,
  OUTCOME_STATUS_LABELS,
  type OutcomeStatus,
} from "./runtimeEngine";
import type { ValidationIssue, ValidationResult } from "./validateSprint3";

function error(category: string, message: string): ValidationIssue {
  return { category, severity: "error", message };
}

function warning(category: string, message: string): ValidationIssue {
  return { category, severity: "warning", message };
}

// ── Deployment config validation ──────────────────────────────────────────────

function validateDefaultDeployment(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const dep = DEFAULT_DEPLOYMENT;

  // Top-level required fields
  if (!dep.id)             issues.push(error("Deployment", "DEFAULT_DEPLOYMENT is missing id"));
  if (!dep.deploymentName) issues.push(error("Deployment", "DEFAULT_DEPLOYMENT is missing deploymentName"));
  if (!dep.organisationName) issues.push(error("Deployment", "DEFAULT_DEPLOYMENT is missing organisationName"));
  if (!dep.propertyType)   issues.push(error("Deployment", "DEFAULT_DEPLOYMENT is missing propertyType"));
  if (dep.roomCount <= 0)  issues.push(error("Deployment", "DEFAULT_DEPLOYMENT roomCount must be > 0"));
  if (dep.synthetic !== true) issues.push(error("Deployment", "DEFAULT_DEPLOYMENT.synthetic must be true"));

  // Arrays must not be empty
  if (!dep.systems || dep.systems.length === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no systems"));
  if (!dep.roles || dep.roles.length === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no roles"));
  if (!dep.operatingSystems || dep.operatingSystems.length === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no operatingSystems"));
  if (!dep.governance || dep.governance.length === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no governance rules"));
  if (!dep.scenarios || dep.scenarios.length === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no scenarios"));

  // System maturity values must be approved
  const approvedMaturity = new Set(SYSTEM_MATURITY_OPTIONS.map(o => o.value));
  for (const sys of dep.systems) {
    if (!approvedMaturity.has(sys.maturity)) {
      issues.push(error("Deployment", `System "${sys.name}" has unapproved maturity: "${sys.maturity}"`));
    }
  }

  // Role IDs must all resolve
  const roleIdSet = new Set(TRAVEL_ROLE_IDS);
  for (const dr of dep.roles) {
    if (!roleIdSet.has(dr.roleId)) {
      issues.push(error("Deployment", `Deployment role "${dr.roleId}" not found in TRAVEL_ROLES`));
    }
  }

  // OS IDs must all resolve
  const osIdSet = new Set(TRAVEL_OPERATING_SYSTEMS.map(o => o.id));
  for (const dos of dep.operatingSystems) {
    if (!osIdSet.has(dos.osId)) {
      issues.push(error("Deployment", `Deployment OS "${dos.osId}" not found in TRAVEL_OPERATING_SYSTEMS`));
    }
  }

  // Scenario IDs must all resolve
  const scenarioIdSet = new Set(TRAVEL_SCENARIOS.map(s => s.id));
  for (const ds of dep.scenarios) {
    if (!scenarioIdSet.has(ds.scenarioId)) {
      issues.push(error("Deployment", `Deployment scenario "${ds.scenarioId}" not found in TRAVEL_SCENARIOS`));
    }
  }

  // Playbook IDs must all resolve
  const playbookIdSet = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  for (const ds of dep.scenarios) {
    if (!playbookIdSet.has(ds.playbookId)) {
      issues.push(error("Deployment", `Deployment playbook "${ds.playbookId}" not found in TRAVEL_PLAYBOOKS`));
    }
  }

  // Accountable role IDs on scenarios must resolve
  for (const ds of dep.scenarios) {
    if (ds.accountableRoleId && !roleIdSet.has(ds.accountableRoleId)) {
      issues.push(error("Deployment", `Scenario "${ds.scenarioId}" accountableRoleId "${ds.accountableRoleId}" not found`));
    }
  }

  // Evidence owner role IDs must resolve
  for (const ev of dep.evidence) {
    if (ev.ownerRoleId && !roleIdSet.has(ev.ownerRoleId)) {
      issues.push(error("Deployment", `Evidence "${ev.evidenceType}" ownerRoleId "${ev.ownerRoleId}" not found`));
    }
  }

  // Active scenarios: their OS must also be active
  const activeOSIds = new Set(dep.operatingSystems.filter(o => o.active).map(o => o.osId));
  for (const ds of dep.scenarios.filter(s => s.active)) {
    const scenario = TRAVEL_SCENARIOS.find(ts => ts.id === ds.scenarioId);
    if (scenario && !activeOSIds.has(scenario.operatingSystemId)) {
      issues.push(warning("Deployment", `Active scenario "${ds.scenarioId}" has inactive OS "${scenario.operatingSystemId}"`));
    }
  }

  // At least 1 active OS and 1 active scenario in the default deployment
  const activeOSCount       = dep.operatingSystems.filter(o => o.active).length;
  const activeScenarioCount = dep.scenarios.filter(s => s.active).length;
  if (activeOSCount === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no active operating systems"));
  if (activeScenarioCount === 0)
    issues.push(error("Deployment", "DEFAULT_DEPLOYMENT has no active scenarios"));

  return issues;
}

// ── Runtime engine validation ─────────────────────────────────────────────────

function validateRuntimeEngine(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Use repeat-guest-room-not-ready (active, working-proof, well-defined)
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "repeat-guest-room-not-ready");
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-repeat-guest-room-not-ready");

  if (!scenario) {
    issues.push(error("RuntimeEngine", "Test scenario 'repeat-guest-room-not-ready' not found"));
    return issues;
  }
  if (!playbook) {
    issues.push(error("RuntimeEngine", "Test playbook 'pb-repeat-guest-room-not-ready' not found"));
    return issues;
  }

  // createExecution produces valid initial state
  const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
  if (exec.state !== "signal-received") {
    issues.push(error("RuntimeEngine", `Expected initial state 'signal-received', got '${exec.state}'`));
  }
  if (!exec.isSynthetic) {
    issues.push(error("RuntimeEngine", "ScenarioExecution.isSynthetic must be true"));
  }
  if (exec.evidence.length === 0) {
    issues.push(error("RuntimeEngine", "createExecution should initialise evidence from scenario"));
  }
  if (exec.outcomes.length === 0) {
    issues.push(error("RuntimeEngine", "createExecution should initialise outcomes from scenario"));
  }

  // Valid transition: signal-received → understanding
  const exec2 = transitionExecution(exec, "understanding", scenario);
  if (!exec2) {
    issues.push(error("RuntimeEngine", "Valid transition signal-received → understanding failed"));
  } else if (exec2.state !== "understanding") {
    issues.push(error("RuntimeEngine", `Expected state 'understanding' after transition, got '${exec2.state}'`));
  }

  // Invalid transition: signal-received → in-action (must be blocked)
  const blocked = transitionExecution(exec, "in-action", scenario);
  if (blocked !== null) {
    issues.push(error("RuntimeEngine", "Invalid transition signal-received → in-action should be blocked (returned null)"));
  }

  // Cannot close with mandatory evidence incomplete
  // Advance to resolved state
  let execAdv: typeof exec | null = exec;
  const path: ScenarioExecutionState[] = ["understanding", "decision-required", "approval-required", "in-action", "resolved"];
  for (const st of path) {
    if (execAdv) execAdv = transitionExecution(execAdv, st, scenario);
  }
  if (!execAdv) {
    issues.push(error("RuntimeEngine", "Could not advance execution to resolved state for closure test"));
  } else {
    const gaps = getMandatoryEvidenceGaps(execAdv);
    if (gaps.length === 0) {
      issues.push(warning("RuntimeEngine", "Expected mandatory evidence gaps before closure — scenario may have no required evidence"));
    }
    // closure should be blocked
    const closedBeforeEvidence = transitionExecution(execAdv, "closed", scenario);
    if (closedBeforeEvidence !== null) {
      issues.push(error("RuntimeEngine", "Closure with incomplete mandatory evidence should be blocked (returned null)"));
    }
    // Capture all evidence and then closure should succeed
    let execWithEvidence = execAdv;
    for (const ev of execWithEvidence.evidence.filter(e => e.required)) {
      execWithEvidence = captureEvidence(execWithEvidence, ev.id, { capturedByRole: "front-office", note: "Test capture" });
    }
    const closedAfterEvidence = transitionExecution(execWithEvidence, "closed", scenario);
    if (closedAfterEvidence === null) {
      issues.push(error("RuntimeEngine", "Closure with complete evidence should be allowed but was blocked"));
    }
  }

  // VALID_TRANSITIONS covers all states
  const allStates: ScenarioExecutionState[] = [
    "signal-received", "understanding", "decision-required", "approval-required",
    "in-action", "escalated", "resolved", "closed",
  ];
  for (const st of allStates) {
    if (!(st in VALID_TRANSITIONS)) {
      issues.push(error("RuntimeEngine", `State '${st}' not found in VALID_TRANSITIONS`));
    }
  }

  // OUTCOME_STATUS_LABELS covers all outcome statuses
  const outcomeStatuses: OutcomeStatus[] = ["pending", "met", "partially-met", "not-met", "not-measured"];
  for (const s of outcomeStatuses) {
    if (!OUTCOME_STATUS_LABELS[s]) {
      issues.push(error("RuntimeEngine", `Outcome status '${s}' missing from OUTCOME_STATUS_LABELS`));
    }
  }

  // getAvailableActions returns something for non-closed states
  const execForActions = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
  const actions = getAvailableActions(execForActions, scenario);
  if (actions.length === 0) {
    issues.push(error("RuntimeEngine", "getAvailableActions returned empty for signal-received state"));
  }

  return issues;
}

// ── Welfare scenario constraint validation ────────────────────────────────────

function validateWelfareConstraints(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const scenario = TRAVEL_SCENARIOS.find(s => s.id === "distressed-guest");
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === "pb-distressed-guest");

  if (!scenario || !playbook) {
    issues.push(warning("WelfareConstraints", "Distressed guest scenario/playbook not found — welfare constraint tests skipped"));
    return issues;
  }

  const exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });

  if (!exec.isWelfareScenario) {
    issues.push(error("WelfareConstraints", "Distressed-guest execution should have isWelfareScenario: true"));
  }

  // Advance to decision-required
  let execDec: typeof exec | null = exec;
  execDec = transitionExecution(execDec, "understanding", scenario);
  if (execDec) execDec = transitionExecution(execDec, "decision-required", scenario);

  if (!execDec) {
    issues.push(error("WelfareConstraints", "Could not advance welfare execution to decision-required"));
    return issues;
  }

  // Welfare scenario: cannot skip approval-required → must be blocked
  const skipApproval = transitionExecution(execDec, "in-action", scenario);
  if (skipApproval !== null) {
    issues.push(error("WelfareConstraints", "Welfare scenario: skip from decision-required → in-action should be blocked"));
  }

  // Must go through approval-required
  const toApproval = transitionExecution(execDec, "approval-required", scenario);
  if (!toApproval) {
    issues.push(error("WelfareConstraints", "Welfare scenario: transition to approval-required should be allowed"));
  }

  return issues;
}

// ── Main entry point ──────────────────────────────────────────────────────────

export function validateSprint4(): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateDefaultDeployment(),
    ...validateRuntimeEngine(),
    ...validateWelfareConstraints(),
  ];

  const errors   = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  return {
    passed: errors.length === 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    issues,
  };
}

// Re-export TRAVEL_ROLES to keep test imports clean
export { TRAVEL_ROLES };
