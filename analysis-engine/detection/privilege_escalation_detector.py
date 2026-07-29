from detection.severity_scoring import score_privilege_escalation

def detect_privilege_escalation(entries):
    """
    Detect potential privilege escalation activity.
    """

    alerts = []

    for entry in entries:
        message = entry.get("message", "").lower()

        suspicious_keywords = [
            "sudo",
            "useradd",
            "passwd",
            "su:",
            "session opened for user root"
        ]

        for keyword in suspicious_keywords:
            if keyword in message:
                severity = score_privilege_escalation(message)
                alerts.append(
                    {
                        "alert_type": "PRIVILEGE_ESCALATION",
                        "severity": severity,
                        "description": (
                            f"Potential privilege escalation activity detected: "
                            f"{entry.get('message')}"
                        )
                    }
                )
                break

    return alerts