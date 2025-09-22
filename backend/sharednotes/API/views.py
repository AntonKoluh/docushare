"""
Views for API functionality
"""
import os
import tempfile
import pypandoc
import requests
import json
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import FileResponse, HttpResponseBadRequest, StreamingHttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from docs.models import DocEntry, Collaborators
from docs.serializer import DocEntrySerializer
from docs.serializer import CollaboratorsSerializer
from live_share.models import MongoNote
from .utils import authenticate_login, is_server_online


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Creates a new user without oauth directly into the User table
    """
    authentication = authenticate_login(request.data)
    if authentication['success']:
        try:
            user = User.objects.create_user(
            username=request.data['email'],
            email=request.data['email'],
            password=request.data['password1'],
            first_name=request.data['fname'],
            last_name=request.data['lname']
            )
        except IntegrityError as e:
            print ("Failed to create user", e)
            authentication['success': False, "errors": {"msg": "Something went wrong","field": "root"}]
    return Response(authentication)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    user = authenticate(username=request.data['username'], password=request.data['password'])
    if not user:
        return Response({"success": False, "msg":"Wrong username or password"}, status=status.HTTP_200_OK)

    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    return Response({
        'success': True,
        'access_token': str(access_token),
        'refresh_token': str(refresh),
        'msg': f"Welcome {user.username}",
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doc_list(request):
    """
    return a list of all docs owned and shared with the user
    """
    doc_list = DocEntry.get_user_docs(request.user.username)
    serializer = DocEntrySerializer(doc_list, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_public_access(request):
    """
    Takes in username, allowPublicAccess and doc id and sets the public access
    """
    update_colab = DocEntry.set_public_access(request.data, request.user.username)
    return Response(update_colab)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_add_collaborator(request):
    """
    Takes in email, id allowedit and adds a collaborator to a doc
    returns a new and updated list of collaborators
    """
    result = Collaborators.add_collaborator(request.data['email'], request.data['id'],
                                            request.data['allowEdit'], request.user.username)
    collaborators = Collaborators.get_colabs(request.data['id'])
    serializer = CollaboratorsSerializer(collaborators, many=True)
    result['collabs'] = serializer.data
    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_doc(request):
    """
    Deletes a document from the database,
    including mongodb, doc_entry and collaborators.
    or
    removes the submiting user as a collaborator (if he is not the doc's owner)
    """
    result = DocEntry.delete_doc(request.user.username, request.data['id'])
    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_colab_list(request, doc_id):
    """
    retrievs a list of collaborators
    """
    collaborators = Collaborators.get_colabs(doc_id)
    serializer = CollaboratorsSerializer(collaborators, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_colab(request):
    """
    removes a collaborator
    """
    result = Collaborators.remove_collaborator(request.data['id'], request.data['user'])
    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_colab_access(request):
    """
    Updates the rights of a collaborator
    """
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
    response = {"success": True,
                "msg": (f"{user_requiring_access.username} is"
                        f"now {"able" if success is True else "unable"} to edit {doc_entry.name}"),
                "auth": success}
    return Response(response)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doc(request, uid):
    """
    Gets initial post as backup incase WS fail and for faster loading.
    + access verification
    """

    access = DocEntry.access_check(request.user, uid)
    doc_entry = DocEntry(uid=uid, name="New Document", doc=uid, owner=request.user)
    doc = MongoNote.objects.filter(doc_id=doc_entry.uid).first() # pylint: disable=no-member
    if not doc:
        MongoNote.objects(doc_id=doc_entry.uid).update_one( # pylint: disable=no-member
        set__content="",
        upsert=True
        )
        doc = MongoNote.objects.filter(doc_id=doc_entry.uid).first() # pylint: disable=no-member
    if access != -1:
        return Response({"id": doc_entry.id, "uid": uid, "title": doc_entry.name,
                          "content": doc.content, "access": access})
    return Response({"access": access})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_save(request):
    access = DocEntry.access_check(request.user, request.data["uid"])
    if access == 1:
        doc_entry = DocEntry.objects.filter(uid=request.data["uid"]).first()
        mongo_entry = MongoNote.objects.filter(doc_id=request.data["uid"]).first()
        if doc_entry:
            doc_entry.name = request.data["title"]
            mongo_entry.content = request.data["content"]
            doc_entry.save()
            mongo_entry.save()
            return Response({"success": True})
    return Response({"success": False})

@api_view(['GET'])
@permission_classes([AllowAny])
def export_rtf_string_to_pdf(request, file_format, uid):
    """
    File download and converter
    """
    try:
        mongo_doc = MongoNote.objects.filter(doc_id=uid).first() # pylint: disable=no-member
        rtf_string = mongo_doc.content

        with tempfile.NamedTemporaryFile(delete=False, suffix=".rtf",
                                         mode="w", encoding="utf-8") as rtf_file:
            rtf_file.write(rtf_string)
            rtf_path = rtf_file.name

        pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix="."+file_format)
        pdf_path = pdf_file.name
        pdf_file.close()

        pypandoc.convert_file(rtf_path, format="html", to=file_format, outputfile=pdf_path)

        response = FileResponse(open(pdf_path, 'rb'), content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="document.pdf"'
        return response

    except Exception as e:
        print(e)
        return HttpResponseBadRequest(f"Error: {e}")
    finally:
        for path in [locals().get("rtf_path"), locals().get("pdf_path")]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except PermissionError:
                    print("Bad permission")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_health(request):
    ai_url = os.getenv('AI_API_URL_DEBUG') if os.getenv("VITE_DEBUG") == "True" else os.getenv('AI_API_URL')
    ai_health = is_server_online(ai_url)
    return Response({"success": bool(ai_health)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_sum(request):
    """
    AI Summery of a document, sends request to ollama.
    """
    doc_uid = request.data['uid']
    user = request.user.username
    mongo_doc = MongoNote.objects.filter(doc_id=doc_uid).first()
    user_obj = User.objects.filter(username=user).first()
    doc = DocEntry.objects.filter(uid=doc_uid).first()
    collab_check = Collaborators.objects.filter(doc_entry=doc,
                                               collaborator__username = user).first()
    if len(mongo_doc.content) < 10:
        return Response({"success": False, "msg": "Cannot sum such a short doc"})
    if not doc:
        return Response({"success": False, "msg": "Cant find requested doc"})
    if not doc.public_access:
        if not user:
            return Response({"success": False, "msg": "You are not eligeble to view this doc"})
        if collab_check is None and doc.owner != user_obj:
            return Response({"success": False, "msg": "You are not eligeble to view this doc"})
    if mongo_doc.ai_sum and request.data['use_cache']:
        return Response({"success": True, "msg":mongo_doc.ai_sum})
    
    base_url = os.getenv('AI_API_URL_DEBUG') if os.getenv("VITE_DEBUG") == "True" else os.getenv('AI_API_URL')
    url = base_url + "/api/generate"

    if not is_server_online(base_url):
        return Response({"success": False, "msg":"Failed to connect to AI server"})

    req = {
    "model": "llama3.2:1b",
    "prompt": (
            "Summarize the following text in 3 sentences points, "
            "Do not repeat this instructions in your response, "
    "each no more than 10 words:\n\n" + mongo_doc.content
    ),
    "stream": True,
    "options": {
      "num_gpu": 0,
      "num_thread": 4,
      "num_ctx": 1024,
      "num_batch": 16,
      "temperature": 0.2,
      "repeat_penalty": 2
    }
    }
    def event_stream():
        fulldata = ""
        with requests.post(url, json=req, stream=True) as r:
            r.raise_for_status()
            for chunk in r.iter_lines(chunk_size=None):
                if chunk:
                    data = json.loads(chunk.decode('utf-8'))
                    if "response" in data:
                        fulldata += data["response"]
                        yield json.dumps({"success": True, "msg": data["response"]}) + "\n"
        mongo_doc.ai_sum = fulldata
        mongo_doc.save()
    return StreamingHttpResponse(event_stream(), content_type="application/x-ndjson")