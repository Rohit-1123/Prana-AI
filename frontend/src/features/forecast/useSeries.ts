import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface SeriesRow {
  t: string;
  aqi: number;
  pm2_5: number;
  is_forecast: boolean;
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
}

/** Hourly AQI + weather for a point: the last 24h and the next 72h. */
export function useSeries(latitude: number, longitude: number) {
  const [series, setSeries] = useState<SeriesRow[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const ctrl = new AbortController();
    setState("loading");
    fetch(`${API_URL}/api/dashboard/series?lat=${latitude}&lng=${longitude}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { setSeries(d.series); setState("ok"); })
      .catch((e) => { if (e.name !== "AbortError") setState("error"); });
    return () => ctrl.abort();
  }, [latitude, longitude]);

  return { series, state };
}
