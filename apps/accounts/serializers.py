from distutils.command.upload import upload
from xml.dom import ValidationErr
from django.forms import ValidationError
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from apps.accounts.models import Relationship, ProfileImages
from versatileimagefield.serializers import VersatileImageFieldSerializer
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from versatileimagefield.serializers import VersatileImageFieldSerializer

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
            "meta"
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "is_superuser": {"write_only": True},
            "is_staff": {"write_only": True},
        }

    def validate_password(self, password):
        if len(password) < 8:
            raise ValidationError(message="Password must be at least 8 characters long", code=400)
        return password

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
        instance.meta = validated_data.get("meta", instance.meta)
        if password:
            instance.password = make_password(password)
        else:
            instance.password = instance.password
        instance.save()
        return instance


class ProfileImageSerializer(ModelSerializer):
    user = serializers.ReadOnlyField(
        source="user.pk"
    )
    image = VersatileImageFieldSerializer(
        sizes = [
            ("full_size", "url"),
            ("thumbnail", "thumbnail__100x100"),
            ("medium_square_crop", "crop__170x170"),
            ("small_square_crop", "crop__50x50")
        ]
    )
    class Meta:
        model = ProfileImages
        fields = "__all__"


class FeedAuthor(ModelSerializer):
    class Meta(UserSerializer.Meta):
        fields = (
            "pk",
            "first_name",
            "last_name",
            "username",
            "avatar"
        )
        extra_kwargs = {
            "relation": {"write_only": True},
            "password": {"write_only": True},
            "is_superuser": {"write_only": True},
            "is_staff": {"write_only": True},
        }


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

