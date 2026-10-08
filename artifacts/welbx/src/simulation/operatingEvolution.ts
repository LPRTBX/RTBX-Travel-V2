/** Illustrative planning extension. This does not dispatch runtime actions or change deployed policies. */
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';
export const EVOLUTION_REVIEWER = TRAVEL_SCENARIOS.find(s => s.id === 'repeat-guest-room-not-ready')!.governanceConfig.approvalRole!;
export type ReadinessPolicy = 1 | 2 | 3;
export interface CycleConditions { capacity: number; measured: boolean; forecastAvailable: boolean }
export interface ArrivalTrace {
  id: string; roomReady: boolean; housekeepingLoad: number; forecastMinutes: number | null;
  alerted: boolean; prepared: boolean; capacityHeld: boolean;
  delayed: boolean | null; unnecessaryPreparation: boolean | null; staffMinutes: number | null;
}
export interface EvolutionCycle {
  id: string; policy: ReadinessPolicy; conditions: CycleConditions; traces: ArrivalTrace[];
  alerts: number; preparations: number; holds: number; delays: number | null;
  unnecessary: number | null; staffMinutes: number | null; savedMinutes: number | null;
  prevented: number | null; guestWaitMinutes: number | null;
}
export interface Review { id: string; policy: ReadinessPolicy; role: string; decision: 'approved' | 'rejected' | 'rollback'; reason: string; sourceCycles: string[] }
export interface EvolutionState { policy: ReadinessPolicy; cycles: EvolutionCycle[]; reviews: Review[] }
export const initialEvolution = (): EvolutionState => ({ policy: 1, cycles: [], reviews: [] });
export const DEFAULT_CYCLE_CONDITIONS: Readonly<CycleConditions> = { capacity: 20, measured: true, forecastAvailable: true };
export const MIN_REVIEW_REASON_LENGTH = 10;
/** A review reason must be the reviewer's own explanation: at least ten characters of non-whitespace text with words in it. */
export const isMeaningfulReason = (reason: string) => reason.trim().length >= MIN_REVIEW_REASON_LENGTH && /\p{L}/u.test(reason);
export const describeConditions = (c: CycleConditions) =>
  `Capacity ${c.capacity} · ${c.forecastAvailable ? 'forecast available' : 'no forecast'} · ${c.measured ? 'measured' : 'not measured'}`;
export function describeArrival(trace: ArrivalTrace, index: number): string {
  const action = trace.prepared ? 'prepared early' : trace.capacityHeld ? 'capacity hold' : 'no preparation';
  const outcome = trace.delayed === null ? 'outcome unconfirmed' : trace.delayed ? 'delayed' : 'on time';
  return `Arrival ${index + 1} · room ${trace.roomReady ? 'ready' : 'not ready'} · ${action} · ${outcome}`;
}
export function runEvolutionCycle(state: EvolutionState, conditions: CycleConditions): EvolutionState {
  if (!Number.isSafeInteger(conditions.capacity) || conditions.capacity < 0 || conditions.capacity > 100) throw new Error('Invalid preparation capacity');
  const id = `cycle-${state.cycles.length + 1}`;
  let used = 0;
  const traces = Array.from({ length: 100 }, (_, index): ArrivalTrace => {
    // The forecast is an input available before arrival. Counterfactual truth is used only for paired synthetic evaluation.
    const atRisk = index % 5 === 0;
    const transient = index % 10 === 1;
    const roomReady = !atRisk && !transient;
    const housekeepingLoad = roomReady ? 40 : 80;
    const forecastMinutes = conditions.forecastAvailable ? (atRisk ? 15 : transient ? -10 : -30) : null;
    const alerted = state.policy > 1 && !roomReady && housekeepingLoad >= 70
      && (state.policy === 2 || (forecastMinutes !== null && forecastMinutes > 0));
    const prepared = alerted && used < conditions.capacity;
    if (prepared) used++;
    const delayed = atRisk && !prepared;
    return { id: `${id}:arrival-${index + 1}`, roomReady, housekeepingLoad, forecastMinutes, alerted, prepared,
      capacityHeld: alerted && !prepared,
      delayed: conditions.measured ? delayed : null,
      unnecessaryPreparation: conditions.measured ? prepared && !atRisk : null,
      staffMinutes: conditions.measured ? 2 + (prepared ? 8 : 0) + (delayed ? 22 : 0) : null };
  });
  const count = (key: 'alerted' | 'prepared' | 'capacityHeld') => traces.filter(t => t[key]).length;
  const delays = conditions.measured ? traces.filter(t => t.delayed).length : null;
  const staffMinutes = conditions.measured ? traces.reduce((n, t) => n + t.staffMinutes!, 0) : null;
  const cycle: EvolutionCycle = { id, policy: state.policy, conditions: { ...conditions }, traces,
    alerts: count('alerted'), preparations: count('prepared'), holds: count('capacityHeld'), delays,
    unnecessary: conditions.measured ? traces.filter(t => t.unnecessaryPreparation).length : null,
    staffMinutes, savedMinutes: staffMinutes === null ? null : 640 - staffMinutes,
    prevented: delays === null ? null : 20 - delays, guestWaitMinutes: delays === null ? null : delays * 30 };
  return { ...state, cycles: [...state.cycles, cycle] };
}
export function evolutionCandidate(state: EvolutionState): { policy: ReadinessPolicy; sourceCycles: string[]; reason: string } | null {
  const measured = state.cycles.filter(c => c.policy === state.policy && c.conditions.measured);
  const reviewed = (policy: ReadinessPolicy, sources: string[]) => state.reviews.some(r => r.policy === policy
    && r.sourceCycles.length === sources.length && r.sourceCycles.every((id, i) => id === sources[i]));
  if (state.policy === 1 && measured.length >= 2 && measured.reduce((n, c) => n + c.delays!, 0) >= 20)
    return reviewed(2, measured.map(c => c.id)) ? null : { policy: 2, sourceCycles: measured.map(c => c.id), reason: 'Repeated arrival delays: check room readiness and housekeeping pressure 45 minutes before arrival.' };
  const falseAlerts = measured.filter(c => c.unnecessary! > 0);
  if (state.policy === 2 && falseAlerts.length)
    return reviewed(3, falseAlerts.map(c => c.id)) ? null : { policy: 3, sourceCycles: falseAlerts.map(c => c.id), reason: 'Early checks created unnecessary preparation. Require a forecast that readiness will miss arrival before prioritising work.' };
  return null;
}
export function reviewEvolution(state: EvolutionState, role: string, approve: boolean, reason: string): EvolutionState {
  const candidate = evolutionCandidate(state);
  if (!candidate || role !== EVOLUTION_REVIEWER || !isMeaningfulReason(reason)) throw new Error('A current candidate, authorised reviewer and review reason are required');
  const review: Review = { id: `review-${state.reviews.length + 1}`, policy: candidate.policy, role,
    decision: approve ? 'approved' : 'rejected', reason: reason.trim(), sourceCycles: [...candidate.sourceCycles] };
  return { ...state, policy: approve ? candidate.policy : state.policy, reviews: [...state.reviews, review] };
}
export function rollbackEvolution(state: EvolutionState, role: string, policy: ReadinessPolicy): EvolutionState {
  if (role !== EVOLUTION_REVIEWER || policy === state.policy || (policy !== 1 && !state.reviews.some(r => r.policy === policy && r.decision === 'approved')))
    throw new Error('Rollback requires authorised review and a previously approved policy');
  return { ...state, policy, reviews: [...state.reviews, { id: `review-${state.reviews.length + 1}`, policy, role,
    decision: 'rollback', reason: 'Return to an earlier reviewed policy for the next cycle; retain all prior evidence.', sourceCycles: state.cycles.map(c => c.id) }] };
}
