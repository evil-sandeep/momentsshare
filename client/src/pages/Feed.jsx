import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import PixelButton from '../components/PixelButton';

const Feed = () => {
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/images`);
        // Just take the first 4 for the trending section
        setSnaps(response.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch trending", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <>
      {/* Header / Search */}
      <header className="flex items-center justify-between mb-12">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search collective..." 
            className="w-full bg-slate-900/50 border border-slate-800 focus:border-cyan-500/50 outline-none rounded-2xl py-3 pl-12 pr-4 backdrop-blur-md transition-all"
          />
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            94.2k Active
          </div>
          <PixelButton className="h-11">Connect Wallet</PixelButton>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex flex-col gap-12">
        {/* Hero Section / Featured */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="text-cyan-400" />
            Trending Snaps
          </h2>
          
          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-cyan-400" />
             </div>
          ) : snaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {snaps.map((snap, i) => (
                  <GlassCard key={snap._id || snap.id} delay={i * 0.1} className="group p-3!">
                    <div className="relative overflow-hidden rounded-xl mb-4 aspect-square">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        src={snap.url} 
                        alt={snap.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-bold text-cyan-400 underline decoration-2 underline-offset-4 tracking-widest uppercase">
                          View details
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <h3 className="font-bold text-sm mb-1">{snap.title}</h3>
                        <p className="text-xs text-slate-500">@{snap.user}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-cyan-400">{snap.likes}</span>
                        <span className="text-[10px] text-slate-600 block leading-none">LIKES</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-20 text-center glass rounded-3xl border-dashed border-slate-800">
               <p className="text-slate-600 font-pixel text-[10px] tracking-widest">ZERO DATA DETECTED</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Feed;
