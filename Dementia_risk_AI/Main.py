import os
import pandas as pd
import joblib
import whisper
from utils.features_extraction import extract_speech_features

# ---------------- LOAD MODELS ---------------- #
print("Loading Whisper model...")
whisper_model = whisper.load_model("medium")

model = joblib.load("Model/model/risk_model.pkl")
scaler = joblib.load("Model/model/scaler.pkl")

# ---------------- LOAD DATASET ---------------- #
data_path = "Model/data/dementia_risk_data.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File not found: {data_path}")

df = pd.read_csv(data_path)

random_patient = df.sample(1).iloc[0]

print("Randomly selected patient data:")
print(random_patient)
print("\n" + "-" * 60)

# ---------------- SPEECH FEATURE EXTRACTION ---------------- #
word_count, avg_word_len, filler_count = 0, 0, 0
audio_path = "Audio1.m4a"

if os.path.exists(audio_path):
    print(f"\n🎙 Transcribing audio: {audio_path}")

    try:
        initial_prompt = (
            "Um, uh, like, you know, so, well, actually, basically, literally"
        )

        result = whisper_model.transcribe(
            audio_path,
            initial_prompt=initial_prompt,
            word_timestamps=True
        )

        transcribed_text = result["text"]

        print("\n Transcribed Text:")
        print(transcribed_text)
        print("\n" + "=" * 60)

        word_count, avg_word_len, filler_count = extract_speech_features(transcribed_text)

        print(" Speech Analysis:")
        print(f"   Total words: {word_count}")
        print(f"   Avg word length: {avg_word_len:.2f}")
        print(f"   Filler count: {filler_count}")

    except Exception as e:
        print(f" Speech processing error: {e}")
else:
    print("\n⚠ Audio file not found. Using zero speech features.")
# ---------------- FEATURE NAMES ---------------- #
feature_names = [
    "age",
    "sleep_hours",
    "memory_score",
    "word_count",
    "avg_word_len",
    "filler_count"
]
# ===================== GENERAL RISK ===================== #
X_general = pd.DataFrame([[
    random_patient["age"],
    random_patient["sleep_hours"],
    0,   # memory_score
    0,   # word_count
    0,   # avg_word_len
    0    # filler_count
]], columns=feature_names)

X_general_scaled = scaler.transform(X_general)
general_pred = model.predict(X_general_scaled)[0]
general_prob = model.predict_proba(X_general_scaled)[0]

general_label = "High Risk" if general_pred == 1 else "Low Risk"
general_probability = (
    general_prob[1] * 100 if general_pred == 1 else general_prob[0] * 100
)
# # ===================== SPEECH RISK ===================== #
# X_speech = pd.DataFrame([[
#     0,   # age
#     0,   # sleep_hours
#     0,   # memory_score
#     word_count,
#     avg_word_len,
#     filler_count
# ]], columns=feature_names)
#
# X_speech_scaled = scaler.transform(X_speech)
# speech_pred = model.predict(X_speech_scaled)[0]
# speech_prob = model.predict_proba(X_speech_scaled)[0]
#
# speech_label = "High Risk" if speech_pred == 1 else "Low Risk"
# speech_probability = (
#     speech_prob[1] * 100 if speech_pred == 1 else speech_prob[0] * 100
# )
# # ---------------- RESULTS ---------------- #
# print("\n" + "=" * 60)
# print("📈 Prediction Results")
# print("=" * 60)
#
# print(f" General Risk (Age + Sleep): {general_label}")
# print(f"   Probability: {general_probability:.2f}%")
#
# print(f"\n Speech Risk (Speech-to-Text): {speech_label}")
# print(f"   Probability: {speech_probability:.2f}%")
#
# print("=" * 60)

# ===================== COMBINED RISK ===================== #
X_combined = pd.DataFrame([[
    random_patient["age"],
    random_patient.get("sleep_hours", 0),
    random_patient.get("memory_score", 0),
    word_count,
    avg_word_len,
    filler_count
]], columns=feature_names)

X_combined_scaled = scaler.transform(X_combined)
combined_pred = model.predict(X_combined_scaled)[0]
combined_prob = model.predict_proba(X_combined_scaled)[0][1] * 100
combined_label = "High Risk" if combined_pred == 1 else "Low Risk"

# ---------------- RESULTS ---------------- #
print("\n" + "=" * 60)
print("📈 Prediction Results")
print("=" * 60)

print(f" Combined Risk (Questionnaire + Speech): {combined_label}")
print(f"   Probability: {combined_prob:.2f}%")

print("=" * 60)
