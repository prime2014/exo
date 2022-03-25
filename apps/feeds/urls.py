from rest_framework.routers import DefaultRouter
from django.urls import path, include
from apps.feeds.api import FeedViewset


router = DefaultRouter()

router.register(r"feeds", viewset=FeedViewset, basename="feeds")


urlpatterns = [
    path("api/v1/", include(router.urls))
]
