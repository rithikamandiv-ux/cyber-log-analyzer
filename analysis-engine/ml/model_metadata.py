import json
import os
from datetime import datetime


def get_next_version():
    metadata_file = "model_metadata.json"

    if not os.path.exists(metadata_file):
        return "1.0"

    with open(metadata_file, "r") as file:
        metadata = json.load(file)

    current = metadata.get(
        "model_version",
        "1.0"
    )

    major, minor = current.split(".")
    minor = int(minor) + 1

    return f"{major}.{minor}"


def save_metadata(sample_count):
    version = get_next_version()

    metadata = {
        "trained_at": datetime.now().isoformat(),
        "training_samples": sample_count,
        "model_version": version,
    }

    with open(
        "model_metadata.json",
        "w"
    ) as file:
        json.dump(
            metadata,
            file,
            indent=4
        )

    return version