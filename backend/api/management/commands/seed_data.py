from django.core.management.base import BaseCommand
from decimal import Decimal
from api.models import (
    FinancialMetric, FeeRecord, PayrollRecord,
    Applicant, StudentProfile, FacultyMember, Substitution,
    TimetableSlot, GradebookRecord, RbacPermission, AuditLog,
    Book, BookLoan
)

class Command(BaseCommand):
    help = 'Seeds database with initial EduPulse ERP data matching mock datasets'

    def handle(self, *args, **options):
        self.stdout.write("Seeding EduPulse ERP database...")

        # 1. Financial Metric
        FinancialMetric.objects.all().delete()
        FinancialMetric.objects.create(
            total_revenue=Decimal('1248500.00'),
            pending_dues=Decimal('186200.00'),
            monthly_payroll=Decimal('142800.00'),
            operational_expenses=Decimal('64350.00'),
            net_operating_balance=Decimal('1041350.00')
        )

        # 2. Fee Records
        FeeRecord.objects.all().delete()
        fee_records = [
            {
                'id': 'INV-2026-001',
                'student_name': 'Aiden Alexander',
                'admission_no': 'EDU-2024-8891',
                'grade': 'Grade 10-A',
                'academic_year': '2026-2027',
                'total_fee': Decimal('4200.00'),
                'paid_amount': Decimal('3200.00'),
                'due_amount': Decimal('1000.00'),
                'due_date': '2026-10-15',
                'status': 'PARTIAL',
                'payment_mode': 'Campus SSO',
                'discount': Decimal('0.00'),
                'last_paid_date': '2026-08-10'
            },
            {
                'id': 'INV-2026-002',
                'student_name': 'Sophia Montgomery',
                'admission_no': 'EDU-2023-7412',
                'grade': 'Grade 11-Sci',
                'academic_year': '2026-2027',
                'total_fee': Decimal('4800.00'),
                'paid_amount': Decimal('4800.00'),
                'due_amount': Decimal('0.00'),
                'due_date': '2026-09-01',
                'status': 'PAID',
                'payment_mode': 'Credit Card',
                'discount': Decimal('200.00'),
                'last_paid_date': '2026-08-28'
            },
            {
                'id': 'INV-2026-003',
                'student_name': 'Julian Thorne',
                'admission_no': 'EDU-2025-9921',
                'grade': 'Grade 9-B',
                'academic_year': '2026-2027',
                'total_fee': Decimal('3800.00'),
                'paid_amount': Decimal('0.00'),
                'due_amount': Decimal('3800.00'),
                'due_date': '2026-09-10',
                'status': 'OVERDUE',
                'payment_mode': 'Net Banking',
                'discount': Decimal('0.00'),
                'last_paid_date': None
            },
            {
                'id': 'INV-2026-004',
                'student_name': 'Chloe Delacroix',
                'admission_no': 'EDU-2024-8840',
                'grade': 'Grade 10-A',
                'academic_year': '2026-2027',
                'total_fee': Decimal('4200.00'),
                'paid_amount': Decimal('4200.00'),
                'due_amount': Decimal('0.00'),
                'due_date': '2026-09-05',
                'status': 'PAID',
                'payment_mode': 'Cash/Cheque',
                'discount': Decimal('0.00'),
                'last_paid_date': '2026-09-02'
            },
            {
                'id': 'INV-2026-005',
                'student_name': 'Lucas Sterling',
                'admission_no': 'EDU-2023-7501',
                'grade': 'Grade 12-Comm',
                'academic_year': '2025-2026',
                'total_fee': Decimal('4900.00'),
                'paid_amount': Decimal('0.00'),
                'due_amount': Decimal('4900.00'),
                'due_date': '2026-10-30',
                'status': 'PENDING',
                'payment_mode': 'Campus SSO',
                'discount': Decimal('150.00'),
                'last_paid_date': None
            },
            {
                'id': 'INV-2026-006',
                'student_name': 'Zara Chen',
                'admission_no': 'EDU-2025-9945',
                'grade': 'Grade 9-A',
                'academic_year': '2026-2027',
                'total_fee': Decimal('3800.00'),
                'paid_amount': Decimal('3800.00'),
                'due_amount': Decimal('0.00'),
                'due_date': '2026-09-15',
                'status': 'PAID',
                'payment_mode': 'Credit Card',
                'discount': Decimal('0.00'),
                'last_paid_date': '2026-09-12'
            }
        ]
        for f in fee_records:
            FeeRecord.objects.create(**f)

        # 3. Payroll Records
        PayrollRecord.objects.all().delete()
        payrolls = [
            {
                'id': 'PAY-FAC-01',
                'name': 'Prof. David Vance',
                'department': 'Science & Physics',
                'base_salary': Decimal('6200.00'),
                'allowances': Decimal('950.00'),
                'tax_deductions': Decimal('780.00'),
                'penalties': Decimal('0.00'),
                'net_salary': Decimal('6370.00'),
                'status': 'DISBURSED',
                'account_number': '•••• 7812'
            },
            {
                'id': 'PAY-FAC-02',
                'name': 'Dr. Evelyn Martinez',
                'department': 'Mathematics',
                'base_salary': Decimal('6800.00'),
                'allowances': Decimal('1100.00'),
                'tax_deductions': Decimal('850.00'),
                'penalties': Decimal('0.00'),
                'net_salary': Decimal('7050.00'),
                'status': 'DISBURSED',
                'account_number': '•••• 3390'
            },
            {
                'id': 'PAY-FAC-03',
                'name': 'Marcus Rivera',
                'department': 'Humanities & History',
                'base_salary': Decimal('5400.00'),
                'allowances': Decimal('800.00'),
                'tax_deductions': Decimal('620.00'),
                'penalties': Decimal('120.00'),
                'net_salary': Decimal('5460.00'),
                'status': 'PENDING',
                'account_number': '•••• 1928'
            },
            {
                'id': 'PAY-FAC-04',
                'name': 'Seraphina Vance',
                'department': 'Computer Science',
                'base_salary': Decimal('6500.00'),
                'allowances': Decimal('1250.00'),
                'tax_deductions': Decimal('810.00'),
                'penalties': Decimal('0.00'),
                'net_salary': Decimal('6940.00'),
                'status': 'PENDING',
                'account_number': '•••• 6401'
            }
        ]
        for p in payrolls:
            PayrollRecord.objects.create(**p)

        # 4. Applicants
        Applicant.objects.all().delete()
        applicants = [
            {
                'id': 'APP-101',
                'name': 'Elena Rostova',
                'grade': 'Grade 9',
                'score': '94/100',
                'applied_date': '2026-09-14',
                'stage': 'submitted',
                'guardian': 'Dmitri Rostov',
                'phone': '+1 (555) 234-5678',
                'notes': 'Outstanding STEM Olympiad participant'
            },
            {
                'id': 'APP-102',
                'name': 'Liam Gallagher',
                'grade': 'Grade 10',
                'score': '88/100',
                'applied_date': '2026-09-12',
                'stage': 'exam_scheduled',
                'guardian': 'Fiona Gallagher',
                'phone': '+1 (555) 345-6789',
                'notes': 'Exam set for Sept 28, Hall C'
            },
            {
                'id': 'APP-103',
                'name': 'Maya Patel',
                'grade': 'Grade 11-Sci',
                'score': '96/100',
                'applied_date': '2026-09-10',
                'stage': 'interview',
                'guardian': 'Raj Patel',
                'phone': '+1 (555) 456-7890',
                'notes': 'Panel interview with Head of Science'
            },
            {
                'id': 'APP-104',
                'name': 'Kaito Tanaka',
                'grade': 'Grade 9',
                'score': '91/100',
                'applied_date': '2026-09-08',
                'stage': 'verification',
                'guardian': 'Kenji Tanaka',
                'phone': '+1 (555) 567-8901',
                'notes': 'Transcripts from Tokyo International verified'
            },
            {
                'id': 'APP-105',
                'name': 'Brianna Hayes',
                'grade': 'Grade 10',
                'score': '95/100',
                'applied_date': '2026-09-05',
                'stage': 'enrolled',
                'guardian': 'Laura Hayes',
                'phone': '+1 (555) 678-9012',
                'notes': 'Full tuition settled; Section 10-A allocated'
            },
            {
                'id': 'APP-106',
                'name': 'Tariq Al-Mansoor',
                'grade': 'Grade 11-Sci',
                'score': '89/100',
                'applied_date': '2026-09-15',
                'stage': 'submitted',
                'guardian': 'Zaid Al-Mansoor',
                'phone': '+1 (555) 789-0123',
                'notes': 'Robotics regional winner'
            }
        ]
        for a in applicants:
            Applicant.objects.create(**a)

        # 5. Student Profile
        StudentProfile.objects.all().delete()
        StudentProfile.objects.create(
            id='EDU-2024-8891',
            name='Aiden Alexander',
            avatar='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
            roll_number='10A-24',
            section='Grade 10-A (Science & Honors)',
            blood_group='O+ Positive',
            dob='2010-04-12',
            email='aiden.alexander@student.edupulse.edu',
            phone='+1 (555) 892-1204',
            address='742 Evergreen Terrace, Academic District, Suite 4B',
            guardian_name='Eleanor Alexander (Mother)',
            guardian_phone='+1 (555) 911-3040',
            guardian_relation='Primary Guardian',
            guardian_occupation='Senior Research Scientist',
            emergency_name='Dr. Robert Alexander',
            emergency_phone='+1 (555) 911-3041',
            emergency_relation='Father / Emergency Contact',
            medical_notes='Mild asthma inhaler kept with campus nurse; No known dietary allergies.',
            attendance_percentage=Decimal('97.4'),
            present_days=88,
            total_days=90,
            locker_number='Lock-A142',
            academic_history=[
                { 'term': 'Fall 2025 (Grade 9 Final)', 'gpa': '3.92', 'rank': '2nd / 120', 'status': 'Distinction' },
                { 'term': 'Spring 2026 (Grade 10 Midterm)', 'gpa': '3.96', 'rank': '1st / 124', 'status': 'Honors Dean List' }
            ],
            subjects=[
                { 'name': 'Advanced Physics', 'score': 96, 'grade': 'A+', 'teacher': 'Prof. David Vance' },
                { 'name': 'Pure Mathematics', 'score': 94, 'grade': 'A', 'teacher': 'Dr. Evelyn Martinez' },
                { 'name': 'Organic Chemistry', 'score': 92, 'grade': 'A', 'teacher': 'Dr. Aris Thorne' },
                { 'name': 'World Literature', 'score': 88, 'grade': 'B+', 'teacher': 'Ms. Clara Oswald' },
                { 'name': 'Computer Science', 'score': 98, 'grade': 'A+', 'teacher': 'Ms. Seraphina Vance' }
            ],
            leaves=[
                { 'date': '2026-08-14', 'reason': 'Regional Science Fair Excursion', 'approved': True },
                { 'date': '2026-09-02', 'reason': 'Medical appointment', 'approved': True }
            ],
            fee_ledger=[
                { 'date': '2026-08-10', 'desc': 'Semester 1 Tuition Installment 1', 'amount': 3200, 'status': 'PAID', 'receipt': 'REC-9941' },
                { 'date': '2026-10-15', 'desc': 'Semester 1 Tuition Installment 2', 'amount': 1000, 'status': 'DUE', 'receipt': 'PENDING' },
                { 'date': '2026-08-01', 'desc': 'Lab & Computer Lab Annual Fee', 'amount': 450, 'status': 'PAID', 'receipt': 'REC-8820' }
            ],
            issued_books=[
                { 'title': 'Quantum Mechanics for High School', 'isbn': '978-0134092669', 'issueDate': '2026-09-05', 'dueDate': '2026-09-26', 'status': 'ACTIVE' },
                { 'title': 'Introduction to Algorithms (4th Ed)', 'isbn': '978-0262046305', 'issueDate': '2026-09-01', 'dueDate': '2026-09-22', 'status': 'DUE_TODAY' }
            ],
            recent_30_days=[
                'P','P','P','P','P','P','P','P','P','P',
                'P','P','L','P','P','P','P','P','P','P',
                'P','P','P','P','P','P','P','P','P','P'
            ]
        )

        # 6. Faculty Members
        FacultyMember.objects.all().delete()
        faculty_members = [
            {
                'id': 'FAC-01',
                'name': 'Prof. David Vance',
                'department': 'Science & Physics',
                'subject': 'Physics & Astronomy',
                'weekly_hours': 20,
                'max_hours': 24,
                'class_teacher_of': 'Grade 10-A',
                'status': 'PRESENT',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                'email': 'david.vance@edupulse.edu',
                'phone': '+1 (555) 819-2031'
            },
            {
                'id': 'FAC-02',
                'name': 'Dr. Evelyn Martinez',
                'department': 'Mathematics',
                'subject': 'Calculus & Algebra',
                'weekly_hours': 22,
                'max_hours': 24,
                'class_teacher_of': 'Grade 11-Sci',
                'status': 'PRESENT',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
                'email': 'evelyn.martinez@edupulse.edu',
                'phone': '+1 (555) 712-4411'
            },
            {
                'id': 'FAC-03',
                'name': 'Marcus Rivera',
                'department': 'Humanities & History',
                'subject': 'World Civilizations',
                'weekly_hours': 16,
                'max_hours': 20,
                'class_teacher_of': 'Grade 9-B',
                'status': 'ABSENT',
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
                'email': 'marcus.rivera@edupulse.edu',
                'phone': '+1 (555) 433-8822'
            },
            {
                'id': 'FAC-04',
                'name': 'Seraphina Vance',
                'department': 'Computer Science',
                'subject': 'Data Structures & AI',
                'weekly_hours': 18,
                'max_hours': 22,
                'class_teacher_of': 'None (CS Lab Head)',
                'status': 'PRESENT',
                'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
                'email': 'seraphina.vance@edupulse.edu',
                'phone': '+1 (555) 629-1002'
            },
            {
                'id': 'FAC-05',
                'name': 'Dr. Aris Thorne',
                'department': 'Science & Physics',
                'subject': 'Chemistry & Biochemistry',
                'weekly_hours': 18,
                'max_hours': 24,
                'class_teacher_of': 'Grade 12-Sci',
                'status': 'ABSENT',
                'avatar': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
                'email': 'aris.thorne@edupulse.edu',
                'phone': '+1 (555) 512-9903'
            },
            {
                'id': 'FAC-06',
                'name': 'Ms. Clara Oswald',
                'department': 'Languages & Literature',
                'subject': 'English & Modern Literature',
                'weekly_hours': 19,
                'max_hours': 22,
                'class_teacher_of': 'Grade 9-A',
                'status': 'PRESENT',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                'email': 'clara.oswald@edupulse.edu',
                'phone': '+1 (555) 332-9011'
            }
        ]
        for fm in faculty_members:
            FacultyMember.objects.create(**fm)

        # 7. Substitutions
        Substitution.objects.all().delete()
        substitutions = [
            {
                'id': 'SUB-01',
                'absent_teacher': 'Marcus Rivera',
                'subject': 'World Civilizations',
                'grade': 'Grade 9-B',
                'period': 'Period 3 (10:15 AM - 11:00 AM)',
                'date': 'Today',
                'status': 'NEEDS_SUBSTITUTE',
                'assigned_substitute': None,
                'suggested_substitutes': [
                    { 'name': 'Ms. Clara Oswald', 'dept': 'Languages & Literature', 'freePeriod': True, 'matchScore': 92 },
                    { 'name': 'Seraphina Vance', 'dept': 'Computer Science', 'freePeriod': True, 'matchScore': 78 }
                ]
            },
            {
                'id': 'SUB-02',
                'absent_teacher': 'Dr. Aris Thorne',
                'subject': 'Chemistry & Biochemistry',
                'grade': 'Grade 12-Sci',
                'period': 'Period 5 (1:00 PM - 1:45 PM)',
                'date': 'Today',
                'status': 'ASSIGNED',
                'assigned_substitute': 'Prof. David Vance',
                'suggested_substitutes': [
                    { 'name': 'Prof. David Vance', 'dept': 'Science & Physics', 'freePeriod': True, 'matchScore': 98 }
                ]
            }
        ]
        for s in substitutions:
            Substitution.objects.create(**s)

        # 8. Timetable Slots
        TimetableSlot.objects.all().delete()
        timetable_slots = [
            {
                'period': 'Period 1',
                'time': '8:00 AM - 8:50 AM',
                'is_break': False,
                'order': 1,
                'days': {
                    'Monday': { 'subject': 'Advanced Physics', 'teacher': 'Prof. Vance', 'room': 'Lab 201', 'tag': 'indigo' },
                    'Tuesday': { 'subject': 'Pure Mathematics', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' },
                    'Wednesday': { 'subject': 'Advanced Physics', 'teacher': 'Prof. Vance', 'room': 'Lab 201', 'tag': 'indigo' },
                    'Thursday': { 'subject': 'World Literature', 'teacher': 'Ms. Oswald', 'room': 'Hall B', 'tag': 'pink' },
                    'Friday': { 'subject': 'Computer Science', 'teacher': 'Ms. Vance', 'room': 'CS Lab 1', 'tag': 'cyan' }
                }
            },
            {
                'period': 'Period 2',
                'time': '8:55 AM - 9:45 AM',
                'is_break': False,
                'order': 2,
                'days': {
                    'Monday': { 'subject': 'Pure Mathematics', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' },
                    'Tuesday': { 'subject': 'Organic Chemistry', 'teacher': 'Dr. Thorne', 'room': 'Chem Lab', 'tag': 'indigo' },
                    'Wednesday': { 'subject': 'World Literature', 'teacher': 'Ms. Oswald', 'room': 'Hall B', 'tag': 'pink' },
                    'Thursday': { 'subject': 'Computer Science', 'teacher': 'Ms. Vance', 'room': 'CS Lab 1', 'tag': 'cyan' },
                    'Friday': { 'subject': 'Pure Mathematics', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' }
                }
            },
            {
                'period': 'Period 3',
                'time': '10:00 AM - 10:50 AM',
                'is_break': False,
                'order': 3,
                'days': {
                    'Monday': { 'subject': 'World Literature', 'teacher': 'Ms. Oswald', 'room': 'Hall B', 'tag': 'pink' },
                    'Tuesday': { 'subject': 'Computer Science', 'teacher': 'Ms. Vance', 'room': 'CS Lab 1', 'tag': 'cyan' },
                    'Wednesday': { 'subject': 'Pure Mathematics', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' },
                    'Thursday': { 'subject': 'Advanced Physics', 'teacher': 'Prof. Vance', 'room': 'Lab 201', 'tag': 'indigo' },
                    'Friday': { 'subject': 'Organic Chemistry', 'teacher': 'Dr. Thorne', 'room': 'Chem Lab', 'tag': 'indigo' }
                }
            },
            {
                'period': 'Lunch Break',
                'time': '11:00 AM - 11:45 AM',
                'is_break': True,
                'order': 4,
                'title': 'Cafeteria & Wellness Garden Intermission',
                'days': {}
            },
            {
                'period': 'Period 4',
                'time': '11:50 AM - 12:40 PM',
                'is_break': False,
                'order': 5,
                'days': {
                    'Monday': { 'subject': 'Organic Chemistry', 'teacher': 'Dr. Thorne', 'room': 'Chem Lab', 'tag': 'indigo' },
                    'Tuesday': { 'subject': 'Advanced Physics', 'teacher': 'Prof. Vance', 'room': 'Lab 201', 'tag': 'indigo' },
                    'Wednesday': { 'subject': 'History & Civics', 'teacher': 'Mr. Rivera', 'room': 'Room 108', 'tag': 'amber' },
                    'Thursday': { 'subject': 'Pure Mathematics', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' },
                    'Friday': { 'subject': 'Physical Education', 'teacher': 'Coach Hayes', 'room': 'Gymnasium', 'tag': 'emerald' }
                }
            },
            {
                'period': 'Period 5',
                'time': '12:45 PM - 1:35 PM',
                'is_break': False,
                'order': 6,
                'days': {
                    'Monday': { 'subject': 'Computer Science', 'teacher': 'Ms. Vance', 'room': 'CS Lab 1', 'tag': 'cyan' },
                    'Tuesday': { 'subject': 'World Literature', 'teacher': 'Ms. Oswald', 'room': 'Hall B', 'tag': 'pink' },
                    'Wednesday': { 'subject': 'Organic Chemistry', 'teacher': 'Dr. Thorne', 'room': 'Chem Lab', 'tag': 'indigo' },
                    'Thursday': { 'subject': 'History & Civics', 'teacher': 'Mr. Rivera', 'room': 'Room 108', 'tag': 'amber' },
                    'Friday': { 'subject': 'Robotics & Capstone', 'teacher': 'Ms. Vance', 'room': 'CS Lab 1', 'tag': 'cyan' }
                }
            },
            {
                'period': 'Period 6',
                'time': '1:40 PM - 2:30 PM',
                'is_break': False,
                'order': 7,
                'days': {
                    'Monday': { 'subject': 'Club Activities', 'teacher': 'Various Leads', 'room': 'Auditorium', 'tag': 'pink' },
                    'Tuesday': { 'subject': 'Tutorial & Doubts', 'teacher': 'Prof. Vance', 'room': 'Room 104', 'tag': 'indigo' },
                    'Wednesday': { 'subject': 'Debate & Oratory', 'teacher': 'Ms. Oswald', 'room': 'Hall B', 'tag': 'amber' },
                    'Thursday': { 'subject': 'Math Olympiad Prep', 'teacher': 'Dr. Martinez', 'room': 'Room 104', 'tag': 'emerald' },
                    'Friday': { 'subject': 'Weekly Assembly', 'teacher': 'Administration', 'room': 'Main Quad', 'tag': 'indigo' }
                }
            }
        ]
        for slot in timetable_slots:
            TimetableSlot.objects.create(**slot)

        # 9. Gradebook Records
        GradebookRecord.objects.all().delete()
        gradebook_records = [
            { 'id': 'STU-01', 'roll_no': '10A-24', 'name': 'Aiden Alexander', 'math': 95, 'physics': 98, 'chem': 92, 'english': 89, 'cs': 99 },
            { 'id': 'STU-02', 'roll_no': '10A-11', 'name': 'Chloe Delacroix', 'math': 88, 'physics': 90, 'chem': 86, 'english': 94, 'cs': 91 },
            { 'id': 'STU-03', 'roll_no': '10A-03', 'name': 'Sophia Montgomery', 'math': 92, 'physics': 94, 'chem': 90, 'english': 91, 'cs': 96 },
            { 'id': 'STU-04', 'roll_no': '10A-18', 'name': 'Julian Thorne', 'math': 74, 'physics': 68, 'chem': 72, 'english': 82, 'cs': 80 },
            { 'id': 'STU-05', 'roll_no': '10A-07', 'name': 'Lucas Sterling', 'math': 81, 'physics': 79, 'chem': 84, 'english': 85, 'cs': 87 },
            { 'id': 'STU-06', 'roll_no': '10A-22', 'name': 'Zara Chen', 'math': 96, 'physics': 91, 'chem': 94, 'english': 88, 'cs': 95 }
        ]
        for gr in gradebook_records:
            GradebookRecord.objects.create(**gr)

        # 10. RBAC Matrix
        RbacPermission.objects.all().delete()
        rbac_records = [
            {
                'capability': 'Manage Fees & Collection',
                'super_admin': 'Full Access',
                'accountant': 'Full Access',
                'teacher': 'Read-Only',
                'student': 'Read-Only',
                'librarian': 'No Access'
            },
            {
                'capability': 'Approve Admissions',
                'super_admin': 'Full Access',
                'accountant': 'Read-Only',
                'teacher': 'No Access',
                'student': 'No Access',
                'librarian': 'No Access'
            },
            {
                'capability': 'Enter Grades & Attendance',
                'super_admin': 'Full Access',
                'accountant': 'No Access',
                'teacher': 'Full Access',
                'student': 'Read-Only',
                'librarian': 'No Access'
            },
            {
                'capability': 'Issue / Return Books',
                'super_admin': 'Full Access',
                'accountant': 'No Access',
                'teacher': 'Read-Only',
                'student': 'Read-Only',
                'librarian': 'Full Access'
            },
            {
                'capability': 'System Security & Audit',
                'super_admin': 'Full Access',
                'accountant': 'No Access',
                'teacher': 'No Access',
                'student': 'No Access',
                'librarian': 'No Access'
            }
        ]
        for r in rbac_records:
            RbacPermission.objects.create(**r)

        # 11. Audit Logs
        AuditLog.objects.all().delete()
        audit_logs = [
            {
                'id': 'LOG-99210',
                'timestamp': '2026-09-21 23:42:19',
                'user_id': 'admin.director@edupulse.edu',
                'action': 'RBAC Policy Update: Elevated Finance Read permissions for Grade Teachers',
                'module': 'Admin Governance',
                'ip_address': '192.168.10.45',
                'severity': 'WARNING',
                'status': 'COMPLETED'
            },
            {
                'id': 'LOG-99209',
                'timestamp': '2026-09-21 21:14:02',
                'user_id': 'bursar.sterling@edupulse.edu',
                'action': 'Fee Invoice Generated: INV-2026-006 (Student Zara Chen - $3,800)',
                'module': 'Accounts & Finance',
                'ip_address': '192.168.10.88',
                'severity': 'INFO',
                'status': 'COMPLETED'
            },
            {
                'id': 'LOG-99208',
                'timestamp': '2026-09-21 19:30:15',
                'user_id': 'david.vance@edupulse.edu',
                'action': 'Gradebook Marks Batch Saved: Physics Midterm Assessment Grade 10-A',
                'module': 'Academics & Exams',
                'ip_address': '192.168.12.14',
                'severity': 'INFO',
                'status': 'COMPLETED'
            },
            {
                'id': 'LOG-99207',
                'timestamp': '2026-09-21 17:05:40',
                'user_id': 'miriam.library@edupulse.edu',
                'action': 'Book Checked In: "Principles of Neurobiology" ISBN 978-0815344926',
                'module': 'Library System',
                'ip_address': '192.168.15.10',
                'severity': 'INFO',
                'status': 'COMPLETED'
            },
            {
                'id': 'LOG-99206',
                'timestamp': '2026-09-21 14:22:11',
                'user_id': 'sec.gateway@edupulse.edu',
                'action': 'Multiple failed PIN logins detected from IP 198.51.100.22',
                'module': 'Security & Auth',
                'ip_address': '198.51.100.22',
                'severity': 'CRITICAL',
                'status': 'BLOCKED'
            }
        ]
        for al in audit_logs:
            AuditLog.objects.create(**al)

        # 12. Books Catalog
        Book.objects.all().delete()
        books = [
            {
                'id': 'LIB-001',
                'title': 'Quantum Mechanics for High School',
                'author': 'David J. Griffiths',
                'isbn': '978-0134092669',
                'category': 'Physics',
                'total_copies': 8,
                'available_copies': 3,
                'status': 'AVAILABLE'
            },
            {
                'id': 'LIB-002',
                'title': 'Introduction to Algorithms (4th Ed)',
                'author': 'Cormen, Leiserson, Rivest, Stein',
                'isbn': '978-0262046305',
                'category': 'Computer Science',
                'total_copies': 12,
                'available_copies': 1,
                'status': 'LIMITED'
            },
            {
                'id': 'LIB-003',
                'title': 'Campbell Biology (12th Edition)',
                'author': 'Lisa A. Urry et al.',
                'isbn': '978-0135188743',
                'category': 'Biology',
                'total_copies': 10,
                'available_copies': 6,
                'status': 'AVAILABLE'
            },
            {
                'id': 'LIB-004',
                'title': 'Calculus: Early Transcendentals',
                'author': 'James Stewart',
                'isbn': '978-1285741550',
                'category': 'Mathematics',
                'total_copies': 15,
                'available_copies': 8,
                'status': 'AVAILABLE'
            },
            {
                'id': 'LIB-005',
                'title': 'The Great Gatsby',
                'author': 'F. Scott Fitzgerald',
                'isbn': '978-0743273565',
                'category': 'Literature',
                'total_copies': 20,
                'available_copies': 0,
                'status': 'BORROWED_OUT'
            }
        ]
        for b in books:
            Book.objects.create(**b)

        # 13. Book Loans
        BookLoan.objects.all().delete()
        loans = [
            {
                'id': 'LOAN-8801',
                'book': Book.objects.filter(id='LIB-002').first(),
                'book_title': 'Introduction to Algorithms (4th Ed)',
                'borrower_name': 'Aiden Alexander',
                'borrower_role': 'Student (10-A)',
                'borrow_date': '2026-09-01',
                'due_date': '2026-09-22',
                'status': 'DUE_TODAY',
                'fine': '$0.00'
            },
            {
                'id': 'LOAN-8802',
                'book': Book.objects.filter(id='LIB-005').first(),
                'book_title': 'The Great Gatsby',
                'borrower_name': 'Marcus Rivera',
                'borrower_role': 'Faculty (History)',
                'borrow_date': '2026-08-15',
                'due_date': '2026-09-05',
                'status': 'OVERDUE',
                'fine': '$17.00'
            },
            {
                'id': 'LOAN-8803',
                'book': Book.objects.filter(id='LIB-001').first(),
                'book_title': 'Quantum Mechanics for High School',
                'borrower_name': 'Aiden Alexander',
                'borrower_role': 'Student (10-A)',
                'borrow_date': '2026-09-05',
                'due_date': '2026-09-26',
                'status': 'ACTIVE',
                'fine': '$0.00'
            }
        ]
        for l in loans:
            BookLoan.objects.create(**l)

        self.stdout.write(self.style.SUCCESS("Successfully seeded EduPulse ERP database!"))
