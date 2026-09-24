from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets=UserAdmin.fieldsets+(
        (
            "School information",
            {
                "fields":("role",),
            },
            
        ),
    )
    add_fieldsets=UserAdmin.add_fieldsets+(
        (
            "School information",
            {
                "fields":("role",),
            },
            
        ),
    )