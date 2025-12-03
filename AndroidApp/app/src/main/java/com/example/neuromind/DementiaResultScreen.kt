package com.example.neuromind

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
    score: Int?,
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
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                // Green header / chip
                Surface(
                    color = clr_result_chip_bg,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Result",
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = clr_result_chip_text,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(Modifier.height(24.dp))

                // Main card
                Surface(
                    color = clr_panel_bg,
                    shape = RoundedCornerShape(24.dp),
                    tonalElevation = 0.dp,
                    shadowElevation = 0.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Tick circle
                        Surface(
                            color = clr_result_chip_bg,
                            shape = RoundedCornerShape(999.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(80.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    "✓",
                                    fontSize = 40.sp,
                                    color = clr_result_chip_text,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }

                        Spacer(Modifier.height(16.dp))

                        Text(
                            "Assessment Complete",
                            color = clr_onPrimary,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.SemiBold,
                            textAlign = TextAlign.Center
                        )

                        Spacer(Modifier.height(16.dp))

                        val displayScore = score ?: 50 // displays 50 as default score

                        Text(
                            "$displayScore%",
                            color = clr_onPrimary,
                            fontSize = 40.sp,
                            fontWeight = FontWeight.Bold
                        )

                        val riskLabel = when{
                            score == null -> "Risk not available"
                            score > 33 -> "Low Risk"
                            score > 66 -> "High Risk"
                            else -> "High Risk"
                        }

                        Text(
                            riskLabel,
                            color = clr_onPrimary,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Medium
                        )

                        Spacer(Modifier.height(12.dp))

                        Text(
                            text = "Your assessment indicates a moderate risk for cognitive decline. " +
                                    "Consider discussing lifestyle changes and regular check-ups with your doctor.",
                            color = clr_onPrimary.copy(alpha = 0.9f),
                            fontSize = 14.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }

                Spacer(Modifier.height(24.dp))

                // Sub-scores
                Text(
                    "Memory & Cognition Results",
                    color = clr_onPrimary,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(8.dp))

                RiskMetricBar("Memory", 60)
                RiskMetricBar("Attention", 50)
                RiskMetricBar("Executive Function", 55)
                RiskMetricBar("Processing Speed", 45)

                Spacer(Modifier.weight(1f))

                Button(
                    onClick = onContactSupport,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = clr_button,
                        contentColor = clr_onPrimary
                    )
                ) {
                    Text("Contact Support")
                }

                Spacer(Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun RiskMetricBar(
    label: String,
    value: Int    // 0–100
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
