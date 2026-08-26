from app.spam_service import calculate_spam_score

result = calculate_spam_score(
    name = "Rahul",
    email="rahul@gmail.com",
    subject="Question",
    message="You are a winner! Claim your prize now."
)
print(result)