"""Feature importance explainer using XGBoost built-in feature importance"""
import joblib
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)


def get_feature_importance(model=None):
    """Get global feature importance from the trained model"""
    if model is None:
        model_path = os.path.join(BASE_DIR, "model.pkl")
        model = joblib.load(model_path)

    from ml_service.features import FEATURE_NAMES

    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
        importance_dict = {}
        for name, imp in zip(FEATURE_NAMES, importance):
            importance_dict[name] = round(float(imp), 4)
    else:
        importance_dict = model.get_score(importance_type='gain')
        total_gain = sum(importance_dict.values())
        if total_gain > 0:
            importance_dict = {k: round(v/total_gain, 4) for k, v in importance_dict.items()}
        for f in FEATURE_NAMES:
            if f not in importance_dict:
                importance_dict[f] = 0.0

    # Sort by importance descending
    sorted_importance = dict(
        sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
    )

    return sorted_importance


def explain_prediction(model, features, feature_names=None):
    """Explain a single prediction by showing per-feature contribution.

    Uses the model's feature importance weighted by the feature values
    to approximate each feature's contribution to this specific prediction.
    """
    if feature_names is None:
        from ml_service.features import FEATURE_NAMES
        feature_names = FEATURE_NAMES

    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
    else:
        importance_dict = model.get_score(importance_type='gain')
        total_gain = sum(importance_dict.values())
        if total_gain > 0:
            importance = np.array([importance_dict.get(f, 0.0)/total_gain for f in feature_names])
        else:
            importance = np.zeros(len(feature_names))

    features_arr = np.array(features)

    # Normalize features to 0-1 range for fair comparison
    feat_min = features_arr.min()
    feat_max = features_arr.max()
    if feat_max > feat_min:
        normalized = (features_arr - feat_min) / (feat_max - feat_min)
    else:
        normalized = np.ones_like(features_arr) * 0.5

    # Weight importance by normalized feature value
    weighted = importance * normalized
    total = weighted.sum()

    if total > 0:
        weighted = weighted / total  # Re-normalize to sum to 1

    result = {}
    for name, w in zip(feature_names, weighted):
        result[name] = round(float(w), 4)

    return dict(sorted(result.items(), key=lambda x: x[1], reverse=True))
