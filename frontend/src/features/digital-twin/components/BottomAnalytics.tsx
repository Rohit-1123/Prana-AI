import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Bell, TrendingUp } from "lucide-react";
import { extraTranslations } from "../../../utils/i18n_extra";
import { useSettings } from "../../../contexts/SettingsContext";

interface BottomAnalyticsProps {
  ward: any;
}

export function BottomAnalytics({ ward }: BottomAnalyticsProps) {
  const { language } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];

  const mockTimelineData = [
    { name: activeLanguage === "hi" ? "सोम" : activeLanguage === "te" ? "సోమ" : activeLanguage === "ta" ? "திங்கள்" : activeLanguage === "kn" ? "ಸೋಮ" : "Mon", aqi: Math.floor(ward.aqi * 0.95), temp: ward.temperature - 1 },
    { name: activeLanguage === "hi" ? "मंगल" : activeLanguage === "te" ? "మంగళ" : activeLanguage === "ta" ? "செவ்வாய்" : activeLanguage === "kn" ? "ಮಂಗಳ" : "Tue", aqi: Math.floor(ward.aqi * 1.02), temp: ward.temperature },
    { name: activeLanguage === "hi" ? "बुध" : activeLanguage === "te" ? "బుధ" : activeLanguage === "ta" ? "புதன்" : activeLanguage === "kn" ? "ಬುಧ" : "Wed", aqi: Math.floor(ward.aqi * 0.98), temp: ward.temperature + 0.5 },
    { name: activeLanguage === "hi" ? "गुरु" : activeLanguage === "te" ? "గురు" : activeLanguage === "ta" ? "வியாழன்" : activeLanguage === "kn" ? "ಗುರು" : "Thu", aqi: Math.floor(ward.aqi * 1.05), temp: ward.temperature + 1 },
    { name: activeLanguage === "hi" ? "शुक्र" : activeLanguage === "te" ? "శుక్ర" : activeLanguage === "ta" ? "வெள்ளி" : activeLanguage === "kn" ? "ಶುಕ್ರ" : "Fri", aqi: Math.floor(ward.aqi * 1.08), temp: ward.temperature },
    { name: activeLanguage === "hi" ? "शनि" : activeLanguage === "te" ? "శని" : activeLanguage === "ta" ? "சனி" : activeLanguage === "kn" ? "ಶನಿ" : "Sat", aqi: Math.floor(ward.aqi * 1.05), temp: ward.temperature - 0.5 },
    { name: activeLanguage === "hi" ? "रवि" : activeLanguage === "te" ? "ఆది" : activeLanguage === "ta" ? "ஞாயிறு" : activeLanguage === "kn" ? "ಭಾನು" : "Sun", aqi: ward.aqi, temp: ward.temperature }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-5 w-full shadow-theme select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <span className="font-extrabold text-xs sm:text-sm text-foreground">
            {tExtra.bottomAnalyticsTitle}: <strong className="text-primary">{ward.name}</strong>
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-muted">{tExtra.sevenDayAnalysis}</span>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Pollutant Trend Chart */}
        <div className="md:col-span-8 flex flex-col gap-3 h-full overflow-hidden">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> {tExtra.sevenDayTrend}
          </span>
          <div className="w-full h-44 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimelineData}>
                <defs>
                  <linearGradient id="colorAqiTwin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
                <ChartTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '10px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAqiTwin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="md:col-span-4 flex flex-col gap-3 h-full overflow-hidden border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-primary" /> {tExtra.activeAlerts}
          </span>
          <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow max-h-[176px] pr-1 mt-2">
            {[
              { title: tExtra.trafficSootAlert, desc: tExtra.dieselCongestionDesc, time: activeLanguage === "hi" ? "1 घंटा पहले" : activeLanguage === "te" ? "1 గంట క్రితం" : activeLanguage === "ta" ? "1 மணிநேரத்திற்கு முன்" : activeLanguage === "kn" ? "1 ಗಂಟೆ ಹಿಂದೆ" : "1 hr ago" },
              { title: tExtra.calmWindConditions, desc: tExtra.lightWindsDesc, time: activeLanguage === "hi" ? "4 घंटे पहले" : activeLanguage === "te" ? "4 గంటల క్రితం" : activeLanguage === "ta" ? "4 மணிநேரங்களுக்கு முன்" : activeLanguage === "kn" ? "4 ಗಂಟೆಗಳ ಹಿಂದೆ" : "4 hrs ago" },
              { title: tExtra.constructionDustWarning, desc: tExtra.particulateDriftDesc, time: activeLanguage === "hi" ? "1 दिन पहले" : activeLanguage === "te" ? "1 రోజు క్రితం" : activeLanguage === "ta" ? "1 நாளுக்கு முன்" : activeLanguage === "kn" ? "1 ದಿನ ಹಿಂದೆ" : "1 day ago" }
            ].map((alertItem, idx) => (
              <div key={idx} className="bg-muted/5 border border-border p-3 rounded-xl flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center text-foreground font-bold">
                  <span>{alertItem.title}</span>
                  <span className="text-[8.5px] text-muted font-semibold">{alertItem.time}</span>
                </div>
                <p className="text-muted text-[10.5px] leading-relaxed mt-0.5">{alertItem.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
