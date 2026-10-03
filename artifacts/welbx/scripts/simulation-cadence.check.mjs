import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessCadence, runCadence, listSimulationRuns } from './simulation-cadence.mjs';
const now = new Date('2026-10-03T12:47:00Z');
const run = (id, created, event = 'schedule', conclusion = 'success', status = 'completed', branch = 'main') => ({ id, created_at: created, updated_at: created, event, conclusion, status, head_branch: branch });
test('Hourly coverage accounts for 24 actual observations and deduplicates IDs', () => {
  const runs = Array.from({ length: 24 }, (_, i) => run(i, new Date(now.getTime() - (i + 1) * 3600000).toISOString()));
  const r = assessCadence([...runs, runs[0]], now);
  assert.equal(r.expectedSlots, 24); assert.equal(r.observedScheduledRuns, 24);
  assert.equal(r.noRunObservedBuckets, 0); assert.equal(r.recoveryNeeded, false);
});
test('Missed runs remain gaps when pushes and PRs pass', () => {
  const r = assessCadence([run(1, '2026-10-03T04:23:00Z'), run(2, '2026-10-03T12:40:00Z', 'push'),
    run(3, '2026-10-03T12:40:00Z', 'pull_request', 'success', 'completed', 'feature')], now);
  assert.equal(r.observedScheduledRuns, 1); assert.ok(r.noRunObservedBuckets > 15); assert.equal(r.recoveryNeeded, true);
});
test('Active or recently requested simulations suppress duplicate recovery', () => {
  assert.equal(assessCadence([run(1, '2026-10-03T12:00:00Z', 'workflow_dispatch', null, 'queued')], now).recoveryNeeded, false);
  assert.equal(assessCadence([run(1, '2026-10-03T12:00:00Z', 'workflow_dispatch', 'failure')], now).recoveryNeeded, false);
});
test('Recovery success updates health while preserving scheduled coverage gaps', () => {
  const r = assessCadence([run(1, '2026-10-03T12:30:00Z', 'workflow_dispatch')], now);
  assert.equal(r.recoveryNeeded, false); assert.equal(r.observedScheduledRuns, 0); assert.ok(r.noRunObservedBuckets > 15);
});
test('Failed completed scheduled runs do not count as success', () => {
  const r = assessCadence([run(1, '2026-10-03T06:23:00Z', 'schedule', 'failure')], now);
  assert.equal(r.lastContinuousSuccess, null); assert.equal(r.slots.filter(s => s.status === 'observed-unsuccessful').length, 1);
});
test('Observer never dispatches by default; recovery explicitly enabled and main only', async () => {
  const calls = [];
  const fake = async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ workflow_runs: [] }) }; };
  const env = { GITHUB_REPOSITORY: 'example/travel', GITHUB_TOKEN: 'test-only' };
  assert.equal((await runCadence(env, fake)).recovery.result, 'needed-observer-only');
  assert.equal(calls.length, 1);
  const r = await runCadence({ ...env, CADENCE_RECOVER: 'true' }, fake);
  assert.equal(r.recovery.result, 'accepted-not-yet-executed');
  assert.equal(JSON.parse(calls.at(-1).options.body).ref, 'main');
});
test('API errors stop recovery and pagination reads all pages', async () => {
  await assert.rejects(runCadence({ GITHUB_REPOSITORY: 'example/travel', GITHUB_TOKEN: 'x', CADENCE_RECOVER: 'true' },
    async () => ({ ok: false, status: 403 })), /HTTP 403/);
  let calls = 0;
  const runs = await listSimulationRuns('https://api.github.com', 'example/travel', 'x', async () => ({ ok: true,
    json: async () => ({ workflow_runs: ++calls === 1 ? Array.from({ length: 100 }, (_, id) => ({ id })) : [{ id: 100 }] }) }));
  assert.equal(runs.length, 101); assert.equal(calls, 2);
});
