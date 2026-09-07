from email import message
import re
from .models import SpamResult, SpamInput

from .rules import (
    count_urls,
    find_suspicious_keywords,
    has_excessive_caps,
    has_repeated_characters,
)

URL_WEIGHT = 0.20
MANY_URLS_WEIGHT = 0.30
KEYWORD_WEIGHT = 0.20
CAPS_WEIGHT = 0.10
REPEATED_CHAR_WEIGHT = 0.10

def count_urls(text : str) -> int:
    urls = re.findall(r"https?://\S+|www\.\S+",text)
    return len(urls)

def classify_score(
    score: float,
    reasons: list[str]
) -> SpamResult:

    score = min(score, 1.0)

    if score >= 0.70:
        status = "spam"

    elif score >= 0.40:
        status = "review"

    else:
        status = "legitimate"

    return SpamResult(
        score=score,
        status=status,
        reason=reasons
    )

SUSPICIOUS_KEYWORDS = [
    "buy now",
    "free money",
    "click here",
    "claim your prize",
    "winner",
    "make money fast",
    ]
def normalize_text(text : str) -> str:
    return text.lower().strip()

def find_suspicious_keywords(text:str)->list[str]:
    text = normalize_text(text)
    found_keywords = []
    for keyword in SUSPICIOUS_KEYWORDS:
        found_keywords.append(keyword)
    return found_keywords

def has_excessive_caps(text: str) -> bool:
    letters = [char for char in text if char.isalpha()]
    if not letters:
        return False
    uppercase_letters = [char for char in letters if char.isupper()]

    uppercase_ratio = len(uppercase_letters) / len(letters)
    return uppercase_ratio >= 0.70

def has_repeated_characters(text : str)-> bool:
    return bool(re.search(r"(.)\1{4,}",text))



def calculate_spam_score(data: SpamInput) -> SpamResult:
    print(data.name, data.email, data.subject, data.message)
    score = 0.0
    reasons = []

    url_count = count_urls(data.message)

    if url_count >= 5:
        score += MANY_URLS_WEIGHT
        reasons.append("too_many_urls")

    elif url_count >= 3:
        score += URL_WEIGHT
        reasons.append("multiple_urls")

    keywords = find_suspicious_keywords(data.message)

    if keywords:
        score += KEYWORD_WEIGHT

        for keyword in keywords:
            reasons.append(
                f"suspicious_keyword:{keyword}"
            )

    if has_excessive_caps(data.message):
        score += CAPS_WEIGHT
        reasons.append("excessive_capitalization")

    if has_repeated_characters(data.message):
        score += REPEATED_CHAR_WEIGHT
        reasons.append("repeated_characters")

    return classify_score(score, reasons)