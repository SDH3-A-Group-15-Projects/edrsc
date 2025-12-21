import joblib
import whisper

print("Loading Whisper model...")
whisper_model = whisper.load_model("small")

print("Loading ML model + scaler...")
model = joblib.load("../Model/model/risk_model.pkl")
scaler = joblib.load("../Model/model/scaler.pkl")

FEATURE_NAMES = [
    "age",
    "sleep_hours",
    "memory_score",
    "word_count",
    "avg_word_len",
    "filler_count"
]