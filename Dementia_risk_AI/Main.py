import os
import pandas as pd
import joblib
import whisper
from utils.features_extraction import extract_speech_features

# Load Whisper model (you can use 'tiny', 'base', 'small', 'medium', 'large')
print("Loading Whisper model..")

whisper_model = whisper.load_model("medium")  #small or medium model for accuracy

# Load risk prediction model and scaler
model = joblib.load("Model/model/risk_model.pkl")
scaler = joblib.load("Model/model/scaler.pkl")

# Load the cleaned dataset
data_path = "Model/data/dementia_risk_data.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File not found: {data_path}")

df = pd.read_csv(data_path)

# Randomly select a patient
random_patient = df.sample(1).iloc[0]

print("Randomly selected patient data:")
print(random_patient)
print("\n" + "-" * 50)

# Initialize speech features with defaults
word_count, avg_word_len, filler_count = 0, 0, 0

# Path to audio file - CHECK FOR YOUR AUDIO FILE
audio_path = "Audio1.m4a"  # Your actual audio file

if os.path.exists(audio_path):
    print(f"\n Transcribing audio from: {audio_path}")

    try:
        # Transcribe audio using Whisper with prompt to preserve filler words
        initial_prompt = "Um, uh, like, you know, so, well, actually, basically, literally, i dont know"
        result = whisper_model.transcribe(
            audio_path,
            initial_prompt=initial_prompt,
            word_timestamps=True
        )
        transcribed_text = result["text"]

        print(f"\nTranscribed Text:\n{transcribed_text}")
        print("\n" + "=" * 50)

        # Extract speech features
        word_count, avg_word_len, filler_count = extract_speech_features(transcribed_text)

        print(f"\n Speech Analysis:")
        print(f"Total words: {word_count}")
        print(f"Average word length: {avg_word_len:.2f}")
        print(f"Filler word count: {filler_count}")
        print(f"Filler word ratio: {(filler_count / word_count * 100):.2f}%" if word_count > 0 else "N/A")
    except Exception as e:
        print(f"\n Error processing audio: {e}")
        print("Using default speech features (zeros)...")
else:
    print(f"\n Audio file not found: {audio_path}")
    print("Using default speech features (zeros) for prediction...")

print("\n" + "=" * 50)

# Prepare features (now including speech features)
X_new = [[
    random_patient["age"],
    random_patient["sleep_hours"],
    random_patient["memory_score"],
    word_count,
    avg_word_len,
    filler_count
]]

# Scale and predict
X_new_scaled = scaler.transform(X_new)
prediction = model.predict(X_new_scaled)
probabilities = model.predict_proba(X_new_scaled)[0]


# probabilities[0] = probability of Low Risk (class 0)
# probabilities[1] = probability of High Risk (class 1)
risk_label = 'High Risk' if prediction[0] == 1 else 'Low Risk'
risk_probability = probabilities[1] * 100 if prediction[0] == 1 else probabilities[0] * 100

print("\n Prediction Results:")
print(f"Prediction: {risk_label}")
print(f"{risk_label} Probability: {risk_probability:.2f}%")