from fastapi import (
    APIRouter,
    Depends,
    BackgroundTasks,
    HTTPException
)

from datetime import datetime, timezone
from uuid import uuid4, UUID

from app.database import (
    forms_collection,
    submissions_collection
)

from app.models import FormCreate, ContactCreate
from app.dependencies import get_current_user

from app.spam.models import SpamInput
from app.spam.spam_service import calculate_spam_score

from app.notification.service import send_notification
from typing import Annotated
from fastapi import Form

from fastapi import Request
from typing import Annotated
from fastapi import Form

from app.rate_limiter import limiter

router = APIRouter(
    prefix="/forms",
    tags=["Forms"]
)


@router.post("/")
def create_form(
    form: FormCreate,
    current_user=Depends(get_current_user)
):
    # Generate a new public ID for EVERY form
    public_id = str(uuid4())

    new_form = {
        "form_name": form.form_name,
        "user_id": current_user["_id"],
        "public_id": public_id,
        "notification_email": str(form.notification_email),
        "created_at": datetime.now(timezone.utc)
    }

    result = forms_collection.insert_one(new_form)

    return {
        "message": "Form created successfully",
        "form_id": str(result.inserted_id),
        "public_id": public_id,
        "form_name": form.form_name,
        "notification_email": str(form.notification_email),
        "submit_path": f"/forms/{public_id}/submit"
    }


@router.get("/")
def get_my_forms(
    current_user=Depends(get_current_user)
):
    forms = forms_collection.find({
        "user_id": current_user["_id"]
    })

    return [
        {
            "id": str(form["_id"]),
            "form_name": form["form_name"],
            "public_id": form["public_id"],
            "notification_email": form["notification_email"],
            "submit_path": (
                f"/forms/{form['public_id']}/submit"
            )
        }
        for form in forms
    ]


@router.post("/{public_id}/submit", status_code=201)
@limiter.limit("5/hour")
def submit_form(
    request: Request,
    public_id: UUID,
    contact: Annotated[ContactCreate, Form()],
    background_tasks: BackgroundTasks
):
    # Find the form using its public ID
    form = forms_collection.find_one({
        "public_id": str(public_id)
    })

    if not form:
        raise HTTPException(
            status_code=404,
            detail="Form not found"
        )

    # Prepare input for spam classifier
    spam_input = SpamInput(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message
    )

    # Run spam detection
    spam_result = calculate_spam_score(spam_input)

    # Prepare submission document
    submission = contact.model_dump()

    submission.update({
        "form_id": form["_id"],
        "user_id": form["user_id"],
        "spam_score": spam_result.score,
        "spam_status": spam_result.status,
        "spam_reasons": spam_result.reason,
        "submitted_at": datetime.now(timezone.utc)
    })

    # Save submission
    result = submissions_collection.insert_one(submission)

    # Send notification to the form owner's email
    if spam_result.status == "legitimate":
        background_tasks.add_task(
            send_notification,
            contact.name,
            str(contact.email),
            contact.subject,
            contact.message,
            form["notification_email"]
        )

    return {
        "message": "Form submitted successfully",
        "submission_id": str(result.inserted_id),
        "spam": {
            "score": spam_result.score,
            "status": spam_result.status,
            "reasons": spam_result.reason
        }
    }