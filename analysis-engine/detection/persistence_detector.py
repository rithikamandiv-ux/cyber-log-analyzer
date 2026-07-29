PERSISTENCE_KEYWORDS = [
    "useradd",
    "adduser",
    "crontab",
    "authorized_keys",
    "ssh-rsa",
    "systemctl enable",
]


def detect_persistence(entries):
    alerts = []

    for entry in entries:
        message = entry.get("message", "").lower()

        for keyword in PERSISTENCE_KEYWORDS:
            if keyword in message:
                alerts.append(
                    {
                        "alert_type": "PERSISTENCE_DETECTED",
                        "severity": "critical",
                        "description":
                            f"Persistence activity detected: {entry['message']}"
                    }
                )

                break

    return alerts