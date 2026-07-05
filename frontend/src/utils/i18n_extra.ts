import { type LanguageCode } from "./i18n";

export const extraTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // ExecutiveBriefCard
    executiveBriefTitle: "Today's AI Environmental Brief",
    realtimeBriefSub: "Real-time executive briefing generated for",
    currentSituation: "Current Situation",
    conditions: "Conditions",
    primaryPollutionSources: "Primary Pollution Sources",
    aiForecastHorizon: "AI Forecast Horizon",
    advisoryImpact: "Advisory & Impact",
    targetImprovement: "Target Improvement",
    executiveDecisionIndicators: "Executive Decision Indicators",
    overallConfidence: "Overall Confidence",
    primaryRisk: "Primary Risk",
    predictionReliability: "Prediction Reliability",
    expectedImprovementText: "Expected Improvement",
    evidenceSourcesUsed: "Evidence Sources Used",
    estimatedDecisionImpact: "Estimated Decision Impact",
    aqiPoints: "AQI Points",
    
    // Risks
    trafficAndConstruction: "Traffic & Construction",
    trafficAndDust: "Traffic & Dust",
    coastalWindsTraffic: "Coastal Winds & Traffic",
    industrialSiltDust: "Industrial & Silt Dust",
    maritimeBoundaryTraffic: "Maritime Boundary & Traffic",
    
    // Impacts
    veryHighImpact: "Very High Impact",
    highImpact: "High Impact",
    moderateImpact: "Moderate Impact",
    criticalImpact: "Critical Impact",
    
    // Reliability
    stable: "Stable",
    moderate: "Moderate",
    
    // Sources
    nodesRadarGis: "6 Nodes, Radar, GIS",
    wardsSatelliteGis: "5 Wards, Satellite, GIS",
    nodesMarineBuoys: "4 Nodes, Marine Buoys",
    nodesLidarsGis: "7 Nodes, Lidars, GIS",
    nodesCoastalRadar: "6 Nodes, Coastal Radar",
    
    // SourceAttributionCard
    aiSourceAttributionTitle: "AI Pollution Source Attribution",
    realtimeSourceSub: "Real-time source fingerprinting analysis",
    explainabilityEngine: "Explainability Engine",
    
    // WhatIfSimulator
    whatIfTitle: "What-If Scenario Simulator",
    whatIfSub: "Simulate administrative policies and evaluate future outcomes",
    trafficRestriction: "Traffic Restriction",
    constructionAbatement: "Construction Abatement",
    industrialEmissionsControl: "Industrial Emissions Control",
    waterSprinkling: "Water Sprinkling",
    burningBan: "Burning Ban",
    currentAqi: "Current AQI",
    predictedAqi: "Predicted AQI",
    estReduction: "Est. Reduction",
    simulatedCost: "Simulated Cost",
    deployTime: "Deploy Time",
    ecoImpact: "Eco Impact",
    points: "Points",
    immediate: "Immediate",
    nominal: "Nominal",
    good: "Good",
    excellent: "Excellent",
    outstanding: "Outstanding",
    
    // RecommendedActions
    aiRecommendedActions: "AI Recommended Actions",
    prescribedMitigationSub: "Prescribed mitigation interventions optimized for local drivers",
    directivesAvailable: "Directives Available",
    confidence: "Confidence",
    estImpact: "Est. Impact",
    whyRec: "Why this recommendation?",
    whyNow: "Why now?",
    implDifficulty: "Implementation Difficulty",
    estCompTime: "Est. Completion Time",
    envBenefit: "Environmental Benefit",
    expectedAqiRed: "Expected AQI Reduction",
    supportingEvidence: "Supporting Evidence Matrix",
    transmittedToMuni: "Transmitted to Municipality",
    transmitOperationalDir: "Transmit Operational Directive",
    
    // Evidence Chips
    trafficDensity: "Traffic Density",
    heavyCommute: "Heavy Commute",
    minsAgo: "mins ago",
    weatherConditions: "Weather Conditions",
    lowVolatility: "Low Volatility",
    sensorReadings: "Sensor Readings",
    pm10Elevated: "PM10 Elevated",
    justNow: "Just now",
    historicalTrends: "Historical Trends",
    normalCycle: "Normal Cycle",
    hourAgo: "1 hour ago",
    hoursAgo: "hours ago",
    satelliteObs: "Satellite Obs.",
    clearAod: "0.42 AOD (Clear)",
    constructionSite: "Construction Site",
    activeOps: "Active Operations",
    industrialActivity: "Industrial Activity",
    stackNominal: "Stack Nominal",
    windConditions: "Wind Conditions",
    calmAir: "Calm Air",
    
    // BottomAnalytics
    bottomAnalyticsTitle: "Neighborhood Environmental Analytics & Alerts Timeline",
    sevenDayAnalysis: "7-Day Analysis",
    sevenDayTrend: "7-Day Particulate Load Trend (AQI)",
    activeAlerts: "Active Neighborhood Alerts",
    trafficSootAlert: "Traffic Soot Alert",
    dieselCongestionDesc: "Diesel congestion elevated PM2.5 levels.",
    calmWindConditions: "Calm Wind Conditions",
    lightWindsDesc: "Dispersion values limited due to light winds.",
    constructionDustWarning: "Construction Dust Warning",
    particulateDriftDesc: "Local building sites particulate drift warning.",
    oneDayAgo: "1 day ago",
    
    // ForecastTable
    forecastLedgerGrid: "Forecast Ledger Grid",
    forecastLedgerSub: "Chronological ledgers showing predictive parameters targets",
    leadTime: "Lead Time",
    category: "Category",
    windVectors: "Wind vectors",
    trends: "Trends",
    rising: "Rising",
    falling: "Falling",
    horizonNow: "Horizon Now",
    horizon6h: "Horizon +6h",
    horizon12h: "Horizon +12h",
    horizon24h: "Horizon +24h",
    horizon48h: "Horizon +48h",
    horizon72h: "Horizon +72h",
    
    // AISummaryCard
    aiPredictiveAssessment: "AI Predictive Assessment",
    riskScale: "Risk Scale",
    executiveSummary: "Executive Summary",
    keyForecastTrendsTitle: "Key forecast trends",
    attentionSectors: "Attention sectors"
  },
  hi: {
    executiveBriefTitle: "आज की एआई पर्यावरण ब्रीफ",
    realtimeBriefSub: "वास्तविक समय कार्यकारी ब्रीफिंग जनरेटेड",
    currentSituation: "वर्तमान स्थिति",
    conditions: "स्थिति",
    primaryPollutionSources: "प्राथमिक प्रदूषण स्रोत",
    aiForecastHorizon: "एआई पूर्वानुमान क्षितिज",
    advisoryImpact: "सलाह और प्रभाव",
    targetImprovement: "लक्षित सुधार",
    executiveDecisionIndicators: "कार्यकारी निर्णय संकेतक",
    overallConfidence: "कुल आत्मविश्वास",
    primaryRisk: "प्राथमिक जोखिम",
    predictionReliability: "पूर्वानुमान विश्वसनीयता",
    expectedImprovementText: "अपेक्षित सुधार",
    evidenceSourcesUsed: "साक्ष्य स्रोतों का उपयोग",
    estimatedDecisionImpact: "अनुमानित निर्णय प्रभाव",
    aqiPoints: "एक्यूआई अंक",
    trafficAndConstruction: "यातायात और निर्माण",
    trafficAndDust: "यातायात और धूल",
    coastalWindsTraffic: "तटीय हवाएं और यातायात",
    industrialSiltDust: "औद्योगिक और गाद धूल",
    maritimeBoundaryTraffic: "समुद्री सीमा और यातायात",
    veryHighImpact: "बहुत उच्च प्रभाव",
    highImpact: "उच्च प्रभाव",
    moderateImpact: "मध्यम प्रभाव",
    criticalImpact: "गंभीर प्रभाव",
    stable: "स्थिर",
    moderate: "मध्यम",
    nodesRadarGis: "6 नोड्स, रडार, जीआईएस",
    wardsSatelliteGis: "5 वार्ड, उपग्रह, जीआईएस",
    nodesMarineBuoys: "4 नोड्स, समुद्री बुय",
    nodesLidarsGis: "7 नोड्स, लिडार, जीआईएस",
    nodesCoastalRadar: "6 नोड्स, तटीय रडार",
    aiSourceAttributionTitle: "एआई प्रदूषण स्रोत एट्रिब्यूशन",
    realtimeSourceSub: "वास्तविक समय स्रोत फिंगरप्रिंटिंग विश्लेषण",
    explainabilityEngine: "व्याख्या इंजन",
    whatIfTitle: "नीति प्रभाव अनुकरणकर्ता (What-If)",
    whatIfSub: "प्रशासनिक नीतियों का अनुकरण करें और भविष्य के परिणामों का मूल्यांकन करें",
    trafficRestriction: "यातायात प्रतिबंध",
    constructionAbatement: "निर्माण कार्य रोक",
    industrialEmissionsControl: "औद्योगिक उत्सर्जन नियंत्रण",
    waterSprinkling: "पानी का छिड़काव",
    burningBan: "कचरा जलाने पर रोक",
    currentAqi: "वर्तमान एक्यूआई",
    predictedAqi: "अनुमानित एक्यूआई",
    estReduction: "अनुमानित कमी",
    simulatedCost: "अनुकरण लागत",
    deployTime: "लागू समय",
    ecoImpact: "पर्यावरण प्रभाव",
    points: "अंक",
    immediate: "तत्काल",
    nominal: "नाममात्र",
    good: "अच्छा",
    excellent: "उत्कृष्ट",
    outstanding: "उत्कृष्ट",
    aiRecommendedActions: "एआई अनुशंसित कार्रवाइयां",
    prescribedMitigationSub: "स्थानीय कारकों के लिए अनुकूलित शमन उपाय",
    directivesAvailable: "निर्देश उपलब्ध",
    confidence: "विश्वास",
    estImpact: "अनुमानित प्रभाव",
    whyRec: "यह सिफारिश क्यों?",
    whyNow: "अभी क्यों?",
    implDifficulty: "कार्यान्वयन कठिनाई",
    estCompTime: "अनुमानित पूरा होने का समय",
    envBenefit: "पर्यावरणी लाभ",
    expectedAqiRed: "अपेक्षित एक्यूआई कमी",
    supportingEvidence: "सहायक साक्ष्य मैट्रिक्स",
    transmittedToMuni: "नगर पालिका को प्रेषित",
    transmitOperationalDir: "परिचालन निर्देश प्रसारित करें",
    trafficDensity: "यातायात घनत्व",
    heavyCommute: "भारी आवागमन",
    minsAgo: "मिनट पहले",
    weatherConditions: "मौसम की स्थिति",
    lowVolatility: "कम अस्थिरता",
    sensorReadings: "सेंसर रीडिंग",
    pm10Elevated: "पीएम10 बढ़ा हुआ",
    justNow: "अभी-अभी",
    historicalTrends: "ऐतिहासिक प्रवृत्तियां",
    normalCycle: "सामान्य चक्र",
    hourAgo: "1 घंटा पहले",
    hoursAgo: "घंटे पहले",
    satelliteObs: "सैटेलाइट प्रेक्षण",
    clearAod: "0.42 एओडी (साफ)",
    constructionSite: "निर्माण स्थल",
    activeOps: "सक्रिय संचालन",
    industrialActivity: "औद्योगिक गतिविधि",
    stackNominal: "स्टैक सामान्य",
    windConditions: "हवा की स्थिति",
    calmAir: "शांत हवा",
    bottomAnalyticsTitle: "पड़ोसी पर्यावरण विश्लेषण और अलर्ट समयरेखा",
    sevenDayAnalysis: "७-दिवसीय विश्लेषण",
    sevenDayTrend: "७-दिवसीय कण भार प्रवृत्ति (AQI)",
    activeAlerts: "सक्रिय स्थानीय अलर्ट",
    trafficSootAlert: "यातायात कालिख अलर्ट",
    dieselCongestionDesc: "डीजल वाहनों के जाम से पीएम2.5 स्तर बढ़ गया है।",
    calmWindConditions: "शांत हवा की स्थिति",
    lightWindsDesc: "हल्की हवाओं के कारण प्रदूषकों का फैलाव सीमित हो गया है।",
    constructionDustWarning: "निर्माण धूल चेतावनी",
    particulateDriftDesc: "स्थानीय निर्माण स्थलों से उड़ने वाली धूल की चेतावनी।",
    oneDayAgo: "1 दिन पहले",
    forecastLedgerGrid: "पूर्वानुमान लेजर ग्रिड",
    forecastLedgerSub: "अनुमानित मापदंडों के लक्ष्यों को दर्शाने वाले कालानुक्रमिक बहीखाते",
    leadTime: "अग्रणी समय",
    category: "श्रेणी",
    windVectors: "हवा के रुख",
    trends: "प्रवृत्ति",
    rising: "बढ़ रहा है",
    falling: "कम हो रहा है",
    horizonNow: "वर्तमान समय",
    horizon6h: "अगले ६ घंटे",
    horizon12h: "अगले १२ घंटे",
    horizon24h: "अगले २४ घंटे",
    horizon48h: "अगले ४८ घंटे",
    horizon72h: "अगले ७२ घंटे",
    aiPredictiveAssessment: "एआई पूर्वानुमानित मूल्यांकन",
    riskScale: "जोखिम पैमाना",
    executiveSummary: "कार्यकारी सारांश",
    keyForecastTrendsTitle: "प्रमुख पूर्वानुमान प्रवृत्तियाँ",
    attentionSectors: "विशेष ध्यान देने योग्य क्षेत्र"
  },
  te: {
    executiveBriefTitle: "నేటి AI పర్యావరణ బ్రీఫ్",
    realtimeBriefSub: "నిజ-సమయ ఎగ్జిక్యూటివ్ బ్రీఫింగ్ సిద్ధం చేయబడింది",
    currentSituation: "ప్రస్తుత పరిస్థితి",
    conditions: "పరిస్థితులు",
    primaryPollutionSources: "ప్రధాన కాలుష్య వనరులు",
    aiForecastHorizon: "AI అంచనాల పరిధి",
    advisoryImpact: "సలహా & ప్రభావం",
    targetImprovement: "లక్ష్యంగా పెట్టుకున్న మార్పు",
    executiveDecisionIndicators: "ఎగ్జిక్యూటివ్ నిర్ణయ సూచికలు",
    overallConfidence: "మొత్తం విశ్వసనీయత",
    primaryRisk: "ప్రధాన ముప్పు",
    predictionReliability: "అంచనా విశ్వసనీయత",
    expectedImprovementText: "ఆశించిన మార్పు",
    evidenceSourcesUsed: "ఉపయోగించిన సాక్ష్యాల ఆధారాలు",
    estimatedDecisionImpact: "అంచనా వేసిన నిర్ణయ ప్రభావం",
    aqiPoints: "AQI పాయింట్లు",
    trafficAndConstruction: "రవాణా & నిర్మాణం",
    trafficAndDust: "రవాణా & ధూళి",
    coastalWindsTraffic: "తీరప్రాంత గాలులు & రవాణా",
    industrialSiltDust: "పరిశ్రమలు & ధూళి కణాలు",
    maritimeBoundaryTraffic: "సముద్ర సరిహద్దు & రవాణా",
    veryHighImpact: "చాలా ఎక్కువ ప్రభావం",
    highImpact: "ఎక్కువ ప్రభావం",
    moderateImpact: "సాధారణ ప్రభావం",
    criticalImpact: "తీవ్రమైన ప్రభావం",
    stable: "స్థిరంగా ఉంది",
    moderate: "సాధారణం",
    nodesRadarGis: "6 నోడ్లు, రాడార్, GIS",
    wardsSatelliteGis: "5 వార్డులు, శాటిలైట్, GIS",
    nodesMarineBuoys: "4 నోడ్లు, మెరైన్ బూయ్స్",
    nodesLidarsGis: "7 నోడ్లు, లిడార్స్, GIS",
    nodesCoastalRadar: "6 నోడ్లు, కోస్టల్ రాడార్",
    aiSourceAttributionTitle: "AI కాలుష్య వనరుల అట్రిబ్యూషన్",
    realtimeSourceSub: "నిజ-సమయ కాలుష్య వనరుల విశ్లేషణ",
    explainabilityEngine: "వివరణాత్మక యంత్రం",
    whatIfTitle: "విధానాల ప్రభావ సిమ్యులేటర్ (What-If)",
    whatIfSub: "పరిపాలనా విధానాలను అనుకరించి భవిష్యత్తు ఫలితాలను అంచనా వేయండి",
    trafficRestriction: "రవాణా నియంత్రణ",
    constructionAbatement: "నిర్మాణ పనుల నిలిపివేత",
    industrialEmissionsControl: "పరిశ్రమల ఉద్గారాల నియంత్రణ",
    waterSprinkling: "నీటిని చల్లడం",
    burningBan: "వ్యర్థాల దహనం నిషేధం",
    currentAqi: "ప్రస్తుత AQI",
    predictedAqi: "అంచనా వేసిన AQI",
    estReduction: "ఆశించిన తగ్గింపు",
    simulatedCost: "సిమ్యులేటెడ్ ఖర్చు",
    deployTime: "అమలు చేయు సమయం",
    ecoImpact: "పర్యావరణ ప్రభావం",
    points: "పాయింట్లు",
    immediate: "తక్షణమే",
    nominal: "నామమాత్రం",
    good: "మంచిది",
    excellent: "చాలా బాగుంది",
    outstanding: "అద్భుతం",
    aiRecommendedActions: "AI సిఫార్సు చేసిన చర్యలు",
    prescribedMitigationSub: "స్థానిక కారకాలకు అనుగుణంగా రూపొందించిన నివారణ చర్యలు",
    directivesAvailable: "ఆదేశాలు అందుబాటులో ఉన్నాయి",
    confidence: "విశ్వసనీయత",
    estImpact: "అంచనా వేసిన ప్రభావం",
    whyRec: "ఈ సిఫార్సుకు కారణం ఏంటి?",
    whyNow: "ఇప్పుడే ఎందుకు అమలు చేయాలి?",
    implDifficulty: "అమలు చేయుటలో క్లిష్టత",
    estCompTime: "అంచనా వేసిన సమయం",
    envBenefit: "పర్యావరణ ప్రయోజనం",
    expectedAqiRed: "ఆశించిన AQI తగ్గింపు",
    supportingEvidence: "మద్దతు సాక్ష్యాల ఆధారాలు",
    transmittedToMuni: "మున్సిపాలిటీకి పంపబడింది",
    transmitOperationalDir: "నిర్ణీత ఆదేశాన్ని జారీ చేయి",
    trafficDensity: "రవాణా సాంద్రత",
    heavyCommute: "ఎక్కువ వాహనాల రద్దీ",
    minsAgo: "నిమిషాల క్రితం",
    weatherConditions: "వాతావరణ పరిస్థితులు",
    lowVolatility: "తక్కువ అస్థిరత",
    sensorReadings: "సెన్సార్ రీడింగులు",
    pm10Elevated: "PM10 పెరిగింది",
    justNow: "ఇప్పుడే",
    historicalTrends: "చారిత్రక ధోరణులు",
    normalCycle: "సాధారణ చక్రం",
    hourAgo: "1 గంట క్రితం",
    hoursAgo: "గంటల క్రితం",
    satelliteObs: "శాటిలైట్ పరిశీలనలు",
    clearAod: "0.42 AOD (సాధారణం)",
    constructionSite: "నిర్మాణ స్థలం",
    activeOps: "చురుకైన పనులు",
    industrialActivity: "పరిశ్రమల పనితీరు",
    stackNominal: "పరిశ్రమల చిమ్నీ సాధారణం",
    windConditions: "గాలి పరిస్థితులు",
    calmAir: "ప్రశాంతమైన గాలి",
    bottomAnalyticsTitle: "పరిసరాల పర్యావరణ విశ్లేషణ & అలర్ట్ల కాలక్రమం",
    sevenDayAnalysis: "7 రోజుల విశ్లేషణ",
    sevenDayTrend: "7 రోజుల కాలుష్య ధోరణి (AQI)",
    activeAlerts: "క్రియాశీల స్థానిక అలర్ట్లు",
    trafficSootAlert: "వాహన కాలుష్య అలర్ట్",
    dieselCongestionDesc: "డీజిల్ వాహనాల రద్దీ వల్ల PM2.5 స్థాయిలు పెరిగాయి.",
    calmWindConditions: "ప్రశాంతమైన గాలి పరిస్థితులు",
    lightWindsDesc: "గాలి వేగం తగ్గడం వల్ల కాలుష్య వ్యాప్తి పరిమితంగా మారింది.",
    constructionDustWarning: "నిర్మాణ ధూళి హెచ్చరిక",
    particulateDriftDesc: "స్థానిక నిర్మాణ ప్రాంతాల నుండి లేస్తున్న ధూళి కణాల హెచ్చరిక.",
    oneDayAgo: "1 రోజు క్రితం",
    forecastLedgerGrid: "ಮುಂದೆ ಅంచనాల పట్టిక",
    forecastLedgerSub: "అంచనా పారామితుల లక్ష్యాలను చూపే క్రమానుగత నివేదిక",
    leadTime: "ముందస్తు సమయం",
    category: "విభాగం",
    windVectors: "గాలి దిశలు",
    trends: "ధోరణులు",
    rising: "పెరుగుతోంది",
    falling: "తగ్గుతోంది",
    horizonNow: "ప్రస్తుత సమయం",
    horizon6h: "రాబోయే 6 గంటలు",
    horizon12h: "రాబోయే 12 గంటలు",
    horizon24h: "రాబోయే 24 గంటలు",
    horizon48h: "రాబోయే 48 గంటలు",
    horizon72h: "రాబోయే 72 గంటలు",
    aiPredictiveAssessment: "AI ముందస్తు అంచనా విశ్లేషణ",
    riskScale: "ప్రమాద స్థాయి",
    executiveSummary: "కార్యనిర్వాహక సారాంశం",
    keyForecastTrendsTitle: "కీలక అంచనాల ధోరణులు",
    attentionSectors: "ప్రత్యేక శ్రద్ధ పెట్టవలసిన రంగాలు"
  },
  ta: {
    executiveBriefTitle: "இன்றைய AI சுற்றுச்சூழல் சுருக்கம்",
    realtimeBriefSub: "உண்நேர நிர்வாக விளக்கக்காட்சி உருவாக்கப்பட்டது",
    currentSituation: "தற்போதைய நிலை",
    conditions: "நிலைகள்",
    primaryPollutionSources: "முக்கிய மாசு ஆதாரங்கள்",
    aiForecastHorizon: "AI கணிப்பு கால அளவு",
    advisoryImpact: "ஆலோசனைகள் & தாக்கம்",
    targetImprovement: "இலக்கு மேம்பாடு",
    executiveDecisionIndicators: "நிர்வாக முடிவு குறிகாட்டிகள்",
    overallConfidence: "ஒட்டுமொத்த நம்பிக்கை",
    primaryRisk: "முக்கிய ஆபத்து",
    predictionReliability: "கணிப்பு நம்பகத்தன்மை",
    expectedImprovementText: "எதிர்பார்க்கப்படும் மேம்பாடு",
    evidenceSourcesUsed: "பயன்படுத்தப்பட்ட ஆதாரங்களின் விவரம்",
    estimatedDecisionImpact: "மதிப்பிடப்பட்ட முடிவு தாக்கம்",
    aqiPoints: "AQI புள்ளிகள்",
    trafficAndConstruction: "போக்குவரத்து & கட்டுமானம்",
    trafficAndDust: "போக்குவரத்து & தூசி",
    coastalWindsTraffic: "கடற்கரை காற்று & போக்குவரத்து",
    industrialSiltDust: "தொழில்துறை & வண்டல் தூசி",
    maritimeBoundaryTraffic: "கடல் எல்லை & போக்குவரத்து",
    veryHighImpact: "மிக அதிக தாக்கம்",
    highImpact: "அதிக தாக்கம்",
    moderateImpact: "மிதமான தாக்கம்",
    criticalImpact: "தீவிரமான தாக்கம்",
    stable: "நிலையானது",
    moderate: "மிதமானது",
    nodesRadarGis: "6 முனைகள், ரேடார், GIS",
    wardsSatelliteGis: "5 வார்டுகள், செயற்கைக்கோள், GIS",
    nodesMarineBuoys: "4 முனைகள், கடல் மிதவைகள்",
    nodesLidarsGis: "7 முனைகள், லிடார்கள், GIS",
    nodesCoastalRadar: "6 முனைகள், கடலோர ரேடார்",
    aiSourceAttributionTitle: "AI மாசு ஆதாரங்களின் ஒதுக்கீடு",
    realtimeSourceSub: "நிகழ்நேர மாசு ஆதார பகுப்பாய்வு",
    explainabilityEngine: "விளக்க உறை இயந்திரம்",
    whatIfTitle: "கொள்கை உருவகப்படுத்துதல் கருவி (What-If)",
    whatIfSub: "நிர்வாகக் கொள்கைகளை உருவகப்படுத்தி எதிர்கால முடிவுகளை மதிப்பிடுங்கள்",
    trafficRestriction: "போக்குவரத்து கட்டுப்பாடு",
    constructionAbatement: "கட்டுமானப் பணிகள் நிறுத்தம்",
    industrialEmissionsControl: "தொழிற்சாலை புகை உமிழ்வு கட்டுப்பாடு",
    waterSprinkling: "தண்ணீர் தெளித்தல்",
    burningBan: "குப்பை எரிப்பு தடை",
    currentAqi: "தற்போதைய AQI",
    predictedAqi: "கணிக்கப்பட்ட AQI",
    estReduction: "மதிப்பிடப்பட்ட குறைப்பு",
    simulatedCost: "உருவகப்படுத்தப்பட்ட செலவு",
    deployTime: "செயல்படுத்தும் நேரம்",
    ecoImpact: "சுற்றுச்சூழல் தாக்கம்",
    points: "புள்ளிகள்",
    immediate: "உடனடியாக",
    nominal: "பெயரளவிலான",
    good: "நல்லது",
    excellent: "சிறப்பானது",
    outstanding: "மிகச் சிறப்பானது",
    aiRecommendedActions: "AI பரிந்துரைத்த நடவடிக்கைகள்",
    prescribedMitigationSub: "உள்ளூர் காரணிகளுக்கு ஏற்ப உகந்ததாக்கப்பட்ட தடுப்பு நடவடிக்கைகள்",
    directivesAvailable: "பரிந்துரைகள் கிடைக்கின்றன",
    confidence: "நம்பிக்கை",
    estImpact: "மதிப்பிடப்பட்ட தாக்கம்",
    whyRec: "ஏன் இந்த பரிந்துரை?",
    whyNow: "ஏன் இப்பொழுது?",
    implDifficulty: "செயல்படுத்தும் சிரமம்",
    estCompTime: "மதிப்பிடப்பட்ட முடிக்கும் நேரம்",
    envBenefit: "சுற்றுச்சூழல் நன்மை",
    expectedAqiRed: "எதிர்பார்க்கப்படும் AQI குறைப்பு",
    supportingEvidence: "ஆதாரங்களின் அட்டவணை",
    transmittedToMuni: "மாநகராட்சிக்கு அனுப்பப்பட்டது",
    transmitOperationalDir: "வழிகாட்டுதலை அனுப்பவும்",
    trafficDensity: "போக்குவரத்து அடர்த்தி",
    heavyCommute: "அதிக போக்குவரத்து நெரிசல்",
    minsAgo: "நிமிடங்களுக்கு முன்",
    weatherConditions: "வானிலை நிலைகள்",
    lowVolatility: "குறைந்த ஏற்ற இறக்கம்",
    sensorReadings: "சென்சார் அளவீடுகள்",
    pm10Elevated: "PM10 அதிகரித்துள்ளது",
    justNow: "இப்பொழுது",
    historicalTrends: "வரலாற்று போக்குகள்",
    normalCycle: "சாதாரண சுழற்சி",
    hourAgo: "1 மணிநேரத்திற்கு முன்",
    hoursAgo: "மணிநேரங்களுக்கு முன்",
    satelliteObs: "செயற்கைக்கோள் அவதானிப்புகள்",
    clearAod: "0.42 AOD (தெளிவானது)",
    constructionSite: "கட்டுமான தளம்",
    activeOps: "செயலில் உள்ள பணிகள்",
    industrialActivity: "தொழில்துறை செயல்பாடு",
    stackNominal: "தொழிற்சாலை புகைபோக்கி இயல்பு நிலை",
    windConditions: "காற்றின் நிலைகள்",
    calmAir: "அமைதியான காற்று",
    bottomAnalyticsTitle: "சுற்றுப்புற சுற்றுச்சூழல் பகுப்பாய்வு & எச்சரிக்கை காலவரிசை",
    sevenDayAnalysis: "7-நாள் பகுப்பாய்வு",
    sevenDayTrend: "7-நாள் மாசு அளவு போக்கு (AQI)",
    activeAlerts: "செயலில் உள்ள உள்ளூர் எச்சரிக்கைகள்",
    trafficSootAlert: "போக்குவரத்து புகை எச்சரிக்கை",
    dieselCongestionDesc: "டீசல் வாகன நெரிசலால் PM2.5 அளவுகள் அதிகரித்துள்ளன.",
    calmWindConditions: "அமைதியான காற்று நிலைகள்",
    lightWindsDesc: "காற்றின் வேகம் குறைவதால் மாசுக்கள் கலைவது குறைவாக உள்ளது.",
    constructionDustWarning: "கட்டுமான தூசி எச்சரிக்கை",
    particulateDriftDesc: "கட்டுமானப் பகுதிகளில் இருந்து கிளம்பும் தூசிகள் குறித்த எச்சரிக்கை.",
    oneDayAgo: "1 நாளுக்கு முன்",
    forecastLedgerGrid: "முன்னறிவிப்பு விளக்க அட்டவணை",
    forecastLedgerSub: "கணிப்பு அளவுருக்களின் இலக்குகளை காட்டும் காலவரிசை அட்டவணை",
    leadTime: "முன்னோக்கி நேரம்",
    category: "வகை",
    windVectors: "காற்றின் திசைகள்",
    trends: "போக்குகள்",
    rising: "அதிகரிக்கிறது",
    falling: "குறைகிறது",
    horizonNow: "தற்போதைய நேரம்",
    horizon6h: "அடுத்த 6 மணிநேரம்",
    horizon12h: "அடுத்த 12 மணிநேரம்",
    horizon24h: "அடுத்த 24 மணிநேரம்",
    horizon48h: "அடுத்த 48 மணிநேரம்",
    horizon72h: "அடுத்த 72 மணிநேரம்",
    aiPredictiveAssessment: "AI முன்கணிப்பு மதிப்பீடு",
    riskScale: "ஆபத்து அளவு",
    executiveSummary: "நிர்வாக சுருக்கம்",
    keyForecastTrendsTitle: "முக்கிய கணிப்பு போக்குகள்",
    attentionSectors: "கவனம் செலுத்த வேண்டிய பிரிவுகள்"
  },
  kn: {
    executiveBriefTitle: "ಇಂದಿನ AI ಪರಿಸರ ಬ್ರೀಫ್",
    realtimeBriefSub: "ನೈಜ-ಸಮಯದ ಕಾರ್ಯನಿರ್ವಾಹಕ ವರದಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ",
    currentSituation: "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ",
    conditions: "ಸ್ಥಿತಿಗಳು",
    primaryPollutionSources: "ಪ್ರಾಥಮಿಕ ಮಾಲಿನ್ಯದ ಮೂಲಗಳು",
    aiForecastHorizon: "AI ಮುನ್ಸೂಚನೆ ವ್ಯಾಪ್ತಿ",
    advisoryImpact: "ಸಲಹೆ ಮತ್ತು ಪ್ರಭಾವ",
    targetImprovement: "ಲಕ್ಷ್ಯದ ಸುಧಾರಣೆ",
    executiveDecisionIndicators: "ಕಾರ್ಯನಿರ್ವಾಹಕ ನಿರ್ಧಾರದ ಸೂಚಕಗಳು",
    overallConfidence: "ಒಟ್ಟಾರೆ ಆತ್ಮವಿಶ್ವಾಸ",
    primaryRisk: "ಪ್ರಾಥಮಿಕ ಅಪಾಯ",
    predictionReliability: "ಮುನ್ಸೂಚನೆ ವಿಶ್ವಾಸಾರ್ಹತೆ",
    expectedImprovementText: "ನಿರೀಕ್ಷಿತ ಸುಧಾರಣೆ",
    evidenceSourcesUsed: "ಬಳಸಿದ ಸಾಕ್ಷ್ಯಗಳ ಮೂಲಗಳು",
    estimatedDecisionImpact: "ಅಂದಾಜು ನಿರ್ಧಾರ ಪ್ರಭಾವ",
    aqiPoints: "AQI ಅಂಕಗಳು",
    trafficAndConstruction: "ಸಂಚಾರ & ನಿರ್ಮಾಣ",
    trafficAndDust: "ಸಂಚಾರ & ಧೂಳು",
    coastalWindsTraffic: "ಕರಾವಳಿ ಗಾಳಿ & ಸಂಚಾರ",
    industrialSiltDust: "ಕೈಗಾರಿಕಾ & ಧೂಳಿನ ಕಣಗಳು",
    maritimeBoundaryTraffic: "ಸಮುದ್ರ ಗಡಿ & ಸಂಚಾರ",
    veryHighImpact: "ಅತ್ಯಂತ ಹೆಚ್ಚಿನ ಪ್ರಭಾವ",
    highImpact: "ಹೆಚ್ಚಿನ ಪ್ರಭಾವ",
    moderateImpact: "ಸಾಧಾರಣ ಪ್ರಭಾವ",
    criticalImpact: "ತೀವ್ರವಾದ ಪ್ರಭಾವ",
    stable: "ಸ್ಥಿರವಾಗಿದೆ",
    moderate: "ಸಾಧಾರಣ",
    nodesRadarGis: "6 ನೋಡ್‌ಗಳು, ರೇಡಾರ್, GIS",
    wardsSatelliteGis: "5 ವಾರ್ಡ್‌ಗಳು, ಉಪಗ್ರಹ, GIS",
    nodesMarineBuoys: "4 ನೋಡ್‌ಗಳು, ಸಾಗರ ಬೂಯ್ಸ್",
    nodesLidarsGis: "7 ನೋಡ್‌ಗಳು, ಲಿಡಾರ್ಸ್, GIS",
    nodesCoastalRadar: "6 ನೋಡ್‌ಗಳು, ಕರಾವಳಿ ರೇಡಾರ್",
    aiSourceAttributionTitle: "AI ಮಾಲಿನ್ಯ ಮೂಲಗಳ ಹಂಚಿಕೆ",
    realtimeSourceSub: "ನೈಜ-ಸಮಯದ ಮಾಲಿನ್ಯ ಮೂಲಗಳ ವಿಶ್ಲೇಷಣೆ",
    explainabilityEngine: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಎಂಜಿನ್",
    whatIfTitle: "ನೀತಿ ಪರಿಣಾಮ ಸಿಮ್ಯುಲೇಟರ್ (What-If)",
    whatIfSub: "ಆಡಳಿತಾತ್ಮಕ ನೀತಿಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ ಭವಿಷ್ಯದ ಫಲಿತಾಂಶಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
    trafficRestriction: "ಸಂಚಾರ ನಿಯಂತ್ರಣ",
    constructionAbatement: "ನಿರ್ಮಾಣ ಕಾರ್ಯಗಳ ತಡೆ",
    industrialEmissionsControl: "ಕೈಗಾರಿಕಾ ಹೊರಸೂಸುವಿಕೆ ನಿಯಂತ್ರಣ",
    waterSprinkling: "ನೀರು ಸಿಂಪಡಿಸುವುದು",
    burningBan: "ತ್ಯಾಜ್ಯ ದಹನ ನಿಷೇಧ",
    currentAqi: "ಪ್ರಸ್ತುತ AQI",
    predictedAqi: "ಅಂದಾಜು AQI",
    estReduction: "ಅಂದಾಜು ಕಡಿತ",
    simulatedCost: "ಸಿಮ್ಯುಲೇಟೆಡ್ ವೆಚ್ಚ",
    deployTime: "ಅನುಷ್ಠಾನ ಸಮಯ",
    ecoImpact: "پರಿಸರ ಪ್ರಭಾವ",
    points: "ಅಂಕಗಳು",
    immediate: "ತಕ್ಷಣವೇ",
    nominal: "ಹೆಸರಮಾತ್ರದ",
    good: "ಉತ್ತಮ",
    excellent: "ಅತ್ಯುತ್ತಮ",
    outstanding: "ಅದ್ಭುತ",
    aiRecommendedActions: "AI ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು",
    prescribedMitigationSub: "ಸ್ಥಳೀಯ ಅಂಶಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿಸಿದ ನಿವಾರಣಾ ಕ್ರಮಗಳು",
    directivesAvailable: "ಆದೇಶಗಳು ಲಭ್ಯವಿವೆ",
    confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    estImpact: "ಅಂದಾಜು ಪ್ರಭಾವ",
    whyRec: "ಈ ಶಿಫಾರಸಿಗೆ ಕಾರಣವೇನು?",
    whyNow: "ಈಗಲೇ ಏಕೆ ಅನುಷ್ಠಾನಗೊಳಿಸಬೇಕು?",
    implDifficulty: "ಅನುಷ್ಠಾನದ ಕ್ಲಿಷ್ಟತೆ",
    estCompTime: "ಅಂದಾಜು ಮುಕ್ತಾಯ ಸಮಯ",
    envBenefit: "ಪರಿಸರ ಅನುಕೂಲತೆ",
    expectedAqiRed: "ನಿರೀಕ್ಷಿತ AQI ಕಡಿತ",
    supportingEvidence: "ಪೂರಕ ಸಾಕ್ಷ್ಯಗಳ ಕೋಷ್ಟಕ",
    transmittedToMuni: "ಮುನ್ಸಿಪಾಲಿಟಿಗೆ ರವಾನಿಸಲಾಗಿದೆ",
    transmitOperationalDir: "ಕಾರ್ಯಾಚರಣೆ ಆದೇಶವನ್ನು ರವಾನಿಸಿ",
    trafficDensity: "ಸಂಚಾರ ಸಾಂದ್ರತೆ",
    heavyCommute: "ವಾಹನ ಸಂಚಾರ ದಟ್ಟಣೆ",
    minsAgo: "ನಿಮಿಷಗಳ ಹಿಂದೆ",
    weatherConditions: "ಹವಾಮಾನ ಸ್ಥಿತಿಗಳು",
    lowVolatility: "ಕಡಿಮೆ ಅಸ್ಥಿರತೆ",
    sensorReadings: "ಸೆನ್ಸರ್ ರೀಡಿಂಗ್ಸ್",
    pm10Elevated: "PM10 ಹೆಚ್ಚಾಗಿದೆ",
    justNow: "ಈಗ ತಾನೇ",
    historicalTrends: "ಐತಿಹಾಸಿಕ ಪ್ರವೃತ್ತಿ",
    normalCycle: "ಸಾಮಾನ್ಯ ಚಕ್ರ",
    hourAgo: "1 ಗಂಟೆ ಹಿಂದೆ",
    hoursAgo: "ಗಂಟೆಗಳ ಹಿಂದೆ",
    satelliteObs: "ಉಪಗ್ರಹ ಅವಲೋಕನಗಳು",
    clearAod: "0.42 AOD (ಸ್ಪಷ್ಟವಾಗಿದೆ)",
    constructionSite: "ನಿರ್ಮಾಣ ಸ್ಥಳ",
    activeOps: "ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣೆಗಳು",
    industrialActivity: "ಕೈಗಾರಿಕಾ ಚಟುವಟಿಕೆ",
    stackNominal: "ಕೈಗಾರಿಕಾ ಚಿಮಣಿ ಸಾಮಾನ್ಯ",
    windConditions: "ಗಾಳಿಯ ಪರಿಸ್ಥಿತಿಗಳು",
    calmAir: "ಶಾಂತ ಗಾಳಿ",
    bottomAnalyticsTitle: "ಪರಿಸರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳ ವಿವರ",
    sevenDayAnalysis: "7 ದಿನಗಳ ವಿಶ್ಲೇಷಣೆ",
    sevenDayTrend: "7 ದಿನಗಳ ಮಾಲಿನ್ಯ ಪ್ರವೃತ್ತಿ (AQI)",
    activeAlerts: "ಸಕ್ರಿಯ ಸ್ಥಳೀಯ ಎಚ್ಚರಿಕೆಗಳು",
    trafficSootAlert: "ವಾಹನ ಮಾಲಿನ್ಯದ ಎಚ್ಚರಿಕೆ",
    dieselCongestionDesc: "ಡೀಸೆಲ್ ವಾಹನ ದಟ್ಟಣೆಯಿಂದ PM2.5 ಮಟ್ಟ ಹೆಚ್ಚಾಗಿದೆ.",
    calmWindConditions: "ಶಾಂತ ಗಾಳಿಯ ಪರಿಸ್ಥಿತಿಗಳು",
    lightWindsDesc: "ಗಾಳಿಯ ವೇಗ ಕಡಿಮೆಯಾದ कारण ಮಾಲಿನ್ಯ ಹರಡುವುದು ನಿಯಂತ್ರಿಸಲ್ಪಟ್ಟಿದೆ.",
    constructionDustWarning: "ಕಟ್ಟಡ ಧೂಳಿನ ಎಚ್ಚರಿಕೆ",
    particulateDriftDesc: "ಸ್ಥಳೀಯ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ವಲಯದ ಧೂಳಿನ ಎಚ್ಚರಿಕೆ.",
    oneDayAgo: "1 ದಿನ ಹಿಂದೆ",
    forecastLedgerGrid: "ಮುನ್ಸೂಚನೆ ವಿವರಗಳ ಪಟ್ಟಿ",
    forecastLedgerSub: "ಅಂದಾಜು ನಿಯತಾಂಕಗಳ ಗುರಿಗಳನ್ನು ತೋರಿಸುವ ಕಾಲಾನುಕ್ರಮದ ಕೋಷ್ಟಕ",
    leadTime: "ಮುನ್ನಡೆ ಸಮಯ",
    category: "ವರ್ಗ",
    windVectors: "ಗಾಳಿಯ ದಿಕ್ಕುಗಳು",
    trends: "ಪ್ರವೃತ್ತಿ",
    rising: "ಹೆಚ್ಚುತ್ತಿದೆ",
    falling: "ಕಡಿಮೆಯಾಗುತ್ತಿದೆ",
    horizonNow: "ಪ್ರಸ್ತುತ ಸಮಯ",
    horizon6h: "ಮುಂದಿನ 6 ಗಂಟೆಗಳು",
    horizon12h: "ಮುಂದಿನ 12 ಗಂಟೆಗಳು",
    horizon24h: "ಮುಂದಿನ 24 ಗಂಟೆಗಳು",
    horizon48h: "ಮುಂದಿನ 48 ಗಂಟೆಗಳು",
    horizon72h: "ಮುಂದಿನ 72 ಗಂಟೆಗಳು",
    aiPredictiveAssessment: "AI ಮುನ್ಸೂಚನೆ ವಿಶ್ಲೇಷಣೆ",
    riskScale: "ಅಪಾಯದ ಪ್ರಮಾಣ",
    executiveSummary: "ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ",
    keyForecastTrendsTitle: "ಪ್ರಮುಖ ಮುನ್ಸೂಚನೆ ಪ್ರವೃತ್ತಿಗಳು",
    attentionSectors: "ವಿಶೇಷ ಗಮನ ನೀಡಬೇಕಾದ ವಲಯಗಳು"
  }
};

export function translateActionTitle(id: number, defaultTitle: string, lang: string): string {
  if (lang === "hi") {
    if (id === 1 || defaultTitle.includes("Diesel")) return "भारी डीजल वाहनों को प्रतिबंधित करें";
    if (id === 2 || defaultTitle.includes("Construction")) return "निर्माण स्थल का निरीक्षण करें और धूल को दबाएं";
    if (id === 3 || defaultTitle.includes("Sprinkling")) return "पर्यावरणीय जल छिड़काव तैनात करें";
  }
  if (lang === "te") {
    if (id === 1 || defaultTitle.includes("Diesel")) return "భారీ డీజిల్ వాహనాలను నియంత్రించండి";
    if (id === 2 || defaultTitle.includes("Construction")) return "నిర్మాణ స్థలాలను తనిఖీ చేయండి & ధూళిని అణచివేయండి";
    if (id === 3 || defaultTitle.includes("Sprinkling")) return "పర్యావరణ నీటి పిచికారీని రంగంలోకి దించండి";
  }
  if (lang === "ta") {
    if (id === 1 || defaultTitle.includes("Diesel")) return "கனரக டீசல் வாகனங்களை கட்டுப்படுத்தவும்";
    if (id === 2 || defaultTitle.includes("Construction")) return "கட்டுமான தளங்களை ஆய்வு செய்து தூசுகளை அடக்கவும்";
    if (id === 3 || defaultTitle.includes("Sprinkling")) return "சுற்றுச்சூழல் நீர் தெளிப்பை மேற்கொள்ளவும்";
  }
  if (lang === "kn") {
    if (id === 1 || defaultTitle.includes("Diesel")) return "ಭಾರೀ ಡೀಸೆಲ್ ವಾಹನಗಳನ್ನು ನಿರ್ಬಂಧಿಸಿ";
    if (id === 2 || defaultTitle.includes("Construction")) return "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸ್ಥಳ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಧೂಳು ನಿಯಂತ್ರಿಸಿ";
    if (id === 3 || defaultTitle.includes("Sprinkling")) return "ಪರಿಸರ ಸ್ನೇಹಿ ನೀರು ಸಿಂಪಡಣೆಯನ್ನು ನಿಯೋಜಿಸಿ";
  }
  return defaultTitle;
}

export function translateActionDesc(id: number, defaultDesc: string, lang: string, wardName: string): string {
  if (lang === "hi") {
    if (id === 1 || defaultDesc.includes("diesel")) return `कार्यालय आवागमन के व्यस्त समय के दौरान ${wardName} जंक्शंस से वाणिज्यिक डीजल परिवहन को डायवर्ट करें।`;
    if (id === 2 || defaultDesc.includes("construction")) return `${wardName} में सक्रिय निर्माण क्षेत्रों का ऑन-साइट निरीक्षण करें और धूल दमन नियंत्रण अनिवार्य करें।`;
    if (id === 3 || defaultDesc.includes("sprinkling")) return `धूल को दबाने के लिए ${wardName} के शुष्क गलियारों में स्थानीयकृत पानी का छिड़काव शुरू करें।`;
  }
  if (lang === "te") {
    if (id === 1 || defaultDesc.includes("diesel")) return `కార్యాలయాల రద్దీ సమయాల్లో ${wardName} జంక్షన్ల గుండా వెళ్లే భారీ డీజిల్ రవాణాను మళ్లించండి.`;
    if (id === 2 || defaultDesc.includes("construction")) return `${wardName} లోని క్రియాశీల నిర్మాణ ప్రాంతాలలో ఆన్-సైట్ తనిఖీలను నిర్వహించండి మరియు ధూళి నివారణ చర్యలను తప్పనిసరి చేయండి.`;
    if (id === 3 || defaultDesc.includes("sprinkling")) return `ధూళి నివారణకు ${wardName} లోని పొడి మార్గాల్లో నీటిని చల్లడం ప్రారంభించండి.`;
  }
  if (lang === "ta") {
    if (id === 1 || defaultDesc.includes("diesel")) return `அலுவலக நேரங்களில் ${wardName} சந்திப்புகள் வழியாக கனரக டீசல் போக்குவரத்தை திருப்பிவிடவும்.`;
    if (id === 2 || defaultDesc.includes("construction")) return `${wardName} இல் உள்ள கட்டுமானப் பகுதிகளில் தள ஆய்வு மேற்கொண்டு தூசுகளைக் கட்டுப்படுத்தும் வழிமுறைகளை கட்டாயமாக்குங்கள்.`;
    if (id === 3 || defaultDesc.includes("sprinkling")) return `தூசுகளை அடக்க ${wardName} இன் உலர் பாதைகளில் நீர் தெளிக்கவும்.`;
  }
  if (lang === "kn") {
    if (id === 1 || defaultDesc.includes("diesel")) return `ಕಚೇರಿ ಸಮಯದ ಸಂಚಾರ ದಟ್ಟಣೆಯ ಸಮಯದಲ್ಲಿ ${wardName} ಜಂಕ್ಷನ್‌ಗಳಿಂದ ವಾಣಿಜ್ಯ ಡೀಸೆಲ್ ಸಾರಿಗೆಯನ್ನು ಬೇರೆಡೆಗೆ ತಿರುಗಿಸಿ.`;
    if (id === 2 || defaultDesc.includes("construction")) return `${wardName} ನಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿರುವ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸ್ಥಳ ತಪಾಸಣೆ ನಡೆಸಿ ಧೂಳು ನಿಯಂತ್ರಣ ಕ್ರಮಗಳನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸಿ.`;
    if (id === 3 || defaultDesc.includes("sprinkling")) return `ಧೂಳು ನಿಯಂತ್ರಿಸಲು ${wardName} ನ ಒಣ ರಸ್ತೆಗಳಲ್ಲಿ ನೀರಿನ ಸಿಂಪಡಣೆಯನ್ನು ಕೈಗೊಳ್ಳಿ.`;
  }
  return defaultDesc;
}

export function translateSource(source: string, lang: string): string {
  if (lang === "hi") {
    if (source.includes("Industrial")) return "औद्योगिक";
    if (source.includes("Traffic")) return "यातायात";
    if (source.includes("Natural Dust") || source.includes("Dust") || source.includes("Road Dust")) return "प्राकृतिक धूल";
    if (source.includes("Construction")) return "निर्माण कार्य";
    if (source.includes("Weather") || source.includes("Meteorological")) return "मौसम";
    if (source.includes("Other")) return "अन्य स्रोत";
    if (source.includes("Unknown")) return "अज्ञान";
  }
  if (lang === "te") {
    if (source.includes("Industrial")) return "పరిశ్రమలు";
    if (source.includes("Traffic")) return "రవాణా";
    if (source.includes("Natural Dust") || source.includes("Dust") || source.includes("Road Dust")) return "ధూళి కణాలు";
    if (source.includes("Construction")) return "నిర్మాణం";
    if (source.includes("Weather") || source.includes("Meteorological")) return "వాతావరణం";
    if (source.includes("Other")) return "ఇతర కారకాలు";
    if (source.includes("Unknown")) return "తెలియనివి";
  }
  if (lang === "ta") {
    if (source.includes("Industrial")) return "தொழில்துறை";
    if (source.includes("Traffic")) return "போக்குவரத்து";
    if (source.includes("Natural Dust") || source.includes("Dust") || source.includes("Road Dust")) return "இயற்கை தூசி";
    if (source.includes("Construction")) return "கட்டுமானம்";
    if (source.includes("Weather") || source.includes("Meteorological")) return "வானிலை";
    if (source.includes("Other")) return "இதர ஆதாரங்கள்";
    if (source.includes("Unknown")) return "அறியப்படாதவை";
  }
  if (lang === "kn") {
    if (source.includes("Industrial")) return "ಕೈಗಾರಿಕಾ";
    if (source.includes("Traffic")) return "ಸಂಚಾರ";
    if (source.includes("Natural Dust") || source.includes("Dust") || source.includes("Road Dust")) return "ಧೂಳಿನ ಕಣಗಳು";
    if (source.includes("Construction")) return "ನಿರ್ಮಾಣ";
    if (source.includes("Weather") || source.includes("Meteorological")) return "ಹವಾಮಾನ";
    if (source.includes("Other")) return "ಇತರ ಮೂಲಗಳು";
    if (source.includes("Unknown")) return "ಅಜ್ಞಾತ";
  }
  return source;
}

export function translateEvidence(label: string, status: string, time: string, lang: string): { label: string; status: string; time: string } {
  if (lang === "hi") {
    let transLabel = label;
    if (label.includes("Traffic")) transLabel = "यातायात घनत्व";
    if (label.includes("Weather")) transLabel = "मौसम की स्थिति";
    if (label.includes("Sensor")) transLabel = "सेंसर रीडिंग";
    if (label.includes("Trends")) transLabel = "ऐतिहासिक प्रवृत्तियां";
    if (label.includes("Satellite")) transLabel = "सैटेलाइट प्रेक्षण";
    if (label.includes("Construction")) transLabel = "निर्माण स्थल";
    if (label.includes("Industrial")) transLabel = "औद्योगिक गतिविधि";
    if (label.includes("Wind")) transLabel = "हवा की स्थिति";

    let transStatus = status;
    if (status.includes("Heavy")) transStatus = "भारी आवागमन";
    if (status.includes("Low")) transStatus = "कम अस्थिरता";
    if (status.includes("Elevated")) transStatus = "पीएम10 बढ़ा हुआ";
    if (status.includes("Normal")) transStatus = "सामान्य चक्र";
    if (status.includes("Clear")) transStatus = "0.42 एओडी (साफ)";
    if (status.includes("Active")) transStatus = "सक्रिय संचालन";
    if (status.includes("Nominal")) transStatus = "स्टैक सामान्य";
    if (status.includes("Calm")) transStatus = "शांत हवा";

    let transTime = time;
    if (time.includes("mins ago")) transTime = time.replace("mins ago", "मिनट पहले");
    if (time.includes("Just now")) transTime = "अभी-अभी";
    if (time.includes("1 hour ago")) transTime = "1 घंटा पहले";
    if (time.includes("hours ago")) transTime = time.replace("hours ago", "घंटे पहले");

    return { label: transLabel, status: transStatus, time: transTime };
  }
  if (lang === "te") {
    let transLabel = label;
    if (label.includes("Traffic")) transLabel = "రవాణా సాంద్రత";
    if (label.includes("Weather")) transLabel = "వాతావరణ పరిస్థితులు";
    if (label.includes("Sensor")) transLabel = "సెన్సార్ రీడింగులు";
    if (label.includes("Trends")) transLabel = "చారిత్రక ధోరణులు";
    if (label.includes("Satellite")) transLabel = "శాటిలైట్ పరిశీలనలు";
    if (label.includes("Construction")) transLabel = "నిర్మాణ స్థలం";
    if (label.includes("Industrial")) transLabel = "పరిశ్రమల పనితీరు";
    if (label.includes("Wind")) transLabel = "గాలి పరిస్థితులు";

    let transStatus = status;
    if (status.includes("Heavy")) transStatus = "ఎక్కువ వాహనాల రద్దీ";
    if (status.includes("Low")) transStatus = "తక్కువ అస్థిరత";
    if (status.includes("Elevated")) transStatus = "PM10 పెరిగింది";
    if (status.includes("Normal")) transStatus = "సాధారణ చక్రం";
    if (status.includes("Clear")) transStatus = "0.42 AOD (సాధారణం)";
    if (status.includes("Active")) transStatus = "చురుకైన పనులు";
    if (status.includes("Nominal")) transStatus = "పరిశ్రమల చిమ్నీ సాధారణం";
    if (status.includes("Calm")) transStatus = "ప్రశాంతమైన గాలి";

    let transTime = time;
    if (time.includes("mins ago")) transTime = time.replace("mins ago", "నిమిషాల క్రితం");
    if (time.includes("Just now")) transTime = "ఇప్పుడే";
    if (time.includes("1 hour ago")) transTime = "1 గంట క్రితం";
    if (time.includes("hours ago")) transTime = time.replace("hours ago", "గంటల క్రితం");

    return { label: transLabel, status: transStatus, time: transTime };
  }
  if (lang === "ta") {
    let transLabel = label;
    if (label.includes("Traffic")) transLabel = "போக்குவரத்து அடர்த்தி";
    if (label.includes("Weather")) transLabel = "வானிலை நிலைகள்";
    if (label.includes("Sensor")) transLabel = "சென்சார் அளவீடுகள்";
    if (label.includes("Trends")) transLabel = "வரலாற்று போக்குகள்";
    if (label.includes("Satellite")) transLabel = "செயற்கைக்கோள் அவதானிப்புகள்";
    if (label.includes("Construction")) transLabel = "கட்டுமான தளம்";
    if (label.includes("Industrial")) transLabel = "தொழில்துறை செயல்பாடு";
    if (label.includes("Wind")) transLabel = "காற்றின் நிலைகள்";

    let transStatus = status;
    if (status.includes("Heavy")) transStatus = "அதிக போக்குவரத்து நெரிசல்";
    if (status.includes("Low")) transStatus = "குறைந்த ஏற்ற இறக்கம்";
    if (status.includes("Elevated")) transStatus = "PM10 அதிகரித்துள்ளது";
    if (status.includes("Normal")) transStatus = "சாதாரண சுழற்சி";
    if (status.includes("Clear")) transStatus = "0.42 AOD (தெளிவானது)";
    if (status.includes("Active")) transStatus = "செயலில் உள்ள பணிகள்";
    if (status.includes("Nominal")) transStatus = "தொழிற்சாலை புகைபோக்கி இயல்பு நிலை";
    if (status.includes("Calm")) transStatus = "அமைதியான காற்று";

    let transTime = time;
    if (time.includes("mins ago")) transTime = time.replace("mins ago", "நிமிடங்களுக்கு முன்");
    if (time.includes("Just now")) transTime = "இப்பொழுது";
    if (time.includes("1 hour ago")) transTime = "1 மணிநேரத்திற்கு முன்";
    if (time.includes("hours ago")) transTime = time.replace("hours ago", "மணிநேரங்களுக்கு முன்");

    return { label: transLabel, status: transStatus, time: transTime };
  }
  if (lang === "kn") {
    let transLabel = label;
    if (label.includes("Traffic")) transLabel = "ಸಂಚಾರ ಸಾಂದ್ರತೆ";
    if (label.includes("Weather")) transLabel = "ಹವಾಮಾನ ಸ್ಥಿತಿಗಳು";
    if (label.includes("Sensor")) transLabel = "ಸೆನ್ಸರ್ ರೀಡಿಂಗ್ಸ್";
    if (label.includes("Trends")) transLabel = "ಐತಿಹಾಸಿಕ ಪ್ರವೃತ್ತಿ";
    if (label.includes("Satellite")) transLabel = "ಉಪಗ್ರಹ ಅವಲೋಕನಗಳು";
    if (label.includes("Construction")) transLabel = "ನಿರ್ಮಾಣ ಸ್ಥಳ";
    if (label.includes("Industrial")) transLabel = "ಕೈಗಾರಿಕಾ ಚಟುವಟಿಕೆ";
    if (label.includes("Wind")) transLabel = "ಗಾಳಿಯ ಪರಿಸ್ಥಿತಿಗಳು";

    let transStatus = status;
    if (status.includes("Heavy")) transStatus = "ವಾಹನ ಸಂಚಾರ ದಟ್ಟಣೆ";
    if (status.includes("Low")) transStatus = "ಕಡಿಮೆ ಅಸ್ಥಿರತೆ";
    if (status.includes("Elevated")) transStatus = "PM10 ಹೆಚ್ಚಾಗಿದೆ";
    if (status.includes("Normal")) transStatus = "ಸಾಮಾನ್ಯ ಚಕ್ರ";
    if (status.includes("Clear")) transStatus = "0.42 AOD (ಸ್ಪಷ್ಟವಾಗಿದೆ)";
    if (status.includes("Active")) transStatus = "ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣೆಗಳು";
    if (status.includes("Nominal")) transStatus = "ಕೈಗಾರಿಕಾ ಚಿಮಣಿ ಸಾಮಾನ್ಯ";
    if (status.includes("Calm")) transStatus = "ಶಾಂತ ಗಾಳಿ";

    let transTime = time;
    if (time.includes("mins ago")) transTime = time.replace("mins ago", "ನಿಮಿಷಗಳ ಹಿಂದೆ");
    if (time.includes("Just now")) transTime = "ಈಗ ತಾನೇ";
    if (time.includes("1 hour ago")) transTime = "1 ಗಂಟೆ ಹಿಂದೆ";
    if (time.includes("hours ago")) transTime = time.replace("hours ago", "ಗಂಟೆಗಳ ಹಿಂದೆ");

    return { label: transLabel, status: transStatus, time: transTime };
  }
  return { label, status, time };
}

export function translateTrendText(trend: string, lang: string): string {
  if (lang === "hi") {
    if (trend === "Traffic-associated soot spikes at commute peaks.") return "आवागमन के व्यस्त समय में यातायात से जुड़ी कालिख का बढ़ना।";
    if (trend === "Sprinkling deployments cut construction particulate indices by 18%.") return "छिड़काव करने से निर्माण कण सूचकांकों में 18% की कमी आती है।";
    if (trend === "Light local winds limit soot dispersion.") return "हल्की स्थानीय हवाएं कालिख के फैलाव को सीमित करती हैं।";
  }
  if (lang === "te") {
    if (trend === "Traffic-associated soot spikes at commute peaks.") return "రద్దీ సమయాల్లో వాహన కాలుష్యం ఎక్కువగా ఉంటోంది.";
    if (trend === "Sprinkling deployments cut construction particulate indices by 18%.") return "నీటిని చల్లడం వల్ల నిర్మాణ ధూళి కణాలు 18% వరకు తగ్గాయి.";
    if (trend === "Light local winds limit soot dispersion.") return "స్థానిక తక్కువ గాలి వేగం వల్ల కాలుష్య వ్యాప్తి పరిమితంగా మారింది.";
  }
  if (lang === "ta") {
    if (trend === "Traffic-associated soot spikes at commute peaks.") return "போக்குவரத்து நேரத்தில் வாகன புகை மாசுபாடு அதிகமாக உள்ளது.";
    if (trend === "Sprinkling deployments cut construction particulate indices by 18%.") return "நீர் தெளிப்பதன் மூலம் கட்டுமானப் பகுதி மாசு துகள்கள் 18% வரை குறைகின்றன.";
    if (trend === "Light local winds limit soot dispersion.") return "குறைந்த காற்று மாசுக்கள் கலைவதைக் கட்டுப்படுத்துகிறது.";
  }
  if (lang === "kn") {
    if (trend === "Traffic-associated soot spikes at commute peaks.") return "ಸಂಚಾರ ಸಮಯದಲ್ಲಿ ವಾಹನಗಳ ಹೊಗೆಯ ಪ್ರಮಾಣ ಹೆಚ್ಚಳ.";
    if (trend === "Sprinkling deployments cut construction particulate indices by 18%.") return "ನೀರು ಸಿಂಪಡಿಸುವುದರಿಂದ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಧೂಳು 18% ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ.";
    if (trend === "Light local winds limit soot dispersion.") return "ಕಡಿಮೆ ಗಾಳಿಯ ವೇಗವು ಧೂಳು ಹರಡುವುದನ್ನು ಮಿತಿಗೊಳಿಸುತ್ತದೆ.";
  }
  return trend;
}

export function translateAttentionArea(area: string, lang: string): string {
  if (lang === "hi") {
    if (area.includes("Gachibowli Ring Road")) return "गचीबोवली रिंग रोड जंक्शंस";
    if (area.includes("Madhapur IT Corridor")) return "माधापुर आईटी कॉरिडोर बाईपास";
  }
  if (lang === "te") {
    if (area.includes("Gachibowli Ring Road")) return "గచ్చిబౌలి రింగ్ రోడ్ జంక్షన్లు";
    if (area.includes("Madhapur IT Corridor")) return "మాధాపూర్ ఐటి కారిడార్ బైపాస్";
  }
  if (lang === "ta") {
    if (area.includes("Gachibowli Ring Road")) return "கச்சிபௌலி ரிங் ரோடு சந்திப்புகள்";
    if (area.includes("Madhapur IT Corridor")) return "மாதாப்பூர் ஐடி காரிடார் பைபாஸ்";
  }
  if (lang === "kn") {
    if (area.includes("Gachibowli Ring Road")) return "ಗಚಿಬೌಲಿ ರಿಂಗ್ ರಸ್ತೆ ಜಂಕ್ಷನ್ಗಳು";
    if (area.includes("Madhapur IT Corridor")) return "ಮಾಧಾಪುರ ಐಟಿ ಕಾರಿಡಾರ್ ಬೈಪಾಸ್";
  }
  return area;
}

export function translateNarrativeExplanation(text: string, lang: string): string {
  if (!text) return text;
  if (lang === "en") return text;

  // Pattern match dynamic templates
  const regexPattern = /Air quality in (.*) is measured at (\d+) \(PM2\.5: (\d+) µg\/m³\)\. Explainability engines trace the spike to (.*) with dispersion levels limited by light local winds\./;
  const match = text.match(regexPattern);
  if (match) {
    const wardName = match[1];
    const aqi = match[2];
    const pm25 = match[3];
    const factor = match[4];
    
    if (lang === "hi") {
      const transFactor = factor.includes("commute") ? "भारी आवागमन यातायात" : "उच्च रियल एस्टेट विकास";
      return `${wardName} में वायु गुणवत्ता ${aqi} (PM2.5: ${pm25} µg/m³) मापी गई है। स्पष्टीकरण इंजन इस वृद्धि का कारण ${transFactor} को मानते हैं, और प्रदूषकों का फैलाव हल्की स्थानीय हवाओं के कारण सीमित है।`;
    }
    if (lang === "te") {
      const transFactor = factor.includes("commute") ? "ఎక్కువ వాహనాల రద్దీ" : "నిర్మాణ పనులు";
      return `${wardName} లో గాలి నాణ్యత ${aqi} (PM2.5: ${pm25} µg/m³) గా ఉంది. స్థానిక తక్కువ గాలి వేగం వల్ల కాలుష్య వ్యాప్తి పరిమితంగా మారగా, కాలుష్యానికి ప్రధాన కారణం ${transFactor} అని విశ్లేషణ తెలుపుతోంది.`;
    }
    if (lang === "ta") {
      const transFactor = factor.includes("commute") ? "அதிக போக்குவரத்து நெரிசல்" : "அதிக கட்டுமானப் பணிகள்";
      return `${wardName} இல் காற்றின் தரம் ${aqi} (PM2.5: ${pm25} µg/m³) ஆக உள்ளது. குறைந்த காற்றின் வேகம் காரணமாக மாசுக்கள் கலைவது குறைவாக உள்ள நிலையில், இந்த அதிகரிப்புக்கு முக்கிய காரணம் ${transFactor} என விளக்க எஞ்சின் கண்டறிந்துள்ளது.`;
    }
    if (lang === "kn") {
      const transFactor = factor.includes("commute") ? "ವಾಹನ ಸಂಚಾರ ದಟ್ಟಣೆ" : "ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಚಟುವಟಿಕೆಗಳು";
      return `${wardName} ನಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕವು ${aqi} (PM2.5: ${pm25} µg/m³) ಆಗಿದೆ. ಕನಿಷ್ಠ ಗಾಳಿಯ ವೇಗದಿಂದ ಮಾಲಿನ್ಯ ಹರಡುವುದು ಕಡಿಮೆಯಾಗಿದ್ದು, ಇದಕ್ಕೆ ಮುಖ್ಯ ಕಾರಣ ${transFactor} ಎಂದು ವಿಶ್ಲೇಷಣೆ ತಿಳಿಸುತ್ತದೆ.`;
    }
  }

  if (text.includes("Air quality in Gachibowli stands at 145")) {
    if (lang === "hi") {
      return "गचीबोवली में वायु गुणवत्ता 145 (मध्यम) है। शांत मौसम की स्थिति के तहत आउटर रिंग रोड जंक्शन पर कार्यालय आवागमन के व्यस्त समय के दौरान भारी डीजल यातायात, और ऊंची आईटी इमारतों के निर्माण स्थलों से उड़ने वाली धूल प्राथमिक प्रदूषक कारक बने हुए हैं।";
    }
    if (lang === "te") {
      return "గచ్చిబౌలిలో గాలి నాణ్యత 145 (సాధారణం) గా ఉంది. ప్రస్తుత తక్కువ గాలి వేగం వల్ల కాలుష్య కణాలు పేరుకుపోతుండగా, ఔటర్ రింగ్ రోడ్ జంక్షన్లలో రద్దీ సమయాల్లో తిరిగే భారీ డీజిల్ వాహనాల పొగ మరియు ఐటి కారిడార్ నిర్మాణ ధూళి దీనికి ప్రధాన కారణాలు.";
    }
    if (lang === "ta") {
      return "கச்சிபௌலியில் காற்றின் தரம் 145 (மிதமானது) ஆக உள்ளது. அமைதியான வானிலை காரணமாக மாசுக்கள் தேங்கியுள்ள நிலையில், ரிங் ரோடு சந்திப்பில் அலுவலக நேரங்களில் கனரக டீசல் வாகனங்கள் மற்றும் ஐடி காரிடார் கட்டுமானப் பகுதி தூசிகள் முக்கிய காரணமாகும்.";
    }
    if (lang === "kn") {
      return "ಗಚಿಬೌಲಿಯಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕವು 145 (ಸಾಧಾರಣ) ಆಗಿದೆ. ಶಾಂತ ಗಾಳಿಯ ವಾತಾವರಣದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಔಟರ್ ರಿಂಗ್ ರಸ್ತೆ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿನ ವಾಹನ ದಟ್ಟಣೆ ಹಾಗೂ ಐಟಿ ಕಾರಿಡಾರ್ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸ್ಥಳಗಳಿಂದ ಉಂಟಾಗುವ ಧೂಳು ಪ್ರಮುಖ ಮಾಲಿನ್ಯಕಾರಕವಾಗಿದೆ.";
    }
  }

  // General fallback replacement mapping
  return text;
}

export function translateFeedItem(text: string, lang: string): string {
  if (lang === "en" || !text) return text;

  let match = text.match(/Traffic congestion increased in (.*) IT corridor junctions\./);
  if (match) {
    const ward = match[1];
    if (lang === "hi") return `${ward} आईटी कॉरिडोर जंक्शंस पर यातायात की भीड़ बढ़ गई।`;
    if (lang === "te") return `${ward} ఐటి కారిడార్ జంక్షన్లలో ట్రాఫిక్ రద్దీ పెరిగింది.`;
    if (lang === "ta") return `${ward} ஐடி காரிடார் சந்திப்புகளில் போக்குவரத்து நெரிசல் அதிகரித்துள்ளது.`;
    if (lang === "kn") return `${ward} ಐಟಿ ಕಾರಿಡಾರ್ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿ ವಾಹನ ದಟ್ಟಣೆ ಹೆಚ್ಚಾಗಿದೆ.`;
  }

  match = text.match(/PM2\.5 particulate loading elevated by 11% near (.*) centroids\./);
  if (match) {
    const ward = match[1];
    if (lang === "hi") return `${ward} सेंट्रॉइड्स के पास पीएम2.5 कण भार में 11% की वृद्धि हुई।`;
    if (lang === "te") return `${ward} ప్రాంతాల్లో PM2.5 కాలుష్య తీవ్రత 11% పెరిగింది.`;
    if (lang === "ta") return `${ward} மையங்களுக்கு அருகில் PM2.5 மாசு அளவு 11% அதிகரித்துள்ளது.`;
    if (lang === "kn") return `${ward} ವಲಯಗಳ ಬಳಿ PM2.5 ಮಾಲಿನ್ಯದ ಪ್ರಮಾಣ 11% ರಷ್ಟು ಹೆಚ್ಚಾಗಿದೆ.`;
  }

  match = text.match(/Construction demolition dust detected near active (.*) building centroids\./);
  if (match) {
    const ward = match[1];
    if (lang === "hi") return `सक्रिय ${ward} भवन केंद्रों के पास निर्माण विध्वंस धूल का पता चला।`;
    if (lang === "te") return `నిర్మాణ పనులు జరుగుతున్న ${ward} ప్రాంతాల్లో ధూళి రేగుతున్నట్లు గుర్తించబడింది.`;
    if (lang === "ta") return `செயலில் உள்ள ${ward} கட்டுமானப் பகுதிக்கு அருகில் தூசிகள் கண்டறியப்பட்டுள்ளன.`;
    if (lang === "kn") return `ಸಕ್ರಿಯ ${ward} ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಪ್ರದೇಶಗಳ ಬಳಿ ಧೂಳು ಪತ್ತೆಯಾಗಿದೆ.`;
  }

  if (text.includes("XGBoost forecast model grid confidence index stabilized at 93%.")) {
    if (lang === "hi") return "एक्सजीबूस्ट पूर्वानुमान मॉडल ग्रिड विश्वास सूचकांक 93% पर स्थिर हो गया।";
    if (lang === "te") return "XGBoost అంచనా నమూనా విశ్వసనీయత సూచిక 93% వద్ద స్థిరపడింది.";
    if (lang === "ta") return "XGBoost கணிப்பு மாதிரியின் நம்பிக்கை குறியீடு 93% ஆக நிலைபெற்றுள்ளது.";
    if (lang === "kn") return "XGBoost ಮುನ್ಸೂಚನೆ ಮಾದರಿಯ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸೂಚ್ಯಂಕವು 93% ಸ್ಥಿರವಾಗಿದೆ.";
  }

  match = text.match(/AI engine recommends transmitting directive to restrict heavy diesel transport near (.*)\./);
  if (match) {
    const ward = match[1];
    if (lang === "hi") return `एआई इंजन ${ward} के पास भारी डीजल परिवहन को प्रतिबंधित करने का निर्देश प्रसारित करने की सिफारिश करता है।`;
    if (lang === "te") return `${ward} సమీపంలో భారీ డీజిల్ రవాణాను నియంత్రించేందుకు ఆదేశాలు జారీ చేయాలని AI సిఫార్సు చేస్తోంది.`;
    if (lang === "ta") return `${ward} அருகில் கனரக டீசல் போக்குவரத்தை கட்டுப்படுத்த வழிகாட்டுதலை அனுப்ப AI பரிந்துரைக்கிறது.`;
    if (lang === "kn") return `${ward} ಹತ್ತಿರ ಭಾರಿ ಡೀಸೆಲ್ ಸಾರಿಗೆ ನಿಯಂತ್ರಿಸಲು ಆದೇಶ ಹೊರಡಿಸಲು AI ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.`;
  }

  return text;
}

export function translateFeedTime(time: string, lang: string): string {
  if (lang === "en" || !time) return time;
  
  if (lang === "hi") {
    if (time.includes("mins ago")) return time.replace("mins ago", "मिनट पहले");
    if (time.includes("1 hour ago")) return "1 घंटा पहले";
    if (time.includes("hours ago")) return time.replace("hours ago", "घंटे पहले");
  }
  if (lang === "te") {
    if (time.includes("mins ago")) return time.replace("mins ago", "నిమిషాల క్రితం");
    if (time.includes("1 hour ago")) return "1 గంట క్రితం";
    if (time.includes("hours ago")) return time.replace("hours ago", "గంటల క్రితం");
  }
  if (lang === "ta") {
    if (time.includes("mins ago")) return time.replace("mins ago", "நிமிடங்களுக்கு முன்");
    if (time.includes("1 hour ago")) return "1 மணிநேரத்திற்கு முன்";
    if (time.includes("hours ago")) return time.replace("hours ago", "மணிநேரங்களுக்கு முன்");
  }
  if (lang === "kn") {
    if (time.includes("mins ago")) return time.replace("mins ago", "ನಿಮಿಷಗಳ ಹಿಂದೆ");
    if (time.includes("1 hour ago")) return "1 ಗಂಟೆ ಹಿಂದೆ";
    if (time.includes("hours ago")) return time.replace("hours ago", "ಗಂಟೆಗಳ ಹಿಂದೆ");
  }
  return time;
}

export function translateFeedCategory(category: string, lang: string): string {
  if (lang === "hi") {
    if (category.includes("Telemetry")) return "सेंसर्स टेलीमेट्री";
    if (category.includes("Forecaster")) return "एआई पूर्वानुमान";
    if (category.includes("Mitigation")) return "शमन नियंत्रण";
  }
  if (lang === "te") {
    if (category.includes("Telemetry")) return "సెన్సార్ టెలిమెట్రీ";
    if (category.includes("Forecaster")) return "AI ఫోర్కాస్టర్";
    if (category.includes("Mitigation")) return "నివారణ చర్యలు";
  }
  if (lang === "ta") {
    if (category.includes("Telemetry")) return "சென்சார் டெலிமெட்ரி";
    if (category.includes("Forecaster")) return "AI கணிப்பான்";
    if (category.includes("Mitigation")) return "தடுப்பு நடவடிக்கை";
  }
  if (lang === "kn") {
    if (category.includes("Telemetry")) return "ಸೆನ್ಸರ್ ಟೆಲಿಮೆಟ್ರಿ";
    if (category.includes("Forecaster")) return "AI ಮುನ್ಸೂಚನೆ";
    if (category.includes("Mitigation")) return "ನಿವಾರಣಾ ಕ್ರಮ";
  }
  return category;
}
