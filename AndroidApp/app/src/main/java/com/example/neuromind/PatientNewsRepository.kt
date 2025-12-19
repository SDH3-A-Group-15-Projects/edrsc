package com.example.neuromind

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class PatientNewsRepository {

    private val api = PatientNewsRetrofit.api

    suspend fun getPatientNews(daysBack: Int = 7, refresh: Boolean = false): Result<PatientNewsResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.getPatientNews(daysBack, refresh)
                Result.success(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    /*suspend fun getNewsByCategory(category: String): Result<PatientNewsResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.getNewsByCategory(category)
                Result.success(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }*/

    suspend fun refreshNews(daysBack: Int = 7): Result<RefreshResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.refreshNews(daysBack)
                Result.success(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    suspend fun checkHealth(): Result<HealthResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.healthCheck()
                Result.success(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
