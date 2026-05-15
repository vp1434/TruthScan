import os
import joblib
import numpy as np
import re
from utils.logger import get_logger
from utils.text_cleaner import clean_text

logger = get_logger(__name__)

class MLService:
    def __init__(self):
        self.tfidf_model = None
        self.bert_model = None
        self.load_models()

    def load_models(self):
        tfidf_path = "models/news_classifier.joblib"
        if os.path.exists(tfidf_path):
            self.tfidf_model = joblib.load(tfidf_path)
            logger.info("TF-IDF model loaded successfully.")
        else:
            logger.warning(f"TF-IDF model not found at {tfidf_path}.")

    def _check_clickbait_patterns(self, text: str) -> bool:
        """Rule-based engine to boost Fake probability on obvious spam/clickbait."""
        patterns = [
            r'\bshocking\b', r'\bclick now\b', r'\blimited offer\b', 
            r'\bmiracle cure\b', r'\bwin \₹', r'\baccount number\b', r'\botp\b', 
            r'\bhurry up\b', r'\bcongratulations\b', r'\byou have won\b'
        ]
        text_lower = text.lower()
        for p in patterns:
            if re.search(p, text_lower):
                return True
        return False

    def predict_tfidf(self, text: str):
        if not self.tfidf_model:
            raise ValueError("TF-IDF model is not loaded")
        
        # Ensure we use the exact same preprocessing as during training
        cleaned_text = clean_text(text)
        
        # Get raw probabilities (Class 0: Fake, Class 1: Real)
        prob = self.tfidf_model.predict_proba([cleaned_text])[0]
        fake_prob = float(prob[0])
        real_prob = float(prob[1])
        
        # Apply custom clickbait / spam heuristic boost (lowered to 10%)
        if self._check_clickbait_patterns(text):
            fake_prob += 0.10
            # Normalize
            total = fake_prob + real_prob
            fake_prob = fake_prob / total
            real_prob = real_prob / total
        
        # Standard 0.50 threshold for unbiased results
        if fake_prob >= 0.50:
            label = "Fake"
            confidence = fake_prob
        else:
            label = "Real"
            confidence = real_prob
            
        return label, confidence, self.tfidf_model

ml_service = MLService()
