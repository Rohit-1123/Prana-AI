import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

const STEPS = [
  "Analyzing Traffic...",
  "Checking Weather...",
  "Processing Sensor Data...",
  "Running Prediction Model...",
  "Generating Recommendations..."
];

export function TypingIndicator() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-2xl w-64 animate-pulse animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Activity className="w-4.5 h-4.5 text-primary animate-spin" style={{ animationDuration: "2s" }} />
      </div>
      <div>
        <span className="text-[8.5px] font-black text-primary font-mono uppercase tracking-wider block">Copilot Analytical Engine</span>
        <span className="text-[11px] text-foreground font-semibold block mt-0.5 transition-all duration-300">
          {STEPS[stepIndex]}
        </span>
      </div>
    </div>
  );
}
