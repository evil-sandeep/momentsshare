import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedCounter = ({ value, label, icon: Icon, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(ease * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);

    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay }
    });

  }, [value, controls, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="relative overflow-hidden rounded-3xl p-8 border border-slate-800 bg-slate-900/40 glass group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={120} className="text-cyan-400" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
            <Icon size={24} />
          </div>
          <h3 className="font-pixel text-xs tracking-widest text-slate-400 uppercase">{label}</h3>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold tracking-tighter text-white">
            {displayValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
    </motion.div>
  );
};

export default AnimatedCounter;
