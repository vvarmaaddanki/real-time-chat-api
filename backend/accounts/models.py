from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    last_seen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"

    @property
    def online(self):
        if not self.last_seen:
            return False

        now = timezone.now()
        return (now - self.last_seen).total_seconds() < 60  # 1 minute online window
