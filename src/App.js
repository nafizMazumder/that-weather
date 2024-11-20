// App.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Weather from './components/Weather';
import './Styles.css';

const App = () => {
    const [city, setCity] = useState('');
    const [weatherResult, setWeatherResult] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationName, setLocationName] = useState(''); // New state variable

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
            setLocationName(`${response.data.name}, ${response.data.sys?.country}`);
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
            setLocationName(`${response.data.name}, ${response.data.sys?.country}`);
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
        <div className="App">
            <Header
                city={city}
                setCity={setCity}
                fetchWeather={fetchWeather}
                getLocationWeather={getLocationWeather}
                loading={loading}
                locationName={locationName}
            />
            <Weather
                city={city}
                fetchWeatherByLocation={fetchWeatherByLocation}
                loading={loading}
                weatherResult={weatherResult}
                forecast={forecast}
                error={error}
            />
        </div>
    );
};

export default App;
