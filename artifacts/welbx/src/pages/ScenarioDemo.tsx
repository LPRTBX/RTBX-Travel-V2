import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { AlertTriangle, Clock, ShieldAlert, Users, TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";

const TOTAL_STEPS = 8;

const SIGNALS = [
  { icon: Clock,        text: 'Queue wait time exceeded threshold',   level: 'WARNING',  color: '#c9a84c' },
  { icon: AlertTriangle,text: 'VIP arrival logged — 12 minutes out',  level: 'WARNING',  color: '#c9a84c' },
  { icon: ShieldAlert,  text: 'Priority room not released — Rm 847',  level: 'CRITICAL', color: '#ef4444' },
  { icon: Users,        text: 'Front desk capacity constrained',       level: 'WARNING',  color: '#c9a84c' },
  { icon: TrendingDown, text: 'Negative sentiment cues rising',        level: 'WARNING',  color: '#c9a84c' },
];

const RECOMMENDATIONS = [
  { text: 'Open secondary check-in lane',           engine: 'BXOS',   detail: 'capacity routing' },
  { text: 'Reallocate nearest available host',       engine: 'NEXUS',  detail: 'proximity mapping' },
  { text: 'Prioritise housekeeping release — Rm 847',engine: 'VECTOR', detail: 'execution push' },
  { text: 'Trigger service recovery gesture',        engine: 'NEXUS',  detail: 'loyalty protocol' },
  { text: 'Protect VIP loyalty value',               engine: 'BXOS',   detail: 'guest intelligence' },
];

const EXECUTION_STEPS = [
  { text: 'Front desk lead notified',                    time: '00:00:12' },
  { text: 'Host reassigned — Nexus routed',              time: '00:00:31' },
  { text: 'Housekeeping priority pushed — Room 847',     time: '00:01:04' },
  { text: 'VIP welcome and recovery flow activated',     time: '00:01:47' },
];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="absolute top-0 left-56 right-0 h-px" style={{ background: 'hsl(220 13% 10%)' }}>
      <motion.div
        className="h-full"
        style={{ background: '#c9a84c' }}
        initial={{ width: 0 }}
        animate={{ width: `${(current / (TOTAL_STEPS - 1)) * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </div>
  );
}

function StepLabel({ step }: { step: number }) {
  const labels = ['Intro', 'Signals', 'Detection', 'Response', 'Decision', 'Execution', 'Outcome', 'Close'];
  return (
    <div className="absolute bottom-8 left-56 right-0 flex justify-center">
      <div className="flex items-center gap-1">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              style={{
                width: i === step ? 20 : 6,
                height: 2,
                background: i === step ? '#c9a84c' : i < step ? 'hsl(215 16% 25%)' : 'hsl(220 13% 14%)',
                transition: 'all 0.3s ease',
                borderRadius: 1,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContinueBtn({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 transition-all group"
      style={{
        padding: '10px 24px',
        border: '1px solid hsl(220 13% 16%)',
        color: 'hsl(215 16% 55%)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        background: 'transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 13% 28%)'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 13% 16%)'; e.currentTarget.style.color = 'hsl(215 16% 55%)'; }}
    >
      {label}
      <ArrowRight size={12} />
    </button>
  );
}

export default function ScenarioDemo() {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(240);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));

  useEffect(() => {
    if (step === 4) {
      setCountdown(240);
      const iv = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
      return () => clearInterval(iv);
    }
  }, [step]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-background pl-56 text-foreground flex flex-col overflow-hidden">
      <ProgressBar current={step} />
      <StepLabel step={step} />

      <AnimatePresence mode="wait">

        {/* STEP 0 — INTRO */}
        {step === 0 && (
          <motion.div
            key="s0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="label-caps mb-10" style={{ color: 'hsl(215 16% 30%)', letterSpacing: '0.2em' }}
            >
              The Moment Most Systems Miss
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="font-bold text-white leading-tight mb-8 max-w-3xl"
              style={{ fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1.2 }}
            >
              Peak check-in. Queue pressure is rising. A VIP guest has arrived. One room is not ready. Staff capacity is tightening. Sentiment is starting to fall.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="font-bold tracking-widest uppercase mb-14"
              style={{ fontSize: 11, color: '#c9a84c', letterSpacing: '0.2em' }}
            >
              WELBX detected a compounding arrival risk.
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              onClick={next}
              className="text-xs font-bold uppercase tracking-widest transition-all"
              style={{ padding: '14px 40px', background: '#fff', color: 'hsl(220 13% 5%)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              See How
            </motion.button>
          </motion.div>
        )}

        {/* STEP 1 — SIGNALS STACKING */}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-16"
          >
            <div className="w-full max-w-2xl">
              <div className="label-caps mb-3 text-center" style={{ color: 'hsl(215 16% 35%)' }}>BXOS · Signal Detection</div>
              <h2 className="text-xl font-bold text-white tracking-wide text-center mb-10">Signals Are Stacking</h2>
              <div className="space-y-2 mb-10">
                {SIGNALS.map((sig, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.45, duration: 0.3, ease: 'easeOut' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      border: `1px solid ${sig.color}25`,
                      background: `${sig.color}07`,
                    }}
                  >
                    <sig.icon size={14} style={{ color: sig.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#fff', flex: 1 }}>{sig.text}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: sig.color, flexShrink: 0 }}>
                      {sig.level}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
                  <ContinueBtn onClick={next} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — BXOS DETECTION */}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-16"
          >
            <div className="w-full max-w-2xl">
              <div className="label-caps mb-3 text-center" style={{ color: '#c9a84c' }}>BXOS · Moment Intelligence</div>
              <h2 className="text-xl font-bold text-white tracking-wide text-center mb-8">Compounding Moment Detected</h2>

              <div
                style={{
                  padding: 32,
                  background: 'hsl(220 13% 7%)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  boxShadow: '0 0 40px rgba(239,68,68,0.07)',
                  marginBottom: 32,
                }}
              >
                <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.7, marginBottom: 24 }}>
                  Arrival risk across service flow, room readiness, guest value, and staff capacity — all converging in the next 12 minutes.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'CONFIDENCE',  value: '94%',       color: '#fff' },
                    { label: 'RISK LEVEL',  value: 'CRITICAL',  color: '#ef4444' },
                    { label: 'DETECTED',    value: '14:32:07',  color: '#fff' },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="label-caps mb-2">{m.label}</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        style={{ fontSize: 22, fontWeight: 700, color: m.color, fontFamily: 'var(--app-font-mono)', letterSpacing: '0.02em' }}
                      >
                        {m.value}
                      </motion.div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="label-caps mb-2">Confidence</div>
                  <div style={{ height: 3, background: 'hsl(220 13% 12%)', borderRadius: 2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                      style={{ height: '100%', background: '#c9a84c', borderRadius: 2 }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ContinueBtn onClick={next} />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — NEXUS RECOMMENDATIONS */}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-16"
          >
            <div className="w-full max-w-2xl">
              <div className="label-caps mb-3 text-center" style={{ color: '#c9a84c' }}>Nexus · Routing Engine</div>
              <h2 className="text-xl font-bold text-white tracking-wide text-center mb-8">Response Mapped</h2>
              <div className="space-y-2 mb-10">
                {RECOMMENDATIONS.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '12px 16px',
                      background: 'hsl(220 13% 7%)',
                      border: '1px solid hsl(220 13% 11%)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{rec.text}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)', padding: '2px 6px' }}>
                        {rec.engine}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <ContinueBtn onClick={next} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4 — DECISION */}
        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="label-caps mb-4" style={{ color: 'hsl(215 16% 35%)' }}
            >
              WELBX is waiting for your instruction
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 48 }}
            >
              What Happens Next Is Your Decision
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex gap-4 w-full max-w-3xl mb-10"
            >
              <button
                onClick={next}
                className="flex-1 py-7 text-sm font-bold uppercase tracking-widest transition-all"
                style={{ background: '#c9a84c', color: 'hsl(220 13% 5%)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c9a84c')}
              >
                Accept All
              </button>
              <button
                className="flex-1 py-7 text-sm font-bold uppercase tracking-widest transition-all"
                style={{ border: '1px solid hsl(220 13% 16%)', color: 'hsl(215 16% 55%)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 13% 28%)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 13% 16%)'; e.currentTarget.style.color = 'hsl(215 16% 55%)'; }}
              >
                Override
              </button>
              <button
                className="flex-1 py-7 text-sm font-bold uppercase tracking-widest transition-all"
                style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', background: 'rgba(239,68,68,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.04)')}
              >
                Escalate
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-3"
              style={{ fontSize: 12, color: 'hsl(215 16% 35%)', fontFamily: 'var(--app-font-mono)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
              Auto-execution in {fmt(countdown)}
            </motion.div>
          </motion.div>
        )}

        {/* STEP 5 — EXECUTION */}
        {step === 5 && (
          <motion.div
            key="s5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-16"
          >
            <div className="w-full max-w-2xl">
              <div className="label-caps mb-3 text-center" style={{ color: '#10b981' }}>Vector · Execution Orchestration</div>
              <h2 className="text-xl font-bold text-white tracking-wide text-center mb-10">Vector Is Executing</h2>

              <div className="space-y-3 relative">
                <div
                  style={{
                    position: 'absolute',
                    left: 15,
                    top: 20,
                    bottom: 20,
                    width: 1,
                    background: 'hsl(220 13% 13%)',
                  }}
                />
                {EXECUTION_STEPS.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.85, duration: 0.35 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.85 + 0.1, type: 'spring', stiffness: 200 }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'rgba(16,185,129,0.12)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    </motion.div>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'hsl(220 13% 7%)',
                        border: '1px solid hsl(220 13% 10%)',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{s.text}</span>
                      <span style={{ fontSize: 11, color: '#10b981', fontFamily: 'var(--app-font-mono)', flexShrink: 0, marginLeft: 16 }}>
                        {s.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }}
                className="flex justify-center mt-10"
              >
                <ContinueBtn onClick={next} label="View Outcome" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 6 — OUTCOME */}
        {step === 6 && (
          <motion.div
            key="s6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center px-16"
          >
            <div className="w-full max-w-3xl">
              <div className="label-caps mb-3 text-center" style={{ color: '#10b981' }}>WELBX · Outcome Confirmed</div>
              <h2 className="text-xl font-bold text-white tracking-wide text-center mb-8">Controlled Outcome. Proven Value.</h2>

              {/* Before / After */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div style={{ padding: 24, background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 12%)' }}>
                  <div className="label-caps mb-4" style={{ color: 'hsl(215 16% 40%)' }}>Before</div>
                  <ul className="space-y-3">
                    {['Queue pressure: CRITICAL', 'Room 847: NOT READY', 'VIP arrival: AT RISK', 'Guest sentiment: DECLINING'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: '#ef4444' }}>
                        <span style={{ marginTop: 1, flexShrink: 0 }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: 24, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 30px rgba(16,185,129,0.06)' }}>
                  <div className="label-caps mb-4" style={{ color: '#10b981' }}>After</div>
                  <ul className="space-y-3">
                    {['Queue resolved — wait 2.1 min', 'Room 847 released — 2 min early', 'VIP handled — service intact', 'Sentiment stabilised'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: '#fff' }}>
                        <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Commercial numbers */}
              <div className="grid grid-cols-4 mb-8" style={{ border: '1px solid hsl(220 13% 10%)' }}>
                {[
                  { label: 'Value Protected',    value: '£8,000+',      color: '#c9a84c' },
                  { label: 'Outcome',             value: 'No Failure',   color: '#10b981' },
                  { label: 'Response Time',       value: '1m 47s',       color: '#fff' },
                  { label: 'NPS Delta',           value: '+22pts est.',  color: '#fff' },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none', textAlign: 'center' }}>
                    <div className="label-caps mb-2">{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: '-0.01em' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <ContinueBtn onClick={next} label="Finish" />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 7 — EXECUTIVE CLOSE */}
        {step === 7 && (
          <motion.div
            key="s7"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center px-16 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 16 }}
            >
              This is not reporting.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              style={{ fontSize: 24, fontWeight: 300, color: 'hsl(215 16% 50%)', maxWidth: 700, lineHeight: 1.4, marginBottom: 48 }}
            >
              This is operational intelligence turning signals into controlled outcomes in real time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex items-center gap-4 mb-14"
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              {['Detect', 'Decide', 'Route', 'Execute', 'Outcome'].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-4">
                  <span style={{ color: '#c9a84c' }}>{s}</span>
                  {i < arr.length - 1 && <span style={{ color: 'hsl(220 13% 22%)' }}>→</span>}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              <Link href="/live-moments">
                <button
                  className="text-xs font-bold uppercase tracking-widest transition-all"
                  style={{ padding: '14px 40px', background: '#fff', color: 'hsl(220 13% 5%)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  See It Live
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
