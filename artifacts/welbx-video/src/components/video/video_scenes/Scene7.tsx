import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      {...sceneTransitions.zoomThrough}
    >
      {/* Radial glow behind text */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 2 }}
      />

      {/* Orbiting rings */}
      {[0.6, 0.85, 1.1].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/15 pointer-events-none"
          style={{
            width: `${scale * 40}vw`,
            height: `${scale * 40}vw`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.5, delay: i * 0.25, ease: 'easeOut' }}
        />
      ))}

      <div className="relative text-center max-w-[70vw] z-10">
        <motion.div
          className="text-primary tracking-[0.25em] text-[1.3vw] font-bold mb-6 uppercase"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Ready to map this to your environment?
        </motion.div>

        <motion.div
          className="font-display font-bold tracking-[0.1em]"
          style={{
            fontSize: 'clamp(40px, 8vw, 120px)',
            background: 'linear-gradient(135deg, #c9a84c 0%, #f0d070 40%, #c9a84c 70%, #a07830 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.85 }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : { opacity: 0, filter: 'blur(20px)', scale: 0.85 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          WELBX
        </motion.div>

        <motion.p
          className="text-[2vw] text-text-secondary mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 1 }}
        >
          The execution layer hotels do not currently have.
        </motion.p>

        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          <div className="h-px w-[8vw] bg-gradient-to-r from-transparent to-primary/60" />
          <span className="text-[1.4vw] text-primary/80 font-mono tracking-widest uppercase">
            welbx.com
          </span>
          <div className="h-px w-[8vw] bg-gradient-to-l from-transparent to-primary/60" />
        </motion.div>
      </div>
    </motion.div>
  );
}
