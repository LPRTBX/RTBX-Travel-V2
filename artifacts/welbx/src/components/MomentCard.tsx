import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Moment, MomentStatus } from "@/data/moments";
import { getPlaybookById } from "@/data/playbooks";
import { ChevronDown, ArrowRight } from "lucide-react";

interface MomentCardProps {
  moment: Moment;
  index: number;
  onVipAccept?: () => void;
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
  LOW:      'hsl(220 13% 14%)',
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#c9a84c',
  MEDIUM:   '#9ca3af',
  LOW:      '#6b7280',
};

export function MomentCard({ moment: initialMoment, index, onVipAccept }: MomentCardProps) {
  const [moment, setMoment] = useState<Moment>(initialMoment);
  const [showFeedback, setShowFeedback] = useState(false);
  const [, navigate] = useLocation();

  const playbook = moment.playbookId ? getPlaybookById(moment.playbookId) : undefined;

  const handleAction = (action: string) => {
    let nextStatus: MomentStatus = moment.status;
    if (action === 'ACCEPT')   nextStatus = 'ACTIONED';
    else if (action === 'ASSIGN')   nextStatus = 'IN_PROGRESS';
    else if (action === 'OVERRIDE') nextStatus = 'RESOLVED';
    else if (action === 'ESCALATE') nextStatus = 'ESCALATED';
    else if (action === 'MONITOR') nextStatus = 'STABILISED';
    setMoment({ ...moment, status: nextStatus });
    if (nextStatus !== 'DETECTED') setShowFeedback(true);

    if (action === 'ACCEPT' && onVipAccept) {
      onVipAccept();
    }
  };

  const statusCfg = STATUS_CONFIG[moment.status];
  const urgencyBorder = URGENCY_BORDER[moment.urgency];
  const urgencyColor = URGENCY_COLOR[moment.urgency];
  const isCritical = moment.urgency === 'CRITICAL';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        background: isCritical ? 'hsl(220 13% 7.5%)' : 'hsl(220 13% 7%)',
        borderTop: `1px solid hsl(220 13% 11%)`,
        borderRight: `1px solid hsl(220 13% 11%)`,
        borderBottom: `1px solid hsl(220 13% 11%)`,
        borderLeft: isCritical ? `3px solid ${urgencyBorder}` : `2px solid ${urgencyBorder}`,
        boxShadow: isCritical ? '0 0 40px rgba(239,68,68,0.06), inset 0 0 40px rgba(239,68,68,0.02)' : 'none',
      }}
      className="relative overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid hsl(220 13% 10%)' }}>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-3 mb-2">
            <span style={{
              fontSize: 9, letterSpacing: '0.14em', color: urgencyColor,
              fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 7px',
              background: `${urgencyColor}12`,
              border: `1px solid ${urgencyColor}30`,
            }}>
              {moment.urgency}
            </span>
            <span style={{ fontSize: 9, color: 'hsl(215 16% 28%)', letterSpacing: '0.08em' }}>·</span>
            <span style={{ fontSize: 9, letterSpacing: '0.12em', color: 'hsl(215 16% 35%)', fontWeight: 600, textTransform: 'uppercase' }}>
              {moment.id.toUpperCase()}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.005em', lineHeight: 1.25, marginBottom: 4 }}>
            {moment.title}
          </h3>
          <p style={{ fontSize: 11, color: 'hsl(215 16% 42%)', letterSpacing: '0.01em' }}>{moment.whySurfaced}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {statusCfg.pulse && (
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#60a5fa' }} />
          )}
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '3px 8px',
            background: statusCfg.bg,
            color: statusCfg.color,
            border: `1px solid ${statusCfg.border}`,
          }}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-x-6 gap-y-0">

          {/* Signal Stack */}
          <div className="col-span-4" style={{ paddingRight: 24, borderRight: '1px solid hsl(220 13% 10%)' }}>
            <div className="label-caps mb-2.5">Signal Stack</div>
            <ul className="space-y-2">
              {moment.signals.map((sig, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#fff' }}>
                  <span style={{ color: 'hsl(43 68% 45%)', marginTop: 1, flexShrink: 0 }}>—</span>
                  <span style={{ color: 'hsl(215 16% 72%)' }}>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern + Risk */}
          <div className="col-span-4" style={{ paddingLeft: 24, paddingRight: 24, borderRight: '1px solid hsl(220 13% 10%)' }}>
            <div className="space-y-3">
              <div>
                <div className="label-caps mb-1.5">Pattern</div>
                <div style={{ fontSize: 11, color: 'hsl(215 16% 68%)', lineHeight: 1.5 }}>{moment.patternDetected}</div>
              </div>
              <div>
                <div className="label-caps mb-1.5">Risk</div>
                <div style={{ fontSize: 11, color: isCritical ? 'rgba(239,68,68,0.8)' : 'hsl(215 16% 55%)', lineHeight: 1.5 }}>{moment.risk}</div>
              </div>
            </div>
          </div>

          {/* Confidence + Commercial Exposure */}
          <div className="col-span-4" style={{ paddingLeft: 24 }}>
            <div className="space-y-3">
              <div>
                <div className="label-caps mb-1.5">Confidence</div>
                <div className="flex items-center gap-3">
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', minWidth: 36 }}>{moment.confidence}%</div>
                  <div className="flex-1" style={{ height: 2, background: 'hsl(220 13% 14%)', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${moment.confidence}%`, background: 'hsl(43 68% 55%)', borderRadius: 1 }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="label-caps mb-1.5">Commercial Exposure</div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isCritical ? '#ef4444' : moment.urgency === 'HIGH' ? '#c9a84c' : 'hsl(215 16% 55%)',
                  lineHeight: 1.4,
                  letterSpacing: '-0.005em',
                }}>
                  {moment.commercialExposure}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Action + Playbook */}
          <div className="col-span-12 flex items-start gap-3" style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid hsl(220 13% 10%)' }}>
            <ArrowRight size={12} style={{ color: 'hsl(43 68% 55%)', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <div className="label-caps mb-1" style={{ color: 'hsl(43 68% 55%)' }}>Recommended Action</div>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{moment.recommendedAction}</div>
            </div>
            {playbook && (
              <button
                onClick={() => navigate(`/playbook-engine#${playbook.id}`)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  background: 'rgba(201,168,76,0.07)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.13)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.07)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.25)';
                }}
              >
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c' }}>
                  Playbook:
                </span>
                <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(215 16% 60%)' }}>
                  {playbook.name}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons — only when DETECTED */}
      {moment.status === 'DETECTED' && (
        <div className="flex" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
          <button
            onClick={() => handleAction('ACCEPT')}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ background: 'hsl(43 68% 55%)', color: 'hsl(220 13% 5%)', letterSpacing: '0.1em' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(43 68% 62%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'hsl(43 68% 55%)')}
          >
            Accept
          </button>
          {(['ASSIGN', 'MONITOR', 'OVERRIDE'] as const).map((action) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: 'hsl(215 16% 42%)', letterSpacing: '0.1em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'hsl(215 16% 42%)')}
            >
              {action.charAt(0) + action.slice(1).toLowerCase()}
            </button>
          ))}
          <button
            onClick={() => handleAction('ESCALATE')}
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderLeft: '1px solid hsl(220 13% 10%)', color: '#ef4444', letterSpacing: '0.1em' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Escalate
          </button>
        </div>
      )}

      {/* Execution feedback record */}
      {moment.status !== 'DETECTED' && moment.executionFeedback && (
        <div style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
          <button
            onClick={() => setShowFeedback(f => !f)}
            className="w-full flex items-center justify-between px-6 py-3 transition-colors"
            style={{ color: 'hsl(215 16% 38%)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(215 16% 38%)')}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase' }}>
                Execution Record
              </span>
            </div>
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
                <div className="px-6 pb-5" style={{ background: 'hsl(220 13% 6%)' }}>
                  <div className="grid grid-cols-4 gap-x-6 gap-y-3 pt-4">
                    <div>
                      <div className="label-caps mb-1">Action Taken</div>
                      <div style={{ fontSize: 11, color: '#fff' }}>{moment.executionFeedback!.whatHappened}</div>
                    </div>
                    <div>
                      <div className="label-caps mb-1">Team Assigned</div>
                      <div style={{ fontSize: 11, color: '#fff' }}>{moment.executionFeedback!.teamAssigned}</div>
                    </div>
                    <div>
                      <div className="label-caps mb-1">Notified</div>
                      <div style={{ fontSize: 11, color: '#fff' }}>{moment.executionFeedback!.whoNotified}</div>
                    </div>
                    <div>
                      <div className="label-caps mb-1">Response Time</div>
                      <div style={{ fontSize: 11, fontFamily: 'var(--app-font-mono)', color: '#c9a84c', fontWeight: 600 }}>{moment.executionFeedback!.responseTime}</div>
                    </div>
                    <div className="col-span-4" style={{ paddingTop: 10, borderTop: '1px solid hsl(220 13% 10%)' }}>
                      <div className="label-caps mb-1">Outcome Delta</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>{moment.executionFeedback!.outcomeDelta}</div>
                    </div>
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
