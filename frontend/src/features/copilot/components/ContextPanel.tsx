import { MapPin, Compass, Thermometer, Clock, ShieldAlert } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useSettings } from "../../../contexts/SettingsContext";

interface ContextPanelProps {
  selectedWard: any;
}

export function ContextPanel({ selectedWard }: ContextPanelProps) {
  const { formatTemp, formatWind } = useSettings();
  const displayAqi = selectedWard.aqi;
  
  const getAQIColorClass = (aqi: number) => {
    if (aqi <= 50) return "text-success border-success/20 bg-success/5";
    if (aqi <= 100) return "text-secondary border-secondary/20 bg-secondary/5";
    if (aqi <= 200) return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };

  const getAQIBadgeText = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    return "Poor / Severe";
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-5 h-full overflow-y-auto animate-in fade-in duration-200">
      
      <div>
        <h4 className="font-bold text-xs text-muted uppercase tracking-widest leading-none font-extrabold flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-primary" /> Active Copilot Context
        </h4>
        <span className="text-[9px] text-muted mt-1 block">Context boundaries active for prompt reasoning</span>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        
        {/* Ward Coordinates */}
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-muted font-bold block">Focus centroid</span>
            <span className="text-xs font-black text-foreground block mt-0.5">{selectedWard.name}</span>
            <span className="text-[8.5px] font-mono text-muted block mt-0.5">Lat: {selectedWard.latitude}, Lng: {selectedWard.longitude}</span>
          </div>
        </div>

        {/* AQI Dials */}
        <div className={cn(
          "border rounded-xl p-3 text-center flex flex-col justify-center items-center mt-1",
          getAQIColorClass(displayAqi)
        )}>
          <span className="text-[9px] uppercase font-bold tracking-wider text-muted block">Live Sensor AQI</span>
          <span className="text-2xl font-black block mt-0.5 text-foreground">{displayAqi}</span>
          <span className="text-[8.5px] font-extrabold block mt-0.5 uppercase tracking-wider">{getAQIBadgeText(displayAqi)} status</span>
        </div>

        {/* Weather SNAPSHOT */}
        <div className="flex items-start gap-2.5">
          <Thermometer className="w-4.5 h-4.5 text-warning shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-muted font-bold block">Temperature Index</span>
            <span className="text-xs font-black text-foreground block mt-0.5">{formatTemp(selectedWard.temperature)} Sunny</span>
            <span className="text-[8.5px] text-muted block mt-0.5">Wind speed: {formatWind(selectedWard.wind_speed)}</span>
          </div>
        </div>

        {/* Time parameters */}
        <div className="flex items-start gap-2.5 border-t border-border pt-4">
          <Clock className="w-4.5 h-4.5 text-muted shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-muted font-bold block">Evaluation Timestamp</span>
            <span className="text-xs font-semibold text-foreground block mt-0.5">June 2026 Shift</span>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex gap-2 items-start mt-2">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted leading-relaxed">System coordinates context locks prompt scopes to Gachibowli sector census inputs.</p>
        </div>

      </div>

    </div>
  );
}
