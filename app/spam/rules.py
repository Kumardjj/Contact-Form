import re 
SUSPICIOUS_KEYWORDS = [
    "buy now",
    "free money",
    "click here",
    "claim your prize",
    "winner",
    "make money fast",
]
def count_urls(text : str) -> int:
    urls = re.findall(r"https?://\S+|www\.S+",text)
    return len(urls)

def suspiciouswords(text : str)->list[str]:
    text = text.lower().strip()
    found_keywords = []
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in text:
            found_keywords.append(keyword)
    return found_keywords

def has_excessive_caps(text : str)->bool:
    letters = [ char for char in text if char.isalpha()]
    if not letters:
        return False
    upper = [ char for char in letters if char.isupper()]
    result = len(upper)/len(letters)
    return upper >= 0.70
def has_repeated_characters(text : str)-> bool:
    result = re.search(r"")

