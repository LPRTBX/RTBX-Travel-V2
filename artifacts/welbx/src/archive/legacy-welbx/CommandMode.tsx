import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const THREAT_VECTORS = [
  { label: 'VIP arrival ETA',       value: '08 min',       severity: 'CRITICAL' as const, bar: 0.94 },
  { label: 'Room 847 release',      value: 'Not cleared',  severity: 'CRITICAL' as const, bar: 0.90 },
  { label: 'Front desk capacity',   value: '100%',         severity: 'CRITICAL' as const, bar: 1.0  },
  { label: 'Queue depth',           value: '14 guests',    severity: 'HIGH'     as const, bar: 0.70 },
  { label: 'Sentiment index',       value: '−0.4',         severity: 'HIGH'     as const, bar: 0.58 },
];

const RECOMMENDATIONS = [
  { action: 'Prioritise housekeeping — Room 847', engine: 'VECTOR', detail: 'Execution push to nearest crew' },
  { action: 'Open secondary check-in lane',       engine: 'NEXUS',  detail: 'Capacity routing activated' },
  { action: 'Reassign nearest available host',    engine: 'NEXUS',  detail: 'Proximity mapping — lobby zone' },
  { action: 'Activate VIP welcome protocol',      engine: 'BXOS',   detail: 'Loyalty intelligence triggered' },
];

const AVAILABLE_RESOURCES = [
  { dept: 'Housekeeping',    detail: '2 agents within 60m of Room 847', status: 'AVAILABLE' },
  { dept: 'Front Desk',      detail: 'Secondary lane — offline, ready',  status: 'STANDBY' },
  { dept: 'Guest Relations', detail: 'Host 4 — lobby position',          status: 'AVAILABLE' },
];

const EXECUTION_EVENTS = [
  { dept: 'Housekeeping Lead',   action: 'Priority push confirmed — Room 847 targeted', time: '00:00:12', color: '#10b981' },
  { dept: 'Front Desk',         action: 'Secondary lane opened — queue diverted',        time: '00:00:28', color: '#10b981' },
  { dept: 'Host 4',             action: 'Reassigned — en route to lobby',                time: '00:00:41', color: '#10b981' },
  { dept: 'VIP Protocol',       action: 'Welcome sequence activated — Room 847',         time: '00:01:03', color: '#10b981' },
];

export default function CommandMode() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [riskScore, setRiskScore] = useState(44);
  const [countdown, setCountdown] = useState(252);
  const [execVisible, setExecVisible] = useState<number[]>([]);
  const [outcomeRisk, setOutcomeRisk] = useState(87);
  const [outcomeQueue, setOutcomeQueue] = useState(14);
  const [outcomeValue, setOutcomeValue] = useState(0);
  const riskIvRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Phase 0: animate risk score up
  useEffect(() => {
    if (phase !== 0) return;
    riskIvRef.current = setInterval(() => {
      setRiskScore(s => (s >= 87 ? 87 : s + 1));
    }, 55);
    return () => clearInterval(riskIvRef.current);
  }, [phase]);

  // Phase 0 + 1: countdown
  useEffect(() => {
    if (phase !== 0 && phase !== 1) return;
    const iv = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Phase 2: reveal execution events then advance to phase 3
  useEffect(() => {
    if (phase !== 2) return;
    setExecVisible([]);
    EXECUTION_EVENTS.forEach((_, i) => {
      setTimeout(() => setExecVisible(prev => [...prev, i]), i * 720 + 400);
    });
    const done = setTimeout(() => setPhase(3), EXECUTION_EVENTS.length * 720 + 1400);
    return () => clearTimeout(done);
  }, [phase]);

  // Phase 3: animate outcome metrics
  useEffect(() => {
    if (phase !== 3) return;
    const iv = setInterval(() => {
      setOutcomeRisk(s => (s > 34 ? s - 1 : 34));
      setOutcomeQueue(s => (s > 7 ? s - 1 : 7));
      setOutcomeValue(s => (s < 8000 ? Math.min(s + 200, 8000) : 8000));
    }, 45);
    return () => clearInterval(iv);
  }, [phase]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const riskColor = riskScore >= 80 ? '#ef4444' : riskScore >= 55 ? '#c9a84c' : '#10b981';
  const borderOpacity = Math.min(0.45, (riskScore - 44) / 90);

  return (
    <div
      className="fixed inset-0 bg-background pl-56 text-foreground flex flex-col overflow-hidden"
      style={{ boxShadow: phase < 2 ? `inset 0 0 0 1px rgba(239,68,68,${borderOpacity})` : 'none', transition: 'box-shadow 0.4s' }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-56 right-0 h-px" style={{ background: 'hsl(220 13% 10%)' }}>
        <motion.div
          className="h-full"
          animate={{
            width: phase === 0 ? '10%' : phase === 1 ? '40%' : phase === 2 ? '75%' : '100%',
            background: phase >= 3 ? '#10b981' : phase >= 2 ? '#c9a84c' : '#ef4444',
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">

        {/* ── PHASE 0: THREAT BUILDING ── */}
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 40px', gap: 20, overflow: 'hidden' }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div className="label-caps mb-1" style={{ color: 'rgba(239,68,68,0.45)' }}>BXOS · Critical Detection</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)' }}>
                  Compounding moment forming — threshold approaching
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 28%)' }}>Time to service failure</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444', fontFamily: 'var(--app-font-mono)', letterSpacing: '0.04em' }}>
                  {fmt(countdown)}
                </div>
              </div>
            </div>

            {/* Risk score + bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              <div style={{ flexShrink: 0 }}>
                <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 28%)' }}>Risk Score</div>
                <motion.div
                  animate={{ color: riskColor }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'var(--app-font-mono)' }}
                >
                  {riskScore}
                </motion.div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: riskColor, opacity: 0.7, marginTop: 4 }}>
                  {riskScore >= 80 ? 'CRITICAL' : riskScore >= 55 ? 'HIGH' : 'ELEVATED'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, borderRadius: 3, background: 'hsl(220 13% 11%)', marginBottom: 8, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${riskScore}%`, background: riskScore >= 80 ? '#ef4444' : '#c9a84c' }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', borderRadius: 3 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono-value" style={{ color: 'hsl(215 16% 24%)' }}>0 — NOMINAL</span>
                  <span className="mono-value" style={{ color: 'hsl(215 16% 24%)' }}>100 — CRITICAL</span>
                </div>
              </div>
            </div>

            {/* Threat vectors */}
            <div style={{ border: '1px solid hsl(220 13% 12%)', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '9px 18px', borderBottom: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                <span className="label-caps">Active Threat Vectors</span>
              </div>
              {THREAT_VECTORS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.14 + 0.2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20, padding: '11px 18px',
                    borderBottom: i < THREAT_VECTORS.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                    background: 'hsl(220 13% 6.5%)', flex: 1,
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.severity === 'CRITICAL' ? '#ef4444' : '#c9a84c', flexShrink: 0 }} className="animate-pulse" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'hsl(215 16% 52%)', marginBottom: 5 }}>{t.label}</div>
                    <div style={{ height: 2, background: 'hsl(220 13% 11%)', borderRadius: 1, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.bar * 100}%` }}
                        transition={{ delay: i * 0.14 + 0.4, duration: 0.5 }}
                        style={{ height: '100%', background: t.severity === 'CRITICAL' ? '#ef4444' : '#c9a84c', borderRadius: 1 }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 90 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--app-font-mono)', color: t.severity === 'CRITICAL' ? '#ef4444' : '#c9a84c' }}>{t.value}</div>
                    <div style={{ fontSize: 7, letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', color: t.severity === 'CRITICAL' ? 'rgba(239,68,68,0.4)' : 'rgba(201,168,76,0.4)', marginTop: 2 }}>{t.severity}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: 'hsl(215 16% 35%)' }}>
                Value at risk: <span style={{ color: '#ef4444', fontWeight: 700 }}>$8,000</span>
                &nbsp;·&nbsp; Guest tier: <span style={{ color: '#c9a84c', fontWeight: 700 }}>DIAMOND</span>
              </div>
              <motion.button
                animate={{ opacity: riskScore >= 80 ? 1 : 0.25 }}
                onClick={() => riskScore >= 80 && setPhase(1)}
                style={{
                  padding: '12px 36px',
                  background: riskScore >= 80 ? 'rgba(239,68,68,0.1)' : 'transparent',
                  border: `1px solid ${riskScore >= 80 ? 'rgba(239,68,68,0.4)' : 'hsl(220 13% 16%)'}`,
                  color: riskScore >= 80 ? '#ef4444' : 'hsl(215 16% 28%)',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: riskScore >= 80 ? 'pointer' : 'default', transition: 'all 0.3s',
                }}
              >
                Assess Intervention
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 1: INTERVENTION READY ── */}
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 40px', gap: 18, overflow: 'auto' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Intervention Plan</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Critical threshold exceeded.<br />Coordinated response ready.
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 30%)' }}>Time to failure</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444', fontFamily: 'var(--app-font-mono)' }}>{fmt(countdown)}</div>
              </div>
            </div>

            {/* Recommended actions */}
            <div style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.03)' }}>
              <div style={{ padding: '9px 18px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,168,76,0.04)' }}>
                <span className="label-caps" style={{ color: '#c9a84c' }}>Recommended Interventions</span>
                <span style={{ fontSize: 7, letterSpacing: '0.16em', color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase', fontWeight: 700 }}>4 actions · Est. 45s total execution</span>
              </div>
              {RECOMMENDATIONS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '13px 18px',
                    borderBottom: i < RECOMMENDATIONS.length - 1 ? '1px solid rgba(201,168,76,0.07)' : 'none',
                  }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{r.action}</div>
                    <div style={{ fontSize: 9, color: 'hsl(215 16% 38%)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.detail}</div>
                  </div>
                  <div style={{
                    fontSize: 7, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                    padding: '3px 8px', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                  }}>{r.engine}</div>
                </motion.div>
              ))}
            </div>

            {/* Available resources */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {AVAILABLE_RESOURCES.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{ padding: '12px 16px', border: '1px solid hsl(220 13% 12%)', background: 'hsl(220 13% 7%)' }}
                >
                  <div style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: r.status === 'AVAILABLE' ? '#10b981' : '#c9a84c', marginBottom: 5 }}>{r.status}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{r.dept}</div>
                  <div style={{ fontSize: 10, color: 'hsl(215 16% 40%)' }}>{r.detail}</div>
                </motion.div>
              ))}
            </div>

            {/* Execute CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: 'hsl(215 16% 38%)' }}>
                Execution latency estimate: <span style={{ color: '#c9a84c', fontWeight: 700 }}>45 seconds</span>
                &nbsp;·&nbsp; Value at risk: <span style={{ color: '#ef4444', fontWeight: 700 }}>$8,000</span>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setPhase(2)}
                style={{
                  padding: '16px 60px',
                  background: '#c9a84c', color: 'hsl(220 13% 5%)',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c9a84c')}
              >
                Execute Intervention
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 2: EXECUTING ── */}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 48px', gap: 28 }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Vector · Execution Engine</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.025em' }}>Coordinating Response</div>
              <div style={{ fontSize: 11, color: 'hsl(215 16% 38%)', marginTop: 6 }}>M2 — VIP Arrival Risk — cross-department execution</div>
            </div>

            <div style={{ width: '100%', maxWidth: 580, border: '1px solid hsl(220 13% 12%)' }}>
              {EXECUTION_EVENTS.map((ev, i) => (
                execVisible.includes(i) ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'flex', gap: 18, padding: '14px 20px',
                      borderBottom: i < EXECUTION_EVENTS.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ev.dept}</div>
                      <div style={{ fontSize: 10, color: 'hsl(215 16% 44%)' }}>{ev.action}</div>
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--app-font-mono)', color: '#10b981', letterSpacing: '0.06em' }}>{ev.time}</div>
                  </motion.div>
                ) : null
              ))}
              {execVisible.length < EXECUTION_EVENTS.length && (
                <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
                  <span style={{ fontSize: 9, color: 'hsl(215 16% 36%)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Routing next action...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PHASE 3: STABILISATION ── */}
        {phase === 3 && (
          <motion.div
            key="p3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 40px', gap: 20, overflowY: 'auto' }}
          >
            <div>
              <div className="label-caps mb-2" style={{ color: '#10b981' }}>Vector · Outcome Capture</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Moment resolved. Conditions stabilising.</div>
            </div>

            {/* Live reversing metrics */}
            <div className="grid grid-cols-4 gap-0" style={{ border: '1px solid hsl(220 13% 10%)' }}>
              {[
                { label: 'Risk Score',       value: `${outcomeRisk}`, sub: '/ 100 — stabilising', color: '#10b981' },
                { label: 'Queue Depth',      value: `${outcomeQueue}`, sub: 'guests — clearing',  color: '#10b981' },
                { label: 'Room 847',         value: 'Released',        sub: '2 min early',         color: '#10b981' },
                { label: 'Value Protected',  value: `$${outcomeValue.toLocaleString()}`, sub: 'recovered',  color: '#c9a84c' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '18px 22px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none',
                  borderTop: `2px solid ${m.color}`,
                }}>
                  <div className="label-caps mb-2">{m.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: m.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</div>
                  <div className="mono-value mt-1.5" style={{ color: 'hsl(215 16% 30%)' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Execution record */}
            <div style={{ border: '1px solid rgba(16,185,129,0.15)', background: 'rgba(16,185,129,0.025)', padding: '18px 20px' }}>
              <div className="label-caps mb-3" style={{ color: '#10b981' }}>BXOS Execution Record — M2 VIP Arrival Risk</div>
              <div className="grid grid-cols-4 gap-x-6">
                {[
                  { label: 'Actions Dispatched',     value: '4' },
                  { label: 'Departments Coordinated',value: '3' },
                  { label: 'Time to First Action',   value: '12 sec' },
                  { label: 'Total Execution',        value: '1m 03s' },
                ].map((k, i) => (
                  <div key={i}>
                    <div className="label-caps mb-1">{k.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{k.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', padding: '16px 20px' }}>
              <p style={{ fontSize: 12, color: 'hsl(215 16% 55%)', lineHeight: 1.75 }}>
                BXOS detected the compounding pattern 10 minutes before impact. Nexus routed four coordinated actions in 45 seconds. Vector confirmed execution and captured outcome delta. $8,000 in guest lifetime value protected. Zero recovery cost. Zero visible service failure. This is what Detect — Decide — Route — Execute — Outcome looks like in an active operating layer.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Link href="/compare">
                <button
                  style={{
                    padding: '11px 24px', border: '1px solid hsl(220 13% 16%)',
                    color: 'hsl(215 16% 45%)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: 'transparent', cursor: 'pointer',
                  }}
                >
                  View Comparison
                </button>
              </Link>
              <Link href="/live-moments">
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '11px 28px', background: '#c9a84c', color: 'hsl(220 13% 5%)',
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                    border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#c9a84c')}
                >
                  Return to Live Moments
                  <ArrowRight size={9} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
