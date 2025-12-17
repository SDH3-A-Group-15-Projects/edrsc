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
    memory: Double?,
    speechText: String?,
    onBack: () -> Unit = {},
    onResult: (Int) -> Unit
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
        Text("Memory score: ${memory ?: "-"}")
        Text(
            "Speech notes: " +
                    if (!speechText.isNullOrBlank()) "Captured" else "Missing"
        )

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
                if (age == null || sleep == null || memory == null || speechText.isNullOrBlank()) {
                    Toast.makeText(
                        context,
                        "Please complete medical, speech and memory tests first.",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@Button
                }

                isLoading = true
                errorMessage = null

                ApiHelper.predictDementiaRisk(
                    age = age,
                    sleepHours = sleep,
                    memoryScore = memory,
                    speechText = speechText,
                    onSuccess = { response ->
                        isLoading = false
                        onResult(response.risk_score)
                    },
                    onError = { error ->
                        isLoading = false
                        errorMessage = error
                    }
                )
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
