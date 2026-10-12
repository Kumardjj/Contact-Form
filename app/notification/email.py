import smtplib
from email.message import EmailMessage
from pydantic import EmailStr

from app.security import SMTP_HOST,SMTP_PASSWORD,SMTP_PORT,SMTP_USERNAME

def send_contact_email(
        name:str,
        email:str,
        subject:str,
        message:str,
        notification_email:EmailStr
):
    msg = EmailMessage()

    msg["Subject"] = f"New Contact Form Submission: {subject}"
    msg["From"] = SMTP_USERNAME
    msg["To"] = notification_email

    msg.set_content( f"""
You recieved a new contact form submission

Name: {name}
Email: {email}
Subject: {subject}

message:
{message}
"""
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(msg)

def send_password_reset_email(
    to_email: str,
    reset_url: str
):
    msg = EmailMessage()

    msg["Subject"] = "Reset your FreeForms password"
    msg["From"] = SMTP_USERNAME
    msg["To"] = to_email

    msg.set_content(
        f"""
Hello,

We received a request to reset your FreeForms password.

Open the link below to choose a new password:

{reset_url}

This link expires in 15 minutes and can only be used once.

If you did not request this reset, you can ignore this email.

FreeForms Team
"""
    )

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT,
        timeout=10
    ) as server:
        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(msg)
    
