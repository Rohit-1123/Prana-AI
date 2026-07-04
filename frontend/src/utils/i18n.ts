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
    executeActionLabel: "Transmit Policy Directive",
    executedLabel: "Transmitted",
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
    copilotWelcome: "Hello! I am your Citizen Advisory Agent. Ask me questions about Hyderabad's air quality, safe jogging hours, or clean exposure routes.",
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
    copilotWelcome: "नमस्ते! मैं आपका नागरिक सलाहकार एजेंट हूँ। मुझसे हैदराबाद की वायु गुणवत्ता, सुरक्षित टहलने के घंटे, या स्वच्छ मार्ग के बारे में पूछें।",
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
    copilotWelcome: "నమస్తే! నేను మీ పౌర సలహా ఏజెంట్‌ను. హైదరాబాద్ గాలి నాణ్యత, సురక్షితమైన నడక గంటలు లేదా స్వచ్ఛమైన మార్గాల గురించి నన్ను అడగండి.",
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
    copilotWelcome: "வணக்கம்! நான் உங்கள் குடிமக்கள் ஆலோசனை முகவர். சென்னை காற்று தரம், பாதுகாப்பான நடைப்பயிற்சி நேரங்கள் அல்லது சுத்தமான பாதைகள் பற்றி என்னிடம் கேளுங்கள்.",
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
    copilotWelcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಾಗರಿಕ ಸಲಹಾ ಏಜೆಂಟ್. ಬೆಂಗಳೂರಿನ ಗಾಳಿ ಗುಣಮಟ್ಟ, ಸುರಕ್ಷಿತ ನಡಿಗೆಯ ಸಮಯ ಅಥವಾ ಸ್ವಚ್ಛ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
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

export const localizedCopilotReplies: Record<LanguageCode, { text: string; primaryCause: string; secondaryCause: string; weatherInfluence: string; forecast: string; recommendations: string[]; evidence: string[] }> = {
  en: {
    text: "I have compiled the structured environmental attribution breakdown. Commuter traffic flow peaks and dry wind particulate suspensions are the primary drivers.",
    primaryCause: "Commuter Traffic Congestion",
    secondaryCause: "Building Demolition Activity",
    weatherInfluence: "Dry north-westerly wind vectors delaying dispersals.",
    forecast: "AQI forecasted to rise to 162 AQI by 4:00 PM if no interventions are initiated.",
    recommendations: [
      "Restrict diesel transport near core office junctions.",
      "Deploy localized sprinkler vehicles along the central ring road.",
      "Alert construction site engineers to initiate dust covers."
    ],
    evidence: [
      "Commute junction sensors: 65% capacity",
      "Fugitive dust sensors: PM10 85 µg/m³",
      "Wind telemetry: 5.5 m/s"
    ]
  },
  hi: {
    text: "मैंने संरचित पर्यावरणीय एट्रिब्यूशन विवरण तैयार किया है। आवागमन यातायात शिखर और शुष्क हवा कण निलंबन प्राथमिक चालक हैं।",
    primaryCause: "यातायात भीड़",
    secondaryCause: "भवन विध्वंस गतिविधि",
    weatherInfluence: "शुष्क उत्तर-पश्चिमी हवाएं कणों के बिखराव में देरी कर रही हैं।",
    forecast: "यदि कोई हस्तक्षेप नहीं किया गया, तो शाम 4:00 बजे तक एक्यूआई बढ़कर 162 होने का अनुमान है।",
    recommendations: [
      "मुख्य कार्यालय चौराहों के पास डीजल परिवहन को प्रतिबंधित करें।",
      "केंद्रीय रिंग रोड पर स्थानीयकृत जल छिड़काव वाहन तैनात करें।",
      "निर्माण स्थल इंजीनियरों को धूल कवर शुरू करने के लिए सचेत करें।"
    ],
    evidence: [
      "यातायात सेंसर: 65% क्षमता",
      "धूल सेंसर: पीएम10 85 µg/m³",
      "हवा टेलीमेट्री: 5.5 m/s"
    ]
  },
  te: {
    text: "నేను కాలుష్య కారణాల అట్రిబ్యూషన్ విశ్లేషణను సిద్ధం చేశాను. వాహనాల రద్దీ మరియు పొడి గాలి ప్రభావం దీనికి ప్రధాన కారణాలు.",
    primaryCause: "వాహనాల రద్దీ",
    secondaryCause: "భవనాల నిర్మాణ ధూళి",
    weatherInfluence: "పొడి వాయువ్య గాలుల వల్ల కాలుష్య ధూళి త్వరగా తొలగిపోవడం లేదు.",
    forecast: "ఎటువంటి చర్యలు తీసుకోకపోతే సాయంత్రం 4:00 గంటలకల్లా సూచిక 162 AQI కి పెరిగే అవకాశం ఉంది.",
    recommendations: [
      "ప్రధాన కార్యాలయాల కూడళ్ల వద్ద డీజిల్ రవాణాను నియంత్రించండి.",
      "రింగ్ రోడ్డు పొడవునా నీటిని చల్లే వాహనాలను రంగంలోకి దించండి.",
      "నిర్ಮಾಣ సంస్థలు తప్పనిసరిగా ధూళి నియంత్రణ కవర్లను వాడేలా ఆదేశించండి."
    ],
    evidence: [
      "రద్దీ సెన్సార్లు: 65% సామర్థ్యం",
      "ధూళి సెన్సార్లు: PM10 85 µg/m³",
      "గాలి టెలిమెట్రీ: 5.5 m/s"
    ]
  },
  ta: {
    text: "காற்றின் மாசுபாட்டிற்கான காரணிகளின் ஒப்பீட்டு பகுப்பாய்வை நான் தயாரித்துள்ளேன். போக்குவரத்து நெரிசல் மற்றும் வறண்ட காற்று ஆகியவை முக்கிய காரணங்கள்.",
    primaryCause: "போக்குவரத்து நெரிசல்",
    secondaryCause: "கட்டிட கட்டுமான தூசிகள்",
    weatherInfluence: "வறண்ட வடமேற்கு காற்று துகள்களின் சிதறலைத் தாமதப்படுத்துகிறது.",
    forecast: "தடுப்பு நடவடிக்கைகள் எடுக்கப்படாவிட்டால் மாலை 4:00 மணிக்குள் AQI 162 ஆக உயரக்கூடும்.",
    recommendations: [
      "முக்கிய அலுவலக சந்திப்புகளுக்கு அருகில் டீசல் வாகனங்களை கட்டுப்படுத்தவும்.",
      "ரிங் ரோட்டில் தண்ணீர் தெளிக்கும் வாகனங்களை இயக்கவும்.",
      "கட்டுமானப் பகுதிகளில் தூசுகளை மூடும் உறைகளைப் பயன்படுத்துவதை உறுதி செய்யவும்."
    ],
    evidence: [
      "போக்குவரத்து சென்சார்கள்: 65% கொள்ளளவு",
      "தூசி சென்சார்கள்: PM10 85 µg/m³",
      "காற்று டெலிமெட்ரி: 5.5 m/s"
    ]
  },
  kn: {
    text: "ನಾನು ಮಾಲಿನ್ಯದ ಕಾರಣಗಳ ತುಲನಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಿದ್ದೇನೆ. ವಾಹನ ದಟ್ಟಣೆ ಮತ್ತು ಒಣ ಗಾಳಿಯ ವಾತಾವರಣವೇ ಇದಕ್ಕೆ ಮುಖ್ಯ ಕಾರಣಗಳು.",
    primaryCause: "ವಾಹನ ಸಂಚಾರ ದಟ್ಟಣೆ",
    secondaryCause: "ಕಟ್ಟಡ ಧೂಳು ಮಾಲಿನ್ಯ",
    weatherInfluence: "ಒಣ ವಾಯುವ್ಯ ಮಾರುತಗಳು ಧೂಳಿನ ಕಣಗಳ ಚದುರುವಿಕೆಯನ್ನು ವಿಳಂಬಗೊಳಿಸುತ್ತಿವೆ.",
    forecast: "ಯಾವುದೇ ಕ್ರಮ ಕೈಗೊಳ್ಳದಿದ್ದರೆ ಸಂಜೆ 4:00 ರ ವೇಳೆಗೆ AQI 162 ಕ್ಕೆ ಏರಲಿದೆ.",
    recommendations: [
      "ಮುಖ್ಯ ಕಚೇರಿ ಜಂಕ್ಷನ್‌ಗಳ ಬಳಿ ಡೀಸೆಲ್ ವಾಹನ ಸಂಚಾರವನ್ನು ನಿರ್ಬಂಧಿಸಿ.",
      "ರಿಂಗ್ ರಸ್ತೆಯುದ್ದಕ್ಕೂ ನೀರು ಸಿಂಪಡಿಸುವ ವಾಹನಗಳನ್ನು ನಿಯೋಜಿಸಿ.",
      "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸಂಸ್ಥೆಗಳು ಧೂಳು ತಡೆಯುವ ಪರದೆಗಳನ್ನು ಅಳವಡಿಸಲು ಸೂಚಿಸಿ."
    ],
    evidence: [
      "ಸಂಚಾರ ಸೆನ್ಸರ್‌ಗಳು: 65% ದಟ್ಟಣೆ",
      "ಧೂಳಿನ ಸೆನ್ಸರ್‌ಗಳು: PM10 85 µg/m³",
      "ಗಾಳಿಯ ಟೆಲಿಮೆಟ್ರಿ: 5.5 m/s"
    ]
  }
};
