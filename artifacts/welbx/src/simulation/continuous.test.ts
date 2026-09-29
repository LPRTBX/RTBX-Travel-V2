import { afterAll, describe, expect, it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { DEFAULT_DEPLOYMENT } from '../data/travelDeploymentConfig';
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';
import { TRAVEL_PLAYBOOKS } from '../data/travelPlaybooks';
import {
  createExecution, transitionExecution, captureEvidence, sendCommunication,
  triggerEscalation, acknowledgeEscalation, recordOutcome, getMandatoryEvidenceGaps,
  type ScenarioExecution,
} from '../lib/runtimeEngine';

// Repeatable input matrix; all role decisions below are scripted synthetic actors.
const repetitions = Number(process.env.SIMULATION_REPETITIONS ?? '10');
if (![1, 10, 100, 1000].includes(repetitions)) {
  throw new Error('SIMULATION_REPETITIONS must be 1, 10, 100 or 1000');
}
const epoch = '2026-09-01T00:00:00.000Z';
const rows: Array<Record<string, unknown>> = [];
const startedAt = new Date().toISOString();
const gaps = [
  'Vendor API contracts, outages, retries and incoming-event deduplication are not exercised.',
  'Authentication, tenant isolation, browser journeys and database persistence are not exercised.',
  'Human approval identity and escalation deadlines require separate server-side verification.',
  'Timing measures local sequential reducer work, not concurrent users or production capacity.',
  'AI token consumption, infrastructure cost and business outcomes are not measured.',
];

function check(name: string, run: () => Record<string, unknown> | void) {
  it(name, () => {
    const start = performance.now();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(epoch));
    try {
      const detail = run();
      rows.push({ name, status: 'passed', elapsedMs: performance.now() - start, ...detail });
    } catch (error) {
      rows.push({ name, status: 'failed', elapsedMs: performance.now() - start,
        error: error instanceof Error ? error.message : String(error) });
      throw error;
    } finally {
      vi.useRealTimers();
    }
  });
}

afterAll(() => {
  const report = {
    schemaVersion: 'jaldo.simulation.v1', vertical: 'travel',
    evidenceLevel: 'synthetic-engine', startedAt, finishedAt: new Date().toISOString(),
    commit: process.env.GITHUB_SHA ?? null, repetitions, clock: epoch,
    decisionSource: 'scripted synthetic actors; no real human decisions or external dispatch',
    summary: { passed: rows.filter(r => r.status === 'passed').length,
      failed: rows.filter(r => r.status === 'failed').length },
    untested: gaps, results: rows,
  };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/travel.json', JSON.stringify(report, null, 2) + '\n');
  const lines = ['# JALDO Travel simulation', '',
    `Evidence: **synthetic engine**. Passed: ${report.summary.passed}; failed: ${report.summary.failed}.`,
    `Repetitions per scenario: ${repetitions}. Commit: ${report.commit ?? 'local working tree'}.`, '',
    '| Check | Result | Local elapsed ms |', '|---|---|---:|',
    ...rows.map(r => `| ${r.name} | ${r.status} | ${Number(r.elapsedMs).toFixed(2)} |`),
    '', '## Coverage limits', '', ...gaps.map(g => `- ${g}`), ''];
  writeFileSync('simulation-results/summary.md', lines.join('\n'));
});

describe('Continuous Travel simulation', () => {
  check('Burst creation keeps execution and evidence identifiers unique', () => {
    const scenario = TRAVEL_SCENARIOS[0];
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)!;
    const runs = Array.from({ length: 100 }, () =>
      createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook }));
    expect(new Set(runs.map(r => r.id)).size).toBe(100);
    const evidenceIds = runs.flatMap(r => r.evidence.map(e => e.id));
    expect(new Set(evidenceIds).size).toBe(evidenceIds.length);
    return { executionCount: runs.length };
  });

  // Exercise every configured scenario; enable dormant scenarios only in this copy.
  for (const configured of DEFAULT_DEPLOYMENT.scenarios) {
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === configured.scenarioId)!;
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === configured.playbookId)!;
    check(`${configured.scenarioId}: completion, gates and escalation replay`, () => {
      const original = JSON.stringify(DEFAULT_DEPLOYMENT);
      let transitionCount = 0;
      let communicationCount = 0;
      let blockedAttempts = 0;
      let lastTrace: unknown;
      const durations: number[] = [];
      for (let iteration = 0; iteration < repetitions; iteration++) {
        const begin = performance.now();
        const deployment = { ...DEFAULT_DEPLOYMENT,
          scenarios: DEFAULT_DEPLOYMENT.scenarios.map(s => ({ ...s,
            active: s.scenarioId === configured.scenarioId ? true : s.active })) };
        let run = createExecution({ deployment, scenario, playbook });
        const move = (state: ScenarioExecution['state']) => {
          vi.setSystemTime(new Date(Date.parse(epoch) + transitionCount * 1000));
          const next = transitionExecution(run, state, scenario, 'Synthetic test actor');
          expect(next, `Expected transition to ${state}`).not.toBeNull();
          run = next!;
          transitionCount++;
        };
        expect(run.accountableRoleId).toBe(configured.accountableRoleId);
        expect(run.isSynthetic).toBe(true);
        expect(transitionExecution(run, 'closed', scenario)).toBeNull();
        blockedAttempts++;
        move('understanding');
        move('decision-required');
        if (run.isWelfareScenario && scenario.governanceConfig.humanApprovalRequired) {
          expect(transitionExecution(run, 'in-action', scenario)).toBeNull();
          blockedAttempts++;
        }
        move('approval-required');
        // This represents a scripted actor advancing the demo, not verified authorisation.
        move('in-action');
        for (const comm of run.communications) {
          if (comm.approvalRequired) {
            expect(() => sendCommunication(run, comm.id)).toThrow(/approval/i);
            expect(run.communications.find(c => c.id === comm.id)?.sent).toBe(false);
            blockedAttempts++;
          }
          run = sendCommunication(run, comm.id, configured.accountableRoleId);
          communicationCount++;
        }
        move('escalated');
        run = triggerEscalation(run, 'Synthetic unavailable-owner exercise', configured.accountableRoleId);
        expect(run.escalations[0].acknowledged).toBe(false);
        run = acknowledgeEscalation(run, run.escalations[0].id);
        expect(run.escalations[0].acknowledged).toBe(true);
        move('in-action');
        move('resolved');
        expect(getMandatoryEvidenceGaps(run).length).toBeGreaterThan(0);
        expect(transitionExecution(run, 'closed', scenario)).toBeNull();
        blockedAttempts++;
        for (const evidence of run.evidence.filter(e => e.required)) {
          run = captureEvidence(run, evidence.id, { capturedByRole: evidence.ownerRoleId,
            note: 'Synthetic evidence only' });
        }
        for (const outcome of run.outcomes) {
          run = recordOutcome(run, outcome.id, 'not-measured', 'No real-world outcome measurement');
        }
        move('closed');
        expect(run.closedAt).toBeTruthy();
        expect(getMandatoryEvidenceGaps(run)).toEqual([]);
        expect(run.communications.every(c => c.sent)).toBe(true);
        expect(run.stateHistory.map(s => s.state)).toEqual([
          'signal-received', 'understanding', 'decision-required', 'approval-required',
          'in-action', 'escalated', 'in-action', 'resolved', 'closed',
        ]);
        expect(transitionExecution(run, 'in-action', scenario)).toBeNull();
        blockedAttempts++;
        lastTrace = { scenarioId: run.scenarioId, deploymentId: run.deploymentId,
          accountableRoleId: run.accountableRoleId, stateHistory: run.stateHistory };
        durations.push(performance.now() - begin);
      }
      expect(JSON.stringify(DEFAULT_DEPLOYMENT)).toBe(original);
      durations.sort((a, b) => a - b);
      return { executionCount: repetitions, transitionCount, communicationCount, blockedAttempts,
        localP95Ms: durations[Math.ceil(durations.length * 0.95) - 1], trace: lastTrace };
    });
  }

  check('Missing scenario and mismatched playbook are rejected', () => {
    const scenario = TRAVEL_SCENARIOS[0];
    const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)!;
    expect(() => createExecution({ deployment: { ...DEFAULT_DEPLOYMENT, scenarios: [] },
      scenario, playbook })).toThrow(/not configured/);
    expect(() => createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario,
      playbook: { ...playbook, id: 'invalid-playbook' } })).toThrow(/canonical playbook/);
  });
});
