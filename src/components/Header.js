// Header.js
import React from 'react';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';

const Header = ({ city, setCity, fetchWeather, getLocationWeather, loading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather();
        }
    };

    return (
        <div className="search-section">
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
    );
};

export default Header;