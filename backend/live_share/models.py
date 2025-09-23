"""
Modals used in Websocket
Plus AI Additions to base user profile
"""
import mongoengine
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class MongoNote(mongoengine.DynamicDocument):
    """
    Mongo DB doc content modal
    """
    doc_id = mongoengine.StringField(required=True, max_length=20)
    content = mongoengine.StringField()
    ai_sum = mongoengine.StringField(required=False)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ai_plan = models.IntegerField(null=False, default=0)
    ai_tokens = models.IntegerField(null=False, default=3)

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()