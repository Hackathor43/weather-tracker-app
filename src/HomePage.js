import { Button, Input, notification, Spin } from "antd";
import { useState,useEffect } from "react";
import axios from "axios";
import { WeatherCard } from "./WeatherCard";

export const HomePage = () => {
  const [selectedCities, setSelectedCities] = useState();
  const [countryCode, setCountryCode] = useState(null);
  const [isPageLoading, setPageLoading] = useState(false);

  const [zipCode, setZipCode] = useState(null);

  const [weatherData, setweatherData] = useState(null);
  const [forecastData, setForeCastData] = useState(null);
  const [citiesData, setCitiesData] = useState();

  const handleInputZipcode = (event) => {
    setZipCode(event.target.value.trim());
  };

  const handleInputCities = (event) => {
    setSelectedCities(event.target.value.trim());
  };

  const handleInputCountryCode = (event) => {
    setCountryCode(event.target.value.trim());
  };


  const fetchWeatherByCities = async () => {
    try {
      const response = await axios.post("https://weather-tracker-app-7cy5.onrender.com/get_weather_by_cities", {
        cities: selectedCities.split(","),
      });
      setCitiesData(response.data);
    } catch (err) {
      notification.open({
        message: err.message,
        type: "error",
      });
    }
  };

  const handleSearchWeather = () => {
    if (!zipCode || zipCode === "") {
      notification.open({
        message: "Please select  zipcode",
        type: "error",
      });
      return;
    } else if (!countryCode || countryCode === "") {
      notification.open({
        message: "Please select  country code",
        type: "error",
      });
      return;
    } else if (!selectedCities || selectedCities.split(",").length === 0) {
      notification.open({
        message: "Please select some cities",
        type: "error",
      });
      return;
    } else if (selectedCities.split(",").length > 3) {
      notification.open({
        message: "Please select atmost 3 cities",
        type: "error",
      });
      return;
    } else {
      setPageLoading(true);
      axios
        .post("https://weather-tracker-app-7cy5.onrender.com/get_weather", {
          zip_code: zipCode,
          country_code: countryCode,
        })
        .then((response) => {
          setweatherData(response.data.user_location);
          setForeCastData(response.data.forecast);
          setPageLoading(false);
        })
        .catch((err) => {
          notification.open({
            message: err,
            type: "error",
          });
        });

        fetchWeatherByCities();

    }
  };

  useEffect(() => {
    if (selectedCities?.split(",").length > 0 && selectedCities?.split(",").length <= 3) {
      const interval = setInterval(() => {
        fetchWeatherByCities();
      }, 60000);  // 1 minute interval
      return () => clearInterval(interval);
    }
  }, [selectedCities]);

  const getLocationData = () => {
    const data = {};
    if (weatherData) {
      data["title"] = weatherData?.name;
      data["type"] = "weather";
      data["temp"] = weatherData?.main?.temp;
      data["temp_max"] = weatherData?.main?.temp_max;
      data["temp_min"] = weatherData?.main?.temp_min;
      data["humidity"] = weatherData?.main?.humidity;
    }

    return data;
  };

  const getForeCastData = () => {
    const data = {};
    if (forecastData && forecastData?.list?.length > 0) {
      data["title"] = forecastData?.city.name;
      data["type"] =
        "forecast in " +
        new Date(new Date() + forecastData?.list[0].dt).toLocaleString();
      data["temp"] = forecastData?.list[0]?.main.temp;
      data["temp_max"] = forecastData?.list[0]?.main.temp_max;
      data["temp_min"] = forecastData?.list[0]?.main.temp_min;
      data["humidity"] = forecastData?.list[0]?.main.humidity;
    }

    return data;
  };

  const getCityData = (elem) => {
    const data = {};
    if (citiesData[elem]) {
      data["title"] = elem;
      data["type"] = "weather";
      data["temp"] = citiesData[elem]?.main?.temp;
      data["temp_max"] = citiesData[elem]?.main?.temp_max;
      data["temp_min"] = citiesData[elem]?.main?.temp_min;
      data["humidity"] = citiesData[elem]?.main?.humidity;
    }

    return data;
  };

  const handleReset = ()=>{
    setCitiesData(null);
    setForeCastData(null);
    setweatherData(null);
    setZipCode(null);
    setCountryCode(null);
    setSelectedCities(null);
  }

  return (
    <div
      className="flex justify-center align-center"
      style={{ height: "100vh" }}
    >
      <Spin spinning={isPageLoading}>
        {!weatherData && (
          <div className="flex-column align-center">
            <div className="mb10 font-weight-800 font-18">
              Welcome to weather tracker
            </div>
            <div className="mb10 font-weight-600 font-16">
              Search your zipcode and country code and maximum three city names
            </div>
            <div className="flex-column" style={{ marginTop: 20 }}>
              <Input
                onChange={handleInputZipcode}
                placeholder="Search zipcode (ex : 560076)"
                className="mb10"
                style={{ width: "30vw" }}
                required
              ></Input>
              <Input
                onChange={handleInputCountryCode}
                placeholder="Search country code (ex: IN for INDIA)"
                className="mb10"
                style={{ width: "30vw" }}
                required
              ></Input>
              <Input
                onChange={handleInputCities}
                placeholder="Search cities (ex: London,Germany)"
                className="mb10"
                style={{ width: "30vw" }}
                required
              ></Input>
              <div className="flex justify-center">
                <Button onClick={handleSearchWeather} type="primary">
                  Search weather
                </Button>
              </div>
            </div>
          </div>
        )}
        {zipCode && weatherData && citiesData && (
          <div className="flex-column">
            {weatherData && (
              <div className="flex">
                <WeatherCard data={getLocationData()}></WeatherCard>
                <WeatherCard data={getForeCastData()}></WeatherCard>
              </div>
            )}
            {citiesData && (
              <div className="flex">
                {Object.keys(citiesData).map((elem) => {
                  return <WeatherCard data={getCityData(elem)}></WeatherCard>;
                })}
              </div>
            )}
            <Button type="primary" onClick={handleReset}>Reset Data</Button>
          </div>
        )}
      </Spin>
    </div>
  );
};
