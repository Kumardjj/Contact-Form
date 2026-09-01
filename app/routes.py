from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId 
from bson.errors import InvalidId
from app.models import ContactCreate
from app.database import contact_collection
from app.contact_service import (create_contact, 
                                get_contact, 
                                get_all_contacts,
                                update_contact, 
                                delete_contact,
                                )
from app.dependencies import get_current_user
from app.contact_service import get_collection
from app.spam.models import SpamInput 
from app.spam.spam_service import calculate_spam_score
router = APIRouter(prefix = "/contacts", tags = ["Contacts"])

@router.post("/")
def create(contact: ContactCreate):

    # Convert API input into spam-engine input
    spam_input = SpamInput(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message
    )

    # Run spam detection
    spam_result = calculate_spam_score(spam_input)

    # Prepare MongoDB document
    data = contact.model_dump()

    data["spam_score"] = spam_result.score
    data["spam_status"] = spam_result.status
    data["spam_reasons"] = spam_result.reason

    # Save everything into MongoDB
    contact_id = create_contact(data)

    return {
        "message": "Contact form submitted successfully",
        "id": str(contact_id),
        "spam": {
            "score": spam_result.score,
            "status": spam_result.status,
            "reasons": spam_result.reason
        }
    }

@router.get("/")
def get_all(page: int = 1,
            limit: int = 10,
            search : str = "",
            collection = Depends(get_collection),
            current_user : str  = Depends(get_current_user)
            ):
    return get_all_contacts(page, limit,search,collection)

@router.get("/{contact_id}")
def get_one(contact_id : str, current_user : str = Depends(get_current_user)):
    try:
        contact = get_contact(contact_id)
        if not contact:
            raise HTTPException(
                status_code = 404,
                detail = "Contact not found"
            )
        return contact
    except ValueError as e:
        raise HTTPException(status_code= 400,
                            details = str(e))

@router.post("/{contact_id}")
def update(contact_id :str , contact : ContactCreate, current_user : str  = Depends(get_current_user)):
    result = update_contact(contact_id)
    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="contact not found"
        )
    return {"message":"updated successfully"}


@router.delete("/{contact_id}")
def delete(contact_id : str, current_user : str = Depends(get_current_user)):
    result = delete_contact(contact_id)
    if result.deleted_count == 0:
        raise HTTPException(
            status_code= 404,
            detail="contact not found"
        )
    return {
        "message": "Contact deleted successfully"
    }
