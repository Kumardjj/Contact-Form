import os

from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MNUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE",30))

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT",587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD =  os.getenv("SMTP_PASSWORD")
NOTIFICATION_EMAIL = os.getenv("NOTIFICATION_EMAIL")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM")
TWILIO_NOTIFICATION_NUMBER = os.getenv(
    "WHATSAPP_NOTIFICATION_NUMBER"
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated = "auto"
)

def hash_password(password : str):
    return pwd_context.hash(password)

def verify_password(
        plain_password : str,
        hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )
def create_access_token(data :dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MNUTES)
    to_encode.update({"exp":expire})

    encoded_jwt = jwt.encode(
        to_encode, SECRET_KEY, algorithm = ALGORITHM
    )
    return encoded_jwt