import mongoengine

class MongoNote(mongoengine.Document):
    doc_id = mongoengine.StringField(required=True, max_length=20)
    content = mongoengine.StringField()