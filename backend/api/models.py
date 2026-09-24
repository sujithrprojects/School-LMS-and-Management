from django.db import models

# ==========================================
# Module 1: Accounts & Financial Management
# ==========================================

class FinancialMetric(models.Model):
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=1248500.00)
    pending_dues = models.DecimalField(max_digits=12, decimal_places=2, default=186200.00)
    monthly_payroll = models.DecimalField(max_digits=12, decimal_places=2, default=142800.00)
    operational_expenses = models.DecimalField(max_digits=12, decimal_places=2, default=64350.00)
    net_operating_balance = models.DecimalField(max_digits=12, decimal_places=2, default=1041350.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Financial Metrics (Balance: ${self.net_operating_balance})"


class FeeRecord(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('PARTIAL', 'Partial'),
        ('PENDING', 'Pending'),
        ('OVERDUE', 'Overdue'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'INV-2026-001'
    student_name = models.CharField(max_length=150)
    admission_no = models.CharField(max_length=50)
    grade = models.CharField(max_length=50)
    academic_year = models.CharField(max_length=20, default='2026-2027')
    total_fee = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.CharField(max_length=30)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_mode = models.CharField(max_length=50, default='Campus SSO')
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_paid_date = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.student_name} ({self.status})"


class PayrollRecord(models.Model):
    STATUS_CHOICES = [
        ('DISBURSED', 'Disbursed'),
        ('PENDING', 'Pending'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'PAY-FAC-01'
    name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    penalties = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    account_number = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.id} - {self.name} (${self.net_salary})"


# ==========================================
# Module 2: Admissions & Student Registration
# ==========================================

class Applicant(models.Model):
    STAGE_CHOICES = [
        ('submitted', 'Application Submitted'),
        ('exam_scheduled', 'Entrance Exam Scheduled'),
        ('interview', 'Interview Round'),
        ('verification', 'Document Verification'),
        ('enrolled', 'Fees Paid & Enrolled'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'APP-101'
    name = models.CharField(max_length=150)
    grade = models.CharField(max_length=50)
    score = models.CharField(max_length=50, default='90/100')
    applied_date = models.CharField(max_length=30)
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='submitted')
    guardian = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.id} - {self.name} ({self.stage})"


class StudentProfile(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'EDU-2024-8891'
    name = models.CharField(max_length=150)
    avatar = models.TextField()
    roll_number = models.CharField(max_length=50)
    section = models.CharField(max_length=100)
    blood_group = models.CharField(max_length=20)
    dob = models.CharField(max_length=30, blank=True, default='2010-04-12')
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.TextField()

    # Guardian & Emergency
    guardian_name = models.CharField(max_length=150)
    guardian_phone = models.CharField(max_length=50)
    guardian_relation = models.CharField(max_length=100)
    guardian_occupation = models.CharField(max_length=100)

    emergency_name = models.CharField(max_length=150)
    emergency_phone = models.CharField(max_length=50)
    emergency_relation = models.CharField(max_length=100)

    medical_notes = models.TextField(blank=True, default='')

    # Stats
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=1, default=97.4)
    present_days = models.IntegerField(default=88)
    total_days = models.IntegerField(default=90)
    recent_30_days = models.JSONField(default=list)
    locker_number = models.CharField(max_length=50, default='Lock-A142')

    # Nested sub-tables stored as JSON or via relations for flexibility
    academic_history = models.JSONField(default=list)
    subjects = models.JSONField(default=list)
    leaves = models.JSONField(default=list)
    fee_ledger = models.JSONField(default=list)
    issued_books = models.JSONField(default=list)

    def __str__(self):
        return f"{self.id} - {self.name} ({self.section})"


# ==========================================
# Module 3: Faculty & Staff Management
# ==========================================

class FacultyMember(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'FAC-01'
    name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    weekly_hours = models.IntegerField(default=20)
    max_hours = models.IntegerField(default=24)
    class_teacher_of = models.CharField(max_length=100, default='None')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PRESENT')
    avatar = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.id} - {self.name} ({self.department})"


class Substitution(models.Model):
    STATUS_CHOICES = [
        ('NEEDS_SUBSTITUTE', 'Needs Substitute'),
        ('ASSIGNED', 'Assigned'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'SUB-01'
    absent_teacher = models.CharField(max_length=150)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    period = models.CharField(max_length=100)
    date = models.CharField(max_length=30, default='Today')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='NEEDS_SUBSTITUTE')
    assigned_substitute = models.CharField(max_length=150, null=True, blank=True)
    suggested_substitutes = models.JSONField(default=list)

    def __str__(self):
        return f"{self.id} - Cover for {self.absent_teacher} ({self.status})"


# ==========================================
# Module 4: Academics, Timetable & Gradebook
# ==========================================

class TimetableSlot(models.Model):
    period = models.CharField(max_length=50)
    time = models.CharField(max_length=50)
    is_break = models.BooleanField(default=False)
    title = models.CharField(max_length=150, null=True, blank=True)
    days = models.JSONField(default=dict)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.period} ({self.time})"


class GradebookRecord(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'STU-01'
    roll_no = models.CharField(max_length=50)
    name = models.CharField(max_length=150)
    grade_class = models.CharField(max_length=50, default='Grade 10-A')
    math = models.IntegerField(default=0)
    physics = models.IntegerField(default=0)
    chem = models.IntegerField(default=0)
    english = models.IntegerField(default=0)
    cs = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.roll_no} - {self.name}"


# ==========================================
# Module 5: Admin & Governance
# ==========================================

class RbacPermission(models.Model):
    capability = models.CharField(max_length=150, unique=True)
    super_admin = models.CharField(max_length=50, default='Full Access')
    accountant = models.CharField(max_length=50, default='No Access')
    teacher = models.CharField(max_length=50, default='No Access')
    student = models.CharField(max_length=50, default='No Access')
    librarian = models.CharField(max_length=50, default='No Access')

    def __str__(self):
        return self.capability


class AuditLog(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'LOG-99210'
    timestamp = models.CharField(max_length=50)
    user_id = models.CharField(max_length=150)
    action = models.TextField()
    module = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=50)
    severity = models.CharField(max_length=20, default='INFO')
    status = models.CharField(max_length=20, default='COMPLETED')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.id} - [{self.severity}] {self.action[:40]}"


# ==========================================
# Module 6: Library Hub
# ==========================================

class Book(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('LIMITED', 'Limited'),
        ('BORROWED_OUT', 'Borrowed Out'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'LIB-001'
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=150)
    isbn = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='AVAILABLE')

    def __str__(self):
        return f"{self.title} by {self.author}"


class BookLoan(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('DUE_TODAY', 'Due Today'),
        ('OVERDUE', 'Overdue'),
        ('RETURNED', 'Returned'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g., 'LOAN-8801'
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True, related_name='loans')
    book_title = models.CharField(max_length=255)
    borrower_name = models.CharField(max_length=150)
    borrower_role = models.CharField(max_length=100)
    borrow_date = models.CharField(max_length=30)
    due_date = models.CharField(max_length=30)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ACTIVE')
    fine = models.CharField(max_length=30, default='$0.00')

    def __str__(self):
        return f"{self.id} - {self.book_title} -> {self.borrower_name}"
