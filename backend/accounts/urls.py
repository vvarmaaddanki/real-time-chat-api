from django.urls import path
from .views import (
    RegisterView,
    CurrentUserView,
    UserListView,
    UserPresenceView,
)
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .throttling import LoginThrottle

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", TokenObtainPairView.as_view(throttle_classes=[LoginThrottle]), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("me/", CurrentUserView.as_view(), name="me"),
    path("users/", UserListView.as_view(), name="user"),

    path("presence/", UserPresenceView.as_view()),
]
