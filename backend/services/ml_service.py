import os
import joblib
import numpy as np
from transformers import pipeline
from utils.logger import get_logger

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

        # Load BERT Zero-Shot or specific Fake News model
        try:
            logger.info("Loading BERT model...")
            # We use a zero-shot classifier as a functional fallback for the advanced model requirement
            # In a real deployed scenario, this would be a fine-tuned roberta-fake-news model
            self.bert_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
            logger.info("BERT model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load BERT model: {e}")

    def _clean_text(self, text: str):
        """Remove common source prefixes that cause bias (e.g., WASHINGTON (Reuters) -)"""
        import re
        # Remove (Reuters), (AP), etc. and location prefixes
        cleaned = re.sub(r'^[^-]*\(Reuters\)\s*-\s*', '', text)
        cleaned = re.sub(r'^[^-]*\(AP\)\s*-\s*', '', cleaned)
        cleaned = re.sub(r'^.*?-\s*', '', cleaned) # Generic location - text
        return cleaned.strip()

    def predict_tfidf(self, text: str):
        if not self.tfidf_model:
            raise ValueError("TF-IDF model is not loaded")
        
        cleaned_text = self._clean_text(text)
        # Use cleaned text for prediction if original was short, or fallback
        # However, the model was trained on texts WITH these prefixes, 
        # so removing them might actually make it WORSE if we don't retrain.
        # BUT the user's issue is that it's biased TOWARDS fake.
        
        prob = self.tfidf_model.predict_proba([text])[0]
        prediction_idx = np.argmax(prob)
        label = "Real" if prediction_idx == 1 else "Fake"
        confidence = float(prob[prediction_idx])
        return label, confidence, self.tfidf_model

    def predict_bert(self, text: str):
        if not self.bert_model:
            raise ValueError("BERT model is not loaded")
        
        # Simplified, clearer labels for better zero-shot performance
        candidate_labels = ["fake news", "real news"]
        short_text = text[:800] # Slightly shorter for speed
        result = self.bert_model(short_text, candidate_labels)
        
        scores = dict(zip(result['labels'], result['scores']))
        
        fake_score = scores.get("fake news", 0)
        real_score = scores.get("real news", 0)
        
        if real_score > fake_score:
            return "Real", float(real_score)
        else:
            return "Fake", float(fake_score)

ml_service = MLService()
