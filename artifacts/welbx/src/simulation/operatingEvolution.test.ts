import { describe, expect, it } from 'vitest';
import { initialEvolution, runEvolutionCycle, evolutionCandidate, reviewEvolution, rollbackEvolution, EVOLUTION_REVIEWER } from './operatingEvolution';
const conditions = { capacity: 20, measured: true, forecastAvailable: true };
const baseline = () => runEvolutionCycle(runEvolutionCycle(initialEvolution(), conditions), conditions);
const early = () => reviewEvolution(baseline(), EVOLUTION_REVIEWER, true, 'Test earlier preparation');
const refined = () => reviewEvolution(runEvolutionCycle(early(), conditions), EVOLUTION_REVIEWER, true, 'Remove unnecessary preparation');
describe('reviewed operating evolution', () => {
  it('requires repeated measured cycles before proposing earlier action', () => {
    expect(evolutionCandidate(runEvolutionCycle(initialEvolution(), conditions))).toBeNull();
    expect(evolutionCandidate(baseline())?.sourceCycles).toEqual(['cycle-1', 'cycle-2']);
    expect(baseline().cycles[0]).toMatchObject({ delays: 20, staffMinutes: 640, savedMinutes: 0, preparations: 0 });
  });
  it('cannot activate a proposal without authorised review', () => {
    expect(baseline().policy).toBe(1);
    expect(() => reviewEvolution(baseline(), 'guest', true, 'yes')).toThrow();
    expect(() => reviewEvolution(baseline(), EVOLUTION_REVIEWER, true, '')).toThrow();
    expect(() => reviewEvolution(initialEvolution(), EVOLUTION_REVIEWER, true, 'yes')).toThrow();
  });
  it('records rejection without changing policy or evidence', () => {
    const next = reviewEvolution(baseline(), EVOLUTION_REVIEWER, false, 'Capacity needs review');
    expect(next.policy).toBe(1); expect(next.reviews[0].decision).toBe('rejected'); expect(next.cycles).toHaveLength(2);
    expect(evolutionCandidate(next)).toBeNull();
    expect(evolutionCandidate(runEvolutionCycle(next, conditions))?.policy).toBe(2);
  });
  it('reveals unnecessary tasks and limited capacity under the first proactive rule', () => {
    const next = runEvolutionCycle(early(), conditions).cycles.at(-1)!;
    expect(next).toMatchObject({ alerts: 30, preparations: 20, holds: 10, unnecessary: 7, delays: 7, staffMinutes: 514, savedMinutes: 126, prevented: 13 });
  });
  it('requires another review before a corroborated rule is active', () => {
    const state = runEvolutionCycle(early(), conditions);
    expect(state.policy).toBe(2); expect(evolutionCandidate(state)?.policy).toBe(3);
    expect(refined().reviews.at(-1)?.sourceCycles).toEqual(['cycle-3']);
  });
  it('reduces false preparation using an input forecast rather than outcome truth', () => {
    const cycle = runEvolutionCycle(refined(), conditions).cycles.at(-1)!;
    expect(cycle).toMatchObject({ alerts: 20, preparations: 20, unnecessary: 0, delays: 0, staffMinutes: 360, savedMinutes: 280 });
    expect(cycle.traces[1]).toMatchObject({ roomReady: false, forecastMinutes: -10, alerted: false });
  });
  it('shows no prevention benefit when preparation capacity is zero', () => {
    expect(runEvolutionCycle(refined(), { ...conditions, capacity: 0 }).cycles.at(-1)).toMatchObject({ holds: 20, delays: 20, savedMinutes: 0 });
  });
  it('counts extra staff time when all false alerts are prepared', () => {
    const cycle = runEvolutionCycle(early(), { ...conditions, capacity: 30 }).cycles.at(-1)!;
    expect(cycle).toMatchObject({ unnecessary: 10, staffMinutes: 440, savedMinutes: 200 });
    expect(cycle.traces[1].staffMinutes).toBe(10);
  });
  it('keeps unmeasured benefits pending and excludes them from learning evidence', () => {
    const state = runEvolutionCycle(runEvolutionCycle(initialEvolution(), { ...conditions, measured: false }), { ...conditions, measured: false });
    expect(evolutionCandidate(state)).toBeNull();
    const cycle = runEvolutionCycle(refined(), { ...conditions, measured: false }).cycles.at(-1)!;
    expect(cycle).toMatchObject({ preparations: 20, delays: null, staffMinutes: null, savedMinutes: null, prevented: null, unnecessary: null });
    expect(cycle.traces.every(t => t.delayed === null && t.staffMinutes === null)).toBe(true);
  });
  it('falls back to arrival response if corroboration is unavailable', () => {
    expect(runEvolutionCycle(refined(), { ...conditions, forecastAvailable: false }).cycles.at(-1)).toMatchObject({ alerts: 0, delays: 20, savedMinutes: 0 });
  });
  it('retains earlier cycles and approval history after rollback', () => {
    const state = refined(); const next = rollbackEvolution(state, EVOLUTION_REVIEWER, 1);
    expect(next.policy).toBe(1); expect(next.cycles).toEqual(state.cycles); expect(next.reviews).toHaveLength(3);
    expect(() => rollbackEvolution(initialEvolution(), EVOLUTION_REVIEWER, 3)).toThrow();
    expect(() => rollbackEvolution(state, 'guest', 1)).toThrow();
  });
  it('copies conditions and uses cycle-specific correlation IDs', () => {
    const input = { ...conditions }; const state = runEvolutionCycle(initialEvolution(), input); input.capacity = 0;
    expect(state.cycles[0].conditions.capacity).toBe(20);
    expect(new Set(baseline().cycles.flatMap(c => c.traces.map(t => t.id))).size).toBe(200);
    expect(() => runEvolutionCycle(state, { ...conditions, capacity: -1 })).toThrow();
  });
});
