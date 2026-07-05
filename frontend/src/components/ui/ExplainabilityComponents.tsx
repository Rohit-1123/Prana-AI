import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Clock, 
  Activity, 
  HelpCircle,
  X
} from "lucide-react";
import { cn } from "../../utils/cn";
import { translateFeedItem, translateFeedTime, translateFeedCategory } from "../../utils/i18n_extra";

// ==========================================
// 1. AI CONFIDENCE RING
// ==========================================
interface AIConfidenceRingProps {
  confidence: number; // e.g. 94
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}


export function AIConfidenceRing({
  confidence,
  size = "md",
  showLabel = true
}: AIConfidenceRingProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const dimensions = {
    sm: { radius: 14, strokeWidth: 2.5, svgSize: 34, textClass: "text-[8.5px]" },
    md: { radius: 20, strokeWidth: 3.5, svgSize: 48, textClass: "text-[11px]" },
    lg: { radius: 28, strokeWidth: 5, svgSize: 68, textClass: "text-[14px]" }
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference * (1 - confidence / 100);

  // Dynamic colors
  const strokeColor = confidence >= 90 
    ? "stroke-primary" 
    : confidence >= 75 
      ? "stroke-warning" 
      : "stroke-danger";

  const textColor = confidence >= 90 
    ? "text-primary" 
    : confidence >= 75 
      ? "text-warning" 
      : "text-danger";

  return (
    <div className="relative inline-flex items-center gap-2 select-none group">
      <div 
        className="relative flex items-center justify-center cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <svg 
          width={dimensions.svgSize} 
          height={dimensions.svgSize} 
          className="transform -rotate-90"
        >
          <circle 
            cx={dimensions.svgSize / 2} 
            cy={dimensions.svgSize / 2} 
            r={dimensions.radius} 
            stroke="var(--border)" 
            strokeWidth={dimensions.strokeWidth} 
            fill="transparent" 
          />
          <motion.circle 
            cx={dimensions.svgSize / 2} 
            cy={dimensions.svgSize / 2} 
            r={dimensions.radius} 
            stroke="currentColor" 
            strokeWidth={dimensions.strokeWidth} 
            fill="transparent" 
            className={strokeColor}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <span className={cn("absolute font-black text-foreground", dimensions.textClass)}>
          {confidence}%
        </span>
      </div>

      {showLabel && (
        <div className="flex flex-col text-left">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted leading-none">AI Confidence</span>
          <span className={cn("text-[9.5px] font-extrabold leading-none mt-1", textColor)}>
            {confidence >= 90 ? "Verified High" : confidence >= 75 ? "Satisfactory" : "Unstable"}
          </span>
        </div>
      )}

      {/* Tooltip explaining confidence calculation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-55 w-60 p-3 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl text-left"
          >
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-1.5">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-extrabold uppercase text-white">Confidence Formula</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Computed dynamically by our XGBoost classifier, combining historic accuracy validation (40%), data feed availability (30%), and weather boundary volatility (30%).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 2. EVIDENCE CHIP
// ==========================================
interface EvidenceChipProps {
  label: string;
  status: string;
  confidence: number;
  timestamp: string;
  icon: React.ReactNode;
}

export function EvidenceChip({
  label,
  status,
  confidence,
  timestamp,
  icon
}: EvidenceChipProps) {
  return (
    <div className="bg-background/40 border border-border/40 p-2.5 rounded-xl flex items-center gap-2.5 text-left hover:border-border transition-colors group">
      <div className="w-7 h-7 rounded-lg bg-muted/10 border border-border/40 flex items-center justify-center text-muted group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[9.5px] font-semibold text-foreground truncate block leading-none">{label}</span>
        <span className="text-[8.5px] text-muted mt-1 block leading-none">
          {status} &bull; {timestamp}
        </span>
      </div>
      <div className="text-right shrink-0 border-l border-border/40 pl-2">
        <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block leading-none">Conf</span>
        <span className="text-[9px] font-black text-primary block mt-0.5 leading-none">{confidence}%</span>
      </div>
    </div>
  );
}

// ==========================================
// 3. IMPACT METER
// ==========================================
interface ImpactMeterProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  color?: string;
}

export function ImpactMeter({
  value,
  max = 30,
  label,
  unit = "AQI Points",
  color = "bg-primary"
}: ImpactMeterProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className="flex flex-col gap-1 text-left w-full">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-muted">{label}</span>
        <span className="text-success">-{value} {unit}</span>
      </div>
      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

// ==========================================
// 4. RISK BADGE
// ==========================================
interface RiskBadgeProps {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  explanation: string;
}

export function RiskBadge({
  category,
  score,
  trend,
  confidence,
  explanation
}: RiskBadgeProps) {
  const isHigh = score >= 70;
  const isModerate = score >= 40 && score < 70;

  const colorClasses = isHigh
    ? "border-danger/20 bg-danger/5 text-danger"
    : isModerate
      ? "border-warning/20 bg-warning/5 text-warning"
      : "border-success/20 bg-success/5 text-success";

  const trendIcon = trend === "up" 
    ? <TrendingUp className="w-3 h-3 text-danger" /> 
    : trend === "down" 
      ? <TrendingDown className="w-3 h-3 text-success" /> 
      : null;

  return (
    <div className={cn("border p-3 rounded-xl flex flex-col justify-between text-left h-full transition-all hover:scale-[1.01]", colorClasses)}>
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-75">{category}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black">{score}</span>
            <span className="text-[9px] opacity-75">/100</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-[9px] font-bold">
            {trendIcon}
            <span>{trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"}</span>
          </div>
          <span className="text-[8px] opacity-80 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
            Conf: {confidence}%
          </span>
        </div>
      </div>
      <p className="text-[9.5px] mt-2 leading-relaxed font-semibold opacity-90 truncate-3-lines">
        {explanation}
      </p>
    </div>
  );
}

// ==========================================
// 5. INSIGHT TIMELINE
// ==========================================
interface InsightTimelineItem {
  id: number;
  time: string;
  text: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  icon: React.ReactNode;
}

interface InsightTimelineProps {
  feedItems: InsightTimelineItem[];
}

export function InsightTimeline({ feedItems }: InsightTimelineProps) {
  const activeLanguage = (localStorage.getItem("language") as "en" | "hi" | "te" | "ta" | "kn") || "en";

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      <div>
        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-primary animate-pulse" /> {
            activeLanguage === "hi" ? "पर्यावरण अंतर्दृष्टि फ़ीड" :
            activeLanguage === "te" ? "పర్యావరణ అంతర్దృష్టుల ఫీడ్" :
            activeLanguage === "ta" ? "சுற்றுச்சூழல் நுண்ணறிவு ஊட்டம்" :
            activeLanguage === "kn" ? "ಪರಿಸರ ಒಳನೋಟಗಳ ಫೀಡ್" :
            "Environmental Insights Feed"
          }
        </h4>
        <span className="text-[10px] text-muted mt-1 block">
          {activeLanguage === "hi" ? "लाइव कालानुक्रमिक व्याख्यात्मक घटनाएं" :
           activeLanguage === "te" ? "లైవ్ క్రమానుగత వివరణాత్మక సంఘటనలు" :
           activeLanguage === "ta" ? "நிகழ்நேர காலவரிசை விளக்க நிகழ்வுகள்" :
           activeLanguage === "kn" ? "ನೈಜ-ಸಮಯದ ಕಾಲಾನುಕ್ರಮದ ಘಟನೆಗಳು" :
           "Live chronological explainability events"}
        </span>
      </div>

      <div className="relative pl-4 border-l border-border flex flex-col gap-5.5 overflow-y-auto max-h-[380px] pr-1.5">
        <AnimatePresence>
          {feedItems.map((item, idx) => {
            const isHigh = item.severity === "High";
            const isMedium = item.severity === "Medium";
            const dotColor = isHigh 
              ? "bg-danger" 
              : isMedium 
                ? "bg-warning" 
                : "bg-success";

            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative text-[11px] leading-relaxed group"
              >
                {/* Timeline node dot */}
                <span className={cn(
                  "absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full border border-card z-10 transition-transform group-hover:scale-125",
                  dotColor
                )} />

                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-muted font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted" /> {translateFeedTime(item.time, activeLanguage)}
                      </span>
                      <span className={cn(
                        "text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded border",
                        isHigh 
                          ? "border-danger/30 text-danger bg-danger/5" 
                          : isMedium 
                            ? "border-warning/30 text-warning bg-warning/5" 
                            : "border-success/30 text-success bg-success/5"
                      )}>
                        {translateFeedCategory(item.category, activeLanguage)}
                      </span>
                    </div>
                    <p className="text-foreground font-medium mt-1.5 leading-normal">{translateFeedItem(item.text, activeLanguage)}</p>
                  </div>
                  <div className="text-right shrink-0 border-l border-border/40 pl-2">
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block leading-none">
                      {activeLanguage === "hi" ? "विश्वास" : activeLanguage === "te" ? "విశ్వసనీయత" : activeLanguage === "ta" ? "நம்பிக்கை" : activeLanguage === "kn" ? "ವಿಶ್ವಾಸ" : "Conf"}
                    </span>
                    <span className="text-[9.5px] font-black text-primary block mt-0.5 leading-none">{item.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// 6. REASON BREAKDOWN
// ==========================================
interface ReasonFactor {
  name: string;
  impact: number; // e.g. 18
  trend: "up" | "down" | "stable";
  explanation: string;
  confidence: number;
}

interface ReasonBreakdownProps {
  factors: ReasonFactor[];
}

export function ReasonBreakdown({ factors }: ReasonBreakdownProps) {
  return (
    <div className="flex flex-col gap-3.5 text-left w-full">
      {factors.map((f, idx) => {
        const percentage = Math.min(100, (f.impact / 30) * 100);
        const trendIcon = f.trend === "up" 
          ? <TrendingUp className="w-3.5 h-3.5 text-danger shrink-0" /> 
          : f.trend === "down" 
            ? <TrendingDown className="w-3.5 h-3.5 text-success shrink-0" /> 
            : null;

        return (
          <div key={idx} className="flex flex-col gap-1 group">
            <div className="flex justify-between items-center text-[10.5px] font-semibold">
              <span className="text-foreground flex items-center gap-1.5 font-semibold">
                {trendIcon}
                {f.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-black">+{f.impact}%</span>
                <span className="text-[8px] text-muted bg-muted/10 border border-border/50 px-1 rounded-sm">
                  Conf: {f.confidence}%
                </span>
              </div>
            </div>
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="h-full bg-primary rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <span className="text-[9px] text-muted leading-relaxed mt-0.5 block font-medium group-hover:text-foreground transition-colors">
              {f.explanation}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 7. COLLAPSIBLE FORECAST EXPLANATION CARD
// ==========================================
interface ForecastExplanationCardProps {
  factors: ReasonFactor[];
}

export function ForecastExplanationCard({ factors }: ForecastExplanationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-border/60 mt-3 pt-3 text-left w-full">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="w-full flex justify-between items-center text-[10px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer select-none"
      >
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> WHY THIS FORECAST?
        </span>
        <span className="text-[9px] font-semibold">View Factors &bull; ↗</span>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="glass-card w-full max-w-lg p-6 flex flex-col gap-4 relative z-10 border border-border shadow-theme text-left bg-card"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-muted hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div>
                  <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> Forecast Decision Factors
                  </h4>
                  <p className="text-[10px] text-muted mt-1">Causal attribution and weights mapped by the explainability engine</p>
                </div>

                {/* Factors list */}
                <div className="max-h-[300px] overflow-y-auto pr-1">
                  <ReasonBreakdown factors={factors} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
