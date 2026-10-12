from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.dashboard_service import get_dashboard_stats


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(
    current_user=Depends(get_current_user)
):
    return get_dashboard_stats(
        current_user["_id"]
    )