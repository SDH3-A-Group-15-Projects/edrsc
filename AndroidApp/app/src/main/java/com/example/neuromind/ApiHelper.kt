package com.example.neuromind

import android.util.Log
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

/**
 * Helper class to make API calls easier
 * Usage example:
 *
 * ApiHelper.predictDementiaRisk(
 *     age = 68.0,
 *     sleepHours = 6.0,
 *     memoryScore = 72.0,
 *     speechText = "Um, I went to the store..."
 * ) { result ->
 *     // Handle result here
 *     Log.d("Result", result.prediction)
 * }
 */
object ApiHelper {

    /**
     * Make a dementia risk prediction
     *
     * @param age Patient's age (e.g., 68.0)
     * @param sleepHours Hours of sleep per night (e.g., 6.5)
     * @param memoryScore Memory test score 0-100 (e.g., 72.0)
     * @param speechText Patient's speech sample
     * @param onSuccess Callback when prediction succeeds
     * @param onError Callback when request fails
     */
    /*fun predictDementiaRisk(
        age: Double,
        sleepHours: Double,
        questionnaireScore: Double,
        voiceScore: Double,
        onSuccess: (PredictionResponse) -> Unit,
        onError: ((String) -> Unit)? = null
    ) {
        val request = PredictionRequest(
            age = age,
            sleep_hours = sleepHours,
            questionnaireScore = memoryScore,
            speech_text = speechText
        )

        Log.d("ApiHelper", "Making prediction request...")
        Log.d("ApiHelper", "Age: $age, Sleep: $sleepHours, Memory: $memoryScore")

        RetrofitClient.instance.predictRisk(request).enqueue(object : Callback<PredictionResponse> {
            override fun onResponse(
                call: Call<PredictionResponse>,
                response: Response<PredictionResponse>
            ) {
                if (response.isSuccessful) {
                    val result = response.body()

                    if (result != null && result.success) {
                        Log.d("ApiHelper", "✓ Prediction successful: ${result.prediction}")
                        onSuccess(result)
                    } else {
                        val error = result?.error ?: "Unknown error occurred"
                        Log.e("ApiHelper", "✗ API Error: $error")
                        onError?.invoke(error)
                    }
                } else {
                    val error = "Server error: ${response.code()}"
                    Log.e("ApiHelper", "✗ $error")
                    onError?.invoke(error)
                }
            }

            override fun onFailure(call: Call<PredictionResponse>, t: Throwable) {
                val error = "Connection failed: ${t.message}"
                Log.e("ApiHelper", "✗ $error")
                onError?.invoke(error)
            }
        })
    }*/

    /**
     * Test if API is reachable
     */
    fun testConnection(
        onSuccess: () -> Unit,
        onError: ((String) -> Unit)? = null
    ) {
        Log.d("ApiHelper", "Testing API connection...")

        RetrofitClient.instance.getStatus().enqueue(object : Callback<ApiStatus> {
            override fun onResponse(call: Call<ApiStatus>, response: Response<ApiStatus>) {
                if (response.isSuccessful) {
                    Log.d("ApiHelper", "✓ API is reachable")
                    onSuccess()
                } else {
                    val error = "API returned error: ${response.code()}"
                    Log.e("ApiHelper", "✗ $error")
                    onError?.invoke(error)
                }
            }

            override fun onFailure(call: Call<ApiStatus>, t: Throwable) {
                val error = "Cannot reach API: ${t.message}"
                Log.e("ApiHelper", "✗ $error")
                onError?.invoke(error)
            }
        })
    }
}