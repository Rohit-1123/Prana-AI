import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  time?: string;
  unread?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, title, description, time, unread = false, onClose, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex gap-3.5 relative shadow-soft transition-all duration-200",
          unread && "border-[var(--primary)]/30 bg-blue-500/[0.02] dark:bg-blue-500/[0.01]",
          className
        )}
        {...props}
      >
        {unread && (
          <span className="absolute top-4 right-8 w-2 h-2 bg-[var(--primary)] rounded-full" />
        )}
        
        <div className="text-[var(--primary)] shrink-0 mt-0.5">
          {icon || <Bell className="w-4.5 h-4.5" />}
        </div>
        
        <div className="flex flex-col gap-1 pr-6">
          <div className="flex items-center gap-2">
            <h5 className="font-bold text-xs text-[var(--text-primary)] leading-tight">{title}</h5>
            {time && <span className="type-caption text-[10px] whitespace-nowrap">{time}</span>}
          </div>
          <p className="type-caption text-[11px] leading-normal text-slate-550 dark:text-slate-400">{description}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Notification.displayName = "Notification";
