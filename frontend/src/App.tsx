import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Map as MapIcon,
  TrendingUp,
  FileText,
  Settings,
  Globe,
  Info,
  Send,
  Users,
  Heart,
  Gauge,
  Sparkles,
  X
} from "lucide-react";

import { ThemeProvider } from "./providers/ThemeProvider";
import { useTheme } from "./hooks/useTheme";
import { cn } from "./utils/cn";



// Import custom boot experience component
import { BootLayout } from "./components/boot/BootSequence";
import { EnvironmentalThemeProvider } from "./theme/EnvironmentalThemeEngine";
import { Atmosphere } from "./components/atmosphere/Atmosphere";
import { AppShell, WardSearch, LiveClock, greetingKey, type NavItem } from "./components/shell/AppShell";
import { DashboardHome } from "./features/dashboard/components/DashboardHome";
import { LandingPage } from "./features/landing/LandingPage";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";



import { DigitalTwin } from "./features/digital-twin/components/DigitalTwin";
import { ForecastCenter } from "./features/forecast/components/ForecastCenter";
import { CopilotConsole } from "./features/copilot/components/CopilotConsole";
import { ReportsDashboard } from "./features/reports/components/ReportsDashboard";
import { SettingsLayout } from "./features/settings/components/SettingsLayout";
import {
  ExecutiveBriefCard
} from "./features/dashboard/components/DecisionIntelligence";
import {
  HealthRiskCard,
  DailyBriefCard
} from "./components/ui/UrbanIntelligenceComponents";
import {
  uiTranslations,
  suggestedLangByCity,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  localizedBootSteps
} from "./utils/i18n";


import { MOCK_CITY_WARDS, MOCK_WARDS, CITY_REGIONS, AQI_IN_METRO_CITIES } from "./data/mockCities";
import { askCopilot } from "./features/copilot/api";
import { aqiLabel, aqiColor, mainPollutant } from "./utils/aqi";
import { buildDailyBrief } from "./features/dashboard/dailyBrief";
import { useMissionMap } from "./features/dashboard/useMissionMap";
import { LegalPage, type LegalDoc } from "./features/legal/LegalPage";

const readLegalHash = (): LegalDoc | null =>
  window.location.hash === "#/privacy" ? "privacy" : window.location.hash === "#/security" ? "security" : null;

// API Server URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAQIBadge = aqiLabel;
const getAQIMarkerColor = aqiColor;

type WardModel = (typeof MOCK_WARDS)[number];

type LiveWardMetrics = Pick<WardModel, "aqi" | "pm2_5" | "pm10" | "temperature" | "humidity" | "wind_speed" | "weather_condition" | "environmental_health_score"> & {
  source: string;
  forecast?: { horizon_hours: number; predicted_aqi: number }[];
  updated?: string;
};

// Same scoring the backend uses for its wards, so every city is scored alike
const healthScore = (aqi: number) => Math.max(10, Math.min(100, Math.round(100 - (aqi / 500) * 60 - 10)));

const normalizeWardKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function PranaApp() {
  const { setTheme, resolvedTheme } = useTheme();
  const { systemTimezone } = useSettings();

  const [flow, setFlow] = useState<string>("landing");

  // Privacy / Security pages live at #/privacy and #/security so they're linkable from anywhere
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(readLegalHash);
  useEffect(() => {
    const onHash = () => {
      setLegalDoc(readLegalHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const closeLegal = () => {
    window.history.pushState("", "", window.location.pathname + window.location.search);
    setLegalDoc(null);
  };

  const [activePage, setActivePage] = useState("dashboard");
  const [selectedWard, setSelectedWard] = useState<WardModel>(MOCK_WARDS[0]);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  const [liveWardMetrics, setLiveWardMetrics] = useState<Record<string, LiveWardMetrics>>({});
  const [liveDataSource, setLiveDataSource] = useState<string>("Connecting…");
  const [liveDataLastUpdated, setLiveDataLastUpdated] = useState<string>("");
  // Backend DB ids keyed by normalized ward name (frontend mock ids don't match backend ids)
  const [backendWardIds, setBackendWardIds] = useState<Record<string, number>>({});



  useEffect(() => {
    // Every ward in every city gets live readings (Open-Meteo via the backend) in one call;
    // /wards supplies backend DB ids used by the intelligence pipeline.
    const allWards = Object.values(MOCK_CITY_WARDS).flat();
    const fetchTelemetry = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const [liveRes, wardsRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/live`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(allWards.map((w) => ({ name: w.name, lat: w.latitude, lng: w.longitude }))),
            cache: "no-store",
            signal: controller.signal
          }),
          fetch(`${API_URL}/api/dashboard/wards`, { cache: "no-store", signal: controller.signal }).catch(() => null)
        ]);
        clearTimeout(timeoutId);

        if (wardsRes?.ok) {
          const data = await wardsRes.json();
          const ids: Record<string, number> = {};
          if (Array.isArray(data)) data.forEach((w: any) => { ids[normalizeWardKey(String(w.name || ""))] = Number(w.id); });
          setBackendWardIds(ids);
        }

        if (liveRes.ok) {
          const live: Record<string, any> = await liveRes.json();
          const metrics: Record<string, LiveWardMetrics> = {};
          Object.entries(live).forEach(([name, r]) => {
            metrics[normalizeWardKey(name)] = {
              aqi: Number(r.aqi),
              pm2_5: Number(r.pm2_5),
              pm10: Number(r.pm10),
              temperature: Number(r.temperature),
              humidity: Number(r.humidity),
              wind_speed: Number(r.wind_speed),
              weather_condition: r.weather_condition || "Clear",
              environmental_health_score: healthScore(Number(r.aqi)),
              forecast: r.forecast,
              updated: r.observed_at,
              source: r.source
            };
          });
          if (Object.keys(metrics).length > 0) {
            setLiveWardMetrics(metrics);
            const missing = allWards.length - Object.keys(metrics).length;
            setLiveDataSource(missing > 0 ? `Live · ${missing} places unavailable` : "Live · Open-Meteo CAMS");
            setLiveDataLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            return;
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Failed to fetch live telemetry:", err);
      }
      // Keep the last good readings if we have them; otherwise the reference values are clearly labelled
      setLiveDataSource((prev) => (prev.startsWith("Live") ? `${prev} (stale)` : "Offline · reference values, not live"));
    };

    fetchTelemetry();
    // Readings update hourly upstream; the backend caches for 10 minutes
    const interval = setInterval(fetchTelemetry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const activeWards = useMemo(() => {
    return (MOCK_CITY_WARDS[selectedCity] || MOCK_CITY_WARDS.Hyderabad).map((w) => {
      const key = normalizeWardKey(w.name);
      return liveWardMetrics[key] ? { ...w, ...liveWardMetrics[key] } : w;
    });
  }, [selectedCity, liveWardMetrics]);

  useEffect(() => {
    const e = liveWardMetrics[normalizeWardKey(selectedWard.name)];
    if (e && (selectedWard as any).forecast !== e.forecast) {
      setSelectedWard((prev: WardModel) => ({ ...prev, ...e }));
    }
  }, [liveWardMetrics, selectedWard]);



  // What-if simulation states
  const [simulatedTraffic, setSimulatedTraffic] = useState<number>(0);
  const [simulatedConstruction, setSimulatedConstruction] = useState<number>(0);
  const [simulatedIndustrial, setSimulatedIndustrial] = useState<number>(0);
  const [simulatedSprinkling, setSimulatedSprinkling] = useState<number>(0); // 0 or 100
  const [simulatedWasteBurning, setSimulatedWasteBurning] = useState<number>(0); // 0 or 100

  // Action Recommendations
  const [actionRecommendations, setActionRecommendations] = useState([
    {
      id: 1,
      title: "Restrict Heavy Diesel Vehicles",
      desc: "Divert commercial diesel transport from Gachibowli outer ring road junctions during office commute spikes.",
      priority: "P1 / High",
      impact: "Est. -18 AQI",
      duration: "4 hours",
      evidence: "Typical commute-hour traffic; indicative estimate.",
      executed: false
    },
    {
      id: 2,
      title: "Inspect Construction Site & Suppress Dust",
      desc: "Conduct on-site inspections of active construction areas in Gachibowli and mandate abating controls.",
      priority: "P2 / High",
      impact: "Est. -9 AQI",
      duration: "2 hours",
      evidence: "Dust control reduces coarse particulate (PM10); indicative estimate.",
      executed: false
    },
    {
      id: 3,
      title: "Deploy Environmental Water Sprinkling",
      desc: "Initiate localized water sprinkling runs across dry corridors in Gachibowli to suppress dust.",
      priority: "P3 / Medium",
      impact: "Est. -6 AQI",
      duration: "3 hours",
      evidence: "Water suppression settles road dust; indicative estimate.",
      executed: false
    }
  ]);

  // i18n Language Selector states
  const { language, setLanguage, formatTemp, formatWind } = useSettings();

  const t = (key: string): string => {
    return uiTranslations[language]?.[key] || uiTranslations["en"]?.[key] || key;
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: t("navHome"), icon: Gauge, primary: true },
    { id: "map", label: t("navMap"), icon: MapIcon, primary: true },
    { id: "prediction", label: t("navForecast"), icon: TrendingUp, primary: true },
    { id: "reports", label: t("navReports"), icon: FileText, primary: true },
    { id: "copilot", label: t("navCopilot"), icon: Sparkles, primary: true },
    { id: "settings", label: t("navSettings"), icon: Settings },
    { id: "About", label: t("navAbout"), icon: Info }
  ];

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
  };

  const [langSuggestion, setLangSuggestion] = useState<{ city: string; langCode: LanguageCode } | null>(null);

  // Multi-City selector state & mock database
  const selectedRegion = CITY_REGIONS[selectedCity] || CITY_REGIONS.Hyderabad;

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);

    // Trigger language suggestion for the selected city
    const suggestedLang = suggestedLangByCity[cityName];
    if (suggestedLang && suggestedLang !== language) {
      setLangSuggestion({ city: cityName, langCode: suggestedLang });
    } else {
      setLangSuggestion(null);
    }

    // Focus a specific mock ward based on the city selected
    const normCity = cityName === "Bengaluru" ? "Bangalore" : cityName;
    const cityWards = MOCK_CITY_WARDS[normCity] || MOCK_CITY_WARDS.Hyderabad;
    const defaultWard = cityWards[0];
    handleWardSelect(defaultWard);
  };

  // City AQI = mean of its wards (live values where the backend has them), so the
  // city strip never contradicts the ward data shown next to it.
  const cityHotspots = AQI_IN_METRO_CITIES.map((city) => {
    const wards = (MOCK_CITY_WARDS[city.name] || []).map((w) => ({ ...w, ...liveWardMetrics[normalizeWardKey(w.name)] }));
    const aqi = wards.length ? Math.round(wards.reduce((sum, w) => sum + Number(w.aqi), 0) / wards.length) : city.aqi;
    const next = wards.map((w: any) => w.forecast?.[0]?.predicted_aqi).filter((v): v is number => typeof v === "number");
    return {
      ...city,
      aqi,
      forecast: next.length ? Math.round(next.reduce((a, b) => a + b, 0) / next.length) : Math.round((aqi * city.forecast) / city.aqi),
      region: CITY_REGIONS[city.name]
    };
  });

  const isSimulating = simulatedTraffic > 0 || simulatedConstruction > 0 || simulatedIndustrial > 0 || simulatedSprinkling > 0 || simulatedWasteBurning > 0;

  const trafficReductionPoints = Math.floor(simulatedTraffic * 0.22);
  const constructionReductionPoints = Math.floor(simulatedConstruction * 0.12);
  const industrialReductionPoints = Math.floor(simulatedIndustrial * 0.18);
  const sprinklingReductionPoints = simulatedSprinkling > 0 ? 8 : 0;
  const wasteBurningReductionPoints = simulatedWasteBurning > 0 ? 12 : 0;

  const totalReduction = trafficReductionPoints + constructionReductionPoints + industrialReductionPoints + sprinklingReductionPoints + wasteBurningReductionPoints;
  const predictedAqi = Math.max(10, selectedWard.aqi - totalReduction);

  const estimatedCost = Math.floor(simulatedTraffic * 120 + simulatedConstruction * 90 + simulatedIndustrial * 150 + (simulatedSprinkling > 0 ? 800 : 0) + (simulatedWasteBurning > 0 ? 300 : 0));
  const estimatedTime = isSimulating
    ? (simulatedSprinkling > 0 && simulatedWasteBurning > 0 ? "1.0 hour" : simulatedSprinkling > 0 ? "1.5 hours" : "2 hours")
    : "Immediate";
  const environmentalImpact = totalReduction > 25 ? "Outstanding" : totalReduction > 15 ? "Excellent" : totalReduction > 5 ? "Good" : "Nominal";

  // Dynamic Source Attribution Calculations
  const trafficCongestionBase = selectedWard.traffic_congestion;
  const constructionActivityBase = selectedWard.construction_activity;
  const industrialEmissionsBase = selectedWard.industrial_emissions;
  const dustLevelBase = selectedWard.dust_level;
  const windSpeedBase = selectedWard.wind_speed;

  // Apply reductions
  const adjTraffic = trafficCongestionBase * (1 - simulatedTraffic / 100);
  const adjConstruction = constructionActivityBase * (1 - simulatedConstruction / 100);
  const adjIndustrial = industrialEmissionsBase * (1 - simulatedIndustrial / 100);
  const adjDust = dustLevelBase * (1 - simulatedSprinkling / 200);

  const rawTrafficAttr = adjTraffic * 0.7;
  const rawConstructionAttr = adjConstruction * 0.5;
  const rawIndustrialAttr = adjIndustrial * 0.8;
  const rawWeatherAttr = Math.max(5, (15 - windSpeedBase) * 2);
  const rawDustAttr = adjDust * 0.4;
  const rawOtherAttr = 5.0 * (1 - simulatedWasteBurning / 100);
  const rawUnknownAttr = 3.0;

  const totalRawAttr = rawTrafficAttr + rawConstructionAttr + rawIndustrialAttr + rawWeatherAttr + rawDustAttr + rawOtherAttr + rawUnknownAttr;

  const sourceAttributions = [
    { source: "Traffic", percentage: Math.round((rawTrafficAttr / totalRawAttr) * 1000) / 10 },
    { source: "Construction", percentage: Math.round((rawConstructionAttr / totalRawAttr) * 1000) / 10 },
    { source: "Industrial", percentage: Math.round((rawIndustrialAttr / totalRawAttr) * 1000) / 10 },
    { source: "Weather", percentage: Math.round((rawWeatherAttr / totalRawAttr) * 1000) / 10 },
    { source: "Natural Dust", percentage: Math.round((rawDustAttr / totalRawAttr) * 1000) / 10 },
    { source: "Other Sources", percentage: Math.round((rawOtherAttr / totalRawAttr) * 1000) / 10 },
    { source: "Unknown", percentage: Math.round((rawUnknownAttr / totalRawAttr) * 1000) / 10 }
  ];

  const dynamicExplanation = isSimulating
    ? `Active policy simulation: Restricting traffic by ${simulatedTraffic}% and construction by ${simulatedConstruction}% is estimated to reduce AQI in ${selectedWard.name} from ${selectedWard.aqi} to ${predictedAqi}. This intervention lowers overall emission loads.`
    : `Air quality in ${selectedWard.name} stands at ${selectedWard.aqi} (${getAQIBadge(selectedWard.aqi)}). Commuter traffic congestion along key outer junctions accounts for ${Math.round((rawTrafficAttr / totalRawAttr) * 100)}% of the total load, exacerbated by local construction activities.`;

  const [loading, setLoading] = useState(false);
  const [bootingProgress, setBootingProgress] = useState<number>(0);
  const [bootingStepLogs, setBootingStepLogs] = useState<string[]>([]);
  const [bootingActiveStep, setBootingActiveStep] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Live values based strictly on mock ward configurations
  const currentAqi = selectedWard.aqi;
  const liveTelemetryLabel = liveDataLastUpdated
    ? `${liveDataSource} · updated ${liveDataLastUpdated}`
    : liveDataSource;

  const [targetRedirect, setTargetRedirect] = useState("dashboard");

  // Agent output states
  // Seeded from the selected ward (same heuristic as the offline fallback) until the API responds,
  // so the first paint never shows a forecast that contradicts the current AQI.
  const [forecast, setForecast] = useState(() => [
    { horizon_hours: 24, predicted_aqi: Math.round(MOCK_WARDS[0].aqi * 1.05), confidence_score: 0.93, trend: "Rising" },
    { horizon_hours: 48, predicted_aqi: Math.round(MOCK_WARDS[0].aqi * 1.1), confidence_score: 0.93, trend: "Rising" },
    { horizon_hours: 72, predicted_aqi: Math.round(MOCK_WARDS[0].aqi * 0.92), confidence_score: 0.93, trend: "Falling" }
  ]);

  // Live CAMS forecast (24h-mean based, CPCB AQI) when available; model/heuristic forecast otherwise
  const liveForecast = liveWardMetrics[normalizeWardKey(selectedWard.name)]?.forecast;
  const currentForecast = liveForecast?.length
    ? liveForecast.map((f, i, arr) => ({
        ...f,
        confidence_score: 0.85,
        trend: f.predicted_aqi > (i ? arr[i - 1].predicted_aqi : selectedWard.aqi) ? "Rising" : "Falling"
      }))
    : forecast;



  // AI narrative from the backend for the focused place; null until it arrives (or when unavailable)
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const narrativeExplanation = aiNarrative ?? `${selectedWard.name} is at AQI ${selectedWard.aqi} (${getAQIBadge(selectedWard.aqi)}). Main pollutant: ${mainPollutant(selectedWard.pm2_5, selectedWard.pm10)}. Wind is ${selectedWard.wind_speed} m/s and humidity ${Math.round(selectedWard.humidity)}%.`;




  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "agent", text: "Hello! I am your Citizen Advisory Agent. Ask me about air quality, safe outdoor hours, or cleaner places nearby in any city on PranaAI." }
  ]);

  // Dynamic recommendations recommendations
  const [recommendations, setRecommendations] = useState([
    { id: 1, title: "Restrict Heavy Silt Vehicles", desc: "Divert heavy diesel transport away from busy junctions during commute peaks.", priority: "High", impact: "", executed: false },
    { id: 2, title: "Water Sprinkling & Mist Suppression", desc: "Deploy sprinkler trucks along dusty corridors and construction zones to settle particulate dust.", priority: "High", impact: "", executed: false },
    { id: 3, title: "Increase Electric Transit Frequency", desc: "Boost electric bus frequency near major employment clusters to cut single-occupancy trips.", priority: "Medium", impact: "", executed: false }
  ]);

  // Notifications List
  // The AQI alert follows the live ward data instead of a fixed string that could contradict it
  const worstWard = activeWards.reduce((a, b) => (Number(b.aqi) > Number(a.aqi) ? b : a), activeWards[0]);
  const notifications = [
    { id: 1, title: `${getAQIBadge(worstWard.aqi)} air in ${worstWard.name}`, text: `${worstWard.name} has the highest AQI in ${selectedCity} right now at ${worstWard.aqi} (PM2.5 ${worstWard.pm2_5} µg/m³).`, time: liveDataLastUpdated ? `Updated ${liveDataLastUpdated}` : "Just now", unread: Number(worstWard.aqi) > 100 },
    ...(currentForecast[0] ? [{
      id: 2,
      title: `24h outlook for ${selectedWard.name}`,
      text: `AQI expected around ${currentForecast[0].predicted_aqi} (${getAQIBadge(currentForecast[0].predicted_aqi)}), ${currentForecast[0].predicted_aqi > selectedWard.aqi ? "worse" : "better or similar"} than now (${selectedWard.aqi}).`,
      time: liveDataLastUpdated ? `Updated ${liveDataLastUpdated}` : "Just now",
      unread: currentForecast[0].predicted_aqi > 200
    }] : []),
    { id: 3, title: "Weather now", text: `${selectedWard.name}: ${selectedWard.weather_condition}, ${formatTemp(selectedWard.temperature)}, humidity ${selectedWard.humidity}%, wind ${formatWind(selectedWard.wind_speed)}.`, time: liveDataLastUpdated ? `Updated ${liveDataLastUpdated}` : "Just now", unread: false }
  ];

  // Reports state
  const [reportsList, setReportsList] = useState<any[]>([
    { id: 1, title: "Hyderabad Daily Air Quality Bulletin", type: "Daily", created_at: "2026-06-27", summary: "Daily analysis for Hyderabad's IT corridor. High traffic spikes on Gachibowli roads elevated PM2.5 to 84 µg/m³ at 9:00 AM." },
    { id: 2, title: "IT Corridor Environmental Performance Audit", type: "Weekly", created_at: "2026-06-25", summary: "Weekly brief tracking Gachibowli, Madhapur, and Hitech City. Heavy building works in Financial District contributed to 28% of local particulate loading." }
  ]);

  // Flow persistence effect
  useEffect(() => {
    localStorage.setItem("flow", flow);
  }, [flow]);

  // AI Boot Sequence Scheduler
  useEffect(() => {
    if (flow !== "booting") return;

    const steps = localizedBootSteps[language] || localizedBootSteps["en"];
    setBootingProgress(0);
    setBootingStepLogs([]);
    setBootingActiveStep(steps[0] + "...");

    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length) {
        const step = steps[index];
        setBootingActiveStep(step + "...");
        setBootingProgress(Math.floor(((index + 1) / steps.length) * 100));

        // Add step to completed list after progress ticks
        setTimeout(() => {
          setBootingStepLogs((prev: string[]) => [...prev, step]);
        }, 150);

        index++;
      } else {
        clearInterval(interval);
        // Completed - slide exit transition into Mission Control
        setTimeout(() => {
          setFlow("dashboard");
          setActivePage(targetRedirect);
        }, 600);
      }
    }, 380);

    return () => clearInterval(interval);
  }, [flow, targetRedirect, language]);

  const selectedBackendWardId = backendWardIds[normalizeWardKey(selectedWard.name)];

  const intelligenceRequest = useRef(0);
  const fetchWardIntelligence = async (ward: WardModel, backendId: number | undefined) => {
    const requestId = ++intelligenceRequest.current;
    const isCurrent = () => requestId === intelligenceRequest.current; // ignore answers for a place we've left
    setLoading(true);
    setAiNarrative(null); // never show the previous place's text under a new place
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      if (backendId === undefined) throw new Error("Ward not available in backend");
      const res = await fetch(`${API_URL}/api/dashboard/wards/${backendId}/intelligence`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (!isCurrent()) return;
        setForecast(data.predictions);
        setAiNarrative(data.explanation.narrative_explanation);
      } else {
        throw new Error("API responded with an error status");
      }
    } catch {
      clearTimeout(timeoutId);
      const current = ward;

      setForecast([
        { horizon_hours: 24, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 1.05))), confidence_score: 0.93, trend: "Rising" },
        { horizon_hours: 48, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 1.10))), confidence_score: 0.93, trend: "Rising" },
        { horizon_hours: 72, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 0.92))), confidence_score: 0.93, trend: "Falling" }
      ]);
      if (isCurrent()) setAiNarrative(null);
    } finally {
      if (isCurrent()) setLoading(false);
    }
  };

  // Refetch only when the ward or its backend id changes (not on every live AQI tick)
  useEffect(() => {
    fetchWardIntelligence(selectedWard, selectedBackendWardId);
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- deliberate: not on every live AQI tick
  }, [selectedWard.name, selectedBackendWardId]);

  const dailyBrief = buildDailyBrief({
    ward: selectedWard.name,
    aqi: predictedAqi,
    forecastAqi: currentForecast?.[0]?.predicted_aqi ?? predictedAqi,
    pm2_5: selectedWard.pm2_5,
    pm10: selectedWard.pm10,
    wind: selectedWard.wind_speed,
    humidity: selectedWard.humidity,
    temperature: selectedWard.temperature
  }, language);

  useMissionMap({
    enabled: flow === "dashboard" && activePage === "dashboard" && !legalDoc,
    containerId: "mission-map-canvas",
    isDark: resolvedTheme === "dark",
    wards: activeWards,
    focus: selectedWard,
    onSelect: (w) => handleWardSelect(w)
  });

  const handleWardSelect = (ward: any) => {
    setSelectedWard(ward);

    // Synchronize selectedCity with the chosen ward/place
    const nameLower = (ward?.name || "").toLowerCase();
    let detectedCity = "Hyderabad";

    const PLACE_CITY_MAP: Record<string, string> = {
      // Bangalore / Karnataka
      "whitefield": "Bangalore",
      "hoodi": "Bangalore",
      "indiranagar": "Bangalore",
      "electronic city": "Bangalore",
      "koramangala": "Bangalore",

      // Chennai / Tamil Nadu
      "adyar": "Chennai",
      "velachery": "Chennai",
      "guindy": "Chennai",
      "anna nagar": "Chennai",
      "tambaram": "Chennai",

      // Delhi / NCR
      "connaught": "Delhi",
      "saket": "Delhi",
      "anand vihar": "Delhi",
      "dwarka": "Delhi",
      "lajpat nagar": "Delhi",

      // Mumbai / Maharashtra
      "andheri": "Mumbai",
      "bandra": "Mumbai",
      "powai": "Mumbai",
      "lower parel": "Mumbai",
    };

    for (const [placeKeyword, city] of Object.entries(PLACE_CITY_MAP)) {
      if (nameLower.includes(placeKeyword)) {
        detectedCity = city;
        break;
      }
    }
    setSelectedCity(detectedCity);

    setSimulatedTraffic(0);
    setSimulatedConstruction(0);
    setSimulatedIndustrial(0);
    setSimulatedSprinkling(0);
    setSimulatedWasteBurning(0);

    // Update dynamic details inside recommendations based on focus ward
    setActionRecommendations(prev => prev.map(act => {
      if (act.id === 1) {
        return {
          ...act,
          desc: `Divert commercial diesel transport from ${ward.name} junctions during office commute spikes.`,
          evidence: `Typical commute-hour traffic around ${ward.name}; the vehicle share of local emissions is an indicative estimate.`,
          executed: false
        };
      } else if (act.id === 2) {
        return {
          ...act,
          desc: `Conduct on-site inspections of active construction areas in ${ward.name} and mandate dust suppression controls.`,
          evidence: `Modelled PM10 near ${ward.name} is ${ward.pm10} µg/m³ (CAMS).`,
          executed: false
        };
      } else {
        return {
          ...act,
          desc: `Initiate localized water sprinkling runs across dry corridors in ${ward.name} to suppress dust.`,
          evidence: `Wind near ${ward.name} is ${ward.wind_speed} m/s, which affects how fast dust disperses.`,
          executed: false
        };
      }
    }));
  };


  const allLiveWards = useMemo(
    () => Object.values(MOCK_CITY_WARDS).flat().map((w) => ({ ...w, ...liveWardMetrics[normalizeWardKey(w.name)] })),
    [liveWardMetrics]
  );

  const [chatBusy, setChatBusy] = useState(false);
  const handleSendMessage = async (e?: React.FormEvent, templateText?: string) => {
    if (e) e.preventDefault();
    const query = templateText || chatInput;
    if (!query.trim() || chatBusy) return;

    const messages = [...chatMessages, { sender: "user", text: query }];
    setChatMessages(messages);
    setChatInput("");
    setChatBusy(true);
    const reply = await askCopilot(query, selectedWard, allLiveWards, language, chatMessages);
    setChatMessages([...messages, { sender: "agent", text: reply.text, routes: reply.routes }]);
    setChatBusy(false);
  };

  const handleTabClick = (tabId: string) => {
    setActivePage(tabId);
  };

  const handleGenerateReport = (type: string) => {
    setLoading(true);
    setTimeout(() => {
      const rep = {
        id: reportsList.length + 1,
        title: `${selectedCity} ${type} Environmental Summary`,
        type: type,
        created_at: new Date().toISOString().split("T")[0],
        summary: `Live summary for ${selectedCity}: ${activeWards.length} places averaging AQI ${Math.round(activeWards.reduce((a, w) => a + Number(w.aqi), 0) / activeWards.length)}. Highest: ${worstWard.name} (${worstWard.aqi}); focus area ${selectedWard.name} at ${currentAqi} (${getAQIBadge(currentAqi)}).`
      };
      setReportsList([rep, ...reportsList]);
      setLoading(false);
    }, 500);
  };

  // Execute AI Policy Actions
  const handleExecutePolicy = (id: number, title: string) => {
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, executed: true } : rec));
    alert(`Policy directive "${title}" marked as actioned for ${selectedWard.name}, ${selectedCity}.`);
  };







  return (
    <EnvironmentalThemeProvider selectedWard={selectedWard}>
      <div className="prana-ui min-h-dvh text-foreground relative">
        <Atmosphere aqi={selectedWard.aqi} theme={resolvedTheme} />
        <div className="relative z-10 w-full min-h-screen">
          {legalDoc && <LegalPage doc={legalDoc} onBack={closeLegal} />}
          {!legalDoc && flow === "landing" && (
            <LandingPage
              ward={selectedWard}
              wards={activeWards}
              forecast={currentForecast}
              locationLabel={`${selectedCity}, ${selectedRegion.state}`}
              telemetryLabel={liveTelemetryLabel}
              aqiCategory={getAQIBadge}
              aqiColor={getAQIMarkerColor}
              onLaunch={(target) => {
                setTargetRedirect(target);
                setFlow("booting");
              }}
            />
          )}

          {/* 3. OS BOOT SEQUENCE SCREEN */}
          {!legalDoc && flow === "booting" && (
            <BootLayout
              progress={bootingProgress}
              completedSteps={bootingStepLogs}
              activeStep={bootingActiveStep}
            />
          )}

          {/* 4. MISSION CONTROL — floating glass frame inside the city atmosphere */}
          {!legalDoc && flow === "dashboard" && (
            <AppShell
              items={navItems}
              active={activePage}
              onNavigate={handleTabClick}
              eyebrow={<>{t(greetingKey(systemTimezone))} · <LiveClock timezone={systemTimezone} /></>}
              title={<>{selectedWard.name}<span className="text-muted font-light">, {selectedRegion.state}</span></>}
              search={
                <WardSearch
                  wards={allLiveWards}
                  onSelect={(w) => handleWardSelect(w)}
                  placeholder={t("searchShort")}
                />
              }
              language={language}
              onLanguageChange={handleLanguageChange}
              isDark={resolvedTheme === "dark"}
              onToggleTheme={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              hasUnread={notifications.some((n) => n.unread)}
              onOpenNotifications={() => setShowNotifications(true)}
              moreLabel={t("navMore")}
            >
              {activePage === "dashboard" && (
                <DashboardHome
                  t={t}
                  ward={selectedWard}
                  forecast={currentForecast}
                  predictedAqi={predictedAqi}
                  isSimulating={isSimulating}
                  narrative={isSimulating ? dynamicExplanation : narrativeExplanation}
                  telemetryLabel={liveTelemetryLabel}
                  loading={loading}
                  sources={sourceAttributions}
                  cities={cityHotspots.map((c) => ({ name: c.name, state: c.state, aqi: c.aqi, forecast: c.forecast }))}
                  selectedCity={selectedCity}
                  onSelectCity={handleCitySelect}
                  wards={activeWards}
                  onSelectWard={handleWardSelect}
                  nextAction={actionRecommendations[0] && {
                    title: actionRecommendations[0].title,
                    desc: actionRecommendations[0].desc,
                    impact: actionRecommendations[0].impact
                  }}
                  aqiCategory={getAQIBadge}
                  aqiColor={getAQIMarkerColor}
                  onNavigate={handleTabClick}
                  notice={langSuggestion && (
                    <div className="glass rounded-[1.5rem] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
                        <span>
                          Viewing {langSuggestion.city}. Switch the workspace to{" "}
                          <span className="text-primary">{SUPPORTED_LANGUAGES.find(l => l.code === langSuggestion.langCode)?.nativeName}</span>?
                        </span>
                      </span>
                      <span className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            handleLanguageChange(langSuggestion.langCode);
                            setLangSuggestion(null);
                          }}
                          className="btn-primary h-9 px-4 text-xs cursor-pointer"
                        >
                          Switch language
                        </button>
                        <button onClick={() => setLangSuggestion(null)} className="btn-ghost h-9 px-4 text-xs cursor-pointer">Dismiss</button>
                      </span>
                    </div>
                  )}
                  briefings={
                    <>
                      {/* Today's AI Daily Briefing */}
                      <DailyBriefCard
                            currentSituation={dailyBrief.currentSituation}
                            keyRisks={dailyBrief.keyRisks}
                            forecast={dailyBrief.forecast}
                            recommendedActions={dailyBrief.recommendedActions}
                            expectedImprovement={`-${totalReduction > 0 ? totalReduction : 22} AQI`}
                          />

                      {/* Today's AI Environmental Brief */}
                      <ExecutiveBriefCard
                        wardName={selectedWard.name}
                        currentAqi={predictedAqi}
                        primarySources={[
                          { source: sourceAttributions[0].source, percentage: sourceAttributions[0].percentage },
                          { source: sourceAttributions[1].source, percentage: sourceAttributions[1].percentage }
                        ]}
                        forecastText={
                          language === "hi" ? `अगले 24 घंटों में एक्यूआई ${currentForecast[0].predicted_aqi} तक पहुंचने की उम्मीद है। प्राथमिक कारक: ${sourceAttributions[0].source} (${sourceAttributions[0].percentage}%) और ${sourceAttributions[1].source} (${sourceAttributions[1].percentage}%) हैं।` :
                            language === "te" ? `రాబోయే 24 గంటల్లో AQI ${currentForecast[0].predicted_aqi} కి చేరే అవకాశం ఉంది. ప్రధాన కారకాలు: ${sourceAttributions[0].source} (${sourceAttributions[0].percentage}%) మరియు ${sourceAttributions[1].source} (${sourceAttributions[1].percentage}%).` :
                              language === "ta" ? `அடுத்த 24 மணிநேரத்தில் AQI ${currentForecast[0].predicted_aqi} ஆக உயரக்கூடும். முக்கிய காரணிகள்: ${sourceAttributions[0].source} (${sourceAttributions[0].percentage}%) மற்றும் ${sourceAttributions[1].source} (${sourceAttributions[1].percentage}%).` :
                                language === "kn" ? `ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ AQI ${currentForecast[0].predicted_aqi} ಗೆ ತಲುಪುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಪ್ರಮುಖ ಅಂಶಗಳು: ${sourceAttributions[0].source} (${sourceAttributions[0].percentage}%) ಮತ್ತು ${sourceAttributions[1].source} (${sourceAttributions[1].percentage}%).` :
                                  `AQI expected to reach ${currentForecast[0].predicted_aqi} in the next 24 hours. Primary factors: ${sourceAttributions[0].source} (${sourceAttributions[0].percentage}%) and ${sourceAttributions[1].source} (${sourceAttributions[1].percentage}%).`
                        }
                        recommendedActions={actionRecommendations.map(r => r.title)}
                        expectedImprovement={totalReduction > 0 ? totalReduction : 22}
                      />

                      {/* Citizen Health Risks - Horizontal Layout Grid */}
                      <div className="glass-card p-5 lg:p-7 flex flex-col gap-5 sm:gap-6 text-left">
                        <div>
                          <h4 className="text-xs font-bold text-muted uppercase tracking-widest leading-none font-extrabold flex items-center justify-between">
                            <span className="text-foreground flex items-center gap-2 text-base font-medium normal-case tracking-tight">
                              <Users className="w-5 h-5 text-primary" /> {t("citizenHealthRisksTitle")}
                            </span>
                            <span className="text-[9px] font-bold bg-danger/10 border border-danger/20 text-danger px-1.5 py-0.5 rounded">{t("advisoryActiveLabel")}</span>
                          </h4>
                          <span className="text-[10px] text-muted mt-1 block">{t("citizenHealthRisksSub")}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                          <HealthRiskCard
                            targetGroup="Senior Citizens"
                            currentRisk={predictedAqi > 180 ? "Critical" : predictedAqi > 120 ? "High" : "Moderate"}
                            forecastRisk="Rising loading expected near traffic sectors."
                            recommendation="Limit outdoor physical exposure between 1 PM and 5 PM."
                            priority="Critical"
                            icon={<Users className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Asthma Patients"
                            currentRisk={predictedAqi > 160 ? "Critical" : predictedAqi > 110 ? "High" : "Moderate"}
                            forecastRisk="Particulate density exceeds safe aerosol levels."
                            recommendation="Keep rescue inhalers accessible; prefer indoor active paths."
                            priority="Critical"
                            icon={<Heart className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Outdoor Workers"
                            currentRisk={predictedAqi > 140 ? "High" : "Moderate"}
                            forecastRisk="Soot accumulations from combustion source emissions."
                            recommendation="Wear certified N95 respirators during high-transit shifts."
                            priority="High"
                            icon={<Activity className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Children & Schools"
                            currentRisk={predictedAqi > 120 ? "High" : "Moderate"}
                            forecastRisk="Fine particulates remain suspended under calm winds."
                            recommendation="Divert outdoor physical education activities to clean indoor courts."
                            priority="High"
                            icon={<Users className="w-4 h-4" />}
                          />
                        </div>
                      </div>
                    </>
                  }
                />
              )}

              {activePage === "map" && (
                <DigitalTwin
                  wards={allLiveWards}
                  selectedWard={selectedWard}
                  onSelectWard={handleWardSelect}
                  recommendations={recommendations}
                  onExecutePolicy={handleExecutePolicy}
                />
              )}

              {activePage === "prediction" && (
                <ForecastCenter
                  wards={activeWards}
                  selectedWard={selectedWard}
                  onSelectWard={handleWardSelect}
                  onNavigateToMap={() => handleTabClick("map")}
                  narrativeExplanation={narrativeExplanation}
                />
              )}

              {activePage === "reports" && (
                <ReportsDashboard
                  selectedWard={selectedWard}
                  predictedAqi={predictedAqi}
                  simulatedTraffic={simulatedTraffic}
                  setSimulatedTraffic={setSimulatedTraffic}
                  simulatedConstruction={simulatedConstruction}
                  setSimulatedConstruction={setSimulatedConstruction}
                  simulatedIndustrial={simulatedIndustrial}
                  setSimulatedIndustrial={setSimulatedIndustrial}
                  simulatedSprinkling={simulatedSprinkling}
                  setSimulatedSprinkling={setSimulatedSprinkling}
                  simulatedWasteBurning={simulatedWasteBurning}
                  setSimulatedWasteBurning={setSimulatedWasteBurning}
                  estimatedCost={estimatedCost}
                  estimatedTime={estimatedTime}
                  environmentalImpact={environmentalImpact}
                  totalReduction={totalReduction}
                  sourceAttributions={sourceAttributions}
                  dynamicExplanation={dynamicExplanation}
                  actionRecommendations={actionRecommendations}
                  setActionRecommendations={setActionRecommendations}
                />
              )}

              {activePage === "copilot" && (
                <CopilotConsole
                  selectedWard={selectedWard}
                  wards={allLiveWards}
                  onGenerateReport={() => handleGenerateReport("Weekly")}
                  onViewTwin={() => handleTabClick("map")}
                  onOpenForecast={() => handleTabClick("prediction")}
                  onNavigate={handleTabClick}
                />
              )}

              {activePage === "settings" && <SettingsLayout />}

              {activePage === "About" && (
                <div className="grid grid-cols-12 gap-6 pt-4">
                  <div className="col-span-12 lg:col-span-7">
                    <div className="eyebrow">Version 1.0.0 · {selectedRegion.state}</div>
                    <h2 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-extralight tracking-[-0.04em]">
                      Predict. Explain.<span className="block text-foreground/55">Act.</span>
                    </h2>
                    <p className="mt-6 max-w-xl text-foreground/75 leading-relaxed">
                      PranaAI is an urban environmental decision intelligence platform. Standard AQI tools only show historical values; PranaAI uses machine-learning forecasts and a multi-agent architecture to predict what comes next, trace why it happens, and simulate interventions before municipal deployment.
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4 content-start">
                    {[
                      { k: "Forecast horizon", v: "72h" },
                      { k: "Cities", v: String(Object.keys(MOCK_CITY_WARDS).length) },
                      { k: "Wards modelled", v: String(Object.values(MOCK_CITY_WARDS).flat().length) },
                      { k: "Languages", v: String(SUPPORTED_LANGUAGES.length) }
                    ].map((m) => (
                      <div key={m.k} className="glass-card p-5">
                        <div className="relative eyebrow">{m.k}</div>
                        <div className="relative mt-3 text-4xl font-extralight tabular">{m.v}</div>
                      </div>
                    ))}
                    <p className="col-span-2 text-sm text-muted">
                      Developed by Team PranaAI ·{" "}
                      <a href="#/privacy" className="underline hover:text-foreground">Privacy Policy</a> ·{" "}
                      <a href="#/security" className="underline hover:text-foreground">Security</a>
                    </p>
                  </div>
                </div>
              )}
            </AppShell>
          )}

          {/* 5. NOTIFICATION DRAWER */}
          <AnimatePresence>
            {showNotifications && (
              <div className="fixed inset-0 z-50 flex justify-end">
                <motion.div className="absolute inset-0 bg-[#020814]/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} />
                <motion.aside
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative m-2 sm:m-4 w-full max-w-sm rounded-[2rem] bg-card border border-border backdrop-blur-2xl shadow-floating p-6 flex flex-col gap-5"
                  aria-label="Notifications"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="eyebrow">Notifications</div>
                      <div className="mt-1.5 text-lg font-light">{notifications.filter(n => n.unread).length} unread</div>
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="icon-btn" aria-label="Close notifications"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 overflow-y-auto -mx-2 px-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="rounded-2xl bg-foreground/[0.04] px-4 py-3.5 relative">
                        {n.unread && <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full" />}
                        <div className="text-[11px] text-muted">{n.time}</div>
                        <div className="text-sm mt-1">{n.title}</div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* 6. FLOATING PERPLEXITY-STYLE AI COPILOT OVERLAY (STILL ACCESSIBLE) */}
          {!legalDoc && flow === "dashboard" && activePage !== "copilot" && (
          <div className="hidden lg:block fixed bottom-10 right-10 z-40">
            <button
              onClick={() => {
                setShowCopilot(!showCopilot);
              }}
              aria-label="Quick copilot"
              aria-expanded={showCopilot}
              className="w-14 h-14 rounded-full btn-primary cursor-pointer"
            >
              {showCopilot ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" strokeWidth={1.8} />}
            </button>

            {showCopilot && (
              <div className="absolute bottom-18 right-0 w-[400px] rounded-[2rem] bg-card border border-border backdrop-blur-2xl shadow-floating p-5 flex flex-col gap-4 z-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-success rounded-full animate-ping"></div>
                    <h3 className="text-sm font-medium text-foreground">PranaAI Copilot · {selectedWard.name}</h3>
                  </div>
                  <button onClick={() => setShowCopilot(false)} className="text-xs text-muted hover:text-foreground cursor-pointer">Close</button>
                </div>

                <div className="h-[260px] rounded-2xl bg-foreground/[0.03] p-3 overflow-y-auto flex flex-col gap-3">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed",
                        msg.sender === "user"
                          ? "bg-primary text-on-primary font-semibold"
                          : "bg-foreground/[0.06] text-foreground"
                      )}>
                        {msg.text}

                        {msg.routes && (
                          <div className="mt-3 border-t border-border pt-2 flex flex-col gap-1.5">
                            <span className="text-[9px] uppercase font-bold text-primary">Recommended Routes:</span>
                            {msg.routes.map((r: any, idx: number) => (
                              <div key={idx} className="bg-background p-2 rounded border border-border flex justify-between items-center text-[10px]">
                                <div>
                                  <span className="font-bold text-foreground block">{r.name}</span>
                                  <span className="text-[8px] text-muted block">{r.reason}</span>
                                </div>
                                <span className="font-extrabold text-success">AQI {r.aqi}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatBusy && <div className="self-start px-3.5 py-2.5 rounded-2xl text-xs bg-foreground/[0.06] text-muted animate-pulse">Thinking…</div>}
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => handleSendMessage(undefined, `Can I jog tomorrow morning in ${selectedWard.name}?`)} className="btn-ghost h-8 px-3 text-[11px] cursor-pointer">Can I jog tomorrow?</button>
                  <button onClick={() => handleSendMessage(undefined, `Is it safe outdoors in ${selectedWard.name} today?`)} className="btn-ghost h-8 px-3 text-[11px] cursor-pointer">Exposure risk today</button>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask about air in ${selectedWard.name}…`}
                    maxLength={1000}
                    aria-label="Ask the copilot"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 h-10 rounded-full bg-foreground/[0.05] border border-border px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/60"
                  />
                  <button type="submit" aria-label="Send" className="btn-primary w-10 h-10 cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
          )}


        </div>
      </div>
    </EnvironmentalThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PranaApp />
      </SettingsProvider>
    </ThemeProvider>
  );
}
