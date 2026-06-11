from django.urls import path
from .import views

urlpatterns = [
    path('drivers/request/', views.CreateDriverRequestView.as_view(), name='index'),
    path('admin/request/approve/<int:request_id>/', views.ApproveDriverView.as_view(), name='approveRequest'),
    path('admin/request/decline/<int:request_id>/', views.DeclineDriverView.as_view(), name='declineRequest'),
    path('admin/requests/',views.requestListView.as_view(),name="home"),
]