from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

user=get_user_model()

@database_sync_to_async
def get_user(token):
    try:
        accessToken=AccessToken(token)
        user_id=accessToken['user_id']
        return user.objects.get(id=user_id)
    except:
        return AnonymousUser()
    
class JWTAuthMiddleware:
    def __init__(self,inner):
        self.inner=inner
    
    async def __call__(self,scope,receive,send):
        query_string=scope['query_string'].decode()
        parms=parse_qs(query_string)
        token=parms.get('token')
        if token:
            scope['user']=await get_user(token[0])
        else:
            scope['user']=AnonymousUser()
        return await self.inner(scope,receive,send)