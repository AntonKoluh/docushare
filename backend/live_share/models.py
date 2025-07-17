"""
Modals used in Websocket
"""
import mongoengine

class MongoNote(mongoengine.Document):
    """
    Mongo DB doc content modal
    """
    doc_id = mongoengine.StringField(required=True, max_length=20)
    content = mongoengine.StringField()
