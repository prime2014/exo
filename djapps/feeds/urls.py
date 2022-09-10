from rest_framework.routers import DefaultRouter
from django.urls import path, include
from djapps.feeds.api import (
    FeedGenericAPIView,
    FeedAPIViewWrite,
    FeedAPIDetail,
    MediaViewset,
    TagsViewset,
    CommentViewset,
    PostMedia
)


router = DefaultRouter()
router.register("tags", viewset=TagsViewset, basename="tags")
router.register("media", viewset=MediaViewset, basename="media")


urlpatterns = [
    path("api/v1/post/", include(router.urls)),
    path("api/v1/post/comments/", CommentViewset.as_view()),
    # path("api/media/<int:pk>/", MediaView.as_view()),
    path("api/v1/feeds/", FeedGenericAPIView.as_view()),
    path("api/v1/feeds/write/", FeedAPIViewWrite.as_view()),
    path("api/v1/feeds/<int:pk>/", FeedAPIDetail.as_view()),
    path("api/media/content/", PostMedia.as_view())
]
