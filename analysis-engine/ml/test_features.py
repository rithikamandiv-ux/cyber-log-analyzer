from feature_extractor import extract_features

sample = [
    {"event_type": "FAILED_LOGIN", "source_ip": "1.1.1.1"},
    {"event_type": "FAILED_LOGIN", "source_ip": "1.1.1.1"},
    {"event_type": "SUCCESS_LOGIN", "source_ip": "2.2.2.2"},
]

print(extract_features(sample))