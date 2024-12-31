import React, { useState, useEffect } from "react";
import { SkiResort, skiResortApi } from "../gateway/skiResortApi.tsx";
import { AddSkiResortForm } from "./addSkiResortForm.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { WeatherResponse, weatherApi } from "../gateway/weatherApi.tsx";

interface SkiResortViewProps {
  resorts: SkiResort[];
  onSelect: (resort: SkiResort | null) => void;
  selectedResort: SkiResort | null;
  setResorts: (resorts: SkiResort[]) => void;
  setWeatherData: (data: WeatherResponse | null) => void;
  setError: (error: string) => void;
  onRefresh: () => Promise<void>;
}

const SkiResortView: React.FC<SkiResortViewProps> = ({
  resorts,
  onSelect,
  selectedResort,
  setResorts,
  setWeatherData,
  setError,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Only select first resort when there's no selection and resorts are available
  useEffect(() => {
    if (resorts.length > 0 && !selectedResort) {
      onSelect(resorts[0]);
    }
  }, [resorts]); // Only depend on resorts array changing

  const handleDelete = async (resort: SkiResort) => {
    try {
      await skiResortApi.deleteSkiResort(resort.name);

      // Remove from resorts list
      const updatedResorts = resorts.filter((r) => r.name !== resort.name);
      setResorts(updatedResorts);

      // If this was the selected resort, select another resort or clear selection
      if (selectedResort?.name === resort.name) {
        if (updatedResorts.length > 0) {
          onSelect(updatedResorts[0]);
        } else {
          onSelect(null);
        }
      }

      // Clear any weather data
      setWeatherData(null);
      setError("");

      // Optionally refresh the list from the server
      onRefresh();
    } catch (error) {
      console.error("Failed to delete resort:", error);
      setError("Failed to delete resort. Please try again.");
    }
  };

  const handleGetWeather = async () => {
    if (!selectedResort) return;

    try {
      const data = await weatherApi.getWeather(
        selectedResort.latitude,
        selectedResort.longitude
      );
      setWeatherData(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Error:", err);
    }
  };

  const fetchResorts = async () => {
    try {
      const response = await skiResortApi.getSkiResorts();
      setResorts(response);
    } catch (error) {
      console.error("Error fetching resorts:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchResorts();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center gap-2">
        <select
          onChange={(e) => {
            const resort = resorts.find((r) => r.name === e.target.value);
            if (resort) onSelect(resort);
          }}
          value={selectedResort?.name || ""}
          className="block w-full px-4 py-2.5 text-base
                  text-gray-900 font-medium
                  bg-white border border-gray-300
                  rounded-lg shadow-sm
                  hover:border-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  cursor-pointer
                  appearance-none
                  relative
                  bg-no-repeat bg-right
                  bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                  bg-[length:1.5em]
                  pr-12"
        >
          {resorts.map((resort) => (
            <option key={resort.name} value={resort.name}>
              {resort.name}, {resort.state} - {resort.region}
            </option>
          ))}
        </select>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Refresh resorts"
          disabled={isRefreshing}
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh Resorts"}
        </button>

        <AddSkiResortForm resorts={resorts} setResorts={setResorts} />
      </div>

      <div className="flex justify-center space-x-6 mt-4">
        <button
          onClick={handleGetWeather}
          disabled={!selectedResort}
          className={`
            flex items-center justify-center
            min-w-[200px] px-4 py-2
            text-white font-medium
            bg-blue-600 hover:bg-blue-700
            rounded-lg shadow-sm
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Get Weather for {selectedResort?.name || "Selected Resort"}
        </button>

        <button
          onClick={() => selectedResort && handleDelete(selectedResort)}
          disabled={!selectedResort}
          className={`
            flex items-center justify-center
            min-w-[200px] px-4 py-2
            text-red-600 font-medium
            bg-white hover:bg-red-50
            border border-red-600
            rounded-lg shadow-sm
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <DeleteIcon className="w-5 h-5 mr-2" />
          {selectedResort ? `Delete ${selectedResort.name}` : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default SkiResortView;
