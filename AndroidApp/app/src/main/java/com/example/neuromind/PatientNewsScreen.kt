package com.example.neuromind

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.outlined.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PatientNewsScreen(
        onBack: () -> Unit = {},
viewModel: PatientNewsViewModel = viewModel()
) {
val gradient = Brush.verticalGradient(
        0.0f to clr_bckgrnd_top,
        0.66f to clr_bckgrnd_top,
        1.0f to clr_bckgrnd_bottom
)

val context = LocalContext.current

val newsState by viewModel.newsState.collectAsStateWithLifecycle()
val articles by viewModel.articles.collectAsStateWithLifecycle()

LaunchedEffect(Unit) {
    viewModel.loadNews()
}

Scaffold(
        containerColor = Color.Transparent,
        topBar = {
    CenterAlignedTopAppBar(
            title = { Text("Dementia News", color = clr_onPrimary) },
            navigationIcon = {
                    IconButton(onClick = onBack) {
                    Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = clr_onPrimary
                    )
            }
            },
            actions = {
                    IconButton(onClick = { viewModel.refreshNews() }) {
                    Icon(
                            imageVector = Icons.Outlined.Refresh,
                            contentDescription = "Refresh",
                            tint = clr_onPrimary
                    )
            }
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent,
                    navigationIconContentColor = clr_onPrimary,
                    titleContentColor = clr_onPrimary,
                    actionIconContentColor = clr_onPrimary
            )
    )
}
    ) { inner ->
Box(
        modifier = Modifier
                .fillMaxSize()
                .background(brush = gradient)
                .padding(inner)
        ) {
Column(
        modifier = Modifier
                .fillMaxSize()
                    .padding(16.dp)
            ) {

// Header chip
Surface(
        color = clr_panel_bg,
        shape = RoundedCornerShape(12.dp),
tonalElevation = 0.dp,
shadowElevation = 0.dp,
modifier = Modifier.fillMaxWidth()
                ) {
Text(
        text = "Latest dementia & Alzheimer’s articles\nfor patients and carers.",
        color = clr_onPrimary,
        modifier = Modifier.padding(12.dp),
fontWeight = FontWeight.Medium
                    )
                            }

Spacer(Modifier.height(12.dp))

when (newsState) {
    is PatientNewsViewModel.NewsState.Loading -> {
        Box(
                modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 32.dp),
                contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator(color = clr_onPrimary)
        }
    }

    is PatientNewsViewModel.NewsState.Error -> {
        val msg = (newsState as PatientNewsViewModel.NewsState.Error).message
        Text(
                text = "Could not load news:\n$msg",
                color = MaterialTheme.colorScheme.error
        )
    }

                    else -> {
        if (articles.isEmpty()) {
            Text(
                    text = "No articles found. Try refreshing.",
                    color = clr_onPrimary
            )
        } else {
            LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(articles) { article ->
                        NewsArticleCard(article = article)
                }
            }
        }
    }
}
            }
                    }
                    }
                    }

@Composable
private fun NewsArticleCard(article: PatientArticle) {
    val context = LocalContext.current

    Surface(
            color = clr_panel_bg,
            shape = RoundedCornerShape(16.dp),
            tonalElevation = 0.dp,
            shadowElevation = 0.dp,
            modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
        if (article.url.isNotBlank()) {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(article.url))
            context.startActivity(intent)
        } else {
            Toast
                    .makeText(context, "No link available", Toast.LENGTH_SHORT)
                    .show()
        }
    }
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                    text = article.title,
                    color = clr_onPrimary,
                    fontWeight = FontWeight.SemiBold
            )
            Spacer(Modifier.height(4.dp))
            Text(
                    text = "${article.source} • ${article.date}",
                    color = clr_onPrimary.copy(alpha = 0.7f),
                    style = MaterialTheme.typography.bodySmall
            )

            Spacer(Modifier.height(8.dp))
            Text(
                    text = article.description,
                    color = clr_onPrimary,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
            )

            if (article.actionable_tips.isNotEmpty()) {
                Spacer(Modifier.height(8.dp))
                Text(
                        text = "Practical tips:",
                        color = clr_onPrimary,
                        fontWeight = FontWeight.SemiBold,
                        style = MaterialTheme.typography.bodySmall
                )
                article.actionable_tips.take(3).forEach { tip ->
                        Text(
                                text = "• $tip",
                                color = clr_onPrimary,
                                style = MaterialTheme.typography.bodySmall
                        )
                }
            }

            Spacer(Modifier.height(8.dp))
            Text(
                    text = "Tap to read full article",
                    color = clr_hyperLink,
                    style = MaterialTheme.typography.bodySmall,
                    )
        }
    }
}
