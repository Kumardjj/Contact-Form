from app.spam.spam_service import calculate_spam_score


result = calculate_spam_score(
    name="John",
    email="john@example.com",
    subject="Important",
    message="BUY NOW!!! You are a winner! Click here!"
)

print(result)