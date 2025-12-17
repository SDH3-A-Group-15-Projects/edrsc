package com.example.neuromind


data class PredictionRequest(
    val age: Double,
    val sleep_hours: Double,
    val memory_score: Double,
    val speech_text: String
)

data class PredictionResponse(
    val success: Boolean,
    val prediction: String,
    val risk_score: Int,
    val probability: Probability,
    val features: Features? = null,
    val error: String? = null
)

data class Probability(
    val low_risk: Double,
    val high_risk: Double
)

data class Features(
    val age: Double,
    val sleep_hours: Double,
    val memory_score: Double,
    val word_count: Int,
    val avg_word_length: Double,
    val filler_count: Int
)

data class ApiStatus(
    val status: String,
    val message: String
)