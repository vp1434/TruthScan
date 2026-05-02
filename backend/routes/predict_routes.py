from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import NewsInput, URLInput, PredictionResponse
from services.ml_service import ml_service
from services.scraper_service import scrape_url
from services.file_service import extract_text_from_file
from services.explainability_service import get_lime_explanation
from utils.db import get_db
from datetime import datetime
from langdetect import detect
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

async def process_prediction(text: str) -> PredictionResponse:
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text is empty")

    try:
        # Check language
        lang = detect(text)
        if lang != 'en':
            # For this prototype we will still process it with BERT zero-shot which supports multi-language
            # but TF-IDF is english only. We will use BERT if not english.
            logger.info(f"Non-English text detected ({lang}), routing to BERT.")
            label, confidence = ml_service.predict_bert(text)
            highlights = [] # LIME is skipped for non-english in this setup
        else:
            # Use TF-IDF by default for English
            label, confidence, tfidf_model = ml_service.predict_tfidf(text)
            highlights = get_lime_explanation(text, tfidf_model.predict_proba)

        result = PredictionResponse(
            text=text[:500] + "..." if len(text) > 500 else text,
            prediction=label,
            confidence=confidence,
            highlights=highlights,
            timestamp=datetime.utcnow().isoformat()
        )

        # Store in MongoDB
        db = get_db()
        await db.analyses.insert_one(result.model_dump())

        return result
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

@router.post("/predict", response_model=PredictionResponse)
async def predict_text(input_data: NewsInput):
    return await process_prediction(input_data.text)

@router.post("/analyze-url", response_model=PredictionResponse)
async def analyze_url(input_data: URLInput):
    try:
        text = scrape_url(input_data.url)
        return await process_prediction(text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze-file", response_model=PredictionResponse)
async def analyze_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text_from_file(file.filename, content)
        return await process_prediction(text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
