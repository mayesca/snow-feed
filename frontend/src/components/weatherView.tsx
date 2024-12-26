import React from 'react';
import { WeatherResponse } from '../gateway/weatherApi';

interface WeatherViewProps {
  weatherData: WeatherResponse | null;
  error: string;
}

const WeatherView: React.FC<WeatherViewProps> = ({ weatherData, error }) => {
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Time</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Temperature</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Conditions</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Wind</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {weatherData.properties.periods.map((period, index) => (
            <tr key={period.number} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {period.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {period.temperature}°{period.temperatureUnit}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {period.shortForecast}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {period.windSpeed} {period.windDirection}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherView; 