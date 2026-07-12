import { Activity, Compass, ShieldCheck, Zap } from "lucide-react";
import { PromptChip } from "./PromptChip";

interface EmptyStateProps {
  questions: string[];
  onClickQuestion: (q: string) => void;
}

export function EmptyState({ questions, onClickQuestion }: EmptyStateProps) {
  
  const steps = [
    { title: "Calibrated sensor grids context", desc: "AI regression models map 72h lead predictions dynamically.", icon: Compass },
    { title: "Causal SHAP explanation vectors", desc: "Trace feature attribution shares (commuters, silt transport, construction).", icon: ShieldCheck },
    { title: "Sandboxed sandbox intervention policy", desc: "Simulate structural adjustments before real municipal deployments.", icon: Zap }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center max-w-xl mx-auto py-12 px-6 gap-6 text-center select-none animate-in fade-in duration-300">
      
      {/* Icon logo */}
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-theme">
        <Activity className="w-6 h-6 text-white" />
      </div>

      <div>
        <h3 className="text-xl font-black text-foreground">Welcome to PranaAI Copilot</h3>
        <p className="text-xs text-muted mt-2 leading-relaxed">
          Your environmental decision intelligence assistant. Prompt questions to calibrate predictions, isolate causal drivers, or run sandbox interventions.
        </p>
      </div>

      {/* Suggested chips */}
      <div className="flex flex-col gap-2 items-center mt-2">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold mb-1">Suggested prompts</span>
        <PromptChip questions={questions} onClickQuestion={onClickQuestion} />
      </div>

      {/* Quick Start Guide */}
      <div className="w-full flex flex-col gap-3.5 border-t border-border pt-6 mt-2 text-left">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold">Quick start guide</span>
        
        <div className="flex flex-col gap-3.5">
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-3 text-xs leading-normal items-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground block">{s.title}</span>
                <span className="text-[10.5px] text-muted block mt-0.5">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
