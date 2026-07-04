import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("inline-flex bg-slate-100 dark:bg-white/5 border border-[var(--border)] p-1 rounded-xl gap-0.5 shadow-inner", className)}>
      {[
        { id: "light" as const, icon: <Sun className="w-3.5 h-3.5" />, tooltip: "Light Theme" },
        { id: "dark" as const, icon: <Moon className="w-3.5 h-3.5" />, tooltip: "Dark Theme" },
        { id: "system" as const, icon: <Monitor className="w-3.5 h-3.5" />, tooltip: "System Theme" }
      ].map((mode) => {
        const isActive = theme === mode.id;
        return (
          <button
            key={mode.id}
            title={mode.tooltip}
            onClick={() => setTheme(mode.id)}
            className={cn(
              "p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer",
              isActive && "bg-[var(--surface)] text-[var(--primary)] dark:text-[var(--primary)] font-extrabold shadow-soft"
            )}
          >
            {mode.icon}
          </button>
        );
      })}
    </div>
  );
};
