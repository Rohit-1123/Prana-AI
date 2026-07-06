import { useState } from "react";
import { HistoryDrawer, type ConversationSession } from "./HistoryDrawer";
import { ConversationView } from "./ConversationView";
import { PromptInput } from "./PromptInput";
import { ContextPanel } from "./ContextPanel";
import { QuickActions } from "./QuickActions";
import { MessageSquare, RefreshCw } from "lucide-react";
import { type ChatMessage } from "./MessageBubble";
import { localizedCopilotReplies } from "../../../utils/i18n";
import { useSettings } from "../../../contexts/SettingsContext";

function generateStructuredReport(text: string, ward: any) {
  const aqi = ward?.aqi || 145;
  const location = ward?.name || "Gachibowli";
  const weather = ward?.weather_condition || "Sunny";
  const wind = ward?.wind_speed || 6.2;
  const lowerText = text.toLowerCase();

  // 1. Situation summary
  let trend = "stable over the past three hours";
  if (lowerText.includes("increase") || lowerText.includes("high") || lowerText.includes("why") || aqi > 150) {
    trend = "increasing due to peak hour traffic density";
  } else if (aqi < 100) {
    trend = "improving due to active wind dispersion";
  }

  const summary = `Current AQI in ${location} is ${aqi} (${aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 200 ? "Poor" : "Severe"}). Air quality has remained ${trend} under ${weather.toLowerCase()} conditions.`;

  // 2. Causal factors breakdown
  let trafficCont = 38;
  let constructionCont = 22;
  let industrialCont = 15;
  if (lowerText.includes("traffic") || location === "Madhapur" || location === "Hitech City") {
    trafficCont = 58;
    constructionCont = 18;
    industrialCont = 8;
  } else if (lowerText.includes("construction") || location === "Begumpet" || location === "Secunderabad") {
    trafficCont = 22;
    constructionCont = 52;
    industrialCont = 11;
  } else if (lowerText.includes("industrial") || location === "Uppal" || location === "Charminar") {
    trafficCont = 28;
    constructionCont = 12;
    industrialCont = 48;
  }

  // 3. Evidence
  const evidence = [
    { name: "Traffic Data Stream", status: "Active", confidence: 96, timestamp: "Just now" },
    { name: "Weather Satellite Layer", status: "Operational", confidence: 93, timestamp: "10m ago" },
    { name: "Ground Sensor Network", status: "Calibrated", confidence: 98, timestamp: "2m ago" },
    { name: "Construction Site API", status: "Synchronized", confidence: 89, timestamp: "1h ago" }
  ];

  // 4. Recommendations
  const recommendations = [
    {
      title: "Restrict Heavy Silt Commercial Vehicles",
      priority: "Critical" as const,
      improvement: Math.max(8, Math.floor(aqi * 0.15)),
      confidence: 93,
      difficulty: "Moderate" as const,
      duration: "12-24h"
    },
    {
      title: "Deploy Municipal Sprinklers & Water Cannons",
      priority: "High" as const,
      improvement: Math.max(5, Math.floor(aqi * 0.08)),
      confidence: 96,
      difficulty: "Easy" as const,
      duration: "3-6h"
    },
    {
      title: "Enforce Dust Curbs at IT Construction Enclaves",
      priority: "Medium" as const,
      improvement: Math.max(3, Math.floor(aqi * 0.05)),
      confidence: 88,
      difficulty: "Hard" as const,
      duration: "48h"
    }
  ];

  // Calculated overall improvement
  const expectedAqiReduction = recommendations[0].improvement + recommendations[1].improvement;
  const predictedAqi = Math.max(25, aqi - expectedAqiReduction);

  return {
    situation: {
      location,
      aqi,
      weather,
      trend,
      summary
    },
    analysis: {
      primaryCause: trafficCont > constructionCont ? "Vehicular commuter emissions" : "Fugitive construction dust",
      secondaryCause: industrialCont > 20 ? "Industrial processing emissions" : "Road dust re-suspension",
      windInfluence: wind < 5.0 ? "Calm wind vectors trapping particulate loads" : "Moderate wind assisting particulate dispersion",
      factors: [
        { name: "Traffic Congestion", percentage: trafficCont },
        { name: "Construction Activities", percentage: constructionCont },
        { name: "Industrial Operations", percentage: industrialCont },
        { name: "Met Wind Vectors", percentage: Math.floor(100 - trafficCont - constructionCont - industrialCont) }
      ]
    },
    evidence,
    recommendations,
    expectedImprovement: {
      currentAqi: aqi,
      predictedAqi,
      improvementPoints: expectedAqiReduction,
      confidence: 94
    },
    overallConfidence: {
      percentage: 94,
      basedOn: ["Traffic Sensors", "Weather Forecasts", "Historical Models", "Sensor Grid", "Construction APIs"]
    }
  };
}

interface CopilotConsoleProps {
  selectedWard: any;
  onGenerateReport: () => void;
  onViewTwin: () => void;
  onOpenForecast: () => void;
  onNavigate?: (tabId: string) => void;
}

export function CopilotConsole({
  selectedWard,
  onGenerateReport,
  onViewTwin,
  onOpenForecast,
  onNavigate
}: CopilotConsoleProps) {
  const { formatTemp, formatWind } = useSettings();
  
  // Suggested Questions Prompt Chips
  const suggestedQuestions = [
    "What is the AQI forecast for tomorrow?",
    "Why has AQI increased today?",
    "Which area currently has the best air quality?",
    "Show pollution trends for the past week."
  ];

  // Conversation Sessions list state
  const [sessions, setSessions] = useState<ConversationSession[]>([
    { id: "sess-1", title: "Gachibowli sensor calibrations", timestamp: "2026-06-27" },
    { id: "sess-2", title: "Madhapur particulate load", timestamp: "2026-06-26" }
  ]);
  const [activeSessionId, setActiveSessionId] = useState("sess-1");

  // Messages session logs mapping
  const [sessionMessages, setSessionMessages] = useState<Record<string, ChatMessage[]>>({
    "sess-1": [
      { sender: "agent", text: "Hello! I am your Citizen Advisory Agent. Ask me questions about Hyderabad's air quality, safe jogging hours, or clean exposure routes." }
    ],
    "sess-2": [
      { sender: "user", text: "Is AQI high in Madhapur?" },
      { sender: "agent", text: "Madhapur AQI stands at 182 (Moderate). Commuter traffic spikes along junctions remain the primary driver vector." }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const messages = sessionMessages[activeSessionId] || [];

  const handleSend = (text: string) => {
    const updatedUserMsg = [...messages, { sender: "user", text } as ChatMessage];
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: updatedUserMsg
    }));
    setIsLoading(true);

    // Mock AI reply calculations
    setTimeout(() => {
      let reply = "";
      let routes: any[] | undefined = undefined;
      let card: any = undefined;
      let structuredData: any = undefined;

      const lowerText = text.toLowerCase();
      const activeLanguage = (localStorage.getItem("language") as "en" | "hi" | "te" | "ta" | "kn") || "en";
      const translations = localizedCopilotReplies[activeLanguage] || localizedCopilotReplies["en"];

      // Determine city and corresponding ward target
      let city = "Hyderabad";
      let targetWard = selectedWard;

      if (lowerText.includes("bangalore") || lowerText.includes("bengaluru")) {
        city = "Bangalore";
      } else if (lowerText.includes("chennai")) {
        city = "Chennai";
      } else if (lowerText.includes("delhi")) {
        city = "Delhi";
      } else if (lowerText.includes("mumbai")) {
        city = "Mumbai";
      } else if (lowerText.includes("hyderabad")) {
        city = "Hyderabad";
      } else {
        const wardName = selectedWard?.name || "";
        if (wardName.includes("Whitefield") || wardName.includes("Bangalore")) {
          city = "Bangalore";
        } else if (wardName.includes("Adyar") || wardName.includes("Chennai")) {
          city = "Chennai";
        } else if (wardName.includes("Connaught") || wardName.includes("Delhi")) {
          city = "Delhi";
        } else if (wardName.includes("Andheri") || wardName.includes("Mumbai")) {
          city = "Mumbai";
        } else {
          city = "Hyderabad";
        }
      }

      if (city === "Bangalore") {
        targetWard = { name: "Whitefield Centroid", aqi: 56, temperature: 24, weather_condition: "Clear" };
      } else if (city === "Chennai") {
        targetWard = { name: "Adyar Coastal Centroid", aqi: 59, temperature: 29, weather_condition: "Clear" };
      } else if (city === "Delhi") {
        targetWard = { name: "Connaught Place Centroid", aqi: 125, temperature: 34, weather_condition: "Haze" };
      } else if (city === "Mumbai") {
        targetWard = { name: "Andheri West Centroid", aqi: 61, temperature: 28, weather_condition: "Cloudy" };
      } else {
        targetWard = selectedWard;
      }

      if (lowerText.includes("why") || lowerText.includes("increase") || lowerText.includes("cause")) {
        reply = translations.text;
        structuredData = {
          primaryCause: translations.primaryCause,
          secondaryCause: translations.secondaryCause,
          weatherInfluence: translations.weatherInfluence,
          forecast: translations.forecast,
          recommendations: translations.recommendations,
          confidence: 93,
          evidence: translations.evidence
        };
      } else if (lowerText.includes("forecast") || lowerText.includes("tomorrow")) {
        reply = activeLanguage === "hi" ? `कल दोपहर ${targetWard.name} में एक्यूआई ${targetWard.aqi + 12} होने का अनुमान है।` :
                activeLanguage === "te" ? `రేపు మధ్యాహ్నం ${targetWard.name} లో గాలి నాణ్యత సూచిక ${targetWard.aqi + 12} AQI కి చేరే అవకాశం ఉంది.` :
                activeLanguage === "ta" ? `நாளை மதியம் ${targetWard.name} இல் காற்று தரம் ${targetWard.aqi + 12} AQI ஆக உயரக்கூடும்.` :
                activeLanguage === "kn" ? `ನಾಳೆ ಮಧ್ಯಾಹ್ನ ${targetWard.name} ನಲ್ಲಿ ಮಾಲಿನ್ಯ ಸೂಚ್ಯಂಕವು ${targetWard.aqi + 12} AQI ಗೆ ಏರಲಿದೆ.` :
                `Predictions inside ${targetWard.name} indicate stable AQI tomorrow peaking around ${targetWard.aqi + 12} AQI.`;
        card = {
          type: "recommendation",
          title: activeLanguage === "hi" ? "सिल्ट परिवहन प्रतिबंध निर्देश" :
                 activeLanguage === "te" ? "ధూళి రవాణా నియంత్రణ ఆదేశం" :
                 activeLanguage === "ta" ? "கனரக வாகன கட்டுப்பாட்டு வழிகாட்டுதல்" :
                 activeLanguage === "kn" ? "ಹೆವಿ ವಾಹನ ನಿಯಂತ್ರಣ ಆದೇಶ" :
                 "Silt Transport Restrict Directives",
          desc: activeLanguage === "hi" ? "भारी वाहनों के चलने पर प्रतिबंध लगाने से कण भार 22 एक्यूआई अंक कम हो जाता है।" :
                activeLanguage === "te" ? "భారీ డీజిల్ రవాణాను నియంత్రించడం వల్ల కాలుష్య తీవ్రత 22 పాయింట్లు తగ్గుతుంది." :
                activeLanguage === "ta" ? "கனரக டீசல் போக்குவரத்தை கட்டுப்படுத்துவது மாசுபாட்டை 22 புள்ளிகள் குறைக்கும்." :
                activeLanguage === "kn" ? "ವಾಹನ ಸಂಚಾರ ನಿಯಂತ್ರಣದಿಂದ ಮಾಲಿನ್ಯ 22 ಅಂಕಗಳು ಕಡಿಮೆಯಾಗಲಿದೆ." :
                "Restricting heavy silt commercial runs cuts PM2.5 loading by 22 AQI points.",
          badge: activeLanguage === "hi" ? "नीति कार्य योजना" :
                 activeLanguage === "te" ? "విధాన కార్యాచరణ ప్రణాళిక" :
                 activeLanguage === "ta" ? "கொள்கை செயல் திட்டம்" :
                 activeLanguage === "kn" ? "ನೀತಿ ಕಾರ್ಯ ಯೋಜನೆ" :
                 "Policy Action Plan",
          impact: "-22 AQI Points"
        };
      } else {
        const isJoggingQuery = lowerText.includes("jog") || lowerText.includes("run") || lowerText.includes("exercise") || lowerText.includes("walk") || lowerText.includes("outdoor");
        const isSafetyQuery = lowerText.includes("safe") || lowerText.includes("safety") || lowerText.includes("health");
        const isWeatherQuery = lowerText.includes("weather") || lowerText.includes("temperature") || lowerText.includes("temp") || lowerText.includes("wind") || lowerText.includes("humidity");
        
        if (isWeatherQuery) {
          if (activeLanguage === "hi") {
            reply = `आज ${targetWard.name} में मौसम ${targetWard.weather_condition === "Sunny" ? "धूप वाला" : targetWard.weather_condition === "Cloudy" ? "बादल छाए रहेंगे" : targetWard.weather_condition === "Haze" ? "धुंधला" : "साफ"} है। तापमान ${formatTemp(targetWard.temperature)} है, आर्द्रता ${targetWard.humidity}% है, और हवा की गति ${formatWind(targetWard.wind_speed)} है। कल मौसम स्थिर रहने की उम्मीद है, जिसमें तापमान ${formatTemp(targetWard.temperature + 1)} के आसपास रहेगा और हवा की गति ${formatWind(targetWard.wind_speed + 0.5)} रहेगी।`;
          } else if (activeLanguage === "te") {
            reply = `ఈరోజు ${targetWard.name} లో వాతావరణం ${targetWard.weather_condition === "Sunny" ? "ఎండగా" : targetWard.weather_condition === "Cloudy" ? "మబ్బులుగా" : targetWard.weather_condition === "Haze" ? "పొగమంచుతో" : "ప్రశాంతంగా"} ఉంది. ఉష్ణోగ్రత ${formatTemp(targetWard.temperature)}, తేమ ${targetWard.humidity}%, మరియు గాలి వేగం ${formatWind(targetWard.wind_speed)}. రేపు వాతావరణం స్థిరంగా ఉండే అవకాశం ఉంది, ఉష్ణోగ్రత గరిష్టంగా ${formatTemp(targetWard.temperature + 1)} మరియు గాలి సగటు వేగం ${formatWind(targetWard.wind_speed + 0.5)} గా నమోదవుతుంది.`;
          } else if (activeLanguage === "ta") {
            reply = `இன்று ${targetWard.name} இல் வானிலை ${targetWard.weather_condition === "Sunny" ? "வெயிலாக" : targetWard.weather_condition === "Cloudy" ? "மேகமூட்டமாக" : targetWard.weather_condition === "Haze" ? "பனிமூட்டமாக" : "தெளிவாக"} உள்ளது. வெப்பநிலை ${formatTemp(targetWard.temperature)}, ஈரப்பதம் ${targetWard.humidity}%, மற்றும் காற்றின் வேகம் ${formatWind(targetWard.wind_speed)}. நாளை வானிலை நிலையாக இருக்கும் என்று எதிர்பார்க்கப்படுகிறது, வெப்பநிலை ${formatTemp(targetWard.temperature + 1)} ஆகவும் காற்றின் வேகம் ${formatWind(targetWard.wind_speed + 0.5)} ஆகவும் இருக்கும்.`;
          } else if (activeLanguage === "kn") {
            reply = `ಇಂದು ${targetWard.name} ನಲ್ಲಿ ಹವಾಮಾನವು ${targetWard.weather_condition === "Sunny" ? "ಬಿಸಿಲಾಗಿರುತ್ತದೆ" : targetWard.weather_condition === "Cloudy" ? "ಮೋಡಕವಿದಿರುತ್ತದೆ" : targetWard.weather_condition === "Haze" ? "ಮಂಜಿನಿಂದ ಕೂಡಿರುತ್ತದೆ" : "ಸ್ವಚ್ಛವಾಗಿರುತ್ತದೆ"}. ತಾಪಮಾನವು ${formatTemp(targetWard.temperature)}, ತೇವಾಂಶವು ${targetWard.humidity}%, ಮತ್ತು ಗಾಳಿಯ ವೇಗವು ${formatWind(targetWard.wind_speed)} ಆಗಿದೆ. ನಾಳೆ ಹವಾಮಾನವು ಸ್ಥಿರವಾಗಿರುವ ನಿರೀಕ್ಷೆಯಿದೆ, ತಾಪಮಾನವು ಸುಮಾರು ${formatTemp(targetWard.temperature + 1)} ತಲುಪಲಿದ್ದು ಗಾಳಿಯ ಸರಾಸರಿ ವೇಗವು ${formatWind(targetWard.wind_speed + 0.5)} ಆಗಿರುತ್ತದೆ.`;
          } else {
            reply = `Today in ${targetWard.name}, the weather condition is ${targetWard.weather_condition || "Clear"}. The temperature is ${formatTemp(targetWard.temperature)}, humidity is ${targetWard.humidity}%, and wind speed is ${formatWind(targetWard.wind_speed)}. Tomorrow, weather is expected to remain stable with temperatures peaking around ${formatTemp(targetWard.temperature + 1)} and winds averaging ${formatWind(targetWard.wind_speed + 0.5)} under ${targetWard.weather_condition || "Clear"} skies.`;
          }
        } else if (isJoggingQuery) {
          if (activeLanguage === "hi") {
            reply = targetWard.aqi > 150 
              ? `आज ${targetWard.name} में बाहरी जॉगिंग की अनुशंसा नहीं की जाती है। वर्तमान एक्यूआई ${targetWard.aqi} (मध्यम/उच्च) है। संवेदनशील समूहों को घर के अंदर व्यायाम करना चाहिए।`
              : `आज ${targetWard.name} में जॉगिंग सुरक्षित है। वर्तमान एक्यूआई ${targetWard.aqi} (संतोषजनक) है।`;
          } else if (activeLanguage === "te") {
            reply = targetWard.aqi > 150 
              ? `ఈరోజు ${targetWard.name} లో అవుట్‌డోర్ జాగింగ్ సిఫార్సు చేయబడదు. ప్రస్తుత కాలుష్య సూచిక ${targetWard.aqi} (మధ్యమ/ఎక్కువ) ఉంది. కాలుష్యానికి సులభంగా గురయ్యే వారు గదిలోనే వ్యాయామం చేయాలి.`
              : `ఈరోజు ${targetWard.name} లో జాగింగ్ సురక్షితం. ప్రస్తుత కాలుష్య సూచిక ${targetWard.aqi} (సంతృప్తికరం) ఉంది.`;
          } else if (activeLanguage === "ta") {
            reply = targetWard.aqi > 150 
              ? `இன்று ${targetWard.name} இல் வெளிப்புற ஜாக்கிங் பரிந்துரைக்கப்படவில்லை. தற்போதைய காற்று தரம் ${targetWard.aqi} (மிதமானது/அதிகம்). உணர்திறன் உடையவர்கள் வீட்டிற்குள் உடற்பயிற்சி செய்ய வேண்டும்.`
              : `இன்று ${targetWard.name} இல் ஜாக்கிங் பாதுகாப்பானது. தற்போதைய காற்று தரம் ${targetWard.aqi} (திருப்திகரமானது).`;
          } else if (activeLanguage === "kn") {
            reply = targetWard.aqi > 150 
              ? `ಇಂದು ${targetWard.name} ನಲ್ಲಿ ಹೊರಾಂಗಣ ಜಾಗಿಂಗ್ ಮಾಡಲು ಶಿಫಾರಸು ಮಾಡುವುದಿಲ್ಲ. ಪ್ರಸ್ತುತ ಮಾಲಿನ್ಯ ಸೂಚ್ಯಂಕವು ${targetWard.aqi} (ಮಧ್ಯಮ/ಹೆಚ್ಚು) ಆಗಿದೆ. ಸೂಕ್ಷ್ಮ ಆರೋಗ್ಯದವರು ಒಳಾಂಗಣದಲ್ಲೇ ವ್ಯಾಯಾಮ ಮಾಡಬೇಕು.`
              : `ಇಂದು ${targetWard.name} ನಲ್ಲಿ ಜಾಗಿಂಗ್ ಮಾಡುವುದು ಸುರಕ್ಷಿತವಾಗಿದೆ. ಪ್ರಸ್ತುತ ಮಾಲಿನ್ಯ ಸೂಚ್ಯಂಕವು ${targetWard.aqi} (ತೃಪ್ತಿಕರ) ಆಗಿದೆ.`;
          } else {
            reply = targetWard.aqi > 150 
              ? `Outdoor jogging is NOT recommended in ${targetWard.name} today. The current AQI is ${targetWard.aqi} (Moderate/High). Sensitive groups should exercise indoors.`
              : `Jogging is safe in ${targetWard.name} today. The current AQI is ${targetWard.aqi} (Satisfactory).`;
          }
        } else if (isSafetyQuery) {
          if (activeLanguage === "hi") {
            reply = targetWard.aqi > 150 
              ? `${targetWard.name} में हवा की गुणवत्ता वर्तमान में ${targetWard.aqi} तक बढ़ गई है। खिड़कियां बंद रखने और बाहर N95 मास्क पहनने की सलाह दी जाती है।`
              : `${targetWard.name} में परिस्थितियां वर्तमान में संतोषजनक हैं (एक्यूआई: ${targetWard.aqi})। यह अधिकांश नागरिकों के लिए स्वीकार्य है।`;
          } else if (activeLanguage === "te") {
            reply = targetWard.aqi > 150 
              ? `${targetWard.name} లో గాలి నాణ్యత ప్రస్తుతం ${targetWard.aqi} కి పెరిగింది. కిటికీలు మూసి ఉంచాలని మరియు బయటికి వెళ్ళేటప్పుడు N95 మాస్కులు ధరించాలని సూచించబడింది.`
              : `${targetWard.name} లో పరిస్థితులు ప్రస్తుతం సంతృప్తికరంగా ఉన్నాయి (AQI: ${targetWard.aqi}). ఇది చాలా మంది పౌరులకు ఆమోదయోగ్యమైనది.`;
          } else if (activeLanguage === "ta") {
            reply = targetWard.aqi > 150 
              ? `${targetWard.name} இல் காற்றின் தரம் தற்போது ${targetWard.aqi} ஆக உயர்ந்துள்ளது. ஜன்னல்களை மூடி வைக்கவும், வெளியே செல்லும்போது N95 முகமூடிகளை அணியவும் அறிவுறுத்தப்படுகிறது.`
              : `${targetWard.name} இல் நிலைமைகள் தற்போது திருப்திகரமாக உள்ளன (AQI: ${targetWard.aqi}). இது பெரும்பாலான குடிமக்களுக்கு ஏற்றுக்கொள்ளத்தக்கது.`;
          } else if (activeLanguage === "kn") {
            reply = targetWard.aqi > 150 
              ? `${targetWard.name} ನಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟವು ಪ್ರಸ್ತುತ ${targetWard.aqi} ಕ್ಕೆ ಏರಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿಡಲು ಮತ್ತು ಹೊರಾಂಗಣದಲ್ಲಿ N95 ಮಾಸ್ಕ್ ಧರಿಸಲು ಸೂಚಿಸಲಾಗುತ್ತದೆ.`
              : `${targetWard.name} ನಲ್ಲಿ ಪರಿಸ್ಥಿತಿಗಳು ಪ್ರಸ್ತುತ ತೃಪ್ತಿಕರವಾಗಿವೆ (AQI: ${targetWard.aqi}). ಇದು ಹೆಚ್ಚಿನ ನಾಗರಿಕರಿಗೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.`;
          } else {
            reply = targetWard.aqi > 150 
              ? `Air Quality in ${targetWard.name} is currently elevated to ${targetWard.aqi}. It is advised to keep windows closed and wear N95 filters outdoors.`
              : `Conditions in ${targetWard.name} are currently satisfactory (AQI: ${targetWard.aqi}). It is acceptable for most citizens.`;
          }
        } else {
          if (activeLanguage === "hi") {
            reply = `${targetWard.name} में वर्तमान एक्यूआई ${targetWard.aqi} है। यह सामान्य है।`;
          } else if (activeLanguage === "te") {
            reply = `${targetWard.name} లో ప్రస్తుత కాలుష్య సూచిక ${targetWard.aqi} AQI. ఇది సాధారణం.`;
          } else if (activeLanguage === "ta") {
            reply = `${targetWard.name} இல் தற்போதைய காற்று தரம் ${targetWard.aqi} AQI.`;
          } else if (activeLanguage === "kn") {
            reply = `${targetWard.name} ನಲ್ಲಿ ಗಾಳಿ ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ ${targetWard.aqi} AQI.`;
          } else {
            reply = `Active parameters inside ${targetWard.name}: AQI ${targetWard.aqi} (${targetWard.aqi > 150 ? 'Moderate/Elevated' : 'Satisfactory'}). Exposure risk guidelines recommend green corridors commute runs.`;
          }
        }

        const isHi = activeLanguage === "hi";
        const isTe = activeLanguage === "te";
        const isTa = activeLanguage === "ta";
        const isKn = activeLanguage === "kn";

        if (city === "Bangalore") {
          routes = [
            {
              name: isHi ? "कब्बन पार्क जॉगिंग ट्रैक" : isTe ? "కబ్బన్ పార్క్ జాగింగ్ ట్రాక్" : isTa ? "கப்பன் பூங்கா ஜாக்கிங் பாதை" : isKn ? "ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಜಾಗಿಂಗ್ ಟ್ರ್ಯಾಕ್" : "Cubbon Park Jogging Track",
              aqi: Math.floor(targetWard.aqi * 0.7),
              reason: isHi ? "हरे-भरे पेड़ों का छतरी परिवेशी एरोसोल को रोकता है।" : isTe ? "దట్టమైన వృక్ష సంపద కాలుష్యాన్ని అడ్డుకుంటుంది." : isTa ? "அடர்ந்த மரங்கள் வாகன புகையைத் தடுக்கின்றன." : isKn ? "ದಟ್ಟವಾದ ಮರಗಳ ನೆರಳು ಮಾಲಿನ್ಯಕಾರಕಗಳನ್ನು ತಡೆಯುತ್ತದೆ." : "Lush canopy blocks ambient aerosols."
            },
            {
              name: isHi ? "लालबाग बॉटनिकल वॉकवे" : isTe ? "లాల్‌బాగ్ బొటానికల్ వాక్‌వే" : isTa ? "லால்பாக் தாவரவியல் நடைபாதை" : isKn ? "ಲಾಲ್‌ಬಾಗ್ ಬಟಾನಿಕಲ್ ವಾಕ್‌ವೇ" : "Lalbagh Botanical Walkway",
              aqi: Math.floor(targetWard.aqi * 0.8),
              reason: isHi ? "उच्च वानस्पतिक घनत्व स्थानीय शीतलन को प्रेरित करता है।" : isTe ? "ఎక్కువ వృక్ష సంపద స్థానిక చల్లదనాన్ని ఇస్తుంది." : isTa ? "அதிக தாவர அடர்த்தி உள்ளூர் குளிர்ச்சியைத் தூண்டுகிறது." : isKn ? "ಹೆಚ್ಚಿನ ಸಸ್ಯ ಸಾಂದ್ರತೆಯು ಸ್ಥಳೀಯ ತಂಪನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ." : "High botanical density triggers localized cooling."
            }
          ];
        } else if (city === "Chennai") {
          routes = [
            {
              name: isHi ? "अडयार इको-पार्क कॉरिडोर" : isTe ? "అడయార్ ఎకో-పార్క్ కారిడార్" : isTa ? "அடையார் ಪರಿಸர பூங்கா வழித்தடம்" : isKn ? "ಅಡ್ಯಾರ್ ಇಕೋ-ಪಾರ್ಕ್ ಕಾರಿಡಾರ್" : "Adyar Eco-Park Corridor",
              aqi: Math.floor(targetWard.aqi * 0.7),
              reason: isHi ? "सुरक्षित आर्द्रभूमि की हवा कणों को बिखेरती है।" : isTe ? "రక్షిత చిత్తడి నేలల గాలి కాలుష్య కణాలను చెదరగొడుతుంది." : isTa ? "பாதுகாக்கப்பட்ட ஈரநிலக் காற்று மாசுகளை சிதறடிக்கிறது." : isKn ? "ಸಂರಕ್ಷಿತ ಜೌಗು ಪ್ರದೇಶದ ಗಾಳಿಯು ಮಾಲಿನ್ಯಕಾರಕಗಳನ್ನು ಚದುರಿಸುತ್ತದೆ." : "Protected wetland breeze disperses particulates."
            },
            {
              name: isHi ? "मरीना बीच प्रोमेनेड" : isTe ? "మెరీనా బీచ్ ప్రొమెనేడ్" : isTa ? "மெரினா கடற்கரை நடைபாதை" : isKn ? "ಮರೀನಾ ಬೀಚ್ ಪ್ರೊಮೆనేಡ್" : "Marina Beach Promenade",
              aqi: Math.floor(targetWard.aqi * 0.8),
              reason: isHi ? "मजबूत तटीय हवा उत्सर्जन को कम करती है।" : isTe ? "బలమైన తీర గాలులు ఉద్గారాలను తగ్గిస్తాయి." : isTa ? "வலுவான கடலோர காற்று உமிழ்வைக் குறைக்கிறது." : isKn ? "ಬಲವಾದ ಕರாவಳಿ ಗಾಳಿಯು ಮಾಲಿನ್ಯ ಪ್ರಮಾಣವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ." : "Strong coastal wind vectors dilute emissions."
            }
          ];
        } else if (city === "Delhi") {
          routes = [
            {
              name: isHi ? "लोधी गार्डन ग्रीन ट्रेल" : isTe ? "ಲೋಧಿ గార్డెన్స్ గ్రీన్ ట్రైల్" : isTa ? "லோதி கார்டன்ஸ் பசுமை வழித்தடம்" : isKn ? "ಲೋಧಿ ಗಾರ್ಡನ್ಸ್ ಗ್ರೀನ್ ಟ್ರಯಲ್" : "Lodhi Gardens Green Trail",
              aqi: Math.floor(targetWard.aqi * 0.7),
              reason: isHi ? "उच्च छतरी आवरण वाला ऐतिहासिक पार्क क्षेत्र।" : isTe ? "ఎక్కువ చెట్ల నీడ ఉన్న చారిత్రక పార్కు ప్రాంతం." : isTa ? "அதிக மரங்கள் நிறைந்த வரலாற்று சிறப்புமிக்க பூங்கா பகுதி." : isKn ? "ಹೆಚ್ಚಿನ ಮರಗಳ ಹೊದಿಕೆ ಹೊಂದಿರುವ ಐತಿಹಾಸಿಕ ಉದ್ಯಾನವನ ಪ್ರದೇಶ." : "Historical park enclave with high canopy cover."
            },
            {
              name: isHi ? "संजय वन वन पथ" : isTe ? "సంజయ్ వన్ ఫారెస్ట్ పాత్‌వే" : isTa ? "சஞ்சய் வன் காடு பாதை" : isKn ? "ಸಂಜಯ್ ವನ್ ಅರಣ್ಯ ಮಾರ್ಗ" : "Sanjay Van Forest Pathway",
              aqi: Math.floor(targetWard.aqi * 0.8),
              reason: isHi ? "सघन पत्ते निलंबित धूल भार को फंसाते हैं।" : isTe ? "ದಟ್ಟమైన ఆకులు గాల్లోని ధూళిని గ్రహిస్తాయి." : isTa ? "அடர்ந்த இலைகள் காற்றில் மிதக்கும் தூசியை ஈர்க்கின்றன." : isKn ? "ದಟ್ಟವಾದ ಎಲೆಗಳು ಗಾಳಿಯಲ್ಲಿ ತೇಲುವ ಧೂಳನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತವೆ." : "Dense foliage traps suspended dust loads."
            }
          ];
        } else if (city === "Mumbai") {
          routes = [
            {
              name: isHi ? "संजय गांधी राष्ट्रीय उद्यान सैर" : isTe ? "సంజయ్ గాంధీ నేషనಲ್ పార్ಕ್ వాక్" : isTa ? "சஞ்சய் காந்தி தேசிய பூங்கா நடைபயிற்சி" : isKn ? "ಸಂಜಯ್ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ನಡಿಗೆ" : "Sanjay Gandhi National Park Walk",
              aqi: Math.floor(targetWard.aqi * 0.7),
              reason: isHi ? "वनाच्छादित अभयारण्य प्राकृतिक कार्बन सिंक के रूप में कार्य करता है।" : isTe ? "అటవీ ప్రాంతం సహజ కార్బన్ సింక్‌గా పనిచేస్తుంది." : isTa ? "காடுகள் நிறைந்த பகுதி இயற்கையான கார்பன் சேமிப்பகமாக செயல்படுகிறது." : isKn ? "ಅರಣ್ಯ ಪ್ರದೇಶವು ನೈಸರ್ಗಿಕ ಕಾರ್ಬನ್ ಸಿಂಕ್ ಆಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ." : "Forested reserve acts as a natural carbon sink."
            },
            {
              name: isHi ? "मरीन ड्राइव प्रोमेनेड" : isTe ? "మెరైన్ డ్రೈవ్ ప్రొమెనేడ్" : isTa ? "மெரைன் டிரைவ் நடைபாதை" : isKn ? "ಮೆರೈನ್ ಡ್ರೈವ್ ಪ್ರೊಮೆನೇಡ್" : "Marine Drive Promenade",
              aqi: Math.floor(targetWard.aqi * 0.8),
              reason: isHi ? "समुद्री हवा वाहनों के धुएं को अत्यधिक कम करती है।" : isTe ? "ಸముద్రపు गालि వాహనాల పొగను తగ్గిస్తుంది." : isTa ? "கடல் காற்று வாகன புகையை பெருமளவு நீர்த்துப்போகச் செய்கிறது." : isKn ? "ಸಮುದ್ರದ ಗಾಳಿಯು ವಾಹನಗಳ ಹೊಗೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ." : "Sea breeze triggers high dilution of vehicular exhaust."
            }
          ];
        } else {
          routes = [
            {
              name: isHi ? "आईआईआईटी कैंपस ग्रीन पाथवे" : isTe ? "IIIT క్యాంపస్ గ్రీన్ పాత్‌వే" : isTa ? "IIIT வளாக பசுமை வழித்தடம்" : isKn ? "IIIT ಕ್ಯಾಂಪಸ್ ಹಸಿರು ಮಾರ್ಗ" : "IIIT Campus Green Pathway",
              aqi: Math.floor(targetWard.aqi * 0.7),
              reason: isHi ? "घने पेड़ सड़क की कालिख को रोकते हैं।" : isTe ? "దట్టమైన వృక్ష సంపద కాలుష్యాన్ని అడ్డుకుంటుంది." : isTa ? "அடர்ந்த மரங்கள் வாகன புகையை தடுக்கின்றன." : isKn ? "ಹೆಚ್ಚಿನ ಮರಗಳು ಹೊಗೆಯನ್ನು தಡೆಯುತ್ತವೆ." : "Dense tree plantation blocks road soot."
            },
            {
              name: isHi ? "माइंडस्पेस बाईपास कॉरिडोर" : isTe ? "మైండ్‌స్పేస్ బైపాస్ కారిడార్" : isTa ? "மைண்ட்ஸ்பேస్ బైపాస్ வழித்தடம்" : isKn ? "ಮೈಂಡ್‌స్పೇಸ್ ಬೈಪಾಸ್ ಕಾರಿಡಾರ್" : "Mindspace Office Bypass Corridor",
              aqi: Math.floor(targetWard.aqi * 0.8),
              reason: isHi ? "कम ट्रक यातायात वाली सड़क।" : isTe ? "తక్కువ లారీ రద్దీ ఉన్న మార్గం." : isTa ? "குறைந்த லாரி போக்குவரத்து பாதை." : isKn ? "ಕಡಿಮೆ ಲಾರಿ ಸಂಚಾರವಿರುವ ರಸ್ತೆ." : "Low truck traffic lane."
            }
          ];
        }
      }
      const structuredReport = generateStructuredReport(text, targetWard);
      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...updatedUserMsg, { sender: "agent", text: reply, routes, card, structuredData, structuredReport } as ChatMessage]
      }));
      setIsLoading(false);
    }, 3000);
  };

  const handleNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ConversationSession = {
      id: newId,
      title: "New Conversation",
      timestamp: new Date().toISOString().split("T")[0]
    };
    setSessions([newSession, ...sessions]);
    setSessionMessages(prev => ({
      ...prev,
      [newId]: [{ sender: "agent", text: "Hello! Connect a query to analyze focus coordinates." }]
    }));
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(sessions[0]?.id || "");
    }
  };

  const handleClearChat = () => {
    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: []
    }));
  };

  const handleExport = () => {
    const chatLogText = messages.map(m => `[${m.sender}] ${m.text}`).join("\n");
    const blob = new Blob([chatLogText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prana-copilot-chat-${activeSessionId}.txt`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch select-none">
      
      {/* 1. Left Drawer: History list (3 columns on desktop) */}
      <div className="lg:col-span-3 h-full">
        <HistoryDrawer 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* 2. Center Panel: Chat Workspace (6 columns on desktop) */}
      <div className="lg:col-span-6 glass-card p-6 flex flex-col justify-between min-h-[500px] h-[600px]">
        
        {/* Workspace Header */}
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="font-extrabold text-sm text-foreground">Interactive Copilot Console</h3>
              <span className="text-[10px] text-muted block mt-0.5">Prompt model calculations and explainability paths</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
            )}
            <QuickActions 
              onViewTwin={onViewTwin}
              onOpenForecast={onOpenForecast}
              onGenerateReport={onGenerateReport}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Scrollable messages view */}
        <ConversationView 
          messages={messages}
          suggestedQuestions={suggestedQuestions}
          onClickQuestion={handleSend}
          isLoading={isLoading}
          onNavigate={onNavigate}
          onGenerateReport={onGenerateReport}
        />

        {/* Footer Prompt Input */}
        <div className="border-t border-border pt-4 mt-2">
          <PromptInput 
            onSend={handleSend}
            onClear={handleClearChat}
            isLoading={isLoading}
          />
        </div>

      </div>

      {/* 3. Right Panel: Active Context details (3 columns on desktop) */}
      <div className="lg:col-span-3 h-full">
        <ContextPanel 
          selectedWard={selectedWard}
        />
      </div>

    </div>
  );
}
