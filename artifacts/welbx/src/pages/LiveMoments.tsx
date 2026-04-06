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
              <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 45%)', letterSpacing: '0.01em' }}>
                WELBX detects live operational moments, recommends action, coordinates execution, and proves value.
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
              <div key={i} className="px-6 py-4" style={{ borderRight: i < summaryStats.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                <div className="label-caps mb-2">{s.label}</div>
                <div className="font-bold leading-none" style={{ fontSize: 28, color: s.color || '#fff', letterSpacing: '-0.01em' }}>{s.value}</div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Flow indicator */}
        <div className="flex items-center gap-0 mb-6" style={{ paddingBottom: 16, borderBottom: '1px solid hsl(220 13% 9%)' }}>
          {[
            { label: 'Detect', active: true },
            { label: 'Decide', active: false },
            { label: 'Route', active: false },
            { label: 'Execute', active: false },
            { label: 'Outcome', active: false },
          ].map(({ label, active }, i, arr) => (
            <div key={label} className="flex items-center">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
                }}
              >
                {active && (
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} className="animate-pulse" />
                )}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: active ? '#c9a84c' : 'hsl(215 16% 30%)',
                  }}
                >
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: 'hsl(220 13% 16%)', fontSize: 9, padding: '0 4px' }}>→</span>
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
