import React, { useState, useEffect } from 'react';
import { 
  UserCheck, UserPlus, Search, ArrowRight, ArrowLeft, 
  CheckCircle2, ShieldAlert, X 
} from 'lucide-react';
import { api } from '../../services/api';
import { initialApplicants, studentDetailedProfile } from '../../data/mockData';

const AdmissionsModule = () => {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  // Modals
  const [isAddApplicantOpen, setIsAddApplicantOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(studentDetailedProfile);
  const [activeProfileTab, setActiveProfileTab] = useState('personal');
  const [toastMessage, setToastMessage] = useState(null);

  // New Applicant Form
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    grade: 'Grade 9',
    score: '92/100',
    guardian: '',
    phone: '',
    notes: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [apps, profile] = await Promise.all([
          api.admissions.getApplicants(),
          api.admissions.getStudentProfile()
        ]);
        if (apps) setApplicants(apps);
        if (profile) setSelectedStudentProfile(profile);
      } catch (err) {
        console.warn('Fallback to local admissions data', err);
      }
    };
    loadData();
  }, []);

  const stages = [
    { id: 'submitted', title: 'Application Submitted', color: 'border-slate-500/40 bg-slate-500/10 text-slate-300' },
    { id: 'exam_scheduled', title: 'Entrance Exam Scheduled', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
    { id: 'interview', title: 'Interview Round', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
    { id: 'verification', title: 'Document Verification', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
    { id: 'enrolled', title: 'Fees Paid & Enrolled', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' }
  ];

  const stageKeys = stages.map(s => s.id);

  // Move applicant to next or previous stage
  const handleMoveStage = async (applicantId, direction) => {
    const app = applicants.find(a => a.id === applicantId);
    if (!app) return;

    const currentIndex = stageKeys.indexOf(app.stage);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stageKeys.length) {
      const nextStage = stageKeys[newIndex];
      const nextStageObj = stages.find(s => s.id === nextStage);

      // Call API
      await api.admissions.updateStage(applicantId, nextStage);

      setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, stage: nextStage } : a));
      showToast(`Moved ${app.name} to "${nextStageObj.title}"`);
    }
  };

  // Add new applicant
  const handleAddApplicantSubmit = async (e) => {
    e.preventDefault();
    if (!newApplicant.name || !newApplicant.guardian) return;

    const res = await api.admissions.createApplicant(newApplicant);

    const created = res ? {
      id: res.id,
      name: res.name,
      grade: res.grade,
      score: res.score,
      appliedDate: res.applied_date,
      stage: res.stage,
      guardian: res.guardian,
      phone: res.phone,
      notes: res.notes
    } : {
      id: `APP-${Math.floor(100 + Math.random() * 900)}`,
      name: newApplicant.name,
      grade: newApplicant.grade,
      score: newApplicant.score,
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'submitted',
      guardian: newApplicant.guardian,
      phone: newApplicant.phone || '+1 (555) 000-0000',
      notes: newApplicant.notes || 'Direct registration'
    };

    setApplicants([created, ...applicants]);
    setIsAddApplicantOpen(false);
    setNewApplicant({
      name: '',
      grade: 'Grade 9',
      score: '92/100',
      guardian: '',
      phone: '',
      notes: ''
    });
    showToast(`Applicant ${created.name} registered and placed into Application Submitted queue.`);
  };

  // Filter applicants
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.guardian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'ALL' || app.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

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
            Admissions & Student Registration
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Module 2
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Stage Visual Kanban Admission Pipeline and 360-degree Student Profile records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedStudentProfile(studentDetailedProfile);
              setIsProfileModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Sample Student 360 Profile</span>
          </button>

          <button
            onClick={() => setIsAddApplicantOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Applicant</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate or guardian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs text-white glass-input rounded-xl focus:outline-none w-56 sm:w-64"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
          >
            <option value="ALL" className="bg-slate-900">All Target Grades</option>
            <option value="Grade 9" className="bg-slate-900">Grade 9</option>
            <option value="Grade 10" className="bg-slate-900">Grade 10</option>
            <option value="Grade 11-Sci" className="bg-slate-900">Grade 11-Sci</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Total Pipeline: <span className="text-white font-bold">{applicants.length} candidates</span>
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {applicants.filter(a => a.stage === 'enrolled').length} Fully Enrolled
          </span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start overflow-x-auto pb-4">
        {stages.map((stage, idx) => {
          const stageApplicants = filteredApplicants.filter(a => a.stage === stage.id);

          return (
            <div 
              key={stage.id} 
              className="glass-card rounded-3xl p-3.5 border border-white/10 flex flex-col gap-3 min-w-[240px] bg-slate-900/50 backdrop-blur-xl"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate max-w-[140px]">{stage.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stage.color}`}>
                  {stageApplicants.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 min-h-[350px]">
                {stageApplicants.length === 0 ? (
                  <div className="h-40 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-[11px] text-slate-500">
                    No candidates here
                  </div>
                ) : (
                  stageApplicants.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-2xl bg-slate-800/70 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-800/90 transition-all shadow-md group relative"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {app.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">{app.id}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
                          {app.grade}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Score:</span>
                          <span className="font-semibold text-emerald-400">{app.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Guardian:</span>
                          <span className="truncate max-w-[110px]">{app.guardian}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-white/5 truncate">
                          "{app.notes}"
                        </p>
                      </div>

                      {/* Stage Action Controls */}
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => handleMoveStage(app.id, 'prev')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Previous Stage"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudentProfile({
                              ...studentDetailedProfile,
                              name: app.name,
                              section: `${app.grade} (Applicant Intake)`
                            });
                            setIsProfileModalOpen(true);
                          }}
                          className="text-[10px] text-cyan-400 hover:underline font-semibold"
                        >
                          View 360
                        </button>

                        <button
                          onClick={() => handleMoveStage(app.id, 'next')}
                          disabled={idx === stages.length - 1}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Next Stage"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Applicant Registration Modal */}
      {isAddApplicantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-modal p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Enroll New Applicant</h3>
                <p className="text-xs text-slate-400">Creates applicant profile and queues into Admission Pipeline.</p>
              </div>
              <button
                onClick={() => setIsAddApplicantOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddApplicantSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newApplicant.name}
                  onChange={(e) => setNewApplicant({ ...newApplicant, name: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Target Grade
                  </label>
                  <select
                    value={newApplicant.grade}
                    onChange={(e) => setNewApplicant({ ...newApplicant, grade: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Grade 9" className="bg-slate-900">Grade 9</option>
                    <option value="Grade 10" className="bg-slate-900">Grade 10</option>
                    <option value="Grade 11-Sci" className="bg-slate-900">Grade 11-Sci</option>
                    <option value="Grade 12-Comm" className="bg-slate-900">Grade 12-Comm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Entrance Score
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 95/100"
                    value={newApplicant.score}
                    onChange={(e) => setNewApplicant({ ...newApplicant, score: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Lin"
                  value={newApplicant.guardian}
                  onChange={(e) => setNewApplicant({ ...newApplicant, guardian: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newApplicant.phone}
                  onChange={(e) => setNewApplicant({ ...newApplicant, phone: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Academic Notes / Remarks
                </label>
                <textarea
                  rows="2"
                  placeholder="Special achievements, Olympiad prizes, or scholarship eligibility..."
                  value={newApplicant.notes}
                  onChange={(e) => setNewApplicant({ ...newApplicant, notes: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddApplicantOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student 360 Full Profile Modal (With 5 Tabs from plan.txt) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl glass-modal p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            {/* Header Summary Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudentProfile.avatar}
                  alt={selectedStudentProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedStudentProfile.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                      {selectedStudentProfile.rollNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{selectedStudentProfile.section}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Blood Group: <span className="text-rose-400 font-semibold">{selectedStudentProfile.bloodGroup}</span> • Guardian: {selectedStudentProfile.guardian.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Emergency Alert Dispatched: Guardian (${selectedStudentProfile.guardian.phone}) & Nurse Notified.`)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency Trigger</span>
                </button>

                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5-Tab Interface Selector */}
            <div className="flex items-center gap-1.5 border-b border-white/10 mt-4 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'personal', label: 'Tab 1: Personal & Guardian' },
                { id: 'academic', label: 'Tab 2: Academic History' },
                { id: 'attendance', label: 'Tab 3: Attendance & Leaves' },
                { id: 'fees', label: 'Tab 4: Fee Ledger' },
                { id: 'library', label: 'Tab 5: Library & Assets' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeProfileTab === tab.id
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-4 text-xs">
              {/* Tab 1: Personal & Guardian */}
              {activeProfileTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Guardian</p>
                      <p className="text-sm font-semibold text-white">{selectedStudentProfile.guardian.name}</p>
                      <p className="text-slate-300">Relation: {selectedStudentProfile.guardian.relation}</p>
                      <p className="text-indigo-300 font-mono">{selectedStudentProfile.guardian.phone}</p>
                      <p className="text-slate-400">{selectedStudentProfile.guardian.occupation}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency & Medical Information</p>
                      <p className="text-sm font-semibold text-white">{selectedStudentProfile.emergencyContact.name}</p>
                      <p className="text-rose-400 font-mono">{selectedStudentProfile.emergencyContact.phone}</p>
                      <p className="text-slate-300 pt-1 border-t border-white/5 text-[11px]">
                        Medical Note: {selectedStudentProfile.medicalNotes}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residential Address</p>
                    <p className="text-white mt-1">{selectedStudentProfile.address}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Academic History */}
              {activeProfileTab === 'academic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedStudentProfile.academicHistory.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                        <span className="text-[10px] font-semibold text-indigo-300 uppercase">{item.term}</span>
                        <p className="text-lg font-bold text-white mt-1">GPA {item.gpa}</p>
                        <p className="text-slate-400 text-[11px]">{item.rank} • {item.status}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                    <h4 className="text-xs font-bold text-white mb-2">Current Term Coursework Scores</h4>
                    <div className="space-y-2">
                      {selectedStudentProfile.subjects.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                          <div>
                            <span className="font-semibold text-white">{sub.name}</span>
                            <span className="text-slate-400 text-[10px] block">{sub.teacher}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-400">{sub.score}%</span>
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]">{sub.grade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Attendance */}
              {activeProfileTab === 'attendance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Cumulative Attendance</p>
                      <p className="text-2xl font-bold text-emerald-400">{selectedStudentProfile.attendance.percentage}%</p>
                      <p className="text-slate-400 text-[11px]">{selectedStudentProfile.attendance.presentDays} of {selectedStudentProfile.attendance.totalDays} academic sessions attended</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm">
                      P97
                    </div>
                  </div>

                  {/* 30-Day Grid */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Last 30 Days Record Heatmap</p>
                    <div className="grid grid-cols-10 gap-1.5">
                      {selectedStudentProfile.attendance.recent30Days.map((status, idx) => (
                        <div
                          key={idx}
                          className={`h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            status === 'P' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                          title={`Day ${idx + 1}: ${status === 'P' ? 'Present' : 'Leave'}`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Fee Ledger */}
              {activeProfileTab === 'fees' && (
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-2">Student Ledger & Transaction History</h4>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 border-b border-white/10 uppercase">
                        <th className="py-2">Date</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedStudentProfile.feeLedger.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2 text-slate-400">{row.date}</td>
                          <td className="py-2 text-white font-medium">{row.desc}</td>
                          <td className="py-2 font-semibold text-emerald-400">${row.amount}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              row.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2 text-right font-mono text-indigo-300">{row.receipt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 5: Library & Assets */}
              {activeProfileTab === 'library' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Campus Asset Assignment</p>
                      <p className="text-sm font-semibold text-white">Smart Locker {selectedStudentProfile.libraryActivity.lockerNumber}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-xs font-mono">RFID #99214</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Active Library Borrowings</p>
                    <div className="space-y-2">
                      {selectedStudentProfile.libraryActivity.issuedBooks.map((b, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 flex items-center justify-between border border-white/5">
                          <div>
                            <p className="font-semibold text-white">{b.title}</p>
                            <p className="text-[10px] text-slate-400">ISBN: {b.isbn} • Issued: {b.issueDate}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'DUE_TODAY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            Due: {b.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsModule;
