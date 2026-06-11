from rest_framework import serializers
from .models import ChatRoom, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'content', 'created_at']
        read_only_fields = ['sender', 'created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    ride_id = serializers.IntegerField(source='ride.id', read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'ride_id', 'messages', 'created_at']