// EduPulse Next-Gen School ERP - Centralized Mock Store

export const ROLES = {
  admin: {
    id: 'admin',
    name: 'Super Admin',
    badge: 'Super Admin Console',
    roleTag: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: 'admin.director@edupulse.edu',
    themeColor: 'indigo'
  },
  accountant: {
    id: 'accountant',
    name: 'Eleanor Sterling',
    badge: 'Chief Bursar & Accounts',
    roleTag: 'ACCOUNTANT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    email: 'bursar.sterling@edupulse.edu',
    themeColor: 'amber'
  },
  teacher: {
    id: 'teacher',
    name: 'Prof. David Vance',
    badge: 'Senior Faculty & Class Head',
    roleTag: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: 'david.vance@edupulse.edu',
    themeColor: 'emerald'
  },
  student: {
    id: 'student',
    name: 'Aiden Alexander',
    badge: 'Grade 10-A Honors Student',
    roleTag: 'STUDENT / PARENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    email: 'aiden.alexander@student.edupulse.edu',
    themeColor: 'cyan'
  },
  librarian: {
    id: 'librarian',
    name: 'Miriam O’Connor',
    badge: 'Chief Information & Librarian',
    roleTag: 'LIBRARIAN',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    email: 'miriam.library@edupulse.edu',
    themeColor: 'pink'
  }
};

// Module 1: Accounts & Financial Management Data
export const initialFinancialMetrics = {
  totalRevenue: 1248500,
  pendingDues: 186200,
  monthlyPayroll: 142800,
  operationalExpenses: 64350,
  netOperatingBalance: 1041350
};

export const initialFeeRecords = [
  {
    id: 'INV-2026-001',
    studentName: 'Aiden Alexander',
    admissionNo: 'EDU-2024-8891',
    grade: 'Grade 10-A',
    totalFee: 4200,
    paidAmount: 3200,
    dueAmount: 1000,
    dueDate: '2026-10-15',
    status: 'PARTIAL',
    paymentMode: 'Campus SSO',
    discount: 0,
    lastPaidDate: '2026-08-10'
  },
  {
    id: 'INV-2026-002',
    studentName: 'Sophia Montgomery',
    admissionNo: 'EDU-2023-7412',
    grade: 'Grade 11-Sci',
    totalFee: 4800,
    paidAmount: 4800,
    dueAmount: 0,
    dueDate: '2026-09-01',
    status: 'PAID',
    paymentMode: 'Credit Card',
    discount: 200,
    lastPaidDate: '2026-08-28'
  },
  {
    id: 'INV-2026-003',
    studentName: 'Julian Thorne',
    admissionNo: 'EDU-2025-9921',
    grade: 'Grade 9-B',
    totalFee: 3800,
    paidAmount: 0,
    dueAmount: 3800,
    dueDate: '2026-09-10',
    status: 'OVERDUE',
    paymentMode: 'Net Banking',
    discount: 0,
    lastPaidDate: null
  },
  {
    id: 'INV-2026-004',
    studentName: 'Chloe Delacroix',
    admissionNo: 'EDU-2024-8840',
    grade: 'Grade 10-A',
    totalFee: 4200,
    paidAmount: 4200,
    dueAmount: 0,
    dueDate: '2026-09-05',
    status: 'PAID',
    paymentMode: 'Cash/Cheque',
    discount: 0,
    lastPaidDate: '2026-09-02'
  },
  {
    id: 'INV-2026-005',
    studentName: 'Lucas Sterling',
    admissionNo: 'EDU-2023-7501',
    grade: 'Grade 12-Comm',
    totalFee: 4900,
    paidAmount: 0,
    dueAmount: 4900,
    dueDate: '2026-10-30',
    status: 'PENDING',
    paymentMode: 'Campus SSO',
    discount: 150,
    lastPaidDate: null
  },
  {
    id: 'INV-2026-006',
    studentName: 'Zara Chen',
    admissionNo: 'EDU-2025-9945',
    grade: 'Grade 9-A',
    totalFee: 3800,
    paidAmount: 3800,
    dueAmount: 0,
    dueDate: '2026-09-15',
    status: 'PAID',
    paymentMode: 'Credit Card',
    discount: 0,
    lastPaidDate: '2026-09-12'
  }
];

export const initialFacultyPayroll = [
  {
    id: 'PAY-FAC-01',
    name: 'Prof. David Vance',
    department: 'Science & Physics',
    baseSalary: 6200,
    allowances: 950,
    taxDeductions: 780,
    penalties: 0,
    netSalary: 6370,
    status: 'DISBURSED',
    accountNumber: '•••• 7812'
  },
  {
    id: 'PAY-FAC-02',
    name: 'Dr. Evelyn Martinez',
    department: 'Mathematics',
    baseSalary: 6800,
    allowances: 1100,
    taxDeductions: 850,
    penalties: 0,
    netSalary: 7050,
    status: 'DISBURSED',
    accountNumber: '•••• 3390'
  },
  {
    id: 'PAY-FAC-03',
    name: 'Marcus Rivera',
    department: 'Humanities & History',
    baseSalary: 5400,
    allowances: 800,
    taxDeductions: 620,
    penalties: 120,
    netSalary: 5460,
    status: 'PENDING',
    accountNumber: '•••• 1928'
  },
  {
    id: 'PAY-FAC-04',
    name: 'Seraphina Vance',
    department: 'Computer Science',
    baseSalary: 6500,
    allowances: 1250,
    taxDeductions: 810,
    penalties: 0,
    netSalary: 6940,
    status: 'PENDING',
    accountNumber: '•••• 6401'
  }
];

// Module 2: Admissions & Registration Pipeline
export const initialApplicants = [
  {
    id: 'APP-101',
    name: 'Elena Rostova',
    grade: 'Grade 9',
    score: '94/100',
    appliedDate: '2026-09-14',
    stage: 'submitted',
    guardian: 'Dmitri Rostov',
    phone: '+1 (555) 234-5678',
    notes: 'Outstanding STEM Olympiad participant'
  },
  {
    id: 'APP-102',
    name: 'Liam Gallagher',
    grade: 'Grade 10',
    score: '88/100',
    appliedDate: '2026-09-12',
    stage: 'exam_scheduled',
    guardian: 'Fiona Gallagher',
    phone: '+1 (555) 345-6789',
    notes: 'Exam set for Sept 28, Hall C'
  },
  {
    id: 'APP-103',
    name: 'Maya Patel',
    grade: 'Grade 11-Sci',
    score: '96/100',
    appliedDate: '2026-09-10',
    stage: 'interview',
    guardian: 'Raj Patel',
    phone: '+1 (555) 456-7890',
    notes: 'Panel interview with Head of Science'
  },
  {
    id: 'APP-104',
    name: 'Kaito Tanaka',
    grade: 'Grade 9',
    score: '91/100',
    appliedDate: '2026-09-08',
    stage: 'verification',
    guardian: 'Kenji Tanaka',
    phone: '+1 (555) 567-8901',
    notes: 'Transcripts from Tokyo International verified'
  },
  {
    id: 'APP-105',
    name: 'Brianna Hayes',
    grade: 'Grade 10',
    score: '95/100',
    appliedDate: '2026-09-05',
    stage: 'enrolled',
    guardian: 'Laura Hayes',
    phone: '+1 (555) 678-9012',
    notes: 'Full tuition settled; Section 10-A allocated'
  },
  {
    id: 'APP-106',
    name: 'Tariq Al-Mansoor',
    grade: 'Grade 11-Sci',
    score: '89/100',
    appliedDate: '2026-09-15',
    stage: 'submitted',
    guardian: 'Zaid Al-Mansoor',
    phone: '+1 (555) 789-0123',
    notes: 'Robotics regional winner'
  }
];

// Student 360 Full Profile Details
export const studentDetailedProfile = {
  id: 'EDU-2024-8891',
  name: 'Aiden Alexander',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  rollNumber: '10A-24',
  section: 'Grade 10-A (Science & Honors)',
  bloodGroup: 'O+ Positive',
  dob: '2010-04-12',
  email: 'aiden.alexander@student.edupulse.edu',
  phone: '+1 (555) 892-1204',
  address: '742 Evergreen Terrace, Academic District, Suite 4B',
  guardian: {
    name: 'Eleanor Alexander (Mother)',
    phone: '+1 (555) 911-3040',
    relation: 'Primary Guardian',
    occupation: 'Senior Research Scientist'
  },
  emergencyContact: {
    name: 'Dr. Robert Alexander',
    phone: '+1 (555) 911-3041',
    relation: 'Father / Emergency Contact'
  },
  medicalNotes: 'Mild asthma inhaler kept with campus nurse; No known dietary allergies.',
  academicHistory: [
    { term: 'Fall 2025 (Grade 9 Final)', gpa: '3.92', rank: '2nd / 120', status: 'Distinction' },
    { term: 'Spring 2026 (Grade 10 Midterm)', gpa: '3.96', rank: '1st / 124', status: 'Honors Dean List' }
  ],
  subjects: [
    { name: 'Advanced Physics', score: 96, grade: 'A+', teacher: 'Prof. David Vance' },
    { name: 'Pure Mathematics', score: 94, grade: 'A', teacher: 'Dr. Evelyn Martinez' },
    { name: 'Organic Chemistry', score: 92, grade: 'A', teacher: 'Dr. Aris Thorne' },
    { name: 'World Literature', score: 88, grade: 'B+', teacher: 'Ms. Clara Oswald' },
    { name: 'Computer Science', score: 98, grade: 'A+', teacher: 'Ms. Seraphina Vance' }
  ],
  attendance: {
    percentage: 97.4,
    presentDays: 88,
    totalDays: 90,
    leaves: [
      { date: '2026-08-14', reason: 'Regional Science Fair Excursion', approved: true },
      { date: '2026-09-02', reason: 'Medical appointment', approved: true }
    ],
    recent30Days: [
      'P','P','P','P','P','P','P','P','P','P',
      'P','P','L','P','P','P','P','P','P','P',
      'P','P','P','P','P','P','P','P','P','P'
    ]
  },
  feeLedger: [
    { date: '2026-08-10', desc: 'Semester 1 Tuition Installment 1', amount: 3200, status: 'PAID', receipt: 'REC-9941' },
    { date: '2026-10-15', desc: 'Semester 1 Tuition Installment 2', amount: 1000, status: 'DUE', receipt: 'PENDING' },
    { date: '2026-08-01', desc: 'Lab & Computer Lab Annual Fee', amount: 450, status: 'PAID', receipt: 'REC-8820' }
  ],
  libraryActivity: {
    lockerNumber: 'Lock-A142',
    issuedBooks: [
      { title: 'Quantum Mechanics for High School', isbn: '978-0134092669', issueDate: '2026-09-05', dueDate: '2026-09-26', status: 'ACTIVE' },
      { title: 'Introduction to Algorithms (4th Ed)', isbn: '978-0262046305', issueDate: '2026-09-01', dueDate: '2026-09-22', status: 'DUE_TODAY' }
    ]
  }
};

// Module 3: Faculty & Staff Management Data
export const initialFacultyRoster = [
  {
    id: 'FAC-01',
    name: 'Prof. David Vance',
    department: 'Science & Physics',
    subject: 'Physics & Astronomy',
    weeklyHours: 20,
    maxHours: 24,
    classTeacherOf: 'Grade 10-A',
    status: 'PRESENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: 'david.vance@edupulse.edu',
    phone: '+1 (555) 819-2031'
  },
  {
    id: 'FAC-02',
    name: 'Dr. Evelyn Martinez',
    department: 'Mathematics',
    subject: 'Calculus & Algebra',
    weeklyHours: 22,
    maxHours: 24,
    classTeacherOf: 'Grade 11-Sci',
    status: 'PRESENT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    email: 'evelyn.martinez@edupulse.edu',
    phone: '+1 (555) 712-4411'
  },
  {
    id: 'FAC-03',
    name: 'Marcus Rivera',
    department: 'Humanities & History',
    subject: 'World Civilizations',
    weeklyHours: 16,
    maxHours: 20,
    classTeacherOf: 'Grade 9-B',
    status: 'ABSENT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    email: 'marcus.rivera@edupulse.edu',
    phone: '+1 (555) 433-8822'
  },
  {
    id: 'FAC-04',
    name: 'Seraphina Vance',
    department: 'Computer Science',
    subject: 'Data Structures & AI',
    weeklyHours: 18,
    maxHours: 22,
    classTeacherOf: 'None (CS Lab Head)',
    status: 'PRESENT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    email: 'seraphina.vance@edupulse.edu',
    phone: '+1 (555) 629-1002'
  },
  {
    id: 'FAC-05',
    name: 'Dr. Aris Thorne',
    department: 'Science & Physics',
    subject: 'Chemistry & Biochemistry',
    weeklyHours: 18,
    maxHours: 24,
    classTeacherOf: 'Grade 12-Sci',
    status: 'ABSENT',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    email: 'aris.thorne@edupulse.edu',
    phone: '+1 (555) 512-9903'
  },
  {
    id: 'FAC-06',
    name: 'Ms. Clara Oswald',
    department: 'Languages & Literature',
    subject: 'English & Modern Literature',
    weeklyHours: 19,
    maxHours: 22,
    classTeacherOf: 'Grade 9-A',
    status: 'PRESENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: 'clara.oswald@edupulse.edu',
    phone: '+1 (555) 332-9011'
  }
];

// Dynamic Substitution Engine State
export const initialSubstitutions = [
  {
    id: 'SUB-01',
    absentTeacher: 'Marcus Rivera',
    subject: 'World Civilizations',
    grade: 'Grade 9-B',
    period: 'Period 3 (10:15 AM - 11:00 AM)',
    date: 'Today',
    status: 'NEEDS_SUBSTITUTE',
    assignedSubstitute: null,
    suggestedSubstitutes: [
      { name: 'Ms. Clara Oswald', dept: 'Languages & Literature', freePeriod: true, matchScore: 92 },
      { name: 'Seraphina Vance', dept: 'Computer Science', freePeriod: true, matchScore: 78 }
    ]
  },
  {
    id: 'SUB-02',
    absentTeacher: 'Dr. Aris Thorne',
    subject: 'Chemistry & Biochemistry',
    grade: 'Grade 12-Sci',
    period: 'Period 5 (1:00 PM - 1:45 PM)',
    date: 'Today',
    status: 'ASSIGNED',
    assignedSubstitute: 'Prof. David Vance',
    suggestedSubstitutes: [
      { name: 'Prof. David Vance', dept: 'Science & Physics', freePeriod: true, matchScore: 98 }
    ]
  }
];

// Module 4: Academics, Timetable & Gradebook
export const weeklyTimetable = [
  {
    period: 'Period 1',
    time: '8:00 AM - 8:50 AM',
    days: {
      Monday: { subject: 'Advanced Physics', teacher: 'Prof. Vance', room: 'Lab 201', tag: 'indigo' },
      Tuesday: { subject: 'Pure Mathematics', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' },
      Wednesday: { subject: 'Advanced Physics', teacher: 'Prof. Vance', room: 'Lab 201', tag: 'indigo' },
      Thursday: { subject: 'World Literature', teacher: 'Ms. Oswald', room: 'Hall B', tag: 'pink' },
      Friday: { subject: 'Computer Science', teacher: 'Ms. Vance', room: 'CS Lab 1', tag: 'cyan' }
    }
  },
  {
    period: 'Period 2',
    time: '8:55 AM - 9:45 AM',
    days: {
      Monday: { subject: 'Pure Mathematics', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' },
      Tuesday: { subject: 'Organic Chemistry', teacher: 'Dr. Thorne', room: 'Chem Lab', tag: 'indigo' },
      Wednesday: { subject: 'World Literature', teacher: 'Ms. Oswald', room: 'Hall B', tag: 'pink' },
      Thursday: { subject: 'Computer Science', teacher: 'Ms. Vance', room: 'CS Lab 1', tag: 'cyan' },
      Friday: { subject: 'Pure Mathematics', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' }
    }
  },
  {
    period: 'Period 3',
    time: '10:00 AM - 10:50 AM',
    days: {
      Monday: { subject: 'World Literature', teacher: 'Ms. Oswald', room: 'Hall B', tag: 'pink' },
      Tuesday: { subject: 'Computer Science', teacher: 'Ms. Vance', room: 'CS Lab 1', tag: 'cyan' },
      Wednesday: { subject: 'Pure Mathematics', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' },
      Thursday: { subject: 'Advanced Physics', teacher: 'Prof. Vance', room: 'Lab 201', tag: 'indigo' },
      Friday: { subject: 'Organic Chemistry', teacher: 'Dr. Thorne', room: 'Chem Lab', tag: 'indigo' }
    }
  },
  {
    period: 'Lunch Break',
    time: '11:00 AM - 11:45 AM',
    isBreak: true,
    title: 'Cafeteria & Wellness Garden Intermission'
  },
  {
    period: 'Period 4',
    time: '11:50 AM - 12:40 PM',
    days: {
      Monday: { subject: 'Organic Chemistry', teacher: 'Dr. Thorne', room: 'Chem Lab', tag: 'indigo' },
      Tuesday: { subject: 'Advanced Physics', teacher: 'Prof. Vance', room: 'Lab 201', tag: 'indigo' },
      Wednesday: { subject: 'History & Civics', teacher: 'Mr. Rivera', room: 'Room 108', tag: 'amber' },
      Thursday: { subject: 'Pure Mathematics', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' },
      Friday: { subject: 'Physical Education', teacher: 'Coach Hayes', room: 'Gymnasium', tag: 'emerald' }
    }
  },
  {
    period: 'Period 5',
    time: '12:45 PM - 1:35 PM',
    days: {
      Monday: { subject: 'Computer Science', teacher: 'Ms. Vance', room: 'CS Lab 1', tag: 'cyan' },
      Tuesday: { subject: 'World Literature', teacher: 'Ms. Oswald', room: 'Hall B', tag: 'pink' },
      Wednesday: { subject: 'Organic Chemistry', teacher: 'Dr. Thorne', room: 'Chem Lab', tag: 'indigo' },
      Thursday: { subject: 'History & Civics', teacher: 'Mr. Rivera', room: 'Room 108', tag: 'amber' },
      Friday: { subject: 'Robotics & Capstone', teacher: 'Ms. Vance', room: 'CS Lab 1', tag: 'cyan' }
    }
  },
  {
    period: 'Period 6',
    time: '1:40 PM - 2:30 PM',
    days: {
      Monday: { subject: 'Club Activities', teacher: 'Various Leads', room: 'Auditorium', tag: 'pink' },
      Tuesday: { subject: 'Tutorial & Doubts', teacher: 'Prof. Vance', room: 'Room 104', tag: 'indigo' },
      Wednesday: { subject: 'Debate & Oratory', teacher: 'Ms. Oswald', room: 'Hall B', tag: 'amber' },
      Thursday: { subject: 'Math Olympiad Prep', teacher: 'Dr. Martinez', room: 'Room 104', tag: 'emerald' },
      Friday: { subject: 'Weekly Assembly', teacher: 'Administration', room: 'Main Quad', tag: 'indigo' }
    }
  }
];

export const initialGradebook = [
  {
    id: 'STU-01',
    rollNo: '10A-24',
    name: 'Aiden Alexander',
    math: 95,
    physics: 98,
    chem: 92,
    english: 89,
    cs: 99
  },
  {
    id: 'STU-02',
    rollNo: '10A-11',
    name: 'Chloe Delacroix',
    math: 88,
    physics: 90,
    chem: 86,
    english: 94,
    cs: 91
  },
  {
    id: 'STU-03',
    rollNo: '10A-03',
    name: 'Sophia Montgomery',
    math: 92,
    physics: 94,
    chem: 90,
    english: 91,
    cs: 96
  },
  {
    id: 'STU-04',
    rollNo: '10A-18',
    name: 'Julian Thorne',
    math: 74,
    physics: 68,
    chem: 72,
    english: 82,
    cs: 80
  },
  {
    id: 'STU-05',
    rollNo: '10A-07',
    name: 'Lucas Sterling',
    math: 81,
    physics: 79,
    chem: 84,
    english: 85,
    cs: 87
  },
  {
    id: 'STU-06',
    rollNo: '10A-22',
    name: 'Zara Chen',
    math: 96,
    physics: 91,
    chem: 94,
    english: 88,
    cs: 95
  }
];

// Module 5: Admin & Governance (RBAC & Audit Trail)
export const initialRbacMatrix = [
  {
    capability: 'Manage Fees & Collection',
    superAdmin: 'Full Access',
    accountant: 'Full Access',
    teacher: 'Read-Only',
    student: 'Read-Only',
    librarian: 'No Access'
  },
  {
    capability: 'Approve Admissions',
    superAdmin: 'Full Access',
    accountant: 'Read-Only',
    teacher: 'No Access',
    student: 'No Access',
    librarian: 'No Access'
  },
  {
    capability: 'Enter Grades & Attendance',
    superAdmin: 'Full Access',
    accountant: 'No Access',
    teacher: 'Full Access',
    student: 'Read-Only',
    librarian: 'No Access'
  },
  {
    capability: 'Issue / Return Books',
    superAdmin: 'Full Access',
    accountant: 'No Access',
    teacher: 'Read-Only',
    student: 'Read-Only',
    librarian: 'Full Access'
  },
  {
    capability: 'System Security & Audit',
    superAdmin: 'Full Access',
    accountant: 'No Access',
    teacher: 'No Access',
    student: 'No Access',
    librarian: 'No Access'
  }
];

export const initialAuditLogs = [
  {
    id: 'LOG-99210',
    timestamp: '2026-09-21 23:42:19',
    userId: 'admin.director@edupulse.edu',
    action: 'RBAC Policy Update: Elevated Finance Read permissions for Grade Teachers',
    module: 'Admin Governance',
    ipAddress: '192.168.10.45',
    severity: 'WARNING',
    status: 'COMPLETED'
  },
  {
    id: 'LOG-99209',
    timestamp: '2026-09-21 21:14:02',
    userId: 'bursar.sterling@edupulse.edu',
    action: 'Fee Invoice Generated: INV-2026-006 (Student Zara Chen - $3,800)',
    module: 'Accounts & Finance',
    ipAddress: '192.168.10.88',
    severity: 'INFO',
    status: 'COMPLETED'
  },
  {
    id: 'LOG-99208',
    timestamp: '2026-09-21 19:30:15',
    userId: 'david.vance@edupulse.edu',
    action: 'Gradebook Marks Batch Saved: Physics Midterm Assessment Grade 10-A',
    module: 'Academics & Exams',
    ipAddress: '192.168.12.14',
    severity: 'INFO',
    status: 'COMPLETED'
  },
  {
    id: 'LOG-99207',
    timestamp: '2026-09-21 17:05:40',
    userId: 'miriam.library@edupulse.edu',
    action: 'Book Checked In: "Principles of Neurobiology" ISBN 978-0815344926',
    module: 'Library System',
    ipAddress: '192.168.15.10',
    severity: 'INFO',
    status: 'COMPLETED'
  },
  {
    id: 'LOG-99206',
    timestamp: '2026-09-21 14:22:11',
    userId: 'sec.gateway@edupulse.edu',
    action: 'Multiple failed PIN logins detected from IP 198.51.100.22',
    module: 'Security & Auth',
    ipAddress: '198.51.100.22',
    severity: 'CRITICAL',
    status: 'BLOCKED'
  }
];

// Module 6: Library Hub
export const initialLibraryCatalog = [
  {
    id: 'LIB-001',
    title: 'Quantum Mechanics for High School',
    author: 'David J. Griffiths',
    isbn: '978-0134092669',
    category: 'Physics',
    totalCopies: 8,
    availableCopies: 3,
    status: 'AVAILABLE'
  },
  {
    id: 'LIB-002',
    title: 'Introduction to Algorithms (4th Ed)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    isbn: '978-0262046305',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 1,
    status: 'LIMITED'
  },
  {
    id: 'LIB-003',
    title: 'Campbell Biology (12th Edition)',
    author: 'Lisa A. Urry et al.',
    isbn: '978-0135188743',
    category: 'Biology',
    totalCopies: 10,
    availableCopies: 6,
    status: 'AVAILABLE'
  },
  {
    id: 'LIB-004',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1285741550',
    category: 'Mathematics',
    totalCopies: 15,
    availableCopies: 8,
    status: 'AVAILABLE'
  },
  {
    id: 'LIB-005',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Literature',
    totalCopies: 20,
    availableCopies: 0,
    status: 'BORROWED_OUT'
  }
];

export const initialActiveLoans = [
  {
    id: 'LOAN-8801',
    bookTitle: 'Introduction to Algorithms (4th Ed)',
    borrowerName: 'Aiden Alexander',
    borrowerRole: 'Student (10-A)',
    borrowDate: '2026-09-01',
    dueDate: '2026-09-22',
    status: 'DUE_TODAY',
    fine: '$0.00'
  },
  {
    id: 'LOAN-8802',
    bookTitle: 'The Great Gatsby',
    borrowerName: 'Marcus Rivera',
    borrowerRole: 'Faculty (History)',
    borrowDate: '2026-08-15',
    dueDate: '2026-09-05',
    status: 'OVERDUE',
    fine: '$17.00'
  },
  {
    id: 'LOAN-8803',
    bookTitle: 'Quantum Mechanics for High School',
    borrowerName: 'Aiden Alexander',
    borrowerRole: 'Student (10-A)',
    borrowDate: '2026-09-05',
    dueDate: '2026-09-26',
    status: 'ACTIVE',
    fine: '$0.00'
  }
];
