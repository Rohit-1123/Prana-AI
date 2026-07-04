import { Landmark, ShieldAlert, Award } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface ResponseTemplate {
  type: "recommendation" | "alert" | "comparison" | "advisory";
  title: string;
  desc: string;
  badge?: string;
  impact?: string;
}

interface ResponseCardProps {
  card: ResponseTemplate;
}

export function ResponseCard({ card }: ResponseCardProps) {
  
  const getIcon = () => {
    if (card.type === "recommendation") return Award;
    if (card.type === "alert") return ShieldAlert;
    return Landmark;
  };

  const Icon = getIcon();

  const getStyleClass = () => {
    if (card.type === "alert") return "border-danger/20 bg-danger/5 text-danger";
    if (card.type === "recommendation") return "border-success/20 bg-success/5 text-success";
    return "border-primary/20 bg-primary/5 text-primary";
  };

  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-theme animate-in fade-in duration-200">
      
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", getStyleClass())}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h5 className="font-bold text-foreground text-xs leading-none">{card.title}</h5>
            {card.badge && (
              <span className="text-[8.5px] font-mono text-muted block mt-1 uppercase tracking-wider">{card.badge}</span>
            )}
          </div>
        </div>

        {card.impact && (
          <span className="text-xs font-black text-success whitespace-nowrap">{card.impact}</span>
        )}
      </div>

      <p className="text-xs text-muted leading-relaxed font-sans mt-0.5">{card.desc}</p>

    </div>
  );
}
