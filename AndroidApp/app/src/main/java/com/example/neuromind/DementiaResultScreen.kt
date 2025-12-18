package com.example.neuromind

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DementiaResultScreen(
    overall: Int?,
    questionnaire: Int?,
    voice: Int?,
    onBack: () -> Unit = {},
    onContactSupport: () -> Unit = {}
) {
    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Result", color = clr_onPrimary) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = clr_onPrimary
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent
                )
            )
        },
        containerColor = Color.Transparent
    ) { inner ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(brush = gradient)
                .padding(inner)
                .padding(vertical=8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(brush = gradient)
                    .padding(inner)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    color = clr_result_chip_bg,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Result",
                        modifier = Modifier.padding(vertical = 8.dp),
                        color = clr_result_chip_text,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(Modifier.height(16.dp))

                Surface(
                    color = clr_panel_bg,
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1.2f)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(color = clr_result_chip_bg, shape = RoundedCornerShape(999.dp)) {
                            Box(
                                modifier = Modifier.size(60.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("✓", fontSize = 30.sp, color = clr_result_chip_text)
                            }
                        }

                        Text(
                            "${overall ?: 0}%",
                            fontSize = 38.sp,
                            fontWeight = FontWeight.Bold,
                            color = clr_onPrimary
                        )

                        val score = overall ?: 0
                        val (label, desc) = when {
                            score < 33 -> "Low Risk" to "Your assessment indicates a low risk for cognitive decline. You can discuss recommended lifestyle changes to maintain low risk with your doctor."
                            score <= 66 -> "Moderate Risk" to "Your assessment indicates a moderate risk for cognitive decline. Consider discussing lifestyle changes and regular check-ups with your doctor."
                            else -> "High Risk" to "Your assessment indicates a high risk for cognitive decline. Consider discussing precautionary steps and regular check-ups with your doctor."
                        }

                        Text(
                            label,
                            color = clr_onPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            desc,
                            color = clr_onPrimary.copy(alpha = 0.8f),
                            textAlign = TextAlign.Center,
                            fontSize = 13.sp
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(0.8f)
                ) {
                    Text(
                        "Memory & Cognition Results",
                        color = clr_onPrimary,
                        fontWeight = FontWeight.SemiBold
                    )

                    Spacer(Modifier.height(8.dp))

                    RiskMetricBar("Questionnaire", questionnaire ?: 0)
                    RiskMetricBar("Voice", voice ?: 0)
                }

                Button(
                    onClick = onContactSupport,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = clr_button)
                ) {
                    Text("Contact Support")
                }
            }
        }
    }
    }

@Composable
private fun RiskMetricBar(
    label: String,
    value: Int
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, color = clr_onPrimary, fontSize = 13.sp)
            Text("${value}%", color = clr_onPrimary, fontSize = 13.sp)
        }
        Spacer(Modifier.height(4.dp))
    }
}
