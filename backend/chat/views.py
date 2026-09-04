from django.contrib.auth.models import User
from django.db import models

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Message, Block
from .serializers import MessageSerializer
from accounts.throttling import SendMessageThrottle


class MessageListCreateView(APIView):
    """
    View to list messages between users and create new messages.
    Requires authentication.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [SendMessageThrottle]

    def get(self, request):
        """
        GET /api/chat/messages/?user_id=2[&after=10]
        Returns messages between logged-in user and user_id.
        If 'after' is passed, only return messages with id > after.
        """
        # Get the other user's ID from the query parameters.
        other_user_id = request.query_params.get("user_id")
        if not other_user_id:
            return Response(
                {"detail": "user_id query param is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the 'after' parameter to fetch messages after a certain ID (for polling).
        after_id = request.query_params.get("after")

        # Ensure the other user exists.
        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # The currently authenticated user.
        user = request.user

        # Fetch messages where the sender and receiver are the two users.
        qs = Message.objects.filter(
            sender__in=[user, other_user],
            receiver__in=[user, other_user],
        ).order_by("id")

        # Mark all messages FROM otherUser TO currentUser as read
        Message.objects.filter(
            sender=other_user,
            receiver=request.user,
            is_read=False,
        ).update(is_read=True)

        # If 'after_id' is provided, filter for messages with a greater ID.
        if after_id:
            qs = qs.filter(id__gt=after_id)

        serializer = MessageSerializer(qs, many=True)
        # Return the serialized messages.
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        POST /api/chat/messages/
        body: { "receiver": 2, "content": "hello" }
        sender = request.user
        """

        # Get the receiver's ID from the request body.
        receiver_id = request.data.get("receiver")
        if not receiver_id:
            return Response(
                {"detail": "receiver is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure the receiver user exists.
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Receiver not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 1) You blocked them → you can't send
        if Block.objects.filter(blocker=request.user, blocked=receiver).exists():
            return Response(
                {"detail": "You blocked this user."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 2) They blocked you → you can't send
        if Block.objects.filter(blocker=receiver, blocked=request.user).exists():
            return Response(
                {"detail": "This user has blocked you."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Use the serializer to validate and create the message.
        # The request object is passed in the context to the serializer
        # so it can set the sender to the authenticated user.
        serializer = MessageSerializer(
            data=request.data,
            context={"request": request},
        )
        if serializer.is_valid():
            # Save the new message to the database.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If validation fails, return the errors.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlockView(APIView):
    """
    View to block and unblock users.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        POST /api/chat/block/
        body: { "user_id": 3 }
        -> current user blocks user_id
        """
        # Get the ID of the user to be blocked from the request body.
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # A user cannot block themselves.
        if str(request.user.id) == str(user_id):
            return Response(
                {"detail": "You cannot block yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Ensure the user to be blocked exists.
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Create a new Block entry, or do nothing if it already exists.
        Block.objects.get_or_create(
            blocker=request.user,
            blocked=other_user,
        )

        return Response({"blocked": True}, status=status.HTTP_200_OK)

    def delete(self, request):
        """
        DELETE /api/chat/block/?user_id=3
        -> current user unblocks user_id
        """
        # Get the ID of the user to unblock from query parameters.
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find and delete the Block entry.
        Block.objects.filter(
            blocker=request.user,
            blocked_id=user_id,
        ).delete()

        return Response({"blocked": False}, status=status.HTTP_200_OK)


class BlockStatusView(APIView):
    """
    View to check the block status between the current user and another user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        GET /api/chat/block/status/?user_id=3

        Returns:
        {
          "blocked_by_me": true/false,
          "blocked_me": true/false
        }
        """
        # Get the other user's ID from the query parameters.
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id query param is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Ensure the other user exists.
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if the current user has blocked the other user.
        blocked_by_me = Block.objects.filter(
            blocker=request.user,
            blocked=other_user,
        ).exists()

        # Check if the other user has blocked the current user.
        blocked_me = Block.objects.filter(
            blocker=other_user,
            blocked=request.user,
        ).exists()

        # Return the block status.
        return Response(
            {
                "blocked_by_me": blocked_by_me,
                "blocked_me": blocked_me,
            },
            status=status.HTTP_200_OK,
        )


class UnreadCountView(APIView):
    """
    View to get the count of unread messages for the current user, grouped by sender.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns unread messages count grouped by sender.
        Example:
        [
           { "user_id": 2, "count": 5 },
           { "user_id": 4, "count": 1 }
        ]
        """
        # Filter for unread messages where the receiver is the current user.
        unread = Message.objects.filter(
            receiver=request.user,
            is_read=False,
        ).values("sender").annotate(count=models.Count("id")) # Group by sender and count messages.

        # Format the data for the response.
        data = [
            {"user_id": item["sender"], "count": item["count"]}
            for item in unread
        ]

        # Return the list of unread counts per user.
        return Response(data, status=200)
