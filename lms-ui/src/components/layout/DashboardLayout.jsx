import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { 
  Search, ShieldAlert, Bell, X, CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { initialFeeRecords, initialApplicants, initialFacultyRoster, initialLibraryCatalog } from '../../data/mockData';

const DashboardLayout = ({ 
  children, 
  currentRole, 
  onRoleChange, 
  onLogout, 
  activeTab, 
  onSelectTab 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState('WEATHER');
  const [toastMessage, setToastMessage] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Fee Payment Received', desc: '$3,200 deposited via Campus SSO for Aiden Alexander.', time: '10m ago', unread: true },
    { id: 2, title: 'Faculty Substitution Needed', desc: 'Marcus Rivera marked absent for Period 3 (Grade 9-B).', time: '35m ago', unread: true },
    { id: 3, title: 'Term Report Cards Ready', desc: 'Autumn 2026 Grade 10-A batch assessments compiled.', time: '1h ago', unread: true }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick Global Search Filter
  const searchResults = searchQuery.trim() === '' ? [] : [
    ...initialFeeRecords
      .filter(f => f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(f => ({ type: 'Fee Invoice', title: `${f.studentName} (${f.id})`, subtitle: `Status: ${f.status} • Total: $${f.totalFee}`, tab: 'accounts' })),
    ...initialApplicants
      .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.guardian.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(a => ({ type: 'Applicant', title: a.name, subtitle: `${a.grade} • Stage: ${a.stage}`, tab: 'admissions' })),
    ...initialFacultyRoster
      .filter(fac => fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || fac.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(fac => ({ type: 'Faculty', title: fac.name, subtitle: `${fac.department} • ${fac.subject}`, tab: 'faculty' })),
    ...initialLibraryCatalog
      .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(b => ({ type: 'Library Book', title: b.title, subtitle: `By ${b.author} • ${b.category}`, tab: 'library' }))
  ];

  const handleTriggerEmergencyBroadcast = (e) => {
    e.preventDefault();
    setIsEmergencyOpen(false);
    showToast(`🚨 HIGH PRIORITY: ${emergencyType} Emergency Broadcast dispatched to all faculty, campus security & parents.`);
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow z-0" />
      <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow-reverse z-0" />
      <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        onLogout={onLogout}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={notifications.filter(n => n.unread).length}
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setMobileSidebarOpen(!mobileSidebarOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Body Shell: Sidebar + Main Content */}
      <div className="relative z-10 flex flex-1">
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-indigo-600/90 border border-indigo-400/50 text-white text-xs backdrop-blur-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Search Modal (Command Palette) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl glass-modal p-4 shadow-2xl border border-white/20">
            <div className="relative flex items-center border-b border-white/10 pb-3">
              <Search className="w-5 h-5 text-indigo-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search across students, fee invoices, faculty, library books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Type to instantly search ERP records...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching records found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectTab(res.tab);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase block">{res.type}</span>
                      <p className="text-white font-semibold">{res.title}</p>
                      <p className="text-[11px] text-slate-400">{res.subtitle}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Broadcast Trigger Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-modal p-6 shadow-2xl border border-rose-500/40">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-4 h-4 animate-ping" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Campus Emergency Broadcast</h3>
                  <p className="text-xs text-rose-300">High-priority institutional alert dispatcher</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmergencyOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTriggerEmergencyBroadcast} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Incident Classification
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white focus:outline-none"
                >
                  <option value="INCLEMENT WEATHER" className="bg-slate-900">Severe Weather / Campus Closure</option>
                  <option value="SECURITY LOCKDOWN" className="bg-slate-900">Security Precaution / Campus Lockdown</option>
                  <option value="MEDICAL ADVISORY" className="bg-slate-900">Medical Center Urgent Advisory</option>
                  <option value="ALL-CLEAR BROADCAST" className="bg-slate-900">All-Clear / Resume Regular Operations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Alert Message Body
                </label>
                <textarea
                  rows="3"
                  defaultValue="Urgent campus advisory in effect. Please follow building warden protocols immediately."
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEmergencyOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
                >
                  Transmit Instant Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm h-full bg-[#0f172a]/95 border-l border-white/10 p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">System Notification Center</h3>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setNotifications(notifications.map(n => ({ ...n, unread: false })));
                setIsNotificationsOpen(false);
                showToast('All notifications marked as read.');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Mark All as Read & Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
