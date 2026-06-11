from rest_framework import serializers

from app.notifications.models import Notification


class NotificationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['id','title', 'content', 'receiver', 'is_read', 'created_at']
        read_only_fields = ['title','content','receiver','created_at']