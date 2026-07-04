import { Info, Compass } from "lucide-react";

export function AboutPanel() {
  
  const techStack = [
    { name: "React Framework", version: "18.3.1" },
    { name: "Vite Compiler", version: "8.1.0" },
    { name: "Leaflet GIS Map", version: "1.9.4" },
    { name: "Recharts Visuals", version: "2.12.7" }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">About PranaAI Decision Engine</h4>
          <span className="text-[10px] text-muted block mt-0.5">Version 1.0.0 (Hyderabad MVP Corridor)</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-border pt-5 text-xs text-muted leading-relaxed font-sans">
        <p>
          PranaAI is an Environmental Intelligence Operating System built to assist smart-city administrators and municipal operators.
        </p>

        {/* Tech grid */}
        <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block mb-1">Core Tech Stack Specifications</span>
          {techStack.map((tech, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs border-b border-border/40 pb-1.5 mt-0.5">
              <span className="font-semibold text-foreground">{tech.name}</span>
              <span className="font-mono text-muted">{tech.version}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border/60 pt-4 mt-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-primary shrink-0" />
          </div>
          <span className="font-bold text-foreground">Developed by Team PranaAI. Predict. Explain. Act.</span>
        </div>

      </div>

    </div>
  );
}
