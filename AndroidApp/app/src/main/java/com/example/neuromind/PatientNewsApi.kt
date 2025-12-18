package com.example.neuromind

import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface PatientNewsApi {

    // This matches: @app.get("/api/news/medical", ...)
    @GET("/api/news/medical")
    suspend fun getPatientNews(
        @Query("days_back") daysBack: Int = 7,
        @Query("refresh") refresh: Boolean = false
    ): PatientNewsResponse

    // backend has no category endpoint yet, commented  for now
    /*
    @GET("/api/news/patient/category/{category}")
    suspend fun getNewsByCategory(
        @Path("category") category: String
    ): PatientNewsResponse
    */

    @POST("/api/news/refresh")
    suspend fun refreshNews(
        @Query("days_back") daysBack: Int = 7
    ): RefreshResponse

    @GET("/api/health")
    suspend fun healthCheck(): HealthResponse
}
