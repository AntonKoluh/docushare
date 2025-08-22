import re
import os
from django.contrib.auth import get_user_model

def authenticate_login(data):
    """
    Performs all nessesery backend checks for register
    """
    User = get_user_model()
    email_re = r"^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$"
    email = data['email']
    pass1 = data['password1']
    pass2 = data['password2']
    fname = data['fname']
    lname = data['lname']
    success = False
    errors = []
    if pass1 != pass2:
        errors.append({"msg":"Passwords did not match", "field":"password2"})
    if len(pass1) < 6:
        errors.append({"msg":"Password too short", "field":"password1"})
    if not re.match(email_re, email):
        errors.append({"msg":"Email not valid", "field":"email"})
    user = User.objects.filter(username=email).first()
    if user:
        errors.append({"msg":"Email already registered", "field":"email"})
    if len(errors) == 0:
        success = True
    
    return ({"success": success, "errors": errors})
    
def is_server_online(hostname):
    """
    Checks if a server is online, testing is done on windows
    and prod on linux, so have to check os.name
    """
    command = f"curl {hostname}"
    return os.system(command) == 0