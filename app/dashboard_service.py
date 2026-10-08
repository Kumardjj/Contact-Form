from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from app.database import (
    forms_collection,
    submissions_collection
)


def get_dashboard_stats(user_id):

    # Total forms owned by this user
    total_forms = forms_collection.count_documents({
        "user_id": user_id
    })

    # Current date/time in India
    india_tz = ZoneInfo("Asia/Kolkata")
    now_india = datetime.now(india_tz)

    # Start of today in India
    start_today_india = now_india.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    # Start of tomorrow in India
    start_tomorrow_india = start_today_india + timedelta(days=1)

    # Convert to UTC because MongoDB timestamps are stored in UTC
    start_today_utc = start_today_india.astimezone(timezone.utc)
    start_tomorrow_utc = start_tomorrow_india.astimezone(timezone.utc)

    # Today's submissions
    today_submissions = submissions_collection.count_documents({
        "user_id": user_id,
        "submitted_at": {
            "$gte": start_today_utc,
            "$lt": start_tomorrow_utc
        }
    })

    # Start of current month
    start_month_india = now_india.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    # Start of next month
    if start_month_india.month == 12:
        start_next_month_india = start_month_india.replace(
            year=start_month_india.year + 1,
            month=1
        )
    else:
        start_next_month_india = start_month_india.replace(
            month=start_month_india.month + 1
        )

    # Convert month boundaries to UTC
    start_month_utc = start_month_india.astimezone(timezone.utc)
    start_next_month_utc = start_next_month_india.astimezone(timezone.utc)

    # This month's submissions
    month_submissions = submissions_collection.count_documents({
        "user_id": user_id,
        "submitted_at": {
            "$gte": start_month_utc,
            "$lt": start_next_month_utc
        }
    })

    return {
        "total_forms": total_forms,
        "today_submissions": today_submissions,
        "month_submissions": month_submissions
    }