from export_dataset import build_dataset
from train_model import main as train_model


def main():
    print("================================")
    print("Exporting dataset...")
    print("================================")

    build_dataset()

    print("\n================================")
    print("Training model...")
    print("================================")

    train_model()

    print("\n================================")
    print("Retraining complete.")
    print("================================")


if __name__ == "__main__":
    main()