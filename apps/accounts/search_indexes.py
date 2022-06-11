from enum import unique
from haystack import indexes
from apps.accounts.models import User
from datetime import datetime



class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    key = indexes.IntegerField(model_attr="pk")
    primary_name = indexes.CharField(model_attr="first_name")
    surname = indexes.CharField(model_attr="last_name")
    pseudo_name = indexes.CharField(model_attr="username")
    pub_date = indexes.DateTimeField(model_attr="date_joined")

    def get_model(self):
        return User

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.filter(pub_date__lte=datetime.now())
