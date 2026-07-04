import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "../../utils/cn";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    const baseStyle = "flex gap-3.5 p-4 rounded-xl border text-xs font-sans leading-relaxed shadow-soft";
    
    const variants = {
      info: "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300",
      success: "bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-300",
      warning: "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300",
      danger: "bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-300"
    };

    const icons = {
      info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
      success: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />,
      warning: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      danger: <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyle, variants[variant], className)}
        {...props}
      >
        {icons[variant]}
        <div className="flex flex-col gap-1">
          {title && <h5 className="font-extrabold text-[13px] tracking-tight text-slate-900 dark:text-white leading-none mb-0.5">{title}</h5>}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";
