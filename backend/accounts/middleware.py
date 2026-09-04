from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist

from .models import Profile


class LastSeenMiddleware:
    """
    Update user.profile.last_seen every time an authenticated user hits the API.
    Safely creates Profile if it doesn't exist.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        user = getattr(request, 'user', None)

        if user and not isinstance(user, AnonymousUser) and user.is_authenticated:
            try:
                profile = user.profile
            except ObjectDoesNotExist:
                # Create profile if missing (for old users)
                profile = Profile.objects.create(user=user)

            profile.last_seen = timezone.now()
            profile.save(update_fields=['last_seen'])

        return response
