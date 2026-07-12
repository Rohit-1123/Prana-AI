import { AlertCircle, HelpCircle, CheckCircle } from "lucide-react";
import { cn } from "../../../utils/cn";
import { 
  extraTranslations, 
  translateNarrativeExplanation, 
  translateTrendText, 
  translateAttentionArea 
} from "../../../utils/i18n_extra";
import { useSettings } from "../../../contexts/SettingsContext";

interface AISummaryCardProps {
  overviewText: string;
  keyTrends: string[];
  riskLevel: "Low" | "Medium" | "High" | "Severe";
  attentionAreas: string[];
}

export function AISummaryCard({
  overviewText,
  keyTrends,
  riskLevel,
  attentionAreas
}: AISummaryCardProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];
  
  const getRiskColor = (level: string) => {
    if (level === "Low") return "text-success border-success/20 bg-success/5";
    if (level === "Medium") return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };

  const getRiskScaleLabel = (level: string) => {
    if (activeLanguage === "hi") {
      const transLevel = level === "Low" ? "निम्न" : level === "Medium" ? "मध्यम" : "उच्च";
      return `${transLevel} जोखिम पैमाना`;
    }
    if (activeLanguage === "te") {
      const transLevel = level === "Low" ? "తక్కువ" : level === "Medium" ? "సాధారణ" : "ఎక్కువ";
      return `${transLevel} ప్రమాద స్థాయి`;
    }
    if (activeLanguage === "ta") {
      const transLevel = level === "Low" ? "குறைந்த" : level === "Medium" ? "மிதமான" : "அதிக";
      return `${transLevel} ஆபத்து அளவு`;
    }
    if (activeLanguage === "kn") {
      const transLevel = level === "Low" ? "ಕಡಿಮೆ" : level === "Medium" ? "ಸಾಧಾರಣ" : "ಹೆಚ್ಚಿನ";
      return `${transLevel} ಅಪಾಯದ ಪ್ರಮಾಣ`;
    }
    return `${level} Risk Scale`;
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary shrink-0" />
          <h4 className="font-bold text-sm text-foreground">{tExtra.aiPredictiveAssessment}</h4>
        </div>
        <div className={cn(
          "text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border",
          getRiskColor(riskLevel)
        )}>
          {getRiskScaleLabel(riskLevel)}
        </div>
      </div>

      {/* Main Advisory text */}
      <div className="flex flex-col gap-3.5 border-t border-border pt-4">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold">{tExtra.executiveSummary}</span>
        <p className="text-xs text-foreground leading-relaxed font-sans">{translateNarrativeExplanation(overviewText, activeLanguage)}</p>
      </div>

      {/* Grid: Key Trends & Attention Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-4">
        
        {/* Key Trends */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold block">{tExtra.keyForecastTrendsTitle}</span>
          <div className="flex flex-col gap-2">
            {keyTrends.map((t, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-foreground items-start">
                <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{translateTrendText(t, activeLanguage)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Attention Areas */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold block">{tExtra.attentionSectors}</span>
          <div className="flex flex-col gap-2">
            {attentionAreas.map((area, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-foreground items-start">
                <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{translateAttentionArea(area, activeLanguage)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
