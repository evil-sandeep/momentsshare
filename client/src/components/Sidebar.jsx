import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Upload, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Camera,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const SidebarSection = ({ title }) => (
  <p className="px-4 mt-8 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
    {title}
  </p>
);

const SidebarItem = ({ icon: Icon, label, to, active, badge }) => {
  return (
    <Link to={to} className="block group">
      <div
        className={`
          relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
          ${active 
            ? 'bg-green-500/10 text-green-500' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={`${active ? 'text-green-500' : 'group-hover:text-white transition-colors'}`} />
          <span className="text-sm font-semibold tracking-wide">{label}</span>
        </div>
        
        {badge ? (
          <span className="px-1.5 py-0.5 rounded-md bg-green-500/10 text-[10px] font-bold text-green-500 border border-green-500/20">
            {badge}
          </span>
        ) : active && (
          <motion.div layoutId="active-indicator">
            <ChevronRight size={14} className="text-green-500" />
          </motion.div>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-[#111827] border-r border-white/[0.05] flex flex-col z-50">
      {/* Brand Logo */}
      <div className="h-20 flex items-center gap-3 px-8 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
          <Camera size={22} className="text-black" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white">SNAPSHARE</h1>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest leading-none">Pro Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <SidebarSection title="General" />
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/feed" active={location.pathname === '/feed'} />
        <SidebarItem icon={Upload} label="Upload Media" to="/upload" active={location.pathname === '/' || location.pathname === '/upload'} />
        
        <SidebarSection title="Experience" />
        <SidebarItem icon={ImageIcon} label="My Snapshots" to="/gallery" active={location.pathname.startsWith('/gallery')} badge="Live" />
        <SidebarItem icon={BarChart3} label="Analytics" to="/analytics" active={location.pathname === '/analytics'} />
        
        <SidebarSection title="Settings" />
        <SidebarItem icon={ShieldCheck} label="Security" to="/security" active={location.pathname === '/security'} />
        <SidebarItem icon={Settings} label="System Config" to="/settings" active={location.pathname === '/settings'} />
      </nav>

      {/* Bottom Footer / Upgrade */}
      <div className="p-4 mt-auto">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-950/40 border border-green-500/20 mb-4 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <Zap size={20} className="text-green-500" />
            </div>
            <p className="text-sm font-bold text-white mb-1">Upgrade to Pro</p>
            <p className="text-xs text-slate-400 mb-4">Unlock advanced analytics and cloud backup.</p>
            <button className="w-full py-2 rounded-lg bg-green-500 text-black text-xs font-bold hover:brightness-110 transition-all">
              Upgrade Now
            </button>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/20 blur-2xl rounded-full"
          />
        </div>

        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/10 mb-2">
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span>Terminate Link</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
