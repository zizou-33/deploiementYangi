from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .permissions import IsAdmin
from .serializers import RegisterSerializer, UpdateProfileSerializer, ChangePasswordSerializer
from django.contrib.auth.hashers import check_password


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        })

    def patch(self, request):

        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )


class UsersListView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        users = User.objects.all()

        data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "phone": u.phone,
                "role": u.role,
                "is_active": u.is_active
            }
            for u in users
        ]

        return Response(data)

class BlockUserView(APIView):

    permission_classes = [IsAdmin]

    def patch(self, request, user_id):

        try:
            user = User.objects.get(id=user_id)

        except User.DoesNotExist:

            return Response(
                {"error": "Utilisateur introuvable"},
                status=404
            )

        user.is_active = False
        user.save()

        return Response({
            "message": "Utilisateur bloqué"
        })

class UnblockUserView(APIView):

    permission_classes = [IsAdmin]

    def patch(self, request, user_id):

        user = User.objects.get(id=user_id)

        user.is_active = True
        user.save()

        return Response({
            "message": "Utilisateur débloqué"
        })

class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        if not request.user.check_password(
            serializer.validated_data[
                "old_password"
            ]
        ):

            return Response(
                {
                    "error": "Ancien mot de passe incorrect"
                },
                status=400
            )

        request.user.set_password(
            serializer.validated_data[
                "new_password"
            ]
        )

        request.user.save()

        return Response(
            {
                "message": "Mot de passe modifié"
            }
        )
