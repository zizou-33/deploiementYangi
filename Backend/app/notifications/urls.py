from rest_framework import routers

from app.notifications.views import NotificationViewSet

router = routers.DefaultRouter()
router.register('notifications', NotificationViewSet, basename='notifications')
urlpatterns = router.urls