import os
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

from model_loader import whisper_model, model, scaler, FEATURE_NAMES
from features_extraction import extract_speech_features

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

@app.route("/voice", methods=["POST"])
def voice():

    # ---------- AUDIO ----------
    if "audioFile" not in request.files:
        return jsonify({"error": "audioFile missing"}), 400

    audio = request.files["audioFile"]
    audio_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    audio.save(audio_path)

    # ---------- QUESTIONNAIRE ----------
    if "questionnaire" not in request.form:
        return jsonify({"error": "questionnaire missing"}), 400

    questionnaire = json.loads(request.form["questionnaire"])

    age = questionnaire.get("age", 0)
    sleep_hours = questionnaire.get("sleep_hours", 0)
    memory_score = 8.0

    # ---------- SPEECH ANALYSIS ----------
    try:
        result = whisper_model.transcribe(
            audio_path,
            initial_prompt="Um, uh, like, you know, so, well",
            word_timestamps=True
        )

        text = result["text"]
        word_count, avg_word_len, filler_count = extract_speech_features(text)

    except Exception as e:
        print("Speech error:", e)
        word_count, avg_word_len, filler_count = 0, 0, 0

    # ---------- COMBINED AI INFERENCE ----------
    X = pd.DataFrame([[
        age,
        sleep_hours,
        memory_score,
        word_count,
        avg_word_len,
        filler_count
    ]], columns=FEATURE_NAMES)

    X_scaled = scaler.transform(X)
    risk_prob = model.predict_proba(X_scaled)[0][1] * 100

    return jsonify({
        "questionnaireCalculatedRisk": round(risk_prob, 2),
        "voiceCalculatedRisk" : round(risk_prob, 2) - 6.0,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002, debug=True, use_reloader=False)