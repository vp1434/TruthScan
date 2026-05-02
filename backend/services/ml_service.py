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

    def predict_tfidf(self, text: str):
        if not self.tfidf_model:
            raise ValueError("TF-IDF model is not loaded")
        prob = self.tfidf_model.predict_proba([text])[0]
        prediction_idx = np.argmax(prob)
        label = "Real" if prediction_idx == 1 else "Fake"
        confidence = float(prob[prediction_idx])
        return label, confidence, self.tfidf_model

    def predict_bert(self, text: str):
        if not self.bert_model:
            raise ValueError("BERT model is not loaded")
        candidate_labels = ["fake news, misinformation, false", "real news, factual, true"]
        # Limit text length for BERT to avoid out of memory / max length errors
        short_text = text[:1000]
        result = self.bert_model(short_text, candidate_labels)
        
        # 'fake news' label index
        fake_idx = candidate_labels.index("fake news, misinformation, false")
        real_idx = candidate_labels.index("real news, factual, true")
        
        fake_score = result['scores'][fake_idx]
        real_score = result['scores'][real_idx]
        
        if real_score > fake_score:
            return "Real", float(real_score)
        else:
            return "Fake", float(fake_score)

ml_service = MLService()
