from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from django.contrib.auth.models import User
from django.conf import settings

from .serializers import RegisterSerializer, UserSerializer
from .models import Profile
from .throttling import RegisterThrottle
from chat.models import Message


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  
    throttle_classes = [RegisterThrottle]

    def post(self, request):
    
        # 1) Check secret key
        secret = request.data.get("secret")
        if secret != settings.REGISTRATION_SECRET:
            return Response(
                {"detail": "Invalid registration secret."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 2) Normal registration flow
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_user = request.user
        others = User.objects.exclude(id=current_user.id)

        result = []

        for user in others:
            # Get last message between current_user and this user
            last_msg = (
                Message.objects.filter(
                    sender__in=[current_user, user],
                    receiver__in=[current_user, user],
                )
                .order_by("-timestamp")
                .first()
            )

            if last_msg:
                text = last_msg.content
                if len(text) > 40:
                    text = text[:40] + "…"

                last_message = text
                last_message_time = last_msg.timestamp
            else:
                last_message = ""
                last_message_time = None

            result.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "last_message": last_message,
                    "last_message_time": last_message_time,
                }
            )

        return Response(result, status=200)


class UserPresenceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.exclude(id=request.user.id)
        data = []

        for user in users:
            profile, _ = Profile.objects.get_or_create(user=user)
            online = profile.online
            last_seen = profile.last_seen

            data.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "online": online,
                    "last_seen": last_seen,
                }
            )

        return Response(data, status=200)
