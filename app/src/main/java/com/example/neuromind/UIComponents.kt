package com.example.neuromind

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp

/** ---------- Reusable Inputs ---------- */


@Composable
fun RoundedFilledField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    textColor: Color,
    hintColor: Color,
    fillColor: Color,
    strokeColor: Color,
    keyboardOptions: KeyboardOptions,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    trailingContent: (@Composable () -> Unit)? = null
) {
    val shape = RoundedCornerShape(24.dp)
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .border(BorderStroke(2.dp, strokeColor), shape)
            .background(fillColor, shape)
            .padding(horizontal = 12.dp)
    ) {
        TextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = hintColor) },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 6.dp),
            textStyle = LocalTextStyle.current.copy(color = textColor),
            visualTransformation = visualTransformation,
            keyboardOptions = keyboardOptions,
            trailingIcon = trailingContent,
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.Transparent,
                unfocusedContainerColor = Color.Transparent,
                disabledContainerColor = Color.Transparent,
                errorContainerColor = Color.Transparent,
                focusedIndicatorColor = Color.Transparent,
                unfocusedIndicatorColor = Color.Transparent,
                focusedTextColor = textColor,
                unfocusedTextColor = textColor,
                cursorColor = textColor
            ),
            shape = shape
        )
    }
}


@Composable
fun DashboardTile(
    title: String,
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = clr_panel_bg,
        tonalElevation = 0.dp,
        shadowElevation = 0.dp,
        border = BorderStroke(1.dp, clr_panel_border),
        modifier = modifier.height(130.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(28.dp))
                    .background(clr_field_backgrnd)
                    .border(1.dp, clr_fieldStroke, RoundedCornerShape(28.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = clr_onPrimary)
            }
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = clr_onPrimary,
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(end = 6.dp)
            )
        }
    }
}



@Composable
fun DropdownField(
    label: String,
    options: List<String>,
    selected: String,
    onSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth()) {

        Text(label, color = clr_onPrimary)

        Box {
            OutlinedTextField(
                value = selected,
                onValueChange = {},
                readOnly = true,
                textStyle = LocalTextStyle.current.copy(color = clr_onPrimary),
                modifier = Modifier.fillMaxWidth(),
                trailingIcon = {
                    IconButton(onClick = { expanded = !expanded }) {
                        Icon(Icons.Filled.ArrowDropDown,
                            contentDescription = null,
                            tint = clr_onPrimary // sets arrow colour
                        )
                    }
                }
            )
            DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                options.forEach {
                    DropdownMenuItem(
                        text = { Text(
                            it)
                               },
                        onClick = {
                            onSelected(it); expanded = false
                        }
                    )
                }
            }
        }
    }
}



@Composable
fun RadioGroup(
    options: List<String>,
    selected: String,
    onSelect: (String) -> Unit
) {
    Column {
        options.forEach { opt ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                RadioButton(selected = selected == opt, onClick = { onSelect(opt) })
                Text(opt, color = clr_onPrimary)
            }
        }
    }
}