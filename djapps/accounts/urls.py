from django.urls import path, include
from djapps.accounts.api import (
    LoginAPIView,
    UserViewset,
    RelationshipViewset,
    ProfileImagesViewset
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("users", viewset=UserViewset, basename="users")
router.register('relationship', viewset=RelationshipViewset, basename="relationship")
router.register("profileimages", viewset=ProfileImagesViewset, basename="profileimages")


urlpatterns = [
    path("auth/login/", LoginAPIView.as_view()),
    path("api/v1/", include(router.urls))
]
