import React from 'react';
import { motion } from 'framer-motion';

const PixelButton = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <motion.button
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: "0px 0px 20px rgba(0, 250, 217, 0.4)",
        filter: "brightness(1.1)"
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.96,
        boxShadow: "0px 0px 5px rgba(0, 250, 217, 0.2)"
      } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-pixel text-[10px] tracking-widest uppercase transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        pixel-border bg-[#FF5252] text-white font-bold flex items-center justify-center gap-3
        ${className}
      `}
    >
      {/* Interaction Ripple Layer (Simulated via glow intensity) */}
      <motion.div 
        className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity"
      />
      
      {children}
    </motion.button>
  );
};

export default PixelButton;
