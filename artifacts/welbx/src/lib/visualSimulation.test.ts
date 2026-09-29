import { describe, expect, it } from 'vitest';
import { DEFAULT_DEPLOYMENT, type TravelDeploymentConfig } from '../data/travelDeploymentConfig';
import { startLabRun, advanceLabRun, approveLabRun, supplyLabEvidence, acknowledgeLabEscalation } from './visualSimulation';
import { getMandatoryEvidenceGaps } from './runtimeEngine';
import { getDeploymentActivationReadiness } from './travelScenarioRouting';
const deployment: TravelDeploymentConfig = { ...DEFAULT_DEPLOYMENT, deploymentStatus: 'active-simulation' };
const id = deployment.scenarios[0].scenarioId;

describe('Visual simulation through the canonical engine', () => {
  it('uses a valid test preset without changing the saved fixture', () => {
    const before = JSON.stringify(DEFAULT_DEPLOYMENT);
    expect(getDeploymentActivationReadiness(deployment).ready).toBe(true);
    let run = startLabRun(deployment, id, 1, 'normal');
    for (let i = 0; i < 12; i++) run = advanceLabRun(run, true);
    expect(run.error).toBeUndefined();
    expect(run.execution.state).toBe('closed');
    expect(run.execution.outcomes.every(o => o.status === 'not-measured')).toBe(true);
    expect(run.approval).toBe('scripted');
    expect(JSON.stringify(DEFAULT_DEPLOYMENT)).toBe(before);
  });
  it('holds at approval until the visitor explicitly approves', () => {
    let run = startLabRun(deployment, id, 1, 'normal');
    for (let i = 0; i < 10; i++) run = advanceLabRun(run, false);
    expect(run.execution.state).toBe('approval-required');
    expect(run.execution.communications.some(c => c.sent)).toBe(false);
    run = approveLabRun(run, 'visitor');
    run = advanceLabRun(run, false);
    expect(run.execution.state).toBe('in-action');
    expect(run.approval).toBe('visitor');
  });
  it('blocks closure on withheld evidence and closes after evidence is supplied', () => {
    let run = startLabRun(deployment, id, 1, 'missing-evidence');
    for (let i = 0; i < 12; i++) run = advanceLabRun(run, true);
    expect(run.execution.state).toBe('resolved');
    expect(getMandatoryEvidenceGaps(run.execution).length).toBeGreaterThan(0);
    run = supplyLabEvidence(run);
    run = advanceLabRun(run, true);
    expect(run.execution.state).toBe('closed');
  });
  it('holds injected escalation until acknowledged, including scripted mode', () => {
    let run = startLabRun(deployment, id, 1, 'escalation');
    for (let i = 0; i < 12; i++) run = advanceLabRun(run, true);
    expect(run.execution.state).toBe('escalated');
    expect(run.execution.escalations[0].acknowledged).toBe(false);
    run = acknowledgeLabEscalation(run);
    for (let i = 0; i < 5; i++) run = advanceLabRun(run, true);
    expect(run.execution.state).toBe('closed');
    expect(run.execution.escalations).toHaveLength(1);
  });
  it('refuses inactive scenarios and unactivated deployment configuration', () => {
    const inactive = deployment.scenarios.find(s => !s.active)!;
    expect(() => startLabRun(deployment, inactive.scenarioId, 1, 'normal')).toThrow(/inactive/);
    expect(() => startLabRun({ ...deployment, deploymentStatus: 'draft' }, id, 1, 'normal')).toThrow(/not been activated/);
  });
  it('keeps approval and evidence actions scoped to the correct stage', () => {
    const run = startLabRun(deployment, id, 1, 'normal');
    expect(approveLabRun(run, 'visitor')).toBe(run);
    expect(supplyLabEvidence(run)).toBe(run);
    expect(acknowledgeLabEscalation(run)).toBe(run);
  });
});
