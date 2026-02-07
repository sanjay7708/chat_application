from django.shortcuts import render,get_object_or_404
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SendIntrestSerializer,RoomListSerializer
from . models import Interest,Friends,Rooms,Message
from django.db.models import Q
# Create your views here.

class RoomDetailView(APIView):
    def get(self,request,roomname):
        
        room=get_object_or_404(Rooms,room_name=roomname)
        message=Message.objects.filter(room=room).order_by('created_at')[:25]
        data=[{'username':i.user.username,'message':i.content,'userid':i.user.id}for i in message]
        return Response(data,status=status.HTTP_200_OK)

class RoomListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        room=Rooms.objects.filter(Q(room_type='group')|Q(room_type='private',users=request.user)).prefetch_related('users')
        serializer=RoomListSerializer(room,many=True,context={'request':request})
        return Response(serializer.data,status=status.HTTP_200_OK)

class SendInterestView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=SendIntrestSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message':"Interest sent successfully"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IncomeInterestView(APIView):
    def get(self,request):
        print('this is incomde request')
        print(request.user.username)
        print("IS AUTH:", request.user.is_authenticated)
        interest=Interest.objects.filter(receiver=request.user,status='pending')
        print('query count = ',interest.count())
        print(interest)
        for i in interest:
            print(i.id,i.sender.username)
        data=[{
            'id':i.id,
            'sender_id':i.sender.id,
            'sender_name':i.sender.username,
            'created':i.created_at
        }for i in interest]
        return Response(data,status=status.HTTP_200_OK)
    
class OutgoingInterestView(APIView):
    def get(self,request):
        interest=Interest.objects.filter(sender=request.user)
        data=[{
            'id':i.id,
            'sender':i.receiver.username,
            'created':i.created_at
        }for i in interest]
        return Response(data,status=status.HTTP_200_OK)

class ResponseInterestView(APIView):
    def post(self,request):
        data=request.data
        interest_id=data.get('interest_id')
        action=data.get('status')
        
        if action not in ['accepted','rejected']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        interest=get_object_or_404(Interest,id=interest_id,receiver=request.user,status='pending')
        if action=='accepted':
            interest.status='accepted'
            interest.save()
            Friends.objects.create(user1=interest.sender,user2=interest.receiver)
            room_name=f"{interest.sender.username}-{interest.receiver.username}-chat"
            room,_=Rooms.objects.get_or_create(room_name=room_name,room_type='private')
            room.users.add(interest.sender,interest.receiver)
            return Response({'message':'interest accepted'},status=status.HTTP_201_CREATED)
        else:
            interest.status='rejected'
            interest.save()
            return Response({
                'message':'interest reject'
            },status=status.HTTP_200_OK)

    