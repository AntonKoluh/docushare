import mongoengine

class MongoNote(mongoengine.Document):
    doc_id = mongoengine.IntField(required=True)
    content = mongoengine.StringField()