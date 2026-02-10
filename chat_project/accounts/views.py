from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import SignUpSerializer,UserSerializer,ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from chat.models import Friends
from django.db.models import Q
from rest_framework.parsers import MultiPartParser,FormParser
# Create your views here.
class MyProfile(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser]
    def get(self,request):
        user=get_object_or_404(User.objects.select_related('profile'),id=request.user.id)
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def patch(self,request):
        profile=request.user.profile
        serializer=ProfileSerializer(profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfile(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,userid):
        user=get_object_or_404(User.objects.select_related('profile'),id=userid)
        
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
class UserListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        friend_pairs = Friends.objects.filter(
            Q(user1=request.user) | Q(user2=request.user)
        ).values_list('user1_id', 'user2_id')

        friend_ids = set(sum(friend_pairs, ()))
        friend_ids.discard(request.user.id)
        users=User.objects.exclude(id__in=friend_ids).exclude(id=request.user.id)
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class WhoAmI(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.username
        return Response({'username':user},status=status.HTTP_200_OK)


class Loginview(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        data=request.data
        username=data.get('username')
        password=data.get('password')

        if not username or not password:
            return Response({'message':'username or password required'},status=status.HTTP_400_BAD_REQUEST)
        
        user=authenticate(request,username=username,password=password)
        if not user:
            
            return Response({'message':"invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
        refresh=RefreshToken.for_user(user)

        return Response({'message':"login successfully",'access':str(refresh.access_token),'refresh':str(refresh),'username':request.user.username},status=status.HTTP_200_OK)
        
class SignUpView(APIView):
    def post(self,request):
        serializer=SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User Register Sucessfully"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        refresh_token=request.data.get('refresh') #getting token from client
        if not refresh_token:
            return Response({'message':'refresh token must required'},status=status.HTTP_400_BAD_REQUEST)
        try:
            token=RefreshToken(refresh_token)
            token.blacklist() #block the token
        except Exception:
            pass
        
        
        return Response({"message":"logout sucessfull"},status=status.HTTP_205_RESET_CONTENT)
    