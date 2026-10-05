import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { DEFAULT_DEPLOYMENT } from '../data/travelDeploymentConfig';
import { HOTEL_PATHS, HOTEL_ROUTES, MOCK_HOTEL, createHotelSignals, createHotelSession, ingestHotelSignal,
  advanceHotelSession, checkHotelRead, expectedHotelState, createHotelBatch, stepHotelBatch, type HotelPath } from './mockHotel';
import { approveLabRun, supplyLabEvidence } from '../lib/visualSimulation';
import { transitionExecution } from '../lib/runtimeEngine';
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';

const signals = createHotelSignals();
const repetitions = Number(process.env.SIMULATION_REPETITIONS ?? '10');
if (![1, 10, 100, 1000].includes(repetitions)) throw new Error('Invalid SIMULATION_REPETITIONS');
const results: Array<Record<string, unknown>> = [];
const startedAt = new Date().toISOString();
let signalExecutions = 0;
function check(name: string, action: () => Record<string, unknown> | void) {
  it(name, () => {
    try { results.push({ name, status: 'passed', ...action() }); }
    catch (error) { results.push({ name, status: 'failed', error: String(error) }); throw error; }
  });
}
afterAll(() => {
  const report = { schemaVersion: 'jaldo.hotel-simulation.v1', evidenceLevel: 'synthetic-engine-and-mock-adapters',
    startedAt, finishedAt: new Date().toISOString(), commit: process.env.GITHUB_SHA ?? null,
    hotel: MOCK_HOTEL, uniqueSignals: 100, repetitions, plannedSignalExecutions: 100 * repetitions, signalExecutions,
    paths: HOTEL_PATHS.map(path => ({ path, signalCount: signals.filter(s => s.path === path).length,
      contract: Object.keys(HOTEL_ROUTES[path]) })),
    summary: { passed: results.filter(r => r.status === 'passed').length, failed: results.filter(r => r.status === 'failed').length },
    limits: ['Synthetic input contracts, not vendor API certification.', 'No real messages, bookings, folio writes or devices.',
      'Approval actors are scripted; server-side identity is not verified.', 'Hotel occupancy is a fixture, not a PMS implementation.',
      'Sequential repetitions are not a load or concurrent-user benchmark.', 'No database durability, real retries or browser automation in this suite.'],
    results };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/mock-hotel.json', JSON.stringify(report, null, 2) + '\n');
  writeFileSync('simulation-results/hotel-signal-catalogue.json', JSON.stringify(signals, null, 2) + '\n');
  writeFileSync('simulation-results/mock-hotel-summary.md', ['# Mock hotel — four input paths', '',
    `100 distinct synthetic readings, 25 per path. ${repetitions} planned replays per reading; ${signalExecutions} signal executions.`,
    `Passed: ${report.summary.passed}; failed: ${report.summary.failed}. Evidence: synthetic engine and mock adapters.`, '',
    'Expected per 100-signal batch: **63 closed, 17 held for approval, 20 held for evidence** (3 withheld approvals route to delegated-authority transport cases). Expected holds are successful gate checks.', '',
    '| Check | Result |', '|---|---|', ...results.map(r => `| ${r.name} | ${r.status} |`), '',
    '## Limits', ...report.limits.map(l => `- ${l}`), ''].join('\n'));
});

describe('100-signal mock hotel', () => {
  check('Each input kind selects the intended canonical hotel scenario', () => {
    const expected: Record<HotelPath, string[]> = {
      pms: ['repeat-guest-room-not-ready', 'repeat-guest-room-not-ready', 'service-backlog', 'transport-disruption', 'maintenance-defect'],
      guest: ['repeat-guest-room-not-ready', 'service-backlog', 'maintenance-defect', 'distressed-guest', 'transport-disruption'],
      staff: ['repeat-guest-room-not-ready', 'service-backlog', 'maintenance-defect', 'distressed-guest', 'transport-disruption'],
      sensor: Array(5).fill('maintenance-defect'),
    };
    for (const path of HOTEL_PATHS) {
      const actual = signals.filter(s => s.path === path).map(s => ingestHotelSignal(createHotelSession(), s).reads[0].run.execution.scenarioId);
      expect(actual).toEqual(expected[path].flatMap(s => Array(5).fill(s)));
    }
  });
  check('Browser batch driver drains all four paths and preserves expected holds', () => {
    let batch = createHotelBatch();
    for (let tick = 0; tick < 40; tick++) batch = stepHotelBatch(batch);
    expect(batch.finished).toBe(true);
    expect(batch.hotel.reads).toHaveLength(100);
    expect(batch.hotel.reads.flatMap(checkHotelRead)).toEqual([]);
    expect(stepHotelBatch(batch)).toBe(batch);
  });
  check('Browser queue continues other paths during an outage and recovers without loss', () => {
    let batch = createHotelBatch();
    batch.hotel.online.sensor = false;
    for (let tick = 0; tick < 40; tick++) batch = stepHotelBatch(batch);
    expect(batch.finished).toBe(false);
    expect(batch.hotel.reads).toHaveLength(75);
    batch.hotel.online.sensor = true;
    for (let tick = 0; tick < 40; tick++) batch = stepHotelBatch(batch);
    expect(batch.finished).toBe(true);
    expect(batch.hotel.reads).toHaveLength(100);
    expect(batch.hotel.reads.flatMap(checkHotelRead)).toEqual([]);
  });
  check('Catalogue has 100 distinct reads and 25 per path', () => {
    expect(signals).toHaveLength(100);
    expect(new Set(signals.map(s => s.eventId)).size).toBe(100);
    expect(new Set(signals.map(s => s.title)).size).toBe(100);
    for (const path of HOTEL_PATHS) expect(signals.filter(s => s.path === path)).toHaveLength(25);
    expect(new Set(signals.map(s => s.room)).size).toBe(100);
  });
  for (const signal of signals) {
    check(signal.title, () => {
      let trace: unknown;
      for (let n = 0; n < repetitions; n++) {
        let session = ingestHotelSignal(createHotelSession(), signal);
        expect(session.intake[0].status).toBe('accepted');
        signalExecutions++;
        for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
        const read = session.reads[0];
        expect(checkHotelRead(read)).toEqual([]);
        expect(read.run.execution.state).toBe(expectedHotelState(signal));
        expect(read.run.execution.accountableRoleId).toBe(session.deployment.scenarios.find(s => s.scenarioId === read.scenarioId)!.accountableRoleId);
        // Approval gate applies exactly where the scenario's governance configures one.
        expect(read.run.execution.stateHistory.some(h => h.state === 'approval-required')).toBe(read.run.execution.approvalRequired);
        trace = { signal, execution: read.run.execution, checks: checkHotelRead(read) };
      }
      return { executions: repetitions, trace };
    });
  }
  check('Interleaved burst conserves all 100 reads and their identifiers', () => {
    const original = JSON.stringify(DEFAULT_DEPLOYMENT);
    let session = signals.reduce(ingestHotelSignal, createHotelSession());
    expect(session.reads).toHaveLength(100);
    expect(new Set(session.reads.map(r => r.run.execution.id)).size).toBe(100);
    for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
    expect(session.reads.flatMap(checkHotelRead)).toEqual([]);
    // 3 withheld-approval readings route to transport disruption, which acts within delegated authority.
    expect(session.reads.filter(r => r.run.execution.state === 'closed')).toHaveLength(63);
    expect(session.reads.filter(r => r.run.execution.state === 'approval-required')).toHaveLength(17);
    expect(session.reads.filter(r => r.run.execution.state === 'resolved')).toHaveLength(20);
    expect(JSON.stringify(DEFAULT_DEPLOYMENT)).toBe(original);
  });
  check('Duplicates and conflicting payloads cannot create another execution', () => {
    let session = ingestHotelSignal(createHotelSession(), signals[0]);
    session = ingestHotelSignal(session, signals[0]);
    expect(session.intake.at(-1)?.status).toBe('duplicate');
    session = ingestHotelSignal(session, { ...signals[0], room: 102, guestId: 'synthetic-guest-102' });
    expect(session.intake.at(-1)?.status).toBe('rejected');
    expect(session.reads).toHaveLength(1);
  });
  for (const path of HOTEL_PATHS) {
    check(`${path}: connection failure, recovery and replay`, () => {
      const signal = signals.find(s => s.path === path)!;
      let session = createHotelSession();
      session.online[path] = false;
      session = ingestHotelSignal(session, signal);
      expect(session.intake.at(-1)?.status).toBe('retry');
      expect(session.reads).toHaveLength(0);
      session.online[path] = true;
      session = ingestHotelSignal(session, signal);
      expect(session.intake.at(-1)?.status).toBe('accepted');
      session = ingestHotelSignal(session, signal);
      expect(session.reads).toHaveLength(1);
    });
    check(`${path}: malformed contract is rejected before execution`, () => {
      const signal = signals.find(s => s.path === path)!;
      const session = ingestHotelSignal(createHotelSession(), { ...signal, payload: {} });
      expect(session.intake.at(-1)?.status).toBe('rejected');
      expect(session.reads).toHaveLength(0);
    });
  }
  check('Foreign hotel, unknown kind, bad timestamp, room mismatch and invalid path are rejected', () => {
    for (const patch of [{ hotelId: 'another-hotel' }, { kind: '__proto__' }, { observedAt: 'bad-date' },
      { room: 999 }, { guestId: 'wrong-guest' }, { path: 'unknown' as HotelPath }, { schemaVersion: 'wrong' }, { condition: 'unknown' }]) {
      const session = ingestHotelSignal(createHotelSession(), { ...signals[0], ...patch });
      expect(session.intake.at(-1)?.status).toBe('rejected');
      expect(session.reads).toHaveLength(0);
    }
  });
  check('Inactive configuration blocks admission', () => {
    const session = createHotelSession();
    session.deployment.deploymentStatus = 'draft';
    const result = ingestHotelSignal(session, signals[0]);
    expect(result.intake.at(-1)?.status).toBe('rejected');
    expect(result.reads).toHaveLength(0);
  });
  check('Visitor mode preserves every approval gate', () => {
    let session = signals.reduce(ingestHotelSignal, createHotelSession());
    for (let step = 0; step < 12; step++) session = advanceHotelSession(session, false);
    const gated = session.reads.filter(r => r.run.execution.approvalRequired);
    expect(gated.length).toBeGreaterThan(0);
    expect(gated.every(r => r.run.execution.state === 'approval-required')).toBe(true);
    expect(gated.every(r => !r.run.approval && r.run.execution.decisions.length === 0 && r.run.execution.communications.every(c => !c.sent))).toBe(true);
    // Delegated-authority scenarios never wait on an approver that governance does not require.
    expect(session.reads.filter(r => !r.run.execution.approvalRequired).every(r => r.run.execution.state !== 'approval-required')).toBe(true);
  });
  check('Held approvals and evidence can resume through the same engine', () => {
    let session = signals.reduce(ingestHotelSignal, createHotelSession());
    for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
    session = { ...session, reads: session.reads.map(read => ({ ...read, run:
      read.signal.condition === 'approval-held' ? approveLabRun(read.run, 'visitor')
        : read.signal.condition === 'missing-evidence' ? supplyLabEvidence(read.run) : read.run })) };
    for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
    expect(session.reads.every(r => r.run.execution.state === 'closed')).toBe(true);
  });
  check('Input snapshots and cycles remain isolated', () => {
    const signal = structuredClone(signals[0]);
    const first = ingestHotelSignal(createHotelSession(), signal);
    signal.payload.delayMinutes = 999;
    expect(first.reads[0].signal.payload.delayMinutes).not.toBe(999);
    expect(createHotelSession(2).reads).toEqual([]);
    expect(new Set([...signals, ...createHotelSignals(2)].map(s => s.eventId)).size).toBe(200);
  });
  check('Required evidence and terminal state are enforced by the runtime', () => {
    let session = ingestHotelSignal(createHotelSession(), signals.find(s => s.condition === 'missing-evidence')!);
    for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
    const read = session.reads[0];
    const scenario = TRAVEL_SCENARIOS.find(s => s.id === read.scenarioId)!;
    expect(transitionExecution(read.run.execution, 'closed', scenario)).toBeNull();
    session.reads[0] = { ...read, run: supplyLabEvidence(read.run) };
    session = advanceHotelSession(session);
    expect(transitionExecution(session.reads[0].run.execution, 'in-action', scenario)).toBeNull();
  });
});
