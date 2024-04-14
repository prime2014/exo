from .base import *  # noqa
from .base import BASE_DIR
from .base import environ
from pathlib import Path

DEBUG = False

env = environ.Env()

environ.Env.read_env(str(BASE_DIR / ".env.production"))

ALLOWED_HOSTS = ["13.247.24.140", "127.0.0.1", "localhost", "django"]

SECRET_KEY = env("SECRET_KEY")

STATICFILES_DIRS = [
    Path.joinpath(BASE_DIR, "static"),
]

STATIC_ROOT = Path.joinpath(BASE_DIR, "static")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")  # past the key or password app here
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")


SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
