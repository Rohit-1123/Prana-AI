import React, { createContext, useContext, useEffect } from "react";

export type WeatherMode = "Sunny" | "Cloudy" | "Rain" | "Windy";
export type AQILevel = "Good" | "Moderate" | "Poor" | "VeryPoor" | "Severe";

interface EnvironmentalContextType {
  weatherMode: WeatherMode;
  aqiLevel: AQILevel;
  windSpeed: number;
  aqi: number;
}

const EnvironmentalContext = createContext<EnvironmentalContextType>({
  weatherMode: "Sunny",
  aqiLevel: "Moderate",
  windSpeed: 5.0,
  aqi: 100,
});

export const useEnvironmentalTheme = () => useContext(EnvironmentalContext);

interface EnvironmentalThemeProviderProps {
  children: React.ReactNode;
  selectedWard: {
    aqi: number;
    weather_condition?: string;
    wind_speed?: number;
  };
}

export function EnvironmentalThemeProvider({
  children,
  selectedWard,
}: EnvironmentalThemeProviderProps) {
  const aqi = selectedWard.aqi;
  const windSpeed = selectedWard.wind_speed ?? 5.0;
  
  // Map weather condition text to core modes
  const rawWeather = (selectedWard.weather_condition || "Sunny").toLowerCase();
  let weatherMode: WeatherMode = "Sunny";
  if (rawWeather.includes("cloud") || rawWeather.includes("overcast") || rawWeather.includes("mist")) {
    weatherMode = "Cloudy";
  } else if (rawWeather.includes("rain") || rawWeather.includes("drizzle") || rawWeather.includes("shower") || rawWeather.includes("storm") || rawWeather.includes("wet")) {
    weatherMode = "Rain";
  } else if (rawWeather.includes("wind") || rawWeather.includes("breeze") || windSpeed > 6.0) {
    weatherMode = "Windy";
  } else {
    weatherMode = "Sunny";
  }

  // Map AQI to levels
  let aqiLevel: AQILevel = "Moderate";
  if (aqi <= 50) aqiLevel = "Good";
  else if (aqi <= 100) aqiLevel = "Moderate";
  else if (aqi <= 200) aqiLevel = "Poor";
  else if (aqi <= 300) aqiLevel = "VeryPoor";
  else aqiLevel = "Severe";

  // Dynamic CSS Variables injection
  useEffect(() => {
    const root = document.documentElement;
    
    // Config values based on mode
    let glassReflection = "";
    let accentGlow = "";
    let aqiTint = "";
    
    // Weather reflections
    if (weatherMode === "Sunny") {
      glassReflection = "linear-gradient(135deg, rgba(251, 191, 36, 0.09) 0%, transparent 50%, rgba(251, 191, 36, 0.03) 100%)";
      accentGlow = "rgba(245, 158, 11, 0.15)";
    } else if (weatherMode === "Cloudy") {
      glassReflection = "linear-gradient(135deg, rgba(203, 213, 225, 0.05) 0%, transparent 70%)";
      accentGlow = "rgba(148, 163, 184, 0.1)";
    } else if (weatherMode === "Rain") {
      glassReflection = "linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, transparent 60%, rgba(56, 189, 248, 0.04) 100%)";
      accentGlow = "rgba(14, 165, 233, 0.15)";
    } else { // Windy
      glassReflection = "linear-gradient(135deg, rgba(34, 211, 238, 0.07) 0%, transparent 50%)";
      accentGlow = "rgba(34, 211, 238, 0.12)";
    }

    // AQI Tint overlays
    if (aqiLevel === "Good") {
      aqiTint = "rgba(16, 185, 129, 0.02)";
    } else if (aqiLevel === "Moderate") {
      aqiTint = "rgba(2, 132, 199, 0.01)";
    } else if (aqiLevel === "Poor") {
      aqiTint = "rgba(249, 115, 22, 0.04)";
    } else if (aqiLevel === "VeryPoor") {
      aqiTint = "rgba(239, 68, 68, 0.06)";
    } else { // Severe
      aqiTint = "rgba(225, 29, 72, 0.09)";
    }

    root.style.setProperty("--env-card-reflection", glassReflection);
    root.style.setProperty("--env-accent-glow", accentGlow);
    root.style.setProperty("--env-aqi-tint", aqiTint);
  }, [weatherMode, aqiLevel]);

  return (
    <EnvironmentalContext.Provider value={{ weatherMode, aqiLevel, windSpeed, aqi }}>
      {children}
    </EnvironmentalContext.Provider>
  );
}
