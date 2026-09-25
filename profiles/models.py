from django.db import models
from django.conf import settings
# Create your models here.
import uuid

class StudentProfile(models.Model):
    id=models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
        
    )
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
    )
    admission_number=models.CharField(
        max_length=30,
        unique=True
    )
    date_of_birth=models.DateField()
    admission_date=models.DateField()
    
    phone=models.CharField(
        max_length=15,
        blank=True
    )
    address=models.TextField(blank=True) 

    def __str__(self):
        return self.admission_number

class ParentProfile(models.Model):
    id=models.UUIDField(
            primary_key=True,
            default=uuid.uuid4,
            editable=False
            
        )
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="parent_profile"
    )
    phone=models.CharField(
        max_length=15,
        blank=True
    )
    occuppation=models.CharField(
        max_length=100,
        blank=True
    )
    address=models.TextField(
        blank=True
    )
    def __str__(self):
        return self.user.get_full_name()
    
class EmployeeProfile(models.Model):
    id=models.UUIDField(
            primary_key=True,
            default=uuid.uuid4,
            editable=False
            
        )
    class EmployeeType(models.TextChoices):
        TEACHER="TEACHER","Teacher"
        LIBRARIAN="LIBRARIAN","Librarian"
        ACCOUNTANT="ACCOUNTANT","Accountant"
        ADMINISTRATIVE="ADMINISTRATIVE","Administrative"
        SUPPORT="SUPPORT","Support"
    
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )
    employee_id=models.CharField(max_length=30,
                                 unique=True)
    employee_type=models.CharField(
        max_length=50,
        choices=EmployeeType.choices
    )
    joining_date=models.DateField()
    phone=models.CharField(
        max_length=15,
        blank=True
    )
    address=models.TextField(
        blank=True
    )
    def __str__(self):
        return self.employee_id
    
class StudentGuardian(models.Model):
    RELATIONSHIP_CHOICES=[
        ('FATHER','Father'),
        ('MOTHER','Mother'),
        ('GUARDIAN','Guardian'),
        ('OTHER','Other')
    ]
    id=models.UUIDField(
                primary_key=True,
                default=uuid.uuid4,
                editable=False
                
            )
    student=models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='students'
    )
    parent=models.ForeignKey(
        ParentProfile,
        on_delete=models.CASCADE,
        related_name='guardians')
    relationship=models.CharField(max_length=30,choices=RELATIONSHIP_CHOICES)
    is_primary=models.BooleanField(default=False)
    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=['student','parent'],
                name='unique_student_parent'
            ),
            
        ]
    def __str__(self):
        return f"{self.parent}-{self.student}"
    