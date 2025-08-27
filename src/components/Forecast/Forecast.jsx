import React from "react";
import "./Forecast.css";

export default function Forecast({ forecast, weatherIcon, weatherDescription }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="forecast">
      <h3 className="forecast__title">5-Day Forecast</h3>
      <div className="forecast__list">
        {forecast.map(({ date, tempMax, tempMin, weatherCode }) => (
          <div
            key={date}
            className="forecast__day"
            title={weatherDescription(weatherCode)}
          >
            <p className="forecast__date">
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
            <div className="forecast__icon">{weatherIcon(weatherCode)}</div>
            <p className="forecast__temp">
              {Math.round(tempMax)}° / {Math.round(tempMin)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
