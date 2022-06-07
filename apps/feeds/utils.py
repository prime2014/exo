
from json import JSONDecodeError, JSONEncoder
from kombu import Queue, Connection, Consumer, Exchange
from django.contrib.contenttypes.models import ContentType
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer


class RedisConnection(Connection):
    def __init__(self, hostname='localhost', userid=None, password=None, virtual_host=None, port=None, insist=False, ssl=False, transport=None, connect_timeout=5, transport_options=None, login_method=None, uri_prefix=None, heartbeat=0, failover_strategy='round-robin', alternates=None, **kwargs):
        self.hostname = "redis"
        self.port = 6379
        self.failover_strategy = "round-robin"
        self.connect()

    def channel(self):
        return super().channel()

    def Producer(self, channel=None, *args, **kwargs):
        return super().Producer(channel, *args, **kwargs)

    def reconstruction(self, *args, **kwargs):
        # construct the data set for user who is newly registered in redis or
        # when the server goes down
        user = ContentType.objects.get(app_label="accounts", model="user")
        try:
            user.get_object_for_this_type(pk=kwargs.get("pk", None))
        except user.DoesNotExist:
            # catch the error since "get_object_for_this_type" will not catch ObjectNotExist error
            raise "User does not exist!"


