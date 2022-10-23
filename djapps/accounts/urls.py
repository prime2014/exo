from django.urls import path, include
from djapps.accounts.api import (
    LoginAPIView,
    LogoutAPIView,
    UserViewset,
    RelationshipViewset,
    ProfileImagesViewset,
    SuggestionsRequest,
    UserAuthViewset
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("users", viewset=UserViewset, basename="users")
router.register('relationship', viewset=RelationshipViewset, basename="relationship")
router.register("profileimages", viewset=ProfileImagesViewset, basename="profileimages")
router.register("suggestions", viewset=SuggestionsRequest, basename="suggestions")
router.register("auth", viewset=UserAuthViewset, basename="auth")


urlpatterns = [
    path("auth/login/", LoginAPIView.as_view()),
    path("auth/logout/", LogoutAPIView.as_view()),
    path("api/v1/", include(router.urls))
]
