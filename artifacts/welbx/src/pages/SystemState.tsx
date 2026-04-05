import { motion } from "framer-motion";

export default function SystemState() {
  const metrics = [
    { label: "Active Moments", value: "6", sub: "4 HIGH · 1 CRIT · 1 LOW" },
    { label: "Service Pressure", value: "73/100", sub: "ELEVATED", alert: true },
    { label: "Guest Flow", value: "CONSTRAINED", sub: "QUEUE DELAYS ACTIVE", alert: true },
    { label: "Staff Allocation", value: "91%", sub: "UTILIZED" },
    { label: "Escalations", value: "0", sub: "ALL HANDLED" },
    { label: "Room Readiness", value: "7 PEND", sub: "4 AT RISK" },
  ];

  const signals = [
    { time: "14:32:07", msg: "VIP arrival ETA updated: 12 min", type: "warning" },
    { time: "14:31:45", msg: "Front desk queue exceeded 8 min threshold", type: "warning" },
    { time: "14:30:12", msg: "Room 847 status: OCCUPIED (Overstay)", type: "critical" },
    { time: "14:28:55", msg: "Housekeeping team capacity 91%", type: "info" },
    { time: "14:25:30", msg: "Lobby sentiment index drop detected", type: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background pl-64 text-foreground">
      <div className="p-8 max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-border pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-wide mb-2">SYSTEM STATE</h2>
            <p className="text-muted-foreground">Live operational control & environment mapping.</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase mb-1">Environment Status</div>
            <div className="text-amber-500 font-bold tracking-widest uppercase border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              Managed Pressure
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {metrics.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className={`bg-card p-6 border ${m.alert ? 'border-amber-500/30' : 'border-border'}`}
            >
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{m.label}</div>
              <div className={`text-3xl font-bold mb-1 ${m.alert ? 'text-amber-500' : 'text-white'}`}>{m.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-card border border-border p-6">
            <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6">Spatial Awareness (Abstract)</h3>
            <div className="aspect-[4/3] border border-white/10 relative p-4 flex flex-col gap-4">
              <div className="flex gap-4 h-1/3">
                <div className="flex-1 border border-white/5 bg-white/5 flex items-center justify-center relative">
                  <span className="text-[10px] text-muted-foreground absolute top-2 left-2 uppercase">Lobby</span>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 border border-white/5 bg-white/5 flex items-center justify-center relative">
                  <span className="text-[10px] text-muted-foreground absolute top-2 left-2 uppercase">Front Desk</span>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex gap-4 h-2/3">
                <div className="flex-1 border border-white/5 bg-white/5 flex items-center justify-center relative">
                  <span className="text-[10px] text-muted-foreground absolute top-2 left-2 uppercase">Dining</span>
                </div>
                <div className="flex-[2] border border-amber-500/20 bg-amber-500/5 flex items-center justify-center relative">
                  <span className="text-[10px] text-amber-500/50 absolute top-2 left-2 uppercase">Guest Rooms</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 flex flex-col">
            <h3 className="text-xs text-muted-foreground tracking-widest uppercase mb-6">Live Signal Feed</h3>
            <div className="flex-1 overflow-auto space-y-4">
              {signals.map((sig, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={i} 
                  className="flex gap-4 text-sm font-mono items-start border-b border-white/5 pb-4 last:border-0"
                >
                  <span className="text-muted-foreground">{sig.time}</span>
                  <span className={
                    sig.type === 'critical' ? 'text-red-500' :
                    sig.type === 'warning' ? 'text-amber-500' : 'text-white'
                  }>{sig.msg}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
