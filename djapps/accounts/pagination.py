from rest_framework.pagination import CursorPagination
from django.utils.translation import gettext_lazy as _


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
