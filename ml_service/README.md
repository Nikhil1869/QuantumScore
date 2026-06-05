# ML Service

FastAPI-powered machine learning service for sports match outcome prediction.

## Model

- **Algorithm:** XGBoost (native API, binary logistic)
- **Features (10):** team form, team strength, home advantage, head-to-head, avg goals scored/conceded
- **Sports:** Football, Cricket, Basketball
- **Training data:** 2,000 synthetically generated samples across all 3 sports

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

## Retraining the Model

```bash
# Regenerate training data + retrain
python -m ml_service.train

# Or use auto-retrain
python -m ml_service.auto_train
```

## Files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app with all endpoints |
| `features.py` | Feature extraction (10 features) |
| `explain.py` | Feature importance & per-prediction explanations |
| `train.py` | Model training pipeline |
| `auto_train.py` | Automated retraining wrapper |
| `model.pkl` | Trained XGBoost model (serialized) |
| `model_meta.json` | Model performance metrics |
