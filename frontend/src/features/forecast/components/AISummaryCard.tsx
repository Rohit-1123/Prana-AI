import { AlertCircle, HelpCircle, CheckCircle } from "lucide-react";
import { cn } from "../../../utils/cn";

interface AISummaryCardProps {
  overviewText: string;
  keyTrends: string[];
  riskLevel: "Low" | "Medium" | "High" | "Severe";
  attentionAreas: string[];
}

export function AISummaryCard({
  overviewText,
  keyTrends,
  riskLevel,
  attentionAreas
}: AISummaryCardProps) {
  
  const getRiskColor = (level: string) => {
    if (level === "Low") return "text-success border-success/20 bg-success/5";
    if (level === "Medium") return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary shrink-0" />
          <h4 className="font-bold text-sm text-foreground">AI Predictive Assessment</h4>
        </div>
        <div className={cn(
          "text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border",
          getRiskColor(riskLevel)
        )}>
          {riskLevel} Risk Scale
        </div>
      </div>

      {/* Main Advisory text */}
      <div className="flex flex-col gap-3.5 border-t border-border pt-4">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold">Executive Summary</span>
        <p className="text-xs text-foreground leading-relaxed font-sans">{overviewText}</p>
      </div>

      {/* Grid: Key Trends & Attention Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-4">
        
        {/* Key Trends */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold block">Key forecast trends</span>
          <div className="flex flex-col gap-2">
            {keyTrends.map((t, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-foreground items-start">
                <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Attention Areas */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold block">Attention sectors</span>
          <div className="flex flex-col gap-2">
            {attentionAreas.map((area, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-foreground items-start">
                <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{area}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
