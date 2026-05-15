import re
import string

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # 3. Remove URLs
    text = re.sub(r'http[s]?://\S+', '', text)
    text = re.sub(r'www\.\S+', '', text)
    
    # 4. Remove dataset-specific news agency prefixes like "washington (reuters) -"
    # This was previously only done during inference, causing extreme bias!
    text = re.sub(r'^[^-]*\(reuters\)\s*-\s*', '', text)
    text = re.sub(r'^[^-]*\(ap\)\s*-\s*', '', text)
    # Generic location prefix removal (e.g. "london -") if it's very short at the start
    text = re.sub(r'^.{0,30}\s-\s', '', text)
    
    # 5. Remove punctuation and special characters
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # 6. Remove numbers (optional, but helps reduce noise)
    text = re.sub(r'\d+', '', text)
    
    # 7. Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
