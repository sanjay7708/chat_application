"""
ASGI config for chat_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter,URLRouter
from chat.middleware import JWTAuthMiddleware
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_project.settings')

django_application = get_asgi_application()

import chat.routing
application=ProtocolTypeRouter({
    'http':django_application,
    'websocket':JWTAuthMiddleware(URLRouter(chat.routing.websocket_urlpatterns))
})
