import React, { useState, useEffect } from 'react';
import { 
  Calendar, Printer, CheckCircle2, FileText, X, Check 
} from 'lucide-react';
import { api } from '../../services/api';
import { weeklyTimetable, initialGradebook } from '../../data/mockData';

const AcademicsModule = ({ activeSubTab }) => {
  const [activeTab, setActiveTab] = useState(() => activeSubTab === 'academics-gradebook' ? 'gradebook' : 'timetable');
  const [prevSubTab, setPrevSubTab] = useState(activeSubTab);
  if (prevSubTab !== activeSubTab) {
    setPrevSubTab(activeSubTab);
    if (activeSubTab === 'academics-gradebook') {
      setActiveTab('gradebook');
    } else if (activeSubTab === 'academics') {
      setActiveTab('timetable');
    }
  }

  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [timetable, setTimetable] = useState(weeklyTimetable);
  const [gradebook, setGradebook] = useState(initialGradebook);

  // Modals & Popups
  const [selectedReportStudent, setSelectedReportStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tt, gb] = await Promise.all([
          api.academics.getTimetable(),
          api.academics.getGradebook(selectedClass)
        ]);
        if (tt) setTimetable(tt);
        if (gb) setGradebook(gb);
      } catch (err) {
        console.warn('Fallback to local academics data', err);
      }
    };
    loadData();
  }, [selectedClass]);

  // Helper for computing student total, average, and automatic letter grade
  const calculateStudentStats = (stu) => {
    const scores = [stu.math, stu.physics, stu.chem, stu.english, stu.cs];
    const total = scores.reduce((acc, s) => acc + (Number(s) || 0), 0);
    const avg = Math.round((total / scores.length) * 10) / 10;

    let grade = 'F';
    if (avg >= 95) grade = 'A+';
    else if (avg >= 90) grade = 'A';
    else if (avg >= 80) grade = 'B+';
    else if (avg >= 70) grade = 'B';
    else if (avg >= 60) grade = 'C';
    else grade = 'F';

    return { total, avg, grade };
  };

  // Handle live mark editing
  const handleScoreChange = async (stuId, subject, value) => {
    const val = Math.min(100, Math.max(0, parseInt(value) || 0));
    setGradebook(prev => prev.map(s => {
      if (s.id === stuId) {
        return { ...s, [subject]: val };
      }
      return s;
    }));
    await api.academics.updateScore(stuId, subject, val);
    showToast(`Updated ${subject.toUpperCase()} score. Gradebook stats recomputed.`);
  };

  // Calculate Class-wide Summary Stats
  const classAverages = gradebook.map(s => calculateStudentStats(s).avg);
  const classMean = (classAverages.reduce((a, b) => a + b, 0) / classAverages.length).toFixed(1);
  const sortedAvgs = [...classAverages].sort((a, b) => a - b);
  const classMedian = (
    sortedAvgs.length % 2 === 0
      ? (sortedAvgs[sortedAvgs.length / 2 - 1] + sortedAvgs[sortedAvgs.length / 2]) / 2
      : sortedAvgs[Math.floor(sortedAvgs.length / 2)]
  ).toFixed(1);
  const highestScore = Math.max(...classAverages);

  // Period tag colors
  const tagColorMap = {
    indigo: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/25',
    emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/25',
    pink: 'bg-pink-500/15 border-pink-500/30 text-pink-200 hover:bg-pink-500/25',
    cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/25',
    amber: 'bg-amber-500/15 border-amber-500/30 text-amber-200 hover:bg-amber-500/25'
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs backdrop-blur-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Academics, Classes & Exam Engine
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Module 4
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive weekly timetable matrix, real-time batch gradebook, and official signed report card export.
          </p>
        </div>

        {/* Tab & Class Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="glass-input px-3.5 py-1.5 text-xs text-white rounded-xl focus:outline-none font-semibold"
          >
            <option value="Grade 10-A" className="bg-slate-900">Grade 10-A (Science & Honors)</option>
            <option value="Grade 9-B" className="bg-slate-900">Grade 9-B (General Cohort)</option>
            <option value="Grade 11-Sci" className="bg-slate-900">Grade 11-Sci (STEM Track)</option>
            <option value="Grade 12-Comm" className="bg-slate-900">Grade 12-Comm (Commerce Track)</option>
          </select>

          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'timetable'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Timetable
            </button>
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gradebook'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gradebook & Marks
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'timetable' ? (
        /* Weekly Timetable Matrix */
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">Weekly Master Timetable • {selectedClass}</h3>
                <p className="text-[11px] text-slate-400">Class Head: Prof. David Vance • Academic Term 2026-Q1</p>
              </div>
            </div>

            {/* Legend */}
            <div className="hidden lg:flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Science
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mathematics
              </span>
              <span className="flex items-center gap-1.5 text-pink-300">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Humanities
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Computer Sci
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> History & Arts
              </span>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-36">Time Slot</th>
                    <th className="py-3 px-4 font-semibold">Monday</th>
                    <th className="py-3 px-4 font-semibold">Tuesday</th>
                    <th className="py-3 px-4 font-semibold">Wednesday</th>
                    <th className="py-3 px-4 font-semibold">Thursday</th>
                    <th className="py-3 px-4 font-semibold">Friday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {timetable.map((slot, idx) => {
                    if (slot.isBreak) {
                      return (
                        <tr key={idx} className="bg-indigo-950/20 border-y border-white/10">
                          <td className="py-3 px-4 font-semibold text-slate-400 font-mono text-[11px]">
                            {slot.time}
                          </td>
                          <td colSpan="5" className="py-3 px-4 text-center text-xs text-indigo-300 font-medium">
                            ☕ {slot.title}
                          </td>
                        </tr>
                      );
                    }

                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-medium">
                          <p className="text-white font-bold">{slot.period}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{slot.time}</p>
                        </td>

                        {days.map((day) => {
                          const item = slot.days[day];
                          if (!item) return <td key={day} className="py-3.5 px-4 text-slate-600">-</td>;

                          return (
                            <td key={day} className="py-2.5 px-3">
                              <div className={`p-2.5 rounded-2xl border transition-all ${tagColorMap[item.tag] || tagColorMap.indigo}`}>
                                <p className="font-semibold text-white text-xs truncate">{item.subject}</p>
                                <div className="flex items-center justify-between text-[10px] text-slate-300 mt-1">
                                  <span>{item.teacher}</span>
                                  <span className="font-mono text-slate-400">{item.room}</span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Gradebook & Live Mark Entry Sheet */
        <div className="space-y-4">
          {/* Statistical KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-3xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Mean Average</span>
              <p className="text-2xl font-bold text-white mt-1">{classMean}%</p>
              <p className="text-[11px] text-emerald-400 mt-1">▲ +2.4% vs Previous Term</p>
            </div>

            <div className="glass-card p-4 rounded-3xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Median Cohort Score</span>
              <p className="text-2xl font-bold text-indigo-300 mt-1">{classMedian}%</p>
              <p className="text-[11px] text-slate-400 mt-1">Normal distribution bell curve</p>
            </div>

            <div className="glass-card p-4 rounded-3xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Term Score</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{highestScore}%</p>
              <p className="text-[11px] text-indigo-300 mt-1">Grade 10-A Valedictorian Track</p>
            </div>
          </div>

          {/* Interactive Batch Mark Entry Table */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Batch Assessment Mark Entry Sheet</h3>
                <p className="text-xs text-slate-400">Edit cells directly to recalculate weighted totals and letter grades in real-time.</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Auto-Saved
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-3 font-semibold text-center">Math (100)</th>
                    <th className="py-3 px-3 font-semibold text-center">Physics (100)</th>
                    <th className="py-3 px-3 font-semibold text-center">Chem (100)</th>
                    <th className="py-3 px-3 font-semibold text-center">English (100)</th>
                    <th className="py-3 px-3 font-semibold text-center">Comp Sci (100)</th>
                    <th className="py-3 px-4 font-semibold text-center">Average</th>
                    <th className="py-3 px-4 font-semibold text-center">Grade</th>
                    <th className="py-3 px-4 font-semibold text-right">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {gradebook.map((stu) => {
                    const stats = calculateStudentStats(stu);

                    return (
                      <tr key={stu.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>
                            <p>{stu.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">{stu.rollNo}</span>
                          </div>
                        </td>

                        {/* Interactive Edit Inputs */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stu.math}
                            onChange={(e) => handleScoreChange(stu.id, 'math', e.target.value)}
                            className="w-14 text-center py-1 text-xs text-white glass-input rounded-lg font-mono focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stu.physics}
                            onChange={(e) => handleScoreChange(stu.id, 'physics', e.target.value)}
                            className="w-14 text-center py-1 text-xs text-white glass-input rounded-lg font-mono focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stu.chem}
                            onChange={(e) => handleScoreChange(stu.id, 'chem', e.target.value)}
                            className="w-14 text-center py-1 text-xs text-white glass-input rounded-lg font-mono focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stu.english}
                            onChange={(e) => handleScoreChange(stu.id, 'english', e.target.value)}
                            className="w-14 text-center py-1 text-xs text-white glass-input rounded-lg font-mono focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stu.cs}
                            onChange={(e) => handleScoreChange(stu.id, 'cs', e.target.value)}
                            className="w-14 text-center py-1 text-xs text-white glass-input rounded-lg font-mono focus:outline-none"
                          />
                        </td>

                        {/* Computed Stats */}
                        <td className="py-3 px-4 text-center font-bold text-white">
                          {stats.avg}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            stats.grade === 'A+' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            stats.grade === 'A' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                            stats.grade === 'B+' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {stats.grade}
                          </span>
                        </td>

                        {/* Export Report Card */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedReportStudent({ ...stu, ...stats })}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-indigo-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Report Card</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Report Card Generator Modal */}
      {selectedReportStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl glass-modal p-6 sm:p-8 shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setSelectedReportStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 no-print"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Official Report Header */}
            <div className="text-center pb-4 border-b border-white/10">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                OFFICIAL ACADEMIC TRANSCRIPT • AUTUMN TERM 2026
              </div>
              <h2 className="text-xl font-bold text-white">EduPulse International Academy</h2>
              <p className="text-xs text-slate-400">Department of Examination & Academic Affairs</p>
            </div>

            {/* Student Metadata Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 my-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Candidate Name</span>
                <span className="text-white font-bold text-sm">{selectedReportStudent.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Roll & Section</span>
                <span className="text-white font-mono">{selectedReportStudent.rollNo} • {selectedClass}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall Term Score</span>
                <span className="text-emerald-400 font-bold">{selectedReportStudent.avg}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Honors Grade Assigned</span>
                <span className="text-indigo-300 font-bold text-sm">{selectedReportStudent.grade}</span>
              </div>
            </div>

            {/* Subject Marks Breakdown */}
            <div className="space-y-2 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Assessment Breakdown</p>
              <div className="space-y-1.5">
                {[
                  { name: 'Pure Mathematics', score: selectedReportStudent.math },
                  { name: 'Advanced Physics', score: selectedReportStudent.physics },
                  { name: 'Organic Chemistry', score: selectedReportStudent.chem },
                  { name: 'World Literature & English', score: selectedReportStudent.english },
                  { name: 'Computer Science & AI', score: selectedReportStudent.cs }
                ].map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <span className="text-slate-200">{sub.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sub.score}%` }} />
                      </div>
                      <span className="font-mono font-bold text-white w-8 text-right">{sub.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Principal Signature & Seal */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <p className="font-serif italic text-slate-300 text-sm">Dr. Eleanor Vance, Ph.D.</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Principal & Board Chancellor</p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg no-print transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicsModule;
