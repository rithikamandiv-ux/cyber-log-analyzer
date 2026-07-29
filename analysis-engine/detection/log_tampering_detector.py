TAMPERING_KEYWORDS = [
    "rm /var/log",
    "truncate",
    "auditd",
    "systemctl stop rsyslog",
    "service rsyslog stop",
    "journalctl --vacuum",
    "logging disabled",
]


def detect_log_tampering(entries):
    alerts = []

    for entry in entries:
        message = entry.get("message", "").lower()

        for keyword in TAMPERING_KEYWORDS:
            if keyword in message:
                alerts.append(
                    {
                        "alert_type": "LOG_TAMPERING",
                        "severity": "critical",
                        "description":
                            f"Potential log tampering detected: {entry['message']}"
                    }
                )
                break

    return alerts