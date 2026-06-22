import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 7500),
      setTimeout(() => setPhase(5), 10000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 z-10 flex flex-col items-center justify-center" {...sceneTransitions.wipe}>
      
      {/* Background red tint indicating problem */}
      <motion.div 
        className="absolute inset-0 bg-error/5 pointer-events-none"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="absolute top-[15%] text-center w-full">
        <motion.h2 
          className="font-display text-[4vw] font-bold text-error"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
        >
          The Problem
        </motion.h2>
      </div>

      <div className="flex gap-[5vw] w-full px-[10vw] mt-[10vh] items-center justify-center">
        {/* Signals Undetected */}
        <motion.div 
          className="flex-1 flex flex-col items-center border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="text-[1.5vw] font-bold text-text-primary mb-2">Signals</div>
          <div className="text-[3vw] text-error font-display font-bold">Go Undetected</div>
        </motion.div>

        {/* Moments Missed */}
        <motion.div 
          className="flex-1 flex flex-col items-center border border-white/10 bg-white/5 p-8 rounded-2xl backdrop-blur-md"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="text-[1.5vw] font-bold text-text-primary mb-2">Moments</div>
          <div className="text-[3vw] text-error font-display font-bold">Get Missed</div>
        </motion.div>

        {/* Value Lost */}
        <motion.div 
          className="flex-1 flex flex-col items-center border border-error/30 bg-error/10 p-8 rounded-2xl backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="text-[1.5vw] font-bold text-text-primary mb-2">Value</div>
          <div className="text-[3vw] text-error font-display font-bold">Is Lost</div>
        </motion.div>
      </div>

    </motion.div>
  );
}