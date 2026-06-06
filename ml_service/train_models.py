import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor, XGBClassifier
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score, roc_auc_score
from sklearn.calibration import CalibratedClassifierCV


os.makedirs('models', exist_ok=True)

# 1. Train 1st Innings Score Predictor
print("--- Training 1st Innings Score Predictor ---")
try:
    df1 = pd.read_csv('data/processed/dataset_1st_innings.csv')
    
    # Encode categorical variables
    le_venue = LabelEncoder()
    le_bat = LabelEncoder()
    le_bowl = LabelEncoder()
    le_pitch = LabelEncoder()
    le_phase = LabelEncoder()
    
    # Fit across all teams to ensure consistency
    all_teams = pd.concat([df1['batting_team'], df1['bowling_team']]).unique()
    le_bat.fit(all_teams)
    le_bowl.fit(all_teams)
    le_venue.fit(df1['venue'])
    le_pitch.fit(df1['pitch_type'])
    le_phase.fit(df1['phase'])
    
    df1['venue_enc'] = le_venue.transform(df1['venue'])
    df1['bat_enc'] = le_bat.transform(df1['batting_team'])
    df1['bowl_enc'] = le_bowl.transform(df1['bowling_team'])
    df1['pitch_enc'] = le_pitch.transform(df1['pitch_type'])
    df1['phase_enc'] = le_phase.transform(df1['phase'])
    
    features1 = [
        'venue_enc', 'bat_enc', 'bowl_enc', 'pitch_enc', 'overs_completed', 
        'current_score', 'wickets_lost', 'crr', 'phase_enc', 'momentum', 
        'dot_pct', 'bound_pct', 'elo_diff', 'form_bat', 'form_bowl', 'h2h_win_rate'
    ]
    X1 = df1[features1]
    y1 = df1['final_score']
    
    X1_train, X1_test, y1_train, y1_test = train_test_split(X1, y1, test_size=0.2, random_state=42)
    
    model1 = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
    model1.fit(X1_train, y1_train)
    
    preds1 = model1.predict(X1_test)
    print(f"MAE: {mean_absolute_error(y1_test, preds1):.2f}")
    print(f"R2 Score: {r2_score(y1_test, preds1):.4f}")
    
    joblib.dump(model1, 'models/score_predictor.joblib')
    joblib.dump(le_venue, 'models/le_venue.joblib')
    joblib.dump(le_bat, 'models/le_team.joblib')
    joblib.dump(le_pitch, 'models/le_pitch.joblib')
    joblib.dump(le_phase, 'models/le_phase.joblib')
    print("Saved score_predictor model.\n")
except Exception as e:
    print(f"Error training model 1: {e}")


# 2. Train 2nd Innings Win Probability Predictor
print("--- Training 2nd Innings Win Probability Predictor ---")
try:
    df2 = pd.read_csv('data/processed/dataset_2nd_innings.csv')
    
    # Reuse team encoder but fit new venue if needed, though we should just merge or handle unseen.
    # To keep it simple, we'll refit locally or use the same. Let's just create separate encoders for safety
    # or handle unseen labels.
    
    le_venue2 = LabelEncoder()
    le_bat2 = LabelEncoder()
    le_bowl2 = LabelEncoder()
    le_pitch2 = LabelEncoder()
    le_phase2 = LabelEncoder()
    
    all_teams2 = pd.concat([df2['batting_team'], df2['bowling_team']]).unique()
    le_bat2.fit(all_teams2)
    le_bowl2.fit(all_teams2)
    le_venue2.fit(df2['venue'])
    le_pitch2.fit(df2['pitch_type'])
    le_phase2.fit(df2['phase'])
    
    df2['venue_enc'] = le_venue2.transform(df2['venue'])
    df2['bat_enc'] = le_bat2.transform(df2['batting_team'])
    df2['bowl_enc'] = le_bowl2.transform(df2['bowling_team'])
    df2['pitch_enc'] = le_pitch2.transform(df2['pitch_type'])
    df2['phase_enc'] = le_phase2.transform(df2['phase'])
    
    features2 = [
        'venue_enc', 'bat_enc', 'bowl_enc', 'pitch_enc', 'target_score', 
        'overs_completed', 'current_score', 'wickets_lost', 'runs_required', 
        'balls_remaining', 'crr', 'rrr', 'pressure_index', 'phase_enc', 
        'momentum', 'dot_pct', 'bound_pct', 'elo_diff', 'form_bat', 
        'form_bowl', 'h2h_win_rate'
    ]
    X2 = df2[features2]
    y2 = df2['is_win']
    
    X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2, random_state=42)
    
    base_model = XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42, eval_metric='logloss')
    model2 = CalibratedClassifierCV(estimator=base_model, method='isotonic', cv=5)
    model2.fit(X2_train, y2_train)
    
    preds2 = model2.predict(X2_test)
    probs2 = model2.predict_proba(X2_test)[:, 1]
    
    print(f"Accuracy: {accuracy_score(y2_test, preds2):.4f}")
    print(f"ROC-AUC: {roc_auc_score(y2_test, probs2):.4f}")
    
    joblib.dump(model2, 'models/win_predictor.joblib')
    joblib.dump(le_venue2, 'models/le_venue2.joblib')
    joblib.dump(le_bat2, 'models/le_team2.joblib')
    print("Saved win_predictor model.\n")
except Exception as e:
    print(f"Error training model 2: {e}")
