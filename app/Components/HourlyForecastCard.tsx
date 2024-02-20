
import React from "react";
import moment from "moment";

interface HourlyForecastCardProps {
  time: number;
  temp: number;
  weatherIcon: string;
  weatherStatus: string;
}

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  time,
  temp,
  weatherIcon,
  weatherStatus,
}) => {

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4 key={time}>{moment.unix(time).format("LT")}</h4>
      <img
        src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
        alt="Weather Icon"
        style={{ marginBottom: "8px" }}
        key={weatherIcon} // Added key here
      />
      <p>{temp} °C</p>
      <p>{weatherStatus}</p>
    </div>
  );
};

export default HourlyForecastCard;