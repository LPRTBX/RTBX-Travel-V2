import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "@/context/AppContext";

const chartData = [
  { time: '08:00', moments: 2 },
  { time: '09:00', moments: 5 },
  { time: '10:00', moments: 8 },
  { time: '11:00', moments: 4 },
  { time: '12:00', moments: 3 },
  { time: '13:00', moments: 7 },
  { time: '14:00', moments: 12 },
  { time: '15:00', moments: 6 },
];

const kpis = [
  { label: 'Avg Response Time',        value: '4.2 min', delta: '−1.8 min vs 30d', positive: true },
  { label: 'Service Recovery Success', value: '94.1%',   delta: '+3.4pts vs 30d',  positive: true },
  { label: 'Operational Consistency',  value: '+12%',    delta: 'vs last 30 days', positive: true },
  { label: 'Guest Experience Uplift',  value: '+18pts',  delta: 'NPS eq',           positive: true },
];

const topMoments = [
  { title: 'VIP Arrival Risk',           category: 'Loyalty',    value: 'High',        status: 'RESOLVED' },
  { title: 'Housekeeping Bottleneck',    category: 'Operations', value: 'High',        status: 'ACTIONED' },
  { title: 'Service Recovery — Rm 604',  category: 'Recovery',   value: 'Significant', status: 'IN PROG' },
  { title: 'Queue Pressure Building',    category: 'Guest Flow', value: 'Medium',      status: 'RESOLVED' },
  { title: 'Guest Sentiment Drop',       category: 'Experience', value: 'Low',         status: 'STABILISED' },
];

const ACCENT = '#c9a84c';
const CHART_ACTIVE = '#c9a84c';
const CHART_INACTIVE = 'hsl(220 13% 16%)';

const WITHOUT_REPORT = [
  { time: '06:00', entry: 'Morning briefing completed — 47 arrivals forecast' },
  { time: '09:47', entry: 'Complaint logged — Room 604, housekeeping delay' },
  { time: '11:30', entry: 'Front desk noted queue pressure — no action recorded' },
  { time: '14:15', entry: 'VIP arrived — room delay, team verbal update only' },
  { time: '16:00', entry: 'End-of-shift: 3 unresolved incidents, no outcome data' },
];

export default function OutcomeIntelligence() {
  const { momentCount } = useApp();
  const [welbxActive, setWelbxActive] = useState(true);
  const maxMoments = Math.max(...chartData.map(d => d.moments));

  const headline = [
    { label: 'Moments Handled',  value: String(momentCount), unit: 'today',   color: 'hsl(215 16% 70%)' },
    { label: 'Value Activated',   value: 'Score 81',           unit: 'today',   color: '#10b981' },
    { label: 'Value Protected',   value: 'Score 94',           unit: 'today',   color: '#c9a84c' },
    { label: 'Cost Avoided',      value: 'Score 72',           unit: 'today',   color: '#60a5fa' },
  ];

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Vector · Value Intelligence</div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Outcome Intelligence</h1>
            <p className="text-xs mt-1" style={{ color: 'hsl(215 16% 40%)' }}>
              Board-ready performance summary. Period: today.
            </p>
          </div>

          {/* Without WELBX toggle */}
          <div className="flex items-center gap-0" style={{ border: '1px solid hsl(220 13% 14%)', flexShrink: 0 }}>
            <button
              onClick={() => setWelbxActive(false)}
              style={{
                padding: '8px 16px',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                background: !welbxActive ? 'hsl(220 13% 14%)' : 'transparent',
                color: !welbxActive ? '#fff' : 'hsl(215 16% 38%)',
                transition: 'all 0.2s',
                borderRight: '1px solid hsl(220 13% 14%)',
              }}
            >
              Standard Ops
            </button>
            <button
              onClick={() => setWelbxActive(true)}
              style={{
                padding: '8px 16px',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                background: welbxActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: welbxActive ? '#c9a84c' : 'hsl(215 16% 38%)',
                transition: 'all 0.2s',
              }}
            >
              WELBX Active
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* WITHOUT WELBX — Standard Ops view */}
          {!welbxActive && (
            <motion.div
              key="without"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Flat headline metrics */}
              <div className="grid grid-cols-4 mb-6" style={{ border: '1px solid hsl(220 13% 10%)' }}>
                {[
                  { label: 'Value Score (Today)',   value: '68',      sub: 'End-of-day estimate', color: 'hsl(215 16% 45%)' },
                  { label: 'Incidents Logged',      value: '12',      sub: 'Unresolved: 3',       color: 'hsl(215 16% 45%)' },
                  { label: 'Guest Satisfaction',    value: '7.8/10',  sub: 'Post-stay survey avg', color: 'hsl(215 16% 45%)' },
                  { label: 'Staff Notes Filed',     value: '6',       sub: 'No action tracking',  color: 'hsl(215 16% 45%)' },
                ].map((h, i) => (
                  <div
                    key={i}
                    className="px-7 py-7"
                    style={{
                      borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none',
                      borderTop: '2px solid hsl(220 13% 14%)',
                      opacity: 0.6,
                    }}
                  >
                    <div className="label-caps mb-3">{h.label}</div>
                    <div className="font-bold leading-none mb-2" style={{ fontSize: 40, letterSpacing: '-0.02em', color: h.color }}>{h.value}</div>
                    <div className="mono-value" style={{ color: 'hsl(215 16% 24%)', marginTop: 4 }}>{h.sub}</div>
                  </div>
                ))}
              </div>

              {/* Shift log */}
              <div className="mb-6" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)' }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid hsl(220 13% 10%)' }}>
                  <div className="label-caps">Shift Log — End of Day Report</div>
                  <span style={{ fontSize: 9, letterSpacing: '0.12em', color: 'hsl(215 16% 30%)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Compiled 16:00 UTC
                  </span>
                </div>
                <div className="px-6 py-2">
                  {WITHOUT_REPORT.map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', gap: 20, padding: '10px 0',
                        borderBottom: i < WITHOUT_REPORT.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                        opacity: 0.7,
                      }}
                    >
                      <span style={{ fontSize: 10, fontFamily: 'var(--app-font-mono)', color: 'hsl(215 16% 32%)', flexShrink: 0 }}>{row.time}</span>
                      <span style={{ fontSize: 12, color: 'hsl(215 16% 52%)' }}>{row.entry}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', padding: 24 }}>
                <div className="label-caps mb-2" style={{ color: 'rgba(239,68,68,0.5)' }}>Standard Operations — No Real-Time Intelligence</div>
                <p style={{ fontSize: 13, color: 'hsl(215 16% 40%)', lineHeight: 1.75, maxWidth: 820 }}>
                  3 incidents remain unresolved at end of shift. The VIP arrival delay was not flagged until after check-in. No proactive contact was made to Room 604. Queue pressure was noted verbally but not actioned. Activation gaps were not quantified. No cross-department routing occurred. This is the default operating picture — data compiled after the fact, with no real-time intervention layer.
                </p>
              </div>
            </motion.div>
          )}

          {/* WITH WELBX — Live view */}
          {welbxActive && (
            <motion.div
              key="with"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Headline metrics */}
              <div className="grid grid-cols-4 mb-6" style={{ border: '1px solid hsl(220 13% 10%)' }}>
                {headline.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="px-7 py-7"
                    style={{ borderRight: i < headline.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none', borderTop: `2px solid ${h.color}` }}
                  >
                    <div className="label-caps mb-3">{h.label}</div>
                    <div className="font-bold leading-none mb-2" style={{ fontSize: 40, letterSpacing: '-0.02em', color: h.color }}>{h.value}</div>
                    <div className="mono-value" style={{ color: 'hsl(215 16% 28%)', marginTop: 4 }}>{h.unit.toUpperCase()}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Chart */}
                <div className="col-span-7" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20 }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="label-caps">Moments Handled / Hour</div>
                    <div className="mono-value" style={{ color: 'hsl(215 16% 35%)' }}>08:00 — 15:00</div>
                  </div>
                  <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={18}>
                        <XAxis
                          dataKey="time"
                          tick={{ fill: 'hsl(215 16% 35%)', fontSize: 10, fontFamily: 'var(--app-font-mono)', letterSpacing: '0.04em' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fill: 'hsl(215 16% 35%)', fontSize: 10, fontFamily: 'var(--app-font-mono)' }}
                          tickLine={false}
                          axisLine={false}
                          width={24}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          contentStyle={{
                            backgroundColor: 'hsl(220 13% 9%)',
                            border: '1px solid hsl(220 13% 14%)',
                            borderRadius: 0, fontSize: 11,
                            fontFamily: 'var(--app-font-mono)', color: '#fff',
                          }}
                          labelStyle={{ color: 'hsl(215 16% 50%)', marginBottom: 4 }}
                        />
                        <Bar dataKey="moments" radius={[1, 1, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.moments === maxMoments ? CHART_ACTIVE : CHART_INACTIVE} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* KPIs */}
                <div className="col-span-5" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20 }}>
                  <div className="label-caps mb-5">Operational KPIs</div>
                  <div className="space-y-0">
                    {kpis.map((k, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px 0',
                          borderBottom: i < kpis.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}
                      >
                        <div>
                          <div className="label-caps mb-1">{k.label}</div>
                          <div className="mono-value" style={{ color: 'hsl(215 16% 35%)' }}>{k.delta}</div>
                        </div>
                        <div className="font-bold" style={{ fontSize: 24, color: k.positive ? '#10b981' : '#ef4444', letterSpacing: '-0.02em' }}>
                          {k.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top moments table */}
              <div className="mb-6" style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid hsl(220 13% 10%)' }}>
                  <div className="label-caps">Top Moments by Activation Impact</div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid hsl(220 13% 10%)' }}>
                      <th className="px-6 py-2 text-left label-caps" style={{ width: '40%' }}>Moment</th>
                      <th className="px-6 py-2 text-left label-caps">Category</th>
                      <th className="px-6 py-2 text-right label-caps">Value Protected</th>
                      <th className="px-6 py-2 text-right label-caps">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMoments.map((m, i) => (
                      <tr key={i} style={{ borderBottom: i < topMoments.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none' }}>
                        <td className="px-6 py-3 text-xs text-white font-medium">{m.title}</td>
                        <td className="px-6 py-3 mono-value" style={{ color: 'hsl(215 16% 40%)' }}>{m.category}</td>
                        <td className="px-6 py-3 text-right text-sm font-bold" style={{ color: ACCENT }}>{m.value}</td>
                        <td className="px-6 py-3 text-right">
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                            color: m.status === 'RESOLVED' ? '#10b981' : m.status === 'ACTIONED' ? '#60a5fa' : 'hsl(215 16% 50%)',
                          }}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Executive briefing */}
              <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', padding: 24 }}>
                <div className="label-caps mb-3" style={{ color: ACCENT }}>Executive Briefing · WELBX BXOS</div>
                <p style={{ fontSize: 13, color: 'hsl(215 16% 60%)', lineHeight: 1.75, maxWidth: 820 }}>
                  WELBX completed {momentCount} operational interventions today, protecting guest lifetime value across all active moments through pre-emptive detection and coordinated execution. The BXOS layer identified a compounding VIP arrival risk — converging across room readiness, staff capacity, and queue flow — and routed an automated response through Nexus and Vector in under two minutes, averting a critical service failure. Average response latency held at 4.2 minutes across cross-departmental task execution. Service recovery success rate: 94.1%. Operational consistency trend is +12% against the rolling 30-day baseline.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
