from .base import * # noqa



DEBUG = True

SECRET_KEY = env("SECRET_KEY")

REST_FRAMEWORK = {
    # "DEFAULT_AUTHENTICATION_CLASSES":[
    #     "rest_framework.authentication.SessionAuthentication",
    #     "rest_framework.authentication.TokenAuthentication"
    # ],
    # "DEFAULT PERMISSION_CLASSES": [
    #     "rest-framework.permissions.IsAuthenticated"
    # ],
    # "TEST_REQUEST_DEFAULT_FORMAT":"json",
    "TEST_REQUEST_RENDERER_CLASSES": [
        "rest_framework.renderers.MultiPartRenderer",
        "rest_framework.renderers.JSONRenderer",
        "rest-framework.renderers. TemplateHTMLRenderer"
    ]
}
