from rest_framework.viewsets import ModelViewSet
from djapps.feeds.models import Feed, Media, Tags, Comments, LikeCount
from djapps.feeds.serializers import (
    FeedSerializer,
    FeedCreateSerializer,
    MediaSerializer,
    TagsSerializer,
    CommentSerializer,
    LikeCountSerializer
)
from djapps.accounts.serializers import UserSerializer
from rest_framework import authentication, permissions, status
from django.contrib.auth import get_user_model
import logging
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.generics import RetrieveUpdateDestroyAPIView,  ListCreateAPIView, ListAPIView
from django.shortcuts import get_object_or_404
from djapps.feeds.pagination import FeedCursorPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from djapps.feeds.posting import create_post
import time
import uuid
import json
from datetime import datetime, timezone
from django.conf import settings
import os
from PIL import Image
import secrets
import mimetypes
import redgrease
from django.db.models import Count
from rest_framework.decorators import action


time.time()

User = get_user_model()

logging.basicConfig(encoding="utf-8", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

logger = logging.getLogger(__name__)


class PostMedia(APIView):
    parser_classes = (FormParser, MultiPartParser)
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        file = request.FILES["file"]
        host = request.META["HTTP_HOST"]
        logger.info("META HOST: %s" % (host, ))
        type = mimetypes.guess_type(file.name, None)[0].split("/")[0]
        name, ext = os.path.splitext(file.name)
        if file and type == "image":
            try:
                my_image = Image.open(file)
                timestamp = secrets.token_urlsafe(8)
                my_image.save(os.path.join(settings.MEDIA_ROOT, "content", f"{name}_{timestamp}{ext}"))
                # my_image.save(os.path.join(settings.MEDIA_ROOT, "content", f"{name}_{timestamp}{ext}"))
                url = str("http://127.0.0.1:8000/" + os.path.join(settings.MEDIA_ROOT, "content",
                                                                  f"{name}_{timestamp}{ext}"))
                return Response({"file": f"{url}"}, status=status.HTTP_200_OK)
            except IOError():
                return Response({"error": "There was a problem with your file upload"},
                                status=status.HTTP_400_BAD_REQUEST)
        elif file and type == "video":
            try:
                timestamp = secrets.token_urlsafe(8)
                with open(os.path.join(settings.MEDIA_ROOT, "video", f"{name}_{timestamp}{ext}"), "ab") as destination:
                    for chunks in file.chunks():
                        destination.write(chunks)
                return Response({"success": "file successfully submitted"}, status=status.HTTP_200_OK)
            except IOError():
                return Response({"error": "There was a problem with your file upload"},
                                status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticated, )

    # def get(self, request, *args, **kwargs):
    #     request.user

    def post(self, request, *args, **kwargs):
        conn = redgrease.Redis(host="redisModules", port=6379, db=0)
        user = UserSerializer(instance=request.user, context={"request": request},
                              fields=("pk", "first_name", "last_name", "avatar")).data
        pr = uuid.uuid4()
        pid = f"{pr}{int(round(time.time(), 0))}"
        tzed = timezone.utc
        request.data.update({"uuid": pid, "author": json.dumps(user), "pub_date": str(datetime.now(tzed))})
        try:
            conn.hmset()
            posted = create_post(user.get("pk"), request.data)
            posted["author"] = user
            # send_posts.chunk(list((pk, posted) for pk in list_of_friends), 300)()
            return Response(posted, status=status.HTTP_201_CREATED)
        except Exception:
            return Response({"error": "There was a problem creating your post!"}, status=status.HTTP_400_BAD_REQUEST)


class TagsViewset(ModelViewSet):
    queryset = Tags.objects.all()
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    serializer_class = TagsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MediaViewset(ModelViewSet):
    queryset = Media.objects.all()
    authentication_classes = (authentication.TokenAuthentication,)
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = MediaSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data, context={"request": request},
                                            many=isinstance(request.data, list))
        if serializers.is_valid(raise_exception=True):
            serializers.save()
            feed = Feed.objects.filter(pk=serializers.data.get("post")).annotate(
                comments=Count("post_comments", distinct=True), likes=Count("status_update", distinct=True))[0]
            feed_serializer = FeedSerializer(instance=feed, context={"request": request})
            return Response(feed_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        media = get_object_or_404(Media, pk=kwargs.get('pk'))
        serialized = self.serializer_class(instance=media, context={"request": request})
        return Response(serialized.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        media = get_object_or_404(Media, pk=kwargs.get("pk"))
        media.delete()
        return Response({"detail": "Successfully deleted!"}, status=status.HTTP_204_NO_CONTENT)


# class MediaView(RetrieveUpdateDestroyAPIView):
#     authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
#     parser_classes = (MultiPartParser, FormParser)
#     permission_classes = (permissions.IsAuthenticated, )
#     serializer_class = MediaSerializer


#     def retrieve(self, request, *args, **kwargs):
#         self.parser_classes


class FeedGenericAPIView(ListAPIView):
    serializer_class = FeedSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, )
    pagination_class = FeedCursorPagination
    lookup_url_kwargs = "pk"
    filter_backends = (DjangoFilterBackend,)
    # filterset_class = FilterUsersPost

    def get_queryset(self):
        client = self.request.user
        if self.request.user.is_authenticated and self.request.query_params.get("author"):
            return Feed.objects.filter(author=self.request.query_params.get("author")).annotate(
                comments=Count("post_comments", distinct=True), likes=Count("status_update", distinct=True))
        if client.is_staff or client.is_superuser:
            return Feed.objects.annotate(comments=Count("post_comments"), likes=Count("status_update", distinct=True))
        elif client.is_authenticated:
            users = set(client.relation.filter(to_user__status="Friends")).union({client})
            qs = Feed.objects.prefetch_related("posted_photos",
                                               "tag",
                                               "author").filter(author__in=users).annotate(
                                                   comments=Count("post_comments", distinct=True),
                                                   likes=Count("status_update", distinct=True))
            return qs
        raise NotAuthenticated(detail="You need to be authenticated to view the feed", code=401)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # def get(self, request, *args, **kwargs):
    #     feed = self.get_queryset()
    #     serializer = self.serializer_class(feed, many=True, context={"request": request})
    #     return Response(serializer.data, status=status.HTTP_200_OK)


class FeedAPIViewWrite(ListCreateAPIView, FeedGenericAPIView):

    def create(self, request, *args, **kwargs):
        serializers = FeedCreateSerializer(data=request.data, context={"request": request})
        if serializers.is_valid(raise_exception=True):
            self.perform_create(serializers)
            # send_post_data(request.user.username, serializers.data)
            Feed.objects.filter(author=request.user).latest('pub_date')
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)


class FeedAPIDetail(RetrieveUpdateDestroyAPIView, FeedGenericAPIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = FeedSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, )

    def retrieve(self, request, *args, **kwargs):
        feed = Feed.objects.filter(pk=kwargs.get("pk")).annotate(comments=Count("post_comments", distinct=True),
                                                                 likes=Count("status_update", distinct=True))[0]
        serializer = self.serializer_class(feed, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_object(), data=request.data,
                                           context={"request": request}, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        feed = get_object_or_404(Feed, pk=kwargs.get("pk"))
        feed.delete()
        return Response({"detail": "Successfully deleted!"}, status=status.HTTP_204_NO_CONTENT)


class CommentViewset(ModelViewSet):
    queryset = Comments.objects.all()
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommentSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.query_params.get("post"):
            post = self.request.query_params.get("post")
            comments = Comments.objects.filter(post=post)
            return comments
        elif self.request.user.is_authenticated:
            return self.queryset
        else:
            raise "You need to be authenticated to view the comments"

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer=serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)


class LikeCountViewset(ModelViewSet):
    queryset = LikeCount.objects.all()
    authentication_classes = (authentication.SessionAuthentication, authentication.TokenAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LikeCountSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer=serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @action(methods=["GET", "POST"], detail=False, serializer_class=LikeCountSerializer)
    def delete_like(self, request, *args, **kwargs):
        like = LikeCount.objects.filter(user=request.user, post=request.data.get("post_id"))
        like.delete()
        return Response({"success": "You removed the like"}, status=status.HTTP_204_NO_CONTENT)
