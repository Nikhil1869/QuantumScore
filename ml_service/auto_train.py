"""Auto-retrain the model: regenerates training data and retrains with evaluation"""
import os
import sys

BASE_DIR = os.path.dirname(__file__)

# Add project root to path
project_root = os.path.join(BASE_DIR, "..")
if project_root not in sys.path:
    sys.path.insert(0, project_root)


def auto_retrain():
    """Regenerate data, retrain model, and return updated metadata"""
    from ml_service.train import train_model

    print("=" * 60)
    print("AUTO-RETRAIN: Starting automated model retraining...")
    print("=" * 60)

    model, meta = train_model(regenerate_data=True)

    print(f"\nAuto-retrain complete. New accuracy: {meta['accuracy']:.1%}")
    return meta


if __name__ == "__main__":
    auto_retrain()
