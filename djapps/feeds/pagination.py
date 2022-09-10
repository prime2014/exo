from rest_framework.pagination import PageNumberPagination, CursorPagination
from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response


class CommentPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 24

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })


class FeedCursorPagination(CursorPagination):
    cursor_query_param = "cursor"
    cursor_query_desription = _("The pagination cursor value.")
    page_size = 4
    invalid_cursor_message = _("Invalid cursor")
    ordering = "-pub_date"

    # Client can control the page size using this query parameter.
    # Default is 'None'. Set to eg 'page_size' to enable usage.
    page_size_query_param = 4
    page_size_query_description = _('Number of results to return per page.')

    offset_cutoff = 1000

    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset, request, view)
