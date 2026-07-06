import React, { createContext, useContext, useState, useEffect } from "react";

export type MeasurementUnit = "metric" | "imperial";
export type SystemTimezone = "IST" | "UTC";

interface SettingsContextType {
  measurementUnit: MeasurementUnit;
  systemTimezone: SystemTimezone;
  setMeasurementUnit: (unit: MeasurementUnit) => void;
  setSystemTimezone: (tz: SystemTimezone) => void;
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

  const setMeasurementUnit = (unit: MeasurementUnit) => {
    setMeasurementUnitState(unit);
    localStorage.setItem("measurement_unit", unit);
  };

  const setSystemTimezone = (tz: SystemTimezone) => {
    setSystemTimezoneState(tz);
    localStorage.setItem("system_timezone", tz);
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
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <SettingsContext.Provider value={{
      measurementUnit,
      systemTimezone,
      setMeasurementUnit,
      setSystemTimezone,
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
