from rest_framework import serializers
from app.reviews.models import Review


class ReviewSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Review

        fields = [
            "rating",
            "comment"
        ]

    def validate_rating(
        self,
        value
    ):

        if value < 1 or value > 5:

            raise serializers.ValidationError(
                "La note doit être entre 1 et 5."
            )

        return value