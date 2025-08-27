import React from "react";
import "./CurrentWeather.css";

export default function CurrentWeather({ location, weather, icon }) {
  if (!weather) return null;

  return (
    <div className="current-weather">
      <h2 className="current-weather__location">
        {location.name}, {location.country}
      </h2>

      <div className="current-weather__details">
        <span className="current-weather__icon">{icon}</span>
        <div>
          <p className="current-weather__temperature">
            {Math.round(weather.temperature)}°C
          </p>
          <p className="current-weather__description">{weather.description}</p>
          <p className="current-weather__wind">
            Wind: {Math.round(weather.windspeed)} km/h
          </p>
        </div>
      </div>
    </div>
  );
}
