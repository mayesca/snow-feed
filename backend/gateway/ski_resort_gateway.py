import csv
import os
from flask import abort
from backend.log_util import get_logger
from flask import Response
from jsonschema import ValidationError, validate

LOG = get_logger(__name__)

POST_SKI_RESORT_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "region": {"type": "string"},
        "state": {"type": "string"},
        "latitude": {"type": "number", "minimum": -90, "maximum": 90},
        "longitude": {"type": "number", "minimum": -180, "maximum": 180},
    },
    "required": ["name", "region", "state", "latitude", "longitude"],
}


class SkiResortGateway:

    def pre_load(self):
        """
        Loads the ski resorts from the csv file into the ski_resorts list and converts it to json
        """
        self.ski_resorts = []
        # Get the current file's directory and construct relative path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(current_dir, "..", "data", "favorite_ski_resorts.csv")

        with open(csv_path, "r") as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                resort = {
                    "region": row["Region"],
                    "state": row["State"],
                    "name": row["Name"],
                    "latitude": float(row["Latitude"]),
                    "longitude": float(row["Longitude"]),
                }
                self.ski_resorts.append(resort)

    def __init__(self):
        self.pre_load()

        self.resort_map = {resort["name"]: resort for resort in self.ski_resorts}

    def get_ski_resorts(self) -> list[dict]:
        return self.ski_resorts

    def post_ski_resort(self, resort: dict) -> dict:
        try:
            validate(resort, POST_SKI_RESORT_SCHEMA)
        except ValidationError as e:
            return Response(f"Invalid resort data!", status=400)

        case_insensitive_name = resort["name"].lower()
        case_insensitive_keys = [key.lower() for key in self.resort_map.keys()]
        if case_insensitive_name in case_insensitive_keys:
            return Response("Resort already exists", status=400)

        # Add to in-memory storage
        self.resort_map[resort["name"]] = resort
        self.ski_resorts.append(resort)

        # Get the CSV path (reusing the path construction from pre_load)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(current_dir, "..", "data", "favorite_ski_resorts.csv")

        # Append the new resort to the CSV file
        with open(csv_path, "a", newline="") as file:
            writer = csv.DictWriter(
                file, fieldnames=["Region", "State", "Name", "Latitude", "Longitude"]
            )
            writer.writerow(
                {
                    "Region": resort["region"],
                    "State": resort["state"],
                    "Name": resort["name"],
                    "Latitude": resort["latitude"],
                    "Longitude": resort["longitude"],
                }
            )

        return resort

    def delete_ski_resort(self, name: str) -> dict:
        case_insensitive_name = name.lower()
        case_insensitive_keys = [key.lower() for key in self.resort_map.keys()]
        if case_insensitive_name in case_insensitive_keys:
            # Remove from in-memory storage
            del self.resort_map[name]
            self.ski_resorts = [
                resort for resort in self.ski_resorts if resort["name"] != name
            ]

            # Get the CSV path
            current_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(
                current_dir, "..", "data", "favorite_ski_resorts.csv"
            )

            # Read existing data
            temp_resorts = []
            with open(csv_path, "r", newline="") as file:
                reader = csv.DictReader(file)
                temp_resorts = [row for row in reader if row["Name"] != name]

            # Write back all resorts except the deleted one
            with open(csv_path, "w", newline="") as file:
                writer = csv.DictWriter(
                    file,
                    fieldnames=["Region", "State", "Name", "Latitude", "Longitude"],
                )
                writer.writeheader()
                writer.writerows(temp_resorts)

            return Response("Resort deleted", status=200)

        return Response("Resort already deleted", status=200)
