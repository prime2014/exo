from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation


User = get_user_model()


class Tags(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f"{self.user.username}"

    class Meta:
        indexes = [
            models.Index(fields=['content_type', 'object_id'], name="tag_search_indx")
        ]


class Feed(models.Model):
    tag = GenericRelation(Tags, null=True)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="writer"
    )
    post = models.TextField(
        null=True,
        blank=True
    )
    flagged = models.BooleanField(
        default=False,
        null=True
    )
    pub_date = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )
    is_shared = models.BooleanField(
        default=False,
        null=True
    )
    modified_date = models.DateTimeField(
        auto_now=True,
        null=True,
        editable=False
    )

    class Meta:
        ordering = ("-pub_date", )
        indexes = [
            models.Index(fields=['author'], name="user_posts_indx"),
        ]

    def __str__(self):
        return self.author.username + " POST"


class LikeCount(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="liker"
    )
    post = models.ForeignKey(
        Feed,
        on_delete=models.CASCADE,
        related_name="status_update"
    )

    def __str__(self):
        return self.user.username


class Media(models.Model):
    file = models.FileField(
        upload_to="content/"
    )

    post = models.ForeignKey(
        Feed,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="posted_photos"
    )
    date_uploaded = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    class Meta:
        ordering = ("pk",)

    def __str__(self):
        return self.file.url


class Comments(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comment_address"
    )
    post = models.ForeignKey(
        Feed,
        on_delete=models.CASCADE,
        related_name="post_comments",
        null=True
    )
    comment = models.TextField()
    pub_date = models.DateTimeField(
        editable=False,
        default=timezone.now
    )

    def __str__(self):
        return f"{self.comment}"

    # def set_like_choice(self, choice):
    #     if choice in set()
