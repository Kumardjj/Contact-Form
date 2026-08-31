import re


SUSPICIOUS_KEYWORDS = [
    "buy now",
    "free money",
    "click here",
    "claim your prize",
    "winner",
    "make money fast",
]


def count_urls(text: str) -> int:
    urls = re.findall(
        r"https?://\S+|www\.\S+",
        text
    )

    return len(urls)


def find_suspicious_keywords(text: str) -> list[str]:
    text = text.lower().strip()

    found_keywords = []

    for keyword in SUSPICIOUS_KEYWORDS:
        pattern = rf"\b{re.escape(keyword)}\b"
        if re.search(pattern, text):
            found_keywords.append(keyword)

    return found_keywords


def has_excessive_caps(text: str) -> bool:
    letters = [
        char for char in text
        if char.isalpha()
    ]

    if not letters:
        return False

    uppercase_letters = [
        char for char in letters
        if char.isupper()
    ]

    uppercase_ratio = (
        len(uppercase_letters) / len(letters)
    )

    return uppercase_ratio >= 0.70


def has_repeated_characters(text: str) -> bool:
    return bool(
        re.search(r"(.)\1{4,}", text)
    )