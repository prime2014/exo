from rest_framework.viewsets import ModelViewSet
from apps.feeds.models import Feed
from apps.feeds.serializers import FeedSerializer
from rest_framework import authentication, permissions,status
from django.contrib.auth import get_user_model
from apps.accounts.models import Relationship
import logging
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response

logger = logging.getLogger(__name__)

class FeedViewset(ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer
    authentication_classes = (authentication.TokenAuthentication, authentication.SessionAuthentication)
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            qs = self.queryset
            return qs
        elif self.request.user.is_authenticated:
            friends = list(self.request.user.relation.filter(to_user__status='Friends'))
            logger.info(friends)
            qs = Feed.objects.filter(author__in=[self.request.user, *friends])
            return qs
        raise NotAuthenticated(detail="You need to be authenticated to view the feed", code=401)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



