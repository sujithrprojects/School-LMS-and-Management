from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=[
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role"
        ]
#Never return a password in API response
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(
        write_only=True,
        min_length=8
    )
    
    class Meta:
        model=User
        fields=[
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role"
        ]
    def create(self, validated_data):
        password=validated_data.pop("password")
        user=User.objects.create(
            password=password,
            **validated_data
        )
        return user
    
    