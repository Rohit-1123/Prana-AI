export type LanguageCode = "en" | "hi" | "te" | "ta" | "kn";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" }
];

export const suggestedLangByCity: Record<string, LanguageCode> = {
  "Hyderabad": "te",
  "Chennai": "ta",
  "Bengaluru": "kn",
  "Bangalore": "kn",
  "Delhi": "hi",
  "Mumbai": "hi"
};

export const uiTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: "Urban Environmental Command Center",
    map: "Hyperlocal Digital Twin",
    prediction: "Hyperlocal AQI Forecast",
    reports: "Environmental Intelligence Reports",
    copilot: "PranaAI Copilot",
    settings: "System Settings",
    
    // Top Bar
    selectCity: "Select City Workspace",
    searchFocus: "Search Focus Ward...",
    sensorsActive: "Sensors Active",
    clock: "Clock",
    classified: "Classified: Executive smart-city briefing",
    
    // Dashboard Card Headers
    dailyBriefTitle: "Today's AI Daily Briefing",
    dailyBriefSub: "City-wide daily environmental overview",
    currentSituationLabel: "Current Situation",
    keyForecastRisksLabel: "Key Forecast Risks",
    causalAdvisoryLabel: "Causal Advisory & Forecast",
    expectedAqiImprovementLabel: "Expected AQI Improvement",
    
    ehsIndexTitle: "Environmental Health Index (EHI)",
    ehsIndexSub: "Weighted exposed safety index scale (cumulative factors)",
    ehsYesterdayLabel: "Yesterday",
    volatileRiskLabel: "Volatile Risk",
    stableConditionsLabel: "Stable Conditions",
    greenCoverLabel: "IT Corridor Green Cover Index",
    humidityLabel: "Ambient Humidity Threshold",
    populationExposureLabel: "Population Exposure Index",
    
    citizenHealthRisksTitle: "Citizen Health Risks",
    citizenHealthRisksSub: "Vulnerability mapping across exposed demographic groups",
    advisoryActiveLabel: "Advisory Active",
    priorityLabel: "Priority",
    forecastTrendLabel: "Forecast Trend",
    recommendationLabel: "AI Recommendation",
    advisoryConfirmedLabel: "Advisory Confirmed",
    aiConfidenceLabel: "AI Conf",
    
    multiCityComparisonTitle: "Multi-City Performance Comparison",
    multiCityComparisonSub: "National smart-city ranking indexes & dynamic forecast profiles",
    reliabilityLabel: "Reliability",
    aqiIndexLabel: "AQI Index",
    forecast24hLabel: "Forecast 24h",
    ehiScoreLabel: "EHI Score",
    risingLabel: "Rising",
    improvingLabel: "Improving",
    
    environmentalScorecardTitle: "Environmental Scorecard",
    environmentalScorecardSub: "City-wide key operational performance statistics",
    globalScoreLabel: "Global Score",
    
    policyImpactTitle: "Policy Impact & Analytics Dashboard",
    policyImpactSub: "Expected target reductions versus actual measured environmental benefits",
    expectedVsMeasuredLabel: "Expected vs Measured Impact",
    budgetCostLabel: "Budget Cost",
    targetTimeLabel: "Target Time",
    successRatioLabel: "Success Ratio",
    
    recommendedActionsTitle: "AI Causal Recommended Directives",
    recommendedActionsSub: "Prescribed environmental control actions with live attribution sandboxing",
    executeActionLabel: "Mark as actioned",
    executedLabel: "Actioned",
    estimatedCostLabel: "Estimated Implementation Budget",
    estimatedTimeLabel: "Est. Mobilization Time",
    impactReductionLabel: "Target Mitigation Impact",
    confidenceIntervalLabel: "Confidence Interval",
    supportingTelemetryLabel: "Supporting Evidence Matrix",
    
    recentActivitiesTitle: "Live Operational Timeline",
    recentActivitiesSub: "Chronological operational ledger of city-wide sensor events",
    systemFeedActive: "Telemetry Feed Active",
    
    // Copilot
    copilotPlaceholder: "Ask PranaAI Copilot about air quality, exposure risks, or policy mitigation...",
    copilotWelcome: "Hello! I am your Citizen Advisory Agent. Ask me about air quality, safe outdoor hours, or cleaner places nearby in any city on PranaAI.",
    explainabilityAttribution: "AI Causal Attribution",
    advisoryInterventions: "Advisory Interventions",
    forecastHorizon: "AI Forecast Horizon",
    copilotSend: "Transmit Command",
    
    // Reports
    generateBriefing: "Generate Executive Report",
    pdfExportLabel: "Generate PDF Export",
    closePreview: "Close Preview",
    sourceAttributionsTitle: "AI Source Attribution Breakdown"
  },
  hi: {
    dashboard: "शहरी पर्यावरण कमान केंद्र",
    map: "अतिस्थानीय डिजिटल ट्विन",
    prediction: "अतिस्थानीय एक्यूआई पूर्वानुमान",
    reports: "पर्यावरण खुफिया रिपोर्ट",
    copilot: "प्राणएआई कोपायलट",
    settings: "सिस्टम सेटिंग्स",
    
    selectCity: "शहर कार्यक्षेत्र चुनें",
    searchFocus: "फोकस वार्ड खोजें...",
    sensorsActive: "सक्रिय सेंसर",
    clock: "घड़ी",
    classified: "गोपनीय: कार्यकारी स्मार्ट-सिटी ब्रीफिंग",
    
    dailyBriefTitle: "आज की एआई दैनिक ब्रीफिंग",
    dailyBriefSub: "शहर-व्यापी दैनिक पर्यावरण अवलोकन",
    currentSituationLabel: "वर्तमान स्थिति",
    keyForecastRisksLabel: "प्रमुख पूर्वानुमान जोखिम",
    causalAdvisoryLabel: "कारण संबंधी सलाह और पूर्वानुमान",
    expectedAqiImprovementLabel: "अपेक्षित एक्यूआई सुधार",
    
    ehsIndexTitle: "पर्यावरण स्वास्थ्य सूचकांक (EHI)",
    ehsIndexSub: "भारित उजागर सुरक्षा सूचकांक पैमाना (संचयी कारक)",
    ehsYesterdayLabel: "कल",
    volatileRiskLabel: "अस्थिर जोखिम",
    stableConditionsLabel: "स्थिर स्थिति",
    greenCoverLabel: "आईटी कॉरिडोर हरित क्षेत्र सूचकांक",
    humidityLabel: "परिवेशी आर्द्रता सीमा",
    populationExposureLabel: "जनसंख्या जोखिम सूचकांक",
    
    citizenHealthRisksTitle: "नागरिक स्वास्थ्य जोखिम",
    citizenHealthRisksSub: "संवेदनशील जनसांख्यिकीय समूहों में जोखिम मानचित्रण",
    advisoryActiveLabel: "सलाह सक्रिय",
    priorityLabel: "प्राथमिकता",
    forecastTrendLabel: "पूर्वानुमान प्रवृत्ति",
    recommendationLabel: "एआई सिफारिश",
    advisoryConfirmedLabel: "सलाह की पुष्टि",
    aiConfidenceLabel: "एआई विश्वास",
    
    multiCityComparisonTitle: "बहु-शहर प्रदर्शन तुलना",
    multiCityComparisonSub: "राष्ट्रीय स्मार्ट-सिटी रैंकिंग सूचकांक और गतिशील पूर्वानुमान प्रोफाइल",
    reliabilityLabel: "विश्वसनीयता",
    aqiIndexLabel: "एक्यूआई सूचकांक",
    forecast24hLabel: "पूर्वानुमान 24 घंटे",
    ehiScoreLabel: "ईएचआई स्कोर",
    risingLabel: "बढ़ रहा है",
    improvingLabel: "सुधार हो रहा है",
    
    environmentalScorecardTitle: "पर्यावरण स्कोरकार्ड",
    environmentalScorecardSub: "शहर-व्यापी प्रमुख परिचालन प्रदर्शन आँकड़े",
    globalScoreLabel: "वैश्विक स्कोर",
    
    policyImpactTitle: "नीति प्रभाव और विश्लेषिकी डैशबोर्ड",
    policyImpactSub: "अपेक्षित लक्ष्य कटौती बनाम वास्तविक मापा गया पर्यावरणीय लाभ",
    expectedVsMeasuredLabel: "अपेक्षित बनाम मापा गया प्रभाव",
    budgetCostLabel: "बजट लागत",
    targetTimeLabel: "लक्षित समय",
    successRatioLabel: "सफलता अनुपात",
    
    recommendedActionsTitle: "एआई कारण अनुशंसित निर्देश",
    recommendedActionsSub: "लाइव एट्रिब्यूशन सैंडबॉक्सिंग के साथ निर्धारित पर्यावरण नियंत्रण कार्य",
    executeActionLabel: "नीति निर्देश प्रसारित करें",
    executedLabel: "प्रसारित किया गया",
    estimatedCostLabel: "अनुमानित कार्यान्वयन बजट",
    estimatedTimeLabel: "अनुमानित समय",
    impactReductionLabel: "लक्षित शमन प्रभाव",
    confidenceIntervalLabel: "विश्वास अंतराल",
    supportingTelemetryLabel: "सहायक साक्ष्य मैट्रिक्स",
    
    recentActivitiesTitle: "लाइव परिचालन समयरेखा",
    recentActivitiesSub: "शहर-व्यापी सेंसर घटनाओं का कालानुक्रमिक परिचालन बहीखाता",
    systemFeedActive: "टेलीमेट्री फीड सक्रिय",
    
    copilotPlaceholder: "वायु गुणवत्ता, जोखिम या नीति शमन के बारे में प्राणएआई कोपायलट से पूछें...",
    copilotWelcome: "नमस्ते! मैं आपका नागरिक सलाहकार एजेंट हूँ। मुझसे किसी भी शहर की वायु गुणवत्ता, बाहर जाने के सुरक्षित समय, या आस-पास की स्वच्छ जगहों के बारे में पूछें।",
    explainabilityAttribution: "एआई कारण एट्रिब्यूशन",
    advisoryInterventions: "सलाहकारी हस्तक्षेप",
    forecastHorizon: "एआई पूर्वानुमान क्षितिज",
    copilotSend: "निर्देश भेजें",
    
    generateBriefing: "कार्यकारी रिपोर्ट तैयार करें",
    pdfExportLabel: "पीडीएफ निर्यात तैयार करें",
    closePreview: "पूर्वावलोकन बंद करें",
    sourceAttributionsTitle: "एआई स्रोत एट्रिब्यूशन विवरण"
  },
  te: {
    dashboard: "పట్టణ పర్యావరణ కమాండ్ సెంటర్",
    map: "హైపర్‌లోకల్ డిజిటల్ ట్విన్",
    prediction: "హైపర్‌లోకల్ AQI అంచనా",
    reports: "పర్యావరణ మేధస్సు నివేదికలు",
    copilot: "ప్రాణAI కోపైలట్",
    settings: "వ్యవస్థ అమరికలు",
    
    selectCity: "నగర వర్క్‌స్పేస్‌ను ఎంచుకోండి",
    searchFocus: "వార్డును శోధించండి...",
    sensorsActive: "సెన్సార్లు యాక్టివ్‌గా ఉన్నాయి",
    clock: "గడియారం",
    classified: "రహస్యం: ఎగ్జిక్యూటివ్ స్మార్ట్-సిటీ బ్రీఫింగ్",
    
    dailyBriefTitle: "నేటి AI రోజువారీ బ్రీఫింగ్",
    dailyBriefSub: "నగరవ్యాప్త రోజువారీ పర్యావరణ అవలోకనం",
    currentSituationLabel: "ప్రస్తుత పరిస్థితి",
    keyForecastRisksLabel: "కీలక అంచనా ప్రమాదాలు",
    causalAdvisoryLabel: "కారణ సూచన & అంచనా",
    expectedAqiImprovementLabel: "ఆశించిన AQI మెరుగుదల",
    
    ehsIndexTitle: "పర్యావరణ ఆరోగ్య సూచిక (EHI)",
    ehsIndexSub: "భారిత బహిర్గత భద్రతా సూచిక స్థాయి (సంచిత కారకాలు)",
    ehsYesterdayLabel: "నిన్న",
    volatileRiskLabel: "అస్థిర ప్రమాదం",
    stableConditionsLabel: "స్థిరమైన పరిస్థితులు",
    greenCoverLabel: "ఐటీ కారిడార్ హరిత విస్తీర్ణ సూచిక",
    humidityLabel: "పరిసర తేమ పరిమితి",
    populationExposureLabel: "జనాభా ఎక్స్‌పోజర్ సూచిక",
    
    citizenHealthRisksTitle: "పౌరుల ఆరోగ్య ప్రమాదాలు",
    citizenHealthRisksSub: "సున్నితమైన జనాభా సమూహాలలో ముప్పు మ్యాపింగ్",
    advisoryActiveLabel: "సూచన యాక్టివ్‌గా ఉంది",
    priorityLabel: "ప్రాధాన్యత",
    forecastTrendLabel: "అంచనా ధోరణి",
    recommendationLabel: "AI సిఫార్సు",
    advisoryConfirmedLabel: "సూచన ధృవీకరించబడింది",
    aiConfidenceLabel: "AI విశ్వాసం",
    
    multiCityComparisonTitle: "బహుళ-నగరాల పనితీరు పోలిక",
    multiCityComparisonSub: "జాతీయ స్మార్ట్-సిటీ ర్యాంకింగ్ సూచీలు & డైనమిక్ అంచనా ప్రొఫైల్‌లు",
    reliabilityLabel: "విశ్వసనీయత",
    aqiIndexLabel: "AQI సూచిక",
    forecast24hLabel: "24 గంటల అంచనా",
    ehiScoreLabel: "EHI స్కోరు",
    risingLabel: "పెరుగుతోంది",
    improvingLabel: "మెరుగవుతోంది",
    
    environmentalScorecardTitle: "పర్యావరణ స్కోర్‌కార్డ్",
    environmentalScorecardSub: "నగరవ్యాప్త కీలక కార్యాచరణ పనితీరు గణాంకాలు",
    globalScoreLabel: "గ్లోబల్ స్కోరు",
    
    policyImpactTitle: "విధాన ప్రభావం & అనలిటిక్స్ డాష్‌బోర్డ్",
    policyImpactSub: "ఆశించిన లక్ష్య తగ్గింపులు వర్సెస్ వాస్తవ పర్యావరణ ప్రయోజనాలు",
    expectedVsMeasuredLabel: "ఆశించిన వర్సెస్ కొలవబడిన ప్రభావం",
    budgetCostLabel: "బడ్జెట్ ఖర్చు",
    targetTimeLabel: "లక్ష్య సమయం",
    successRatioLabel: "విజయ నిష్పత్తి",
    
    recommendedActionsTitle: "AI కారణ సిఫార్సు చేయబడిన ఆదేశాలు",
    recommendedActionsSub: "లైవ్ అట్రిబ్యూషన్ శాండ్‌బాక్సింగ్‌తో సూచించబడిన పర్యావరణ నియంత్రణ చర్యలు",
    executeActionLabel: "విధాన ఆదేశాన్ని ప్రసారం చేయి",
    executedLabel: "ప్రసారం చేయబడింది",
    estimatedCostLabel: "అంచనా వ్యయం",
    estimatedTimeLabel: "అంచనా సమయం",
    impactReductionLabel: "లక్ష్య కాలుష్య తగ్గింపు",
    confidenceIntervalLabel: "విశ్వాస విరామం",
    supportingTelemetryLabel: "సహాయక సాక్ష్యాల మాతృక",
    
    recentActivitiesTitle: "లైవ్ కార్యాచరణ కాలక్రమం",
    recentActivitiesSub: "నగరవ్యాప్త సెన్సార్ ఈవెంట్‌ల కార్యాచరణ లెడ్జర్",
    systemFeedActive: "టెలిమెట్రీ ఫీడ్ యాక్టివ్‌గా ఉంది",
    
    copilotPlaceholder: "గాలి నాణ్యత, ప్రమాదాలు లేదా విధానాల గురించి ప్రాణAI కోపైలట్‌ను అడగండి...",
    copilotWelcome: "నమస్తే! నేను మీ పౌర సలహా ఏజెంట్‌ను. ఏ నగరంలోనైనా గాలి నాణ్యత, బయటకు వెళ్ళడానికి సురక్షితమైన సమయం లేదా దగ్గరలోని స్వచ్ఛమైన ప్రాంతాల గురించి నన్ను అడగండి.",
    explainabilityAttribution: "AI కారణ అట్రిబ్యూషన్",
    advisoryInterventions: "సలహా జోక్యాలు",
    forecastHorizon: "AI అంచనా పరిధి",
    copilotSend: "ఆదేశం పంపు",
    
    generateBriefing: "ఎగ్జిక్యూటివ్ నివేదికను రూపొందించు",
    pdfExportLabel: "PDF ఎగుమతిని రూపొందించు",
    closePreview: "మునుజూపు మూసివేయి",
    sourceAttributionsTitle: "AI మూల అట్రిబ్యూషన్ వివరాలు"
  },
  ta: {
    dashboard: "நகர்ப்புற சுற்றுச்சூழல் கட்டளை மையம்",
    map: "ஹைப்பர்லோகல் டிஜிட்டல் ட்வின்",
    prediction: "ஹைப்பர்லோகல் AQI முன்னறிவிப்பு",
    reports: "சுற்றுச்சூழல் நுண்ணறிவு அறிக்கைகள்",
    copilot: "பிராணாஏஐ கோபைலட்",
    settings: "அமைப்புகள்",
    
    selectCity: "நகர பணிப்பகுதியைத் தேர்ந்தெடுக்கவும்",
    searchFocus: "வார்டைத் தேடுங்கள்...",
    sensorsActive: "சென்சார்கள் செயலில் உள்ளன",
    clock: "கடிகாரம்",
    classified: "ரகசியம்: நிர்வாக ஸ்மார்ட்-சிட்டி விளக்கக்காட்சி",
    
    dailyBriefTitle: "இன்றைய AI தினசரி அறிக்கை",
    dailyBriefSub: "நகரம் தழுவிய தினசரி சுற்றுச்சூழல் கண்ணோட்டம்",
    currentSituationLabel: "தற்போதைய நிலை",
    keyForecastRisksLabel: "முக்கிய முன்னறிவிப்பு அபாயங்கள்",
    causalAdvisoryLabel: "காரண ஆலோசனை & முன்னறிவிப்பு",
    expectedAqiImprovementLabel: "எதிர்பார்க்கப்படும் AQI முன்னேற்றம்",
    
    ehsIndexTitle: "சுற்றுச்சூழல் சுகாதார குறியீடு (EHI)",
    ehsIndexSub: "எடைபோடப்பட்ட பாதுகாப்பு குறியீடு அளவு (ஒட்டுமொத்த காரணிகள்)",
    ehsYesterdayLabel: "நேற்று",
    volatileRiskLabel: "அபாயகரமான நிலை",
    stableConditionsLabel: "நிலையான நிலைமைகள்",
    greenCoverLabel: "பசுமை பரப்பு குறியீடு",
    humidityLabel: "சுற்றுப்புற ஈரப்பதம் வரம்பு",
    populationExposureLabel: "மக்கள் தொகை வெளிப்பாடு குறியீடு",
    
    citizenHealthRisksTitle: "குடிமக்கள் சுகாதார அபாயங்கள்",
    citizenHealthRisksSub: "பாதிக்கப்படக்கூடிய மக்கள்தொகை குழுக்களின் இடர் வரைபடம்",
    advisoryActiveLabel: "அறிவுரை செயலில் உள்ளது",
    priorityLabel: "முன்னுரிமை",
    forecastTrendLabel: "முன்னறிவிப்பு போக்கு",
    recommendationLabel: "AI பரிந்துரை",
    advisoryConfirmedLabel: "அறிவுரை உறுதிப்படுத்தப்பட்டது",
    aiConfidenceLabel: "AI நம்பிக்கை",
    
    multiCityComparisonTitle: "பல நகரங்களின் செயல்திறன் ஒப்பீடு",
    multiCityComparisonSub: "தேசிய ஸ்மார்ட்-சிட்டி தரவரிசை குறியீடுகள் & மாறும் முன்னறிவிப்பு சுயவிவரங்கள்",
    reliabilityLabel: "நம்பகத்தன்மை",
    aqiIndexLabel: "AQI குறியீடு",
    forecast24hLabel: "24 மணி நேர முன்னறிவிப்பு",
    ehiScoreLabel: "EHI மதிப்பெண்",
    risingLabel: "அதிகரிக்கிறது",
    improvingLabel: "மேம்படுகிறது",
    
    environmentalScorecardTitle: "சுற்றுச்சூழல் மதிப்பெண் அட்டை",
    environmentalScorecardSub: "நகரம் தழுவிய முக்கிய செயல்பாட்டு செயல்திறன் புள்ளிவிவரங்கள்",
    globalScoreLabel: "ஒட்டுமொத்த மதிப்பெண்",
    
    policyImpactTitle: "கொள்கை தாக்கம் & பகுப்பாய்வு டாஷ்போர்டு",
    policyImpactSub: "எதிர்பார்க்கப்படும் இலக்கு குறைப்புகள் மற்றும் உண்மையான சுற்றுச்சூழல் நன்மைகள்",
    expectedVsMeasuredLabel: "எதிர்பார்க்கப்படும் மற்றும் அளவிடப்பட்ட தாக்கம்",
    budgetCostLabel: "பட்ஜெட் செலவு",
    targetTimeLabel: "இலக்கு நேரம்",
    successRatioLabel: "வெற்றி விகிதம்",
    
    recommendedActionsTitle: "AI காரண பரிந்துரைக்கப்பட்ட வழிகாட்டுதல்கள்",
    recommendedActionsSub: "நேரடி பண்புக்கூறு சாண்ட்பாக்ஸுடன் பரிந்துரைக்கப்பட்ட சுற்றுச்சூழல் கட்டுப்பாட்டு நடவடிக்கைகள்",
    executeActionLabel: "கொள்கை வழிகாட்டுதலை அனுப்பு",
    executedLabel: "அனுப்பப்பட்டது",
    estimatedCostLabel: "மதிப்பிடப்பட்ட செலவு",
    estimatedTimeLabel: "மதிப்பிடப்பட்ட நேரம்",
    impactReductionLabel: "இலக்கு தணிப்பு தாக்கம்",
    confidenceIntervalLabel: "நம்பிக்கை இடைவெளி",
    supportingTelemetryLabel: "ஆதார மேட்ரிக்ஸ்",
    
    recentActivitiesTitle: "நேரடி செயல்பாட்டு காலவரிசை",
    recentActivitiesSub: "நகரம் தழுவிய சென்சார் நிகழ்வுகளின் செயல்பாட்டு பதிவேடு",
    systemFeedActive: "டெலிமெட்ரி ஃபீட் செயலில் உள்ளது",
    
    copilotPlaceholder: "காற்று தரம், பாதிப்புகள் அல்லது கொள்கைகள் பற்றி பிராணாஏஐ கோபைலட்டிடம் கேளுங்கள்...",
    copilotWelcome: "வணக்கம்! நான் உங்கள் குடிமக்கள் ஆலோசனை முகவர். எந்த நகரத்தின் காற்று தரம், வெளியே செல்ல பாதுகாப்பான நேரம் அல்லது அருகிலுள்ள சுத்தமான இடங்கள் பற்றி என்னிடம் கேளுங்கள்.",
    explainabilityAttribution: "AI காரண பண்புக்கூறு",
    advisoryInterventions: "ஆலோசனை தலையீடுகள்",
    forecastHorizon: "AI முன்னறிவிப்பு வரம்பு",
    copilotSend: "அனுப்பு",
    
    generateBriefing: "அறிக்கையை உருவாக்கு",
    pdfExportLabel: "PDF ஏற்றுமதியை உருவாக்கு",
    closePreview: "மூடு",
    sourceAttributionsTitle: "AI மூல பண்புக்கூறு விவரங்கள்"
  },
  kn: {
    dashboard: "ನಗರ ಪರಿಸರ ಕಮಾಂಡ್ ಸೆಂಟರ್",
    map: "ಹೈಪರ್ಲೋಕಲ್ ಡಿಜಿಟಲ್ ಟ್ವಿನ್",
    prediction: "ಹೈಪರ್ಲೋಕಲ್ AQI ಮುನ್ಸೂಚನೆ",
    reports: "ಪರಿಸರ ಗುಪ್ತಚರ ವರದಿಗಳು",
    copilot: "ಪ್ರಾಣಎಐ ಕೊಪೈಲಟ್",
    settings: "ವ್ಯವಸ್ಥೆಯ ಸೆಟ್ಟಿಂಗ್ಗಳು",
    
    selectCity: "ನಗರದ ಕಾರ್ಯಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    searchFocus: "ವಾರ್ಡ್ ಹುಡುಕಿ...",
    sensorsActive: "ಸಂವೇದಕಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
    clock: "ಗಡಿಯಾರ",
    classified: "ಗೋಪ್ಯ: ಕಾರ್ಯನಿರ್ವಾಹಕ ಸ್ಮಾರ್ಟ್-ಸಿಟಿ ಬ್ರೀಫಿಂಗ್",
    
    dailyBriefTitle: "ಇಂದಿನ AI ದೈನಂದಿನ ಬ್ರೀಫಿಂಗ್",
    dailyBriefSub: "ನಗರದಾದ್ಯಂತ ದೈನಂದಿನ ಪರಿಸರ ಅವಲೋಕನ",
    currentSituationLabel: "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ",
    keyForecastRisksLabel: "ಪ್ರಮುಖ ಮುನ್ಸೂಚನೆ ಅಪಾಯಗಳು",
    causalAdvisoryLabel: "ಕಾರಣ ಸೂಕ್ತ ಸಲಹೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
    expectedAqiImprovementLabel: "ನಿರೀಕ್ಷಿತ AQI ಸುಧಾರಣೆ",
    
    ehsIndexTitle: "ಪರಿಸರ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ (EHI)",
    ehsIndexSub: "ಭಾರಿತ ಬಹಿರಂಗ ಸುರಕ್ಷತೆ ಸೂಚ್ಯಂಕ ಪ್ರಮಾಣ (ಸಂಚಿತ ಅಂಶಗಳು)",
    ehsYesterdayLabel: "ನಿನ್ನೆ",
    volatileRiskLabel: "ಅಸ್ಥಿರ ಅಪಾಯ",
    stableConditionsLabel: "ಸ್ಥಿರ ಪರಿಸ್ಥಿತಿಗಳು",
    greenCoverLabel: "ಹಸಿರು ವಲಯ ಸೂಚ್ಯಂಕ",
    humidityLabel: "ಸುತ್ತಲಿನ ಆರ್ದ್ರತೆ ಮಿತಿ",
    populationExposureLabel: "ಜನಸಂಖ್ಯೆಯ ಮಾನ್ಯತೆ ಸೂಚ್ಯಂಕ",
    
    citizenHealthRisksTitle: "ನಾಗರಿಕರ ಆರೋಗ್ಯ ಅಪಾಯಗಳು",
    citizenHealthRisksSub: "ಸೂಕ್ಷ್ಮ ಜನಸಂಖ್ಯಾ ಗುಂಪುಗಳಲ್ಲಿ ಅಪಾಯದ ಮ್ಯಾಪಿಂಗ್",
    advisoryActiveLabel: "ಸಲಹೆ ಸಕ್ರಿಯವಾಗಿದೆ",
    priorityLabel: "ಆದ್ಯತೆ",
    forecastTrendLabel: "ಮುನ್ಸೂಚನೆ ಪ್ರವೃತ್ತಿ",
    recommendationLabel: "AI ಶಿಫಾರಸು",
    advisoryConfirmedLabel: "ಸಲಹೆ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    aiConfidenceLabel: "AI ವಿಶ್ವಾಸ",
    
    multiCityComparisonTitle: "ಬಹು-ನಗರಗಳ ಕಾರ್ಯಕ್ಷಮತೆ ಹೋಲಿಕೆ",
    multiCityComparisonSub: "ರಾಷ್ಟ್ರೀಯ ಸ್ಮಾರ್ಟ್-ಸಿಟಿ ಶ್ರೇಯಾಂಕ ಸೂಚ್ಯಂಕಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆ ಪ್ರೊಫೈಲ್‌ಗಳು",
    reliabilityLabel: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    aqiIndexLabel: "AQI ಸೂಚ್ಯಂಕ",
    forecast24hLabel: "24 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ",
    ehiScoreLabel: "EHI ಸ್ಕೋರ್",
    risingLabel: "ಹೆಚ್ಚುತ್ತಿದೆ",
    improvingLabel: "ಸುಧಾರಿಸುತ್ತಿದೆ",
    
    environmentalScorecardTitle: "ಪರಿಸರ ಸ್ಕೋರ್‌ಕಾರ್ಡ್",
    environmentalScorecardSub: "ನಗರದಾದ್ಯಂತ ಪ್ರಮುಖ ಕಾರ್ಯಾಚರಣೆಯ ಪ್ರದರ್ಶನ ಅಂಕಿಅಂಶಗಳು",
    globalScoreLabel: "ಜಾಗತಿಕ ಸ್ಕೋರ್",
    
    policyImpactTitle: "ವಿಧಾನ ಪ್ರಭಾವ ಮತ್ತು ಅನಾಲಿಟಿಕ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    policyImpactSub: "ನಿರೀಕ್ಷಿತ ಗುರಿ ಕಡಿತಗಳು ವರ್ಸಸ್ ನಿಜವಾದ ಪರಿಸರ ಪ್ರಯೋಜನಗಳು",
    expectedVsMeasuredLabel: "ನಿರೀಕ್ಷಿತ ವರ್ಸಸ್ ಅಳತೆ ಮಾಡಿದ ಪ್ರಭಾವ",
    budgetCostLabel: "ಬಜೆಟ್ ವೆಚ್ಚ",
    targetTimeLabel: "ಗುರಿ ಸಮಯ",
    successRatioLabel: "ಯಶಸ್ಸಿನ ಅನುಪಾತ",
    
    recommendedActionsTitle: "AI ಶಿಫಾರಸು ಮಾಡಿದ ನಿರ್ದೇಶನಗಳು",
    recommendedActionsSub: "ಲೈವ್ ಅಟ್ರಿಬ್ಯೂಷನ್ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸಿಂಗ್‌ನೊಂದಿಗೆ ಪರಿಸರ ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು",
    executeActionLabel: "ವಿಧಾನ ಆದೇಶವನ್ನು ರವಾನಿಸು",
    executedLabel: "ರವಾನಿಸಲಾಗಿದೆ",
    estimatedCostLabel: "ಅಂದಾಜು ವೆಚ್ಚ",
    estimatedTimeLabel: "ಅಂದಾಜು ಸಮಯ",
    impactReductionLabel: "ಗುರಿ ಮಾಲಿನ್ಯ ಕಡಿತ",
    confidenceIntervalLabel: "ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮಧ್ಯಂತರ",
    supportingTelemetryLabel: "ಸಹಾಯಕ ಪುರಾವೆಗಳ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    
    recentActivitiesTitle: "ಲೈವ್ ಕಾರ್ಯಾಚರಣೆಯ ಟೈಮ್‌ಲೈನ್",
    recentActivitiesSub: "ನಗರದಾದ್ಯಂತದ ಸಂವೇದಕ ಘಟನೆಗಳ ಕಾಲಾನುಕ್ರಮದ ಕಾರ್ಯಾಚರಣೆಯ ವಹಿ",
    systemFeedActive: "ಟೆಲಿಮೆಟ್ರಿ ಫೀಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    
    copilotPlaceholder: "ಗಾಳಿಯ ಗುಣಮಟ್ಟ, ಅಪಾಯಗಳು ಅಥವಾ ನೀತಿಗಳ ಬಗ್ಗೆ ಪ್ರಾಣಎಐ ಕೊಪೈಲಟ್‌ರನ್ನು ಕೇಳಿ...",
    copilotWelcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಾಗರಿಕ ಸಲಹಾ ಏಜೆಂಟ್. ಯಾವುದೇ ನಗರದ ಗಾಳಿ ಗುಣಮಟ್ಟ, ಹೊರಗೆ ಹೋಗಲು ಸುರಕ್ಷಿತ ಸಮಯ ಅಥವಾ ಹತ್ತಿರದ ಸ್ವಚ್ಛ ಸ್ಥಳಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
    explainabilityAttribution: "AI ಕಾರಣ ಅಟ್ರಿಬ್ಯೂಷನ್",
    advisoryInterventions: "ಸಲಹಾ ಮಧ್ಯಸ್ಥಿಕೆಗಳು",
    forecastHorizon: "AI ಮುನ್ಸೂಚನೆ ವ್ಯಾಪ್ತಿ",
    copilotSend: "ಆದೇಶ ಕಳುಹಿಸು",
    
    generateBriefing: "ವರದಿ ಸಿದ್ಧಪಡಿಸು",
    pdfExportLabel: "PDF ರಫ್ತು ಮಾಡಿ",
    closePreview: "ಮುಚ್ಚು",
    sourceAttributionsTitle: "AI ಮೂಲ ಅಟ್ರಿಬ್ಯೂಷನ್ ವಿವರಗಳು"
  }
};

// ==========================================
// REGIONAL AI CONTENT TRANSLATIONS (DEMO DATA)
// ==========================================

export interface LocalizedBrief {
  currentSituation: string;
  keyRisks: string[];
  forecast: string;
  recommendedActions: string[];
}

export const localizedBriefs: Record<LanguageCode, LocalizedBrief> = {
  en: {
    currentSituation: "Air quality aggregates in focus sectors remain moderate under calm commute winds.",
    keyRisks: [
      "High commuter traffic soot near office corridors during peak commute hours.",
      "Calm evening wind vectors delay particulate dispersion cycles."
    ],
    forecast: "XGBoost lead predictions indicate particulate levels peaking near 146 AQI over 24 hours.",
    recommendedActions: [
      "Divert heavy diesel vehicles from central ring road outer lanes.",
      "Increase localized water sprinkling near construction sites."
    ]
  },
  hi: {
    currentSituation: "शांत आवागमन हवाओं के तहत मुख्य क्षेत्रों में वायु गुणवत्ता मध्यम बनी हुई है।",
    keyRisks: [
      "व्यस्त समय के दौरान कार्यालय गलियारों के पास उच्च आवागमन यातायात कालिख।",
      "शांत शाम की हवा के झोंके कणों के फैलाव चक्र में देरी करते हैं।"
    ],
    forecast: "एक्सजीबूस्ट भविष्यवाणियां संकेत देती हैं कि 24 घंटों में कणों का स्तर 146 एक्यूआई के करीब पहुंच जाएगा।",
    recommendedActions: [
      "वाणिज्यिक भारी डीजल वाहनों को रिंग रोड की बाहरी लेन से डायवर्ट करें।",
      "निर्माण स्थलों के पास स्थानीयकृत पानी के छिड़काव को बढ़ाएं।"
    ]
  },
  te: {
    currentSituation: "ప్రశాంతమైన గాలి వీస్తుండటంతో ప్రధాన కార్యాలయ ప్రాంతాలలో గాలి నాణ్యత సాధారణ స్థాయిలోనే ఉంది.",
    keyRisks: [
      "కార్యాలయాలకు వెళ్లే రద్దీ సమయాల్లో జంక్షన్ల వద్ద వాహన కాలుష్యం ఎక్కువగా ఉంటోంది.",
      "సాయంత్రం వేళల్లో గాలి వేగం తగ్గడం వల్ల గాలిలోని ధూళి కణాలు త్వరగా తొలగిపోవడం లేదు."
    ],
    forecast: "XGBoost మోడల్ అంచనాల ప్రకారం రాబోయే 24 గంటల్లో గాలి కాలుష్య సూచిక 146 AQI కి పెరిగే అవకాశం ఉంది.",
    recommendedActions: [
      "ప్రధాన జంక్షన్ల గుండా వెళ్లే భారీ డీజిల్ వాహనాలను బైపాస్ రోడ్లపైకి మళ్లించండి.",
      "నిర్ಮಾಣ పనులు జరుగుతున్న ప్రాంతాల వద్ద నీటిని చల్లడం మరింత పెంచండి."
    ]
  },
  ta: {
    currentSituation: "அமைதியான காற்று வீசுவதால் முக்கிய பகுதிகளில் காற்றின் தரம் நடுத்தர அளவில் உள்ளது.",
    keyRisks: [
      "அலுவலக நேரங்களில் சந்திப்புகளில் வாகன புகைக்கரி மாசுபாடு அதிகமாக உள்ளது.",
      "மாலை நேரத்தில் காற்றின் வேகம் குறைவதால் காற்றில் உள்ள தூசிகள் எளிதில் கலைவதில்லை."
    ],
    forecast: "XGBoost கணிப்புகளின்படி அடுத்த 24 மணிநேரத்தில் காற்றின் தரம் 146 AQI ஆக உயர வாய்ப்புள்ளது.",
    recommendedActions: [
      "ரிங் റോಡ್ வெளிப்புற பாதைகளில் கனரக டீசல் வாகனங்களை திருப்பிவிடவும்.",
      "கட்டுமானப் பகுதிகள் அருகில் நீர் தெளிப்பதை அதிகரிக்கவும்."
    ]
  },
  kn: {
    currentSituation: "ಶಾಂತ ಗಾಳಿಯ ವಾತಾವರಣದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಪ್ರಮುಖ ಕಚೇರಿ ವಲಯಗಳಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟವು ಸಾಧಾರಣ ಮಟ್ಟದಲ್ಲಿದೆ.",
    keyRisks: [
      "ಕಚೇರಿ ಸಮಯದ ರದ್ದಿಯ ಸಂದರ್ಭದಲ್ಲಿ ಜಂಕ್ಷನ್‌ಗಳ ಬಳಿ ವಾಹನಗಳ ಹೊಗೆಯ ಪ್ರಮಾಣ ಹೆಚ್ಚು.",
      "ಸಂಜೆಯ ಶಾಂತ ಗಾಳಿಯು ಧೂಳಿನ ಕಣಗಳ ಚದುರುವಿಕೆಯನ್ನು ವಿಳಂಬಗೊಳಿಸುತ್ತದೆ."
    ],
    forecast: "XGBoost ಮುನ್ಸೂಚನೆಗಳ ಪ್ರಕಾರ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ಮಾಲಿನ್ಯ ಸೂಚ್ಯಂಕವು 146 AQI ಗೆ ಏರುವ ಸಾಧ್ಯತೆಯಿದೆ.",
    recommendedActions: [
      "ರಿಂಗ್ ರಸ್ತೆಯ ಹೊರ ಪಥಗಳಿಂದ ವಾಣಿಜ್ಯ ಡೀಸೆಲ್ ವಾಹನಗಳನ್ನು ಬೇರೆಡೆಗೆ ತಿರುಗಿಸಿ.",
      "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸ್ಥಳಗಳ ಬಳಿ ಸ್ಥಳೀಯವಾಗಿ ನೀರಿನ ಸಿಂಪಡಣೆಯನ್ನು ಹೆಚ್ಚಿಸಿ."
    ]
  }
};


export const localizedBootSteps: Record<"en" | "hi" | "te" | "ta" | "kn", string[]> = {
  en: [
    "Initializing Platform",
    "Connecting AQI Services",
    "Connecting Weather Network",
    "Loading Environmental Intelligence",
    "Preparing Digital Twin",
    "Loading Forecast Engine",
    "Preparing AI Copilot",
    "Finalizing Mission Control"
  ],
  hi: [
    "प्लेटफ़ॉर्म प्रारंभ किया जा रहा है",
    "एक्यूआई सेवाओं को जोड़ा जा रहा है",
    "मौसम नेटवर्क को जोड़ा जा रहा है",
    "पर्यावरणीय खुफिया लोड की जा रही है",
    "डिजिटल ट्विन तैयार किया जा रहा है",
    "पूर्वानुमान इंजन लोड किया जा रहा है",
    "एआई सह-पायलट तैयार किया जा रहा है",
    "मिशन कंट्रोल अंतिम रूप दिया जा रहा है"
  ],
  te: [
    "ప్లాట్‌ఫారమ్‌ను ప్రారంభించడం",
    "AQI సేవలను కనెక్ట్ చేయడం",
    "వాతావరణ నెట్‌వర్క్‌ను కనెక్ట్ చేయడం",
    "పర్యావరణ మేధస్సును లోడ్ చేయడం",
    "డిజిటల్ ట్విన్ సిద్ధం చేయడం",
    "అంచనా ఇంజిన్‌ను లోడ్ చేయడం",
    "AI కోపైలట్‌ను సిద్ధం చేయడం",
    "మిషన్ కంట్రోల్‌ను ఖరారు చేయడం"
  ],
  ta: [
    "தளத்தை துவக்குகிறது",
    "ஏக்யூஐ சேவைகளை இணைக்கிறது",
    "வானிலை நெட்வொர்க்கை இணைக்கிறது",
    "சுற்றுச்சூழல் நுண்ணறிவை ஏற்றுகிறது",
    "டிஜிட்டல் இரட்டையை தயார் செய்கிறது",
    "முன்னறிவிப்பு இயந்திரத்தை ஏற்றுகிறது",
    "ஏஐ கோபைலட்டை தயார் செய்கிறது",
    "மிஷன் கட்டுப்பாட்டை இறுதி செய்கிறது"
  ],
  kn: [
    "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ",
    "ಎಕ್ಯೂಐ ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ",
    "ಹವಾಮಾನ ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ",
    "ಪರಿಸರ ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",
    "ಡಿಜಿನಲ್ ಟ್ವಿನ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ",
    "ಮುನ್ಸೂಚನೆ ಎಂಜಿನ್ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",
    "ಎಐ ಸಹ-ಪೈಲಟ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ",
    "ಮಿಷನ್ ಕಂಟ್ರೋಲ್ ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ"
  ]
};

// Short labels for the navigation rail and dashboard hero.
// ponytail: machine-assisted translations, have a native speaker review hi/te/ta/kn
const shellStrings: Record<LanguageCode, Record<string, string>> = {
  en: {
    navHome: "Overview", navMap: "City Twin", navForecast: "Forecast", navReports: "Reports",
    navCopilot: "Copilot", navSettings: "Settings", navAbout: "About", navMore: "More",
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    aqiNow: "Air quality index", forecastFor: "Forecast", nowLabel: "Now",
    outlookTitle: "72-hour outlook", sourcesTitle: "What's driving it", citiesTitle: "Cities",
    healthTitle: "Environmental health", nextActionTitle: "Next best action",
    askCopilot: "Ask Copilot", openForecast: "Open forecast", openMap: "Open city twin", simulate: "Simulate",
    mapTitle: "Live city twin", insightsTitle: "Intelligence briefings", searchShort: "Search wards",
  },
  hi: {
    navHome: "अवलोकन", navMap: "सिटी ट्विन", navForecast: "पूर्वानुमान", navReports: "रिपोर्ट",
    navCopilot: "कोपायलट", navSettings: "सेटिंग्स", navAbout: "परिचय", navMore: "अधिक",
    greetMorning: "सुप्रभात", greetAfternoon: "नमस्कार", greetEvening: "शुभ संध्या",
    aqiNow: "वायु गुणवत्ता सूचकांक", forecastFor: "पूर्वानुमान", nowLabel: "अभी",
    outlookTitle: "72 घंटे का अनुमान", sourcesTitle: "मुख्य कारण", citiesTitle: "शहर",
    healthTitle: "पर्यावरणीय स्वास्थ्य", nextActionTitle: "अगला सर्वोत्तम कदम",
    askCopilot: "कोपायलट से पूछें", openForecast: "पूर्वानुमान खोलें", openMap: "सिटी ट्विन खोलें", simulate: "सिमुलेट करें",
    mapTitle: "लाइव सिटी ट्विन", insightsTitle: "इंटेलिजेंस ब्रीफिंग", searchShort: "वार्ड खोजें",
  },
  te: {
    navHome: "అవలోకనం", navMap: "సిటీ ట్విన్", navForecast: "అంచనా", navReports: "నివేదికలు",
    navCopilot: "కోపైలట్", navSettings: "సెట్టింగ్‌లు", navAbout: "గురించి", navMore: "మరిన్ని",
    greetMorning: "శుభోదయం", greetAfternoon: "నమస్కారం", greetEvening: "శుభ సాయంత్రం",
    aqiNow: "గాలి నాణ్యత సూచిక", forecastFor: "అంచనా", nowLabel: "ఇప్పుడు",
    outlookTitle: "72 గంటల అంచనా", sourcesTitle: "ప్రధాన కారణాలు", citiesTitle: "నగరాలు",
    healthTitle: "పర్యావరణ ఆరోగ్యం", nextActionTitle: "తదుపరి ఉత్తమ చర్య",
    askCopilot: "కోపైలట్‌ను అడగండి", openForecast: "అంచనా తెరవండి", openMap: "సిటీ ట్విన్ తెరవండి", simulate: "సిమ్యులేట్",
    mapTitle: "లైవ్ సిటీ ట్విన్", insightsTitle: "ఇంటెలిజెన్స్ బ్రీఫింగ్‌లు", searchShort: "వార్డులను వెతకండి",
  },
  ta: {
    navHome: "மேலோட்டம்", navMap: "நகர இரட்டை", navForecast: "முன்னறிவிப்பு", navReports: "அறிக்கைகள்",
    navCopilot: "கோபைலட்", navSettings: "அமைப்புகள்", navAbout: "பற்றி", navMore: "மேலும்",
    greetMorning: "காலை வணக்கம்", greetAfternoon: "வணக்கம்", greetEvening: "மாலை வணக்கம்",
    aqiNow: "காற்று தரக் குறியீடு", forecastFor: "முன்னறிவிப்பு", nowLabel: "இப்போது",
    outlookTitle: "72 மணிநேர முன்னோக்கு", sourcesTitle: "முக்கிய காரணங்கள்", citiesTitle: "நகரங்கள்",
    healthTitle: "சுற்றுச்சூழல் ஆரோக்கியம்", nextActionTitle: "அடுத்த சிறந்த நடவடிக்கை",
    askCopilot: "கோபைலட்டிடம் கேளுங்கள்", openForecast: "முன்னறிவிப்பைத் திற", openMap: "நகர இரட்டையைத் திற", simulate: "உருவகப்படுத்து",
    mapTitle: "நேரடி நகர இரட்டை", insightsTitle: "நுண்ணறிவு சுருக்கங்கள்", searchShort: "வார்டுகளைத் தேடு",
  },
  kn: {
    navHome: "ಅವಲೋಕನ", navMap: "ಸಿಟಿ ಟ್ವಿನ್", navForecast: "ಮುನ್ಸೂಚನೆ", navReports: "ವರದಿಗಳು",
    navCopilot: "ಕೋಪೈಲಟ್", navSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", navAbout: "ಕುರಿತು", navMore: "ಇನ್ನಷ್ಟು",
    greetMorning: "ಶುಭೋದಯ", greetAfternoon: "ನಮಸ್ಕಾರ", greetEvening: "ಶುಭ ಸಂಜೆ",
    aqiNow: "ಗಾಳಿ ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ", forecastFor: "ಮುನ್ಸೂಚನೆ", nowLabel: "ಈಗ",
    outlookTitle: "72 ಗಂಟೆಗಳ ಮುನ್ನೋಟ", sourcesTitle: "ಪ್ರಮುಖ ಕಾರಣಗಳು", citiesTitle: "ನಗರಗಳು",
    healthTitle: "ಪರಿಸರ ಆರೋಗ್ಯ", nextActionTitle: "ಮುಂದಿನ ಉತ್ತಮ ಕ್ರಮ",
    askCopilot: "ಕೋಪೈಲಟ್ ಕೇಳಿ", openForecast: "ಮುನ್ಸೂಚನೆ ತೆರೆಯಿರಿ", openMap: "ಸಿಟಿ ಟ್ವಿನ್ ತೆರೆಯಿರಿ", simulate: "ಸಿಮ್ಯುಲೇಟ್",
    mapTitle: "ಲೈವ್ ಸಿಟಿ ಟ್ವಿನ್", insightsTitle: "ಇಂಟೆಲಿಜೆನ್ಸ್ ಬ್ರೀಫಿಂಗ್‌ಗಳು", searchShort: "ವಾರ್ಡ್‌ಗಳನ್ನು ಹುಡುಕಿ",
  },
};
(Object.keys(shellStrings) as LanguageCode[]).forEach((l) => Object.assign(uiTranslations[l], shellStrings[l]));
