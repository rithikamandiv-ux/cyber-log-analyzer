def score_brute_force_attempt(failed_count):
    """
    Calculate severity based on failed login count.
    """

    if failed_count >= 10:
        return "critical"

    if failed_count >= 5:
        return "high"

    if failed_count >= 2:
        return "medium"

    return "low"

def score_account_enumeration(invalid_count):
    """
    Severity scoring for account enumeration.
    """

    if invalid_count >= 10:
        return "critical"

    if invalid_count >= 5:
        return "high"

    if invalid_count >= 3:
        return "medium"

    return "low"

def score_privilege_escalation(message):
    """
    Severity scoring for privilege escalation.
    """

    critical_keywords = [
        "useradd",
        "passwd",
        "session opened for user root"
    ]

    high_keywords = [
        "sudo",
        "su:"
    ]

    message = message.lower()

    for keyword in critical_keywords:
        if keyword in message:
            return "critical"

    for keyword in high_keywords:
        if keyword in message:
            return "high"

    return "medium"