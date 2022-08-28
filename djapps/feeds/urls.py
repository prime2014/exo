from rest_framework.routers import DefaultRouter
from django.urls import path, include
from djapps.feeds.api import (
    FeedGenericAPIView,
    FeedAPIDetail,
    FeedAPIViewWrite,
    MediaViewset,
    TagsViewset,
    CommentViewset,
    PostView,
    PostMedia
)


router = DefaultRouter()
router.register("comments", viewset=CommentViewset, basename="comments")
router.register("tags", viewset=TagsViewset, basename="tags")
router.register("media", viewset=MediaViewset, basename="media")



urlpatterns = [
    path("api/v1/post/", include(router.urls)),
    # path("api/media/<int:pk>/", MediaView.as_view()),
    path("api/v1/feeds/", FeedGenericAPIView.as_view()),
    path("api/v1/feeds/write/", PostView.as_view()),
    path("api/v1/feeds/<int:pk>/", FeedAPIDetail.as_view()),
    path("api/media/content/", PostMedia.as_view())
]
