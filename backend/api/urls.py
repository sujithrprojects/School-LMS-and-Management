from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    login_view, FinancialMetricViewSet, FeeRecordViewSet, PayrollViewSet,
    ApplicantViewSet, StudentProfileViewSet, FacultyViewSet, SubstitutionViewSet,
    TimetableSlotViewSet, GradebookViewSet, RbacPermissionViewSet, AuditLogViewSet,
    BookViewSet, BookLoanViewSet
)

router = DefaultRouter()
router.register(r'metrics', FinancialMetricViewSet, basename='metrics')
router.register(r'fees', FeeRecordViewSet, basename='fees')
router.register(r'payroll', PayrollViewSet, basename='payroll')
router.register(r'applicants', ApplicantViewSet, basename='applicants')
router.register(r'students', StudentProfileViewSet, basename='students')
router.register(r'faculty', FacultyViewSet, basename='faculty')
router.register(r'substitutions', SubstitutionViewSet, basename='substitutions')
router.register(r'timetable', TimetableSlotViewSet, basename='timetable')
router.register(r'gradebook', GradebookViewSet, basename='gradebook')
router.register(r'rbac', RbacPermissionViewSet, basename='rbac')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')
router.register(r'books', BookViewSet, basename='books')
router.register(r'loans', BookLoanViewSet, basename='loans')

urlpatterns = [
    path('auth/login/', login_view, name='api-login'),
    path('', include(router.urls)),
]
