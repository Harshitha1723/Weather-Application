"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import Card from "./Components/Card";
import TodayDetailsCard from "./Components/TodayDetailsCard";
import DailyWeatherCard from "./Components/DailyWeatherCard";
import axios from "axios"; // library for api call
import HourlyForecastCard from "./Components/HourlyForecastCard";
import supportedLanguages from "./supportedLanguages";
import { Circles } from "react-loader-spinner";
interface WeatherProps {}

interface WeatherData {
  list: {
    uvi: any;
    visibility: number;
    wind: any;
    dt: number;
    main: { temp: number; humidity: number };
    weather: { description: string; icon: string }[];
  }[];
  city: { name: string; sunrise: number; sunset: number };
}

const Weather: React.FC<WeatherProps> = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<keyof typeof supportedLanguages>("en"); // handle language change
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // setting up Weather data
  const [loading, setLoading] = useState<boolean>(true); // setting loader
  const [error, setError] = useState<string | null>(null); // error
  const [detailedDayWeather, setDetailedDayWeather] = useState<{
    day: string;
    data: { time: number; temp: number; weather: { icon: string }[] }[];
  } | null>(null); // detailed weather for  a day
  const [displayType, setDisplayType] = useState<"today" | "weekly">("today"); // tab for today" | "weekly
  const [groupedData, setGroupedData] = useState<{
    [day: string]: {
      minTemp: number;
      maxTemp: number;
      data: {
        time: number;
        temp: number;
        weather: {
          description: string;
          icon: string;
        }[];
      }[];
      currentDayIcon?: string;
    };
  }>({}); // grouping the data

  // api call
  useEffect(() => {
    const getWeatherData = async (latitude: number, longitude: number) => {
      const apiKey = "ff1afc50d59929198791251ef8051e51"; // api key
      const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${apiKey}&units=metric&lang=${selectedLanguage}`;

      // handle response
      try {
        const response = await axios.get(apiUrl);
        if (!response.data || response.data.cod !== "200") {
          throw new Error(
            `Failed to fetch data: ${
              response.data ? response.data.message : "Unknown error"
            }`
          );
        }
         if (weatherData) {
          const previousWeather = weatherData.list[0];
          const newWeather = response.data.list[0];

           // Trigger a notification
           if (Math.abs(previousWeather.main.temp - newWeather.main.temp) > 5) {
            const notificationText = "Weather has changed significantly!";
            new Notification(notificationText);
          }
        }

         setLoading(false);
         setWeatherData(response.data);
         setLoading(false);
       } catch (error: any) {
         setError(error.message || "Unknown error");
         setLoading(false);
         console.error("Error:", error.message || "Unknown error");
      }
     };
    // to get user location
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(latitude, longitude);
        },
        (error) => {
          console.error(error);
          setError("Unable to retrieve location.");
          setLoading(false);
        }
      );
    };

    getLocation();
  }, [selectedLanguage]);

  //handle language change
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLang = event.target.value as keyof typeof supportedLanguages;
    setSelectedLanguage(selectedLang);
  };

  // weekly data handling
  useEffect(() => {
    const displayWeeklyForecast = () => {
      if (loading || error || !weatherData) {
        return;
      }

      const groupedData: {
        [day: string]: {
          minTemp: number;
          maxTemp: number;
          data: { time: number; temp: number; weather: any }[];
          currentDayIcon?: string;
        };
      } = {};

      weatherData.list &&
        weatherData.list.forEach(
          (data: {
            dt: number;
            main: { temp: number };
            weather: string | any[];
          }) => {
            const day = moment.unix(data.dt!).format("ddd, MMM D");
            if (!groupedData[day]) {
              groupedData[day] = {
                minTemp: data.main.temp,
                maxTemp: data.main.temp,
                data: [],
              };
            }
            groupedData[day].data.push({
              time: data.dt!,
              temp: data.main.temp,
              weather: data.weather,
            });

            if (data.main.temp < groupedData[day].minTemp) {
              groupedData[day].minTemp = data.main.temp;
            }
            if (data.main.temp > groupedData[day].maxTemp) {
              groupedData[day].maxTemp = data.main.temp;
            }

            if (day === moment().format("ddd, MMM D")) {
              groupedData[day].currentDayIcon =
                data.weather && data.weather.length > 0
                  ? data.weather[0].icon
                  : "unknown";
            }
          }
        );

      setGroupedData(groupedData);
    };

    displayWeeklyForecast();
  }, [loading, error, weatherData]);

  const handleDayClick = (day: string) => {
    const dayData = groupedData[day];
    if (dayData) {
      setDetailedDayWeather({
        day,
        data: dayData.data,
      });
    }
  };
// weekly data render
  const renderDetailedDayWeather = () => {
    if (!detailedDayWeather) {
      return null;
    }

    return (
      <div>
        <h3>
          {(supportedLanguages[selectedLanguage] as any)?.detailedDayWeather}
        </h3>
        // component to display detailed weather
        <DailyWeatherCard
          day={detailedDayWeather.day}
          data={detailedDayWeather.data}
          supportedLanguages={selectedLanguage}
        />
      </div>
    );
  };

  const cardStyle = {
    border: "1px solid #ddd",
    padding: "20px",
    margin: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: 250,
  };
  return loading ? (
    <Circles
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperStyle={{ top: "10%" }}
      wrapperClass=""
      visible={true}
    />
  ) : (
    // here we are diving the screen into two parts left and right section
    <div style={{ display: "grid", gridTemplateColumns: "22% 78%", gap: 10 }}>
      {/* Left section */}
      <div style={{}}>
        <TodayDetailsCard
          temperature={
            weatherData?.list && weatherData.list.length > 0
              ? weatherData.list[0].main.temp
              : 0
          }
          weatherStatus={
            weatherData?.list && weatherData.list.length > 0
              ? weatherData.list[0].weather[0].description
              : ""
          }
          city={weatherData?.city?.name || ""}
          weatherIcon={
            weatherData?.list && weatherData.list.length > 0
              ? `http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`
              : ""
          }
          selectedLanguage={selectedLanguage}
        />
      </div>
      {/*  language tab */}
      <div>
        <div style={{ position: "absolute", right: 10 }}>
          <select value={selectedLanguage} onChange={handleLanguageChange}>
            {Object.entries(supportedLanguages).map(
              ([code, language], index) => (
                <option key={index} value={code}>
                  {language.name}
                </option>
              )
            )}
          </select>
        </div>
        {/* right section */}
        {/* handle today and weekly tab */}
        <div>
          <div style={{ marginBottom: "10px" }}>
            <button
              style={{
                marginRight: "10px",
                fontWeight: displayType === "today" ? "bold" : "normal",
                borderBottom:
                  displayType === "today" ? "2px solid black" : "none",
              }}
              onClick={() => setDisplayType("today")}
              disabled={displayType === "today"}
            >
              {supportedLanguages[selectedLanguage]?.today}
            </button>
            <button
              style={{
                fontWeight: displayType === "weekly" ? "bold" : "normal",
                borderBottom:
                  displayType === "weekly" ? "2px solid black" : "none",
              }}
              onClick={() => setDisplayType("weekly")}
              disabled={displayType === "weekly"}
            >
              {supportedLanguages[selectedLanguage]?.weekly}
            </button>
          </div>
        </div>
        {/* today section */}
        {displayType === "today" && (
          <div>
            <h3>{supportedLanguages[selectedLanguage]?.hourlyForecast}</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {weatherData?.list &&
                weatherData.list.slice(0, 10).map((hour: any) => (
                  <div key={hour.dt}>
                    <HourlyForecastCard
                      time={hour.dt!}
                      temp={hour.main.temp}
                      weatherIcon={
                        hour.weather && hour.weather.length > 0
                          ? hour.weather[0].icon
                          : "unknown"
                      }
                      weatherStatus={
                        hour.weather && hour.weather.length > 0
                          ? hour.weather[0].description
                          : "Unknown"
                      }
                    />
                  </div>
                ))}
            </div>
            <h3>{supportedLanguages[selectedLanguage]?.highlights}</h3>
            {weatherData?.list && weatherData.list.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div style={cardStyle}>
                  <strong>{supportedLanguages[selectedLanguage]?.date}:</strong>{" "}
                  {moment.unix(weatherData.list[0].dt).format("MMMM D, YYYY")}
                  <br />
                  <strong>
                    {supportedLanguages[selectedLanguage]?.time}:
                  </strong>{" "}
                  {moment.unix(weatherData.list[0].dt).format("LT")}
                </div>

                <div style={cardStyle}>
                  <strong>
                    {supportedLanguages[selectedLanguage]?.wind}:
                  </strong>{" "}
                  {weatherData.list[0].wind.speed} m/s
                </div>

                <div style={cardStyle}>
                  <strong>
                    {supportedLanguages[selectedLanguage]?.sunrise}:
                  </strong>{" "}
                  {moment.unix(weatherData.city.sunrise).format("LT")}
                  <br />
                  <strong>
                    {supportedLanguages[selectedLanguage]?.sunset}:
                  </strong>{" "}
                  {moment.unix(weatherData.city.sunset).format("LT")}
                </div>

                <div style={cardStyle}>
                  <strong>
                    {supportedLanguages[selectedLanguage]?.humidity}:
                  </strong>{" "}
                  {weatherData.list[0].main.humidity}%
                  <br />
                  <strong>
                    {supportedLanguages[selectedLanguage]?.visibility}:
                  </strong>{" "}
                  {weatherData.list[0].visibility / 1000} km
                </div>
              </div>
            )}
          </div>
        )}

        {/* weekly section */}
        {displayType === "weekly" && (
          <div>
            <h3>{supportedLanguages[selectedLanguage]?.weeklyForecast}</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {Object.keys(groupedData).map((day) => (
                <div key={day} onClick={() => handleDayClick(day)}>
                  <Card
                    day={day}
                    minTemp={groupedData[day].minTemp}
                    maxTemp={groupedData[day].maxTemp}
                    imageUrl={`http://openweathermap.org/img/w/${
                      groupedData[day].data.length > 0 &&
                      groupedData[day].data[0]?.weather &&
                      groupedData[day].data[0]?.weather.length > 0 &&
                      groupedData[day].data[0]?.weather[0]?.icon
                        ? groupedData[day].data[0]?.weather[0]?.icon
                        : "unknown"
                    }.png`}
                    weatherStatus={
                      groupedData[day].data.length > 0 &&
                      groupedData[day].data[0]?.weather &&
                      groupedData[day].data[0]?.weather.length > 0
                        ? groupedData[day].data[0]?.weather[0]?.description
                        : "Unknown"
                    }
                    selectedLanguage={selectedLanguage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {renderDetailedDayWeather()}
      </div>
    </div>
  );
};

export default Weather;
