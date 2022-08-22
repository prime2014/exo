import redis
from redis.commands.graph.node import Node
from redis.commands.graph.edge import Edge
from redis.commands.parser import CommandsParser
from redis.exceptions import ConnectionError
from typing import Union
from string import Template
import json, random
import time, uuid
import math
import logging
from django_eventstream import send_event


logging.basicConfig(format="%(asctime)s %(module)s %(message)s", level=logging.INFO, encoding="utf8")

logger = logging.getLogger(__name__)


conn = redis.Redis(host="redisModules", port=6379, db=0)
social_graph = conn.graph("SocialMedia")



def setObject(user, uid):
    user['id'] = uid
    return user


def create_post(pk:int, post:dict):
    '''creates a user post in redis database'''
    uid = post.get("uuid")
    params = {"pk": pk, "pub_date": post.get("pub_date"), "post": post.get("post"), "author": post.get("author"), "uuid": uid}
    query = '''MATCH (p1:Person {pgpk: $pk}) CREATE (po:Post {uuid:$uuid, post:$post, author:$author, pub_date:$pub_date}), (po)-[:created_by]->(p1), (p1)-[:post]->(po) RETURN po'''
    try:
        result = social_graph.query(query, params).result_set
        logger.info(result)
        post_result = [setObject(rec[0].properties, rec[0].id) for rec in result]
        print(post_result[0])
        return post_result[0]
    except Exception as exc:
        logger.info(exc)
        raise "There was a problem with adding the relation"



# if __name__ == "__main__":
#     pr = uuid.uuid4()

#     pid = f"{pr}{int(round(time.time(), 0))}"
#     my_post = {
#         "author":'{"first_name": "Prime", "last_name": "omondi", "avatar": "http://127.0.0.1:8000/imag.jpg"}',
#         "post": "I am happy that you have finally landed a job",
#         "datetime": "14/12/2021",
#         "uuid": pid,
#         "image":[]
#     }
#     post = PostCrudOperations()
#     post.create_post(pk=34, post=my_post)
