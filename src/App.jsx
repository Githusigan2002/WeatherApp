import { useEffect, useState } from 'react';
import './App.css'

import PropTypes from 'prop-types'
import searchIcon from './assets/search.png';
import clearWeather from './assets/clear_weather.png';
import cloudyIcon from './assets/cloudy.png';
import drizzle from './assets/drizzle.png';
import rain from './assets/rain.png';
import snowIcon from './assets/snow.png';
import windIcon from './assets/wind.png';
import humidityIcon from './assets/humidity.png';


const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>

      <div className="coord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>

        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>

      </div>

      <div className="datacontainer">

        <div className="element">
          <img src={humidityIcon} alt="humidity" />
        </div>
        <div className="data">
          <div className="humidity-percentage">{humidity} %</div>
          <div className="text">Humidity</div>
        </div>

        <div className="element">
          <img src={windIcon} alt="wind" />
        </div>
        <div className="data">
          <div className="wind-percentage">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>

      </div>
    </>
  );
};

WeatherDetails.protoType = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,

};

function App() {
  let api = "77665e629008539331343e2cd4670db0";
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(28);
  const [city, setCity] = useState("Mullaitivu");
  const [country, setCountry] = useState("LK");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, sethumidity] = useState(0);
  const [text, setText] = useState("London");
  const [errorMsg, setErrorMsg] = useState(null);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const WeatherIconMap = {
    "01d": clearWeather,
    "01n": clearWeather,
    "02d": cloudyIcon,
    "02n": cloudyIcon,
    "03d": drizzle,
    "03n": drizzle,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json(res);

      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      sethumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(data.main.temp);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const WeatherIconCode = data.weather[0].icon;
      setIcon(WeatherIconMap[WeatherIconCode]);
      setCityNotFound(false);

    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred while fetching data")

    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input type="text" className="city-input" placeholder='Search City' onChange={handleCity} value={text} />
          <div className="searchIcon">
            <img src={searchIcon} alt="" onClick={() => search()} />
          </div>
        </div>
        {loading && <div className='loadingMsg'>Loading...</div>}
        {errorMsg && <div className='errorMsg'>{errorMsg}</div>}
        {cityNotFound && <div className='cityNotFound'>cityNotFound</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}
      </div>
    </>
  );
}

export default App
