import { useState } from 'react';
import { createHotelSignals, PATH_LABELS } from '@/simulation/mockHotel';
import { simulateHotelCase, hotelFaultForSignal, proposeHotelLearning, reviewHotelLearning,
  replayHotelLearning, type HotelCase, type Proposal } from '@/simulation/hotelLearning';

type Row = { baseline: HotelCase; proposal: Proposal | null; replay?: HotelCase; index: number };
export function HotelLearningPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  const current = rows[selected];
  const run = () => {
    try {
      setRows(createHotelSignals().map((signal, index) => {
        const baseline = simulateHotelCase(signal, hotelFaultForSignal(index));
        return { baseline, proposal: proposeHotelLearning(baseline), index };
      }));
      setSelected(0); setError('');
    } catch (e) { setError(String(e)); }
  };
  const review = (decision: 'approved' | 'rejected') => {
    if (!current?.proposal) return;
    try {
      const proposal = reviewHotelLearning(current.proposal, decision, 'synthetic-duty-manager');
      const replay = decision === 'approved' ? replayHotelLearning(current.baseline, proposal, hotelFaultForSignal(current.index)) : undefined;
      setRows(rows.map((r, i) => i === selected ? { ...r, proposal, replay } : r)); setError('');
    } catch (e) { setError(String(e)); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ schemaVersion: 'jaldo.hotel-learning-browser.v1',
      evidenceLevel: 'synthetic-closed-loop', exportedAt: new Date().toISOString(), rows }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'jaldo-hotel-outcome-learning.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="jsim-monitor" aria-label="Hotel outcome and learning loop">
    <div className="jsim-monitor-heading"><div><p className="jsim-eyebrow">DECISION → ACTION → OUTCOME → LEARNING → REPLAY</p>
      <h2>Did the action work?</h2></div><button className="jsim-secondary" onClick={run}>{rows.length ? 'Reset outcome cycle' : 'Run 100 outcome journeys'}</button></div>
    <p className="jsim-hint">A separate synthetic follow-up profile tests restoration with a delivery receipt within 20 minutes.
      Scripted actors approve the initial actions. Review each proposed improvement before replaying it. Changes stay in this mock session.</p>
    {error && <p className="jsim-error" role="alert">{error}</p>}
    {!!rows.length && <>
      <div className="jsim-metrics">{(['met', 'not-met', 'pending'] as const).map(status => <div key={status}><span>{status}</span>
        <strong>{rows.filter(r => (r.replay ?? r.baseline).outcome === status).length}</strong><small>Current synthetic outcome</small></div>)}</div>
      <label>Select a journey <select value={selected} onChange={e => setSelected(Number(e.target.value))}>
        {rows.map((r, i) => <option key={r.baseline.signal.eventId} value={i}>{PATH_LABELS[r.baseline.signal.path]} · Room {r.baseline.signal.room} · {hotelFaultForSignal(i)}</option>)}
      </select></label>
      {current && <div className="jsim-detail-grid"><section className="jsim-stream">
        <h3>Baseline journey</h3><p className="jsim-owner">Accountable role<strong>{current.baseline.execution.accountableRoleId}</strong></p>
        <ol className="jsim-timeline">{current.baseline.audit.map((a, i) => <li key={i}><span className="jsim-timeline-dot" /><div><strong>{a.step}</strong><small>{a.detail}</small></div></li>)}</ol>
      </section><section className="jsim-inspector"><h3>Outcome and learning</h3>
        <p className="jsim-owner">Baseline outcome<strong>{current.baseline.outcome}</strong></p>
        <p className="jsim-hint">{current.baseline.reasons.join(', ') || 'Delivery confirmed, restoration measured and target met.'}</p>
        {current.proposal ? <>
          <p className="jsim-owner">Improvement review<strong>{current.proposal.decision}</strong></p>
          <pre className="jhotel-payload">{JSON.stringify(current.proposal.candidate, null, 2)}</pre>
          {current.proposal.decision === 'pending' && <><button className="jsim-primary" onClick={() => review('approved')}>Approve synthetic change and replay</button>
            <button className="jsim-secondary" onClick={() => review('rejected')}>Reject change</button></>}
          {current.replay && <p role="status" className="jsim-boundary">Baseline: {current.baseline.outcome} → replay: {current.replay.outcome}. New execution; original evidence retained.</p>}
        </> : <p className="jsim-hint">{current.baseline.outcome === 'met' ? 'No improvement needed in this fixture.' : 'Collect the missing measurement before proposing a change.'}</p>}
      </section></div>}
      <button className="jsim-secondary" onClick={download}>Export outcome and learning evidence</button>
    </>}
  </section>;
}
