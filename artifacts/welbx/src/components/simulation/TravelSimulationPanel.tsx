import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Activity, ArrowRight, Check, Download, Pause, Play, RotateCcw, SkipForward, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { DEFAULT_DEPLOYMENT, type TravelDeploymentConfig } from '@/data/travelDeploymentConfig';
import { TRAVEL_SCENARIOS } from '@/data/travelScenarios';
import { TRAVEL_ROLES } from '@/data/travelRoles';
import { getDeploymentActivationReadiness, getScenarioConfigurationReadiness } from '@/lib/travelScenarioRouting';
import { getMandatoryEvidenceGaps, getStateLabel, STATE_TO_STEP, TRACE_STEPS } from '@/lib/runtimeEngine';
import { startLabRun, advanceLabRun, approveLabRun, supplyLabEvidence, acknowledgeLabEscalation,
  type LabRun, type LabCondition } from '@/lib/visualSimulation';
import './travelSimulation.css';

type Session = { runs: LabRun[]; deployment: TravelDeploymentConfig; scenarioId: string;
  volume: number; condition: LabCondition; scripted: boolean; startedAt: string };
const roleName = (id: string) => TRAVEL_ROLES.find(r => r.id === id)?.name ?? id;
const CONDITIONS: Array<{ value: LabCondition; label: string }> = [
  { value: 'normal', label: 'Standard pathway' }, { value: 'escalation', label: 'Inject an escalation' },
  { value: 'missing-evidence', label: 'Withhold required evidence' },
];
const blocked = (run: LabRun) => run.execution.state === 'approval-required' && !run.approval
  || run.execution.state === 'escalated' && run.execution.escalations.some(e => !e.acknowledged)
  || run.execution.state === 'resolved' && getMandatoryEvidenceGaps(run.execution).length > 0;

export function TravelSimulationPanel({ activeDeployment }: { activeDeployment: TravelDeploymentConfig | null }) {
  const [source, setSource] = useState<'preset' | 'configured'>('preset');
  const deployment = source === 'configured' && activeDeployment ? activeDeployment : DEFAULT_DEPLOYMENT;
  const readiness = getDeploymentActivationReadiness(deployment);
  const available = useMemo(() => TRAVEL_SCENARIOS.filter(s =>
    getScenarioConfigurationReadiness(deployment, s.id).ready), [deployment]);
  const [scenarioId, setScenarioId] = useState(DEFAULT_DEPLOYMENT.scenarios[0].scenarioId);
  const [volume, setVolume] = useState(10);
  const [condition, setCondition] = useState<LabCondition>('normal');
  const [scripted, setScripted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [session, setSession] = useState<Session | null>(null);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(1);
  const [error, setError] = useState('');
  const selectedScenarioId = available.some(s => s.id === scenarioId) ? scenarioId : available[0]?.id ?? '';
  const runs = session?.runs ?? [];
  const run = runs.find(r => r.number === selected) ?? runs[0];
  const execution = run?.execution;
  const complete = runs.filter(r => r.execution.state === 'closed').length;
  const waiting = runs.filter(r => blocked(r)).length;
  const faults = runs.filter(r => r.error).length;
  const allDone = !!session && runs.length === session.volume && complete + faults === runs.length;
  const needsInput = !!session && runs.length === session.volume && runs.every(r =>
    r.error || r.execution.state === 'closed' || (blocked(r) && !(session.scripted && r.execution.state === 'approval-required')));

  useEffect(() => { if (allDone || needsInput) setPlaying(false); }, [allDone, needsInput]);
  const tick = () => setSession(current => {
    if (!current) return current;
    const next = current.runs.map(r => advanceLabRun(r, current.scripted));
    if (next.length < current.volume) {
      next.push(startLabRun(current.deployment, current.scenarioId, next.length + 1, current.condition));
    }
    return { ...current, runs: next };
  });
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(tick, 1200 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed]);
  const start = () => {
    setError('');
    try {
      if (!readiness.ready) throw new Error(readiness.issues[0]?.reason ?? 'Complete deployment configuration first.');
      // Explicit test activation is confined to a cloned snapshot; saved configuration is untouched.
      const snapshot: TravelDeploymentConfig = { ...structuredClone(deployment), deploymentStatus: 'active-simulation' };
      const first = startLabRun(snapshot, selectedScenarioId, 1, condition);
      setSession({ runs: [first], deployment: snapshot, scenarioId: selectedScenarioId, volume, condition, scripted,
        startedAt: new Date().toISOString() });
      setSelected(1); setPlaying(true);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };
  const updateSelected = (change: (r: LabRun) => LabRun) => {
    setSession(current => current ? { ...current, runs: current.runs.map(r => r.number === selected ? change(r) : r) } : null);
    setPlaying(true);
  };
  const reset = () => { setPlaying(false); setSession(null); setSelected(1); setError(''); };
  const download = () => {
    if (!session) return;
    const payload = { schemaVersion: 'jaldo.visual-simulation.v1', vertical: 'travel', evidenceLevel: 'synthetic-engine',
      exportedAt: new Date().toISOString(), configuration: { scenarioId: session.scenarioId,
        volume: session.volume, condition: session.condition, scriptedApprovals: session.scripted },
      startedAt: session.startedAt, completed: complete, waiting, failed: faults,
      scope: 'Local browser simulation; no vendor calls, real messages or measured business outcomes.',
      runs: session.runs };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'jaldo-travel-simulation.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const status = playing ? 'Running' : allDone ? 'Run complete' : needsInput ? 'Your input needed' : session ? 'Paused' : 'Ready to explore';
  const stages = TRACE_STEPS.map((stage, index) => ({ ...stage,
    count: runs.filter(r => STATE_TO_STEP[r.execution.state] === index).length }));

  return <main className="jsim">
    <header className="jsim-header">
      <div><p className="jsim-eyebrow">JALDO TRAVEL <span>/</span> EXECUTION CENTRE</p>
        <h1>See the system <em>in motion.</em></h1>
        <p className="jsim-intro">Create a flow of signals. Change the conditions. Follow every decision through to evidence.</p>
      </div>
      <div className="jsim-environment"><ShieldCheck size={18} /><div><strong>Simulation Lab</strong><span>Synthetic data · local to this browser</span></div></div>
    </header>
    <div className="jsim-boundary"><span className="jsim-dot" />Same Travel engine. Test activity only. No messages sent or external systems changed.</div>
    <div className="jsim-workspace">
      <aside className="jsim-controls">
        <div className="jsim-section-title"><SlidersHorizontal size={16} /><h2>Set the conditions</h2></div>
        <label>Configuration<select value={source} disabled={!!session} onChange={e => setSource(e.target.value as typeof source)}>
          <option value="preset">Hotel test preset</option><option value="configured" disabled={!activeDeployment}>My saved deployment{!activeDeployment ? ' — not configured' : ''}</option>
        </select></label>
        <label>Scenario<select value={selectedScenarioId} disabled={!!session || !available.length} onChange={e => setScenarioId(e.target.value)}>
          {TRAVEL_SCENARIOS.map(s => <option key={s.id} value={s.id} disabled={!available.some(a => a.id === s.id)}>{s.title}{!available.some(a => a.id === s.id) ? ' — inactive' : ''}</option>)}
        </select></label>
        <p className="jsim-hint">{available.length} scenarios ready in this configuration. <Link href="/partner-room/build-configure">Configure more →</Link></p>
        <label>Signals in this run<select value={volume} disabled={!!session} onChange={e => setVolume(Number(e.target.value))}>
          {[1, 10, 25, 100].map(n => <option key={n} value={n}>{n} signal{n > 1 ? 's' : ''}</option>)}
        </select></label>
        <label>Test condition<select value={condition} disabled={!!session} onChange={e => setCondition(e.target.value as LabCondition)}>
          {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select></label>
        <label>Decision mode<select value={String(scripted)} disabled={!!session} onChange={e => setScripted(e.target.value === 'true')}>
          <option value="false">I approve each decision</option><option value="true">Scripted test approvals</option>
        </select></label>
        <p className="jsim-hint">{scripted ? 'Test actors advance approvals. This does not verify human authorisation.' : 'Signals wait for you at the decision gate.'}</p>
        <label>Playback speed <span className="jsim-speed-label">{speed}×</span><input aria-label="Playback speed" type="range" min="1" max="4" step="1" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
        <p className="jsim-hint">One new signal per tick. Playback speed is not a capacity benchmark.</p>
        {!session ? <button className="jsim-primary" onClick={start} disabled={!readiness.ready || !selectedScenarioId}><Play size={15} />Start simulation</button>
          : <div className="jsim-buttons"><button className="jsim-primary" disabled={allDone || needsInput} onClick={() => setPlaying(p => !p)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Pause' : 'Resume'}</button>
            <button className="jsim-secondary" onClick={tick} disabled={playing || allDone || needsInput}><SkipForward size={15} />Step</button></div>}
        {session && <button className="jsim-text-button" onClick={reset}><RotateCcw size={14} />Reset & change conditions</button>}
        {!readiness.ready && <p className="jsim-error">{readiness.issues[0]?.reason}</p>}
        {error && <p role="alert" className="jsim-error">{error}</p>}
      </aside>
      <section className="jsim-monitor" aria-label="Simulation monitor">
        <div className="jsim-monitor-heading"><div><p className="jsim-eyebrow">SIGNAL → OUTCOME</p><h2>The operating flow</h2></div><span className={`jsim-status ${playing ? 'running' : ''}`} role="status"><span className="jsim-dot" />{status}</span></div>
        <div className="jsim-metrics">
          {[['Signals created', runs.length, session ? `of ${session.volume} in this run` : 'Waiting for your first run'],
            ['Awaiting input', waiting, 'Approval, escalation or evidence'], ['Closed', complete, 'Synthetic paths completed'],
            ['Engine errors', faults, 'Unexpected execution failures']].map(([label, number, note]) => <div key={label}><span>{label}</span><strong>{number}</strong><small>{note}</small></div>)}
        </div>
        <div className="jsim-flow" aria-label="Signals per engine stage">{stages.map((s, i) => <div key={s.id} className={s.count ? 'has-signals' : ''}>
          <div className="jsim-stage-top"><span>0{i + 1}</span><strong>{s.count}</strong></div><h3>{s.label}</h3><p>{['Signal received', 'Context assessed', 'Approval gate', 'Action & escalation', 'Evidence & closure'][i]}</p>
          <div className="jsim-flow-dots">{Array.from({ length: Math.min(s.count, 8) }, (_, n) => <i key={n} />)}{s.count > 8 && <small>+{s.count - 8}</small>}</div>
        </div>)}</div>
        <div className="jsim-detail-grid">
          <section className="jsim-stream"><div className="jsim-section-title"><Activity size={16} /><h2>Signal stream</h2><span>{runs.length}</span></div>
            {!runs.length ? <div className="jsim-empty"><Activity size={28} /><h3>Your first signal starts here.</h3><p>Choose a scenario and press Start simulation. Select any signal to inspect its journey.</p></div>
              : <div className="jsim-signal-list">{runs.map(r => <button key={r.execution.id} className={`jsim-signal ${selected === r.number ? 'selected' : ''}`} onClick={() => setSelected(r.number)}>
                <span className="jsim-signal-number">{String(r.number).padStart(3, '0')}</span><span><strong>{r.execution.scenarioTitle}</strong><small>{r.error ? 'Engine error' : r.execution.state === 'closed' ? 'Closed · synthetic' : blocked(r) ? 'Awaiting your input' : getStateLabel(r.execution.state)}</small></span>
                <span className={`jsim-signal-mark ${r.execution.state === 'closed' ? 'closed' : blocked(r) ? 'waiting' : ''}`}>{r.execution.state === 'closed' ? <Check size={14} /> : <ArrowRight size={14} />}</span>
              </button>)}</div>}
          </section>
          <section className="jsim-inspector"><div className="jsim-section-title"><h2>{run ? `Signal ${String(run.number).padStart(3, '0')} · decision trace` : 'Decision trace'}</h2></div>
            {!execution ? <div className="jsim-empty"><ShieldCheck size={28} /><h3>Every step has an owner.</h3><p>Inspect the decision, approval gate, evidence requirements and recorded state changes.</p></div> : <>
              <p className="jsim-owner">Accountable role<strong>{roleName(execution.accountableRoleId)}</strong></p>
              {run?.error && <p role="alert" className="jsim-error">{run.error}</p>}
              {execution.state === 'approval-required' && !run?.approval && <div className="jsim-action-card"><span>DECISION REQUIRED</span><h3>A person must decide.</h3><p>Approve this synthetic decision to advance the test pathway.</p><button className="jsim-primary" onClick={() => updateSelected(r => approveLabRun(r, 'visitor'))}>Approve test decision<ArrowRight size={15} /></button></div>}
              {execution.state === 'escalated' && execution.escalations.some(e => !e.acknowledged) && <div className="jsim-action-card"><span>ESCALATION INJECTED</span><h3>Waiting for acknowledgement.</h3><p>The test escalation has been recorded. No alert was dispatched.</p><button className="jsim-primary" onClick={() => updateSelected(acknowledgeLabEscalation)}>Acknowledge test escalation</button></div>}
              {execution.state === 'resolved' && getMandatoryEvidenceGaps(execution).length > 0 && <div className="jsim-action-card"><span>CLOSURE BLOCKED</span><h3>Required evidence is missing.</h3><p>{getMandatoryEvidenceGaps(execution).length} required records must be supplied before this signal can close.</p><button className="jsim-primary" onClick={() => updateSelected(supplyLabEvidence)}>Supply synthetic evidence</button></div>}
              <ol className="jsim-timeline">{execution.stateHistory.map((event, i) => <li key={`${i}-${event.state}`}><span className="jsim-timeline-dot" /><div><strong>{getStateLabel(event.state)}</strong><small>{i === 0 ? 'Synthetic input accepted' : event.state === 'in-action' ? `Test approval: ${run?.approval === 'visitor' ? 'visitor' : 'scripted actor'}` : 'Recorded by the Travel engine'}</small></div><time>{new Date(event.timestamp).toLocaleTimeString('en-AU', { hour12: false })}</time></li>)}</ol>
              <div className="jsim-evidence"><span>Required evidence</span><strong>{execution.evidence.filter(e => e.required && e.captured).length} / {execution.evidence.filter(e => e.required).length}</strong></div>
              <progress aria-label="Required evidence captured" value={execution.evidence.filter(e => e.required && e.captured).length} max={Math.max(1, execution.evidence.filter(e => e.required).length)} />
              <p className="jsim-hint">Outcomes remain “not measured”. Completion here is a synthetic pathway result.</p>
            </>}
          </section>
        </div>
        <footer className="jsim-footer"><p>Local session · resets when you leave. Export to keep the full trace.</p><button className="jsim-secondary" disabled={!session} onClick={download}><Download size={14} />Export run</button></footer>
      </section>
    </div>
    <div className="jsim-bottom"><Link href="/partner-room/operations">← Return to the Operations Centre</Link><span>Scheduled test reports are available separately in GitHub.</span></div>
  </main>;
}
