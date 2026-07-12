import {
  SourceAttributionCard,
  WhatIfSimulator,
  RecommendedActions
} from "../../dashboard/components/DecisionIntelligence";
import { useSettings } from "../../../contexts/SettingsContext";

interface ReportsDashboardProps {
  selectedWard: any;
  predictedAqi: number;
  simulatedTraffic: number;
  setSimulatedTraffic: (val: number) => void;
  simulatedConstruction: number;
  setSimulatedConstruction: (val: number) => void;
  simulatedIndustrial: number;
  setSimulatedIndustrial: (val: number) => void;
  simulatedSprinkling: number;
  setSimulatedSprinkling: (val: number) => void;
  simulatedWasteBurning: number;
  setSimulatedWasteBurning: (val: number) => void;
  estimatedCost: number;
  estimatedTime: string;
  environmentalImpact: string;
  totalReduction: number;
  sourceAttributions: any[];
  dynamicExplanation: string;
  actionRecommendations: any[];
  setActionRecommendations: React.Dispatch<React.SetStateAction<any[]>>;
  feedItems: any[];
  checkActionPermission: (actionName: string, targetTab?: string) => boolean;
}

export function ReportsDashboard({
  selectedWard,
  predictedAqi,
  simulatedTraffic,
  setSimulatedTraffic,
  simulatedConstruction,
  setSimulatedConstruction,
  simulatedIndustrial,
  setSimulatedIndustrial,
  simulatedSprinkling,
  setSimulatedSprinkling,
  simulatedWasteBurning,
  setSimulatedWasteBurning,
  estimatedCost,
  estimatedTime,
  environmentalImpact,
  totalReduction,
  sourceAttributions,
  dynamicExplanation,
  actionRecommendations,
  setActionRecommendations,
  feedItems,
  checkActionPermission
}: ReportsDashboardProps) {

  const { language } = useSettings();
  const activeLanguage = language;

  return (
    <div className="flex flex-col gap-8 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-foreground">
          {activeLanguage === "hi" ? "पर्यावरण खुफिया रिपोर्ट" :
           activeLanguage === "te" ? "పర్యావరణ మేధస్సు నివేదికలు" :
           activeLanguage === "ta" ? "சுற்றுச்சூழல் நுண்ணறிவு அறிக்கைகள்" :
           activeLanguage === "kn" ? "ಪರಿಸರ ಗುಪ್ತಚರ ವರದಿಗಳು" :
           "Environmental Intelligence Reports"}
        </h2>
        <span className="text-xs text-muted block mt-1">
          {activeLanguage === "hi" ? "एआई-संचालित शमन नियंत्रण और नीति अनुकार कार्यक्षेत्र" :
           activeLanguage === "te" ? "AI-ఆధారిత పాలసీ సిమ్యులేషన్ మరియు నియంత్రణ వర్క్‌స్పేస్" :
           activeLanguage === "ta" ? "AI-ஆற்றல் கொண்ட கொள்கை உருவகப்படுத்துதல் மற்றும் கட்டுப்பாட்டு பணிப்பகுதி" :
           activeLanguage === "kn" ? "AI-ಚಾಲಿತ ನೀತಿ ಸಿಮ್ಯುಲೇಶನ್ ಮತ್ತು ನಿಯಂತ್ರಣ ಕಾರ್ಯಕ್ಷೇತ್ರ" :
           "AI-powered mitigation controls and policy simulation workspace"}
        </span>
      </div>

      {/* Row 1: What-If Simulator & Source Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: What-If Simulator */}
        <div className="lg:col-span-6">
          <WhatIfSimulator
            currentAqi={selectedWard.aqi}
            predictedAqi={predictedAqi}
            trafficReduction={simulatedTraffic}
            setTrafficReduction={setSimulatedTraffic}
            constructionPause={simulatedConstruction}
            setConstructionPause={setSimulatedConstruction}
            industrialReduction={simulatedIndustrial}
            setIndustrialReduction={setSimulatedIndustrial}
            waterSprinkling={simulatedSprinkling}
            setWaterSprinkling={setSimulatedSprinkling}
            wasteBurningPrevention={simulatedWasteBurning}
            setWasteBurningPrevention={setSimulatedWasteBurning}
            estimatedCost={estimatedCost}
            estimatedTime={estimatedTime}
            environmentalImpact={environmentalImpact}
            estimatedImprovement={totalReduction}
            confidence={92}
          />
        </div>
        {/* Right: Source Attribution Card */}
        <div className="lg:col-span-6">
          <SourceAttributionCard
            attributions={sourceAttributions}
            explanation={dynamicExplanation}
            overallConfidence={93}
          />
        </div>
      </div>

      {/* Row 2: AI Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Policy Recommendations Panel */}
        <div className="lg:col-span-12">
          <RecommendedActions
            actions={actionRecommendations}
            onExecuteAction={(id, title) => {
              if (!checkActionPermission(`Executing policy directive: "${title}"`)) return;
              setActionRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, executed: true } : rec));
              alert(`Policy directive "${title}" has been transmitted to municipal authorities.`);
            }}
          />
        </div>
      </div>

    </div>
  );
}
