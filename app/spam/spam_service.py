import re
from models import SpamInput, SpamResult

def count_urls(text : str) -> int:
    urls = re.findall(r"https?://\S+|www\.\S+",text)
    return len(urls)

def classify_score(score: float, reasons: list[str] )-> SpamResult:
    if score>= 0.70:
        status = "spam"
    elif score >= 0.40:
        status = "review"
    else:
        status = "legitimate"
    return SpamResult(
        score = score,
        status = status,
        reason = reasons
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

def find_suspicious_keyword(text:str)->list[str]:
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



def calculate_spam_score(data: SpamInput)-> SpamResult:
    score = 0.0
    reasons = []
    
    keywords = find_suspicious_keyword(data.message)
    if keywords:
        score+= 0.20
        reasons.append("suspicious keywords")

    if has_excessive_caps(data.message):
        score+= 0.10
        reasons.append("Has excessive capitalization")

    if has_repeated_characters(data.message):
        score+=0.10
        reasons.append("Has repeated character")

    url_count = count_urls(data.message)
    if url_count >= 5:
        score += 0.30
        reasons.append("Too many urls")

    elif url_count >= 3:
        score += 0.20
        reasons.append("multiple urls")

    return classify_score(score,reasons)