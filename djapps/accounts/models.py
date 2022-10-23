from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone
from django.utils.translation import gettext as _
from django.db.models import Q, F
from versatileimagefield.fields import VersatileImageField, PPOIField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from django.dispatch import receiver


def jsondefault():
    return {"bio": "", "requests": [], "city": "", "country": ""}


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_active=False, **extra_kwargs):
        user = self.model(
            email=email,
            username=extra_kwargs.get("username", None),
            is_active=is_active,
            first_name=extra_kwargs.get("first_name", None),
            last_name=extra_kwargs.get("last_name", None),
            is_staff=extra_kwargs.get("is_staff", False),
            is_superuser=extra_kwargs.get("is_superuser", False)
        )
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, first_name=None, last_name=None, username="Admin", password=None):
        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            username=username,
            password=password,
            is_active=True,
            is_staff=True,
            is_superuser=True
        )

    def is_staff(self):
        return self.is_staff


class User(AbstractBaseUser):
    email = models.EmailField(
        unique=True,
        max_length=120,
        null=False
    )
    username = models.CharField(
        max_length=30,
        unique=True,
        null=False
    )
    avatar = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        default="http://127.0.0.1:8000/media/profile/default_profile.jpg"
    )
    first_name = models.CharField(
        max_length=30,
        null=True
    )
    last_name = models.CharField(
        max_length=30,
        null=True
    )
    is_active = models.BooleanField(
        default=False,
    )
    is_staff = models.BooleanField(
        default=False
    )
    is_superuser = models.BooleanField(
        default=False
    )
    relation = models.ManyToManyField(
        'self',
        through="Relationship",
        related_name="realtionship",
        symmetrical=False
    )
    date_joined = models.DateTimeField(
        default=timezone.now,
        editable=False
    )
    date_modified = models.DateTimeField(
        auto_now=True,
        editable=False
    )
    meta = models.JSONField(null=True, default=jsondefault)

    USERNAME_FIELD = "email"
    objects = UserManager()

    class Meta:
        indexes = [
            models.Index(fields=['username'], name="username_search_indx"),
        ]

    def __str__(self):
        return self.username

    def get_relationship(self, status=None):
        if type(status) == "list":
            return self.relation.filter(
                to_user__status__in=[*status]
            )
        return self.relation.filter(
            to_user__status=status
        )

    def has_perm(self, perm, obj=None):
        return self.is_active or self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class ProfileImages(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="avatars")
    image = VersatileImageField(
        upload_to="profile/",
        width_field="width",
        height_field="height"
    )
    width = models.PositiveIntegerField(
        blank=True,
        null=True
    )
    height = models.PositiveIntegerField(
        blank=True,
        null=True
    )
    ppoi = PPOIField(
        'Image PPOI'
    )
    date_created = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    def __str__(self):
        return f"{self.image.url}"


class RelationshipManager(models.Manager):
    def create_friends(self, from_person, to_person, status="Friends"):
        relation_one = self.model(
            from_person=to_person,
            to_person=from_person,
            status=status
        )
        relation_two = self.model(
            from_person=from_person,
            to_person=to_person,
            status=status
        )
        friends = self.bulk_create([
            relation_one,
            relation_two
        ])

        return friends[1]

    def delete_friends(self, from_person, to_person, status="Friends"):
        relation_one = self.model(
            from_person=to_person,
            to_person=from_person,
            status=status
        )
        relation_two = self.model(
            from_person=from_person,
            to_person=to_person,
            status=status
        )
        relation_one.delete()
        relation_two.delete()
        return "deleted"


class Relationship(models.Model):
    CHOICES = [
        ('Friends', _('Friends')),
        ('Following', _('Following')),
        ('Followers', _('Followers')),
        ('Blocked', _('Blocked'))
    ]
    from_person = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="from_user"
    )
    to_person = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="to_user"
    )
    status = models.CharField(
        max_length=20,
        choices=CHOICES,
        default="Friends"
    )
    date_created = models.DateTimeField(
        default=timezone.now,
        editable=False
    )

    objects = RelationshipManager()

    def __str__(self):
        return f"{self.from_person}->{self.to_person}"

    class Meta:
        indexes = [
            models.Index(fields=['status'], name="status_idx")
        ]
        constraints = [
            models.CheckConstraint(check=~Q(from_person=F('to_person')), name="no_self-relation"),
            models.UniqueConstraint(fields=["from_person", "to_person"], name="unique_relationship")
        ]


@receiver(models.signals.post_save, sender=ProfileImages)
def warm_profile_images(sender, instance, **kwargs):
    """Ensures Person head shots are created post-save"""
    person_img_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance,
        rendition_key_set=[
            ("full_size", "url"),
            ("thumbnail", "crop__350x350"),
            ("medium_square_crop", "crop__170x170"),
            ("small_square_crop", "crop__50x50")
        ],
        image_attr='image'
    )
    num_created, failed_to_create = person_img_warmer.warm()
