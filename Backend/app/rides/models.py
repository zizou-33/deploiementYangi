from django.db import models

from app.users.models import User


class Ride(models.Model):

    STATUS = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("started", "Started"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )
    CANCELLED_BY = (
        ("customer", "Customer"),
        ("driver", "Driver"),
        ("admin", "Admin"),
    )

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rides_as_customer")
    driver = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="rides_as_driver")

    pickup_address = models.CharField(
        max_length=255
    )

    pickup_lat = models.FloatField()

    pickup_lng = models.FloatField()

    destination_address = models.CharField(
        max_length=255
    )

    destination_lat = models.FloatField()

    destination_lng = models.FloatField()

    distance_km = models.FloatField(
        default=0
    )

    price = models.PositiveIntegerField(
        default=0
    )

    status = models.CharField(max_length=20,choices=STATUS,null=True,blank=True, default="pending")

    cancelled_by = models.CharField(
        max_length=20,
        choices=CANCELLED_BY,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} : {self.pickup_address} - {self.destination_address}"

