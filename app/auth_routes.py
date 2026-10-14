from fastapi import (
    APIRouter,
    Depends,
    BackgroundTasks,
    HTTPException
)

from app.models import (
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ProfileUpdate,
    ChangePasswordRequest
)

from app.auth import (
    login_user,
    register_user,
    create_password_reset_request,
    reset_user_password,
    update_user_profile,
    change_user_password
)

from app.notification.email import send_password_reset_email
from app.logging_config import logger

from app.dependencies import get_current_user

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

@router.patch("/update-profile")
def update_profile(
    data: ProfileUpdate,
    current_user=Depends(get_current_user)
):
    return update_user_profile(
        user_id=current_user["_id"],
        name=data.name,
        email=str(data.email)
    )


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user=Depends(get_current_user)
):
    return change_user_password(
        user_id=current_user["_id"],
        current_password=data.current_password,
        new_password=data.new_password
    )


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest,
                    background_tasks: BackgroundTasks):
    reset_details = create_password_reset_request(str(request.email))
    if reset_details:
        background_tasks.add_task(
            send_password_reset_email,
            reset_details["to_email"],
            reset_details["reset_url"]
        )
        return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }

    
@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest
):
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    success = reset_user_password(
        token=request.token,
        new_password=request.new_password
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )

    return {
        "message": (
            "Password reset successfully. "
            "Please log in with your new password."
        )
    }