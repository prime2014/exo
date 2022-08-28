from config.celery_app import app as celery_app
from django_eventstream import send_event


@celery_app.task
def send_posts(pk, data):
    send_event(f"object-{pk}", "status_update", data)
