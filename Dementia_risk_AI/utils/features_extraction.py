import re  #regular expressions

def extract_speech_features(text):

    # Clean up text
    words = re.findall(r"\b\w+\b", text.lower())

    # Count total words
    word_count = len(words)

    # Calculate average word length
    avg_word_len = sum(len(w) for w in words) / word_count if word_count > 0 else 0

    # Count filler words
    fillers = {"um", "uh", "like", "you know"}
    filler_count = sum(1 for w in words if w in fillers)

    return word_count, avg_word_len, filler_count
