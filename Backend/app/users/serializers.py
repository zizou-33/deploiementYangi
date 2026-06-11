from rest_framework import serializers
from .models import User


from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password", "phone"]

    def create(self, validated_data):

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data["phone"],
            role="customer"
        )

class UpdateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "phone"
        ]

    def validate_email(self, value):

        user = self.instance

        if User.objects.exclude(
            id=user.id
        ).filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Cet email existe déjà."
            )

        return value

    def validate_phone(self, value):

        user = self.instance

        if User.objects.exclude(
            id=user.id
        ).filter(
            phone=value
        ).exists():

            raise serializers.ValidationError(
                "Ce numéro existe déjà."
            )

        return value

class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField(
        min_length=8
    )