from rest_framework import serializers
from .models import DocEntry, Collaborators
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', "last_name"]

class CollaboratorsSerializer(serializers.ModelSerializer):
    collaborator = UserSerializer(read_only=True)

    class Meta:
        model = Collaborators
        fields = ['id', 'collaborator', 'auth']

class DocEntrySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    collaborators = serializers.SerializerMethodField()

    class Meta:
        model = DocEntry
        fields = ['id', 'name', 'owner','public_access', 'doc', 'created_at', 'updated_at', 'collaborators']

    def get_collaborators(self, obj):
        collaborators = Collaborators.objects.filter(doc_entry=obj)
        return CollaboratorsSerializer(collaborators, many=True).data
