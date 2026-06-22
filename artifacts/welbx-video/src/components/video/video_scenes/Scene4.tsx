import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

const CHAIN = [
  { key: 'Signals', color: '#3b82f6', delay: 0 },
  { key: 'Moments', color: '#a78bfa', delay: 0.5 },
  { key: 'Decisions', color: '#22d3ee', delay: 1.0 },
  { key: 'Actions', color: '#c9a84c', delay: 1.5 },
  { key: 'Outcomes', color: '#10b981', delay: 2.0 },
  { key: 'Value', color: '#10b981', delay: 2.5 },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      {...sceneTransitions.wipe}
    >
      <motion.h2
        className="font-display text-[3.5vw] font-bold text-primary mb-[5vh] tracking-wide text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
      >
        The Operating Chain
      </motion.h2>

      <div className="flex items-center gap-0 w-full px-[5vw] justify-center">
        {CHAIN.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 30 }}
              transition={{ duration: 0.6, delay: step.delay, type: 'spring', stiffness: 200, damping: 18 }}
            >
              <motion.div
                className="w-[10vw] h-[10vw] rounded-2xl flex items-center justify-center relative"
                style={{
                  background: `${step.color}15`,
                  border: `2px solid ${step.color}60`,
                  boxShadow: phase >= 3 ? `0 0 30px ${step.color}30` : 'none',
                }}
                animate={phase >= 3 ? { boxShadow: [`0 0 20px ${step.color}20`, `0 0 40px ${step.color}40`, `0 0 20px ${step.color}20`] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span
                  className="font-display font-bold text-[1.6vw] text-center leading-tight"
                  style={{ color: step.color }}
                >
                  {step.key}
                </span>
              </motion.div>
            </motion.div>

            {i < CHAIN.length - 1 && (
              <motion.div
                className="flex items-center mx-[0.5vw]"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={phase >= 2 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.4, delay: step.delay + 0.3 }}
                style={{ transformOrigin: 'left' }}
              >
                <div className="w-[2vw] h-[2px] bg-white/20" />
                <div
                  className="text-white/40 text-[1.5vw]"
                  style={{ marginLeft: '-2px' }}
                >
                  ›
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.p
        className="text-[1.8vw] text-text-secondary mt-[5vh] text-center max-w-[60vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
      >
        Every signal becomes a moment. Every moment drives value.
      </motion.p>
    </motion.div>
  );
}
