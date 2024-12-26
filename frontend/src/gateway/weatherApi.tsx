import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

// Interface for the weather response based on the weather.gov API structure
export interface WeatherResponse {
  properties: {
    periods: Array<{
      number: number;
      name: string;
      temperature: number;
      temperatureUnit: string; 
      windSpeed: string;
      windDirection: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
  };
}

export const weatherApi = {
  getWeather: async (latitude: number, longitude: number): Promise<WeatherResponse> => {
    try {
      const params = new URLSearchParams();
      params.append('latitude', latitude.toString());
      params.append('longitude', longitude.toString());
      const response = await axios.get<WeatherResponse>(
        `${BASE_URL}/weather?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching weather data:', error.message);
        throw new Error(`Failed to fetch weather data: ${error.message}`);
      }
      throw error;
    }
  }
};
