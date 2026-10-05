/**
 * JALDO Travel — Sprint 4 Runtime Engine.
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

import type {
  TravelDeploymentConfig,
  ScenarioExecutionState,
  DeploymentCommunicationConfig,
  DeploymentEvidenceConfig,
  DeploymentOutcomeConfig,
} from "@/data/travelDeploymentConfig";
import type { TravelScenario } from "@/data/travelScenarios";
import type { TravelPlaybook } from "@/data/travelPlaybooks";
import { TRAVEL_ROLES } from "@/data/travelRoles";

const roleLabel = (id: string) => TRAVEL_ROLES.find(r => r.id === id)?.name ?? id;

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
  /** What a named person should review before the next cycle. */
  reviewTrigger: string;
  /** Proposed next action. Never applied automatically. */
  nextAction: string;
  /** Whether any outcome was actually recorded as met / not met. */
  outcomeEvidence: "measured" | "not-measured";
  generatedAt: string;
}

/** A recorded human decision at the approval gate (synthetic role, not an authenticated identity). */
export interface RuntimeDecision {
  decision: "approved" | "returned";
  roleId: string;
  at: string;
  /** Which entry into the approval gate this decision belongs to (1-based). */
  gateEntry: number;
  reason?: string;
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
  /** Role whose recorded decision is required at the approval gate. */
  approvalRoleId: string;
  /** Scenario governance: whether a human approval gate applies before action. */
  approvalRequired: boolean;
  /** Decisions recorded at the approval gate, in order. */
  decisions: RuntimeDecision[];
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
  // approval-required → decision-required: the approver disagrees and returns the case with a reason.
  "approval-required": ["in-action", "escalated", "decision-required"],
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

/** Welfare scenarios are those in the safety/welfare OS — not every scenario with humanApprovalRequired. */
export function isWelfareScenario(scenario: Pick<TravelScenario, "id" | "operatingSystemId">): boolean {
  return scenario.id === "distressed-guest" || scenario.operatingSystemId === "safety-guest-welfare-os";
}

const appliesTo = (item: { scenarioIds?: string[] }, scenarioId: string) =>
  !item.scenarioIds || item.scenarioIds.includes(scenarioId);

/**
 * The deployment communications, evidence and outcomes that apply to one scenario.
 * Items without `scenarioIds` apply everywhere. Welfare scenarios only receive
 * restricted (human-authored) communications; restricted communications are never
 * attached to non-welfare scenarios.
 */
export function getScenarioRuntimeRequirements(
  deployment: TravelDeploymentConfig,
  scenario: Pick<TravelScenario, "id" | "operatingSystemId">,
): {
  communications: DeploymentCommunicationConfig[];
  evidence: DeploymentEvidenceConfig[];
  outcomes: DeploymentOutcomeConfig[];
} {
  const welfare = isWelfareScenario(scenario);
  return {
    communications: deployment.communications.filter(c =>
      appliesTo(c, scenario.id) && c.distressedGuestRestricted === welfare),
    evidence: deployment.evidence.filter(e => appliesTo(e, scenario.id)),
    outcomes: deployment.outcomes.filter(o => appliesTo(o, scenario.id)),
  };
}

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
  // Multiple signals can arrive in the same millisecond, including across tabs.
  const id  = `exec-${scenario.id}-${crypto.randomUUID()}`;

  // Runtime evidence, outcomes and communications come from the validated
  // deployment configuration rather than a parallel page-local fixture.
  const requirements = getScenarioRuntimeRequirements(deployment, scenario);
  const evidence: RuntimeEvidence[] = requirements.evidence.map((er, i) => ({
    id: `ev-${id}-${i}`,
    evidenceType: er.evidenceType,
    required: er.required,
    ownerRoleId: er.ownerRoleId,
    completionRule: er.completionRule,
    captured: false,
  }));

  const outcomes: RuntimeOutcome[] = requirements.outcomes.map((o, i) => ({
    id: `out-${id}-${i}`,
    metric: o.metric,
    status: "pending" as OutcomeStatus,
  }));

  const communications: RuntimeCommunication[] = requirements.communications.map((c, i) => ({
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
    approvalRoleId: scenario.governanceConfig.approvalRole ?? configuredScenario.accountableRoleId,
    approvalRequired: scenario.governanceConfig.humanApprovalRequired,
    decisions: [],
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
    isWelfareScenario: isWelfareScenario(scenario),
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

  // Leaving the approval gate towards action requires a recorded approval by the approval role.
  if (exec.state === "approval-required" && to === "in-action" && getGateDecision(exec)?.decision !== "approved") {
    return { allowed: false, reason: `Approval by ${exec.approvalRoleId} has not been recorded. Approve, return with a reason, or escalate.` };
  }

  // Returning a case to decision requires the approver's recorded reason.
  if (exec.state === "approval-required" && to === "decision-required" && getGateDecision(exec)?.decision !== "returned") {
    return { allowed: false, reason: "Returning a decision requires the approver's recorded reason." };
  }

  // An escalation must be acknowledged by its receiving role before the case moves on.
  if (exec.state === "escalated" && exec.escalations.some(e => !e.acknowledged)) {
    return { allowed: false, reason: "Escalation has not been acknowledged by the receiving role." };
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

/** The decision recorded since the case last entered the approval gate, if any. */
export function getGateDecision(exec: ScenarioExecution): RuntimeDecision | undefined {
  const entry = gateEntryCount(exec);
  return [...exec.decisions].reverse().find(d => d.gateEntry === entry);
}

const gateEntryCount = (exec: ScenarioExecution) =>
  exec.stateHistory.filter(h => h.state === "approval-required").length;

function recordDecision(exec: ScenarioExecution, partial: Omit<RuntimeDecision, "gateEntry">): ScenarioExecution {
  const decision: RuntimeDecision = { ...partial, gateEntry: gateEntryCount(exec) };
  if (exec.state !== "approval-required") throw new Error("Decisions are recorded only at the approval gate.");
  if (getGateDecision(exec)) throw new Error("A decision is already recorded for this approval gate.");
  if (decision.roleId !== exec.approvalRoleId) {
    throw new Error(`Only ${exec.approvalRoleId} may decide at this gate; ${decision.roleId} lacks authority.`);
  }
  return { ...exec, decisions: [...exec.decisions, decision], updatedAt: decision.at };
}

/** Approver authorises the recommended action. Records the decision and moves to action. */
export function approveDecision(
  exec: ScenarioExecution,
  roleId: string,
  scenario: TravelScenario,
  note = "Approved at decision gate",
): ScenarioExecution {
  const recorded = recordDecision(exec, { decision: "approved", roleId, at: new Date().toISOString(), reason: note });
  const next = transitionExecution(recorded, "in-action", scenario, `${note} — ${roleId}`);
  if (!next) throw new Error("Engine blocked the approved transition.");
  return next;
}

/** Approver disagrees: the case returns to decision with the reason preserved. */
export function returnDecision(
  exec: ScenarioExecution,
  roleId: string,
  reason: string,
  scenario: TravelScenario,
): ScenarioExecution {
  if (!reason.trim()) throw new Error("A reason is required to return a decision.");
  const recorded = recordDecision(exec, { decision: "returned", roleId, at: new Date().toISOString(), reason });
  const next = transitionExecution(recorded, "decision-required", scenario, `Returned by ${roleId}: ${reason}`);
  if (!next) throw new Error("Engine blocked the return transition.");
  return next;
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
  if (comm.approvalRequired && approvedBy !== exec.approvalRoleId) {
    throw new Error(`Communication '${commId}' must be approved by ${exec.approvalRoleId}; ${approvedBy} lacks authority.`);
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

/**
 * Generate learning output from execution trace. Rules-based patterns.
 * Every statement is derived from what this execution actually recorded; nothing
 * is described as sent, delivered, measured or approved unless the trace says so.
 */
export function generateLearning(
  exec: ScenarioExecution,
  scenario: TravelScenario,
  playbook: TravelPlaybook,
): RuntimeLearning {
  const now = new Date().toISOString();
  const patterns: string[] = [];
  const improvements: string[] = [];

  const required        = exec.evidence.filter(ev => ev.required);
  const capturedReq     = required.filter(ev => ev.captured).length;
  const measured        = exec.outcomes.filter(o => o.status === "met" || o.status === "not-met" || o.status === "partially-met");
  const metOutcomes     = measured.filter(o => o.status === "met").length;
  const notMet          = measured.filter(o => o.status !== "met").length;
  const hasEscalation   = exec.escalations.length > 0;
  const reviewedDrafts  = exec.communications.filter(c => c.sent).length;
  const approvals       = exec.decisions.filter(d => d.decision === "approved");
  const returns         = exec.decisions.filter(d => d.decision === "returned");

  const evidenceQuality: RuntimeLearning["evidenceQuality"] =
    capturedReq >= required.length ? "complete" :
    capturedReq > 0 ? "partial" : "incomplete";

  // Pattern to watch, from the scenario's learning configuration
  patterns.push(`Pattern to watch: ${scenario.learningConfig.patternToDetect}`);

  // Authority trail
  if (exec.approvalRequired) {
    if (approvals.length) {
      patterns.push(`Decision approved by ${roleLabel(approvals.at(-1)!.roleId)}${returns.length ? ` after ${returns.length} return(s) for reconsideration` : ""}.`);
    } else {
      patterns.push(`No approval by ${roleLabel(exec.approvalRoleId)} was recorded — the case moved on through escalation.`);
    }
  } else {
    patterns.push(`Acted within delegated authority of ${roleLabel(exec.accountableRoleId)}; no approval gate is configured for this scenario.`);
  }
  for (const r of returns) patterns.push(`Approver disagreed: "${r.reason}".`);

  // Escalation behaviour
  if (hasEscalation) {
    const acknowledged = exec.escalations.filter(e => e.acknowledged).length;
    patterns.push(`${exec.escalations.length} escalation(s) recorded; ${acknowledged} acknowledged by the receiving role.`);
  } else {
    patterns.push("No escalation recorded — resolved within the standard governance pathway.");
  }

  // Communications — drafts only, nothing is sent from this simulation
  if (exec.communications.length > 0) {
    patterns.push(`${reviewedDrafts} of ${exec.communications.length} communication drafts were reviewed. None were sent: this is a local simulation.`);
  }

  // Outcome quality
  if (measured.length > 0) {
    patterns.push(`${metOutcomes} of ${measured.length} recorded outcome metrics were Met (values entered in this simulation, not measured from live systems).`);
  } else {
    patterns.push("No outcome was recorded as met or not met — this cycle produces process evidence only, not outcome evidence.");
  }

  // Improvements
  improvements.push(scenario.learningConfig.improvementAction);
  if (evidenceQuality !== "complete") {
    improvements.push("Review evidence capture process — not all required evidence items were recorded.");
  }
  if (hasEscalation) {
    improvements.push("Review playbook trigger thresholds to determine whether escalation could be pre-empted.");
  }
  if (returns.length) {
    improvements.push("Review the recommended decision with the approver — it was returned at the approval gate.");
  }
  if (notMet > 0) {
    improvements.push(`Investigate ${notMet} outcome metric(s) not fully met before the next cycle.`);
  }

  if (exec.isWelfareScenario) {
    patterns.push(approvals.length
      ? "Welfare scenario: action followed a recorded human approval; closure required human evidence."
      : "Welfare scenario: no approval was recorded before closure — review against the welfare governance rule.");
    improvements.push("Confirm post-incident review is scheduled within 24 hours per governance requirement.");
  }

  void playbook; // used for context in more complex implementations

  // The most material finding drives the proposed next action.
  const priority =
    notMet > 0 ? `Investigate why ${notMet} outcome metric(s) were not met, then decide whether to amend the playbook.` :
    returns.length ? `Agree the recommended decision with ${roleLabel(exec.approvalRoleId)} — it was returned: "${returns.at(-1)!.reason}".` :
    evidenceQuality !== "complete" ? "Close the evidence-capture gap before the next cycle." :
    hasEscalation ? "Review whether the escalation threshold could be pre-empted." :
    scenario.learningConfig.improvementAction;
  const nextAction = `Proposed for review by ${roleLabel(exec.accountableRoleId)}: ${priority}`;

  return {
    patterns,
    improvements,
    evidenceQuality,
    reviewTrigger: scenario.learningConfig.reviewTrigger,
    nextAction,
    outcomeEvidence: measured.length > 0 ? "measured" : "not-measured",
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

export interface RuntimeAction {
  id: string;
  label: string;
  toState?: ScenarioExecutionState;
  description: string;
  /** Gate actions must go through the decision function, which records who decided. */
  via?: "approveDecision" | "returnDecision";
}

/** Return available next actions for the current state. */
export function getAvailableActions(
  exec: ScenarioExecution,
  scenario: TravelScenario,
): RuntimeAction[] {
  const actions: RuntimeAction[] = [];

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
      actions.push({ id: "approve", label: `Approve as ${exec.approvalRoleId}`, toState: "in-action", via: "approveDecision", description: `Records ${exec.approvalRoleId}'s approval, then assigns the owner and acts.` });
      actions.push({ id: "return", label: "Disagree — return with reason", toState: "decision-required", via: "returnDecision", description: "Approver rejects the recommendation; the case returns to decision with the reason kept." });
      actions.push({ id: "escalate", label: "No decision in time — escalate", toState: "escalated", description: "Approval deadline missed; escalation goes to the next authority and must be acknowledged." });
      break;

    case "in-action":
      actions.push({ id: "resolve", label: "Resolve Scenario", toState: "resolved", description: "All required actions complete. Proceed to evidence and closure." });
      actions.push({ id: "escalate", label: "Trigger Escalation", toState: "escalated", description: "Escalation threshold exceeded — route to higher authority." });
      break;

    case "escalated":
      actions.push({ id: "return-action", label: "Return to Action", toState: "in-action", description: "Escalation acknowledged. Resume action pathway." });
      // Both moves below are blocked by canTransition until the escalation is acknowledged.
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
