import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import os
import sys

# Import the new cleaner
from utils.text_cleaner import clean_text

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
        print("Applying advanced text cleaning...")
        # Clean text before vectorization to remove bias
        df['clean_text'] = df['text'].astype(str).apply(clean_text)
        X = df['clean_text']
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
        df['clean_text'] = df['text'].apply(clean_text)
        X = df['clean_text']
        y = df['label']
        
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Initializing optimized ML pipeline...")
    # Advanced TF-IDF: bi-grams, ignoring very rare/very common words, max 50k features
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            stop_words='english', 
            ngram_range=(1, 2), 
            max_features=50000, 
            min_df=2, 
            max_df=0.9
        )),
        # Balanced weights to handle any remaining class imbalance and penalize false positives/negatives fairly
        ('lr', LogisticRegression(class_weight='balanced', max_iter=1000, n_jobs=-1))
    ])
    
    print("Fitting model (this may take a while for large datasets)...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    print("-" * 30)
    print("EVALUATION METRICS")
    print(f"Accuracy:  {accuracy:.4f} (Target: >0.95)")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("-" * 30)
    print("CONFUSION MATRIX")
    print(f"True Negative (Correct FAKE): {cm[0][0]}")
    print(f"False Positive (Predicted REAL, actually FAKE): {cm[0][1]}")
    print(f"False Negative (Predicted FAKE, actually REAL): {cm[1][0]}")
    print(f"True Positive (Correct REAL): {cm[1][1]}")
    print("-" * 30)
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    joblib.dump(pipeline, 'models/news_classifier.joblib')
    print("Model successfully trained and saved to models/news_classifier.joblib")

if __name__ == "__main__":
    train_model()
