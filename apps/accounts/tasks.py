from config.celery_app import app as celery_app
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode


@celery_app.task()
def send_activation_link(token, user):
    """A celery task to send an account activation link to the user email"""
    context = {
        'firstname': user.get("first_name"),
        "lastname": user.get("last_name"),
        "id": urlsafe_base64_encode(force_bytes(user.get("pk"))),
        "token": token,
        "origin": settings.CORS_ALLOWED_ORIGINS[0]
    }

    msg_html = render_to_string("accounts/account_activation.html", context=context)
    email = user.get("email")
    send_mail(
        "Account Activation",
        msg_html,
        from_email= settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=msg_html
    )
