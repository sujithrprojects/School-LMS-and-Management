from django.contrib.auth.models import UserManager

class CustomUserManager(UserManager):
    def create_user(self, username,email=None,password=None,**extra_fields):
        if not email:
            raise ValueError("Email is required")
        user=self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
    
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True)
        return self.create_user(
            username=username,
            email=email,
            password=password,
            **extra_fields
        )
        
    