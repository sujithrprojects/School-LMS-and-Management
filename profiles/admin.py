from django.contrib import admin
from .models import (StudentProfile,EmployeeProfile,ParentProfile)
# Register your models here.

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display=(
        'admission_number',
        'user',
        'date_of_birth',
        'admission_date'
    )
    search_fields=(
        "admission_number",
        "user__username",
        "user__email"
    )
@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display=(
        "employee_id",
        "user",
        "employee_type",
        "joining_date"
    )
    search_fields=(
        'employee_id',
        'user__username',
        'user__email'
    )
@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display=(
        'user',
        'phone',
        'occuppation',
        
    )
    search_fields=(
        'user__username',
        'user__email'
    )