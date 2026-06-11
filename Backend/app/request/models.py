from django.db import models

from app.users.models import User


class DriverRequest(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    motivation = models.TextField()

    id_card_number = models.CharField(
        max_length=50
    )

    car_brand = models.CharField(
        max_length=100
    )

    car_model = models.CharField(
        max_length=100
    )

    car_color = models.CharField(
        max_length=50
    )

    plate_number = models.CharField(
        max_length=50,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f'request of {self.user.username} '