from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
# Create your models here.
import uuid
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN="ADMIN","Admin"
        STUDENT="STUDENT","Student"
        TEACHER="TEACHER","Teacher"
        PARENT="PARENT","Parent"
        ACCOUNTANT="ACCOUNTANT","Accountant"
        STAFF="STAFF","Staff"
    id=models.UUIDField(
            primary_key=True,
            default=uuid.uuid4,
            editable=False
            
        )    
    role=models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )
    
    objects=CustomUserManager()
    def __str__(self):
        return self.username


        