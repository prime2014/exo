from email.policy import default
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()

class Feed(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="writer"
    )
    post = models.TextField()
    likes = models.PositiveIntegerField(
        default=0
    )
    share = models.PositiveIntegerField(
        default=0
    )
    pub_date = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    class Meta:
        ordering = ("-pub_date", )

    def __str__(self):
        return self.author.username  + " POST"


