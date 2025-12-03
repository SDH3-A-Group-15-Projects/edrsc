package com.example.neuromind

import android.Manifest
import android.media.MediaRecorder
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.outlined.Mic
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File

// ---------------- Speech Test ---------------- \\
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpeechTestScreen(
    onBack: () -> Unit = {},
    onNext: () -> Unit = {}
) {
    val context = LocalContext.current

    val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
    )

    var isRecording by remember { mutableStateOf(false) }
    var recorder by remember { mutableStateOf<MediaRecorder?>(null) }
    var audioFile by remember { mutableStateOf<File?>(null) }

    var statusText by remember {
        mutableStateOf("Tap the microphone to start recording.")
    }

    var isUploading by remember { mutableStateOf(false) }
    var analysisResult by remember { mutableStateOf<SpeechAnalysisResponse?>(null) }
    var uploadError by remember { mutableStateOf<String?>(null) }

    // Permission launcher for RECORD_AUDIO
    val recordPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            startRecording(
                context = context,
                onStarted = { rec, file ->
                    recorder = rec
                    audioFile = file
                    isRecording = true
                    statusText = "Recording… tap again to stop."
                },
                onError = { msg ->
                    Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                    statusText = "Could not start recording."
                    isRecording = false
                }
            )
        } else {
            Toast.makeText(
                context,
                "Microphone permission is required to record.",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    fun handleMicClick() {
        if (!isRecording) {
            // Request permission then start
            recordPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        } else {
            // Stop and upload
            stopRecording(
                recorder = recorder,
                onStopped = {
                    recorder = null
                    isRecording = false
                    statusText = "Recording finished. Uploading…"
                    val file = audioFile
                    if (file != null && file.exists()) {
                        uploadAudioFile(
                            file = file,
                            onStart = {
                                isUploading = true
                                uploadError = null
                                analysisResult = null
                            },
                            onSuccess = { resp ->
                                isUploading = false
                                analysisResult = resp
                                statusText = "Upload complete."
                                if (resp == null) {
                                    Toast.makeText(
                                        context,
                                        "Upload succeeded but no analysis received.",
                                        Toast.LENGTH_LONG
                                    ).show()
                                } else {
                                    Toast.makeText(
                                        context,
                                        "Upload & analysis complete.",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            },
                            onError = { msg ->
                                isUploading = false
                                uploadError = msg
                                statusText = "Upload failed."
                                Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                            }
                        )
                    } else {
                        statusText = "No audio file to upload."
                        Toast.makeText(
                            context,
                            "No audio file found to upload.",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                },
                onError = { msg ->
                    recorder = null
                    isRecording = false
                    statusText = "Recording error."
                    Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                }
            )
        }
    }

    Scaffold(
        containerColor = Color.Transparent,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("2. Speech Test") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent,
                    titleContentColor = clr_onPrimary,
                    navigationIconContentColor = clr_onPrimary
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
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    "Assess the picture below",
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                    color = clr_onPrimary
                )
                Spacer(Modifier.height(8.dp))

                // image
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, clr_panel_border)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.farm_image),
                        contentDescription = "Picture prompt",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                    )
                }

                Spacer(Modifier.height(8.dp))
                Text(
                    "Please describe this picture for 1 minute",
                    color = clr_onPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(Modifier.height(16.dp))
                Text(
                    statusText,
                    color = clr_onPrimary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(24.dp))

                // Big mic button
                Surface(
                    onClick = { if (!isUploading) handleMicClick() },
                    shape = RoundedCornerShape(200.dp),
                    color = if (isRecording) clr_record else clr_button,
                    border = BorderStroke(4.dp, clr_record_border),
                    enabled = !isUploading
                ) {
                    Box(
                        modifier = Modifier
                            .size(200.dp)
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Mic,
                            contentDescription = if (isRecording) "Stop recording" else "Start recording",
                            tint = Color.White,
                            modifier = Modifier.size(72.dp)
                        )
                    }
                }

                if (isUploading) {
                    Spacer(Modifier.height(16.dp))
                    CircularProgressIndicator(color = clr_onPrimary)
                }

                // Show analysis result from backend, if any
                analysisResult?.let { res ->
                    Spacer(Modifier.height(24.dp))
                    Surface(
                        color = clr_panel_bg,
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, clr_panel_border),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            res.transcript?.let {
                                Text("Transcript:", color = clr_onPrimary)
                                Text(it, color = clr_onPrimary)
                            }
                            res.summary?.let {
                                Text("Summary:", color = clr_onPrimary)
                                Text(it, color = clr_onPrimary)
                            }
                            res.score?.let {
                                Text("Score: $it", color = clr_onPrimary)
                            }
                        }
                    }
                }

                uploadError?.let { err ->
                    Spacer(Modifier.height(12.dp))
                    Text(
                        text = err,
                        color = MaterialTheme.colorScheme.error
                    )
                }

                Spacer(Modifier.height(24.dp))

                Button(
                    onClick = onNext,
                    enabled = !isRecording && !isUploading,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = clr_button,
                        contentColor = clr_onPrimary
                    )
                ) { Text("Next") }
            }
        }
    }
}

// start recording audio to a temporary file in cacheDir
private fun startRecording(
    context: android.content.Context,
    onStarted: (MediaRecorder, File) -> Unit,
    onError: (String) -> Unit
) {
    try {
        val outputDir = context.cacheDir
        val outputFile = File(
            outputDir,
            "speech_recording_${System.currentTimeMillis()}.m4a"
        )
        val recorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setOutputFile(outputFile.absolutePath)
            prepare()
            start()
        }
        onStarted(recorder, outputFile)
    } catch (e: Exception) {
        e.printStackTrace()
        onError("Failed to start recording: ${e.localizedMessage ?: "Unknown error"}")
    }
}

// stop an active recording
private fun stopRecording(
    recorder: MediaRecorder?,
    onStopped: () -> Unit,
    onError: (String) -> Unit
) {
    if (recorder == null) {
        onError("Recorder was null.")
        return
    }
    try {
        recorder.stop()
    } catch (e: Exception) {
        e.printStackTrace()
        onError("Failed to stop recording: ${e.localizedMessage ?: "Unknown error"}")
    } finally {
        recorder.release()
        onStopped()
    }
}

// uploads recorded file using RetrofitClient and ApiService
private fun uploadAudioFile(
    file: File,
    onStart: () -> Unit,
    onSuccess: (SpeechAnalysisResponse?) -> Unit,
    onError: (String) -> Unit
) {
    if (!file.exists()) {
        onError("Audio file does not exist.")
        return
    }

    onStart()

    // use a realistic MIME type for AAC in MP4 container
    val mediaType = MediaType.parse("audio/mp4")

    val requestBody = RequestBody.create(mediaType, file)
    val part = MultipartBody.Part.createFormData(
        "audioFile",
        file.name,
        requestBody
    )

    RetrofitClient.instance.uploadSpeech(part).enqueue(
        object : Callback<SpeechAnalysisResponse> {
            override fun onResponse(
                call: Call<SpeechAnalysisResponse>,
                response: Response<SpeechAnalysisResponse>
            ) {
                if (response.isSuccessful) {
                    onSuccess(response.body())
                } else {
                    val msg = "Upload failed: ${response.code()} ${response.message()}"
                    onError(msg)
                }
            }

            override fun onFailure(call: Call<SpeechAnalysisResponse>, t: Throwable) {
                onError("Upload error: ${t.localizedMessage ?: "Unknown error"}")
            }
        }
    )
}
