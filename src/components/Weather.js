import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        setLoading(true);
        setError('');
        setForecast(null);  // Reset forecast when fetching new data
        try {
            const API_KEY = process.env.REACT_APP_API_KEY;
            if (!API_KEY) {
                throw new Error('API Key is missing! Please check your environment variable.');
            }

            // Fetch current weather data
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            );

            // Handle non-200 response codes
            if (response.status !== 200) {
                setError('Something went wrong with fetching the weather data.');
                setWeather(null);
                setForecast(null);
                return;
            }

            // Check if response contains a 'cod' field and if it is 404
            if (response.data && response.data.cod === '404') {
                setError('City not found. Please try again.');
                setWeather(null);
                setForecast(null);
                return;
            }

            // Successfully retrieved weather data
            setWeather(response.data);
            setError('');

            // Fetch 5-day forecast data
            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
            );

            setForecast(forecastResponse.data);

        } catch (err) {
            // Handle specific error cases
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

            setWeather(null);
            setForecast(null); // Reset forecast on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather();
        } else {
            setError('Please enter a valid city name.');
            setWeather(null);
            setForecast(null); // Reset forecast when city input is invalid
        }
    };

    const getWeatherIcon = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    // Determine the background class based on the weather condition
    const getWeatherBackgroundClass = () => {
        if (!weather) return '';
        const condition = weather.weather[0].main.toLowerCase();
        if (condition === 'clear') {
            return 'sunny';
        } else if (condition === 'clouds') {
            return 'cloudy';
        } else if (condition === 'rain' || condition === 'drizzle') {
            return 'rainy';
        }
        return '';
    };

    return (
        <div className={`weather-container ${getWeatherBackgroundClass()}`}>
            <h1>Weather Watch</h1>
            <form className="weather-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Enter city name"
                />
                <button
                    type="submit"
                    aria-label="Get weather"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Weather'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {weather && !loading && (
                <div className="weather-result">
                    <h2>{weather.name}, {weather.sys.country}</h2>
                    <img
                        src={getWeatherIcon(weather.weather[0].icon)}
                        alt={weather.weather[0].description}
                        className="weather-icon"
                    />
                    <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
                    <p><strong>Condition:</strong> {weather.weather[0].description}</p>
                    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
                </div>
            )}
            {forecast && !loading && (
                <div className="forecast">
                    <h3>5-Day Forecast</h3>
                    <div className="forecast-cards">
                        {forecast.list.slice(0, 5).map((item, index) => (
                            <div key={index} className="forecast-card">
                                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                                <img
                                    src={getWeatherIcon(item.weather[0].icon)}
                                    alt={item.weather[0].description}
                                    className="forecast-icon"
                                />
                                <p>{item.main.temp}°C</p>
                                <p>{item.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
