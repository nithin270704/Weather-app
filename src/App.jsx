import React, { useState } from "react";
import {
  Search, MapPin, Wind, Droplets, Gauge, Sun, CloudSun, Cloud,
  CloudRain, CloudLightning, CloudSnow, Sunrise, Sunset, Eye,
  Compass, Thermometer, LocateFixed, Umbrella, Moon, CalendarDays
} from "lucide-react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


function weatherIcon(main, size = 48) {
  const value = (main || "").toLowerCase();
  if (value.includes("thunder")) return <CloudLightning size={size} />;
  if (value.includes("rain") || value.includes("drizzle")) return <CloudRain size={size} />;
  if (value.includes("snow")) return <CloudSnow size={size} />;
  if (value.includes("cloud")) return <CloudSun size={size} />;
  if (value.includes("clear")) return <Sun size={size} />;
  return <Cloud size={size} />;
}

function dayName(timestamp, options = {}) {
  return new Date(timestamp * 1000).toLocaleDateString("en-IN", options);
}

export default function App() {
  const [query, setQuery] = useState("Srikalahasti");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric");

  async function searchWeather(city = query, nextUnit = unit) {
    if (!city.trim()) {
      setError("Enter a city name to see its weather.");
      return;
    }
    if (!API_KEY) {
      setError("Add your OpenWeather API key to the .env file, then restart the app.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${nextUnit}&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${nextUnit}&appid=${API_KEY}`;
      const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      if (!currentRes.ok) throw new Error(currentData.message || "Could not find that city.");
      if (!forecastRes.ok) throw new Error(forecastData.message || "Could not load the forecast.");
      setWeather(currentData);
      setForecast(forecastData.list || []);
      setQuery(currentData.name);
      setUnit(nextUnit);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    searchWeather();
  }

  const tempSymbol = unit === "metric" ? "°C" : "°F";
  const dailyForecast = forecast.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
  const formatTemp = (value) => `${Math.round(value)}${tempSymbol}`;

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="WeatherNow home">
          <span className="brand-mark"><CloudSun size={23} /></span>
          <span>weather<span className="brand-accent">now</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-dot" /> Live weather
          <span className="topbar-divider" />
          <button className="unit-toggle" onClick={() => searchWeather(query, unit === "metric" ? "imperial" : "metric")} disabled={loading}>
            °{unit === "metric" ? "C" : "F"} <span className="toggle-separator">/</span> °{unit === "metric" ? "F" : "C"}
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="intro">
          <p className="eyebrow"><span /> YOUR PERSONAL WEATHER STATION</p>
          <h1>Forecast your <span>day.</span></h1>
          <p className="intro-copy">A little sunshine, a little clarity. Know what the sky has planned.</p>
          <form className="search-form" onSubmit={onSubmit}>
            <Search size={20} className="search-icon" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search any city..." aria-label="Search city" />
            <button type="submit" disabled={loading}>{loading ? <span className="spinner" /> : "Search"} <span className="search-arrow">↗</span></button>
          </form>
          {error && <div className="error-message" role="alert">{error}</div>}
          {!weather && !error && <p className="helper-text">Try Kavali, Hyderabad, London or Tokyo</p>}
        </section>

        {weather ? (
          <>
            <section className="weather-hero panel">
              <div className="hero-left">
                <div className="location-line"><MapPin size={16} /> {weather.name}, {weather.sys.country}</div>
                <div className="hero-temp-row">
                  <h2>{formatTemp(weather.main.temp)}</h2>
                  <div className="hero-condition-icon">{weatherIcon(weather.weather[0].main, 72)}</div>
                </div>
                <p className="condition-text">{weather.weather[0].description}</p>
                <p className="feels-like">Feels like <strong>{formatTemp(weather.main.feels_like)}</strong> <span>·</span> H: {formatTemp(weather.main.temp_max)} &nbsp; L: {formatTemp(weather.main.temp_min)}</p>
              </div>
              <div className="hero-right">
                <div className="sun-orbit"><div className="sun-core"><Sun size={52} /></div><span className="orbit-dot" /></div>
                <div className="hero-note"><span>THE SKY RIGHT NOW</span><strong>{weather.weather[0].main}</strong><small>Make today a good one.</small></div>
              </div>
            </section>

            <section className="stats-grid" aria-label="Weather details">
              <article className="stat-card panel"><div className="stat-icon humidity"><Droplets size={19} /></div><span className="stat-label">Humidity</span><strong>{weather.main.humidity}<small>%</small></strong><div className="stat-track"><span style={{ width: `${weather.main.humidity}%` }} /></div><p>Moisture in the air</p></article>
              <article className="stat-card panel"><div className="stat-icon wind"><Wind size={19} /></div><span className="stat-label">Wind speed</span><strong>{weather.wind.speed}<small> {unit === "metric" ? "m/s" : "mph"}</small></strong><p>Near-surface wind</p></article>
              <article className="stat-card panel"><div className="stat-icon pressure"><Gauge size={19} /></div><span className="stat-label">Pressure</span><strong>{weather.main.pressure}<small> hPa</small></strong><p>Atmospheric pressure</p></article>
              <article className="stat-card panel"><div className="stat-icon visibility"><Eye size={19} /></div><span className="stat-label">Visibility</span><strong>{(weather.visibility / 1000).toFixed(1)}<small> km</small></strong><p>How far you can see</p></article>
            </section>

            <section className="forecast-section">
              <div className="section-heading"><div><p className="eyebrow">PLAN AHEAD</p><h2>5-day forecast</h2></div><span className="section-badge"><CalendarDays size={15} /> Daily outlook</span></div>
              <div className="forecast-grid">
                {dailyForecast.map((item, index) => (
                  <article className={`forecast-card panel ${index === 0 ? "forecast-today" : ""}`} key={item.dt}>
                    <span className="forecast-day">{index === 0 ? "TODAY" : dayName(item.dt, { weekday: "short" }).toUpperCase()}</span>
                    <div className="forecast-icon">{weatherIcon(item.weather[0].main, 33)}</div>
                    <strong>{formatTemp(item.main.temp)}</strong>
                    <span className="forecast-desc">{item.weather[0].description}</span>
                    <div className="forecast-range"><span>{formatTemp(item.main.temp_max)}</span><span>{formatTemp(item.main.temp_min)}</span></div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="empty-state panel">
            <div className="empty-weather-art"><Sun size={62} /><Cloud size={48} /></div>
            <h2>Your forecast starts here</h2>
            <p>Search for a city above to see current conditions and the 5-day outlook.</p>
          </section>
        )}

        <footer className="footer"><span>☼</span> Made for brighter days <span className="footer-dot">·</span> Weather data by OpenWeather</footer>
      </main>
    </div>
  );
}
