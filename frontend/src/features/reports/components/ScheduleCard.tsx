import { useState } from "react";
import { Clock, Check } from "lucide-react";
import { cn } from "../../../utils/cn";

export function ScheduleCard() {
  const [selectedInterval, setSelectedInterval] = useState("Weekly");

  const intervals = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div>
        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
          <Clock className="w-4.5 h-4.5 text-primary" /> Automated Briefing Scheduler
        </h4>
        <span className="text-[10px] text-muted mt-1 block">Set automated intervals to transmit briefing reports to smart-city operators</span>
      </div>

      <div className="flex bg-muted/5 border border-border p-1 rounded-xl gap-1 mt-1">
        {intervals.map((int) => {
          const isSelected = selectedInterval === int;
          return (
            <button
              key={int}
              onClick={() => setSelectedInterval(int)}
              className={cn(
                "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer",
                isSelected 
                  ? "bg-card text-foreground shadow-theme border border-border" 
                  : "text-muted hover:text-foreground"
              )}
            >
              <span>{int} Intervals</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs border-t border-border pt-4 text-muted mt-1 leading-none">
        <span>Transmit: <strong>{selectedInterval} Briefs</strong></span>
        <span className="text-[9px] text-success font-extrabold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> Scheduler Active
        </span>
      </div>

    </div>
  );
}
