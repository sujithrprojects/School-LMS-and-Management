from datetime import date
from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import (
    FinancialMetric, FeeRecord, PayrollRecord,
    Applicant, StudentProfile, FacultyMember, Substitution,
    TimetableSlot, GradebookRecord, RbacPermission, AuditLog,
    Book, BookLoan
)
from .serializers import (
    FinancialMetricSerializer, FeeRecordSerializer, PayrollRecordSerializer,
    ApplicantSerializer, StudentProfileSerializer, FacultyMemberSerializer, SubstitutionSerializer,
    TimetableSlotSerializer, GradebookRecordSerializer, RbacPermissionSerializer, AuditLogSerializer,
    BookSerializer, BookLoanSerializer
)


# ==========================================
# Auth / Session Endpoint
# ==========================================
@api_view(['POST'])
def login_view(request):
    """
    Simulated SSO / Role Login for EduPulse Next-Gen ERP
    """
    role = request.data.get('role', 'admin')
    email = request.data.get('email', '')

    role_profiles = {
        'admin': {
            'id': 'admin',
            'name': 'Super Admin',
            'badge': 'Super Admin Console',
            'roleTag': 'ADMIN',
            'email': email or 'admin.director@edupulse.edu',
            'themeColor': 'indigo'
        },
        'accountant': {
            'id': 'accountant',
            'name': 'Eleanor Sterling',
            'badge': 'Chief Bursar & Accounts',
            'roleTag': 'ACCOUNTANT',
            'email': email or 'bursar.sterling@edupulse.edu',
            'themeColor': 'amber'
        },
        'teacher': {
            'id': 'teacher',
            'name': 'Prof. David Vance',
            'badge': 'Senior Faculty & Class Head',
            'roleTag': 'TEACHER',
            'email': email or 'david.vance@edupulse.edu',
            'themeColor': 'emerald'
        },
        'student': {
            'id': 'student',
            'name': 'Aiden Alexander',
            'badge': 'Grade 10-A Honors Student',
            'roleTag': 'STUDENT / PARENT',
            'email': email or 'aiden.alexander@student.edupulse.edu',
            'themeColor': 'cyan'
        },
        'librarian': {
            'id': 'librarian',
            'name': 'Miriam O’Connor',
            'badge': 'Chief Information & Librarian',
            'roleTag': 'LIBRARIAN',
            'email': email or 'miriam.library@edupulse.edu',
            'themeColor': 'pink'
        }
    }

    user_info = role_profiles.get(role, role_profiles['admin'])
    return Response({
        'success': True,
        'token': f"edupulse-session-token-{role}-2026",
        'user': user_info
    })


# ==========================================
# Module 1: Accounts & Financial Management
# ==========================================

class FinancialMetricViewSet(viewsets.ModelViewSet):
    queryset = FinancialMetric.objects.all()
    serializer_class = FinancialMetricSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        metric = FinancialMetric.objects.first()
        if not metric:
            metric = FinancialMetric.objects.create()
        return Response(FinancialMetricSerializer(metric).data)


class FeeRecordViewSet(viewsets.ModelViewSet):
    queryset = FeeRecord.objects.all()
    serializer_class = FeeRecordSerializer

    def get_queryset(self):
        qs = FeeRecord.objects.all()
        status_param = self.request.query_params.get('status')
        grade_param = self.request.query_params.get('grade')
        academic_year = self.request.query_params.get('academic_year')
        search = self.request.query_params.get('search')

        if status_param and status_param != 'ALL':
            qs = qs.filter(status=status_param)
        if grade_param and grade_param != 'ALL':
            qs = qs.filter(grade__icontains=grade_param)
        if academic_year and academic_year != 'ALL':
            qs = qs.filter(academic_year=academic_year)
        if search:
            qs = qs.filter(
                models.Q(student_name__icontains=search) |
                models.Q(admission_no__icontains=search) |
                models.Q(id__icontains=search)
            )
        return qs

    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        record = self.get_object()
        amount = Decimal(str(request.data.get('amount', 0)))
        payment_mode = request.data.get('payment_mode', 'Campus SSO')

        if amount <= 0:
            return Response({'error': 'Payment amount must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)

        record.paid_amount += amount
        record.due_amount = max(Decimal('0.00'), record.total_fee - record.paid_amount - record.discount)
        if record.due_amount == 0:
            record.status = 'PAID'
        else:
            record.status = 'PARTIAL'
        
        record.payment_mode = payment_mode
        record.last_paid_date = date.today().isoformat()
        record.save()

        # Update metrics
        metric = FinancialMetric.objects.first()
        if metric:
            metric.total_revenue += amount
            metric.pending_dues = max(Decimal('0.00'), metric.pending_dues - amount)
            metric.net_operating_balance += amount
            metric.save()

        # Create audit log
        AuditLog.objects.create(
            id=f"LOG-{AuditLog.objects.count() + 99211}",
            timestamp=f"{date.today()} 12:00:00",
            user_id="bursar.sterling@edupulse.edu",
            action=f"Payment Recorded: ${amount} for {record.student_name} ({record.id})",
            module="Accounts & Finance",
            ip_address="192.168.10.88",
            severity="INFO",
            status="COMPLETED"
        )

        return Response(FeeRecordSerializer(record).data)

    @action(detail=True, methods=['post'])
    def adjust_discount(self, request, pk=None):
        record = self.get_object()
        discount_amount = Decimal(str(request.data.get('discount', 0)))
        record.discount = discount_amount
        record.due_amount = max(Decimal('0.00'), record.total_fee - record.paid_amount - record.discount)
        if record.due_amount == 0 and record.paid_amount > 0:
            record.status = 'PAID'
        record.save()
        return Response(FeeRecordSerializer(record).data)


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = PayrollRecord.objects.all()
    serializer_class = PayrollRecordSerializer

    @action(detail=True, methods=['post'])
    def disburse(self, request, pk=None):
        record = self.get_object()
        record.status = 'DISBURSED'
        record.save()
        return Response(PayrollRecordSerializer(record).data)

    @action(detail=False, methods=['post'])
    def bulk_disburse(self, request):
        pending = PayrollRecord.objects.filter(status='PENDING')
        count = pending.count()
        pending.update(status='DISBURSED')
        return Response({'message': f'Bulk disbursed {count} faculty payroll records successfully.'})


# ==========================================
# Module 2: Admissions & Student Registration
# ==========================================

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer

    def get_queryset(self):
        qs = Applicant.objects.all()
        stage = self.request.query_params.get('stage')
        grade = self.request.query_params.get('grade')
        search = self.request.query_params.get('search')

        if stage and stage != 'ALL':
            qs = qs.filter(stage=stage)
        if grade and grade != 'ALL':
            qs = qs.filter(grade__icontains=grade)
        if search:
            qs = qs.filter(
                models.Q(name__icontains=search) |
                models.Q(guardian__icontains=search) |
                models.Q(id__icontains=search)
            )
        return qs

    @action(detail=True, methods=['post'])
    def update_stage(self, request, pk=None):
        applicant = self.get_object()
        new_stage = request.data.get('stage')
        valid_stages = ['submitted', 'exam_scheduled', 'interview', 'verification', 'enrolled']
        if new_stage in valid_stages:
            applicant.stage = new_stage
            applicant.save()
            return Response(ApplicantSerializer(applicant).data)
        return Response({'error': 'Invalid stage'}, status=status.HTTP_400_BAD_REQUEST)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer

    @action(detail=True, methods=['post'])
    def pay_fee(self, request, pk=None):
        profile = self.get_object()
        installment_idx = request.data.get('index', None)
        
        ledger = profile.fee_ledger or []
        updated = False
        for i, item in enumerate(ledger):
            if installment_idx is not None and i == installment_idx:
                item['status'] = 'PAID'
                item['receipt'] = f"REC-SSO-{1000 + i}"
                updated = True
                break
            elif installment_idx is None and item.get('status') == 'DUE':
                item['status'] = 'PAID'
                item['receipt'] = 'REC-SSO-9912'
                updated = True
                break

        if updated:
            profile.fee_ledger = ledger
            profile.save()
            return Response(StudentProfileSerializer(profile).data)
        return Response({'message': 'No due fees found to settle.'})


# ==========================================
# Module 3: Faculty & Staff Management
# ==========================================

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = FacultyMember.objects.all()
    serializer_class = FacultyMemberSerializer

    def get_queryset(self):
        qs = FacultyMember.objects.all()
        dept = self.request.query_params.get('department')
        search = self.request.query_params.get('search')
        if dept and dept != 'ALL':
            qs = qs.filter(department=dept)
        if search:
            qs = qs.filter(
                models.Q(name__icontains=search) |
                models.Q(subject__icontains=search) |
                models.Q(class_teacher_of__icontains=search)
            )
        return qs

    @action(detail=True, methods=['post'])
    def toggle_attendance(self, request, pk=None):
        faculty = self.get_object()
        faculty.status = 'ABSENT' if faculty.status == 'PRESENT' else 'PRESENT'
        faculty.save()
        return Response(FacultyMemberSerializer(faculty).data)


class SubstitutionViewSet(viewsets.ModelViewSet):
    queryset = Substitution.objects.all()
    serializer_class = SubstitutionSerializer

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        sub = self.get_object()
        teacher_name = request.data.get('teacher_name')
        if not teacher_name:
            return Response({'error': 'Teacher name required'}, status=status.HTTP_400_BAD_REQUEST)
        
        sub.assigned_substitute = teacher_name
        sub.status = 'ASSIGNED'
        sub.save()
        return Response(SubstitutionSerializer(sub).data)


# ==========================================
# Module 4: Academics, Timetable & Gradebook
# ==========================================

class TimetableSlotViewSet(viewsets.ModelViewSet):
    queryset = TimetableSlot.objects.all()
    serializer_class = TimetableSlotSerializer


class GradebookViewSet(viewsets.ModelViewSet):
    queryset = GradebookRecord.objects.all()
    serializer_class = GradebookRecordSerializer

    def get_queryset(self):
        qs = GradebookRecord.objects.all()
        grade_class = self.request.query_params.get('grade_class')
        if grade_class and grade_class != 'ALL':
            qs = qs.filter(grade_class=grade_class)
        return qs

    @action(detail=False, methods=['post'])
    def batch_update(self, request):
        """
        Expects a list of records or a single record update: { id: 'STU-01', subject: 'math', value: 95 }
        """
        data = request.data
        if isinstance(data, list):
            for item in data:
                record = GradebookRecord.objects.filter(id=item.get('id')).first()
                if record:
                    for field in ['math', 'physics', 'chem', 'english', 'cs']:
                        if field in item:
                            setattr(record, field, item[field])
                    record.save()
        elif isinstance(data, dict):
            record_id = data.get('id')
            subject = data.get('subject')
            value = data.get('value')
            record = GradebookRecord.objects.filter(id=record_id).first()
            if record and subject in ['math', 'physics', 'chem', 'english', 'cs']:
                setattr(record, subject, int(value))
                record.save()
                return Response(GradebookRecordSerializer(record).data)

        records = GradebookRecord.objects.all()
        return Response(GradebookRecordSerializer(records, many=True).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        records = GradebookRecord.objects.all()
        averages = [GradebookRecordSerializer(r).data['avg'] for r in records]
        if not averages:
            return Response({'mean': 0, 'median': 0, 'highest': 0})
        
        mean_score = round(sum(averages) / len(averages), 1)
        sorted_avgs = sorted(averages)
        n = len(sorted_avgs)
        median_score = (sorted_avgs[n // 2 - 1] + sorted_avgs[n // 2]) / 2 if n % 2 == 0 else sorted_avgs[n // 2]
        highest_score = max(averages)

        return Response({
            'mean': mean_score,
            'median': round(median_score, 1),
            'highest': round(highest_score, 1),
            'student_count': n
        })


# ==========================================
# Module 5: Admin & Governance
# ==========================================

class RbacPermissionViewSet(viewsets.ModelViewSet):
    queryset = RbacPermission.objects.all()
    serializer_class = RbacPermissionSerializer

    @action(detail=True, methods=['post'])
    def toggle_permission(self, request, pk=None):
        perm = self.get_object()
        role_key = request.data.get('role_key')  # e.g., 'super_admin', 'teacher', etc.
        cycle = {
            'Full Access': 'Read-Only',
            'Read-Only': 'No Access',
            'No Access': 'Full Access'
        }

        if hasattr(perm, role_key):
            curr = getattr(perm, role_key)
            next_val = cycle.get(curr, 'Full Access')
            setattr(perm, role_key, next_val)
            perm.save()

            # Record audit log
            AuditLog.objects.create(
                id=f"LOG-{AuditLog.objects.count() + 99212}",
                timestamp=f"{date.today()} 14:00:00",
                user_id="admin.director@edupulse.edu",
                action=f"RBAC Policy Modified: {perm.capability} -> [{role_key}] set to {next_val}",
                module="Admin Governance",
                ip_address="192.168.10.45",
                severity="WARNING",
                status="COMPLETED"
            )

            return Response(RbacPermissionSerializer(perm).data)
        return Response({'error': f'Role {role_key} not recognized'}, status=status.HTTP_400_BAD_REQUEST)


class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        qs = AuditLog.objects.all()
        severity = self.request.query_params.get('severity')
        search = self.request.query_params.get('search')
        if severity and severity != 'ALL':
            qs = qs.filter(severity=severity)
        if search:
            qs = qs.filter(
                models.Q(action__icontains=search) |
                models.Q(user_id__icontains=search) |
                models.Q(module__icontains=search) |
                models.Q(ip_address__icontains=search)
            )
        return qs


# ==========================================
# Module 6: Library Hub
# ==========================================

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        qs = Book.objects.all()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        if category and category != 'ALL':
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(
                models.Q(title__icontains=search) |
                models.Q(author__icontains=search) |
                models.Q(isbn__icontains=search) |
                models.Q(category__icontains=search)
            )
        return qs


class BookLoanViewSet(viewsets.ModelViewSet):
    queryset = BookLoan.objects.all()
    serializer_class = BookLoanSerializer

    @action(detail=False, methods=['post'])
    def issue_book(self, request):
        """
        Issues a book to a borrower and updates catalog inventory count
        """
        book_id = request.data.get('book_id')
        book_title = request.data.get('book_title')
        borrower_name = request.data.get('borrower_name')
        borrower_role = request.data.get('borrower_role', 'Student')
        due_date = request.data.get('due_date')

        if not borrower_name:
            return Response({'error': 'Borrower name is required'}, status=status.HTTP_400_BAD_REQUEST)

        book = None
        if book_id:
            book = Book.objects.filter(id=book_id).first()
        elif book_title:
            book = Book.objects.filter(title__iexact=book_title).first()

        if book:
            if book.available_copies <= 0:
                return Response({'error': f'"{book.title}" is currently out of stock.'}, status=status.HTTP_400_BAD_REQUEST)
            book.available_copies -= 1
            if book.available_copies == 0:
                book.status = 'BORROWED_OUT'
            elif book.available_copies <= 2:
                book.status = 'LIMITED'
            book.save()
            final_title = book.title
        else:
            final_title = book_title or "Unknown Book"

        loan_id = f"LOAN-{BookLoan.objects.count() + 8804}"
        loan = BookLoan.objects.create(
            id=loan_id,
            book=book,
            book_title=final_title,
            borrower_name=borrower_name,
            borrower_role=borrower_role,
            borrow_date=date.today().isoformat(),
            due_date=due_date or date.today().isoformat(),
            status='ACTIVE',
            fine='$0.00'
        )

        return Response(BookLoanSerializer(loan).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        loan = self.get_object()
        book = loan.book
        if not book and loan.book_title:
            book = Book.objects.filter(title__iexact=loan.book_title).first()

        if book:
            book.available_copies = min(book.total_copies, book.available_copies + 1)
            book.status = 'AVAILABLE' if book.available_copies > 2 else 'LIMITED'
            book.save()

        loan.delete()
        return Response({'message': f'Book "{loan.book_title}" returned successfully.'})
