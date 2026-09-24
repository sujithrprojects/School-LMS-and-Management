import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, Search 
} from 'lucide-react';
import { api } from '../../services/api';
import { initialRbacMatrix, initialAuditLogs } from '../../data/mockData';

const AdminGovernanceModule = () => {
  const [rbacMatrix, setRbacMatrix] = useState(initialRbacMatrix);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [activeTab, setActiveTab] = useState('rbac'); // 'rbac' | 'audit'
  const [logFilter, setLogFilter] = useState('ALL');
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [matrix, logs] = await Promise.all([
          api.governance.getRbacMatrix(),
          api.governance.getAuditLogs()
        ]);
        if (matrix) setRbacMatrix(matrix);
        if (logs) setAuditLogs(logs);
      } catch (err) {
        console.warn('Fallback to local governance data', err);
      }
    };
    loadData();
  }, []);

  // Toggle permission level between 'Full Access', 'Read-Only', 'No Access'
  const handleTogglePermission = async (capability, roleKey) => {
    const cycle = {
      'Full Access': 'Read-Only',
      'Read-Only': 'No Access',
      'No Access': 'Full Access'
    };

    const row = rbacMatrix.find(r => r.capability === capability);
    if (row && row.id) {
      // Django model has super_admin instead of camelCase if converted
      const apiRoleKey = roleKey === 'superAdmin' ? 'super_admin' : roleKey;
      await api.governance.togglePermission(row.id, apiRoleKey);
    }

    setRbacMatrix(prev => prev.map(r => {
      if (r.capability === capability) {
        const nextVal = cycle[r[roleKey]] || 'Full Access';
        showToast(`RBAC Policy: Updated "${capability}" for role [${roleKey}] to ${nextVal}`);
        return { ...r, [roleKey]: nextVal };
      }
      return r;
    }));
  };

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSeverity = logFilter === 'ALL' || log.severity === logFilter;
    const matchesSearch = log.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                          log.userId.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                          log.module.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                          log.ipAddress.includes(searchLogQuery);
    return matchesSeverity && matchesSearch;
  });

  const getPermissionBadge = (val) => {
    switch (val) {
      case 'Full Access':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
      case 'Read-Only':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      case 'No Access':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-medium';
    }
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
            Admin & System Governance
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Module 5
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC) governance matrix and tamper-evident institutional audit trails.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rbac'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RBAC Control Matrix
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'rbac' ? (
        /* RBAC Matrix */
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">Dynamic Role Capability Matrix</h3>
                <p className="text-[11px] text-slate-400">Click any badge to toggle access permission in real-time.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Full Access</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Read-Only</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">No Access</span>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold w-56">Permission / Capability</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Super Admin</th>
                    <th className="py-3.5 px-3 font-semibold text-center">School Accountant</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Class Teacher</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Student / Parent</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Librarian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rbacMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {row.capability}
                      </td>

                      {/* Super Admin */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(row.capability, 'superAdmin')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all hover:scale-105 active:scale-95 ${getPermissionBadge(row.superAdmin)}`}
                        >
                          {row.superAdmin}
                        </button>
                      </td>

                      {/* Accountant */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(row.capability, 'accountant')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all hover:scale-105 active:scale-95 ${getPermissionBadge(row.accountant)}`}
                        >
                          {row.accountant}
                        </button>
                      </td>

                      {/* Teacher */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(row.capability, 'teacher')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all hover:scale-105 active:scale-95 ${getPermissionBadge(row.teacher)}`}
                        >
                          {row.teacher}
                        </button>
                      </td>

                      {/* Student */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(row.capability, 'student')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all hover:scale-105 active:scale-95 ${getPermissionBadge(row.student)}`}
                        >
                          {row.student}
                        </button>
                      </td>

                      {/* Librarian */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleTogglePermission(row.capability, 'librarian')}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition-all hover:scale-105 active:scale-95 ${getPermissionBadge(row.librarian)}`}
                        >
                          {row.librarian}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* System Audit Trail */
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter logs by user, action or IP..."
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs text-white glass-input rounded-xl focus:outline-none w-56 sm:w-64"
                />
              </div>

              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900">All Severities</option>
                <option value="INFO" className="bg-slate-900">INFO Only</option>
                <option value="WARNING" className="bg-slate-900">WARNING Only</option>
                <option value="CRITICAL" className="bg-slate-900">CRITICAL Only</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{filteredAuditLogs.length}</span> audit event traces
            </span>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">User ID</th>
                    <th className="py-3 px-4 font-semibold">Action Executed</th>
                    <th className="py-3 px-4 font-semibold">Module</th>
                    <th className="py-3 px-4 font-semibold">IP Origin</th>
                    <th className="py-3 px-4 font-semibold text-right">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAuditLogs.map((log) => {
                    const sevColors = {
                      INFO: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                      WARNING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      CRITICAL: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
                    };

                    return (
                      <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-4 font-medium text-white">
                          <span className="truncate max-w-[150px] inline-block">{log.userId}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-medium max-w-xs">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-indigo-300 font-semibold">{log.module}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{log.ipAddress}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sevColors[log.severity]}`}>
                            {log.severity}
                          </span>
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
    </div>
  );
};

export default AdminGovernanceModule;
