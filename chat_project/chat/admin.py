from django.contrib import admin

# Register your models here.
from . models import Friends,Interest,Rooms,Message
admin.site.register(Friends)
admin.site.register(Interest)
admin.site.register(Rooms)
admin.site.register(Message)