from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.reviews.models import Review
from app.reviews.serializers import ReviewSerializer
from app.rides.models import Ride
from app.users.permissions import IsCustomer


class CreateReviewView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsCustomer
    ]

    def post(self, request, ride_id):

        try:

            ride = Ride.objects.get(
                id=ride_id,
                customer=request.user,
                status="completed"
            )

        except Ride.DoesNotExist:

            return Response(
                {
                    "error": "Course invalide"
                },
                status=404
            )

        if Review.objects.filter(
            ride=ride
        ).exists():

            return Response(
                {
                    "error": "Avis déjà laissé"
                },
                status=400
            )

        serializer = ReviewSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = serializer.save(
            ride=ride,
            customer=request.user,
            driver=ride.driver
        )

        driver_profile = ride.driver.driver_profile

        total_reviews = Review.objects.filter(
            driver=ride.driver
        )

        average = (
            sum(r.rating for r in total_reviews)
            / total_reviews.count()
        )

        driver_profile.average_rating = round(
            average,
            2
        )

        driver_profile.ratings_count = (
            total_reviews.count()
        )

        driver_profile.save()

        return Response({
            "message": "Avis enregistré"
        })
