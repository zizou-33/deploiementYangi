from django.shortcuts import get_object_or_404
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.users.permissions import IsCustomer, IsDriver, IsAdmin
from .models import Ride
from .serializers import RideSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from app.users.permissions import IsCustomer

from .models import Ride
from .serializers import CreateRideSerializer
from .utils import calculate_price, haversine_distance


class CreateRideView(generics.CreateAPIView):

    serializer_class = CreateRideSerializer

    permission_classes = [
        IsCustomer
    ]

    def perform_create(self,serializer):

        pickup_lat = serializer.validated_data[
            "pickup_lat"
        ]

        pickup_lng = serializer.validated_data[
            "pickup_lng"
        ]

        destination_lat = serializer.validated_data[
            "destination_lat"
        ]

        destination_lng = serializer.validated_data[
            "destination_lng"
        ]

        already_running = Ride.objects.filter(
            customer=self.request.user,
            status__in=[
                "pending",
                "accepted",
                "started"
            ]
        ).exists()

        if already_running:
            raise serializers.ValidationError(
                "Vous avez déjà une course active."
            )

        distance = haversine_distance(
            pickup_lat,
            pickup_lng,
            destination_lat,
            destination_lng
        )

        price = calculate_price(
            distance
        )

        serializer.save(
            customer=self.request.user,

            distance_km=round(
                distance,
                2
            ),

            price=price,

            status="pending"
        )

class AvailableRidesView(APIView):

    permission_classes = [IsDriver]

    def get(self, request):

        rides = Ride.objects.filter(
            status="pending"
        )

        serializer = RideSerializer(
            rides,
            many=True
        )

        return Response(serializer.data)

class RideDetailView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        ride_id
    ):

        try:

            ride = Ride.objects.get(
                id=ride_id
            )

        except Ride.DoesNotExist:

            return Response(
                {
                    "error": "Course introuvable"
                },
                status=404
            )

        serializer = RideSerializer(
            ride
        )

        return Response(
            serializer.data
        )

class AcceptRideView(APIView):

    permission_classes = [IsDriver]

    def post(self, request, ride_id):

        ride = get_object_or_404(Ride, pk=ride_id)

        if ride.status != "pending" :
            return Response(
                {"message": "Course indisponible"},
                status=400
            )

        busy = Ride.objects.filter(
            driver=request.user,
            status__in=[
                "accepted",
                "started"
            ]
        ).exists()

        if busy:
            return Response(
                {
                    "error":
                        "Vous avez déjà une course en cours."
                },
                status=400
            )

        ride.driver = request.user
        ride.status = "accepted"

        ride.save()

        return Response({
            "message": "Course acceptée"
        })

class StartRideView(APIView):

    permission_classes = [IsDriver]

    def post(self, request, ride_id):

        ride = Ride.objects.get(id=ride_id)

        if ride.driver != request.user:
            return Response(
                {"error": "Non autorisé"},
                status=403
            )

        ride.status = "started"

        ride.save()

        return Response({
            "message": "Course démarrée"
        })

class CompleteRideView(APIView):

    permission_classes = [IsDriver]

    def post(self, request, ride_id):
        ride = Ride.objects.get(id=ride_id)

        if ride.driver != request.user:
            return Response(
                {"error": "Non autorisé"},
                status=403
            )

        ride.status = "completed"

        ride.save()

        return Response({
            "message": "Course terminée"
        })

class CustomerHistoryView(APIView):

    permission_classes = [IsCustomer]

    def get(self, request):

        rides = Ride.objects.filter(
            customer=request.user
        )

        serializer = RideSerializer(
            rides,
            many=True
        )

        return Response(serializer.data)

class CancelRideView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, ride_id):

        ride = get_object_or_404(Ride, pk=ride_id)

        if ride.status in ["started", "completed"]:

            return Response(
                {
                    "error": "Impossible d'annuler cette course"
                },
                status=400
            )

        ride.status = "cancelled"
        ride.cancelled_by = request.user.role

        ride.save()

        return Response({
            "message": "Course annulée"
        })

class DriverHistoryView(APIView):

    permission_classes = [IsDriver]

    def get(self, request):

        rides = Ride.objects.filter(
            driver=request.user
        )

        serializer = RideSerializer(
            rides,
            many=True
        )

        return Response(serializer.data)


class AdminRidesView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        rides = Ride.objects.all()

        data = [
            {
                "id": ride.id,
                "customer": ride.customer.username,
                "driver": (
                    ride.driver.username
                    if ride.driver else None
                ),
                "status": ride.status,
                "price": ride.price
            }
            for ride in rides
        ]

        return Response(data)
