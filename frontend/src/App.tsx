import { useState, useEffect, useMemo } from "react";
import L from "leaflet";

// Override default marker icons to correct Vite asset compilation URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

import {
  Activity,
  Map as MapIcon,
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  Globe,
  Info,
  Wind,
  Sun,
  Send,
  RefreshCw,
  MapPin,
  Bell,
  Moon,
  Lock,
  Compass,
  Menu,
  ChevronLeft,
  Search,
  Clock,
  Layers,
  Truck,
  HardHat,
  CheckCircle2,
  Users,
  Heart
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from "recharts";

import { ThemeProvider } from "./providers/ThemeProvider";
import { useTheme } from "./hooks/useTheme";
import { Button } from "./components/ui/Button";
import { Modal } from "./components/ui/Modal";
import { cn } from "./utils/cn";



// Import custom boot experience component
import { BootLayout } from "./components/boot/BootSequence";
import { EnvironmentalThemeProvider, EnvironmentalAmbience } from "./theme/EnvironmentalThemeEngine";
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
  EnvironmentalHealthIndexCard,
  DailyBriefCard,
  PolicyImpactCard
} from "./components/ui/UrbanIntelligenceComponents";
import {
  uiTranslations,
  suggestedLangByCity,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  localizedBootSteps
} from "./utils/i18n";


// API Server URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getWeatherShellClass = (aqi: number) => {
  return aqi <= 50 ? "bg-weather-good" : aqi <= 100 ? "bg-weather-moderate" : aqi <= 170 ? "bg-weather-poor" : "bg-weather-severe";
};
const getAQIBadge = (aqi: number) => {
  return aqi <= 50 ? "Good" : aqi <= 100 ? "Satisfactory" : aqi <= 200 ? "Moderate" : "Poor / Severe";
};
const getAQIMarkerColor = (aqi: number) => {
  return aqi <= 50 ? "#10B981" : aqi <= 100 ? "#FBBF24" : aqi <= 200 ? "#F97316" : "#EF4444";
};

// Comprehensive multi-city location database
const MOCK_CITY_WARDS: Record<string, any[]> = {
  Hyderabad: [
    { id: 1, name: "Gachibowli", aqi: 145, pm2_5: 58, pm10: 85, temperature: 31.5, humidity: 55, wind_speed: 6.2, weather_condition: "Sunny", environmental_health_score: 72, traffic_congestion: 65, industrial_emissions: 5, construction_activity: 50, dust_level: 40, population: 120000, latitude: 17.4401, longitude: 78.3489, uv_index: 8, label: "Place" },
    { id: 2, name: "Madhapur", aqi: 182, pm2_5: 78, pm10: 110, temperature: 32.0, humidity: 52, wind_speed: 5.1, weather_condition: "Cloudy", environmental_health_score: 58, traffic_congestion: 80, industrial_emissions: 8, construction_activity: 45, dust_level: 42, population: 160000, latitude: 17.4483, longitude: 78.3915, uv_index: 6, label: "Place" },
    { id: 3, name: "Kondapur", aqi: 125, pm2_5: 48, pm10: 72, temperature: 30.5, humidity: 62, wind_speed: 7.2, weather_condition: "Cloudy", environmental_health_score: 75, traffic_congestion: 55, industrial_emissions: 2, construction_activity: 55, dust_level: 35, population: 110000, latitude: 17.4622, longitude: 78.3572, uv_index: 7, label: "Place" },
    { id: 4, name: "Hitech City", aqi: 198, pm2_5: 84, pm10: 124, temperature: 32.2, humidity: 50, wind_speed: 4.8, weather_condition: "Sunny", environmental_health_score: 55, traffic_congestion: 85, industrial_emissions: 3, construction_activity: 60, dust_level: 52, population: 95000, latitude: 17.4504, longitude: 78.3809, uv_index: 7, label: "Place" },
    { id: 5, name: "Jubilee Hills", aqi: 95, pm2_5: 38, pm10: 58, temperature: 29.8, humidity: 60, wind_speed: 6.8, weather_condition: "Sunny", environmental_health_score: 82, traffic_congestion: 50, industrial_emissions: 1, construction_activity: 30, dust_level: 25, population: 85000, latitude: 17.4325, longitude: 78.4075, uv_index: 8, label: "Place" },
    { id: 6, name: "Banjara Hills", aqi: 110, pm2_5: 44, pm10: 64, temperature: 30.0, humidity: 58, wind_speed: 6.5, weather_condition: "Sunny", environmental_health_score: 78, traffic_congestion: 60, industrial_emissions: 2, construction_activity: 35, dust_level: 28, population: 90000, latitude: 17.4165, longitude: 78.4350, uv_index: 8, label: "Place" },
    { id: 7, name: "Begumpet", aqi: 156, pm2_5: 65, pm10: 92, temperature: 30.8, humidity: 58, wind_speed: 5.5, weather_condition: "Sunny", environmental_health_score: 68, traffic_congestion: 60, industrial_emissions: 2, construction_activity: 75, dust_level: 48, population: 45000, latitude: 17.4448, longitude: 78.4600, uv_index: 8, label: "Place" },
    { id: 8, name: "Secunderabad", aqi: 168, pm2_5: 70, pm10: 98, temperature: 31.0, humidity: 56, wind_speed: 5.8, weather_condition: "Sunny", environmental_health_score: 63, traffic_congestion: 50, industrial_emissions: 2, construction_activity: 80, dust_level: 55, population: 65000, latitude: 17.4399, longitude: 78.4983, uv_index: 9, label: "Place" },
    { id: 9, name: "Charminar", aqi: 220, pm2_5: 112, pm10: 165, temperature: 33.0, humidity: 52, wind_speed: 4.2, weather_condition: "Haze", environmental_health_score: 45, traffic_congestion: 90, industrial_emissions: 12, construction_activity: 40, dust_level: 60, population: 250000, latitude: 17.3616, longitude: 78.4747, uv_index: 9, label: "Place" },
    { id: 10, name: "Kukatpally", aqi: 185, pm2_5: 88, pm10: 120, temperature: 32.5, humidity: 50, wind_speed: 5.0, weather_condition: "Cloudy", environmental_health_score: 50, traffic_congestion: 82, industrial_emissions: 10, construction_activity: 65, dust_level: 50, population: 180000, latitude: 17.4855, longitude: 78.4100, uv_index: 7, label: "Place" },
    { id: 11, name: "Uppal", aqi: 172, pm2_5: 75, pm10: 105, temperature: 31.8, humidity: 54, wind_speed: 5.2, weather_condition: "Cloudy", environmental_health_score: 60, traffic_congestion: 70, industrial_emissions: 14, construction_activity: 50, dust_level: 45, population: 150000, latitude: 17.4019, longitude: 78.5602, uv_index: 7, label: "Place" },
    { id: 12, name: "LB Nagar", aqi: 158, pm2_5: 66, pm10: 94, temperature: 31.0, humidity: 55, wind_speed: 5.4, weather_condition: "Sunny", environmental_health_score: 66, traffic_congestion: 65, industrial_emissions: 8, construction_activity: 55, dust_level: 40, population: 130000, latitude: 17.3457, longitude: 78.5522, uv_index: 8, label: "Place" },
    { id: 13, name: "Nampally", aqi: 195, pm2_5: 92, pm10: 130, temperature: 32.0, humidity: 53, wind_speed: 4.8, weather_condition: "Sunny", environmental_health_score: 52, traffic_congestion: 88, industrial_emissions: 5, construction_activity: 60, dust_level: 52, population: 110000, latitude: 17.3918, longitude: 78.4678, uv_index: 8, label: "Place" },
    { id: 14, name: "Miyapur", aqi: 138, pm2_5: 54, pm10: 80, temperature: 30.2, humidity: 60, wind_speed: 6.8, weather_condition: "Cloudy", environmental_health_score: 70, traffic_congestion: 60, industrial_emissions: 4, construction_activity: 45, dust_level: 35, population: 145000, latitude: 17.4966, longitude: 78.3483, uv_index: 7, label: "Place" },
    { id: 15, name: "Mehdipatnam", aqi: 165, pm2_5: 72, pm10: 100, temperature: 31.2, humidity: 57, wind_speed: 5.6, weather_condition: "Sunny", environmental_health_score: 64, traffic_congestion: 75, industrial_emissions: 3, construction_activity: 50, dust_level: 42, population: 165000, latitude: 17.3971, longitude: 78.4316, uv_index: 8, label: "Place" }
  ],
  Bangalore: [
    { id: 16, name: "Whitefield", aqi: 56, pm2_5: 22, pm10: 45, temperature: 24.0, humidity: 62, wind_speed: 4.8, weather_condition: "Sunny", environmental_health_score: 92, traffic_congestion: 64, industrial_emissions: 40, construction_activity: 55, dust_level: 50, population: 150000, latitude: 12.9698, longitude: 77.7500, uv_index: 6, label: "IT Cluster" },
    { id: 17, name: "Hoodi", aqi: 60, pm2_5: 24, pm10: 49, temperature: 25.0, humidity: 65, wind_speed: 4.5, weather_condition: "Cloudy", environmental_health_score: 85, traffic_congestion: 58, industrial_emissions: 55, construction_activity: 60, dust_level: 52, population: 80000, latitude: 12.9950, longitude: 77.7110, uv_index: 5, label: "Industrial" },
    { id: 18, name: "Indiranagar", aqi: 53, pm2_5: 21, pm10: 43, temperature: 23.5, humidity: 60, wind_speed: 5.2, weather_condition: "Sunny", environmental_health_score: 94, traffic_congestion: 60, industrial_emissions: 20, construction_activity: 35, dust_level: 30, population: 120000, latitude: 12.9784, longitude: 77.6408, uv_index: 6, label: "Residential/Commercial" },
    { id: 19, name: "Electronic City", aqi: 62, pm2_5: 25, pm10: 50, temperature: 25.5, humidity: 58, wind_speed: 4.2, weather_condition: "Sunny", environmental_health_score: 88, traffic_congestion: 70, industrial_emissions: 45, construction_activity: 40, dust_level: 45, population: 200000, latitude: 12.8456, longitude: 77.6603, uv_index: 7, label: "IT Park" },
    { id: 20, name: "Koramangala", aqi: 55, pm2_5: 22, pm10: 44, temperature: 24.2, humidity: 64, wind_speed: 4.6, weather_condition: "Cloudy", environmental_health_score: 90, traffic_congestion: 65, industrial_emissions: 15, construction_activity: 30, dust_level: 32, population: 140000, latitude: 12.9352, longitude: 77.6245, uv_index: 6, label: "Residential Hub" }
  ],
  Chennai: [
    { id: 21, name: "Adyar", aqi: 59, pm2_5: 24, pm10: 48, temperature: 29.0, humidity: 78, wind_speed: 6.5, weather_condition: "Sunny", environmental_health_score: 91, traffic_congestion: 45, industrial_emissions: 20, construction_activity: 30, dust_level: 35, population: 110000, latitude: 13.0033, longitude: 80.2550, uv_index: 8, label: "Coastal Centroid" },
    { id: 22, name: "Velachery", aqi: 65, pm2_5: 26, pm10: 52, temperature: 30.0, humidity: 75, wind_speed: 6.2, weather_condition: "Sunny", environmental_health_score: 85, traffic_congestion: 65, industrial_emissions: 25, construction_activity: 45, dust_level: 40, population: 130000, latitude: 12.9790, longitude: 80.2180, uv_index: 8, label: "Residential" },
    { id: 23, name: "T Nagar", aqi: 72, pm2_5: 30, pm10: 58, temperature: 31.0, humidity: 72, wind_speed: 5.8, weather_condition: "Cloudy", environmental_health_score: 80, traffic_congestion: 80, industrial_emissions: 10, construction_activity: 40, dust_level: 48, population: 150000, latitude: 13.0405, longitude: 80.2337, uv_index: 7, label: "Commercial Hub" },
    { id: 24, name: "Mylapore", aqi: 57, pm2_5: 22, pm10: 46, temperature: 29.5, humidity: 76, wind_speed: 6.0, weather_condition: "Sunny", environmental_health_score: 93, traffic_congestion: 50, industrial_emissions: 5, construction_activity: 25, dust_level: 30, population: 95000, latitude: 13.0330, longitude: 80.2680, uv_index: 8, label: "Heritage Residential" },
    { id: 25, name: "Guindy", aqi: 68, pm2_5: 28, pm10: 55, temperature: 30.5, humidity: 74, wind_speed: 5.5, weather_condition: "Sunny", environmental_health_score: 83, traffic_congestion: 70, industrial_emissions: 35, construction_activity: 50, dust_level: 45, population: 75000, latitude: 13.0067, longitude: 80.2200, uv_index: 8, label: "Industrial Estate" }
  ],
  Delhi: [
    { id: 26, name: "Connaught Place", aqi: 125, pm2_5: 50, pm10: 110, temperature: 34.0, humidity: 42, wind_speed: 2.5, weather_condition: "Sunny", environmental_health_score: 54, traffic_congestion: 90, industrial_emissions: 80, construction_activity: 70, dust_level: 90, population: 80000, latitude: 28.6304, longitude: 77.2177, uv_index: 7, label: "City Center" },
    { id: 27, name: "Saket", aqi: 117, pm2_5: 46, pm10: 98, temperature: 33.5, humidity: 45, wind_speed: 2.8, weather_condition: "Sunny", environmental_health_score: 60, traffic_congestion: 75, industrial_emissions: 30, construction_activity: 50, dust_level: 65, population: 140000, latitude: 28.5245, longitude: 77.2066, uv_index: 7, label: "South Delhi" },
    { id: 28, name: "Anand Vihar", aqi: 156, pm2_5: 75, pm10: 136, temperature: 35.0, humidity: 40, wind_speed: 2.2, weather_condition: "Haze", environmental_health_score: 42, traffic_congestion: 88, industrial_emissions: 85, construction_activity: 80, dust_level: 116, population: 220000, latitude: 28.6469, longitude: 77.3160, uv_index: 6, label: "Transit Node" },
    { id: 29, name: "Dwarka", aqi: 112, pm2_5: 42, pm10: 94, temperature: 33.0, humidity: 48, wind_speed: 3.0, weather_condition: "Sunny", environmental_health_score: 65, traffic_congestion: 60, industrial_emissions: 15, construction_activity: 55, dust_level: 60, population: 250000, latitude: 28.5921, longitude: 77.0460, uv_index: 7, label: "West Delhi" },
    { id: 30, name: "Lajpat Nagar", aqi: 124, pm2_5: 52, pm10: 103, temperature: 34.5, humidity: 43, wind_speed: 2.7, weather_condition: "Sunny", environmental_health_score: 52, traffic_congestion: 82, industrial_emissions: 20, construction_activity: 60, dust_level: 75, population: 180000, latitude: 28.5677, longitude: 77.2431, uv_index: 7, label: "Central South" }
  ],
  Mumbai: [
    { id: 31, name: "Andheri", aqi: 61, pm2_5: 25, pm10: 50, temperature: 28.0, humidity: 82, wind_speed: 3.2, weather_condition: "Sunny", environmental_health_score: 90, traffic_congestion: 85, industrial_emissions: 50, construction_activity: 60, dust_level: 65, population: 300000, latitude: 19.1136, longitude: 72.8697, uv_index: 8, label: "Commercial Hub" },
    { id: 32, name: "Bandra", aqi: 60, pm2_5: 24, pm10: 49, temperature: 27.5, humidity: 84, wind_speed: 3.5, weather_condition: "Sunny", environmental_health_score: 92, traffic_congestion: 75, industrial_emissions: 10, construction_activity: 40, dust_level: 45, population: 220000, latitude: 19.0544, longitude: 72.8406, uv_index: 8, label: "Coastal Residential" },
    { id: 33, name: "Powai", aqi: 58, pm2_5: 23, pm10: 47, temperature: 28.5, humidity: 80, wind_speed: 3.0, weather_condition: "Cloudy", environmental_health_score: 91, traffic_congestion: 65, industrial_emissions: 25, construction_activity: 45, dust_level: 40, population: 170000, latitude: 19.1176, longitude: 72.9060, uv_index: 7, label: "Lake Centroid" },
    { id: 34, name: "Lower Parel", aqi: 66, pm2_5: 27, pm10: 53, temperature: 29.0, humidity: 81, wind_speed: 2.8, weather_condition: "Sunny", environmental_health_score: 88, traffic_congestion: 80, industrial_emissions: 15, construction_activity: 50, dust_level: 50, population: 130000, latitude: 18.9944, longitude: 72.8258, uv_index: 8, label: "Business District" }
  ]
};

const MOCK_WARDS = MOCK_CITY_WARDS.Hyderabad;

const CITY_REGIONS: Record<string, { center: [number, number]; zoom: number; focus: string; state: string }> = {
  Hyderabad: { center: [17.3850, 78.4867], zoom: 12, focus: "Hyderabad Central", state: "Telangana" },
  Bangalore: { center: [12.9716, 77.5946], zoom: 12, focus: "Whitefield Centroid", state: "Karnataka" },
  Chennai: { center: [13.0827, 80.2707], zoom: 12, focus: "Adyar Coastal Centroid", state: "Tamil Nadu" },
  Delhi: { center: [28.6139, 77.2090], zoom: 11, focus: "Connaught Place Centroid", state: "NCR" },
  Mumbai: { center: [19.0760, 72.8777], zoom: 11, focus: "Andheri West Centroid", state: "Maharashtra" }
};

const AQI_IN_METRO_CITIES = [
  { name: "Hyderabad", aqi: 145, pm2_5: 58, pm10: 85, state: "Telangana", latitude: 17.3850, longitude: 78.4867, forecast: 152, envScore: 68, trend: "up" as const, confidence: 94 },
  { name: "Bangalore", aqi: 56, pm2_5: 22, pm10: 45, state: "Karnataka", latitude: 12.9716, longitude: 77.5946, forecast: 52, envScore: 88, trend: "down" as const, confidence: 96 },
  { name: "Chennai", aqi: 59, pm2_5: 24, pm10: 48, state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, forecast: 62, envScore: 82, trend: "up" as const, confidence: 92 },
  { name: "Delhi", aqi: 125, pm2_5: 50, pm10: 110, state: "NCR", latitude: 28.6139, longitude: 77.2090, forecast: 138, envScore: 54, trend: "up" as const, confidence: 89 },
  { name: "Mumbai", aqi: 61, pm2_5: 25, pm10: 50, state: "Maharashtra", latitude: 19.0760, longitude: 72.8777, forecast: 58, envScore: 78, trend: "down" as const, confidence: 95 }
];

const buildMetroMapPoints = () => {
  const points: Record<string, any[]> = {};
  Object.keys(MOCK_CITY_WARDS).forEach((city) => {
    points[city] = MOCK_CITY_WARDS[city].map((ward) => ({
      id: `ward-${ward.id}`,
      name: ward.name,
      label: city === "Hyderabad" ? "Place" : ward.label || "Place",
      kind: "place" as const,
      latitude: ward.latitude,
      longitude: ward.longitude,
      aqi: ward.aqi,
      pm2_5: ward.pm2_5,
      pm10: ward.pm10,
      sourceWard: ward
    }));
  });
  return points;
};

type WardModel = (typeof MOCK_WARDS)[number];

type LiveWardMetrics = Pick<WardModel, "aqi" | "pm2_5" | "pm10" | "temperature" | "humidity" | "wind_speed" | "weather_condition" | "environmental_health_score"> & {
  source: string;
};

const normalizeWardKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const buildLiveMetrics = (ward: Partial<LiveWardMetrics>, fallbackWard: WardModel, source: string): LiveWardMetrics => ({
  aqi: Number(ward.aqi ?? fallbackWard.aqi),
  pm2_5: Number(ward.pm2_5 ?? Math.floor(Number(ward.aqi ?? fallbackWard.aqi) * 0.4)),
  pm10: Number(ward.pm10 ?? fallbackWard.pm10),
  temperature: Number(ward.temperature ?? fallbackWard.temperature),
  humidity: Number(ward.humidity ?? fallbackWard.humidity),
  wind_speed: Number(ward.wind_speed ?? fallbackWard.wind_speed),
  weather_condition: ward.weather_condition ?? fallbackWard.weather_condition,
  environmental_health_score: Number(ward.environmental_health_score ?? fallbackWard.environmental_health_score),
  source,
});

function PranaApp() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { systemTimezone, formatTemp } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [flow, setFlow] = useState<string>("landing");

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedWard, setSelectedWard] = useState<WardModel>(MOCK_WARDS[0]);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  const [liveWardMetrics, setLiveWardMetrics] = useState<Record<string, LiveWardMetrics>>({});
  const [liveDataSource, setLiveDataSource] = useState<string>("mock fallback");
  const [liveDataLastUpdated, setLiveDataLastUpdated] = useState<string>("");

  const [isAuthenticated] = useState<boolean>(true);

  // Scroll-aware landing viewport state
  const [scrollY, setScrollY] = useState<number>(0);

  // Autoplay tagline state for storytelling
  const [taglineIdx, setTaglineIdx] = useState<number>(0);

  // Layout sidebars & toggles
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Clock telemetry state
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const fetchTelemetry = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      try {
        const res = await fetch(`${API_URL}/api/dashboard/wards`, { 
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const metrics: Record<string, LiveWardMetrics> = {};
            data.forEach((w: any) => {
              const key = normalizeWardKey(String(w.name || ""));
              if (key) {
                let foundFallback = null;
                for (const cityWards of Object.values(MOCK_CITY_WARDS)) {
                  const found = cityWards.find((fallback) => normalizeWardKey(fallback.name) === key);
                  if (found) {
                    foundFallback = found;
                    break;
                  }
                }
                metrics[key] = buildLiveMetrics(
                  {
                    aqi: w.aqi,
                    pm2_5: w.pm2_5,
                    pm10: w.pm10,
                    temperature: w.temperature,
                    humidity: w.humidity,
                    wind_speed: w.wind_speed,
                    weather_condition: w.weather_condition,
                    environmental_health_score: w.environmental_health_score
                  },
                  foundFallback || MOCK_WARDS[0],
                  "backend"
                );
              }
            });
            setLiveWardMetrics(metrics);
            setLiveDataSource("backend telemetry");
            setLiveDataLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            return;
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn("Failed to fetch local backend telemetry, falling back to local mock data:", err);
      }

      // Direct fallback to local mock data since WAQI is removed
      const fallbackMetrics: Record<string, LiveWardMetrics> = {};
      Object.values(MOCK_CITY_WARDS).forEach((cityWards) => {
        cityWards.forEach((w) => {
          fallbackMetrics[normalizeWardKey(w.name)] = buildLiveMetrics(w, w, "local fallback");
        });
      });
      setLiveWardMetrics(fallbackMetrics);
      setLiveDataSource("local fallback");
      setLiveDataLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    fetchTelemetry();
  }, []);

  const activeWards = useMemo(() => {
    return (MOCK_CITY_WARDS[selectedCity] || MOCK_CITY_WARDS.Hyderabad).map((w) => {
      const key = normalizeWardKey(w.name);
      return liveWardMetrics[key] ? { ...w, ...liveWardMetrics[key] } : w;
    });
  }, [selectedCity, liveWardMetrics]);

  useEffect(() => {
    const e = liveWardMetrics[normalizeWardKey(selectedWard.name)];
    if (e && selectedWard.aqi !== e.aqi) {
      setSelectedWard((prev) => ({
        ...prev,
        aqi: e.aqi,
        pm2_5: e.pm2_5,
        pm10: e.pm10,
        temperature: e.temperature,
        humidity: e.humidity,
        wind_speed: e.wind_speed,
        weather_condition: e.weather_condition,
        environmental_health_score: e.environmental_health_score
      }));
    }
  }, [liveWardMetrics, selectedWard.name, selectedWard.aqi]);

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      if (systemTimezone === "UTC") {
        setCurrentTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: "UTC" }) + " UTC");
      } else {
        setCurrentTimeStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: "Asia/Kolkata" }) + " IST");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [systemTimezone]);

  // Track scroll offsets for transparent header transitions
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tagline rotation timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
      impact: "-18 AQI Points",
      confidence: 94,
      duration: "4 hours",
      evidence: "Commute traffic sensors registered traffic congestion at 65% in Gachibowli sectors.",
      executed: false
    },
    {
      id: 2,
      title: "Inspect Construction Site & Suppress Dust",
      desc: "Conduct on-site inspections of active construction areas in Gachibowli and mandate abating controls.",
      priority: "P2 / High",
      impact: "-9 AQI Points",
      confidence: 91,
      duration: "2 hours",
      evidence: "Particulate sensors recorded PM10 concentrations at 85 µg/m³ near Gachibowli centroids.",
      executed: false
    },
    {
      id: 3,
      title: "Deploy Environmental Water Sprinkling",
      desc: "Initiate localized water sprinkling runs across dry corridors in Gachibowli to suppress dust.",
      priority: "P3 / Medium",
      impact: "-6 AQI Points",
      confidence: 88,
      duration: "3 hours",
      evidence: "Fugitive dust loads reached 40% with local wind speeds at 6.2 m/s.",
      executed: false
    }
  ]);

  // i18n Language Selector states
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { language, setLanguage } = useSettings();

  const t = (key: string): string => {
    return uiTranslations[language]?.[key] || uiTranslations["en"]?.[key] || key;
  };

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

  const cityHotspots = AQI_IN_METRO_CITIES.map((city) => {
    const aqi = city.aqi;
    return {
      ...city,
      region: CITY_REGIONS[city.name],
      tone:
        aqi <= 100 ? "blue" : aqi <= 170 ? "yellow" : "red",
      toneClass:
        aqi <= 100 ? "bg-secondary/15 text-secondary border-secondary/30" : aqi <= 170 ? "bg-warning/15 text-warning border-warning/30" : "bg-danger/15 text-danger border-danger/30"
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
    { source: "Traffic", percentage: Math.round((rawTrafficAttr / totalRawAttr) * 1000) / 10, confidence: 93 },
    { source: "Construction", percentage: Math.round((rawConstructionAttr / totalRawAttr) * 1000) / 10, confidence: 91 },
    { source: "Industrial", percentage: Math.round((rawIndustrialAttr / totalRawAttr) * 1000) / 10, confidence: 92 },
    { source: "Weather", percentage: Math.round((rawWeatherAttr / totalRawAttr) * 1000) / 10, confidence: 95 },
    { source: "Natural Dust", percentage: Math.round((rawDustAttr / totalRawAttr) * 1000) / 10, confidence: 89 },
    { source: "Other Sources", percentage: Math.round((rawOtherAttr / totalRawAttr) * 1000) / 10, confidence: 85 },
    { source: "Unknown", percentage: Math.round((rawUnknownAttr / totalRawAttr) * 1000) / 10, confidence: 80 }
  ];

  const dynamicExplanation = isSimulating
    ? `Active policy simulation: Restricting traffic by ${simulatedTraffic}% and construction by ${simulatedConstruction}% is estimated to reduce AQI in ${selectedWard.name} from ${selectedWard.aqi} to ${predictedAqi}. This intervention lowers overall emission loads.`
    : `Air quality in ${selectedWard.name} stands at ${selectedWard.aqi} (${getAQIBadge(selectedWard.aqi)}). Commuter traffic congestion along key outer junctions accounts for ${Math.round((rawTrafficAttr / totalRawAttr) * 100)}% of the total load, exacerbated by local construction activities.`;

  // Live explainability feed items for chronological timeline
  const feedItems = [
    {
      id: 1,
      time: "09:15 AM",
      text: `Traffic congestion increased in ${selectedWard.name} IT corridor junctions.`,
      category: "Traffic",
      severity: "Medium" as const,
      confidence: 94,
      icon: <Truck className="w-3.5 h-3.5" />
    },
    {
      id: 2,
      time: "09:32 AM",
      text: `PM2.5 particulate loading elevated by 11% near ${selectedWard.name} centroids.`,
      category: "Sensors",
      severity: "Medium" as const,
      confidence: 98,
      icon: <Activity className="w-3.5 h-3.5" />
    },
    {
      id: 3,
      time: "10:05 AM",
      text: `Construction demolition dust detected near ${selectedWard.name} active sites.`,
      category: "Demolition",
      severity: "High" as const,
      confidence: 91,
      icon: <HardHat className="w-3.5 h-3.5" />
    },
    {
      id: 4,
      time: "10:18 AM",
      text: "AI forecast model grid confidence index stabilized at 93%.",
      category: "Forecast",
      severity: "Low" as const,
      confidence: 93,
      icon: <Clock className="w-3.5 h-3.5" />
    },
    {
      id: 5,
      time: "10:42 AM",
      text: `AI engine recommends transmitting directive to restrict heavy diesel transport near ${selectedWard.name}.`,
      category: "Advisory",
      severity: "High" as const,
      confidence: 94,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    }
  ];

  const [loading, setLoading] = useState(false);
  const [bootingProgress, setBootingProgress] = useState<number>(0);
  const [bootingStepLogs, setBootingStepLogs] = useState<string[]>([]);
  const [bootingActiveStep, setBootingActiveStep] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Live values based strictly on mock ward configurations
  const currentAqi = selectedWard.aqi;
  const weatherShellClass = getWeatherShellClass(currentAqi);
  const weatherLabel = selectedWard.weather_condition || "Clear";
  const liveTelemetryLabel = liveDataLastUpdated
    ? `${liveDataSource} · Updated ${liveDataLastUpdated}`
    : liveDataSource;

  const [targetRedirect, setTargetRedirect] = useState("dashboard");

  // Agent output states
  const [forecast, setForecast] = useState([
    { horizon_hours: 24, predicted_aqi: 152, confidence_score: 0.93, trend: "Rising" },
    { horizon_hours: 48, predicted_aqi: 160, confidence_score: 0.93, trend: "Rising" },
    { horizon_hours: 72, predicted_aqi: 138, confidence_score: 0.93, trend: "Falling" }
  ]);

  const currentForecast = forecast;



  const [narrativeExplanation, setNarrativeExplanation] = useState(
    "Air quality in Gachibowli stands at 145 (Moderate). Heavy diesel traffic during office commute hours along the outer ring road junction, paired with fugitive road dust from high-rise IT building sites, remains the primary pollutant vector under current calm weather settings."
  );



  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "agent", text: "Hello! I am your Citizen Advisory Agent. Ask me questions about Hyderabad's air quality, safe jogging hours, or clean exposure routes." }
  ]);

  // Dynamic recommendations recommendations
  const [recommendations, setRecommendations] = useState([
    { id: 1, title: "Restrict Heavy Silt Vehicles", desc: "Divert commercial diesel transport from Gachibowli outer ring road junctions during office commute spikes.", priority: "High", impact: "-22 AQI Points", executed: false },
    { id: 2, title: "Water Sprinkling & Mist Suppression", desc: "Deploy environmental sprinkler trucks across Madhapur high-rise construction zones to restrict particulate dust.", priority: "High", impact: "-18 AQI Points", executed: false },
    { id: 3, title: "Increase Electric Transit Frequency", desc: "Boost state electric bus runs near Hitech City IT clusters to cut single-occupancy vehicle commute volume.", priority: "Medium", impact: "-12 AQI Points", executed: false }
  ]);

  // Notifications List
  const [notifications] = useState<any[]>([
    { id: 1, title: "High AQI Alert", text: "Madhapur AQI crossed 180. Heavy traffic soot detected.", time: "10 mins ago", unread: true },
    { id: 2, title: "Weather Update", text: "Cloud cover moving in from west. Humidity increased by 12%.", time: "1 hr ago", unread: false },
    { id: 3, title: "AI Recommendation", text: "Sprinkling bind mitigation ready for Financial District.", time: "2 hrs ago", unread: true }
  ]);

  // Reports state
  const [reportsList, setReportsList] = useState<any[]>([
    { id: 1, title: "Hyderabad Daily Air Quality Bulletin", type: "Daily", created_at: "2026-06-27", summary: "Daily analysis for Hyderabad's IT corridor. High traffic spikes on Gachibowli roads elevated PM2.5 to 84 µg/m³ at 9:00 AM." },
    { id: 2, title: "IT Corridor Environmental Performance Audit", type: "Weekly", created_at: "2026-06-25", summary: "Weekly brief tracking Gachibowli, Madhapur, and Hitech City. Heavy building works in Financial District contributed to 28% of local particulate loading." }
  ]);

  // Flow persistence effect
  useEffect(() => {
    localStorage.setItem("flow", flow);
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [flow, isAuthenticated]);

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
          setBootingStepLogs(prev => [...prev, step]);
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

  const fetchWardIntelligence = async (wardId: number) => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    try {
      const res = await fetch(`${API_URL}/api/dashboard/wards/${wardId}/intelligence`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setForecast(data.predictions);
        setNarrativeExplanation(data.explanation.narrative_explanation);
      } else {
        throw new Error("API responded with an error status");
      }
    } catch (e) {
      clearTimeout(timeoutId);
      const current = activeWards.find(w => w.id === wardId) || activeWards[0];

      setForecast([
        { horizon_hours: 24, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 1.05))), confidence_score: 0.93, trend: "Rising" },
        { horizon_hours: 48, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 1.10))), confidence_score: 0.93, trend: "Rising" },
        { horizon_hours: 72, predicted_aqi: Math.min(500, Math.max(10, Math.floor(current.aqi * 0.92))), confidence_score: 0.93, trend: "Falling" }
      ]);

      const factor = current.traffic_congestion > 70 ? "heavy commute traffic" : "high real estate development";
      setNarrativeExplanation(
        `Air quality in ${current.name} is measured at ${current.aqi} (PM2.5: ${current.pm2_5} µg/m³). Explainability engines trace the spike to ${factor} with dispersion levels limited by light local winds.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardIntelligence(selectedWard.id);
  }, []);

  const translateBadge = (badge: string, lang: LanguageCode) => {
    if (lang === "hi") {
      switch (badge) {
        case "Good": return "अच्छा";
        case "Satisfactory": return "संतोषजनक";
        case "Moderate": return "मध्यम";
        default: return "खराब / गंभीर";
      }
    }
    if (lang === "te") {
      switch (badge) {
        case "Good": return "మంచిది";
        case "Satisfactory": return "సంతృప్తికరం";
        case "Moderate": return "సాధారణం";
        default: return "ప్రమాదకరం";
      }
    }
    if (lang === "ta") {
      switch (badge) {
        case "Good": return "நல்லது";
        case "Satisfactory": return "திருப்திகரமானது";
        case "Moderate": return "மிதமானது";
        default: return "மோசமானது / தீவிரமானது";
      }
    }
    if (lang === "kn") {
      switch (badge) {
        case "Good": return "ಉತ್ತಮ";
        case "Satisfactory": return "ತೃಪ್ತಿದಾಯಕ";
        case "Moderate": return "ಸಾಧಾರಣ";
        default: return "ಕಳಪೆ / ತೀವ್ರ";
      }
    }
    return badge;
  };

  const getDynamicDailyBrief = () => {
    const wardName = selectedWard.name;
    const aqi = predictedAqi;
    const forecastAqi = currentForecast?.[0]?.predicted_aqi || Math.min(500, Math.floor(predictedAqi * 1.05));
    const traffic = selectedWard.traffic_congestion || 0;
    const construction = selectedWard.construction_activity || 0;
    const windSpeed = selectedWard.wind_speed || 0.0;
    const humidity = selectedWard.humidity || 0;
    const population = selectedWard.population || 0;
    const badge = getAQIBadge(aqi);
    const translatedBadgeName = translateBadge(badge, language);

    // City-specific content profiles (for English/default)
    const cityProfiles: Record<string, {
      situation: string;
      risks: string[];
      forecast: string;
      actions: string[];
    }> = {
      Hyderabad: {
        situation: `IT corridor commuter traffic and construction dust push ${wardName} to ${aqi} AQI (${badge}). Dense office clusters create localized particulate hotspots.`,
        risks: [
          `High-rise building construction in ${wardName} generates fugitive dust (PM10 at ${selectedWard.pm10} µg/m³).`,
          `Traffic congestion (${traffic}%) on Outer Ring Road junctions amplifies vehicular soot during peak hours.`,
          `Humidity at ${humidity}% traps fine aerosols close to the surface.`
        ],
        forecast: `Particulate levels forecast near ${forecastAqi} AQI over 24h as office commute cycles repeat. Weekend relief expected.`,
        actions: [
          `Enforce dust suppression at construction sites across ${wardName}.`,
          `Stagger office commute timings to reduce peak-hour congestion.`
        ]
      },
      Bangalore: {
        situation: `${wardName} enjoys relatively clean air at ${aqi} AQI (${badge}) due to dense tree canopy and coastal breeze influence, but localized traffic nodes still spike.`,
        risks: [
          `IT corridor vehicle density in ${wardName} causes lunch-hour traffic pulses (${traffic}% congestion).`,
          `Construction debris from metro expansion adds PM10 load near transit corridors.`,
          `Light wind speeds (${windSpeed} m/s) limit afternoon dispersion.`
        ],
        forecast: `AQI expected to hold near ${forecastAqi} over 24h. Garden city vegetation buffers help maintain stable conditions.`,
        actions: [
          `Encourage staggered lunch breaks to reduce midday traffic in ${wardName}.`,
          `Expand green buffer zones along construction perimeters.`
        ]
      },
      Chennai: {
        situation: `Coastal humidity (${humidity}%) and sea breeze in ${wardName} keep AQI moderate at ${aqi} (${badge}), but inland traffic corridors show strain.`,
        risks: [
          `Sea breeze reversal traps afternoon emissions near ${wardName} coastal roads.`,
          `Construction activity (${construction}%) along the IT corridor generates dust.`,
          `Industrial emissions from north Chennai contribute to PM2.5 creep.`
        ],
        forecast: `AQI may touch ${forecastAqi} as sea breeze weakens in the evening. Coastal dispersal improves by morning.`,
        actions: [
          `Increase water sprinkling on unpaved roads near ${wardName} construction sites.`,
          `Monitor industrial stack emissions during sea breeze reversal hours.`
        ]
      },
      Delhi: {
        situation: `${wardName} records elevated AQI at ${aqi} (${badge}) due to calm wind conditions (${windSpeed} m/s), high vehicle density, and regional crop residue burning.`,
        risks: [
          `Thermal inversion traps pollutants near the surface with wind speeds at ${windSpeed} m/s.`,
          `Vehicular congestion (${traffic}%) at major intersections contributes to peak soot loads.`,
          `Secondary particulate formation increases under high humidity (${humidity}%) conditions.`
        ],
        forecast: `AQI expected to rise to ${forecastAqi} over 24h as calm conditions persist. No significant wind relief expected.`,
        actions: [
          `Enforce odd-even vehicle scheme in ${wardName} to cut traffic emissions by 15%.`,
          `Deploy anti-smog guns at major intersections for particulate suppression.`
        ]
      },
      Mumbai: {
        situation: `${wardName} coastal location provides moderate AQI at ${aqi} (${badge}), but construction (${construction}%) and traffic congestion (${traffic}%) are growing concerns.`,
        risks: [
          `Sea breeze provides partial relief but construction dust near ${wardName} remains unmitigated.`,
          `Traffic bottlenecks at business district junctions elevate rush-hour AQI spikes.`,
          `High population density (${(population / 1000).toFixed(0)}K) increases cumulative exposure risk.`
        ],
        forecast: `AQI forecast at ${forecastAqi} over 24h; coastal winds expected to strengthen, improving dispersion by evening.`,
        actions: [
          `Mandate construction dust barriers and water sprinkling in ${wardName}.`,
          `Promote ferry and coastal rail use to reduce road congestion.`
        ]
      }
    };

    const profile = cityProfiles[selectedCity] || cityProfiles.Hyderabad;

    let situation: string, risks: string[], forecastTxt: string, actions: string[];

    if (language === "en" || !["hi", "te", "ta", "kn"].includes(language)) {
      situation = profile.situation;
      risks = profile.risks;
      forecastTxt = profile.forecast;
      actions = profile.actions;
    } else if (language === "hi") {
      const cityProfilesHi: Record<string, {
        situation: string;
        risks: string[];
        forecast: string;
        actions: string[];
      }> = {
        Hyderabad: {
          situation: `${wardName} क्षेत्र में आईटी कॉरिडोर यात्री यातायात और निर्माण धूल वर्तमान में इसे ${aqi} AQI (${translatedBadgeName}) पर ले जाते हैं। घने कार्यालय समूहों के कारण स्थानीय स्तर पर कणात्मक हॉटस्पॉट बन रहे हैं।`,
          risks: [
            `${wardName} में ऊंची इमारतों के निर्माण से उड़ने वाली धूल (PM10 स्तर ${selectedWard.pm10 || 0} µg/m³) उत्पन्न हो रही है।`,
            `आउटर रिंग रोड जंक्शनों पर भारी यातायात संकुलन (${traffic}%) व्यस्त समय के दौरान वाहनों के धुएं को बढ़ाता है।`,
            `आर्द्रता ${humidity}% होने के कारण सूक्ष्म कण सतह के करीब फंस जाते हैं।`
          ],
          forecast: `कार्यालय आवागमन चक्र दोहराए जाने के कारण अगले 24 घंटों में कणों का स्तर ${forecastAqi} AQI के करीब रहने का अनुमान है। सप्ताहांत में राहत की उम्मीद है।`,
          actions: [
            `${wardName} के सभी निर्माण स्थलों पर धूल शमन नियमों को सख्ती से लागू करें।`,
            `व्यस्त समय के संकुलन को कम करने के लिए कार्यालय आवागमन के समय में बदलाव करें।`
          ]
        },
        Bangalore: {
          situation: `घने पेड़ों के आवरण और हवा के प्रभाव के कारण ${wardName} में वायु गुणवत्ता अपेक्षाकृत साफ ${aqi} AQI (${translatedBadgeName}) पर बनी हुई है, लेकिन स्थानीय यातायात नोड्स पर अब भी प्रदूषण बढ़ जाता है।`,
          risks: [
            `${wardName} में आईटी कॉरिडोर वाहनों की संख्या के कारण दोपहर के भोजन के समय यातायात संकुलन (${traffic}%) होता है।`,
            `मेट्रो विस्तार से निकलने वाला निर्माण मलबा पारगमन गलियारों के पास PM10 का स्तर बढ़ाता है।`,
            `हवा की धीमी गति (${windSpeed} मी/से) दोपहर के समय प्रदूषकों के फैलाव को सीमित करती है।`,
          ],
          forecast: `अगले 24 घंटों में AQI ${forecastAqi} के करीब रहने की उम्मीद है। गार्डन सिटी की हरी-भरी वनस्पतियां स्थिर स्थिति बनाए रखने में मदद करती हैं।`,
          actions: [
            `${wardName} में दोपहर के यातायात को कम करने के लिए दोपहर के भोजन के समय को अलग-अलग करने के लिए प्रोत्साहित करें।`,
            `निर्माण सीमाओं के साथ हरित बफर जोन का विस्तार करें।`
          ]
        },
        Chennai: {
          situation: `तटीय आर्द्रता (${humidity}%) और समुद्री हवा के कारण ${wardName} में AQI मध्यम ${aqi} (${translatedBadgeName}) पर बना हुआ है, लेकिन अंतर्देशीय यातायात गलियारे तनाव में दिख रहे हैं।`,
          risks: [
            `समुद्री हवा के विपरीत होने से दोपहर के समय ${wardName} के तटीय सड़कों के पास उत्सर्जन फंस जाता है।`,
            `आईटी कॉरिडोर के साथ हो रही निर्माण गतिविधियों (${construction}%) के कारण धूल उड़ती है।`,
            `उत्तरी चेन्नई से औद्योगिक उत्सर्जन PM2.5 के स्तर को धीरे-धीरे बढ़ाता है।`
          ],
          forecast: `शाम को समुद्री हवा कमजोर होने से AQI ${forecastAqi} को छू सकता है। सुबह तक तटीय फैलाव में सुधार होगा।`,
          actions: [
            `${wardName} के निर्माण स्थलों के पास कच्ची सड़कों पर पानी का छिड़काव बढ़ाएं।`,
            `समुद्री हवा के विपरीत प्रवाह के घंटों के दौरान औद्योगिक चिमनियों के उत्सर्जन की निगरानी करें।`
          ]
        },
        Delhi: {
          situation: `धीमी हवा (${windSpeed} मी/से), उच्च वाहन घनत्व और क्षेत्रीय फसल अवशेष (पराली) जलाने के कारण ${wardName} में उच्च AQI ${aqi} (${translatedBadgeName}) दर्ज किया गया है।`,
          risks: [
            `तापीय प्रतिलोमन (थर्मल इनवर्जन) के कारण प्रदूषक सतह के करीब फंस जाते हैं, जहां हवा की गति ${windSpeed} मी/से है।`,
            `प्रमुख चौराहों पर वाहनों की भीड़ (${traffic}%) व्यस्त समय के दौरान कालिख के भार को बढ़ाती है।`,
            `उच्च आर्द्रता (${humidity}%) की स्थिति में माध्यमिक कणों का निर्माण बढ़ जाता है।`
          ],
          forecast: `शांत स्थिति बने रहने के कारण अगले 24 घंटों में AQI बढ़कर ${forecastAqi} होने की उम्मीद है। हवा से कोई महत्वपूर्ण राहत मिलने की उम्मीद नहीं है।`,
          actions: [
            `${wardName} में यातायात उत्सर्जन को 15% तक कम करने के लिए सम-विषय (ऑड-इवन) वाहन योजना लागू करें।`,
            `कणों के शमन के लिए प्रमुख चौराहों पर एंटी-स्मॉग गन तैनात करें।`
          ]
        },
        Mumbai: {
          situation: `${wardName} की तटीय स्थिति मध्यम AQI ${aqi} (${translatedBadgeName}) प्रदान करती है, लेकिन निर्माण कार्य (${construction}%) और यातायात संकुलन (${traffic}%) बढ़ती चिंताएं हैं।`,
          risks: [
            `समुद्री हवा आंशिक राहत देती है लेकिन ${wardName} के पास निर्माण धूल का कोई शमन नहीं हो पा रहा है।`,
            `व्यावसायिक जिलों के चौराहों पर यातायात की रुकावटें व्यस्त समय में AQI को बढ़ा देती हैं।`,
            `उच्च जनसंख्या घनत्व (${(population / 1000).toFixed(0)}K) संचयी स्वास्थ्य जोखिम को बढ़ाता है।`
          ],
          forecast: `अगले 24 घंटों में AQI ${forecastAqi} रहने का अनुमान है; तटीय हवाएं मजबूत होने की उम्मीद है, जिससे शाम तक प्रदूषण के फैलाव में सुधार होगा।`,
          actions: [
            `${wardName} में निर्माण धूल अवरोधक और पानी के छिड़काव को अनिवार्य करें।`,
            `सड़क संकुलन को कम करने के लिए नौका (फेरी) और तटीय रेल के उपयोग को बढ़ावा दें।`
          ]
        }
      };
      const profHi = cityProfilesHi[selectedCity] || cityProfilesHi.Hyderabad;
      situation = profHi.situation;
      risks = profHi.risks;
      forecastTxt = profHi.forecast;
      actions = profHi.actions;
    } else if (language === "te") {
      const cityProfilesTe: Record<string, {
        situation: string;
        risks: string[];
        forecast: string;
        actions: string[];
      }> = {
        Hyderabad: {
          situation: `ఐటీ కారిడార్ ప్రయాణికుల రద్దీ మరియు నిర్మాణ ధూళి వల్ల ${wardName} ప్రాంతంలో గాలి నాణ్యత ${aqi} AQI (${translatedBadgeName}) కి పడిపోయింది. దట్టమైన కార్యాలయ సముదాయాలు స్థానికంగా కాలుష్య కణాల హాట్‌స్పాట్‌లను సృష్టిస్తున్నాయి.`,
          risks: [
            `${wardName} లో ఎత్తైన భవనాల నిర్మాణం వల్ల విపరీతంగా ధూళి (PM10 స్థాయి ${selectedWard.pm10 || 0} µg/m³) ఉత్పత్తి అవుతోంది.`,
            `ఔటర్ రింగ్ రోడ్ జంక్షన్లలో ట్రాఫిక్ రద్దీ (${traffic}%) రద్దీ సమయాల్లో వాహనాల పొగను మరింత పెంచుతోంది.`,
            `గాలిలో తేమ శాతం ${humidity}% ఉండటం వల్ల కాలుష్య కణాలు భూ ఉపరితలానికి దగ్గరగా పేరుకుపోతున్నాయి.`
          ],
          forecast: `కార్యాలయాల ప్రయాణాల సాధారణ చక్రం కారణంగా రాబోయే 24 గంటల్లో కాలుష్య స్థాయిలు ${forecastAqi} AQI వద్ద నమోదయ్యే అవకాశం ఉంది. వారాంతంలో కొంత ఉపశమనం లభించవచ్చు.`,
          actions: [
            `${wardName} వ్యాప్తంగా నిర్మాణ స్థలాల వద్ద ధూళి నియంత్రణ చర్యలను కఠినంగా అమలు చేయండి.`,
            `రద్దీ సమయాల్లో ట్రాఫిక్‌ను తగ్గించడానికి కార్యాలయ సమయాలను సవరించండి.`
          ]
        },
        Bangalore: {
          situation: `దట్టమైన చెట్లు మరియు సముద్రపు గాలి ప్రభావం వల్ల ${wardName} లో గాలి నాణ్యత సాపేక్షంగా మెరుగ్గా ${aqi} AQI (${translatedBadgeName}) గా ఉంది, అయితే స్థానిక జంక్షన్లలో ట్రాఫిక్ కాలుష్యం ఇంకా ఎక్కువగా ఉంది.`,
          risks: [
            `${wardName} లో ఐటీ కారిడార్ వాహనాల సాంద్రత కారణంగా మధ్యాహ్నం భోజన సమయంలో ట్రాఫిక్ రద్దీ (${traffic}%) ఏర్పడుతోంది.`,
            `మెట్రో విస్తరణ పనుల శిథిలాల వల్ల రవాణా కారిడార్ల సమీపంలో PM10 పరిమాణం పెరుగుతోంది.`,
            `తక్కువ గాలి వేగం (${windSpeed} m/s) మధ్యాహ్నం వేళల్లో కాలుష్య కణాల వ్యాప్తిని అడ్డుకుంటోంది.`
          ],
          forecast: `రాబోయే 24 గంటల్లో AQI ${forecastAqi} వద్దే కొనసాగే అవకాశం ఉంది. గార్డెన్ సిటీ పచ్చదనం వాతావరణం స్థిరంగా ఉండేలా తోడ్పడుతుంది.`,
          actions: [
            `${wardName} లో మధ్యాహ్న ట్రాఫిక్‌ను తగ్గించడానికి లంచ్ విరామ సమయాలను మార్చమని ప్రోత్సహించండి.`,
            `నిర్మాణ సరిహద్దుల చుట్టూ పచ్చటి బఫర్ జోన్లను విస్తరించండి.`
          ]
        },
        Chennai: {
          situation: `తీరప్రాంత తేమ (${humidity}%) మరియు సముద్రపు గాలి వల్ల ${wardName} లో గాలి నాణ్యత సాధారణ స్థాయిలో ${aqi} (${translatedBadgeName}) గా ఉంది, కానీ లోతట్టు రవాణా మార్గాల్లో ఒత్తిడి కనిపిస్తోంది.`,
          risks: [
            `సముద్రపు గాలి వెనుకకు తిరగడం వల్ల మధ్యాహ్నం ఉద్గారాలు ${wardName} తీరప్రాంత రోడ్ల సమీపంలోనే ఉండిపోతున్నాయి.`,
            `ఐటీ కారిడార్ వెంబడి జరుగుతున్న నిర్మాణ పనుల (${construction}%) వల్ల ధూళి లేస్తోంది.`,
            `ఉత్తర చెన్నై పారిశ్రామిక ఉద్గారాల వల్ల PM2.5 కణాలు క్రమంగా పెరుగుతున్నాయి.`
          ],
          forecast: `సాయంత్రం సముద్రపు గాలి బలహీనపడటంతో AQI ${forecastAqi} కి చేరే ప్రమాదం ఉంది. ఉదయానికి పరిస్థితి మెరుగుపడుతుంది.`,
          actions: [
            `${wardName} నిర్మాణ స్థలాల సమీపంలోని మురికి రోడ్లపై నీటిని చల్లడం పెంచండి.`,
            `సముద్రపు గాలి వెనుకకు తిరిగే సమయాల్లో పారిశ్రామిక చిమిణీల ఉద్గారాలను పర్యవేక్షించండి.`
          ]
        },
        Delhi: {
          situation: `తక్కువ గాలి వేగం (${windSpeed} m/s), అధిక వాహనాల సాంద్రత మరియు ప్రాంతీయంగా పంట వ్యర్థాల దహనం వల్ల ${wardName} లో గాలి నాణ్యత అత్యంత ప్రమాదకర స్థాయిలో ${aqi} (${translatedBadgeName}) గా నమోదైంది.`,
          risks: [
            `ఉష్ణోగ్రతల విలోమం కారణంగా కాలుష్య కణాలు ${windSpeed} m/s వేగం గల గాలిలోనే నిలిచిపోతున్నాయి.`,
            `ప్రధాన కూడళ్ల వద్ద వాహన రద్దీ (${traffic}%) రద్దీ వేళల్లో కాలుష్య భారాన్ని మరింత పెంచుతోంది.`,
            `అధిక తేమ (${humidity}%) పరిస్థితుల వల్ల ద్వితీయ కాలుష్య కణాల నిర్మాణం వేగవంతం అవుతోంది.`
          ],
          forecast: `ప్రస్తుత గాలి లేని పరిస్థితులు ఇలాగే కొనసాగితే రాబోయే 24 గంటల్లో AQI ${forecastAqi} కి పెరిగే అవకాశం ఉంది. గాలి వల్ల తక్షణ ఉపశమనం లభించకపోవచ్చు.`,
          actions: [
            `${wardName} లో వాహన ఉద్గారాలను 15% తగ్గించడానికి సరి-బేసి విధానాన్ని అమలు చేయండి.`,
            `ప్రధాన కూడళ్ల వద్ద ధూళి నివారణకు యాంటీ-స్మాగ్ గన్స్ మోహరించండి.`
          ]
        },
        Mumbai: {
          situation: `${wardName} తీరప్రాంత స్థానం వల్ల గాలి నాణ్యత సాధారణంగా ${aqi} (${translatedBadgeName}) గా ఉన్నప్పటికీ, నిర్మాణ పనులు (${construction}%) మరియు ట్రాఫిక్ రద్దీ (${traffic}%) ఆందోళన కలిగిస్తున్నాయి.`,
          risks: [
            `సముద్రపు గాలి కొంత ఉపశమనం కలిగిస్తున్నప్పటికీ, ${wardName} సమీపంలో నిర్మాణ ధూళి నియন্ত্রণ లోపించింది.`,
            `వ్యాపార జిల్లాల కూడళ్ల వద్ద వాహనాల నిలిచిపోవడం వల్ల రద్దీ వేళల్లో AQI అకస్మాత్తుగా పెరుగుతోంది.`,
            `అధిక జనాభా సాంద్రత (${(population / 1000).toFixed(0)} వేలు) వల్ల ప్రజారోగ్య ముప్పు పెరుగుతోంది.`
          ],
          forecast: `రాబోయే 24 గంటల్లో AQI అంచనా ${forecastAqi} గా ఉంది; సాయంత్రానికి తీరప్రాంత గాలులు బలపడి కాలుష్యం తొలగిపోయే అవకాశం ఉంది.`,
          actions: [
            `${wardName} లో నిర్మాణ ధూళి నిరోధక బారికేడ్లు మరియు నీటి సేద్యాన్ని తప్పనిసరి చేయండి.`,
            `రోడ్డు రద్దీని తగ్గించడానికి ఫెర్రీలు మరియు కోస్టల్ రైలు వినియోగాన్ని ప్రోత్సహించండి.`
          ]
        }
      };
      const profTe = cityProfilesTe[selectedCity] || cityProfilesTe.Hyderabad;
      situation = profTe.situation;
      risks = profTe.risks;
      forecastTxt = profTe.forecast;
      actions = profTe.actions;
    } else if (language === "ta") {
      const cityProfilesTa: Record<string, {
        situation: string;
        risks: string[];
        forecast: string;
        actions: string[];
      }> = {
        Hyderabad: {
          situation: `ஐடி காரிடார் பயணிகள் போக்குவரத்து மற்றும் கட்டுமானத் தூசிகள் ${wardName} பகுதியின் காற்றின் தரத்தை ${aqi} AQI (${translatedBadgeName}) ஆகக் குறைத்துள்ளன. அடர்த்தியான அலுவலக வளாகங்கள் உள்ளூர் அளவில் காற்று மாசடைவதை அதிகப்படுத்துகின்றன.`,
          risks: [
            `${wardName} பகுதியில் உள்ள உயரமான கட்டிட கட்டுமானப் பணிகள் தூசியை (PM10 அளவு ${selectedWard.pm10 || 0} µg/m³) உருவாக்குகின்றன.`,
            `வட்ட சாலை சந்திப்புகளில் ஏற்படும் போக்குவரத்து நெரிசல் (${traffic}%) அலுவலக நேரங்களில் வாகனப் புகையை அதிகரிக்கிறது.`,
            `காற்றின் ஈரப்பதம் ${humidity}% ஆக இருப்பதால் நுண்ணிய துகள்கள் தரைக்கு அருகிலேயே தேங்குகின்றன.`
          ],
          forecast: `அலுவலக போக்குவரத்து சுழற்சி தொடர்வதால் அடுத்த 24 மணிநேரத்தில் துகள்களின் அளவு ${forecastAqi} AQI ஆக இருக்கும் என கணிக்கப்பட்டுள்ளது. வார இறுதியில் மாற்றம் எதிர்பார்க்கப்படுகிறது.`,
          actions: [
            `${wardName} முழுவதும் உள்ள கட்டுமான தளங்களில் தூசி தடுப்பு விதிகளை கடுமையாக அமல்படுத்தவும்.`,
            `போக்குவரத்து நெரிசலைக் குறைக்க அலுவலக நேரங்களை மாற்றியமைக்கவும்.`
          ]
        },
        Bangalore: {
          situation: `அடர்த்தியான மரங்கள் மற்றும் காற்றின் தாக்கத்தால் ${wardName} பகுதியில் காற்றின் தரம் ஒப்பீட்டளவில் சுத்தமாக ${aqi} AQI (${translatedBadgeName}) ஆக உள்ளது, ஆனால் உள்ளூர் போக்குவரத்து சந்திப்புகளில் இன்னும் மாசு அதிகமாக உள்ளது.`,
          risks: [
            `${wardName} பகுதியில் ஐடி காரிடார் வாகன நெரிசலால் மதிய உணவு நேரத்தில் போக்குவரத்து நெரிசல் (${traffic}%) ஏற்படுகிறது.`,
            `மெட்ரோ விரிவாக்கப் பணிகளின் கட்டுமானக் கழிவுகள் போக்குவரத்து வழித்தடங்களுக்கு அருகில் PM10 அளவை அதிகரிக்கின்றன.`,
            `காற்றின் வேகம் குறைவாக (${windSpeed} மீ/வி) இருப்பது மதிய வேளையில் மாசு கலைவதைத் தடுக்கிறது.`
          ],
          forecast: `காற்றின் தரம் அடுத்த 24 மணிநேரத்திற்கு ${forecastAqi} ஆக நீடிக்கும் என எதிர்பார்க்கப்படுகிறது. பூங்கா நகரத்தின் பசுமை பரப்பு நிலைத்தன்மைக்கு உதவுகிறது.`,
          actions: [
            `${wardName} பகுதியில் மதிய நேர நெரிசலைக் குறைக்க மதிய உணவு இடைவேளை நேரங்களை மாற்றியமைக்க ஊக்குவிக்கவும்.`,
            `கட்டுமானப் பகுதிகளின் எல்லைகளைச் சுற்றி பசுமை வளையங்களை விரிவுபடுத்தவும்.`
          ]
        },
        Chennai: {
          situation: `கடலோர ஈரப்பதம் (${humidity}%) மற்றும் கடல் காற்று காரணமாக ${wardName} பகுதியில் காற்றின் தரம் மிதமான ${aqi} (${translatedBadgeName}) ஆக உள்ளது, ஆனால் உள்நாட்டு போக்குவரத்து வழித்தடங்கள் சவாலாக உள்ளன.`,
          risks: [
            `கடல் காற்று திசைமாறுவதால் மதிய வேளையில் ${wardName} கடலோரச் சாலைகளுக்கு அருகில் மாசு தேங்குகிறது.`,
            `ஐடி காரிடார் பகுதியில் நடைபெறும் கட்டுமானப் பணிகள் (${construction}%) தூசியை உருவாக்குகின்றன.`,
            `வட சென்னையிலிருந்து வெளியேறும் தொழிற்சாலை உமிழ்வுகள் PM2.5 துகள் அளவை படிப்படியாக அதிகரிக்கின்றன.`
          ],
          forecast: `மாலை நேரத்தில் கடல் காற்று பலவீனமடைவதால் AQI ${forecastAqi} ஐ எட்டக்கூடும். காலையில் காற்றின் தரம் மேம்படும்.`,
          actions: [
            `${wardName} கட்டுமான தளங்களுக்கு அருகில் உள்ள மண் சாலைகளில் தண்ணீர் தெளிப்பதை அதிகரிக்கவும்.`,
            `கடல் காற்று திசைமாறும் நேரங்களில் தொழிற்சாலை புகை உமிழ்வைக் கண்காணிக்கவும்.`
          ]
        },
        Delhi: {
          situation: `குறைந்த காற்றின் வேகம் (${windSpeed} மீ/வி), அதிக வாகன அடர்த்தி மற்றும் அண்டை மாநிலங்களில் பயிர் எச்சங்களை எரிப்பதால் ${wardName} பகுதியில் அதிக AQI ${aqi} (${translatedBadgeName}) பதிவாகியுள்ளது.`,
          risks: [
            `வெப்பநிலை தலைகீழ் மாற்றத்தால் மாசுகள் தரைக்கு அருகிலேயே தேங்குகின்றன, காற்றின் வேகம் ${windSpeed} மீ/வி ஆக உள்ளது.`,
            `முக்கிய சந்திப்புகளில் ஏற்படும் வாகன நெரிசல் (${traffic}%) உச்ச நேரங்களில் புகைக்கரியை அதிகரிக்கிறது.`,
            `அதிக ஈரப்பதம் (${humidity}%) காரணமாக இரண்டாம் நிலை மாசு துகள்கள் உருவாவது அதிகரிக்கிறது.`
          ],
          forecast: `காற்று வீசாத நிலை தொடர்வதால் அடுத்த 24 மணிநேரத்தில் AQI ${forecastAqi} ஆக உயரும் என எதிர்பார்க்கப்படுகிறது. தற்காலிகமாக காற்று வீச வாய்ப்பில்லை.`,
          actions: [
            `${wardName} பகுதியில் வாகன புகையைக் குறைக்க ஒற்றை-இரட்டை இலக்க வாகன முறையை அமல்படுத்தவும்.`,
            `துகள்களைக் கட்டுப்படுத்த முக்கிய சந்திப்புகளில் புகை எதிர்ப்பு பீரங்கிகளை பயன்படுத்தவும்.`
          ]
        },
        Mumbai: {
          situation: `${wardName} கடலோரப் பகுதி என்பதால் காற்றின் தரம் மிதமான ${aqi} (${translatedBadgeName}) ஆக உள்ளது, ஆனால் கட்டுமானப் பணிகள் (${construction}%) மற்றும் போக்குவரத்து நெரிசல் (${traffic}%) கவலையளிக்கின்றன.`,
          risks: [
            `கடல் காற்று ஓரளவு நிவாரணம் அளித்தாலும், ${wardName} கட்டுமானப் பகுதிகளில் தூசி தடுப்பு நடவடிக்கைகள் இல்லை.`,
            `வர்த்தக மையங்களின் சந்திப்புகளில் ஏற்படும் போக்குவரத்து நெரிசல்கள் அலுவலக நேரத்தில் AQI ஐ அதிகரிக்கின்றன.`,
            `அதிக மக்கள் தொகை அடர்த்தி (${(population / 1000).toFixed(0)} ஆயிரம்) ஒட்டுமொத்த சுகாதார ஆபத்தை அதிகரிக்கிறது.`
          ],
          forecast: `அடுத்த 24 மணிநேரத்திற்கு AQI ${forecastAqi} ஆக கணிக்கப்பட்டுள்ளது; மாலைக்குள் கடலோர காற்று வலுவடைந்து மாசு கலைந்துவிடும்.`,
          actions: [
            `${wardName} பகுதியில் கட்டுமான தூசி தடுப்பு சுவர்கள் மற்றும் தண்ணீர் தெளிப்பதை கட்டாயமாக்குங்கள்.`,
            `சாலை நெரிசலைக் குறைக்க படகு மற்றும் கடலோர ரயில் சேவைகளைப் பயன்படுத்துவதை ஊக்குவிக்கவும்.`
          ]
        }
      };
      const profTa = cityProfilesTa[selectedCity] || cityProfilesTa.Hyderabad;
      situation = profTa.situation;
      risks = profTa.risks;
      forecastTxt = profTa.forecast;
      actions = profTa.actions;
    } else {
      // kn - Kannada
      const cityProfilesKn: Record<string, {
        situation: string;
        risks: string[];
        forecast: string;
        actions: string[];
      }> = {
        Hyderabad: {
          situation: `ಐಟಿ ಕಾರಿಡಾರ್ ಸಂಚಾರ ದಟ್ಟಣೆ ಮತ್ತು ನಿರ್ಮಾಣ ಧೂಳು ${wardName} ವಲಯದ ಗಾಳಿ ಗುಣಮಟ್ಟವನ್ನು ${aqi} AQI (${translatedBadgeName}) ಮಟ್ಟಕ್ಕೆ ಇಳಿಸಿವೆ. ಕಚೇರಿಗಳ ದಟ್ಟಣೆಯು ಸ್ಥಳೀಯ ಮಾಲಿನ್ಯ ಕಣಗಳ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ಸೃಷ್ಟಿಸುತ್ತಿದೆ.`,
          risks: [
            `${wardName} ನಲ್ಲಿ ಗಗನಚುಂಬಿ ಕಟ್ಟಡಗಳ ನಿರ್ಮಾಣದಿಂದ ಧೂಳು (PM10 ಮಟ್ಟ ${selectedWard.pm10 || 0} µg/m³) ಗಾಳಿಯಲ್ಲಿ ಹರಡುತ್ತಿದೆ.`,
            `ಔಟರ್ ರಿಂಗ್ ರೋಡ್ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿನ ವಾಹನ ದಟ್ಟಣೆ (${traffic}%) ಕಚೇರಿ ಸಮಯದಲ್ಲಿ ಹೊಗೆಯ ಪ್ರಮಾಣವನ್ನು ಹೆಚ್ಚಿಸುತ್ತಿದೆ.`,
            `ಗಾಳಿಯಲ್ಲಿನ ಶೇ. ${humidity} ರಷ್ಟು ಆರ್ದ್ರತೆಯು ಮಾಲಿನ್ಯ ಕಣಗಳನ್ನು ನೆಲದ ಹತ್ತಿರವೇ ಉಳಿಯುವಂತೆ ಮಾಡುತ್ತಿದೆ.`
          ],
          forecast: `ಕಚೇರಿ ಸಮಯದ ಸಂಚಾರದ ಪುನರಾವರ್ತನೆಯಿಂದಾಗಿ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ಮಾಲಿನ್ಯ ಮಟ್ಟವು ${forecastAqi} AQI ತಲುಪುವ ಅಂದಾಜಿದೆ. ವಾರಾಂತ್ಯದಲ್ಲಿ ಸುಧಾರಣೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.`,
          actions: [
            `${wardName} ನಾದ್ಯಂತ ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಸ್ಥಳಗಳಲ್ಲಿ ಧೂಳು ನಿಯಂತ್ರಣ ನಿಯಮಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಜಾರಿಗೊಳಿಸಿ.`,
            `ಕಚೇರಿ ಸಮಯವನ್ನು ಬದಲಾಯಿಸುವ ಮೂಲಕ ಸಂಚಾರ ದಟ್ಟಣೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಿ.`
          ]
        },
        Bangalore: {
          situation: `ದಟ್ಟವಾದ ಮರಗಳ ಹೊದಿಕೆ ಮತ್ತು ಸಮುದ್ರ ಮಾರುತಗಳ ಪ್ರಭಾವದಿಂದಾಗಿ ${wardName} ವಲಯದಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಸಾಪೇಕ್ಷವಾಗಿ ಉತ್ತಮ ${aqi} AQI (${translatedBadgeName}) ಆಗಿದೆ, ಆದರೆ ಸ್ಥಳೀಯ ಸಂಚಾರ ವಲಯಗಳಲ್ಲಿ ಇನ್ನೂ ಹೆಚ್ಚಿನ ಮಾಲಿನ್ಯವಿದೆ.`,
          risks: [
            `${wardName} ನ ಐಟಿ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ ವಾಹನ ದಟ್ಟಣೆಯು ಮಧ್ಯಾಹ್ನದ ಊಟದ ಸಮಯದಲ್ಲಿ (${traffic}% ದಟ್ಟಣೆ) ಸಂಚಾರ ಸಮಸ್ಯೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.`,
            `ಮೆಟ್ರೋ ವಿಸ್ತರಣೆಯ ನಿರ್ಮಾಣ ತ್ಯಾಜ್ಯವು ಸಾರಿಗೆ ಮಾರ್ಗಗಳ ಬಳಿ PM10 ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸುತ್ತಿದೆ.`,
            `ಕಡಿಮೆ ಗಾಳಿಯ ವೇಗವು (${windSpeed} ಮೀ/ಸೆ) ಮಧ್ಯಾಹ್ನದ ಮಾಲಿನ್ಯ ಹರಡುವಿಕೆಯನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತದೆ.`
          ],
          forecast: `ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ AQI ${forecastAqi} ಆಸುಪಾಸಿನಲ್ಲಿರಬಹುದು. ಉದ್ಯಾನ ನಗರಿಯ ಹಸಿರು ವಾತಾವರಣವು ಸ್ಥಿರತೆ ಕಾಪಾಡಿಕೊಳ್ಳಲು ನೆರವಾಗುತ್ತದೆ.`,
          actions: [
            `${wardName} ನಲ್ಲಿ ಮಧ್ಯಾಹ್ನದ ಸಂಚಾರ ದಟ್ಟಣೆ ಕಡಿಮೆ ಮಾಡಲು ಊಟದ ವಿರಾಮದ ಸಮಯವನ್ನು ಬದಲಿಸಲು ಪ್ರೋತ್ಸಾಹಿಸಿ.`,
            `ನಿರ್ಮಾಣ ಪ್ರದೇಶಗಳ ಸುತ್ತಲೂ ಹಸಿರು ಬಫರ್ ವಲಯಗಳನ್ನು ವಿಸ್ತರಿಸಿ.`
          ]
        },
        Chennai: {
          situation: `ಕರಾವಳಿ ತೇವಾಂಶ (${humidity}%) ಮತ್ತು ಸಮುದ್ರದ ತಂಗಾಳಿ ಇರುವ ಕಾರಣ ${wardName} ವಲಯದಲ್ಲಿ AQI ಸಾಧಾರಣ ಮಟ್ಟದಲ್ಲಿ ${aqi} (${translatedBadgeName}) ಇದೆ, ಆದರೆ ಒಳನಾಡಿನ ಸಂಚಾರ ಮಾರ್ಗಗಳು ಸಂಕಷ್ಟದಲ್ಲಿವೆ.`,
          risks: [
            `ಸಮುದ್ರದ ಗಾಳಿಯ ವಿರುದ್ಧ ದಿಕ್ಕಿನ ಚಲನೆಯು ಮಧ್ಯಾಹ್ನದ ನಂತರ ${wardName} ಕರಾವಳಿ ರಸ್ತೆಗಳ ಬಳಿ ಮಾಲಿನ್ಯವನ್ನು ತಡೆಹಿಡಿಯುತ್ತದೆ.`,
            `ಐಟಿ ಕಾರಿಡಾರ್ ವಲಯದಲ್ಲಿ ನಡೆಯುತ್ತಿರುವ ನಿರ್ಮಾಣ ಕಾಮಗಾರಿಗಳು (${construction}%) ಧೂಳನ್ನು ಉಂಟುಮಾಡುತ್ತಿವೆ.`,
            `ಉತ್ತರ ಚೆನ್ನೈನ ಕೈಗಾರಿಕಾ ಹೊರಸೂಸುವಿಕೆಯು PM2.5 ಮಟ್ಟವು ಕ್ರಮೇಣ ಹೆಚ್ಚಲು ಕಾರಣವಾಗುತ್ತಿದೆ.`
          ],
          forecast: `ಸಂಜೆ ಸಮುದ್ರದ ತಂಗಾಳಿ ದುರ್ಬಲಗೊಳ್ಳುತ್ತಿದ್ದಂತೆ AQI ${forecastAqi} ತಲುಪಬಹುದು. ಮುಂಜಾನೆಯ ಹೊತ್ತಿಗೆ ಕರಾವಳಿ ಮಾಲಿನ್ಯ ಚದುರಲಿದೆ.`,
          actions: [
            `${wardName} ನ ನಿರ್ಮಾಣ ಪ್ರದೇಶಗಳ ಸಮೀಪವಿರುವ ಕಚ್ಚಾ ರಸ್ತೆಗಳಲ್ಲಿ ನೀರು ಸಿಂಪಡಿಸುವುದನ್ನು ಹೆಚ್ಚಿಸಿ.`,
            `ಸಮುದ್ರದ ಗಾಳಿ ವಿರುದ್ಧ ದಿಕ್ಕಿನಲ್ಲಿ ಚಲಿಸುವ ಸಮಯದಲ್ಲಿ ಕೈಗಾರಿಕಾ ಚಿಮಣಿ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.`
          ]
        },
        Delhi: {
          situation: `ಕಡಿಮೆ ಗಾಳಿಯ ವೇಗ (${windSpeed} ಮೀ/ಸೆ), ಹೆಚ್ಚಿನ ವಾಹನ ದಟ್ಟಣೆ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಕೃಷಿ ತ್ಯಾಜ್ಯ ದಹನದಿಂದಾಗಿ ${wardName} ವಲಯದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚಿನ AQI ${aqi} (${translatedBadgeName}) ದಾಖಲಾಗಿದೆ.`,
          risks: [
            `ತಾಪಮಾನದ ವಿಲೋಮತೆಯಿಂದಾಗಿ ಮಾಲಿನ್ಯಕಾರಕಗಳು ನೆಲದ ಸಮೀಪವೇ ಸಿಲುಕಿಕೊಳ್ಳುತ್ತಿವೆ, ಗಾಳಿಯ ವೇಗವು ${windSpeed} ಮೀ/ಸೆ ಆಗಿದೆ.`,
            `ಪ್ರಮುಖ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿನ ವಾಹನ ದಟ್ಟಣೆಯು (${traffic}%) ಕಚೇರಿ ಸಮಯದಲ್ಲಿ ಕರಿಯ ಹೊಗೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತಿದೆ.`,
            `ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ (${humidity}%) ಇರುವುದರಿಂದ ಮಾಲಿನ್ಯ ಕಣಗಳು ಅತಿ ವೇಗವಾಗಿ ದ್ವಿತೀಯಕ ಕಣಗಳಾಗಿ ರೂಪಾಂತರಗೊಳ್ಳುತ್ತಿವೆ.`
          ],
          forecast: `ಗಾಳಿ ಇಲ್ಲದ ಪರಿಸ್ಥಿತಿ ಮುಂದುವರಿಯುವುದರಿಂದ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ AQI ${forecastAqi} ವರೆಗೆ ಏರುವ ನಿರೀಕ್ಷೆಯಿದೆ. ತಕ್ಷಣಕ್ಕೆ ಗಾಳಿಯ ಸುಧಾರಣೆ ನಿರೀಕ್ಷೆಯಿಲ್ಲ.`,
          actions: [
            `${wardName} ನಲ್ಲಿ ವಾಹನಗಳ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಶೇ. 15 ರಷ್ಟು ಕಡಿಮೆ ಮಾಡಲು ಸಮ-ಬೆಸ ವಾಹನ ನಿಯಮ ಜಾರಿಗೊಳಿಸಿ.`,
            `ಮಾಲಿನ್ಯ ಕಣಗಳನ್ನು ತಗ್ಗಿಸಲು ಪ್ರಮುಖ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿ ಆಂಟಿ-ಸ್ಮಾಗ್ ಗನ್‌ಗಳನ್ನು ನಿಯೋಜಿಸಿ.`
          ]
        },
        Mumbai: {
          situation: `${wardName} ನ ಕರಾವಳಿ ನೆಲೆಯು ಸಾಧಾರಣ AQI ${aqi} (${translatedBadgeName}) ಅನ್ನು ಒದಗಿಸುತ್ತದೆಯಾದರೂ, ನಿರ್ಮಾಣ ಕಾಮಗಾರಿಗಳು (${construction}%) ಮತ್ತು ಸಂಚಾರ ದಟ್ಟಣೆ (${traffic}%) ಹೆಚ್ಚುತ್ತಿರುವ ಕಳವಳಗಳಾಗಿವೆ.`,
          risks: [
            `ಸಮುದ್ರದ ತಂಗಾಳಿಯು ಭಾಗಶಃ ಪರಿಹಾರ ನೀಡಿದರೂ ${wardName} ಬಳಿ ನಿರ್ಮಾಣ ಧೂಳು ತಗ್ಗಿಸುವ ಯಾವುದೇ ವ್ಯವಸ್ಥೆಯಾಗಿಲ್ಲ.`,
            `ವಾಣಿಜ್ಯ ಕೇಂದ್ರಗಳ ಜಂಕ್ಷನ್‌ಗಳಲ್ಲಿನ ಸಂಚಾರ ಅಡೆತಡೆಗಳು ಕಚೇರಿ ಸಮಯದಲ್ಲಿ AQI ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ.`,
            `ಹೆಚ್ಚಿನ ಜನಸಂಖ್ಯಾ ಸಾಂದ್ರತೆಯು (${(population / 1000).toFixed(0)} ಸಾವಿರ) ಸಂಚಿತ ಆರೋಗ್ಯ ಅಪಾಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.`
          ],
          forecast: `ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ AQI ${forecastAqi} ಇರಲಿದೆ; ಸಂಜೆಯ ವೇಳೆಗೆ ಕರಾವಳಿ ಗಾಳಿ ಬಲಗೊಳ್ಳುವುದರಿಂದ ಮಾಲಿನ್ಯ ಮಟ್ಟ ಚದುರಲಿದೆ.`,
          actions: [
            `${wardName} ನಲ್ಲಿ ಕಡ್ಡಾಯವಾಗಿ ಧೂಳು ತಡೆಗೋಡೆಗಳನ್ನು ಮತ್ತು ನೀರು ಸಿಂಪಡಿಸುವುದನ್ನು ನಿಯಮವಾಗಿಸಿ.`,
            `ರಸ್ತೆ ದಟ್ಟಣೆ ಕಡಿಮೆ ಮಾಡಲು ಜಲಸಾರಿಗೆ ಮತ್ತು ಕರಾವಳಿ ರೈಲು ಬಳಕೆಯನ್ನು ಉತ್ತೇಜಿಸಿ.`
          ]
        }
      };
      const profKn = cityProfilesKn[selectedCity] || cityProfilesKn.Hyderabad;
      situation = profKn.situation;
      risks = profKn.risks;
      forecastTxt = profKn.forecast;
      actions = profKn.actions;
    }

    const briefSituation = situation;
    const briefRisks = risks;
    const briefForecast = forecastTxt;
    const briefActions = actions;

    return { currentSituation: briefSituation, keyRisks: briefRisks, forecast: briefForecast, recommendedActions: briefActions };
  };

  // Theme Aware Leaflet GIS Map Tile Loading
  useEffect(() => {
    if (flow !== "dashboard" || (activePage !== "dashboard" && activePage !== "map")) return;

    let map: L.Map | null = null;
    const timer = setTimeout(() => {
      const containerId = activePage === "dashboard" ? "mission-map-canvas" : "map-canvas";
      const container = document.getElementById(containerId);
      if (!container) return;

      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      map = L.map(containerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([selectedWard.latitude, selectedWard.longitude], 12);

      // Dynamically select map tile layer based on active theme
      const isDark = resolvedTheme === "dark";
      const mapTilesUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(mapTilesUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const metroMapPoints = buildMetroMapPoints();
      const mapPoints = (metroMapPoints as Record<string, any>)[selectedCity] || [
        ...activeWards.map((ward) => ({
          id: `ward-${ward.id}`,
          name: ward.name,
          label: "Place",
          kind: "place" as const,
          latitude: ward.latitude,
          longitude: ward.longitude,
          aqi: ward.aqi,
          pm2_5: ward.pm2_5,
          pm10: ward.pm10,
          sourceWard: ward
        })),
        ...AQI_IN_METRO_CITIES.map((city) => ({
          id: `city-${city.name}`,
          name: city.name,
          label: city.state,
          kind: "city" as const,
          latitude: city.latitude,
          longitude: city.longitude,
          aqi: city.aqi,
          pm2_5: city.pm2_5,
          pm10: city.pm10,
          sourceWard: null
        }))
      ];

      const bounds = L.latLngBounds([]);

      mapPoints.forEach((point: any) => {
        const color = getAQIMarkerColor(point.aqi);
        const labelIcon = L.divIcon({
          className: "aqi-map-label",
          html: `
            <div style="display:flex;align-items:center;gap:6px;padding:10px 12px;border-radius:16px;background:rgba(10,15,25,0.92);border:1px solid rgba(255,255,255,0.08);box-shadow:0 10px 30px rgba(0,0,0,0.35);color:#F8FAFC;min-width:120px;max-width:170px;backdrop-filter:blur(10px);">
              <span style="width:8px;height:8px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px ${color}22;flex:0 0 auto;"></span>
              <span style="display:flex;flex-direction:column;line-height:1.05;min-width:0;">
                <strong style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${point.name}</strong>
                <span style="font-size:11px;font-weight:700;opacity:0.96;white-space:nowrap;">(AQI: ${point.aqi})</span>
              </span>
            </div>
          `,
          iconSize: [150, 44],
          iconAnchor: [75, 44]
        });

        const labelMarker = L.marker([point.latitude, point.longitude], {
          icon: labelIcon,
          interactive: true,
          keyboard: false
        }).addTo(map!);

        const circle = L.circleMarker([point.latitude, point.longitude], {
          stroke: true,
          weight: point.kind === "city" ? 2.5 : 2,
          color,
          fillColor: color,
          fillOpacity: 0.82,
          radius: point.kind === "city" ? 11 : 8
        }).addTo(map!);

        bounds.extend([point.latitude, point.longitude]);

        circle.bindPopup(`
          <div style="color: #07111F; font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px; min-width: 180px;">
            <strong style="font-size: 14px; color: #101C2E;">${point.name}</strong><br/>
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">${point.kind === "city" ? "City" : "Place"} · ${point.label}</span><br/>
            <strong>Live AQI:</strong> <span style="color: ${color}; font-weight: bold;">${point.aqi}</span><br/>
            <strong>PM2.5:</strong> ${point.pm2_5} µg/m³<br/>
            <strong>PM10:</strong> ${point.pm10} µg/m³${point.sourceWard ? `<br/><button id="btn-select-map-${point.sourceWard.id}" style="margin-top: 8px; font-size: 10px; padding: 4px 8px; background: #00E5FF; border: none; border-radius: 4px; color: #07111F; cursor: pointer; font-weight: bold; width: 100%;">Select Focus Area</button>` : ""}
          </div>
        `, { closeButton: false });

        labelMarker.bindPopup(`
          <div style="color: #07111F; font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px; min-width: 180px;">
            <strong style="font-size: 14px; color: #101C2E;">${point.name}</strong><br/>
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">${point.kind === "city" ? "City" : "Place"} · ${point.label}</span><br/>
            <strong>Live AQI:</strong> <span style="color: ${color}; font-weight: bold;">${point.aqi}</span><br/>
            <strong>PM2.5:</strong> ${point.pm2_5} µg/m³<br/>
            <strong>PM10:</strong> ${point.pm10} µg/m³${point.sourceWard ? `<br/><button id="btn-select-map-${point.sourceWard.id}" style="margin-top: 8px; font-size: 10px; padding: 4px 8px; background: #00E5FF; border: none; border-radius: 4px; color: #07111F; cursor: pointer; font-weight: bold; width: 100%;">Select Focus Area</button>` : ""}
          </div>
        `, { closeButton: false });

        if (point.sourceWard) {
          const wireSelection = () => {
            const btn = document.getElementById(`btn-select-map-${point.sourceWard.id}`);
            if (btn) {
              btn.onclick = () => {
                handleWardSelect(point.sourceWard);
                map?.closePopup();
              };
            }
          };

          circle.on("popupopen", wireSelection);
          labelMarker.on("popupopen", wireSelection);
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.15));
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      map?.remove();
    };
  }, [flow, activePage, theme, selectedWard]);

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

    fetchWardIntelligence(ward.id);
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
          evidence: `Commute traffic sensors registered traffic congestion at ${ward.traffic_congestion}% in ${ward.name} sectors.`,
          executed: false
        };
      } else if (act.id === 2) {
        return {
          ...act,
          desc: `Conduct on-site inspections of active construction areas in ${ward.name} and mandate dust suppression controls.`,
          evidence: `Particulate sensors recorded PM10 concentrations at ${ward.pm10} µg/m³ near ${ward.name} centroids.`,
          executed: false
        };
      } else {
        return {
          ...act,
          desc: `Initiate localized water sprinkling runs across dry corridors in ${ward.name} to suppress dust.`,
          evidence: `Fugitive dust loads reached ${ward.dust_level}% with local wind speeds at ${ward.wind_speed} m/s.`,
          executed: false
        };
      }
    }));
  };


  const handleSendMessage = async (e?: React.FormEvent, templateText?: string) => {
    if (e) e.preventDefault();
    const query = templateText || chatInput;
    if (!query.trim()) return;

    const messages = [...chatMessages, { sender: "user", text: query }];
    setChatMessages(messages);
    setChatInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const res = await fetch(`${API_URL}/api/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward_id: selectedWard.id, query: query }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...messages, { sender: "agent", text: data.advisory_response, routes: data.recommended_clean_routes }]);
      } else {
        throw new Error();
      }
    } catch (e) {
      clearTimeout(timeoutId);
      setTimeout(() => {
        let reply = "";
        let routes: any[] = [];
        const lowerText = query.toLowerCase();

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
          targetWard = { name: "Whitefield Centroid", aqi: 56, temperature: 24, weather_condition: "Clear" } as any;
        } else if (city === "Chennai") {
          targetWard = { name: "Adyar Coastal Centroid", aqi: 59, temperature: 29, weather_condition: "Clear" } as any;
        } else if (city === "Delhi") {
          targetWard = { name: "Connaught Place Centroid", aqi: 125, temperature: 34, weather_condition: "Haze" } as any;
        } else if (city === "Mumbai") {
          targetWard = { name: "Andheri West Centroid", aqi: 61, temperature: 28, weather_condition: "Cloudy" } as any;
        } else {
          targetWard = selectedWard;
        }

        if (lowerText.includes("weather") || lowerText.includes("temperature") || lowerText.includes("wind") || lowerText.includes("humidity")) {
          reply = `Today in ${targetWard.name}, the weather condition is ${targetWard.weather_condition || "Clear"}. The temperature is ${targetWard.temperature}°C, humidity is ${targetWard.humidity}%, and wind speed is ${targetWard.wind_speed} m/s. Tomorrow, weather is expected to remain stable with temperatures peaking around ${targetWard.temperature + 1}°C and winds averaging ${targetWard.wind_speed + 0.5} m/s under ${targetWard.weather_condition || "Clear"} skies.`;
        } else if (lowerText.includes("jog")) {
          reply = targetWard.aqi > 150
            ? `Outdoor jogging is NOT recommended in ${targetWard.name} today. The current AQI is ${targetWard.aqi} (Moderate/High). Sensitive groups should exercise indoors.`
            : `Jogging is safe in ${targetWard.name} today. The current AQI is ${targetWard.aqi} (Satisfactory).`;
        } else if (lowerText.includes("safe")) {
          reply = targetWard.aqi > 150
            ? `Air Quality in ${targetWard.name} is currently elevated to ${targetWard.aqi}. It is advised to keep windows closed and wear N95 filters outdoors.`
            : `Conditions in ${targetWard.name} are currently satisfactory (AQI: ${targetWard.aqi}). It is acceptable for most citizens.`;
        } else {
          reply = `Current AQI in ${targetWard.name} is ${targetWard.aqi}. Main triggers: traffic and dust. We advise clean routes and transit commute.`;
        }

        if (city === "Bangalore") {
          routes = [
            { name: "Cubbon Park Jogging Track", aqi: Math.floor(targetWard.aqi * 0.7), reason: "Lush canopy blocks ambient aerosols." },
            { name: "Lalbagh Botanical Walkway", aqi: Math.floor(targetWard.aqi * 0.8), reason: "High botanical density triggers localized cooling." }
          ];
        } else if (city === "Chennai") {
          routes = [
            { name: "Adyar Eco-Park Corridor", aqi: Math.floor(targetWard.aqi * 0.7), reason: "Protected wetland breeze disperses particulates." },
            { name: "Marina Beach Promenade", aqi: Math.floor(targetWard.aqi * 0.8), reason: "Strong coastal wind vectors dilute emissions." }
          ];
        } else if (city === "Delhi") {
          routes = [
            { name: "Lodhi Gardens Green Trail", aqi: Math.floor(targetWard.aqi * 0.7), reason: "Historical park enclave with high canopy cover." },
            { name: "Sanjay Van Forest Pathway", aqi: Math.floor(targetWard.aqi * 0.8), reason: "Dense foliage traps suspended dust loads." }
          ];
        } else if (city === "Mumbai") {
          routes = [
            { name: "Sanjay Gandhi National Park Walk", aqi: Math.floor(targetWard.aqi * 0.7), reason: "Forested reserve acts as a natural carbon sink." },
            { name: "Marine Drive Promenade", aqi: Math.floor(targetWard.aqi * 0.8), reason: "Sea breeze triggers high dilution of vehicular exhaust." }
          ];
        } else {
          routes = [
            { name: "IIIT Campus Green Pathway", aqi: Math.floor(targetWard.aqi * 0.7), reason: "Dense tree plantation blocks road soot." },
            { name: "Mindspace Office Bypass Corridor", aqi: Math.floor(targetWard.aqi * 0.8), reason: "Low truck traffic lane." }
          ];
        }

        setChatMessages([...messages, {
          sender: "agent",
          text: reply,
          routes
        }]);
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  // Guard action for Public Demo Mode limitations & Route protection
  const checkActionPermission = (actionName: string, targetTab?: string) => {
    if (!isAuthenticated) {
      setAuthModalReason(actionName);
      if (targetTab) {
        setTargetRedirect(targetTab);
      }
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleTabClick = (tabId: string) => {
    const protectedTabs = ["reports", "settings", "copilot"];
    if (protectedTabs.includes(tabId)) {
      if (!checkActionPermission(`Accessing ${tabId === 'reports' ? 'Corporate Bulletins' : tabId === 'copilot' ? 'PranaAI Copilot console' : 'Configuration Settings'}`, tabId)) {
        return;
      }
    }
    setActivePage(tabId);
    setIsMobileMenuOpen(false); // Close sidebar drawer on mobile
  };

  const handleGenerateReport = (type: string) => {
    if (!checkActionPermission(`Generating weekly/daily bulletins`)) return;
    setLoading(true);
    setTimeout(() => {
      const rep = {
        id: reportsList.length + 1,
        title: `Hyderabad ${type} Environmental Summary`,
        type: type,
        created_at: new Date().toISOString().split("T")[0],
        summary: `Aggregated audit for Hyderabad IT Corridor focus areas. Average corporate zone AQI stands at ${currentAqi} with vehicular traffic as the principal driver.`
      };
      setReportsList([rep, ...reportsList]);
      setLoading(false);
    }, 500);
  };

  // Execute AI Policy Actions
  const handleExecutePolicy = (id: number, title: string) => {
    if (!checkActionPermission(`Executing policy directive: "${title}"`)) return;
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, executed: true } : rec));
    alert(`Policy directive "${title}" has been transmitted to Hyderabad Municipal authorities.`);
  };






  // Autocomplete search suggestions filter
  const filteredSuggestions = searchQuery.trim()
    ? activeWards.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <EnvironmentalThemeProvider selectedWard={selectedWard}>
      <div className="min-h-screen text-foreground bg-transparent transition-colors duration-300 relative">
        <EnvironmentalAmbience />
        <div className="relative z-10 w-full min-h-screen">
          {flow === "landing" && (
            <div className={cn("min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden font-sans scroll-smooth prana-shell", weatherShellClass)}>
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className={cn(
                  "absolute -top-24 left-[-8%] h-96 w-96 rounded-full blur-[140px] animate-pulse",
                  currentAqi <= 50 ? "bg-emerald-400/20" : currentAqi <= 100 ? "bg-sky-400/18" : currentAqi <= 170 ? "bg-amber-400/18" : "bg-rose-400/20"
                )} style={{ animationDuration: "11s" }} />
                <div className={cn(
                  "absolute bottom-[-16%] right-[-6%] h-[30rem] w-[30rem] rounded-full blur-[150px] animate-pulse",
                  currentAqi <= 50 ? "bg-cyan-400/12" : currentAqi <= 100 ? "bg-sky-500/14" : currentAqi <= 170 ? "bg-orange-400/14" : "bg-red-500/16"
                )} style={{ animationDuration: "15s" }} />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
              </div>

              {/* Transparent, scroll-aware Glass Navbar */}
              <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrollY > 20
                  ? "bg-[#070B14]/85 backdrop-blur-md py-3.5 border-slate-800/80 shadow-lg"
                  : "bg-transparent py-5 border-transparent"
              )}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Activity className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-white">PranaAI</span>
                  </div>


                  <div>
                    <button
                      onClick={() => {
                        setTargetRedirect("dashboard");
                        setFlow("booting");
                      }}
                      className="btn-primary py-2 px-4 text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      Launch Mission Control
                    </button>
                  </div>
                </div>
              </nav>

              {/* Cinematic Hero (100vh) */}
              <section className="min-h-screen flex flex-col justify-center items-center relative px-6 pt-20">
                {/* Background spotlight overlays */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
                  <div className="absolute top-[15%] left-[20%] w-[45rem] h-[45rem] rounded-full bg-emerald-500/5 blur-[130px] animate-pulse" style={{ animationDuration: "10s" }} />
                  <div className="absolute bottom-[10%] right-[10%] w-[50rem] h-[50rem] rounded-full bg-cyan-500/5 blur-[140px] animate-pulse" style={{ animationDuration: "14s" }} />
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

                  {/* Floating particles */}
                  {[1, 2, 3, 4, 5, 6].map((p) => (
                    <div
                      key={p}
                      className={cn(
                        "absolute w-1 h-1 rounded-full bg-emerald-400/20 animate-float",
                        p === 1 && "top-1/4 left-1/3 duration-[12s]",
                        p === 2 && "top-2/3 left-[12%] duration-[18s] delay-300",
                        p === 3 && "top-1/3 left-3/4 duration-[15s] delay-700",
                        p === 4 && "top-[75%] left-[55%] duration-[20s] delay-500",
                        p === 5 && "top-[15%] left-[85%] duration-[10s] delay-200"
                      )}
                    />
                  ))}
                </div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
                  {/* Hero Left Info */}
                  <div className="lg:col-span-6 flex flex-col gap-6 text-left items-start max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                      <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Live {selectedRegion.focus} · {weatherLabel} · {liveTelemetryLabel}
                    </div>

                    <div className="flex flex-col gap-2">
                      <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
                        Prana<span className="text-primary">AI</span>
                      </h1>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 block mt-1">
                        Environmental Intelligence. Reimagined.
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      A premium decision intelligence platform monitoring air loads, predicting future dispersion grids, and sandboxing local policies.
                    </p>

                    {/* Tagline rotation indicators */}
                    <div className="h-6 flex items-center overflow-hidden">
                      <span className="text-xs font-mono font-bold text-accent transition-all duration-500 animate-pulse">
                        {taglineIdx === 0 && "➔ Real-Time Air Quality Intelligence"}
                        {taglineIdx === 1 && "➔ AI-Powered Forecasting"}
                        {taglineIdx === 2 && "➔ Digital Environmental Twin"}
                        {taglineIdx === 3 && "➔ Smart City Insights"}
                        {taglineIdx === 4 && "➔ Live Pollution Analytics"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setTargetRedirect("dashboard");
                          setFlow("booting");
                        }}
                        className="btn-primary py-3.5 px-8 text-xs font-bold shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                      >
                        Launch Mission Control
                      </button>
                      <button
                        onClick={() => {
                          setTargetRedirect("map");
                          setFlow("booting");
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 px-8 text-xs font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                      >
                        View Live Environmental Map
                      </button>
                    </div>
                  </div>

                  {/* Hero Right: Rotating Earth Visuals */}
                  <div className="lg:col-span-6 flex justify-center items-center relative w-full h-[400px]">
                    {/* Outer Glow */}
                    <div className="absolute w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                    {/* Orbital Rings */}
                    <div className="absolute w-[360px] h-[360px] rounded-full border border-slate-800 animate-spin" style={{ animationDuration: '40s' }} />
                    <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-emerald-500/10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                    <div className="absolute w-[240px] h-[240px] rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: '12s' }} />

                    {/* Globe Sphere */}
                    <div className="absolute w-48 h-48 rounded-full bg-[#0d1d33] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/25 via-cyan-500/10 to-transparent z-10" />
                      <div className="absolute inset-[3px] rounded-full bg-[#070e17] flex items-center justify-center">
                        <Wind className="w-12 h-12 text-emerald-500/15 animate-pulse" />
                      </div>
                      <div className="absolute w-40 h-[1px] bg-white/5 rotate-12" />
                      <div className="absolute w-40 h-[1px] bg-white/5 -rotate-45" />
                      <div className="absolute w-[1px] h-40 bg-white/5" />
                    </div>

                    {/* Floating Metric Tags */}
                    <div className="absolute top-[8%] -left-6 bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: "5s" }}>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/25 flex items-center justify-center text-emerald-400">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">IT Corridor AQI</span>
                        <span className="text-xs font-black text-white">{selectedWard.aqi} - {getAQIBadge(selectedWard.aqi)}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-[8%] -right-6 bg-slate-900/90 border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: "6s", animationDelay: "1.2s" }}>
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/25 flex items-center justify-center text-cyan-400">
                        <Sun className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Weather Pattern</span>
                        <span className="text-xs font-black text-white">{formatTemp(selectedWard.temperature)} · {weatherLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-6 flex flex-col items-center gap-1.5 opacity-60">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Scroll to Explore</span>
                  <div className="w-1 h-3.5 bg-slate-600 rounded-full relative overflow-hidden">
                    <div className="w-full h-1/2 bg-primary rounded-full absolute top-0 animate-bounce" />
                  </div>
                </div>
              </section>

              {/* Section 1: Monitor */}
              <section className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 flex flex-col gap-5 text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">01 / Real-time sensing</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Monitor Urban Air Loads Instantly.
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Continuous sensor updates compile particulate levels, humidity indices, and meteorological telemetry. Our localized spatial grid traces details down to the sector centroid.
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      {[
                        "Live multi-station geofenced mapping feed.",
                        "Attribution of particulate counts to traffic and construction zones.",
                        "Immediate threshold alert warnings."
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-300 font-semibold items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Graphic container */}
                  <div className="lg:col-span-7 bg-[#0b101d] border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-xs font-extrabold text-white">Live Hyd Corridor Nodes</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">6 Sensors Online</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {MOCK_WARDS.slice(0, 4).map((w) => (
                        <div key={w.id} className="bg-slate-950/80 border border-slate-900/60 p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-white block">{w.name}</span>
                            <span className="text-[10px] text-slate-500 mt-1 block">PM2.5: {w.pm2_5} µg/m³</span>
                          </div>
                          <span className={cn(
                            "text-xs font-black px-2 py-0.5 rounded border",
                            w.aqi > 150
                              ? "text-red-400 border-red-500/20 bg-red-500/5"
                              : w.aqi > 100
                                ? "text-amber-400 border-amber-500/20 bg-amber-500/5"
                                : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                          )}>
                            {w.aqi} AQI
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Predict */}
              <section className="py-24 border-t border-slate-900 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Graphic container */}
                  <div className="lg:col-span-7 lg:order-2 flex flex-col gap-6">
                    <div className="bg-[#0b101d] border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">AI Forecast Matrix</span>
                      <div className="flex flex-col gap-4">
                        {[
                          { h: "24h Lead Forecast", val: "152 AQI", trend: "Rising load shares", conf: "93%" },
                          { h: "48h Lead Forecast", val: "160 AQI", trend: "Thermal inversion warning", conf: "93%" },
                          { h: "72h Lead Forecast", val: "138 AQI", trend: "Wind dispersion relief", conf: "90%" }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-950/80 border border-slate-900/60 p-4.5 rounded-2xl flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white block">{item.h}</span>
                              <span className="text-[10.5px] text-slate-400 block mt-1">{item.trend}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-primary block">{item.val}</span>
                              <span className="text-[9px] text-slate-500 block mt-0.5">Confidence: {item.conf}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col gap-5 text-left lg:order-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">02 / AI Forecasting</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Predict Future Spikes & Cycles.
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Leverages custom gradient-boosted decision tree algorithms to map future particulate dispersals. Anticipate localized AQI trends 72 hours before they manifest.
                    </p>
                    <div className="flex flex-col gap-2.5 mt-2">
                      {[
                        "Hourly forecasts updated with live barometric logs.",
                        "Atmospheric boundary layer simulation models.",
                        "Strategic traffic load shift projections."
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-300 font-semibold items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Analyze */}
              <section className="py-24 border-t border-slate-900 bg-slate-950/40 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 flex flex-col gap-5 text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">03 / Causal Attribution</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Isolate Environmental Drivers.
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Explainability engines evaluate particulate contributions from diesel traffic commute, real estate dust, and industrial emissions. Compare spatial grids across temporal ranges.
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      {[
                        "Explainable causality models (SHAP values integration).",
                        "Historical comparative trend lines.",
                        "Geospatial cluster hotspot indicators."
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-slate-300 font-semibold items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recharts AreaChart Card */}
                  <div className="lg:col-span-7 bg-[#0b101d] border border-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Weekly Historical AQI Comparison</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded">Active Ward Baseline</span>
                    </div>
                    <div className="h-48 w-full text-xs font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: "Mon", aqi: 120, baseline: 110 },
                          { name: "Tue", aqi: 145, baseline: 115 },
                          { name: "Wed", aqi: 182, baseline: 130 },
                          { name: "Thu", aqi: 198, baseline: 140 },
                          { name: "Fri", aqi: 168, baseline: 125 },
                          { name: "Sat", aqi: 125, baseline: 110 },
                          { name: "Sun", aqi: 110, baseline: 105 }
                        ]}>
                          <defs>
                            <linearGradient id="landingAqi" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                          <Area type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#landingAqi)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Act */}
              <section className="py-24 border-t border-slate-900 relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12 text-center">
                  <div className="max-w-2xl flex flex-col gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">04 / Decision Support</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Proactive Policy Sandboxing.
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      PranaAI links predictive metrics directly to administrative advisories. Simulate policy enforcement runs and generate executive audits immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    {[
                      { title: "Restrict Heavy Vehicles", desc: "Divert commercial diesel transport from junctions during office commute traffic spikes.", impact: "-22 AQI Points", priority: "High" },
                      { title: "Water Sprinkling", desc: "Deploy sprinkler trucks across high-rise construction zones to restrict particulate dust.", impact: "-18 AQI Points", priority: "High" },
                      { title: "Increase Electric Transit", desc: "Boost state electric bus runs near IT clusters to cut private commute volume.", impact: "-12 AQI Points", priority: "Medium" }
                    ].map((act, idx) => (
                      <div key={idx} className="bg-[#0b101d] border border-slate-900 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Action Plan</span>
                          <span className="text-[9px] uppercase font-extrabold text-primary px-2 py-0.5 rounded bg-primary/5 border border-primary/20">{act.priority}</span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{act.title}</h4>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{act.desc}</p>
                        </div>
                        <div className="border-t border-slate-900 pt-4 mt-auto">
                          <span className="text-[10px] text-slate-500 block">Est. Impact Rating</span>
                          <span className="text-xs font-black text-emerald-400 mt-1 block">{act.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Final CTA */}
              <section className="py-28 border-t border-slate-900 bg-gradient-to-t from-slate-950 to-transparent relative overflow-hidden">
                {/* Background Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 text-center flex flex-col gap-8 items-center relative z-10">
                  <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                    Ready to explore your city's environmental intelligence?
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                    Unlock the entire suite of predictive analytics, real-time spatial sensors, historical briefs, and AI advisory copilot. No authentication required.
                  </p>
                  <button
                    onClick={() => {
                      setTargetRedirect("dashboard");
                      setFlow("booting");
                    }}
                    className="btn-primary py-4 px-10 text-sm font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Launch Mission Control Corridor
                  </button>
                </div>
              </section>

              {/* Footer */}
              <footer className="w-full border-t border-slate-900 py-6 bg-slate-950/80 backdrop-blur-md relative z-10 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                  <span>&copy; 2026 PranaAI. Predict. Explain. Act.</span>
                  <div className="flex gap-4">
                    <span>Active Nodes: 6 Wards</span>
                    <span>Centroid: {selectedRegion.focus}</span>
                  </div>
                </div>
              </footer>

            </div>
          )}



          {/* 3. OS BOOT SEQUENCE SCREEN */}
          {flow === "booting" && (
            <BootLayout
              progress={bootingProgress}
              completedSteps={bootingStepLogs}
              activeStep={bootingActiveStep}
            />
          )}

          {/* 4. MISSION CONTROL OPERATIONAL CANVAS */}
          {flow === "dashboard" && (
            <div className={cn(
              "min-h-screen flex bg-transparent transition-colors duration-500 relative prana-shell overflow-hidden",
              selectedWard.aqi <= 50 ? "bg-weather-good" : selectedWard.aqi <= 100 ? "bg-weather-moderate" : selectedWard.aqi <= 170 ? "bg-weather-poor" : "bg-weather-severe",
              weatherShellClass
            )}>
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className={cn(
                  "absolute top-[-10%] left-[10%] h-[26rem] w-[26rem] rounded-full blur-[140px] animate-pulse",
                  selectedWard.aqi <= 50 ? "bg-emerald-400/14" : selectedWard.aqi <= 100 ? "bg-sky-400/14" : selectedWard.aqi <= 170 ? "bg-amber-400/14" : "bg-rose-400/18"
                )} style={{ animationDuration: "13s" }} />
                <div className={cn(
                  "absolute bottom-[-14%] right-[8%] h-[34rem] w-[34rem] rounded-full blur-[160px] animate-pulse",
                  selectedWard.aqi <= 50 ? "bg-cyan-300/10" : selectedWard.aqi <= 100 ? "bg-sky-500/10" : selectedWard.aqi <= 170 ? "bg-orange-400/12" : "bg-red-500/14"
                )} style={{ animationDuration: "17s" }} />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.035]" />
              </div>

              {/* SIDEBAR NAVIGATION BAR PANEL */}
              <aside className={cn(
                "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-border transition-all duration-300 transform",
                isSidebarCollapsed ? "w-16" : "w-64",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              )}>

                {/* Sidebar Logo */}
                <div className={cn(
                  "p-4 flex items-center justify-between border-b border-border min-h-[65px]",
                  isSidebarCollapsed && "justify-center px-2"
                )}>
                  {isSidebarCollapsed ? (
                    <button
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0 shadow-theme hover:scale-105 transition-transform cursor-pointer"
                      title="Expand Sidebar"
                    >
                      <Activity className="w-4.5 h-4.5 text-white" />
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0 shadow-theme">
                          <Activity className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="font-extrabold text-base text-foreground tracking-tight">
                          Prana<span className="text-primary font-black">AI</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setIsSidebarCollapsed(true)}
                        className="hidden lg:flex p-1 rounded-lg text-muted hover:bg-muted/10 transition-colors cursor-pointer"
                        aria-label="Collapse Sidebar"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="flex-grow p-3 flex flex-col gap-1 overflow-y-auto">
                  {[
                    { id: "dashboard", label: t("dashboard"), icon: Activity },
                    { id: "map", label: t("map"), icon: MapIcon },
                    { id: "prediction", label: t("prediction"), icon: TrendingUp },
                    { id: "reports", label: t("reports"), icon: FileText },
                    { id: "copilot", label: t("copilot"), icon: MessageSquare },
                    { id: "settings", label: t("settings"), icon: Settings },
                    { id: "About", label: t("About"), icon: Info }
                  ].map((tab) => {
                    const isActive = activePage === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer",
                          isSidebarCollapsed ? "justify-center px-0" : "px-2.5",
                          isActive
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted hover:text-foreground hover:bg-muted/10"
                        )}
                        title={isSidebarCollapsed ? tab.label : undefined}
                      >
                        <tab.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted")} />
                        {!isSidebarCollapsed && <span>{tab.label}</span>}
                      </button>
                    );
                  })}
                </nav>

                {!isSidebarCollapsed && (
                  <div className="p-3 border-t border-border flex flex-col gap-2">
                    <div className="p-3 bg-muted/5 rounded-xl text-[10px] text-muted font-medium border border-border/40">
                      Centroid Node: <strong>{selectedCity}</strong>
                    </div>
                  </div>
                )}
              </aside>

              {/* Mobile sidebar overlay backdrop */}
              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
              )}

              {/* MAIN PAGE CONTAINER WRAPPER */}
              <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
              )}>

                {/* STICKY TOP NAVIGATION HEADER */}
                <header className="sticky top-0 z-40 border-b border-border bg-navbar/80 backdrop-blur-md min-h-[65px] flex items-center">
                  <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-3 flex-nowrap overflow-visible">

                    <div className="flex items-center gap-3 min-w-0 flex-nowrap overflow-hidden">
                      <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1.5 rounded-lg text-muted hover:bg-muted/10 lg:hidden cursor-pointer shrink-0"
                        aria-label="Toggle Mobile Menu"
                      >
                        <Menu className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2 min-w-0 whitespace-nowrap overflow-hidden">
                        <div className="hidden md:flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-muted shrink-0">
                          <span>Operational Area</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-foreground min-w-0 truncate">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{selectedWard.name}, {selectedRegion.state}</span>
                        </div>
                        <span className="hidden md:inline-flex h-4 w-px bg-border/80" />
                        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted whitespace-nowrap">
                          <Sun className="w-3.5 h-3.5 text-warning shrink-0" />
                          <span>{formatTemp(selectedWard.temperature)} {weatherLabel}</span>
                        </div>
                        <span className="hidden lg:inline-flex h-4 w-px bg-border/80" />
                        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-muted whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
                          <span>{currentTimeStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-grow md:flex-grow-0 justify-end shrink-0">

                      {/* AUTOCOMPLETE LOCATION SEARCH INPUT */}
                      <div className="relative w-40 sm:w-52 lg:w-60 shrink-0">
                        <div className="relative">
                          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search Focus Ward..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full bg-muted/5 border border-border rounded-xl py-2 pl-9 pr-4 text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Autocomplete suggestions dropdown panel */}
                        {showSuggestions && searchQuery.trim() && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)}></div>
                            <div className="absolute left-0 top-10 w-full bg-card border border-border rounded-xl shadow-theme p-1.5 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                              {filteredSuggestions.length > 0 ? (
                                filteredSuggestions.map((w) => (
                                  <button
                                    key={w.id}
                                    onClick={() => {
                                      handleWardSelect(w);
                                      setSearchQuery("");
                                      setShowSuggestions(false);
                                    }}
                                    className="px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted/10 text-left text-foreground transition-colors w-full cursor-pointer flex justify-between items-center"
                                  >
                                    <span>{w.name}</span>
                                    <span className="text-[10px] text-primary">AQI {w.aqi}</span>
                                  </button>
                                ))
                              ) : (
                                <span className="px-3 py-2 text-xs text-muted block italic">No matching wards found</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-xl border border-border bg-card hover:bg-muted/10 transition-all text-muted cursor-pointer shrink-0"
                        aria-label="Toggle Theme"
                      >
                        {theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-slate-400" />}
                      </button>

                      {/* Globe Regional Language Selector */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setShowLangDropdown(!showLangDropdown)}
                          className="flex items-center gap-1.5 p-2 rounded-xl border border-border bg-card hover:bg-muted/10 transition-all text-muted hover:text-foreground cursor-pointer text-xs font-bold"
                          aria-label="Language Selector"
                        >
                          <Globe className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName}
                          </span>
                        </button>

                        {showLangDropdown && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)}></div>
                            <div className="absolute right-0 top-11 w-40 bg-card border border-border rounded-xl shadow-theme p-1.5 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                              {SUPPORTED_LANGUAGES.map((l) => (
                                <button
                                  key={l.code}
                                  onClick={() => {
                                    handleLanguageChange(l.code);
                                    setShowLangDropdown(false);
                                  }}
                                  className={cn(
                                    "px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted/10 text-left transition-colors w-full cursor-pointer flex justify-between items-center",
                                    language === l.code ? "text-primary bg-primary/5 font-extrabold" : "text-foreground"
                                  )}
                                >
                                  <span>{l.nativeName}</span>
                                  <span className="text-[9px] uppercase tracking-wide text-muted">{l.code}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (!checkActionPermission("Accessing user notifications drawer")) return;
                          setShowNotifications(true);
                        }}
                        className="p-2 rounded-xl border border-border bg-card hover:bg-muted/10 transition-all text-muted relative cursor-pointer"
                      >
                        <Bell className="w-4 h-4 text-muted" />
                        {notifications.some(n => n.unread) && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full animate-ping"></span>
                        )}
                      </button>

                    </div>

                  </div>
                </header>

                {/* ACTIVE OPERATIONAL AREA */}
                <main className="p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 flex-grow">

                  {loading && (
                    <div className="flex justify-center items-center py-2 gap-2 text-primary">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-xs font-semibold font-mono">Running Agent Operations...</span>
                    </div>
                  )}

                  {/* A. MISSION CONTROL OPERATIONAL HUBS PAGE */}
                  {activePage === "dashboard" && (
                    <div className="flex flex-col gap-8">

                      {/* Smart City Language Detection suggestion toast */}
                      {langSuggestion && (
                        <div className="bg-primary/10 border border-primary p-4 rounded-2xl flex justify-between items-center text-xs animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                            <span className="font-semibold text-foreground">
                              We noticed you selected {langSuggestion.city}. Would you like to switch the system workspace to{" "}
                              <span className="font-bold text-primary font-sans">
                                {SUPPORTED_LANGUAGES.find(l => l.code === langSuggestion.langCode)?.nativeName}
                              </span>
                              ?
                            </span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => {
                                handleLanguageChange(langSuggestion.langCode);
                                setLangSuggestion(null);
                              }}
                              className="px-3.5 py-1.5 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/95 transition-all text-[11px] cursor-pointer"
                            >
                              Switch Language
                            </button>
                            <button
                              onClick={() => setLangSuggestion(null)}
                              className="px-3.5 py-1.5 bg-card border border-border text-muted font-bold rounded-xl hover:bg-muted/10 transition-all text-[11px] cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}


                      <div className="glass-card p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <h4 className="text-sm font-black text-foreground">Metro AQI Beacons</h4>
                            <p className="text-[10px] text-muted mt-1">Live AQI.in values mapped into a compact four-city row.</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Blue</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning"></span> Yellow</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Red</span>
                          </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-1">
                          {cityHotspots.map((city) => (
                            <button
                              key={city.name}
                              onClick={() => handleCitySelect(city.name)}
                              className={cn(
                                "text-left p-3.5 rounded-2xl border transition-all cursor-pointer min-w-[14rem] shrink-0",
                                city.name === selectedCity ? "bg-primary/10 border-primary/30 shadow-theme" : "bg-background/60 border-border hover:bg-muted/10"
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-black text-foreground block">{city.name}</span>
                                  <span className="text-[9px] text-muted block mt-0.5">{city.region.state}</span>
                                </div>
                                <span className={cn("text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border", city.toneClass)}>
                                  {city.tone}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-muted">
                                <span>Operational focus</span>
                                <span className="text-foreground">AQI {city.aqi}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Today's AI Daily Briefing */}
                      {(() => {
                        const brief = getDynamicDailyBrief();
                        return (
                          <DailyBriefCard
                            currentSituation={brief.currentSituation}
                            keyRisks={brief.keyRisks}
                            forecast={brief.forecast}
                            recommendedActions={brief.recommendedActions}
                            expectedImprovement={`-${totalReduction > 0 ? totalReduction : 22} AQI`}
                            confidence={93}
                          />
                        );
                      })()}

                      {/* Today's AI Environmental Brief */}
                      <ExecutiveBriefCard
                        wardName={selectedWard.name}
                        cityName={selectedCity}
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
                        confidence={93}
                      />

                      {/* Top Zone: 70% Map | 30% Insights Panel */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left hero: Digital Twin map taking 70% width */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                          <div className="glass-card p-6 flex flex-col gap-4 min-h-[460px] relative">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-bold text-base flex items-center gap-2">
                                  <MapIcon className="w-5 h-5 text-primary" /> Digital Twin GIS Map
                                </h3>
                                <p className="text-[11px] text-muted mt-1">Operational view mapping live particulate hotspots inside {selectedRegion.focus}.</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20 flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5" /> Sensors Active
                                </span>
                              </div>
                            </div>

                            {/* Leaflet map container */}
                            <div className="flex-1 w-full bg-background min-h-[320px] rounded-xl border border-border relative overflow-hidden">
                              <div id="mission-map-canvas" className="absolute inset-0 w-full h-full rounded-xl z-0"></div>

                              {/* Map color-coded AQI legend */}
                              <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md border border-border p-2.5 rounded-lg z-10 text-[9px] font-semibold flex flex-col gap-1.5 shadow-theme">
                                <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mb-0.5">AQI Index Scale</span>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-success"></div> <span>Good (0-50)</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-secondary"></div> <span>Satisfactory (51-100)</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-warning"></div> <span>Moderate (101-200)</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-danger"></div> <span>Severe (201+)</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right hero: Live Insights taking 30% width */}
                        <div className="lg:col-span-4 flex flex-col gap-6">

                          {/* Environmental Health Index Card */}
                          <EnvironmentalHealthIndexCard
                            score={selectedWard.environmental_health_score}
                            trend={predictedAqi > selectedWard.aqi ? "up" : "down"}
                            confidence={93}
                            explanation={`Atmospheric indicators track cumulative parameters inside ${selectedWard.name} centroid nodes.`}
                            humidity={selectedWard.humidity}
                            greenCover={selectedWard.name === "Gachibowli" ? 38 : selectedWard.name === "Madhapur" ? 22 : 45}
                            exposureFactor={Math.min(100, Math.floor(predictedAqi / 2.2))}
                          />
                        </div>
                      </div>

                      {/* Citizen Health Risks - Horizontal Layout Grid */}
                      <div className="glass-card p-6 flex flex-col gap-6 text-left">
                        <div>
                          <h4 className="text-xs font-bold text-muted uppercase tracking-widest leading-none font-extrabold flex items-center justify-between">
                            <span className="text-foreground flex items-center gap-1.5 text-sm font-black">
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
                            confidence={95}
                            priority="Critical"
                            icon={<Users className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Asthma Patients"
                            currentRisk={predictedAqi > 160 ? "Critical" : predictedAqi > 110 ? "High" : "Moderate"}
                            forecastRisk="Particulate density exceeds safe aerosol levels."
                            recommendation="Keep rescue inhalers accessible; prefer indoor active paths."
                            confidence={96}
                            priority="Critical"
                            icon={<Heart className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Outdoor Workers"
                            currentRisk={predictedAqi > 140 ? "High" : "Moderate"}
                            forecastRisk="Soot accumulations from combustion source emissions."
                            recommendation="Wear certified N95 respirators during high-transit shifts."
                            confidence={94}
                            priority="High"
                            icon={<Activity className="w-4 h-4" />}
                          />
                          <HealthRiskCard
                            targetGroup="Children & Schools"
                            currentRisk={predictedAqi > 120 ? "High" : "Moderate"}
                            forecastRisk="Fine particulates remain suspended under calm winds."
                            recommendation="Divert outdoor physical education activities to clean indoor courts."
                            confidence={94}
                            priority="High"
                            icon={<Users className="w-4 h-4" />}
                          />
                        </div>
                      </div>


                      {/* Middle Zone: Analytics charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Recharts trend comparison chart */}
                        <div className="lg:col-span-8 glass-card p-6 flex flex-col gap-6">
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <TrendingUp className="w-4.5 h-4.5 text-primary" /> {
                              language === "hi" ? "एक्यूआई पूर्वानुमान समयरेखा (72 घंटे का पूर्वानुमान)" :
                                language === "te" ? "AQI అంచనా కాలక్రమం (72 గంటల అంచనా)" :
                                  language === "ta" ? "AQI கணிப்பு காலவரிசை (72 மணிநேர கணிப்பு)" :
                                    language === "kn" ? "AQI ಮುನ್ಸೂಚನೆ ಕಾಲಸೂಚಿ (72 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ)" :
                                      "AQI Predictive Timeline (72h Forecast Horizon)"
                            }
                          </h4>

                          <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[
                                { name: 'Current', aqi: currentAqi, simulatedAqi: predictedAqi },
                                { name: '+24h', aqi: currentForecast[0].predicted_aqi, simulatedAqi: Math.max(10, currentForecast[0].predicted_aqi - totalReduction) },
                                { name: '+48h', aqi: currentForecast[1].predicted_aqi, simulatedAqi: Math.max(10, currentForecast[1].predicted_aqi - totalReduction) },
                                { name: '+72h', aqi: currentForecast[2].predicted_aqi, simulatedAqi: Math.max(10, currentForecast[2].predicted_aqi - totalReduction) }
                              ]}>
                                <defs>
                                  <linearGradient id="colorAqiMission" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={10} />
                                <YAxis stroke="var(--muted)" fontSize={10} />
                                <ChartTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                                <Area type="monotone" dataKey="aqi" name={
                                  language === "hi" ? "आधारभूत एक्यूआई" :
                                    language === "te" ? "బేస్‌లైన్ AQI" :
                                      language === "ta" ? "அடிப்படை AQI" :
                                        language === "kn" ? "ಮೂಲ AQI" :
                                          "Baseline AQI"
                                } stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAqiMission)" />
                                {isSimulating && (
                                  <Area type="monotone" dataKey="simulatedAqi" name={
                                    language === "hi" ? "सिम्युलेटेड एक्यूआई" :
                                      language === "te" ? "సిమ్యులేటెడ్ AQI" :
                                        language === "ta" ? "உருவகப்படுத்தப்பட்ட AQI" :
                                          language === "kn" ? "ಸಿಮ್ಯುಲೇಟೆಡ್ AQI" :
                                            "Simulated AQI"
                                  } stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="5 5" fill="transparent" />
                                )}
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="lg:col-span-4 glass-card p-6 flex flex-col gap-4">
                          <h4 className="font-bold text-sm">
                            {language === "hi" ? "प्रति घंटा पूर्वानुमानित समयसीमा" :
                              language === "te" ? "గంటల వారీ అంచనా పరిధులు" :
                                language === "ta" ? "மணிநேர முன்னறிவிப்பு எல்லைகள்" :
                                  language === "kn" ? "ಗಂಟೆವಾರು ಮುನ್ಸೂಚನೆ ವ್ಯಾಪ್ತಿಗಳು" :
                                    "Hourly forecast horizons"}
                          </h4>
                          <div className="flex flex-col gap-2.5 mt-2">
                            {currentForecast.map((f, i) => (
                              <div key={i} className="flex justify-between items-center text-xs bg-muted/5 border border-border p-3 rounded-xl">
                                <div>
                                  <span className="font-semibold text-foreground block">
                                    {language === "hi" ? `समयसीमा +${f.horizon_hours} घंटे` :
                                      language === "te" ? `సమయం +${f.horizon_hours} గంటలు` :
                                        language === "ta" ? `எல்லை +${f.horizon_hours} மணிநேரம்` :
                                          language === "kn" ? `ವ್ಯಾಪ್ತಿ +${f.horizon_hours} ಗಂಟೆಗಳು` :
                                            `Horizon +${f.horizon_hours} Hours`}
                                  </span>
                                  <span className="text-[9px] text-muted block mt-0.5">
                                    {language === "hi" ? `विश्वास सूचकांक: ${f.confidence_score * 100}%` :
                                      language === "te" ? `విశ్వసనీయత సూచిక: ${f.confidence_score * 100}%` :
                                        language === "ta" ? `நம்பிக்கை குறியீடு: ${f.confidence_score * 100}%` :
                                          language === "kn" ? `ವಿಶ್ವಾಸಾರ್ಹತೆ ಸೂಚ್ಯಂಕ: ${f.confidence_score * 100}%` :
                                            `Confidence index: ${f.confidence_score * 100}%`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>


                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Policy Impact cards (col-span-12) */}
                        <div className="lg:col-span-12 glass-card p-6 flex flex-col gap-6 text-left">
                          <div>
                            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                              <Activity className="w-4.5 h-4.5 text-primary" /> {t("policyImpactTitle")}
                            </h4>
                            <span className="text-[10px] text-muted mt-1 block">{t("policyImpactSub")}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <PolicyImpactCard
                              policyName="Heavy Diesel Traffic Restriction"
                              status="Enforced"
                              expectedImprovement={22}
                              measuredImprovement={simulatedTraffic > 0 ? trafficReductionPoints : 18}
                              confidence={94}
                              cost={24500}
                              duration="4 hours"
                              successRate={85}
                            />
                            <PolicyImpactCard
                              policyName="Real Estate Demolition Abatement"
                              status="Active Inspector Alert"
                              expectedImprovement={9}
                              measuredImprovement={simulatedConstruction > 0 ? constructionReductionPoints : 8}
                              confidence={91}
                              cost={8200}
                              duration="2 hours"
                              successRate={92}
                            />
                            <PolicyImpactCard
                              policyName="Local Dust Sprinkling Fleet Run"
                              status="Deploying Vehicles"
                              expectedImprovement={6}
                              measuredImprovement={simulatedSprinkling > 0 ? sprinklingReductionPoints : 5}
                              confidence={88}
                              cost={1500}
                              duration="3 hours"
                              successRate={78}
                            />
                          </div>
                        </div>

                      </div>




                    </div>
                  )}

                  {/* B. DIGITAL TWIN GIS LAYERS MAP VIEW */}
                  {activePage === "map" && (
                    <DigitalTwin
                      wards={activeWards}
                      selectedWard={selectedWard}
                      onSelectWard={handleWardSelect}
                      recommendations={recommendations}
                      onExecutePolicy={handleExecutePolicy}
                    />
                  )}

              {/* C. PREDICTIVE FORECAST HORIZONS TAB */}
              {activePage === "prediction" && (
                <ForecastCenter
                  wards={activeWards}
                  selectedWard={selectedWard}
                  onSelectWard={handleWardSelect}
                  onNavigateToMap={() => handleTabClick("map")}
                  narrativeExplanation={narrativeExplanation}
                />
              )}



                  {/* E. BOARDROOM REPORTS BULLETINS TAB */}
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
                      feedItems={feedItems}
                      checkActionPermission={checkActionPermission}
                    />
                  )}

                  {/* F. FULL SCREEN PRANAAI COPILOT INTERACTIVE CONSOLE */}
                  {activePage === "copilot" && (
                    <CopilotConsole
                      selectedWard={selectedWard}
                      onGenerateReport={() => handleGenerateReport("Weekly")}
                      onViewTwin={() => handleTabClick("map")}
                      onOpenForecast={() => handleTabClick("prediction")}
                      onNavigate={handleTabClick}
                    />
                  )}

                  {/* G. CONFIGURATION SETTINGS TAB */}
                  {activePage === "settings" && (
                    <SettingsLayout />
                  )}

                  {/* H. ABOUT THE OPERATING SYSTEM TAB */}
                  {activePage === "About" && (
                    <div className="glass-card p-8 flex flex-col gap-6">
                      <div>
                        <h2 className="text-xl font-extrabold text-foreground">About PranaAI</h2>
                        <p className="text-xs text-muted mt-1">Version 1.0.0 ({selectedRegion.state} MVP)</p>
                      </div>

                      <div className="text-muted text-xs flex flex-col gap-4 border-t border-border pt-6 leading-relaxed font-sans">
                        <p>
                          PranaAI is designed as an Urban Environmental Decision Intelligence Platform. Standard AQI monitoring tools only show historical values. PranaAI leverages machine learning regressors and a coordinate geofenced multi-agent architecture to predict futures, trace features, and simulate structural adjustments before municipal deployment.
                        </p>
                        <p>
                          Designed with a premium SaaS dark/light aesthetic, it targets the selected city's high-development corridor for high-impact decision support.
                        </p>
                        <p className="font-semibold text-muted">
                          Developed by Team PranaAI. Predict. Explain. Act.
                        </p>
                      </div>
                    </div>
                  )}

                </main>
              </div>
            </div>
          )}

          {/* 5. SLIDE-OUT NOTIFICATION HUB DRAWER */}
          {showNotifications && (
            <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
              <div className="w-full max-w-sm bg-card border-l border-border h-full relative z-10 p-6 flex flex-col gap-6 shadow-theme animate-in slide-in-from-right duration-250">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-foreground text-base">Notification Hub</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-muted hover:text-foreground cursor-pointer">Close</button>
                </div>

                <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="bg-muted/5 border border-border p-4 rounded-xl relative">
                      {n.unread && <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full"></span>}
                      <span className="text-[10px] text-muted font-bold block">{n.time}</span>
                      <h4 className="font-bold text-xs text-foreground mt-1">{n.title}</h4>
                      <p className="text-xs text-muted mt-1 leading-normal">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. FLOATING PERPLEXITY-STYLE AI COPILOT OVERLAY (STILL ACCESSIBLE) */}
          <div className="fixed bottom-6 right-6 z-45">
            <button
              onClick={() => {
                if (!checkActionPermission("Accessing PranaAI Copilot Dialog Dashboard", "dashboard")) return;
                setShowCopilot(!showCopilot);
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-theme cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>

            {showCopilot && (
              <div className="absolute bottom-16 right-0 w-[380px] md:w-[450px] glass-card p-6 flex flex-col gap-4 shadow-theme z-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-success rounded-full animate-ping"></div>
                    <h3 className="font-bold text-foreground text-sm">PranaAI Copilot</h3>
                  </div>
                  <button onClick={() => setShowCopilot(false)} className="text-xs text-muted hover:text-foreground cursor-pointer">Close</button>
                </div>

                <div className="h-[250px] bg-muted/5 border border-border rounded-xl p-3 overflow-y-auto flex flex-col gap-3">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={cn(
                        "p-2.5 rounded-xl text-xs leading-normal",
                        msg.sender === "user"
                          ? "bg-primary text-white font-semibold"
                          : "bg-card border border-border text-foreground"
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
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => handleSendMessage(undefined, "Can I jog tomorrow in Gachibowli?")} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted/10 border border-border text-muted transition-all font-semibold cursor-pointer">🏃 Run Jog Test</button>
                  <button onClick={() => handleSendMessage(undefined, "Is it safe in Madhapur today?")} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted/10 border border-border text-muted transition-all font-semibold cursor-pointer">🏡 Exposure Risk</button>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask environmental triggers..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  <button type="submit" className="btn-primary p-2 px-3 flex items-center justify-center shadow-none cursor-pointer">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 7. INTERCEPT LOGIN DIALOG FOR DEMO VISITORS */}
          <Modal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            title="Authentication Required"
          >
            <div className="flex flex-col gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground leading-snug">Sign In Required</h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  You clicked on a personalized feature: <strong className="text-primary">"{authModalReason}"</strong>. Connect or create an account to unlock custom alerts, download audit summaries, and save configurations.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowAuthModal(false);
                    setFlow("auth");
                  }}
                  className="w-full justify-center py-2.5 font-bold text-xs"
                >
                  Sign In to Account
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full justify-center text-xs font-semibold"
                >
                  Cancel & Continue Demo
                </Button>
              </div>
            </div>
          </Modal>

          {/* 8. WATCH DEMO MODAL DIALOG */}
          <Modal
            isOpen={showDemoDialog}
            onClose={() => setShowDemoDialog(false)}
            title="PranaAI Platform Walkthrough"
          >
            <div className="flex flex-col gap-4">
              <div className="aspect-video w-full rounded-xl bg-background border border-border flex flex-col items-center justify-center text-center p-4">
                <Compass className="w-10 h-10 text-primary animate-pulse" />
                <span className="text-xs font-bold text-foreground mt-4">Demo video stream mapping {selectedRegion.focus}</span>
                <span className="type-caption mt-1 text-muted">Walkthrough mapping sensors calibration, SHAP explanations, and sandboxed policy runs.</span>
              </div>

              <p className="text-xs leading-relaxed text-muted">
                PranaAI evaluates environmental datasets using AI models to predict particulate accumulation up to 72 hours, helping city operators simulate truck curbs and sprinkler deployment.
              </p>

              <Button variant="primary" className="w-full justify-center font-bold text-xs" onClick={() => setShowDemoDialog(false)}>
                Close Video
              </Button>
            </div>
          </Modal>

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
