from services.ml_service import ml_service

test_cases = [
    "Shocking! Aliens found in Bihar",
    "Send account number to win rs 5000",
    "Breaking miracle cure discovered overnight",
    "U.S. President signs new trade deal with European Union in Washington on Monday.",
]

print("=== TruthScan Prediction Test ===")
for text in test_cases:
    label, conf, _ = ml_service.predict_tfidf(text)
    print(f"\nText: {text}")
    print(f"Prediction: {label} (Confidence: {conf:.2%})")
