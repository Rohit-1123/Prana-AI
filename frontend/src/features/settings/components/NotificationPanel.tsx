import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "../../../components/ui/Button";

export function NotificationPanel() {
  const [alerts, setAlerts] = useState({
    aqi: true,
    forecast: true,
    weeklyReport: false,
    email: true,
    push: false,
    recommendations: true
  });

  const [isSaved, setIsSaved] = useState(false);

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const switches: { key: keyof typeof alerts; label: string; desc: string }[] = [
    { key: "aqi", label: "Particulate Threshold Alerts", desc: "Notify immediately when focus ward AQI crosses warning limits." },
    { key: "forecast", label: "72h Horizon Warning Shifts", desc: "Push warnings when predictions indicate upward pollution peaks." },
    { key: "recommendations", label: "AI Policy Sandboxes Recommendations", desc: "Alert when mitigation actions execute on sensors." },
    { key: "weeklyReport", label: "Corporate Summary Bulletins", desc: "Email compiled corporate weekly briefing bulletins." },
    { key: "email", label: "Email Notifications Channel", desc: "Receive alerts updates inside mailbox." },
    { key: "push", label: "Web Browser Push Transmissions", desc: "Direct browser indicators warnings active." }
  ];

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Notification Alert Matrix</h4>
          <span className="text-[10px] text-muted block mt-0.5">Toggle alert parameters matching smart-city thresholds</span>
        </div>
      </div>

      {/* Switch selectors */}
      <div className="flex flex-col gap-5 border-t border-border pt-5">
        {switches.map((sw) => (
          <div key={sw.key} className="flex justify-between items-start gap-4 text-xs font-semibold text-foreground">
            <div className="flex-1">
              <span className="font-bold block">{sw.label}</span>
              <span className="text-[10px] text-muted block mt-0.5 font-sans leading-relaxed">{sw.desc}</span>
            </div>

            <button
              type="button"
              onClick={() => toggleAlert(sw.key)}
              className={cn(
                "w-12 h-6.5 rounded-full transition-all cursor-pointer relative p-0.5 border shrink-0 mt-0.5",
                alerts[sw.key] ? "bg-primary border-primary" : "bg-muted/20 border-border"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-card rounded-full shadow-sm transition-all transform",
                alerts[sw.key] ? "translate-x-[22px]" : "translate-x-0"
              )} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="py-2 px-6 font-bold text-xs"
        >
          {isSaved ? (
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> Settings Saved</span>
          ) : (
            "Save Alert Settings"
          )}
        </Button>
      </div>

    </form>
  );
}
