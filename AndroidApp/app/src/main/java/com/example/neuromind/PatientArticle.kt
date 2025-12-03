package com.example.neuromind

data class PatientArticle(
        val title: String,
        val source: String,
        val url: String,
        val date: String,
        val description: String,
        val summary: String,
        val category: String,
        val readability_score: Int,
        val actionable_tips: List<String>
)

data class PatientNewsResponse(
        val type: String,
        val timestamp: String,
        val articles: List<PatientArticle>,
        val total_articles: Int,
        val categories: Map<String, Int>?
)

data class RefreshResponse(
        val message: String,
        val timestamp: String,
        val articles_found: Int,
        val categories: Map<String, Int>?
)

data class HealthResponse(
        val status: String,
        val timestamp: String
)
