package com.example.neuromind

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.platform.LocalContext
import com.google.firebase.BuildConfig
import com.google.firebase.Firebase
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth

// Main activity = entry point for app
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this) // initalises firebase
        if (BuildConfig.DEBUG) {
            com.google.firebase.auth.FirebaseAuth.getInstance()
                .useEmulator("10.0.2.2", 9099) // Android emulator
        }
        setContent { LoginScreen() } // sets content for page
    }
}

@Composable
fun LoginScreen() {
    // --- Colour Palette ---
    val clr_bckgrnd_top = Color(0xFF00132E)
    val clr_bckgrnd_bottom = Color(0xFF3C4F68)
    val clr_field_backgrnd = Color(0xFF072549)
    val clr_fieldHint = Color(0xFFF8F8FA)
    val clr_fieldText = Color(0xFFF8F8FA)
    val clr_button = Color(0xFF344862)
    val clr_onPrimary = Color(0xFFFFFFFF)
    val clr_hyperLink = Color(0xFF8A83F7)
    val clr_fieldStroke = Color(0xFF2A4057)

    val context = LocalContext.current // shows toast messages

    val auth = remember { FirebaseAuth.getInstance() }

    // --- State Variables ---
    // these hold dynamic text values, entered by user values
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }

    // --- 66/33 vertical gradient background ---
    val gradient = Brush.verticalGradient(
        colorStops = arrayOf(
            0.0f to clr_bckgrnd_top,
            0.66f to clr_bckgrnd_top,
            1.0f to clr_bckgrnd_bottom
        )
    )

    // --- Root Layout ---
    // root container with gradient + padding
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(brush = gradient, shape = RectangleShape)
            .padding(24.dp)
    ) {
        // Centered column/Vertical stack
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
                .align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Logo
            Image(
                painter = painterResource(id = R.drawable.neuromind_logo),
                contentDescription = "NeuroMind Logo",
                modifier = Modifier
                    .width(200.dp)
                    .height(400.dp),
                contentScale = ContentScale.Crop
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Username field with rounded rect, background fill, and stroke
            RoundedFilledField(
                value = username,
                onValueChange = { username = it },
                placeholder = "Username",
                textColor = clr_fieldText,
                hintColor = clr_fieldHint,
                fillColor = clr_field_backgrnd,
                strokeColor = clr_fieldStroke,
                keyboardOptions = KeyboardOptions(keyboardType =
                    KeyboardType.Text)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password input field
            RoundedFilledField(
                value = password,
                onValueChange = { password = it },
                placeholder = "Password",
                textColor = clr_fieldText,
                hintColor = clr_fieldHint,
                fillColor = clr_field_backgrnd,
                strokeColor = clr_fieldStroke,
                keyboardOptions = KeyboardOptions(keyboardType =
                    KeyboardType.Password),
                visualTransformation = if (showPassword)
                    VisualTransformation.None else
                        PasswordVisualTransformation(),
                trailingContent = {
                    TextButton(onClick = { showPassword = !showPassword }) {
                        Text(if (showPassword) "Hide" else "Show",
                            fontSize = 12.sp, color = clr_hyperLink)
                    }
                }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Login button
            Button(
                onClick = {
                    val email = email.trim()
                    val pword = pass

                    if (email.isBlank() || pword.isBlank()) {
                        Toast.makeText(context, "Enter email and password",
                            Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    if (pword.length < 6) {
                        Toast.makeText(context, "Password must" +
                                " be at least 6 characters",
                            Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    Log.d("Auth", "signInWithEmailAndPassword($email)")
                    auth.signInWithEmailAndPassword(email, pword)
                        .addOnCompleteListener { signIn ->
                            if (signIn.isSuccessful) {
                                Log.d("Auth", "signIn " +
                                        "SUCCESS uid=${signIn.result?.user?.uid}")
                                Toast.makeText(context, "Logged in!",
                                    Toast.LENGTH_SHORT).show()
                                // TODO: navigate to next screen
                            } else {
                                Log.w("Auth", "signIn FAILED",
                                    signIn.exception)
                                Log.d("Auth",
                                    "createUserWithEmailAndPassword($email)")
                                auth.createUserWithEmailAndPassword(email,
                                    pword)
                                    .addOnCompleteListener { create ->
                                        if (create.isSuccessful) {
                                            Log.d("Auth",
                                                "createUser SUCCESS" +
                                                        " uid=${create.result?.user?.uid}")
                                            Toast.makeText(context,
                                                "Account created!",
                                                Toast.LENGTH_SHORT).show()
                                            // TODO: navigate
                                        } else {
                                            Log.e("Auth",
                                                "createUser FAILED",
                                                create.exception)
                                            Toast.makeText(
                                                context,
                                                create.exception?.localizedMessage ?:
                                                "Auth failed",
                                                Toast.LENGTH_LONG
                                            ).show()
                                        }
                                    }
                            }
                        }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = clr_button,
                    contentColor = clr_onPrimary
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Login")
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Forgot Password
            TextButton(
                onClick = {
                    Toast.makeText(context, "Password recovery not" +
                            " implemented yet",
                        Toast.LENGTH_SHORT).show()
                },
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

@Composable
private fun RoundedFilledField(
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

    // Outer box gives us the stroke
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .border(BorderStroke(2.dp, strokeColor), shape)
            .background(fillColor, shape)
            .padding(horizontal = 12.dp)
    ) {
        // TextField with transparent container
        TextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = {
                Text(placeholder, color = hintColor)
            },
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
