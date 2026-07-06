import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Sun, Droplets, Wind } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../utils/cn";
import { useSettings } from "../../../contexts/SettingsContext";

interface ForecastChartProps {
  wardName: string;
  data: any[];
}

export function ForecastChart({ wardName, data }: ForecastChartProps) {
  const { measurementUnit } = useSettings();
  const [activeChart, setActiveChart] = useState<"aqi" | "temp" | "humidity" | "wind">("aqi");

  const isImperial = measurementUnit === "imperial";

  const convertedData = data.map((d) => {
    if (isImperial) {
      return {
        ...d,
        temp: Number(((d.temp * 9) / 5 + 32).toFixed(1)),
        wind: Number((d.wind * 2.23694).toFixed(1))
      };
    }
    return d;
  });

  const tabs = [
    { id: "aqi", label: "AQI Predictions", icon: TrendingUp, color: "var(--primary)" },
    { id: "temp", label: isImperial ? "Temperature (°F)" : "Temperature (°C)", icon: Sun, color: "var(--warning)" },
    { id: "humidity", label: "Humidity (%)", icon: Droplets, color: "var(--accent)" },
    { id: "wind", label: isImperial ? "Wind Vectors (mph)" : "Wind Vectors (m/s)", icon: Wind, color: "var(--secondary)" }
  ];

  const getActiveColor = () => {
    return tabs.find(t => t.id === activeChart)?.color || "var(--primary)";
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      
      {/* Chart Headers and Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground">Interactive Forecast Horizons</h4>
          <span className="text-[10px] text-muted mt-1 block">Hourly parameters predictions inside {wardName} node boundaries</span>
        </div>

        <div className="flex bg-muted/5 border border-border p-1 rounded-xl flex-wrap gap-1">
          {tabs.map((t) => {
            const isActive = activeChart === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveChart(t.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer",
                  isActive 
                    ? "bg-card text-foreground shadow-theme border border-border" 
                    : "text-muted hover:text-foreground"
                )}
              >
                <t.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart viewport */}
      <div className="h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={convertedData}>
            <defs>
              <linearGradient id="colorForecastDynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getActiveColor()} stopOpacity={0.35}/>
                <stop offset="95%" stopColor={getActiveColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted)" fontSize={10} />
            <YAxis stroke="var(--muted)" fontSize={10} />
            <ChartTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '10px' }} />
            <Area 
              type="monotone" 
              dataKey={activeChart} 
              stroke={getActiveColor()} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorForecastDynamic)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
