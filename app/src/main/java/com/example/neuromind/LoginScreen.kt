package com.example.neuromind

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.firebase.auth.FirebaseAuth

@Composable
fun LoginScreen(
    onLoggedIn: (String) -> Unit = {},
    onForgotPassword: () -> Unit = {}
) {
    val context = LocalContext.current
    val auth = remember { FirebaseAuth.getInstance() }

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }

    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(brush = gradient, shape = RectangleShape)
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
                .align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(id = R.drawable.neuromind_logo),
                contentDescription = "NeuroMind Logo",
                modifier = Modifier
                    .width(200.dp)
                    .height(400.dp),
                contentScale = ContentScale.Crop
            )

            Spacer(Modifier.height(16.dp))

            RoundedFilledField(
                value = email,
                onValueChange = { email = it },
                placeholder = "Email",
                textColor = clr_fieldText,
                hintColor = clr_fieldHint,
                fillColor = clr_field_backgrnd,
                strokeColor = clr_fieldStroke,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            Spacer(Modifier.height(16.dp))

            RoundedFilledField(
                value = password,
                onValueChange = { password = it },
                placeholder = "Password",
                textColor = clr_fieldText,
                hintColor = clr_fieldHint,
                fillColor = clr_field_backgrnd,
                strokeColor = clr_fieldStroke,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                trailingContent = {
                    TextButton(onClick = { showPassword = !showPassword }) {
                        Text(
                            if (showPassword) "Hide" else "Show",
                            fontSize = 12.sp,
                            color = clr_hyperLink
                        )
                    }
                }
            )

            Spacer(Modifier.height(16.dp))

            Button(
                onClick = {
                    Toast.makeText(context, "Attempting login…", Toast.LENGTH_SHORT).show()
                    val e = email.trim()
                    val p = password
                    if (e.isBlank() || p.isBlank()) {
                        Toast.makeText(context, "Enter email and password", Toast.LENGTH_SHORT)
                            .show()
                        return@Button
                    }
                    if (p.length < 6) {
                        Toast.makeText(
                            context,
                            "Password must be at least 6 characters",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@Button
                    }

                    auth.signInWithEmailAndPassword(e, p)
                        .addOnSuccessListener {
                            val u = auth.currentUser
                            val name = (u?.displayName?.takeIf { it.isNotBlank() } ?: u?.email
                            ?: "User")
                            onLoggedIn(name)
                        }
                        .addOnFailureListener {
                            auth.createUserWithEmailAndPassword(e, p)
                                .addOnSuccessListener {
                                    val u = auth.currentUser
                                    val name =
                                        (u?.displayName?.takeIf { it.isNotBlank() } ?: u?.email
                                        ?: "User")
                                    onLoggedIn(name)
                                }
                                .addOnFailureListener { err ->
                                    Toast.makeText(
                                        context,
                                        err.localizedMessage ?: "Auth failed",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                        }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = clr_button,
                    contentColor = clr_onPrimary
                ),
                shape = RoundedCornerShape(12.dp)
            ) { Text("Login") }

            Spacer(Modifier.height(8.dp))

            TextButton(
                onClick = { onForgotPassword() },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "Forgot Password?",
                    color = clr_hyperLink,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }

        }
    }
}