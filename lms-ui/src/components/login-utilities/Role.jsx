import React from 'react';
import student from '../../assets/student.svg';
import educator from '../../assets/educator.svg';
import admin from '../../assets/admin.svg';

const Role = ({ selectedRole = 'admin', onSelectRole }) => {
  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Governance',
      icon: admin,
      activeBorder: 'border-rose-500/70',
      activeBg: 'bg-rose-500/15',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      indicatorColor: 'bg-rose-400'
    },
    {
      id: 'accountant',
      title: 'Accountant',
      desc: 'Finance',
      icon: admin,
      activeBorder: 'border-amber-500/70',
      activeBg: 'bg-amber-500/15',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      indicatorColor: 'bg-amber-400'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      desc: 'Faculty',
      icon: educator,
      activeBorder: 'border-emerald-500/70',
      activeBg: 'bg-emerald-500/15',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      indicatorColor: 'bg-emerald-400'
    },
    {
      id: 'student',
      title: 'Student',
      desc: 'Learner',
      icon: student,
      activeBorder: 'border-indigo-500/70',
      activeBg: 'bg-indigo-500/15',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.35)]',
      indicatorColor: 'bg-indigo-400'
    },
    {
      id: 'librarian',
      title: 'Librarian',
      desc: 'Assets',
      icon: educator,
      activeBorder: 'border-pink-500/70',
      activeBg: 'bg-pink-500/15',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
      indicatorColor: 'bg-pink-400'
    }
  ];

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          Institutional Role
        </label>
        <span className="text-[11px] text-slate-400">
          5 Roles Configured
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {roles.map((item) => {
          const isSelected = selectedRole === item.id;

          return (
            <label
              key={item.id}
              htmlFor={`role-${item.id}`}
              className={`relative cursor-pointer select-none rounded-xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center transition-all duration-300 border ${
                isSelected
                  ? `${item.activeBg} ${item.activeBorder} ${item.glow} scale-[1.02]`
                  : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
              } backdrop-blur-md`}
            >
              <input
                type="radio"
                id={`role-${item.id}`}
                name="role"
                value={item.id}
                checked={isSelected}
                onChange={() => onSelectRole && onSelectRole(item.id)}
                className="sr-only"
              />

              {/* Selection Dot */}
              <div
                className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected ? `${item.indicatorColor} scale-100` : 'bg-transparent scale-0'
                }`}
              />

              {/* Icon Container */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mb-1 transition-transform duration-300">
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className={`w-full h-full object-contain filter transition-all duration-300 ${
                    isSelected ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              </div>

              {/* Text Label */}
              <span className={`text-[11px] font-semibold tracking-tight transition-colors duration-200 truncate w-full ${
                isSelected ? 'text-white' : 'text-slate-300'
              }`}>
                {item.title}
              </span>
              <span className="text-[9px] text-slate-400 hidden sm:block truncate w-full">
                {item.desc}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Role;
