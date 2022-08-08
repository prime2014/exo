from datetime import datetime
from rest_framework import serializers


class Post:
    def __init__(self, post, like=0, share=0):
        self.post = post
        self.share = share
        self.like = like 
        self.pub_date = datetime.now()
        
        
        
class PostSerializer(serializers.Serializer):
    post = serializers.CharField()
    share = serializers.IntegerField()
    like = serializers.IntegerField()
    pub_date = serializers.DateTimeField()