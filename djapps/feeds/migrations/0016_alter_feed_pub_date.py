# Generated by Django 4.0.4 on 2022-06-15 14:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('feeds', '0015_alter_tags_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feed',
            name='pub_date',
            field=models.DateTimeField(default=django.utils.timezone.localtime, editable=False),
        ),
    ]
