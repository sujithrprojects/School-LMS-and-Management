import React from 'react';
import { 
  LayoutDashboard, DollarSign, UserCheck, Users, Calendar, 
  BookOpen, Shield, GraduationCap, ChevronLeft, ChevronRight,
  ClipboardList, Library, Clock, FileText, Sparkles
} from 'lucide-react';
import { ROLES } from '../../data/mockData';

const Sidebar = ({ 
  currentRole, 
  activeTab, 
  onSelectTab, 
  isCollapsed, 
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const roleConfig = {
    admin: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' },
      { id: 'accounts', label: 'Accounts & Fees', icon: DollarSign, badge: 'Module 1' },
      { id: 'admissions', label: 'Admissions & Reg', icon: UserCheck, badge: 'Module 2' },
      { id: 'faculty', label: 'Teachers & Staff', icon: Users, badge: 'Module 3' },
      { id: 'academics', label: 'Classes & Exams', icon: Calendar, badge: 'Module 4' },
      { id: 'library', label: 'Library Management', icon: Library, badge: 'Asset Hub' },
      { id: 'governance', label: 'Admin Governance', icon: Shield, badge: 'RBAC' }
    ],
    accountant: [
      { id: 'accounts', label: 'Financial Overview', icon: LayoutDashboard, badge: 'Live' },
      { id: 'accounts-fees', label: 'Fee Collections', icon: DollarSign, badge: 'Invoices' },
      { id: 'accounts-payroll', label: 'Faculty Payroll', icon: FileText, badge: 'Salaries' },
      { id: 'governance', label: 'Compliance & Audit', icon: Shield, badge: 'Audit' }
    ],
    teacher: [
      { id: 'academics', label: 'Timetable & Schedule', icon: Calendar, badge: 'Classes' },
      { id: 'academics-gradebook', label: 'Gradebook & Marks', icon: ClipboardList, badge: 'Grading' },
      { id: 'faculty', label: 'Faculty & Substitution', icon: Users, badge: 'Smart Sub' },
      { id: 'library', label: 'Research Library', icon: BookOpen }
    ],
    student: [
      { id: 'student-portal', label: 'Student Portal', icon: GraduationCap, badge: 'Home' },
      { id: 'academics', label: 'My Weekly Schedule', icon: Calendar },
      { id: 'academics-gradebook', label: 'My Report Card', icon: ClipboardList, badge: 'Honors' },
      { id: 'accounts', label: 'Fee Dues & Receipts', icon: DollarSign, badge: 'Due $1k' },
      { id: 'library', label: 'Library Borrowings', icon: BookOpen }
    ],
    librarian: [
      { id: 'library', label: 'Catalog & Inventory', icon: Library, badge: 'Catalog' },
      { id: 'library-loans', label: 'Issue & Returns', icon: BookOpen, badge: 'Circulation' },
      { id: 'library-overdue', label: 'Overdue Tracker', icon: Clock, badge: 'Fines' }
    ]
  };

  const navItems = roleConfig[currentRole] || roleConfig.admin;
  const activeUser = ROLES[currentRole] || ROLES.admin;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-14 z-40 h-[calc(100vh-3.5rem)] border-r border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation List */}
        <div className="p-3 space-y-6 overflow-y-auto flex-1">
          {/* Active Context Banner */}
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-slate-800/40 to-purple-900/30 border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Contextual Role</p>
                  <p className="text-xs font-semibold text-white truncate">{activeUser.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Section */}
          <div className="space-y-1">
            <div className={`px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>
              {isCollapsed ? 'NAV' : 'System Modules'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isExactMatch = activeTab === item.id;
              const hasExactItemInNav = navItems.some(n => n.id === activeTab);
              const isPrefixFallback = !hasExactItemInNav && activeTab.startsWith(item.id + '-');
              const isActive = isExactMatch || isPrefixFallback;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center rounded-xl p-2.5 transition-all text-xs font-medium group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-300'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex-shrink-0 ${
                      isActive 
                        ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40' 
                        : 'bg-white/5 text-slate-400 border border-white/5'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Collapse Toggle & System Status */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ERP Online
              </span>
              <span className="text-slate-500 font-mono">100% SLA</span>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-medium">Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
