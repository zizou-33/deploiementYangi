from django.db import models
from django.conf import settings


class DriverProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="driver_profile"
    )

    car_brand = models.CharField(max_length=100)

    car_model = models.CharField(max_length=100)

    car_color = models.CharField(max_length=50)

    plate_number = models.CharField(
        max_length=50,
        unique=True
    )

    is_available = models.BooleanField(
        default=False
    )

    average_rating = models.FloatField(
        default=0
    )
    
    ratings_count = models.PositiveIntegerField(default=0)

    total_rides = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.plate_number}"