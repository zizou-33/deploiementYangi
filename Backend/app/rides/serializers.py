from rest_framework import serializers
from .models import Ride


class CreateRideSerializer(serializers.ModelSerializer):

    class Meta:

        model = Ride

        fields = [
            "pickup_address",
            "pickup_lat",
            "pickup_lng",

            "destination_address",
            "destination_lat",
            "destination_lng"
        ]

    def validate(self,attrs):
        same_point = (attrs["pickup_lat"] == attrs["destination_lat"] and attrs["pickup_lng"] == attrs["destination_lng"])

        if same_point:
            raise serializers.ValidationError(
                "Le départ et l'arrivée sont identiques."
            )

        return attrs

class RideSerializer(
    serializers.ModelSerializer
):

    customer = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    driver = serializers.SerializerMethodField()

    class Meta:

        model = Ride

        fields = [
            "id",

            "customer",
            "driver",

            "pickup_address",
            "pickup_lat",
            "pickup_lng",

            "destination_address",
            "destination_lat",
            "destination_lng",

            "distance_km",
            "price",

            "status",

            "created_at"
        ]

    def get_driver(self, obj):

        if obj.driver:
            return obj.driver.username

        return None