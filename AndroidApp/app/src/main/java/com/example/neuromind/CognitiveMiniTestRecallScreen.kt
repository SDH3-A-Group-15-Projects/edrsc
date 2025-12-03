package com.example.neuromind

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CognitiveMiniTestRecallScreen(
    onBack: () -> Unit = {},
    onFinish: () -> Unit = {}
) {
    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    val wordOptions = listOf(
        "Mango",
        "Banana",
        "Pear",
        "Apple",
        "Orange",
        "Kiwi",
        "Strawberry"
    )

    var selectedWords by remember { mutableStateOf(setOf<String>()) }
    var animalsText by remember { mutableStateOf("") }

    Scaffold(
        containerColor = Color.Transparent,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("3. Cognitive Mini-Test", color = clr_onPrimary) },
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
                    containerColor = Color.Transparent,
                    navigationIconContentColor = clr_onPrimary,
                    titleContentColor = clr_onPrimary
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
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .fillMaxSize(),
                verticalArrangement = Arrangement.Top,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                Text(
                    text = "Please choose the 5 words you remember",
                    color = clr_onPrimary,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center,
                    fontSize = 18.sp
                )

                Spacer(Modifier.height(16.dp))

                // White card with word checkboxes
                Surface(
                    color = clr_panel_bg,
                    shape = RoundedCornerShape(16.dp),
                    tonalElevation = 0.dp,
                    shadowElevation = 0.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        wordOptions.forEach { word ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(vertical = 4.dp)
                            ) {
                                Checkbox(
                                    checked = selectedWords.contains(word),
                                    onCheckedChange = {
                                        selectedWords =
                                            if (selectedWords.contains(word)) {
                                                selectedWords - word
                                            } else {
                                                selectedWords + word
                                            }
                                    },
                                    colors = CheckboxDefaults.colors(
                                        checkedColor = clr_button
                                    )
                                )
                                Text(text = word, color = clr_onPrimary)
                            }
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // Yellow instruction bar
                Surface(
                    color = clr_recall_hint_bg,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Type as many animals as you can in 30 seconds",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                        textAlign = TextAlign.Center,
                        fontSize = 14.sp,
                        color = Color.Black
                    )
                }

                Spacer(Modifier.height(16.dp))

                // Text area for animals
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = 140.dp)
                ) {
                    OutlinedTextField(
                        value = animalsText,
                        onValueChange = { animalsText = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        placeholder = { Text("e.g. Fox") },
                        singleLine = false,
                        minLines = 4,
                        maxLines = 6
                    )
                }

                // Push bottom content down a bit
                Spacer(Modifier.weight(1f))

                // Simple 3-step progress indicator
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    repeat(3) { index ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(4.dp)
                                .background(
                                    if (index <= 2) clr_progress_ok else Color.White,
                                    shape = RoundedCornerShape(50)
                                )
                        )
                    }
                }

                Button(
                    onClick = onFinish,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = clr_button,
                        contentColor = clr_onPrimary
                    )
                ) {
                    Text("Finish")
                }
            }
        }
    }
}
