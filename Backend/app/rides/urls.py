from django.urls import path

from .views import CreateRideView, AvailableRidesView, AcceptRideView, StartRideView, CompleteRideView, \
    CustomerHistoryView, DriverHistoryView, RideDetailView, CancelRideView, AdminRidesView

urlpatterns = [

    path("ride/create/", CreateRideView.as_view() ),

    path("ride/available/", AvailableRidesView.as_view() ),

    path("ride/detail/<int:ride_id>", RideDetailView.as_view() ),

    path("ride/accept/<int:ride_id>/", AcceptRideView.as_view() ),

    path("ride/start/<int:ride_id>/",StartRideView.as_view() ),

    path("ride/complete/<int:ride_id>/", CompleteRideView.as_view() ),

    path("ride/customer-history/", CustomerHistoryView.as_view() ),

    path("ride/driver-history/", DriverHistoryView.as_view() ),

    path("ride/cancel/<int:ride_id>/", CancelRideView.as_view() ),

    path("admin/rides/",AdminRidesView.as_view())

]