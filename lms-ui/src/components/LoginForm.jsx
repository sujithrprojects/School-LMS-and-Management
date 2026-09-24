import React, { useState } from 'react';
import LogoTitle from './login-utilities/LogoTitle';
import Role from './login-utilities/Role';
import Email from './login-utilities/Email';
import Password from './login-utilities/Password';
import SignIn from './login-utilities/SignIn';
import DontHaveAccount from './login-utilities/DontHaveAccount';
import { Sparkles } from 'lucide-react';
import { ROLES } from '../data/mockData';
import './Login.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin.director@edupulse.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    if (ROLES[roleId]) {
      setEmail(ROLES[roleId].email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    // Simulate authentication delay then redirect
    setTimeout(() => {
      setIsLoading(false);
      setNotification({
        type: 'success',
        message: `Authenticated as ${selectedRole.toUpperCase()}! Entering EduPulse Cloud ERP...`
      });

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(selectedRole);
        }
      }, 700);
    }, 800);
  };

  const handleQuickLaunch = (roleId) => {
    setSelectedRole(roleId);
    if (onLoginSuccess) {
      onLoginSuccess(roleId);
    }
  };

  return (
    <div className="glass-morphism-container bg-grid-pattern relative min-h-screen flex items-center justify-center px-4 py-6 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-28 -left-28 w-96 h-96 bg-indigo-600/35 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-teal-500/25 rounded-full blur-[110px] pointer-events-none animate-pulse-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-lg glass-card glass-glow-card rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300">
        
        {/* Header / Logo */}
        <LogoTitle role={selectedRole} />

        {/* 1-Click Instant Demo Launch Bar */}
        <div className="mt-4 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1 text-indigo-300">
              <Sparkles className="w-3 h-3" /> 1-Click Instant Demo Role Access
            </span>
            <span>Jump to View</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'admin', label: 'Admin', color: 'hover:bg-rose-500/20 text-rose-300' },
              { id: 'accountant', label: 'Bursar', color: 'hover:bg-amber-500/20 text-amber-300' },
              { id: 'teacher', label: 'Teacher', color: 'hover:bg-emerald-500/20 text-emerald-300' },
              { id: 'student', label: 'Student', color: 'hover:bg-cyan-500/20 text-cyan-300' },
              { id: 'librarian', label: 'Library', color: 'hover:bg-pink-500/20 text-pink-300' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleQuickLaunch(d.id)}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border border-white/5 bg-slate-900/60 ${d.color} transition-all truncate`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in backdrop-blur-md">
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Role Selector with 5 roles */}
          <Role
            selectedRole={selectedRole}
            onSelectRole={handleRoleSelect}
          />

          {/* Email Address */}
          <Email
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            role={selectedRole}
          />

          {/* Password with Eye Toggle */}
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign In Button */}
          <SignIn
            role={selectedRole}
            isLoading={isLoading}
          />

          {/* Footer: Remember Me, Forgot Password & Request Account */}
          <DontHaveAccount role={selectedRole} />
        </form>

        {/* Security / Institutional Footer Watermark */}
        <div className="mt-5 pt-3 border-t border-white/5 text-center">
          <p className="text-[11px] text-slate-500 tracking-wider">
            🔒 256-BIT SSL ENCRYPTED • OFFICIAL ACADEMIC CLOUD ERP
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
