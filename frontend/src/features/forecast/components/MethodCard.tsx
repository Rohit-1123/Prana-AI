import { Info } from "lucide-react";

/** Explains where the forecast numbers come from, so nobody mistakes them for station readings. */
export function MethodCard() {
  const rows = [
    ["Source", "Copernicus CAMS atmospheric model, delivered via Open-Meteo."],
    ["Index", "India's CPCB National AQI, from PM2.5 and PM10 averaged over 24 hours."],
    ["Forecast", "Model output for the next 72 hours, refreshed hourly. Each value is the 24-hour average ending at that hour."],
    ["Resolution", "About 40 km grid, so nearby places in a city show similar values."],
    ["Limits", "Estimates, not readings from CPCB monitoring stations. Local sources like a nearby road or fire may not be captured."]
  ];
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
        <Info className="w-4 h-4 text-primary shrink-0" /> How this forecast is made
      </h4>
      <dl className="flex flex-col gap-3 text-xs leading-relaxed">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10px] uppercase tracking-wider font-extrabold text-muted">{k}</dt>
            <dd className="text-foreground/85 mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
