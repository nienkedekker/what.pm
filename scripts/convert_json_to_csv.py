import json
import pandas as pd
from datetime import datetime
import uuid

# Read raw JSON file
with open("items.json", "r") as file:
    raw_json = file.readlines()

# Wrap JSON objects in an array (if needed)
if not raw_json[0].strip().startswith("["):  # Avoid double-wrapping
    raw_json = "[\n" + ",\n".join(line.strip() for line in raw_json if line.strip()) + "\n]"
    with open("fixed_data.json", "w") as fixed_file:
        fixed_file.write(raw_json)
    print("✅ Wrapped JSON objects in an array.")


    # Save the fixed JSON
    with open("fixed_data.json", "w") as fixed_file:
        fixed_file.write(raw_json)
    print("✅ Wrapped JSON objects in an array.")
else:
    print("✅ JSON was already wrapped in an array.")

# Now load the fixed JSON (not the original items.json)
with open("fixed_data.json", "r") as file:
    data = json.load(file)

def to_int(value):
    """Ensure value is always stored as an integer."""
    if value in [None, "", "NaN"]:
        return None
    try:
        num = float(value)  # Convert to float first
        return int(num)  # Convert to int (removes .0)
    except ValueError:
        return None  # If it's invalid, return None

def parse_datetime(date_str):
    """Handle timestamps with or without milliseconds."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")  # Full precision
    except ValueError:
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")  # No milliseconds

def strip_milliseconds(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S") if dt else None

transformed_data = []
for item in data:
    season_value = to_int(item.get("season", None))  # Convert to integer
    print(f"Processed season value: {season_value} (Type: {type(season_value)})")  # Debugging

    transformed_data.append({
        "id": str(uuid.uuid4()),  # Generate a new UUID
        "title": item["title"],
        "author": item.get("author", None),
        "director": item.get("director", None),
        "season": season_value,  # Use already converted integer value
        "published_year": to_int(item["published_year"]),  # Force integer conversion
        "belongs_to_year": to_int(item["belongs_to_year"]),  # Prevent float issues
        "redo": item["redo"],
        "itemtype": item["itemtype"],
        "updated_date": strip_milliseconds(parse_datetime(item["updated_date"]["$date"])),
        "created_at": strip_milliseconds(parse_datetime(item["createdAt"]["$date"])),
        "updated_at": strip_milliseconds(parse_datetime(item["updatedAt"]["$date"])),
    })

# Convert to DataFrame
df = pd.DataFrame(transformed_data)

# Save as CSV with forced integer formatting
df.to_csv("data.csv", index=False, encoding="utf-8", float_format="%.0f")

print("✅ CSV file created successfully!")
