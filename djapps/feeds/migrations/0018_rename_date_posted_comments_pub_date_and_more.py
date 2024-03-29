# Generated by Django 4.0.5 on 2022-06-28 17:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('feeds', '0017_alter_feed_pub_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='date_posted',
            new_name='pub_date',
        ),
        migrations.RemoveField(
            model_name='comments',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='comments',
            name='flagged',
        ),
        migrations.RemoveField(
            model_name='comments',
            name='object_id',
        ),
        migrations.AddField(
            model_name='comments',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_comments', to='feeds.feed'),
        ),
    ]
