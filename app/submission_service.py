from app.database import submissions_collection
import re 
def get_my_submissions(page: int, limit: int, search: str, user_id):
    skip = (page-1)*limit

    query = {
        "user_id":user_id
    }

    if search:
        safe_search = re.escape(search)

        query["$or"] = [
            {
                "name": {
                    "$regex": safe_search,
                    "$options": "i"
                }
            },
            {
                "email": {
                    "$regex": safe_search,
                    "$options": "i"
                }
            },
            {
                "subject": {
                    "$regex": safe_search,
                    "$options": "i"
                }
            },
            {
                "message": {
                    "$regex": safe_search,
                    "$options": "i"
                }
            }
        ]
    submissions = []

    cursor = (
        submissions_collection.find(query).sort("_id", -1).skip(skip).limit(limit)
    )

    for submission in cursor:
        submission["_id"] = str(submission["_id"])
        submission["form_id"] = str(submission["form_id"])
        submission["user_id"] = str(submission["user_id"])

        submissions.append(submission)

    return submissions



