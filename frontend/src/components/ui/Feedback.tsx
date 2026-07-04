import { forwardRef, useState, type HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

// --- AVATAR COMPONENT ---
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = "md", ...props }, ref) => {
    const sizeStyle = {
      sm: "w-6 h-6 text-[10px]",
      md: "w-8 h-8 text-xs",
      lg: "w-12 h-12 text-sm"
    };

    const initials = name
      ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
      : "A";

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-bold bg-blue-500/10 border border-blue-500/20 text-[var(--primary)] shrink-0 select-none",
          sizeStyle[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={name || "User Avatar"} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";


// --- TOOLTIP COMPONENT ---
interface TooltipProps {
  content: string;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={cn(
          "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-semibold px-2 py-1.5 rounded-lg whitespace-nowrap shadow-floating z-50 pointer-events-none select-none animate-in fade-in slide-in-from-bottom-1 duration-150",
          className
        )}>
          {content}
        </div>
      )}
    </div>
  );
};


// --- SKELETON COMPONENT ---
export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg", className)}
      {...props}
    />
  );
};


// --- LOADER COMPONENT ---
export const Loader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col gap-2 justify-center items-center py-6", className)} {...props}>
      <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
      <span className="type-caption text-[11px] font-semibold tracking-wider font-mono uppercase">Syncing Sensor Streams...</span>
    </div>
  );
};
