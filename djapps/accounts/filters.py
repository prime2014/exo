from ast import Num
from cgitb import lookup
from email.mime import base
from typing_extensions import Self
from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model
from djapps.accounts.models import Relationship
from django.db.models import Q, F

User = get_user_model()


class FriendFilter(filters.FilterSet):
    first_name = filters.CharFilter(lookup_expr="icontains")
    realtionship__to_user__first_name = F(first_name)
    realtionship__from_user = filters.NumberFilter()
    realtionship__to_user__status = "Friends"

    class Meta:
        model = User
        fields = (
            "first_name",
        )


