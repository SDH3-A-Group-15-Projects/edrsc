package com.example.neuromind

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

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
    @POST("/api/app/users/{uid}/results/voice/{id}")
    fun uploadSpeech(
        @Path("uid") uid : String,
        @Path("id") id : String,
        @Part audioFile: MultipartBody.Part
    ): Call<SpeechAnalysisResponse>

    @POST("/api/app/users/{uid}/profile")
    suspend fun createUserProfile(
        @Path("uid") uid: String,
        @Body data: User
    ): Response<UserResponse>

    @POST("/api/app/users/{uid}/results/questionnaire")
    suspend fun submitQuestionnaire(
        @Path("uid") uid: String,
        @Body data: Questionnaire
    ): Response<QuestionnaireResponse>


}
data class SpeechAnalysisResponse(
    val questionnaireRisk : Double,
    val voiceRisk: Double,
    val overallRisk: Double
)