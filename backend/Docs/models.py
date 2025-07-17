"""
SQL Models
"""
from django.db.models import Q
from django.db import models
from django.contrib.auth import get_user_model
from live_share.models import MongoNote

User = get_user_model()
# Create your models here.
class DocEntry(models.Model):
    """
    Doc entry main table
    """
    uid = models.CharField(max_length=20)
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    doc = models.CharField(max_length=20)
    public_access = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    last_modified_by = models.CharField(max_length=20, null=True)

    @staticmethod
    def get_user_docs(user):
        """
        gets all documents assosiated with the user,
        both owned and shared.
        """
        user_obj = User.objects.get(username=user)
        owned_docs = Q(owner=user_obj)
        collaborator_docs = Q(id__in=Collaborators.objects.filter(
            collaborator=user_obj
        ).values_list('doc_entry_id', flat=True))
        return DocEntry.objects.filter(owned_docs | collaborator_docs).distinct()

    @staticmethod
    def set_public_access(data, user):
        """
        takes in data, which consists of a submited access form from the front end,
        sets public access to the doc and adds a collaborator (if one was provided)
        """
        user = User.objects.filter(username=user).first()
        doc_entry = DocEntry.objects.filter(id=data['id']).first()
        if not doc_entry:
            return {"success": False, "msg": "Doc not found!"}
        if user != doc_entry.owner:
            return {"success": False, "msg": "You are not the owner of this doc"}
        doc_entry.public_access = data['allowPublicAccess']
        doc_entry.save()
        return {"success": True, "msg": "Public Access Changed"}


    @staticmethod
    def delete_doc(username, doc_id):
        """
        Function that takes in username and doc id, finds the doc obj and user obj
        removes the user as collaborator if he is one,
        and deletes the doc entirely if he is the owner.
        """
        doc = DocEntry.objects.filter(id=doc_id).first()
        if not doc:
            return {"success": True, "msg":"Error, no doc found"}
        if doc.owner.username == username:
            info = MongoNote.objects.filter(doc_id=doc.uid).first() # pylint: disable=no-member
            info.delete()
            doc.delete()
            return {"success": True, "msg":f"{doc.name} has been deleted!"}
        if doc.owner.username != username:
            user = User.objects.filter(username=username).first()
            if not user:
                return {"success": False, "msg":"Error, wrong user"}
            success = Collaborators.remove_collaborator(doc, user)
            if not success:
                return {"success": False, "msg":"Error, could not remove collaborator"}
            return {"success": True, "msg":f"{username} has been removed"
                                            f"as a collaborator in {doc.name}"}
        return {"success": False, "msg": "Unknown error"}



class Collaborators(models.Model):
    """
    one-many relation with Doc_entry, contains a list of collaboratos on a document
    """
    doc_entry = models.ForeignKey(DocEntry, on_delete=models.CASCADE)
    collaborator = models.ForeignKey(User, on_delete=models.CASCADE)
    auth = models.IntegerField(default=0)

    @staticmethod
    def get_colabs(doc_id):
        """
        gets id of posts and returns all collaborators assosiated with it
        """
        collaborators = Collaborators.objects.filter(doc_entry=doc_id)
        return collaborators

    @staticmethod
    def add_collaborator(user_to_add, doc_id, auth, owner_of_doc):
        """
        Takes in doc_entry object and user objects and adds the user as a collaborator
        """
        user_to_add_obj = User.objects.filter(username = user_to_add).first()
        doc_entry = DocEntry.objects.filter(id = doc_id).first()
        owner_of_doc_obj = User.objects.filter(username = owner_of_doc).first()
        success = False
        if not user_to_add_obj:
            msg = f"{user_to_add} is not registered"
        elif not doc_entry:
            msg = "Doc entry does not exist"
        elif doc_entry.owner != owner_of_doc_obj:
            msg = "You are not the owner of this doc"
        else:
            new_collab = Collaborators(doc_entry=doc_entry, collaborator=user_to_add_obj, auth=auth)
            new_collab.save()
            msg = f"{user_to_add_obj.username} was added successfully"
            success = True
        return {"success": success, "msg": msg}

    @staticmethod
    def remove_collaborator(doc_id, user):
        """
        Function that takes in an doc entry object and user object, 
        finds it in the collaboraros table and removed it if exists
        """
        collaborator = User.objects.filter(username=user).first()
        doc_entry = DocEntry.objects.filter(id=doc_id).first()
        collab = Collaborators.objects.filter(doc_entry=doc_entry,
                                              collaborator=collaborator).first()
        if not collab:
            return {"success": False, "msg": f"Something went wrong and {user} wasnt removed!"}
        collab.delete()
        return {"success": True, "msg": f"{user} has been removed as a collaborator"}

    @staticmethod
    def update_edit_rights(doc_entry, collaborator):
        """
        Update the edit rights of a collaborator on a given doc
        """
        collab = Collaborators.objects.filter(doc_entry=doc_entry,
                                              collaborator=collaborator).first()
        if not collab:
            return -1
        collab.auth = 0 if collab.auth == 1 else 1
        collab.save()
        return collab.auth
