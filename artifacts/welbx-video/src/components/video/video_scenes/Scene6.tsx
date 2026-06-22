import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

const WEEKS = [
  { label: 'Weeks 1–2', title: 'Signal Mapping', desc: 'Audit live data sources & gaps', color: '#3b82f6' },
  { label: 'Weeks 3–4', title: 'Chain Setup', desc: 'Wire moments to decisions', color: '#a78bfa' },
  { label: 'Weeks 5–6', title: 'Live Actions', desc: 'Deploy in active property', color: '#c9a84c' },
  { label: 'Weeks 7–8', title: 'Value Proof', desc: 'Measure outcomes & ROI', color: '#10b981' },
];

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 5500),
      setTimeout(() => setPhase(4), 7500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      {...sceneTransitions.wipe}
    >
      <motion.div
        className="text-center mb-[3vh]"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="text-primary tracking-[0.2em] text-[1.4vw] font-bold mb-2 uppercase">
          The Pilot Model
        </motion.div>
        <h2 className="font-display text-[3.5vw] font-bold text-white">
          8 Weeks. One Live Property.
        </h2>
      </motion.div>

      <div className="flex gap-[1.5vw] w-full px-[6vw]">
        {WEEKS.map((week, i) => (
          <motion.div
            key={week.label}
            className="flex-1 rounded-xl overflow-hidden relative"
            style={{
              background: `${week.color}08`,
              border: `1px solid ${week.color}30`,
            }}
            initial={{ opacity: 0, scaleY: 0, originY: 1 }}
            animate={phase >= 2 ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: week.color }}
              initial={{ scaleX: 0 }}
              animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 + 0.4 }}
            />
            <div className="p-[2vw] pt-[2.5vw]">
              <div
                className="text-[1.1vw] font-mono font-bold mb-1 tracking-widest"
                style={{ color: week.color }}
              >
                {week.label}
              </div>
              <div className="font-display font-bold text-[1.8vw] text-white mb-2 leading-tight">
                {week.title}
              </div>
              <div className="text-[1.2vw] text-text-secondary">{week.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-[4vh] bg-primary/10 border border-primary/40 rounded-xl px-[4vw] py-[2vw] text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="text-[2vw] font-display font-bold text-primary mb-1">
          Prove the operating layer. Before you scale it.
        </div>
        <div className="text-[1.4vw] text-text-secondary">
          A structured pilot limits risk while generating real evidence.
        </div>
      </motion.div>

      <motion.p
        className="text-[1.6vw] text-text-secondary mt-[2.5vh] text-center"
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        Limited pilot slots open now.
      </motion.p>
    </motion.div>
  );
}
