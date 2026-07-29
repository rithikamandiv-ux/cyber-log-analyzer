import json
import os
from datetime import datetime


def append_training_history(
    sample_count,
    model_version
):
    history_file = "training_history.json"

    if os.path.exists(history_file):
        with open(history_file, "r") as file:
            history = json.load(file)
    else:
        history = []

    history.append(
        {
            "trained_at": datetime.now().isoformat(),
            "samples": sample_count,
            "version": model_version,
        }
    )

    with open(history_file, "w") as file:
        json.dump(
            history,
            file,
            indent=4
        )