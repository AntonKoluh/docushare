"""
Configure startup
"""
from django.apps import AppConfig
from dotenv import load_dotenv
import redis
import os

class ApiConfig(AppConfig):
    """
    Startup setup, connect to mongo and redis and flush
    """
    load_dotenv()
    default_auto_field = "django.db.models.BigAutoField"
    name = "sharednotes.api"

    def ready(self):
        from django.conf import settings # pylint: disable=import-outside-toplevel
        import mongoengine # pylint: disable=import-outside-toplevel
        mongoengine.connect(
            db=settings.MONGO_DATABASE_NAME,
            host=settings.MONGO_HOST,
            port=settings.MONGO_PORT
        )
        redis_ip = os.getenv('REDIS_DEBUG') if os.getenv('VITE_DEBUG') == 'True' else os.getenv('REDIS_IP')
        print(redis_ip, os.getenv('VITE_DEBUG'))
        r = redis.StrictRedis(host=redis_ip, port=6379, db=0)
        r.flushdb()
        print("✔ Redis flushed on startup.")
        print("✔ MongoDB connected via mongoengine")
