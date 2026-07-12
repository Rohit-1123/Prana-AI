import { FileText, Download, Printer, Share2, Compass } from "lucide-react";
import { type ReportTemplate } from "./ReportCard";
import { uiTranslations, localizedBriefs } from "../../../utils/i18n";
import { useSettings } from "../../../contexts/SettingsContext";

interface ReportPreviewProps {
  report: ReportTemplate | null;
  onClose: () => void;
}

export function ReportPreview({ report, onClose }: ReportPreviewProps) {
  if (!report) return null;

  const { language } = useSettings();
  const activeLanguage = language;
  const translations = uiTranslations[activeLanguage] || uiTranslations["en"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="w-full max-w-2xl bg-card border border-border h-[90vh] overflow-y-auto relative z-10 p-8 rounded-2xl flex flex-col justify-between shadow-theme animate-in slide-in-from-bottom-2 duration-300">
        
        {/* Preview header */}
        <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <span className="font-bold text-foreground text-sm">
              {activeLanguage === "hi" ? "कार्यकारी ब्रीफिंग शीट पूर्वावलोकन" :
               activeLanguage === "te" ? "ఎగ్జిక్యూటివ్ బ్రీఫింగ్ షీట్ ప్రివ్యూ" :
               activeLanguage === "ta" ? "நிர்வாக விளக்கக்காட்சி முன்னோட்டம்" :
               activeLanguage === "kn" ? "ಕಾರ್ಯನಿರ್ವಾಹಕ ಬ್ರೀಫಿಂಗ್ ಶೀಟ್ ಮುನ್ನೋಟ" :
               "Executive Briefing Sheet Preview"}
            </span>
          </div>

          <div className="flex gap-2.5">
            <button onClick={handlePrint} title="Print document" className="p-2 bg-card hover:bg-muted/10 border border-border rounded-xl text-muted hover:text-foreground cursor-pointer transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={() => alert("Share briefing sheet links.")} title="Share report" className="p-2 bg-card hover:bg-muted/10 border border-border rounded-xl text-muted hover:text-foreground cursor-pointer transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-xs font-bold text-muted hover:text-foreground cursor-pointer px-1">
              {activeLanguage === "hi" ? "बंद करें" :
               activeLanguage === "te" ? "మూసివేయి" :
               activeLanguage === "ta" ? "மூடு" :
               activeLanguage === "kn" ? "ಮುಚ್ಚು" :
               "Close"}
            </button>
          </div>
        </div>

        {/* Corporate brief canvas */}
        <div className="flex-grow flex flex-col gap-6 text-foreground p-6 bg-muted/5 border border-border rounded-2xl font-serif max-h-[60vh] overflow-y-auto">
          
          {/* Logo & title header */}
          <div className="flex justify-between items-center border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-sm tracking-tight font-sans">PranaAI</span>
            </div>
            <div className="text-right text-[10px] text-muted font-sans font-bold">
              <span>{translations.classified || "Classified: Executive smart-city briefing"}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-primary font-sans tracking-widest">
              {report.type} {activeLanguage === "hi" ? "संक्षिप्त रिपोर्ट" : activeLanguage === "te" ? "సంక్షిప్త నివేదిక" : activeLanguage === "ta" ? "விளக்க அறிக்கை" : activeLanguage === "kn" ? "ಸಾರಾಂಶ" : "brief"}
            </span>
            <h2 className="text-xl font-extrabold text-foreground mt-2 leading-tight font-sans">
              {activeLanguage === "hi" ? "हैदराबाद दैनिक पर्यावरण प्रदर्शन रिपोर्ट" :
               activeLanguage === "te" ? "హైదరాబాద్ రోజువారీ పర్యావరణ నివేదిక" :
               activeLanguage === "ta" ? "ஹைதராபாத் தினசரி சுற்றுச்சூழல் அறிக்கை" :
               activeLanguage === "kn" ? "ಹೈದರಾಬಾದ್ ದೈನಂದಿನ ಪರಿಸರ ವರದಿ" :
               report.title}
            </h2>
            <span className="text-[9.5px] text-muted font-sans mt-1 block font-bold">
              Compiled on {report.lastGenerated || "2026-06-29"} by PranaAI Decision Engine
            </span>
          </div>

          {/* Executive Summary */}
          <div className="flex flex-col gap-2">
            <span className="text-[9.5px] uppercase font-black text-primary font-sans tracking-widest">
              {activeLanguage === "hi" ? "1. कार्यकारी सारांश" :
               activeLanguage === "te" ? "1. ఎగ్జಿಕ్యూటివ్ సారాంశం" :
               activeLanguage === "ta" ? "1. நிர்வாக சுருக்கம்" :
               activeLanguage === "kn" ? "1. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ" :
               "1. Executive Brief Summary"}
            </span>
            <p className="text-[11.5px] text-foreground leading-relaxed font-sans font-semibold">
              {localizedBriefs[activeLanguage]?.currentSituation || "Particulate accumulation aggregates inside municipal centroids trace primarily to commuter traffic cycles, dust suspensions from active constructions, and calm wind vectors."}
            </p>
          </div>

          {/* Source Attribution Summary */}
          <div className="flex flex-col gap-3 font-sans">
            <span className="text-[9.5px] uppercase font-black text-primary tracking-widest">
              {translations.sourceAttributionsTitle || "2. AI Source Attribution Breakdown"}
            </span>
            <div className="flex flex-col gap-2.5 bg-background/50 border border-border/80 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between items-center font-bold">
                <span>
                  {activeLanguage === "hi" ? "आवागमन यातायात भीड़" :
                   activeLanguage === "te" ? "వాహనాల రద్దీ" :
                   activeLanguage === "ta" ? "போக்குவரத்து நெரிசல்" :
                   activeLanguage === "kn" ? "ವಾಹನ ಸಂಚಾರ ದಟ್ಟಣೆ" :
                   "Commuter Traffic Congestion"}
                </span>
                <span className="text-primary">38.4% share</span>
              </div>
              <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "38.4%" }} />
              </div>

              <div className="flex justify-between items-center font-bold mt-1">
                <span>
                  {activeLanguage === "hi" ? "भवन निर्माण विध्वंस" :
                   activeLanguage === "te" ? "భవనాల నిర్మాణ ధూళి" :
                   activeLanguage === "ta" ? "கட்டிட கட்டுமான தூசிகள்" :
                   activeLanguage === "kn" ? "ಕಟ್ಟಡ ಧೂಳು ಮಾಲಿನ್ಯ" :
                   "Construction Sites Demolition"}
                </span>
                <span className="text-primary">28.2% share</span>
              </div>
              <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "28.2%" }} />
              </div>

              <div className="flex justify-between items-center font-bold mt-1">
                <span>
                  {activeLanguage === "hi" ? "औद्योगिक स्रोत उत्सर्जन" :
                   activeLanguage === "te" ? "పరిశ్రమల కాలుష్యం" :
                   activeLanguage === "ta" ? "தொழிற்சாலை புகை உமிழ்வு" :
                   activeLanguage === "kn" ? "ಕೈಗಾರಿಕಾ ಮಾಲಿನ್ಯ ಹೊರಸೂಸುವಿಕೆ" :
                   "Industrial Source Emissions"}
                </span>
                <span className="text-primary">18.5% share</span>
              </div>
              <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "18.5%" }} />
              </div>
            </div>
          </div>

          {/* Policy Recommendations */}
          <div className="flex flex-col gap-3 font-sans">
            <span className="text-[9.5px] uppercase font-black text-primary tracking-widest">
              {activeLanguage === "hi" ? "3. नीति सिफारिशें और परिणाम" :
               activeLanguage === "te" ? "3. విధాన సిఫార్సులు & ఫలితాలు" :
               activeLanguage === "ta" ? "3. கொள்கை பரிந்துரைகள் & முடிவுகள்" :
               activeLanguage === "kn" ? "3. ನೀತಿ ಶಿಫಾರಸುಗಳು ಮತ್ತು ಫಲಿತಾಂಶಗಳು" :
               "3. Policy Recommendations & Outcomes"}
            </span>
            <div className="flex flex-col gap-2.5">
              {[
                { 
                  name: activeLanguage === "hi" ? "भारी डीजल यातायात डाइवर्जिन" :
                        activeLanguage === "te" ? "భారీ డీజిల్ వాహనాల మళ్లింపు" :
                        activeLanguage === "ta" ? "கனரக டீசல் வாகனங்கள் திசைதிருப்புதல்" :
                        activeLanguage === "kn" ? "ಹೆವಿ ಡೀಸೆಲ್ ವಾಹನಗಳ ಸಂಚಾರ ನಿಯಂತ್ರಣ" :
                        "Heavy Diesel Traffic Diversion", 
                  target: "-22 AQI Points", cost: "₹20,33,500", conf: "94%" 
                },
                { 
                  name: activeLanguage === "hi" ? "निर्माण स्थल धूल आवरण अधिदेश" :
                        activeLanguage === "te" ? "నిర్మాణ ధూళి నియంత్రణ కవర్ల ఏర్పాటు" :
                        activeLanguage === "ta" ? "கட்டுமான பகுதி தூசுகள் மூடும் உறை" :
                        activeLanguage === "kn" ? "ಕಟ್ಟಡ ಧೂಳು ತಡೆಯುವ ಪರದೆಗಳ ಅಳವಡಿಕೆ" :
                        "Construction Site Dust Cover Mandate", 
                  target: "-9 AQI Points", cost: "₹6,80,600", conf: "91%" 
                },
                { 
                  name: activeLanguage === "hi" ? "स्थानीय जल छिड़काव बेड़ा" :
                        activeLanguage === "te" ? "నీటిని చల్లే మొబైల్ వాహనాల రంగ ప్రవేశం" :
                        activeLanguage === "ta" ? "நீர் தெளிக்கும் வாகனங்கள் இயக்கம்" :
                        activeLanguage === "kn" ? "ಸ್ಥಳೀಯ ರಸ್ತೆ ನೀರು ಸಿಂಪಡಣೆ ಕಾರ್ಯ" :
                        "Localized Water Sprinkling Fleet", 
                  target: "-6 AQI Points", cost: "₹1,24,500", conf: "88%" 
                }
              ].map((rec, idx) => (
                <div key={idx} className="bg-background/40 border border-border/60 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-foreground block">{rec.name}</span>
                    <span className="text-[9px] text-muted block mt-0.5">
                      {activeLanguage === "hi" ? `बजट: ${rec.cost} | विश्वास: ${rec.conf}` :
                       activeLanguage === "te" ? `బడ్జెట్: ${rec.cost} | విశ్వాసం: ${rec.conf}` :
                       activeLanguage === "ta" ? `மதிப்பீடு: ${rec.cost} | நம்பிக்கை: ${rec.conf}` :
                       activeLanguage === "kn" ? `ಬಜೆಟ್: ${rec.cost} | ವಿಶ್ವಾಸಾರ್ಹತೆ: ${rec.conf}` :
                       `Budget: ${rec.cost} | Conf: ${rec.conf}`}
                    </span>
                  </div>
                  <span className="font-black text-success whitespace-nowrap">{rec.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Vulnerability advisories */}
          <div className="flex flex-col gap-3 font-sans">
            <span className="text-[9.5px] uppercase font-black text-primary tracking-widest">
              {activeLanguage === "hi" ? "4. नागरिक स्वास्थ्य जोखिम सलाह" :
               activeLanguage === "te" ? "4. పౌరుల ఆరోగ్య ముప్పు సలహాలు" :
               activeLanguage === "ta" ? "4. குடிமக்கள் சுகாதார ஆலோசனைகள்" :
               activeLanguage === "kn" ? "4. ನಾಗರಿಕರ ಆರೋಗ್ಯ ಸಲಹೆಗಳು" :
               "4. Citizen Health Risk Advisories"}
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div className="bg-danger/5 border border-danger/25 text-danger p-2.5 rounded-xl font-bold">
                <span>
                  {activeLanguage === "hi" ? "वरिष्ठ नागरिक और बच्चे" :
                   activeLanguage === "te" ? "వృద్ధులు & పిల్లలు" :
                   activeLanguage === "ta" ? "முதியவர்கள் & குழந்தைகள்" :
                   activeLanguage === "kn" ? "ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ಮಕ್ಕಳು" :
                   "Senior Citizens & Children"}
                </span>
                <p className="text-[9px] text-foreground mt-1 font-semibold leading-snug">
                  {activeLanguage === "hi" ? "दोपहर 1 बजे से शाम 5 बजे के बीच बाहरी गतिविधियों को सीमित करें।" :
                   activeLanguage === "te" ? "మధ్యాహ్నం 1 గంట నుండి సాయంత్రం 5 గంటల మధ్య బహిరంగ తిరుగుళ్లను తగ్గించండి." :
                   activeLanguage === "ta" ? "மதியம் 1 மணி முதல் மாலை 5 மணி வரை வெளியே செல்வதை தவிர்க்கவும்." :
                   activeLanguage === "kn" ? "ಮಧ್ಯಾಹ್ನ 1 ರಿಂದ ಸಂಜೆ 5 ರ ನಡುವೆ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ." :
                   "Limit strenuous outdoor exposure between 1 PM and 5 PM."}
                </p>
              </div>
              <div className="bg-warning/5 border border-warning/25 text-warning p-2.5 rounded-xl font-bold">
                <span>
                  {activeLanguage === "hi" ? "दमा और हृदय रोगी" :
                   activeLanguage === "te" ? "ఉబ్బసం & గుండె జబ్బుల రోగులు" :
                   activeLanguage === "ta" ? "ஆஸ்துமா & இதய நோயாளிகள்" :
                   activeLanguage === "kn" ? "ಅಸ್ತಮಾ ಮತ್ತು ಹೃದಯ ರೋಗಿಗಳು" :
                   "Asthma & Cardio Patients"}
                </span>
                <p className="text-[9px] text-foreground mt-1 font-semibold leading-snug">
                  {activeLanguage === "hi" ? "बचाव इनहेलर पास रखें; घर के अंदर रहें।" :
                   activeLanguage === "te" ? "ఇన్హేలర్లను అందుబాటులో ఉంచుకోండి; ఇళ్లలోనే ఉండండి." :
                   activeLanguage === "ta" ? "இன்ஹேலர்களை கைவசம் வைத்திருக்கவும்; வீட்டிலேயே இருக்கவும்." :
                   activeLanguage === "kn" ? "ಇನ್ಹೇಲರ್‌ಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ; ಮನೆಯಲ್ಲೇ ಇರಿ." :
                   "Keep rescue inhalers accessible; prefer indoor spaces."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="border-t border-border pt-4 mt-6 flex justify-end">
          <button
            onClick={() => alert("Report compiled to PDF successfully.")}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>
              {translations.pdfExportLabel || "Generate PDF Export"}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
}
