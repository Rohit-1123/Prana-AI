import { CITY_BY_WARD } from "../../data/mockCities";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface CopilotReply {
  text: string;
  routes?: { name: string; aqi: number; reason: string }[];
}

const toContext = (w: any) => ({
  name: String(w.name).slice(0, 80),
  city: CITY_BY_WARD[w.name],
  aqi: Math.round(Number(w.aqi)),
  pm2_5: w.pm2_5 ?? undefined,
  pm10: w.pm10 ?? undefined,
  temperature: w.temperature ?? undefined,
  humidity: w.humidity ?? undefined,
  wind_speed: w.wind_speed ?? undefined,
  weather_condition: w.weather_condition ?? undefined,
  forecast_24h: w.forecast?.[0]?.predicted_aqi
});

const category = (aqi: number) =>
  aqi <= 50 ? "Good" : aqi <= 100 ? "Satisfactory" : aqi <= 200 ? "Moderate" : aqi <= 300 ? "Poor" : aqi <= 400 ? "Very Poor" : "Severe";

/** Ask the Citizen Advisory Agent, grounded in the live readings the UI is showing. */
export async function askCopilot(
  query: string,
  ward: any,
  allWards: any[],
  language: string,
  history: { sender: string; text: string }[] = []
): Promise<CopilotReply> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(`${API_URL}/api/chat/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query.slice(0, 1000),
        language,
        ward: toContext(ward),
        locations: allWards.map(toContext),
        history: history.slice(-6).map((m) => ({ role: m.sender === "user" ? "user" : "assistant", text: m.text.slice(0, 2000) }))
      }),
      signal: controller.signal
    });
    if (res.status === 429) return { text: "You're sending messages quickly. Please wait a few seconds and try again." };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { text: data.advisory_response, routes: data.recommended_clean_routes?.length ? data.recommended_clean_routes : undefined };
  } catch {
    // Server unreachable: state the reading we have instead of inventing an answer
    return {
      text: `I can't reach the PranaAI server right now. Last reading for ${ward.name}: AQI ${ward.aqi} (${category(Number(ward.aqi))}). Please try again in a moment.`
    };
  } finally {
    clearTimeout(timeout);
  }
}
