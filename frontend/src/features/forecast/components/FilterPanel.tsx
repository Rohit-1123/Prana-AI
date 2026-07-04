import { SlidersHorizontal } from "lucide-react";

interface FilterPanelProps {
  locations: string[];
  selectedLocation: string;
  onChangeLocation: (loc: string) => void;
  selectedMetric: string;
  onChangeMetric: (metric: string) => void;
  selectedHorizon: string;
  onChangeHorizon: (horizon: string) => void;
}

export function FilterPanel({
  locations,
  selectedLocation,
  onChangeLocation,
  selectedMetric,
  onChangeMetric,
  selectedHorizon,
  onChangeHorizon
}: FilterPanelProps) {
  return (
    <div className="glass-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
      
      <div className="flex items-center gap-2.5 shrink-0">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <div>
          <span className="text-xs font-bold text-foreground block">Workspace Filters</span>
          <span className="text-[9px] text-muted block leading-none mt-0.5">Filter targets for active model runs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-grow md:flex-grow-0">
        {/* Location Dropdown */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Focus neighborhood</span>
          <select
            value={selectedLocation}
            onChange={(e) => onChangeLocation(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-card text-foreground">{loc}</option>
            ))}
          </select>
        </div>

        {/* Metric Dropdown */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Forecast Metric</span>
          <select
            value={selectedMetric}
            onChange={(e) => onChangeMetric(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="AQI" className="bg-card text-foreground">Air Quality Index (AQI)</option>
            <option value="PM2.5" className="bg-card text-foreground">Particulate PM2.5</option>
            <option value="PM10" className="bg-card text-foreground">Particulate PM10</option>
          </select>
        </div>

        {/* Horizon Dropdown */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Target Horizon</span>
          <select
            value={selectedHorizon}
            onChange={(e) => onChangeHorizon(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="24" className="bg-card text-foreground">Short Term (+24 Hours)</option>
            <option value="48" className="bg-card text-foreground">Mid Term (+48 Hours)</option>
            <option value="72" className="bg-card text-foreground">Long Term (+72 Hours)</option>
          </select>
        </div>
      </div>

    </div>
  );
}
