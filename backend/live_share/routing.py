"""
Websocket routing
"""
from django.urls import re_path
from . import consumers

print("=== Routing Debug ===")
print("Loading WebSocket routing...")

websocket_urlpatterns = [
    re_path(r'^ws/doc/(?P<doc_id>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
]

print(f"WebSocket patterns loaded: {websocket_urlpatterns}")
print("=== End Routing Debug ===")
