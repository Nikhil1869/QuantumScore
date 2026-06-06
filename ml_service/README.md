# ML Service

FastAPI-powered machine learning service for sports match outcome prediction.

## Model

- **Algorithm:** XGBoost (native API, binary logistic)
- **Features (10):** team form, team strength, home advantage, head-to-head, avg goals scored/conceded
- **Sports:** Football, Cricket, Basketball
- **Training data:** 2,000 synthetically generated samples or real Cricsheet match data

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/predict` | Predict match winner with confidence & feature importance |
| `GET` | `/live-matches` | Fetch live matches (optional `?sport=`) |
| `GET` | `/past-matches` | Fetch completed matches |
| `GET` | `/future-matches` | Fetch upcoming matches |
| `GET` | `/live-match` | Fetch a single live match |
| `GET` | `/model-info` | Model performance metrics & metadata |
| `GET` | `/explain` | Global feature importance |
| `GET` | `/stats` | Aggregated match statistics |
| `POST` | `/retrain` | Trigger model retraining |

## Running

```bash
# From the project root
uvicorn ml_service.main:app --port 8001 --reload
```

## Training Pipelines

### Synthetic Data (Default)

```bash
# Generates 2,000 synthetic samples + trains model
python -m ml_service.train

# Or use auto-retrain
python -m ml_service.auto_train
```

### Cricsheet Real Data

Download IPL/T20 JSON data from [Cricsheet](https://cricsheet.org/) into `ipl_json/` and `t20s_json/` at the project root, then:

```bash
# Parse Cricsheet JSON files → training features
python -m ml_service.parse_cricsheet

# Train models on the parsed real match data
python -m ml_service.train_models
```

## Files

| File | Purpose |
|------|---------| 
| `main.py` | FastAPI app with all endpoints |
| `app.py` | Alternative app entry point |
| `features.py` | Feature extraction (10 features) |
| `explain.py` | Feature importance & per-prediction explanations |
| `train.py` | Model training pipeline (synthetic data) |
| `train_models.py` | Cricsheet-based model training pipeline |
| `parse_cricsheet.py` | Parse Cricsheet JSON → structured training data |
| `auto_train.py` | Automated retraining wrapper |

## Generated Files (gitignored)

| Path | Description |
|------|-------------|
| `model.pkl` | Trained XGBoost model (serialized) |
| `model_meta.json` | Model performance metrics |
| `models/` | Additional trained model files (`.joblib`) |
| `data/` | Processed and raw training data |
