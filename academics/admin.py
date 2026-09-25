from django.contrib import admin
from .models import (AcademicYear, SchoolClass, Section,ClassSection,Subject)
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
    