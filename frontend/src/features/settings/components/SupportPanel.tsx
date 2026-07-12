import { HelpCircle, ExternalLink, ShieldCheck, Mail } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

const supportTranslations: Record<"en" | "hi" | "te" | "ta" | "kn", Record<string, string>> = {
  en: {
    title: "Help & Support Resources",
    sub: "Contact smart-city developers or open tickets",
    docGuides: "Documentation Guides",
    docGuidesDesc: "Read operational manuals detailing regression models.",
    reportMal: "Report Sensor Malfunction",
    reportMalDesc: "Open a support ticket with municipal repair teams.",
    privacy: "Privacy Policies",
    privacyDesc: "Enterprise data privacy and compliance safeguards.",
    helpdesk: "Municipal Developer Helpdesk",
    helpdeskDesc: "Reach out to operations team at: support@prana.ai"
  },
  hi: {
    title: "सहायता और समर्थन संसाधन",
    sub: "स्मार्ट-सिटी डेवलपर्स से संपर्क करें या टिकट खोलें",
    docGuides: "दस्तावेज़ीकरण गाइड",
    docGuidesDesc: "रिग्रेशन मॉडल का विवरण देने वाले परिचालन मैनुअल पढ़ें।",
    reportMal: "सेंसर खराबी की रिपोर्ट करें",
    reportMalDesc: "नगर निगम मरम्मत टीमों के साथ एक सहायता टिकट खोलें।",
    privacy: "गोपनीयता नीतियां",
    privacyDesc: "उद्यम डेटा गोपनीयता और अनुपालन सुरक्षा।",
    helpdesk: "नगर निगम डेवलपर हेल्पडेस्क",
    helpdeskDesc: "परिचालन टीम से संपर्क करें: support@prana.ai"
  },
  te: {
    title: "సహాయం & మద్దతు వనరులు",
    sub: "స్మార్ట్-సిటీ డెవలపర్లను సంప్రదించండి లేదా టిక్కెట్లు తెరవండి",
    docGuides: "డాక్యుమెンテషన్ గైడ్‌లు",
    docGuidesDesc: "రిగ్రెషన్ నమూనాల వివరాలతో కూడిన కార్యాచరణ మాన్యువల్‌లను చదవండి.",
    reportMal: "సెన్సార్ తప్పులను నివేదించండి",
    reportMalDesc: "మున్సిపల్ మరమ్మతు బృందాలతో మద్దతు టిక్కెట్‌ను తెరవండి.",
    privacy: "గోప్యతా విధానాలు",
    privacyDesc: "ఎంటర్‌ప్రైజ్ డేటా గోప్యత మరియు నిబంధనల రక్షణలు.",
    helpdesk: "మున్సిపల్ డెవలపర్ హెల్ప్‌డెస్క్",
    helpdeskDesc: "ఆపరేషన్స్ బృందాన్ని సంప్రదించండి: support@prana.ai"
  },
  ta: {
    title: "உதவி & ஆதரவு ஆதாரங்கள்",
    sub: "ஸ்மார்ட்-சிட்டி டெவலப்பர்களைத் தொடர்பு கொள்ளுங்கள் அல்லது புகார்களைப் பதிவுசெய்யுங்கள்",
    docGuides: "ஆவண வழிகாட்டிகள்",
    docGuidesDesc: "மாடல்களின் விவரங்களை விளக்கும் செயல்பாட்டு கையேடுகளைப் படியுங்கள்.",
    reportMal: "சென்சார் செயலிழப்பை புகாரளிக்கவும்",
    reportMalDesc: "நகராட்சி பழுதுபார்க்கும் குழுக்களுடன் ஒரு புகாரைப் பதிவுசெய்யவும்.",
    privacy: "தனியுரிமைக் கொள்கைகள்",
    privacyDesc: "நிறுவன தரவு தனியுரிமை மற்றும் இணக்கப் பாதுகாப்புகள்.",
    helpdesk: "நகராட்சி டெவலப்பர் உதவி மையம்",
    helpdeskDesc: "செயல்பாட்டுக் குழுவைத் தொடர்பு கொள்ளவும்: support@prana.ai"
  },
  kn: {
    title: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ ಸಂಪನ್ಮೂಲಗಳು",
    sub: "ಸ್ಮಾರ್ಟ್-ಸಿಟಿ ಡೆವಲಪರ್‌ಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಟಿಕೆಟ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ",
    docGuides: "ದಸ್ತಾವೇಜು ಮಾರ್ಗದರ್ಶಿಗಳು",
    docGuidesDesc: "ರಿಗ್ರೆಷನ್ ಮಾದರಿಗಳ ವಿವರವಾದ ಕಾರ್ಯಾಚರಣೆಯ ಕೈಪಿಡಿಗಳನ್ನು ಓದಿ.",
    reportMal: "ಸಂವೇದಕ ದೋಷವನ್ನು ವರದಿ ಮಾಡಿ",
    reportMalDesc: "ಪುರಸಭೆಯ ದುರಸ್ತಿ ತಂಡಗಳೊಂದಿಗೆ ಬೆಂಬಲ ಟಿಕೆಟ್ ತೆರೆಯಿರಿ.",
    privacy: "ಗೌಪ್ಯತೆ ನೀತಿಗಳು",
    privacyDesc: "ಎಂಟರ್‌ಪ್ರೈಸ್ ಡೇಟಾ ಗೌಪ್ಯತೆ ಮತ್ತು ಅನುಸರಣೆ ಸುರಕ್ಷತೆಗಳು.",
    helpdesk: "ಪುರಸಭೆಯ ಡೆವಲಪರ್ ಸಹಾಯ ಕೇಂದ್ರ",
    helpdeskDesc: "ಕಾರ್ಯಾಚರಣಾ ತಂಡವನ್ನು ಇಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ: support@prana.ai"
  }
};

export function SupportPanel() {
  const { language } = useSettings();
  const t = supportTranslations[language] || supportTranslations["en"];
  
  const links = [
    { label: t.docGuides, desc: t.docGuidesDesc, action: () => alert(language === "hi" ? "दस्तावेज़ों पर जा रहे हैं।" : language === "te" ? "డాక్యుమెంటేషన్‌కు మళ్లిస్తోంది." : language === "ta" ? "ஆவணங்களுக்கு திருப்பி விடப்படுகிறது." : language === "kn" ? "ದಸ್ತಾವೇಜಿಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ." : "Redirecting to API docs.") },
    { label: t.reportMal, desc: t.reportMalDesc, action: () => alert(language === "hi" ? "सहायता टिकट बनाया गया।" : language === "te" ? "మద్దతు టికెట్ సృష్టించబడింది." : language === "ta" ? "புகார் பதிவு செய்யப்பட்டது." : language === "kn" ? "ಬೆಂಬಲ ಟಿಕೆಟ್ ರಚಿಸಲಾಗಿದೆ." : "Support ticket created.") },
    { label: t.privacy, desc: t.privacyDesc, action: () => alert(language === "hi" ? "गोपनीयता समझौता खोल रहे हैं।" : language === "te" ? "గోప్యతా ఒప్పందాన్ని తెరుస్తోంది." : language === "ta" ? "தனியுரிமை ஒப்பந்தம் திறக்கப்படுகிறது." : language === "kn" ? "ಗೌಪ್ಯತೆ ಒಪ್ಪಂದವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ." : "Opening Privacy Agreement.") }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{t.title}</h4>
          <span className="text-[10px] text-muted block mt-0.5">{t.sub}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        {links.map((lnk, idx) => (
          <div
            key={idx}
            onClick={lnk.action}
            className="bg-muted/5 hover:bg-muted/10 border border-border p-3.5 rounded-xl flex justify-between items-center text-xs cursor-pointer group transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground block group-hover:text-primary transition-colors">{lnk.label}</span>
                <span className="text-[9.5px] text-muted block mt-0.5 font-sans leading-relaxed">{lnk.desc}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted group-hover:text-foreground shrink-0 transition-colors" />
          </div>
        ))}

        <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-xl flex gap-3 items-start mt-2">
          <Mail className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-foreground block">{t.helpdesk}</span>
            <span className="text-[9.5px] text-muted block mt-0.5">{t.helpdeskDesc}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
