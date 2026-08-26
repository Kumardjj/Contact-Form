import re
from dataclasses import dataclass, field

@dataclass
class SpamResult:
    score: float
    status : str
    reason : list[str] = field(default_factory=list)

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

def calculate_spam_score(name: str,
                         email: str,
                         subject: str,
                         message: str)-> SpamResult:
    score = 0.0
    reasons = []
    keywords = find_suspicious_keyword(message)
    if keywords:
        score+= 0.20
    url_count = count_urls(message)
    if url_count >= 5:
        score += 0.30
    elif url_count >= 3:
        score += 0.20
    return classify_score(score,reasons)