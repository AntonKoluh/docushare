# views/auth.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..services.google_auth import GoogleAuthService
import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Handle Google OAuth login
    Expected payload: {"access_token": "google_access_token"}
    """
    try:
        token_url = "https://oauth2.googleapis.com/token"
        access_token = request.data.get('access_token')
        redirect_uri = "http://localhost:5173" if os.getenv('VITE_DEBUG') == "True" else os.getenv('VITE_BACKEND_URL')
        payload = {
            "code": access_token,
            "client_id": os.getenv("GOOGLE_ID"),
            "client_secret": os.getenv("GOOGLE_SECRET"),
            "redirect_uri": f"{redirect_uri}/auth/callback",
            "grant_type": "authorization_code",
        }
        response = requests.post(token_url, data=payload)

        if response.status_code != 200:
            logger.error(f"Token verification failed: {response.text}")
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token_info = response.json()
        user_data = id_token.verify_oauth2_token(
        token_info['id_token'],
        google_requests.Request(),
        os.getenv("GOOGLE_ID")
        )
        
        if not user_data:
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user_data.get('email_verified', False):
            return Response(
                {'error': 'Email not verified with Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = GoogleAuthService.get_or_create_user(user_data)
        
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
