# Generated by Django 4.0.7 on 2022-10-13 19:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feeds', '0021_likecount'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feed',
            name='likes',
        ),
        migrations.RemoveField(
            model_name='feed',
            name='share',
        ),
    ]
