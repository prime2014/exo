from django_filters import rest_framework as filters
from djapps.feeds.models import Feed, Comments


class FilterUsersPost(filters.FilterSet):

    author = filters.NumberFilter(field_name="author")

    class Meta:
        model = Feed
        fields = (
            "author",
        )


class CommentFilter(filters.FilterSet):
    post = filters.NumberFilter(field_name="post")

    class Meta:
        model = Comments
        fields = (
            "post",
        )
