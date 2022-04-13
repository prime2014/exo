from distutils.command.upload import upload
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone
from django.utils.translation import gettext as _
from django.db.models import Q, F
from versatileimagefield.fields import VersatileImageField,PPOIField

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_active=False, **extra_kwargs):
        user = self.model(
            email=email,
            username=extra_kwargs['username'],
            is_active=is_active,
            avatar=extra_kwargs['avatar'],
            first_name=extra_kwargs["first_name"],
            last_name=extra_kwargs['last_name'],
            is_staff=extra_kwargs['is_staff'],
            is_superuser=extra_kwargs['is_superuser']
        )
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, first_name, last_name, username, password=None):
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
        null = False
    )
    avatar = models.ImageField(
        upload_to="avatar/",
        blank=True,
        null=True
    )
    first_name= models.CharField(
        max_length=30
    )
    last_name = models.CharField(
        max_length=30
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
    date_modified=models.DateTimeField(
        auto_now=True,
        editable=False
    )

    USERNAME_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_active or self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser



class RelationshipManager(models.Manager):
    def create_friends(self, from_person, to_person, status="Friends"):
        relation_one = self.model(
            from_person=to_person,
            to_person= from_person,
            status=status
        )
        relation_two= self.model(
            from_person = from_person,
            to_person=to_person,
            status=status
        )
        friends = self.bulk_create([
            relation_one,
            relation_two
        ])

        return friends[1]


class Relationship(models.Model):
    CHOICES = [
        ('Friends', _('Friends')),
        ('Following', _('Following')),
        ('Followers', _('Followers')),
        ('Blocked',_('Blocked'))
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
    status= models.CharField(
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
        return self.status

    class Meta:
        indexes = [
            models.Index(fields=['status'], name="status_idx")
        ]
        constraints = [
            models.CheckConstraint(check=~Q(from_person=F('to_person')), name="no_self-relation"),
            models.UniqueConstraint(fields=["from_person", "to_person", "status"], name="unique_relationship")
        ]



