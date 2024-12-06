import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const App = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchData('Albi');
        const handleTouchStart = (event) => {
            if (event.touches.length > 1) { event.preventDefault(); }
        };

        const handleGestureStart = (event) => {
            event.preventDefault();
        };

        const handleWheel = (event) => {
            if (event.ctrlKey) { event.preventDefault(); }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('gesturestart', handleGestureStart);
        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('gesturestart', handleGestureStart);
            document.removeEventListener('wheel', handleWheel);
        };
        
    }, []);

    const handleSearch = async (searchTerm) => {
        try {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/search.json?key=ff191ed1cbe746f8bf1180015240512&q=${searchTerm}`
            );
            setCities(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const fetchData = async (searchTerm) => {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=ff191ed1cbe746f8bf1180015240512&q=${searchTerm}&days=7&aqi=no&alerts=no`);
            setWeatherData(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleCityClick = (cityName, cityRegion) => {
        const selectedCityInfo = cities.find(city => city.name === cityName && city.region === cityRegion);
        handleSearch(`${cityName} ${selectedCityInfo.region}`);
        fetchData(`${cityName} ${selectedCityInfo.region}`);
    };

    return (
        <div style={{
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 0,
            '@media (max-width: 768px)': {
                padding: '20px',
                flexDirection: 'column',
            },
        }}>
            <BlocGlobalGauche weatherData={weatherData} />
            <BlocGlobalDroit
                handleSearch={handleSearch}
                cities={cities}
                handleCityClick={handleCityClick}
            />

            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '28vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: '50px',
                marginBottom: '30px',
                '@media (max-width: 768px)': {
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '10px',
                },
            }}>
                {Array(7).fill(null).map((_, index) => (
                    <BlocMeteoColorise
                        key={index}
                        weatherData={weatherData}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

const BlocGlobalGauche = ({ weatherData }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 65,
            left: 10,
            width: '49%',
            height: '60%',
            borderRadius: '40px',
            background: 'linear-gradient(to bottom, #4A67BF, #294392)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '@media (max-width: 768px)': {
                position: 'relative',
                top: 0,
                left: 0,
                width: '100%',
                height: 'auto',
                padding: '20px',
                borderRadius: '10px',
            },
        }}>
            <h1>{weatherData?.location.name}, {weatherData?.location.region}, {weatherData?.location.country}</h1>
            <img src={`https:${weatherData?.current.condition.icon}`} alt={weatherData?.current.condition.text} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                }}>Température actuelle</p>
                <p>{weatherData?.current.temp_c}°C / {weatherData?.current.temp_f}°F</p>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                }}>Température ressentie</p>

                <p>{weatherData?.current.feelslike_c}°C / {weatherData?.current.feelslike_f}°F</p>
            </div>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px'
            }}>
                <p style={{ fontSize: '0.75em' }}>last update {weatherData?.current.last_updated}</p>
            </div>
        </div>
    )
}

BlocGlobalGauche.propTypes = {
    weatherData: PropTypes.object
};

const BlocGlobalDroit = ({ handleSearch, cities, handleCityClick }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 65,
            right: 10,
            width: '49%',
            height: '60%',
            borderRadius: '40px',
            background: 'linear-gradient(to bottom, #4A67BF, #294392)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            '@media (max-width: 768px)': {
                position: 'relative',
                top: 0,
                right: 0,
                width: '100%',
                height: 'auto',
                padding: '20px',
                borderRadius: '10px',
            },
        }}>
            <input
                type="text"
                placeholder="Rechercher une ville..."
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                    width: '80%',
                    padding: '10px',
                    fontSize: '16px',
                    marginTop: '50px',
                    marginBottom: '20px',
                    '@media (max-width: 768px)': {
                        width: '100%',
                        marginTop: '20px',
                        marginBottom: '10px',
                    },
                }}
            />

            {cities.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {cities.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => handleCityClick(city.name, city.region)}
                            style={{
                                cursor: 'pointer',
                                padding: '5px',
                                borderBottom: '1px solid white',
                                '@media (max-width: 768px)': {
                                    padding: '3px',
                                },
                            }}
                        >
                            {city.name}, {city.region}, {city.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

BlocGlobalDroit.propTypes = {
    handleSearch: PropTypes.func.isRequired,
    cities: PropTypes.arrayOf(PropTypes.object),
    handleCityClick: PropTypes.func.isRequired
};

const BlocMeteoColorise = ({ weatherData, index }) => {
    const dayData = weatherData?.forecast.forecastday[index];

    if (!dayData || !dayData.day || !dayData.day.condition) {
        return <div>No data</div>;
    }

    const highestTemp = Math.max(...weatherData.forecast.forecastday.map(day => day.day.avgtemp_c));
    const lowestTemp = Math.min(...weatherData.forecast.forecastday.map(day => day.day.avgtemp_c));

    const avgTemp = (highestTemp + lowestTemp) / 2;
    const tempDiff = highestTemp - lowestTemp;

    const getTemperatureColor = (temp) => {
        if (temp > avgTemp + tempDiff * 0.3) return '#A93A3A';
        if (temp < avgTemp - tempDiff * 0.3) return '#45BBC0';
        return '#5640AD';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingLeft: '40px',
            paddingRight: '40px',
            border: '3px solid #000000',
            borderRadius: '30px',
            backgroundColor: getTemperatureColor(dayData.day.avgtemp_c),
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            '@media (max-width: 768px)': {
                padding: '10px',
                borderRadius: '10px',
            },
        }}>
            <p>JOUR {index + 1}</p>
            <img
                src={`https:${dayData.day.condition.icon}`}
                alt={dayData.day.condition.text}
            />
            <p>{dayData.day.avgtemp_c}°C</p>
        </div>
    );
};

BlocMeteoColorise.propTypes = {
    weatherData: PropTypes.object,
    index: PropTypes.number.isRequired
};

export default App;
