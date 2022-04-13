from distutils.command.upload import upload
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from apps.accounts.models import Relationship
from versatileimagefield.serializers import VersatileImageFieldSerializer
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

User = get_user_model()

class LoginSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            "email",
            "password"
        )


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            "pk",
            "email",
            "username",
            "password",
            "avatar",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "is_superuser": {"write_only": True},
            "is_staff": {"write_only": True},
        }

    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(**validated_data)
        if user:
            Token.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.username = validated_data.get("username", instance.username)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.is_staff = validated_data.get("is_staff", instance.is_staff)
        instance.is_superuser = validated_data.get("is_superuser", instance.is_superuser)
        password = validated_data.get("password")
        if password:
            instance.password = make_password(password)
        else:
            instance.password = instance.password
        instance.save()
        return instance


class RelationshipSerializer(ModelSerializer):
    class Meta:
        model = Relationship
        fields=(
            "pk",
            "from_person",
            "to_person",
            "status"
        )

    def create(self, validated_data):
        return Relationship.objects.create_friends(**validated_data)

