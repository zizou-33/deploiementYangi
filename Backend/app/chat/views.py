from django.db import models
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from app.rides.models import Ride

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def chat_rooms(request):
    if request.method == 'GET':
        # Retourne les rooms où l'user est client ou chauffeur
        rides = Ride.objects.filter(
            models.Q(customer=request.user) | models.Q(driver=request.user)
        )
        rooms = ChatRoom.objects.filter(ride__in=rides)
        return Response(ChatRoomSerializer(rooms, many=True).data)

    if request.method == 'POST':
        ride_id = request.data.get('ride_id')
        try:
            ride = Ride.objects.get(id=ride_id)
            room, created = ChatRoom.objects.get_or_create(ride=ride)
            return Response(ChatRoomSerializer(room).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Ride.DoesNotExist:
            return Response({'error': 'Course introuvable'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_room_detail(request, pk):
    try:
        room = ChatRoom.objects.get(id=pk)
        return Response(ChatRoomSerializer(room).data)
    except ChatRoom.DoesNotExist:
        return Response({'error': 'Room introuvable'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_messages(request, room_id):
    try:
        room = ChatRoom.objects.get(id=room_id)
        messages = room.messages.all()
        return Response(MessageSerializer(messages, many=True).data)
    except ChatRoom.DoesNotExist:
        return Response({'error': 'Room introuvable'}, status=404)