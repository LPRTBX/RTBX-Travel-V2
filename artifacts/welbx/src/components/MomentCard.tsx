import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moment, MomentStatus } from "@/data/moments";
import { ChevronDown, ArrowRight } from "lucide-react";

interface MomentCardProps {
  moment: Moment;
  index: number;
}

const STATUS_CONFIG: Record<MomentStatus, { label: string; color: string; bg: string; border: string; pulse?: boolean }> = {
  DETECTED:   { label: 'DETECTED',    color: '#c9a84c', bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.25)' },
  ACTIONED:   { label: 'ACTIONED',    color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)' },
  IN_PROGRESS:{ label: 'IN PROGRESS', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)', pulse: true },
  STABILISED: { label: 'STABILISED',  color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
  RESOLVED:   { label: 'RESOLVED',    color: 'rgba(16,185,129,0.5)', bg: 'rgba(16,185,129,0.04)', border: 'rgba(16,185,129,0.12)' },
  ESCALATED:  { label: 'ESCALATED',   color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)' },
};

const URGENCY_BORDER: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#c9a84c',
  MEDIUM:   'rgba(201,168,76,0.4)',
  LOW:      'hsl(220 13% 12%)',
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#c9a84c',
  MEDIUM:   '#9ca3af',
  LOW:      '#6b7280',
};

export function MomentCard({ moment: initialMoment, index }: MomentCardProps) {
  const [moment, setMoment] = useState<Moment>(initialMoment);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAction = (action: string) => {
    let nextStatus: MomentStatus = moment.status;
    if (action === 'ACCEPT')   nextStatus = 'ACTIONED';
    else if (action === 'ASSIGN')   nextStatus = 'IN_PROGRESS';
    else if (action === 'OVERRIDE') nextStatus = 'RESOLVED';
    else if (action === 'ESCALATE') nextStatus = 'ESCALATED';
    else if (action === 'MONITOR') nextStatus = 'STABILISED';
    setMoment({ ...moment, status: nextStatus });
    if (nextStatus !== 'DETECTED') setShowFeedback(true);
  };

  const statusCfg = STATUS_CONFIG[moment.status];
  const urgencyBorder = URGENCY_BORDER[moment.urgency];
  const urgencyColor = URGENCY_COLOR[moment.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        background: moment.urgency === 'CRITICAL' ? 'hsl(220 13% 7.5%)' : 'hsl(220 13% 7%)',
        borderTop: `1px solid hsl(220 13% 11%)`,
        borderRight: `1px solid hsl(220 13% 11%)`,
        borderBottom: `1px solid hsl(220 13% 11%)`,
        borderLeft: moment.urgency === 'CRITICAL' ? `3px solid ${urgencyBorder}` : `2px solid ${urgencyBorder}`,
        boxShadow: moment.urgency === 'CRITICAL' ? '0 0 40px rgba(239,68,68,0.06), inset 0 0 40px rgba(239,68,68,0.02)' : 'none',
      }}
      className="relative overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid hsl(220 13% 10%)' }}>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-3 mb-1.5">
            <span style={{ fontSize: 9, letterSpacing: '0.12em', color: urgencyColor, fontWeight: 700, textTransform: 'uppercase' }}>
              {moment.urgency}
            </span>
            <span style={{ fontSize: 9, color: 'hsl(215 16% 35%)', letterSpacing: '0.08em' }}>·</span>
            <span style={{ fontSize: 9, letterSpacing: '0.12em', color: 'hsl(215 16% 35%)', fontWeight: 600, textTransform: 'uppercase' }}>
              {moment.id.toUpperCase()}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white leading-snug" style={{ letterSpacing: '0.01em' }}>
            {moment.title}
          </h3>
          <p className="text-xs mt-1" style={{ color: 'hsl(215 16% 45%)' }}>{moment.whySurfaced}</p>
        </div>
        <div className="flex-shrink-0">
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              background: statusCfg.bg,
              color: statusCfg.color,
              border: `1px solid ${statusCfg.border}`,
              animation: statusCfg.pulse ? 'pulse-amber 2s infinite' : undefined,
            }}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-x-8 gap-y-4">
          
          {/* Signals — 5 cols */}
          <div className="col-span-5">
            <div className="label-caps mb-2">Signal Stack</div>
            <ul className="space-y-1.5">
              {moment.signals.map((sig, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white">
                  <span style={{ color: 'hsl(43 68% 55%)', marginTop: 1 }}>—</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern + Intelligence — 4 cols */}
          <div className="col-span-4 space-y-4">
            <div>
              <div className="label-caps mb-1.5">Pattern</div>
              <div className="text-xs text-white leading-snug">{moment.patternDetected}</div>
            </div>
            <div>
              <div className="label-caps mb-1.5">Intelligence</div>
              <div className="flex items-center gap-4">
                <div>
                  <div style={{ fontSize: 9, color: 'hsl(215 16% 40%)', letterSpacing: '0.08em' }}>CONF</div>
                  <div className="text-sm font-bold text-white">{moment.confidence}%</div>
                </div>
                <div className="flex-1">
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'hsl(220 13% 14%)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${moment.confidence}%`, background: 'hsl(43 68% 55%)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exposure — 3 cols */}
          <div className="col-span-3">
            <div className="label-caps mb-1.5">Commercial Exposure</div>
            <div className="text-sm font-semibold" style={{ color: urgencyColor === '#ef4444' ? '#ef4444' : moment.urgency === 'HIGH' ? '#c9a84c' : '#9ca3af' }}>
              {moment.commercialExposure}
            </div>
          </div>

          {/* Recommended action — full width */}
          <div className="col-span-12 flex items-start gap-3 pt-1" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
            <ArrowRight size={13} style={{ color: 'hsl(43 68% 55%)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="label-caps mb-1" style={{ color: 'hsl(43 68% 55%)' }}>Recommended Action</div>
              <div className="text-xs text-white font-medium">{moment.recommendedAction}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {moment.status === 'DETECTED' && (
        <div className="flex" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
          <button
            onClick={() => handleAction('ACCEPT')}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ background: 'hsl(43 68% 55%)', color: 'hsl(220 13% 5%)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'hsl(43 68% 55%)')}
          >
            Accept
          </button>
          <button
            onClick={() => handleAction('ASSIGN')}
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: '#9ca3af' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            Assign
          </button>
          <button
            onClick={() => handleAction('MONITOR')}
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: '#9ca3af' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            Monitor
          </button>
          <button
            onClick={() => handleAction('OVERRIDE')}
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: '#9ca3af' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            Override
          </button>
          <button
            onClick={() => handleAction('ESCALATE')}
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: '#ef4444' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Escalate
          </button>
        </div>
      )}

      {/* Execution feedback */}
      {moment.status !== 'DETECTED' && moment.executionFeedback && (
        <div style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
          <button
            onClick={() => setShowFeedback(f => !f)}
            className="w-full flex items-center justify-between px-6 py-3 transition-colors"
            style={{ color: 'hsl(215 16% 40%)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(215 16% 40%)')}
          >
            <span style={{ fontSize: 9, letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase' }}>
              Execution Record
            </span>
            <ChevronDown
              size={12}
              style={{ transition: 'transform 0.2s', transform: showFeedback ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 grid grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <div className="label-caps mb-1">Action Taken</div>
                    <div className="text-xs text-white">{moment.executionFeedback!.whatHappened}</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Team Assigned</div>
                    <div className="text-xs text-white">{moment.executionFeedback!.teamAssigned}</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Notified</div>
                    <div className="text-xs text-white">{moment.executionFeedback!.whoNotified}</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Response Time</div>
                    <div className="text-xs font-mono" style={{ color: '#c9a84c' }}>{moment.executionFeedback!.responseTime}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="label-caps mb-1">Outcome Delta</div>
                    <div className="text-xs font-medium" style={{ color: '#10b981' }}>{moment.executionFeedback!.outcomeDelta}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
