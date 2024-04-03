import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import supportedLanguages from "../supportedLanguages";

interface TodayDetailsCardProps {
  temperature: number;
  weatherStatus: string;
  city: string;
  weatherIcon: string;
  selectedLanguage: keyof typeof supportedLanguages;
  setCenter: any;
}
const TodayDetailsCard: React.FC<TodayDetailsCardProps> = ({
  temperature,
  weatherStatus,
  city,
  weatherIcon,
  selectedLanguage,
  setCenter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedCityData, setSearchedCityData] = useState<any>(null);

  const apiKey = "ff1afc50d59929198791251ef8051e51";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&units=metric`
      );
      setCenter;
      setCenter({
        lat: response.data.coord.lat,
        lng: response.data.coord.lon,
      });
      setSearchedCityData(response.data);

      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const displayData = searchedCityData || {
    temperature,
    weatherStatus,
    city,
    weatherIcon,
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        margin: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex" }}>
          <input
            type="text"
            placeholder={supportedLanguages[selectedLanguage]?.searchForACity}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" style={{ marginLeft: "10px" }}>
            {supportedLanguages[selectedLanguage]?.search}
          </button>
        </form>
      </div>

      {!searchedCityData && (
        <>
          <h2>{supportedLanguages[selectedLanguage]?.todaysDetails}</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <div style={{ display: "flex" }}>
              <p style={{ fontSize: "42px", fontWeight: "bold" }}>
                {displayData.temperature}{" "}
              </p>
              <p style={{ fontSize: 25 }}>°C</p>
            </div>
            <p style={{ marginTop: 30 }}>{moment().format("dddd")}</p>
            <p style={{ marginTop: 30 }}>{moment().format("MMMM D, YYYY")}</p>
          </div>
          <div>
            <p style={{ marginTop: 30 }}>
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {supportedLanguages[selectedLanguage]?.weatherStatus}:{" "}
              </span>
              {displayData.weatherStatus}
            </p>
            <p style={{ marginTop: 30 }}>
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {supportedLanguages[selectedLanguage]?.city}:
              </span>
              {displayData.city}
            </p>
          </div>
        </>
      )}

      {searchedCityData && (
        <div>
          <h3
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            {supportedLanguages[selectedLanguage]?.todaysDetails} :
          </h3>
          <img
            src={`https://openweathermap.org/img/w/${searchedCityData.weather[0].icon}.png`}
            alt="Weather Icon"
            style={{ width: "50px", height: "50px" }}
          />
          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {supportedLanguages[selectedLanguage]?.city}{" "}
            </span>{" "}
            {searchedCityData.name}{" "}
          </p>

          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {supportedLanguages[selectedLanguage]?.temperature}:{" "}
            </span>{" "}
            {searchedCityData.main.temp} °C
          </p>
          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {supportedLanguages[selectedLanguage]?.weatherStatus}:
            </span>{" "}
            {searchedCityData.weather[0].main}
          </p>
          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {supportedLanguages[selectedLanguage]?.humidity}:
            </span>{" "}
            {searchedCityData.main.humidity}%
          </p>
          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {supportedLanguages[selectedLanguage]?.visibility}:
            </span>{" "}
            {searchedCityData.visibility / 1000} km
          </p>
          <p style={{ marginTop: 40 }}>
            <span style={{ fontWeight: "bold" }}>
              {supportedLanguages[selectedLanguage]?.rain}:
            </span>{" "}
            {searchedCityData.rain
              ? `${searchedCityData.rain["1h"]} mm`
              : "0 mm"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayDetailsCard;
