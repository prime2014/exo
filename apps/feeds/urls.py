from rest_framework.routers import DefaultRouter
from django.urls import path, include
from apps.feeds.api import FeedGenericAPIView, FeedAPIDetail, FeedAPIViewWrite


router = DefaultRouter()

# router.register(r"feeds", viewset=FeedViewset, basename="feeds")


urlpatterns = [
    path("api/v1/feeds/", FeedGenericAPIView.as_view()),
    path("api/v1/feeds/write/", FeedAPIViewWrite.as_view()),
    path("api/v1/feeds/<int:pk>/", FeedAPIDetail.as_view())
]
