import { aqiBand, AQI_BANDS, mainPollutant } from "../../utils/aqi";

type Lang = "en" | "hi" | "te" | "ta" | "kn";

export interface BriefInput {
  ward: string;
  aqi: number;
  forecastAqi: number;
  pm2_5: number;
  pm10: number;
  wind: number;
  humidity: number;
  temperature: number;
}

export interface DailyBrief {
  currentSituation: string;
  keyRisks: string[];
  forecast: string;
  recommendedActions: string[];
}

interface Pack {
  bands: string[]; // same order as AQI_BANDS
  situation: (w: string, a: number, label: string, pollutant: string) => string;
  calm: (wind: number) => string;
  humid: (h: number) => string;
  coarse: (pm10: number) => string;
  heat: (t: number) => string;
  none: string;
  forecast: (f: number, trend: string) => string;
  trends: [rising: string, falling: string, steady: string];
  actions: string[][]; // one list per band
}

const PACKS: Record<Lang, Pack> = {
  en: {
    bands: ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"],
    situation: (w, a, l, p) => `${w} is at AQI ${a} (${l}). Main pollutant: ${p}.`,
    calm: (v) => `Calm air (${v} m/s) lets pollution build up near the ground.`,
    humid: (h) => `High humidity (${h}%) can hold fine particles close to the surface.`,
    coarse: (v) => `Coarse dust is elevated (PM10 ${v} µg/m³).`,
    heat: (t) => `Heat (${t}°C) adds strain for people working or exercising outdoors.`,
    none: "No major risk factors beyond the current AQI.",
    forecast: (f, t) => `Expected around AQI ${f} in 24 hours (${t}).`,
    trends: ["rising", "falling", "steady"],
    actions: [
      ["Enjoy outdoor activities.", "Open windows for fresh air."],
      ["Normal outdoor activity is fine.", "Very sensitive people should avoid long, hard exercise."],
      ["People with asthma or heart disease, children and older adults should limit long outdoor exertion.", "Choose routes away from busy roads."],
      ["Reduce outdoor exercise.", "Sensitive people should stay indoors.", "Wear an N95 mask if you must go out."],
      ["Avoid outdoor activity.", "Wear an N95 mask and keep windows closed.", "Run an air purifier if you have one."],
      ["Stay indoors.", "Avoid all outdoor exertion.", "See a doctor if you have symptoms."]
    ]
  },
  hi: {
    bands: ["अच्छा", "संतोषजनक", "मध्यम", "खराब", "बहुत खराब", "गंभीर"],
    situation: (w, a, l, p) => `${w} में AQI ${a} (${l}) है। मुख्य प्रदूषक: ${p}।`,
    calm: (v) => `शांत हवा (${v} मी/से) के कारण प्रदूषण ज़मीन के पास जमा हो रहा है।`,
    humid: (h) => `अधिक नमी (${h}%) बारीक कणों को सतह के पास रोके रखती है।`,
    coarse: (v) => `मोटे धूल कण बढ़े हुए हैं (PM10 ${v} µg/m³)।`,
    heat: (t) => `गर्मी (${t}°C) बाहर काम या व्यायाम करने वालों पर अतिरिक्त बोझ डालती है।`,
    none: "मौजूदा AQI के अलावा कोई बड़ा जोखिम कारक नहीं है।",
    forecast: (f, t) => `24 घंटे में AQI लगभग ${f} रहने का अनुमान है (${t})।`,
    trends: ["बढ़ रहा है", "घट रहा है", "स्थिर"],
    actions: [
      ["बाहरी गतिविधियों का आनंद लें।", "खिड़कियाँ खोलकर ताज़ी हवा आने दें।"],
      ["सामान्य बाहरी गतिविधियाँ ठीक हैं।", "बहुत संवेदनशील लोग लंबे समय तक कठिन व्यायाम से बचें।"],
      ["अस्थमा या हृदय रोग वाले, बच्चे और बुज़ुर्ग लंबे समय तक बाहर परिश्रम न करें।", "व्यस्त सड़कों से दूर के रास्ते चुनें।"],
      ["बाहरी व्यायाम कम करें।", "संवेदनशील लोग घर के अंदर रहें।", "बाहर जाना ज़रूरी हो तो N95 मास्क पहनें।"],
      ["बाहरी गतिविधि से बचें।", "N95 मास्क पहनें और खिड़कियाँ बंद रखें।", "संभव हो तो एयर प्यूरीफायर चलाएँ।"],
      ["घर के अंदर रहें।", "सभी बाहरी परिश्रम से बचें।", "लक्षण होने पर डॉक्टर से मिलें।"]
    ]
  },
  te: {
    bands: ["మంచిది", "సంతృప్తికరం", "సాధారణం", "హానికరం", "చాలా హానికరం", "తీవ్రం"],
    situation: (w, a, l, p) => `${w} లో AQI ${a} (${l}). ప్రధాన కాలుష్యకారకం: ${p}.`,
    calm: (v) => `నిశ్చల గాలి (${v} మీ/సె) వల్ల కాలుష్యం నేల దగ్గర పేరుకుపోతోంది.`,
    humid: (h) => `అధిక తేమ (${h}%) సూక్ష్మ కణాలను ఉపరితలం దగ్గర నిలుపుతుంది.`,
    coarse: (v) => `ముతక ధూళి ఎక్కువగా ఉంది (PM10 ${v} µg/m³).`,
    heat: (t) => `వేడి (${t}°C) బయట పనిచేసేవారికి, వ్యాయామం చేసేవారికి అదనపు భారం.`,
    none: "ప్రస్తుత AQI తప్ప పెద్ద ప్రమాద కారకాలు లేవు.",
    forecast: (f, t) => `24 గంటల్లో AQI సుమారు ${f} ఉండవచ్చు (${t}).`,
    trends: ["పెరుగుతోంది", "తగ్గుతోంది", "స్థిరం"],
    actions: [
      ["బయటి కార్యకలాపాలు హాయిగా చేసుకోవచ్చు.", "కిటికీలు తెరిచి స్వచ్ఛమైన గాలి రానివ్వండి."],
      ["సాధారణ బయటి కార్యకలాపాలు సరే.", "అత్యంత సున్నితమైనవారు ఎక్కువసేపు తీవ్ర వ్యాయామం చేయకండి."],
      ["ఆస్తమా, గుండె జబ్బు ఉన్నవారు, పిల్లలు, వృద్ధులు ఎక్కువసేపు బయట శ్రమించకండి.", "రద్దీ రోడ్లకు దూరంగా ఉండే మార్గాలు ఎంచుకోండి."],
      ["బయటి వ్యాయామం తగ్గించండి.", "సున్నితమైనవారు ఇంట్లోనే ఉండండి.", "తప్పనిసరిగా బయటకు వెళ్తే N95 మాస్క్ ధరించండి."],
      ["బయటి కార్యకలాపాలు మానుకోండి.", "N95 మాస్క్ ధరించి కిటికీలు మూసి ఉంచండి.", "వీలైతే ఎయిర్ ప్యూరిఫైయర్ వాడండి."],
      ["ఇంట్లోనే ఉండండి.", "బయటి శ్రమను పూర్తిగా మానుకోండి.", "లక్షణాలు ఉంటే వైద్యుడిని కలవండి."]
    ]
  },
  ta: {
    bands: ["நல்லது", "திருப்திகரமானது", "மிதமானது", "மோசமானது", "மிகவும் மோசமானது", "தீவிரமானது"],
    situation: (w, a, l, p) => `${w} இல் AQI ${a} (${l}). முக்கிய மாசுபடுத்தி: ${p}.`,
    calm: (v) => `அமைதியான காற்று (${v} மீ/வி) காரணமாக மாசு தரைக்கு அருகில் தேங்குகிறது.`,
    humid: (h) => `அதிக ஈரப்பதம் (${h}%) நுண்துகள்களை தரைக்கு அருகில் தக்கவைக்கும்.`,
    coarse: (v) => `பெரிய தூசித் துகள்கள் அதிகமாக உள்ளன (PM10 ${v} µg/m³).`,
    heat: (t) => `வெப்பம் (${t}°C) வெளியில் வேலை செய்பவர்களுக்கும் உடற்பயிற்சி செய்பவர்களுக்கும் கூடுதல் சுமை.`,
    none: "தற்போதைய AQI தவிர பெரிய அபாய காரணிகள் இல்லை.",
    forecast: (f, t) => `24 மணி நேரத்தில் AQI சுமார் ${f} ஆக இருக்கும் (${t}).`,
    trends: ["உயர்கிறது", "குறைகிறது", "நிலையானது"],
    actions: [
      ["வெளிப்புற செயல்பாடுகளை அனுபவிக்கலாம்.", "ஜன்னல்களைத் திறந்து சுத்தமான காற்றை அனுமதிக்கவும்."],
      ["வழக்கமான வெளிப்புற செயல்பாடுகள் பரவாயில்லை.", "மிகவும் உணர்திறன் உள்ளவர்கள் நீண்ட நேரம் கடினமான உடற்பயிற்சியைத் தவிர்க்கவும்."],
      ["ஆஸ்துமா அல்லது இதய நோய் உள்ளவர்கள், குழந்தைகள், முதியோர் நீண்ட நேரம் வெளியில் உழைப்பதைத் தவிர்க்கவும்.", "நெரிசலான சாலைகளிலிருந்து விலகிய பாதைகளைத் தேர்வு செய்யவும்."],
      ["வெளிப்புற உடற்பயிற்சியைக் குறைக்கவும்.", "உணர்திறன் உள்ளவர்கள் வீட்டுக்குள் இருக்கவும்.", "வெளியே செல்ல வேண்டியிருந்தால் N95 முகக்கவசம் அணியவும்."],
      ["வெளிப்புற செயல்பாடுகளைத் தவிர்க்கவும்.", "N95 முகக்கவசம் அணிந்து ஜன்னல்களை மூடி வைக்கவும்.", "முடிந்தால் காற்று சுத்திகரிப்பானை இயக்கவும்."],
      ["வீட்டுக்குள் இருக்கவும்.", "எல்லா வெளிப்புற உழைப்பையும் தவிர்க்கவும்.", "அறிகுறிகள் இருந்தால் மருத்துவரைச் சந்திக்கவும்."]
    ]
  },
  kn: {
    bands: ["ಉತ್ತಮ", "ತೃಪ್ತಿದಾಯಕ", "ಸಾಧಾರಣ", "ಕಳಪೆ", "ಅತಿ ಕಳಪೆ", "ತೀವ್ರ"],
    situation: (w, a, l, p) => `${w} ನಲ್ಲಿ AQI ${a} (${l}). ಪ್ರಮುಖ ಮಾಲಿನ್ಯಕಾರಕ: ${p}.`,
    calm: (v) => `ಶಾಂತ ಗಾಳಿ (${v} ಮೀ/ಸೆ) ಕಾರಣ ಮಾಲಿನ್ಯ ನೆಲದ ಬಳಿ ಸಂಗ್ರಹವಾಗುತ್ತಿದೆ.`,
    humid: (h) => `ಹೆಚ್ಚಿನ ತೇವಾಂಶ (${h}%) ಸೂಕ್ಷ್ಮ ಕಣಗಳನ್ನು ನೆಲದ ಬಳಿ ಹಿಡಿದಿಡುತ್ತದೆ.`,
    coarse: (v) => `ಒರಟು ಧೂಳು ಹೆಚ್ಚಾಗಿದೆ (PM10 ${v} µg/m³).`,
    heat: (t) => `ಬಿಸಿ (${t}°C) ಹೊರಗೆ ಕೆಲಸ ಮಾಡುವವರಿಗೂ ವ್ಯಾಯಾಮ ಮಾಡುವವರಿಗೂ ಹೆಚ್ಚುವರಿ ಹೊರೆ.`,
    none: "ಪ್ರಸ್ತುತ AQI ಹೊರತು ಯಾವುದೇ ದೊಡ್ಡ ಅಪಾಯದ ಅಂಶಗಳಿಲ್ಲ.",
    forecast: (f, t) => `24 ಗಂಟೆಗಳಲ್ಲಿ AQI ಸುಮಾರು ${f} ಇರಬಹುದು (${t}).`,
    trends: ["ಏರುತ್ತಿದೆ", "ಇಳಿಯುತ್ತಿದೆ", "ಸ್ಥಿರ"],
    actions: [
      ["ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಆನಂದಿಸಿ.", "ಕಿಟಕಿಗಳನ್ನು ತೆರೆದು ತಾಜಾ ಗಾಳಿ ಬರಲು ಬಿಡಿ."],
      ["ಸಾಮಾನ್ಯ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳು ಸರಿ.", "ಅತಿ ಸೂಕ್ಷ್ಮ ಜನರು ದೀರ್ಘಕಾಲ ಕಠಿಣ ವ್ಯಾಯಾಮ ತಪ್ಪಿಸಿ."],
      ["ಆಸ್ತಮಾ ಅಥವಾ ಹೃದ್ರೋಗ ಇರುವವರು, ಮಕ್ಕಳು, ವೃದ್ಧರು ದೀರ್ಘಕಾಲ ಹೊರಗೆ ಶ್ರಮಿಸಬೇಡಿ.", "ಜನನಿಬಿಡ ರಸ್ತೆಗಳಿಂದ ದೂರದ ಮಾರ್ಗಗಳನ್ನು ಆರಿಸಿ."],
      ["ಹೊರಾಂಗಣ ವ್ಯಾಯಾಮ ಕಡಿಮೆ ಮಾಡಿ.", "ಸೂಕ್ಷ್ಮ ಜನರು ಮನೆಯೊಳಗೇ ಇರಿ.", "ಹೊರಗೆ ಹೋಗಲೇಬೇಕಾದರೆ N95 ಮಾಸ್ಕ್ ಧರಿಸಿ."],
      ["ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆ ತಪ್ಪಿಸಿ.", "N95 ಮಾಸ್ಕ್ ಧರಿಸಿ, ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಇಡಿ.", "ಸಾಧ್ಯವಾದರೆ ಏರ್ ಪ್ಯೂರಿಫೈಯರ್ ಬಳಸಿ."],
      ["ಮನೆಯೊಳಗೇ ಇರಿ.", "ಎಲ್ಲಾ ಹೊರಾಂಗಣ ಶ್ರಮ ತಪ್ಪಿಸಿ.", "ಲಕ್ಷಣಗಳಿದ್ದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ."]
    ]
  }
};

/** Builds the daily brief from the live readings only; nothing here is a fixed claim about a city. */
export function buildDailyBrief(i: BriefInput, lang: string): DailyBrief {
  const pack = PACKS[lang as Lang] ?? PACKS.en;
  const idx = AQI_BANDS.indexOf(aqiBand(i.aqi));

  const keyRisks: string[] = [];
  if (i.wind < 2.5) keyRisks.push(pack.calm(i.wind));
  if (i.humidity > 70) keyRisks.push(pack.humid(Math.round(i.humidity)));
  if (i.pm10 > 100 && i.pm10 > 2 * i.pm2_5) keyRisks.push(pack.coarse(i.pm10));
  if (i.temperature >= 35) keyRisks.push(pack.heat(i.temperature));
  if (!keyRisks.length) keyRisks.push(pack.none);

  const delta = i.forecastAqi - i.aqi;
  const trend = delta > 10 ? pack.trends[0] : delta < -10 ? pack.trends[1] : pack.trends[2];

  return {
    currentSituation: pack.situation(i.ward, i.aqi, pack.bands[idx], mainPollutant(i.pm2_5, i.pm10)),
    keyRisks,
    forecast: pack.forecast(i.forecastAqi, trend),
    recommendedActions: pack.actions[idx]
  };
}
