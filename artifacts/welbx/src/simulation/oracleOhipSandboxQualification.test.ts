import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  OHIP_DEFAULT_SCOPE,
  OHIP_SANDBOX_ENV_KEYS,
  OHIP_SANDBOX_QUALIFICATION_PLAN,
  assessOhipSandboxReadiness,
  safeOhipQualificationDescriptor,
} from './oracleOhipSandboxQualification';

const fake = {
  OHIP_GATEWAY_URL: 'https://sandbox.example.invalid',
  OHIP_APP_KEY: 'super-secret-app-key',
  OHIP_CLIENT_ID: 'super-secret-client-id',
  OHIP_CLIENT_SECRET: 'super-secret-client-secret',
  OHIP_ENTERPRISE_ID: 'enterprise-secret-value',
  OHIP_HOTEL_ID: 'SAND01',
  OHIP_SCOPE: OHIP_DEFAULT_SCOPE,
};

afterAll(() => {
  const report = safeOhipQualificationDescriptor({});
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/ohip-sandbox-readiness.json', JSON.stringify(report, null, 2) + '\n');
  const lines = [
    '# OHIP sandbox qualification harness', '',
    'Harness evidence: **' + report.evidenceLevel + '**. Live calls attempted by normal CI: **' + report.liveCallsAttempted + '**.',
    'Documented Oracle mappings available to qualify: **' + report.documentedOperationsAvailableForQualification + '**.',
    'Secure environment configured in normal CI: **no**. Live sandbox workflow remains manual and secret-gated.',
    '',
  ];
  writeFileSync('simulation-results/ohip-sandbox-readiness-summary.md', lines.join('\n'));
});

describe('OHIP sandbox qualification boundary', () => {
  it('requires all server-side identity values before a live qualification run', () => {
    expect(assessOhipSandboxReadiness({}).missing).toEqual([...OHIP_SANDBOX_ENV_KEYS]);
    expect(assessOhipSandboxReadiness(fake).ready).toBe(true);
  });

  it('never includes secret values in a readiness descriptor', () => {
    const serialized = JSON.stringify(safeOhipQualificationDescriptor(fake));
    expect(serialized).not.toContain(fake.OHIP_APP_KEY);
    expect(serialized).not.toContain(fake.OHIP_CLIENT_ID);
    expect(serialized).not.toContain(fake.OHIP_CLIENT_SECRET);
    expect(serialized).not.toContain(fake.OHIP_ENTERPRISE_ID);
    expect(serialized).not.toContain(fake.OHIP_HOTEL_ID);
    expect(serialized).toContain('"secretValuesExposed":false');
  });

  it('keeps normal CI at zero external calls', () => {
    const status = safeOhipQualificationDescriptor(fake);
    expect(status.liveCallsAttempted).toBe(0);
    expect(status.evidenceLevel).toBe('qualification-harness-only');
  });

  it('starts with auth and a safe property read; streaming remains a later explicit qualification', () => {
    expect(OHIP_SANDBOX_QUALIFICATION_PLAN[0].id).toBe('oauth-client-credentials');
    expect(OHIP_SANDBOX_QUALIFICATION_PLAN[1].id).toBe('housekeeping-overview-read');
    expect(OHIP_SANDBOX_QUALIFICATION_PLAN.find(item => item.id === 'streaming-business-event')?.required).toBe(false);
  });
});
