from model import AnomalyDetector

training_data = [
    [100, 5, 90, 0, 10, 10, 10],
    [110, 6, 95, 0, 12, 11, 11],
    [95, 4, 85, 0, 9, 10, 10],
    [105, 5, 100, 0, 11, 12, 12],
    [115, 7, 105, 0, 13, 13, 13],
    [98, 5, 88, 0, 10, 9, 10],
    [108, 6, 98, 0, 11, 11, 12],
    [102, 5, 92, 0, 10, 10, 11],
]

detector = AnomalyDetector()

detector.train(training_data)

normal = detector.predict(
    [104, 5, 94, 0, 10, 10, 10]
)

suspicious = detector.predict(
    [1000, 500, 10, 200, 300, 0, 0]
)

print("Normal:", normal)
print("Suspicious:", suspicious)