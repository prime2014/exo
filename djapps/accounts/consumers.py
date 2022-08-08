import json
from channels.generic.websocket import WebsocketConsumer
import logging
from asgiref.sync import async_to_sync


logging.basicConfig(encoding="utf-8", level=logging.INFO, format="%(asctime)s %(module)s %(level)s %(message)s")

logger = logging.getLogger(__name__)


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        logger.info(self.scope)
        self.room_name = self.scope["url_route"]['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        self.close()

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")

        # send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message
            }
        )

    def chat_message(self, event):
        message = event.get("message")

        # send message to websocket
        self.send(text_data=json.dumps({
            "message": message
        }))
