"""FastAPI service for AI Sports Predictor — prediction, explainability, and match data"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import json
import os
import sys

from ml_service.features import generate_features, FEATURE_NAMES
from ml_service.explain import get_feature_importance, explain_prediction

# Add scraper to path
scraper_path = os.path.join(os.path.dirname(__file__), "..", "scraper")
if scraper_path not in sys.path:
    sys.path.insert(0, scraper_path)

from real_data_fetcher import (
    get_sample_live_matches,
    get_all_live_matches,
    get_sample_past_matches,
    get_sample_future_matches,
)

app = FastAPI(
    title="AI Sports Predictor API",
    description="ML-powered sports match outcome prediction",
    version="2.0.0",
)

# CORS — allow frontend to connect directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))

# Load model metadata if available
MODEL_META_PATH = os.path.join(BASE_DIR, "model_meta.json")
model_meta = {}
if os.path.exists(MODEL_META_PATH):
    with open(MODEL_META_PATH, "r") as f:
        model_meta = json.load(f)


# ──────────────────────────────────────────────
# PREDICTION ENDPOINTS
# ──────────────────────────────────────────────


@app.post("/predict")
def predict(data: dict):
    """Predict match winner with confidence, reasons, and feature importance"""
    try:
        features = generate_features(data)
        X = [features]
        
        # Check if it's a native xgboost Booster or sklearn wrapper
        if hasattr(model, 'predict_proba'):
            prob = model.predict_proba(X)[0]
        else:
            import xgboost as xgb
            dtest = xgb.DMatrix(X, feature_names=FEATURE_NAMES)
            p1 = float(model.predict(dtest)[0])
            prob = [1.0 - p1, p1]

        # Calculate confidence and winner
        confidence = float(max(prob))
        winner = "Team A" if prob[1] > 0.5 else "Team B"

        # Extract team names
        home_team = data.get("homeTeam", "Team A")
        away_team = data.get("awayTeam", "Team B")
        winner_name = home_team if winner == "Team A" else away_team

        # Generate key factors
        reasons = generate_key_factors(data, prob)

        # Generate per-prediction feature importance
        feature_importance = explain_prediction(model, features, FEATURE_NAMES)

        return {
            "winner": winner_name,
            "confidence": round(confidence, 3),
            "reasons": reasons,
            "feature_importance": feature_importance,
            "prediction_details": {
                "homeTeam": home_team,
                "awayTeam": away_team,
                "homeTeam_form": data.get("teamA_form", 0),
                "awayTeam_form": data.get("teamB_form", 0),
                "homeTeam_strength": data.get("teamA_strength", 0),
                "awayTeam_strength": data.get("teamB_strength", 0),
                "homeTeam_key_players": data.get("teamA_key_players", []),
                "awayTeam_key_players": data.get("teamB_key_players", []),
            },
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


def generate_key_factors(data, prob):
    """Generate detailed key factors for prediction"""
    sport = data.get("sport", "football")
    factors = []

    home_team = data.get("homeTeam", "Team A")
    away_team = data.get("awayTeam", "Team B")

    # Form analysis
    home_form = data.get("teamA_form", 0.5)
    away_form = data.get("teamB_form", 0.5)

    if home_form > away_form:
        factors.append(f"✓ {home_team} in better recent form ({home_form:.1%})")
    else:
        factors.append(f"✓ {away_team} in better recent form ({away_form:.1%})")

    # Home advantage
    if data.get("teamA_home", 0) == 1:
        factors.append(f"✓ Home advantage for {home_team}")

    # Strength analysis
    home_strength = data.get("teamA_strength", 0.5)
    away_strength = data.get("teamB_strength", 0.5)

    if home_strength > away_strength:
        factors.append(
            f"✓ {home_team} has stronger overall rating ({home_strength:.1%})"
        )
    elif away_strength > home_strength:
        factors.append(
            f"✓ {away_team} has stronger overall rating ({away_strength:.1%})"
        )

    # Sport-specific factors
    if sport == "football":
        home_goals = data.get("teamA_avg_goals", 1.5)
        away_goals = data.get("teamB_avg_goals", 1.5)
        if home_goals > away_goals:
            factors.append(
                f"✓ {home_team} scores more ({home_goals:.1f} avg goals/match)"
            )

        home_defense = data.get("teamA_avg_conceded", 1.0)
        away_defense = data.get("teamB_avg_conceded", 1.0)
        if home_defense < away_defense:
            factors.append(
                f"✓ {home_team} has tighter defense ({home_defense:.1f} avg conceded)"
            )

        h2h = data.get("head_to_head_advantage", 0.5)
        if h2h > 0.55:
            factors.append(f"✓ {home_team} dominates head-to-head record")
        elif h2h < 0.45:
            factors.append(f"✓ {away_team} dominates head-to-head record")

        form_a = data.get("last_5_form_A", "")
        form_b = data.get("last_5_form_B", "")
        if form_a and form_b and form_a.count("W") > form_b.count("W"):
            factors.append(f"✓ {home_team} recent run: {form_a}")

    elif sport == "cricket":
        home_runs = data.get("teamA_avg_runs", 150)
        away_runs = data.get("teamB_avg_runs", 150)
        if home_runs > away_runs:
            factors.append(f"✓ {home_team} averages {home_runs} runs per match")

        home_wickets = data.get("teamA_avg_wickets", 7)
        away_wickets = data.get("teamB_avg_wickets", 7)
        if home_wickets < away_wickets:
            factors.append(
                f"✓ {home_team} preserves wickets better (avg {home_wickets} lost)"
            )

        if data.get("teamA_key_players"):
            players = ", ".join(data.get("teamA_key_players", [])[:2])
            factors.append(f"✓ Key players: {players}")

    elif sport == "basketball":
        home_ppg = data.get("teamA_ppg", 110)
        away_ppg = data.get("teamB_ppg", 110)
        if home_ppg > away_ppg:
            factors.append(f"✓ {home_team} scores more ({home_ppg:.1f} PPG)")

        home_rpg = data.get("teamA_rpg", 45)
        away_rpg = data.get("teamB_rpg", 45)
        if home_rpg > away_rpg:
            factors.append(f"✓ {home_team} dominates rebounding ({home_rpg:.1f} RPG)")

        if data.get("teamA_key_players"):
            players = ", ".join(data.get("teamA_key_players", [])[:2])
            factors.append(f"✓ Star players: {players}")

    if not factors:
        factors = ["✓ Strong overall performance", "✓ Favorable match conditions"]

    return factors


# ──────────────────────────────────────────────
# MATCH DATA ENDPOINTS
# ──────────────────────────────────────────────


@app.get("/live-matches")
def get_live_matches_endpoint(sport: str = None):
    """Fetch live matches"""
    try:
        if sport:
            matches = get_sample_live_matches(sport)
        else:
            matches = get_all_live_matches()

        return {"matches": matches, "count": len(matches), "status": "live"}
    except Exception as e:
        print(f"Error: {e}")
        return {"matches": [], "count": 0, "error": str(e)}


@app.get("/past-matches")
def get_past_matches_endpoint(sport: str = None):
    """Fetch past/completed matches"""
    try:
        if sport:
            matches = get_sample_past_matches(sport)
        else:
            matches = []
            for s in ["football", "cricket", "basketball"]:
                matches.extend(get_sample_past_matches(s))

        return {"matches": matches, "count": len(matches), "status": "completed"}
    except Exception as e:
        print(f"Error: {e}")
        return {"matches": [], "count": 0, "error": str(e)}


@app.get("/future-matches")
def get_future_matches_endpoint(sport: str = None):
    """Fetch upcoming/scheduled matches"""
    try:
        if sport:
            matches = get_sample_future_matches(sport)
        else:
            matches = []
            for s in ["football", "cricket", "basketball"]:
                matches.extend(get_sample_future_matches(s))

        return {"matches": matches, "count": len(matches), "status": "upcoming"}
    except Exception as e:
        print(f"Error: {e}")
        return {"matches": [], "count": 0, "error": str(e)}


@app.get("/live-match")
def get_live_match_data(sport: str = "cricket"):
    """Fetch a single live match for testing"""
    try:
        matches = get_sample_live_matches(sport)

        if matches:
            return matches[0]
        else:
            return {
                "sport": sport,
                "homeTeam": "Team A",
                "awayTeam": "Team B",
                "teamA_form": 0.70,
                "teamB_form": 0.65,
                "teamA_home": 1,
                "teamB_home": 0,
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────────────────────────
# NEW ENDPOINTS: Explainability, Model Info, Stats
# ──────────────────────────────────────────────


@app.get("/model-info")
def get_model_info():
    """Return model performance metrics and metadata"""
    if model_meta:
        return {
            "accuracy": model_meta.get("accuracy", 0),
            "precision": model_meta.get("precision", 0),
            "recall": model_meta.get("recall", 0),
            "f1_score": model_meta.get("f1_score", 0),
            "cv_accuracy": model_meta.get("cv_accuracy", 0),
            "training_date": model_meta.get("training_date", "unknown"),
            "feature_names": model_meta.get("feature_names", FEATURE_NAMES),
            "feature_importance": model_meta.get("feature_importance", {}),
            "total_samples": model_meta.get("total_samples", 0),
        }
    else:
        # Fallback: compute from model directly
        importance = get_feature_importance(model)
        return {
            "accuracy": 0,
            "precision": 0,
            "recall": 0,
            "f1_score": 0,
            "training_date": "unknown",
            "feature_names": FEATURE_NAMES,
            "feature_importance": importance,
            "total_samples": 0,
        }


@app.get("/explain")
def get_global_explanation():
    """Return global feature importance for the model"""
    importance = get_feature_importance(model)
    return {
        "feature_importance": importance,
        "feature_names": FEATURE_NAMES,
        "description": "Global feature importance scores from the trained XGBoost model",
    }


@app.get("/stats")
def get_stats():
    """Return aggregated match statistics"""
    try:
        all_live = get_all_live_matches()
        all_past = []
        all_future = []
        for s in ["football", "cricket", "basketball"]:
            all_past.extend(get_sample_past_matches(s))
            all_future.extend(get_sample_future_matches(s))

        total = len(all_live) + len(all_past) + len(all_future)

        sports_breakdown = {}
        for match in all_live + all_past + all_future:
            sport = match.get("sport", "unknown")
            sports_breakdown[sport] = sports_breakdown.get(sport, 0) + 1

        return {
            "total_matches": total,
            "live_matches": len(all_live),
            "past_matches": len(all_past),
            "future_matches": len(all_future),
            "sports_breakdown": sports_breakdown,
            "sports_covered": len(sports_breakdown),
        }
    except Exception as e:
        return {"total_matches": 0, "error": str(e)}


@app.post("/retrain")
def retrain_model():
    """Trigger model retraining"""
    try:
        from ml_service.auto_train import auto_retrain

        meta = auto_retrain()
        return {"status": "success", "meta": meta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
