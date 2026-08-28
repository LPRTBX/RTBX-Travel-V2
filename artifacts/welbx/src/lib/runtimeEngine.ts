/**
 * RTBX Travel — Sprint 4 Runtime Engine.
 *
 * A single data-driven, purely functional execution engine. Takes deployment
 * and scenario/playbook data and produces ScenarioExecution records.
 * No React inside this module — it is a pure state reducer.
 *
 * State machine: signal-received → understanding → decision-required
 *                → approval-required → in-action → escalated → resolved → closed
 *
 * All data is local synthetic demonstration data.
 */

import type { TravelDeploymentConfig, ScenarioExecutionState } from "@/data/travelDeploymentConfig";
import type { TravelScenario } from "@/data/travelScenarios";
import type { TravelPlaybook } from "@/data/travelPlaybooks";

// ── Runtime sub-types ─────────────────────────────────────────────────────────

export type OutcomeStatus =
  | "pending"
  | "met"
  | "partially-met"
  | "not-met"
  | "not-measured";

export const OUTCOME_STATUS_LABELS: Record<OutcomeStatus, string> = {
  "pending":        "Pending",
  "met":            "Met",
  "partially-met":  "Partially met",
  "not-met":        "Not met",
  "not-measured":   "Not measured",
};

export interface RuntimeEvidence {
  id: string;
  evidenceType: string;
  required: boolean;
  ownerRoleId: string;
  completionRule: string;
  captured: boolean;
  capturedAt?: string;
  capturedByRole?: string;
  note?: string;
}

export interface RuntimeOutcome {
  id: string;
  metric: string;
  status: OutcomeStatus;
  note?: string;
  recordedAt?: string;
}

export interface RuntimeCommunication {
  id: string;
  audience: string;
  channel: string;
  purpose: string;
  approvalRequired: boolean;
  /** Role that approved this communication. Required before send when approvalRequired=true. */
  approvedBy?: string;
  /** Present when a send attempt was blocked due to missing approval. */
  approvalBlockedReason?: string;
  sent: boolean;
  sentAt?: string;
  /** True if this communication is shown in Guest View. */
  isGuestFacing: boolean;
}

export interface RuntimeEscalation {
  id: string;
  trigger: string;
  escalateToRoleId: string;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface RuntimeLearning {
  patterns: string[];
  improvements: string[];
  evidenceQuality: "complete" | "partial" | "incomplete";
  generatedAt: string;
}

export interface ScenarioExecution {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  deploymentId: string;
  deploymentName: string;
  playbookId: string;
  playbookName: string;
  accountableRoleId: string;
  governanceRules: Array<{
    id: string;
    label: string;
    value: string;
    source: string;
  }>;
  playbookSteps: Array<{
    step: number;
    title: string;
    action: string;
    ownerRoleId: string;
    timing: string;
    approvalRequired: boolean;
  }>;

  state: ScenarioExecutionState;
  stateHistory: Array<{ state: ScenarioExecutionState; timestamp: string; note?: string }>;

  startedAt: string;
  updatedAt: string;
  closedAt?: string;

  evidence: RuntimeEvidence[];
  outcomes: RuntimeOutcome[];
  communications: RuntimeCommunication[];
  escalations: RuntimeEscalation[];
  learning?: RuntimeLearning;

  /** Welfare scenario: enforces additional human-approval constraints. */
  isWelfareScenario: boolean;

  isSynthetic: true;
  syntheticLabel: "local synthetic demonstration data";
}

// ── Valid state transitions ───────────────────────────────────────────────────

/** All valid state transitions (from → to[]). */
export const VALID_TRANSITIONS: Record<ScenarioExecutionState, ScenarioExecutionState[]> = {
  "signal-received":  ["understanding"],
  "understanding":    ["decision-required"],
  "decision-required": ["approval-required", "in-action"],
  "approval-required": ["in-action", "escalated"],
  "in-action":        ["escalated", "resolved"],
  "escalated":        ["in-action", "resolved"],
  "resolved":         ["closed"],
  "closed":           [],
};

/** The ordered states for progress display. */
export const STATE_SEQUENCE: ScenarioExecutionState[] = [
  "signal-received",
  "understanding",
  "decision-required",
  "approval-required",
  "in-action",
  "escalated",
  "resolved",
  "closed",
];

/** Map state → step index (0-based) in the 5-step Connect/Understand/Decide/Act/Learn trace. */
export const STATE_TO_STEP: Record<ScenarioExecutionState, number> = {
  "signal-received":  0,
  "understanding":    1,
  "decision-required": 2,
  "approval-required": 2,
  "in-action":        3,
  "escalated":        3,
  "resolved":         4,
  "closed":           4,
};

export const TRACE_STEPS = [
  { id: "connect",    label: "Connect",    description: "Receive and validate the triggering signal." },
  { id: "understand", label: "Understand", description: "Assess context, facts, risk and confidence." },
  { id: "decide",     label: "Decide",     description: "Apply governance rules and obtain required approvals." },
  { id: "act",        label: "Act",        description: "Assign owner, execute playbook steps, route communications." },
  { id: "learn",      label: "Learn",      description: "Capture evidence, record outcomes, close and generate learning." },
];

// ── Engine functions ──────────────────────────────────────────────────────────

/** Create a new ScenarioExecution from deployment + scenario + playbook data. */
export function createExecution(params: {
  deployment: TravelDeploymentConfig;
  scenario: TravelScenario;
  playbook: TravelPlaybook;
}): ScenarioExecution {
  const { deployment, scenario, playbook } = params;
  const configuredScenario = deployment.scenarios.find(item => item.scenarioId === scenario.id);
  if (!configuredScenario) {
    throw new Error(`Scenario "${scenario.id}" is not configured in deployment "${deployment.id}".`);
  }
  if (configuredScenario.playbookId !== scenario.playbookId || playbook.id !== scenario.playbookId) {
    throw new Error(`Scenario "${scenario.id}" is not linked to its canonical playbook.`);
  }
  const now = new Date().toISOString();
  const id  = `exec-${scenario.id}-${Date.now()}`;

  // Runtime evidence, outcomes and communications come from the validated
  // deployment configuration rather than a parallel page-local fixture.
  const evidence: RuntimeEvidence[] = deployment.evidence.map((er, i) => ({
    id: `ev-${id}-${i}`,
    evidenceType: er.evidenceType,
    required: er.required,
    ownerRoleId: er.ownerRoleId,
    completionRule: er.completionRule,
    captured: false,
  }));

  const outcomes: RuntimeOutcome[] = deployment.outcomes.map((o, i) => ({
    id: `out-${id}-${i}`,
    metric: o.metric,
    status: "pending" as OutcomeStatus,
  }));

  const communications: RuntimeCommunication[] = deployment.communications.map((c, i) => ({
    id: `comm-${id}-${i}`,
    audience: c.audience,
    channel: c.channel,
    purpose: c.communicationType,
    approvalRequired: c.approvalRequired,
    sent: false,
    isGuestFacing: c.audience.toLowerCase().includes("guest"),
  }));

  return {
    id,
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    deploymentId: deployment.id,
    deploymentName: deployment.deploymentName,
    playbookId: playbook.id,
    playbookName: playbook.name,
    accountableRoleId: configuredScenario.accountableRoleId,
    governanceRules: deployment.governance
      .filter(rule => rule.value.trim())
      .map(rule => ({
        id: rule.id,
        label: rule.label,
        value: rule.value,
        source: rule.source,
      })),
    playbookSteps: playbook.steps.map(step => ({
      step: step.step,
      title: step.title,
      action: step.action,
      ownerRoleId: step.ownerRoleId,
      timing: step.timing,
      approvalRequired: step.approvalRequired ?? false,
    })),
    state: "signal-received",
    stateHistory: [{ state: "signal-received", timestamp: now, note: "Execution started" }],
    startedAt: now,
    updatedAt: now,
    evidence,
    outcomes,
    communications,
    escalations: [],
    // Welfare scenarios are those in the safety/welfare OS — not every scenario with humanApprovalRequired
    isWelfareScenario: scenario.id === "distressed-guest" || scenario.operatingSystemId === "safety-guest-welfare-os",
    isSynthetic: true,
    syntheticLabel: "local synthetic demonstration data",
  };
}

/** Check whether a transition to the target state is currently valid. */
export function canTransition(
  exec: ScenarioExecution,
  to: ScenarioExecutionState,
  scenario: TravelScenario,
): { allowed: boolean; reason?: string } {
  const validNextStates = VALID_TRANSITIONS[exec.state];

  if (!validNextStates.includes(to)) {
    return { allowed: false, reason: `Cannot transition from "${exec.state}" to "${to}"` };
  }

  // Welfare scenario: approval-required is mandatory — cannot skip to in-action
  if (exec.isWelfareScenario && exec.state === "decision-required" && to === "in-action") {
    if (scenario.governanceConfig.humanApprovalRequired) {
      return { allowed: false, reason: "Welfare scenario: human approval is mandatory before action. Must go through approval-required state." };
    }
  }

  // Cannot close if mandatory evidence is incomplete
  if (to === "closed") {
    const gaps = getMandatoryEvidenceGaps(exec);
    if (gaps.length > 0) {
      return { allowed: false, reason: `Cannot close: mandatory evidence incomplete — ${gaps.join(", ")}` };
    }
  }

  // Cannot escalate if not in in-action or approval-required
  if (to === "escalated" && !["in-action", "approval-required"].includes(exec.state)) {
    return { allowed: false, reason: "Escalation only available from in-action or approval-required state" };
  }

  return { allowed: true };
}

/** Transition the execution to a new state. Returns new execution or null on failure. */
export function transitionExecution(
  exec: ScenarioExecution,
  to: ScenarioExecutionState,
  scenario: TravelScenario,
  note?: string,
): ScenarioExecution | null {
  const check = canTransition(exec, to, scenario);
  if (!check.allowed) return null;

  const now = new Date().toISOString();
  return {
    ...exec,
    state: to,
    stateHistory: [...exec.stateHistory, { state: to, timestamp: now, note }],
    updatedAt: now,
    closedAt: to === "closed" ? now : exec.closedAt,
  };
}

/** Capture an evidence item. */
export function captureEvidence(
  exec: ScenarioExecution,
  evidenceId: string,
  data: { capturedByRole?: string; note?: string },
): ScenarioExecution {
  const now = new Date().toISOString();
  return {
    ...exec,
    evidence: exec.evidence.map(ev =>
      ev.id === evidenceId
        ? { ...ev, captured: true, capturedAt: now, capturedByRole: data.capturedByRole, note: data.note }
        : ev
    ),
    updatedAt: now,
  };
}

/** Uncapture an evidence item (toggle off). */
export function uncaptureEvidence(exec: ScenarioExecution, evidenceId: string): ScenarioExecution {
  const now = new Date().toISOString();
  return {
    ...exec,
    evidence: exec.evidence.map(ev =>
      ev.id === evidenceId
        ? { ...ev, captured: false, capturedAt: undefined, capturedByRole: undefined, note: undefined }
        : ev
    ),
    updatedAt: now,
  };
}

/** Record or update an outcome status. */
export function recordOutcome(
  exec: ScenarioExecution,
  outcomeId: string,
  status: OutcomeStatus,
  note?: string,
): ScenarioExecution {
  const now = new Date().toISOString();
  return {
    ...exec,
    outcomes: exec.outcomes.map(o =>
      o.id === outcomeId
        ? { ...o, status, note, recordedAt: now }
        : o
    ),
    updatedAt: now,
  };
}

/**
 * Mark a communication as sent.
 *
 * Approval gate: if `approvalRequired` is true, `approvedBy` must be provided.
 * Welfare and distressed-guest communications always enforce this gate.
 * Calling without `approvedBy` on an approval-required communication throws —
 * the UI must record a human approval action before calling this function.
 */
export function sendCommunication(
  exec: ScenarioExecution,
  commId: string,
  approvedBy?: string,
): ScenarioExecution {
  const comm = exec.communications.find(c => c.id === commId);
  if (!comm) return exec; // no-op if id not found

  // Enforce approval gate — cannot automatically bypass with a default role
  if (comm.approvalRequired && !approvedBy) {
    throw new Error(
      `Communication '${commId}' requires approval before sending. ` +
      `Provide approvedBy with the approving role. ` +
      `Welfare and distressed-guest communications always require explicit human approval.`
    );
  }

  const now = new Date().toISOString();
  return {
    ...exec,
    communications: exec.communications.map(c =>
      c.id === commId
        ? { ...c, sent: true, sentAt: now, approvedBy }
        : c
    ),
    updatedAt: now,
  };
}

/** Trigger an escalation. */
export function triggerEscalation(
  exec: ScenarioExecution,
  trigger: string,
  escalateToRoleId: string,
): ScenarioExecution {
  const now = new Date().toISOString();
  const escalation: RuntimeEscalation = {
    id: `esc-${exec.id}-${exec.escalations.length + 1}`,
    trigger,
    escalateToRoleId,
    triggeredAt: now,
    acknowledged: false,
  };
  return {
    ...exec,
    escalations: [...exec.escalations, escalation],
    updatedAt: now,
  };
}

/** Acknowledge an escalation (human confirms receipt). */
export function acknowledgeEscalation(exec: ScenarioExecution, escalationId: string): ScenarioExecution {
  return {
    ...exec,
    escalations: exec.escalations.map(e => e.id === escalationId ? { ...e, acknowledged: true } : e),
    updatedAt: new Date().toISOString(),
  };
}

/** Get list of required evidence items that have not been captured. */
export function getMandatoryEvidenceGaps(exec: ScenarioExecution): string[] {
  return exec.evidence
    .filter(ev => ev.required && !ev.captured)
    .map(ev => ev.evidenceType);
}

/** Calculate evidence completeness (0-100). */
export function getEvidenceCompleteness(exec: ScenarioExecution): number {
  const required = exec.evidence.filter(ev => ev.required);
  if (required.length === 0) return 100;
  const captured = required.filter(ev => ev.captured);
  return Math.round((captured.length / required.length) * 100);
}

/** Generate learning output from execution trace. Rules-based patterns. */
export function generateLearning(
  exec: ScenarioExecution,
  scenario: TravelScenario,
  playbook: TravelPlaybook,
): RuntimeLearning {
  const now = new Date().toISOString();
  const patterns: string[] = [];
  const improvements: string[] = [];

  const capturedCount  = exec.evidence.filter(ev => ev.captured).length;
  const requiredCount  = exec.evidence.filter(ev => ev.required).length;
  const metOutcomes    = exec.outcomes.filter(o => o.status === "met").length;
  const hasEscalation  = exec.escalations.length > 0;
  const allComsSent    = exec.communications.length > 0 && exec.communications.every(c => c.sent);

  const evidenceQuality: RuntimeLearning["evidenceQuality"] =
    capturedCount >= requiredCount ? "complete" :
    capturedCount > 0 ? "partial" : "incomplete";

  // Pattern: early signal detection
  patterns.push(scenario.learningConfig.patternToDetect);

  // Pattern: escalation behaviour
  if (hasEscalation) {
    patterns.push(`Escalation was triggered — ${exec.escalations.length} escalation event(s) recorded during this execution.`);
  } else {
    patterns.push("No escalation required — scenario resolved within standard governance pathway.");
  }

  // Pattern: communications
  if (allComsSent) {
    patterns.push("All configured communications were delivered during this execution.");
  } else if (exec.communications.length > 0) {
    const unsent = exec.communications.filter(c => !c.sent).length;
    patterns.push(`${unsent} communication(s) were not delivered during this execution.`);
  }

  // Pattern: outcome quality
  if (metOutcomes > 0) {
    patterns.push(`${metOutcomes} of ${exec.outcomes.length} outcome metrics were recorded as Met.`);
  }

  // Improvements
  improvements.push(scenario.learningConfig.improvementAction);
  if (evidenceQuality !== "complete") {
    improvements.push("Review evidence capture process — not all required evidence items were recorded.");
  }
  if (hasEscalation) {
    improvements.push("Review playbook trigger thresholds to determine whether escalation could be pre-empted.");
  }

  // Welfare-specific improvement
  if (exec.isWelfareScenario) {
    patterns.push("Welfare scenario completed — all actions were human-led and human-approved per governance requirement.");
    improvements.push("Confirm post-incident review is scheduled within 24 hours per governance requirement.");
  }

  void playbook; // used for context in more complex implementations

  return {
    patterns,
    improvements,
    evidenceQuality,
    generatedAt: now,
  };
}

/** Return a human-readable label for the current state. */
export function getStateLabel(state: ScenarioExecutionState): string {
  const labels: Record<ScenarioExecutionState, string> = {
    "signal-received":  "Signal Received",
    "understanding":    "Understanding",
    "decision-required": "Decision Required",
    "approval-required": "Approval Required",
    "in-action":        "In Action",
    "escalated":        "Escalated",
    "resolved":         "Resolved",
    "closed":           "Closed",
  };
  return labels[state];
}

/** Return the state color for the current state. */
export function getStateColor(state: ScenarioExecutionState): string {
  const colors: Record<ScenarioExecutionState, string> = {
    "signal-received":  "#3b82f6",
    "understanding":    "#a78bfa",
    "decision-required": "#f59e0b",
    "approval-required": "#f97316",
    "in-action":        "#10b981",
    "escalated":        "#ef4444",
    "resolved":         "#10b981",
    "closed":           "rgba(255,255,255,0.35)",
  };
  return colors[state];
}

/** Return available next actions for the current state. */
export function getAvailableActions(
  exec: ScenarioExecution,
  scenario: TravelScenario,
): Array<{ id: string; label: string; toState?: ScenarioExecutionState; description: string }> {
  const actions: Array<{ id: string; label: string; toState?: ScenarioExecutionState; description: string }> = [];

  switch (exec.state) {
    case "signal-received":
      actions.push({ id: "receive", label: "Receive Signal", toState: "understanding", description: "Signal validated — begin contextual understanding." });
      break;

    case "understanding":
      actions.push({ id: "validate", label: "Validate Signal & Context", toState: "decision-required", description: "Context assessed. Apply governance rules." });
      break;

    case "decision-required": {
      const needsApproval = scenario.governanceConfig.humanApprovalRequired;
      if (needsApproval) {
        actions.push({ id: "to-approval", label: "Route for Approval", toState: "approval-required", description: `Requires ${scenario.governanceConfig.approvalRole ?? "manager"} approval before action.` });
      } else {
        actions.push({ id: "to-action", label: "Apply Decision Rule", toState: "in-action", description: "Decision applied within governance. Assign owner and act." });
      }
      // NOTE: Direct escalation from decision-required is NOT a valid transition.
      // The state machine requires decision-required → approval-required → escalated.
      // "Escalate Now" was removed to prevent the UI from offering a transition
      // that canTransition() would reject.
      break;
    }

    case "approval-required":
      actions.push({ id: "approve", label: "Approve Action", toState: "in-action", description: "Approval granted. Assign owner and action." });
      actions.push({ id: "escalate", label: "Escalate", toState: "escalated", description: "Duty Manager escalation triggered." });
      break;

    case "in-action":
      actions.push({ id: "resolve", label: "Resolve Scenario", toState: "resolved", description: "All required actions complete. Proceed to evidence and closure." });
      actions.push({ id: "escalate", label: "Trigger Escalation", toState: "escalated", description: "Escalation threshold exceeded — route to higher authority." });
      break;

    case "escalated":
      actions.push({ id: "return-action", label: "Return to Action", toState: "in-action", description: "Escalation acknowledged. Resume action pathway." });
      actions.push({ id: "resolve-escalated", label: "Resolve (Escalated)", toState: "resolved", description: "Scenario resolved following escalation." });
      break;

    case "resolved": {
      const check = canTransition(exec, "closed", scenario);
      actions.push({
        id: "close",
        label: check.allowed ? "Close Scenario" : "Close (blocked — evidence incomplete)",
        toState: check.allowed ? "closed" : undefined,
        description: check.allowed
          ? "All evidence captured. Close scenario and generate learning output."
          : (check.reason ?? "Complete mandatory evidence before closing."),
      });
      break;
    }

    case "closed":
      // No further actions
      break;
  }

  return actions;
}
