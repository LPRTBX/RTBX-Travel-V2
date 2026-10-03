import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHotelSignals, createHotelDeployment } from './mockHotel';
import { simulateHotelCase, proposeHotelLearning, reviewHotelLearning, replayHotelLearning,
  createHotelCase, prepareHotelDecision, approveHotelDecision, dispatchHotelAction, mockHotelFollowUp,
  verifyHotelOutcome, reconcileHotelFollowUp, reopenHotelCase, HOTEL_FAULTS } from './hotelLearning';

const results: Array<{ name: string; status: string; error?: string }> = [];
const comparisons: Array<Record<string, unknown>> = [];
function check(name: string, test: () => void) {
  it(name, () => {
    try { test(); results.push({ name, status: 'passed' }); }
    catch (error) { results.push({ name, status: 'failed', error: String(error) }); throw error; }
  });
}
afterAll(() => {
  const report = { schemaVersion: 'jaldo.hotel-learning-challenges.v1', evidenceLevel: 'synthetic-adversarial',
    commit: process.env.GITHUB_SHA ?? null, generatedAt: new Date().toISOString(),
    summary: { passed: results.filter(r => r.status === 'passed').length, failed: results.filter(r => r.status === 'failed').length },
    results, comparisons,
    limits: ['Scripted review and mock capability constraints; no autonomous policy discovery.',
      'Property variants reuse one synthetic hotel identity; they do not prove tenant isolation.',
      'Challenge executions are separate from repeated baseline and replay totals.'] };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/hotel-learning-challenges.json', JSON.stringify(report, null, 2) + '\n');
  writeFileSync('simulation-results/hotel-learning-challenges-summary.md', [
    '# Learning challenge checks', '', `Passed: ${report.summary.passed}; failed: ${report.summary.failed}.`,
    'Expected unsuccessful improvements pass when the outcome verifier correctly preserves failure or pending status.',
    ...results.map(r => `- ${r.name}: ${r.status}`), '', ...report.limits.map(l => `- ${l}`), '',
  ].join('\n'));
});

describe('Learning under changed conditions', () => {
  const signal = createHotelSignals()[4];
  for (const fault of ['late-response', 'ineffective-action', 'missing-receipt'] as const) {
    check(`An approved ${fault} correction can still fail with insufficient capability`, () => {
      const baseline = simulateHotelCase(signal, fault);
      const proposal = reviewHotelLearning(proposeHotelLearning(baseline)!, 'approved', 'synthetic-duty-manager');
      const conditions = fault === 'late-response' ? { minimumResponseMinutes: 35 }
        : fault === 'ineffective-action' ? { requiredInterventionAttempts: 3 } : { requiredReceiptAttempts: 3 };
      const challenged = simulateHotelCase(signal, fault, proposal.candidate, baseline.deployment, conditions);
      expect(challenged.outcome).toBe(fault === 'missing-receipt' ? 'pending' : 'not-met');
      expect(baseline.policy.version).toBe(proposal.baselineVersion);
      comparisons.push({ fault, baselineOutcome: baseline.outcome, reviewedProposal: proposal,
        challengedOutcome: challenged.outcome, reasons: challenged.reasons, conditions });
    });
  }
  check('An approved harmful change regresses a previously successful scenario and remains measurable', () => {
    const baseline = simulateHotelCase(signal, 'late-response', { version: 'fast-baseline', responseMinutes: 15, interventionAttempts: 1, receiptAttempts: 1 });
    expect(baseline.outcome).toBe('met');
    const badBaseline = simulateHotelCase(signal, 'ineffective-action');
    const proposed = proposeHotelLearning(badBaseline)!;
    proposed.candidate.responseMinutes = 45;
    const reviewed = reviewHotelLearning(proposed, 'approved', 'synthetic-duty-manager');
    const challenged = simulateHotelCase(signal, 'late-response', reviewed.candidate);
    expect(challenged.outcome).toBe('not-met');
    comparisons.push({ kind: 'harmful-candidate', baseline: baseline.outcome, candidate: challenged.outcome,
      promotionPermitted: false, reason: 'Regression detected; candidates never promote in this simulator.' });
  });
  check('A candidate changed after review cannot replay', () => {
    const baseline = simulateHotelCase(signal, 'late-response');
    const reviewed = reviewHotelLearning(proposeHotelLearning(baseline)!, 'approved', 'synthetic-duty-manager');
    expect(() => replayHotelLearning(baseline, { ...reviewed, candidate: { ...reviewed.candidate, responseMinutes: 1 } }, 'late-response')).toThrow(/Approved/);
    expect(() => replayHotelLearning(baseline, { ...reviewed, reviewedAt: undefined }, 'late-response')).toThrow(/Approved/);
  });
  check('Rejected and unauthorised review remain blocked with decision evidence retained', () => {
    const baseline = simulateHotelCase(signal, 'late-response');
    const proposal = proposeHotelLearning(baseline)!;
    expect(() => reviewHotelLearning(proposal, 'approved', 'synthetic-housekeeping')).toThrow();
    const rejected = reviewHotelLearning(proposal, 'rejected', 'synthetic-duty-manager');
    expect(rejected.reviewedAt).toBeTruthy();
    expect(rejected.reviewedCandidate).toEqual(proposal.candidate);
    expect(() => replayHotelLearning(baseline, rejected, 'late-response')).toThrow();
    expect(proposal.decision).toBe('pending');
  });
  check('Conflicting follow-up evidence cannot make delivery equal restoration', () => {
    let c = prepareHotelDecision(createHotelCase(signal));
    c = dispatchHotelAction(approveHotelDecision(c, c.execution.accountableRoleId));
    const failed = verifyHotelOutcome(c, { ...mockHotelFollowUp(c, 'none'), restored: false });
    expect(failed.observation?.receipt).toBe(true);
    expect(failed.outcome).toBe('not-met');
    expect(failed.execution.state).toBe('in-action');
    expect(() => verifyHotelOutcome(c, { ...mockHotelFollowUp(c, 'none'), eventId: 'other-department-case' })).toThrow();
  });
  check('A conflicting department cannot approve the accountable action', () => {
    const c = prepareHotelDecision(createHotelCase(signal));
    expect(() => approveHotelDecision(c, 'synthetic-maintenance')).toThrow();
    expect(c.approved).toBe(false);
    expect(c.execution.communications.every(comm => !comm.sent)).toBe(true);
  });
  check('Late measurements resolve the same pending case while preserving its prior evidence', () => {
    const pending = simulateHotelCase(signal, 'missing-measurement');
    const original = JSON.stringify(pending);
    expect(proposeHotelLearning(pending)).toBeNull();
    const resolved = reconcileHotelFollowUp(pending, { ...pending.observation!, measured: true });
    expect(resolved.outcome).toBe('met');
    expect(resolved.execution.id).toBe(pending.execution.id);
    expect(resolved.audit.some(a => a.step === 'prior-observation-retained' && a.detail.includes('"measured":false'))).toBe(true);
    expect(JSON.stringify(pending)).toBe(original);
    expect(() => reconcileHotelFollowUp(pending, { ...pending.observation!, actionId: 'wrong', measured: true })).toThrow();
  });
  check('A renewed complaint reopens through a fresh decision and approval gate', () => {
    const closed = simulateHotelCase(signal, 'none');
    const original = JSON.stringify(closed);
    const reopened = prepareHotelDecision(reopenHotelCase(closed, { ...signal, eventId: signal.eventId + '-reopened' }));
    expect(reopened.execution.id).not.toBe(closed.execution.id);
    expect(reopened.execution.state).toBe('approval-required');
    expect(reopened.audit.find(a => a.step === 'reopened-from')?.detail).toBe(closed.execution.id);
    expect(() => dispatchHotelAction(reopened)).toThrow();
    expect(JSON.stringify(closed)).toBe(original);
  });
  for (const variant of ['boutique', 'regional'] as const) {
    check(`Reviewed corrections retain normal outcomes and evidence gates across new signals in ${variant} configuration`, () => {
      const deployment = createHotelDeployment();
      deployment.deploymentName = `Synthetic ${variant} property`;
      deployment.propertyType = variant === 'boutique' ? 'Boutique hotel' : 'Regional resort';
      deployment.region = variant === 'boutique' ? 'SEAPAC' : 'Middle East';
      deployment.timezone = variant === 'boutique' ? 'Asia/Bangkok' : 'Asia/Dubai';
      const baseline = simulateHotelCase(signal, 'late-response', undefined, deployment);
      const reviewed = reviewHotelLearning(proposeHotelLearning(baseline)!, 'approved', 'synthetic-duty-manager');
      for (const newSignal of createHotelSignals(2)) {
        for (const fault of HOTEL_FAULTS) {
          const outcome = simulateHotelCase(newSignal, fault, reviewed.candidate, deployment);
          expect(outcome.outcome).toBe(fault === 'none' || fault === 'late-response' ? 'met'
            : fault === 'ineffective-action' ? 'not-met' : 'pending');
          expect(outcome.deployment.region).toBe(deployment.region);
          if (outcome.outcome === 'pending') expect(outcome.execution.closedAt).toBeUndefined();
        }
      }
      comparisons.push({ variant, newSignals: 100, faultProfiles: 5, executions: 500, regressions: 0 });
    });
  }
});
