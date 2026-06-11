from django.urls import path, include

urlpatterns = [
    path('',include('app.users.urls')),
    path('',include('app.rides.urls')),
    path('',include('app.request.urls')),
    path('',include('app.reviews.urls')),
    path('',include('app.notifications.urls')),
    path('',include('app.drivers.urls')),
]