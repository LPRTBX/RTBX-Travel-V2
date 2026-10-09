import { useState } from 'react';
import { Link } from 'wouter';
import { TRAVEL_ROLES } from '@/data/travelRoles';
import { createHotelSignals, PATH_LABELS } from '@/simulation/mockHotel';
import { simulateHotelCase, hotelFaultForSignal, proposeHotelLearning, reviewHotelLearning,
  replayHotelLearning, reconcileHotelFollowUp, mockHotelFollowUp, mergeApprovedHotelPolicy,
  runHotelLearningCycle, BASELINE_POLICY, type HotelCase, type LearningPolicy, type Proposal } from '@/simulation/hotelLearning';
import { describeJourneyOutcome, summariseLearningRows } from '@/simulation/hotelLearningSummary';
import { OUTCOME_LABELS, describeAuditEntry, describeFollowUpReasons, describePolicyChanges, formatRecordedTime, roleLabel } from '@/lib/plainLanguage';
import { ProposalChanges } from './ProposalChanges';

type Row = { baseline: HotelCase; proposal: Proposal | null; replay?: HotelCase; reconciled?: HotelCase; index: number };
type CycleResult = { cycle: number; policy: LearningPolicy; cases: HotelCase[] };
const count = (cases: HotelCase[], outcome: HotelCase['outcome']) => cases.filter(c => c.outcome === outcome).length;
const describe = describeFollowUpReasons;

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
  // Many approvals can collapse into the same few setting changes; say how many settings actually change.
  const settingChanges = approved ? describePolicyChanges(BASELINE_POLICY, mergeApprovedHotelPolicy(proposals, BASELINE_POLICY, 2)).length : 0;
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
  const summary = summariseLearningRows(rows);
  return <section className="jsim-monitor" aria-label="Hotel outcome and learning loop">
    <div className="jsim-monitor-heading"><div><p className="jsim-eyebrow">DECISION → ACTION → OUTCOME → LEARNING → NEXT CYCLE</p>
      <h2>Did the action work?</h2></div><button className="jsim-secondary" onClick={run}>{rows.length ? 'Reset outcome cycle' : 'Run 100 outcome journeys'}</button></div>
    <p className="jsim-hint">Each journey is followed up against one synthetic target: a delivery receipt and the issue restored within 20 minutes.
      Scripted actors approve the initial actions. Failures produce a proposed change; a reviewer approves or rejects it; approved changes can be carried into the next cycle of 100 fresh signals. Nothing leaves this browser.</p>
    {error && <p className="jsim-error" role="alert">{error}</p>}
    {!!rows.length && <>
      <div className="jsim-metrics" aria-label="Cycle 1 recorded outcomes and proposals">{(['met', 'not-met', 'pending'] as const).map(status => <div key={status}><span>{OUTCOME_LABELS[status]}</span>
        <strong>{summary.recorded[status]}</strong><small>Recorded in cycle 1 · original evidence, unchanged by reviews</small></div>)}
        <div><span>Proposals</span><strong>{approved}</strong><small>approved · {rejected} rejected · {pendingReview} awaiting review</small></div></div>
      <p className="jsim-hint" role="status" aria-label="Results recorded after cycle 1">{summary.lateEvidence.journeys + summary.replays.journeys === 0
        ? 'Later results appear here and never overwrite the recorded cycle 1 evidence.'
        : `Later results, kept separately: ${[
          summary.lateEvidence.journeys && `${summary.lateEvidence.journeys} late follow-up measurement${summary.lateEvidence.journeys === 1 ? '' : 's'} (${summary.lateEvidence.outcomes.met} met, ${summary.lateEvidence.outcomes['not-met']} not met)`,
          summary.replays.journeys && `${summary.replays.journeys} replay${summary.replays.journeys === 1 ? '' : 's'} of the same signals (${summary.replays.outcomes.met} met, ${summary.replays.outcomes['not-met']} not met, ${summary.replays.outcomes.pending} pending)`,
        ].filter(Boolean).join('; ')}.`}</p>
      <label>Select a journey <select value={selected} onChange={e => setSelected(Number(e.target.value))}>
        {rows.map((r, i) => <option key={r.baseline.signal.eventId} value={i}>{PATH_LABELS[r.baseline.signal.path]} · Room {r.baseline.signal.room} · {describeJourneyOutcome(r, OUTCOME_LABELS)}{r.proposal?.decision === 'pending' ? ' · review needed' : ''}</option>)}
      </select></label>
      {current && <div className="jsim-detail-grid"><section className="jsim-stream">
        <h3>Baseline journey</h3><p className="jsim-owner">Accountable role<strong>{TRAVEL_ROLES.find(r => r.id === current.baseline.execution.accountableRoleId)?.name ?? current.baseline.execution.accountableRoleId}</strong></p>
        <ol className="jsim-timeline">{current.baseline.audit.map((a, i) => { const line = describeAuditEntry(a); return <li key={i}><span className="jsim-timeline-dot" /><div><strong>{line.title}</strong>{line.detail && <small>{line.detail}</small>}</div></li>; })}</ol>
        <details className="jsim-technical"><summary>Technical identifiers</summary><ol>{current.baseline.audit.map((a, i) => <li key={i}><code>{a.step}</code>: {a.detail}</li>)}</ol></details>
      </section><section className="jsim-inspector"><h3>Outcome and learning</h3>
        <p className="jsim-owner">Recorded outcome<strong>{OUTCOME_LABELS[current.baseline.outcome]}</strong></p>
        <p className="jsim-hint">{current.baseline.reasons.length ? `Why: ${describe(current.baseline.reasons)}.` : 'Delivery confirmed, restoration measured and target met.'}</p>
        {current.baseline.outcome === 'pending' && !current.reconciled && <>
          <p className="jsim-hint">The case stays open with its owner until the missing evidence is recorded ({describe(current.baseline.reasons)}). It cannot close without it.</p>
          <button className="jsim-secondary" onClick={recordLateEvidence}>Record late follow-up measurement</button></>}
        {current.reconciled && <p role="status" className="jsim-boundary">Late evidence: {OUTCOME_LABELS[current.baseline.outcome]} → {OUTCOME_LABELS[current.reconciled.outcome]}. The earlier follow-up stays on record alongside it.</p>}
        {current.proposal ? <>
          <p className="jsim-owner">Proposed change<strong>{current.proposal.decision === 'pending' ? 'Awaiting Duty Manager review'
            : `${current.proposal.decision === 'approved' ? 'Approved for testing' : 'Rejected'} by ${roleLabel(current.proposal.reviewer ?? '')} at ${formatRecordedTime(current.proposal.reviewedAt)}`}</strong></p>
          <p className="jsim-hint">Raised because of: {describe(current.proposal.reasons)}. Only these settings would change:</p>
          <ProposalChanges before={current.baseline.policy} after={current.proposal.candidate} />
          {current.reconciled?.outcome === 'met' && current.proposal.decision === 'pending' && <p className="jsim-hint">Late evidence has since met the target. This proposal was raised before that evidence arrived, so the reviewer may decide it is no longer needed.</p>}
          {current.proposal.decision === 'pending' && <div className="jsim-buttons"><button className="jsim-primary" onClick={() => review('approved')}>Approve change and replay</button>
            <button className="jsim-secondary" onClick={() => review('rejected')}>Reject change</button></div>}
          {current.replay && <p role="status" className="jsim-boundary">Replay of the same signal: {OUTCOME_LABELS[current.baseline.outcome]} → {OUTCOME_LABELS[current.replay.outcome]}. New execution; original evidence retained.</p>}
          {current.proposal.decision === 'rejected' && <p className="jsim-hint">Rejected changes are kept on record and excluded from the next cycle.</p>}
        </> : <p className="jsim-hint">{current.baseline.outcome === 'met' ? 'No improvement needed in this fixture.' : 'No change is proposed without a measurement — collect the missing follow-up first.'}</p>}
      </section></div>}
      <p className="jsim-hint"><Link href="/partner-room/operating-evolution">Go beyond faster response: work through reviewed early recognition, preparation and team impact →</Link></p>
      <div className="jsim-section-title"><h2>Next cycle</h2></div>
      <p className="jsim-hint">Approved changes are combined into one reviewed policy and applied to 100 fresh signals with the same fault profile. Rejected or unreviewed proposals are not applied. Same synthetic hotel; not a production release or a forecast.</p>
      <div className="jsim-buttons">
        <button className="jsim-secondary" disabled={!pendingReview} onClick={approveAll}>Approve all {pendingReview} pending proposals (synthetic Duty Manager)</button>
        <button className="jsim-primary" onClick={runNext}>{approved
          ? `Run cycle 2 with ${approved} approved proposal${approved === 1 ? '' : 's'} (${settingChanges} setting change${settingChanges === 1 ? '' : 's'})`
          : 'Run cycle 2 with no approved changes (same settings)'}</button>
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
