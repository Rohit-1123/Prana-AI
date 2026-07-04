import { ArrowUpRight, ArrowDownRight, Equal } from "lucide-react";
import { cn } from "../../../utils/cn";

interface ForecastTableProps {
  data: any[];
}

export function ForecastTable({ data }: ForecastTableProps) {
  
  const getAQIColorClass = (aqi: number) => {
    if (aqi <= 50) return "text-success font-bold";
    if (aqi <= 100) return "text-secondary font-bold";
    if (aqi <= 200) return "text-warning font-bold";
    return "text-danger font-bold";
  };

  const getAQIBadgeText = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    return "Poor / Severe";
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div>
        <h4 className="font-bold text-sm text-foreground">Forecast Ledger Grid</h4>
        <span className="text-[10px] text-muted mt-1 block">Chronological ledgers showing predictive parameters targets</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/5 text-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5 pr-4">Lead Time</th>
              <th className="p-3.5 pr-4 text-center">Predicted AQI</th>
              <th className="p-3.5 pr-4 text-center">Category</th>
              <th className="p-3.5 pr-4 text-center">Temp</th>
              <th className="p-3.5 pr-4 text-center">Humidity</th>
              <th className="p-3.5 pr-4 text-center">Wind vectors</th>
              <th className="p-3.5 pr-4 text-center">Confidence</th>
              <th className="p-3.5 pr-4 text-center">Trends</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/5 transition-colors">
                <td className="p-3.5 font-bold">{row.time}</td>
                <td className={cn("p-3.5 text-center font-extrabold", getAQIColorClass(row.aqi))}>{row.aqi}</td>
                <td className="p-3.5 text-center font-semibold text-muted">{getAQIBadgeText(row.aqi)}</td>
                <td className="p-3.5 text-center font-medium">{row.temp}°C</td>
                <td className="p-3.5 text-center font-medium">{row.humidity}%</td>
                <td className="p-3.5 text-center font-medium">{row.wind} m/s</td>
                <td className="p-3.5 text-center font-black text-primary">{row.confidence}%</td>
                <td className="p-3.5 text-center font-semibold text-muted">
                  <div className="flex items-center justify-center gap-1">
                    {row.trend === "rising" ? (
                      <span className="text-danger flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5 animate-pulse" /> Rising</span>
                    ) : row.trend === "falling" ? (
                      <span className="text-success flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5 animate-pulse" /> Falling</span>
                    ) : (
                      <span className="text-muted flex items-center gap-0.5"><Equal className="w-3.5 h-3.5" /> Stable</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
