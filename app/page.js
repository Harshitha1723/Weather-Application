"use client";
import React, { useState } from "react";

const Weather = () => {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      temperature: "Temperature",
      windSpeed: "Wind Speed",
      humidity: "Humidity",
      sunrise: "Sunrise",
      sunset: "Sunset",
      hourlyForecast: "Hourly Forecast",
      weeklyForecast: "Weekly Forecast",
    },
    fr: {
      temperature: "Température",
      windSpeed: "Vitesse du vent",
      humidity: "Humidité",
      sunrise: "Levé du soleil",
      sunset: "Coucher du soleil",
      hourlyForecast: "Prévision horaire",
      weeklyForecast: "Prévision hebdomadaire",
    },
  };

  return (
    <div
      style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}
    >
      <div>
        <label>
          Select Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
          <strong style={{ marginLeft: "10px", color: "black" }}>
            {language.toUpperCase()}
          </strong>
        </label>
      </div>
      <div>
        <h2>{translations[language].weeklyForecast}</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
              >
                {translations[language].temperature}
              </td>
              <td>28°C</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
              >
                {translations[language].windSpeed}
              </td>
              <td>12 m/s</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
              >
                {translations[language].humidity}
              </td>
              <td>30%</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
              >
                {translations[language].sunrise}
              </td>
              <td style={{ color: "red" }}>5:30 AM</td>
            </tr>
            <tr>
              <td
                style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}
              >
                {translations[language].sunset}
              </td>
              <td>6:30 PM</td>
            </tr>
          </tbody>
        </table>

        <h3>{translations[language].hourlyForecast}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>1:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>22 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>2:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>23 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>3:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>23 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>4:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>24 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>5:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>23 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>6:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>20 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>7:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>20 °C</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #ddd" }}>8:00</td>
              <td style={{ borderBottom: "1px solid #ddd" }}>19 °C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Weather;