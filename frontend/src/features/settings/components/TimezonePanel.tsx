import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function TimezonePanel() {
  const [timezone, setTimezone] = useState(() => localStorage.getItem("system_timezone") || "IST");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("system_timezone", timezone);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Timezone Scope</h4>
          <span className="text-[10px] text-muted block mt-0.5">Configure system-wide local or global time formats</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-4 max-w-md">
        <label className="text-[10px] uppercase font-bold text-muted block">Timezone Scope</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer w-full"
        >
          <option value="IST" className="bg-card text-foreground">Indian Standard Time (IST)</option>
          <option value="UTC" className="bg-card text-foreground">Coordinated Universal Time (UTC)</option>
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
            "Save Timezone Preference"
          )}
        </Button>
      </div>

    </form>
  );
}
