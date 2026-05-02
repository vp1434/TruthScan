# TruthScan - AI-Powered Fake News Detection

TruthScan is a full-stack web application designed to detect fake news articles using machine learning. It features a modern, dark premium SaaS UI and provides real-time analysis with keyword-level explainability.

## 🚀 Features

- **AI-Powered Detection**: TF-IDF + Logistic Regression model.
- **Explainability**: LIME highlighting for key influential words.
- **URL Scraping**: Analyze articles directly from links.
- **History Tracking**: Keep track of previous analyses.
- **Dashboard**: Visualize misinformation trends and platform metrics.
- **Premium UI**: Glassmorphism, animations, and neon accents.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 4, Framer Motion, Recharts, Lucide-react.
- **Backend**: FastAPI (Python), Motor (Async MongoDB), BeautifulSoup4, Newspaper3k.
- **ML**: Scikit-learn, LIME.
- **Database**: MongoDB.

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Running locally on default port 27017)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the virtual environment: `.\venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`.
5. Train the initial model: `python train_model.py`.
6. Start the server: `uvicorn main:app --reload`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## 📄 License
MIT
