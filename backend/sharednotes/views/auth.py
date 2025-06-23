# views/auth.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..services.google_auth import GoogleAuthService
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Handle Google OAuth login
    Expected payload: {"access_token": "google_access_token"}
    """
    try:
        # Get the access token from request
        google_token = request.data.get('access_token')
        
        if not google_token:
            return Response(
                {'error': 'Google access token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify Google token and get user info
        google_auth_service = GoogleAuthService()
        user_data = google_auth_service.verify_google_token(google_token)
        
        if not user_data:
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if email is verified
        if not user_data.get('email_verified', False):
            return Response(
                {'error': 'Email not verified with Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user = google_auth_service.get_or_create_user(user_data)
        
        if not user:
            return Response(
                {'error': 'Failed to create user'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Google login error: {e}")
        return Response(
            {'error': 'Internal server error'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )