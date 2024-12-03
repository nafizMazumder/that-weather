import { useEffect } from 'react';

const Weather = ({ city, fetchWeatherByLocation, loading, weatherResult, forecast, error }) => {

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

    useEffect(() => {
        if (weatherResult) {
            const backgroundClass = getWeatherBackgroundClass();
            // Apply the background class to the body
            document.body.className = backgroundClass; // Set the body class to the appropriate weather background
        }

        // Cleanup: Reset the body class when the component unmounts or weather data changes
        return () => {
            document.body.className = ''; // Reset the body class to avoid leftover styles
        };
    }, [weatherResult]); // Depend on weatherResult to update background when weather data changes

    return (
        <div className="weather-container">
            {loading && (
                <div>
                    <div className="spinner"></div>
                    <p className="loading-message">Fetching weather...</p>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}

            {weatherResult && !loading && (
                <div className="weather-result">
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
                                const date = new Date(item.dt_txt).toLocaleDateString();
                                if (!acc[date]) {
                                    acc[date] = {
                                        temp_min: item.main.temp_min,
                                        temp_max: item.main.temp_max,
                                        weather: item.weather[0],
                                        humidity: item.main.humidity,
                                        pressure: item.main.pressure,
                                        wind: item.wind.speed,
                                        pop: item.pop,
                                        dt_txt: item.dt_txt,
                                    };
                                } else {
                                    acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
                                    acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
                                }
                                return acc;
                            }, {})
                        )
                            .slice(0, 6)
                            .map((day, index) => {
                                const forecastDate = new Date(day.dt_txt);
                                const formattedDate = forecastDate.toLocaleDateString();
                                return (
                                    <div className="forecast-card" key={index}>
                                        <img
                                            src={getWeatherIcon(day.weather.icon)}
                                            alt={day.weather.description}
                                            className="weather-icon"
                                        />
                                        <p><strong>{formattedDate}</strong></p>
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
    );
};

export default Weather;
