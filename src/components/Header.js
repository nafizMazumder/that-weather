import React, { useState } from 'react';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';
import weatherImage from '../icon.png';

const Header = ({ city, setCity, fetchWeather, getLocationWeather, loading, locationName }) => {
    const [suggestions, setSuggestions] = useState([]);

    // Function to fetch city name suggestions from Geoapify
    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY; // Ensure this is in your .env file
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&limit=3&type=city&format=json&apiKey=${apiKey}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Geoapify response:", data); // Log API response to debug

            if (data.results && data.results.length > 0) {
                const mappedSuggestions = data.results
                     // Filter out results where name is undefined
                    .map((result) => ({
                        id: result.place_id,
                        name: result.city,  // Name of the city or location
                        country: result.country_code
                    }));

                setSuggestions(mappedSuggestions);
                console.log("Mapped suggestions:", mappedSuggestions); // Log mapped suggestions
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    // Handle the input change and trigger fetchSuggestions
    const handleInputChange = (e) => {
        const query = e.target.value;
        setCity(query);
        console.log("City state updated to:", query);
        fetchSuggestions(query);
    };

    const handleSelectSuggestion = (suggestion) => {
        setCity(`${suggestion.name}, ${suggestion.country}`);
        setSuggestions([]);
        console.log("Selected suggestion:", suggestion);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather();
        }
    };

    console.log("Suggestions state:", suggestions);

    return (
        <div className="search-section">
            <h1>
                <img src={weatherImage} alt="Weather icon" className="header-image" />
                That Weather
            </h1>
            <form className="weather-form" onSubmit={handleSubmit}>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={handleInputChange}
                        aria-label="Enter city name"
                    />
                    {/* Display suggestions below the input field */}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className="suggestion-item"
                                >
                                    <strong>{suggestion.name}</strong>, {suggestion.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
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
