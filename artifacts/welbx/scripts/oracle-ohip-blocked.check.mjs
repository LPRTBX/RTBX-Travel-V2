import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
test('Missing sandbox credentials retain blocked evidence and cannot claim vendor testing', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'ohip-blocked-'));
  try {
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./oracle-ohip-sandbox-smoke.mjs', import.meta.url))], { cwd,
      env: { PATH: process.env.PATH }, encoding: 'utf8' });
    assert.equal(result.status, 2);
    const report = JSON.parse(readFileSync(join(cwd, 'simulation-results/oracle-ohip-sandbox.json'), 'utf8'));
    assert.equal(report.evidenceLevel, 'qualification-blocked'); assert.equal(report.liveCallsAttempted, 0);
    assert.equal(report.missingEnvironmentKeys.length, 6); assert.deepEqual(report.results, []);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
