import { useEffect, useState } from 'react';
import { HotelLearningPanel } from './HotelLearningPanel';
import { Link } from 'wouter';
import { Activity, Download, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { TRAVEL_ROLES } from '@/data/travelRoles';
import { getStateLabel } from '@/lib/runtimeEngine';
import { HOTEL_PATHS, MOCK_HOTEL, PATH_LABELS, createHotelBatch, stepHotelBatch,
  checkHotelRead, expectedHotelState, type HotelBatch } from '@/simulation/mockHotel';

type Result = { cycle: number; passed: boolean; errors: string[]; finishedAt: string };
const roleName = (id: string) => TRAVEL_ROLES.find(r => r.id === id)?.name ?? id;
export function HotelSimulationPanel() {
  const [batch, setBatch] = useState<HotelBatch | null>(null);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [selected, setSelected] = useState('');
  const [history, setHistory] = useState<Result[]>([]);
  const [startError, setStartError] = useState('');
  const reads = batch?.hotel.reads ?? [];
  const selectedRead = reads.find(r => r.signal.eventId === selected) ?? reads[0];
  const closed = reads.filter(r => r.run.execution.state === 'closed').length;
  const approvals = reads.filter(r => r.run.execution.state === 'approval-required').length;
  const evidence = reads.filter(r => r.run.execution.state === 'resolved').length;
  const latest = history.at(-1);
  const prepare = (cycle: number) => {
    try { setBatch(createHotelBatch(cycle)); setSelected(''); setStartError(''); return true; }
    catch (e) { setStartError(String(e)); setPlaying(false); return false; }
  };
  useEffect(() => {
    if (!playing || batch?.finished) return;
    const timer = window.setInterval(() => setBatch(current => current ? stepHotelBatch(current) : current), 1000 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, batch?.finished]);
  useEffect(() => {
    if (!batch?.finished) return;
    const errors = batch.hotel.reads.flatMap(r => checkHotelRead(r).map(e => `${r.signal.eventId}: ${e}`));
    if (batch.hotel.reads.length !== 100) errors.push('Batch did not admit all 100 signals');
    for (const record of batch.hotel.intake.filter(r => r.status === 'rejected')) errors.push(record.reason ?? 'Intake rejected');
    setHistory(current => current.at(-1)?.cycle === batch.hotel.cycle ? current
      : [...current.slice(-19), { cycle: batch.hotel.cycle, passed: errors.length === 0, errors, finishedAt: new Date().toISOString() }]);
    setPlaying(false);
  }, [batch?.finished, batch?.hotel.cycle]);
  useEffect(() => {
    if (!repeat || !batch?.finished || !latest?.passed || latest.cycle !== batch.hotel.cycle) return;
    const timer = window.setTimeout(() => { if (prepare(batch.hotel.cycle + 1)) setPlaying(true); }, 1500);
    return () => window.clearTimeout(timer);
  }, [repeat, batch?.finished, latest?.cycle]);
  const download = () => {
    if (!batch) return;
    const payload = { schemaVersion: 'jaldo.hotel-browser.v1', evidenceLevel: 'synthetic-engine-and-mock-adapters',
      exportedAt: new Date().toISOString(), hotel: MOCK_HOTEL, batch: batch.hotel,
      expected: { closed: 60, approvalHeld: 20, evidenceHeld: 20 }, recentCycles: history,
      limits: 'Local browser session, scripted actors, no vendor calls or measured business outcomes. Continuous browser replay stops when the page closes.' };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `jaldo-mock-hotel-cycle-${batch.hotel.cycle}.json`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main className="jsim">
    <header className="jsim-header"><div><p className="jsim-eyebrow">JALDO TRAVEL / MOCK HOTEL</p>
      <h1>A hotel operating <em>in four directions.</em></h1>
      <p className="jsim-intro">100 distinct readings. Four input paths. Follow the owner, decision, evidence and outcome of every signal.</p></div>
      <div className="jsim-environment"><ShieldCheck size={18} /><div><strong>Harbour Hotel</strong><span>100 rooms · synthetic hotel</span></div></div>
    </header>
    <div className="jsim-boundary"><span className="jsim-dot" />Synthetic hotel and input contracts. Scripted test actors. No real bookings, messages or devices.</div>
    <div className="jsim-workspace"><aside className="jsim-controls">
      <div className="jsim-section-title"><Activity size={16} /><h2>Hotel operating profile</h2></div>
      <p className="jsim-hint">76 occupied rooms · 16 arrivals · 8 departures. Front office, guest services, housekeeping, maintenance, duty management and safety.</p>
      <label>Run profile<select value="mixed" disabled><option value="mixed">100 signals / 25 per path</option></select></label>
      <p className="jsim-hint">Five event types × five readings per path. Expected: 60 closed, 20 held for approval, 20 held for evidence. Each gate is checked.</p>
      <label className="jhotel-toggle"><input type="checkbox" checked={repeat} onChange={e => setRepeat(e.target.checked)} />Repeat complete batches</label>
      <p className="jsim-hint">A failed check stops replay. Browser replay runs while this page is open. Scheduled GitHub checks run separately.</p>
      <label>Playback speed · {speed}×<input aria-label="Hotel playback speed" type="range" min="1" max="4" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
      {!batch ? <button className="jsim-primary" onClick={() => { if (prepare(1)) setPlaying(true); }}><Play size={16} />Start hotel simulation</button>
        : batch.finished ? <button className="jsim-primary" onClick={() => { if (prepare(batch.hotel.cycle + 1)) setPlaying(true); }}><RotateCcw size={16} />Run next batch</button>
          : <button className="jsim-primary" onClick={() => setPlaying(p => !p)}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pause' : 'Resume'}</button>}
      {batch && <button className="jsim-text-button" onClick={() => { setPlaying(false); setRepeat(false); setBatch(null); setHistory([]); }}><RotateCcw size={14} />Reset hotel</button>}
      {startError && <p className="jsim-error" role="alert">{startError}</p>}
      <div className="jsim-section-title"><h2>Connection controls</h2></div>
      {HOTEL_PATHS.map(path => <label className="jhotel-toggle" key={path}><input type="checkbox" checked={batch?.hotel.online[path] ?? true} disabled={!batch || batch.finished}
        onChange={e => setBatch(current => current ? { ...current, hotel: { ...current.hotel, online: { ...current.hotel.online, [path]: e.target.checked } } } : current)} />{PATH_LABELS[path]}</label>)}
      <p className="jsim-hint">Disconnect a source to hold its queue; reconnect to resume. Other paths continue.</p>
    </aside><section className="jsim-monitor" aria-label="Mock hotel monitor">
      <div className="jsim-monitor-heading"><div><p className="jsim-eyebrow">HOTEL SIGNAL → DECISION → EVIDENCE</p><h2>Hotel activity</h2></div>
        <span role="status" className={`jsim-status ${playing ? 'running' : ''}`}>{batch?.finished ? latest?.passed ? 'Checks passed' : latest ? 'Check failed' : 'Checking' : playing ? `Batch ${batch?.hotel.cycle} running` : batch ? 'Paused' : 'Ready'}</span></div>
      <div className="jsim-metrics">{[['Signals read', reads.length, '100 unique readings per batch'], ['Closed', closed, 'Expected: 60'], ['Approval held', approvals, 'Expected final hold: 20'], ['Evidence held', evidence, 'Expected final hold: 20']].map(([label, number, note]) =>
        <div key={label}><span>{label}</span><strong>{number}</strong><small>{note}</small></div>)}</div>
      <div className="jhotel-paths">{HOTEL_PATHS.map(path => <div key={path}><strong>{PATH_LABELS[path]}</strong><span>{reads.filter(r => r.signal.path === path).length} / 25 read</span>
        <small>{batch?.hotel.online[path] === false ? 'Connection paused · signals queued' : 'Mock connection available'}</small></div>)}</div>
      {latest && <div className={latest.passed ? 'jsim-boundary' : 'jsim-error'} role="status">Batch {latest.cycle}: {latest.passed ? 'all 100 signal expectations passed, including held gates.' : latest.errors.slice(0, 3).join('; ')}</div>}
      <div className="jsim-detail-grid"><section className="jsim-stream"><div className="jsim-section-title"><Activity size={16} /><h2>100-signal stream</h2></div>
        {!reads.length ? <div className="jsim-empty"><h3>Start the hotel day.</h3><p>Arrivals, requests, operations and sensor readings share the existing Travel engine.</p></div>
          : <div className="jsim-signal-list">{reads.map(read => <button key={read.signal.eventId} className={`jsim-signal ${selectedRead?.signal.eventId === read.signal.eventId ? 'selected' : ''}`} onClick={() => setSelected(read.signal.eventId)}>
            <span className="jsim-signal-number">{read.signal.room}</span><span><strong>{read.signal.title}</strong><small>{read.run.error ?? getStateLabel(read.run.execution.state)}</small></span></button>)}</div>}
      </section><section className="jsim-inspector"><div className="jsim-section-title"><h2>Signal read and trace</h2></div>
        {!selectedRead ? <div className="jsim-empty"><ShieldCheck size={28} /><p>Select a reading to inspect its source and decision pathway.</p></div> : <>
          <p className="jsim-owner">Input path<strong>{PATH_LABELS[selectedRead.signal.path]}</strong></p>
          <p className="jsim-owner">Room / guest correlation<strong>{selectedRead.signal.room} / {selectedRead.signal.guestId}</strong></p>
          <p className="jsim-owner">Accountable role<strong>{roleName(selectedRead.run.execution.accountableRoleId)}</strong></p>
          <p className="jsim-owner">Expected terminal state<strong>{getStateLabel(expectedHotelState(selectedRead.signal))}</strong></p>
          <pre className="jhotel-payload">{JSON.stringify(selectedRead.signal.payload, null, 2)}</pre>
          <ol className="jsim-timeline">{selectedRead.run.execution.stateHistory.map((event, i) => <li key={i}><span className="jsim-timeline-dot" /><div><strong>{getStateLabel(event.state)}</strong><small>{event.note}</small></div></li>)}</ol>
          <p className="jsim-hint">Approval holds and evidence holds remain in place deliberately. Completed outcomes are recorded as “not measured”.</p>
        </>}
      </section></div>
      <footer className="jsim-footer"><p>{history.length} recent batch results retained in this session. Export before leaving.</p><button className="jsim-secondary" disabled={!batch} onClick={download}><Download size={14} />Export hotel run</button></footer>
    </section></div>
    <HotelLearningPanel />
    <div className="jsim-bottom"><Link href="/partner-room/operations">← Return to the Operations Centre</Link><span>Hourly automation activates when the workflow is merged into main.</span></div>
  </main>;
}
