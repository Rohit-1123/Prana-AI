import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Check } from "lucide-react";
import { cn } from "../../utils/cn";

// Custom hook to detect browser reduced motion setting
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
  return reducedMotion;
}

interface BootSequenceProps {
  progress: number;
  completedSteps: string[];
  activeStep: string;
}

export function ThemeAwareGradient() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* radial gradients */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[45rem] h-[45rem] rounded-full bg-secondary/5 blur-[130px] animate-pulse" style={{ animationDuration: "10s" }} />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-[0.03]" />
    </div>
  );
}

export function BootBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <ThemeAwareGradient />
      
      {/* Floating dust particles */}
      <div className="absolute inset-0">
        {[1, 2, 3, 4, 5].map((p) => (
          <div
            key={p}
            className={cn(
              "absolute w-1 h-1 rounded-full bg-primary/20 animate-float",
              p === 1 && "top-1/3 left-1/4 delay-100 duration-1000",
              p === 2 && "top-1/2 left-2/3 delay-300 duration-1200",
              p === 3 && "top-2/3 left-1/3 delay-700 duration-1500",
              p === 4 && "top-1/4 left-3/4 delay-200 duration-800",
              p === 5 && "top-3/4 left-1/2 delay-500 duration-1100"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function BootLogo() {
  const isReduced = useReducedMotion();

  const logoVariants = {
    hidden: { opacity: 0, scale: isReduced ? 1 : 0.92 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as any }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={logoVariants}
      className="flex flex-col items-center gap-3 relative z-10"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-theme">
        <Activity className="w-8 h-8 text-white" />
      </div>
      
      <div className="text-center mt-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground leading-none">
          Prana<span className="text-primary font-black">AI</span>
        </h2>
        <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted block mt-2">
          Environmental Intelligence. Reimagined.
        </span>
        <span className="text-[8px] text-muted font-bold block mt-1">
          Version 1.0 (Hyderabad MVP Corridor)
        </span>
      </div>
    </motion.div>
  );
}

interface InitializationStepProps {
  label: string;
  isCompleted: boolean;
}

export function InitializationStep({ label, isCompleted }: InitializationStepProps) {
  const isReduced = useReducedMotion();

  const stepVariants = {
    hidden: { opacity: 0, y: isReduced ? 0 : 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stepVariants}
      className="flex items-center gap-2 text-[11px] font-semibold text-foreground"
    >
      <div className={cn(
        "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300",
        isCompleted 
          ? "bg-success/15 border border-success/30 text-success" 
          : "bg-muted/10 border border-border text-transparent"
      )}>
        {isCompleted && <Check className="w-2.5 h-2.5" />}
      </div>
      <span className={cn(isCompleted && "text-muted line-through font-normal")}>{label}</span>
    </motion.div>
  );
}

interface InitializationPanelProps {
  completedSteps: string[];
  allSteps: string[];
}

export function InitializationPanel({ completedSteps, allSteps }: InitializationPanelProps) {
  return (
    <div className="w-full max-w-xs flex flex-col gap-2 relative z-10 border-t border-border pt-4">
      {allSteps.map((step) => {
        const isCompleted = completedSteps.includes(step);
        // Only show if it's completed or is the next current step
        const isVisible = isCompleted || completedSteps.length === allSteps.indexOf(step);
        
        if (!isVisible) return null;

        return (
          <InitializationStep
            key={step}
            label={step}
            isCompleted={isCompleted}
          />
        );
      })}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full max-w-xs bg-muted/20 h-1 rounded-full overflow-hidden relative z-10">
      <div 
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface StatusIndicatorProps {
  text: string;
}

export function StatusIndicator({ text }: StatusIndicatorProps) {
  return (
    <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest relative z-10 animate-pulse">
      {text}
    </div>
  );
}

export function BootLayout({ progress, completedSteps, activeStep }: BootSequenceProps) {
  
  const allSteps = [
    "Initializing Platform",
    "Connecting AQI Services",
    "Connecting Weather Network",
    "Loading Environmental Intelligence",
    "Preparing Digital Twin",
    "Loading Forecast Engine",
    "Preparing AI Copilot",
    "Finalizing Mission Control"
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background select-none">
      <BootBackground />
      
      <div className="w-full max-w-sm flex flex-col items-center gap-6 relative px-6 py-10">
        <BootLogo />
        <ProgressBar value={progress} />
        <StatusIndicator text={activeStep} />
        <InitializationPanel completedSteps={completedSteps} allSteps={allSteps} />
      </div>
    </div>
  );
}
