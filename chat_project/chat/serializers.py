from rest_framework import serializers
from django.contrib.auth.models import User
from chat.models import Interest,Rooms

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username']


class RoomListSerializer(serializers.ModelSerializer):
    users=serializers.SerializerMethodField()
    class Meta:
        model=Rooms
        fields=['id','room_name','room_type','users']
    
    def get_users(self,room):
        request=self.context.get('request')
        user=request.user if request else None
        if room.room_type=='private' and user:
            qs=room.users.exclude(id=user.id)
        else:
            qs=room.users.all()
        return UserMiniSerializer(qs, many=True).data




class SendIntrestSerializer(serializers.ModelSerializer):
    reciver_id=serializers.IntegerField(write_only=True)
    class Meta:
        model=Interest
        fields=['reciver_id']
    def validate_reciver_id(self,value):
        sender=self.context['request'].user
        if sender.id==value:
            raise serializers.ValidationError("You cannot send interest to yourself")
        if Interest.objects.filter(sender=sender,receiver__id=value).exists():
            raise serializers.ValidationError("Interest already sent to this user")
        return value    
    
    def create(self,validated_data):
        reciver_id=validated_data.pop('reciver_id')
        sender=self.context['request'].user
        receiver=User.objects.get(id=reciver_id)
        interest=Interest.objects.create(
            sender=sender,
            receiver=receiver,
            status='pending'
        )
        return interest
