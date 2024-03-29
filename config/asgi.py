import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from channels.auth import AuthMiddlewareStack
from django.conf import settings
from djapps.accounts.routing import websocket_urlpatterns as account_websocket_urlpatterns
from django.urls import re_path
import django_eventstream


environ = os.environ.get("ENV_STATE", "base")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"config.settings.{environ}")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": URLRouter([
        re_path(r"^events/", AuthMiddlewareStack(
            URLRouter(django_eventstream.routing.urlpatterns)
        )),
        re_path(r"^", django_asgi_app)
        ]),
    "websocket": OriginValidator(AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                account_websocket_urlpatterns
            )
        )
    ), allowed_origins=settings.CORS_ALLOWED_ORIGINS)
})
