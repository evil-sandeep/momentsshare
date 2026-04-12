import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Compass, 
  PlusSquare, 
  Settings, 
  LogOut,
  Camera
} from 'lucide-react';

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link to={to} className="relative">
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
          ${active 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}
        `}
      >
        <Icon size={20} className={`${active ? 'animate-pulse' : ''}`} />
        <span className="font-pixel text-[10px] tracking-widest uppercase font-bold">{label}</span>
        
        {/* Glow effect for active item */}
        {active && (
          <motion.div 
            layoutId="active-nav-glow"
            className="absolute inset-0 bg-cyan-400/5 blur-md rounded-xl -z-10"
          />
        )}
      </motion.div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-slate-900 bg-black/40 backdrop-blur-xl p-6 flex flex-col items-stretch h-screen sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 pixel-border bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_#00F5FF]">
          <Camera size={20} className="text-black" />
        </div>
        <h1 className="font-pixel text-xs tracking-tighter font-black text-white">SNAPSHARE <span className="text-cyan-400">PRO</span></h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <SidebarItem icon={Home} label="Home" to="/" active={location.pathname === '/'} />
        <SidebarItem icon={Compass} label="Archive" to="/gallery" active={location.pathname === '/gallery'} />
        <SidebarItem icon={PlusSquare} label="Create" to="/upload" active={location.pathname === '/upload'} />
      </nav>
      <div className="pt-6 border-t border-slate-900 flex flex-col gap-2">
        <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        <SidebarItem icon={LogOut} label="Neural Exit" to="/logout" active={false} />
      </div>

      <div className="mt-auto px-4 pt-8">
        <a 
          href="https://github.com/evil-sandeep" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 group opacity-40 hover:opacity-100 transition-all duration-300 no-underline"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
            <GithubIcon size={16} className="text-slate-500 group-hover:text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Developed by</span>
            <span className="text-[10px] text-slate-400 group-hover:text-white font-pixel font-bold transition-colors">evil-sandeep</span>
          </div>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
