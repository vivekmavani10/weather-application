import React, { useState, useEffect } from "react";
import "./Style/style.css";
import { LuSunMedium } from "react-icons/lu"; // Clear icon
import { WiCloudy, WiDayHaze } from "react-icons/wi"; // Cloudy, Haze icons
import { IoRainyOutline } from "react-icons/io5"; // Rain icon

const Temp = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("London");
  const [error, setError] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(null); // State for weather icon
  const [cityTime, setCityTime] = useState(""); // State for time

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=73228e650d49aa29de78cf99c6a40ea5`;
      const response = await fetch(url);
      const resJson = await response.json();

      if (resJson.cod === "404") {
        setCity(null);
        setError(true);
      } else {
        setCity(resJson);
        setError(false);

        // Ensure resJson.weather is defined and has at least one element
        if (resJson.weather && resJson.weather.length > 0) {
          // Set icon based on weather condition
          switch (resJson.weather[0]?.main) {
            case "Clear":
              setWeatherIcon(<LuSunMedium style={{ fontSize: "60px" }} />);
              break;
            case "Clouds":
              setWeatherIcon(<WiCloudy style={{ fontSize: "80px" }} />);
              break;
            case "Haze":
              setWeatherIcon(<WiDayHaze style={{ fontSize: "80px" }} />);
              break;
            case "Rain":
              setWeatherIcon(<IoRainyOutline style={{ fontSize: "60px" }} />);
              break;
            default:
              setWeatherIcon(<LuSunMedium style={{ fontSize: "60px" }} />); // Default icon
          }
        } else {
          setWeatherIcon(<LuSunMedium style={{ fontSize: "60px" }} />);
        }

        // Calculate and set city time
        const localTime = new Date((resJson.dt + resJson.timezone) * 1000);

        // Format the date with the month after the date
        const formattedTime = localTime.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long", // Displays the full month name
          year: "numeric",
        });

        setCityTime(formattedTime); // Set the formatted date
      }
    };

    fetchApi();
  }, [search]);

  return (
    <>
      <div className="container">
        <div className="first">
          <div style={{ paddingRight: "30px" }} className="country-name">
            <h1 style={{ fontSize: "60px", overflow: "clip" }}>{search}</h1>
            <p style={{ fontSize: "25px", fontWeight: "600" }}>
              {city?.sys?.country}
            </p>
          </div>
          <div className="date-time-temp" style={{ fontSize: "25px" }}>
            <div className="date-time">
              {/* Display the full date on one line */}
              <p>{cityTime}</p> {/*it show full date */}
            </div>
            <div className="temp">
              <h1>{city?.main?.temp}°C</h1>
            </div>
          </div>
        </div>

        <div className="second">
          <div className="weather-info">
            <div>
              <h2 className="weather-icon">{weatherIcon}</h2>
              <h1>{city?.weather && city?.weather[0]?.main}</h1>
            </div>
            <hr />
            <div className="search">
              <input
                type="search"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <p style={{ paddingTop: "5px" }}>Search City</p>
            </div>
            <hr />
            {/* Check for city data or error */}
            {error ? (
              <p>No Data Found</p>
            ) : city ? (
              <div className="temp-detail" style={{ margin: "0px 10px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Temp</span>
                  <span>
                    {city?.main?.temp}°C ({city?.weather && city.weather[0]?.main})
                  </span>
                </div>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Humidity</span>
                  <span>{city?.main?.humidity}%</span>
                </div>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Visibility</span>
                  <span>{city?.visibility} ml</span>
                </div>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Wind Speed</span>
                  <span>{city?.wind?.speed} Km/h</span>
                </div>
              </div>
            ) : (
              <p>No Data Found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Temp;
