import os

from dotenv import load_dotenv
from pymongo.errors import PyMongoError

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


load_dotenv()


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

def login_user(username: str, password: str):

    user = authenticate_user(
        username,
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