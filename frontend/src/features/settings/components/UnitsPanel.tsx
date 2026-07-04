import { useState } from "react";
import { Ruler, Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function UnitsPanel() {
  const [unit, setUnit] = useState(() => localStorage.getItem("measurement_unit") || "metric");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("measurement_unit", unit);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Ruler className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Measurement Units</h4>
          <span className="text-[10px] text-muted block mt-0.5">Customize metrics units for temperatures, wind speeds, and particulates</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-4 max-w-md">
        <label className="text-[10px] uppercase font-bold text-muted block">Measurement Scale</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer w-full"
        >
          <option value="metric" className="bg-card text-foreground">Metric (°C, m/s)</option>
          <option value="imperial" className="bg-card text-foreground">Imperial (°F, mph)</option>
        </select>
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
            "Save Units Preference"
          )}
        </Button>
      </div>

    </form>
  );
}
