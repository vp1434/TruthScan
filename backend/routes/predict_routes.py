from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import NewsInput, URLInput, PredictionResponse
from services.ml_service import ml_service
from services.scraper_service import scrape_url
from services.file_service import extract_text_from_file
from services.explainability_service import get_lime_explanation
from utils.db import get_db
from datetime import datetime
from utils.logger import get_logger
from utils.auth import get_user_id_optional
from fastapi import Depends

logger = get_logger(__name__)
router = APIRouter()

async def process_prediction(text: str, user_id: str = None) -> PredictionResponse:
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text is empty")

    import time
    start_time = time.time()
    try:
        # Rely entirely on the optimized, highly accurate TF-IDF + LR pipeline
        label, confidence, tfidf_model = ml_service.predict_tfidf(text)
        
        highlights = get_lime_explanation(text, tfidf_model.predict_proba)

        processing_time = time.time() - start_time
        
        # Determine Risk Level based on prediction and confidence
        risk_level = "Low"
        if label == "Fake":
            risk_level = "High" if confidence > 0.75 else "Medium"
            
        result = PredictionResponse(
            text=text[:500] + "..." if len(text) > 500 else text,
            prediction=label,
            confidence=confidence,
            highlights=highlights,
            timestamp=datetime.utcnow().isoformat() + "Z"
        )

        # Store in MongoDB
        db = get_db()
        data = {
            "text": result.text,
            "prediction": label,
            "confidence": confidence,
            "highlights": highlights,
            "timestamp": result.timestamp,
            "riskLevel": risk_level,
            "processing_time": processing_time,
            "ts": datetime.utcnow()
        }
        if user_id:
            data["user_id"] = user_id
        await db.analyses.insert_one(data)

        return result
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

@router.post("/predict", response_model=PredictionResponse)
async def predict_text(input_data: NewsInput, user_id: str = Depends(get_user_id_optional)):
    return await process_prediction(input_data.text, user_id)

@router.post("/analyze-url", response_model=PredictionResponse)
async def analyze_url(input_data: URLInput, user_id: str = Depends(get_user_id_optional)):
    try:
        text = scrape_url(input_data.url)
        return await process_prediction(text, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze-file", response_model=PredictionResponse)
async def analyze_file(file: UploadFile = File(...), user_id: str = Depends(get_user_id_optional)):
    try:
        content = await file.read()
        text = extract_text_from_file(file.filename, content)
        return await process_prediction(text, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

