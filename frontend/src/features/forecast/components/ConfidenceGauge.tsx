import { Award, Database, RefreshCw } from "lucide-react";

interface ConfidenceGaugeProps {
  overallConfidence: number; // e.g. 93
  qualityScore: number;     // e.g. 88
  availability: number;     // e.g. 96
  reliability: number;      // e.g. 91
}

export function ConfidenceGauge({
  overallConfidence,
  qualityScore,
  availability,
  reliability
}: ConfidenceGaugeProps) {
  
  const parameters = [
    { label: "Prediction Quality", val: qualityScore, icon: Award, color: "stroke-primary" },
    { label: "Data Availability", val: availability, icon: Database, color: "stroke-secondary" },
    { label: "Forecast Reliability", val: reliability, icon: RefreshCw, color: "stroke-accent" }
  ];

  return (
    <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
      
      {/* Header */}
      <div>
        <h4 className="font-bold text-sm text-foreground">Confidence Matrix</h4>
        <span className="text-[9px] text-muted mt-1 block">AI model confidence evaluation parameters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
        
        {/* Radial gauge representing overall confidence */}
        <div className="flex flex-col items-center text-center relative justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="60" stroke="var(--border)" strokeWidth="10" fill="transparent" />
              <circle 
                cx="72" 
                cy="72" 
                r="60" 
                stroke="var(--primary)" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - overallConfidence / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-foreground leading-none">{overallConfidence}%</span>
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-primary mt-2">Overall Matrix</span>
            </div>
          </div>
        </div>

        {/* Detailed parameters bars */}
        <div className="flex flex-col gap-4">
          {parameters.map((p, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground flex items-center gap-1.5">
                  <p.icon className="w-4 h-4 text-muted shrink-0" />
                  {p.label}
                </span>
                <span className="text-primary font-bold">{p.val}%</span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${p.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
