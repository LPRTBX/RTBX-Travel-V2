import { useState } from 'react';
import { TRAVEL_ROLES } from '@/data/travelRoles';
import { createHotelSignals, PATH_LABELS } from '@/simulation/mockHotel';
import { simulateHotelCase, hotelFaultForSignal, proposeHotelLearning, reviewHotelLearning,
  replayHotelLearning, reconcileHotelFollowUp, mockHotelFollowUp, mergeApprovedHotelPolicy,
  runHotelLearningCycle, BASELINE_POLICY, type HotelCase, type LearningPolicy, type Proposal } from '@/simulation/hotelLearning';

type Row = { baseline: HotelCase; proposal: Proposal | null; replay?: HotelCase; reconciled?: HotelCase; index: number };
type CycleResult = { cycle: number; policy: LearningPolicy; cases: HotelCase[] };
const OUTCOME_LABELS = { met: 'Outcome met', 'not-met': 'Outcome not met', pending: 'Pending evidence' } as const;
const REASON_LABELS: Record<string, string> = {
  'late-response': 'response later than the 20-minute target',
  'ineffective-action': 'action delivered but the issue was not restored',
  'missing-receipt': 'no delivery receipt',
  'missing-measurement': 'no follow-up measurement',
};
const count = (cases: HotelCase[], outcome: HotelCase['outcome']) => cases.filter(c => c.outcome === outcome).length;
const describe = (reasons: string[]) => reasons.map(r => REASON_LABELS[r] ?? r).join('; ');

export function HotelLearningPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  const [nextCycle, setNextCycle] = useState<CycleResult | null>(null);
  const current = rows[selected];
  const baselineCases = rows.map(r => r.baseline);
  const proposals = rows.map(r => r.proposal);
  const pendingReview = rows.filter(r => r.proposal?.decision === 'pending').length;
  const approved = rows.filter(r => r.proposal?.decision === 'approved').length;
  const rejected = rows.filter(r => r.proposal?.decision === 'rejected').length;
  const run = () => {
    try {
      setRows(createHotelSignals().map((signal, index) => {
        const baseline = simulateHotelCase(signal, hotelFaultForSignal(index));
        return { baseline, proposal: proposeHotelLearning(baseline), index };
      }));
      setSelected(0); setError(''); setNextCycle(null);
    } catch (e) { setError(String(e)); }
  };
  const reviewRow = (row: Row, decision: 'approved' | 'rejected'): Row => {
    if (!row.proposal || row.proposal.decision !== 'pending') return row;
    const proposal = reviewHotelLearning(row.proposal, decision, 'synthetic-duty-manager');
    const replay = decision === 'approved' ? replayHotelLearning(row.baseline, proposal, hotelFaultForSignal(row.index)) : undefined;
    return { ...row, proposal, replay };
  };
  const review = (decision: 'approved' | 'rejected') => {
    try { setRows(rows.map((r, i) => i === selected ? reviewRow(r, decision) : r)); setError(''); setNextCycle(null); }
    catch (e) { setError(String(e)); }
  };
  const approveAll = () => {
    try { setRows(rows.map(r => reviewRow(r, 'approved'))); setError(''); setNextCycle(null); }
    catch (e) { setError(String(e)); }
  };
  // Delay path: correlated evidence arrives later for a pending case; the earlier observation is kept in the audit.
  const recordLateEvidence = () => {
    if (!current || current.baseline.outcome !== 'pending' || current.reconciled) return;
    try {
      const reconciled = reconcileHotelFollowUp(current.baseline, mockHotelFollowUp(current.baseline, 'none'));
      setRows(rows.map((r, i) => i === selected ? { ...r, reconciled } : r)); setError('');
    } catch (e) { setError(String(e)); }
  };
  const runNext = () => {
    try {
      const policy = mergeApprovedHotelPolicy(proposals, BASELINE_POLICY, 2);
      setNextCycle({ cycle: 2, policy, cases: runHotelLearningCycle(2, policy) }); setError('');
    } catch (e) { setError(String(e)); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ schemaVersion: 'jaldo.hotel-learning-browser.v2',
      evidenceLevel: 'synthetic-closed-loop', exportedAt: new Date().toISOString(), rows,
      nextCycle: nextCycle && { cycle: nextCycle.cycle, policy: nextCycle.policy,
        outcomes: { met: count(nextCycle.cases, 'met'), notMet: count(nextCycle.cases, 'not-met'), pending: count(nextCycle.cases, 'pending') } },
      limits: 'Scripted actors and reviewer; synthetic follow-up metric; no production policy change.' }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'jaldo-hotel-outcome-learning.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const outcome = (r: Row) => (r.reconciled ?? r.replay ?? r.baseline).outcome;
  return <section className="jsim-monitor" aria-label="Hotel outcome and learning loop">
    <div className="jsim-monitor-heading"><div><p className="jsim-eyebrow">DECISION → ACTION → OUTCOME → LEARNING → NEXT CYCLE</p>
      <h2>Did the action work?</h2></div><button className="jsim-secondary" onClick={run}>{rows.length ? 'Reset outcome cycle' : 'Run 100 outcome journeys'}</button></div>
    <p className="jsim-hint">Each journey is followed up against one synthetic target: a delivery receipt and the issue restored within 20 minutes.
      Scripted actors approve the initial actions. Failures produce a proposed change; a reviewer approves or rejects it; approved changes can be carried into the next cycle of 100 fresh signals. Nothing leaves this browser.</p>
    {error && <p className="jsim-error" role="alert">{error}</p>}
    {!!rows.length && <>
      <div className="jsim-metrics">{(['met', 'not-met', 'pending'] as const).map(status => <div key={status}><span>{OUTCOME_LABELS[status]}</span>
        <strong>{rows.filter(r => outcome(r) === status).length}</strong><small>Cycle 1, after reviews and late evidence</small></div>)}
        <div><span>Proposals</span><strong>{approved}</strong><small>approved · {rejected} rejected · {pendingReview} awaiting review</small></div></div>
      <label>Select a journey <select value={selected} onChange={e => setSelected(Number(e.target.value))}>
        {rows.map((r, i) => <option key={r.baseline.signal.eventId} value={i}>{PATH_LABELS[r.baseline.signal.path]} · Room {r.baseline.signal.room} · {OUTCOME_LABELS[outcome(r)]}{r.proposal?.decision === 'pending' ? ' · review needed' : ''}</option>)}
      </select></label>
      {current && <div className="jsim-detail-grid"><section className="jsim-stream">
        <h3>Baseline journey</h3><p className="jsim-owner">Accountable role<strong>{TRAVEL_ROLES.find(r => r.id === current.baseline.execution.accountableRoleId)?.name ?? current.baseline.execution.accountableRoleId}</strong></p>
        <ol className="jsim-timeline">{current.baseline.audit.map((a, i) => <li key={i}><span className="jsim-timeline-dot" /><div><strong>{a.step}</strong><small>{a.detail}</small></div></li>)}</ol>
      </section><section className="jsim-inspector"><h3>Outcome and learning</h3>
        <p className="jsim-owner">Baseline outcome<strong>{OUTCOME_LABELS[current.baseline.outcome]}</strong></p>
        <p className="jsim-hint">{current.baseline.reasons.length ? `Why: ${describe(current.baseline.reasons)}.` : 'Delivery confirmed, restoration measured and target met.'}</p>
        {current.baseline.outcome === 'pending' && !current.reconciled && <>
          <p className="jsim-hint">The case stays open and escalated to its owner until correlated evidence arrives. It cannot be closed on a delivery receipt alone.</p>
          <button className="jsim-secondary" onClick={recordLateEvidence}>Record late follow-up measurement</button></>}
        {current.reconciled && <p role="status" className="jsim-boundary">Late evidence: {OUTCOME_LABELS[current.baseline.outcome]} → {OUTCOME_LABELS[current.reconciled.outcome]}. Earlier observation retained in the audit.</p>}
        {current.proposal ? <>
          <p className="jsim-owner">Improvement review<strong>{current.proposal.decision === 'pending' ? 'Awaiting Duty Manager review' : current.proposal.decision}</strong></p>
          <pre className="jhotel-payload">{JSON.stringify(current.proposal.candidate, null, 2)}</pre>
          {current.proposal.decision === 'pending' && <div className="jsim-buttons"><button className="jsim-primary" onClick={() => review('approved')}>Approve change and replay</button>
            <button className="jsim-secondary" onClick={() => review('rejected')}>Reject change</button></div>}
          {current.replay && <p role="status" className="jsim-boundary">Replay of the same signal: {OUTCOME_LABELS[current.baseline.outcome]} → {OUTCOME_LABELS[current.replay.outcome]}. New execution; original evidence retained.</p>}
          {current.proposal.decision === 'rejected' && <p className="jsim-hint">Rejected changes are kept on record and excluded from the next cycle.</p>}
        </> : <p className="jsim-hint">{current.baseline.outcome === 'met' ? 'No improvement needed in this fixture.' : 'No change is proposed without a measurement — collect the missing follow-up first.'}</p>}
      </section></div>}
      <div className="jsim-section-title"><h2>Next cycle</h2></div>
      <p className="jsim-hint">Approved changes are combined into one reviewed policy and applied to 100 fresh signals with the same fault profile. Rejected or unreviewed proposals are not applied. Same synthetic hotel; not a production release or a forecast.</p>
      <div className="jsim-buttons">
        <button className="jsim-secondary" disabled={!pendingReview} onClick={approveAll}>Approve all {pendingReview} pending proposals (synthetic Duty Manager)</button>
        <button className="jsim-primary" onClick={runNext}>Run cycle 2 with {approved} approved change{approved === 1 ? '' : 's'}</button>
      </div>
      {nextCycle && <div role="status" aria-label="Cycle comparison" className="jsim-cycle-compare">
        <div className="jsim-metrics jsim-metrics-3">{(['met', 'not-met', 'pending'] as const).map(status => {
          const before = count(baselineCases, status); const after = count(nextCycle.cases, status);
          return <div key={status}><span>{OUTCOME_LABELS[status]}</span><strong>{before} → {after}</strong><small>Cycle 1 baseline → cycle {nextCycle.cycle}</small></div>;
        })}</div>
        <p className="jsim-hint">Policy in cycle {nextCycle.cycle}: respond within {nextCycle.policy.responseMinutes} min (was {BASELINE_POLICY.responseMinutes}), {nextCycle.policy.interventionAttempts} intervention attempt(s) (was {BASELINE_POLICY.interventionAttempts}), {nextCycle.policy.receiptAttempts} receipt attempt(s) (was {BASELINE_POLICY.receiptAttempts}). Cases still pending need a measurement owner, not a policy change.</p>
      </div>}
      <button className="jsim-secondary" onClick={download}>Export outcome and learning evidence</button>
    </>}
  </section>;
}
