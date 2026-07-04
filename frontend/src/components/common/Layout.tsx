import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

// --- CONTAINER WRAPPER ---
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("max-w-7xl w-full mx-auto px-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";


// --- SECTION CONTAINER ---
export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-8 md:py-12 border-b border-[var(--border)] last:border-b-0", className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";


// --- NAVBAR CONTAINER ---
export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--navbar)]/85 backdrop-blur-[var(--glass-blur)] transition-all",
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);

Navbar.displayName = "Navbar";


// --- SIDEBAR CONTAINER ---
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "w-64 bg-[var(--sidebar)] border-r border-[var(--border)] h-full overflow-y-auto hidden md:flex flex-col gap-6 p-6 transition-all",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";
