import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { INTEGRATION_RECORDS } from '../data/travelDeploymentPathway';
import { HOTEL_PATHS, HOTEL_ROUTES } from './mockHotel';
import { TRAVEL_INTEGRATION_CONTRACTS, integrationRegistrySummary } from './integrationContractRegistry';
import phase4Cohorts from './phase4-cohorts.json';
import phase4Manifest from './phase4-fixture-manifest.json';

const startedAt = new Date().toISOString();
const mappedIds = new Set(INTEGRATION_RECORDS.map(record => record.id));

afterAll(() => {
  const report = { ...integrationRegistrySummary(), startedAt, finishedAt: new Date().toISOString(), gitSha: process.env.GITHUB_SHA ?? null,
    fixtureInventory: phase4Manifest.cases.length,
    limitations: [
      'Capability contracts are vendor-neutral JALDO requirements, not Oracle/HotSOS/vendor-certified API schemas.',
      'Mapped means the system responsibility is defined; it does not mean integrated or production.',
      'Transport and marketplace activation remain explicit interface gaps.',
    ] };
  mkdirSync('simulation-results', { recursive: true });
  writeFileSync('simulation-results/integration-contract-registry.json', JSON.stringify(report, null, 2) + '\n');
  const lines = ['# Integration contract registry', '',
    `Scenario contracts: **${report.scenarioContracts}**. Input event kinds: **${report.coveredInputKinds}/${report.inputKinds} covered**.`,
    `Phase 4 fixture inventory: **${report.fixtureInventory}** synthetic signal definitions.`,
    `Mapped system requirements: **${report.mappedSystemRequirements}**. Explicit integration gaps: **${report.explicitGaps.length}**.`, '',
    ...report.explicitGaps.map(gap => `- GAP · ${gap.scenarioId} · ${gap.system} (${gap.id})`), '',
    'Evidence level: **synthetic contract registry**. No vendor API certification or production integration is implied.', ''];
  writeFileSync('simulation-results/integration-contract-summary.md', lines.join('\n'));
});

describe('Travel integration contract registry', () => {
  it('keeps the 100-signal Phase 4 inventory attached to the contract layer', () => {
    expect(phase4Manifest.cases).toHaveLength(100);
    expect(new Set(phase4Manifest.cases.map(item => item.fixtureId)).size).toBe(100);
  });

  it('covers every synthetic hotel input kind exactly once', () => {
    const expected = HOTEL_PATHS.flatMap(path => Object.keys(HOTEL_ROUTES[path]).map(kind => `${path}:${kind}`)).sort();
    const actual = TRAVEL_INTEGRATION_CONTRACTS.flatMap(contract => contract.sourceKinds.map(item => `${item.path}:${item.kind}`)).sort();
    expect(actual).toEqual(expected);
    expect(actual).toHaveLength(20);
  });

  it('covers every Phase 4 candidate scenario', () => {
    const contractIds = new Set(TRAVEL_INTEGRATION_CONTRACTS.map(contract => contract.scenarioId));
    for (const cohort of phase4Cohorts) expect(contractIds.has(cohort.scenarioId)).toBe(true);
  });

  it('resolves every mapped system requirement to the canonical responsibility matrix', () => {
    for (const contract of TRAVEL_INTEGRATION_CONTRACTS) {
      for (const req of contract.requirements.filter(item => item.status === 'mapped')) {
        expect(mappedIds.has(req.id), `${contract.scenarioId}:${req.id}`).toBe(true);
        expect(req.capabilities.length, `${contract.scenarioId}:${req.id}`).toBeGreaterThan(0);
        expect(req.maturity).not.toBe('integrated');
        expect(req.maturity).not.toBe('production');
      }
    }
  });

  it('requires explicit event/read/action/callback semantics where operationally needed', () => {
    const ops = new Set(TRAVEL_INTEGRATION_CONTRACTS.flatMap(c => c.requirements.flatMap(r => r.capabilities.map(cap => cap.operation))));
    expect(ops).toEqual(new Set(['event', 'read', 'write', 'action', 'callback']));
  });

  it('keeps currently missing transport and marketplace interfaces visible as gaps', () => {
    const gaps = integrationRegistrySummary().explicitGaps;
    expect(gaps).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'gap-transport-provider', scenarioId: 'transport-disruption' }),
      expect.objectContaining({ id: 'gap-marketplace-activation', scenarioId: 'premium-guest-opportunity' }),
    ]));
    expect(gaps).toHaveLength(2);
  });
});
