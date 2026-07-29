import csv
from feature_extractor import extract_features

def build_dataset(log_batches, output_file="dataset.csv"):
    """
    Convert multiple parsed log batches into
    a machine-learning dataset.
    """

    rows = []

    for logs in log_batches:
        features = extract_features(logs)
        rows.append(features)

    if not rows:
        print("No data available.")
        return

    fieldnames = rows[0].keys()

    with open(
        output_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as csvfile:
        writer = csv.DictWriter(
            csvfile,
            fieldnames=fieldnames
        )

        writer.writeheader()

        for row in rows:
            writer.writerow(row)

    print(
        f"Dataset saved to {output_file}"
    )