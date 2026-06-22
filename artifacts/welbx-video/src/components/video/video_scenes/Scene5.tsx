import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

const PATHS = [
  {
    title: 'Operator',
    role: 'Hotel properties deploying the live operating layer.',
    color: '#c9a84c',
    icon: '🏨',
    delay: 0,
  },
  {
    title: 'Integration',
    role: 'PMS, CRM & data vendors connecting into the signal network.',
    color: '#3b82f6',
    icon: '🔗',
    delay: 0.25,
  },
  {
    title: 'Commercial',
    role: 'Revenue & distribution partners amplifying outcomes.',
    color: '#a78bfa',
    icon: '📈',
    delay: 0.5,
  },
  {
    title: 'Strategic',
    role: 'Investors and advisors shaping the category.',
    color: '#22d3ee',
    icon: '🌐',
    delay: 0.75,
  },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      {...sceneTransitions.clipCircle}
    >
      <motion.h2
        className="font-display text-[3.5vw] font-bold text-primary mb-[4vh] tracking-wide text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
      >
        Four Partner Paths
      </motion.h2>

      <div className="grid grid-cols-2 gap-[2vw] w-full px-[8vw]">
        {PATHS.map((path) => (
          <motion.div
            key={path.title}
            className="rounded-2xl p-[2.5vw] backdrop-blur-md relative overflow-hidden"
            style={{
              background: `${path.color}08`,
              border: `1px solid ${path.color}40`,
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.6, delay: path.delay, type: 'spring', stiffness: 150, damping: 20 }}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${path.color}80, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: path.delay + 0.3 }}
            />
            <div className="text-[2.5vw] mb-[1vw]">{path.icon}</div>
            <div
              className="font-display font-bold text-[2vw] mb-[1vw]"
              style={{ color: path.color }}
            >
              {path.title} Partner
            </div>
            <div className="text-[1.4vw] text-text-secondary leading-snug">{path.role}</div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-[1.8vw] text-text-secondary mt-[3vh] text-center"
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        Every path has a defined entry point and commercial structure.
      </motion.p>
    </motion.div>
  );
}
