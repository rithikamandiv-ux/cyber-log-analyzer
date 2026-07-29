from collections import defaultdict
from detection.severity_scoring import score_brute_force_attempt


def detect_brute_force(entries):
    """
    Detect repeated failed login attempts.

    Rule:
    Same IP >= 2 FAILED_LOGIN events.
    Severity is calculated by failed attempt count.
    """

    failed_counts = defaultdict(int)

    for entry in entries:
        if entry.get("event_type") == "FAILED_LOGIN":
            ip = entry.get("source_ip")

            if ip:
                failed_counts[ip] += 1

    alerts = []

    for ip, count in failed_counts.items():
        if count >= 2:
            severity = score_brute_force_attempt(count)

            alerts.append(
                {
                    "alert_type": "BRUTE_FORCE_ATTEMPT",
                    "severity": severity,
                    "description": f"IP {ip} generated {count} failed login attempts.",
                }
            )

    return alerts