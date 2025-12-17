package com.example.neuromind

import androidx.compose.ui.graphics.Color

// ---------- Core background & primary ----------

val clr_bckgrnd_top = Color(0xFF00132E)
val clr_bckgrnd_bottom = Color(0xFF3C4F68)

val clr_onPrimary = Color(0xFFFFFFFF)

// ---------- Input fields ----------

val clr_field_backgrnd = Color(0xFF072549)
val clr_fieldHint = Color(0xFFF8F8FA)
val clr_fieldText = Color(0xFFF8F8FA)
val clr_fieldStroke = Color(0xFF2A4057)

// ---------- Buttons & links ----------

val clr_button = Color(0xFF344862)
val clr_hyperLink = Color(0xFF8A83F7)

// ---------- Panels / cards ----------

val clr_panel_bg = clr_fieldStroke.copy(alpha = 0.08f)
val clr_panel_border = clr_fieldStroke.copy(alpha = 0.20f)

// ---------- Recording (Speech test) ----------

val clr_record = Color(0xFFEF5350)
val clr_record_border = Color(0xFFB71C1C)

// ---------- Headers / chips ----------

val clr_header = Color(0xFF64B5F6)          // Medical questionnaire header

// Result screen chip + tick circle
val clr_result_chip_bg = Color(0xFF9BE58C)
val clr_result_chip_text = Color(0xFF045016)

// ---------- Cognitive mini-test accents ----------

// Word colours (CognitiveMiniTestScreen)
val clr_word_apple = Color(0xFFE91E63)
val clr_word_orange = Color(0xFF673AB7)
val clr_word_banana = Color(0xFF1565C0)
val clr_word_mango = Color(0xFFF57C00)
val clr_word_kiwi = Color(0xFF00897B)

// Dark info bar ("words will disappear in 7 seconds")
val clr_dark_info_bar = Color(0xFF424242)

// ---------- Cognitive recall screen ----------

// Yellow instruction bar
val clr_recall_hint_bg = Color(0xFFFFF4C2)

// Green progress segments
val clr_progress_ok = Color(0xFF4CAF50)
