import { useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../../../utils/cn";

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  
  // Custom Spacing Density Preferences state
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  
  // Motion Preferences state
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleDensityChange = (val: "compact" | "comfortable" | "spacious") => {
    setDensity(val);
    
    // Apply compaction globally to layout bounds
    const html = document.documentElement;
    html.classList.remove("density-compact", "density-comfortable", "density-spacious");
    html.classList.add(`density-${val}`);
    
    alert(`Spacing layout density updated: "${val}". Spacing scales recalculated.`);
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">Appearance Configurations</h4>
          <span className="text-[10px] text-muted block mt-0.5">Customize layouts style, color theme, and animations scales</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-5">
        
        {/* A. Colors Theme switcher */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block">Theme Engine selection</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light Theme", icon: Sun },
              { id: "dark", label: "Dark Theme", icon: Moon },
              { id: "system", label: "System Sync", icon: Monitor }
            ].map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-3 rounded-xl border text-center transition-all cursor-pointer",
                    isSelected 
                      ? "bg-primary/5 border-primary text-foreground font-bold" 
                      : "bg-card border-border text-muted hover:bg-muted/5"
                  )}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="text-[10px]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. Spacing Densities */}
        <div className="flex flex-col gap-2.5 border-t border-border pt-5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block">Layout spacing density</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "compact", label: "Compact Density" },
              { id: "comfortable", label: "Comfortable Grid" },
              { id: "spacious", label: "Spacious Canvas" }
            ].map((d) => {
              const isSelected = density === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDensityChange(d.id as any)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer",
                    isSelected 
                      ? "bg-primary/5 border-primary text-foreground font-black" 
                      : "bg-card border-border text-muted hover:bg-muted/5"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* C. Animation Scales */}
        <div className="flex justify-between items-center border-t border-border pt-5 text-xs font-semibold text-foreground">
          <div>
            <span className="font-bold block">Enable Micro-Animations</span>
            <span className="text-[10px] text-muted block mt-0.5">Toggle transitions hover scales and charts animations</span>
          </div>

          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={cn(
              "w-12 h-6.5 rounded-full transition-all cursor-pointer relative p-0.5 border",
              animationsEnabled ? "bg-primary border-primary" : "bg-muted/20 border-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 bg-card rounded-full shadow-sm transition-all transform",
              animationsEnabled ? "translate-x-[22px]" : "translate-x-0"
            )} />
          </button>
        </div>

      </div>

    </div>
  );
}
