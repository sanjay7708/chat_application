from rest_framework import serializers
from django.contrib.auth.models import User
from . models import Profile
class SignUpSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    confirm_password=serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=['username','email','password','confirm_password']
    
    def validate(self,data):
        if data['password']!=data['confirm_password']:
            raise serializers.ValidationError("password does not match")
        return data
    
    def create(self,validated_data):
        validated_data.pop('confirm_password')
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']

        )
        return user



class UserSerializer(serializers.ModelSerializer):
    profile_image=serializers.ImageField(source='profile.image',read_only=True,use_url=True)
    last_seen=serializers.DateTimeField(source='profile.last_seen',read_only=True)
    is_active=serializers.BooleanField(source='profile.is_active',read_only=True)
    class Meta:
        model=User
        fields=['id','username','email','profile_image','last_seen','is_active']



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields=['image']