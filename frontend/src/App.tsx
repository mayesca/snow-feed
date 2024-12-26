import React, { useState, useEffect } from "react";
import "./App.css";
import WeatherView from "./components/weatherView.tsx";
import { weatherApi, WeatherResponse } from "./gateway/weatherApi.tsx";
import SkiResortView from "./components/skiResortView.tsx";
import { skiResortApi, SkiResort } from "./gateway/skiResortApi.tsx";

function App() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedResort, setSelectedResort] = useState<SkiResort | null>(null);
  const [skiResorts, setSkiResorts] = useState<SkiResort[]>([]);
  const [loadingResorts, setLoadingResorts] = useState(true);

  const fetchSkiResorts = async () => {
    try {
      setLoadingResorts(true);
      const resorts = await skiResortApi.getSkiResorts();
      setSkiResorts(resorts);
    } catch (error) {
      console.error("Error fetching ski resorts:", error);
    } finally {
      setLoadingResorts(false);
    }
  };

  useEffect(() => {
    fetchSkiResorts();
  }, []);

  const handleResortSelect = (resort: SkiResort | null) => {
    setSelectedResort(resort);
    setWeatherData(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ski Weather</h1>
        <p className="text-gray-600 mb-8">
          Add ski resorts and find weather data for your upcoming snowboarding
          trip.
        </p>
        {loadingResorts ? (
          <p className="text-lg text-gray-500 animate-pulse">
            Loading ski resorts...
          </p>
        ) : (
          <div className="mb-6">
            <SkiResortView
              resorts={skiResorts}
              onSelect={handleResortSelect}
              selectedResort={selectedResort}
              setResorts={setSkiResorts}
              setWeatherData={setWeatherData}
              setError={setError}
              onRefresh={fetchSkiResorts}
            />
          </div>
        )}

        <WeatherView weatherData={weatherData} error={error} />
      </header>
    </div>
  );
}

export default App;
