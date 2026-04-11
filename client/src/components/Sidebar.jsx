import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Bell, 
  PlusSquare, 
  User, 
  Settings, 
  LogOut,
  Camera
} from 'lucide-react';

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
        <SidebarItem icon={Bell} label="Notifications" to="/notifications" active={location.pathname === '/notifications'} />
        <SidebarItem icon={PlusSquare} label="Create" to="/upload" active={location.pathname === '/upload'} />
        <SidebarItem icon={User} label="Profile" to="/profile" active={location.pathname === '/profile'} />
      </nav>

      <div className="pt-6 border-t border-slate-900 flex flex-col gap-2">
        <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        <SidebarItem icon={LogOut} label="Neural Exit" to="/logout" active={false} />
      </div>
    </aside>
  );
};

export default Sidebar;
