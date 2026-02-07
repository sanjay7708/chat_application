from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Interest(models.Model):
    interest_choices=[
        ('pending','Pending'),
        ('accepted','Accepted'),
        ('rejected', 'Rejected')
    ]
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name='sent_interest')
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name='received_interest')
    status=models.CharField(max_length=20,choices=interest_choices)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together=('sender','receiver')


class Friends(models.Model):
    user1=models.ForeignKey(User,related_name='friend1',on_delete=models.CASCADE)
    user2=models.ForeignKey(User,related_name='friend2',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together=('user1','user2')
    
class Rooms(models.Model):
    room_type=[
        ('private','Private'),
        ('group','Group')
    ]
    room_name=models.CharField(max_length=100,unique=True)
    room_type=models.CharField(max_length=20,choices=room_type,default='group')
    users=models.ManyToManyField(User,related_name='rooms')
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.room_name
class Message(models.Model):
    room=models.ForeignKey(Rooms,on_delete=models.CASCADE)
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender')
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    
    
