"""
parse_auth_logs.py

Parses Linux-style authentication logs and outputs structured JSON.

Usage:
    python parser/parse_auth_logs.py ../sample-auth.log
"""

import sys
import os
import re
import json
from typing import Optional, List, Dict
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from detection.brute_force_detector import detect_brute_force
from detection.account_enumeration_detector import detect_account_enumeration
from detection.privilege_escalation_detector import detect_privilege_escalation
from ml.ml_detector import detect_ml_anomaly
from detection.suspicious_login_success_detector import (detect_suspicious_login_success)
from detection.credential_stuffing_detector import (detect_credential_stuffing)
from detection.persistence_detector import (detect_persistence)
from detection.log_tampering_detector import (detect_log_tampering)


AUTH_LOG_PATTERN = re.compile(
    r"^(?P<timestamp>\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+"
    r"(?P<hostname>\S+)\s+"
    r"(?P<service>\S+?)(?:\[(?P<pid>\d+)\])?:\s+"
    r"(?P<message>.+)$"
)


def extract_ip(message: str) -> Optional[str]:
    ip_match = re.search(r"from\s+(\d+\.\d+\.\d+\.\d+)", message)
    return ip_match.group(1) if ip_match else None


def parse_line(line: str) -> Optional[Dict]:
    match = AUTH_LOG_PATTERN.match(line.strip())

    if not match:
        return None

    data = match.groupdict()
    current_year = datetime.now().year
    timestamp = f"{current_year} {data.get('timestamp')}"
    message = data.get("message", "")

    event_type = "UNKNOWN"
    severity = "info"

    if "Failed password" in message:
        event_type = "FAILED_LOGIN"
        severity = "medium"

    elif "Accepted password" in message or "Accepted publickey" in message:
        event_type = "SUCCESS_LOGIN"
        severity = "info"

    elif "Invalid user" in message:
        event_type = "INVALID_USER"
        severity = "high"

    elif "session opened" in message:
        event_type = "SESSION_OPENED"
        severity = "info"

    elif "session closed" in message:
        event_type = "SESSION_CLOSED"
        severity = "info"

    return {
    "timestamp": timestamp,
    "source_ip": extract_ip(message),
    "dest_ip": None,
    "event_type": event_type,
    "message": message,
    "severity": severity,
    "raw_line": line.strip(),
}


def parse_auth_log(filepath: str) -> List[Dict]:
    records = []

    with open(filepath, "r", encoding="utf-8", errors="ignore") as file:
        for line in file:
            parsed = parse_line(line)
            if parsed:
                records.append(parsed)

    return records


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing file path"}))
        sys.exit(1)

    filepath = sys.argv[1]
    records = parse_auth_log(filepath)

    alerts = []
    alerts.extend(detect_brute_force(records))
    alerts.extend(detect_account_enumeration(records))
    alerts.extend(detect_privilege_escalation(records))
    alerts.extend(detect_ml_anomaly(records))
    alerts.extend(detect_suspicious_login_success(records))
    alerts.extend(detect_credential_stuffing(records))
    alerts.extend(detect_persistence(records))
    alerts.extend(detect_log_tampering(records))

    result = {
    "logs": records,
    "alerts": alerts
    }

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()