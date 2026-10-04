// India National AQI (CPCB): one source of truth for bands, colours and the dominant pollutant.
export const AQI_BANDS = [
  { max: 50, label: "Good", color: "#10B981", range: "0–50" },
  { max: 100, label: "Satisfactory", color: "#84CC16", range: "51–100" },
  { max: 200, label: "Moderate", color: "#FBBF24", range: "101–200" },
  { max: 300, label: "Poor", color: "#F97316", range: "201–300" },
  { max: 400, label: "Very Poor", color: "#EF4444", range: "301–400" },
  { max: Infinity, label: "Severe", color: "#991B1B", range: "401+" }
] as const;

export const aqiBand = (aqi: number) => AQI_BANDS.find((b) => aqi <= b.max) ?? AQI_BANDS[AQI_BANDS.length - 1];
export const aqiLabel = (aqi: number) => aqiBand(aqi).label;
export const aqiColor = (aqi: number) => aqiBand(aqi).color;

// CPCB sub-index breakpoints: [conc_hi, aqi_hi] pairs starting from (0, 0)
const PM25 = [[30, 50], [60, 100], [90, 200], [120, 300], [250, 400], [500, 500]];
const PM10 = [[50, 50], [100, 100], [250, 200], [350, 300], [430, 400], [600, 500]];

function subIndex(conc: number, bp: number[][]) {
  let loC = 0, loI = 0;
  for (const [hiC, hiI] of bp) {
    if (conc <= hiC) return loI + ((conc - loC) * (hiI - loI)) / (hiC - loC);
    loC = hiC; loI = hiI;
  }
  return 500;
}

/** Which pollutant sets the AQI. */
export const mainPollutant = (pm2_5: number, pm10: number) =>
  subIndex(pm10, PM10) > subIndex(pm2_5, PM25) ? "PM10" : "PM2.5";

/** Position (0-100%) of an AQI on a scale of six equal-width bands. */
export function aqiPosition(aqi: number) {
  const i = AQI_BANDS.findIndex((b) => aqi <= b.max);
  const idx = i === -1 ? AQI_BANDS.length - 1 : i;
  const lo = idx === 0 ? 0 : AQI_BANDS[idx - 1].max;
  const hi = Number.isFinite(AQI_BANDS[idx].max) ? AQI_BANDS[idx].max : 500;
  const within = Math.min(1, Math.max(0, (aqi - lo) / (hi - lo)));
  return ((idx + within) / AQI_BANDS.length) * 100;
}
