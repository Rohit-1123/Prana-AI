import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="type-label text-[10px] text-slate-500 dark:text-slate-400 font-extrabold">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-slate-400 select-none pointer-events-none">{leftIcon}</div>}
          
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-xs font-sans text-[var(--text-primary)] placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/30",
              className
            )}
            {...props}
          />
          
          {rightIcon && <div className="absolute right-3.5 text-slate-400">{rightIcon}</div>}
        </div>
        {error && <span className="type-caption text-[11px] text-[var(--danger)]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface SearchBarProps extends Omit<InputProps, "leftIcon"> {
  onSearch?: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, placeholder = "Search location...", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        className={cn("bg-slate-100/50 dark:bg-white/5", className)}
        {...props}
      />
    );
  }
);

SearchBar.displayName = "SearchBar";
