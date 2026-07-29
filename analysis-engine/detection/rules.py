"""
rules.py — Security detection rules.

This module will contain rule-based detection logic for identifying
security threats in parsed log data.

TODO:
    - Implement brute force detection (N failed logins within time window)
    - Implement impossible travel detection
    - Implement privilege escalation detection
    - Implement anomalous login hours detection
    - Add configurable thresholds
"""

from typing import Any

import pandas as pd


def detect_brute_force(df: pd.DataFrame, threshold: int = 5, window_minutes: int = 10) -> list[dict[str, Any]]:
    """
    Detect brute force login attempts.

    Args:
        df: DataFrame with parsed log entries.
        threshold: Number of failed attempts to trigger alert.
        window_minutes: Time window in minutes.

    Returns:
        List of alert dictionaries.

    TODO: Implement brute force detection logic.
    """
    alerts: list[dict[str, Any]] = []
    # TODO: Group by source_ip, check failed_login count within rolling window
    return alerts


def detect_invalid_users(df: pd.DataFrame) -> list[dict[str, Any]]:
    """
    Detect login attempts with invalid usernames.

    Args:
        df: DataFrame with parsed log entries.

    Returns:
        List of alert dictionaries.

    TODO: Implement invalid user detection logic.
    """
    alerts: list[dict[str, Any]] = []
    # TODO: Filter for event_type == 'invalid_user', aggregate by source_ip
    return alerts
