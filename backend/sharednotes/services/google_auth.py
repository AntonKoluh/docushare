# services/google_auth.py
import os
import requests
from django.contrib.auth.models import User
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

load_dotenv()

class GoogleAuthService:
    @staticmethod
    def verify_google_token(access_token):
        """
        Verify Google access token and return user info
        """
        redirect_uri = "http://localhost:5173/auth/callback" if os.getenv('VITE_DEBUG') == "True" else os.getenv('GOOGLE_REDIRECT')
        try:
            token_url = "https://oauth2.googleapis.com/token"
            payload = {
                "code": access_token,
                "client_id": os.getenv("GOOGLE_ID"),
                "client_secret": os.getenv("GOOGLE_SECRET"),
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            }

            response = requests.post(token_url, data=payload)
            
            if response.status_code != 200:
                return None
            
            token_info = response.json()
            user_info = id_token.verify_oauth2_token(
            token_info['id_token'],
            google_requests.Request(),
            os.getenv("GOOGLE_ID")
            )
            if user_info.get('azp') != os.getenv('GOOGLE_ID'):
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
            print(f"Network error during token verification: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error during token verification: {e}")
            return None

    @staticmethod
    def get_or_create_user(user_data):
        """
        Get or create user based on Google user data
        """
        try:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['email'],
                    'first_name': user_data['given_name'],
                    'last_name': user_data['family_name'],
                    'is_active': True,
                }
            )
            if user.password == "":
                user.set_unusable_password()
                user.save()
            if not created:
                user.first_name = user_data['given_name']
                user.last_name = user_data['family_name']
                user.set_unusable_password()
                user.save()
            
            return user
        except Exception as e:
            print(f"Error creating/updating user: {e}")
            return None
