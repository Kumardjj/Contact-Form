from fastapi import APIRouter, Depends
from fastapi import Request, HTTPException
from datetime import datetime

from app.database import forms_collection, submissions_collection
from app.models import FormCreate
from app.database import forms_collection
from app.dependencies import get_current_user
import uuid
router = APIRouter(
    prefix="/forms",
    tags=["Forms"]
)


@router.post("/")
def create_form(
    form: FormCreate,
    current_user=Depends(get_current_user)
):
    new_form = {
    "form_name": form.form_name,
    "user_id": current_user["_id"],
    "public_id": str(uuid.uuid4())
}

    result = forms_collection.insert_one(new_form)

    return {
    "message": "Form created successfully",
    "form_id": str(result.inserted_id),
    "public_id": new_form["public_id"]
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
            "form_name": form["form_name"]
        }
        for form in forms
    ]