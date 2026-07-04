import { useState } from "react";
import { Database, Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function DataPanel() {
  const [city, setCity] = useState("Hyderabad");
  const [unit, setUnit] = useState("metric");
  const [timezone, setTimezone] = useState("IST");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("waqi_api_key") || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("waqi_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("waqi_api_key");
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.location.reload(); // Refresh to trigger immediate re-fetch
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Database className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Data Preferences</h4>
          <span className="text-[10px] text-muted block mt-0.5">Customize database variables settings and measurement scales</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
        
        {/* Preferred City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-muted block">Default Location centroid</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="Hyderabad" className="bg-card text-foreground">Hyderabad, IN</option>
            <option value="Delhi" className="bg-card text-foreground">New Delhi, IN</option>
            <option value="Mumbai" className="bg-card text-foreground">Mumbai, IN</option>
          </select>
        </div>

        {/* Units */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-muted block">Measurement units</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="metric" className="bg-card text-foreground">Metric (°C, m/s)</option>
            <option value="imperial" className="bg-card text-foreground">Imperial (°F, mph)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-muted block">Timezone Scope</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="IST" className="bg-card text-foreground">Indian Standard Time (IST)</option>
            <option value="UTC" className="bg-card text-foreground">Coordinated Universal Time (UTC)</option>
          </select>
        </div>

        {/* WAQI API Token */}
        <div className="flex flex-col gap-1.5 md:col-span-3 mt-2">
          <label className="text-[10px] uppercase font-bold text-muted block">WAQI (World Air Quality Index) API Token</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your personal WAQI API token (e.g. 96dfb28e...)"
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
          />
          <span className="text-[9px] text-muted">
            Obtain a free high-limit token at <a href="https://aqicn.org/data-platform/token/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">aqicn.org/data-platform/token</a>. If left empty, a shared public demo token is used.
          </span>
        </div>

      </div>

      <div className="border-t border-border pt-4 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="py-2 px-6 font-bold text-xs"
        >
          {isSaved ? (
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> Saved</span>
          ) : (
            "Save Data Preferences"
          )}
        </Button>
      </div>

    </form>
  );
}
