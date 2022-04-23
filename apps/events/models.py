from unicodedata import name
from attr import field
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext as _



class Events(models.Model):
    CHOICES = [
      ("Info", _("Info")),
      ("Warn", _("Warn")),
      ("Critical", _("Critical")),
    ]
    description = models.CharField(
        max_length=100,
    )
    verb = models.CharField(
        max_length=40,
        default="Info",
        choices=CHOICES
    )
