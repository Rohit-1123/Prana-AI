import { useEffect, useState } from "react";
import { Ruler, Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useSettings } from "../../../contexts/SettingsContext";

const unitsTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "Measurement Units",
    sub: "Customize metrics units for temperatures, wind speeds, and particulates",
    scale: "Measurement Scale",
    metric: "Metric (°C, m/s)",
    imperial: "Imperial (°F, mph)",
    saved: "Saved",
    saveBtn: "Save Units Preference"
  },
  hi: {
    title: "मापन इकाइयाँ",
    sub: "तापमान, हवा की गति और कणों के लिए मीट्रिक इकाइयों को अनुकूलित करें",
    scale: "मापन पैमाना",
    metric: "मीट्रिक (°C, m/s)",
    imperial: "इंपीरियल (°F, mph)",
    saved: "सहेजा गया",
    saveBtn: "इकाई प्राथमिकता सहेजें"
  },
  te: {
    title: "కొలత ప్రమాణాలు",
    sub: "ఉష్ణోగ్రతలు, గాలి వేగం మరియు ధూళి కణాల కోసం కొలత ప్రమాణాలను మార్చండి",
    scale: "కొలత స్కేల్",
    metric: "మెట్రిక్ (°C, m/s)",
    imperial: "ఇంపీరియల్ (°F, mph)",
    saved: "భద్రపరచబడింది",
    saveBtn: "కొలత ప్రాధాన్యతలను సేవ్ చేయి"
  },
  ta: {
    title: "அளவீட்டு அலகுகள்",
    sub: "வெப்பநிலை, காற்றின் வேகம் மற்றும் துகள்களுக்கான அலகுகளைத் தனிப்பயனாக்குங்கள்",
    scale: "அளவீட்டு முறை",
    metric: "மெட்ரிக் (°C, m/s)",
    imperial: "இம்பீரியல் (°F, mph)",
    saved: "சேமிக்கப்பட்டது",
    saveBtn: "அலகு முன்னுரிமையைச் சேமி"
  },
  kn: {
    title: "ಅಳತೆಯ ಘಟಕಗಳು",
    sub: "ತಾಪಮಾನ, ಗಾಳಿಯ ವೇಗ ಮತ್ತು ಧೂಳಿನ ಕಣಗಳಿಗಾಗಿ ಘಟಕಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    scale: "ಅಳತೆಯ ಪ್ರಮಾಣ",
    metric: "ಮೆಟ್ರಿಕ್ (°C, m/s)",
    imperial: "ಇಂಪೀರಿಯಲ್ (°F, mph)",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    saveBtn: "ಘಟಕಗಳ ಆದ್ಯತೆಯನ್ನು ಉಳಿಸಿ"
  }
};

export function UnitsPanel() {
  const { language, measurementUnit, setMeasurementUnit } = useSettings();
  const t = unitsTranslations[language] || unitsTranslations["en"];
  const [unit, setUnit] = useState(measurementUnit);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setUnit(measurementUnit);
  }, [measurementUnit]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMeasurementUnit(unit as "metric" | "imperial");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Ruler className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{t.title}</h4>
          <span className="text-[10px] text-muted block mt-0.5">{t.sub}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-4 max-w-md">
        <label className="text-[10px] uppercase font-bold text-muted block">{t.scale}</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as "metric" | "imperial")}
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer w-full"
        >
          <option value="metric" className="bg-card text-foreground">{t.metric}</option>
          <option value="imperial" className="bg-card text-foreground">{t.imperial}</option>
        </select>
      </div>

      <div className="border-t border-border pt-4 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="py-2 px-6 font-bold text-xs"
        >
          {isSaved ? (
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white" /> {t.saved}</span>
          ) : (
            t.saveBtn
          )}
        </Button>
      </div>

    </form>
  );
}
