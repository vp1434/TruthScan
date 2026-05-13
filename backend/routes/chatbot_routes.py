from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = "gemini-1.5-flash"

SYSTEM_PROMPT = """You are TruthScan Assistant — a helpful AI embedded in the TruthScan fake news detection platform.
Your job is to help users understand how fake news detection works, explain their analysis results, 
guide them through platform features, and answer general questions about misinformation and media literacy.
Be concise, friendly, and professional. Respond in plain text without markdown unless necessary."""

class ChatInput(BaseModel):
    prompt: str

@router.post("/chatbot")
async def chatbot(input_data: ChatInput):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured on server")

    print(f"DEBUG: Using Gemini API Key starting with: {GOOGLE_API_KEY[:8]}...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GOOGLE_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\n\nUser Question: {input_data.prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 500,
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 404:
            # Try to list models to see what's available
            list_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GOOGLE_API_KEY}"
            list_resp = requests.get(list_url)
            models = list_resp.json() if list_resp.status_code == 200 else "Could not list models"
            return {"status": "error", "message": f"Model not found. Available models: {models}"}

        if response.status_code != 200:
            return {"status": "error", "message": f"Gemini API error ({response.status_code}): {response.text}"}

        result = response.json()
        
        try:
            text = result['candidates'][0]['content']['parts'][0]['text']
            return {"status": "success", "text": text}
        except (KeyError, IndexError):
            return {"status": "error", "message": "Unexpected response format from AI service."}

    except requests.Timeout:
        return {"status": "error", "message": "Request timed out. Please try again."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
