from django.db import models

from app.users.models import User


class Notification(models.Model):

    title = models.CharField(max_length=200)
    receiver = models.ForeignKey(User, related_name='receiver', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
