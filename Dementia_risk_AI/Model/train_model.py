import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib

#  Check folders exist
os.makedirs("model", exist_ok=True)
os.makedirs("data", exist_ok=True)


DATA_PATH = "data/dementia_risk_data.csv"

#  Load dataset
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f" Dataset not found at {DATA_PATH}. Please place 'dementia_risk_data.csv' inside the 'data' folder.")

df = pd.read_csv(DATA_PATH)

# Define features and labels
X = df[["age", "sleep_hours", "memory_score"]]
y = df["risk"]

# Split into train/test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#  Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

#  Train model
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# Save model and scaler
joblib.dump(model, "model/risk_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")

print("✅ Model trained and saved successfully using data/dementia_risk_data.csv!")
