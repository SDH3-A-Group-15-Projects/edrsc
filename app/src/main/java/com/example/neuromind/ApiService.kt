package com.example.neuromind

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

data class PredictRequest(
    val age: Int,
    val sleep_hours: Double,
    val memory_score: Double,
    val speech_text: String
)

data class PredictResponse(
    val prediction: String,
    val probability: Map<String, Double>
)

interface ApiService {
    @POST("/predict")
    fun getPrediction(@Body request: PredictRequest): Call<PredictResponse>

    @Multipart
    @POST("/upload-audio")
    fun uploadSpeech(
        @Part audio: MultipartBody.Part
    ): Call<SpeechAnalysisResponse>
}
data class SpeechAnalysisResponse(
    val transcript: String?,
    val summary: String?,
    val score: Double?
)