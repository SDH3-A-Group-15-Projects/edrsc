import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Check folders exist
os.makedirs("model", exist_ok=True)
os.makedirs("data", exist_ok=True)

DATA_PATH = "data/dementia_risk_data.csv"

# Load dataset
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Please place 'dementia_risk_data.csv' inside the 'data' folder.")

df = pd.read_csv(DATA_PATH)

# Check if speech features exist in dataset
required_features = ["age", "sleep_hours", "memory_score"]
speech_features = ["word_count", "avg_word_len", "filler_count"]

# Add speech features to the feature list if they exist
available_features = required_features.copy()
for feature in speech_features:
    if feature in df.columns:
        # Fill NaN values with 0
        df[feature] = df[feature].fillna(0)
        # Convert to numeric (in case there are strings)
        df[feature] = pd.to_numeric(df[feature], errors='coerce').fillna(0)
        available_features.append(feature)
    else:
        print(f"⚠️  Warning: '{feature}' not found in dataset. Adding placeholder column with zeros.")
        df[feature] = 0
        available_features.append(feature)

# Fill any NaN values in risk column
df['risk'] = df['risk'].fillna(0).astype(int)

# Define features and labels
X = df[available_features]
y = df["risk"]

print(f"\n📊 Training with features: {available_features}")
print(f"Dataset shape: {X.shape}")
print(f"Risk distribution:\n{y.value_counts()}\n")

# Split into train/test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# Evaluate model
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model trained successfully!")
print(f"Accuracy: {accuracy*100:.2f}%\n")

# Only show classification report if we have both classes in test set
if len(set(y_test)) > 1:
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
else:
    print("Note: Test set too small for full classification report.")

# Save model and scaler
joblib.dump(model, "model/risk_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")

print("\n💾 Model and scaler saved successfully!")
print(f"Features used: {available_features}")