import { useState, useEffect } from "react";
import { SEEDED_MOMENTS } from "@/data/moments";
import { MomentCard } from "@/components/MomentCard";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";

function LiveClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toUTCString().slice(17, 22) + " UTC";
  });
  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      setTime(now.toUTCString().slice(17, 22) + " UTC");
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="mono-value" style={{ color: 'hsl(215 16% 40%)' }}>{time}</span>;
}

const FLOW_LABELS = ['Detect', 'Decide', 'Route', 'Execute', 'Outcome'];

const DECISION_CHAIN = [
  { label: 'Signal Detected', value: 'Guest Friction · 3 streams', time: '00:45 ago', color: '#ef4444', bg: 'rgba(239,68,68,0.07)' },
  { label: 'Classification', value: 'Friction Escalation Risk', time: '00:42 ago', color: '#c9a84c', bg: 'rgba(201,168,76,0.07)' },
  { label: 'Decision', value: 'Proactive Intervention', time: '00:38 ago', color: '#c9a84c', bg: 'rgba(201,168,76,0.06)' },
  { label: 'Routing', value: 'Guest Relations + F&B', time: '00:32 ago', color: '#60a5fa', bg: 'rgba(96,165,250,0.07)' },
  { label: 'Execution', value: 'Recovery action pending', time: 'Now', color: '#10b981', bg: 'rgba(16,185,129,0.06)', pulse: true },
  { label: 'Status', value: 'Monitoring outcome', time: 'Active', color: '#60a5fa', bg: 'rgba(96,165,250,0.04)' },
];

const CONTROL_STEPS = [
  { label: 'System detects', engine: 'SENSORS', color: 'hsl(215 16% 38%)' },
  { label: 'BXOS decides', engine: 'BXOS', color: '#c9a84c' },
  { label: 'Nexus routes', engine: 'NEXUS', color: '#60a5fa' },
  { label: 'Vector coordinates', engine: 'VECTOR', color: '#10b981' },
  { label: 'Organisation learns', engine: 'OUTCOMES', color: '#10b981' },
];

const ENGINE_STATE_BY_STEP = [
  'SENSORS detecting · BXOS standby',
  'BXOS deciding · NEXUS standby',
  'NEXUS routing · VECTOR standby',
  'VECTOR executing · all engines active',
  'OUTCOMES learning · cycle complete',
];

function getViewContent(flowStep: number, vipResolved: boolean) {
  const flowLabel = FLOW_LABELS[flowStep] ?? 'Detect';

  return {
    operator: {
      headline: vipResolved
        ? 'M2 VIP Arrival Risk — RESOLVED'
        : 'M2 VIP Arrival Risk — ACTIVE',
      items: [
        {
          label: 'Moment status',
          value: vipResolved ? 'Resolved · Closed' : 'Critical · Active',
        },
        {
          label: 'Current step',
          value: flowLabel,
        },
        {
          label: 'Recommended action',
          value: vipResolved ? 'None — automated resolution complete' : 'Coordinate Housekeeping + Front Desk',
        },
        {
          label: 'Exposure',
          value: vipResolved ? 'Protected · zero loss' : 'High-value VIP booking',
        },
      ],
      note: vipResolved
        ? 'VIP arrival coordinated successfully. No guest-facing friction recorded. Protocol closed.'
        : 'Critical moment active. BXOS has initiated cross-department coordination. Monitor execution.',
    },
    system: {
      headline: `BXOS pattern confidence: 87% · Step: ${flowLabel}`,
      items: [
        { label: 'Signal convergence', value: '3 streams · 14 min window' },
        { label: 'Pattern class', value: 'VIP Arrival Risk · Historical match' },
        {
          label: 'Engine state',
          value: ENGINE_STATE_BY_STEP[flowStep] ?? ENGINE_STATE_BY_STEP[0],
        },
        {
          label: 'Decision latency',
          value: flowStep === 0 ? 'Awaiting classification' : '6 seconds',
        },
      ],
      note: flowStep >= 4
        ? 'Execution cycle complete. OUTCOMES engine recording learnings for future pattern refinement.'
        : flowStep >= 3
        ? 'VECTOR execution engine active. Cross-department coordination in progress.'
        : flowStep >= 2
        ? 'NEXUS routing response chain. VECTOR engine on standby for execution.'
        : flowStep >= 1
        ? 'BXOS classification complete. Routing to NEXUS for response coordination.'
        : 'Governed response chain active. No manual escalation required unless threshold crossed.',
    },
    executive: {
      headline: vipResolved
        ? 'Value protected — VIP guest secured'
        : 'Value at risk — VIP booking',
      items: [
        {
          label: 'Risk tier',
          value: vipResolved ? 'RESOLVED · Guest retained' : 'HIGH · VIP guest lifetime value',
        },
        { label: 'Intervention cost', value: 'Zero · automated' },
        {
          label: vipResolved ? 'Value secured' : 'Value at risk',
          value: vipResolved ? 'Secured (confirmed)' : 'At risk',
        },
        {
          label: 'Protocol',
          value: vipResolved ? 'Level 1 · Complete' : 'Level 1 · VIP arrival coordination',
        },
      ],
      note: vipResolved
        ? 'WELBX resolved the VIP arrival risk automatically. Value protected. Zero staff escalation required.'
        : 'WELBX has detected a VIP arrival coordination gap. Automated resolution in progress — no action required.',
    },
  };
}

type ViewKey = 'operator' | 'system' | 'executive';

export default function LiveMoments() {
  const { flowStep, vectorExecuting, resolveVIP, momentCount, vipResolved } = useApp();
  const [activeView, setActiveView] = useState<ViewKey>('operator');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    setHighlightedId(hash);
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    }
    const t = setTimeout(() => setHighlightedId(null), 2200);
    return () => clearTimeout(t);
  }, []);

  const viewContent = getViewContent(flowStep, vipResolved);
  const criticalCount = vipResolved ? 0 : 1;
  const summaryStats = [
    { label: "Active Moments", value: String(momentCount) },
    { label: "Critical", value: String(criticalCount), color: criticalCount > 0 ? "#ef4444" : "#10b981" },
    { label: "High Priority", value: "3", color: "#c9a84c" },
    { label: "Active Score", value: vipResolved ? "42" : "84", color: "#c9a84c" },
  ];

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">

      {/* VECTOR EXECUTING overlay */}
      <AnimatePresence>
        {vectorExecuting && (
          <motion.div
            key="vector-exec"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              left: 224,
              background: 'rgba(10,12,16,0.94)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{ width: 48, height: 2, background: '#c9a84c', marginBottom: 28, transformOrigin: 'left' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: 11, letterSpacing: '0.22em', color: '#c9a84c', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}
            >
              Vector · Execution Engine
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}
            >
              Routing Response
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 13, color: 'hsl(215 16% 42%)', letterSpacing: '0.04em' }}
            >
              M2 — VIP Arrival Risk — coordinating cross-department execution
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 mt-8"
            >
              {['Housekeeping', 'Front Desk', 'Guest Relations'].map((dept, i) => (
                <motion.span
                  key={dept}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.18 }}
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#c9a84c', padding: '4px 10px',
                    border: '1px solid rgba(201,168,76,0.25)',
                    background: 'rgba(201,168,76,0.07)',
                  }}
                >{dept}</motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 sm:px-6 md:px-10 pt-8 pb-16 max-w-5xl">

        {/* ── LIVE SCENARIO BANNER ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 28,
            padding: '14px 20px',
            border: '1px solid rgba(201,168,76,0.35)',
            background: 'rgba(201,168,76,0.05)',
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#c9a84c', flexShrink: 0,
                animation: 'pulse-amber 1.8s ease-in-out infinite',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, letterSpacing: '0.01em' }}>
                <span style={{ color: '#c9a84c' }}>LIVE MOMENT:</span>{' '}Guest Friction Escalation Risk
              </div>
              <div style={{ fontSize: 10, color: 'hsl(215 16% 42%)', letterSpacing: '0.02em' }}>
                Room 614 · Detected 00:45 ago · BXOS confidence 87% · Recovery action pending
              </div>
            </div>
            <div style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '4px 10px', color: '#ef4444',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              flexShrink: 0,
            }}>
              HIGH PRIORITY
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Moment Intelligence</div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Live Moments</h1>
              <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 45%)', letterSpacing: '0.01em' }}>
                WELBX detects live operational moments, recommends action, coordinates execution, and proves value.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <LiveClock />
            </div>
          </div>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{ border: '1px solid hsl(220 13% 10%)' }}
          >
            {summaryStats.map((s, i) => (
              <div key={i} className="px-4 sm:px-6 py-4" style={{ borderRight: i < summaryStats.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                <div className="label-caps mb-2">{s.label}</div>
                <motion.div
                  animate={{ color: s.color || '#fff' }}
                  transition={{ duration: 0.6 }}
                  className="font-bold leading-none"
                  style={{ fontSize: 28, letterSpacing: '-0.01em' }}
                >
                  {s.value}
                </motion.div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Flow indicator */}
        <div className="flex flex-wrap items-center gap-0 mb-6" style={{ paddingBottom: 16, borderBottom: '1px solid hsl(220 13% 9%)' }}>
          {FLOW_LABELS.map((label, i, arr) => {
            const active = i === flowStep;
            const done = i < flowStep;
            return (
              <div key={label} className="flex items-center">
                <motion.div
                  animate={{
                    background: active ? 'rgba(201,168,76,0.08)' : done ? 'rgba(16,185,129,0.06)' : 'transparent',
                    borderColor: active ? 'rgba(201,168,76,0.2)' : done ? 'rgba(16,185,129,0.15)' : 'transparent',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    border: '1px solid transparent',
                  }}
                >
                  {active && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} className="animate-pulse" />
                  )}
                  {done && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  )}
                  <motion.span
                    animate={{
                      color: active ? '#c9a84c' : done ? '#10b981' : 'hsl(215 16% 30%)',
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    {label}
                  </motion.span>
                </motion.div>
                {i < arr.length - 1 && (
                  <span style={{ color: 'hsl(220 13% 16%)', fontSize: 9, padding: '0 4px' }}>→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── BXOS DECISION PANEL ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: 20, border: '1px solid hsl(220 13% 11%)', background: 'hsl(220 13% 6.5%)' }}
        >
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid hsl(220 13% 10%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c' }} className="animate-pulse" />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase' }}>
                BXOS · Decision Panel
              </span>
            </div>
            <span style={{ fontSize: 8, color: 'hsl(215 16% 28%)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Guest Friction Escalation Risk · Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {DECISION_CHAIN.map((step, i) => (
              <div
                key={step.label}
                style={{
                  padding: '16px 14px',
                  borderRight: '1px solid hsl(220 13% 9%)',
                  borderBottom: '1px solid hsl(220 13% 9%)',
                  background: step.bg,
                  position: 'relative',
                }}
              >
                {step.pulse && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 5, height: 5, borderRadius: '50%', background: step.color,
                    animation: 'pulse-amber 1.5s ease-in-out infinite',
                  }} />
                )}
                <div style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'hsl(215 16% 32%)', marginBottom: 8,
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: step.color,
                  lineHeight: 1.4, marginBottom: 8,
                }}>
                  {step.value}
                </div>
                <div style={{
                  fontSize: 8, letterSpacing: '0.08em', color: 'hsl(215 16% 28%)',
                  fontFamily: 'var(--app-font-mono)',
                }}>
                  {step.time}
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 2, background: step.color, opacity: 0.35,
                }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CONTROL TRANSFER IN ACTION ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ marginBottom: 20, border: '1px solid hsl(220 13% 11%)', background: 'hsl(220 13% 6.5%)' }}
        >
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid hsl(220 13% 10%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'hsl(215 16% 48%)', textTransform: 'uppercase' }}>
              Control Transfer in Action
            </span>
            <span style={{ fontSize: 8, color: 'hsl(215 16% 24%)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Live · Current moment
            </span>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
            {CONTROL_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  padding: '10px 14px',
                  border: `1px solid ${step.color}28`,
                  background: `${step.color}06`,
                  textAlign: 'center',
                  minWidth: 100,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: step.color, marginBottom: 4,
                  }}>
                    {step.engine}
                  </div>
                  <div style={{ fontSize: 10, color: 'hsl(215 16% 55%)', fontWeight: 500 }}>
                    {step.label}
                  </div>
                </div>
                {i < CONTROL_STEPS.length - 1 && (
                  <span style={{ color: 'hsl(220 13% 28%)', fontSize: 11, flexShrink: 0 }}>›</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── VIEW TOGGLES ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ marginBottom: 20, border: '1px solid hsl(220 13% 11%)', background: 'hsl(220 13% 6.5%)' }}
        >
          {/* Toggle tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid hsl(220 13% 10%)' }}>
            {(['operator', 'system', 'executive'] as ViewKey[]).map((key) => {
              const labels: Record<ViewKey, string> = {
                operator: 'Operator View',
                system: 'System View',
                executive: 'Executive View',
              };
              const isActive = activeView === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    background: isActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                    color: isActive ? '#c9a84c' : 'hsl(215 16% 34%)',
                    border: 'none',
                    borderRight: key !== 'executive' ? '1px solid hsl(220 13% 10%)' : 'none',
                    borderBottom: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              style={{ padding: '16px 20px' }}
            >
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', color: 'hsl(215 16% 28%)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Current Signal
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.4 }}>
                  {viewContent[activeView].headline}
                </div>
                {viewContent[activeView].items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '6px 0', borderBottom: '1px solid hsl(220 13% 9%)', gap: 12,
                  }}>
                    <span style={{ fontSize: 9, color: 'hsl(215 16% 32%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215 16% 60%)', textAlign: 'right' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 16px', border: '1px solid rgba(201,168,76,0.14)', background: 'rgba(201,168,76,0.03)' }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: 'hsl(215 16% 26%)', textTransform: 'uppercase', marginBottom: 8 }}>
                  BXOS Assessment
                </div>
                <p style={{ fontSize: 11, color: 'hsl(215 16% 46%)', lineHeight: 1.7, margin: 0 }}>
                  {viewContent[activeView].note}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── MISSED WITHOUT WELBX ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={{ marginBottom: 28, border: '1px solid hsl(220 13% 11%)' }}
        >
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid hsl(220 13% 10%)',
            background: 'hsl(220 13% 6.5%)',
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'hsl(215 16% 48%)', textTransform: 'uppercase' }}>
              Missed Without WELBX
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Without */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid hsl(220 13% 10%)',
              background: 'rgba(239,68,68,0.025)',
            }}
            className="md:border-b-0 md:border-r"
            >
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(239,68,68,0.5)', marginBottom: 14,
              }}>
                Without WELBX
              </div>
              {[
                { label: 'Signal detection', value: 'None — not monitored' },
                { label: 'Staff awareness', value: 'Zero' },
                { label: 'Intervention', value: 'Not triggered' },
                { label: 'Guest outcome', value: 'Complaint or silent churn' },
                { label: 'Value impact', value: 'At risk · unprotected' },
                { label: 'Recovery cost', value: 'Elevated · post-failure comps' },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '7px 0', borderBottom: '1px solid hsl(220 13% 9%)', gap: 12,
                }}>
                  <span style={{ fontSize: 9, color: 'hsl(215 16% 30%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(239,68,68,0.55)', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'hsl(215 16% 28%)', lineHeight: 1.65, paddingTop: 12, marginTop: 4 }}>
                This moment happens invisibly. Staff respond reactively — if at all. No outcome data is captured.
              </div>
            </div>

            {/* With */}
            <div style={{ padding: '20px 24px', background: 'transparent' }}>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#c9a84c', marginBottom: 14,
              }}>
                With WELBX
              </div>
              {[
                { label: 'Signal detection', value: 'Detected 00:45 ago — 3 streams' },
                { label: 'Staff awareness', value: 'Guest Relations alerted' },
                { label: 'Intervention', value: 'Recovery action dispatched' },
                { label: 'Guest outcome', value: 'Friction resolved before escalation' },
                { label: 'Value impact', value: 'Protected' },
                { label: 'Recovery cost', value: 'Zero · proactive resolution' },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '7px 0', borderBottom: '1px solid hsl(220 13% 9%)', gap: 12,
                }}>
                  <span style={{ fontSize: 9, color: 'hsl(215 16% 30%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'hsl(215 16% 40%)', lineHeight: 1.65, paddingTop: 12, marginTop: 4 }}>
                WELBX surfaces this moment automatically. The system decides. The team executes. The outcome is recorded.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moment cards */}
        <div className="space-y-3">
          {SEEDED_MOMENTS.map((moment, i) => {
            const isHighlighted = highlightedId === moment.id;
            return (
              <div
                key={moment.id}
                id={moment.id}
                style={{
                  borderRadius: 0,
                  outline: isHighlighted ? '2px solid #c9a84c' : '2px solid transparent',
                  outlineOffset: 2,
                  boxShadow: isHighlighted ? '0 0 18px rgba(201,168,76,0.28)' : 'none',
                  transition: 'outline 0.25s ease, box-shadow 0.8s ease',
                }}
              >
                <MomentCard
                  moment={moment}
                  index={i}
                  onVipAccept={moment.id === 'm2' ? resolveVIP : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
