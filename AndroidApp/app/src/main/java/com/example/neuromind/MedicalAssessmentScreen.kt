package com.example.neuromind

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext


@OptIn(ExperimentalMaterial3Api::class  )
@Composable
fun MedicalAssessmentScreen(
    onBack: () -> Unit = {},
    onNext: (questionnaire: Questionnaire) -> Unit
) {
    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    var ageText by remember { mutableStateOf("") }
    var sleepHoursText by remember { mutableStateOf("") }
    val context = LocalContext.current
    var onMedication by remember { mutableStateOf("No")}
    var smoke by remember { mutableStateOf("Yes") }
    var diabetic by remember { mutableStateOf("No") }
    var drinkAlcohol by remember { mutableStateOf("No")}
    var depression by remember { mutableStateOf("No")}
    var physicallyActive by remember { mutableStateOf("Yes")}
    var healthyDiet by remember {mutableStateOf("Yes")}
    var mentalActivity by remember { mutableStateOf("Often") }
    var familyHistory by remember { mutableStateOf("No") }

    Scaffold(
        containerColor = Color.Transparent,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Medical & Life Questionnaire", color = clr_onPrimary) },
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
        }
    ) { inner ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(brush = gradient)
        ) {
            Column(
                modifier = Modifier
                    .padding(inner)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Header chip style
                Surface(
                    color = clr_header,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        "1. Medical & Life Questionnaire",
                        color = Color.White,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(Modifier.height(12.dp))
                Text(
                    "Basic Information\nTell us about yourself",
                    color = clr_onPrimary,
                    lineHeight = 18.sp
                )

                Spacer(Modifier.height(12.dp))

                OutlinedTextField(
                    value = ageText,
                    onValueChange = { ageText = it },
                    label = { Text("Age (years)", color = clr_onPrimary) },
                    placeholder = { Text("Enter your age", color = clr_onPrimary) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = LocalTextStyle.current.copy(color = clr_onPrimary)
                )

                Spacer(Modifier.height(16.dp))

                OutlinedTextField(
                    value = sleepHoursText,
                    onValueChange = { sleepHoursText = it },
                    label = { Text("Average hours of sleep per night", color = clr_onPrimary) },
                    placeholder = { Text("e.g. 7.5", color = clr_onPrimary) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = LocalTextStyle.current.copy(color = clr_onPrimary)
                )


                Spacer(Modifier.height(16.dp))
                DropdownField(
                    label = "Are you on any medication",
                    options = listOf("Yes", "No"),
                    selected = onMedication,
                    onSelected = { onMedication = it}

                )

                Spacer(Modifier.height(12.dp))
                DropdownField(
                    label = "Are you diabetic?",
                    options = listOf("Yes", "No"),
                    selected = diabetic,
                    onSelected = { diabetic = it }
                )

                Spacer(Modifier.height(12.dp))
                DropdownField(
                    label = "Do you drink alcohol?",
                    options = listOf("Yes", "No"),
                    selected = drinkAlcohol,
                    onSelected = {drinkAlcohol = it}
                )

                Spacer(Modifier.height(16.dp))
                DropdownField(
                    label = "Do you smoke?",
                    options = listOf("Yes", "No"),
                    selected = smoke,
                    onSelected = { smoke = it }
                )

                Spacer(Modifier.height(12.dp))
                DropdownField(
                    label = "Do you suffer from depression?",
                    options = listOf("Yes", "No"),
                    selected = depression,
                    onSelected = {depression = it}
                )

                Spacer(Modifier.height(12.dp))
                DropdownField(
                    label = "Are you physically active?",
                    options = listOf("Yes", "No"),
                    selected = physicallyActive,
                    onSelected = {physicallyActive = it}
                )


                Spacer(Modifier.height(12.dp))
                DropdownField(
                    label = "Would you say you have a healthy diet?",
                    options = listOf("Yes", "No"),
                    selected = healthyDiet,
                    onSelected = {healthyDiet = it}
                )

                Spacer(Modifier.height(16.dp))
                Text(
                    "How often do you engage in mentally stimulating activities (e.g., reading, puzzles, games)?",
                    color = clr_onPrimary
                )
                RadioGroup(
                    options = listOf("Rarely", "Often", "Never", "Always"),
                    selected = mentalActivity,
                    onSelect = { mentalActivity = it }
                )

                Spacer(Modifier.height(16.dp))
                Text(
                    "Do you have a family history of dementia or Alzheimer’s disease?",
                    color = clr_onPrimary
                )
                RadioGroup(
                    options = listOf("Yes", "No"),
                    selected = familyHistory,
                    onSelect = { familyHistory = it }
                )

                Spacer(Modifier.height(20.dp))
                Button(
                    onClick = {
                        val ageVal = ageText.toDoubleOrNull()
                        val sleepVal = sleepHoursText.toDoubleOrNull()

                        if (ageVal == null || sleepVal == null){
                            Toast.makeText(context,
                                "Please enter valid age and sleep hours",
                                Toast.LENGTH_SHORT).show()

                        } else{
                            onNext(Questionnaire(
                                ageVal,
                                sleepHours = sleepVal,
                                isOnMedication = onMedication,
                                smokes = smoke,
                                isDiabetic = diabetic,
                                drinksAlcohol = drinkAlcohol,
                                hasDepression = depression,
                                isPhysicallyActive = physicallyActive,
                                hasHealthyDiet = healthyDiet,
                                isMentallyActive = mentalActivity,
                                hasFamilyHistoryOfDementia = familyHistory,
                            ))
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = clr_button,
                        contentColor = clr_onPrimary
                    )
                ) { Text("Next") }
                Spacer(Modifier.height(8.dp))
            }
        }
    }
}