import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os
import sys

def train_model():
    print("Training TF-IDF + Logistic Regression model...")
    
    true_path = "../True.csv"
    fake_path = "../Fake.csv"
    
    if os.path.exists(true_path) and os.path.exists(fake_path):
        print(f"Loading datasets from {true_path} and {fake_path}")
        df_true = pd.read_csv(true_path)
        df_fake = pd.read_csv(fake_path)
        
        # Label 1 for Real, 0 for Fake
        df_true['label'] = 1
        df_fake['label'] = 0
        
        df = pd.concat([df_true, df_fake], ignore_index=True)
        
        # In ISOT dataset, 'text' column holds the content
        if 'text' not in df.columns:
            print("Error: 'text' column not found in CSVs.")
            sys.exit(1)
            
        # Sample for speed if dataset is huge, otherwise use all
        # Since this is a prototype, let's use all if possible, or sample if it takes too long
        print(f"Total records: {len(df)}")
        X = df['text'].fillna('')
        y = df['label']
    else:
        print("CSV files not found, using small synthetic dataset.")
        data = {
            'text': [
                "The sun rises in the east and sets in the west.",
                "Water boils at 100 degrees Celsius at sea level.",
                "The capital of France is Paris.",
                "NASA discovers alien civilization on Mars living in underground cities.",
                "Drinking bleach cures all known diseases instantly.",
                "The moon is made of green cheese and smells like lavender.",
                "Scientists confirm that gravity is just a social construct.",
                "Global warming is a hoax created by lizard people to sell more fans."
            ],
            'label': [1, 1, 1, 0, 0, 0, 0, 0] # 1 for Real, 0 for Fake
        }
        df = pd.DataFrame(data)
        X = df['text']
        y = df['label']
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=10000)),
        ('lr', LogisticRegression(max_iter=1000))
    ])
    
    print("Fitting model...")
    pipeline.fit(X_train, y_train)
    
    score = pipeline.score(X_test, y_test)
    print(f"Model accuracy on test set: {score:.4f}")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(pipeline, 'models/news_classifier.joblib')
    print("Model saved to models/news_classifier.joblib")

if __name__ == "__main__":
    train_model()
