# Generated by Django 4.0.4 on 2022-05-23 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feeds', '0011_remove_media_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='feed',
            name='is_shared',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name='feed',
            name='shared_post',
            field=models.JSONField(null=True),
        ),
    ]
