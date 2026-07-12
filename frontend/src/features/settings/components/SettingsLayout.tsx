import { useState } from "react";
import { SettingsSidebar, type SettingsSection } from "./SettingsSidebar";
import { AppearancePanel } from "./AppearancePanel";
import { UnitsPanel } from "./UnitsPanel";
import { TimezonePanel } from "./TimezonePanel";
import { AboutPanel } from "./AboutPanel";
import { SupportPanel } from "./SupportPanel";
import { useSettings } from "../../../contexts/SettingsContext";

const layoutTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "Control Panel Settings",
    desc: "Configure layout appearances, measurement units, timezone scope, and about parameters"
  },
  hi: {
    title: "नियंत्रण कक्ष सेटिंग्स",
    desc: "लेआउट दिखावट, मापन इकाइयाँ, समय क्षेत्र दायरा और सिस्टम मापदंडों को कॉन्फ़िगर करें"
  },
  te: {
    title: "నియంత్రణ ప్యానెల్ అమరికలు",
    desc: "లేఅవుట్ రూపాలు, కొలత ప్రమాణాలు, సమయ క్షేత్రం మరియు సిస్టమ్ పారామితులను కాన్ఫిగర్ చేయండి"
  },
  ta: {
    title: "கட்டுப்பாட்டு குழு அமைப்புகள்",
    desc: "அமைப்புகள், அளவீட்டு அலகுகள், நேர மண்டல எல்லை மற்றும் கணினி அளவுருக்களை உள்ளமைக்கவும்"
  },
  kn: {
    title: "ನಿಯಂತ್ರಣ ಫಲಕ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    desc: "ವಿನ್ಯಾಸದ ರೂಪಗಳು, ಅಳತೆಯ ಘಟಕಗಳು, ಸಮಯ ವಲಯದ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸಿಸ್ಟಮ್ ನಿಯತಾಂಕಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ"
  }
};

export function SettingsLayout() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
  const { language } = useSettings();
  const t = layoutTranslations[language] || layoutTranslations["en"];

  const renderSection = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearancePanel />;
      case "units":
        return <UnitsPanel />;
      case "timezone":
        return <TimezonePanel />;
      case "about":
        return <AboutPanel />;
      case "support":
        return <SupportPanel />;
      default:
        return <AppearancePanel />;
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-foreground">{t.title}</h2>
        <span className="text-xs text-muted block mt-1">{t.desc}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Options sidebar: 3 columns */}
        <div className="lg:col-span-3">
          <SettingsSidebar 
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />
        </div>

        {/* Right configuration views: 9 columns */}
        <div className="lg:col-span-9">
          {renderSection()}
        </div>

      </div>

    </div>
  );
}
