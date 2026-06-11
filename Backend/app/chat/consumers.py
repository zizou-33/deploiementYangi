import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content', '')
        user_id = data.get('user_id')
        username = data.get('username', 'Inconnu')

        # Sauvegarde en base
        await self.save_message(user_id, content)

        # Broadcast
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'content': content,
                'username': username,
                'user_id': user_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['content'],
            'username': event['username'],
            'user_id': event['user_id'],
        }))

    @database_sync_to_async
    def save_message(self, user_id, content):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            user = User.objects.get(id=user_id)
            Message.objects.create(room=room, sender=user, content=content)
        except Exception:
            pass