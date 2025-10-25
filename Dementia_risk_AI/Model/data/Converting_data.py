import pandas as pd

# Read the patient data CSV, ignoring extra commas
df = pd.read_csv("PatientData.csv")

# Clean up column names (remove empty unnamed ones)
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# Map sleep quality to approximate sleep hours
sleep_mapping = {
    "Poor": 5,
    "Good": 7
}

# Create new columns
df["sleep_hours"] = df["Sleep_Quality"].map(sleep_mapping)
df["memory_score"] = df["Cognitive_Test_Scores"]
df["risk"] = df["Dementia"]

# Keep and rename only the selected columns
new_df = df[["Age", "sleep_hours", "memory_score", "risk"]]
new_df.columns = ["age", "sleep_hours", "memory_score", "risk"]

# Save the transformed data
new_df.to_csv("dementia_risk_data.csv", index=False)

print(new_df)
