from collections import Counter


def extract_features(entries):
    """
    Convert parsed log entries into ML-friendly numerical features.
    One batch of log entries becomes one feature dictionary.
    """

    event_counter = Counter()
    unique_ips = set()

    privilege_escalation_count = 0
    persistence_count = 0
    log_tampering_count = 0

    for entry in entries:
        event_type = entry.get("event_type")
        source_ip = entry.get("source_ip")
        message = entry.get("message", "").lower()

        if event_type:
            event_counter[event_type] += 1

        if source_ip:
            unique_ips.add(source_ip)

        if (
            "sudo" in message
            or "su:" in message
            or "useradd" in message
            or "passwd" in message
            or "session opened for user root" in message
        ):
            privilege_escalation_count += 1

        if (
            "useradd" in message
            or "adduser" in message
            or "authorized_keys" in message
            or "ssh-rsa" in message
            or "crontab" in message
            or "systemctl enable" in message
        ):
            persistence_count += 1

        if (
            "rm /var/log" in message
            or "truncate" in message
            or "auditd" in message
            or "systemctl stop rsyslog" in message
            or "service rsyslog stop" in message
            or "journalctl --vacuum" in message
            or "logging disabled" in message
        ):
            log_tampering_count += 1

    total_events = len(entries)
    failed_logins = event_counter.get("FAILED_LOGIN", 0)
    successful_logins = event_counter.get("SUCCESS_LOGIN", 0)
    invalid_users = event_counter.get("INVALID_USER", 0)
    session_opened = event_counter.get("SESSION_OPENED", 0)
    session_closed = event_counter.get("SESSION_CLOSED", 0)

    failed_login_ratio = failed_logins / total_events if total_events else 0
    success_ratio = successful_logins / total_events if total_events else 0

    return {
        "total_events": total_events,
        "failed_logins": failed_logins,
        "successful_logins": successful_logins,
        "invalid_users": invalid_users,
        "session_opened": session_opened,
        "session_closed": session_closed,
        "unique_ips": len(unique_ips),
        "failed_login_ratio": failed_login_ratio,
        "success_ratio": success_ratio,
        "privilege_escalation_count": privilege_escalation_count,
        "persistence_count": persistence_count,
        "log_tampering_count": log_tampering_count,
    }