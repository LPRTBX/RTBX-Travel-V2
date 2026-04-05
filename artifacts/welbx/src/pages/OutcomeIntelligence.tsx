import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function OutcomeIntelligence() {
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

  return (
    <div className="min-h-screen bg-background pl-64 text-foreground">
      <div className="p-8 max-w-6xl mx-auto">
        <header className="mb-12 border-b border-border pb-6">
          <h2 className="text-3xl font-bold tracking-wide mb-2">OUTCOME INTELLIGENCE</h2>
          <p className="text-muted-foreground">Executive performance & commercial protection summary.</p>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border p-6">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Moments Handled</div>
            <div className="text-3xl font-bold text-white mb-1">47</div>
            <div className="text-xs text-muted-foreground">TODAY</div>
          </div>
          <div className="bg-card border border-border p-6 border-l-2 border-l-emerald-500">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Revenue Generated</div>
            <div className="text-3xl font-bold text-white mb-1">£24,800</div>
            <div className="text-xs text-muted-foreground">TODAY</div>
          </div>
          <div className="bg-card border border-border p-6 border-l-2 border-l-primary">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Revenue Protected</div>
            <div className="text-3xl font-bold text-white mb-1">£31,200</div>
            <div className="text-xs text-muted-foreground">TODAY</div>
          </div>
          <div className="bg-card border border-border p-6">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Cost Avoided</div>
            <div className="text-3xl font-bold text-white mb-1">£8,400</div>
            <div className="text-xs text-muted-foreground">TODAY</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 bg-card border border-border p-6">
            <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6">Moments Handled / Hour</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#111214', border: '1px solid #1f2937' }}
                  />
                  <Bar dataKey="moments" fill="#c9a84c" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6">Operational Integrity</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-white mb-1">Average Response Time</div>
                  <div className="text-2xl font-bold text-primary">4.2 min</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Service Recovery Success</div>
                  <div className="text-2xl font-bold text-primary">94.1%</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Operational Consistency</div>
                  <div className="text-2xl font-bold text-emerald-500">+12% <span className="text-sm font-normal text-muted-foreground">vs last 30d</span></div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Guest Experience Uplift</div>
                  <div className="text-2xl font-bold text-emerald-500">+18pts <span className="text-sm font-normal text-muted-foreground">NPS eq</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8">
          <h3 className="text-[10px] text-primary tracking-widest uppercase mb-4">Executive Briefing</h3>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            System performance remains highly constrained but fully managed. The BXOS layer successfully identified and routed 47 critical operational moments today, directly protecting £31,200 in at-risk lifetime value through pre-emptive VIP service recovery. Vector orchestration maintained an average response latency of 4.2 minutes across cross-departmental task allocation, preventing 4 cascading service failures.
          </p>
        </div>
      </div>
    </div>
  );
}
