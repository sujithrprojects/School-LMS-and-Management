import React from 'react';
import { 
  DollarSign, Users, UserCheck, Calendar, Shield, 
  ArrowUpRight, TrendingUp, Sparkles, CheckCircle2 
} from 'lucide-react';
import { initialApplicants, initialFacultyRoster, initialSubstitutions } from '../../data/mockData';

const ExecutiveOverview = ({ onNavigateModule }) => {
  const pendingSubstitutions = initialSubstitutions.filter(s => s.status === 'NEEDS_SUBSTITUTE').length;
  const enrolledStudents = initialApplicants.filter(a => a.stage === 'enrolled').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-950/70 via-slate-900/60 to-purple-950/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CAMPUS INTELLIGENCE COMMAND
              </span>
              <span className="text-slate-400 text-xs">• 100% Operational</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
              EduPulse Next-Gen Academic ERP
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              High-contrast dark glassmorphic administration console providing unified oversight across institutional finance, admissions, faculty workloads, academics, and governance.
            </p>
          </div>

          {/* Quick Module Jump Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateModule('accounts')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 transition-all"
            >
              Fee Balance: $1.04M
            </button>
            <button
              onClick={() => onNavigateModule('faculty')}
              className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-xs font-semibold text-amber-200 transition-all"
            >
              {pendingSubstitutions} Sub Alerts
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Module Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Module 1: Accounts */}
        <div 
          onClick={() => onNavigateModule('accounts')}
          className="glass-card p-4 rounded-3xl border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Module 1</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-white mt-2">$1.24M</p>
          <p className="text-[11px] text-slate-300 font-medium">Revenue Collected</p>
          <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> 87% Target Achieved
          </p>
        </div>

        {/* Module 2: Admissions */}
        <div 
          onClick={() => onNavigateModule('admissions')}
          className="glass-card p-4 rounded-3xl border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Module 2</span>
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <UserCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-white mt-2">6 Candidates</p>
          <p className="text-[11px] text-slate-300 font-medium">Active Pipeline</p>
          <p className="text-[10px] text-cyan-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {enrolledStudents} Enrolled • Kanban
          </p>
        </div>

        {/* Module 3: Faculty */}
        <div 
          onClick={() => onNavigateModule('faculty')}
          className="glass-card p-4 rounded-3xl border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Module 3</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-white mt-2">{initialFacultyRoster.length} Faculty</p>
          <p className="text-[11px] text-slate-300 font-medium">Active Roster</p>
          <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Smart Sub Engine
          </p>
        </div>

        {/* Module 4: Academics */}
        <div 
          onClick={() => onNavigateModule('academics')}
          className="glass-card p-4 rounded-3xl border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Module 4</span>
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-white mt-2">89.4% Avg</p>
          <p className="text-[11px] text-slate-300 font-medium">Class Gradebook</p>
          <p className="text-[10px] text-purple-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Real-Time Median
          </p>
        </div>

        {/* Module 5: Governance */}
        <div 
          onClick={() => onNavigateModule('governance')}
          className="glass-card p-4 rounded-3xl border border-white/10 hover:border-rose-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Module 5</span>
            <span className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Shield className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-lg font-bold text-white mt-2">5 Roles</p>
          <p className="text-[11px] text-slate-300 font-medium">RBAC Security</p>
          <p className="text-[10px] text-rose-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Audit Logs Active
          </p>
        </div>
      </div>

      {/* Two Columns: Recent System Operations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Architectural Highlights */}
        <div className="lg:col-span-2 glass-card p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold text-white">System Architecture & Core Capabilities</h2>
              <p className="text-xs text-slate-400">Integrated academic ERP workflows following Section 4 specifications.</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              WCAG AAA Glass
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div 
              onClick={() => onNavigateModule('accounts')}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all"
            >
              <span className="font-bold text-white block mb-1">Financial Reconciliation</span>
              <p className="text-slate-400 text-[11px]">
                Multi-filter fee collection grid, printable receipts with QR code authentication, and faculty payroll disbursements.
              </p>
            </div>

            <div 
              onClick={() => onNavigateModule('admissions')}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all"
            >
              <span className="font-bold text-white block mb-1">Kanban & Student 360</span>
              <p className="text-slate-400 text-[11px]">
                Interactive 5-column applicant pipeline with deep student profiles featuring transcripts, attendance heatmaps, and fee ledgers.
              </p>
            </div>

            <div 
              onClick={() => onNavigateModule('faculty')}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 cursor-pointer transition-all"
            >
              <span className="font-bold text-white block mb-1">Dynamic Substitution</span>
              <p className="text-slate-400 text-[11px]">
                Detects absent faculty in real-time, matching free teachers based on subject expertise and period availability with 1-click allocation.
              </p>
            </div>

            <div 
              onClick={() => onNavigateModule('academics')}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all"
            >
              <span className="font-bold text-white block mb-1">Timetable & Signed Report Cards</span>
              <p className="text-slate-400 text-[11px]">
                Period slot matrix (8:00 AM - 3:30 PM), interactive batch gradebook with auto-grade calculations, and printable official transcripts.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Role Switcher Quick Demo */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Role-Adaptive Contexts</h2>
            <p className="text-xs text-slate-400">Jump directly into any institutional view:</p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'admin', name: 'Super Admin Console', desc: 'Full System Oversight & RBAC', color: 'text-indigo-300' },
              { id: 'accountant', name: 'School Accountant', desc: 'Fee Invoices & Faculty Payroll', color: 'text-amber-300' },
              { id: 'teacher', name: 'Faculty & Class Teacher', desc: 'Marks Entry & Smart Substitution', color: 'text-emerald-300' },
              { id: 'student', name: 'Student & Parent Portal', desc: 'Grade Cards & Tuition Dues', color: 'text-cyan-300' },
              { id: 'librarian', name: 'Librarian Hub', desc: 'Circulation & Overdue Tracking', color: 'text-pink-300' }
            ].map((roleItem) => (
              <div
                key={roleItem.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className={`font-semibold ${roleItem.color}`}>{roleItem.name}</span>
                  <p className="text-[10px] text-slate-400">{roleItem.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
