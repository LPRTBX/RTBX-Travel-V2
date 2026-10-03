import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_DEPLOYMENT } from '../data/travelDeploymentConfig';
import { createHotelSignals, HOTEL_PATHS } from './mockHotel';
import { BASELINE_POLICY, createHotelCase, prepareHotelDecision, approveHotelDecision, dispatchHotelAction,
  mockHotelFollowUp, verifyHotelOutcome, simulateHotelCase, proposeHotelLearning,
  reviewHotelLearning, replayHotelLearning, hotelFaultForSignal, type HotelCase, type Proposal } from './hotelLearning';

const signals = createHotelSignals();
const repetitions = Number(process.env.SIMULATION_REPETITIONS ?? '10');
if (![1, 10, 100, 1000].includes(repetitions)) throw new Error('Invalid SIMULATION_REPETITIONS');
const results: Array<{ name: string; status: string; error?: string }> = [];
const traces: Array<Record<string, unknown>> = [];
let executed = 0;
let improved = 0;
const outcomeTotals = { met: 0, 'not-met': 0, pending: 0 };
const replayTotals = { met: 0, 'not-met': 0, pending: 0 };
const startedAt = new Date().toISOString();
function check(name: string, run: () => void) {
  it(name, () => {
    try { run(); results.push({ name, status: 'passed' }); }
    catch (e) { results.push({ name, status: 'failed', error: String(e) }); throw e; }
  });
}
afterAll(() => {
  const report = { schemaVersion: 'jaldo.hotel-learning.v2', evidenceLevel: 'synthetic-closed-loop',
    startedAt, finishedAt: new Date().toISOString(), commit: process.env.GITHUB_SHA ?? null,
    repetitions, uniqueSignals: signals.length, baselineExecutions: executed, improvedReplays: improved,
    actualBaselineOutcomes: outcomeTotals, actualReplayOutcomes: replayTotals,
    summary: { passed: results.filter(r => r.status === 'passed').length, failed: results.filter(r => r.status === 'failed').length },
    metric: 'Synthetic restoration confirmed with correlated delivery receipt within 20 minutes',
    expectedPerBatch: { met: 20, notMet: 40, pending: 40, approvedImprovements: 60, missingMeasurementHolds: 20 },
    paths: HOTEL_PATHS.map(path => ({ path, traces: traces.filter(t => t.path === path).length })),
    limits: ['Scripted approvals and reviewer identity, not real authorisation.',
      'Synthetic elapsed time, restoration and delivery receipts, not hotel outcomes.',
      'Candidates change only isolated mock policies; no live configuration promotion.',
      'The original intake/gate suite remains independent; replay adds extra executions.'], results, traces };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/hotel-learning.json', JSON.stringify(report, null, 2) + '\n');
  writeFileSync('simulation-results/hotel-learning-summary.md', ['# Hotel outcome and learning loop', '',
    `Passed: ${report.summary.passed}; failed: ${report.summary.failed}. Baseline executions: ${executed}; improved replays: ${improved}.`,
    'Evidence: synthetic closed-loop. One correlated metric; other deployment metrics remain unmeasured.', '',
    '| Per 100-signal batch | Baseline | Approved replay executions |', '|---|---:|---:|',
    '| Outcome met | 20 | 60 |', '| Outcome not met | 40 | 0 |', '| Pending: missing receipt / measurement | 40 | 0 |',
    '| Approved improvement replays | — | 60 |', '',
    'Replays cover only 60 proposed changes; 20 originally successful cases and 20 missing-measurement cases are not replayed. Expected fixture results above are not operational KPIs. Use actual execution and check totals to establish whether the batch passed.', '',
    ...report.limits.map(l => `- ${l}`), ''].join('\n'));
});

describe('Hotel decisions → verified outcomes → reviewed learning → replay', () => {
  for (const [index, signal] of signals.entries()) {
    const fault = hotelFaultForSignal(index);
    check(`${signal.path} / ${signal.kind} / ${fault}`, () => {
      for (let n = 0; n < repetitions; n++) {
        const c = simulateHotelCase(signal, fault);
        executed++;
        outcomeTotals[c.outcome]++;
        const expected = fault === 'none' ? 'met' : fault === 'missing-receipt' || fault === 'missing-measurement' ? 'pending' : 'not-met';
        expect(c.outcome).toBe(expected);
        expect(c.execution.state).toBe(fault === 'none' || fault === 'late-response' ? 'closed' : 'in-action');
        expect(c.audit.map(a => a.step).slice(0, 7)).toEqual(['signal-received', 'understanding', 'decision-required',
          'approval-required', 'approval', 'in-action', 'mock-dispatch']);
        expect(c.observation?.eventId).toBe(signal.eventId);
        expect(c.execution.communications.every(comm => comm.sent)).toBe(true);
        expect(c.execution.escalations.length).toBe(fault === 'none' ? 0 : 1);
        if (c.execution.state !== 'closed') {
          expect(c.execution.closedAt).toBeUndefined();
          expect(c.execution.evidence.some(e => e.required && !e.captured)).toBe(true);
        }
        const proposal = proposeHotelLearning(c);
        let replay: HotelCase | undefined;
        let reviewedProposal: Proposal | undefined;
        if (fault === 'none' || fault === 'missing-measurement') expect(proposal).toBeNull();
        else {
          expect(proposal?.decision).toBe('pending');
          expect(() => replayHotelLearning(c, proposal!, fault)).toThrow(/Approved/);
          const reviewed = reviewHotelLearning(proposal!, 'approved', 'synthetic-duty-manager');
          reviewedProposal = reviewed;
          replay = replayHotelLearning(c, reviewed, fault);
          improved++;
          replayTotals[replay.outcome]++;
          expect(replay.outcome).toBe('met');
          expect(replay.execution.state).toBe('closed');
          expect(replay.execution.id).not.toBe(c.execution.id);
          expect(reviewed.reviewedAt).toBeTruthy();
          expect(reviewed.reviewedCandidate).toEqual(replay.policy);
          expect(replay.audit.at(-1)?.detail).toContain(reviewed.reviewId);
          expect(reviewedProposal?.decision).toBe('approved');
          expect(c.outcome).toBe(expected);
          expect(c.policy).toEqual(BASELINE_POLICY);
          expect(replay.execution.outcomes.filter(o => o.status === 'met')).toHaveLength(1);
        }
        if (n === repetitions - 1) traces.push({ eventId: signal.eventId, path: signal.path, fault,
          baseline: c, proposed: proposal, proposal: reviewedProposal ?? proposal, replay });
      }
    });
  }
  check('Action gates reject absent/wrong approval and repeated dispatch', () => {
    const c = prepareHotelDecision(createHotelCase(signals[0]));
    expect(() => dispatchHotelAction(c)).toThrow(/approval/);
    expect(() => approveHotelDecision(c, 'unrelated-role')).toThrow(/Accountable/);
    const dispatched = dispatchHotelAction(approveHotelDecision(c, c.execution.accountableRoleId));
    expect(() => dispatchHotelAction(dispatched)).toThrow(/redispatched/);
  });
  check('Cross-event, stale-policy, wrong-action and invalid observations cannot close a case', () => {
    const c = prepareHotelDecision(createHotelCase(signals[0]));
    const dispatched = dispatchHotelAction(approveHotelDecision(c, c.execution.accountableRoleId));
    const observation = mockHotelFollowUp(dispatched, 'none');
    for (const patch of [{ eventId: 'other-event' }, { executionId: 'other-execution' },
      { policyVersion: 'stale' }, { actionId: 'other-action' }, { elapsedMinutes: NaN },
      { elapsedMinutes: -1 }, { measured: 'yes' }]) {
      expect(() => verifyHotelOutcome(dispatched, { ...observation, ...patch } as typeof observation)).toThrow(/invalid observation/);
    }
    expect(dispatched.observation).toBeUndefined();
    const verified = verifyHotelOutcome(dispatched, observation);
    expect(() => verifyHotelOutcome(verified, observation)).toThrow(/fresh/);
  });
  check('Rejected, unrelated and wrong-reviewer learning never activates', () => {
    const c = simulateHotelCase(signals[4], 'late-response');
    const p = proposeHotelLearning(c)!;
    expect(() => reviewHotelLearning(p, 'approved', 'unrelated-role')).toThrow(/reviewer/);
    const rejected = reviewHotelLearning(p, 'rejected', 'synthetic-duty-manager');
    expect(() => replayHotelLearning(c, rejected, 'late-response')).toThrow(/Approved/);
    const approved = reviewHotelLearning(p, 'approved', 'synthetic-duty-manager');
    expect(() => reviewHotelLearning(approved, 'approved', 'synthetic-duty-manager')).toThrow(/reviewer/);
    expect(() => replayHotelLearning(c, { ...approved, eventId: 'other-event' }, 'late-response')).toThrow(/correlated/);
  });
  check('Candidate improvements preserve every other fault and original deployment', () => {
    const deploymentBefore = JSON.stringify(DEFAULT_DEPLOYMENT);
    const policyBefore = JSON.stringify(BASELINE_POLICY);
    const c = simulateHotelCase(signals[4], 'late-response');
    const candidate = proposeHotelLearning(c)!.candidate;
    const outcomes = signals.map((s, i) => simulateHotelCase(s, hotelFaultForSignal(i), candidate).outcome);
    expect(outcomes.filter(o => o === 'met')).toHaveLength(40);
    expect(outcomes.filter(o => o === 'not-met')).toHaveLength(20);
    expect(outcomes.filter(o => o === 'pending')).toHaveLength(40);
    expect(JSON.stringify(DEFAULT_DEPLOYMENT)).toBe(deploymentBefore);
    expect(JSON.stringify(BASELINE_POLICY)).toBe(policyBefore);
  });
});
