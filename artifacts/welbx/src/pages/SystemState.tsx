import { motion } from "framer-motion";

const zones = [
  { id: 'lobby',       label: 'Lobby',          status: 'elevated', x: 0,  y: 0,  w: 2, h: 1, detail: 'Queue active' },
  { id: 'frontdesk',  label: 'Front Desk',      status: 'critical', x: 2,  y: 0,  w: 2, h: 1, detail: '14 guests' },
  { id: 'concierge',  label: 'Concierge',       status: 'normal',   x: 4,  y: 0,  w: 2, h: 1, detail: 'Operational' },
  { id: 'dining',     label: 'Dining',          status: 'normal',   x: 0,  y: 1,  w: 2, h: 2, detail: '67% capacity' },
  { id: 'rooms-a',    label: 'Rooms 800s',      status: 'critical', x: 2,  y: 1,  w: 2, h: 1, detail: 'Room 847 blocked' },
  { id: 'rooms-b',    label: 'Rooms 600s',      status: 'elevated', x: 4,  y: 1,  w: 2, h: 1, detail: 'Complaint open' },
  { id: 'spa',        label: 'Spa & Wellness',  status: 'normal',   x: 2,  y: 2,  w: 2, h: 1, detail: 'High propensity' },
  { id: 'housekeep',  label: 'Housekeeping',    status: 'elevated', x: 4,  y: 2,  w: 2, h: 1, detail: '91% utilized' },
];

const STATUS_ZONE: Record<string, { border: string; bg: string; dot: string; textColor: string }> = {
  normal:   { border: 'hsl(220 13% 12%)',        bg: 'hsl(220 13% 7%)',           dot: '#10b981',  textColor: 'hsl(215 16% 40%)' },
  elevated: { border: 'rgba(201,168,76,0.3)',     bg: 'rgba(201,168,76,0.04)',     dot: '#c9a84c',  textColor: '#c9a84c' },
  critical: { border: 'rgba(239,68,68,0.35)',     bg: 'rgba(239,68,68,0.06)',      dot: '#ef4444',  textColor: '#ef4444' },
};

const signals = [
  { time: '14:32:07', msg: 'VIP arrival ETA: 12 min — Room 847 not released', type: 'critical' },
  { time: '14:31:45', msg: 'Front desk queue exceeded 8 min threshold', type: 'warning' },
  { time: '14:31:12', msg: 'Housekeeping re-sequenced — priority to Room 847', type: 'info' },
  { time: '14:30:12', msg: 'Room 847 status: OCCUPIED (overstay flagged)', type: 'critical' },
  { time: '14:28:55', msg: 'Housekeeping team capacity: 91%', type: 'warning' },
  { time: '14:27:30', msg: 'Lobby sentiment index: -0.4 (declining)', type: 'warning' },
  { time: '14:25:11', msg: 'Moment M4 actioned — lobby ambassador deployed', type: 'info' },
  { time: '14:22:00', msg: 'Guest 604 recovery window: open (checkout tomorrow)', type: 'info' },
];

const metrics = [
  { label: 'Active Moments',      value: '6',            sub: '1 CRITICAL · 3 HIGH',      alert: true,  alertType: 'critical' },
  { label: 'Service Pressure',    value: '73 / 100',     sub: 'ELEVATED — MANAGED',        alert: true,  alertType: 'amber' },
  { label: 'Staff Allocation',    value: '91%',          sub: 'FRONT DESK · HOUSEKEEPING', alert: true,  alertType: 'amber' },
  { label: 'Guest Flow',          value: 'CONSTRAINED',  sub: 'QUEUE DELAYS ACTIVE',       alert: true,  alertType: 'amber' },
  { label: 'Escalations',         value: '0',            sub: 'ALL ROUTED',                alert: false, alertType: 'none' },
  { label: 'Rooms at Risk',       value: '4',            sub: '7 PENDING RELEASE',         alert: true,  alertType: 'amber' },
];

const ALERT_COLOR: Record<string, string> = {
  critical: '#ef4444',
  amber:    '#c9a84c',
  none:     '#ffffff',
};

export default function SystemState() {
  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Nexus · Operational Mapping</div>
            <h1 className="text-2xl font-bold text-white tracking-wide">System State</h1>
            <p className="text-xs mt-1" style={{ color: 'hsl(215 16% 40%)' }}>
              Live pressure, allocation, and environment status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="animate-pulse w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                border: '1px solid rgba(201,168,76,0.3)',
                background: 'rgba(201,168,76,0.08)',
                color: '#c9a84c',
              }}
            >
              Managed Pressure
            </span>
          </div>
        </header>

        {/* Metrics row */}
        <div className="grid grid-cols-6 mb-8" style={{ border: '1px solid hsl(220 13% 10%)' }}>
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-5"
              style={{ borderRight: i < metrics.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}
            >
              <div className="label-caps mb-2">{m.label}</div>
              <div className="text-xl font-bold leading-none mb-1.5" style={{ color: m.alert ? ALERT_COLOR[m.alertType] : '#fff' }}>
                {m.value}
              </div>
              <div className="mono-value" style={{ color: 'hsl(215 16% 32%)' }}>{m.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Service pressure bar */}
        <div className="mb-8 p-5" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="label-caps">Service Pressure Index</div>
            <div className="mono-value" style={{ color: '#c9a84c' }}>73 / 100 — Elevated</div>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(220 13% 12%)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '73%' }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(3, 72px)',
                gap: 4,
              }}
            >
              {zones.map((zone) => {
                const cfg = STATUS_ZONE[zone.status];
                return (
                  <div
                    key={zone.id}
                    style={{
                      gridColumn: `${zone.x + 1} / span ${zone.w}`,
                      gridRow: `${zone.y + 1} / span ${zone.h}`,
                      border: `1px solid ${cfg.border}`,
                      background: cfg.bg,
                      padding: '8px 10px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.textColor }}>
                      {zone.label}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: cfg.dot,
                          animation: zone.status !== 'normal' ? 'pulse-amber 2s infinite' : undefined,
                        }}
                      />
                      <span style={{ fontSize: 8, color: 'hsl(215 16% 38%)', letterSpacing: '0.06em' }}>{zone.detail}</span>
                    </div>
                  </div>
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
              {signals.map((sig, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '8px 0',
                    borderBottom: '1px solid hsl(220 13% 9%)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ fontSize: 10, fontFamily: 'var(--app-font-mono)', color: 'hsl(215 16% 32%)', flexShrink: 0, paddingTop: 1, letterSpacing: '0.04em' }}>
                    {sig.time}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: sig.type === 'critical' ? '#ef4444' : sig.type === 'warning' ? '#c9a84c' : 'hsl(215 16% 55%)',
                      lineHeight: 1.4,
                    }}
                  >
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
            { dept: 'Front Desk',    allocated: 3, capacity: 4, load: 75 },
            { dept: 'Housekeeping',  allocated: 9, capacity: 10, load: 90 },
            { dept: 'Concierge',     allocated: 2, capacity: 3, load: 67 },
            { dept: 'Guest Relations',allocated: 1, capacity: 2, load: 50 },
          ].map((d, i) => (
            <div key={i} style={{ padding: '16px 20px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
              <div className="label-caps mb-2">{d.dept}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-base font-bold text-white">{d.allocated}/{d.capacity}</span>
                <span className="mono-value" style={{ color: d.load >= 85 ? '#c9a84c' : 'hsl(215 16% 40%)' }}>{d.load}%</span>
              </div>
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'hsl(220 13% 12%)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${d.load}%`,
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
