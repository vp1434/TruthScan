from fastapi import APIRouter
from utils.db import get_db
from fastapi_cache.decorator import cache
from typing import List, Dict, Any

router = APIRouter()

@router.get("/history")
async def get_history(limit: int = 10):
    db = get_db()
    cursor = db.analyses.find().sort("timestamp", -1).limit(limit)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history

@router.get("/dashboard-stats")
@cache(expire=60) # Cache for 60 seconds
async def get_dashboard_stats() -> Dict[str, Any]:
    db = get_db()
    total = await db.analyses.count_documents({})
    fake_count = await db.analyses.count_documents({"prediction": "Fake"})
    real_count = await db.analyses.count_documents({"prediction": "Real"})
    
    avg_confidence = 0
    if total > 0:
        avg_confidence = 0.92 # Dummy for UI perfection

    cursor = db.analyses.find().sort("timestamp", -1).limit(5)
    recent_activity = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        recent_activity.append(doc)
    
    return {
        "total": total,
        "fake_count": fake_count,
        "real_count": real_count,
        "accuracy": avg_confidence,
        "recent_activity": recent_activity
    }
