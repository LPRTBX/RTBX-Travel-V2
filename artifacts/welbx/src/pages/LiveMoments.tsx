import { useState, useEffect } from "react";
import { SEEDED_MOMENTS } from "@/data/moments";
import { MomentCard } from "@/components/MomentCard";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";

function LiveClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toUTCString().slice(17, 22) + " UTC";
  });
  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      setTime(now.toUTCString().slice(17, 22) + " UTC");
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="mono-value" style={{ color: 'hsl(215 16% 40%)' }}>{time}</span>;
}

const FLOW_LABELS = ['Detect', 'Decide', 'Route', 'Execute', 'Outcome'];

export default function LiveMoments() {
  const { flowStep, vectorExecuting, resolveVIP, momentCount, vipResolved } = useApp();

  const criticalCount = vipResolved ? 0 : 1;
  const summaryStats = [
    { label: "Active Moments", value: String(momentCount) },
    { label: "Critical", value: String(criticalCount), color: criticalCount > 0 ? "#ef4444" : "#10b981" },
    { label: "High Priority", value: "3", color: "#c9a84c" },
    { label: "Total Exposure", value: vipResolved ? "$9,160" : "$17,160", color: "#c9a84c" },
  ];

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">

      {/* VECTOR EXECUTING overlay */}
      <AnimatePresence>
        {vectorExecuting && (
          <motion.div
            key="vector-exec"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              left: 224,
              background: 'rgba(10,12,16,0.94)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{ width: 48, height: 2, background: '#c9a84c', marginBottom: 28, transformOrigin: 'left' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: 11, letterSpacing: '0.22em', color: '#c9a84c', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}
            >
              Vector · Execution Engine
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}
            >
              Routing Response
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 13, color: 'hsl(215 16% 42%)', letterSpacing: '0.04em' }}
            >
              M2 — VIP Arrival Risk — coordinating cross-department execution
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 mt-8"
            >
              {['Housekeeping', 'Front Desk', 'Guest Relations'].map((dept, i) => (
                <motion.span
                  key={dept}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.18 }}
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#c9a84c', padding: '4px 10px',
                    border: '1px solid rgba(201,168,76,0.25)',
                    background: 'rgba(201,168,76,0.07)',
                  }}
                >{dept}</motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <LiveClock />
            </div>
          </div>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 divide-x"
            style={{ border: '1px solid hsl(220 13% 10%)' }}
          >
            {summaryStats.map((s, i) => (
              <div key={i} className="px-6 py-4" style={{ borderRight: i < summaryStats.length - 1 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                <div className="label-caps mb-2">{s.label}</div>
                <motion.div
                  animate={{ color: s.color || '#fff' }}
                  transition={{ duration: 0.6 }}
                  className="font-bold leading-none"
                  style={{ fontSize: 28, letterSpacing: '-0.01em' }}
                >
                  {s.value}
                </motion.div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Flow indicator */}
        <div className="flex items-center gap-0 mb-6" style={{ paddingBottom: 16, borderBottom: '1px solid hsl(220 13% 9%)' }}>
          {FLOW_LABELS.map((label, i, arr) => {
            const active = i === flowStep;
            const done = i < flowStep;
            return (
              <div key={label} className="flex items-center">
                <motion.div
                  animate={{
                    background: active ? 'rgba(201,168,76,0.08)' : done ? 'rgba(16,185,129,0.06)' : 'transparent',
                    borderColor: active ? 'rgba(201,168,76,0.2)' : done ? 'rgba(16,185,129,0.15)' : 'transparent',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    border: '1px solid transparent',
                  }}
                >
                  {active && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} className="animate-pulse" />
                  )}
                  {done && (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  )}
                  <motion.span
                    animate={{
                      color: active ? '#c9a84c' : done ? '#10b981' : 'hsl(215 16% 30%)',
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    {label}
                  </motion.span>
                </motion.div>
                {i < arr.length - 1 && (
                  <span style={{ color: 'hsl(220 13% 16%)', fontSize: 9, padding: '0 4px' }}>→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Moment cards */}
        <div className="space-y-3">
          {SEEDED_MOMENTS.map((moment, i) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              index={i}
              onVipAccept={moment.id === 'm2' ? resolveVIP : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
