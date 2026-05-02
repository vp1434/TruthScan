import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import predict_routes, stats_routes, auth_routes
from utils.cache import setup_cache
from utils.logger import get_logger
import uvicorn

logger = get_logger(__name__)

app = FastAPI(title="TruthScan API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_routes.router)
app.include_router(stats_routes.router)
app.include_router(auth_routes.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up TruthScan API...")
    setup_cache()
    # The ML models are loaded implicitly when ml_service is instantiated

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
