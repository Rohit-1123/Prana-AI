import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";
import { buttonHover } from "../../animations";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyle = "inline-flex items-center justify-center font-sans type-button rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
    
    const variants = {
      primary: "bg-[var(--primary)] text-white hover:brightness-105 border border-transparent shadow-soft",
      secondary: "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-white/5 shadow-soft",
      accent: "bg-[var(--accent)] text-[#07111F] hover:brightness-105 border border-transparent",
      danger: "bg-[var(--danger)] text-white hover:brightness-105 border border-transparent",
      success: "bg-[var(--success)] text-white hover:brightness-105 border border-transparent",
      ghost: "bg-transparent text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-xl"
    };

    return (
      <motion.button
        ref={ref as any}
        type={type as any}
        disabled={disabled || isLoading}
        variants={buttonHover}
        whileHover="hover"
        whileTap="tap"
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("p-2 rounded-lg aspect-square", className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
