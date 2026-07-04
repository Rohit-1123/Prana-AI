import { Settings, Ruler, Globe, Info, HelpCircle } from "lucide-react";
import { cn } from "../../../utils/cn";

export type SettingsSection = "appearance" | "units" | "timezone" | "about" | "support";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
}

export function SettingsSidebar({ activeSection, onSelectSection }: SettingsSidebarProps) {
  const sections: { id: SettingsSection; label: string; icon: any }[] = [
    { id: "appearance", label: "Appearance", icon: Settings },
    { id: "units", label: "Measurement Units", icon: Ruler },
    { id: "timezone", label: "Timezone Scope", icon: Globe },
    { id: "about", label: "About System", icon: Info },
    { id: "support", label: "Help & Support", icon: HelpCircle }
  ];

  return (
    <div className="glass-card p-4 flex flex-col gap-1.5 h-full overflow-y-auto animate-in fade-in duration-200">
      <div className="px-3 py-2 border-b border-border/80 mb-2">
        <span className="text-[10px] text-muted font-extrabold uppercase block tracking-wider">Control Panel</span>
        <span className="text-[9px] text-muted block mt-0.5">Customization preferences</span>
      </div>

      <nav className="flex flex-col gap-1">
        {sections.map((sec) => {
          const isActive = sec.id === activeSection;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-muted hover:text-foreground hover:bg-muted/5"
              )}
            >
              <sec.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted")} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
