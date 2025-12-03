package com.example.neuromind

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DementiaTestScreen(
    onBack: () -> Unit = {},
    onResult: (Int) -> Unit = {}
) {
    val context = LocalContext.current
    var age by remember { mutableStateOf("78") }
    var sleep by remember { mutableStateOf("5.0") }
    var memory by remember { mutableStateOf("3.0") }
    var speech by remember { mutableStateOf("Um, I often forget names and sometimes repeat myself.") }

    var loading by remember { mutableStateOf(false) }
    var resultText by remember { mutableStateOf<String?>(null) }
    var errorText by remember { mutableStateOf<String?>(null) }

    fun sanitizeDecimal(input: String): String {
        var dots = 0
        return input.filter { ch ->
            if (ch == '.') {
                if (dots == 0) {
                    dots++; true
                } else false
            } else ch.isDigit()
        }
    }

    fun runPrediction() {
        // Parse inputs
        val ageI = age.toIntOrNull()
        val sleepD = sleep.toDoubleOrNull()
        val memoryD = memory.toDoubleOrNull()

        if (ageI == null || sleepD == null || memoryD == null) {
            Toast.makeText(context, "Enter valid numbers", Toast.LENGTH_SHORT).show()
            return
        }

        // Clamp memory score to the range the model was trained on (0–5 here)
        val memoryClamped = memoryD.coerceIn(0.0, 5.0)

        val req = PredictRequest(
            age = ageI,
            sleep_hours = sleepD,
            memory_score = memoryClamped,   // <-- use clamped value
            speech_text = speech            // later: use Whisper transcript instead
        )

        loading = true
        errorText = null
        resultText = null

        RetrofitClient.instance.getPrediction(req).enqueue(object : Callback<PredictResponse> {
            override fun onResponse(
                call: Call<PredictResponse>,
                response: Response<PredictResponse>
            ) {
                loading = false
                if (response.isSuccessful) {
                    val body = response.body()
                    val high = body?.probability?.get("High Risk") ?: 0.0
                    val low = body?.probability?.get("Low Risk") ?: 0.0

                    resultText =
                        "Prediction: ${body?.prediction}\n" +
                                "High Risk: ${"%.2f".format(high)}%\n" +
                                "Low Risk: ${"%.2f".format(low)}%"

                    val scoreInt = high.toInt()
                    onResult(scoreInt)
                } else {
                    errorText = "Error: ${response.code()} ${response.message()}"
                }
            }

            override fun onFailure(call: Call<PredictResponse>, t: Throwable) {
                loading = false
                errorText = "Failed: ${t.localizedMessage}"
            }
        })
    }


    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Dementia Risk Test") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = age,
                onValueChange = { age = it.filter { c -> c.isDigit() } },
                label = { Text("Age") },
                singleLine = true,
                keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = sleep,
                onValueChange = { sleep = sanitizeDecimal(it) },
                label = { Text("Sleep hours") },
                singleLine = true,
                keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = memory,
                onValueChange = { memory = sanitizeDecimal(it) },
                label = { Text("Memory score") },
                singleLine = true,
                keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = speech,
                onValueChange = { speech = it },
                label = { Text("Speech notes") },
                singleLine = false,
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 80.dp)
            )

            Button(
                onClick = { runPrediction() },
                enabled = !loading,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(if (loading) "Running..." else "Run Dementia Test")
            }

            if (loading) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
                    CircularProgressIndicator()
                }
            }

            resultText?.let { Text(it, style = MaterialTheme.typography.bodyLarge) }
            errorText?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        }
    }
}