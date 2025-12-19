package com.example.neuromind

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class User(val firstName: String, val lastName: String, val dateOfBirth: String)

data class UserResponse(
    val firstName: String,
    val lastName: String,
    val email: String,
    val dateOfBirth: String,
    val createdAt: String,
    val updatedAt: String
)

data class QuestionnaireResponse(
    val id: String
)

data class Rating(
    val rating: Int,
    val review: String
)

data class SupportRequest(
    val message: String
)

data class SupportRequestResponse(
    val id: String
)

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

data class Questionnaire(
    val age: Double,
    val sleepHours: Double,
    val isOnMedication: String,
    val smokes: String,
    val isDiabetic: String,
    val drinksAlcohol: String,
    val hasDepression: String,
    val isPhysicallyActive: String,
    val hasHealthyDiet: String,
    val isMentallyActive: String,
    val hasFamilyHistoryOfDementia: String
)
