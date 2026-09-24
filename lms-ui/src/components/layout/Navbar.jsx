import React, { useState } from 'react';
import { 
  Search, Bell, ShieldAlert, ChevronDown, Check, LogOut 
} from 'lucide-react';
import logo from '../../assets/logo.svg';
import { ROLES } from '../../data/mockData';

const Navbar = ({ 
  currentRole, 
  onRoleChange, 
  onLogout, 
  onOpenSearch, 
  onOpenEmergency,
  onOpenNotifications,
  unreadCount = 3,
  onToggleSidebar
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeUser = ROLES[currentRole] || ROLES.admin;

  const roleColors = {
    admin: 'from-indigo-500 to-purple-600 border-indigo-400/40 text-indigo-200',
    accountant: 'from-amber-500 to-orange-600 border-amber-400/40 text-amber-200',
    teacher: 'from-emerald-500 to-teal-600 border-emerald-400/40 text-emerald-200',
    student: 'from-cyan-500 to-blue-600 border-cyan-400/40 text-cyan-200',
    librarian: 'from-pink-500 to-rose-600 border-pink-400/40 text-pink-200'
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-xl px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            title="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-white/20 p-1.5 flex items-center justify-center">
                <img src={logo} alt="EduPulse" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Pulse</span></span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ERP v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium -mt-0.5">Next-Gen Academic Cloud</p>
            </div>
          </div>
        </div>

        {/* Center: Global Quick Search Button */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-900/60 border border-white/10 rounded-xl hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Search students, invoices, timetable, staff...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-white/10 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Selector, Notifications, Emergency, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search trigger */}
          <button 
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Emergency Alert Trigger */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50 text-xs font-semibold transition-all group animate-pulse"
            title="Emergency Broadcast"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">Emergency Trigger</span>
          </button>

          {/* Dynamic Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 hover:border-white/20 text-xs text-white transition-all backdrop-blur-md"
              title="Switch Active View Role"
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${roleColors[currentRole]}`} />
              <div className="text-left hidden sm:block">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Role</p>
                <p className="text-xs font-bold text-white capitalize">{activeUser.name.split(' ')[0]}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-modal p-2 shadow-2xl z-50 border border-white/15 animate-fade-in">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Simulate Role View</p>
                  <p className="text-xs text-slate-300">Contextually adapts navigation and permissions.</p>
                </div>
                {Object.values(ROLES).map((r) => {
                  const isActive = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                        isActive 
                          ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-lg object-cover border border-white/15" />
                        <div>
                          <p className="font-semibold text-white">{r.name}</p>
                          <p className="text-[10px] text-slate-400">{r.badge}</p>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-[#0f172a]" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10 transition-colors"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20"
              />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-modal p-2 shadow-2xl z-50 border border-white/15 animate-fade-in">
                <div className="p-3 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white">{activeUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{activeUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeUser.roleTag}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
