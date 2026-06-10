import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";

type MetricStatus = 'normal' | 'warning' | 'critical' | 'active' | 'resolved';

interface SideData {
  headline: string;
  tag: string;
  tagType: MetricStatus | 'normal';
  metrics: { label: string; value: string; status: MetricStatus }[];
  note: string;
}

const TIMELINE = [
  { time: 'T+00:00', label: 'Peak check-in begins' },
  { time: 'T+02:00', label: 'Signals emerge' },
  { time: 'T+05:30', label: 'Decision window' },
  { time: 'T+08:00', label: 'VIP arrives' },
  { time: 'T+12:00', label: 'Aftermath' },
];

const STEPS: Array<{ without: SideData; with: SideData }> = [
  {
    without: {
      headline: 'Standard operations. Morning briefing complete. No live monitoring active.',
      tag: 'NO LIVE MONITORING',
      tagType: 'normal',
      metrics: [
        { label: 'Queue Depth',    value: '8 guests',  status: 'normal' },
        { label: 'VIP ETA',        value: '18 min',     status: 'normal' },
        { label: 'Room 847',       value: 'Occupied',   status: 'warning' },
        { label: 'Front Desk',     value: '3 agents',   status: 'normal' },
        { label: 'Sentiment',      value: 'Neutral',    status: 'normal' },
      ],
      note: 'Staff on standard allocation. No escalation pathway active. No cross-signal visibility.',
    },
    with: {
      headline: 'BXOS active. 3 converging signals under observation. Pattern forming.',
      tag: 'BXOS MONITORING',
      tagType: 'active',
      metrics: [
        { label: 'Queue Depth',        value: '8 guests',    status: 'normal' },
        { label: 'VIP ETA',            value: '18 min',       status: 'warning' },
        { label: 'Room 847',           value: 'Occupied',     status: 'warning' },
        { label: 'Signal Confidence',  value: '71%',          status: 'active' },
        { label: 'Pattern',            value: 'Compounding',  status: 'warning' },
      ],
      note: 'Compounding VIP arrival risk pattern detected. Confidence rising. No action required yet.',
    },
  },
  {
    without: {
      headline: 'Queue growing. No alert triggered. Staff unaware of compounding pressure.',
      tag: 'NO ACTION',
      tagType: 'warning',
      metrics: [
        { label: 'Queue Depth',   value: '11 guests',       status: 'warning' },
        { label: 'VIP ETA',       value: '14 min',           status: 'warning' },
        { label: 'Room 847',      value: 'Still occupied',   status: 'warning' },
        { label: 'Front Desk',    value: '87% capacity',     status: 'warning' },
        { label: 'Sentiment',     value: 'Declining',        status: 'warning' },
      ],
      note: 'Conditions worsening silently. No cross-department coordination. Operational window closing.',
    },
    with: {
      headline: 'Moment M2 detected. Confidence 91%. Recommendation generated.',
      tag: 'MOMENT DETECTED',
      tagType: 'active',
      metrics: [
        { label: 'Queue Depth',   value: '11 guests',       status: 'warning' },
        { label: 'VIP ETA',       value: '14 min',           status: 'warning' },
        { label: 'Moment M2',     value: 'VIP Arrival Risk', status: 'active' },
        { label: 'Confidence',    value: '91%',              status: 'active' },
        { label: 'Exposure',      value: 'High-value at risk', status: 'warning' },
      ],
      note: 'BXOS surfaces M2. Action recommended: prioritise Room 847, activate check-in relief, route host.',
    },
  },
  {
    without: {
      headline: 'Queue at 14. Front desk at capacity. No coordination happening.',
      tag: 'ESCALATING',
      tagType: 'critical',
      metrics: [
        { label: 'Queue Depth',       value: '14 guests',  status: 'critical' },
        { label: 'VIP ETA',           value: '8 min',       status: 'critical' },
        { label: 'Room 847',          value: 'Not released', status: 'critical' },
        { label: 'Front Desk',        value: '100% capacity', status: 'critical' },
        { label: 'Housekeeping ETA',  value: '22 min',      status: 'critical' },
      ],
      note: 'All pressure vectors compounding. No cross-department routing. Response window nearly closed.',
    },
    with: {
      headline: 'Nexus routing cross-department response. Four actions dispatched in 45 seconds.',
      tag: 'NEXUS ROUTING',
      tagType: 'active',
      metrics: [
        { label: 'Secondary Lane',   value: 'Opened',             status: 'resolved' },
        { label: 'Host Reassigned',  value: 'Proximity routing',  status: 'resolved' },
        { label: 'Housekeeping',     value: 'Priority pushed',    status: 'active' },
        { label: 'Front Desk Load',  value: '62% — reducing',     status: 'active' },
        { label: 'Sentiment',        value: 'Protocol active',    status: 'active' },
      ],
      note: 'Three departments coordinated in under one minute. Room 847 reprioritised ahead of VIP window.',
    },
  },
  {
    without: {
      headline: 'VIP arrives. Room not ready. Queue depth 18. Lobby wait: 14 minutes.',
      tag: 'SERVICE FAILURE',
      tagType: 'critical',
      metrics: [
        { label: 'VIP Status',   value: 'Waiting — lobby',          status: 'critical' },
        { label: 'Wait Time',    value: '14+ min',                   status: 'critical' },
        { label: 'Queue Depth',  value: '18 guests',                 status: 'critical' },
        { label: 'Room 847',     value: 'Blocked',                   status: 'critical' },
        { label: 'Sentiment',    value: '3 verbal complaint signals', status: 'critical' },
      ],
      note: 'DIAMOND-tier guest experiencing visible failure. Loyalty programme exposure fully activated.',
    },
    with: {
      headline: 'VIP arrives. Room released 2 minutes early. Welcome protocol active. Zero wait.',
      tag: 'EXECUTING',
      tagType: 'resolved',
      metrics: [
        { label: 'VIP Status',       value: 'Room ready',          status: 'resolved' },
        { label: 'Wait Time',        value: '0 min',               status: 'resolved' },
        { label: 'Queue Depth',      value: '7 guests — clearing', status: 'active' },
        { label: 'Room 847',         value: 'Released 2 min early', status: 'resolved' },
        { label: 'Welcome Protocol', value: 'Activated',           status: 'resolved' },
      ],
      note: 'VIP checked in without incident. Queue clearing. Staff allocation returning to nominal within 6 minutes.',
    },
  },
  {
    without: {
      headline: 'Service recovery triggered. Comps issued. Loyalty damage logged.',
      tag: 'RECOVERY MODE',
      tagType: 'critical',
      metrics: [
        { label: 'Comp Cost',      value: 'Issued · elevated', status: 'critical' },
        { label: 'VIP Complaint',  value: 'Logged',           status: 'critical' },
        { label: 'Review Risk',    value: '2 likely negative', status: 'critical' },
        { label: 'NPS Impact',     value: '−14 pts',          status: 'critical' },
        { label: 'Value',          value: 'LTV at risk',         status: 'critical' },
      ],
      note: 'Cascade continued through afternoon. 3 incidents unresolved at end of shift. No outcome data captured.',
    },
    with: {
      headline: 'Moment resolved. Zero recovery cost. Value protected. System nominal.',
      tag: 'RESOLVED',
      tagType: 'resolved',
      metrics: [
        { label: 'Comp Cost',        value: '$0',           status: 'resolved' },
        { label: 'VIP Satisfaction', value: 'Maintained',   status: 'resolved' },
        { label: 'Review Risk',      value: 'Contained',    status: 'resolved' },
        { label: 'NPS Impact',       value: '+2 pts',       status: 'resolved' },
        { label: 'Value Protected',   value: 'Secured',     status: 'resolved' },
      ],
      note: 'BXOS captured execution record and outcome delta. Response time 45 seconds. System returned to nominal.',
    },
  },
];

const COMPARISON = [
  { metric: 'Queue wait time at peak',  without: '18.4 min',   with: '3.2 min' },
  { metric: 'Room 847 release',         without: '22 min late', with: 'On time' },
  { metric: 'VIP lobby wait',           without: '14 min',      with: '0 min' },
  { metric: 'Recovery comps issued',    without: 'Issued',      with: 'None' },
  { metric: 'Value protected',          without: '—',           with: 'Secured' },
  { metric: 'Guest NPS impact',         without: '−14 pts',     with: '+2 pts' },
  { metric: 'Service pressure peak',    without: '89 / 100',    with: '58 / 100' },
  { metric: 'Incidents unresolved',     without: '3',           with: '0' },
];

const STATUS_COLORS: Record<MetricStatus | 'normal', { val: string; dot: string }> = {
  normal:   { val: 'hsl(215 16% 62%)', dot: 'hsl(215 16% 38%)' },
  warning:  { val: '#c9a84c',          dot: '#c9a84c' },
  critical: { val: '#ef4444',          dot: '#ef4444' },
  active:   { val: '#c9a84c',          dot: '#c9a84c' },
  resolved: { val: '#10b981',          dot: '#10b981' },
};

const TAG_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  normal:   { color: 'hsl(215 16% 42%)', bg: 'transparent',              border: 'hsl(220 13% 16%)' },
  warning:  { color: '#c9a84c',           bg: 'rgba(201,168,76,0.07)',    border: 'rgba(201,168,76,0.25)' },
  critical: { color: '#ef4444',           bg: 'rgba(239,68,68,0.08)',     border: 'rgba(239,68,68,0.3)' },
  active:   { color: '#c9a84c',           bg: 'rgba(201,168,76,0.1)',     border: 'rgba(201,168,76,0.3)' },
  resolved: { color: '#10b981',           bg: 'rgba(16,185,129,0.08)',    border: 'rgba(16,185,129,0.25)' },
};

function SidePanel({ data, side }: { data: SideData; side: 'without' | 'with' }) {
  const isWithout = side === 'without';
  const tag = TAG_STYLES[data.tagType] || TAG_STYLES.normal;
  return (
    <div style={{
      flex: 1, padding: '24px 28px',
      background: isWithout ? 'rgba(239,68,68,0.025)' : 'transparent',
      borderRight: isWithout ? '1px solid hsl(220 13% 11%)' : 'none',
      display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden',
    }}>
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '3px 9px', color: tag.color, background: tag.bg, border: `1px solid ${tag.border}`,
      }}>
        {data.tag}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: isWithout ? 'hsl(215 16% 50%)' : '#fff', lineHeight: 1.5 }}>
        {data.headline}
      </div>
      <div style={{ flex: 1 }}>
        {data.metrics.map((m, i) => {
          const c = STATUS_COLORS[m.status];
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid hsl(220 13% 9%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: 'hsl(215 16% 38%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{m.label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.val, fontFamily: 'var(--app-font-mono)', letterSpacing: '0.03em' }}>{m.value}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 10, color: 'hsl(215 16% 34%)', lineHeight: 1.65, paddingTop: 12, borderTop: '1px solid hsl(220 13% 9%)' }}>
        {data.note}
      </div>
    </div>
  );
}

export default function CompareMode() {
  const [step, setStep] = useState(0);
  const isComparison = step === 5;
  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 bg-background pl-56 text-foreground flex flex-col overflow-hidden">

      {/* Progress bar */}
      <div className="absolute top-0 left-56 right-0 h-px" style={{ background: 'hsl(220 13% 10%)' }}>
        <motion.div
          className="h-full" style={{ background: '#c9a84c' }}
          animate={{ width: `${(step / 5) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Header */}
      <div style={{
        padding: '20px 28px 14px', borderBottom: '1px solid hsl(220 13% 10%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div>
          <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 28%)' }}>WELBX · Proof of Concept</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.005em' }}>
            {isComparison ? 'Outcome Comparison — Same Moment, Two Realities' : `${TIMELINE[step]?.time} — ${TIMELINE[step]?.label}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {[...TIMELINE, { time: '', label: 'Outcome' }].map((_, i) => (
            <div key={i} style={{
              width: i === step ? 18 : 5, height: 5,
              background: i < step ? '#10b981' : i === step ? '#c9a84c' : 'hsl(220 13% 14%)',
              borderRadius: 999, transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Column headers — shown on timeline steps only */}
      {!isComparison && (
        <div style={{ display: 'flex', borderBottom: '1px solid hsl(220 13% 10%)', flexShrink: 0 }}>
          <div style={{ flex: 1, padding: '8px 28px', borderRight: '1px solid hsl(220 13% 10%)', background: 'rgba(239,68,68,0.025)' }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.45)' }}>
              Without WELBX
            </span>
          </div>
          <div style={{ flex: 1, padding: '8px 28px' }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>
              With WELBX
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">

          {/* Timeline steps */}
          {!isComparison && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            >
              <SidePanel data={STEPS[step].without} side="without" />
              <SidePanel data={STEPS[step].with} side="with" />
            </motion.div>
          )}

          {/* Outcome comparison panel */}
          {isComparison && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div>
                <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Results — Peak Check-in Scenario · The Grand Meridian, London</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Same moment. Same hotel. Two different outcomes.
                </div>
              </div>

              {/* Comparison table */}
              <div style={{ border: '1px solid hsl(220 13% 12%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid hsl(220 13% 10%)', padding: '10px 20px', background: 'hsl(220 13% 7%)' }}>
                  <div className="label-caps">Metric</div>
                  <div className="label-caps" style={{ color: 'rgba(239,68,68,0.4)', textAlign: 'center' }}>Without WELBX</div>
                  <div className="label-caps" style={{ color: '#c9a84c', textAlign: 'center' }}>With WELBX</div>
                </div>
                {COMPARISON.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
                      padding: '11px 20px',
                      borderBottom: i < COMPARISON.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontSize: 11, color: 'hsl(215 16% 52%)' }}>{row.metric}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(239,68,68,0.6)', textAlign: 'center', fontFamily: 'var(--app-font-mono)' }}>{row.without}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textAlign: 'center', fontFamily: 'var(--app-font-mono)' }}>{row.with}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.14)', padding: '18px 22px' }}
              >
                <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>The difference</div>
                <p style={{ fontSize: 12, color: 'hsl(215 16% 56%)', lineHeight: 1.75, maxWidth: 820 }}>
                  Most systems report the problem after it has happened. WELBX detected the compounding pattern 18 minutes before impact, routed a coordinated response in 45 seconds, and protected guest lifetime value — with zero recovery cost and zero visible service failure. The question is not whether these moments happen. They happen in every hotel, every day. The question is what your operating layer does when they do.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Link href="/command-mode">
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 32px',
                      background: '#c9a84c', color: 'hsl(220 13% 5%)',
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase',
                      border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#c9a84c')}
                  >
                    Next: Command Mode
                    <ArrowRight size={10} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div style={{
        padding: '12px 28px', borderTop: '1px solid hsl(220 13% 10%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <button
          onClick={prev}
          disabled={step === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', border: '1px solid hsl(220 13% 16%)',
            color: step === 0 ? 'hsl(220 13% 20%)' : 'hsl(215 16% 48%)',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            background: 'transparent', cursor: step === 0 ? 'default' : 'pointer',
          }}
        >
          <ArrowLeft size={9} />
          Back
        </button>
        <div style={{ display: 'flex', gap: 3 }}>
          {[0,1,2,3,4,5].map(i => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 5, height: 5, borderRadius: 999,
                background: i === step ? '#c9a84c' : i < step ? 'hsl(215 16% 28%)' : 'hsl(220 13% 14%)',
                border: 'none', cursor: 'pointer', transition: 'all 0.25s',
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={step === 5}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px',
            background: step === 5 ? 'transparent' : '#c9a84c',
            color: step === 5 ? 'hsl(220 13% 20%)' : 'hsl(220 13% 5%)',
            border: step === 5 ? '1px solid hsl(220 13% 16%)' : 'none',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: step === 5 ? 'default' : 'pointer',
          }}
        >
          {step === 4 ? 'See Results' : 'Advance'}
          <ArrowRight size={9} />
        </button>
      </div>
    </div>
  );
}
