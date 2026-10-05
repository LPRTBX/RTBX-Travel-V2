/**
 * Live evidence snapshot for the Operations Centre proof summary. Computed from the
 * same synthetic engine and fixtures the Simulation Lab runs, so the displayed
 * figures cannot drift from the implementation. Synthetic results only.
 */
import { createHotelSession, createHotelSignals, ingestHotelSignal, advanceHotelSession, checkHotelRead } from './mockHotel';
import { simulateHotelCase, proposeHotelLearning, reviewHotelLearning, mergeApprovedHotelPolicy,
  runHotelLearningCycle, hotelFaultForSignal } from './hotelLearning';

export interface TravelEvidenceSnapshot {
  signals: number; paths: number; closed: number; approvalHeld: number; evidenceHeld: number; gateFailures: number;
  cycle1: { met: number; notMet: number; pending: number };
  cycle2: { met: number; notMet: number; pending: number };
  approvedChanges: number;
}

export function getTravelEvidenceSnapshot(): TravelEvidenceSnapshot {
  const signals = createHotelSignals(1);
  let session = signals.reduce(ingestHotelSignal, createHotelSession());
  for (let step = 0; step < 12; step++) session = advanceHotelSession(session);
  const state = (s: string) => session.reads.filter(r => r.run.execution.state === s).length;
  const baseline = signals.map((s, i) => simulateHotelCase(s, hotelFaultForSignal(i)));
  // Snapshot assumes the reviewer approves every proposal; the Lab lets a visitor approve or reject each one.
  const reviewed = baseline.map(proposeHotelLearning).map(p => p && reviewHotelLearning(p, 'approved', 'synthetic-duty-manager'));
  const next = runHotelLearningCycle(2, mergeApprovedHotelPolicy(reviewed));
  const tally = (cases: typeof baseline) => ({
    met: cases.filter(c => c.outcome === 'met').length,
    notMet: cases.filter(c => c.outcome === 'not-met').length,
    pending: cases.filter(c => c.outcome === 'pending').length,
  });
  return {
    signals: session.reads.length, paths: new Set(signals.map(s => s.path)).size,
    closed: state('closed'), approvalHeld: state('approval-required'), evidenceHeld: state('resolved'),
    gateFailures: session.reads.flatMap(checkHotelRead).length,
    cycle1: tally(baseline), cycle2: tally(next), approvedChanges: reviewed.filter(Boolean).length,
  };
}
