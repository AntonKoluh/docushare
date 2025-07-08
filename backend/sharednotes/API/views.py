from time import sleep
import jwt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Docs.models import *
from Docs.serializer import DocEntrySerializer
from Docs.serializer import CollaboratorsSerializer
from liveShare.models import MongoNote
from rest_framework.permissions import AllowAny
import pypandoc
import tempfile
import os
from django.http import FileResponse, HttpResponseBadRequest

from sharednotes import settings

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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doc(request, uid):
    """
    Gets initial post as backup incase WS fail and for faster loading.
    + access verification
    access: -1 - denied, 0 - readonly, 1 - read/write
    """
    doc_entry = DocEntry.objects.filter(uid=uid).first()
    if not doc_entry and request.user.is_authenticated:
        user = User.objects.filter(username=request.user.username).first()
        doc_entry = DocEntry(uid=uid, name="New Document", doc=uid, owner=user)
        doc_entry.save()
    try:
        accessing_user = request.user.username
    except AttributeError:
        accessing_user = "Guest"
    collabCheck = Collaborators.objects.filter(doc_entry=doc_entry, collaborator__username = accessing_user).first()
    if doc_entry.owner.username == accessing_user:
        access = 1
    elif collabCheck:
        access = collabCheck.auth
    else:
        access = 0 if doc_entry.public_access else -1

    doc = MongoNote.objects.filter(doc_id=doc_entry.uid).first()
    if not doc:
        MongoNote.objects(doc_id=doc_entry.uid).update_one(
        set__content="",
        upsert=True
        )
        doc = MongoNote.objects.filter(doc_id=doc_entry.uid).first()
    if access != -1:
        return Response({"id": doc_entry.id, "uid": uid, "title": doc_entry.name, "content": doc.content, "access": access})
    return Response({"access": access})

def export_rtf_string_to_pdf(request, format, uid):
    try:
        doc_entry = DocEntry.objects.filter(uid=uid).first()
        mongo_doc = MongoNote.objects.filter(doc_id=uid).first()
        rtf_string = mongo_doc.content
        

        # Save RTF to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".rtf", mode="w", encoding="utf-8") as rtf_file:
            rtf_file.write(rtf_string)
            rtf_path = rtf_file.name

        # Prepare PDF output path (do NOT keep file open)
        pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix="."+format)
        pdf_path = pdf_file.name
        pdf_file.close()  # Close so Pandoc and Django can access it

        # Convert RTF to PDF
        pypandoc.convert_file(rtf_path, format="html", to=format, outputfile=pdf_path)

        # Return PDF response
        response = FileResponse(open(pdf_path, 'rb'), content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="document.pdf"'
        return response

    except Exception as e:
        return HttpResponseBadRequest(f"Error: {e}")

    finally:
        # Clean up temp files
        for path in [locals().get("rtf_path"), locals().get("pdf_path")]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except PermissionError:
                    pass  # You can log this if needed
