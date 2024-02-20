import React from "react";
import moment from "moment";
import supportedLanguages from "../supportedLanguages"; 

interface DailyWeatherCardProps {
  day: string;
  data: any,
  supportedLanguages:keyof typeof supportedLanguages
}

const DailyWeatherCard: React.FC<DailyWeatherCardProps> = ({ day, data }) => {
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {data.map((hourData:any, index:any) => {
            console.log("hourData==", hourData.weather[0].icon);
            return (
              <tr key={index}>
                <td style={{ borderBottom: "1px solid #ddd" }}>
                  {moment.unix(hourData.time).format("LT")}
                </td>
                <td style={{ borderBottom: "1px solid #ddd" }}>
                  {hourData.temp} °C
                </td>
                <td style={{ borderBottom: "1px solid #ddd" }}>
                  <img
                    src={`http://openweathermap.org/img/w/${hourData?.weather[0].icon}.png`}
                    alt="weather icon"
                    style={{ width: "30px", height: "30px" }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyWeatherCard;