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
import { 
  extraTranslations, 
  translateActionTitle, 
  translateActionDesc, 
  translateSource, 
  translateEvidence,
  translateNarrativeExplanation 
} from "../../../utils/i18n_extra";
import { useSettings } from "../../../contexts/SettingsContext";

// Helper to get AQI category details
const getAQICategory = (aqi: number, lang: string) => {
  if (lang === "hi") {
    if (aqi <= 50) return { label: "अच्छा", color: "text-success bg-success/15 border-success/35" };
    if (aqi <= 100) return { label: "संतोषजनक", color: "text-secondary bg-secondary/15 border-secondary/35" };
    if (aqi <= 200) return { label: "मध्यम", color: "text-warning bg-warning/15 border-warning/35" };
    return { label: "गंभीर", color: "text-danger bg-danger/15 border-danger/35" };
  }
  if (lang === "te") {
    if (aqi <= 50) return { label: "మంచిది", color: "text-success bg-success/15 border-success/35" };
    if (aqi <= 100) return { label: "సంతృప్తికరం", color: "text-secondary bg-secondary/15 border-secondary/35" };
    if (aqi <= 200) return { label: "సాధారణం", color: "text-warning bg-warning/15 border-warning/35" };
    return { label: "ప్రమాదకరం", color: "text-danger bg-danger/15 border-danger/35" };
  }
  if (lang === "ta") {
    if (aqi <= 50) return { label: "நல்லது", color: "text-success bg-success/15 border-success/35" };
    if (aqi <= 100) return { label: "திருப்திகரமானது", color: "text-secondary bg-secondary/15 border-secondary/35" };
    if (aqi <= 200) return { label: "மிதமானது", color: "text-warning bg-warning/15 border-warning/35" };
    return { label: "மோசமானது / தீவிரமானது", color: "text-danger bg-danger/15 border-danger/35" };
  }
  if (lang === "kn") {
    if (aqi <= 50) return { label: "ಉತ್ತಮ", color: "text-success bg-success/15 border-success/35" };
    if (aqi <= 100) return { label: "ತೃಪ್ತಿದಾಯಕ", color: "text-secondary bg-secondary/15 border-secondary/35" };
    if (aqi <= 200) return { label: "ಸಾಧಾರಣ", color: "text-warning bg-warning/15 border-warning/35" };
    return { label: "ಕಳಪೆ / ತೀವ್ರ", color: "text-danger bg-danger/15 border-danger/35" };
  }
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
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];
  const cat = getAQICategory(currentAqi, activeLanguage);

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

  const translateConfidenceText = (text: string) => {
    if (activeLanguage === "en") return text;
    if (text.includes("High")) {
      return activeLanguage === "hi" ? "93% (उच्च)" : activeLanguage === "te" ? "93% (ఎక్కువ)" : activeLanguage === "ta" ? "93% (அதிகம்)" : "93% (ತೀವ್ರ)";
    }
    if (text.includes("Moderate")) {
      return activeLanguage === "hi" ? "89% (मध्यम)" : activeLanguage === "te" ? "89% (సాధారణ)" : activeLanguage === "ta" ? "89% (மிதமான)" : "89% (ಸಾಧಾರಣ)";
    }
    return text;
  };

  const getPrimaryRiskTranslated = (risk: string) => {
    if (activeLanguage === "en") return risk;
    if (risk.includes("Traffic & Construction")) return tExtra.trafficAndConstruction;
    if (risk.includes("Traffic & Dust")) return tExtra.trafficAndDust;
    if (risk.includes("Coastal Winds & Traffic")) return tExtra.coastalWindsTraffic;
    if (risk.includes("Industrial & Silt Dust")) return tExtra.industrialSiltDust;
    if (risk.includes("Maritime Boundary & Traffic")) return tExtra.maritimeBoundaryTraffic;
    return risk;
  };

  const getReliabilityTranslated = (rel: string) => {
    if (activeLanguage === "en") return rel;
    if (rel.includes("Stable")) return activeLanguage === "hi" ? "95% (स्थिर)" : activeLanguage === "te" ? "95% (స్థిరంగా ఉంది)" : activeLanguage === "ta" ? "95% (நிலையானது)" : "95% (ಸ್ಥಿರವಾಗಿದೆ)";
    if (rel.includes("Moderate")) return activeLanguage === "hi" ? "90% (मध्यम)" : activeLanguage === "te" ? "90% (సాధారణ)" : activeLanguage === "ta" ? "90% (மிதமான)" : "90% (ಸಾಧಾರಣ)";
    return rel;
  };

  const getEvidenceSourcesTranslated = (sources: string) => {
    if (activeLanguage === "en") return sources;
    if (sources.includes("6 Nodes, Radar, GIS")) return tExtra.nodesRadarGis;
    if (sources.includes("5 Wards, Satellite, GIS")) return tExtra.wardsSatelliteGis;
    if (sources.includes("4 Nodes, Marine Buoys")) return tExtra.nodesMarineBuoys;
    if (sources.includes("7 Nodes, Lidars, GIS")) return tExtra.nodesLidarsGis;
    if (sources.includes("6 Nodes, Coastal Radar")) return tExtra.nodesCoastalRadar;
    return sources;
  };

  const getDecisionImpactTranslated = (impact: string) => {
    if (activeLanguage === "en") return impact;
    if (impact.includes("Very High Impact")) return tExtra.veryHighImpact;
    if (impact.includes("High Impact")) return tExtra.highImpact;
    if (impact.includes("Moderate Impact")) return tExtra.moderateImpact;
    if (impact.includes("Critical Impact")) return tExtra.criticalImpact;
    return impact;
  };

  const activeCity = cityName || "Hyderabad";
  const metrics = cityMetrics[activeCity] || cityMetrics.Hyderabad;

  const localizedMetrics = {
    confidenceText: translateConfidenceText(metrics.confidenceText),
    primaryRisk: getPrimaryRiskTranslated(metrics.primaryRisk),
    reliability: getReliabilityTranslated(metrics.reliability),
    evidenceSources: getEvidenceSourcesTranslated(metrics.evidenceSources),
    decisionImpact: getDecisionImpactTranslated(metrics.decisionImpact)
  };

  const transActions = recommendedActions.map((actTitle, idx) => translateActionTitle(idx + 1, actTitle, activeLanguage));
  const condLabel = activeLanguage === "hi" ? "स्थिति" : activeLanguage === "te" ? "పరిస్థితులు" : activeLanguage === "ta" ? "நிலைகள்" : activeLanguage === "kn" ? "ಸ್ಥಿತಿಗಳು" : "Conditions";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card relative overflow-hidden p-4 sm:p-6 border-l-4 border-l-primary shadow-lg bg-gradient-to-r from-card via-card to-primary/5 text-left"
    >
      {/* Background soft lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground">{tExtra.executiveBriefTitle}</h2>
              <p className="text-[10px] text-muted leading-none mt-0.5">{tExtra.realtimeBriefSub} {wardName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Situation Box */}
          <div className="bg-muted/5 border border-border rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden group">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">{tExtra.currentSituation}</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-foreground">{currentAqi}</span>
                <span className="text-[10px] font-mono text-muted">AQI</span>
              </div>
            </div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-2 text-center ${cat.color}`}>
              {cat.label} {condLabel}
            </span>
          </div>

          {/* Primary Contributors */}
          <div className="bg-muted/5 border border-border rounded-xl p-3 sm:p-4 flex flex-col min-h-[120px]">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">{tExtra.primaryPollutionSources}</span>
            <div className="flex flex-col gap-2 mt-3 flex-1 justify-center">
              {primarySources.slice(0, 2).map((src, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 font-medium">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-primary" : "bg-secondary"}`} />
                    {translateSource(src.source, activeLanguage)}
                  </span>
                  <span className="font-bold text-muted">{src.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Box */}
          <div className="bg-muted/5 border border-border rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">{tExtra.aiForecastHorizon}</span>
              <p className="text-xs text-foreground mt-2.5 font-medium leading-relaxed">
                {translateNarrativeExplanation(forecastText, activeLanguage)}
              </p>
            </div>
          </div>

          {/* Directives & Target Improvements */}
          <div className="bg-muted/5 border border-border rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted block">{tExtra.advisoryImpact}</span>
              <p className="text-[11px] text-muted mt-2 font-medium leading-relaxed truncate">
                {transActions[0] || (activeLanguage === "hi" ? "वर्तमान स्तर की निगरानी" : activeLanguage === "te" ? "ప్రస్తుత స్థాయిల పరిశీలన" : activeLanguage === "ta" ? "தற்போதைய அளவுகளைக் கண்காணித்தல்" : activeLanguage === "kn" ? "ಪ್ರಸ್ತುತ ಮಟ್ಟಗಳ ಮೇಲ್ವಿಚಾರಣೆ" : "Monitoring current loads")}
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
              <span className="text-[9px] font-bold text-muted uppercase">{tExtra.targetImprovement}</span>
              <span className="text-xs font-black text-success flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> -{expectedImprovement} AQI
              </span>
            </div>
          </div>
        </div>

        {/* FEATURE 6 — EXECUTIVE METRICS (KPI Cards) */}
        <div className="border-t border-border/80 pt-4 sm:pt-5 mt-1">
          <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-primary block mb-3.5">{tExtra.executiveDecisionIndicators}</span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-muted/5 border border-border/60 p-2.5 sm:p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.overallConfidence}</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block">{localizedMetrics.confidenceText}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.primaryRisk}</span>
              <span className="text-[11.5px] font-black text-danger mt-1.5 block truncate">{localizedMetrics.primaryRisk}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.predictionReliability}</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block">{localizedMetrics.reliability}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.expectedImprovementText}</span>
              <span className="text-[11.5px] font-black text-success mt-1.5 block">-{expectedImprovement} {tExtra.aqiPoints}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.evidenceSourcesUsed}</span>
              <span className="text-[11.5px] font-black text-foreground mt-1.5 block truncate">{localizedMetrics.evidenceSources}</span>
            </div>
            <div className="bg-muted/5 border border-border/60 p-3 rounded-xl text-center flex flex-col justify-center">
              <span className="text-[8px] text-muted block font-extrabold uppercase tracking-wide">{tExtra.estimatedDecisionImpact}</span>
              <span className="text-[11.5px] font-black text-primary mt-1.5 block">{localizedMetrics.decisionImpact}</span>
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
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];

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
            <Activity className="w-4 h-4 text-primary" /> {tExtra.aiSourceAttributionTitle}
          </h4>
          <span className="text-[10px] text-muted mt-1 block">{tExtra.realtimeSourceSub}</span>
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
                  {translateSource(attr.source, activeLanguage)}
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
          <Zap className="w-3 h-3 text-primary animate-pulse" /> {tExtra.explainabilityEngine}
        </span>
        <p className="text-[11px] text-muted font-medium mt-1.5 leading-relaxed">
          "{translateNarrativeExplanation(explanation, activeLanguage)}"
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
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];

  const getLocalizedTime = (time: string) => {
    if (time.toLowerCase().includes("immediate")) return tExtra.immediate || time;
    if (time.includes("Hours")) {
      return time.replace("Hours", activeLanguage === "hi" ? "घंटे" : activeLanguage === "te" ? "గంటలు" : activeLanguage === "ta" ? "மணிநேரம்" : activeLanguage === "kn" ? "ಗಂಟೆಗಳು" : "Hours");
    }
    return time;
  };

  const getLocalizedImpact = (imp: string) => {
    if (imp.toLowerCase().includes("nominal")) return tExtra.nominal || imp;
    if (imp.toLowerCase().includes("good")) return tExtra.good || imp;
    if (imp.toLowerCase().includes("excellent")) return tExtra.excellent || imp;
    if (imp.toLowerCase().includes("outstanding")) return tExtra.outstanding || imp;
    return imp;
  };

  const pointsLabel = activeLanguage === "hi" ? "अंक" : activeLanguage === "te" ? "పాయింట్లు" : activeLanguage === "ta" ? "புள்ளிகள்" : activeLanguage === "kn" ? "ಅಂಕಗಳು" : "Points";

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '6s' }} /> {tExtra.whatIfTitle}
          </h4>
          <span className="text-[10px] text-muted mt-1 block">{tExtra.whatIfSub}</span>
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
                <Truck className="w-3.5 h-3.5 text-muted" /> {tExtra.trafficRestriction}
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
                <HardHat className="w-3.5 h-3.5 text-muted" /> {tExtra.constructionAbatement}
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
                <Activity className="w-3.5 h-3.5 text-muted" /> {tExtra.industrialEmissionsControl}
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
            <span>{tExtra.waterSprinkling}</span>
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
            <span>{tExtra.burningBan}</span>
            <span className={`w-2.5 h-2.5 rounded-full ${wasteBurningPrevention > 0 ? "bg-primary animate-ping" : "bg-muted"}`} />
          </button>
        </div>
      </div>

      {/* Simulated Outcomes */}
      <div className="bg-muted/5 border border-border p-4 rounded-2xl flex flex-col gap-4 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">{tExtra.currentAqi}</span>
            <span className="text-xl font-extrabold text-foreground">{currentAqi}</span>
          </div>
          <div className="flex items-center text-muted font-bold animate-pulse">➔</div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted">{tExtra.predictedAqi}</span>
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
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">{tExtra.estReduction}</span>
            <span className="text-xs font-extrabold block text-success mt-0.5">-{estimatedImprovement} {pointsLabel}</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <DollarSign className="w-3.5 h-3.5 text-secondary mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">{tExtra.simulatedCost}</span>
            <span className="text-xs font-extrabold block text-foreground mt-0.5">${estimatedCost.toLocaleString()}</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <Clock className="w-3.5 h-3.5 text-accent mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">{tExtra.deployTime}</span>
            <span className="text-xs font-extrabold block text-foreground mt-0.5">{getLocalizedTime(estimatedTime)}</span>
          </div>

          <div className="bg-background/40 border border-border/40 p-2 rounded-xl text-center">
            <Leaf className="w-3.5 h-3.5 text-success mx-auto" />
            <span className="text-[8px] text-muted block mt-1 font-semibold uppercase">{tExtra.ecoImpact}</span>
            <span className="text-xs font-extrabold block text-success mt-0.5">{getLocalizedImpact(environmentalImpact)}</span>
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
  wardName?: string;
}

export function RecommendedActions({
  actions,
  onExecuteAction,
  wardName
}: RecommendedActionsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getLocalizedTime = (time: string) => {
    if (time.toLowerCase().includes("immediate")) return tExtra.immediate || time;
    if (time.includes("Hours")) {
      return time.replace("Hours", activeLanguage === "hi" ? "घंटे" : activeLanguage === "te" ? "గంటలు" : activeLanguage === "ta" ? "மணிநேரம்" : activeLanguage === "kn" ? "ಗಂಟೆಗಳು" : "Hours");
    }
    return time;
  };

  // Causal mappings to explain recommendations
  const explanationMappings: Record<number, { why: string; now: string; difficulty: string; benefit: string }> = {
    1: {
      why: activeLanguage === "hi" ? "डीजल भारी वाहन पीएम2.5 और कालिख का पर्याप्त मात्रा में उत्सर्जन करते हैं, जो विशेष रूप से कार्यालयों के केंद्रों के पास खतरनाक हैं।" :
           activeLanguage === "te" ? "కార్యాలయాల ప్రాంతాలలో డీజిల్ వాహనాల పొగ PM2.5 తీవ్రతను పెంచుతుంది." :
           activeLanguage === "ta" ? "டீசல் வாகனங்கள் அதிக PM2.5 மற்றும் கரியை வெளியிடுகின்றன, இது அலுவலகப் பகுதிகளில் ஆபத்தானது." :
           activeLanguage === "kn" ? "ಡೀಸೆಲ್ ವಾಹನಗಳು ಹೆಚ್ಚಿನ PM2.5 ಮತ್ತು ಮಸಿಯನ್ನು ಹೊರಸೂಸುತ್ತವೆ, ಇದು ಕಚೇರಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಅಪಾಯಕಾರಿಯಾಗಿದೆ." :
           "Diesel heavy vehicles emit substantial quantities of PM2.5 and soot, which are particularly hazardous near office centroids.",
      now: activeLanguage === "hi" ? "कार्यालय के समय आवागमन की मात्रा चरम पर होती है, जो कम स्थानीय हवा की गति के साथ मेल खाती है जो प्रदूषकों को रोकती है।" :
           activeLanguage === "te" ? "రద్దీ సమయాల్లో తక్కువ గాలి వేగం వల్ల కాలుష్య కణాలు ఇక్కడే నిలిచిపోతున్నాయి." :
           activeLanguage === "ta" ? "அலுவலக போக்குவரத்து நேரங்களில் காற்றின் வேகம் குறைவாக இருப்பதால் மாசுக்கள் கலைவது தடுக்கப்படுகிறது." :
           activeLanguage === "kn" ? "ಕಚೇರಿ ಸಮಯದ ಸಂಚಾರವು ಸ್ಥಳೀಯ ಕಡಿಮೆ ಗಾಳಿಯ ವೇಗದಿಂದಾಗಿ ಮಾಲಿನ್ಯವನ್ನು ತಡೆಹಿಡಿಯುತ್ತದೆ." :
           "Office hour commute volumes are peak, coinciding with low local wind speeds which trap dispersion.",
      difficulty: activeLanguage === "hi" ? "मध्यम (यातायात पुलिस डायवर्जन की आवश्यकता है)" :
                  activeLanguage === "te" ? "సాధారణం (ట్రాఫిక్ పోలీసుల సహాయం అవసరం)" :
                  activeLanguage === "ta" ? "மிதமானது (போக்குவரத்து போலீஸ் மாற்றுப்பாதை தேவை)" :
                  activeLanguage === "kn" ? "ಸಾಧಾರಣ (ಸಂಚಾರ ಪೊಲೀಸರ ನೆರವು ಅಗತ್ಯ)" :
                  "Medium (requires transit police diversion)",
      benefit: activeLanguage === "hi" ? "प्राथमिक कण दहन कालिख भार में तत्काल कमी" :
               activeLanguage === "te" ? "కాలుష్య కణాలు తక్షణమే తగ్గుతాయి" :
               activeLanguage === "ta" ? "மாசு துகள்கள் வெளியாவது உடனடியாகக் குறையும்" :
               activeLanguage === "kn" ? "ಮಾಲಿನ್ಯದ ಪ್ರಮಾಣ ತಕ್ಷಣವೇ ಕಡಿಮೆಯಾಗುತ್ತದೆ" :
               "Immediate reduction in primary particulate combustion soot loads"
    },
    2: {
      why: activeLanguage === "hi" ? "अचल संपत्ति के विध्वंस और कंक्रीट मिश्रण से उड़ने वाली धूल स्थानीय पीएम10 सांद्रता क्षेत्रों को बढ़ाती है।" :
           activeLanguage === "te" ? "భవన నిర్మాణ పనుల ధూళి వల్ల స్థానికంగా PM10 స్థాయిలు పెరుగుతాయి." :
           activeLanguage === "ta" ? "கட்டுமானப் பகுதி தூசிகள் உள்ளூர் PM10 அளவை அதிகரிக்கின்றன." :
           activeLanguage === "kn" ? "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಧೂಳು ಸ್ಥಳೀಯ PM10 ಸಾಂದ್ರತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ." :
           "Unsuppressed dust from real estate demolition and concrete mixing elevates local PM10 concentration zones.",
      now: activeLanguage === "hi" ? "सक्रिय निर्माण केंद्रों के पास पीएम10 का स्तर 120 µg/m³ की सीमा से ऊपर दर्ज किया गया था।" :
           activeLanguage === "te" ? "निర్మాణ ప్రాంతాల్లో PM10 స్థాయిలు 120 µg/m³ కంటే ఎక్కువ నమోదయ్యాయి." :
           activeLanguage === "ta" ? "கட்டுமானப் பகுதிகளில் PM10 அளவு 120 µg/m³ ஐ விட அதிகமாக பதிவாகியுள்ளது." :
           activeLanguage === "kn" ? "ಸಕ್ರಿಯ ನಿರ್ಮಾಣ ವಲಯಗಳಲ್ಲಿ PM10 ಮಟ್ಟವು 120 µg/m³ ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ." :
           "A local PM10 spike was registered above the 120 µg/m³ threshold near active IT corridor construction centroids.",
      difficulty: activeLanguage === "hi" ? "आसान (मानक साइट निरीक्षण प्रोटोकॉल)" :
                  activeLanguage === "te" ? "సులభం (సాధారణ తనిఖీ సరిపోతుంది)" :
                  activeLanguage === "ta" ? "எளிதானது (நிலையான ஆய்வு நெறிமுறை)" :
                  activeLanguage === "kn" ? "ಸುಲಭ (ಸಾಮಾನ್ಯ ಪರಿಶೀಲನೆ ಸಾಕು)" :
                  "Easy (standard site inspection protocol)",
      benefit: activeLanguage === "hi" ? "उच्च जोखिम वाले व्यक्तियों को धूल के सीधे जोखिम से बचाता है" :
               activeLanguage === "te" ? "ప్రమాద అంచున ఉన్న వారికి తక్షణ ఉపశమనం లభిస్తుంది" :
               activeLanguage === "ta" ? "பாதிப்புக்குள்ளானவர்களுக்கு தூசி பாதிப்பில் இருந்து பாதுகாப்பு அளிக்கிறது" :
               activeLanguage === "kn" ? "ಅಪಾಯದಲ್ಲಿರುವ ಜನರನ್ನು ಧೂಳಿನ ನೇರ ಪ್ರಭಾವದಿಂದ ರಕ್ಷಿಸುತ್ತದೆ" :
               "Saves high-risk individuals from immediate coarse dust exposure limits"
    },
    3: {
      why: activeLanguage === "hi" ? "उच्च दबाव वाले पानी के छिड़काव को तैनात करने से धूल बंध जाती है और इसे हवा में उड़ने से रोका जा सकता है।" :
           activeLanguage === "te" ? "నీటిని చల్లడం వల్ల ధూళి రేగకుండా అణచివేయబడుతుంది." :
           activeLanguage === "ta" ? "அதிவேக நீர் தெளிப்பான்கள் தூசிகள் காற்றில் பரவுவதைத் தடுக்கின்றன." :
           activeLanguage === "kn" ? "ಹೆಚ್ಚಿನ ಒತ್ತಡದ ನೀರು ಸಿಂಪಡಿಸುವುದರಿಂದ ಧೂಳು ಗಾಳಿಯಲ್ಲಿ ಹರಡುವುದು ತಪ್ಪುತ್ತದೆ." :
           "Deploying high-pressure water suppressors binds fugitive road dust and prevents it from suspending in the wind.",
      now: activeLanguage === "hi" ? "स्थानीय आर्द्रता का स्तर 45% से नीचे गिर गया, जिससे सड़क की धूल शुष्क और अत्यधिक अस्थिर हो गई।" :
           activeLanguage === "te" ? "తేమ శాతం 45% కంటే తగ్గడంతో ధూళి సులభంగా రేగుతోంది." :
           activeLanguage === "ta" ? "ஈரப்பதம் 45% க்கும் குறைவாக குறைந்ததால் சாலைத் தூசிகள் வறண்டு எளிதில் பரவுகின்றன." :
           activeLanguage === "kn" ? "ಆರ್ದ್ರತೆಯು 45% ಕ್ಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದ್ದರಿಂದ ರಸ್ತೆಯ ಧೂಳು ಒಣಗಿ ಹರಡುತ್ತಿದೆ." :
           "Local humidity levels dropped below 45%, rendering road silt dry and highly volatile.",
      difficulty: activeLanguage === "hi" ? "आसान (नगरपालिका बेड़े की तैनाती)" :
                  activeLanguage === "te" ? "సులభం (మున్సిపల్ వాహనాల ద్వారా త్వరిత అమలు)" :
                  activeLanguage === "ta" ? "எளிதானது (மாநகராட்சி வாகனங்கள் மூலம் செயல்முறை)" :
                  activeLanguage === "kn" ? "ಸುಲಭ (ನಗರಸಭೆಯ ವಾಹನಗಳ ನಿಯೋಜನೆ)" :
                  "Easy (municipal fleet run deployment)",
      benefit: activeLanguage === "hi" ? "उच्च मात्रा वाले यातायात लेन पर परिवेशीय धूल के स्तर को कम करता है" :
               activeLanguage === "te" ? "ఎక్కువ రద్దీ గల రహదారులపై ధూళి కణాలను తగ్గిస్తుంది" :
               activeLanguage === "ta" ? "அதிக போக்குவரத்து உள்ள சாலைகளில் தூசி அளவைக் குறைக்கிறது" :
               activeLanguage === "kn" ? "ಹೆಚ್ಚಿನ ಸಂಚಾರ ರಸ್ತೆಗಳಲ್ಲಿ ಧೂಳಿನ ಪ್ರಮಾಣವನ್ನು ತಗ್ಗಿಸುತ್ತದೆ" :
               "Mitigates ambient dust levels on high-volume traffic lanes"
    }
  };

  const getExtraInfo = (id: number) => {
    return explanationMappings[id] || {
      why: activeLanguage === "hi" ? "परिवेशी स्रोतों से कण उत्सर्जन का शमन।" :
           activeLanguage === "te" ? "కాలుష్య కణాల ఉద్గారాల నివారణ." :
           activeLanguage === "ta" ? "மாசு உமிழ்வுகளைக் கட்டுப்படுத்துதல்." :
           activeLanguage === "kn" ? "ಮಾಲಿನ್ಯ ಹೊರಸೂಸುವಿಕೆ ನಿಯಂತ್ರಣ." :
           "Mitigation of particulate emissions from ambient sources.",
      now: activeLanguage === "hi" ? "कण सांद्रता बढ़ने के कारण तत्काल नियंत्रण उपाय आवश्यक हैं।" :
           activeLanguage === "te" ? "కాలుష్య తీవ్రత పెరగడం వల్ల తక్షణ చర్యలు అవసరం." :
           activeLanguage === "ta" ? "மாசு அளவு அதிகரித்துள்ளதால் உடனடியாகக் கட்டுப்படுத்த வேண்டும்." :
           activeLanguage === "kn" ? "ಮಾಲಿನ್ಯ ಹೆಚ್ಚಾಗಿರುವುದರಿಂದ ತಕ್ಷಣದ ನಿಯಂತ್ರಣ ಅಗತ್ಯ." :
           "Elevated particulate concentrations warrant immediate control deployment.",
      difficulty: activeLanguage === "hi" ? "आसान" :
                  activeLanguage === "te" ? "సులభం" :
                  activeLanguage === "ta" ? "எளிது" :
                  activeLanguage === "kn" ? "ಸುಲಭ" :
                  "Easy",
      benefit: activeLanguage === "hi" ? "सामान्य वायु गुणवत्ता में सुधार" :
               activeLanguage === "te" ? "సాధారణ గాలి నాణ్యత మెరుగుపడుతుంది" :
               activeLanguage === "ta" ? "காற்றின் தரம் மேம்படும்" :
               activeLanguage === "kn" ? "ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಸುಧಾರಣೆ" :
               "General air quality improvement across centroids"
    };
  };

  const translatePriority = (priority: string, lang: string): string => {
    const isHigh = priority.toLowerCase().includes("high");
    const isMedium = priority.toLowerCase().includes("medium");
    const pStr = priority.includes("/") ? priority.split("/")[0].trim() : "";
    
    if (lang === "hi") {
      if (isHigh) return pStr ? `${pStr} / उच्च` : "उच्च";
      if (isMedium) return pStr ? `${pStr} / मध्यम` : "मध्यम";
    }
    if (lang === "te") {
      if (isHigh) return pStr ? `${pStr} / ఎక్కువ` : "ఎక్కువ";
      if (isMedium) return pStr ? `${pStr} / సాధారణం` : "సాధారణం";
    }
    if (lang === "ta") {
      if (isHigh) return pStr ? `${pStr} / அதிகம்` : "அதிகம்";
      if (isMedium) return pStr ? `${pStr} / மிதமானது` : "மிதமானது";
    }
    if (lang === "kn") {
      if (isHigh) return pStr ? `${pStr} / ತೀವ್ರ` : "ತೀವ್ರ";
      if (isMedium) return pStr ? `${pStr} / ಸಾಧಾರಣ` : "ಸಾಧಾರಣ";
    }
    return priority;
  };

  const focusWard = wardName || "Gachibowli";

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full text-left">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-primary" /> {tExtra.aiRecommendedActions}
          </h4>
          <span className="text-[10px] text-muted mt-1 block">{tExtra.prescribedMitigationSub}</span>
        </div>
        <span className="text-[9px] text-muted font-mono">{actions.length} {tExtra.directivesAvailable}</span>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((act) => {
          const isExpanded = expandedId === act.id;
          const isHigh = act.priority.toLowerCase().includes("high") || act.priority.includes("1") || act.priority.includes("2");
          const extraInfo = getExtraInfo(act.id);
          const transPriorityVal = translatePriority(act.priority, activeLanguage);
          const ev1 = translateEvidence("Traffic Density", "Heavy Commute", "10 mins ago", activeLanguage);
          const ev2 = translateEvidence("Weather Conditions", "Low Volatility", "15 mins ago", activeLanguage);
          const ev3 = translateEvidence("Sensor Readings", "PM10 Elevated", "Just now", activeLanguage);
          const ev4 = translateEvidence("Historical Trends", "Normal Cycle", "1 hour ago", activeLanguage);
          const ev5 = translateEvidence("Satellite Obs.", "0.42 AOD (Clear)", "2 hours ago", activeLanguage);
          const ev6 = translateEvidence("Construction Site", "Active Operations", "45 mins ago", activeLanguage);
          const ev7 = translateEvidence("Industrial Activity", "Stack Nominal", "3 hours ago", activeLanguage);
          const ev8 = translateEvidence("Wind Conditions", "3.2 m/s Calm Air", "10 mins ago", activeLanguage);

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
                      {transPriorityVal}
                    </span>
                    <AIConfidenceRing confidence={act.confidence} size="sm" showLabel={false} />
                    <span className="text-[9.5px] text-primary font-bold">{tExtra.confidence}: {act.confidence}%</span>
                  </div>
                  <h5 className="font-bold text-foreground text-xs mt-2.5 leading-snug">
                    {translateActionTitle(act.id, act.title, activeLanguage)}
                  </h5>
                  <p className="text-[11px] text-muted mt-1 leading-normal">
                    {translateActionDesc(act.id, act.desc, activeLanguage, focusWard)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-success block">{act.impact}</span>
                  <span className="text-[9px] text-muted block mt-0.5">{tExtra.estImpact}</span>
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
                        <span className="text-[9px] uppercase font-black text-primary block">{tExtra.whyRec}</span>
                        <p className="text-[11.5px] text-foreground font-semibold mt-1 leading-relaxed">{extraInfo.why}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-primary block">{tExtra.whyNow}</span>
                        <p className="text-[11.5px] text-foreground font-semibold mt-1 leading-relaxed">{extraInfo.now}</p>
                      </div>
                    </div>

                    {/* Decision Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">{tExtra.implDifficulty}</span>
                        <span className="text-[11px] font-black text-foreground mt-1.5 block">{extraInfo.difficulty}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">{tExtra.estCompTime}</span>
                        <span className="text-[11px] font-black text-foreground mt-1.5 block">{getLocalizedTime(act.duration)}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">{tExtra.envBenefit}</span>
                        <span className="text-[11px] font-black text-success mt-1.5 block">{extraInfo.benefit}</span>
                      </div>
                      <div className="bg-background/20 p-2.5 rounded-xl border border-border/30">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-muted block">{tExtra.expectedAqiRed}</span>
                        <span className="text-[11px] font-black text-success mt-1.5 block">{act.impact}</span>
                      </div>
                    </div>

                    {/* FEATURE 3 - COLLAPSIBLE SUPPORTING EVIDENCE PANEL */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase font-black text-primary block">{tExtra.supportingEvidence}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                        <EvidenceChip 
                          label={ev1.label} 
                          status={ev1.status} 
                          confidence={94} 
                          timestamp={ev1.time} 
                          icon={<Truck className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev2.label} 
                          status={ev2.status} 
                          confidence={95} 
                          timestamp={ev2.time} 
                          icon={<Wind className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev3.label} 
                          status={ev3.status} 
                          confidence={98} 
                          timestamp={ev3.time} 
                          icon={<Activity className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev4.label} 
                          status={ev4.status} 
                          confidence={92} 
                          timestamp={ev4.time} 
                          icon={<Clock className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev5.label} 
                          status={ev5.status} 
                          confidence={88} 
                          timestamp={ev5.time} 
                          icon={<Server className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev6.label} 
                          status={ev6.status} 
                          confidence={91} 
                          timestamp={ev6.time} 
                          icon={<HardHat className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev7.label} 
                          status={ev7.status} 
                          confidence={90} 
                          timestamp={ev7.time} 
                          icon={<Database className="w-3.5 h-3.5" />} 
                        />
                        <EvidenceChip 
                          label={ev8.label} 
                          status={ev8.status} 
                          confidence={94} 
                          timestamp={ev8.time} 
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {tExtra.transmittedToMuni}
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-white fill-current" /> {tExtra.transmitOperationalDir}
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

