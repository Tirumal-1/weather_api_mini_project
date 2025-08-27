 import React, { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import Forecast from "./components/Forecast/Forecast";

import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mapping to interpret Open-Meteo weather codes
  const weatherCodeMap = {
    0: { icon: "☀️", desc: "Clear sky" },
    1: { icon: "🌤️", desc: "Mainly clear" },
    2: { icon: "⛅", desc: "Partly cloudy" },
    3: { icon: "☁️", desc: "Overcast" },
    45: { icon: "🌫️", desc: "Fog" },
    48: { icon: "🌫️", desc: "Depositing rime fog" },
    51: { icon: "🌧️", desc: "Light drizzle" },
    53: { icon: "🌧️", desc: "Moderate drizzle" },
    55: { icon: "🌧️", desc: "Dense drizzle" },
    56: { icon: "🌨️", desc: "Light freezing drizzle" },
    57: { icon: "🌨️", desc: "Dense freezing drizzle" },
    61: { icon: "🌦️", desc: "Slight rain" },
    63: { icon: "🌧️", desc: "Moderate rain" },
    65: { icon: "🌧️", desc: "Heavy rain" },
    66: { icon: "🌨️", desc: "Light freezing rain" },
    67: { icon: "🌨️", desc: "Heavy freezing rain" },
    71: { icon: "🌨️", desc: "Slight snow fall" },
    73: { icon: "🌨️", desc: "Moderate snow fall" },
    75: { icon: "❄️", desc: "Heavy snow fall" },
    77: { icon: "❄️", desc: "Snow grains" },
    80: { icon: "🌧️", desc: "Slight rain showers" },
    81: { icon: "🌧️", desc: "Moderate rain showers" },
    82: { icon: "⛈️", desc: "Violent rain showers" },
    85: { icon: "🌨️", desc: "Slight snow showers" },
    86: { icon: "❄️", desc: "Heavy snow showers" },
    95: { icon: "⛈️", desc: "Thunderstorm" },
    96: { icon: "⛈️", desc: "Thunderstorm with slight hail" },
    99: { icon: "⛈️", desc: "Thunderstorm with heavy hail" },
  };

  const weatherDescription = (code) => weatherCodeMap[code]?.desc || "Unknown";
  const weatherIcon = (code) => weatherCodeMap[code]?.icon || "❓";

  async function fetchLocation(cityName) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=1&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (!res.ok) throw new Error("Failed to get location");
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error("City not found");
    return data.results[0];
  }

  async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("Failed to get weather data");
    return res.json();
  }

  async function handleSearch() {
    setError("");
    setLoading(true);
    setCurrentWeather(null);
    setForecast([]);
    setLocation(null);
    try {
      const loc = await fetchLocation(city);
      setLocation(loc);

      const weatherData = await fetchWeather(loc.latitude, loc.longitude);

      setCurrentWeather(weatherData.current_weather);

      const daily = weatherData.daily;
      const forecastData = daily.time.map((date, idx) => ({
        date,
        tempMax: daily.temperature_2m_max[idx],
        tempMin: daily.temperature_2m_min[idx],
        weatherCode: daily.weathercode[idx],
      }));

      setForecast(forecastData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Weather Now - Quick City Forecast</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && <p className="error-message">{error}</p>}

      {currentWeather && location && (
        <>
          <CurrentWeather
            location={location}
            weather={currentWeather}
            icon={weatherIcon(currentWeather.weathercode)}
            description={weatherDescription(currentWeather.weathercode)}
          />

          <Forecast forecast={forecast} weatherIcon={weatherIcon} weatherDescription={weatherDescription} />
        </>
      )}
    </div>
  );
}

export default App;
