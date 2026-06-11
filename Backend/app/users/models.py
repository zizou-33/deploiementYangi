from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):

    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("driver", "Driver"),
        ("admin", "Admin"),
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="customer"
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]