import { MapView } from "./MapView";
import { BottomAnalytics } from "./BottomAnalytics";
import { 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass
} from "lucide-react";
import { cn } from "../../../utils/cn";
import { uiTranslations } from "../../../utils/i18n";

interface DigitalTwinProps {
  wards: any[];
  selectedWard: any;
  onSelectWard: (ward: any) => void;
  recommendations: any[];
  onExecutePolicy: (id: number, title: string) => void;
}

export function DigitalTwin({
  wards,
  selectedWard,
  onSelectWard,
  recommendations,
  onExecutePolicy
}: DigitalTwinProps) {
  
  const activeLanguage = (localStorage.getItem("language") as "en" | "hi" | "te" | "ta" | "kn") || "en";
  const translations = uiTranslations[activeLanguage] || uiTranslations["en"];
  const currentAqi = selectedWard.aqi;

  const getAQIColorClass = (aqi: number) => {
    if (aqi <= 50) return "text-success border-success/20 bg-success/5";
    if (aqi <= 100) return "text-secondary border-secondary/20 bg-secondary/5";
    if (aqi <= 200) return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };

  const getAQIBadgeText = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    return "Poor / Severe";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none">
      
      {/* Left Area (70% on desktop): Digital Twin Map */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <MapView 
          wards={wards}
          selectedWard={selectedWard}
          onSelectWard={onSelectWard}
        />
        <BottomAnalytics ward={selectedWard} />
      </div>

      {/* Right Area (30% on desktop): Live Environmental summary */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Dynamic focus header */}
        <div className="glass-card p-5">
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-muted block">
            {activeLanguage === "hi" ? "सक्रिय निगरानी नोड" :
             activeLanguage === "te" ? "యాక్టివ్ మానిటరింగ్ నోడ్" :
             activeLanguage === "ta" ? "செயலில் உள்ள கண்காணிப்பு மையம்" :
             activeLanguage === "kn" ? "ಸಕ್ರಿಯ ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರ" :
             "Active Monitoring Node"}
          </span>
          <h3 className="text-xl font-black text-foreground mt-1 flex items-center gap-1.5 leading-none">
            <Compass className="w-5 h-5 text-primary shrink-0" /> {selectedWard.name}
          </h3>
          <p className="text-[10px] text-muted mt-2 leading-relaxed">
            {activeLanguage === "hi" ? "केंद्रक फोकस निर्देशांक गतिशील रूप से संरेखित हैं। मुख्य पर्यावरणीय संकेतक हर 60 सेकंड में सिंक होते हैं।" :
             activeLanguage === "te" ? "కేంద్ర బిందువు కోఆర్డినేట్లు స్వయంచాలకంగా సమలేఖనం చేయబడ్డాయి. ప్రతి 60 సెకన్లకు సూచికలు నవీకరించబడతాయి." :
             activeLanguage === "ta" ? "குவிய ஒருங்கிணைப்புகள் தானாகவே சீரமைக்கப்படுகின்றன. சுற்றுச்சூழல் குறிகாட்டிகள் ஒவ்வொரு 60 விநாடிகளுக்கும் ஒத்திசைக்கப்படுகின்றன." :
             activeLanguage === "kn" ? "ಕೇಂದ್ರೀಕೃತ ನಿರ್ದೇಶಾಂಕಗಳು ಕ್ರಿಯಾತ್ಮಕವಾಗಿ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತವೆ. ಪರಿಸರ ಸೂಚಕಗಳು ಪ್ರತಿ 60 ಸೆಕೆಂಡಿಗೆ ನವೀಕರಣಗೊಳ್ಳುತ್ತವೆ." :
             "Centroid focus coordinates aligned dynamically. Core environmental indicators sync every 60 seconds."}
          </p>
        </div>

        {/* Current AQI card */}
        <div className={cn(
          "glass-card p-5 border rounded-2xl flex justify-between items-center",
          getAQIColorClass(currentAqi)
        )}>
          <div>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-muted block leading-none font-extrabold">
              {activeLanguage === "hi" ? "वर्तमान एक्यूआई मान" :
               activeLanguage === "te" ? "ప్రస్తుత AQI విలువ" :
               activeLanguage === "ta" ? "தற்போதைய AQI மதிப்பு" :
               activeLanguage === "kn" ? "ಪ್ರಸ್ತುತ AQI ಮೌಲ್ಯ" :
               "Current AQI Value"}
            </span>
            <span className="text-4xl font-black block mt-2 text-foreground">{currentAqi}</span>
            <span className="text-xs font-bold block mt-1.5 uppercase tracking-wider">{getAQIBadgeText(currentAqi)} Category</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-theme">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[9px] uppercase font-bold text-muted mt-1 font-bold">Stable</span>
          </div>
        </div>

        {/* Local weather dials */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-muted uppercase tracking-widest leading-none font-extrabold">
            {activeLanguage === "hi" ? "मौसम का स्नैपशॉट" :
             activeLanguage === "te" ? "వాతావరణ సమాచారం" :
             activeLanguage === "ta" ? "வானிலை தகவல்" :
             activeLanguage === "kn" ? "ಹವಾಮಾನ ಮಾಹಿತಿ" :
             "Weather Snapshots"}
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs leading-normal font-semibold text-foreground">
            <div className="flex items-center gap-2.5 bg-muted/5 border border-border p-3 rounded-xl">
              <Thermometer className="w-5 h-5 text-warning shrink-0" />
              <div>
                <span className="text-[9px] text-muted block font-medium">
                  {activeLanguage === "hi" ? "तापमान" :
                   activeLanguage === "te" ? "ఉష్ణోగ్రత" :
                   activeLanguage === "ta" ? "வெப்பநிலை" :
                   activeLanguage === "kn" ? "ತಾಪಮಾನ" :
                   "Temperature"}
                </span>
                <span className="text-xs font-black">{selectedWard.temperature}°C</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 bg-muted/5 border border-border p-3 rounded-xl">
              <Droplets className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-[9px] text-muted block font-medium">Humidity</span>
                <span className="text-xs font-black">{selectedWard.humidity}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 bg-muted/5 border border-border p-3 rounded-xl col-span-2">
              <Wind className="w-5 h-5 text-secondary shrink-0" />
              <div className="flex-1 flex justify-between items-center pr-1">
                <div>
                  <span className="text-[9px] text-muted block font-medium">
                    {activeLanguage === "hi" ? "हवा की गति" :
                     activeLanguage === "te" ? "గాలి తీవ్రత" :
                     activeLanguage === "ta" ? "காற்றின் வேகம்" :
                     activeLanguage === "kn" ? "ಗಾಳಿಯ ವೇಗ" :
                     "Wind vectors"}
                  </span>
                  <span className="text-xs font-black">{selectedWard.wind_speed} m/s Speed</span>
                </div>
                <span className="text-[9px] font-bold text-success">Calm dispersion</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations sandbox list */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-muted uppercase tracking-widest leading-none font-extrabold flex items-center justify-between">
            <span>
              {activeLanguage === "hi" ? "नीतिगत हस्तक्षेप" :
               activeLanguage === "te" ? "విధానాల అమలు" :
               activeLanguage === "ta" ? "கொள்கை தலையீடுகள்" :
               activeLanguage === "kn" ? "ನೀತಿ ಹಸ್ತಕ್ಷೇಪಗಳು" :
               "Policy Interventions"}
            </span>
            <span className="text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded">Active</span>
          </h4>

          <div className="flex flex-col gap-3">
            {recommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="bg-muted/5 border border-border p-3 rounded-xl flex flex-col gap-2.5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="font-extrabold text-[10.5px] text-foreground leading-snug block">{rec.title}</span>
                    <span className="text-[9.5px] text-muted mt-1 leading-normal block">{rec.desc.slice(0, 70)}...</span>
                  </div>
                  <span className="text-[9px] text-success font-extrabold shrink-0">{rec.impact}</span>
                </div>
                <button
                  onClick={() => onExecutePolicy(rec.id, rec.title)}
                  className={cn(
                    "w-full text-center py-1.5 text-[9px] font-bold rounded-lg border transition-all cursor-pointer",
                    rec.executed 
                      ? "bg-success/15 border-success/20 text-success cursor-not-allowed pointer-events-none"
                      : "bg-primary/10 border-primary/25 text-primary hover:bg-primary/20"
                  )}
                >
                  {rec.executed ? `✓ ${translations.executedLabel || "Transmitted"}` : (translations.executeActionLabel || "Transmit Directive")}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
