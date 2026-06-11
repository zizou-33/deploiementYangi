from rest_framework import serializers
from .models import DriverProfile


class DriverProfileSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = DriverProfile

        fields = [
            "car_brand",
            "car_model",
            "car_color",
            "plate_number",

            "average_rating",
            "ratings_count",

            "total_rides",

            "is_available"
        ]