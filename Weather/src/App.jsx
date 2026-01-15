import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [defaultCities, setDefaultCities] = useState([]);
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  // Access Vite environment variable
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Default cities to display
  const DEFAULT_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'];

  // Fetch default cities on mount
  useEffect(() => {
    if (API_KEY) {
      fetchDefaultCities();
    }
  }, []);

  // Fetch weather for default cities
  const fetchDefaultCities = async () => {
    setLoadingDefaults(true);
    const citiesData = [];

    try {
      for (let i = 0; i < DEFAULT_CITIES.length; i++) {
        const cityName = DEFAULT_CITIES[i];
        
        try {
          const response = await fetch(
            `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
          );

          if (response.ok) {
            const data = await response.json();
            citiesData.push(data);
          }
          
          // Small delay to avoid rate limiting
          if (i < DEFAULT_CITIES.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (err) {
          console.error(`Error fetching ${cityName}:`, err);
        }
      }
      
      setDefaultCities(citiesData);
    } catch (err) {
      console.error('Error fetching default cities:', err);
    } finally {
      setLoadingDefaults(false);
    }
  };

  // Fetch weather data for searched city
  const fetchWeather = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch weather data. Please try again.');
      }

      const data = await response.json();
      setWeather(data);
      setCity('');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Click on default city card
  const handleCityClick = (cityData) => {
    setWeather(cityData);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  // Get background based on weather condition
  const getBackgroundClass = () => {
    if (!weather) return 'default';
    
    const condition = weather.weather[0].main.toLowerCase();
    
    if (condition.includes('clear')) return 'clear';
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
    if (condition.includes('snow')) return 'snowy';
    if (condition.includes('thunder')) return 'stormy';
    if (condition.includes('mist') || condition.includes('fog')) return 'foggy';
    
    return 'default';
  };

  // Format date
  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className={`App ${getBackgroundClass()}`}>
      <div className="weather-container">
        <div className="header">
          <h1>🌤️ Weather Finder</h1>
          <p className="date">{formatDate()}</p>
        </div>

        {/* Search Form */}
        <form onSubmit={fetchWeather} className="search-form">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter city name (e.g., Mumbai, Delhi, London)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-btn" 
              disabled={loading}
            >
              {loading ? '🔄' : '🔍'} {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="weather-info">
            <div className="location">
              <h2>📍 {weather.name}, {weather.sys.country}</h2>
            </div>

            <div className="weather-main">
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              
              <div className="temperature">
                <h1>{Math.round(weather.main.temp)}°C</h1>
                <p className="feels-like">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>

            <div className="weather-description">
              <h3>{weather.weather[0].main}</h3>
              <p>{weather.weather[0].description}</p>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <span className="detail-icon">💨</span>
                <div className="detail-info">
                  <p className="detail-label">Wind Speed</p>
                  <p className="detail-value">{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className="detail-card">
                <span className="detail-icon">💧</span>
                <div className="detail-info">
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="detail-card">
                <span className="detail-icon">🌡️</span>
                <div className="detail-info">
                  <p className="detail-label">Pressure</p>
                  <p className="detail-value">{weather.main.pressure} hPa</p>
                </div>
              </div>

              <div className="detail-card">
                <span className="detail-icon">👁️</span>
                <div className="detail-info">
                  <p className="detail-label">Visibility</p>
                  <p className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </div>

            <div className="sun-times">
              <div className="sun-time">
                <span>🌅 Sunrise</span>
                <p>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
              
              <div className="sun-time">
                <span>🌇 Sunset</span>
                <p>{new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
            </div>
          </div>
        )}

        {/* Default Cities Section */}
        {!weather && (
          <div className="default-cities-section">
            <h2 className="section-title">🌍 Popular Cities in India</h2>
            
            {loadingDefaults ? (
              <div className="loading-cities">
                <div className="spinner"></div>
                <p>Loading cities...</p>
              </div>
            ) : defaultCities.length > 0 ? (
              <div className="default-cities-grid">
                {defaultCities.map((cityData) => (
                  <div 
                    key={cityData.id} 
                    className="city-card"
                    onClick={() => handleCityClick(cityData)}
                  >
                    <div className="city-card-header">
                      <h3>{cityData.name}</h3>
                      <img 
                        src={getWeatherIcon(cityData.weather[0].icon)} 
                        alt={cityData.weather[0].description}
                        className="city-icon"
                      />
                    </div>
                    
                    <div className="city-temp">
                      {Math.round(cityData.main.temp)}°C
                    </div>
                    
                    <div className="city-description">
                      {cityData.weather[0].main}
                    </div>
                    
                    <div className="city-details">
                      <span>💧 {cityData.main.humidity}%</span>
                      <span>💨 {cityData.wind.speed} m/s</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-cities">
                <p>⚠️ Unable to load cities. Please check your API key configuration.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
