from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class AccountActivationToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return six.text_type(user.get("pk")) + six.text_type(user.get("is_active")) + six.text_type(timestamp)


activation_token = AccountActivationToken()
