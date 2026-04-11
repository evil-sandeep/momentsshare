import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        borderColor: "rgba(0, 245, 255, 0.3)",
        boxShadow: "0px 10px 30px rgba(0, 245, 255, 0.1)"
      }}
      className={`glass rounded-3xl p-6 border-slate-800 transition-colors duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
