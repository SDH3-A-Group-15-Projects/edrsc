package com.example.neuromind
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp


@Composable
fun RunRiskScreen(
    age: Double?,
    sleep: Double?,
    questionnaireScore: Double?,
    voiceScore: Double?,
    onBack: () -> Unit = {},
    onResult: (Int, Int, Int) -> Unit
) {
    val context = LocalContext.current

    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text(
            text = "Ready to run dementia risk assessment",
            style = MaterialTheme.typography.titleMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Simple summary display (optional but handy)
        Text("Age: ${age ?: "-"}")
        Text("Sleep hours: ${sleep ?: "-"}")
        Text("Questionnaire Score: ${questionnaireScore ?: "-"}")
        Text("Voice Score: ${voiceScore ?: "-"}")

        Spacer(modifier = Modifier.height(24.dp))

        if (errorMessage != null) {
            Text(
                text = errorMessage!!,
                color = MaterialTheme.colorScheme.error
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        Button(
            onClick = {
                // Validate that all inputs are present
                if (age == null || sleep == null || questionnaireScore == null || voiceScore == null) {
                    Toast.makeText(
                        context,
                        "Please complete medical and speech tests first.",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@Button
                }

                isLoading = true
                errorMessage = null

                isLoading = false
                onResult(((((questionnaireScore + voiceScore) / 2) * 100).toInt()), (questionnaireScore * 100).toInt(), (voiceScore * 100).toInt())
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Running...")
            } else {
                Text("Run Risk Assessment")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onBack) {
            Text("Back")
        }
    }
}
