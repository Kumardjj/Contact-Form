from .models import SpamInput, SpamResult
from .spam_service import predict_spam


def calculate_spam_score(data: SpamInput) -> SpamResult:
    # Combine subject and message for classification.
    text = f"{data.subject}\n{data.message}".strip()

    # Get prediction and spam probability from the trained model.
    predicted_status, spam_probability = predict_spam(text)

    # Retain your existing review workflow.
    if spam_probability >= 0.70:
        status = "spam"
    elif spam_probability >= 0.40:
        status = "review"
    else:
        status = "legitimate"


    return SpamResult(
        score=spam_probability,
        status=status,
      
    )
