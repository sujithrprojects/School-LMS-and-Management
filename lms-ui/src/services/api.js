// EduPulse API Service Layer
// Connects to Django REST Framework backend with graceful fallback to mock data

import {
  initialFinancialMetrics,
  initialFeeRecords,
  initialFacultyPayroll,
  initialApplicants,
  studentDetailedProfile,
  initialFacultyRoster,
  initialSubstitutions,
  weeklyTimetable,
  initialGradebook,
  initialRbacMatrix,
  initialAuditLogs,
  initialLibraryCatalog,
  initialActiveLoans
} from '../data/mockData';

const BASE_URL = 'http://127.0.0.1:8000/api';

const fetchWithTimeout = async (url, options = {}, timeout = 2500) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const api = {
  // Auth
  auth: {
    login: async (role, email) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/auth/login/`, {
          method: 'POST',
          body: JSON.stringify({ role, email })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: login', e);
      }
      return { success: true, token: 'mock-token', role };
    }
  },

  // Accounts & Finance
  accounts: {
    getMetrics: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/metrics/current/`);
        if (res.ok) {
          const data = await res.json();
          return {
            totalRevenue: parseFloat(data.total_revenue),
            pendingDues: parseFloat(data.pending_dues),
            monthlyPayroll: parseFloat(data.monthly_payroll),
            operationalExpenses: parseFloat(data.operational_expenses),
            netOperatingBalance: parseFloat(data.net_operating_balance)
          };
        }
      } catch (e) {
        console.warn('API fallback: getMetrics', e);
      }
      return initialFinancialMetrics;
    },

    getFeeRecords: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.status && params.status !== 'ALL') query.append('status', params.status);
        if (params.grade && params.grade !== 'ALL') query.append('grade', params.grade);
        if (params.academic_year && params.academic_year !== 'ALL') query.append('academic_year', params.academic_year);
        if (params.search) query.append('search', params.search);

        const res = await fetchWithTimeout(`${BASE_URL}/fees/?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            studentName: d.student_name,
            admissionNo: d.admission_no,
            grade: d.grade,
            academicYear: d.academic_year,
            totalFee: parseFloat(d.total_fee),
            paidAmount: parseFloat(d.paid_amount),
            dueAmount: parseFloat(d.due_amount),
            dueDate: d.due_date,
            status: d.status,
            paymentMode: d.payment_mode,
            discount: parseFloat(d.discount || 0),
            lastPaidDate: d.last_paid_date
          }));
        }
      } catch (e) {
        console.warn('API fallback: getFeeRecords', e);
      }
      return initialFeeRecords;
    },

    recordPayment: async (invoiceId, amount, paymentMode) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/fees/${invoiceId}/record_payment/`, {
          method: 'POST',
          body: JSON.stringify({ amount, payment_mode: paymentMode })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: recordPayment', e);
      }
      return null;
    },

    adjustDiscount: async (invoiceId, discount) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/fees/${invoiceId}/adjust_discount/`, {
          method: 'POST',
          body: JSON.stringify({ discount })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: adjustDiscount', e);
      }
      return null;
    },

    getPayroll: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/payroll/`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            name: d.name,
            department: d.department,
            baseSalary: parseFloat(d.base_salary),
            allowances: parseFloat(d.allowances),
            taxDeductions: parseFloat(d.tax_deductions),
            penalties: parseFloat(d.penalties),
            netSalary: parseFloat(d.net_salary),
            status: d.status,
            accountNumber: d.account_number
          }));
        }
      } catch (e) {
        console.warn('API fallback: getPayroll', e);
      }
      return initialFacultyPayroll;
    },

    bulkDisbursePayroll: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/payroll/bulk_disburse/`, {
          method: 'POST'
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: bulkDisbursePayroll', e);
      }
      return null;
    }
  },

  // Admissions & Pipeline
  admissions: {
    getApplicants: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.stage && params.stage !== 'ALL') query.append('stage', params.stage);
        if (params.grade && params.grade !== 'ALL') query.append('grade', params.grade);
        if (params.search) query.append('search', params.search);

        const res = await fetchWithTimeout(`${BASE_URL}/applicants/?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            name: d.name,
            grade: d.grade,
            score: d.score,
            appliedDate: d.applied_date,
            stage: d.stage,
            guardian: d.guardian,
            phone: d.phone,
            notes: d.notes
          }));
        }
      } catch (e) {
        console.warn('API fallback: getApplicants', e);
      }
      return initialApplicants;
    },

    createApplicant: async (appData) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/applicants/`, {
          method: 'POST',
          body: JSON.stringify({
            id: `APP-${Date.now().toString().slice(-4)}`,
            name: appData.name,
            grade: appData.grade,
            score: appData.score || '90/100',
            applied_date: new Date().toISOString().split('T')[0],
            stage: 'submitted',
            guardian: appData.guardian,
            phone: appData.phone,
            notes: appData.notes || ''
          })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: createApplicant', e);
      }
      return null;
    },

    updateStage: async (applicantId, newStage) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/applicants/${applicantId}/update_stage/`, {
          method: 'POST',
          body: JSON.stringify({ stage: newStage })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: updateStage', e);
      }
      return null;
    },

    getStudentProfile: async (studentId = 'EDU-2024-8891') => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/students/${studentId}/`);
        if (res.ok) {
          const d = await res.json();
          return {
            id: d.id,
            name: d.name,
            avatar: d.avatar,
            rollNumber: d.roll_number,
            section: d.section,
            bloodGroup: d.blood_group,
            dob: d.dob,
            email: d.email,
            phone: d.phone,
            address: d.address,
            guardian: {
              name: d.guardian_name,
              phone: d.guardian_phone,
              relation: d.guardian_relation,
              occupation: d.guardian_occupation
            },
            emergencyContact: {
              name: d.emergency_name,
              phone: d.emergency_phone,
              relation: d.emergency_relation
            },
            medicalNotes: d.medical_notes,
            academicHistory: d.academic_history,
            subjects: d.subjects,
            attendance: {
              percentage: parseFloat(d.attendance_percentage),
              presentDays: d.present_days,
              totalDays: d.total_days,
              leaves: d.leaves,
              recent30Days: d.recent_30_days
            },
            feeLedger: d.fee_ledger,
            libraryActivity: {
              lockerNumber: d.locker_number,
              issuedBooks: d.issued_books
            }
          };
        }
      } catch (e) {
        console.warn('API fallback: getStudentProfile', e);
      }
      return studentDetailedProfile;
    },

    payStudentFee: async (studentId = 'EDU-2024-8891') => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/students/${studentId}/pay_fee/`, {
          method: 'POST',
          body: JSON.stringify({})
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: payStudentFee', e);
      }
      return null;
    }
  },

  // Faculty & Substitutions
  faculty: {
    getRoster: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.department && params.department !== 'ALL') query.append('department', params.department);
        if (params.search) query.append('search', params.search);

        const res = await fetchWithTimeout(`${BASE_URL}/faculty/?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            name: d.name,
            department: d.department,
            subject: d.subject,
            weeklyHours: d.weekly_hours,
            maxHours: d.max_hours,
            classTeacherOf: d.class_teacher_of,
            status: d.status,
            avatar: d.avatar,
            email: d.email,
            phone: d.phone
          }));
        }
      } catch (e) {
        console.warn('API fallback: getRoster', e);
      }
      return initialFacultyRoster;
    },

    toggleAttendance: async (facultyId) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/faculty/${facultyId}/toggle_attendance/`, {
          method: 'POST'
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: toggleAttendance', e);
      }
      return null;
    },

    getSubstitutions: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/substitutions/`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            absentTeacher: d.absent_teacher,
            subject: d.subject,
            grade: d.grade,
            period: d.period,
            date: d.date,
            status: d.status,
            assignedSubstitute: d.assigned_substitute,
            suggestedSubstitutes: d.suggested_substitutes
          }));
        }
      } catch (e) {
        console.warn('API fallback: getSubstitutions', e);
      }
      return initialSubstitutions;
    },

    assignSubstitute: async (subId, teacherName) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/substitutions/${subId}/assign/`, {
          method: 'POST',
          body: JSON.stringify({ teacher_name: teacherName })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: assignSubstitute', e);
      }
      return null;
    }
  },

  // Academics & Gradebook
  academics: {
    getTimetable: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/timetable/`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            return data.map(d => ({
              period: d.period,
              time: d.time,
              isBreak: d.is_break,
              title: d.title,
              days: d.days
            }));
          }
        }
      } catch (e) {
        console.warn('API fallback: getTimetable', e);
      }
      return weeklyTimetable;
    },

    getGradebook: async (gradeClass = 'Grade 10-A') => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/gradebook/?grade_class=${encodeURIComponent(gradeClass)}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            rollNo: d.roll_no,
            name: d.name,
            math: d.math,
            physics: d.physics,
            chem: d.chem,
            english: d.english,
            cs: d.cs
          }));
        }
      } catch (e) {
        console.warn('API fallback: getGradebook', e);
      }
      return initialGradebook;
    },

    updateScore: async (studentId, subject, value) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/gradebook/batch_update/`, {
          method: 'POST',
          body: JSON.stringify({ id: studentId, subject, value })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: updateScore', e);
      }
      return null;
    },

    getStats: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/gradebook/stats/`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: getStats', e);
      }
      return null;
    }
  },

  // Admin Governance
  governance: {
    getRbacMatrix: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/rbac/`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            capability: d.capability,
            superAdmin: d.super_admin,
            accountant: d.accountant,
            teacher: d.teacher,
            student: d.student,
            librarian: d.librarian
          }));
        }
      } catch (e) {
        console.warn('API fallback: getRbacMatrix', e);
      }
      return initialRbacMatrix;
    },

    togglePermission: async (id, roleKey) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/rbac/${id}/toggle_permission/`, {
          method: 'POST',
          body: JSON.stringify({ role_key: roleKey })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: togglePermission', e);
      }
      return null;
    },

    getAuditLogs: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.severity && params.severity !== 'ALL') query.append('severity', params.severity);
        if (params.search) query.append('search', params.search);

        const res = await fetchWithTimeout(`${BASE_URL}/audit-logs/?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            timestamp: d.timestamp,
            userId: d.user_id,
            action: d.action,
            module: d.module,
            ipAddress: d.ip_address,
            severity: d.severity,
            status: d.status
          }));
        }
      } catch (e) {
        console.warn('API fallback: getAuditLogs', e);
      }
      return initialAuditLogs;
    }
  },

  // Library Hub
  library: {
    getCatalog: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.search) query.append('search', params.search);
        const res = await fetchWithTimeout(`${BASE_URL}/books/?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            title: d.title,
            author: d.author,
            isbn: d.isbn,
            category: d.category,
            totalCopies: d.total_copies,
            availableCopies: d.available_copies,
            status: d.status
          }));
        }
      } catch (e) {
        console.warn('API fallback: getCatalog', e);
      }
      return initialLibraryCatalog;
    },

    getLoans: async () => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/loans/`);
        if (res.ok) {
          const data = await res.json();
          return data.map(d => ({
            id: d.id,
            bookTitle: d.book_title,
            borrowerName: d.borrower_name,
            borrowerRole: d.borrower_role,
            borrowDate: d.borrow_date,
            dueDate: d.due_date,
            status: d.status,
            fine: d.fine
          }));
        }
      } catch (e) {
        console.warn('API fallback: getLoans', e);
      }
      return initialActiveLoans;
    },

    issueBook: async (loanData) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/loans/issue_book/`, {
          method: 'POST',
          body: JSON.stringify({
            book_id: loanData.bookId,
            book_title: loanData.bookTitle,
            borrower_name: loanData.borrowerName,
            borrower_role: loanData.borrowerRole,
            due_date: loanData.dueDate
          })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: issueBook', e);
      }
      return null;
    },

    returnBook: async (loanId) => {
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/loans/${loanId}/return_book/`, {
          method: 'POST'
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API fallback: returnBook', e);
      }
      return null;
    }
  }
};
