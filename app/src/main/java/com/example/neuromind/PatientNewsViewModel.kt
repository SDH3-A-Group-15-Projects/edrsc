package com.example.neuromind

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class PatientNewsViewModel : ViewModel() {

    private val repository = PatientNewsRepository()

    sealed class NewsState {
        object Idle : NewsState()
        object Loading : NewsState()
        object Success : NewsState()
        data class Error(val message: String) : NewsState()
    }

    private val _newsState = MutableStateFlow<NewsState>(NewsState.Idle)
    val newsState: StateFlow<NewsState> = _newsState

    private val _articles = MutableStateFlow<List<PatientArticle>>(emptyList())
    val articles: StateFlow<List<PatientArticle>> = _articles

    /**
     * Load news from backend.
     *
     * @param daysBack how many days back to search (1–30, enforced server-side)
     * @param refresh if true, forces the backend to bypass cache
     */
    fun loadNews(daysBack: Int = 7, refresh: Boolean = false) {
        viewModelScope.launch {
            _newsState.value = NewsState.Loading

            val result = repository.getPatientNews(daysBack, refresh)

            result.fold(
                onSuccess = { response ->
                    _articles.value = response.articles
                    _newsState.value = NewsState.Success
                },
                onFailure = { error ->
                    _newsState.value = NewsState.Error(
                        error.message ?: "Unknown error occurred"
                    )
                }
            )
        }
    }

    /**
     * Convenience wrapper: force refresh from backend.
     */
    fun refreshNews(daysBack: Int = 7) {
        loadNews(daysBack = daysBack, refresh = true)
    }
}
