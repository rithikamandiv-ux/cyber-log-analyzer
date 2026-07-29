from collections import defaultdict


def detect_credential_stuffing(entries):
    """
    Detect account spraying / credential stuffing.

    Rule:
    Same IP generates >= 3 INVALID_USER events.
    """

    invalid_user_counts = defaultdict(int)

    for entry in entries:
        if entry.get("event_type") == "INVALID_USER":
            ip = entry.get("source_ip")

            if ip:
                invalid_user_counts[ip] += 1

    alerts = []

    for ip, count in invalid_user_counts.items():
        if count >= 3:
            alerts.append(
                {
                    "alert_type": "CREDENTIAL_STUFFING",
                    "severity": "high",
                    "description":
                        f"IP {ip} attempted {count} invalid accounts."
                }
            )

    return alerts