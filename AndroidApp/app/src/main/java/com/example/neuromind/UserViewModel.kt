package com.example.neuromind

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

class UserViewModel : ViewModel() {
    val repository = UserRepository()
    var questionnaireId : String = ""

    fun createUser(uid: String, firstName: String, lastName: String, dateOfBirth: String, onResult: (Boolean) -> Unit) {
        val user = User(firstName, lastName, dateOfBirth)

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val res = repository.createUser(uid, user)
                withContext(Dispatchers.Main) {
                    if (res.isSuccess) onResult(true)
                    else {
                        println("Error creating user.")
                        onResult(false)
                    }
                }
            } catch (e: Exception) {
                Log.e("net", "Error occurred creating user:", e)
            }
        }
    }

    fun submitQuestionnaire(uid: String, questionnaire: Questionnaire, onResult: (Boolean) -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val res = repository.submitQuestionnaire(uid, questionnaire)
                withContext(Dispatchers.Main) {
                    if (res.isSuccess) {
                        questionnaireId = res.getOrNull()?.id.toString()
                        Log.i("qid", questionnaireId)
                        onResult(true)
                    }
                    else {
                        println("Error submittingQuestionnaire.")
                        onResult(false)
                    }
                }
            } catch (e: Exception) {
                Log.e("net", "Error occurred submitting questionnaire:", e)
            }
        }
    }
}