# 🏆 AI Sports Predictor

> ML-powered sports match outcome prediction across Football, Cricket & Basketball.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-EC4E20)](https://xgboost.readthedocs.io)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   Backend    │────▶│   ML Service     │
│  (Next.js)   │     │  (Express)   │     │  (FastAPI +      │
│  Port 3000   │     │  Port 5000   │     │   XGBoost)       │
└──────────────┘     └──────────────┘     │  Port 8001       │
                                          └──────┬───────────┘
                                                 │
                                          ┌──────▼───────────┐
                                          │  Scraper / Data  │
                                          │  Generator       │
                                          └──────────────────┘
```

- **Frontend** — Next.js UI for match browsing and predictions
- **Backend** — Express.js proxy that routes API calls to the ML service
- **ML Service** — FastAPI server with XGBoost model, explainability, and match data
- **Scraper** — Data fetcher and synthetic training data generator

## Project Structure

```
Prediction/
├── backend/                  # Express.js API proxy
│   ├── server.js
│   └── package.json
├── frontend/                 # Next.js web UI
│   ├── pages/
│   │   ├── _app.js
│   │   ├── index.js
│   │   ├── predict.js
│   │   └── live.js
│   ├── styles/
│   │   └── globals.css
│   └── package.json
├── ml_service/               # FastAPI + XGBoost prediction service
│   ├── main.py               # API endpoints
│   ├── features.py           # Feature extraction (10 features)
│   ├── explain.py            # Feature importance explainer
│   ├── train.py              # Model training pipeline
│   ├── auto_train.py         # Automated retraining
│   ├── model.pkl             # Trained model
│   └── model_meta.json       # Model performance metrics
├── scraper/                  # Data fetching & generation
│   ├── real_data_fetcher.py  # Live/past/future match data
│   └── generate_training_data.py
├── training_data.csv         # Generated training dataset
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variable template
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ai-sports-predictor.git
cd ai-sports-predictor
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env if you need custom ports
```

### 3. Install Python dependencies

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start the ML Service (port 8001)

```bash
uvicorn ml_service.main:app --port 8001 --reload
```

### 5. Start the Backend (port 5000)

```bash
cd backend
npm install
npm start
```

### 6. Start the Frontend (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

All endpoints are available through the backend proxy (`localhost:5000`) or directly from the ML service (`localhost:8001`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/predict` | Predict match outcome with confidence scores |
| `GET` | `/api/live-matches` | Fetch live matches (`?sport=football`) |
| `GET` | `/api/past-matches` | Fetch completed matches |
| `GET` | `/api/future-matches` | Fetch upcoming matches |
| `GET` | `/api/model-info` | Model accuracy, precision, recall, F1 |
| `GET` | `/api/explain` | Global feature importance |
| `GET` | `/api/stats` | Aggregated match statistics |
| `POST` | `/api/retrain` | Trigger model retraining |

### Example Prediction Request

```json
POST /api/predict
{
  "sport": "football",
  "homeTeam": "Manchester United",
  "awayTeam": "Liverpool",
  "teamA_form": 0.75,
  "teamB_form": 0.80,
  "teamA_home": 1,
  "teamB_home": 0,
  "teamA_strength": 0.72,
  "teamB_strength": 0.78,
  "teamA_avg_goals": 1.8,
  "teamB_avg_goals": 2.1,
  "teamA_avg_conceded": 0.9,
  "teamB_avg_conceded": 0.8,
  "head_to_head_advantage": 0.55
}
```

## Retraining the Model

```bash
# Regenerate training data (2,000 samples) and retrain
python -m ml_service.train

# Or use the auto-retrain script
python -m ml_service.auto_train

# Or trigger via API
curl -X POST http://localhost:8001/retrain
```

## Model Details

| Property | Value |
|----------|-------|
| Algorithm | XGBoost (native API) |
| Objective | Binary logistic regression |
| Features | 10 (form, strength, home advantage, H2H, goals, defense) |
| Training samples | 2,000 (synthetic) |
| Sports covered | Football, Cricket, Basketball |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
