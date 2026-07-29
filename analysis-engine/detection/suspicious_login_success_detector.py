from collections import defaultdict


def detect_suspicious_login_success(entries):
    """
    Detect successful login after repeated failures.

    Rule:
    Same IP:
        >= 2 FAILED_LOGIN
        followed by SUCCESS_LOGIN
    """

    failed_counts = defaultdict(int)

    alerts = []

    for entry in entries:
        ip = entry.get("source_ip")
        event_type = entry.get("event_type")

        if not ip:
            continue

        if event_type == "FAILED_LOGIN":
            failed_counts[ip] += 1

        elif event_type == "SUCCESS_LOGIN":
            if failed_counts[ip] >= 2:
                alerts.append(
                    {
                        "alert_type": "SUSPICIOUS_LOGIN_SUCCESS",
                        "severity": "high",
                        "description":
                            f"IP {ip} successfully logged in after "
                            f"{failed_counts[ip]} failed attempts."
                    }
                )

    return alerts