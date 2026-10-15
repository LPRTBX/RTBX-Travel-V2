/**
 * Travel pressure-test estate.
 *
 * 10 deterministic synthetic operating environments x 10 unique signal journeys.
 * Every pathway runs the existing canonical Travel loop. Approval-required cases
 * get a correct synthetic approval on the canonical run plus a separate withheld/
 * wrong-authority challenge. Delegated-authority cases are separately proved to
 * continue without a human approval gate.
 *
 * Synthetic evidence only: no live hotel, vendor, authenticated human or dispatch.
 */
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';
import { TRAVEL_PLAYBOOKS } from '../data/travelPlaybooks';
import { generateLearning } from '../lib/runtimeEngine';
import { createHotelSignals, type HotelSignal } from './mockHotel';
import {
  BASELINE_POLICY,
  approveHotelDecision,
  createHotelCase,
  dispatchHotelAction,
  mockHotelFollowUp,
  prepareHotelDecision,
  proposeHotelLearning,
  replayHotelLearning,
  reviewHotelLearning,
  simulateHotelCase,
  verifyHotelOutcome,
  type Fault,
  type FollowUpConditions,
  type HotelCase,
  type LearningPolicy,
} from './hotelLearning';

export interface PressureEnvironment {
  id: string;
  name: string;
  purpose: string;
  faultPattern: Fault[];
  conditions: FollowUpConditions;
}

export const PRESSURE_ENVIRONMENTS: PressureEnvironment[] = [
  {
    id: 'normal-control',
    name: 'Normal operations control',
    purpose: 'Establish the no-fault baseline before introducing operating pressure.',
    faultPattern: ['none'],
    conditions: {},
  },
  {
    id: 'peak-demand-latency',
    name: 'Peak demand latency',
    purpose: 'Test whether response-time learning is sufficient when operating demand keeps the floor above target.',
    faultPattern: ['late-response'],
    conditions: { minimumResponseMinutes: 25 },
  },
  {
    id: 'recoverable-capacity',
    name: 'Recoverable intervention capacity',
    purpose: 'Test an ineffective first intervention that should improve after a reviewed second-attempt policy.',
    faultPattern: ['ineffective-action'],
    conditions: { requiredInterventionAttempts: 2 },
  },
  {
    id: 'hard-capacity-limit',
    name: 'Hard intervention capacity limit',
    purpose: 'Test when the reviewed two-attempt policy is still insufficient and the learning loop must report persistent pressure.',
    faultPattern: ['ineffective-action'],
    conditions: { requiredInterventionAttempts: 3 },
  },
  {
    id: 'recoverable-receipt-loss',
    name: 'Recoverable delivery receipt loss',
    purpose: 'Test missing acknowledgement that should improve when a reviewed retry attempt is added.',
    faultPattern: ['missing-receipt'],
    conditions: { requiredReceiptAttempts: 2 },
  },
  {
    id: 'hard-receipt-loss',
    name: 'Hard delivery receipt loss',
    purpose: 'Test when the reviewed retry policy cannot establish delivery evidence.',
    faultPattern: ['missing-receipt'],
    conditions: { requiredReceiptAttempts: 3 },
  },
  {
    id: 'measurement-blind-spot',
    name: 'Measurement blind spot',
    purpose: 'Keep the case operationally unresolved when outcome measurement is absent and prevent unsupported learning changes.',
    faultPattern: ['missing-measurement'],
    conditions: {},
  },
  {
    id: 'mixed-fault-storm',
    name: 'Mixed fault storm',
    purpose: 'Rotate response delay, ineffective action, missing receipt, missing measurement and healthy control signals.',
    faultPattern: ['late-response', 'ineffective-action', 'missing-receipt', 'missing-measurement', 'none'],
    conditions: {},
  },
  {
    id: 'learning-replay',
    name: 'Learning replay environment',
    purpose: 'Concentrate learnable failures and verify reviewed proposals against a fresh execution.',
    faultPattern: ['late-response', 'ineffective-action', 'missing-receipt'],
    conditions: {},
  },
  {
    id: 'compound-pressure',
    name: 'Compound operating pressure',
    purpose: 'Mix faults with elevated response, intervention and receipt requirements to expose improvements that do not fully solve the environment.',
    faultPattern: ['late-response', 'ineffective-action', 'missing-receipt', 'none'],
    conditions: { minimumResponseMinutes: 22, requiredInterventionAttempts: 2, requiredReceiptAttempts: 2 },
  },
];

export type AuthorityChallengeMode = 'approval-withheld' | 'delegated-authority';
export interface AuthorityChallengeResult {
  mode: AuthorityChallengeMode;
  approvalRequired: boolean;
  gateState: string;
  result: 'blocked-as-designed' | 'executed-with-delegated-authority';
  wrongRoleRejected: boolean | null;
  finalState: string;
}

export interface PressureLearningResult {
  runtimeLearning: {
    evidenceQuality: string;
    nextAction: string;
    outcomeEvidence: string;
    patterns: string[];
    improvements: string[];
  } | null;
  proposal: {
    reasons: string[];
    candidate: LearningPolicy;
    decision: 'approved';
  } | null;
  replayOutcome: HotelCase['outcome'] | null;
  replayState: string | null;
  learningEffect: 'not-needed' | 'no-proposal' | 'improved-to-met' | 'persistent-pressure';
}

export interface PressurePathwayResult {
  pathwayId: string;
  environmentId: string;
  environmentName: string;
  environmentPurpose: string;
  signal: {
    eventId: string;
    sourcePath: string;
    kind: string;
    scenarioId: string;
    condition: string;
  };
  pressure: {
    fault: Fault;
    conditions: FollowUpConditions;
  };
  authority: AuthorityChallengeResult;
  canonical: {
    approvalRequired: boolean;
    approvalRoleId: string;
    accountableRoleId: string;
    decisions: number;
    outcome: HotelCase['outcome'];
    reasons: string[];
    finalState: string;
    escalations: number;
    evidenceComplete: boolean;
  };
  learning: PressureLearningResult;
}

function wrongRoleFor(caseAtGate: HotelCase): string {
  const forbidden = caseAtGate.execution.approvalRoleId;
  return ['front-office', 'operations-manager', 'duty-manager', 'maintenance-lead', 'guest-services']
    .find(role => role !== forbidden) ?? 'synthetic-unauthorised-role';
}

export function runAuthorityChallenge(signal: HotelSignal): AuthorityChallengeResult {
  let challenged = prepareHotelDecision(createHotelCase(signal));
  if (challenged.execution.approvalRequired) {
    let blocked = false;
    try { dispatchHotelAction(challenged); } catch { blocked = true; }
    if (!blocked) throw new Error('Approval-required pathway bypassed the human gate');

    let wrongRoleRejected = false;
    try { approveHotelDecision(challenged, wrongRoleFor(challenged)); } catch { wrongRoleRejected = true; }
    if (!wrongRoleRejected) throw new Error('Wrong approval role was accepted');

    return {
      mode: 'approval-withheld',
      approvalRequired: true,
      gateState: challenged.execution.state,
      result: 'blocked-as-designed',
      wrongRoleRejected,
      finalState: challenged.execution.state,
    };
  }

  challenged = approveHotelDecision(challenged, challenged.execution.accountableRoleId);
  challenged = dispatchHotelAction(challenged);
  const observation = mockHotelFollowUp(challenged, 'none');
  challenged = verifyHotelOutcome(challenged, observation);
  return {
    mode: 'delegated-authority',
    approvalRequired: false,
    gateState: 'decision-required',
    result: 'executed-with-delegated-authority',
    wrongRoleRejected: null,
    finalState: challenged.execution.state,
  };
}

function runtimeLearningFor(c: HotelCase): PressureLearningResult['runtimeLearning'] {
  if (c.execution.state !== 'closed') return null;
  const scenario = TRAVEL_SCENARIOS.find(item => item.id === c.execution.scenarioId);
  if (!scenario) throw new Error('Missing canonical scenario for learning');
  const playbook = TRAVEL_PLAYBOOKS.find(item => item.id === c.execution.playbookId);
  if (!playbook) throw new Error('Missing canonical playbook for learning');
  const learning = generateLearning(c.execution, scenario, playbook);
  return {
    evidenceQuality: learning.evidenceQuality,
    nextAction: learning.nextAction,
    outcomeEvidence: learning.outcomeEvidence,
    patterns: [...learning.patterns],
    improvements: [...learning.improvements],
  };
}

function runLearning(c: HotelCase, fault: Fault, conditions: FollowUpConditions): PressureLearningResult {
  const runtimeLearning = runtimeLearningFor(c);
  const proposal = proposeHotelLearning(c);
  if (!proposal) {
    return {
      runtimeLearning,
      proposal: null,
      replayOutcome: null,
      replayState: null,
      learningEffect: c.outcome === 'met' ? 'not-needed' : 'no-proposal',
    };
  }
  const reviewed = reviewHotelLearning(proposal, 'approved', 'synthetic-duty-manager');
  const replay = replayHotelLearning(c, reviewed, fault, conditions);
  const improved = c.outcome !== 'met' && replay.outcome === 'met';
  return {
    runtimeLearning,
    proposal: {
      reasons: [...reviewed.reasons],
      candidate: { ...reviewed.candidate },
      decision: 'approved',
    },
    replayOutcome: replay.outcome,
    replayState: replay.execution.state,
    learningEffect: improved ? 'improved-to-met' : 'persistent-pressure',
  };
}

export function runPressurePathway(
  signal: HotelSignal,
  environment: PressureEnvironment,
  localIndex: number,
): PressurePathwayResult {
  const fault = environment.faultPattern[localIndex % environment.faultPattern.length];
  const canonical = simulateHotelCase(signal, fault, BASELINE_POLICY, undefined, environment.conditions);
  const authority = runAuthorityChallenge(signal);
  const learning = runLearning(canonical, fault, environment.conditions);
  return {
    pathwayId: 'pressure:' + environment.id + ':' + signal.eventId,
    environmentId: environment.id,
    environmentName: environment.name,
    environmentPurpose: environment.purpose,
    signal: {
      eventId: signal.eventId,
      sourcePath: signal.path,
      kind: signal.kind,
      scenarioId: canonical.execution.scenarioId,
      condition: signal.condition,
    },
    pressure: { fault, conditions: { ...environment.conditions } },
    authority,
    canonical: {
      approvalRequired: canonical.execution.approvalRequired,
      approvalRoleId: canonical.execution.approvalRoleId,
      accountableRoleId: canonical.execution.accountableRoleId,
      decisions: canonical.execution.decisions.length,
      outcome: canonical.outcome,
      reasons: [...canonical.reasons],
      finalState: canonical.execution.state,
      escalations: canonical.execution.escalations.length,
      evidenceComplete: canonical.execution.evidence.filter(item => item.required).every(item => item.captured),
    },
    learning,
  };
}

export function runTravelPressureEstate(cycle = 7001): PressurePathwayResult[] {
  const signals = createHotelSignals(cycle);
  if (signals.length !== 100) throw new Error('Pressure estate requires exactly 100 source signals');
  if (PRESSURE_ENVIRONMENTS.length !== 10) throw new Error('Pressure estate requires exactly 10 environments');
  return signals.map((signal, index) => {
    const environment = PRESSURE_ENVIRONMENTS[Math.floor(index / 10)];
    return runPressurePathway(signal, environment, index % 10);
  });
}

export interface PressureEnvironmentSummary {
  environmentId: string;
  name: string;
  pathways: number;
  approvalRequired: number;
  delegatedAuthority: number;
  approvalChallengesBlocked: number;
  canonicalOutcomes: { met: number; 'not-met': number; pending: number };
  learningProposals: number;
  learningImproved: number;
  persistentPressure: number;
  noProposal: number;
}

export function summarisePressureEstate(results: PressurePathwayResult[]): PressureEnvironmentSummary[] {
  return PRESSURE_ENVIRONMENTS.map(environment => {
    const rows = results.filter(row => row.environmentId === environment.id);
    return {
      environmentId: environment.id,
      name: environment.name,
      pathways: rows.length,
      approvalRequired: rows.filter(row => row.canonical.approvalRequired).length,
      delegatedAuthority: rows.filter(row => !row.canonical.approvalRequired).length,
      approvalChallengesBlocked: rows.filter(row => row.authority.result === 'blocked-as-designed').length,
      canonicalOutcomes: {
        met: rows.filter(row => row.canonical.outcome === 'met').length,
        'not-met': rows.filter(row => row.canonical.outcome === 'not-met').length,
        pending: rows.filter(row => row.canonical.outcome === 'pending').length,
      },
      learningProposals: rows.filter(row => row.learning.proposal).length,
      learningImproved: rows.filter(row => row.learning.learningEffect === 'improved-to-met').length,
      persistentPressure: rows.filter(row => row.learning.learningEffect === 'persistent-pressure').length,
      noProposal: rows.filter(row => row.learning.learningEffect === 'no-proposal').length,
    };
  });
}
