from django.urls import path
from . import views

urlpatterns = [
    path('chat/rooms/', views.chat_rooms),
    path('chat/rooms/<int:pk>/', views.chat_room_detail),
    path('chat/rooms/<int:room_id>/messages/', views.chat_messages),
]