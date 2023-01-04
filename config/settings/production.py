from .base import *  # noqa
from .base import environ

DEBUG = False

env = environ.Env()

environ.Env.read_env(str(BASE_DIR / ".env.production"))

ALLOWED_HOSTS = ["35.81.9.144", "127.0.0.1", "localhost", "django"]

SECRET_KEY = env("SECRET_KEY")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")  # past the key or password app here
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
