import React, { useState, useEffect } from 'react';
import { 
  DollarSign, BookOpen, Clock, CheckCircle2, ArrowUpRight 
} from 'lucide-react';
import { api } from '../../services/api';
import { studentDetailedProfile } from '../../data/mockData';

const StudentPortalModule = ({ onNavigateTab }) => {
  const [student, setStudent] = useState(studentDetailedProfile);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.admissions.getStudentProfile();
        if (profile) setStudent(profile);
      } catch (err) {
        console.warn('Fallback to local student profile', err);
      }
    };
    loadProfile();
  }, []);

  const handlePayFee = async () => {
    await api.admissions.payStudentFee(student.id);
    showToast('Campus SSO payment gateway opened: $1,000 tuition fee installment processed.');
    setStudent(prev => ({
      ...prev,
      feeLedger: prev.feeLedger.map(f => f.status === 'DUE' ? { ...f, status: 'PAID', receipt: 'REC-SSO-9912' } : f)
    }));
  };

  const pendingFee = student.feeLedger.find(f => f.status === 'DUE');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs backdrop-blur-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Student Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-purple-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Welcome back, {student.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                  Roll: {student.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{student.section}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Academic Advisor: Prof. David Vance • Term: Autumn 2026 Honors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Attendance Rate</span>
              <p className="text-xl font-bold text-emerald-400">{student.attendance.percentage}%</p>
              <span className="text-[10px] text-slate-400">Regular Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Overview Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Outstanding Fee Alert */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tuition Fee Ledger</span>
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          {pendingFee ? (
            <div className="mt-3 space-y-2">
              <p className="text-2xl font-bold text-amber-400">${pendingFee.amount.toLocaleString()}</p>
              <p className="text-xs text-slate-300">Due by: {pendingFee.date}</p>
              <button
                onClick={handlePayFee}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs shadow-lg transition-all"
              >
                Pay via Campus SSO Wallet
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-2xl font-bold text-emerald-400">$0.00 Due</p>
              <p className="text-xs text-slate-300">All term installments fully cleared.</p>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> No Pending Balances
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Next Upcoming Class */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Lecture Today</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-base font-bold text-white">Advanced Physics (Period 4)</p>
            <p className="text-xs text-slate-300">11:50 AM – 12:40 PM • Lab 201</p>
            <p className="text-[11px] text-indigo-300">Instructor: Prof. David Vance</p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('academics')}
            className="mt-3 text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Full Weekly Timetable</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Library Borrowing Status */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Library Loans</span>
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-2xl font-bold text-white">
              {student.libraryActivity.issuedBooks.length} Books Active
            </p>
            <p className="text-xs text-amber-300">
              1 due today: "Introduction to Algorithms"
            </p>
            <p className="text-[11px] text-slate-400">
              Locker: {student.libraryActivity.lockerNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Term Performance Widget */}
      <div className="glass-card p-5 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white">Coursework Assessment Progress</h3>
            <p className="text-xs text-slate-400">Continuous evaluation marks for Autumn 2026.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Term GPA: 3.96
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {student.subjects.map((sub, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{sub.name}</p>
                  <p className="text-[10px] text-slate-400">{sub.teacher}</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs font-bold text-white">
                  {sub.grade}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Score</span>
                  <span className="text-emerald-400 font-bold">{sub.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sub.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPortalModule;
