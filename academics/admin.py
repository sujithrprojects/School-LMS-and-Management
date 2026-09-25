from django.contrib import admin
from .models import (AcademicYear, SchoolClass, Section,ClassSection,Subject,Enrollment)
# Register your models here.
@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name',)
    ordering = ('order',)
    
@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
@admin.register(ClassSection)
class ClassSectionAdmin(admin.ModelAdmin):
    list_display=[
        "school_class",
        "section",
        "academic_year"
    ]
    list_filter=(
        "academic_year",
        "school_class",
        "section"
    )
    
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display=[
        "name","code"
    ]
    search_fields=(
        "name",
        "code"
    )
    
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "class_section",
        "roll_number",
        "status",
        "enrollment_date",
    )

    list_filter = (
        "status",
        "class_section__academic_year",
        "class_section__school_class",
        "class_section__section",
    )

    search_fields = (
        "student__admission_number",
        "student__user__first_name",
        "student__user__last_name",
        "student__user__email",
    )