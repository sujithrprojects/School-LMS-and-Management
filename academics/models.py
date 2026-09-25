from django.db import models
import uuid
from profiles.models import StudentProfile
# Create your models here.
class AcademicYear(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=100,unique=True)
    start_date=models.DateField()
    end_date=models.DateField()
    is_active=models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class SchoolClass(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=100,unique=True)
    order=models.PositiveBigIntegerField(unique=True)    
    def __str__(self):
        return self.name
    
class Section(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=100,unique=True)
    def __str__(self):
        return self.name
    

class ClassSection(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school_class=models.ForeignKey(SchoolClass,
                                   on_delete=models.PROTECT,
                                   related_name='class_sections')
    academic_year=models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name='class_sections'
        
    )
    section=models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name='class_sections'
    )
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=[
                    "academic_year",
                    "school_class",
                    "section",
                ],
                name="unique_class_section_as_per_year"
            )
        ]
    def __str__(self):
        return f"{self.school_class.name}-{self.section.name}-({self.academic_year.name})"
    
class Subject(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=100)
    code=models.CharField(max_length=20,unique=True)
    def __str__(self):
        return f"{self.name} ({self.code})"

    
class Enrollment(models.Model):
    STATUS_CHOICES=[
        ('ACTIVE','Active'),
        ('PROMOTED','Promoted'),
        ("TRANSFERRED",'Transferred'),
        ("COMPLETED","Completed")
    ]
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student=models.ForeignKey(
        StudentProfile,
        on_delete=models.PROTECT,
        related_name="enrollments")
    class_section=models.ForeignKey(
        ClassSection,
        on_delete=models.PROTECT,
        related_name="enrollments"
        
    )
    roll_number=models.PositiveBigIntegerField(
        null=True,
        blank=True
    )
    enrollment_date=models.DateField(auto_now_add=True)
    status=models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "class_section"],
                name="unique_student_class_section"
            ),

            models.UniqueConstraint(
                fields=["class_section", "roll_number"],
                name="unique_roll_number_per_class_section"
            ),
        ]

    def __str__(self):
        return f"{self.student} - {self.class_section}"
    
    