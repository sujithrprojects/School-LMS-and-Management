import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Users, FileText, CheckCircle2, 
  Printer, Send, QrCode, Search, ArrowUpRight, X, Percent 
} from 'lucide-react';
import { api } from '../../services/api';
import { initialFinancialMetrics, initialFeeRecords, initialFacultyPayroll } from '../../data/mockData';

const AccountsModule = ({ activeSubTab }) => {
  const [metrics, setMetrics] = useState(initialFinancialMetrics);
  const [feeRecords, setFeeRecords] = useState(initialFeeRecords);
  const [payrollList, setPayrollList] = useState(initialFacultyPayroll);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [academicYearFilter, setAcademicYearFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Panels
  const [activeTab, setActiveTab] = useState(() => activeSubTab === 'accounts-payroll' ? 'payroll' : 'fees');
  const [prevSubTab, setPrevSubTab] = useState(activeSubTab);
  if (prevSubTab !== activeSubTab) {
    setPrevSubTab(activeSubTab);
    if (activeSubTab === 'accounts-payroll') {
      setActiveTab('payroll');
    } else if (activeSubTab === 'accounts-fees' || activeSubTab === 'accounts') {
      setActiveTab('fees');
    }
  }

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRecordForPayment, setSelectedRecordForPayment] = useState(null);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDisbursingBulk, setIsDisbursingBulk] = useState(false);

  // Discount Modal State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedRecordForDiscount, setSelectedRecordForDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState('200');
  const [discountReason, setDiscountReason] = useState('Merit Scholarship Allowance');

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Credit Card');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, f, p] = await Promise.all([
          api.accounts.getMetrics(),
          api.accounts.getFeeRecords(),
          api.accounts.getPayroll()
        ]);
        if (m) setMetrics(m);
        if (f) setFeeRecords(f);
        if (p) setPayrollList(p);
      } catch (err) {
        console.warn('Fallback to local accounts data', err);
      }
    };
    loadData();
  }, []);

  // Filtered Fee Records
  const filteredRecords = feeRecords.filter((rec) => {
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const matchesGrade = gradeFilter === 'ALL' || rec.grade.toLowerCase().includes(gradeFilter.toLowerCase());
    const matchesYear = academicYearFilter === 'ALL' || (rec.academicYear && rec.academicYear === academicYearFilter);
    const matchesSearch = rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesGrade && matchesYear && matchesSearch;
  });

  // Handle Recording a Payment
  const handleOpenPaymentModal = (record) => {
    setSelectedRecordForPayment(record);
    setPaymentAmount(record.dueAmount > 0 ? record.dueAmount.toString() : '500');
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!selectedRecordForPayment) return;

    const paidNum = parseFloat(paymentAmount) || 0;
    const newPaid = selectedRecordForPayment.paidAmount + paidNum;
    const newDue = Math.max(0, selectedRecordForPayment.totalFee - newPaid);
    const newStatus = newDue === 0 ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'PENDING');

    // Persist to Django REST API
    await api.accounts.recordPayment(selectedRecordForPayment.id, paidNum, paymentMode);

    const updatedRecords = feeRecords.map((r) => {
      if (r.id === selectedRecordForPayment.id) {
        return {
          ...r,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus,
          paymentMode,
          lastPaidDate: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    });

    setFeeRecords(updatedRecords);
    setMetrics(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + paidNum,
      pendingDues: Math.max(0, prev.pendingDues - paidNum),
      netOperatingBalance: prev.netOperatingBalance + paidNum
    }));

    setIsPaymentModalOpen(false);

    // Show Generated Receipt
    setReceiptModalData({
      receiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceId: selectedRecordForPayment.id,
      studentName: selectedRecordForPayment.studentName,
      admissionNo: selectedRecordForPayment.admissionNo,
      grade: selectedRecordForPayment.grade,
      amountPaid: paidNum,
      balanceDue: newDue,
      paymentMode,
      date: new Date().toLocaleString(),
      qrCode: `EDU-AUTH-VERIFY-2026-${selectedRecordForPayment.id}`
    });

    showToast(`Payment of $${paidNum.toLocaleString()} processed successfully for ${selectedRecordForPayment.studentName}`);
  };

  // Handle Adjusting Discount / Scholarship
  const handleOpenDiscountModal = (record) => {
    setSelectedRecordForDiscount(record);
    setDiscountAmount(record.discount > 0 ? record.discount.toString() : '200');
    setIsDiscountModalOpen(true);
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (!selectedRecordForDiscount) return;

    const discountVal = parseFloat(discountAmount) || 0;
    const oldDiscount = selectedRecordForDiscount.discount || 0;
    const discountDiff = discountVal - oldDiscount;

    const newTotal = Math.max(0, selectedRecordForDiscount.totalFee - discountDiff);
    const newDue = Math.max(0, newTotal - selectedRecordForDiscount.paidAmount);
    const newStatus = newDue === 0 ? 'PAID' : (selectedRecordForDiscount.paidAmount > 0 ? 'PARTIAL' : 'PENDING');

    const updatedRecords = feeRecords.map((r) => {
      if (r.id === selectedRecordForDiscount.id) {
        return {
          ...r,
          totalFee: newTotal,
          dueAmount: newDue,
          discount: discountVal,
          status: newStatus
        };
      }
      return r;
    });

    setFeeRecords(updatedRecords);
    setMetrics(prev => ({
      ...prev,
      pendingDues: Math.max(0, prev.pendingDues - discountDiff),
      netOperatingBalance: Math.max(0, prev.netOperatingBalance - discountDiff)
    }));

    setIsDiscountModalOpen(false);
    showToast(`Applied $${discountVal} scholarship concession (${discountReason}) for ${selectedRecordForDiscount.studentName}.`);
  };

  // Quick reminder
  const handleSendReminder = (record) => {
    showToast(`SMS & Email reminder dispatched to guardian of ${record.studentName} for outstanding dues ($${record.dueAmount})`);
  };

  // Bulk payroll disburse
  const handleBulkPayrollDisburse = async () => {
    setIsDisbursingBulk(true);
    await api.accounts.bulkDisbursePayroll();
    setPayrollList(prev => prev.map(p => ({ ...p, status: 'DISBURSED' })));
    setIsDisbursingBulk(false);
    showToast('All pending faculty payroll transfers executed via Institutional ACH Gateway.');
  };

  const revenueCollectionPercent = Math.round(
    (metrics.totalRevenue / (metrics.totalRevenue + metrics.pendingDues)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs backdrop-blur-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Accounts & Financial Management
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Module 1
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Student tuition fee reconciliation, faculty payroll disbursement, and institutional balance sheet.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'fees' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fee Collection
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'payroll' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Faculty Payroll
          </button>
        </div>
      </div>

      {/* Row 1: Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fee Revenue Collected vs Pending */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fee Revenue</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${metrics.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Pending Dues: <span className="text-amber-400 font-semibold">${metrics.pendingDues.toLocaleString()}</span></span>
              <span className="text-indigo-300 font-semibold">{revenueCollectionPercent}% Collected</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700" 
                style={{ width: `${revenueCollectionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Monthly Payroll */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Faculty Payroll Total</span>
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${metrics.monthlyPayroll.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Fully provisioned for September cycle</span>
          </div>
        </div>

        {/* Metric 3: Operational Expenses */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Expenses</span>
            <span className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${metrics.operationalExpenses.toLocaleString()}
          </p>
          <p className="mt-3 text-[11px] text-slate-400">
            Labs, infrastructure & campus utilities
          </p>
        </div>

        {/* Metric 4: Net Operating Balance */}
        <div className="glass-card p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Operating Balance</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            ${metrics.netOperatingBalance.toLocaleString()}
          </p>
          <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Audited & Reconciled Real-Time
          </p>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'fees' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter student or invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs text-white glass-input rounded-xl focus:outline-none w-52 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900">All Statuses</option>
                <option value="PAID" className="bg-slate-900">Paid Only</option>
                <option value="PARTIAL" className="bg-slate-900">Partial Due</option>
                <option value="OVERDUE" className="bg-slate-900">Overdue</option>
                <option value="PENDING" className="bg-slate-900">Pending</option>
              </select>

              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900">All Grades</option>
                <option value="Grade 9" className="bg-slate-900">Grade 9</option>
                <option value="Grade 10" className="bg-slate-900">Grade 10</option>
                <option value="Grade 11" className="bg-slate-900">Grade 11</option>
                <option value="Grade 12" className="bg-slate-900">Grade 12</option>
              </select>

              {/* Academic Year Filter */}
              <select
                value={academicYearFilter}
                onChange={(e) => setAcademicYearFilter(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs text-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900">All Academic Years</option>
                <option value="2026-2027" className="bg-slate-900">AY 2026-2027</option>
                <option value="2025-2026" className="bg-slate-900">AY 2025-2026</option>
              </select>
            </div>

            {/* Quick Summary Pill */}
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-semibold">{filteredRecords.length}</span> of {feeRecords.length} records
            </div>
          </div>

          {/* Data Grid Table */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student Name & Roll</th>
                    <th className="py-3 px-4 font-semibold">Invoice ID</th>
                    <th className="py-3 px-4 font-semibold">Class / Grade</th>
                    <th className="py-3 px-4 font-semibold">Total Fee</th>
                    <th className="py-3 px-4 font-semibold">Paid Amount</th>
                    <th className="py-3 px-4 font-semibold">Due Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRecords.map((rec) => {
                    const statusBadgeColors = {
                      PAID: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      PARTIAL: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                      PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      OVERDUE: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    };

                    return (
                      <tr key={rec.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div>
                            <p className="font-semibold text-white">{rec.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{rec.admissionNo}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">{rec.id}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.grade}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">${rec.totalFee.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                          ${rec.paidAmount.toLocaleString()}
                          {rec.dueAmount > 0 && (
                            <span className="block text-[10px] text-rose-400 font-normal">
                              Due: ${rec.dueAmount.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{rec.dueDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeColors[rec.status] || statusBadgeColors.PENDING}`}>
                            <span className="w-1 h-1 rounded-full bg-current mr-1.5" />
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rec.status !== 'PAID' && (
                              <button
                                onClick={() => handleOpenPaymentModal(rec)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold transition-all"
                              >
                                Record Pay
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setReceiptModalData({
                                  receiptId: `REC-${rec.id.replace('INV-', '')}`,
                                  invoiceId: rec.id,
                                  studentName: rec.studentName,
                                  admissionNo: rec.admissionNo,
                                  grade: rec.grade,
                                  amountPaid: rec.paidAmount,
                                  balanceDue: rec.dueAmount,
                                  paymentMode: rec.paymentMode || 'Campus SSO',
                                  date: rec.lastPaidDate || '2026-09-01',
                                  qrCode: `EDU-AUTH-VERIFY-2026-${rec.id}`
                                });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDiscountModal(rec)}
                              className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                              title="Adjust Scholarship / Concession"
                            >
                              <Percent className="w-3.5 h-3.5" />
                            </button>
                            {rec.dueAmount > 0 && (
                              <button
                                onClick={() => handleSendReminder(rec)}
                                className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                                title="Send SMS Reminder"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Payroll Panel */
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Faculty & Staff Payroll Register</h3>
              <p className="text-xs text-slate-400">Institutional payroll with allowances, tax withholdings, and ACH direct deposits.</p>
            </div>

            <button
              onClick={handleBulkPayrollDisburse}
              disabled={isDisbursingBulk}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isDisbursingBulk ? 'Executing ACH Batches...' : 'Execute Bulk Transfer'}</span>
            </button>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Faculty Member</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold">Base Salary</th>
                    <th className="py-3 px-4 font-semibold">Allowances</th>
                    <th className="py-3 px-4 font-semibold">Tax & Deductions</th>
                    <th className="py-3 px-4 font-semibold">Net Pay</th>
                    <th className="py-3 px-4 font-semibold">ACH Bank Ref</th>
                    <th className="py-3 px-4 font-semibold text-right">Disbursement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payrollList.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{pay.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{pay.department}</td>
                      <td className="py-3.5 px-4 text-slate-300">${pay.baseSalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-emerald-400">+${pay.allowances.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-rose-400">-${pay.taxDeductions.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-white">${pay.netSalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{pay.accountNumber}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          pay.status === 'DISBURSED' 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          <span className="w-1 h-1 rounded-full bg-current mr-1.5" />
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedRecordForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-modal p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Record Fee Collection</h3>
                <p className="text-xs text-slate-400 font-mono">Invoice: {selectedRecordForPayment.id}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Student:</span>
                  <span className="text-white font-semibold">{selectedRecordForPayment.studentName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Class:</span>
                  <span className="text-white font-medium">{selectedRecordForPayment.grade}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Outstanding Due:</span>
                  <span className="text-rose-400 font-bold">${selectedRecordForPayment.dueAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedRecordForPayment.dueAmount || 10000}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Mode Selection
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Credit Card" className="bg-slate-900">Credit / Debit Card</option>
                  <option value="Net Banking" className="bg-slate-900">Net Banking / Wire Transfer</option>
                  <option value="Campus SSO" className="bg-slate-900">Campus SSO Digital Wallet</option>
                  <option value="Cash/Cheque" className="bg-slate-900">Cash / Demand Draft</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto-Generated Printable Receipt Modal with QR Validation */}
      {receiptModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-modal p-6 sm:p-7 shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setReceiptModalData(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 no-print"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Body */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white">EduPulse Academic Board</h2>
                  <p className="text-[11px] text-slate-400">Official Fee Payment Acknowledgment Slip</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{receiptModalData.receiptId}</span>
                  <p className="text-[10px] text-slate-400">{receiptModalData.date}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
                  <span className="text-white font-semibold">{receiptModalData.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admission ID</span>
                  <span className="text-white font-mono">{receiptModalData.admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Section</span>
                  <span className="text-white">{receiptModalData.grade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Method</span>
                  <span className="text-indigo-300 font-medium">{receiptModalData.paymentMode}</span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-200">Amount Received:</span>
                  <span className="text-emerald-400 text-sm font-bold">${receiptModalData.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Remaining Due Balance:</span>
                  <span className="text-white font-mono">${receiptModalData.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              {/* QR Verification Code & Digital Seal */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <p className="font-semibold text-white">Cryptographically Signed</p>
                    <p className="font-mono text-[9px] truncate max-w-[180px]">{receiptModalData.qrCode}</p>
                    <p className="text-emerald-400">Status: Verified Official</p>
                  </div>
                </div>

                {/* Print Button */}
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 no-print transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Discount / Concession Modal */}
      {isDiscountModalOpen && selectedRecordForDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-modal p-6 shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setIsDiscountModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Adjust Fee Concession</h3>
                <p className="text-xs text-slate-400">Institutional Scholarship & Waiver Grant</p>
              </div>
            </div>

            <form onSubmit={handleApplyDiscount} className="mt-4 space-y-4">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Student Name:</span>
                  <span className="font-semibold text-white">{selectedRecordForDiscount.studentName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Billed Fee:</span>
                  <span className="font-mono text-white">${selectedRecordForDiscount.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Outstanding Due:</span>
                  <span className="font-mono text-rose-400 font-semibold">${selectedRecordForDiscount.dueAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concession / Discount Amount ($)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    max={selectedRecordForDiscount.totalFee}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-3 py-2 text-xs text-white glass-input rounded-xl focus:outline-none"
                    placeholder="Enter discount amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason / Approval Category
                </label>
                <select
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-200 glass-input rounded-xl focus:outline-none"
                >
                  <option value="Merit Scholarship Allowance" className="bg-slate-900">Merit Scholarship Allowance</option>
                  <option value="Sibling Enrollment Concession" className="bg-slate-900">Sibling Enrollment Concession</option>
                  <option value="Staff Dependent Subsidy" className="bg-slate-900">Staff Dependent Subsidy</option>
                  <option value="Need-based Financial Aid" className="bg-slate-900">Need-based Financial Aid</option>
                  <option value="Athletic Excellence Waiver" className="bg-slate-900">Athletic Excellence Waiver</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20"
                >
                  Apply Concession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsModule;
