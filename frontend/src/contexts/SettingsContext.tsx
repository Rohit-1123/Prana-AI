import React, { createContext, useContext, useState, useEffect } from "react";
import { type LanguageCode } from "../utils/i18n";

export type MeasurementUnit = "metric" | "imperial";
export type SystemTimezone = "IST" | "UTC";

interface SettingsContextType {
  measurementUnit: MeasurementUnit;
  systemTimezone: SystemTimezone;
  language: LanguageCode;
  setMeasurementUnit: (unit: MeasurementUnit) => void;
  setSystemTimezone: (tz: SystemTimezone) => void;
  setLanguage: (lang: LanguageCode) => void;
  formatTemp: (celsius: number) => string;
  formatWind: (mps: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [measurementUnit, setMeasurementUnitState] = useState<MeasurementUnit>(() => {
    return (localStorage.getItem("measurement_unit") as MeasurementUnit) || "metric";
  });
  const [systemTimezone, setSystemTimezoneState] = useState<SystemTimezone>(() => {
    return (localStorage.getItem("system_timezone") as SystemTimezone) || "IST";
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem("language") as LanguageCode) || "en";
  });

  const setMeasurementUnit = (unit: MeasurementUnit) => {
    setMeasurementUnitState(unit);
    localStorage.setItem("measurement_unit", unit);
  };

  const setSystemTimezone = (tz: SystemTimezone) => {
    setSystemTimezoneState(tz);
    localStorage.setItem("system_timezone", tz);
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const formatTemp = (celsius: number) => {
    if (measurementUnit === "imperial") {
      const fahrenheit = (celsius * 9) / 5 + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  const formatWind = (mps: number) => {
    if (measurementUnit === "imperial") {
      const mph = mps * 2.23694;
      return `${mph.toFixed(1)} mph`;
    }
    return `${mps.toFixed(1)} m/s`;
  };

  // Synchronize when storage is changed in another panel
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "measurement_unit") {
        setMeasurementUnitState((e.newValue as MeasurementUnit) || "metric");
      }
      if (e.key === "system_timezone") {
        setSystemTimezoneState((e.newValue as SystemTimezone) || "IST");
      }
      if (e.key === "language") {
        setLanguageState((e.newValue as LanguageCode) || "en");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <SettingsContext.Provider value={{
      measurementUnit,
      systemTimezone,
      language,
      setMeasurementUnit,
      setSystemTimezone,
      setLanguage,
      formatTemp,
      formatWind
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
