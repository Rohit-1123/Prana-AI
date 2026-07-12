import { Settings, Ruler, Globe, Info, HelpCircle } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useSettings } from "../../../contexts/SettingsContext";

export type SettingsSection = "appearance" | "units" | "timezone" | "about" | "support";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
}

const sidebarTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    controlPanel: "Control Panel",
    customization: "Customization preferences",
    appearance: "Appearance",
    units: "Measurement Units",
    timezone: "Timezone Scope",
    about: "About System",
    support: "Help & Support"
  },
  hi: {
    controlPanel: "नियंत्रण कक्ष",
    customization: "अनुकूलन प्राथमिकताएं",
    appearance: "दिखावट",
    units: "मापन इकाइयाँ",
    timezone: "समय क्षेत्र दायरा",
    about: "सिस्टम के बारे में",
    support: "सहायता और समर्थन"
  },
  te: {
    controlPanel: "నియంత్రణ ప్యానెల్",
    customization: "అనుకూలీకరణ ప్రాధాన్యతలు",
    appearance: "రూపం",
    units: "కొలత ప్రమాణాలు",
    timezone: "సమయ క్షేత్రం",
    about: "వ్యవస్థ గురించి",
    support: "సహాయం & మద్దతు"
  },
  ta: {
    controlPanel: "கட்டுப்பாட்டு குழு",
    customization: "தனிப்பயனாக்க விருப்பங்கள்",
    appearance: "தோற்றம்",
    units: "அளவீட்டு அலகுகள்",
    timezone: "நேர மண்டல எல்லை",
    about: "கணினி பற்றி",
    support: "உதவி & ஆதரவு"
  },
  kn: {
    controlPanel: "ನಿಯಂತ್ರಣ ಫಲಕ",
    customization: "ಗ್ರಾಹಕೀಕರಣ ಆದ್ಯತೆಗಳು",
    appearance: "ರೂಪ",
    units: "ಅಳತೆಯ ಘಟಕಗಳು",
    timezone: "ಸಮಯ ವಲಯದ ವ್ಯಾಪ್ತಿ",
    about: "ವ್ಯವಸ್ಥೆಯ ಬಗ್ಗೆ",
    support: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ"
  }
};

export function SettingsSidebar({ activeSection, onSelectSection }: SettingsSidebarProps) {
  const { language } = useSettings();
  const t = sidebarTranslations[language] || sidebarTranslations["en"];

  const sections: { id: SettingsSection; label: string; icon: any }[] = [
    { id: "appearance", label: t.appearance, icon: Settings },
    { id: "units", label: t.units, icon: Ruler },
    { id: "timezone", label: t.timezone, icon: Globe },
    { id: "about", label: t.about, icon: Info },
    { id: "support", label: t.support, icon: HelpCircle }
  ];

  return (
    <div className="glass-card p-4 flex flex-col gap-1.5 h-full overflow-y-auto animate-in fade-in duration-200">
      <div className="px-3 py-2 border-b border-border/80 mb-2">
        <span className="text-[10px] text-muted font-extrabold uppercase block tracking-wider">{t.controlPanel}</span>
        <span className="text-[9px] text-muted block mt-0.5">{t.customization}</span>
      </div>

      <nav className="flex flex-col gap-1">
        {sections.map((sec) => {
          const isActive = sec.id === activeSection;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-muted hover:text-foreground hover:bg-muted/5"
              )}
            >
              <sec.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted")} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
