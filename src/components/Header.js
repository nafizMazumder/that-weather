import React from 'react';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';
import weatherImage from '../icon.png';

const Header = ({ city, setCity, fetchWeather, getLocationWeather, loading, locationName }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather();
        }
    };

    return (
        <div className="search-section">
            <h1>
                <img src={weatherImage} alt="Weather icon" className="header-image" />
                That Weather
            </h1>
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
            {locationName && (
                <p className="location-name">
                    City:&nbsp;<strong>{locationName}</strong>
                </p>
            )}
        </div>
    );
};

export default Header;
