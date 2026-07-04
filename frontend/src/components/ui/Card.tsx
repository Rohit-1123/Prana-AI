import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";
import { cardHover } from "../../animations";

export interface CardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref as any}
        variants={hoverable ? cardHover : undefined}
        whileHover={hoverable ? "hover" : undefined}
        className={cn(
          "bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-soft transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export const GlassCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref as any}
        variants={hoverable ? cardHover : undefined}
        whileHover={hoverable ? "hover" : undefined}
        className={cn(
          "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] rounded-xl p-6 shadow-glass transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export interface MetricCardProps extends CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  description?: string;
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, icon, trend, description, className, hoverable = true, ...props }, ref) => {
    return (
      <Card ref={ref} hoverable={hoverable} className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex justify-between items-center">
          <span className="type-caption text-xs uppercase font-extrabold tracking-wider">{title}</span>
          {icon && <div className="text-[var(--text-secondary)]">{icon}</div>}
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black tracking-tight text-[var(--text-primary)]">{value}</span>
          {(trend || description) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded border",
                    trend.isPositive
                      ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
              {description && <span className="type-caption text-xs leading-normal">{description}</span>}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";
