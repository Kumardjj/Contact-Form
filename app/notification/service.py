from app.notification.email import (send_contact_email)
from twilio.rest import Client
from pydantic import EmailStr

def send_notification(
        name:str,
        email:str,
        subject: str,
        message:str,
        notification_email: str
):
    send_contact_email(
        name=name,
        email=email,
        subject=subject,
        message=message,
        notification_email=notification_email


    )