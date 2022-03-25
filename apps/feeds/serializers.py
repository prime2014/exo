from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.feeds.models import Feed
from apps.accounts.serializers import UserSerializer



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
            "share",
            "pub_date"
        )
        read_only_fields = [
            "likes",
            "share"
        ]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result['author'] = UserSerializer(instance=instance.author).data
        return result

    def create(self, validated_data):
        return self.Meta.model.objects.create(**validated_data)

