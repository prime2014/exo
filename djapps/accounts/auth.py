from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model


User = get_user_model()


class Authentication(ModelBackend):
    """A class that authenticates user credentials"""
    def authenticate(self, request, username, password=None, **kwargs):
        try:
            user = User.objects.get(email=username)
            if user and check_password(password, user.password):
                return user
            else:
                pass
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        return super().get_user(user_id)

