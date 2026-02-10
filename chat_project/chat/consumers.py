from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . models import Rooms,Message
from django.utils import timezone
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from accounts.models import Profile
from channels.db import database_sync_to_async
class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name=self.scope['url_route']['kwargs']['room_name']
        self.room_group_name=f"chat_{self.room_name}"
        self.user=self.scope['user']

        print(self.user)
        if not self.user.is_authenticated:
            await self.close()
            return
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await set_user_online(self.user)
        await self.accept()
    async def receive_json(self, content, **kwargs):
        print('this is connect :',content)
        message=content.get('message')
        username=content.get('username')
        

        if not message:
            await self.send_json({
                'error':"Message cannot be empty"
            })
            return
        

        await self.save_message(username,self.room_name,message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':"send_message",
                'message':message,
                'username':self.user.username,
                'userid':self.user.id
            }
        )
    async def send_message(self,event):
        message=event['message']
        username=event['username']
        userid=event['userid']
        await self.send_json({
            'message':message,
            'username':username,
            'userid':userid
        })
    async def disconnect(self, code):
        if self.user.is_authenticated:
            await set_last_seen(self.user)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @sync_to_async
    def save_message(self,username,room,message):
        username=User.objects.get(username=username)
        room=Rooms.objects.get(room_name=room)
        Message.objects.create(room=room,user=username,content=message)
@database_sync_to_async
def set_user_online(user):
    profile=Profile.objects.get(user=user)
    profile.is_active=True
    profile.save()

@database_sync_to_async
def set_last_seen(user):
    profile=Profile.objects.get(user=user)
    profile.is_active=False
    profile.last_seen=timezone.now()
    profile.save()