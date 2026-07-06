import { 
  Activity, 
  User, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Compass, 
  Database,
  PlayCircle
} from "lucide-react";
import { ResponseCard, type ResponseTemplate } from "./ResponseCard";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";

export interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  card?: ResponseTemplate;
  routes?: { name: string; aqi: number; reason: string }[];
  structuredData?: {
    primaryCause: string;
    secondaryCause: string;
    weatherInfluence: string;
    forecast: string;
    recommendations: string[];
    confidence: number;
    evidence: string[];
  };
  structuredReport?: {
    situation: {
      location: string;
      aqi: number;
      weather: string;
      trend: string;
      summary: string;
    };
    analysis: {
      primaryCause: string;
      secondaryCause: string;
      windInfluence: string;
      factors: { name: string; percentage: number }[];
    };
    evidence: {
      name: string;
      status: string;
      confidence: number;
      timestamp: string;
    }[];
    recommendations: {
      title: string;
      priority: "Critical" | "High" | "Medium" | "Low";
      improvement: number;
      confidence: number;
      difficulty: "Easy" | "Moderate" | "Hard";
      duration: string;
    }[];
    expectedImprovement: {
      currentAqi: number;
      predictedAqi: number;
      improvementPoints: number;
      confidence: number;
    };
    overallConfidence: {
      percentage: number;
      basedOn: string[];
    };
  };
}

interface MessageBubbleProps {
  msg: ChatMessage;
  onNavigate?: (tabId: string) => void;
  onGenerateReport?: () => void;
}

export function MessageBubble({ msg, onNavigate, onGenerateReport }: MessageBubbleProps) {
  const isUser = msg.sender === "user";

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (aqi <= 100) return "text-sky-400 border-sky-500/30 bg-sky-500/10";
    if (aqi <= 200) return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case "Critical":
        return "bg-red-500/15 border-red-500/30 text-red-400";
      case "High":
        return "bg-orange-500/15 border-orange-500/30 text-orange-400";
      case "Medium":
        return "bg-yellow-500/15 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-slate-500/15 border-slate-500/30 text-slate-400";
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-[92%] animate-in fade-in duration-200 select-none",
      isUser ? "self-end flex-row-reverse" : "self-start"
    )}>
      
      {/* Avatar */}
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-md",
        isUser 
          ? "bg-primary/10 border-primary/20 text-primary" 
          : "bg-gradient-to-tr from-primary to-accent border-transparent text-white"
      )}>
        {isUser ? <User className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
      </div>

      <div className="flex flex-col gap-3 flex-1 min-w-0">
        
        {/* User Plain Chat Bubble */}
        {isUser && (
          <div className="p-3.5 rounded-2xl text-[12.5px] leading-relaxed font-sans font-semibold shadow-theme border bg-primary text-white border-transparent rounded-tr-none self-end max-w-lg">
            {msg.text}
          </div>
        )}

        {/* Agent Response Header & Text description */}
        {!isUser && (
          <div className="p-3.5 rounded-2xl text-[12px] leading-relaxed font-sans shadow-theme border bg-card text-foreground border-border rounded-tl-none max-w-xl">
            {msg.text}
          </div>
        )}

        {/* UPGRADED STRUCTURED ENVIRONMENTAL INTELLIGENCE REPORT */}
        {!isUser && msg.structuredReport && (
          <div className="flex flex-col gap-4 max-w-xl text-left text-foreground">
            
            {/* 1. SITUATION CARD */}
            <div className="glass-card p-4 flex flex-col gap-3 border border-border/80 shadow-soft">
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} /> Situation Report
                </span>
                <span className={cn("text-[9px] px-2 py-0.5 rounded border font-extrabold flex items-center gap-1", getAqiColor(msg.structuredReport.situation.aqi))}>
                  <MapPin className="w-2.5 h-2.5" /> AQI {msg.structuredReport.situation.aqi}
                </span>
              </div>
              <div className="text-[11px] leading-normal text-muted flex flex-col gap-2 font-sans">
                <p className="font-semibold text-foreground bg-muted/5 p-2.5 rounded-xl border border-border/40">
                  {msg.structuredReport.situation.summary}
                </p>
                <div className="flex justify-between text-[10px] mt-1 pt-1">
                  <span>Location: <strong className="text-foreground">{msg.structuredReport.situation.location}</strong></span>
                  <span>Weather: <strong className="text-foreground">{msg.structuredReport.situation.weather}</strong></span>
                </div>
              </div>
            </div>

            {/* 2. ANALYSIS FACTOR CONTRIBUTION */}
            <div className="glass-card p-4 flex flex-col gap-3.5 border border-border/80 shadow-soft">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Causal Analysis
                </span>
                <span className="text-[9px] text-muted block mt-0.5">Primary vector: <strong className="text-foreground">{msg.structuredReport.analysis.primaryCause}</strong></span>
              </div>

              <div className="flex flex-col gap-2">
                {msg.structuredReport.analysis.factors.map((f, i) => (
                  <div key={i} className="text-[10.5px]">
                    <div className="flex justify-between font-medium text-muted text-[10px] mb-0.5">
                      <span>{f.name}</span>
                      <span className="text-foreground font-bold">{f.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted/15 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${f.percentage}%` }}
                        transition={{ duration: 1.2, delay: 0.1 * i }}
                        className={cn(
                          "h-full rounded-full",
                          f.percentage > 40 ? "bg-orange-500" : f.percentage > 20 ? "bg-cyan-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/5 p-2 rounded-xl text-[10px] text-muted border border-border/30">
                <span className="font-extrabold text-foreground block text-[9px] uppercase tracking-wider mb-0.5">Meteorological Effect</span>
                {msg.structuredReport.analysis.windInfluence}
              </div>
            </div>

            {/* 3. SUPPORTING EVIDENCE CARDS */}
            <div className="flex flex-col gap-2">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-muted block pl-1">Supporting Evidence</span>
              <div className="grid grid-cols-2 gap-3">
                {msg.structuredReport.evidence.map((ev, idx) => (
                  <div key={idx} className="glass-card p-3 border border-border/70 flex flex-col justify-between gap-1.5 shadow-sm text-[10.5px]">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-foreground truncate max-w-[80%] block">{ev.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-0.5 text-[9px] text-muted">
                      <span>Status: <strong className="text-foreground">{ev.status}</strong></span>
                      <span>Confidence: <strong className="text-foreground">{ev.confidence}%</strong></span>
                      <span className="text-[8px] text-slate-500">{ev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. RECOMMENDATION CARDS & AQI IMPROVEMENT WIDGET */}
            <div className="glass-card p-4 flex flex-col gap-4 border border-border/80 shadow-soft">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Action Recommendations
                </span>
                <span className="text-[9px] text-muted block mt-0.5">Recommended municipal operations for exposure mitigation</span>
              </div>

              <div className="flex flex-col gap-3">
                {msg.structuredReport.recommendations.map((r, idx) => (
                  <div key={idx} className="bg-muted/5 border border-border/40 p-3 rounded-xl flex flex-col gap-2 shadow-sm text-[11px]">
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-foreground leading-snug">{r.title}</span>
                      <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-black uppercase shrink-0", getPriorityBadge(r.priority))}>
                        {r.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[9.5px] text-muted border-t border-border/30 pt-1.5">
                      <span>Improvement: <strong className="text-emerald-400 font-bold">-{r.improvement} AQI Points</strong></span>
                      <span>Difficulty: <strong className="text-foreground font-semibold">{r.difficulty}</strong></span>
                      <span>Duration: <strong className="text-foreground font-semibold">{r.duration}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* EXPECTED AQI IMPROVEMENT VISUALIZER */}
              <div className="bg-gradient-to-r from-muted/5 to-primary/5 border border-primary/20 rounded-xl p-3.5 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-extrabold text-[9.5px] uppercase tracking-wider text-primary">Expected Impact</span>
                  <span className="text-[9px] font-bold text-muted">Confidence: {msg.structuredReport.expectedImprovement.confidence}%</span>
                </div>
                
                {/* AQI reduction graphic */}
                <div className="flex items-center justify-around py-1.5">
                  <div className="text-center">
                    <span className="text-[8px] uppercase tracking-wide text-muted block font-extrabold">Current</span>
                    <span className="text-base font-black text-rose-400">{msg.structuredReport.expectedImprovement.currentAqi}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
                  <div className="text-center">
                    <span className="text-[8px] uppercase tracking-wide text-muted block font-extrabold">Predicted</span>
                    <span className="text-base font-black text-emerald-400">{msg.structuredReport.expectedImprovement.predictedAqi}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-center">
                    <span className="text-[8px] uppercase tracking-wide text-emerald-400 block font-extrabold">Net Improvement</span>
                    <span className="text-xs font-black text-emerald-400">-{msg.structuredReport.expectedImprovement.improvementPoints} AQI</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(msg.structuredReport.expectedImprovement.improvementPoints / msg.structuredReport.expectedImprovement.currentAqi) * 100}%` }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* 5. CONFIDENCE RING & SOURCES ATTRIBUTION */}
            <div className="glass-card p-4 border border-border/80 shadow-soft flex items-center gap-4 text-[11px]">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                {/* SVG circular progress indicator */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="#10B981" strokeWidth="4.5" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * msg.structuredReport.overallConfidence.percentage) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute font-black text-foreground text-[10px]">
                  {msg.structuredReport.overallConfidence.percentage}%
                </div>
              </div>
              <div className="flex-1">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-primary block">AI Confidence Calibration</span>
                <p className="text-muted leading-relaxed mt-0.5">Based on: <strong className="text-foreground">{msg.structuredReport.overallConfidence.basedOn.join(", ")}</strong></p>
              </div>
            </div>

            {/* 6. QUICK ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "View Digital Twin", tab: "map", icon: Compass },
                { label: "Run What-if Simulation", tab: "reports", icon: PlayCircle },
                { label: "Generate Intelligence Report", action: "report", icon: Activity },
                { label: "Open Forecast Center", tab: "prediction", icon: TrendingUp },
                { label: "Compare Nearby Wards", tab: "prediction", icon: Layers },
                { label: "View Source Attribution", tab: "prediction", icon: Database }
              ].map((act, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (act.action === "report" && onGenerateReport) {
                      onGenerateReport();
                    } else if (act.tab && onNavigate) {
                      onNavigate(act.tab);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted/10 text-[9.5px] font-bold text-muted hover:text-white flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all duration-200"
                >
                  <act.icon className="w-3 h-3 text-primary shrink-0" />
                  <span>{act.label}</span>
                </button>
              ))}
            </div>

          </div>
        )}

        {/* Legacy structuredData block compatibility */}
        {!isUser && msg.structuredData && !msg.structuredReport && (
          <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-theme max-w-sm text-left text-foreground">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-[9px] font-black uppercase tracking-wider text-primary">AI Causal Attribution</span>
              <span className="text-[8.5px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-extrabold">
                Confidence: {msg.structuredData.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11px] mt-1">
              <div>
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Primary Cause</span>
                <span className="font-bold text-foreground mt-0.5 block">{msg.structuredData.primaryCause}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Secondary Cause</span>
                <span className="font-bold text-foreground mt-0.5 block">{msg.structuredData.secondaryCause}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Weather Impact</span>
                <span className="font-semibold text-foreground mt-0.5 block">{msg.structuredData.weatherInfluence}</span>
              </div>
            </div>

            <div className="bg-muted/5 border border-border p-2.5 rounded-xl text-[10.5px]">
              <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-primary block">AI Forecast Horizon</span>
              <p className="font-semibold text-foreground mt-1 leading-normal">{msg.structuredData.forecast}</p>
            </div>

            <div className="flex flex-col gap-1.5 mt-0.5">
              <span className="text-[8px] uppercase tracking-wider font-black text-muted block">Advisory Interventions</span>
              {msg.structuredData.recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 items-center text-[10px] bg-success/5 border border-success/20 text-success p-2 rounded-lg font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1 pt-2.5 border-t border-border">
              {msg.structuredData.evidence.map((ev, idx) => (
                <span key={idx} className="text-[8px] font-extrabold bg-muted/10 border border-border/80 px-2 py-0.5 rounded text-muted">
                  {ev}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modular Template Response Card */}
        {msg.card && (
          <ResponseCard card={msg.card} />
        )}

        {/* Dynamic Route recommendations */}
        {msg.routes && msg.routes.length > 0 && (
          <div className="flex flex-col gap-2 bg-muted/5 border border-border p-3.5 rounded-2xl">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary">Recommended green pathways:</span>
            <div className="flex flex-col gap-2 mt-1">
              {msg.routes.map((r, idx) => (
                <div key={idx} className="bg-card border border-border p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                  <div>
                    <span className="font-bold text-foreground block">{r.name}</span>
                    <span className="text-[8px] text-muted block mt-0.5">{r.reason}</span>
                  </div>
                  <span className="font-extrabold text-success whitespace-nowrap">AQI {r.aqi}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
