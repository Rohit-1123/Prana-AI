import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles,
  Heart
} from "lucide-react";
import { cn } from "../../utils/cn";
import { AIConfidenceRing } from "./ExplainabilityComponents";

import { type LanguageCode } from "../../utils/i18n";
import { useSettings } from "../../contexts/SettingsContext";

const urbanTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {
    priority: "Priority",
    risk: "Risk",
    forecastTrend: "Forecast Trend",
    aiRecommendation: "AI Recommendation",
    advisoryConfirmed: "Advisory Confirmed",
    aiConf: "AI Conf",
    ehiTitle: "Environmental Health Index (EHI)",
    ehiSubtitle: "Weighted exposed safety index scale (cumulative factors)",
    ehiScore: "EHI Score",
    volatileRisk: "Volatile Risk",
    stableConditions: "Stable Conditions",
    yesterday: "Yesterday",
    greenCoverIndex: "IT Corridor Green Cover Index",
    humidityThreshold: "Ambient Humidity Threshold",
    exposureIndex: "Population Exposure Index",
    reliability: "Reliability",
    rising: "Rising",
    improving: "Improving",
    aqiIndex: "AQI Index",
    forecast24h: "Forecast 24h",
    environmentalScorecard: "Environmental Scorecard",
    citywidePerformance: "City-wide key operational performance statistics",
    globalScore: "Global Score",
    status: "Status",
    budgetCost: "Budget Cost",
    targetTime: "Target Time",
    successRatio: "Success Ratio",
    expectedVsMeasured: "Expected vs Measured Impact",
    target: "Target",
    currentSituation: "Current Situation",
    keyForecastRisks: "Key Forecast Risks",
    causalAdvisory: "Causal Advisory & Forecast",
    expectedAqiImprovement: "Expected AQI Improvement",
    todaysBrief: "Today's AI Daily Briefing",
    dailyOverview: "City-wide daily environmental overview",
    advisoryActive: "Advisory Active",
    citizenHealthRisks: "Citizen Health Risks",
    vulnerabilitySub: "Vulnerability mapping across exposed demographic groups",
    policyImpactTitle: "Policy Impact & Analytics Dashboard",
    policyImpactSub: "Expected target reductions versus actual measured environmental benefits"
  },
  hi: {
    priority: "प्राथमिकता",
    risk: "जोखिम",
    forecastTrend: "पूर्वानुमान प्रवृत्ति",
    aiRecommendation: "एआई सिफारिश",
    advisoryConfirmed: "सलाह की पुष्टि की गई",
    aiConf: "एआई विश्वास",
    ehiTitle: "पर्यावरण स्वास्थ्य सूचकांक (EHI)",
    ehiSubtitle: "भारित सुरक्षा सूचकांक पैमाना (संचयी कारक)",
    ehiScore: "ईएचआई स्कोर",
    volatileRisk: "अस्थिर जोखिम",
    stableConditions: "स्थिर स्थिति",
    yesterday: "कल",
    greenCoverIndex: "हरित क्षेत्र सूचकांक",
    humidityThreshold: "परिवेशी आर्द्रता सीमा",
    exposureIndex: "जनसंख्या जोखिम सूचकांक",
    reliability: "विश्वसनीयता",
    rising: "बढ़ रहा है",
    improving: "सुधर रहा है",
    aqiIndex: "एक्यूआई सूचकांक",
    forecast24h: "पूर्वानुमान २४ घंटे",
    environmentalScorecard: "पर्यावरण स्कोरकार्ड",
    citywidePerformance: "शहर-व्यापी प्रमुख परिचालन प्रदर्शन आँकड़े",
    globalScore: "वैश्विक स्कोर",
    status: "स्थिति",
    budgetCost: "बजट लागत",
    targetTime: "लक्षित समय",
    successRatio: "सफलता अनुपात",
    expectedVsMeasured: "अपेक्षित बनाम मापा गया प्रभाव",
    target: "लक्ष्य",
    currentSituation: "वर्तमान स्थिति",
    keyForecastRisks: "प्रमुख पूर्वानुमान जोखिम",
    causalAdvisory: "कारण संबंधी सलाह और पूर्वानुमान",
    expectedAqiImprovement: "अपेक्षित एक्यूआई सुधार",
    todaysBrief: "आज की एआई दैनिक ब्रीफिंग",
    dailyOverview: "शहर-व्यापी दैनिक पर्यावरणीय अवलोकन",
    advisoryActive: "सलाह सक्रिय",
    citizenHealthRisks: "नागरिक स्वास्थ्य जोखिम",
    vulnerabilitySub: "उजागर जनसांख्यिकीय समूहों में भेद्यता मानचित्रण",
    policyImpactTitle: "नीति प्रभाव और विश्लेषण डैशबोर्ड",
    policyImpactSub: "अपेक्षित लक्षित कमी बनाम वास्तविक मापा गया पर्यावरणीय लाभ"
  },
  te: {
    priority: "ప్రాధాన్యత",
    risk: "ముప్పు",
    forecastTrend: "అంచనా ధోరణి",
    aiRecommendation: "AI సిఫార్సు",
    advisoryConfirmed: "సలహా నిర్ధారించబడింది",
    aiConf: "AI విశ్వసనీయత",
    ehiTitle: "పర్యావరణ ఆరోగ్య సూచిక (EHI)",
    ehiSubtitle: "పర్యావరణ భద్రత కొలమానం (సంచిత కారకాలు)",
    ehiScore: "EHI స్కోరు",
    volatileRisk: "అస్థిర ముప్పు",
    stableConditions: "స్థిరమైన పరిస్థితులు",
    yesterday: "निన్న",
    greenCoverIndex: "హరిత విస్తీర్ణ సూచిక",
    humidityThreshold: "తేమ స్థాయి పరిమితి",
    exposureIndex: "జనసాంద్రత ముప్పు సూచిక",
    reliability: "విశ్వసనీయత",
    rising: "పెరుగుతోంది",
    improving: "మెరుగవుతోంది",
    aqiIndex: "AQI సూచిక",
    forecast24h: "24 గంటల అంచనా",
    environmentalScorecard: "పర్యావరణ స్కోర్‌కార్డ్",
    citywidePerformance: "ನಗರ ವ್ಯಾಪ್ತಿಯ ಪ್ರಮುಖ ಕಾರ್ಯಾಚರಣೆಯ ಪ್ರದರ್ಶನ ಅಂಕಿಅಂಶಗಳು",
    globalScore: "మొತ್ತం స్కోరు",
    status: "స్థితి",
    budgetCost: "బడ్జెట్ ఖర్చు",
    targetTime: "లక్ష్య సమయం",
    successRatio: "విజయవంతమైన నిష్పత్తి",
    expectedVsMeasured: "ఆశించిన వర్సెస్ వాస్తవ ప్రభావం",
    target: "లక్ష్యం",
    currentSituation: "ప్రస్తుత పరిస్థితి",
    keyForecastRisks: "కీలక అంచనా ముప్పులు",
    causalAdvisory: "సలహాలు & అంచనాలు",
    expectedAqiImprovement: "ఆశించిన AQI మార్పు",
    todaysBrief: "నేటి AI దినసరి బ్రీఫ్",
    dailyOverview: "నగర పర్యావరణ వివరణ",
    advisoryActive: "హెచ్చరిక యాక్టివ్",
    citizenHealthRisks: "పౌరుల ఆరోగ్య ముప్పులు",
    vulnerabilitySub: "వివిధ జನಾభా వర్గాలపై కాలుష్య ప్రభావ విశ్లేషణ",
    policyImpactTitle: "విధానాల ప్రభావ విశ్లేషణ డాష్‌బోర్డ్",
    policyImpactSub: "ఆశించిన కాలుష్య తగ్గింపు వర్సెస్ వాస్తవ పర్యావరణ ప్రయోజనాలు"
  },
  ta: {
    priority: "முன்னுரிமை",
    risk: "ஆபத்து",
    forecastTrend: "கணிப்பு போக்கு",
    aiRecommendation: "AI பரிந்துரை",
    advisoryConfirmed: "ஆலோசனை உறுதி செய்யப்பட்டது",
    aiConf: "AI நம்பிக்கை",
    ehiTitle: "சுற்றுச்சூழல் சுகாதார குறியீடு (EHI)",
    ehiSubtitle: "சுற்றுச்சூழல் பாதுகாப்பு குறியீடு (ஒட்டுமொத்த காரணிகள்)",
    ehiScore: "EHI மதிப்பெண்",
    volatileRisk: "மாறக்கூடிய ஆபத்து",
    stableConditions: "நிலையான நிலைகள்",
    yesterday: "நேற்று",
    greenCoverIndex: "பசுமை பரப்பு குறியீடு",
    humidityThreshold: "ஈரப்பதம் வரம்பு",
    exposureIndex: "மக்கள் தொகை பாதிப்பு குறியீடு",
    reliability: "நம்பகத்தன்மை",
    rising: "அதிகரிக்கிறது",
    improving: "மேம்படுகிறது",
    aqiIndex: "AQI குறியீடு",
    forecast24h: "24 மணி நேர கணிப்பு",
    environmentalScorecard: "சுற்றுச்சூழல் மதிப்பெண் அட்டை",
    citywidePerformance: "நகரம் தழுவிய முக்கிய செயல்பாட்டு புள்ளிவிவரங்கள்",
    globalScore: "ஒட்டுமொத்த மதிப்பெண்",
    status: "நிலை",
    budgetCost: "பட்ஜெட் செலவு",
    targetTime: "இலக்கு நேரம்",
    successRatio: "வெற்றி விகிதம்",
    expectedVsMeasured: "எதிர்பார்க்கப்பட்ட vs அளவிடப்பட்ட தாக்கம்",
    target: "இலக்கு",
    currentSituation: "தற்போதைய நிலை",
    keyForecastRisks: "முக்கிய கணிப்பு ஆபத்துகள்",
    causalAdvisory: "ஆலோசனைகள் & கணிப்பு",
    expectedAqiImprovement: "எதிர்பார்க்கப்படும் AQI மேம்பாடு",
    todaysBrief: "இன்றைய AI தினசரி சுருக்கம்",
    dailyOverview: "நகரம் தழுவிய தினசரி சுற்றுச்சூழல் சுருக்கம்",
    advisoryActive: "எச்சரிக்கை செயல்பாட்டில் உள்ளது",
    citizenHealthRisks: "பொதுமக்கள் சுகாதார ஆபத்துகள்",
    vulnerabilitySub: "பாதிப்புக்குள்ளாகும் மக்கள் குழுக்களின் வரைபடம்",
    policyImpactTitle: "கொள்கை தாக்கம் & பகுப்பாய்வு டாஷ்போர்டு",
    policyImpactSub: "எதிர்பார்க்கப்படும் குறைப்பு மற்றும் உண்மையான சுற்றுச்சூழல் நன்மைகள் ஒப்பீடு"
  },
  kn: {
    priority: "ಆದ್ಯತೆ",
    risk: "ಅಪಾಯ",
    forecastTrend: "ಮುನ್ಸೂಚನೆ ಪ್ರವೃತ್ತಿ",
    aiRecommendation: "AI ಶಿಫಾರಸು",
    advisoryConfirmed: "ಸಲಹೆ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    aiConf: "AI ವಿಶ್ವಾಸ",
    ehiTitle: "ಪರಿಸರ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ (EHI)",
    ehiSubtitle: "ಪರಿಸರ ಸುರಕ್ಷತಾ ಸೂಚ್ಯಂಕ (ಒಟ್ಟಾರೆ ಅಂಶಗಳು)",
    ehiScore: "EHI ಸ್ಕೋರ್",
    volatileRisk: "ಅಸ್ಥಿರ ಅಪಾಯ",
    stableConditions: "ಸ್ಥಿರ ಪರಿಸ್ಥಿತಿಗಳು",
    yesterday: "ನಿನ್ನೆ",
    greenCoverIndex: "ಹಸಿರು ಹೊದಿಕೆ ಸೂಚ್ಯಂಕ",
    humidityThreshold: "ಆರ್ದ್ರತೆ ಮಿತಿ",
    exposureIndex: "ಜನಸಂಖ್ಯಾ ಅಪಾಯ ಸೂಚ್ಯಂಕ",
    reliability: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    rising: "ಹೆಚ್ಚುತ್ತಿದೆ",
    improving: "ಸುಧಾರಿಸುತ್ತಿದೆ",
    aqiIndex: "AQI ಸೂಚ್ಯಂಕ",
    forecast24h: "24 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ",
    environmentalScorecard: "ಪರಿಸರ ಸ್ಕೋರ್‌ಕಾರ್ಡ್",
    citywidePerformance: "ನಾಗರಿಕರ ಆರೋಗ್ಯದ ಅಪಾಯಗಳು",
    globalScore: "ಒಟ್ಟಾರೆ ಸ್ಕೋರ್",
    status: "ಸ್ಥಿತಿ",
    budgetCost: "ಬಜೆಟ್ ವೆಚ್ಚ",
    targetTime: "ಗುರಿ ಸಮಯ",
    successRatio: "ಯಶಸ್ಸಿನ ಅನುಪಾತ",
    expectedVsMeasured: "ನಿರೀಕ್ಷಿತ ಮತ್ತು ಅಳೆದ ಪ್ರಭಾವ",
    target: "ಗುರಿ",
    currentSituation: "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ",
    keyForecastRisks: "ಮುಖ್ಯ ಮುನ್ಸೂಚನೆ ಅಪಾಯಗಳು",
    causalAdvisory: "ಕಾರಣಾತ್ಮಕ ಸಲಹೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
    expectedAqiImprovement: "ನಿರೀಕ್ಷಿತ AQI ಸುಧಾರಣೆ",
    todaysBrief: "ಇಂದಿನ AI ದೈನಂದಿನ ಬ್ರೀಫಿಂಗ್",
    dailyOverview: "ನಗರದ ದೈನಂದಿನ ಪರಿಸರ ಅವಲೋಕನ",
    advisoryActive: "ಸಲಹೆ ಸಕ್ರಿಯವಾಗಿದೆ",
    citizenHealthRisks: "ನಾಗರಿಕರ ಆರೋಗ್ಯದ ಅಪಾಯಗಳು",
    vulnerabilitySub: "ಜನಸಂಖ್ಯಾ ಗುಂಪುಗಳ ಅಪಾಯದ ಮ್ಯಾಪಿಂಗ್",
    policyImpactTitle: "ನೀತಿ ಪ್ರಭಾವ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    policyImpactSub: "ನಿರೀಕ್ಷಿತ ಮಾಲಿನ್ಯ ಕಡಿತ ಮತ್ತು ನೈಜ ಪರಿಸರ ಪ್ರಯೋಜನಗಳ ಹೋಲಿಕೆ"
  }
};

function translateTargetGroup(tg: string, lang: string) {
  if (lang === "hi") {
    if (tg.includes("Senior")) return "वरिष्ठ नागरिक";
    if (tg.includes("Asthma")) return "अस्थमा रोगी";
    if (tg.includes("Outdoor")) return "बाहर काम करने वाले";
    if (tg.includes("Children")) return "बच्चे और स्कूल";
  }
  if (lang === "te") {
    if (tg.includes("Senior")) return "వృద్ధులు";
    if (tg.includes("Asthma")) return "ఆస్తమా రోగులు";
    if (tg.includes("Outdoor")) return "బయట పనిచేసే కార్మికులు";
    if (tg.includes("Children")) return "పిల్లలు & పాఠశాలలు";
  }
  if (lang === "ta") {
    if (tg.includes("Senior")) return "முதியவர்கள்";
    if (tg.includes("Asthma")) return "ஆஸ்துமா நோயாளிகள்";
    if (tg.includes("Outdoor")) return "வெளியில் வேலை செய்பவர்கள்";
    if (tg.includes("Children")) return "குழந்தைகள் & பள்ளிகள்";
  }
  if (lang === "kn") {
    if (tg.includes("Senior")) return "ಹಿರಿಯ ನಾಗರಿಕರು";
    if (tg.includes("Asthma")) return "ಅಸ್ತಮಾ ರೋಗಿಗಳು";
    if (tg.includes("Outdoor")) return "ಹೊರಾಂಗಣ ಕಾರ್ಮಿಕರು";
    if (tg.includes("Children")) return "ಮಕ್ಕಳು ಮತ್ತು ಶಾಲೆಗಳು";
  }
  return tg;
}

function translateForecastRisk(fr: string, lang: string) {
  if (lang === "hi") {
    if (fr.includes("Rising loading")) return "यातायात क्षेत्रों के पास बढ़ने की उम्मीद है।";
    if (fr.includes("Particulate density")) return "कण घनत्व सुरक्षित एयरोसोल स्तर से अधिक है।";
    if (fr.includes("Soot accumulations")) return "दहन स्रोतों के उत्सर्जन से कालिख का संचय।";
    if (fr.includes("Fine particulates")) return "शांत हवाओं के तहत सूक्ष्म कण हवा में निलंबित रहते हैं।";
  }
  if (lang === "te") {
    if (fr.includes("Rising loading")) return "ట్రాఫిక్ ప్రాంతాల సమీపంలో కాలుష్యం పెరిగే అవకాశం ఉంది.";
    if (fr.includes("Particulate density")) return "కాలుష్య సాంద్రత సురక్షిత పరిమితులను మించిపోయింది.";
    if (fr.includes("Soot accumulations")) return "వాహనాల పొగ నుండి వెలువడే కాలుష్య కణాలు జమయ్యే అవకాశం ఉంది.";
    if (fr.includes("Fine particulates")) return "గాలి వేగం తగ్గడం వల్ల సూక్ష్మ కణాలు గాలిలోనే నిలిచిపోతాయి.";
  }
  if (lang === "ta") {
    if (fr.includes("Rising loading")) return "போக்குவரத்து பகுதிகளுக்கு அருகில் மாசு அளவு அதிகரிக்கலாம்.";
    if (fr.includes("Particulate density")) return "மாசு அடர்த்தி பாதுகாப்பான அளவை விட அதிகமாக உள்ளது.";
    if (fr.includes("Soot accumulations")) return "எரிப்பு ஆதாரங்களில் இருந்து வெளிவரும் கரி புகைக் குவிப்பு.";
    if (fr.includes("Fine particulates")) return "அமைதியான காற்று காரணமாக நுண் துகள்கள் காற்றில் மிதக்கின்றன.";
  }
  if (lang === "kn") {
    if (fr.includes("Rising loading")) return "ಸಂಚಾರ ವಲಯಗಳ ಬಳಿ ಮಾಲಿನ್ಯ ಹೆಚ್ಚಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ.";
    if (fr.includes("Particulate density")) return "ಧೂಳಿನ ಕಣಗಳ ಸಾಂದ್ರತೆಯು ಸುರಕ್ಷಿತ ಮಟ್ಟವನ್ನು ಮೀರಿದೆ.";
    if (fr.includes("Soot accumulations")) return "ದಹನ ಮೂಲಗಳಿಂದ ಮಸಿ ಕಣಗಳ ಶೇಖರಣೆ.";
    if (fr.includes("Fine particulates")) return "ಶಾಂತ ಗಾಳಿಯ ವಾತಾವರಣದಲ್ಲಿ ಸೂಕ್ಷ್ಮ ಕಣಗಳು ಗಾಳಿಯಲ್ಲಿ ತೇಲುತ್ತವೆ.";
  }
  return fr;
}

function translateRecommendation(rec: string, lang: string) {
  if (lang === "hi") {
    if (rec.includes("Limit outdoor")) return "दोपहर 1 बजे से शाम 5 बजे के बीच बाहर जाने से बचें।";
    if (rec.includes("Keep rescue")) return "इनहेलर साथ रखें; घर के अंदर रहने को प्राथमिकता दें।";
    if (rec.includes("Wear certified")) return "सफर के दौरान प्रमाणित N95 मास्क पहनें।";
    if (rec.includes("Divert outdoor")) return "खेल गतिविधियों को इनडोर कोर्ट में स्थानांतरित करें।";
  }
  if (lang === "te") {
    if (rec.includes("Limit outdoor")) return "మధ్యాహ్నం 1 నుండి సాయంత్రం 5 గంటల మధ్య బయట తిరగడం తగ్గించండి.";
    if (rec.includes("Keep rescue")) return "ఇన్హేలర్లను అందుబాటులో ఉంచుకోండి; ఇండోర్ మార్గాలను ఎంచుకోండి.";
    if (rec.includes("Wear certified")) return "రద్దీ సమయాల్లో పనిచేసేటప్పుడు N95 మాస్క్ ధరించండి.";
    if (rec.includes("Divert outdoor")) return "ಬహిరంగ క్రీడలను ఇండోర్ కోర్టులకు మళ్లించండి.";
  }
  if (lang === "ta") {
    if (rec.includes("Limit outdoor")) return "மதியம் 1 மணி முதல் மாலை 5 மணி வரை வெளியே செல்வதைத் தவிர்க்கவும்.";
    if (rec.includes("Keep rescue")) return "இன்ஹேலரை கைவசம் வைக்கவும்; வீட்டுக்குள்ளேயே இருக்க முன்னுரிமை தரவும்.";
    if (rec.includes("Wear certified")) return "நெரிசல் நேரங்களில் சான்றளிக்கப்பட்ட N95 முகக்கவசம் அணியவும்.";
    if (rec.includes("Divert outdoor")) return "விளையாட்டு செயல்பாடுகளை இண்டோர் மைதானங்களுக்கு மாற்றவும்.";
  }
  if (lang === "kn") {
    if (rec.includes("Limit outdoor")) return "ಮಧ್ಯಾಹ್ನ 1 ರಿಂದ ಸಂಜೆ 5 ರ ನಡುವೆ ಹೊರಹೋಗುವುದನ್ನು ಮಿತಿಗೊಳಿಸಿ.";
    if (rec.includes("Keep rescue")) return "ಇನ್ಹೇಲರ್‌ಗಳನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ; ಒಳಾಂಗಣದಲ್ಲೇ ಇರಲು ಆದ್ಯತೆ ನೀಡಿ.";
    if (rec.includes("Wear certified")) return "ಹೆಚ್ಚಿನ ಸಂಚಾರದ ಸಮಯದಲ್ಲಿ N95 ಮಾಸ್ಕ್ ಧರಿಸಿ.";
    if (rec.includes("Divert outdoor")) return "ಹೊರಾಂಗಣ ಕ್ರೀಡಾ ಚಟುವಟಿಕೆಗಳನ್ನು ಒಳಾಂಗಣ ಮೈದಾನಕ್ಕೆ ಬದಲಿಸಿ.";
  }
  return rec;
}

function translateScorecardItem(label: string, desc: string, status: string, lang: string) {
  if (lang === "hi") {
    let transLabel = label;
    if (label.includes("Forecast Accuracy")) transLabel = "पूर्वानुमान सटीकता";
    if (label.includes("Risk Mitigation")) transLabel = "स्वास्थ्य जोखिम शमन";
    if (label.includes("Improvement Index")) transLabel = "नीति सुधार सूचकांक";
    if (label.includes("Availability Rate")) transLabel = "सेंसर उपलब्धता दर";
    if (label.includes("Compliance Ratio")) transLabel = "नागरिक अनुपालन अनुपात";

    let transDesc = desc;
    if (desc.includes("Mean relative")) transDesc = "कच्चे सेंसर बनाम औसत सापेक्ष भिन्नता";
    if (desc.includes("Directives adoption")) transDesc = "जोखिम समूहों में निर्देशों को अपनाना";
    if (desc.includes("Measured AQI")) transDesc = "मापा गया एक्यूआई कमी दक्षता";
    if (desc.includes("Online active")) transDesc = "ऑनलाइन सक्रिय नगरपालिका नोड टेलीमेट्री";
    if (desc.includes("Heavy transport")) transDesc = "भारी परिवहन डायवर्जन यातायात दर";

    let transStatus = status;
    if (status === "Optimal") transStatus = "इष्टतम";
    if (status === "Nominal") transStatus = "नाममात्र";
    if (status === "Satisfactory") transStatus = "संतोषजनक";
    if (status === "Stable") transStatus = "स्थिर";
    if (status === "Action Needed") transStatus = "कार्रवाई आवश्यक";

    return { label: transLabel, desc: transDesc, status: transStatus };
  }
  if (lang === "te") {
    let transLabel = label;
    if (label.includes("Forecast Accuracy")) transLabel = "అంచనా ఖచ్చితత్వం";
    if (label.includes("Risk Mitigation")) transLabel = "ఆరోగ్య ముప్పు నివారణ";
    if (label.includes("Improvement Index")) transLabel = "పాలసీ ఇంప్రూవ్‌మెంట్ సూచీ";
    if (label.includes("Availability Rate")) transLabel = "సెన్సార్ లభ్యత శాతం";
    if (label.includes("Compliance Ratio")) transLabel = "పౌరుల నిబంధనల అమలు";

    let transDesc = desc;
    if (desc.includes("Mean relative")) transDesc = "సెన్సార్లతో పోలిస్తే సగటు వ్యత్యాసం";
    if (desc.includes("Directives adoption")) transDesc = "విभिन्न వర్గాల ఆదేశాల అమలు తీరు";
    if (desc.includes("Measured AQI")) transDesc = "అంచనా వేసిన కాలుష్య తగ్గింపు సమర్థత";
    if (desc.includes("Online active")) transDesc = "మున్సిపల్ నోడ్స్ ఆన్‌లైన్ టెలిమెట్రీ";
    if (desc.includes("Heavy transport")) transDesc = "భారీ వాహనాల మళ్లింపు నిష్పత్తి";

    let transStatus = status;
    if (status === "Optimal") transStatus = "చాలా బాగుంది";
    if (status === "Nominal") transStatus = "సాధారణం";
    if (status === "Satisfactory") transStatus = "సంతృప్తికరం";
    if (status === "Stable") transStatus = "స్థಿರంగా ఉంది";
    if (status === "Action Needed") transStatus = "చర్య అవసరం";

    return { label: transLabel, desc: transDesc, status: transStatus };
  }
  if (lang === "ta") {
    let transLabel = label;
    if (label.includes("Forecast Accuracy")) transLabel = "கணிப்பு துல்லியம்";
    if (label.includes("Risk Mitigation")) transLabel = "சுகாதார ஆபத்து குறைப்பு";
    if (label.includes("Improvement Index")) transLabel = "கொள்கை மேம்பாட்டு குறியீடு";
    if (label.includes("Availability Rate")) transLabel = "சென்சார் கிடைக்கும் விகிதம்";
    if (label.includes("Compliance Ratio")) transLabel = "பொதுமக்கள் இணக்க விகிதம்";

    let transDesc = desc;
    if (desc.includes("Mean relative")) transDesc = "சென்சார்களுக்கு எதிரான சராசரி மாறுபாடு";
    if (desc.includes("Directives adoption")) transDesc = "பாதிப்பு குழுக்களுக்கான வழிகாட்டுதல்கள்";
    if (desc.includes("Measured AQI")) transDesc = "அளவிடப்பட்ட AQI குறைப்பு திறன்";
    if (desc.includes("Online active")) transDesc = "மாநகராட்சி முனைகளின் நேரடி டெலிமெட்ரி";
    if (desc.includes("Heavy transport")) transDesc = "கனரக வாகன மாற்று போக்குவரத்து விகிதம்";

    let transStatus = status;
    if (status === "Optimal") transStatus = "சிறப்பானது";
    if (status === "Nominal") transStatus = "பெயரளவிலான";
    if (status === "Satisfactory") transStatus = "திருப்திகரமானது";
    if (status === "Stable") transStatus = "நிலையானது";
    if (status === "Action Needed") transStatus = "நடவடிக்கை தேவை";

    return { label: transLabel, desc: transDesc, status: transStatus };
  }
  if (lang === "kn") {
    let transLabel = label;
    if (label.includes("Forecast Accuracy")) transLabel = "ಮುನ್ಸೂಚನೆ ನಿಖರತೆ";
    if (label.includes("Risk Mitigation")) transLabel = "ಆರೋಗ್ಯ ಅಪಾಯ ನಿವಾರಣೆ";
    if (label.includes("Improvement Index")) transLabel = "ನೀತಿ ಸುಧಾರಣಾ ಸೂಚ್ಯಂಕ";
    if (label.includes("Availability Rate")) transLabel = "ಸೆನ್ಸರ್ ಲಭ್ಯತೆ ದರ";
    if (label.includes("Compliance Ratio")) transLabel = "ನಾಗರಿಕರ ಅನುಸರಣೆ ಅನುಪಾತ";

    let transDesc = desc;
    if (desc.includes("Mean relative")) transDesc = "ನೈಜ ಸೆನ್ಸಾರ್‌ಗಳ ವಿರುದ್ಧ ಸರಾಸರಿ ವ್ಯತ್ಯಾಸ";
    if (desc.includes("Directives adoption")) transDesc = "ಅಪಾಯದ ಗುಂಪುಗಳಲ್ಲಿ ಸೂಚನೆಗಳ ಅಳವಡಿಕೆ";
    if (desc.includes("Measured AQI")) transDesc = "ಅಳೆದ AQI ಕಡಿತದ ದಕ್ಷತೆ";
    if (desc.includes("Online active")) transDesc = "ಆನ್‌ಲೈನ್ ಸಕ್ರಿಯ ನಗರಸಭೆ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ";
    if (desc.includes("Heavy transport")) transDesc = "ಭಾರಿ ಸಾರಿಗೆ ಮರುಮಾರ್ಗದ ದಟ್ಟಣೆ ದರ";

    let transStatus = status;
    if (status === "Optimal") transStatus = "ಅತ್ಯುತ್ತಮ";
    if (status === "Nominal") transStatus = "ಸಾಮಾನ್ಯ";
    if (status === "Satisfactory") transStatus = "ತೃಪ್ತಿದಾಯಕ";
    if (status === "Stable") transStatus = "ಸ್ಥಿರವಾಗಿದೆ";
    if (status === "Action Needed") transStatus = "ಕ್ರಮ ಅಗತ್ಯ";

    return { label: transLabel, desc: transDesc, status: transStatus };
  }
  return { label, desc, status };
}

function translatePolicyName(name: string, lang: string): string {
  if (lang === "hi") {
    if (name.includes("Traffic")) return "भारी डीजल यातायात प्रतिबंध";
    if (name.includes("Demolition")) return "रियल एस्टेट विध्वंस नियंत्रण";
    if (name.includes("Sprinkling")) return "स्थानीय धूल छिड़काव बेड़ा संचालन";
  }
  if (lang === "te") {
    if (name.includes("Traffic")) return "భారీ డీజిల్ వాహనాల నియంత్రణ";
    if (name.includes("Demolition")) return "నిర్మాణ పనుల నిలిపివేత";
    if (name.includes("Sprinkling")) return "నీటి పిచికారీ వాహనాల మోహరింపు";
  }
  if (lang === "ta") {
    if (name.includes("Traffic")) return "கனரக டீசல் போக்குவரத்து கட்டுப்பாடு";
    if (name.includes("Demolition")) return "ரியல் எஸ்டேட் இடிப்பு தணிப்பு";
    if (name.includes("Sprinkling")) return "உள்ளூர் தூசி தெளிப்பு வாகன இயக்கம்";
  }
  if (lang === "kn") {
    if (name.includes("Traffic")) return "ಭಾರೀ ಡೀಸೆಲ್ ಸಂಚಾರ ನಿರ್ಬಂಧ";
    if (name.includes("Demolition")) return "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಚಟುವಟಿಕೆ ನಿಯಂತ್ರಣ";
    if (name.includes("Sprinkling")) return "ಸ್ಥಳೀಯ ಧೂಳು ನಿಯಂತ್ರಣ ನೀರು ಸಿಂಪಡಣೆ";
  }
  return name;
}

function translatePolicyStatus(status: string, lang: string): string {
  if (lang === "hi") {
    if (status.includes("Enforced")) return "लागू किया गया";
    if (status.includes("Inspector")) return "सक्रिय निरीक्षक चेतावनी";
    if (status.includes("Deploying")) return "वाहनों की तैनाती";
  }
  if (lang === "te") {
    if (status.includes("Enforced")) return "అమలు చేయబడింది";
    if (status.includes("Inspector")) return "ఇన్స్పెక్టర్ అలర్ట్ యాక్టివ్";
    if (status.includes("Deploying")) return "వాహనాల మోహరింపు";
  }
  if (lang === "ta") {
    if (status.includes("Enforced")) return "அமுல்படுத்தப்பட்டது";
    if (status.includes("Inspector")) return "ஆய்வாளர் எச்சரிக்கை செயலில் உள்ளது";
    if (status.includes("Deploying")) return "வாகனங்கள் அனுப்பப்படுகின்றன";
  }
  if (lang === "kn") {
    if (status.includes("Enforced")) return "ಜಾರಿಗೊಳಿಸಲಾಗಿದೆ";
    if (status.includes("Inspector")) return "ಪರಿಶೀಲಕರ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ";
    if (status.includes("Deploying")) return "ವಾಹನಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗುತ್ತಿದೆ";
  }
  return status;
}

// ==========================================
// 1. HEALTH RISK CARD
// ==========================================
interface HealthRiskCardProps {
  targetGroup: string;
  currentRisk: "Low" | "Moderate" | "High" | "Critical";
  forecastRisk: string;
  recommendation: string;
  confidence: number;
  priority: string;
  icon: React.ReactNode;
}

export function HealthRiskCard({
  targetGroup,
  currentRisk,
  forecastRisk,
  recommendation,
  confidence,
  priority,
  icon
}: HealthRiskCardProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const translations = urbanTranslations[activeLanguage] || urbanTranslations["en"];

  const getLocalizedRisk = (risk: string) => {
    if (activeLanguage === "hi") {
      if (risk === "Critical") return "गंभीर";
      if (risk === "High") return "उच्च";
      if (risk === "Moderate") return "मध्यम";
      if (risk === "Low") return "निम्न";
    }
    if (activeLanguage === "te") {
      if (risk === "Critical") return "తీవ్రమైన";
      if (risk === "High") return "ఎక్కువ";
      if (risk === "Moderate") return "సాధారణ";
      if (risk === "Low") return "తక్కువ";
    }
    if (activeLanguage === "ta") {
      if (risk === "Critical") return "தீவிரமான";
      if (risk === "High") return "அதிக";
      if (risk === "Moderate") return "மிதமான";
      if (risk === "Low") return "குறைந்த";
    }
    if (activeLanguage === "kn") {
      if (risk === "Critical") return "ತೀವ್ರ";
      if (risk === "High") return "ಹೆಚ್ಚಿನ";
      if (risk === "Moderate") return "ಸಾಧಾರಣ";
      if (risk === "Low") return "ಕಡಿಮೆ";
    }
    return risk;
  };

  const colorClasses = currentRisk === "Critical"
    ? "border-danger/25 bg-danger/5 text-danger"
    : currentRisk === "High"
      ? "border-warning/25 bg-warning/5 text-warning"
      : currentRisk === "Moderate"
        ? "border-secondary/25 bg-secondary/5 text-secondary"
        : "border-success/25 bg-success/5 text-success";

  return (
    <div className={cn("border p-3 sm:p-4 rounded-xl flex flex-col justify-between text-left h-full transition-all hover:scale-[1.01] hover:bg-card/30 duration-300", colorClasses)}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-current shrink-0">
            {icon}
          </div>
          <div>
            <h5 className="font-bold text-foreground text-xs leading-none">{translateTargetGroup(targetGroup, activeLanguage)}</h5>
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mt-1">{translations.priority}: {getLocalizedRisk(priority)}</span>
          </div>
        </div>
        <span className={cn(
          "text-[8.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border shrink-0",
          currentRisk === "Critical" ? "border-danger/30 text-danger bg-danger/5" : "border-muted text-muted"
        )}>
          {getLocalizedRisk(currentRisk)} {translations.risk}
        </span>
      </div>

      <div className="mt-2.5 sm:mt-3.5 flex-1 flex flex-col gap-1.5 sm:gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted">{translations.forecastTrend}</span>
          <span className="font-extrabold text-foreground">{translateForecastRisk(forecastRisk, activeLanguage)}</span>
        </div>
        <div className="bg-background/20 p-2 sm:p-2.5 rounded-lg border border-border/30">
          <span className="text-[8.5px] uppercase tracking-wide font-black text-muted block">{translations.aiRecommendation}</span>
          <p className="text-[10px] text-foreground font-semibold mt-1 leading-normal">{translateRecommendation(recommendation, activeLanguage)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-border/40 pt-2 sm:pt-2.5 mt-2.5 sm:mt-3 text-[9px] font-bold">
        <span className="text-muted flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {translations.advisoryConfirmed}
        </span>
        <span className="text-primary font-black">{translations.aiConf}: {confidence}%</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. ENVIRONMENTAL HEALTH INDEX CARD
// ==========================================
interface EHIProps {
  score: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  explanation: string;
  humidity: number;
  greenCover: number;
  exposureFactor: number;
}

export function EnvironmentalHealthIndexCard({
  score,
  trend,
  confidence,
  explanation,
  humidity,
  greenCover,
  exposureFactor
}: EHIProps) {
  return (
    <div className="glass-card p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 text-left h-full">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-danger animate-pulse" /> Environmental Health Index (EHI)
          </h4>
          <span className="text-[10px] text-muted mt-1 block">Weighted exposed safety index scale (cumulative factors)</span>
        </div>
        <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
      </div>

      {/* Main Score Layout */}
      <div className="flex items-center gap-3 sm:gap-5 bg-muted/5 border border-border p-3 sm:p-4 rounded-xl">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="var(--border)" strokeWidth="6.5" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="32" 
              stroke="var(--danger)" 
              strokeWidth="6.5" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-foreground leading-none">{score}</span>
            <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-muted mt-1">EHI Score</span>
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5">
            {trend === "up" ? (
              <span className="text-danger flex items-center gap-0.5 text-[11px] font-black">
                <TrendingUp className="w-3.5 h-3.5" /> Volatile Risk
              </span>
            ) : (
              <span className="text-success flex items-center gap-0.5 text-[11px] font-black">
                <TrendingDown className="w-3.5 h-3.5" /> Stable Conditions
              </span>
            )}
            <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted font-bold">
              Yesterday: {score + (trend === "up" ? -4 : 3)}
            </span>
          </div>
          <p className="text-[10px] text-muted mt-2 leading-relaxed font-semibold">
            {explanation}
          </p>
        </div>
      </div>

      {/* Secondary Factor bars */}
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>IT Corridor Green Cover Index</span>
            <span className="text-foreground">{greenCover}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${greenCover}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>Ambient Humidity Threshold</span>
            <span className="text-foreground">{humidity}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${humidity}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex justify-between items-center text-muted font-bold">
            <span>Population Exposure Index</span>
            <span className="text-danger">{exposureFactor}%</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full overflow-hidden">
            <div className="h-full bg-danger rounded-full" style={{ width: `${exposureFactor}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CITY COMPARISON CARD
// ==========================================
interface CityComparisonCardProps {
  city: string;
  aqi: number;
  forecast: number;
  envScore: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CityComparisonCard({
  city,
  aqi,
  forecast,
  envScore,
  trend,
  confidence,
  isSelected,
  onClick
}: CityComparisonCardProps) {
  const isPoor = aqi > 150;
  const isModerate = aqi > 100 && aqi <= 150;

  const aqiColor = isPoor 
    ? "text-danger" 
    : isModerate 
      ? "text-warning" 
      : "text-success";

  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-2xl p-4 flex flex-col justify-between text-left h-full transition-all duration-300 relative overflow-hidden cursor-pointer select-none",
        isSelected 
          ? "bg-primary/10 border-primary shadow-lg scale-[1.01]" 
          : "bg-muted/5 border-border hover:bg-muted/8"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-bold text-foreground text-xs">{city}</h5>
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mt-0.5">Reliability: {confidence}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold">
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-danger" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-success" />
          )}
          <span className={cn(trend === "up" ? "text-danger" : "text-success")}>
            {trend === "up" ? "Rising" : "Improving"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/50 text-center">
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">AQI Index</span>
          <span className={cn("text-sm font-black mt-1 block", aqiColor)}>{aqi}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">Forecast 24h</span>
          <span className="text-sm font-black text-foreground mt-1 block">{forecast}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">EHI Score</span>
          <span className="text-sm font-black text-primary mt-1 block">{envScore}</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
      )}
    </div>
  );
}

// ==========================================
// 4. ENVIRONMENTAL SCORECARD
// ==========================================
interface EnvironmentalScoreCardProps {
  score: number;
}

export function EnvironmentalScoreCard({ score }: EnvironmentalScoreCardProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const translations = urbanTranslations[activeLanguage] || urbanTranslations["en"];

  const items = [
    { label: "Predictive Forecast Accuracy", val: "94.6%", desc: "Mean relative variance vs raw sensors", status: "Optimal" },
    { label: "Urban Health Risk Mitigation", val: "88.2%", desc: "Directives adoption across risk groups", status: "Nominal" },
    { label: "Policy Improvement Index", val: "81.5%", desc: "Measured AQI reduction efficiency", status: "Satisfactory" },
    { label: "Sensor Availability Rate", val: "98.9%", desc: "Online active municipal node telemetry", status: "Stable" },
    { label: "Citizen Compliance Ratio", val: "76.4%", desc: "Heavy transport diversion traffic rates", status: "Action Needed" }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-5 text-left h-full justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> {translations.environmentalScorecard}
            </h4>
            <span className="text-[10px] text-muted mt-1 block">{translations.citywidePerformance}</span>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl text-center">
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block leading-none">{translations.globalScore}</span>
            <span className="text-base font-black text-primary block mt-1 leading-none">{score}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 mt-5">
          {items.map((item, idx) => {
            const trans = translateScorecardItem(item.label, item.desc, item.status, activeLanguage);
            return (
              <div key={idx} className="flex justify-between items-center text-[11px] border-b border-border/40 pb-2.5 last:border-b-0 last:pb-0">
                <div className="flex-grow min-w-0 pr-4">
                  <span className="font-bold text-foreground block truncate">{trans.label}</span>
                  <span className="text-[9px] text-muted block mt-0.5 truncate">{trans.desc}</span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-xs font-black text-foreground">{item.val}</span>
                  <span className={cn(
                    "text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded border shrink-0",
                    item.status === "Optimal" || item.status === "Stable"
                      ? "border-success/30 text-success bg-success/5"
                      : item.status === "Nominal" || item.status === "Satisfactory"
                        ? "border-primary/30 text-primary bg-primary/5"
                        : "border-warning/30 text-warning bg-warning/5"
                  )}>
                    {trans.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. TODAY'S DAILY AI BRIEFING
// ==========================================
interface DailyBriefCardProps {
  currentSituation: string;
  keyRisks: string[];
  forecast: string;
  recommendedActions: string[];
  expectedImprovement: string;
  confidence: number;
}

export function DailyBriefCard({
  currentSituation,
  keyRisks,
  forecast,
  recommendedActions,
  expectedImprovement,
  confidence
}: DailyBriefCardProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const translations = urbanTranslations[activeLanguage] || urbanTranslations["en"];

  return (
    <div className="glass-card p-4 sm:p-6 border-l-4 border-l-primary flex flex-col gap-3 sm:gap-4 text-left relative overflow-hidden bg-gradient-to-r from-card via-card to-primary/5">
      {/* soft light */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground leading-none">{translations.todaysBrief}</h4>
            <span className="text-[9.5px] text-muted mt-1 block">{translations.dailyOverview}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <AIConfidenceRing confidence={confidence} size="sm" showLabel={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 relative z-10">
        <div className="bg-background/40 border border-border/40 p-3 sm:p-4 rounded-xl">
          <span className="text-[9px] uppercase font-black text-primary block">{translations.currentSituation}</span>
          <p className="text-[11.5px] text-foreground font-semibold mt-1.5 leading-relaxed">{currentSituation}</p>
        </div>

        <div className="bg-background/40 border border-border/40 p-4 rounded-xl">
          <span className="text-[9px] uppercase font-black text-primary block">{translations.keyForecastRisks}</span>
          <div className="flex flex-col gap-1.5 mt-1.5">
            {keyRisks.map((risk, idx) => (
              <div key={idx} className="flex gap-1.5 text-[11px] items-start text-foreground font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between font-sans">
          <div>
            <span className="text-[9px] uppercase font-black text-primary block">{translations.causalAdvisory}</span>
            <p className="text-[11px] text-foreground font-semibold mt-1.5 leading-normal">{forecast}</p>
            <p className="text-[10px] text-muted font-semibold mt-1 leading-normal truncate">{recommendedActions[0]}</p>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2.5 mt-2">
            <span className="text-[9px] font-bold text-muted uppercase">{translations.expectedAqiImprovement}</span>
            <span className="text-[11.5px] font-black text-success flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5 animate-bounce" /> {expectedImprovement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. POLICY IMPACT TRACKER
// ==========================================
interface PolicyImpactCardProps {
  policyName: string;
  status: string;
  expectedImprovement: number;
  measuredImprovement: number;
  confidence: number;
  cost: number;
  duration: string;
  successRate: number;
}

export function PolicyImpactCard({
  policyName,
  status,
  expectedImprovement,
  measuredImprovement,
  confidence,
  cost,
  duration,
  successRate
}: PolicyImpactCardProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const translations = urbanTranslations[activeLanguage] || urbanTranslations["en"];

  const percentage = Math.min(100, (measuredImprovement / expectedImprovement) * 100);

  const translateDuration = (dur: string, lang: string): string => {
    if (lang === "hi") {
      if (dur.includes("hours")) return dur.replace("hours", "घंटे");
      if (dur.includes("hour")) return dur.replace("hour", "घंटा");
    }
    if (lang === "te") {
      if (dur.includes("hours")) return dur.replace("hours", "గంటలు");
      if (dur.includes("hour")) return dur.replace("hour", "గంట");
    }
    if (lang === "ta") {
      if (dur.includes("hours")) return dur.replace("hours", "மணிநேரம்");
      if (dur.includes("hour")) return dur.replace("hour", "மணிநேரம்");
    }
    if (lang === "kn") {
      if (dur.includes("hours")) return dur.replace("hours", "ಗಂಟೆಗಳು");
      if (dur.includes("hour")) return dur.replace("hour", "ಗಂಟೆ");
    }
    return dur;
  };

  return (
    <div className="bg-background/40 border border-border/40 p-3 sm:p-4 rounded-xl flex flex-col justify-between text-left h-full transition-all duration-300 hover:border-border">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h5 className="font-bold text-foreground text-xs leading-none">{translatePolicyName(policyName, activeLanguage)}</h5>
          <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-muted block mt-1">{translations.status}: {translatePolicyStatus(status, activeLanguage)}</span>
        </div>
        <span className="text-[8.5px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-extrabold">
          {translations.aiConf}: {confidence}%
        </span>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border/40">
        <div className="flex justify-between items-center text-[10px] font-semibold text-muted">
          <span>{translations.expectedVsMeasured}</span>
          <span className="text-success">-{measuredImprovement} AQI ({translations.target}: -{expectedImprovement})</span>
        </div>
        <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-3 sm:mt-4 text-center border-t border-border/40 pt-2.5 sm:pt-3">
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">{translations.budgetCost}</span>
          <span className="text-[10px] font-black text-foreground mt-0.5 block">
            ₹{(cost * 83).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">{translations.targetTime}</span>
          <span className="text-[10px] font-black text-foreground mt-0.5 block">{translateDuration(duration, activeLanguage)}</span>
        </div>
        <div>
          <span className="text-[7.5px] uppercase tracking-wide font-extrabold text-muted block">{translations.successRatio}</span>
          <span className="text-[10px] font-black text-success mt-0.5 block">{successRate}%</span>
        </div>
      </div>
    </div>
  );
}
