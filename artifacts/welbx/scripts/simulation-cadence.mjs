/** Cadence observer and optional recovery trigger. Runs in Actions or an external trusted scheduler. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HOUR = 3600000;
export function assessCadence(runs, now = new Date(), { minute = 23, hours = 24, staleMinutes = 90 } = {}) {
  const end = now.getTime();
  if (!Number.isFinite(end)) throw new Error('Invalid observation time');
  const start = end - hours * HOUR;
  const unique = [...new Map(runs.map(r => [r.id, r])).values()];
  const main = unique.filter(r => r.head_branch === 'main');
  const inWindow = main.filter(r => Date.parse(r.created_at) >= start && Date.parse(r.created_at) < end);
  const scheduled = inWindow.filter(r => r.event === 'schedule');
  // GitHub does not expose the nominal cron slot on these run records. These are observed creation-time buckets.
  const slots = [];
  let due = Math.floor(start / HOUR) * HOUR + minute * 60000;
  if (due < start) due += HOUR;
  for (; due < end; due += HOUR) {
    const observed = scheduled.filter(r => Date.parse(r.created_at) >= due && Date.parse(r.created_at) < due + HOUR);
    const pendingGrace = end < due + HOUR + staleMinutes * 60000;
    const status = observed.some(r => r.status === 'completed' && r.conclusion === 'success') ? 'observed-success'
      : observed.some(r => r.status !== 'completed') ? 'observed-active'
      : observed.length ? 'observed-unsuccessful' : pendingGrace ? 'awaiting-observation' : 'no-run-observed';
    slots.push({ dueAt: new Date(due).toISOString(), status, runIds: observed.map(r => r.id),
      cause: observed.length ? null : 'unknown; delayed/dropped trigger cannot be distinguished from run records' });
  }
  const continuous = main.filter(r => ['schedule', 'workflow_dispatch'].includes(r.event));
  const successes = continuous.filter(r => r.status === 'completed' && r.conclusion === 'success'
    && Number.isFinite(Date.parse(r.updated_at)) && Date.parse(r.updated_at) <= end)
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  const lastSuccess = successes[0];
  const ageMinutes = lastSuccess ? (end - Date.parse(lastSuccess.updated_at)) / 60000 : null;
  const active = main.filter(r => r.status !== 'completed');
  const recentlyRequested = continuous.some(r => end - Date.parse(r.created_at) >= 0 && end - Date.parse(r.created_at) < staleMinutes * 60000);
  return { schemaVersion: 'jaldo.simulation-cadence.v1', generatedAt: now.toISOString(), windowStart: new Date(start).toISOString(),
    expectedSlots: slots.length, observedScheduledRuns: scheduled.length,
    observedScheduledCompletions: scheduled.filter(r => r.status === 'completed').length,
    noRunObservedBuckets: slots.filter(s => s.status === 'no-run-observed').length,
    activeRunIds: active.map(r => r.id), lastContinuousSuccess: lastSuccess ? { id: lastSuccess.id, updatedAt: lastSuccess.updated_at } : null,
    minutesSinceContinuousSuccess: ageMinutes, staleMinutes,
    recoveryNeeded: (!lastSuccess || ageMinutes > staleMinutes) && active.length === 0 && !recentlyRequested,
    byEvent: Object.fromEntries(['schedule', 'push', 'workflow_dispatch', 'pull_request'].map(event => [event,
      unique.filter(r => r.event === event && Date.parse(r.created_at) >= start && Date.parse(r.created_at) < end).length])),
    slots, limits: ['Creation-time buckets are observations, not exact attribution to nominal cron triggers.',
      'Recovered/manual executions do not erase historical schedule gaps.',
      'A GitHub-hosted watchdog shares scheduler failure risk. An independent trigger needs separate hosting.',
      'Run status alone does not establish signal execution totals; read simulation artifacts.'] };
}
export async function listSimulationRuns(api, repository, token, fetchImpl = fetch) {
  const runs = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetchImpl(`${api}/repos/${repository}/actions/workflows/travel-simulation.yml/runs?per_page=100&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Cadence read failed (HTTP ${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.workflow_runs)) throw new Error('Invalid cadence response');
    runs.push(...data.workflow_runs);
    if (data.workflow_runs.length < 100) return runs;
  }
  throw new Error('Cadence pagination limit reached; recovery withheld because coverage is incomplete');
}
export async function runCadence(env = process.env, fetchImpl = fetch) {
  const repository = env.GITHUB_REPOSITORY;
  const token = env.GITHUB_TOKEN;
  if (!repository || !token) throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required (values never saved)');
  const api = env.GITHUB_API_URL || 'https://api.github.com';
  if (api !== 'https://api.github.com') throw new Error('This observer is configured for api.github.com only');
  const runs = await listSimulationRuns(api, repository, token, fetchImpl);
  const report = assessCadence(runs);
  report.recovery = { requested: false, triggerSource: 'cadence-recovery', result: 'not-needed' };
  if (report.recoveryNeeded && env.CADENCE_RECOVER === 'true') {
    const response = await fetchImpl(`${api}/repos/${repository}/actions/workflows/travel-simulation.yml/dispatches`, {
      method: 'POST', headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main', inputs: { repetitions: '100', trigger_source: 'cadence-recovery' } }),
      signal: AbortSignal.timeout(15000),
    });
    report.recovery = { requested: response.ok, triggerSource: 'cadence-recovery', result: response.ok ? 'accepted-not-yet-executed' : `failed-http-${response.status}` };
  } else if (report.recoveryNeeded) report.recovery.result = 'needed-observer-only';
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let report;
  try { report = await runCadence(); }
  catch (error) {
    report = { schemaVersion: 'jaldo.simulation-cadence.v1', generatedAt: new Date().toISOString(),
      status: 'unverified', reason: error.message, recovery: { requested: false, result: 'withheld' } };
    process.exitCode = 1;
  }
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/cadence.json', JSON.stringify(report, null, 2) + '\n');
  writeFileSync('simulation-results/cadence-summary.md', ['# Travel simulation cadence', '',
    report.status === 'unverified' ? `Coverage unverified: ${report.reason}`
      : `Expected hourly slots: ${report.expectedSlots}; observed scheduled completions: ${report.observedScheduledCompletions}; empty matured observation buckets: ${report.noRunObservedBuckets}.`,
    `Recovery: ${report.recovery.result}.`, '', ...(report.limits ?? []).map(l => `- ${l}`), '',
  ].join('\n'));
  if (report.recovery.result.startsWith('failed-')) process.exitCode = 1;
}
