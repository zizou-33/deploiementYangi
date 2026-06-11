# drivers/serializers.py

from rest_framework import serializers
from .models import DriverRequest


class DriverRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = DriverRequest

        fields = [
            "id",
            "status",
            "motivation",
            "id_card_number",

            "car_brand",
            "car_model",
            "car_color",
            "plate_number"
        ]