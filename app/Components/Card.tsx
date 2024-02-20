import React from "react";
import moment from "moment";
import supportedLanguages from "../supportedLanguages"; 

interface CardProps {
  day: string;
  minTemp: number;
  maxTemp: number;
  imageUrl?: string;
  time?: number;
  weatherStatus?: string;
  selectedLanguage:any
}

const Card: React.FC<CardProps> = ({
  day,
  minTemp,
  maxTemp,
  imageUrl,
  time,
  weatherStatus,
  selectedLanguage
}) => {
  const lang = "en"; 

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
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Weather icon"
          style={{ maxWidth: "50px", maxHeight: "50px", marginBottom: "10px" }}
          key={imageUrl} 
        />
      )}
      <h4>{day}</h4>
      {time && <p key={time}>{supportedLanguages[selectedLanguage]?.time}: {moment.unix(time).format("LT")}</p>}
      <p>{supportedLanguages[selectedLanguage]?.minTemp}: {minTemp} °C</p>
      <p>{supportedLanguages[selectedLanguage]?.maxTemp}: {maxTemp} °C</p>
      <p>{supportedLanguages[selectedLanguage]?.weatherStatus}: {weatherStatus}</p>
    </div>
  );
};

export default Card;