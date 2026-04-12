import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingSplash = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('');
  const fullText = "INITIALIZING ARCHIVE...";

  useEffect(() => {
    // Typing Effect
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);

    // Auto Redirect
    const timer = setTimeout(() => {
      navigate('/gallery');
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#0B0F14] z-[200] flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive Breathing Hintergrund */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[800px] h-[800px] rounded-full bg-red-500/10 blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[100px]"
      />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Pixel Loader Container */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="relative w-24 h-24">
          {/* Outer Pixel Box */}
          {[0, 90, 180, 270].map((rot) => (
            <motion.div
              key={rot}
              style={{ rotate: rot }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: rot / 360 }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary" />
            </motion.div>
          ))}

          {/* Central Rotating Pixel */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-2 border-red-500/20 rounded-sm"
          >
            <div className="absolute -top-1 left-1/2 -tranzinc-x-1/2 w-2 h-2 bg-primary shadow-[0_0_10px_#00F5FF]" />
          </motion.div>

          {/* Glitch circles */}
          <motion.div 
             animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 rounded-full border border-primary/30"
          />
        </div>

        {/* Animated Welcome Text */}
        <div className="text-center">
          <h2 className="font-pixel text-sm tracking-[0.3em] text-primary mb-4 drop-shadow-[0_0_15px_rgba(0,245,255,0.8)]">
            {loadingText}
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1 tranzinc-y-0.5"
            />
          </h2>
          <p className="font-sans text-[10px] text-zinc-500 tracking-widest uppercase opacity-60">
            Secure Neural Link Established
          </p>
        </div>
      </div>

      {/* Decorative Scanner Line */}
      <motion.div 
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(0,245,255,0.3)] z-20"
      />

      {/* Magical Transition Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ times: [0, 0.8, 1], duration: 3.5 }}
        className="absolute inset-0 bg-zinc-950 pointer-events-none z-50"
      />
    </div>
  );
};

export default LandingSplash;
