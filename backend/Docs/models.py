from django.db.models import Q
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class DocEntry(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    doc = models.IntegerField()
    public_access = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

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
    def set_access(data):
        """
        takes in data, which consists of a submited access form from the front end,
        sets public access to the doc and adds a collaborator (if one was provided)
        """
        doc_entry = DocEntry.objects.filter(id=data['id']).first()
        if not doc_entry:
            return "Cannot Find Post"
        doc_entry.public_access = data['allowPublicAccess']
        doc_entry.save()
        if data['email']:
            user = User.objects.filter(username=data['email']).first()
            if not user:
                return "Entered email does not exist"
            check_if_exits = Collaborators.objects.filter(doc_entry=doc_entry, collaborator=user).first()
            if check_if_exits:
                return f"{data['email']} is already a collaborator on this doc."
            Collaborators.add_collaborator(doc_entry, user, data['allowEdit'])
            return f"Added {data['email']} as collaborator with {"" if data['allowEdit'] == 1 else "no"} right to edit"
        return "Changed public access"
    
    @staticmethod
    def delete_doc(username: str, id: int) -> str:
        """
        Function that takes in username and doc id, finds the doc obj and user obj
        removes the user as collaborator if he is one,
        and deletes the doc entirely if he is the owner.
        """
        doc = DocEntry.objects.filter(id=id).first()
        if not doc:
            return "Error, no doc found"
        if doc.owner.username == username:
            doc.delete()
            return f"{doc.name} has been deleted!"
        elif doc.owner.username != username:
            user = User.objects.filter(username=username).first()
            if not user:
                return "Error, wrong user"
            success = Collaborators.remove_collaborator(doc, user)
            if not success:
                return "Error, could not remove collaborator"
            return f"{username} has been removed as a collaborator in {doc.name}"



class Collaborators(models.Model):
    doc_entry = models.ForeignKey(DocEntry, on_delete=models.CASCADE)
    collaborator = models.ForeignKey(User, on_delete=models.CASCADE)
    auth = models.IntegerField(default=0)

    @staticmethod
    def get_colabs(id):
        """
        gets id of posts and returns all collaborators assosiated with it
        """
        collaborators = Collaborators.objects.filter(doc_entry=id)
        return collaborators

    @staticmethod
    def add_collaborator(doc_entry, collaborator, auth=False):
        """
        Takes in doc_entry object and user objects and adds the user as a collaborator
        """
        does_exist = Collaborators.objects.filter(doc_entry=doc_entry, collaborator=collaborator, auth=auth).first()
        if not does_exist:
            new_collab = Collaborators(doc_entry=doc_entry, collaborator=collaborator, auth=auth)
            new_collab.save()

    @staticmethod
    def remove_collaborator(doc_entry, collaborator):
        """
        Function that takes in an doc entry object and user object, 
        finds it in the collaboraros table and removed it if exists
        """
        collab = Collaborators.objects.filter(doc_entry=doc_entry, collaborator=collaborator).first()
        if not collab:
            return False
        collab.delete()
        return True
    
    @staticmethod
    def update_edit_rights(doc_entry, collaborator):
        collab = Collaborators.objects.filter(doc_entry=doc_entry, collaborator=collaborator).first()
        if not collab:
            return -1
        collab.auth = 0 if collab.auth == 1 else 1
        collab.save()
        return collab.auth