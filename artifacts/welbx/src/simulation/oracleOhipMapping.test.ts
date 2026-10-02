import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { integrationRegistrySummary, TRAVEL_INTEGRATION_CONTRACTS } from './integrationContractRegistry';
import {
  ORACLE_OHIP_AUTH, ORACLE_OHIP_EVIDENCE_LEVEL, ORACLE_OHIP_OPERATIONS, ORACLE_OHIP_STREAMING,
  oracleOhipSummary, validateOracleOhipMap,
} from './oracleOhipMapping';

afterAll(() => {
  const report = {
    ...oracleOhipSummary(), generatedAt: new Date().toISOString(), gitSha: process.env.GITHUB_SHA ?? null,
    canonicalRegistry: integrationRegistrySummary(), operations: ORACLE_OHIP_OPERATIONS,
    limitations: [
      'Documentation mapping only; no OHIP sandbox calls were made by this test.',
      'No customer environment, property, credentials, application key or live business events are used.',
      'Partial mappings require field-level and behavior-level validation in the target OHIP sandbox/environment.',
      'No Oracle validation, certification, connector-ready, integrated or production claim is made.',
    ],
  };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/oracle-ohip-mapping.json', JSON.stringify(report, null, 2) + '\n');
  const lines = [
    '# Oracle OHIP documentation map', '',
    'Evidence: **' + report.evidenceLevel + '**. JALDO requirements touched: **' + report.mappedJaldoRequirements + '**. Documented operation mappings: **' + report.documentedOperations + '**.',
    'Fully mapped operations: **' + report.fullyMappedOperations + '**. Partial mappings: **' + report.partialOperations + '**. Sandbox tests passed: **' + report.sandboxTestsPassed + '**.',
    '', '## Still outside this OHIP documentation map', '',
    ...report.unresolvedJaldoRequirements.map(id => '- ' + id), '',
    'No live Oracle environment, customer data, credentials or production action is used.', '',
  ];
  writeFileSync('simulation-results/oracle-ohip-summary.md', lines.join('\n'));
});

describe('Oracle OHIP documentation mapping', () => {
  it('is anchored to actual JALDO integration contract requirements', () => {
    expect(validateOracleOhipMap()).toEqual([]);
    expect(ORACLE_OHIP_OPERATIONS.length).toBeGreaterThan(0);
  });
  it('cannot promote itself beyond documentation-mapped evidence', () => {
    expect(ORACLE_OHIP_EVIDENCE_LEVEL).toBe('documentation-mapped');
    expect(ORACLE_OHIP_OPERATIONS.every(item => item.evidenceLevel === 'documentation-mapped')).toBe(true);
    expect(oracleOhipSummary().sandboxTestsPassed).toBe(0);
    expect(oracleOhipSummary().liveEventsObserved).toBe(0);
  });
  it('defines the OCIM client-credential boundary and required request identity', () => {
    expect(ORACLE_OHIP_AUTH.targetScheme).toMatch(/client credentials/i);
    expect(ORACLE_OHIP_AUTH.required).toEqual(expect.arrayContaining([
      'OAuth Client ID', 'OAuth Client Secret', 'Application Key (x-app-key)', 'Hotel ID (x-hotelid)',
      'Gateway URL', 'Scope', 'Enterprise ID',
    ]));
    expect(ORACLE_OHIP_AUTH.secretBoundary).toMatch(/server-side/i);
  });
  it('requires streaming subscriptions and trigger data elements to be configured', () => {
    expect(ORACLE_OHIP_STREAMING.prerequisites.join(' ')).toMatch(/subscriptions/i);
    expect(ORACLE_OHIP_STREAMING.prerequisites.join(' ')).toMatch(/triggers/i);
    expect(ORACLE_OHIP_STREAMING.triggerBoundary).toMatch(/trigger data elements/i);
  });
  it('maps reservation, housekeeping, profile and room-maintenance requirements without swallowing other systems', () => {
    const ids = new Set(ORACLE_OHIP_OPERATIONS.map(item => item.jaldoRequirementId));
    expect(ids).toEqual(new Set(['int-pms', 'int-housekeeping', 'int-crm-guest-profile', 'int-maintenance']));
    expect(oracleOhipSummary().unresolvedJaldoRequirements).toEqual(expect.arrayContaining([
      'int-task-management', 'int-guest-messaging', 'int-staff-app', 'gap-transport-provider', 'gap-marketplace-activation',
    ]));
  });
  it('keeps Phase 5 explicit gaps visible', () => {
    const registryGaps = integrationRegistrySummary().explicitGaps.map(gap => gap.id);
    expect(registryGaps).toEqual(expect.arrayContaining(['gap-transport-provider', 'gap-marketplace-activation']));
    expect(oracleOhipSummary().unresolvedJaldoRequirements).toEqual(expect.arrayContaining(registryGaps));
  });
  it('does not invent mappings for required contract operations that Oracle documentation has not established', () => {
    const mappedPairs = new Set(ORACLE_OHIP_OPERATIONS.map(item => item.jaldoRequirementId + ':' + item.jaldoOperation));
    for (const contract of TRAVEL_INTEGRATION_CONTRACTS) {
      for (const req of contract.requirements) {
        if (!['int-pms', 'int-housekeeping', 'int-crm-guest-profile', 'int-maintenance'].includes(req.id)) continue;
        for (const cap of req.capabilities.filter(cap => cap.required)) {
          const key = req.id + ':' + cap.operation;
          if (!mappedPairs.has(key)) expect(['callback', 'event', 'action']).toContain(cap.operation);
        }
      }
    }
  });
});
