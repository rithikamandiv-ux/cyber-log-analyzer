import csv
import psycopg2

from feature_extractor import extract_features


DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "cyber_log_analyzer",
    "user": "rithikamandiv",
}


def fetch_log_batches():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id
        FROM log_files
        WHERE status = 'completed'
        ORDER BY id
    """)

    log_file_ids = [row[0] for row in cursor.fetchall()]

    batches = []

    for log_file_id in log_file_ids:
        cursor.execute("""
            SELECT
                event_type,
                source_ip
            FROM logs
            WHERE log_file_id = %s
        """, (log_file_id,))

        rows = cursor.fetchall()

        entries = []

        for event_type, source_ip in rows:
            entries.append(
                {
                    "event_type": event_type,
                    "source_ip": source_ip,
                }
            )

        batches.append(entries)

    cursor.close()
    conn.close()

    return batches


def build_dataset(output_file="dataset.csv"):
    batches = fetch_log_batches()

    rows = []

    for batch in batches:
        features = extract_features(batch)
        rows.append(features)

    if not rows:
        print("No completed log files found.")
        return

    with open(
        output_file,
        "w",
        newline="",
        encoding="utf-8"
    ) as csvfile:

        writer = csv.DictWriter(
            csvfile,
            fieldnames=rows[0].keys()
        )

        writer.writeheader()

        for row in rows:
            writer.writerow(row)

    print(
        f"Dataset exported successfully to {output_file}"
    )


if __name__ == "__main__":
    build_dataset()