import { Map, TrendingUp, Download, FileText } from "lucide-react";

interface QuickActionsProps {
  onViewTwin: () => void;
  onOpenForecast: () => void;
  onGenerateReport: () => void;
  onExport: () => void;
}

export function QuickActions({
  onViewTwin,
  onOpenForecast,
  onGenerateReport,
  onExport
}: QuickActionsProps) {
  const actions = [
    { label: "View Digital Twin", icon: Map, action: onViewTwin },
    { label: "Open Forecast Center", icon: TrendingUp, action: onOpenForecast },
    { label: "Export chat log", icon: Download, action: onExport },
    { label: "Generate Report", icon: FileText, action: onGenerateReport }
  ];

  return (
    <div className="flex gap-2 flex-wrap items-center animate-in fade-in duration-200">
      {actions.map((act, index) => (
        <button
          key={index}
          onClick={act.action}
          title={act.label}
          className="bg-card hover:bg-muted/10 border border-border p-2 rounded-xl text-muted hover:text-foreground cursor-pointer flex items-center justify-center transition-colors shadow-sm"
        >
          <act.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
