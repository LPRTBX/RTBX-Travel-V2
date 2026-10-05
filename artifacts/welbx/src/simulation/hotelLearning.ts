/** Closed-loop synthetic hotel driver. No live dispatch or production configuration writes. */
import type { TravelDeploymentConfig } from '../data/travelDeploymentConfig';
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';
import { transitionExecution, sendCommunication, captureEvidence, recordOutcome,
  triggerEscalation, acknowledgeEscalation, type ScenarioExecution } from '../lib/runtimeEngine';
import { createHotelSession, ingestHotelSignal, type HotelSignal } from './mockHotel';

export type Fault = 'none' | 'late-response' | 'ineffective-action' | 'missing-receipt' | 'missing-measurement';
export interface LearningPolicy { version: string; responseMinutes: number; interventionAttempts: number; receiptAttempts: number }
export const BASELINE_POLICY: LearningPolicy = { version: 'hotel-loop-v1', responseMinutes: 30, interventionAttempts: 1, receiptAttempts: 1 };
export interface Observation {
  eventId: string; executionId: string; policyVersion: string; actionId: string;
  receipt: boolean; measured: boolean; elapsedMinutes: number; restored: boolean;
  evidenceSource: 'synthetic-follow-up';
}
export interface HotelCase {
  signal: HotelSignal; deployment: TravelDeploymentConfig; execution: ScenarioExecution; policy: LearningPolicy;
  actionId: string; approved: boolean; observation?: Observation;
  outcome: 'pending' | 'met' | 'not-met'; reasons: string[];
  audit: Array<{ step: string; detail: string }>;
}
export interface Proposal {
  id: string; eventId: string; baselineVersion: string; sourceExecutionId: string;
  reasons: string[]; candidate: LearningPolicy;
  decision: 'pending' | 'approved' | 'rejected'; reviewer?: string; reviewedAt?: string;
  reviewedCandidate?: LearningPolicy; reviewId?: string;
}
const TARGET_MINUTES = 20;
export function createHotelCase(signal: HotelSignal, policy = BASELINE_POLICY, deployment?: TravelDeploymentConfig): HotelCase {
  if (!policy.version.trim() || !Number.isFinite(policy.responseMinutes) || policy.responseMinutes < 0
    || !Number.isSafeInteger(policy.interventionAttempts) || policy.interventionAttempts < 1
    || !Number.isSafeInteger(policy.receiptAttempts) || policy.receiptAttempts < 1) throw new Error('Invalid learning policy');
  const session = createHotelSession();
  if (deployment) session.deployment = structuredClone(deployment);
  const intake = ingestHotelSignal(session, signal);
  if (!intake.reads.length) throw new Error('Signal rejected by hotel intake');
  const execution = intake.reads[0].run.execution;
  return { signal: structuredClone(signal), deployment: structuredClone(session.deployment), execution, policy: { ...policy }, actionId: `${execution.id}:action`,
    approved: false, outcome: 'pending', reasons: [], audit: [{ step: 'signal-received', detail: signal.eventId }] };
}
function move(c: HotelCase, state: ScenarioExecution['state']): HotelCase {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === c.execution.scenarioId)!;
  const execution = transitionExecution(c.execution, state, scenario, 'Synthetic closed-loop test');
  if (!execution) throw new Error(`Blocked lifecycle transition: ${state}`);
  return { ...c, execution, audit: [...c.audit, { step: state, detail: execution.accountableRoleId }] };
}
export function prepareHotelDecision(c: HotelCase): HotelCase {
  return move(move(move(c, 'understanding'), 'decision-required'), 'approval-required');
}
export function approveHotelDecision(c: HotelCase, role: string): HotelCase {
  if (c.execution.state !== 'approval-required' || role !== c.execution.accountableRoleId) throw new Error('Accountable scripted role must approve at decision gate');
  return { ...c, approved: true, audit: [...c.audit, { step: 'approval', detail: `Synthetic actor: ${role}` }] };
}
export function dispatchHotelAction(c: HotelCase): HotelCase {
  if (!c.approved || c.execution.state !== 'approval-required') throw new Error('Action requires approval and cannot be redispatched');
  let next = move(c, 'in-action');
  for (const comm of next.execution.communications) next = { ...next,
    execution: sendCommunication(next.execution, comm.id, next.execution.accountableRoleId) };
  return { ...next, audit: [...next.audit, { step: 'mock-dispatch', detail: c.actionId }] };
}
export interface FollowUpConditions {
  minimumResponseMinutes?: number; requiredInterventionAttempts?: number; requiredReceiptAttempts?: number;
}
export function mockHotelFollowUp(c: HotelCase, fault: Fault, conditions: FollowUpConditions = {}): Observation {
  if (c.execution.state !== 'in-action') throw new Error('Follow-up requires a dispatched action');
  if (conditions.minimumResponseMinutes !== undefined && (!Number.isFinite(conditions.minimumResponseMinutes) || conditions.minimumResponseMinutes < 0)
    || [conditions.requiredInterventionAttempts, conditions.requiredReceiptAttempts].some(v => v !== undefined && (!Number.isSafeInteger(v) || v < 1))) throw new Error('Invalid mock follow-up conditions');
  return { eventId: c.signal.eventId, executionId: c.execution.id, policyVersion: c.policy.version, actionId: c.actionId,
    receipt: fault !== 'missing-receipt' || c.policy.receiptAttempts >= (conditions.requiredReceiptAttempts ?? 2),
    measured: fault !== 'missing-measurement',
    elapsedMinutes: Math.max(fault === 'late-response' ? c.policy.responseMinutes : 10, conditions.minimumResponseMinutes ?? 0),
    restored: fault !== 'ineffective-action' || c.policy.interventionAttempts >= (conditions.requiredInterventionAttempts ?? 2),
    evidenceSource: 'synthetic-follow-up' };
}
export function verifyHotelOutcome(c: HotelCase, observation: Observation): HotelCase {
  if (c.execution.state !== 'in-action' || c.observation) throw new Error('Outcome requires a fresh dispatched case');
  if (observation.eventId !== c.signal.eventId || observation.executionId !== c.execution.id
    || observation.policyVersion !== c.policy.version || observation.actionId !== c.actionId
    || observation.evidenceSource !== 'synthetic-follow-up'
    || typeof observation.receipt !== 'boolean' || typeof observation.measured !== 'boolean'
    || typeof observation.restored !== 'boolean' || !Number.isFinite(observation.elapsedMinutes)
    || observation.elapsedMinutes < 0) throw new Error('Uncorrelated or invalid observation');
  const reasons = [!observation.receipt ? 'missing-receipt' : '', !observation.measured ? 'missing-measurement' : '',
    observation.measured && observation.elapsedMinutes > TARGET_MINUTES ? 'late-response' : '',
    observation.measured && !observation.restored ? 'ineffective-action' : ''].filter(Boolean);
  const outcome = !observation.receipt || !observation.measured ? 'pending' : reasons.length ? 'not-met' : 'met';
  let next: HotelCase = { ...c, observation: { ...observation }, outcome, reasons,
    audit: [...c.audit, { step: 'outcome-verification', detail: `${outcome}: ${reasons.join(', ') || 'receipt + restored + within 20 min'}` }] };
  // Missing data or ineffective action returns to the responsible team, with a visible escalation.
  if (outcome !== 'met') {
    next = { ...next, execution: triggerEscalation(next.execution, reasons.join(', '), next.execution.accountableRoleId) };
    next = move(next, 'escalated');
    next = { ...next, execution: acknowledgeEscalation(next.execution, next.execution.escalations.at(-1)!.id) };
    next = move(next, 'in-action');
  }
  // Keep operational closure open while restoration/delivery/measurement is unconfirmed.
  if (outcome === 'pending' || !observation.restored) return next;
  for (const evidence of next.execution.evidence.filter(e => e.required)) next = { ...next,
    execution: captureEvidence(next.execution, evidence.id, { capturedByRole: evidence.ownerRoleId,
      note: `Synthetic correlated observation: ${c.actionId}` }) };
  // Only the explicitly measured fixture metric receives a result. Other deployment metrics remain unmeasured.
  for (const o of next.execution.outcomes) next = { ...next,
    execution: recordOutcome(next.execution, o.id, 'not-measured', 'Outside this synthetic follow-up metric') };
  next = { ...next, execution: { ...next.execution, outcomes: [...next.execution.outcomes, {
    id: `${c.actionId}:verified-outcome`, metric: 'Synthetic restoration confirmed with receipt within 20 minutes',
    status: outcome, note: JSON.stringify(observation), recordedAt: new Date().toISOString(),
  }] } };
  next = move(next, 'resolved');
  return move(next, 'closed');
}
export function proposeHotelLearning(c: HotelCase): Proposal | null {
  if (!c.observation) throw new Error('Learning requires outcome observation');
  if (!c.reasons.length || c.reasons.includes('missing-measurement')) return null;
  const candidate = { ...c.policy, version: `${c.policy.version}-candidate` };
  if (c.reasons.includes('late-response')) candidate.responseMinutes = 15;
  if (c.reasons.includes('ineffective-action')) candidate.interventionAttempts = 2;
  if (c.reasons.includes('missing-receipt')) candidate.receiptAttempts = 2;
  return { id: `${c.execution.id}:learning`, eventId: c.signal.eventId, sourceExecutionId: c.execution.id, baselineVersion: c.policy.version,
    reasons: [...c.reasons], candidate, decision: 'pending' };
}
export function reviewHotelLearning(p: Proposal, decision: 'approved' | 'rejected', reviewer: string): Proposal {
  if (!['approved', 'rejected'].includes(decision) || p.decision !== 'pending' || reviewer !== 'synthetic-duty-manager') throw new Error('Learning requires designated scripted reviewer');
  return { ...p, candidate: { ...p.candidate }, decision, reviewer, reviewedAt: new Date().toISOString(),
    reviewedCandidate: { ...p.candidate }, reviewId: `${p.id}:review` };
}
export function replayHotelLearning(c: HotelCase, p: Proposal, fault: Fault, conditions?: FollowUpConditions): HotelCase {
  if (p.decision !== 'approved' || p.reviewer !== 'synthetic-duty-manager' || p.eventId !== c.signal.eventId
    || p.sourceExecutionId !== c.execution.id || p.baselineVersion !== c.policy.version
    || p.id !== `${c.execution.id}:learning` || p.reviewId !== `${p.id}:review`
    || !p.reviewedAt || !Number.isFinite(Date.parse(p.reviewedAt))
    || JSON.stringify(p.reviewedCandidate) !== JSON.stringify(p.candidate)) throw new Error('Approved correlated proposal required');
  const replay = simulateHotelCase(c.signal, fault, p.candidate, c.deployment, conditions);
  return { ...replay, audit: [...replay.audit, { step: 'reviewed-learning-replay',
    detail: JSON.stringify({ proposalId: p.id, reviewId: p.reviewId, reviewer: p.reviewer, reviewedAt: p.reviewedAt,
      sourceExecutionId: c.execution.id, replayExecutionId: replay.execution.id, candidate: p.reviewedCandidate }) }] };
}
export function simulateHotelCase(signal: HotelSignal, fault: Fault, policy = BASELINE_POLICY, deployment?: TravelDeploymentConfig, conditions?: FollowUpConditions): HotelCase {
  let c = prepareHotelDecision(createHotelCase(signal, policy, deployment));
  c = dispatchHotelAction(approveHotelDecision(c, c.execution.accountableRoleId));
  return verifyHotelOutcome(c, mockHotelFollowUp(c, fault, conditions));
}
export const HOTEL_FAULTS: Fault[] = ['none', 'late-response', 'ineffective-action', 'missing-receipt', 'missing-measurement'];
export function hotelFaultForSignal(index: number): Fault { return HOTEL_FAULTS[Math.floor(index / 4) % 5]; }

/** Later correlated evidence can resolve a pending case; its earlier result is retained in the audit. */
export function reconcileHotelFollowUp(c: HotelCase, observation: Observation): HotelCase {
  if (c.outcome !== 'pending' || !c.observation || c.execution.state !== 'in-action') throw new Error('Only a pending case accepts later evidence');
  const fresh = { ...c, observation: undefined, audit: [...c.audit, {
    step: 'prior-observation-retained', detail: JSON.stringify(c.observation),
  }] };
  return verifyHotelOutcome(fresh, observation);
}
/** A renewed signal creates a fresh governed execution; closed evidence remains intact. */
export function reopenHotelCase(c: HotelCase, signal: HotelSignal): HotelCase {
  if (c.execution.state !== 'closed' || signal.eventId === c.signal.eventId
    || signal.hotelId !== c.signal.hotelId || signal.guestId !== c.signal.guestId || signal.room !== c.signal.room) throw new Error('A new correlated signal is required to reopen');
  const reopened = createHotelCase(signal, c.policy, c.deployment);
  return { ...reopened, audit: [...reopened.audit, { step: 'reopened-from', detail: c.execution.id }] };
}
