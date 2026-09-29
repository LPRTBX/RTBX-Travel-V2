/** UI test driver for the canonical runtime; no external dispatch or saved deployment writes. */
import type { TravelDeploymentConfig } from '@/data/travelDeploymentConfig';
import { TRAVEL_SCENARIOS } from '@/data/travelScenarios';
import { TRAVEL_PLAYBOOKS } from '@/data/travelPlaybooks';
import { getScenarioRuntimeReadiness } from './travelScenarioRouting';
import { createExecution, transitionExecution, captureEvidence, recordOutcome,
  sendCommunication, triggerEscalation, acknowledgeEscalation,
  getMandatoryEvidenceGaps, type ScenarioExecution } from './runtimeEngine';

export type LabCondition = 'normal' | 'escalation' | 'missing-evidence';
export interface LabRun {
  execution: ScenarioExecution;
  number: number;
  condition: LabCondition;
  approval?: 'visitor' | 'scripted';
  error?: string;
}
export function startLabRun(deployment: TravelDeploymentConfig, scenarioId: string,
  number: number, condition: LabCondition): LabRun {
  const readiness = getScenarioRuntimeReadiness(deployment, scenarioId);
  if (!readiness.ready) throw new Error(readiness.reason);
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === scenarioId)!;
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId)!;
  return { execution: createExecution({ deployment, scenario, playbook }), number, condition };
}
export function approveLabRun(run: LabRun, source: 'visitor' | 'scripted'): LabRun {
  if (run.execution.state !== 'approval-required') return run;
  return { ...run, approval: source };
}
export function supplyLabEvidence(run: LabRun): LabRun {
  if (run.execution.state !== 'resolved') return run;
  let execution = run.execution;
  for (const item of execution.evidence.filter(e => e.required && !e.captured)) {
    execution = captureEvidence(execution, item.id, {
      capturedByRole: item.ownerRoleId, note: 'Synthetic evidence supplied in the Simulation Lab',
    });
  }
  return { ...run, execution };
}
export function advanceLabRun(run: LabRun, scriptedApprovals: boolean): LabRun {
  if (run.error || run.execution.state === 'closed') return run;
  let nextRun = run;
  let execution = run.execution;
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === execution.scenarioId)!;
  const move = (to: ScenarioExecution['state']) => {
    const next = transitionExecution(execution, to, scenario, 'Simulation Lab synthetic step');
    if (!next) throw new Error(`Engine blocked transition to ${to}`);
    execution = next;
  };
  try {
    switch (execution.state) {
      case 'signal-received': move('understanding'); break;
      case 'understanding': move('decision-required'); break;
      case 'decision-required': move('approval-required'); break;
      case 'approval-required':
        if (!run.approval && scriptedApprovals) nextRun = approveLabRun(run, 'scripted');
        if (!nextRun.approval) return run;
        move('in-action');
        break;
      case 'in-action':
        if (run.condition === 'escalation' && execution.escalations.length === 0) {
          execution = triggerEscalation(execution, 'Injected test escalation; no real alert', execution.accountableRoleId);
          move('escalated');
          break;
        }
        for (const comm of execution.communications) {
          execution = sendCommunication(execution, comm.id,
            nextRun.approval ? execution.accountableRoleId : undefined);
        }
        for (const item of execution.evidence.filter(e => e.required)) {
          if (run.condition !== 'missing-evidence') {
            execution = captureEvidence(execution, item.id, { capturedByRole: item.ownerRoleId,
              note: 'Synthetic fixture; not operational evidence' });
          }
        }
        for (const outcome of execution.outcomes) {
          execution = recordOutcome(execution, outcome.id, 'not-measured', 'Simulation only');
        }
        move('resolved');
        break;
      case 'escalated':
        // Keep the escalation visible until the visitor acknowledges it.
        if (!execution.escalations.every(e => e.acknowledged)) return run;
        move('in-action'); break;
      case 'resolved':
        if (getMandatoryEvidenceGaps(execution).length) return run;
        move('closed'); break;
    }
    return { ...nextRun, execution };
  } catch (error) {
    return { ...nextRun, execution, error: error instanceof Error ? error.message : String(error) };
  }
}
export function acknowledgeLabEscalation(run: LabRun): LabRun {
  if (run.execution.state !== 'escalated') return run;
  return { ...run, execution: run.execution.escalations.reduce((exec, item) =>
    acknowledgeEscalation(exec, item.id), run.execution) };
}
