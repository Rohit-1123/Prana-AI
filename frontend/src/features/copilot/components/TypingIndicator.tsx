import { Activity } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-2xl w-60 animate-pulse animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Activity className="w-4.5 h-4.5 text-primary animate-pulse" />
      </div>
      <div>
        <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest block">Copilot thinking</span>
        <span className="text-[9px] text-muted block mt-0.5">Resolving XGBoost vectors...</span>
      </div>
    </div>
  );
}
