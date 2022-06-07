import os
from django.apps import apps
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from channels.auth import AuthMiddlewareStack
from django.conf import settings
from apps.accounts.routing import websocket_urlpatterns as account_websocket_urlpatterns


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket":OriginValidator(AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                account_websocket_urlpatterns
            )
        )
    ), allowed_origins=settings.CORS_ALLOWED_ORIGINS)
})
