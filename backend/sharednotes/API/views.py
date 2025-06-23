from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_protected_view(request):
    if request.user.is_authenticated:
        return Response({"message": f"Welcome, {request.user.username}!"})
    else:
        return Response({"error": "Not authenticated"}, status=401)
