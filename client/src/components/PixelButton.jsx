import React from 'react';
import { motion } from 'framer-motion';

const PixelButton = ({ children, onClick, className = "", disabled = false, variant = "primary" }) => {
  return (
    <motion.button
      whileHover={!disabled ? { 
        scale: 1.02,
        boxShadow: "0px 0px 20px rgba(34, 197, 94, 0.2)",
        filter: "brightness(1.1)"
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98
      } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${variant === 'primary' 
          ? 'bg-green-500 text-black shadow-lg shadow-green-500/10' 
          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}
        flex items-center justify-center gap-2.5
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default PixelButton;
