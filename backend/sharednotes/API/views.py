from time import sleep
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Docs.models import *
from Docs.serializer import DocEntrySerializer
from Docs.serializer import CollaboratorsSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_protected_view(request):
    if request.user.is_authenticated:
        return Response({"message": f"Welcome, {request.user.username}!"})
    else:
        return Response({"error": "Not authenticated"}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doc_list(request):
    list = DocEntry.get_user_docs(request.user.username)
    serializer = DocEntrySerializer(list, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_colab(request):
    update_colab = DocEntry.set_access(request.data)
    collaborators = Collaborators.get_colabs(request.data['id'])
    serializer = CollaboratorsSerializer(collaborators, many=True)
    return Response({"success": True, "msg": update_colab, "collabs": serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_doc(request):
    msg = DocEntry.delete_doc(request.user.username, request.data['id'])
    if msg.startswith("Error"):
        result = {"success": False, "msg": msg}
    else:
        result = {"success": True, "msg":msg}
    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_colab_list(request, id):
    collaborators = Collaborators.get_colabs(id)
    serializer = CollaboratorsSerializer(collaborators, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_colab(request):
    user = User.objects.filter(username=request.data['user']).first()
    doc_entry = DocEntry.objects.filter(id=request.data['id']).first()
    print(request.data['id'])
    if user and doc_entry:
        success = Collaborators.remove_collaborator(doc_entry, user)
    if success:
        response = {"success": True, "msg": f"{request.data['user']} has been removed as a collaborator"}
    else:
        response = {"success": False, "msg": f"Something went wrong and {request.data['user']} wasnt removed!"}
    return Response(response)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_colab_access(request):
    owner = request.user.username
    user_requiring_access = User.objects.filter(username=request.data['user']).first()
    doc_entry = DocEntry.objects.filter(id=request.data['id']).first()
    if not owner or not user_requiring_access or not doc_entry:
        response = {"success": False, "msg": "Something went wrong"}
        return Response(response)
    if doc_entry.owner.username != owner:
        response = {"success": False, "msg": "You are not the owner of this doc"}
        return Response(response)
    success = Collaborators.update_edit_rights(doc_entry, user_requiring_access)
    if success == -1:
        response = {"success": False, "msg": "Something went wrong"}
        return Response(response)
    response = {"success": True, "msg": f"{user_requiring_access.username} is now {"able" if success == 1 else "unable"} to edit {doc_entry.name}", "auth": success}
    return Response(response)

    
    