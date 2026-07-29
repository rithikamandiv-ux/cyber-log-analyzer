from ml.feature_extractor import extract_features
from ml.model import AnomalyDetector


detector = AnomalyDetector()

# Temporary training dataset
# Later this will come from historical logs
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

detector = AnomalyDetector(
    model_path=MODEL_PATH
)

detector.load()


def detect_ml_anomaly(entries):
    """
    Run anomaly detection on parsed log entries.
    """

    features = extract_features(entries)

    feature_vector = [
    features["total_events"],
    features["failed_logins"],
    features["successful_logins"],
    features["invalid_users"],
    features["unique_ips"],
    features["session_opened"],
    features["session_closed"],

    features["failed_login_ratio"],
    features["success_ratio"],

    features["privilege_escalation_count"],
    features["persistence_count"],
    features["log_tampering_count"],
]
    prediction = detector.predict(feature_vector)
    severity = determine_severity(prediction["score"])

    if prediction["is_anomaly"]:
        return [
            {
                "alert_type": "ML_ANOMALY",
                "severity": severity,
                "description": (
                    f"Machine learning model detected anomalous behaviour "
                    f"(score={prediction['score']:.4f})"
                ),
            }
        ]

    return []

def determine_severity(score):
    if score < -0.15:
        return "critical"

    if score < -0.05:
        return "high"

    return "medium"