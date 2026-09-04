from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source='sender.username', read_only=True
    )
    receiver_username = serializers.CharField(
        source='receiver.username', read_only=True
    )

    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'receiver',
            'sender_username',
            'receiver_username',
            'content',
            'timestamp',
            'is_read',
        ]
        read_only_fields = ['sender', 'timestamp', 'is_read']

    def create(self, validated_data):
        """
        Set sender from the logged-in user instead of trusting client data.
        """
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if user is None or not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        validated_data['sender'] = user
        return super().create(validated_data)
