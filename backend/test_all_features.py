import requests
import time

BASE_URL = "http://localhost:8000"

def test_auth():
    print("Testing Auth...")
    # Register
    email = f"test_{int(time.time())}@example.com"
    reg_data = {"name": "Test User", "email": email, "password": "password123"}
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if r.status_code != 200:
        print(f"FAILED: Registration {r.text}")
        return None
    token = r.json().get("access_token")
    print("SUCCESS: Registration")
    return token

def test_prediction(token):
    print("\nTesting Predictions...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Text Analysis (English)
    text_data = {"text": "The BBC reports that the global economy is growing."}
    r = requests.post(f"{BASE_URL}/predict", json=text_data, headers=headers)
    if r.status_code == 200:
        print(f"SUCCESS: Text Prediction ({r.json()['prediction']})")
    else:
        print(f"FAILED: Text Prediction {r.text}")

    # URL Analysis
    url_data = {"url": "https://www.bbc.com/news/world-68936664"}
    r = requests.post(f"{BASE_URL}/analyze-url", json=url_data, headers=headers)
    if r.status_code == 200:
        print(f"SUCCESS: URL Prediction ({r.json()['prediction']})")
    else:
        print(f"FAILED: URL Prediction {r.text}")

def test_dashboard(token):
    print("\nTesting Dashboard Stats...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # History
    r = requests.get(f"{BASE_URL}/history", headers=headers)
    if r.status_code == 200:
        print(f"SUCCESS: History Fetch (Items: {len(r.json())})")
    else:
        print(f"FAILED: History Fetch {r.text}")
        
    # Stats
    r = requests.get(f"{BASE_URL}/dashboard-stats", headers=headers)
    if r.status_code == 200:
        print(f"SUCCESS: Stats Fetch (Total: {r.json()['total']})")
    else:
        print(f"FAILED: Stats Fetch {r.text}")

if __name__ == "__main__":
    token = test_auth()
    if token:
        test_prediction(token)
        test_dashboard(token)
