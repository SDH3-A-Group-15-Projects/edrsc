from flask import Flask, request, jsonify
import json
import joblib
import os
from utils.features_extraction import extract_speech_features
import pandas as pd

app = Flask(__name__)

# Dynamically find base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Correct absolute paths
model_path = os.path.join(BASE_DIR, "Model", "model", "risk_model.pkl")
scaler_path = os.path.join(BASE_DIR, "Model", "model", "scaler.pkl")

# Load model and scaler
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

# ===== Root endpoint to avoid 404 =====
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API is running!"})

@app.route("/voice", methods=["POST"])
def voice():
    voice = request.files.get("audioFile")
    questionnaire = request.form.get("questionnaire")

    if not voice or not questionnaire:
        return jsonify({"error": "Missing audioFile or questionnaire"}), 400
    
    try:
        data = json.loads(questionnaire)

        age = data.get("age")
        sleep_hours = data.get("sleep_hours")
        is_on_medication = data.get("is_on_medication")
        smokes = data.get("smokes")
        is_diabetic = data.get("is_diabetic")
        drinks_alcohol = data.get("drinks_alcohol")
        has_depression = data.get("has_depression")
        is_physically_active = data.get("is_physically_active")
        has_healthy_diet = data.get("has_healthy_diet")
        is_mentally_active = data.get("is_mentally_active")
        has_family_history_of_dementia = data.get("has_family_history_of_dementia")

        return jsonify({
            "questionnairecalculatedRisk": 50,
            "voiceCalculatedRisk": 30
        })

    except json.JSONDecodeError:
        return jsonify({"error": "The metadata field was not valid JSON"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    print("Received JSON:", data, flush=True)  # moved before return

    try:
        age = data["age"]
        sleep_hours = data["sleep_hours"]
        memory_score = data["memory_score"]
        speech_text = data["speech_text"]

        # Extract speech features
        word_count, avg_word_len, filler_count = extract_speech_features(speech_text)

        feature_names = ["age", "sleep_hours", "memory_score", "word_count", "avg_word_len", "filler_count"]
        X_new = pd.DataFrame([[age, sleep_hours, memory_score, word_count, avg_word_len, filler_count]],
                             columns=feature_names)
        X_scaled = scaler.transform(X_new)

        # Predict
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0]

        result = {
            "prediction": "High Risk" if prediction == 1 else "Low Risk",
            "probability": {
                "Low Risk": round(probability[0] * 100, 2),
                "High Risk": round(probability[1] * 100, 2)
            }
        }

        print("Returning:", result, flush=True)
        return jsonify(result)

    except Exception as e:
        print("Error:", str(e), flush=True)
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    print("Starting Flask API on 0.0.0.0:5000", flush=True)
    app.run(host="0.0.0.0", port=5000, debug=True)
