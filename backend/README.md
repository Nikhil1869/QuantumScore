# QuantumScore Backend

Express.js API proxy server that sits between the React frontend and the FastAPI ML service.

## Purpose

The backend acts as a thin proxy layer that:

- Routes all `/api/*` requests from the frontend to the ML service
- Handles CORS for cross-origin requests
- Provides a single entry point for the frontend to consume

## Endpoints

All requests are proxied to the ML service at `http://localhost:8001`.

| Method | Endpoint | Proxied To | Description |
|--------|----------|------------|-------------|
| `POST` | `/api/predict` | `/predict` | Predict match outcome |
| `GET` | `/api/live-matches` | `/live-matches` | Fetch live matches |
| `GET` | `/api/past-matches` | `/past-matches` | Fetch completed matches |
| `GET` | `/api/future-matches` | `/future-matches` | Fetch upcoming matches |
| `GET` | `/api/model-info` | `/model-info` | Model metrics |
| `GET` | `/api/explain` | `/explain` | Feature importance |
| `GET` | `/api/stats` | `/stats` | Match statistics |
| `POST` | `/api/retrain` | `/retrain` | Trigger retraining |

## Running

```bash
npm install
npm start     # Starts on port 5000
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | `5000` | Server port |
| `ML_SERVICE_URL` | `http://localhost:8001` | ML service URL |

## Dependencies

- **express** — Web framework
- **axios** — HTTP client for proxying requests
- **cors** — Cross-Origin Resource Sharing
