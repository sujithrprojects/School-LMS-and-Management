import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, RotateCcw, BookPlus, X, BookOpen, User, Calendar,
  Clock, AlertTriangle, Send 
} from 'lucide-react';
import { api } from '../../services/api';
import { initialLibraryCatalog, initialActiveLoans } from '../../data/mockData';

const LibraryModule = ({ activeSubTab }) => {
  const [catalog, setCatalog] = useState(initialLibraryCatalog);
  const [loans, setLoans] = useState(initialActiveLoans);
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab === 'library-loans') return 'loans';
    if (activeSubTab === 'library-overdue') return 'overdue';
    return 'catalog';
  });
  const [prevSubTab, setPrevSubTab] = useState(activeSubTab);
  if (prevSubTab !== activeSubTab) {
    setPrevSubTab(activeSubTab);
    if (activeSubTab === 'library-loans') {
      setActiveTab('loans');
    } else if (activeSubTab === 'library-overdue') {
      setActiveTab('overdue');
    } else if (activeSubTab === 'library') {
      setActiveTab('catalog');
    }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Issue Book Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerRole, setBorrowerRole] = useState('Student (10-A)');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load live data from Django REST API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catData, loansData] = await Promise.all([
          api.library.getCatalog(),
          api.library.getLoans()
        ]);
        if (catData) setCatalog(catData);
        if (loansData) setLoans(loansData);
      } catch (err) {
        console.warn('Using local store for library data', err);
      }
    };
    loadData();
  }, []);

  // Check In / Return Book
  const handleReturnBook = async (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    // Call backend
    await api.library.returnBook(loanId);

    setLoans(prev => prev.filter(l => l.id !== loanId));
    // Increment catalog available copies
    setCatalog(prev => prev.map(book => {
      if (book.title === loan.bookTitle) {
        const newAvail = Math.min(book.totalCopies, book.availableCopies + 1);
        return {
          ...book,
          availableCopies: newAvail,
          status: newAvail > 0 ? 'AVAILABLE' : 'BORROWED_OUT'
        };
      }
      return book;
    }));

    showToast(`Checked in "${loan.bookTitle}" from ${loan.borrowerName}. Catalog inventory updated.`);
  };

  // Issue New Book
  const handleOpenIssueModal = (preselectedBookId = '') => {
    const defaultBook = catalog.find(b => b.availableCopies > 0);
    setSelectedBookId(preselectedBookId || (defaultBook ? defaultBook.id : ''));
    setIsIssueModalOpen(true);
  };

  const handleProcessIssue = async (e) => {
    e.preventDefault();
    const book = catalog.find(b => b.id === selectedBookId);
    if (!book) {
      showToast('Please select a valid book.');
      return;
    }
    if (book.availableCopies <= 0) {
      showToast(`Cannot issue: "${book.title}" is currently out of stock.`);
      return;
    }
    if (!borrowerName.trim()) {
      showToast('Please enter the borrower name.');
      return;
    }

    const payload = {
      bookId: book.id,
      bookTitle: book.title,
      borrowerName: borrowerName.trim(),
      borrowerRole,
      dueDate
    };

    const newLoan = await api.library.issueBook(payload);

    // Update local state
    setCatalog(prev => prev.map(b => {
      if (b.id === book.id) {
        const remaining = Math.max(0, b.availableCopies - 1);
        return {
          ...b,
          availableCopies: remaining,
          status: remaining === 0 ? 'BORROWED_OUT' : (remaining <= 2 ? 'LIMITED' : 'AVAILABLE')
        };
      }
      return b;
    }));

    const addedLoan = newLoan || {
      id: `LOAN-${Date.now().toString().slice(-4)}`,
      bookTitle: book.title,
      borrowerName: borrowerName.trim(),
      borrowerRole,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'ACTIVE',
      fine: '$0.00'
    };

    setLoans(prev => [addedLoan, ...prev]);
    setIsIssueModalOpen(false);
    setBorrowerName('');
    showToast(`Successfully issued "${book.title}" to ${borrowerName.trim()}.`);
  };

  // Calculate overdue loans and fines
  const overdueLoans = loans.filter(l => l.status === 'OVERDUE' || (l.dueDate && new Date(l.dueDate) < new Date('2026-09-22')));
  const totalFines = overdueLoans.reduce((acc, l) => {
    const amt = parseFloat(l.fine.replace('$', '')) || 0;
    return acc + amt;
  }, 0);

  const handleSendOverdueNotice = (loan) => {
    showToast(`Urgent Overdue Notice sent to ${loan.borrowerName} (${loan.borrowerRole}) for "${loan.bookTitle}". Accrued fine: ${loan.fine}`);
  };

  const handleSettleFineAndReturn = async (loanId) => {
    await handleReturnBook(loanId);
    showToast(`Late fee resolved and asset checked back into catalog inventory.`);
  };

  // Filter Catalog
  const filteredCatalog = catalog.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.includes(searchQuery)
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Library & Information Hub
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Librarian Portal
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Book catalog search, circulation issue/returns desk, and automated overdue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenIssueModal()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/20 flex items-center gap-1.5 transition-all"
          >
            <BookPlus className="w-4 h-4" />
            <span>Issue New Book</span>
          </button>

          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-white/10">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Catalog Inventory
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'loans'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Circulation Desk ({loans.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'overdue'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Overdue Tracker</span>
              {overdueLoans.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-500/40 text-rose-200 border border-rose-400/40 font-bold">
                  {overdueLoans.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog title, author or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs text-white glass-input rounded-xl focus:outline-none w-64 sm:w-80"
              />
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{filteredCatalog.length}</span> titles
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((b) => (
              <div key={b.id} className="glass-card p-5 rounded-3xl border border-white/10 hover:border-pink-500/40 transition-all shadow-xl group flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                        {b.category}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors mt-2">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">By {b.author}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">ISBN: {b.isbn}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Availability</span>
                    <span className="font-bold text-white">
                      {b.availableCopies} of {b.totalCopies} available
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      b.availableCopies > 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {b.availableCopies > 0 ? 'In Stock' : 'Out on Loan'}
                    </span>

                    {b.availableCopies > 0 && (
                      <button
                        onClick={() => handleOpenIssueModal(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-pink-200 text-[11px] font-semibold transition-all"
                        title="Issue this book"
                      >
                        Issue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Circulation Desk Loans */}
      {activeTab === 'loans' && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Book Title</th>
                  <th className="py-3 px-4 font-semibold">Borrower Name & Role</th>
                  <th className="py-3 px-4 font-semibold">Borrow Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Fine</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Circulation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{loan.bookTitle}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{loan.borrowerName}</p>
                      <p className="text-[10px] text-slate-400">{loan.borrowerRole}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{loan.borrowDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{loan.dueDate}</td>
                    <td className="py-3.5 px-4 text-rose-400 font-bold">{loan.fine}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        loan.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        loan.status === 'DUE_TODAY' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleReturnBook(loan.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Automated Overdue Tracker */}
      {activeTab === 'overdue' && (
        <div className="space-y-4">
          {/* Overdue Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-3xl border border-white/10 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue Volumes</span>
                <span className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-rose-400 mt-2">{overdueLoans.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Titles requiring immediate retrieval</p>
            </div>

            <div className="glass-card p-4 rounded-3xl border border-white/10 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Accumulated Fines</span>
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-400 mt-2">${totalFines.toFixed(2)}</p>
              <p className="text-[11px] text-slate-400 mt-1">Calculated at standard $1.00 per day</p>
            </div>

            <div className="glass-card p-4 rounded-3xl border border-white/10 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Defaulter Profiles</span>
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <User className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">
                {new Set(overdueLoans.map(l => l.borrowerName)).size}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Registered users with expired loans</p>
            </div>
          </div>

          {/* Overdue Table */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Expired Circulation Records</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Recovery Action
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Automated fine accruals and one-click reminder notifications</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Book Title</th>
                    <th className="py-3 px-4 font-semibold">Borrower Name & Role</th>
                    <th className="py-3 px-4 font-semibold">Due Date</th>
                    <th className="py-3 px-4 font-semibold">Accrued Fine</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Recovery Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {overdueLoans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="font-semibold text-white">All Library Loans Up To Date</p>
                        <p className="text-xs text-slate-500">No overdue items or pending recovery notices.</p>
                      </td>
                    </tr>
                  ) : (
                    overdueLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <p className="font-bold text-white">{loan.bookTitle}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Loan ID: {loan.id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{loan.borrowerName}</p>
                          <p className="text-[10px] text-slate-400">{loan.borrowerRole}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-rose-300">
                          {loan.dueDate}
                        </td>
                        <td className="py-3.5 px-4 text-rose-400 font-bold font-mono">
                          {loan.fine}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-500/20 text-rose-300 border-rose-500/40 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" />
                            <span>EXPIRED</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSendOverdueNotice(loan)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                              title="Send Urgent SMS/Email Notice"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Notice</span>
                            </button>
                            <button
                              onClick={() => handleSettleFineAndReturn(loan.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                              title="Settle Fine & Return Book"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Settle & Check In</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue New Book Loan */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-white/20 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Issue Book / Circulation Loan</h2>
                <p className="text-xs text-slate-400">Assign library assets to students or faculty members</p>
              </div>
            </div>

            <form onSubmit={handleProcessIssue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Catalog Book</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full glass-input text-white rounded-xl px-3 py-2 focus:outline-none"
                  required
                >
                  {catalog.map(b => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0} className="bg-slate-900 text-white">
                      {b.title} ({b.availableCopies} available) - {b.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Borrower Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Aiden Alexander"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 glass-input text-white rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Borrower Role / Section</label>
                  <input
                    type="text"
                    value={borrowerRole}
                    onChange={(e) => setBorrowerRole(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-white rounded-xl focus:outline-none"
                    placeholder="Student (10-A) or Faculty"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 glass-input text-white rounded-xl focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] leading-relaxed">
                Circulation policy: Standard loan duration is 14 days. Overdue charges of $1.00/day apply upon expiration.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-pink-500/25"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryModule;
