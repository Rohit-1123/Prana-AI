import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

// --- TABS COMPONENT ---
export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ items, activeId, onChange, className }: TabsProps) => {
  return (
    <div className={cn("flex border-b border-[var(--border)] gap-1 w-full overflow-x-auto scrollbar-none", className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 border-transparent transition-all hover:text-[var(--text-primary)] cursor-pointer select-none whitespace-nowrap",
              isActive
                ? "border-[var(--primary)] text-[var(--primary)] font-extrabold"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};


// --- TABLE COMPONENTS ---
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto">
        <table ref={ref} className={cn("w-full text-left text-xs border-collapse font-sans", className)} {...props}>
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

export const TableHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <thead>
    <tr className={cn("border-b border-[var(--border)] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]", className)}>
      {children}
    </tr>
  </thead>
);

export const TableBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tbody className={cn("divide-y divide-[var(--border)] text-slate-700 dark:text-slate-200", className)}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tr className={cn("hover:bg-slate-50 dark:hover:bg-white/5 transition-colors", className)}>
    {children}
  </tr>
);


// --- DROPDOWN COMPONENT ---
export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const Dropdown = ({ options, selectedValue, onChange, label, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLabel = options.find((o) => o.value === selectedValue)?.label || selectedValue;

  return (
    <div className={cn("relative flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <span className="type-label text-[10px] text-slate-500 dark:text-slate-400 font-extrabold select-none">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-xs text-left text-[var(--text-primary)] font-semibold flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
        >
          <span>{currentLabel}</span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <>
            {/* Click-out backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            <div className="absolute top-full mt-1.5 left-0 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-1 shadow-lg z-20 max-h-[200px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-white/5 text-[var(--text-primary)] cursor-pointer",
                    opt.value === selectedValue && "bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
