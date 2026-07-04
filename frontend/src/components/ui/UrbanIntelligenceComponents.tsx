import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles,
  Heart
} from "lucide-react";
import { cn } from "../../utils/cn";
import { AIConfidenceRing } from "./ExplainabilityComponents";

// ==========================================
// 1. HEALTH RISK CARD
// ==========================================
interface HealthRiskCardProps {
  targetGroup: string;
  currentRisk: "Low" | "Moderate" | "High" | "Critical";
  forecastRisk: string;
  recommendation: string;
  confidence: number;
  priority: string;
  icon: React.ReactNode;
}

export function HealthRiskCard({
  targetGroup,
  currentRisk,
  forecastRisk,
  recommendation,
  confidence,
  priority,
  icon
}: HealthRiskCardProps) {
  const colorClasses = currentRisk === "Critical"
    ? "border-danger/25 bg-danger/5 text-danger"
    : currentRisk === "High"
      ? "border-warning/25 bg-warning/5 text-warning"
      : currentRisk === "Moderate"
        ? "border-secondary/25 bg-secondary/5 text-secondary"
        : "border-success/25 bg-success/5 text-success";

  return (
    <div className={cn("border p-4 rounded-xl flex flex-col justify-between text-left h-full transition-all hover:scale-[1.01] hover:bg-card/30 duration-300", colorClasses)}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-current shrink-0">
            {icon}
          </div>
          <div>
            <h5 className="font-bold text-foreground text-xs leading-none">{targetGroup}</h5>
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mt-1">Priority: {priority}</span>
          </div>
        </div>
        <span className={cn(
          "text-[8.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border shrink-0",
          currentRisk === "Critical" ? "border-danger/30 text-danger bg-danger/5" : "border-muted text-muted"
        )}>
          {currentRisk} Risk
        </span>
      </div>

      <div className="mt-3.5 flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted">Forecast Trend</span>
          <span className="font-extrabold text-foreground">{forecastRisk}</span>
        </div>
        <div className="bg-background/20 p-2.5 rounded-lg border border-border/30">
          <span className="text-[8.5px] uppercase tracking-wide font-black text-muted block">AI Recommendation</span>
          <p className="text-[10px] text-foreground font-semibold mt-1 leading-normal">{recommendation}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-border/40 pt-2.5 mt-3 text-[9px] font-bold">
        <span className="text-muted flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Advisory Confirmed
        </span>
        <span className="text-primary font-black">AI Conf: {confidence}%</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. ENVIRONMENTAL HEALTH INDEX CARD
// ==========================================
interface EHIProps {
  score: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  explanation: string;
  humidity: number;
  greenCover: number;
  exposureFactor: number;
}

export function EnvironmentalHealthIndexCard({
  score,
  trend,
  confidence,
  explanation,
  humidity,
  greenCover,
  exposureFactor
}: EHIProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-5 text-left h-full">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-danger animate-pulse" /> Environmental Health Index (EHI)
          </h4>
          <span className="text-[10px] text-muted mt-1 block">Weighted exposed safety index scale (cumulative factors)</span>
        </div>
        <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
      </div>

      {/* Main Score Layout */}
      <div className="flex items-center gap-5 bg-muted/5 border border-border p-4 rounded-xl">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="var(--border)" strokeWidth="6.5" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="32" 
              stroke="var(--danger)" 
              strokeWidth="6.5" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-foreground leading-none">{score}</span>
            <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-muted mt-1">EHI Score</span>
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5">
            {trend === "up" ? (
              <span className="text-danger flex items-center gap-0.5 text-[11px] font-black">
                <TrendingUp className="w-3.5 h-3.5" /> Volatile Risk
              </span>
            ) : (
              <span className="text-success flex items-center gap-0.5 text-[11px] font-black">
                <TrendingDown className="w-3.5 h-3.5" /> Stable Conditions
              </span>
            )}
            <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted font-bold">
              Yesterday: {score + (trend === "up" ? -4 : 3)}
            </span>
          </div>
          <p className="text-[10px] text-muted mt-2 leading-relaxed font-semibold">
            {explanation}
          </p>
        </div>
      </div>

      {/* Secondary Factor bars */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>IT Corridor Green Cover Index</span>
            <span className="text-foreground">{greenCover}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${greenCover}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>Ambient Humidity Threshold</span>
            <span className="text-foreground">{humidity}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${humidity}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>Population Exposure Index</span>
            <span className="text-danger">{exposureFactor}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-danger rounded-full" style={{ width: `${exposureFactor}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CITY COMPARISON CARD
// ==========================================
interface CityComparisonCardProps {
  city: string;
  aqi: number;
  forecast: number;
  envScore: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CityComparisonCard({
  city,
  aqi,
  forecast,
  envScore,
  trend,
  confidence,
  isSelected,
  onClick
}: CityComparisonCardProps) {
  const isPoor = aqi > 150;
  const isModerate = aqi > 100 && aqi <= 150;

  const aqiColor = isPoor 
    ? "text-danger" 
    : isModerate 
      ? "text-warning" 
      : "text-success";

  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-2xl p-4 flex flex-col justify-between text-left h-full transition-all duration-300 relative overflow-hidden cursor-pointer select-none",
        isSelected 
          ? "bg-primary/10 border-primary shadow-lg scale-[1.01]" 
          : "bg-muted/5 border-border hover:bg-muted/8"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-bold text-foreground text-xs">{city}</h5>
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mt-0.5">Reliability: {confidence}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold">
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-danger" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-success" />
          )}
          <span className={cn(trend === "up" ? "text-danger" : "text-success")}>
            {trend === "up" ? "Rising" : "Improving"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/50 text-center">
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">AQI Index</span>
          <span className={cn("text-sm font-black mt-1 block", aqiColor)}>{aqi}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">Forecast 24h</span>
          <span className="text-sm font-black text-foreground mt-1 block">{forecast}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">EHI Score</span>
          <span className="text-sm font-black text-primary mt-1 block">{envScore}</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
      )}
    </div>
  );
}

// ==========================================
// 4. ENVIRONMENTAL SCORECARD
// ==========================================
interface EnvironmentalScoreCardProps {
  score: number;
}

export function EnvironmentalScoreCard({ score }: EnvironmentalScoreCardProps) {
  const items = [
    { label: "Predictive Forecast Accuracy", val: "94.6%", desc: "Mean relative variance vs raw sensors", status: "Optimal" },
    { label: "Urban Health Risk Mitigation", val: "88.2%", desc: "Directives adoption across risk groups", status: "Nominal" },
    { label: "Policy Improvement Index", val: "81.5%", desc: "Measured AQI reduction efficiency", status: "Satisfactory" },
    { label: "Sensor Availability Rate", val: "98.9%", desc: "Online active municipal node telemetry", status: "Stable" },
    { label: "Citizen Compliance Ratio", val: "76.4%", desc: "Heavy transport diversion traffic rates", status: "Action Needed" }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-5 text-left h-full justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Environmental Scorecard
            </h4>
            <span className="text-[10px] text-muted mt-1 block">City-wide key operational performance statistics</span>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl text-center">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block leading-none">Global Score</span>
            <span className="text-base font-black text-primary block mt-1 leading-none">{score}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 mt-5">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px] border-b border-border/40 pb-2.5 last:border-b-0 last:pb-0">
              <div className="flex-grow min-w-0 pr-4">
                <span className="font-bold text-foreground block truncate">{item.label}</span>
                <span className="text-[9px] text-muted block mt-0.5 truncate">{item.desc}</span>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                <span className="text-xs font-black text-foreground">{item.val}</span>
                <span className={cn(
                  "text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded border shrink-0",
                  item.status === "Optimal" || item.status === "Stable"
                    ? "border-success/30 text-success bg-success/5"
                    : item.status === "Nominal" || item.status === "Satisfactory"
                      ? "border-primary/30 text-primary bg-primary/5"
                      : "border-warning/30 text-warning bg-warning/5"
                )}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. TODAY'S DAILY AI BRIEFING
// ==========================================
interface DailyBriefCardProps {
  currentSituation: string;
  keyRisks: string[];
  forecast: string;
  recommendedActions: string[];
  expectedImprovement: string;
  confidence: number;
}

export function DailyBriefCard({
  currentSituation,
  keyRisks,
  forecast,
  recommendedActions,
  expectedImprovement,
  confidence
}: DailyBriefCardProps) {
  return (
    <div className="glass-card p-6 border-l-4 border-l-primary flex flex-col gap-4 text-left relative overflow-hidden bg-gradient-to-r from-card via-card to-primary/5">
      {/* soft light */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground leading-none">Today's AI Daily Briefing</h4>
            <span className="text-[9.5px] text-muted mt-1 block">City-wide daily environmental overview</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 relative z-10">
        <div className="bg-background/40 border border-border/40 p-4 rounded-xl">
          <span className="text-[9px] uppercase font-black text-primary block">Current Situation</span>
          <p className="text-[11.5px] text-foreground font-semibold mt-1.5 leading-relaxed">{currentSituation}</p>
        </div>

        <div className="bg-background/40 border border-border/40 p-4 rounded-xl">
          <span className="text-[9px] uppercase font-black text-primary block">Key Forecast Risks</span>
          <div className="flex flex-col gap-1.5 mt-1.5">
            {keyRisks.map((risk, idx) => (
              <div key={idx} className="flex gap-1.5 text-[11px] items-start text-foreground font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between font-sans">
          <div>
            <span className="text-[9px] uppercase font-black text-primary block">Causal Advisory & Forecast</span>
            <p className="text-[11px] text-foreground font-semibold mt-1.5 leading-normal">{forecast}</p>
            <p className="text-[10px] text-muted font-semibold mt-1 leading-normal truncate">{recommendedActions[0]}</p>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2.5 mt-2">
            <span className="text-[9px] font-bold text-muted uppercase">Expected AQI Improvement</span>
            <span className="text-[11.5px] font-black text-success flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5 animate-bounce" /> {expectedImprovement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. POLICY IMPACT TRACKER
// ==========================================
interface PolicyImpactCardProps {
  policyName: string;
  status: string;
  expectedImprovement: number;
  measuredImprovement: number;
  confidence: number;
  cost: number;
  duration: string;
  successRate: number;
}

export function PolicyImpactCard({
  policyName,
  status,
  expectedImprovement,
  measuredImprovement,
  confidence,
  cost,
  duration,
  successRate
}: PolicyImpactCardProps) {
  const percentage = Math.min(100, (measuredImprovement / expectedImprovement) * 100);

  return (
    <div className="bg-background/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between text-left h-full transition-all duration-300 hover:border-border">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h5 className="font-bold text-foreground text-xs leading-none">{policyName}</h5>
          <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-muted block mt-1">Status: {status}</span>
        </div>
        <span className="text-[8.5px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-extrabold">
          Conf: {confidence}%
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-border/40">
        <div className="flex justify-between items-center text-[10px] font-semibold text-muted">
          <span>Expected vs Measured Impact</span>
          <span className="text-success">-{measuredImprovement} AQI (Target: -{expectedImprovement})</span>
        </div>
        <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t border-border/40 pt-3">
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">Budget Cost</span>
          <span className="text-[10px] font-black text-foreground mt-0.5 block">${cost.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">Target Time</span>
          <span className="text-[10px] font-black text-foreground mt-0.5 block">{duration}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">Success Ratio</span>
          <span className="text-[10px] font-black text-success mt-0.5 block">{successRate}%</span>
        </div>
      </div>
    </div>
  );
}
