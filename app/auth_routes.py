from fastapi import APIRouter, HTTPException
from app.models import LoginRequest , RegisterRequest
from app.auth import login_user, register_user, EmailAlreadyExistsError,PasswordMismatchError, DatabaseError


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(credentials: RegisterRequest):

    try:
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

    except PasswordMismatchError:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    except EmailAlreadyExistsError:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    except DatabaseError:
        raise HTTPException(
            status_code=503,
            detail="Database service unavailable"
        )

@router.post("/login")
def login(
    credentials: LoginRequest
):

    access_token = login_user(
        credentials.username,
        credentials.password
    )

    if not access_token:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }