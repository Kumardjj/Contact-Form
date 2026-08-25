import os
from dotenv import load_dotenv
load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD_HASH")
from app.security import (verify_password, create_access_token)
def authenticate_user(username: str, password :str):
    if username != ADMIN_USERNAME:
        return None
    if not verify_password(password, ADMIN_PASSWORD):
        return None
    return username
def login_user(username: str, password : str):
    user = authenticate_user(username, password)
    if not user:
        return None
    access_token = create_access_token(
        {
            "sub": user
        }
    )

    return access_token
