import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Download, Eye, Users, RefreshCw } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import PixelButton from '../components/PixelButton';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalDownloads: 0,
    uniqueVisitorsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/analytics`);
      setStats({
        totalViews: response.data.totalViews || 0,
        totalDownloads: response.data.totalDownloads || 0,
        uniqueVisitorsCount: response.data.uniqueVisitorsCount || 0
      });
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Optional: Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-8 py-12 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-zinc-900 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Activity className="text-[#FF5252]" />
            <span className="font-pixel text-xs tracking-widest text-[#FF5252] uppercase">System Telemetry</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 text-white uppercase italic">Network Activity</h1>
          <p className="text-zinc-500 max-w-xl">Live monitoring of global interaction metrics across the SnapShare grid.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
             <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1 font-pixel">Last Sync</p>
             <p className="text-sm font-mono text-[#00FAD9]">{lastSync.toLocaleTimeString()}</p>
          </div>
          <PixelButton onClick={fetchStats} className="!bg-[#FF5252]/10 border border-[#FF5252]/20 hover:!border-[#FF5252]/50">
            <RefreshCw size={18} className={`text-[#FF5252] ${loading ? 'animate-spin' : ''}`} />
            <span>Force Sync</span>
          </PixelButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatedCounter 
          label="Total Intercepts" 
          value={stats.totalViews} 
          icon={Eye} 
          delay={0.1}
        />
        <AnimatedCounter 
          label="Data Extractions" 
          value={stats.totalDownloads} 
          icon={Download} 
          delay={0.2}
        />
        <AnimatedCounter 
          label="Unique Entities" 
          value={stats.uniqueVisitorsCount} 
          icon={Users} 
          delay={0.3}
        />
      </div>

      <div className="mt-16 p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 glass flex items-center justify-center min-h-[300px]">
         <div className="text-center flex flex-col items-center">
            <Activity size={48} className="text-zinc-700 w-16 mb-6" />
            <p className="font-pixel text-[10px] tracking-widest text-zinc-600 uppercase">Advanced Graphs Offline</p>
            <p className="text-zinc-500 mt-2 text-sm max-w-md mx-auto">Visual timeline rendering requires additional core processing units. Baseline metrics are active.</p>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
