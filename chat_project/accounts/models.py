from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    image=models.ImageField(upload_to='profile_pics',null=True,blank=True)
    last_seen=models.DateTimeField(null=True,blank=True)
    is_active=models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    

