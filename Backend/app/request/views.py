# drivers/views.py
from django.dispatch import receiver
from rest_framework import generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DriverRequest
from .serializers import DriverRequestSerializer
from ..drivers.models import DriverProfile
from ..notifications.models import Notification
from ..users.permissions import IsCustomer


class CreateDriverRequestView(generics.CreateAPIView):

    serializer_class = DriverRequestSerializer
    permission_classes = [IsCustomer]

    def perform_create(self, serializer):

        if DriverRequest.objects.filter(status="pending").exists():
            return Response({
                "message": "Vous avez deja une requete en cours d'analyse"
            })
        serializer.save(
            user=self.request.user,
            status="pending"
        )
        Notification.objects.create(
            title="Devenir chauffeur",
            content="Votre demande pour devenir chauffeur sur notre plateforme est en cours d'analyse",
            receiver= self.request.user,
        )


class ApproveDriverView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, request_id):

        driver_request = get_object_or_404(DriverRequest, pk=request_id)

        if DriverProfile.objects.filter(plate_number=driver_request.plate_number).exists():
            return Response({
                "plate_number": "driver profile with this plate number already exists."
            }, status=status.HTTP_400_BAD_REQUEST)

        driver_request.status = "approved"
        driver_request.save()
        user = driver_request.user
        user.role = "driver"
        user.save()

        DriverProfile.objects.create(
            user=user,
            car_brand=driver_request.car_brand,
            car_model=driver_request.car_model,
            car_color=driver_request.car_color,
            plate_number=driver_request.plate_number
        )

        return Response({
            "message": "Chauffeur approuvé"

        })

class DeclineDriverView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, request_id):

        driver_request = get_object_or_404(DriverRequest, pk=request_id)

        driver_request.status = "declined"
        driver_request.save()

        return Response({
            "message": "Candidature refusée",
            "reason": request.data["reason"]
        })

class requestListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        requests = DriverRequest.objects.all().order_by("-status")
        serializer = DriverRequestSerializer(requests, many=True)
        return Response(serializer.data)
