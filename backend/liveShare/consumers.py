# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from liveShare.models import MongoNote
import redis
from datetime import datetime, timedelta

redis_client = redis.StrictRedis(host='192.168.0.110', port=6379, db=0)

def saveToDBs(data):
    print("Saving.....")

def get_latest_redis(doc_name):
    redis_key = f"latest_doc{doc_name}"
    latest_raw = redis_client.get(redis_key)
    if latest_raw:
        latest_msg = json.loads(latest_raw.decode())
        return latest_msg
    return None

def add_user_connection(doc_name, user):
    notes = redis_client.lrange(f"users_doc{doc_name}", 0, -1)
    users = [note.decode() for note in notes]
    if user not in users:
        redis_client.rpush(f"users_doc{doc_name}", user)

    notes = redis_client.lrange(f"users_doc{doc_name}", 0, -1)

def remove_user_connection(doc_name, user):
    redis_client.lrem(f"users_doc{doc_name}", 1, user)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.doc_name = self.scope["url_route"]["kwargs"]["doc_id"]
        self.room_group_name = f"doc_{self.doc_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Accept/Reject connection logic goes here!
        self.accept()
        redis_key = f"latest_doc{self.doc_name}"
        latest_raw = redis_client.get(redis_key)
        if latest_raw:
            latest_msg = json.loads(latest_raw.decode())
            self.send(text_data=json.dumps({
                "type": "chat.message",
                "content": latest_msg["content"],
                "name": latest_msg["name"],
            }))

    def disconnect(self, close_code):
        # Leave room group
        latest_msg = get_latest_redis(self.doc_name)
        remove_user_connection(self.doc_name, self.username)
        if latest_msg and latest_msg.get('editedBy') == self.username:
            saveToDBs(latest_msg)
        

            
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get("type")

        if msg_type == "init":
            # Save username for later use
            self.username = data.get("username")
            print(self.username)
            add_user_connection(self.doc_name, self.username)
            return

        if msg_type != "msg":
            return  # Ignore unknown types

        # Extract message data
        doc_id = data["id"]
        name = data["name"]
        content = data["content"]
        redis_key = f"latest_doc{doc_id}"

        now = datetime.now()

        # Try to load the last message from Redis
        latest_msg = get_latest_redis(self.doc_name) if get_latest_redis(self.doc_name) else {}
        

        last_edit_time = latest_msg.get("time")

        # If no time exists, simulate a last-edit time in the past
        if not last_edit_time:
            last_edit_time = (now - timedelta(seconds=35)).isoformat()

            # Check if 30 seconds have passed
        elapsed = now - datetime.fromisoformat(last_edit_time)
        if elapsed > timedelta(seconds=30):
            latest_msg["time"] = now.isoformat()
            saveToDBs(latest_msg)
        else:
            latest_msg["time"] = last_edit_time

        # Update message fields
        latest_msg.update({
            "name": name,
            "content": content,
            "editedBy": self.username
        })

        # Save back to Redis
        redis_client.set(redis_key, json.dumps(latest_msg))

        # Send message to the room group (excluding self handled elsewhere)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat.message",
                "id": doc_id,
                "content": content,
                "name": name,
                "sender": self.username
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        if event.get("sender") == self.username:
            return
        id = event["id"]
        name = event["name"]
        content = event["content"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"content": content, "name": name}))