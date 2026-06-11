from rest_framework.response import Response
from rest_framework.views import APIView

from app.drivers.serializers import DriverProfileSerializer
from app.users.permissions import IsDriver


class MyDriverProfileView(APIView):

    permission_classes = [
        IsDriver
    ]

    def get(self, request):

        serializer = DriverProfileSerializer(
            request.user.driver_profile
        )

        return Response(
            serializer.data
        )
