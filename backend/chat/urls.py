from django.urls import path
from .views import MessageListCreateView, BlockView, BlockStatusView, UnreadCountView

urlpatterns = [
    path('messages/', MessageListCreateView.as_view(), name='messages'),
    path('block/', BlockView.as_view(), name='block'),
    path('block/status/', BlockStatusView.as_view(), name='block-status'),
    path('unread_counts/', UnreadCountView.as_view()),
]
