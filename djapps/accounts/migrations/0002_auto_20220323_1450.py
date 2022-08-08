# Generated by Django 3.2.12 on 2022-03-23 14:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.expressions
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Relationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Friends', 'Friends'), ('Following', 'Following'), ('Followers', 'Followers'), ('Blocked', 'Blocked')], default='Friends', max_length=20)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('from_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_user', to=settings.AUTH_USER_MODEL)),
                ('to_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_person', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='relation',
            field=models.ManyToManyField(related_name='realtionship', through='accounts.Relationship', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddIndex(
            model_name='relationship',
            index=models.Index(fields=['status'], name='status_idx'),
        ),
        migrations.AddConstraint(
            model_name='relationship',
            constraint=models.CheckConstraint(check=models.Q(('from_person', django.db.models.expressions.F('to_person')), _negated=True), name='no_self-relation'),
        ),
        migrations.AddConstraint(
            model_name='relationship',
            constraint=models.UniqueConstraint(fields=('from_person', 'to_person', 'status'), name='unique_relationship'),
        ),
    ]
