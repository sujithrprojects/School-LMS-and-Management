import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Sparkles, Search, Grid, List 
} from 'lucide-react';
import { api } from '../../services/api';
import { initialFacultyRoster, initialSubstitutions } from '../../data/mockData';

const FacultyModule = () => {
  const [facultyList, setFacultyList] = useState(initialFacultyRoster);
  const [substitutions, setSubstitutions] = useState(initialSubstitutions);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [roster, subs] = await Promise.all([
          api.faculty.getRoster(),
          api.faculty.getSubstitutions()
        ]);
        if (roster) setFacultyList(roster);
        if (subs) setSubstitutions(subs);
      } catch (err) {
        console.warn('Fallback to local faculty data', err);
      }
    };
    loadData();
  }, []);

  // Filter faculty
  const filteredFaculty = facultyList.filter(fac => {
    const matchesDept = selectedDept === 'ALL' || fac.department === selectedDept;
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.classTeacherOf.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Assign Substitute with 1-click
  const handleAssignSubstitute = async (subId, teacherName) => {
    await api.faculty.assignSubstitute(subId, teacherName);
    setSubstitutions(prev => prev.map(s => {
      if (s.id === subId) {
        showToast(`Smart Allocation: ${teacherName} assigned to cover ${s.grade} (${s.subject}) during ${s.period}`);
        return {
          ...s,
          status: 'ASSIGNED',
          assignedSubstitute: teacherName
        };
      }
      return s;
    }));
  };

  // Quick mark present/absent toggle for faculty
  const handleToggleAttendance = async (facultyId) => {
    await api.faculty.toggleAttendance(facultyId);
    setFacultyList(prev => prev.map(f => {
      if (f.id === facultyId) {
        const newStatus = f.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
        showToast(`Marked ${f.name} as ${newStatus}`);
        return { ...f, status: newStatus };
      }
      return f;
    }));
  };

  const departments = ['ALL', 'Science & Physics', 'Mathematics', 'Humanities & History', 'Computer Science', 'Languages & Literature'];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs backdrop-blur-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Faculty & Staff Management
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Module 3
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Teacher roster, lecture workload quotas, and AI-powered Dynamic Substitution Engine.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Substitution Engine Panel (Real-time highlighted absent teachers & smart suggestions) */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Dynamic Substitution Engine
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {substitutions.filter(s => s.status === 'NEEDS_SUBSTITUTE').length} Needs Cover Today
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Real-time timetable clash detection with 1-click faculty substitution.</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Session: Autumn Term 2026</span>
        </div>

        {/* Substitution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {substitutions.map((sub) => (
            <div 
              key={sub.id} 
              className={`p-4 rounded-2xl border transition-all ${
                sub.status === 'NEEDS_SUBSTITUTE'
                  ? 'bg-amber-500/10 border-amber-500/30 shadow-lg'
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.grade}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs font-semibold text-indigo-300">{sub.subject}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{sub.period}</p>
                  <p className="text-[11px] text-rose-400 font-medium mt-1">
                    Absent Faculty: {sub.absentTeacher}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  sub.status === 'NEEDS_SUBSTITUTE' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {sub.status === 'NEEDS_SUBSTITUTE' ? 'Needs Cover' : `Covered by ${sub.assignedSubstitute}`}
                </span>
              </div>

              {/* Smart Suggestion Panel */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Smart Matching Suggestions:</span>
                </p>

                <div className="space-y-1.5">
                  {sub.suggestedSubstitutes.map((cand, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-white/5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{cand.name}</span>
                        <span className="text-[10px] text-slate-400 block">{cand.dept} (Free in this slot)</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {cand.matchScore}% Match
                        </span>

                        {sub.status === 'NEEDS_SUBSTITUTE' && (
                          <button
                            onClick={() => handleAssignSubstitute(sub.id, cand.name)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-sm transition-all"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search faculty name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs text-white glass-input rounded-xl focus:outline-none w-56 sm:w-64"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept} className="bg-slate-900">
                {dept === 'ALL' ? 'All Academic Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredFaculty.length}</span> Faculty Members
        </div>
      </div>

      {/* Teacher Roster Display (Grid / Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((fac) => {
            const workloadPct = Math.round((fac.weeklyHours / fac.maxHours) * 100);

            return (
              <div
                key={fac.id}
                className="glass-card p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all shadow-xl group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={fac.avatar}
                      alt={fac.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {fac.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{fac.department}</p>
                      <span className="text-[10px] text-indigo-300 font-medium">{fac.subject}</span>
                    </div>
                  </div>

                  {/* Attendance Pill */}
                  <button
                    onClick={() => handleToggleAttendance(fac.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                      fac.status === 'PRESENT'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                    }`}
                    title="Click to toggle status"
                  >
                    {fac.status}
                  </button>
                </div>

                {/* Class Teacher Responsibility */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Class Responsibility:</span>
                  <span className="font-semibold text-white">{fac.classTeacherOf}</span>
                </div>

                {/* Lecture Hours Workload Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Weekly Lecture Load:</span>
                    <span className="text-white font-semibold">{fac.weeklyHours} / {fac.maxHours} hrs</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        workloadPct > 85 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${workloadPct}%` }}
                    />
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px] font-mono">{fac.email}</span>
                  <span className="font-mono">{fac.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Faculty Member</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Subject Focus</th>
                  <th className="py-3 px-4 font-semibold">Assigned Class</th>
                  <th className="py-3 px-4 font-semibold">Weekly Load</th>
                  <th className="py-3 px-4 font-semibold text-right">Daily Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFaculty.map((fac) => (
                  <tr key={fac.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2.5">
                      <img src={fac.avatar} alt={fac.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <p>{fac.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{fac.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{fac.department}</td>
                    <td className="py-3.5 px-4 text-indigo-300 font-medium">{fac.subject}</td>
                    <td className="py-3.5 px-4 text-white">{fac.classTeacherOf}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{fac.weeklyHours} / {fac.maxHours} hrs</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleAttendance(fac.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          fac.status === 'PRESENT'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {fac.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyModule;
