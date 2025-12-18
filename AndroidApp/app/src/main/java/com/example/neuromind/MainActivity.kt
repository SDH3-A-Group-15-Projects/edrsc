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
    val viewModel = UserViewModel()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        FirebaseApp.initializeApp(this) // init firebase



        setContent { AppNav(viewModel) }
    }
}

    @Composable
    fun AppNav(userViewModel: UserViewModel) {
        val navController = rememberNavController()

        // Shared score state for dashboard + result screen
        var lastOverallRiskScore by rememberSaveable { mutableStateOf<Int?>(null)}
        var lastQuestionnaireRiskScore by rememberSaveable { mutableStateOf<Int?>(null)}
        var lastVoiceRiskScore by rememberSaveable { mutableStateOf<Int?>(null)}

        var username by rememberSaveable { mutableStateOf<String?>(null) }

        // values saved throughout assessment
        var assessmentAge by rememberSaveable { mutableStateOf<Double?>(null) }
        var assessmentSleep by rememberSaveable { mutableStateOf<Double?>(null) }
        var questionnaireScore by rememberSaveable { mutableStateOf<Double?>(null) }
        var voiceScore by rememberSaveable { mutableStateOf<Double?>(null) }

        NavHost(navController = navController, startDestination = "login") {
            composable("login") {
                LoginScreen(
                    onLoggedIn = { uid, name, new ->
                        username = name
                        val firstName = "Ann"
                        val lastName = "Smith"
                        val dateOfBirth = "1940-01-01"
                        Log.i("auth", "We're running $new")
                        userViewModel.createUser(uid, firstName, lastName, dateOfBirth, {res -> Log.i("auth","Auth success? $res")})
                        val safe = android.net.Uri.encode(name)
                        navController.navigate("dashboard/$safe") {
                            popUpTo("login") { inclusive = true }
                        }
                    },
                    onForgotPassword = {
                        navController.navigate("forgot_password")
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
                    lastRiskScore = lastOverallRiskScore, // latest score shown on dash
                    onOpenCognitive = {navController.navigate("cognitive_test")},
                    onOpenTest = { navController.navigate("medical_assessment") },
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
                    onOpenNews = { navController.navigate("patient_news") },
                    onOpenPayments = { navController.navigate("payments")},
                    onOpenRatings = {navController.navigate("app_review")}
                )
            }


            composable("run_risk") {
                RunRiskScreen(
                    age = assessmentAge,
                    sleep = assessmentSleep,
                    questionnaireScore = questionnaireScore,
                    voiceScore = voiceScore,
                    onBack = { navController.popBackStack() },
                    onResult = { overall, questionnaire, voice ->
                        lastOverallRiskScore = overall
                        lastQuestionnaireRiskScore = questionnaire
                        lastVoiceRiskScore = voice
                        navController.navigate("risk_result")
                    }
                )
            }


            composable("app_review") {
                AppReviewScreen(
                    onBack = { navController.popBackStack() }
                )
            }


            composable("forgot_password") {
                ForgotPasswordScreen(
                    onBack = { navController.popBackStack() }
                )
            }

            composable("payments") {
                PaymentsScreen(
                    onBack = { navController.popBackStack() }
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
                    overall = lastOverallRiskScore,
                    questionnaire = lastQuestionnaireRiskScore,
                    voice = lastVoiceRiskScore,
                    onBack = {navController.navigate("dashboard/${android.net.Uri.encode(username)}")},
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
                    onFinish = {navController.navigate("run_risk")},
                    onMemoryScored = {score ->
                        //assessmentMemory = score
                    }
                )
            }

            composable("medical_assessment") {
                MedicalAssessmentScreen(
                    onBack = { navController.popBackStack() },
                    onNext = {questionnaire ->
                        assessmentAge = questionnaire.age
                        assessmentSleep = questionnaire.sleepHours

                        userViewModel.submitQuestionnaire(FirebaseAuth.getInstance().uid ?: "", questionnaire, {Log.i("questionnaire", "Result: $it")})

                        navController.navigate("speech_test")
                    }
                    )
            }
            composable("speech_test") {
                SpeechTestScreen(
                    onBack = { navController.popBackStack() },
                    onNext = { questionnaireRisk, voiceRisk ->
                        questionnaireScore = questionnaireRisk
                        voiceScore = voiceRisk
                        navController.navigate("run_risk") },
                    onSpeechReady = {text ->
                        //assessmentSpeechText = text
                    },
                    viewModel = userViewModel
                )
            }
        }
    }


