import React from 'react';
import { Search, Bell, Settings, User, Command } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 border-b border-white/[0.05] bg-[#0B0E14]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Type to search..." 
            className="w-full bg-white/[0.03] border border-white/[0.05] focus:border-green-500/50 outline-none rounded-2xl py-2.5 pl-12 pr-4 text-sm transition-all text-slate-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 flex items-center gap-1">
            <Command size={10} className="text-slate-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">K</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-green-500 hover:bg-green-500/5 transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full border-2 border-[#0B0E14]" />
          </button>
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-green-500 hover:bg-green-500/5 transition-all">
            <Settings size={20} />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/10" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold text-white">Guest User</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Public Access</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center border border-white/20 shadow-lg shadow-green-500/10">
            <User size={20} className="text-black" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
