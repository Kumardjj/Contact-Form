from app.notification.email import (send_contact_email)
from twilio.rest import Client

def send_notification(
        name:str,
        email:str,
        subject: str,
        message:str
):
    send_contact_email(
        name=name,
        email=email,
        subject=subject,
        message=message
    )