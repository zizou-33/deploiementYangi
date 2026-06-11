from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import UsersListView, BlockUserView, UnblockUserView, ChangePasswordView

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),

    path('auth/profile/', views.ProfileView.as_view(), name='profile'),

    path("auth/login/", TokenObtainPairView.as_view()),

    path("auth/change-password/", ChangePasswordView.as_view()),

    path("auth/refresh/", TokenRefreshView.as_view()),

    path("admin/users", UsersListView.as_view()),

    path("admin/user/block/<int:user_id>/", BlockUserView.as_view()),

    path("admin/user/unblock/<int:user_id>/", UnblockUserView.as_view()),
]