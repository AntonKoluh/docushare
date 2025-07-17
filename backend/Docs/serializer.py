"""
Serializer for models
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DocEntry, Collaborators


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    User serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', "last_name"]

class CollaboratorsSerializer(serializers.ModelSerializer):
    """
    Collaborator serialzier
    """
    collaborator = UserSerializer(read_only=True)

    class Meta:
        model = Collaborators
        fields = ['id', 'collaborator', 'auth']

class DocEntrySerializer(serializers.ModelSerializer):
    """
    Doc entry serializer
    """
    owner = UserSerializer(read_only=True)
    collaborators = serializers.SerializerMethodField()

    class Meta:
        model = DocEntry
        fields = ['id', 'uid', 'name', 'owner','public_access',
                  'doc', 'created_at', 'updated_at', 'collaborators', 'last_modified_by']

    def get_collaborators(self, obj):
        """
        Get  collaborators from a single doc
        """
        collaborators = Collaborators.objects.filter(doc_entry=obj)
        return CollaboratorsSerializer(collaborators, many=True).data
