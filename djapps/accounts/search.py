import redis
from redis.commands.search.query import Query
from redis.commands.search.document import Document
from redis.commands.search.result import Result
from string import Template
import json


def search_users(name):
    conn = redis.Redis(host="redisModules", port=6379, db=0)
    try:
        idx = conn.ft("users")
        q = Query(f"(@first_name|last_name:({name}))").limit_fields("first_name", "last_name", "username", "avatar", "pk")
        result = idx.search(q).docs
        print(q.query_string())
        result_set = list(json.loads(obj.json) for obj in result)
        print(result_set)
        print(type(result))
    except Exception() as exc:
        raise exc



if __name__ == "__main__":
    search_users("prime")
