from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.feeds.models import Feed
from apps.accounts.serializers import UserSerializer, FeedAuthor



class FeedSerializer(ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.pk"
    )
    class Meta:
        model = Feed
        fields = (
            "pk",
            "author",
            "post",
            "likes",
            "media",
            "share",
            "pub_date"
        )
        read_only_fields = [
            "likes",
            "share"
        ]

    def to_representation(self, instance):
        request = self.context.get("request", None)
        result = super().to_representation(instance)
        result['author'] = FeedAuthor(instance=instance.author, context={"request": request}).data
        return result

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)

