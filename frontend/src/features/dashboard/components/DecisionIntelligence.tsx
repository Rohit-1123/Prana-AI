import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Leaf, 
  Truck, 
  HardHat, 
  Activity, 
  Wind, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Play,
  Server,
  Database
} from "lucide-react";
import { 
  AIConfidenceRing, 
  EvidenceChip
} from "../../../components/ui/ExplainabilityComponents";

// Helper to get AQI category details
const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { label: "Good", color: "text-success bg-success/15 border-success/35" };
  if (aqi <= 100) return { label: "Satisfactory", color: "text-secondary bg-secondary/15 border-secondary/35" };
  if (aqi <= 200) return { label: "Moderate", color: "text-warning bg-warning/15 border-warning/35" };
  return { label: "Severe", color: "text-danger bg-danger/15 border-danger/35" };
};

// ==========================================
// FEATURE 4 & 6: TODAY'S AI EXHAUSTIVE BRIEF
// ==========================================
interface ExecutiveBriefCardProps {
  wardName: string;
  currentAqi: number;
  primarySources: { source: string; percentage: number }[];
  forecastText: string;
  recommendedActions: string[];
  expectedImprovement: number;
  confidence: number;
  cityName?: string;
}

export function ExecutiveBriefCard({
  wardName,
  currentAqi,
  primarySources,
  forecastText,
  recommendedActions,
  expectedImprovement,
  confidence,
  cityName
}: ExecutiveBriefCardProps) {
  const cat = getAQICategory(currentAqi);

  const cityMetrics: Record<string, {
    confidenceText: string;
    primaryRisk: string;
    reliability: string;
    evidenceSources: string;
    decisionImpact: string;
  }> = {
    Hyderabad: {
      confidenceText: "93% (High)",
      primaryRisk: "Traffic & Construction",
      reliability: "95% (Stable)",
      evidenceSources: "6 Nodes, Radar, GIS",
      decisionImpact: "Very High Impact"
    },
    Bangalore: {
      confidenceText: "94% (High)",
      primaryRisk: "Traffic & Dust",
      reliability: "96% (Stable)",
      evidenceSources: "5 Wards, Satellite, GIS",
      decisionImpact: "High Impact"
    },
    Chennai: {
      confidenceText: "92% (High)",
      primaryRisk: "Coastal Winds & Traffic",
      reliability: "94% (Stable)",
      evidenceSources: "4 Nodes, Marine Buoys",
      decisionImpact: "Moderate Impact"
    },
    Delhi: {
      confidenceText: "89% (Moderate)",
      primaryRisk: "Industrial & Silt Dust",
      reliability: "90% (Moderate)",
      evidenceSources: "7 Nodes, Lidars, GIS",
      decisionImpact: "Critical Impact"
    },
    Mumbai: {
      confidenceText: "93% (High)",
      primaryRisk: "Maritime Boundary & Traffic",
      reliability: "95% (Stable)",
      evidenceSources: "6 Nodes, Coastal Radar",
      decisionImpact: "Very High Impact"
    }
  };

  const activeCity = cityName || "Hyderabad";
  const metrics = cityMetrics[activeCity] || cityMetrics.Hyderabad;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card relative overflow-hidden p-6 border-l-4 border-l-primary shadow-lg bg-gradient-to-r from-card via-card to-primary/5 text-left"
    >
      {/* Background soft lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground">Today's AI Environmental Brief</h2>
              <p className="text-[10px] text-muted leading-none mt-0.5">Real-time executive briefing generated for {wardName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Situation Box */}
          <div className="bg-muted/5 border border-border rounded-xl p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden group">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">Current Situation</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-foreground">{currentAqi}</span>
                <span className="text-[10px] font-mono text-muted">AQI</span>
              </div>
            </div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-2 text-center ${cat.color}`}>
              {cat.label} Conditions
            </span>
          </div>

          {/* Primary Contributors */}
          <div className="bg-muted/5 border border-border rounded-xl p-4 flex flex-col min-h-[120px]">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">Primary Pollution Sources</span>
            <div className="flex flex-col gap-2 mt-3 flex-1 justify-center">
              {primarySources.slice(0, 2).map((src, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 font-medium">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-primary" : "bg-secondary"}`} />
                    {src.source}
                  </span>
                  <span className="font-bold text-muted">{src.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Box */}
          <div className="bg-muted/5 border border-border rounded-xl p-4 flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">AI Forecast Horizon</span>
              <p className="text-xs text-foreground mt-2.5 font-medium leading-relaxed">
                {forecastText}
              </p>
            </div>
          </div>

          {/* Directives & Target Improvements */}
          <div className="bg-muted/5 border border-border rounded-xl p-4 flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">Advisory & Impact</span>
              <p className="text-[11px] text-muted mt-2 font-medium leading-relaxed truncate">
                {recommendedActions[0] || "Monitoring current loads"}
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
              <span className="text-[9px] font-bold text-muted uppercase">Target Improvement</span>
              <span className="text-xs font-black text-success flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -{expectedImprovement} AQI
              </span>
            </div>
          </div>
        </div>

        {/* FEATURE 6 — EXECUTIVE METRICS (KPI Cards) */}
        <div className="border-t border-border/80 pt-5 mt-1">
          <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-primary block mb-3.5">Executive Decision Indicators</span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Overall Confidence</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block">{metrics.confidenceText}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Primary Risk</span>
              <span className="text-[11.5px] font-black text-danger mt-1.5 block truncate">{metrics.primaryRisk}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Prediction Reliability</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block">{metrics.reliability}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Expected Improvement</span>
              <span className="text-[11.5px] font-black text-success mt-1.5 block">-{expectedImprovement} AQI Points</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Evidence Sources Used</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block truncate">{metrics.evidenceSources}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">Estimated Decision Impact</span>
              <span className="text-[11.5px] font-black text-primary mt-1.5 block">{metrics.decisionImpact}</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// ==========================================
// FEATURE 1: AI POLLUTION SOURCE ATTRIBUTION
// ==========================================
interface SourceAttributionCardProps {
  attributions: { source: string; percentage: number; confidence: number }[];
  explanation: string;
  overallConfidence: number;
}

export function SourceAttributionCard({
  attributions,
  explanation,
  overallConfidence
}: SourceAttributionCardProps) {
  // Sort attributions by percentage descending
  const sortedAttributions = [...attributions].sort((a, b) => b.percentage - a.percentage);

  // Colors mapping for styling the progress bars
  const colorsMap: Record<string, { bar: string; dot: string }> = {
    "Traffic": { bar: "bg-gradient-to-r from-secondary to-accent", dot: "bg-secondary" },
    "Traffic Contribution": { bar: "bg-gradient-to-r from-secondary to-accent", dot: "bg-secondary" },
    "Construction": { bar: "bg-gradient-to-r from-primary to-emerald-400", dot: "bg-primary" },
    "Construction Contribution": { bar: "bg-gradient-to-r from-primary to-emerald-400", dot: "bg-primary" },
    "Industrial": { bar: "bg-gradient-to-r from-warning to-amber-400", dot: "bg-warning" },
    "Industrial Activity": { bar: "bg-gradient-to-r from-warning to-amber-400", dot: "bg-warning" },
    "Industrial Contribution": { bar: "bg-gradient-to-r from-warning to-amber-400", dot: "bg-warning" },
    "Weather": { bar: "bg-gradient-to-r from-indigo-500 to-indigo-400", dot: "bg-indigo-500" },
    "Weather Contribution": { bar: "bg-gradient-to-r from-indigo-500 to-indigo-400", dot: "bg-indigo-500" },
    "Meteorological Factors": { bar: "bg-gradient-to-r from-indigo-500 to-indigo-400", dot: "bg-indigo-500" },
    "Natural Dust": { bar: "bg-gradient-to-r from-slate-500 to-slate-400", dot: "bg-slate-500" },
    "Road Dust": { bar: "bg-gradient-to-r from-slate-500 to-slate-400", dot: "bg-slate-500" },
    "Other Sources": { bar: "bg-gradient-to-r from-pink-500 to-pink-400", dot: "bg-pink-500" },
    "Unknown": { bar: "bg-gradient-to-r from-gray-500 to-gray-400", dot: "bg-gray-500" }
  };

  const getSourceStyles = (sourceName: string) => {
    return colorsMap[sourceName] || { bar: "bg-primary", dot: "bg-primary" };
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-primary" /> AI Pollution Source Attribution
          </h4>
          <span className="text-[10px] text-muted mt-1 block">Real-time source fingerprinting analysis</span>
        </div>
        
        {/* Reusable Confidence Ring */}
        <AIConfidenceRing confidence={overallConfidence} size="sm" showLabel={true} />
      </div>

      {/* Attribution Bars */}
      <div className="flex flex-col gap-3.5">
        {sortedAttributions.map((attr, idx) => {
          const styles = getSourceStyles(attr.source);
          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <span className="text-foreground flex items-center gap-1.5 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                  {attr.source}
                </span>
                <span className="font-bold text-foreground">{attr.percentage}%</span>
              </div>
              <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${attr.percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                  className={`h-full rounded-full ${styles.bar}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Narrative Explanation */}
      <div className="bg-muted/5 border border-border p-4 rounded-xl text-left mt-auto">
        <span className="text-[8px] uppercase tracking-widest font-extrabold text-primary flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary animate-pulse" /> Explainability Engine
        </span>
        <p className="text-[11px] text-muted font-medium mt-1.5 leading-relaxed">
          "{explanation}"
        </p>
      </div>
    </div>
  );
}

// ==========================================
// FEATURE 3: WHAT-IF SCENARIO SIMULATOR
// ==========================================
interface WhatIfSimulatorProps {
  currentAqi: number;
  predictedAqi: number;
  trafficReduction: number;
  setTrafficReduction: (val: number) => void;
  constructionPause: number;
  setConstructionPause: (val: number) => void;
  industrialReduction: number;
  setIndustrialReduction: (val: number) => void;
  waterSprinkling: number;
  setWaterSprinkling: (val: number) => void;
  wasteBurningPrevention: number;
  setWasteBurningPrevention: (val: number) => void;
  estimatedCost: number;
  estimatedTime: string;
  environmentalImpact: string;
  estimatedImprovement: number;
  confidence: number;
}

export function WhatIfSimulator({
  currentAqi,
  predictedAqi,
  trafficReduction,
  setTrafficReduction,
  constructionPause,
  setConstructionPause,
  industrialReduction,
  setIndustrialReduction,
  waterSprinkling,
  setWaterSprinkling,
  wasteBurningPrevention,
  setWasteBurningPrevention,
  estimatedCost,
  estimatedTime,
  environmentalImpact,
  estimatedImprovement,
  confidence
}: WhatIfSimulatorProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '6s' }} /> What-If Scenario Simulator
          </h4>
          <span className="text-[10px] text-muted mt-1 block">Simulate administrative policies and evaluate future outcomes</span>
        </div>
        
        {/* Reusable Confidence Ring */}
        <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
      </div>

      {/* Simulator Sliders & Controls Grid */}
      <div className="flex flex-col gap-4">
        {/* Sliders */}
        <div className="flex flex-col gap-3.5">
          {/* Traffic Reduction */}
          <div className="flex flex-col gap-1 text-left">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-muted" /> Traffic Restriction
              </span>
              <span className="text-primary font-bold">{trafficReduction}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={trafficReduction}
              onChange={(e) => setTrafficReduction(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Construction Pause */}
          <div className="flex flex-col gap-1 text-left">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <HardHat className="w-3.5 h-3.5 text-muted" /> Construction Abatement
              </span>
              <span className="text-primary font-bold">{constructionPause}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={constructionPause}
              onChange={(e) => setConstructionPause(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer appearance-none"
            />
          </div>

          {/* Industrial Reduction */}
          <div className="flex flex-col gap-1 text-left">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-muted" /> Industrial Emissions Control
              </span>
              <span className="text-primary font-bold">{industrialReduction}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={industrialReduction}
              onChange={(e) => setIndustrialReduction(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-border rounded-lg cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          {/* Water Sprinkling */}
          <button 
            onClick={() => setWaterSprinkling(waterSprinkling === 100 ? 0 : 100)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              waterSprinkling > 0
                ? "bg-primary/10 border-primary/30 text-primary font-bold" 
                : "bg-muted/5 border-border text-muted hover:bg-muted/10 font-medium"
            }`}
          >
            <span>Water Sprinkling</span>
            <span className={`w-2.5 h-2.5 rounded-full ${waterSprinkling > 0 ? "bg-primary animate-ping" : "bg-muted"}`} />
          </button>

          {/* Waste Burning Prevention */}
          <button 
            onClick={() => setWasteBurningPrevention(wasteBurningPrevention === 100 ? 0 : 100)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              wasteBurningPrevention > 0
                ? "bg-primary/10 border-primary/30 text-primary font-bold" 
                : "bg-muted/5 border-border text-muted hover:bg-muted/10 font-medium"
            }`}
          >
            <span>Burning Ban</span>
            <span className={`w-2.5 h-2.5 rounded-full ${wasteBurningPrevention > 0 ? "bg-primary animate-ping" : "bg-muted"}`} />
          </button>
        </div>
      </div>

      {/* Simulated Outcomes */}
      <div className="bg-muted/5 border border-border p-4 rounded-2xl flex flex-col gap-4 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Current AQI</span>
            <span className="text-xl font-extrabold text-foreground">{currentAqi}</span>
          </div>
          <div className="flex items-center text-muted font-bold animate-pulse">➔</div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">Predicted AQI</span>
            <motion.span 
              key={predictedAqi}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-black text-primary"
            >
              {predictedAqi}
            </motion.span>
          </div>
        </div>

        {/* Dynamic Simulation Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border pt-4">
          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <TrendingDown className="w-3.5 h-3.5 text-success mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">Est. Reduction</span>
            <span className="text-xs font-extrabold block text-success mt-0.5">-{estimatedImprovement} Points</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <DollarSign className="w-3.5 h-3.5 text-secondary mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">Simulated Cost</span>
            <span className="text-xs font-extrabold block text-foreground mt-0.5">${estimatedCost.toLocaleString()}</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <Clock className="w-3.5 h-3.5 text-accent mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">Deploy Time</span>
            <span className="text-xs font-extrabold block text-foreground mt-0.5">{estimatedTime}</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <Leaf className="w-3.5 h-3.5 text-success mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">Eco Impact</span>
            <span className="text-xs font-extrabold block text-success mt-0.5">{environmentalImpact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FEATURE 2, 3 & 7: AI RECOMMENDED ACTIONS
// ==========================================
interface RecommendedActionItem {
  id: number;
  title: string;
  desc: string;
  priority: string;
  impact: string;
  confidence: number;
  duration: string;
  evidence: string;
  executed: boolean;
}

interface RecommendedActionsProps {
  actions: RecommendedActionItem[];
  onExecuteAction: (id: number, title: string) => void;
}

export function RecommendedActions({
  actions,
  onExecuteAction
}: RecommendedActionsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Causal mappings to explain recommendations
  const explanationMappings: Record<number, { why: string; now: string; difficulty: string; benefit: string }> = {
    1: {
      why: "Diesel heavy vehicles emit substantial quantities of PM2.5 and soot, which are particularly hazardous near office centroids.",
      now: "Office hour commute volumes are peak, coinciding with low local wind speeds which trap dispersion.",
      difficulty: "Medium (requires transit police diversion)",
      benefit: "Immediate reduction in primary particulate combustion soot loads"
    },
    2: {
      why: "Unsuppressed dust from real estate demolition and concrete mixing elevates local PM10 concentration zones.",
      now: "A local PM10 spike was registered above the 120 µg/m³ threshold near active IT corridor construction centroids.",
      difficulty: "Easy (standard site inspection protocol)",
      benefit: "Saves high-risk individuals from immediate coarse dust exposure limits"
    },
    3: {
      why: "Deploying high-pressure water suppressors binds fugitive road dust and prevents it from suspending in the wind.",
      now: "Local humidity levels dropped below 45%, rendering road silt dry and highly volatile.",
      difficulty: "Easy (municipal fleet run deployment)",
      benefit: "Mitigates ambient dust levels on high-volume traffic lanes"
    }
  };

  const getExtraInfo = (id: number) => {
    return explanationMappings[id] || {
      why: "Mitigation of particulate emissions from ambient sources.",
      now: "Elevated particulate concentrations warrant immediate control deployment.",
      difficulty: "Easy",
      benefit: "General air quality improvement across centroids"
    };
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-primary" /> AI Recommended Actions
          </h4>
          <span className="text-[10px] text-muted mt-1 block">Prescribed mitigation interventions optimized for local drivers</span>
        </div>
        <span className="text-[9px] text-muted font-mono">{actions.length} Directives Available</span>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((act) => {
          const isExpanded = expandedId === act.id;
          const isHigh = act.priority.toLowerCase().includes("high") || act.priority.includes("1") || act.priority.includes("2");
          const extraInfo = getExtraInfo(act.id);

          return (
            <motion.div 
              key={act.id}
              layout
              onClick={() => toggleExpand(act.id)}
              className={`border border-border rounded-2xl p-4 transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isExpanded ? "bg-muted/10" : "bg-muted/5 hover:bg-muted/8"
              }`}
            >
              {/* Main row summary */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${
                      isHigh 
                        ? "border-danger/30 text-danger bg-danger/5" 
                        : "border-warning/30 text-warning bg-warning/5"
                    }`}>
                      {act.priority}
                    </span>
                    <AIConfidenceRing confidence={act.confidence} size="sm" showLabel={false} />
                    <span className="text-[9.5px] text-primary font-bold">Confidence: {act.confidence}%</span>
                  </div>
                  <h5 className="font-bold text-foreground text-xs mt-2.5 leading-snug">{act.title}</h5>
                  <p className="text-[11px] text-muted mt-1 leading-normal">{act.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-success block">{act.impact}</span>
                  <span className="text-[9px] text-muted block mt-0.5">Est. Impact</span>
                </div>
              </div>

              {/* Expandable details section - Feature 3 & 7 upgrades */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-border/60 flex flex-col gap-4 text-left"
                  >
                    {/* Feature 7 - Decision Explainability Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/30 border border-border/40 p-3.5 rounded-xl text-left">
                      <div>
                        <span className="text-[9px] uppercase font-black text-primary block">Why this recommendation?</span>
                        <p className="text-[11.5px] text-foreground font-semibold mt-1 leading-relaxed">{extraInfo.why}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-primary block">Why now?</span>
                        <p className="text-[11.5px] text-foreground font-semibold mt-1 leading-relaxed">{extraInfo.now}</p>
                      </div>
                    </div>

                    {/* Decision Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Implementation Difficulty</span>
                        <span className="text-[11px] font-black text-foreground mt-1.5 block">{extraInfo.difficulty}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Est. Completion Time</span>
                        <span className="text-[11px] font-black text-foreground mt-1.5 block">{act.duration}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Environmental Benefit</span>
                        <span className="text-[11px] font-black text-success mt-1.5 block">{extraInfo.benefit}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">Expected AQI Reduction</span>
                        <span className="text-[11px] font-black text-success mt-1.5 block">{act.impact}</span>
                      </div>
                    </div>

                    {/* FEATURE 3 - COLLAPSIBLE SUPPORTING EVIDENCE PANEL */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase font-black text-primary block">Supporting Evidence Matrix</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <EvidenceChip 
                          label="Traffic Density" 
                          status="Heavy Commute" 
                          confidence={94} 
                          timestamp="10 mins ago" 
                          icon={<Truck className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Weather Conditions" 
                          status="Low Volatility" 
                          confidence={95} 
                          timestamp="15 mins ago" 
                          icon={<Wind className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Sensor Readings" 
                          status="PM10 Elevated" 
                          confidence={98} 
                          timestamp="Just now" 
                          icon={<Activity className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Historical Trends" 
                          status="Normal Cycle" 
                          confidence={92} 
                          timestamp="1 hour ago" 
                          icon={<Clock className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Satellite Obs." 
                          status="0.42 AOD (Clear)" 
                          confidence={88} 
                          timestamp="2 hours ago" 
                          icon={<Server className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Construction Site" 
                          status="Active Operations" 
                          confidence={91} 
                          timestamp="45 mins ago" 
                          icon={<HardHat className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Industrial Activity" 
                          status="Stack Nominal" 
                          confidence={90} 
                          timestamp="3 hours ago" 
                          icon={<Database className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label="Wind Conditions" 
                          status="3.2 m/s Calm Air" 
                          confidence={94} 
                          timestamp="10 mins ago" 
                          icon={<Wind className="w-3.5 h-3.5" />} 
                        />
                      </div>
                    </div>

                    {/* Execution Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecuteAction(act.id, act.title);
                      }}
                      disabled={act.executed}
                      className={`w-full text-center py-2.5 text-[10.5px] font-bold rounded-xl border mt-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        act.executed 
                          ? "bg-success/15 border-success/35 text-success cursor-not-allowed" 
                          : "bg-primary border-primary/40 text-white hover:opacity-90 shadow-md shadow-primary/10"
                      }`}
                    >
                      {act.executed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Transmitted to Municipality
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-white fill-current" /> Transmit Operational Directive
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
