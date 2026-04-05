import { SEEDED_MOMENTS } from "@/data/moments";
import { MomentCard } from "@/components/MomentCard";
import { motion } from "framer-motion";

const totalExposure = "£17,160";

const summaryStats = [
  { label: "Active Moments", value: "6" },
  { label: "Critical", value: "1", color: "#ef4444" },
  { label: "High Priority", value: "3", color: "#c9a84c" },
  { label: "Total Exposure", value: totalExposure, color: "#c9a84c" },
];

export default function LiveMoments() {
  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-5xl">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Moment Intelligence</div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Live Moments</h1>
              <p className="text-xs mt-1" style={{ color: 'hsl(215 16% 40%)' }}>
                Operational signals detected, prioritised, and ready for action.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="mono-value" style={{ color: 'hsl(215 16% 40%)' }}>14:32 UTC</span>
            </div>
          </div>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 divide-x"
            style={{ borderTop: '1px solid hsl(220 13% 10%)', borderBottom: '1px solid hsl(220 13% 10%)', borderLeft: '1px solid hsl(220 13% 10%)', borderRight: '1px solid hsl(220 13% 10%)', divideColor: 'hsl(220 13% 10%)' }}
          >
            {summaryStats.map((s, i) => (
              <div key={i} className="px-5 py-3" style={{ borderRight: i < summaryStats.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                <div className="label-caps mb-1">{s.label}</div>
                <div className="text-lg font-bold" style={{ color: s.color || '#fff', letterSpacing: '0.01em' }}>{s.value}</div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Flow indicator */}
        <div className="flex items-center gap-3 mb-6" style={{ paddingBottom: 16, borderBottom: '1px solid hsl(220 13% 9%)' }}>
          {['Detect', 'Decide', 'Route', 'Execute', 'Outcome'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: i === 0 ? '#c9a84c' : 'hsl(215 16% 35%)',
                }}
              >
                {step}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: 'hsl(220 13% 18%)', fontSize: 10 }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Moment cards */}
        <div className="space-y-3">
          {SEEDED_MOMENTS.map((moment, i) => (
            <MomentCard key={moment.id} moment={moment} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
