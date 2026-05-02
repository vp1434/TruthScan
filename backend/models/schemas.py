from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class NewsInput(BaseModel):
    text: str

class URLInput(BaseModel):
    url: str

class Highlight(BaseModel):
    word: str
    weight: float

class PredictionResponse(BaseModel):
    text: str
    prediction: str
    confidence: float
    highlights: List[Highlight]
    timestamp: str
