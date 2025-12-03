package com.example.neuromind

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth



class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        FirebaseApp.initializeApp(this) // init firebase



        setContent { AppNav() }
    }
}

    @Composable
    fun AppNav() {
        val navController = rememberNavController()

        // 🔹 Shared score state for dashboard + result screen
        var lastRiskScore by rememberSaveable { mutableStateOf<Int?>(null)}

        NavHost(navController = navController, startDestination = "login") {
            composable("login") {
                LoginScreen(
                    onLoggedIn = { name ->
                        val safe = android.net.Uri.encode(name)
                        navController.navigate("dashboard/$safe") {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                )
            }

            composable(
                route = "dashboard/{name}",
                arguments = listOf(navArgument("name") { type = NavType.StringType })
            ) { backStackEntry ->
                val name = backStackEntry.arguments?.getString("name") ?: "User"
                DashboardScreen(
                    name = name,
                    lastRiskScore = lastRiskScore, // latest score shown on dash
                    onOpenCognitive = {navController.navigate("cognitive_test")},
                    onOpenTest = { navController.navigate("dementia_test") },
                    onOpenSpeech = { navController.navigate("speech_test") },
                    onOpenMedical = { navController.navigate("medical_assessment") },
                    onOpenRisk = {navController.navigate("risk_result")},
                    onOpenContact = {navController.navigate("contact_support")},
                    onSignOut = {
                        FirebaseAuth.getInstance().signOut()
                        navController.navigate("login") {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    onOpenNews = { navController.navigate("patient_news") }
                )
            }

            composable("patient_news") {
                PatientNewsScreen(
                    onBack = { navController.popBackStack() }
                )
            }

            composable("contact_support") {
                ContactSupportScreen(
                    onBack = { navController.popBackStack() }
                )
            }

            composable("risk_result"){
                DementiaResultScreen(
                    score = lastRiskScore,
                    onBack = {navController.popBackStack()},
                    onContactSupport = {navController.navigate("contact_support")}
                )
            }
            composable("cognitive_test"){
                CognitiveMiniTestScreen(
                    onBack = {navController.popBackStack()},
                    onNext = {navController.navigate("cognitive_recall")}
                )
            }
            composable("cognitive_recall"){
                CognitiveMiniTestRecallScreen(
                    onBack = {navController.popBackStack()},
                    onFinish = {navController.navigate("dementia_test")}
                )
            }
            composable("dementia_test") {
                DementiaTestScreen(
                    onBack = { navController.popBackStack() }, // goes back to dashboard
                    onResult = { score -> // update score and go to result screen
                        lastRiskScore = score
                        //navController.navigate("risk_result")
                    }
                )
            }
            composable("medical_assessment") {
                MedicalAssessmentScreen(onBack = { navController.popBackStack() })
            }
            composable("speech_test") {
                SpeechTestScreen(
                    onBack = { navController.popBackStack() },
                    onNext = { navController.navigate("dementia_test") }
                )
            }
        }
    }


