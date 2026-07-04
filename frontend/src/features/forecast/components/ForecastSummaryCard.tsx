import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../../utils/cn";
import { ForecastExplanationCard } from "../../../components/ui/ExplainabilityComponents";

interface SummaryCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  trend?: "up" | "down" | "stable";
  colorClass?: string;
  subtitle?: string;
  factors?: { name: string; impact: number; trend: "up" | "down" | "stable"; explanation: string; confidence: number }[];
}

export function ForecastSummaryCard({
  title,
  value,
  badgeText,
  trend,
  colorClass,
  subtitle,
  factors
}: SummaryCardProps) {
  return (
    <div className="glass-card p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold">{title}</span>
        {badgeText && (
          <span className={cn(
            "text-[9px] uppercase font-extrabold px-2 py-0.5 rounded border shrink-0",
            colorClass || "border-primary/20 text-primary bg-primary/5"
          )}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-3xl font-black text-foreground tracking-tight">{value}</span>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold flex items-center gap-0.5",
            trend === "down" ? "text-success" : trend === "up" ? "text-danger" : "text-muted"
          )}>
            {trend === "down" ? <TrendingDown className="w-3 h-3" /> : trend === "up" ? <TrendingUp className="w-3 h-3" /> : null}
            {trend === "down" ? "Improving" : trend === "up" ? "Elevating" : "Stable"}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="text-[9px] text-muted mt-2 block">{subtitle}</span>
      )}

      {/* Expandable Why This Forecast factors list */}
      {factors && factors.length > 0 && (
        <ForecastExplanationCard factors={factors} />
      )}

      {/* Accent glow on hover */}
      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-primary/5 blur-xl group-hover:scale-155 transition-all duration-500" />
    </div>
  );
}
