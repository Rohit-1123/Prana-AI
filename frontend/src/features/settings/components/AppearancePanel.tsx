import { useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useSettings } from "../../../contexts/SettingsContext";

const appearanceTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "Appearance Configurations",
    sub: "Customize layouts style, color theme, and animations scales",
    themeEngine: "Theme Engine selection",
    light: "Light Theme",
    dark: "Dark Theme",
    system: "System Sync",
    density: "Layout spacing density",
    compact: "Compact Density",
    comfortable: "Comfortable Grid",
    spacious: "Spacious Canvas",
    animationsTitle: "Enable Micro-Animations",
    animationsSub: "Toggle transitions hover scales and charts animations"
  },
  hi: {
    title: "दिखावट विन्यास",
    sub: "लेआउट शैली, रंग थीम और एनिमेशन पैमानों को अनुकूलित करें",
    themeEngine: "थीम इंजन चयन",
    light: "लाइट थीम",
    dark: "डार्क थीम",
    system: "सिस्टम सिंक",
    density: "लेआउट रिक्ति घनत्व",
    compact: "सघन घनत्व",
    comfortable: "आरामदायक ग्रिड",
    spacious: "विस्तृत कैनवास",
    animationsTitle: "माइक्रो-एनिमेशन सक्षम करें",
    animationsSub: "संक्रमण होवर स्केल और चार्ट एनिमेशन टॉगल करें"
  },
  te: {
    title: "రూపురేఖల ఆకృతీకరణలు",
    sub: "లేఅవుట్ శైలి, రంగు థీమ్ మరియు యానిమేషన్ స్థాయిలను అనుకూలీకరించండి",
    themeEngine: "థీమ్ ఇంజిన్ ఎంపిక",
    light: "లైట్ థీమ్",
    dark: "డార్క్ థీమ్",
    system: "సిస్టమ్ సమకాలీకరణ",
    density: "లేఅవుట్ ఖాళీ సాంద్రత",
    compact: "సందడి సాంద్రత",
    comfortable: "సౌకర్యవంతమైన గ్రిడ్",
    spacious: "ವಿಶಾಲమైన కాన్వాస్",
    animationsTitle: "సూక్ష్మ యానిమేషన్‌లను ప్రారంభించండి",
    animationsSub: "హోవర్ స్కేల్స్ మరియు చార్ట్స్ యానిమేషన్‌లను టోగుల్ చేయండి"
  },
  ta: {
    title: "தோற்ற உள்ளமைவுகள்",
    sub: "தளவமைப்பு பாணி, வண்ண தீம் மற்றும் அனிமேஷன் அலகுகளைத் தனிப்பயனாக்குங்கள்",
    themeEngine: "தீம் என்ஜின் தேர்வு",
    light: "ஒளி தீம்",
    dark: "இருண்ட தீம்",
    system: "கணினி ஒத்திசைவு",
    density: "தளவமைப்பு இடைவெளி அடர்த்தி",
    compact: "நெருக்கமான அடர்த்தி",
    comfortable: "வசதியான கட்டம்",
    spacious: "விசாலமான கேன்வாஸ்",
    animationsTitle: "மைக்ரோ-அனிமேஷன்களை இயக்கு",
    animationsSub: "ஹோவர் அளவுகள் மற்றும் விளக்கப்பட அனிமேஷன்களை மாற்றவும்"
  },
  kn: {
    title: "ರೂಪದ ಸಂರಚನೆಗಳು",
    sub: "ವಿನ್ಯಾಸಗಳ ಶೈಲಿ, ಬಣ್ಣದ ಥೀಮ್ ಮತ್ತು ಯಾನಿಮೇಶನ್ ಪ್ರಮಾಣಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    themeEngine: "ಥೀಮ್ ಎಂಜಿನ್ ಆಯ್ಕೆ",
    light: "ಲೈಟ್ ಥೀಮ್",
    dark: "ಡಾರ್ಕ್ ಥೀಮ್",
    system: "ಸಿಸ್ಟಮ್ ಸಿಂಕ್",
    density: "ವಿನ್ಯಾಸದ ಅಂತರದ ಸಾಂದ್ರತೆ",
    compact: "ಕಾಂಪ್ಯಾಕ್ಟ್ ಸಾಂದ್ರತೆ",
    comfortable: "ಆರಾಮದಾಯಕ ಗ್ರಿಡ್",
    spacious: "ವಿಶಾಲವಾದ ಕ್ಯಾನ್ವಾಸ್",
    animationsTitle: "ಮೈಕ್ರೋ-ಅನಿಮೇಷನ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    animationsSub: "ಹೋವರ್ ಸ್ಕೇಲ್ಸ್ ಮತ್ತು ಚಾರ್ಟ್ ಅನಿಮೇಷನ್‌ಗಳನ್ನು ಟಾಗಲ್ ಮಾಡಿ"
  }
};

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const { language } = useSettings();
  const t = appearanceTranslations[language] || appearanceTranslations["en"];
  
  // Custom Spacing Density Preferences state
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  
  // Motion Preferences state
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleDensityChange = (val: "compact" | "comfortable" | "spacious") => {
    setDensity(val);
    
    // Apply compaction globally to layout bounds
    const html = document.documentElement;
    html.classList.remove("density-compact", "density-comfortable", "density-spacious");
    html.classList.add(`density-${val}`);
    
    const alertMsg = language === "hi" ? `रिक्ति लेआउट घनत्व अपडेट किया गया: "${val}"` : 
                    language === "te" ? `లేఅవుట్ ఖాళీ సాంద్రత నవీకరించబడింది: "${val}"` : 
                    language === "ta" ? `தளவமைப்பு இடைவெளி அடர்த்தி புதுப்பிக்கப்பட்டது: "${val}"` : 
                    language === "kn" ? `ವಿನ್ಯಾಸದ ಅಂತರದ ಸಾಂದ್ರತೆ ನವೀಕರಿಸಲಾಗಿದೆ: "${val}"` : 
                    `Spacing layout density updated: "${val}". Spacing scales recalculated.`;
    alert(alertMsg);
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{t.title}</h4>
          <span className="text-[10px] text-muted block mt-0.5">{t.sub}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-5">
        
        {/* A. Colors Theme switcher */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block">{t.themeEngine}</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: t.light, icon: Sun },
              { id: "dark", label: t.dark, icon: Moon },
              { id: "system", label: t.system, icon: Monitor }
            ].map((th) => {
              const isSelected = theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-3 rounded-xl border text-center transition-all cursor-pointer",
                    isSelected 
                      ? "bg-primary/5 border-primary text-foreground font-bold" 
                      : "bg-card border-border text-muted hover:bg-muted/5"
                  )}
                >
                  <th.icon className="w-5 h-5" />
                  <span className="text-[10px]">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. Spacing Densities */}
        <div className="flex flex-col gap-2.5 border-t border-border pt-5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block">{t.density}</span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "compact", label: t.compact },
              { id: "comfortable", label: t.comfortable },
              { id: "spacious", label: t.spacious }
            ].map((d) => {
              const isSelected = density === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDensityChange(d.id as any)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer",
                    isSelected 
                      ? "bg-primary/5 border-primary text-foreground font-black" 
                      : "bg-card border-border text-muted hover:bg-muted/5"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* C. Animation Scales */}
        <div className="flex justify-between items-center border-t border-border pt-5 text-xs font-semibold text-foreground">
          <div>
            <span className="font-bold block">{t.animationsTitle}</span>
            <span className="text-[10px] text-muted block mt-0.5">{t.animationsSub}</span>
          </div>

          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={cn(
              "w-12 h-6.5 rounded-full transition-all cursor-pointer relative p-0.5 border",
              animationsEnabled ? "bg-primary border-primary" : "bg-muted/20 border-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 bg-card rounded-full shadow-sm transition-all transform",
              animationsEnabled ? "translate-x-[22px]" : "translate-x-0"
            )} />
          </button>
        </div>

      </div>

    </div>
  );
}
