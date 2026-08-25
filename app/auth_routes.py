from fastapi import APIRouter, HTTPException
from app.models import LoginRequest
from app.auth import login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
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