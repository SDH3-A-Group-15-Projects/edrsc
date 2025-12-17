from flask import Flask, request, jsonify
import joblib
import os
import pandas as pd
from flask_cors import CORS
from werkzeug.utils import secure_filename
import whisper

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Whisper model once at startup
print("🎙 Loading Whisper model (this may take a while)...")
whisper_model = whisper.load_model("small") # medium takes too long to load
print("🎙 Whisper model loaded.")


# Dynamically find base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Correct absolute paths
model_path = os.path.join(BASE_DIR, "Model", "model", "risk_model.pkl")
scaler_path = os.path.join(BASE_DIR, "Model", "model", "scaler.pkl")

# Load model and scaler
try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    print("✓ Model and scaler loaded successfully!")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None
    scaler = None


def extract_speech_features(text):
    """Extract features from speech text"""
    import re

    # Clean up text
    words = re.findall(r"\b\w+\b", text.lower())

    # Count total words
    word_count = len(words)

    # Calculate average word length
    avg_word_len = sum(len(w) for w in words) / word_count if word_count > 0 else 0

    # Count filler words
    fillers = {"um", "uh", "like", "you", "know", "so", "well", "actually", "basically", "literally"}
    filler_count = sum(1 for w in words if w in fillers)

    return word_count, avg_word_len, filler_count


@app.route("/", methods=["GET"])
def home():
    """Root endpoint - confirms API is running"""
    return jsonify({
        "status": "online",
        "message": "NeuroMind Flask API is running!",
        "endpoints": {
            "/": "GET - API status",
            "/predict": "POST - Get dementia risk prediction",
            "/health": "GET - Health check"
        }
    })


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    })


@app.route("/predict", methods=["POST"])
def predict():
    """Predict dementia risk from patient data"""

    # Check if model is loaded
    if model is None or scaler is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Get JSON data from request
        data = request.json
        print(f"📥 Received data: {data}")

        # Extract required fields with defaults
        age = float(data.get("age", 0))
        sleep_hours = float(data.get("sleep_hours", 0))
        memory_score = float(data.get("memory_score", 0))
        speech_text = data.get("speech_text", "")

        # Validate inputs
        if age <= 0 or sleep_hours <= 0 or memory_score < 0:
            return jsonify({"error": "Invalid input values"}), 400

        # Extract speech features
        word_count, avg_word_len, filler_count = extract_speech_features(speech_text)

        print(f"📊 Extracted features:")
        print(f"   Age: {age}, Sleep: {sleep_hours}h, Memory: {memory_score}")
        print(f"   Words: {word_count}, Avg length: {avg_word_len:.2f}, Fillers: {filler_count}")

        # Prepare features for model
        feature_names = ["age", "sleep_hours", "memory_score", "word_count", "avg_word_len", "filler_count"]
        X_new = pd.DataFrame(
            [[age, sleep_hours, memory_score, word_count, avg_word_len, filler_count]],
            columns=feature_names
        )

        # Scale features
        X_scaled = scaler.transform(X_new)

        # Make prediction
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0]

        # Prepare result
        result = {
            "success": True,
            "prediction": "High Risk" if prediction == 1 else "Low Risk",
            "risk_score": int(prediction),
            "probability": {
                "low_risk": round(float(probability[0] * 100), 2),
                "high_risk": round(float(probability[1] * 100), 2)
            },
            "features": {
                "age": age,
                "sleep_hours": sleep_hours,
                "memory_score": memory_score,
                "word_count": word_count,
                "avg_word_length": round(avg_word_len, 2),
                "filler_count": filler_count
            }
        }

        print(f"✓ Prediction: {result['prediction']} ({result['probability']['high_risk']}%)")
        return jsonify(result)

    except KeyError as e:
        error_msg = f"Missing required field: {str(e)}"
        print(f"✗ {error_msg}")
        return jsonify({"error": error_msg}), 400

    except Exception as e:
        error_msg = f"Prediction error: {str(e)}"
        print(f"✗ {error_msg}")
        return jsonify({"error": error_msg}), 500

@app.route("/upload-audio", methods=["POST"])
def upload_audio():
    """
    Receive an uploaded audio file from the Android app,
    run Whisper on it, and return real analysis.
    """

    # The field name here MUST match the part name in Android: "audio"
    if "audio" not in request.files:
        return jsonify({"error": "No audio file part named 'audio'"}), 400

    audio_file = request.files["audio"]

    if audio_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save the file
    os.makedirs("uploads", exist_ok=True)
    filename = secure_filename(audio_file.filename)
    save_path = os.path.join("uploads", filename)
    audio_file.save(save_path)

    print(f"✓ Received audio file: {filename}, saved to {save_path}")
    try:
        # Transcribe with Whisper
        # language set to english
        result = whisper_model.transcribe(save_path, language="en")

        transcript = (result.get("text") or "").strip()
        print(f"Whisper transcript (first 100 chars): {transcript[:100]}")

    except Exception as e:
        print(f"✗ Whisper error: {e}")
        return jsonify({"error": f"Failed to transcribe audio: {e}"}), 500

    # Build a simple summary: first ~40 words
    if transcript:
        words = transcript.split()
        summary_words = words[:40]
        summary = " ".join(summary_words)
        if len(words) > 40:
            summary += "..."
    else:
        summary = ""

    # Simple "score" example
    word_count = len(transcript.split())
    score = min(word_count / 100.0, 1.0)  # 0.0–1.0 based on length

    return jsonify({
        "transcript": transcript,
        "summary": summary,
        "score": score
    }), 200


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting NeuroMind Flask API")
    print("=" * 60)
    print(f"📍 Server: http://0.0.0.0:5000")
    print(f"📍 Local: http://localhost:5000")
    print(f"📍 Android Emulator: http://10.0.2.2:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)