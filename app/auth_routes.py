from fastapi import APIRouter

from fastapi import Depends
from app.dependencies import get_current_user

from app.models import LoginRequest, RegisterRequest
from app.auth import login_user, register_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(credentials: RegisterRequest):

    user = register_user(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.cnf_password
    )

    return {
        "message": "User registered successfully",
        "email": user["email"]
    }


@router.post("/login")
def login(credentials: LoginRequest):

    access_token = login_user(
        credentials.email,
        credentials.password
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"]
    }