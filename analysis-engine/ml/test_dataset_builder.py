from dataset_builder import build_dataset

batch1 = [
    {"event_type": "FAILED_LOGIN", "source_ip": "1.1.1.1"},
    {"event_type": "FAILED_LOGIN", "source_ip": "1.1.1.1"},
    {"event_type": "SUCCESS_LOGIN", "source_ip": "2.2.2.2"},
]

batch2 = [
    {"event_type": "SUCCESS_LOGIN", "source_ip": "5.5.5.5"},
    {"event_type": "SUCCESS_LOGIN", "source_ip": "6.6.6.6"},
]

build_dataset(
    [batch1, batch2]
)