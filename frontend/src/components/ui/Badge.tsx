import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "secondary", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border transition-colors";
    
    const variants = {
      primary: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
      secondary: "bg-slate-100 dark:bg-white/5 border-[var(--border)] text-slate-650 dark:text-slate-350",
      success: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
      warning: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
      danger: "bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400",
      info: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyle, variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export interface ChipProps extends BadgeProps {
  onRemove?: () => void;
  active?: boolean;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, active = false, onRemove, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all",
          active
            ? "bg-[var(--primary)] border-transparent text-white shadow-soft"
            : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:bg-slate-50 dark:hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 text-current transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Chip.displayName = "Chip";
