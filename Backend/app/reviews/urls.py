from django.urls import path

from app.reviews.views import CreateReviewView

urlpatterns = [
    path("ride/<int:ride_id>/review/", CreateReviewView.as_view()),
]