# 🏆 QuantumScore

> ML-powered sports match outcome prediction across Football, Cricket & Basketball.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-EC4E20)](https://xgboost.readthedocs.io)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8+-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Frontend   │────▶│   Backend    │────▶│   ML Service     │
│  (Vite +     │     │  (Express)   │     │  (FastAPI +      │
│   React/TS)  │     │  Port 5000   │     │   XGBoost)       │
│  Port 5173   │     └──────────────┘     │  Port 8001       │
└──────────────┘                          └──────┬───────────┘
                                                 │
                                          ┌──────▼───────────┐
                                          │  Scraper / Data  │
                                          │  Generator       │
                                          └──────────────────┘
```

- **Frontend** — React + TypeScript UI (Vite) with prediction forms, analytics dashboard, and history
- **Backend** — Express.js proxy that routes API calls to the ML service
- **ML Service** — FastAPI server with XGBoost model, explainability, and match data
- **Scraper** — Data fetcher and synthetic training data generator

## Project Structure

```
QuantumScore/
├── backend/                  # Express.js API proxy
│   ├── server.js             # Proxy server with API routing
│   ├── data/                 # Runtime data (gitignored)
│   └── package.json
├── frontend/                 # React + TypeScript UI (Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI components (PredictionForm, Analytics, etc.)
│   │   │   ├── pages/        # Page views (Login)
│   │   │   ├── lib/          # Utilities, predictor logic, sports data
│   │   │   └── App.tsx       # Main app with routing & layout
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── vite.config.ts        # Vite config with API proxy
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json
├── ml_service/               # FastAPI + XGBoost prediction service
│   ├── main.py               # API endpoints (prediction, live/past/future matches)
│   ├── app.py                # Alternative app entry point
│   ├── features.py           # Feature extraction (10 features)
│   ├── explain.py            # Feature importance explainer
│   ├── train.py              # Model training pipeline (synthetic data)
│   ├── train_models.py       # Cricsheet-based model training
│   ├── parse_cricsheet.py    # Parse Cricsheet JSON → training features
│   ├── auto_train.py         # Automated retraining
│   ├── models/               # Trained model files (gitignored)
│   └── data/                 # Processed training data (gitignored)
├── scraper/                  # Data fetching & generation
│   ├── real_data_fetcher.py  # Live/past/future match data from APIs
│   └── generate_training_data.py  # Synthetic training data generator
├── ipl_json/                 # IPL match data from Cricsheet (gitignored)
├── t20s_json/                # T20 match data from Cricsheet (gitignored)
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── CONTRIBUTING.md           # Contribution guidelines
├── SECURITY.md               # Security policy
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
└── README.md                 # This file
```

> **Note:** Model files (`.pkl`, `.joblib`, `model_meta.json`), raw Cricsheet data (`ipl_json/`, `t20s_json/`), and `training_data.csv` are generated locally and not tracked in git. See the [Data](#data) and [Setup](#quick-start) sections below.

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Nikhil1869/QuantumScore.git
cd QuantumScore
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

### 4. Generate the ML model (first time only)

```bash
python -m ml_service.train
```

This creates `model.pkl` and `model_meta.json` inside `ml_service/`.

### 5. Start the ML Service (port 8001)

```bash
uvicorn ml_service.main:app --port 8001 --reload
```

### 6. Start the Backend (port 5000)

```bash
cd backend
npm install
npm start
```

### 7. Start the Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data

### Cricsheet Match Data

The ML models can be trained using real match data from [Cricsheet](https://cricsheet.org/). These JSON files are **not included** in the repository due to their size.

To download:

```bash
# IPL match data
curl -o ipl_json.zip https://cricsheet.org/downloads/ipl_json.zip
unzip ipl_json.zip -d ipl_json/

# T20 International match data
curl -o t20s_json.zip https://cricsheet.org/downloads/t20s_json.zip
unzip t20s_json.zip -d t20s_json/
```

Once downloaded, train models using the Cricsheet pipeline:

```bash
python -m ml_service.parse_cricsheet    # Parse JSON → features
python -m ml_service.train_models       # Train models on parsed data
```

### Synthetic Data

Alternatively, the default `ml_service.train` generates 2,000 synthetic training samples that work without any external data download.

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

# Or train on real Cricsheet data
python -m ml_service.train_models

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
| Training data | 2,000 synthetic samples or Cricsheet real match data |
| Sports covered | Football, Cricket, Basketball |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Cricsheet](https://cricsheet.org/) — Ball-by-ball cricket match data in JSON format
- [XGBoost](https://xgboost.readthedocs.io/) — Gradient boosting framework
- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [Vite](https://vite.dev/) — Next-generation frontend build tool
