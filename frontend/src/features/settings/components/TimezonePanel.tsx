import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useSettings } from "../../../contexts/SettingsContext";

const tzTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "Timezone Scope",
    sub: "Configure system-wide local or global time formats",
    label: "Timezone Scope",
    ist: "Indian Standard Time (IST)",
    utc: "Coordinated Universal Time (UTC)",
    saved: "Saved",
    saveBtn: "Save Timezone Preference"
  },
  hi: {
    title: "समय क्षेत्र दायरा",
    sub: "सिस्टम-व्यापी स्थानीय या वैश्विक समय स्वरूपों को कॉन्फ़िगर करें",
    label: "समय क्षेत्र दायरा",
    ist: "भारतीय मानक समय (IST)",
    utc: "समन्वित सार्वभौमिक समय (UTC)",
    saved: "सहेजा गया",
    saveBtn: "समय क्षेत्र प्राथमिकता सहेजें"
  },
  te: {
    title: "సమయ క్షేత్రం",
    sub: "సిస్టమ్-వ్యాప్త స్థానిక లేదా గ్లోబల్ సమయ ఆకృతులను కాన్ఫిగర్ చేయండి",
    label: "సమయ క్షేత్రం",
    ist: "భారతీయ ప్రామాణిక సమయం (IST)",
    utc: "సమన్వయ సార్వత్రిక సమయం (UTC)",
    saved: "భద్రపరచబడింది",
    saveBtn: "సమయ ప్రాధాన్యతను సేవ్ చేయి"
  },
  ta: {
    title: "நேர மண்டல எல்லை",
    sub: "கணினி அளவிலான உள்ளூர் அல்லது உலகளாவிய நேர வடிவங்களை உள்ளமைக்கவும்",
    label: "நேர மண்டல எல்லை",
    ist: "இந்திய நேர அளவு (IST)",
    utc: "ஒங்கிணைந்த உலகளாவிய நேரம் (UTC)",
    saved: "சேமிக்கப்பட்டது",
    saveBtn: "நேர மண்டல முன்னுரிமையைச் சேமி"
  },
  kn: {
    title: "ಸಮಯ ವಲಯದ ವ್ಯಾಪ್ತಿ",
    sub: "ಸಿಸ್ಟಮ್-ವ್ಯಾಪಿ ಸ್ಥಳೀಯ ಅಥವಾ ಜಾಗತಿಕ ಸಮಯ ಸ್ವರೂಪಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ",
    label: "ಸಮಯ ವಲಯದ ವ್ಯಾಪ್ತಿ",
    ist: "ಭಾರತೀಯ ಪ್ರಮಾಣಿತ ಸಮಯ (IST)",
    utc: "ಸಂಯೋಜಿತ ಸಾರ್ವತ್ರಿಕ ಸಮಯ (UTC)",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    saveBtn: "ಸಮಯ ವಲಯದ ಆದ್ಯತೆಯನ್ನು ಉಳಿಸಿ"
  }
};

export function TimezonePanel() {
  const { language, systemTimezone, setSystemTimezone } = useSettings();
  const t = tzTranslations[language] || tzTranslations["en"];
  const [timezone, setTimezone] = useState(systemTimezone);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setTimezone(systemTimezone);
  }, [systemTimezone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemTimezone(timezone as "IST" | "UTC");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{t.title}</h4>
          <span className="text-[10px] text-muted block mt-0.5">{t.sub}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-4 max-w-md">
        <label className="text-[10px] uppercase font-bold text-muted block">{t.label}</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value as "IST" | "UTC")}
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer w-full"
        >
          <option value="IST" className="bg-card text-foreground">{t.ist}</option>
          <option value="UTC" className="bg-card text-foreground">{t.utc}</option>
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
