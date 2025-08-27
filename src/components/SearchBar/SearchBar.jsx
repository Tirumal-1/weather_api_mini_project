import React from "react";
import "./SearchBar.css";

export default function SearchBar({ city, setCity, onSearch, loading }) {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="searchbar-input"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        disabled={loading}
        aria-label="City name input"
      />
      <button
        onClick={onSearch}
        disabled={loading || city.trim() === ""}
        className="searchbar-button"
        aria-label="Search weather"
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}
