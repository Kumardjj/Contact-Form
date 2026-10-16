import os
import hashlib
import secrets

from datetime import datetime, timedelta, timezone
from app.notification.email import send_password_reset_email

from dotenv import load_dotenv
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.database import users_collection

from app.security import (
    verify_password,
    hash_password,
    create_access_token
)

from app.exception import (
    EmailAlreadyExistsError,
    PasswordMismatchError,
    DatabaseError,
    InvalidCredentialsError
)
from app.logging_config import logger
from fastapi import HTTPException

load_dotenv()

FRONTEND_RESET_URL = os.getenv(
    "FRONTEND_RESET_URL",
    "http://localhost:5173/reset-password"
)

RESET_TOKEN_EXPIRY_MINUTES = 15


def register_user(
    name: str,
    email: str,
    password: str,
    cnf_password: str
):

    if password != cnf_password:
        logger.warning("Password mismatch during registration")
        raise PasswordMismatchError()

    try:
        email = email.strip().lower()
        if users_collection.find_one({"email": email}):

            logger.warning(
                "Registration attempted with existing email: %s",
                email
            )

            raise EmailAlreadyExistsError()

        user = {
            "name": name,
            "email": email,
            "password": hash_password(password)
        }

        result = users_collection.insert_one(user)

        if not result.inserted_id:

            logger.error("User creation failed")

            raise DatabaseError()

        logger.info(
            "User registered successfully: %s",
            email
        )

        return user

    except PyMongoError as e:

        logger.exception(
            "MongoDB error during registration"
        )

        raise DatabaseError() from e


def authenticate_user(useremail: str, password: str):

    try:
        useremail = useremail.strip().lower()
        user = users_collection.find_one({
            "email": useremail
        })

        if not user:
            logger.warning("Failed login attempt")
            raise InvalidCredentialsError()

        if not verify_password(password, user["password"]):
            logger.warning("Failed login attempt")
            raise InvalidCredentialsError()

        logger.info(
            "User authenticated successfully: %s",
            useremail
        )

        return user

    except PyMongoError as e:
        logger.exception("MongoDB error during authentication")
        raise DatabaseError() from e

def login_user(useremail: str, password: str):

    user = authenticate_user(
        useremail,
        password
    )

    access_token = create_access_token(
        {
            "sub": str(user["_id"]),
            "email": user["email"]
        }
    )

    logger.info(
        "Access token generated for user: %s",
        user["email"]
    )

    return access_token

def update_user_profile(user_id, name: str, email: str):
    name = name.strip()
    email = email.strip().lower()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name cannot be empty."
        )

    if not email or "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid email address."
        )

    # Prevent another account from using this email.
    existing_user = users_collection.find_one({
        "email": email,
        "_id": {"$ne": user_id}
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="This email is already registered."
        )

    try:
        result = users_collection.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "name": name,
                    "email": email
                }
            }
        )
    except DuplicateKeyError:
        # Also protects against concurrent email updates,
        # provided a unique email index exists.
        raise HTTPException(
            status_code=409,
            detail="This email is already registered."
        )
    except PyMongoError:
        raise HTTPException(
            status_code=500,
            detail="Could not update your profile."
        )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    return {
        "message": "Profile updated successfully.",
        "name": name,
        "email": email
    }


def change_user_password(
    user_id,
    current_password: str,
    new_password: str
):
    user = users_collection.find_one({"_id": user_id})

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    # Change "hashed_password" if your database uses
    # a different field name.
    stored_hash = user.get("password")

    if not stored_hash or not verify_password(
        current_password, stored_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect."
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters."
        )

    if current_password == new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must differ from your current password."
        )

    new_hash = hash_password(new_password)

    try:
        result = users_collection.update_one(
            {
                "_id": user_id,
                "password": stored_hash
            },
            {
                "$set": {
                    "password": new_hash
                }
            }
        )
    except PyMongoError:
        raise HTTPException(
            status_code=500,
            detail="Could not change your password."
        )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=409,
            detail="Password was not changed. Please try again."
        )

    return {
        "message": "Password changed successfully."
    }


def create_password_reset_request(email:str):
    try:
        user = users_collection.find_one({"email":email})
        if not user:
            return None

        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(
            raw_token.encode("utf-8")).hexdigest()
        
        expires_at = ( datetime.now(timezone.utc) + timedelta(minutes = RESET_TOKEN_EXPIRY_MINUTES))

        users_collection.update_one({"_id" : user["_id"]},
                                    {
                                        "$set": {
                                            "password_reset_token_hash": token_hash,
                                            "password_reset_token_expires_at": expires_at
                                        }
                                    })
    except PyMongoError as e:
        logger.exception(
            "Database error creating password reset request"
        )
        raise DatabaseError() from e
    # send the raw token in the email never store it.
    reset_url = ( f"{FRONTEND_RESET_URL}?token={raw_token}")

    return {
        "to_email": user["email"],
        "reset_url": reset_url
    }

def reset_user_password(
        token:str,
        new_password:str
) -> bool:
    token_hash = hashlib.sha256(
        token.encode("utf-8")).hexdigest(
    )
    now = datetime.now(timezone.utc)
    # Only a valid, unexpired token can match
    token_query = {
        "password_reset_token_hash": token_hash,
        "password_reset_token_expires_at": {
            "$gt": now
        }
    }

    try:
        user = users_collection.find_one(
            token_query,{"_id":1}
        )
        if not user:
            return False

        new_password_hash = hash_password(new_password)

        result = users_collection.update_one(
            {
                "_id": user["_id"],
                **token_query
            },
            {
                "$set": {
                    "password": new_password_hash,
                    "password_changed_at": now
                },
                "$unset": {
                    "password_reset_token_hash": "",
                    "password_reset_expires_at": ""
                }
            }
        )
         # Only one successful request can consume the token
        return result.modified_count == 1

    except PyMongoError as e:
        logger.exception(
            "Database error resetting password"
        )
        raise DatabaseError() from e