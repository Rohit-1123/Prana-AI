import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { BrandMark } from "../shell/AppShell";
import { cn } from "../../utils/cn";
import { useSettings } from "../../contexts/SettingsContext";
import { localizedBootSteps } from "../../utils/i18n";

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

const logoTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    tagline: "Environmental Intelligence. Reimagined.",
    version: "Version 1.0 (Hyderabad MVP Corridor)"
  },
  hi: {
    tagline: "पर्यावरणीय खुफिया। नए रूप में।",
    version: "संस्करण १.० (हैदराबाद एमवीपी कॉरिडोर)"
  },
  te: {
    tagline: "పర్యావరణ మేధస్సు. సరికొత్తగా.",
    version: "వెర్షన్ 1.0 (హైదరాబాద్ MVP కారిడార్)"
  },
  ta: {
    tagline: "சுற்றுச்சூழல் நுண்ணறிவு. புதிய வடிவில்.",
    version: "பதிப்பு 1.0 (ஹைதராபாத் MVP காரிடார்)"
  },
  kn: {
    tagline: "ಪರಿಸರ ಬುದ್ಧಿವಂತಿಕೆ. ಮರುಚಿಂತನೆ.",
    version: "ಆವೃತ್ತಿ 1.0 (ಹೈದರಾಬಾದ್ MVP ಕಾರಿಡಾರ್)"
  }
};

export function BootLogo() {
  const isReduced = useReducedMotion();
  const { language } = useSettings();
  const tLogo = logoTranslations[language] || logoTranslations["en"];

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
      <BrandMark className="w-14 h-14" />
      
      <div className="text-center mt-2">
        <h2 className="text-3xl font-extralight tracking-tight text-foreground leading-none">
          PranaAI
        </h2>
        <span className="eyebrow block mt-3">
          {tLogo.tagline}
        </span>
        <span className="text-[11px] text-muted block mt-1.5">
          {tLogo.version}
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
      className="flex items-center gap-2.5 text-xs text-foreground"
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
    <div className="w-full max-w-xs bg-foreground/10 h-[3px] rounded-full overflow-hidden relative z-10">
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
    <div className="text-xs text-primary relative z-10 animate-pulse">
      {text}
    </div>
  );
}

export function BootLayout({ progress, completedSteps, activeStep }: BootSequenceProps) {
  const { language } = useSettings();
  const allSteps = localizedBootSteps[language] || localizedBootSteps["en"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="glass-strong rounded-[2.25rem] w-full max-w-sm flex flex-col items-center gap-6 relative px-8 py-10">
        <BootLogo />
        <ProgressBar value={progress} />
        <StatusIndicator text={activeStep} />
        <InitializationPanel completedSteps={completedSteps} allSteps={allSteps} />
      </div>
    </div>
  );
}
