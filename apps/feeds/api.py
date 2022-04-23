from rest_framework.viewsets import ModelViewSet
from apps.feeds.models import Feed
from apps.feeds.serializers import FeedSerializer
from rest_framework import authentication, permissions,status
from django.contrib.auth import get_user_model
from apps.accounts.models import Relationship
import logging
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, GenericAPIView, RetrieveAPIView, ListCreateAPIView
from django.shortcuts import get_object_or_404



logging.basicConfig(encoding="utf-8", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

logger = logging.getLogger(__name__)


class FeedGenericAPIView(RetrieveAPIView):
    queryset = Feed.objects.all().select_related("author")
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FeedSerializer
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated, )
    lookup_url_kwargs = "pk"

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Feed.objects.all().select_related("author")
        elif self.request.user.is_authenticated:
            friends = list(self.request.user.relation.filter(to_user__status='Friends'))
            qs = Feed.objects.select_related("author").filter(author__in=[self.request.user, *friends])
            return qs
        raise NotAuthenticated(detail="You need to be authenticated to view the feed", code=401)

    def get(self, request, *args, **kwargs):
        feed = self.get_queryset()
        serializer = self.serializer_class(feed, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class FeedAPIViewWrite(ListCreateAPIView, FeedGenericAPIView):
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
        serializer = self.serializer_class(self.get_object(), data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        feed = get_object_or_404(Feed, pk=kwargs.get("pk"))
        feed.delete()
        return Response({"detail": "Successfully deleted!"}, status=status.HTTP_204_NO_CONTENT)


