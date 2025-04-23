import pandas as pd
import json

# Load CSV
csv_file = "data/mental_health_data.csv"
json_file = "data/mental_health_data.json"

# Read CSV
df = pd.read_csv(csv_file)

# Convert to proper JSON format
json_data = []
for _, row in df.iterrows():
    json_data.append({
        "input": row["clean_text"],
        "output": "I'm here to help. Can you tell me more about how you're feeling?"
    })

# Save JSON file
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(json_data, f, indent=4)

print("✅ JSON file created successfully!")
