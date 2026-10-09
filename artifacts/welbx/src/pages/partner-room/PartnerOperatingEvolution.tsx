import { useState } from 'react';
import { Link } from 'wouter';
import { PartnerRoomLayout } from '@/components/PartnerRoomLayout';
import { EVOLUTION_REVIEWER, DEFAULT_CYCLE_CONDITIONS, MIN_REVIEW_REASON_LENGTH, initialEvolution, runEvolutionCycle, evolutionCandidate, reviewEvolution, rollbackEvolution, isMeaningfulReason, describeConditions, describeArrival, type CycleConditions } from '@/simulation/operatingEvolution';
import { roleLabel } from '@/lib/plainLanguage';
import './travel-evolution.css';

const POLICY = { 1: 'Respond after arrival', 2: 'Prepare 45 minutes earlier', 3: 'Corroborate and prioritise' };
const value = (n: number | null, unit = '') => n === null ? 'Unconfirmed' : `${n}${unit}`;
const REVIEW_DECISION_LABELS = { approved: 'Approved', rejected: 'Rejected', rollback: 'Rolled back' } as const;
export default function PartnerOperatingEvolution() {
  const [state, setState] = useState(initialEvolution);
  const [conditions, setConditions] = useState<CycleConditions>(() => ({ ...DEFAULT_CYCLE_CONDITIONS }));
  const [reason, setReason] = useState('');
  const [selection, setSelection] = useState(0);
  const candidate = evolutionCandidate(state);
  const latest = state.cycles.at(-1);
  const trace = latest?.traces[selection];
  const reasonReady = isMeaningfulReason(reason);
  const submitReview = (approve: boolean) => { setState(s => reviewEvolution(s, EVOLUTION_REVIEWER, approve, reason)); setReason(''); };
  const resetWalkthrough = () => { setState(initialEvolution()); setConditions({ ...DEFAULT_CYCLE_CONDITIONS }); setReason(''); setSelection(0); };
  return <PartnerRoomLayout><main className="evolution">
    <header><p className="evolution-eyebrow">Working Proof · Simulation · Operating Evolution</p>
      <h1>Every cycle should make the next one better.</h1>
      <p className="evolution-intro">Follow room readiness from a guest waiting at reception to a team preparing before arrival. See what the operation learns, who approves the change, and whether it helps the next shift.</p>
      <p className="evolution-boundary">Illustrative planning extension using synthetic arrivals. Duty Manager is the accountable reviewer. Reviews use a simulated role, not authenticated identity. No external tasks, guest messages or deployed policies are changed. This session resets when you leave or reload.</p>
    </header>
    <section aria-labelledby="evolution-guide"><h2 id="evolution-guide">Work through the full loop</h2>
      <ol className="evolution-steps"><li><strong>Observe twice.</strong> Run two comparable cycles to expose recurring delays.</li><li><strong>Review the pattern.</strong> Approve earlier preparation, or reject with a reason.</li><li><strong>Test the change.</strong> Run again. Inspect avoidable delays, extra tasks and team capacity.</li><li><strong>Refine and repeat.</strong> Review corroborating signals, challenge the next cycle and retain the history.</li></ol>
      <p>Each cycle contains 100 synthetic room arrivals with the same mix. This controlled comparison isolates policy effects; it does not establish real-world prediction accuracy.</p>
    </section>
    <section aria-labelledby="evolution-controls"><h2 id="evolution-controls">Next cycle: {POLICY[state.policy]}</h2>
      <div className="evolution-controls"><label>Housekeeping preparation capacity: <strong>{conditions.capacity} arrivals</strong><input aria-label="Housekeeping preparation capacity" type="range" min="0" max="30" value={conditions.capacity} onChange={e => setConditions({ ...conditions, capacity: Number(e.target.value) })} /></label>
        <label><input aria-label="Follow-up measurements available" type="checkbox" checked={conditions.measured} onChange={e => setConditions({ ...conditions, measured: e.target.checked })} /> Follow-up measurements available</label>
        <label><input aria-label="Readiness forecast available" type="checkbox" checked={conditions.forecastAvailable} onChange={e => setConditions({ ...conditions, forecastAvailable: e.target.checked })} /> Readiness forecast available</label></div>
      <p>Capacity limits preparation; excess alerts remain with the operator. The refined rule falls back to arrival response if its forecast is unavailable. Settings apply to the next cycle.</p>
      <div className="evolution-actions"><button onClick={() => { setState(s => runEvolutionCycle(s, conditions)); setSelection(0); }}>Run cycle {state.cycles.length + 1}</button><button className="secondary" onClick={resetWalkthrough}>Reset walkthrough</button></div>
    </section>
    <section aria-labelledby="evolution-review"><h2 id="evolution-review">Pattern → reviewed change → next cycle</h2>
      {candidate ? <><p>{candidate.reason}</p><p>Evidence: {candidate.sourceCycles.join(', ')}. Reviewer: Duty Manager. Approval changes only subsequent cycles.</p><label className="evolution-reason">Review reason<textarea value={reason} onChange={e => setReason(e.target.value)} aria-describedby="evolution-reason-hint" placeholder="e.g. Two measured cycles show the same 20 delays; test earlier preparation within housekeeping capacity." /></label>
        <p id="evolution-reason-hint" className="evolution-reason-hint">{reasonReady ? 'Your reason is recorded with this review.' : `Explain the decision in your own words (at least ${MIN_REVIEW_REASON_LENGTH} characters) to approve or reject.`}</p>
        <div className="evolution-actions"><button disabled={!reasonReady} onClick={() => submitReview(true)}>Approve policy v{candidate.policy} for next cycle</button><button className="secondary" disabled={!reasonReady} onClick={() => submitReview(false)}>Reject and retain current policy</button></div></> : <p>{state.policy === 3 ? 'The refined rule is active. Challenge capacity or remove the forecast or measurements, then compare the next cycle. Further changes still need evidence and review.' : 'Run comparable measured cycles to build the evidence for a proposed change.'}</p>}
      {state.policy !== 1 && <button className="secondary" onClick={() => setState(s => rollbackEvolution(s, EVOLUTION_REVIEWER, 1))}>Duty Manager: roll back to arrival response</button>}
    </section>
    <section aria-labelledby="evolution-results"><h2 id="evolution-results">Impact per 100 arrivals</h2><div className="evolution-table"><table><thead><tr><th>Cycle / policy</th><th>Conditions when run</th><th>Early alerts</th><th>Prepared / held</th><th>Unnecessary prep</th><th>Delayed arrivals</th><th>Staff minutes</th><th>Minutes released</th></tr></thead><tbody>
      {state.cycles.map(c => <tr key={c.id}><th>{c.id} · v{c.policy}</th><td>{describeConditions(c.conditions)}</td><td>{c.alerts}</td><td>{c.preparations} / {c.holds}</td><td>{value(c.unnecessary)}</td><td>{value(c.delays)}</td><td>{value(c.staffMinutes)}</td><td>{value(c.savedMinutes)}</td></tr>)}
      {!state.cycles.length && <tr><td colSpan={8}>Run the first cycle to establish a baseline.</td></tr>}
    </tbody></table></div><p>Model assumptions: 2 staff minutes per arrival, 8 additional minutes per preparation, 22 additional minutes per delayed arrival, and a 30-minute guest wait per delay. The paired arrival-response reference is 640 staff minutes and 20 delays. Negative minutes released mean extra work. Unmeasured cycles cannot confirm a benefit.</p></section>
    {latest && <section aria-labelledby="evolution-human"><h2 id="evolution-human">What changes for people and the bottom line?</h2><div className="evolution-cards">
      {latest.conditions.measured ? <>
        <article><h3>Guest</h3><p>{latest.prevented} modelled delays avoided against the paired reference. {latest.guestWaitMinutes} total guest waiting minutes remain.</p></article>
        <article><h3>Housekeeping</h3><p>{latest.preparations} preparation tasks, {latest.holds} capacity holds, {latest.unnecessary} unnecessary preparations. Earlier work still consumes real capacity.</p></article>
        <article><h3>Reception and Duty Manager</h3><p>{latest.delays} arrival delays need response. {latest.savedMinutes} staff minutes released across the teams; review alerts and carry the approved policy into the next simulated shift.</p></article>
      </> : <>
        <article><h3>Guest</h3><p>This cycle ran without follow-up measurements, so delays avoided and guest waiting time are not confirmed.</p></article>
        <article><h3>Housekeeping</h3><p>{latest.preparations} preparation tasks and {latest.holds} capacity holds were recorded. Whether any preparation was unnecessary is not confirmed without measurement.</p></article>
        <article><h3>Reception and Duty Manager</h3><p>Arrival delays and staff minutes released are not confirmed for this cycle. Restore measurements before relying on its results.</p></article>
      </>}
      <article><h3>Financial impact</h3><p>Released time is capacity, not automatic payroll savings. Avoided recovery spend and added revenue need separate evidence. <Link href="/partner-room/proof-calculator">Model labour and financial ranges →</Link></p></article>
    </div><p>Maintenance, partner activation and portfolio rollout are outside this readiness fixture. In a pilot, check that earlier housekeeping work does not displace other service commitments before expanding a reviewed rule.</p></section>}
    {trace && <section aria-labelledby="evolution-trace"><h2 id="evolution-trace">Inspect the moment, action and evidence</h2><label>Arrival in cycle {state.cycles.length} (latest, 100 synthetic arrivals) <select value={selection} onChange={e => setSelection(Number(e.target.value))}>{latest!.traces.map((t, i) => <option key={t.id} value={i}>{describeArrival(t, i)}</option>)}</select></label>
      <dl className="evolution-ledger"><dt>Correlation</dt><dd>{trace.id} · policy v{latest!.policy}</dd><dt>Cycle conditions</dt><dd>{describeConditions(latest!.conditions)}</dd><dt>Signals before arrival</dt><dd>Room {trace.roomReady ? 'ready' : 'not ready'}; housekeeping load {trace.housekeepingLoad}%; forecast {trace.forecastMinutes === null ? 'unavailable' : `${trace.forecastMinutes} minutes relative to arrival`}.</dd><dt>Recognition and action</dt><dd>{trace.prepared ? 'Flagged 45 minutes early; simulated housekeeping preparation recorded.' : trace.capacityHeld ? 'Flagged early; capacity hold retained for operator review.' : 'No preparation; arrival response remains available.'}</dd><dt>Follow-up</dt><dd>Delayed: {trace.delayed === null ? 'unconfirmed' : trace.delayed ? 'yes' : 'no'}. Staff minutes: {value(trace.staffMinutes)}. Outcome source: synthetic paired fixture.</dd></dl>
    </section>}
    <section><h2>Review and version history</h2>{state.reviews.length ? <ol>{state.reviews.map(r => <li key={r.id}><strong>{r.id.replace('review-', 'Review ')} · {REVIEW_DECISION_LABELS[r.decision]} · policy v{r.policy}</strong> · {roleLabel(r.role)}<p>{r.reason} Evidence: {r.sourceCycles.join(', ')}.</p></li>)}</ol> : <p>No reviewed changes yet. Policy v1 is the starting reference.</p>}<p>Learning means retaining measured outcomes, reviewing a proposed operating change, and testing the next cycle. A pilot must validate signal quality, approvals, workloads and outcomes before a property adopts the change.</p></section>
    <footer className="evolution-actions"><Link href="/partner-room/architecture-lab">Inspect the architecture →</Link><Link href="/partner-room/operations">Execute a canonical scenario →</Link><Link href="/partner-room/impact-map">Explore the wider operation →</Link><Link href="/partner-room/pilot-model">Turn the loop into a pilot →</Link></footer>
  </main></PartnerRoomLayout>;
}
