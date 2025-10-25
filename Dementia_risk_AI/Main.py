import os

import pandas as pd
import joblib
from utils.features_extraction import extract_speech_features

# Load model and scaler
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

# Prepare features
X_new = [[
    random_patient["age"],
    random_patient["sleep_hours"],
    random_patient["memory_score"]
]]

# Scale and predict
X_new_scaled = scaler.transform(X_new)
prediction = model.predict(X_new_scaled)
probability = model.predict_proba(X_new_scaled)[0][prediction[0]]
pred_percent = f"{probability * 100:.2f}%"

print("\n🧠 Prediction Results:")
print(f"Prediction: {'High Risk' if prediction[0] == 1 else 'Low Risk'}")
print(f"Probability: {pred_percent}")
