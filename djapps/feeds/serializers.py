from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from djapps.feeds.models import Feed, Media, Tags, Comments, LikeCount
from djapps.accounts.serializers import FeedAuthor
import logging
from django.contrib.auth import get_user_model
from djapps.accounts.serializers import UserSerializer


User = get_user_model()

logging.basicConfig(format="%(asctime)s %(levelname)s %(message)s", encoding="utf-8", level=logging.INFO)


logger = logging.getLogger(__name__)


class DynamicModelSerializer(ModelSerializer):
    def __init__(self, *args, **kwargs):
        # Don't pass the fields arg up to the superclass
        fields = kwargs.pop("fields", None)

        # instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # drop any fields that are no specified in the fields argument
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = (
            "pk",
            "user",
        )

    def to_representation(self, instance):
        result = super().to_representation(instance)
        user = FeedAuthor(instance=instance.user).data
        result["user"] = {"pk": user.get("pk"), "username": user.get("username")}
        return result

    def create(self, validated_data):
        tag = self.Meta.model(**validated_data)
        tag.save()
        return tag


class MediaListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        media = [Media(**item) for item in validated_data]
        return Media.objects.bulk_create(media)


class MediaSerializer(DynamicModelSerializer):

    class Meta:
        model = Media
        fields = (
            "id",
            "post",
            "file",
            "date_uploaded"
        )
        list_serializer_class = MediaListSerializer


class FeedForMedia(serializers.ModelSerializer):

    class Meta:
        model = Media
        fields = (
            "id",
            "file",
        )


class FeedSerializer(DynamicModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.pk"
    )
    tag = TagsSerializer(instance=Tags.objects.all(), many=True)
    posted_photos = FeedForMedia(read_only=True, many=True)
    comments = serializers.SerializerMethodField(method_name="comment_count_number")
    likes = serializers.SerializerMethodField(method_name="like_count_number")
    i_liked = serializers.SerializerMethodField(method_name="find_my_like")

    class Meta:
        model = Feed
        fields = "__all__"
        extra_kwargs = {
            "comments": {"required": False},
            "likes": {"required": False},
            "i_liked": {"required": False},
        }

    def to_representation(self, instance):
        result = super().to_representation(instance)
        request = self.context.get("request")
        result['author'] = FeedAuthor(instance=instance.author, context={"request": request}).data
        # result["author"] = dict(instance.values("pk", "first_name", "last_name", "username", "avatar"))
        return result

    def create(self, validated_data):
        if "tag" in validated_data.keys():
            tag = validated_data.pop("tag")
            feed = self.Meta.model.objects.create(**validated_data)
            if len(tag):
                Tags.objects.bulk_create(list(Tags(content_object=feed, user=t.get("user")) for t in tag))
            return feed
        return self.Meta.model.objects.create(**validated_data)

    def comment_count_number(self, obj):
        return obj.comments

    def like_count_number(self, obj):
        logger.info("MY OBJECT: %s" % obj)
        return obj.likes

    def find_my_like(self, obj):
        request = self.context.get("request")
        count = LikeCount.objects.filter(user=request.user, post=obj).count()
        return True if count >= 1 else False


class FeedCreateSerializer(DynamicModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.pk"
    )
    tag = TagsSerializer(instance=Tags.objects.all(), many=True)
    posted_photos = FeedForMedia(read_only=True, many=True)
    # comments = serializers.SerializerMethodField(method_name="comment_count_number")
    # likes = serializers.SerializerMethodField(method_name="like_count")
    i_liked = serializers.SerializerMethodField(method_name="find_my_like")

    class Meta:
        model = Feed
        fields = "__all__"
        extra_kwargs = {
            "comments": {"required": False},
            "likes": {"required": False},
            "i_liked": {"required": False},
        }

    def to_representation(self, instance):
        result = super().to_representation(instance)
        request = self.context.get("request")
        result['author'] = FeedAuthor(instance=instance.author, context={"request": request}).data
        # result["author"] = dict(instance.values("pk", "first_name", "last_name", "username", "avatar"))
        return result

    def create(self, validated_data):
        if "tag" in validated_data.keys():
            tag = validated_data.pop("tag")
            feed = self.Meta.model.objects.create(**validated_data)
            if len(tag):
                Tags.objects.bulk_create(list(Tags(content_object=feed, user=t.get("user")) for t in tag))
            return feed
        return self.Meta.model.objects.create(**validated_data)

    def comment_count_number(self, obj):
        return obj.comments

    def like_count(self, obj):
        return obj.likes

    def find_my_like(self, obj):
        request = self.context.get("request")
        count = LikeCount.objects.filter(user=request.user, post=obj).count()
        return True if count >= 1 else False


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.pk"
    )

    class Meta:
        model = Comments
        fields = "__all__"

    def to_representation(self, instance):
        comment = super().to_representation(instance)
        request = self.context.get("request")
        comment["author"] = UserSerializer(instance=instance.author,
                                           context={"request": request},
                                           fields=["pk", "first_name", "last_name", "avatar"]).data
        return comment

    def create(self, validated_data):
        comment = self.Meta.model(**validated_data)
        comment.save()
        return comment


class LikeCountSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.pk")

    class Meta:
        model = LikeCount
        fields = (
            "pk",
            "user",
            "post",
        )

    def create(self, validated_data):
        like = self.Meta.model(**validated_data)
        like.save()
        return like
