package com.example.neuromind

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object PatientNewsRetrofit {

// Emulator -> backend on your laptop:
// use 10.0.2.2 and port 8000 for FastAPI
private const val BASE_URL = "http://10.0.2.2:8000/"

// For physical device on same WiFi, replace with your PC IP, e.g.:
// private const val BASE_URL = "http://192.168.1.5:8000/"

val api: PatientNewsApi by lazy {
    Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PatientNewsApi::class.java)
}
}
