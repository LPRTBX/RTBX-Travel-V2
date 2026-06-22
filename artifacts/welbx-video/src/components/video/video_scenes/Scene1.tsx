import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10" {...sceneTransitions.clipCircle}>
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-primary/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-secondary/10 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
      />

      <div className="relative text-center max-w-[80vw]">
        <motion.div
          className="text-primary tracking-[0.2em] text-[1.5vw] font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          WELBX TRAVEL
        </motion.div>
        
        <motion.h1
          className="font-display text-[6vw] font-bold leading-tight"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(10px)', y: 40 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          The Real-Time
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Operating Layer
          </span>
        </motion.h1>

        <motion.p
          className="text-[2vw] text-text-secondary mt-8 max-w-[50vw] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          The execution layer hotels do not currently have.
        </motion.p>
      </div>
    </motion.div>
  );
}