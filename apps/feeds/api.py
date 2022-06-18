from multiprocessing import context
from os import access
from django.dispatch import receiver
from rest_framework.viewsets import ModelViewSet
from apps.feeds.models import Feed, Media, Tags, Comments
from apps.feeds.serializers import FeedSerializer, MediaSerializer, TagsSerializer,CommentSerializer
from rest_framework import authentication, permissions,status
from django.contrib.auth import get_user_model
from apps.accounts.models import Relationship
import logging
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, GenericAPIView, RetrieveAPIView, ListCreateAPIView, ListAPIView
from django.shortcuts import get_object_or_404
from apps.feeds.pagination import FeedCursorPagination
from django.contrib.contenttypes.models import ContentType
from notifications.signals import notify
from django.db.models import Prefetch
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from django_filters.rest_framework import DjangoFilterBackend
from apps.feeds.filters import FilterUsersPost
from django.db.models import Q


User = get_user_model()

logging.basicConfig(encoding="utf-8", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

logger = logging.getLogger(__name__)



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
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = MediaSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializers = self.serializer_class(data=request.data, context={"request": request}, many=isinstance(request.data, list))

        if serializers.is_valid(raise_exception=True):
            serializers.save()
            feed = Feed.objects.get(pk=serializers.data.get("post"))
            feed_serializer = FeedSerializer(instance=feed)
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
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated, )
    pagination_class = FeedCursorPagination
    lookup_url_kwargs = "pk"
    filter_backends = (DjangoFilterBackend,)
    filterset_class = FilterUsersPost

    def get_queryset(self):
        client = self.request.user
        if client.is_staff or client.is_superuser:
            return Feed.objects.all()
        elif client.is_authenticated:
            users = set(client.relation.filter(to_user__status="Friends")).union({ client })
            qs = Feed.objects.prefetch_related("posted_photos", "tag", "author__relation").select_related("author").filter(Q(author__in=users) & Q(author__relation__to_user__status="Friends"))
            return qs
        raise NotAuthenticated(detail="You need to be authenticated to view the feed", code=401)



    # def get(self, request, *args, **kwargs):
    #     feed = self.get_queryset()
    #     serializer = self.serializer_class(feed, many=True, context={"request": request})
    #     return Response(serializer.data, status=status.HTTP_200_OK)


class FeedAPIViewWrite(ListCreateAPIView, FeedGenericAPIView):

    def create(self, request, *args, **kwargs):

        serializers = self.serializer_class(data=request.data, context={"request": request})
        if serializers.is_valid(raise_exception=True):
            self.perform_create(serializers)
            # send_post_data(request.user.username, serializers.data)
            feed = Feed.objects.filter(author=request.user).latest('pub_date');
            # notify.send(feed.author, recipient=feed.author, verb="POST CREATED", action_object=feed, description=f"{feed.author.first_name} {feed.author.last_name} created a post")
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)


class FeedAPIDetail(RetrieveUpdateDestroyAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FeedSerializer
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated, )

    def retrieve(self, request, *args, **kwargs):
        feed = Feed.objects.get(pk=kwargs.get("pk"))
        serializer = self.serializer_class(feed, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_object(), data=request.data, context={"request": request}, partial=True)

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

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


