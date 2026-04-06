import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

type ZoneStatus = 'normal' | 'elevated' | 'critical';

const BASE_ZONES = [
  { id: 'lobby',      label: 'Lobby',         status: 'elevated' as ZoneStatus, x: 0, y: 0, w: 2, h: 1, detail: 'Queue active' },
  { id: 'frontdesk', label: 'Front Desk',     status: 'critical' as ZoneStatus, x: 2, y: 0, w: 2, h: 1, detail: '14 guests' },
  { id: 'concierge', label: 'Concierge',      status: 'normal'   as ZoneStatus, x: 4, y: 0, w: 2, h: 1, detail: 'Operational' },
  { id: 'dining',    label: 'Dining',         status: 'normal'   as ZoneStatus, x: 0, y: 1, w: 2, h: 2, detail: '67% capacity' },
  { id: 'rooms-a',   label: 'Rooms 800s',     status: 'critical' as ZoneStatus, x: 2, y: 1, w: 2, h: 1, detail: 'Room 847 blocked' },
  { id: 'rooms-b',   label: 'Rooms 600s',     status: 'elevated' as ZoneStatus, x: 4, y: 1, w: 2, h: 1, detail: 'Complaint open' },
  { id: 'spa',       label: 'Spa & Wellness', status: 'normal'   as ZoneStatus, x: 2, y: 2, w: 2, h: 1, detail: 'High propensity' },
  { id: 'housekeep', label: 'Housekeeping',   status: 'elevated' as ZoneStatus, x: 4, y: 2, w: 2, h: 1, detail: '91% utilized' },
];

const RESOLVED_ZONES = BASE_ZONES.map(z =>
  z.id === 'rooms-a'
    ? { ...z, status: 'elevated' as ZoneStatus, detail: 'Room 847 released' }
    : z.id === 'frontdesk'
    ? { ...z, status: 'elevated' as ZoneStatus, detail: '7 guests (clearing)' }
    : z
);

const STATUS_ZONE: Record<ZoneStatus, { border: string; bg: string; dot: string; textColor: string }> = {
  normal:   { border: 'hsl(220 13% 12%)',       bg: 'hsl(220 13% 7%)',          dot: '#10b981', textColor: 'hsl(215 16% 40%)' },
  elevated: { border: 'rgba(201,168,76,0.3)',    bg: 'rgba(201,168,76,0.04)',    dot: '#c9a84c', textColor: '#c9a84c' },
  critical: { border: 'rgba(239,68,68,0.35)',    bg: 'rgba(239,68,68,0.06)',     dot: '#ef4444', textColor: '#ef4444' },
};

const BASE_SIGNALS = [
  { time: '14:32:07', msg: 'VIP arrival ETA: 12 min — Room 847 not released', type: 'critical' },
  { time: '14:31:45', msg: 'Front desk queue exceeded 8 min threshold', type: 'warning' },
  { time: '14:31:12', msg: 'Housekeeping re-sequenced — priority to Room 847', type: 'info' },
  { time: '14:30:12', msg: 'Room 847 status: OCCUPIED (overstay flagged)', type: 'critical' },
  { time: '14:28:55', msg: 'Housekeeping team capacity: 91%', type: 'warning' },
  { time: '14:27:30', msg: 'Lobby sentiment index: -0.4 (declining)', type: 'warning' },
];

const RESOLVED_SIGNALS = [
  { time: '14:33:41', msg: 'M2 accepted — VECTOR executing cross-department response', type: 'info' },
  { time: '14:33:55', msg: 'Housekeeping priority push confirmed — Room 847 targeted', type: 'info' },
  { time: '14:34:18', msg: 'VIP welcome protocol activated — guest relations en route', type: 'info' },
  ...BASE_SIGNALS,
];

const BASE_METRICS = [
  { label: 'Active Moments', value: '6',       sub: '1 CRITICAL · 3 HIGH',      alertType: 'critical' },
  { label: 'Service Pressure', value: '73/100', sub: 'ELEVATED — MANAGED',       alertType: 'amber' },
  { label: 'Staff Allocation', value: '91%',   sub: 'FRONT DESK · HOUSEKEEPING', alertType: 'amber' },
  { label: 'Guest Flow',      value: 'LIMITED', sub: 'QUEUE DELAYS ACTIVE',       alertType: 'amber' },
  { label: 'Escalations',    value: '0',        sub: 'ALL ROUTED',                alertType: 'none' },
  { label: 'Rooms at Risk',  value: '4',        sub: '7 PENDING RELEASE',         alertType: 'amber' },
];

const RESOLVED_METRICS = [
  { label: 'Active Moments', value: '5',       sub: '0 CRITICAL · 3 HIGH',       alertType: 'amber' },
  { label: 'Service Pressure', value: '58/100', sub: 'MANAGED — STABILISING',     alertType: 'amber' },
  { label: 'Staff Allocation', value: '88%',   sub: 'RE-SEQUENCED',               alertType: 'amber' },
  { label: 'Guest Flow',      value: 'FLOWING', sub: 'QUEUE CLEARING',             alertType: 'none' },
  { label: 'Escalations',    value: '0',        sub: 'ALL ROUTED',                 alertType: 'none' },
  { label: 'Rooms at Risk',  value: '3',        sub: '847 RELEASED',               alertType: 'amber' },
];

const ALERT_COLOR: Record<string, string> = {
  critical: '#ef4444',
  amber:    '#c9a84c',
  none:     '#ffffff',
};

export default function SystemState() {
  const { vipResolved } = useApp();

  const zones = vipResolved ? RESOLVED_ZONES : BASE_ZONES;
  const signals = vipResolved ? RESOLVED_SIGNALS : BASE_SIGNALS;
  const metrics = vipResolved ? RESOLVED_METRICS : BASE_METRICS;

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Nexus · Operational Mapping</div>
            <h1 className="text-2xl font-bold text-white tracking-wide">System State</h1>
            <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 42%)', letterSpacing: '0.01em' }}>
              Live pressure, staff allocation, room readiness, and environment status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="animate-pulse w-1.5 h-1.5 rounded-full" style={{ background: vipResolved ? '#10b981' : '#c9a84c' }} />
            <motion.span
              animate={{ color: vipResolved ? '#10b981' : '#c9a84c', borderColor: vipResolved ? 'rgba(16,185,129,0.3)' : 'rgba(201,168,76,0.3)', background: vipResolved ? 'rgba(16,185,129,0.08)' : 'rgba(201,168,76,0.08)' }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '4px 10px', border: '1px solid', color: '#c9a84c',
                background: 'rgba(201,168,76,0.08)',
              }}
            >
              {vipResolved ? 'Stabilising' : 'Managed Pressure'}
            </motion.span>
          </div>
        </header>

        {/* Metrics row */}
        <div className="grid grid-cols-6 mb-8" style={{ border: '1px solid hsl(220 13% 10%)' }}>
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ delay: i * 0.06 }}
              className="p-5"
              style={{ borderRight: i < metrics.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}
            >
              <div className="label-caps mb-2">{m.label}</div>
              <div className="flex items-center gap-2">
                {m.alertType === 'critical' && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#ef4444' }} />
                )}
                <motion.div
                  animate={{ color: ALERT_COLOR[m.alertType] }}
                  transition={{ duration: 0.5 }}
                  className="font-bold leading-none mb-1"
                  style={{ fontSize: 22, letterSpacing: '-0.01em' }}
                >
                  {m.value}
                </motion.div>
              </div>
              <div className="mono-value" style={{ color: 'hsl(215 16% 32%)' }}>{m.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Service pressure bar */}
        <div className="mb-8 p-5" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="label-caps">Service Pressure Index</div>
            <motion.div
              animate={{ color: vipResolved ? '#10b981' : '#c9a84c' }}
              transition={{ duration: 0.6 }}
              className="mono-value"
            >
              {vipResolved ? '58 / 100 — Stabilising' : '73 / 100 — Elevated'}
            </motion.div>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(220 13% 12%)' }}>
            <motion.div
              animate={{ width: vipResolved ? '58%' : '73%' }}
              initial={{ width: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, hsl(43 68% 55%), #ef4444)' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="mono-value" style={{ color: 'hsl(215 16% 28%)' }}>0 — NOMINAL</span>
            <span className="mono-value" style={{ color: 'hsl(215 16% 28%)' }}>100 — CRITICAL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Floor map */}
          <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20 }}>
            <div className="label-caps mb-4">Environment Map</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(3, 72px)', gap: 4 }}>
              {zones.map((zone) => {
                const cfg = STATUS_ZONE[zone.status];
                return (
                  <motion.div
                    key={zone.id}
                    animate={{ background: cfg.bg, borderColor: cfg.border }}
                    transition={{ duration: 0.6 }}
                    style={{
                      gridColumn: `${zone.x + 1} / span ${zone.w}`,
                      gridRow: `${zone.y + 1} / span ${zone.h}`,
                      border: `1px solid ${cfg.border}`,
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <motion.div
                      animate={{ color: cfg.textColor }}
                      transition={{ duration: 0.5 }}
                      style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                      {zone.label}
                    </motion.div>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ background: cfg.dot }}
                        transition={{ duration: 0.5 }}
                        style={{ width: 5, height: 5, borderRadius: '50%' }}
                      />
                      <span style={{ fontSize: 8, color: 'hsl(215 16% 38%)', letterSpacing: '0.06em' }}>{zone.detail}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center gap-5 mt-4">
              {[{ label: 'Nominal', color: '#10b981' }, { label: 'Elevated', color: '#c9a84c' }, { label: 'Critical', color: '#ef4444' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 9, color: 'hsl(215 16% 38%)', letterSpacing: '0.08em' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal feed */}
          <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="label-caps">Live Signal Feed</div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="mono-value" style={{ color: 'hsl(215 16% 35%)' }}>LIVE</span>
              </div>
            </div>
            <div className="space-y-0 flex-1 overflow-hidden">
              {signals.slice(0, 7).map((sig, i) => (
                <motion.div
                  key={sig.time + sig.msg}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  style={{
                    display: 'flex', gap: 12, padding: '7px 0',
                    borderBottom: '1px solid hsl(220 13% 9%)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ fontSize: 10, fontFamily: 'var(--app-font-mono)', color: 'hsl(215 16% 32%)', flexShrink: 0, paddingTop: 1, letterSpacing: '0.04em' }}>
                    {sig.time}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: sig.type === 'critical' ? '#ef4444' : sig.type === 'warning' ? '#c9a84c' : 'hsl(215 16% 55%)',
                    lineHeight: 1.4,
                  }}>
                    {sig.msg}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff allocation */}
        <div className="mt-6 grid grid-cols-4 gap-0" style={{ border: '1px solid hsl(220 13% 10%)' }}>
          {[
            { dept: 'Front Desk',      allocated: vipResolved ? 4 : 3, capacity: 4, load: vipResolved ? 100 : 75 },
            { dept: 'Housekeeping',    allocated: vipResolved ? 10 : 9, capacity: 10, load: vipResolved ? 100 : 90 },
            { dept: 'Concierge',       allocated: 2, capacity: 3, load: 67 },
            { dept: 'Guest Relations', allocated: vipResolved ? 2 : 1, capacity: 2, load: vipResolved ? 100 : 50 },
          ].map((d, i) => (
            <div key={i} style={{ padding: '16px 20px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
              <div className="label-caps mb-2">{d.dept}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-base font-bold text-white">{d.allocated}/{d.capacity}</span>
                <span className="mono-value" style={{ color: d.load >= 85 ? '#c9a84c' : 'hsl(215 16% 40%)' }}>{d.load}%</span>
              </div>
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'hsl(220 13% 12%)' }}>
                <motion.div
                  animate={{ width: `${d.load}%` }}
                  transition={{ duration: 0.6 }}
                  style={{
                    height: '100%',
                    background: d.load >= 85 ? '#c9a84c' : '#10b981',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
