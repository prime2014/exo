from gc import callbacks
from kombu.compat import Consumer, Publisher, Queue, Exchange, ConsumerSet
from kombu.connection import Connection

# broadcast
# subscriptions
# request/reply --> http/https | ssl/telnet

# exchange = Exchange("FriendPost", type="topic", durable=True)

# queue = Queue("friendStatus", exchange=exchange, routing_key="posts.#", durable=True)


# def send_posts_to_friends(post):
#     with Connection("redis://redis:6379/", failover_strategy="round-robin") as conn:
#         with conn.channel() as channel:
#             publisher = Publisher(
#                 connection=conn,
#                 exchange=exchange,
#                 routing_key=queue.routing_key,
#                 exchange_type=exchange.type,
#                 channel=channel,
#             )
#             publisher.publish(
#                 post,
#                 retry=True,
#                 routing_key=queue.routing_key,
#                 serializer=["json", "yaml"],
#                 delivery_mode="transient",
#                 declare=[exchange, queue]
#             )
#             conn.release()
