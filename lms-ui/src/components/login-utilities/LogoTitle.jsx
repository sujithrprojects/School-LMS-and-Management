import React from 'react';
import logo from '../../assets/logo.svg';

const LogoTitle = ({ role = 'admin' }) => {
  const roleBadges = {
    admin: { text: 'Super Admin Console', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
    accountant: { text: 'Bursar & Accounts Portal', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    teacher: { text: 'Faculty & Educator Portal', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    student: { text: 'Student & Parent Portal', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
    librarian: { text: 'Library Information Console', bg: 'bg-pink-500/10 text-pink-300 border-pink-500/30' }
  };

  const currentBadge = roleBadges[role] || roleBadges.admin;

  return (
    <div className="flex flex-col items-center text-center space-y-2">
      {/* Glowing Logo Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
        <div className="relative w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/20 p-2 flex items-center justify-center backdrop-blur-xl shadow-inner">
          <img src={logo} alt="EduPulse Logo" className="w-10 h-10 object-contain filter drop-shadow" />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Edu<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Pulse</span>
        </h1>
        <p className="text-xs text-slate-400">
          Next-Gen School ERP System
        </p>
      </div>

      {/* Active Role Pill Indicator */}
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-300 ${currentBadge.bg}`}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse bg-current" />
        {currentBadge.text}
      </div>
    </div>
  );
};

export default LogoTitle;
