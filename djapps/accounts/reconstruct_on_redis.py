import redis
from redis.commands.graph.node import Node
from string import Template


class RedisConnectionAbstract(object):
    def __init__(self):
        self.conn = redis.Redis(host="redisModules", port=6379)
        self.social_graph = self.conn.graph("SocialMedia")


def setObject(user, uid):
    user['id'] = uid
    return user


class UserCrudOperations(RedisConnectionAbstract):
    '''performs CRUD functionalities for users in redisgraph database'''
    def __init__(self):
        super().__init__()

    def login(self, user):
        '''creates a user session in the redis database'''
        pass

    def logout(self):
        '''logs out a user session from the redis database'''
        pass

    def get_user_object(self, pk: int) -> Node:
        '''Gets a single user object as a node from the database'''
        template = Template("MATCH (p1:Person {pgpk: $pk}) RETURN p1")
        query = template.substitute(pk=pk)
        try:
            result = self.social_graph.query(query).result_set
            print(result)
            user_result = [rec[0] for rec in result]
            return user_result[0]
        except redis.ReadOnlyError as exc:
            raise exc

    def get_users(self) -> list:
        '''Gets a list of users from the database'''
        pass

    def create_user(self, user: dict) -> dict:
        '''functionality for creating a user on redis'''

        user_pk = user.get("pk")
        email = user.get("email")
        pname = user.get("username")
        first_name = user.get("first_name")
        last_name = user.get("last_name")
        is_active = user.get("is_active")
        meta = user.get("meta")
        avatar = user.get("avatar")

        template = Template("MERGE (p1:Person {email : '$email'}) ON \
                            CREATE SET p1.username='$pname', p1.first_name= '$first_name', \
                            p1.is_active = '$is_active', p1.meta = '$meta', p1.avatar= '$avatar', \
                            p1.last_name='$last_name', p1.pgpk=$user_pk, p1.email='$email' RETURN p1")
        query = template.substitute(pname=pname, first_name=first_name, last_name=last_name,
                                    user_pk=user_pk, is_active=is_active, meta=meta, avatar=avatar, email=email)
        print(query)
        try:
            result = self.social_graph.query(query).result_set
            user_result = [setObject(rec[0].properties, rec[0].id) for rec in result]

            return user_result[0]
        except redis.ReadOnlyError:
            raise "There was an error finding the user"

    def update_user(self, user: dict) -> dict:
        '''functionality to update an existing user in the database'''
        pass

    def delete_user(self, user: dict) -> dict:
        '''functionality to delete a user from the database'''
        pass

    def get_followers(self, pk: int) -> list:
        '''gets a list of users who are following the requesting user'''
        pass

    def add_friend(self, pk, friend_pk):
        try:
            template = Template("MATCH (p1:Person {pgpk: $pk}), (p2:Person {pgpk: $friend_pk}) \
                                CREATE (p1)-[:friends_with]->(p2), (p2)-[:friends_with]->(p1) RETURN p2")
            query = template.substitute(pk=pk, friend_pk=friend_pk)
            result = self.social_graph.query(query).result_set
            user_result = [setObject(rec[0].properties, rec[0].id) for rec in result]
            return user_result[0]
        except Exception():
            raise "There was a problem with your request"

    def block_friend(self, owner, other):
        pass


rconn_user = UserCrudOperations()


if __name__ == "__main__":
    rconn_user.add_friend(pk=59, friend_pk=60)
