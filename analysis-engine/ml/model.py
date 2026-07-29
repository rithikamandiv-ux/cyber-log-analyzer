import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest


class AnomalyDetector:
    def __init__(self, model_path="model.pkl"):
        self.model_path = model_path
        self.model = IsolationForest(
            contamination=0.25,
            random_state=42
        )

    def train(self, feature_vectors):
        X = np.array(feature_vectors)
        self.model.fit(X)

    def predict(self, feature_vector):
        X = np.array([feature_vector])

        prediction = self.model.predict(X)[0]
        score = self.model.decision_function(X)[0]

        return {
            "is_anomaly": bool(prediction == -1),
            "score": float(score)
        }

    def save(self):
        directory = os.path.dirname(self.model_path)

        if directory:
            os.makedirs(directory, exist_ok=True)

        joblib.dump(self.model, self.model_path)

    def load(self):
        self.model = joblib.load(self.model_path)