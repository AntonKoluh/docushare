"""
Websocket live service handler
"""
import json
from datetime import datetime, timedelta
import redis
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import os
from dotenv import load_dotenv


load_dotenv()
redis_ip = os.getenv('REDIS_DEBUG') if os.getenv('VITE_DEBUG') == 'True' else os.getenv('REDIS_IP')

redis_client = redis.StrictRedis(host=redis_ip, port=6379, db=0)

def save_to_dbs(data, doc_id, username):
    """
    Saves changes from redis to Mongo and updates filename in doc_entry
    """
    from docs.models import DocEntry
    from live_share.models import MongoNote
    MongoNote.objects(doc_id=doc_id).update_one( # pylint: disable=no-member
        set__content=data['content'],
        upsert=True
    )
    doc_entry = DocEntry.objects.filter(uid=doc_id).first()
    if doc_entry:
        doc_entry.updated_at = datetime.now()
        doc_entry.last_modified_by = username
        doc_entry.name = data['name']
        doc_entry.save()

def get_latest_redis(doc_name):
    """
    Gets the latest change from redis
    """
    redis_key = f"latest_doc{doc_name}"
    latest_raw = redis_client.get(redis_key)
    if latest_raw:
        latest_msg = json.loads(latest_raw.decode())
        return latest_msg
    return None

def add_user_connection(doc_name, user):
    """
    Adds a user connection to a list
    """
    notes = redis_client.lrange(f"users_doc{doc_name}", 0, -1)
    users = [note.decode() for note in notes]
    if user not in users:
        redis_client.rpush(f"users_doc{doc_name}", user)
    notes = redis_client.lrange(f"users_doc{doc_name}", 0, -1)
    users = [note.decode() for note in notes]
    return users

def remove_user_connection(doc_name, user):
    """
    Removed a disconnected user from a list
    """
    redis_client.lrem(f"users_doc{doc_name}", 1, user)
    notes = redis_client.lrange(f"users_doc{doc_name}", 0, -1)
    users = [note.decode() for note in notes]
    return users


class ChatConsumer(WebsocketConsumer):
    """
    Websocket handler
    """
    def connect(self):
        self.doc_name = self.scope["url_route"]["kwargs"]["doc_id"] # pylint: disable=attribute-defined-outside-init
        self.room_group_name = f"doc_{self.doc_name}" # pylint: disable=attribute-defined-outside-init

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
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

    def disconnect(self, code=None):
        # Leave room group
        latest_msg = get_latest_redis(self.doc_name)
        user_list = remove_user_connection(self.doc_name, self.username)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "user.update",
                "users": user_list,
            }
        )
        if latest_msg and latest_msg.get('editedBy') == self.username:
            save_to_dbs(latest_msg, self.doc_name, self.username)



        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        msg_type = data.get("type")
        now = datetime.now()

        if msg_type == "init":
            # Save username for later use
            self.username = data.get("username") # pylint: disable=attribute-defined-outside-init
            user_list = add_user_connection(self.doc_name, self.username)
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "user.update",
                "users": user_list,
            }
        )
            return
        if msg_type == "disconnect":
            latest_msg = get_latest_redis(self.doc_name) if get_latest_redis(self.doc_name) else {}
            print (data["name"], data["content"])
            if not latest_msg.get("updated") or datetime.fromisoformat(latest_msg.get("updated")) < now:
                latest_msg.update({
                    "name": data["name"],
                    "content": data["content"],
                    "editedBy": self.username,
                    "updated": now.isoformat(),
                })
                save_to_dbs(latest_msg, self.doc_name, self.username)
                return

        # Extract message data
        doc_id = data["id"]
        name = data["name"]
        content = data["content"]
        redis_key = f"latest_doc{doc_id}"


        # Try to load the last message from Redis
        latest_msg = get_latest_redis(self.doc_name) if get_latest_redis(self.doc_name) else {}
        latest_msg.update({
            "name": name,
            "content": content,
            "editedBy": self.username,
            "updated": now.isoformat()
        })

        last_edit_time = latest_msg.get("time")

        # If no time exists, simulate a last-edit time in the past
        if not last_edit_time:
            last_edit_time = (now - timedelta(seconds=35)).isoformat()
        # Check if 30 seconds have passed
        elapsed = now - datetime.fromisoformat(last_edit_time)
        if elapsed > timedelta(seconds=30):
            latest_msg["time"] = now.isoformat()
            save_to_dbs(latest_msg, self.doc_name, self.username)
        else:
            latest_msg["time"] = last_edit_time
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

    def chat_message(self, event):
        """
        Recieve message from room group
        """
        if event.get("sender") == self.username:
            return
        name = event["name"]
        content = event["content"]
        self.send(text_data=json.dumps({"type": "msg", "content": content, "name": name}))

    def user_update(self, event):
        """
        Update user statuses
        """
        event_type = event["type"]
        users = event["users"]
        self.send(text_data=json.dumps({"type": event_type, "users": users}))
