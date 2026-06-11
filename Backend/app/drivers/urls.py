from django.urls import path

from app.drivers.views import MyDriverProfileView

urlpatterns = [
    path("driver/me",MyDriverProfileView.as_view()),
]