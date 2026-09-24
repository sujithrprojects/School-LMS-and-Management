from rest_framework import serializers
from .models import (
    FinancialMetric, FeeRecord, PayrollRecord,
    Applicant, StudentProfile, FacultyMember, Substitution,
    TimetableSlot, GradebookRecord, RbacPermission, AuditLog,
    Book, BookLoan
)

class FinancialMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialMetric
        fields = '__all__'


class FeeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeRecord
        fields = '__all__'


class PayrollRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollRecord
        fields = '__all__'


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'


class FacultyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyMember
        fields = '__all__'


class SubstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substitution
        fields = '__all__'


class TimetableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimetableSlot
        fields = '__all__'


class GradebookRecordSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    avg = serializers.SerializerMethodField()
    grade = serializers.SerializerMethodField()

    class Meta:
        model = GradebookRecord
        fields = ['id', 'roll_no', 'name', 'grade_class', 'math', 'physics', 'chem', 'english', 'cs', 'total', 'avg', 'grade']

    def get_total(self, obj):
        return (obj.math or 0) + (obj.physics or 0) + (obj.chem or 0) + (obj.english or 0) + (obj.cs or 0)

    def get_avg(self, obj):
        total = self.get_total(obj)
        return round(total / 5.0, 1)

    def get_grade(self, obj):
        avg = self.get_avg(obj)
        if avg >= 95:
            return 'A+'
        if avg >= 90:
            return 'A'
        if avg >= 80:
            return 'B+'
        if avg >= 70:
            return 'B'
        if avg >= 60:
            return 'C'
        return 'F'


class RbacPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RbacPermission
        fields = '__all__'


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLoan
        fields = '__all__'
