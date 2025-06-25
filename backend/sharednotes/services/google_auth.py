# services/google_auth.py
import os
import requests
from django.contrib.auth.models import User
import logging
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

load_dotenv

logger = logging.getLogger(__name__)

class GoogleAuthService:
    @staticmethod
    def verify_google_token(access_token):
        """
        Verify Google access token and return user info
        """
        try:
            token_url = "https://oauth2.googleapis.com/token"

            payload = {
                "code": access_token,
                "client_id": os.getenv("GOOGLE_ID"),
                "client_secret": os.getenv("GOOGLE_SECRET"),
                "redirect_uri": "http://localhost:5173/auth/callback",
                "grant_type": "authorization_code",
            }
            response = requests.post(token_url, data=payload)
            
            if response.status_code != 200:
                logger.error(f"Token verification failed: {response.text}")
                return None
            
            token_info = response.json()
            user_info = id_token.verify_oauth2_token(
            token_info['id_token'],
            google_requests.Request(),
            os.getenv("GOOGLE_ID")
            )
            # Verify the token belongs to our app
            if user_info.get('azp') != os.getenv('GOOGLE_ID'):
                logger.error("Token audience doesn't match client ID")
                return None
            
            
            return {
                'email': user_info.get('email'),
                'first_name': user_info.get('given_name', ''),
                'last_name': user_info.get('family_name', ''),
                'google_id': user_info.get('id'),
                'picture': user_info.get('picture', ''),
                'email_verified': user_info.get('verified_email', False)
            }
            
        except requests.RequestException as e:
            logger.error(f"Network error during token verification: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            return None

    @staticmethod
    def get_or_create_user(user_data):
        """
        Get or create user based on Google user data
        """
        try:
            # Try to get user by email
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['email'],
                    'first_name': user_data['given_name'],
                    'last_name': user_data['family_name'],
                    'is_active': True,
                }
            )
            
            # Update user info if user already exists
            if not created:
                user.first_name = user_data['given_name']
                user.last_name = user_data['family_name']
                user.save()
            
            return user
        except Exception as e:
            logger.error(f"Error creating/updating user: {e}")
            return None