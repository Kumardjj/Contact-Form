import os
from fastapi import HTTPException
from pymongo.errors import PyMongoError
from dotenv import load_dotenv
from app.database import users_collection
from app.security import (verify_password,hash_password, create_access_token)

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD_HASH")

def register_user(name:str , email:str , password: str, cnf_password : str):
    if password != cnf_password:
        raise HTTPException(
            status_code=400,
            detail="password do not match"
        )
    try:
        if users_collection.find_one({"email": email}):
            raise ValueError("Email already registered")

        user = {
            "name": name,
            "email": email,
            "password": hash_password(password)
        }

        result = users_collection.insert_one(user)

        if not result.inserted_id:
            raise RuntimeError("User creation failed")

        return user

    except PyMongoError as e:
        raise RuntimeError("Database error") from e

def authenticate_user(useremail: str, password :str):
    try:
        user = users_collection.find_one({
            "email": useremail
        })

        if not user:
            return None

        if not verify_password(password, user["password"]):
            return None

        return user

    except PyMongoError:
        raise HTTPException(
            status_code=503,
            detail="Database service unavailable"
        )

def login_user(username: str, password : str):
    user = authenticate_user(username, password)
    if not user:
        return None
    access_token = create_access_token(
        {
            "sub": str(user["_id"]),
            "email": user["email"]
        }
    )

    return access_token

class EmailAlreadyExistsError(Exception):
    pass


class PasswordMismatchError(Exception):
    pass


class DatabaseError(Exception):
    pass