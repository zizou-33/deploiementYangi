from django.contrib import admin
from .models import DriverRequest

from app.users.models import User

# Register your models here.
admin.site.register(DriverRequest)
