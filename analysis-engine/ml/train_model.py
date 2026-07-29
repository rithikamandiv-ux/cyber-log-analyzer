import csv
from model import AnomalyDetector
from model_metadata import save_metadata
from training_history import append_training_history


def load_dataset(dataset_path="dataset.csv"):
    feature_vectors = []

    with open(dataset_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            feature_vectors.append([
                int(row["total_events"]),
                int(row["failed_logins"]),
                int(row["successful_logins"]),
                int(row["invalid_users"]),
                int(row["unique_ips"]),
                int(row["session_opened"]),
                int(row["session_closed"]),
                float(row["failed_login_ratio"]),
                float(row["success_ratio"]),
                int(row["privilege_escalation_count"]),
                int(row["persistence_count"]),
                int(row["log_tampering_count"]),
            ])

    return feature_vectors


def main():
    training_data = load_dataset()

    detector = AnomalyDetector(model_path="model.pkl")
    detector.train(training_data)
    detector.save()

    version = save_metadata(sample_count=len(training_data))

    append_training_history(
        sample_count=len(training_data),
        model_version=version
    )

    print(f"Model trained using {len(training_data)} samples.")
    print("Model saved to model.pkl")


if __name__ == "__main__":
    main()