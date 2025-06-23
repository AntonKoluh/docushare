# services/google_auth.py
import os
import requests
from django.contrib.auth.models import User
import logging
from dotenv import load_dotenv

load_dotenv

logger = logging.getLogger(__name__)

class GoogleAuthService:
    @staticmethod
    def verify_google_token(access_token):
        """
        Verify Google access token and return user info
        """
        try:
            # Use Google's tokeninfo endpoint to verify access token
            response = requests.get(
                'https://www.googleapis.com/oauth2/v1/tokeninfo',
                params={'access_token': access_token}
            )
            
            if response.status_code != 200:
                logger.error(f"Token verification failed: {response.text}")
                return None
            
            token_info = response.json()
            
            # Verify the token belongs to our app
            if token_info.get('audience') != os.getenv('GOOGLE_ID'):
                logger.error("Token audience doesn't match client ID")
                return None
            
            # Get user info from Google People API
            user_info_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                params={'access_token': access_token}
            )
            
            if user_info_response.status_code != 200:
                logger.error(f"Failed to get user info: {user_info_response.text}")
                return None
            
            user_info = user_info_response.json()
            
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
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'is_active': True,
                }
            )
            
            # Update user info if user already exists
            if not created:
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']
                user.save()
            
            return user
        except Exception as e:
            logger.error(f"Error creating/updating user: {e}")
            return None