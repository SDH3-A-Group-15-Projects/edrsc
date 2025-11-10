from flask import Flask, request, jsonify
import joblib
import os
from utils.features_extraction import extract_speech_features

app = Flask(__name__)

# Dynamically find base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

#Correct absolute paths
model_path = os.path.join(BASE_DIR, "Model", "model", "risk_model.pkl")
scaler_path = os.path.join(BASE_DIR, "Model", "model", "scaler.pkl")

# Load model and scaler
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

@app.route("/predict", methods=["POST"], )
def predict():
    data = request.json

    try:
        age = data["age"]
        sleep_hours = data["sleep_hours"]
        memory_score = data["memory_score"]
        speech_text = data["speech_text"]

        # Extract speech features
        word_count, avg_word_len, filler_count = extract_speech_features(speech_text)

        # Prepare and scale input
        X_new = [[age, sleep_hours, memory_score,0,0,0]]
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
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    print("Received JSON:", data, flush=True)
    print("Returning:", result, flush=True)



if __name__ == "__main__":
    app.run(debug=True)
