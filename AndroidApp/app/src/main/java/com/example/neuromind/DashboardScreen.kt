package com.example.neuromind

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Assessment
import androidx.compose.material.icons.outlined.AssignmentTurnedIn
import androidx.compose.material.icons.outlined.GraphicEq
import androidx.compose.material.icons.outlined.Healing
import androidx.compose.material.icons.outlined.Psychology
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.outlined.Article


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    name: String,
    lastRiskScore: Int?,
    onOpenCognitive: () -> Unit,
    onOpenTest: () -> Unit,
    onOpenSpeech: () -> Unit,
    onOpenMedical: () -> Unit,
    onOpenRisk: () -> Unit,
    onSignOut: () -> Unit,
    onOpenContact: () -> Unit,
    onOpenNews: () -> Unit
) {
    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(brush = gradient)
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                CenterAlignedTopAppBar(
                    title = { Text("Dashboard", color = clr_onPrimary) },
                    navigationIcon = {
                        Box(
                            modifier = Modifier
                                .padding(start = 8.dp)
                                .size(36.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(clr_field_backgrnd)
                                .border(1.dp, clr_fieldStroke, RoundedCornerShape(18.dp))
                        )
                    },
                    actions = {
                        TextButton(onClick = onSignOut) {
                            Text("Sign out", color = clr_onPrimary)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.Transparent,
                        navigationIconContentColor = clr_onPrimary,
                        actionIconContentColor = clr_onPrimary,
                        titleContentColor = clr_onPrimary
                    )
                )
            }
        ) { inner ->
            Column(
                modifier = Modifier
                    .padding(inner)
                    .padding(16.dp)
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Welcome panel
                Surface(
                    color = clr_panel_bg,
                    shape = RoundedCornerShape(16.dp),
                    tonalElevation = 0.dp,
                    shadowElevation = 0.dp,
                    border = BorderStroke(1.dp, clr_panel_border),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Text(
                            text = "Welcome ${name.ifBlank { "Doctor" }}",
                            style = MaterialTheme.typography.titleMedium,
                            color = clr_onPrimary
                        )
                    }
                }

                // Feature grid
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        DashboardTile(
                            title = "Medical Assessment\nQuestionnaire",
                            icon = Icons.Outlined.Healing,
                            onClick = onOpenMedical,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardTile(
                            title = "Speech Test",
                            icon = Icons.Outlined.GraphicEq,
                            onClick = onOpenSpeech,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        DashboardTile(
                            title = "Cognitive Mini-Test",
                            icon = Icons.Outlined.Psychology,
                            onClick = onOpenCognitive,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardTile(
                            title = "Dementia Risk Score\n& Evaluation",
                            icon = Icons.Outlined.AssignmentTurnedIn,
                            onClick = onOpenRisk,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        DashboardTile(
                            title = "Dementia News",
                            icon = Icons.Outlined.Article,
                            onClick = onOpenNews,
                            modifier = Modifier.weight(1f)
                        )
                        Spacer(modifier = Modifier.weight(1f)) // empty space to balance grid
                    }
                }

                // Score panel
                Surface(
                    color = clr_panel_bg,
                    shape = RoundedCornerShape(16.dp),
                    tonalElevation = 0.dp,
                    shadowElevation = 0.dp,
                    border = BorderStroke(1.dp, clr_panel_border),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(64.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(clr_field_backgrnd)
                                    .border(1.dp, clr_fieldStroke, RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Assessment,
                                    contentDescription = null,
                                    tint = clr_onPrimary
                                )
                            }
                            Icon(
                                imageVector = Icons.Outlined.Speed,
                                contentDescription = "Risk gauge",
                                tint = clr_onPrimary,
                                modifier = Modifier
                                    .height(64.dp)
                                    .weight(1f)
                                    .padding(start = 12.dp)
                            )
                        }
                        Column {
                            Text(
                                "Your previous test score:",
                                style = MaterialTheme.typography.bodyMedium,
                                color = clr_onPrimary.copy(alpha = 0.9f)
                            )
                            Spacer(Modifier.height(4.dp))
                            val dashScore = lastRiskScore
                            val dashLabel = when {
                                dashScore == null -> "No test taken yet"
                                dashScore < 33    -> "Low Risk"
                                dashScore < 66    -> "Medium Risk"
                                else              -> "High Risk"
                            }

                            Text(
                                text = dashScore?.let { "$it% ($dashLabel)" } ?: dashLabel,
                                style = MaterialTheme.typography.titleMedium,
                                color = Color(0xFF8EF1A8)
                            )
                        }
                    }
                }

                Spacer(Modifier.weight(1f))

                // Primary CTA
                Button(
                    onClick = onOpenMedical,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = clr_button,
                        contentColor = clr_onPrimary
                    )
                ) {
                    Text("Start Assessment")
                }

                Text(
                    "Estimated time: 10–15 mins",
                    style = MaterialTheme.typography.bodySmall,
                    color = clr_onPrimary.copy(alpha = 0.75f),
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
                TextButton(
                    onClick = { onOpenContact() },
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text(
                        "Contact us",
                        color = clr_hyperLink
                    )
                }

            }
        }
    }
}