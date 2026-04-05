import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

const headline = [
  { label: 'Moments Handled',  value: '47',       unit: 'today',   accent: false },
  { label: 'Revenue Generated', value: '£24,800', unit: 'today',   accent: true,  color: '#10b981' },
  { label: 'Revenue Protected', value: '£31,200', unit: 'today',   accent: true,  color: '#c9a84c' },
  { label: 'Cost Avoided',      value: '£8,400',  unit: 'today',   accent: false },
];

const topMoments = [
  { title: 'VIP Arrival Risk',            category: 'Loyalty',        value: '£8,000', status: 'RESOLVED' },
  { title: 'Housekeeping Bottleneck',     category: 'Operations',     value: '£5,200', status: 'ACTIONED' },
  { title: 'Service Recovery — Rm 604',   category: 'Recovery',       value: '£3,400', status: 'IN PROG' },
  { title: 'Queue Pressure Building',     category: 'Guest Flow',     value: '£2,400', status: 'RESOLVED' },
  { title: 'Guest Sentiment Drop',        category: 'Experience',     value: '£1,800', status: 'STABILISED' },
];

const kpis = [
  { label: 'Avg Response Time',         value: '4.2 min',  delta: '−1.8 min vs 30d', positive: true },
  { label: 'Service Recovery Success',  value: '94.1%',    delta: '+3.4pts vs 30d',   positive: true },
  { label: 'Operational Consistency',   value: '+12%',     delta: 'vs last 30 days',  positive: true },
  { label: 'Guest Experience Uplift',   value: '+18pts',   delta: 'NPS eq',            positive: true },
];

const ACCENT_COLOR = '#c9a84c';
const CHART_ACTIVE = '#c9a84c';
const CHART_INACTIVE = 'hsl(220 13% 16%)';

export default function OutcomeIntelligence() {
  const maxMoments = Math.max(...chartData.map(d => d.moments));

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="mb-8">
          <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>Vector · Commercial Proof</div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Outcome Intelligence</h1>
          <p className="text-xs mt-1" style={{ color: 'hsl(215 16% 40%)' }}>
            Board-ready performance summary. Period: today.
          </p>
        </header>

        {/* Headline metrics */}
        <div className="grid grid-cols-4 mb-6" style={{ border: '1px solid hsl(220 13% 10%)' }}>
          {headline.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="px-7 py-6"
              style={{
                borderRight: i < headline.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none',
                borderTop: h.accent ? `2px solid ${h.color}` : '2px solid transparent',
              }}
            >
              <div className="label-caps mb-3">{h.label}</div>
              <div className="font-bold text-white leading-none mb-1" style={{ fontSize: 28, letterSpacing: '-0.01em', color: h.accent ? h.color : '#fff' }}>
                {h.value}
              </div>
              <div className="mono-value" style={{ color: 'hsl(215 16% 32%)', marginTop: 6 }}>{h.unit.toUpperCase()}</div>
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
                      borderRadius: 0,
                      fontSize: 11,
                      fontFamily: 'var(--app-font-mono)',
                      color: '#fff',
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div className="label-caps mb-1">{k.label}</div>
                    <div className="mono-value" style={{ color: 'hsl(215 16% 35%)' }}>{k.delta}</div>
                  </div>
                  <div
                    className="font-bold"
                    style={{ fontSize: 20, color: k.positive ? '#10b981' : '#ef4444', letterSpacing: '-0.01em' }}
                  >
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
            <div className="label-caps">Top Moments by Commercial Value</div>
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
                  <td className="px-6 py-3 text-right text-sm font-bold" style={{ color: ACCENT_COLOR }}>{m.value}</td>
                  <td className="px-6 py-3 text-right">
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: m.status === 'RESOLVED' ? '#10b981' : m.status === 'ACTIONED' ? '#60a5fa' : 'hsl(215 16% 50%)',
                      }}
                    >
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
          <div className="label-caps mb-3" style={{ color: ACCENT_COLOR }}>Executive Briefing · WELBX BXOS</div>
          <p style={{ fontSize: 13, color: 'hsl(215 16% 60%)', lineHeight: 1.75, maxWidth: 820 }}>
            WELBX completed 47 operational interventions today, protecting £31,200 in guest lifetime value through pre-emptive detection and coordinated execution. The BXOS layer identified a compounding VIP arrival risk — converging across room readiness, staff capacity, and queue flow — and routed an automated response through Nexus and Vector in under two minutes, averting a critical service failure. Average response latency held at 4.2 minutes across cross-departmental task execution. Service recovery success rate: 94.1%. Operational consistency trend is +12% against the rolling 30-day baseline.
          </p>
        </div>
      </div>
    </div>
  );
}
