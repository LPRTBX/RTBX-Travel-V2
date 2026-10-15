import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  PRESSURE_ENVIRONMENTS,
  runTravelPressureEstate,
  summarisePressureEstate,
  type PressurePathwayResult,
} from './travelPressureEstate';

const startedAt = new Date().toISOString();
const results: PressurePathwayResult[] = runTravelPressureEstate();
const environments = summarisePressureEstate(results);

afterAll(() => {
  const aggregate = {
    schemaVersion: 'jaldo.travel-pressure-estate.v1',
    evidenceLevel: 'synthetic-canonical-pressure-test',
    startedAt,
    finishedAt: new Date().toISOString(),
    gitSha: process.env.GITHUB_SHA ?? null,
    environments: environments.length,
    pathways: results.length,
    canonicalExecutions: results.length,
    authorityChallengeExecutions: results.length,
    approvalRequired: results.filter(row => row.canonical.approvalRequired).length,
    delegatedAuthority: results.filter(row => !row.canonical.approvalRequired).length,
    approvalChallengesBlocked: results.filter(row => row.authority.result === 'blocked-as-designed').length,
    delegatedChallengesExecuted: results.filter(row => row.authority.result === 'executed-with-delegated-authority').length,
    learningProposals: results.filter(row => row.learning.proposal).length,
    learningReplays: results.filter(row => row.learning.replayOutcome !== null).length,
    improvedToMet: results.filter(row => row.learning.learningEffect === 'improved-to-met').length,
    persistentPressure: results.filter(row => row.learning.learningEffect === 'persistent-pressure').length,
    noProposal: results.filter(row => row.learning.learningEffect === 'no-proposal').length,
    sources: [...new Set(results.map(row => row.signal.sourcePath))],
    scenarios: [...new Set(results.map(row => row.signal.scenarioId))],
    limitations: [
      'Synthetic canonical pressure testing only; no live hotel or vendor system is contacted.',
      'Synthetic role identifiers are not authenticated people.',
      'Delegated-authority execution means the canonical scenario has no human approval gate; it does not mean ungoverned automation.',
      'Learning changes are reviewed synthetic candidates and are not production policy changes.',
      'Business outcomes are synthetic observations, not measured hotel outcomes.',
    ],
    environmentReports: environments,
    results,
  };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/travel-pressure-estate.json', JSON.stringify(aggregate, null, 2) + '\n');

  const summary = [
    '# Travel 100-pathway pressure estate', '',
    'Evidence: **synthetic canonical pressure test**.',
    'Environments: **' + aggregate.environments + '**. Base pathways: **' + aggregate.pathways + '**. Authority challenges: **' + aggregate.authorityChallengeExecutions + '**.',
    'Approval-required canonical pathways: **' + aggregate.approvalRequired + '**. Delegated-authority pathways: **' + aggregate.delegatedAuthority + '**.',
    'Withheld approval correctly blocked: **' + aggregate.approvalChallengesBlocked + '**. Delegated no-approval flows executed: **' + aggregate.delegatedChallengesExecuted + '**.',
    'Learning proposals: **' + aggregate.learningProposals + '**. Replays: **' + aggregate.learningReplays + '**. Improved to Met: **' + aggregate.improvedToMet + '**. Persistent pressure after replay: **' + aggregate.persistentPressure + '**.',
    '',
    '| Environment | Paths | Approval gate | Delegated | Met | Not met | Pending | Learning proposals | Improved | Persistent |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...environments.map(e => '| ' + e.name + ' | ' + e.pathways + ' | ' + e.approvalRequired + ' | ' + e.delegatedAuthority
      + ' | ' + e.canonicalOutcomes.met + ' | ' + e.canonicalOutcomes['not-met'] + ' | ' + e.canonicalOutcomes.pending
      + ' | ' + e.learningProposals + ' | ' + e.learningImproved + ' | ' + e.persistentPressure + ' |'),
    '',
    'Synthetic only. A blocked approval challenge is a successful governance result, not a failed pathway.',
    '',
  ];
  writeFileSync('simulation-results/travel-pressure-summary.md', summary.join('\n'));

  const learningLines = [
    '# Travel pressure-test learning report', '',
    'This report records what the synthetic learning loop proposed and whether an approved replay improved the next execution.',
    '',
    ...environments.flatMap(environment => {
      const rows = results.filter(row => row.environmentId === environment.environmentId);
      const nextActions = [...new Set(rows.map(row => row.learning.runtimeLearning?.nextAction).filter((x): x is string => Boolean(x)))];
      const reasons = [...new Set(rows.flatMap(row => row.learning.proposal?.reasons ?? []))];
      return [
        '## ' + environment.name,
        '',
        '- Pathways: ' + environment.pathways,
        '- Baseline outcomes: ' + environment.canonicalOutcomes.met + ' met / ' + environment.canonicalOutcomes['not-met'] + ' not met / ' + environment.canonicalOutcomes.pending + ' pending',
        '- Reviewed learning proposals: ' + environment.learningProposals,
        '- Replays improved to Met: ' + environment.learningImproved,
        '- Persistent pressure after replay: ' + environment.persistentPressure,
        '- Proposal reasons observed: ' + (reasons.join(', ') || 'none'),
        '- Canonical next actions observed: ' + (nextActions.slice(0, 3).join(' | ') || 'No closed-case runtime learning available'),
        '',
      ];
    }),
    '## Boundary', '',
    'Learning proposals are synthetic reviewed candidates. They do not change production policy, hotel SOPs or vendor configuration.',
    '',
  ];
  writeFileSync('simulation-results/travel-pressure-learning-report.md', learningLines.join('\n'));
});

describe('Travel multi-environment 100-pathway pressure estate', () => {
  it('opens ten pressure environments and exactly 100 unique base pathways', () => {
    expect(PRESSURE_ENVIRONMENTS).toHaveLength(10);
    expect(results).toHaveLength(100);
    expect(new Set(results.map(row => row.pathwayId)).size).toBe(100);
    expect(environments.every(environment => environment.pathways === 10)).toBe(true);
  });

  it('covers all four current synthetic source paths and multiple canonical scenarios', () => {
    expect(new Set(results.map(row => row.signal.sourcePath))).toEqual(new Set(['pms', 'guest', 'staff', 'sensor']));
    expect(new Set(results.map(row => row.signal.scenarioId)).size).toBeGreaterThanOrEqual(5);
  });

  it('contains both approval-required and delegated-authority execution', () => {
    expect(results.some(row => row.canonical.approvalRequired)).toBe(true);
    expect(results.some(row => !row.canonical.approvalRequired)).toBe(true);
  });

  it('never lets an approval-required challenge dispatch without approval', () => {
    const gated = results.filter(row => row.canonical.approvalRequired);
    expect(gated.length).toBeGreaterThan(0);
    expect(gated.every(row => row.authority.mode === 'approval-withheld'
      && row.authority.result === 'blocked-as-designed'
      && row.authority.wrongRoleRejected === true
      && row.authority.finalState === 'approval-required')).toBe(true);
  });

  it('lets delegated-authority cases flow without a human approval gate', () => {
    const delegated = results.filter(row => !row.canonical.approvalRequired);
    expect(delegated.length).toBeGreaterThan(0);
    expect(delegated.every(row => row.authority.mode === 'delegated-authority'
      && row.authority.result === 'executed-with-delegated-authority')).toBe(true);
  });

  it('records the correct authority trail on canonical executions', () => {
    for (const row of results) {
      if (row.canonical.approvalRequired) expect(row.canonical.decisions).toBeGreaterThan(0);
      else expect(row.canonical.decisions).toBe(0);
    }
  });

  it('creates learning reports with both successful improvement and unresolved pressure', () => {
    expect(results.some(row => row.learning.learningEffect === 'improved-to-met')).toBe(true);
    expect(results.some(row => row.learning.learningEffect === 'persistent-pressure')).toBe(true);
    expect(results.some(row => row.learning.learningEffect === 'no-proposal')).toBe(true);
    expect(results.some(row => row.learning.runtimeLearning !== null)).toBe(true);
  });

  it('keeps missing measurement from creating an unsupported policy proposal', () => {
    const blind = results.filter(row => row.environmentId === 'measurement-blind-spot');
    expect(blind).toHaveLength(10);
    expect(blind.every(row => row.canonical.outcome === 'pending' && row.learning.proposal === null)).toBe(true);
  });

  it('shows recoverable and hard constraints behave differently after reviewed replay', () => {
    const recoverableCapacity = results.filter(row => row.environmentId === 'recoverable-capacity');
    const hardCapacity = results.filter(row => row.environmentId === 'hard-capacity-limit');
    expect(recoverableCapacity.every(row => row.learning.learningEffect === 'improved-to-met')).toBe(true);
    expect(hardCapacity.every(row => row.learning.learningEffect === 'persistent-pressure')).toBe(true);

    const recoverableReceipt = results.filter(row => row.environmentId === 'recoverable-receipt-loss');
    const hardReceipt = results.filter(row => row.environmentId === 'hard-receipt-loss');
    expect(recoverableReceipt.every(row => row.learning.learningEffect === 'improved-to-met')).toBe(true);
    expect(hardReceipt.every(row => row.learning.learningEffect === 'persistent-pressure')).toBe(true);
  });
});
