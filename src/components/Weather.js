import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherResult, setWeatherResult] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleError = (err) => {
        if (err.response) {
            if (err.response.status === 401) {
                setError('Unauthorized: Invalid API key or missing credentials.');
            } else if (err.response.status === 404) {
                setError('City not found. Please try again.');
            } else {
                setError('Something went wrong. Please check your internet connection or try again later.');
            }
        } else {
            setError('An unknown error occurred. Please check your connection and try again.');
        }
        setWeatherResult(null);
        setForecast(null);
    };

    const fetchWeatherByLocation = async (lat, lon) => {
        setLoading(true);
        setError('');
        setForecast(null);
        try {
            const API_KEY = process.env.REACT_APP_API_KEY;
            if (!API_KEY) {
                throw new Error('API Key is missing! Please check your environment variable.');
            }
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            setWeatherResult(response.data);
            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            setForecast(forecastResponse.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = async () => {
        setLoading(true);
        setError('');
        setForecast(null);
        try {
            const API_KEY = process.env.REACT_APP_API_KEY;
            if (!API_KEY) {
                throw new Error('API Key is missing! Please check your environment variable.');
            }
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            );
            setWeatherResult(response.data);
            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
            );
            setForecast(forecastResponse.data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather();
        }
    };

    const getWeatherIcon = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    const getWeatherBackgroundClass = () => {
        if (!weatherResult) return '';
        const condition = weatherResult.weather[0].main.toLowerCase();
        if (condition === 'clear') {
            return 'sunny';
        } else if (condition === 'clouds') {
            return 'cloudy';
        } else if (condition === 'rain' || condition === 'drizzle') {
            return 'rainy';
        }
        return '';
    };

    const getLocationWeather = () => {
        // Clear existing error and city input for the location button
        setError('');
        setCity('');
        setWeatherResult(null);
        setForecast(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                },
                (error) => {
                    setError('Failed to retrieve location. Please allow location access.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className={`weather-container ${getWeatherBackgroundClass()}`}>
            {/* Top Section */}
            <div className="top-section">
                <h1>That Weather</h1>
                <form className="weather-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        aria-label="Enter city name"
                    />
                    <div className="button-container">
                        <button
                            type="submit"
                            aria-label="Get weather"
                            disabled={loading || city.trim() === ''}
                            title="Get Weather"
                        >
                            <FaSearch />
                        </button>
                        <button
                            onClick={getLocationWeather}
                            aria-label="Get weather based on your location"
                            disabled={loading}
                            title="Use My Location"
                        >
                            <FaLocationArrow />
                        </button>
                    </div>
                </form>
            </div>

            {/* Weather Data Section */}
            <div className="weather-data">
                {loading && (
                    <div>
                        <div className="spinner"></div>
                        <p className="loading-message">Fetching weather for your location...</p>
                    </div>
                )}
                {error && <p className="error-message">{error}</p>}

                {weatherResult && !loading && (
                    <div className="weather-result">
                        <h2>
                            {weatherResult.name || 'Your Location'}, {weatherResult.sys?.country}
                        </h2>
                        <img
                            src={getWeatherIcon(weatherResult.weather[0].icon)}
                            alt={weatherResult.weather[0].description}
                            className="weather-icon"
                        />
                        <p><strong>Date:</strong> {new Date(weatherResult.dt * 1000).toLocaleDateString()}</p>
                        <p><strong>Temperature:</strong> {weatherResult.main.temp}°C</p>
                        <p><strong>Feels Like:</strong> {weatherResult.main.feels_like}°C</p>
                        <p><strong>Condition:</strong> {weatherResult.weather[0].description}</p>
                        <p><strong>Humidity:</strong> {weatherResult.main.humidity}%</p>
                        <p><strong>Wind Speed:</strong> {weatherResult.wind.speed} m/s</p>
                        <p><strong>Wind Direction:</strong> {weatherResult.wind.deg}°</p>
                        <p><strong>Visibility:</strong> {weatherResult.visibility / 1000} km</p>
                        <p><strong>Pressure:</strong> {(weatherResult.main.pressure / 10).toFixed(2)} kPa</p>
                        <p><strong>Sunrise:</strong> {new Date(weatherResult.sys.sunrise * 1000).toLocaleTimeString()}</p>
                        <p><strong>Sunset:</strong> {new Date(weatherResult.sys.sunset * 1000).toLocaleTimeString()}</p>
                    </div>
                )}

                {forecast && !loading && (
                    <div className="forecast">
                        <h3>6-Day Forecast</h3>
                        <div className="forecast-cards">
                            {Object.values(
                                forecast.list.reduce((acc, item) => {
                                    // Get the date from item.dt_txt and format it properly
                                    const date = new Date(item.dt_txt).toLocaleDateString(); // Convert to readable date
                                    if (!acc[date]) {
                                        acc[date] = {
                                            temp_min: item.main.temp_min,
                                            temp_max: item.main.temp_max,
                                            weather: item.weather[0],
                                            humidity: item.main.humidity,
                                            pressure: item.main.pressure,
                                            wind: item.wind.speed,
                                            pop: item.pop,
                                            dt_txt: item.dt_txt,  // Store the full date-time for later use if needed
                                        };
                                    } else {
                                        // Update the min/max temperature for the day
                                        acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
                                        acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
                                    }
                                    return acc;
                                }, {})
                            )
                                .slice(0, 6) // You only need the first 6 forecast days
                                .map((day, index) => {
                                    const forecastDate = new Date(day.dt_txt);
                                    const formattedDate = forecastDate.toLocaleDateString(); // Format the date properly here
                                    return (
                                        <div className="forecast-card" key={index}>
                                            <img
                                                src={getWeatherIcon(day.weather.icon)}
                                                alt={day.weather.description}
                                                className="weather-icon"
                                            />
                                            <p>
                                                <strong>{formattedDate}</strong> {/* Correct date display */}
                                            </p>
                                            <p>Temperature: Max {day.temp_max}°C | Min {day.temp_min}°C</p>
                                            <p>{day.weather.description}</p>
                                            <p>Humidity: {day.humidity}%</p>
                                            <p>Pressure: {(day.pressure / 10).toFixed(2)} kPa</p>
                                            <p>Wind Speed: {day.wind} m/s</p>
                                            <p>Chance of Rain: {day.pop * 100}%</p>
                                        </div>
                                    );
                                })}

                        </div>
                    </div>
                )}


            </div>

        </div>
    );
};

export default Weather;
