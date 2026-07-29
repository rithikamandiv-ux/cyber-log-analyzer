from collections import defaultdict
from detection.severity_scoring import score_account_enumeration

def detect_account_enumeration(entries):
    """
    Detect repeated invalid-user attempts.

    Rule:
    Same IP generates >= 3 INVALID_USER events.
    """

    invalid_counts = defaultdict(int)

    for entry in entries:
        if entry.get("event_type") == "INVALID_USER":
            ip = entry.get("source_ip")

            if ip:
                invalid_counts[ip] += 1

    alerts = []

    for ip, count in invalid_counts.items():
        if count >= 3:
            severity = score_account_enumeration(count)

            alerts.append(
                {
                    "alert_type": "ACCOUNT_ENUMERATION",
                    "severity": severity,
                    "description": f"IP {ip} attempted {count} invalid usernames."
                }
            )

    return alerts