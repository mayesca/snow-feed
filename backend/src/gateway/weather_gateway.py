import json
from typing import Dict, Optional

import requests
from requests import Session

from backend.src.log_util import get_logger

LOG = get_logger(__name__)


class WeatherGateway:

    __DEFAULT_URL = "https://api.weather.gov/points/"

    def __init__(self):
        self.session = Session()

    def get_weather_data(self, latitude: float, longitude: float) -> Optional[Dict]:
        """
        Fetch weather data from weather.gov API based on latitude and longitude.

        Args:
            latitude (float): Latitude coordinate
            longitude (float): Longitude coordinate

        Returns:
            Optional[Dict]: Weather data dictionary or None if request fails
        """
        # Define headers (weather.gov requires a User-Agent)
        headers = {
            "User-Agent": "(myweatherapp.com, contact@myweatherapp.com)",
            "Accept": "application/json",
        }

        try:
            # First, get the grid endpoint for the coordinates
            points_url = f"{self.__DEFAULT_URL}{latitude},{longitude}"
            response = requests.get(points_url, headers=headers, timeout=10)
            response.raise_for_status()

            grid_data = response.json()
            forecast_url = grid_data["properties"]["forecast"]

            # Then, get the actual forecast
            forecast_response = requests.get(forecast_url, headers=headers, timeout=10)
            forecast_response.raise_for_status()

            return forecast_response.json()

        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None
        except (KeyError, json.JSONDecodeError) as e:
            print(f"Error parsing weather data: {e}")
            return None
