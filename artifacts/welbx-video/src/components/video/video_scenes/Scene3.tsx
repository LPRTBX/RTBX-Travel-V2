import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene3() {
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
    <motion.div className="absolute inset-0 z-10 flex flex-col items-center justify-center" {...sceneTransitions.zoomThrough}>
      
      <div className="absolute top-[15%] text-center w-full">
        <motion.h2 
          className="font-display text-[4vw] font-bold text-success"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
        >
          The Solution
        </motion.h2>
      </div>

      <div className="relative w-full h-full flex items-center justify-center mt-[10vh]">
        {/* Central Core */}
        <motion.div 
          className="absolute w-[20vw] h-[20vw] bg-bg-muted border-2 border-primary rounded-full flex flex-col items-center justify-center z-20 shadow-[0_0_50px_rgba(201,168,76,0.3)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <span className="font-display font-bold text-[3vw] text-primary">WELBX</span>
          <span className="text-[1vw] text-text-secondary tracking-widest uppercase">Engine</span>
        </motion.div>

        {/* Orbiting Signals */}
        {[
          { label: "Guest Signals", angle: 0, delay: 0 },
          { label: "Staff Signals", angle: 120, delay: 0.2 },
          { label: "Ops Signals", angle: 240, delay: 0.4 },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="absolute z-30"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={phase >= 2 ? { 
              opacity: 1, 
              x: Math.cos(item.angle * Math.PI / 180) * window.innerWidth * 0.25,
              y: Math.sin(item.angle * Math.PI / 180) * window.innerWidth * 0.25,
            } : { opacity: 0, x: 0, y: 0 }}
            transition={{ duration: 1.5, ease: "backOut", delay: item.delay }}
          >
            <div className="bg-secondary/20 border border-secondary text-secondary px-6 py-3 rounded-full text-[1.5vw] font-bold whitespace-nowrap backdrop-blur-md">
              {item.label}
            </div>
            
            {/* Connecting lines drawn backwards to center */}
            {phase >= 3 && (
              <motion.svg className="absolute top-1/2 left-1/2 -z-10 overflow-visible" style={{ width: 0, height: 0 }}>
                <motion.line
                  x1="0" y1="0"
                  x2={-Math.cos(item.angle * Math.PI / 180) * window.innerWidth * 0.15}
                  y2={-Math.sin(item.angle * Math.PI / 180) * window.innerWidth * 0.15}
                  stroke="var(--color-secondary)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 1 }}
                />
              </motion.svg>
            )}
          </motion.div>
        ))}

        {/* Action output */}
        <motion.div
          className="absolute bottom-[10%] bg-success/20 border border-success text-success px-10 py-4 rounded-xl text-[2.5vw] font-bold whitespace-nowrap backdrop-blur-md z-30"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={phase >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          The Right Action. In the Moment.
        </motion.div>

      </div>
    </motion.div>
  );
}