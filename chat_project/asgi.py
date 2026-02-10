"""
ASGI config for chat_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""


import os
import django

# ✅ tell Django which settings to use
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "chat_project.settings"
)

# ✅ initialize Django BEFORE anything else
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.middleware import JWTAuthMiddleware
import chat.routing

django_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": JWTAuthMiddleware(
        URLRouter(chat.routing.websocket_urlpatterns)
    ),
})

