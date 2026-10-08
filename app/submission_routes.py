from fastapi import APIRouter, Depends, Query
from app.dependencies import get_current_user
from app.submission_service import get_my_submissions

router = APIRouter(
    prefix = "/submissions",
    tags=["Submissions"] 
)

@router.get("/")
def get_submissions(
    page:int = Query(default=1, ge=1),
    limit: int = Query(default = 10 , ge=1, le=20),
    search: str = "",
    current_user = Depends(get_current_user)
):
    return get_my_submissions(
        page=page,
        limit=limit,
        search=search,
        user_id=current_user["_id"]
    )