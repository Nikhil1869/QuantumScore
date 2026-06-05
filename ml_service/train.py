"""Train XGBoost model using native xgboost API to avoid sklearn DLL issues"""
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
import sys
import json
from datetime import datetime

# Add scraper to path to import generate_training_data
scraper_path = os.path.join(os.path.dirname(__file__), "..", "scraper")
if scraper_path not in sys.path:
    sys.path.insert(0, scraper_path)

from generate_training_data import generate_training_data

BASE_DIR = os.path.dirname(__file__)
TRAINING_DATA_PATH = os.path.join(BASE_DIR, "..", "training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
MODEL_META_PATH = os.path.join(BASE_DIR, "model_meta.json")

FEATURE_COLUMNS = [
    "team_a_form",
    "team_b_form",
    "team_a_strength",
    "team_b_strength",
    "home_advantage",
    "head_to_head_advantage",
    "team_a_avg_goals",
    "team_b_avg_goals",
    "team_a_avg_conceded",
    "team_b_avg_conceded",
]

def manual_train_test_split(df, test_size=0.2, random_state=42):
    np.random.seed(random_state)
    shuffled_indices = np.random.permutation(len(df))
    test_set_size = int(len(df) * test_size)
    test_indices = shuffled_indices[:test_set_size]
    train_indices = shuffled_indices[test_set_size:]
    return df.iloc[train_indices], df.iloc[test_indices]

def calculate_metrics(y_true, y_pred):
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    
    tp = np.sum((y_true == 1) & (y_pred == 1))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    
    accuracy = (tp + tn) / len(y_true)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    return accuracy, precision, recall, f1

def train_model(regenerate_data=False):
    """Train native XGBoost model with full evaluation pipeline"""
    print("=" * 60)
    print("AI SPORTS PREDICTOR — MODEL TRAINING (NATIVE XGBOOST)")
    print("=" * 60)

    # --- Step 1: Load or generate data ---
    if regenerate_data or not os.path.exists(TRAINING_DATA_PATH):
        print("\n[1/5] Generating training data...")
        data = generate_training_data(2000)
    else:
        print(f"\n[1/5] Loading training data from {TRAINING_DATA_PATH}")
        data = pd.read_csv(TRAINING_DATA_PATH)

    print(f"  -> {len(data)} samples loaded")
    print(f"  -> Sports: {data['sport'].value_counts().to_dict()}")
    print(f"  -> Winner distribution: {data['winner'].value_counts().to_dict()}")

    # --- Step 2: Prepare features ---
    print("\n[2/5] Preparing features...")
    
    train_data, test_data = manual_train_test_split(data, test_size=0.2, random_state=42)
    
    X_train = train_data[FEATURE_COLUMNS]
    y_train = train_data["winner"]
    X_test = test_data[FEATURE_COLUMNS]
    y_test = test_data["winner"]
    
    print(f"  -> {len(FEATURE_COLUMNS)} features: {FEATURE_COLUMNS}")
    print(f"  -> Train: {len(X_train)} samples, Test: {len(X_test)} samples")

    # --- Step 3: Train Model ---
    print("\n[3/5] Training Model...")
    
    dtrain = xgb.DMatrix(X_train, label=y_train, feature_names=FEATURE_COLUMNS)
    dtest = xgb.DMatrix(X_test, label=y_test, feature_names=FEATURE_COLUMNS)

    params = {
        'max_depth': 5,
        'eta': 0.1,
        'objective': 'binary:logistic',
        'eval_metric': 'logloss',
        'subsample': 0.8,
        'seed': 42
    }
    
    best_model = xgb.train(params, dtrain, num_boost_round=100)

    # --- Step 4: Evaluate on test set ---
    print("\n[4/5] Evaluating on test set...")
    y_pred_prob = best_model.predict(dtest)
    y_pred = (y_pred_prob > 0.5).astype(int)

    accuracy, precision, recall, f1 = calculate_metrics(y_test, y_pred)

    print(f"  -> Accuracy:  {accuracy:.4f}")
    print(f"  -> Precision: {precision:.4f}")
    print(f"  -> Recall:    {recall:.4f}")
    print(f"  -> F1 Score:  {f1:.4f}")

    # Feature importance
    importance_dict = best_model.get_score(importance_type='gain')
    # Normalize to sum to 1
    total_gain = sum(importance_dict.values())
    if total_gain > 0:
        importance_dict = {k: v/total_gain for k, v in importance_dict.items()}
    # Fill missing features with 0
    for f in FEATURE_COLUMNS:
        if f not in importance_dict:
            importance_dict[f] = 0.0

    sorted_imp = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
    print("\n  Feature Importance (Gain):")
    for feat, imp in sorted_imp:
        bar = "#" * int(imp * 50)
        print(f"    {feat:25s} {imp:.4f} {bar}")

    # --- Step 5: Save model and metadata ---
    print(f"\n[5/5] Saving model to {MODEL_PATH}")
    joblib.dump(best_model, MODEL_PATH)

    meta = {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "cv_accuracy": round(float(accuracy), 4), # placeholder since no CV
        "cv_std": 0,
        "best_params": params,
        "feature_names": FEATURE_COLUMNS,
        "feature_importance": {k: round(float(v), 4) for k, v in importance_dict.items()},
        "total_samples": len(data),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "training_date": datetime.now().isoformat(),
    }

    with open(MODEL_META_PATH, "w") as f:
        json.dump(meta, f, indent=2)

    print(f"  -> Model metadata saved to {MODEL_META_PATH}")
    print("\n" + "=" * 60)
    print(f"TRAINING COMPLETE — Accuracy: {accuracy:.1%}")
    print("=" * 60)

    return best_model, meta

if __name__ == "__main__":
    train_model(regenerate_data=True)
