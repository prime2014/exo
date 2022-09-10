from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model
from django.db.models import F

User = get_user_model()


class FriendFilter(filters.FilterSet):
    first_name = filters.CharFilter(lookup_expr="icontains")
    # realtionship__from_user__to_person__first_name = F(first_name)
    realtionship__from_user__to_person__first_name = F(first_name)
    realtionship__from_user__from_person__id = filters.NumberFilter()
    realtionship__to_user__status = "Friends"

    class Meta:
        model = User
        fields = (
            "first_name",
        )
