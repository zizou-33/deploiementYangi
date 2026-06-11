from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from app.notifications.models import Notification
from app.notifications.serializers import NotificationsSerializer


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user).order_by('-created_at')