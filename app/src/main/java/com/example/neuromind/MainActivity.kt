package com.example.neuromind

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
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


        // for debug builds, use local emulator instead of real firebase
        // prevents test accounts being made on real product
        if (BuildConfig.USE_FIREBASE_EMULATOR) {
            FirebaseAuth.getInstance().useEmulator(
                BuildConfig.AUTH_EMULATOR_HOST,
                BuildConfig.AUTH_EMULATOR_PORT
            )
        }

        setContent { AppNav() }
    }
}

    @Composable
    fun AppNav() {
        val navController = rememberNavController()
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
                    onOpenTest = { navController.navigate("dementia_test") },
                    onOpenSpeech = { navController.navigate("speech_test") },
                    onOpenMedical = { navController.navigate("medical_assessment") },
                    onSignOut = {
                        FirebaseAuth.getInstance().signOut()
                        navController.navigate("login") {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
            composable("dementia_test") {
                DementiaTestScreen(
                    onBack = { navController.popBackStack() } // goes back to dashboard
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


