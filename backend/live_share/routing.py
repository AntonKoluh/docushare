"""
Websocket routing
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/doc/(?P<doc_id>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
]