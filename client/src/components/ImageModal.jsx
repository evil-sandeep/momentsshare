import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2, Info } from 'lucide-react';
import PixelButton from './PixelButton';

const ImageModal = ({ image, onClose, onDownload }) => {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050000]/95 backdrop-blur-3xl" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-full flex flex-col md:flex-row gap-8 items-center lg:items-stretch">
        {/* Main Image View */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl group">
          {/* Pixel corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-600 opacity-60" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-red-600 opacity-60" />
          
          <motion.img
            layoutId={`image-${image._id || image.id}`}
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 glass rounded-full hover:bg-white/10 transition-colors z-50 group-hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-80 flex flex-col gap-6"
        >
          <div className="glass p-8 rounded-3xl border-zinc-900">
            <h2 className="text-2xl font-bold mb-2 text-white">{image.title}</h2>
            <p className="text-zinc-400 text-sm mb-6">Uploaded by <span className="text-[#FF5252] font-medium font-pixel">@{image.user}</span></p>
            
            <div className="flex flex-col gap-3">
              <PixelButton className="w-full" onClick={onDownload}>
                <Download size={18} />
                Download High-Res
              </PixelButton>
              <div className="flex gap-2">
                <button className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 hover:border-zinc-600 transition-all font-bold text-sm">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 hover:border-zinc-600 transition-all font-bold text-sm">
                  <Info size={16} /> Details
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-red-950 flex-1">
            <h3 className="font-pixel text-[10px] tracking-widest text-zinc-600 uppercase mb-4">Neural Metadata</h3>
            <div className="space-y-4">
              {[
                { label: 'Format', value: 'Lossless WebP' },
                { label: 'Resolution', value: '4K Optimized' },
                { label: 'Storage', value: 'Cloudinary Mesh' },
                { label: 'Asset ID', value: (image._id || image.id).substring(0, 8).toUpperCase() }
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-zinc-600 uppercase font-medium">{item.label}</span>
                  <span className="text-zinc-300 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-900">
               <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#00FAD9]/5 border border-[#00FAD9]/10 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FAD9] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#00FAD9] tracking-wider font-pixel">AI TAGGING ACTIVE</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {['#cyber', '#neon', '#archive', '#download'].map(tag => (
                   <span key={tag} className="text-[10px] font-mono text-zinc-500 hover:text-red-400 cursor-pointer">{tag}</span>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageModal;
