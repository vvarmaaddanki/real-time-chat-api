from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class LoginThrottle(AnonRateThrottle):
    rate = '5/min'

class RegisterThrottle(AnonRateThrottle):
    rate = '3/min'

class SendMessageThrottle(UserRateThrottle):
    rate = '20/min'

    def allow_request(self, request, view):
        # Only throttle POST requests (sending messages), allow GET (polling/fetching)
        if request.method == "GET":
            return True
        return super().allow_request(request, view)
