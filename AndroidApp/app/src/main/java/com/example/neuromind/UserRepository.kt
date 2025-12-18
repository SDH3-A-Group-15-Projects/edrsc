package com.example.neuromind

import com.example.neuromind.RetrofitClient
import com.example.neuromind.RetrofitClient.apiService

class UserRepository() {
    private val api = RetrofitClient.apiService

    suspend fun createUser(uid: String, data: User): Result<UserResponse> {
        return try {
            val response = apiService.createUserProfile(uid, data)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun submitQuestionnaire(uid: String, data: Questionnaire) : Result<QuestionnaireResponse> {
        return try {
            val response = apiService.submitQuestionnaire(uid, data)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}