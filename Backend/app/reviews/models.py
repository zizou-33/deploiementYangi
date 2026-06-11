from django.db import models

from app.rides.models import Ride
from app.users.models import User


class Review(models.Model):

    ride = models.OneToOneField(
        Ride,
        on_delete=models.CASCADE
    )

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    driver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveSmallIntegerField()

    comment = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )