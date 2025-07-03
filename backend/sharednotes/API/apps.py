from django.apps import AppConfig
import redis

class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sharednotes.API"

    def ready(self):
        from django.conf import settings
        import mongoengine
        mongoengine.connect(
            db=settings.MONGO_DATABASE_NAME,
            host=settings.MONGO_HOST,
            port=settings.MONGO_PORT
        )
        r = redis.StrictRedis(host='192.168.0.110', port=6379, db=0)
        r.flushdb()  # ⚠️ This clears ALL keys in current DB (e.g. DB 0)
        print("✔ Redis flushed on startup.")
        print("✔ MongoDB connected via mongoengine")