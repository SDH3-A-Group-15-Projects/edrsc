
package com.example.neuromind

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface RiskPredictionApi {

    @GET("/")
    fun getStatus(): Call<ApiStatus>

    @POST("/predict")
    fun predictRisk(@Body request: PredictionRequest): Call<PredictionResponse>
}