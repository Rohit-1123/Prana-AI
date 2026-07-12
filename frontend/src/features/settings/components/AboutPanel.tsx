import { Info, Compass } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

const aboutTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "About PranaAI Decision Engine",
    sub: "Version 1.0.0 (Hyderabad MVP Corridor)",
    p1: "PranaAI is an Environmental Intelligence Operating System built to assist smart-city administrators and municipal operators.",
    specs: "Core Tech Stack Specifications",
    developedBy: "Developed by Team PranaAI. Predict. Explain. Act."
  },
  hi: {
    title: "प्राणएआई निर्णय इंजन के बारे में",
    sub: "संस्करण १.०.० (हैदराबाद एमवीपी कॉरिडोर)",
    p1: "प्राणएआई एक पर्यावरणीय खुफिया ऑपरेटिंग सिस्टम है जिसे स्मार्ट-सिटी प्रशासकों और नगर निगम ऑपरेटरों की सहायता के लिए बनाया गया है।",
    specs: "मुख्य तकनीकी विनिर्देश",
    developedBy: "टीम प्राणएआई द्वारा विकसित। भविष्यवाणी। व्याख्या। कार्रवाई।"
  },
  te: {
    title: "ప్రాణAI డెసిషన్ ఇంజిన్ గురించి",
    sub: "వెర్షన్ 1.0.0 (హైదరాబాద్ MVP కారిడార్)",
    p1: "ప్రాణAI అనేది స్మార్ట్-సిటీ నిర్వాహకులు మరియు మున్సిపల్ ఆపరేటర్లకు సహాయం చేయడానికి నిర్మించబడిన పర్యావరణ మేధస్సు ఆపరేటింగ్ సిస్టమ్.",
    specs: "ప్రధాన సాంకేతిక వివరాలు",
    developedBy: "టీమ్ ప్రాణAI చే అభివృద్ధి చేయబడింది. ఊహించు. వివరించు. ఆచరించు."
  },
  ta: {
    title: "பிராணாஏஐ முடிவு இயந்திரம் பற்றி",
    sub: "பதிப்பு 1.0.0 (ஹைதராபாத் MVP காரிடார்)",
    p1: "பிராணாஏஐ என்பது ஸ்மார்ட்-சிட்டி நிர்வாகிகள் மற்றும் நகராட்சி ஆபரேட்டர்களுக்கு உதவ கட்டமைக்கப்பட்ட சுற்றுச்சூழல் நுண்ணறிவு இயக்க முறைமையாகும்.",
    specs: "முக்கிய தொழில்நுட்ப விவரங்கள்",
    developedBy: "பிராணாஏஐ குழுவினரால் உருவாக்கப்பட்டது. கணிப்பு. விளக்கம். செயல்."
  },
  kn: {
    title: "ಪ್ರಾಣಎಐ ನಿರ್ಧಾರ ಎಂಜಿನ್ ಬಗ್ಗೆ",
    sub: "ಆವೃತ್ತಿ 1.0.0 (ಹೈದರಾಬಾದ್ MVP ಕಾರಿಡಾರ್)",
    p1: "ಪ್ರಾಣಎಐ ಎನ್ನುವುದು ಸ್ಮಾರ್ಟ್-ಸಿಟಿ ನಿರ್ವಾಹಕರು ಮತ್ತು ಪುರಸಭೆಯ ನಿರ್ವಾಹಕರಿಗೆ ಸಹಾಯ ಮಾಡಲು ನಿರ್ಮಿಸಲಾದ ಪರಿಸರ ಬುದ್ಧಿವಂತಿಕೆಯ ಕಾರ್ಯಾಚರಣಾ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ.",
    specs: "ಪ್ರಮುಖ ತಂತ್ರಜ್ಞಾನದ ವಿಶೇಷಣಗಳು",
    developedBy: "ಟೀಮ್ ಪ್ರಾಣಎಐ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದೆ. ಊಹಿಸಿ. ವಿವರಿಸಿ. ಕಾರ್ಯನಿರ್ವಹಿಸಿ."
  }
};

export function AboutPanel() {
  const { language } = useSettings();
  const t = aboutTranslations[language] || aboutTranslations["en"];
  
  const techStack = [
    { name: "React Framework", version: "18.3.1" },
    { name: "Vite Compiler", version: "8.1.0" },
    { name: "Leaflet GIS Map", version: "1.9.4" },
    { name: "Recharts Visuals", version: "2.12.7" }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{t.title}</h4>
          <span className="text-[10px] text-muted block mt-0.5">{t.sub}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-border pt-5 text-xs text-muted leading-relaxed font-sans">
        <p>
          {t.p1}
        </p>

        {/* Tech grid */}
        <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block mb-1">{t.specs}</span>
          {techStack.map((tech, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs border-b border-border/40 pb-1.5 mt-0.5">
              <span className="font-semibold text-foreground">{tech.name}</span>
              <span className="font-mono text-muted">{tech.version}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border/60 pt-4 mt-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-primary shrink-0" />
          </div>
          <span className="font-bold text-foreground">{t.developedBy}</span>
        </div>

      </div>

    </div>
  );
}
