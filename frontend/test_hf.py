import requests
import json

import os
from dotenv import load_dotenv

load_dotenv()

headers = {"Authorization": f"Bearer {os.getenv('VITE_HF_API_KEY')}", "Content-Type": "application/json"}
data = {"inputs": "Hello"}

try:
    res = requests.post("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", headers=headers, json=data)
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print("Error:", e)
