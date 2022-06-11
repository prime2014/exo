from django_filters import rest_framework as filters
from apps.feeds.models import Feed


class FilterUsersPost(filters.FilterSet):

    author = filters.NumberFilter(field_name="author")

    class Meta:
        model = Feed
        fields = (
            "author",
        )
