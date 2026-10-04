import { useState, useEffect } from "react";
import { ForecastSummaryCard } from "./ForecastSummaryCard";
import { FilterPanel } from "./FilterPanel";
import { QuickActions } from "./QuickActions";
import { ForecastChart } from "./ForecastChart";
import { MethodCard } from "./MethodCard";
import { useSeries } from "../useSeries";
import { ComparisonChart } from "./ComparisonChart";
import { ForecastTable } from "./ForecastTable";
import { AISummaryCard } from "./AISummaryCard";
import { BarChart, Bar, XAxis as BarXAxis, YAxis as BarYAxis, CartesianGrid as BarCartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from "recharts";
import { X, Check } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";

interface ForecastCenterProps {
  wards: any[];
  selectedWard: any;
  onSelectWard: (ward: any) => void;
  onNavigateToMap: () => void;
  narrativeExplanation: string;
}

export function ForecastCenter({
  wards,
  selectedWard,
  onSelectWard,
  onNavigateToMap,
  narrativeExplanation
}: ForecastCenterProps) {
  const { language, formatTemp, formatWind } = useSettings();
  // i18n localization definitions
  const activeLanguage = language;

  // Workspace Filters
  const [selectedLocation, setSelectedLocation] = useState(selectedWard.name);
  const [selectedMetric, setSelectedMetric] = useState("AQI");
  const [selectedHorizon, setSelectedHorizon] = useState("24");

  const handleLocationChange = (name: string) => {
    setSelectedLocation(name);
    const found = wards.find(w => w.name === name);
    if (found) {
      onSelectWard(found);
    }
  };

  // Real hourly series (past 24h to next 72h) for the selected place, from the backend
  const { series, state: seriesState } = useSeries(selectedWard.latitude, selectedWard.longitude);

  const nowIdx = series.findIndex((r) => r.is_forecast) - 1; // last observed hour
  const at = (h: number) => series[nowIdx + h];
  const metricKey = selectedMetric === "PM2.5" ? "pm2_5" : "aqi";
  const horizon = Number(selectedHorizon);

  const currentAqi = selectedWard.aqi;
  const forecastAqi = (h: number) => at(h)?.aqi ?? "–";
  const trendOf = (v: unknown) => (typeof v === "number" ? (v > currentAqi ? "up" as const : v < currentAqi ? "down" as const : "stable" as const) : undefined);
  const currentHealthScore = selectedWard.environmental_health_score;

  const fmtHour = (iso: string, withDay = false) => {
    const d = new Date(iso);
    const hh = `${String(d.getHours()).padStart(2, "0")}:00`;
    return withDay ? `${d.toLocaleDateString([], { weekday: "short" })} ${hh}` : hh;
  };

  // Forecast chart: now .. +horizon
  const hourlyData = series.slice(Math.max(0, nowIdx), nowIdx + horizon + 1).map((r) => ({
    time: fmtHour(r.t, horizon > 24),
    aqi: r[metricKey],
    temp: r.temperature ?? 0,
    humidity: r.humidity ?? 0,
    wind: r.wind_speed ?? 0
  }));

  // Today vs the same hour yesterday, every 2h over the last 24h
  const comparisonData = Array.from({ length: 13 }, (_, i) => {
    const today = series[nowIdx - 24 + 2 * i];
    const yesterday = series[nowIdx - 48 + 2 * i];
    return today && { hour: fmtHour(today.t), today: today.aqi, yesterday: yesterday?.aqi ?? today.aqi };
  }).filter(Boolean);
  const hasYesterday = nowIdx >= 48;

  // Forecast ledger: now, +6h, +12h, +24h, +48h, +72h
  const HORIZONS = [0, 6, 12, 24, 48, 72];
  const tableData = HORIZONS.filter((h) => at(h)).map((h, i) => {
    const r = at(h);
    const prev = at(HORIZONS[Math.max(0, i - 1)]);
    return {
      time: h === 0 ? "Now" : `+${h}h`,
      aqi: r.aqi,
      pm2_5: r.pm2_5,
      temp: r.temperature ?? 0,
      humidity: Math.round(r.humidity ?? 0),
      wind: r.wind_speed ?? 0,
      trend: r.aqi > prev.aqi ? "rising" : r.aqi < prev.aqi ? "falling" : "stable"
    };
  });

  // Plain-language insights computed from the numbers above
  const next24 = series.slice(nowIdx + 1, nowIdx + 25);
  const peak = next24.length ? next24.reduce((a, b) => (b.aqi > a.aqi ? b : a)) : undefined;
  const lowest = next24.length ? next24.reduce((a, b) => (b.aqi < a.aqi ? b : a)) : undefined;
  const avgWind = next24.length ? next24.reduce((a, r) => a + (r.wind_speed ?? 0), 0) / next24.length : 0;
  const keyTrends = peak && lowest ? [
    `Expected to peak near AQI ${peak.aqi} around ${fmtHour(peak.t, true)}.`,
    `Cleanest window in the next 24 hours: ${fmtHour(lowest.t, true)} (AQI ${lowest.aqi}).`,
    `Average wind over the next 24 hours: ${avgWind.toFixed(1)} m/s${avgWind < 2.5 ? " — calm air disperses pollution slowly." : "."}`
  ] : [];
  const riskLevel = !peak ? "Medium" as const : peak.aqi > 300 ? "Severe" as const : peak.aqi > 200 ? "High" as const : peak.aqi > 100 ? "Medium" as const : "Low" as const;
  const attentionAreas = wards
    .filter((w) => w.name !== selectedWard.name)
    .sort((a, b) => Number(b.aqi) - Number(a.aqi))
    .slice(0, 2)
    .map((w) => `${w.name} (AQI ${w.aqi})`);

  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparedWardsList, setComparedWardsList] = useState<number[]>([selectedWard.id]);

  useEffect(() => {
    setComparedWardsList([selectedWard.id]);
  }, [selectedWard.id]);

  const handleExportData = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const csvHeader = "Horizon,Predicted AQI,PM2.5,Temperature,Humidity,Wind\n";
      const csvRows = tableData.map(r => `${r.time},${r.aqi},${r.pm2_5},${r.temp},${r.humidity},${r.wind}`).join("\n");
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prana-forecast-${selectedWard.name}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <head>
            <title>PranaAI Tabular Forecast Report - ${selectedWard.name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
              h1 { font-size: 22px; font-weight: 900; color: #059669; margin-bottom: 5px; }
              p { font-size: 11px; color: #475569; margin: 2px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 24px; }
              th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 11px; }
              th { background: #f1f5f9; font-weight: bold; color: #1e293b; }
              tr:nth-child(even) { background: #f8fafc; }
            </style>
          </head>
          <body>
            <h1>PranaAI Tabular Forecast Report</h1>
            <p><strong>Focus Location:</strong> ${selectedWard.name}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Horizon</th>
                  <th>Predicted AQI</th>
                  <th>PM2.5 (µg/m³)</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Wind Speed</th>
                </tr>
              </thead>
              <tbody>
                ${tableData.map(r => `
                  <tr>
                    <td>${r.time}</td>
                    <td><strong>${r.aqi}</strong></td>
                    <td>${r.pm2_5}</td>
                    <td>${formatTemp(r.temp)}</td>
                    <td>${r.humidity}%</td>
                    <td>${formatWind(r.wind)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCompareTrigger = () => {
    setShowCompareModal(true);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Filters & Actions top row */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-foreground">
              {activeLanguage === "hi" ? "पूर्वानुमान नियंत्रण केंद्र" :
               activeLanguage === "te" ? "అంచనాల నియంత్రణ కేంద్రం" :
               activeLanguage === "ta" ? "முன்னறிவிப்பு கட்டுப்பாட்டு மையம்" :
               activeLanguage === "kn" ? "ಮುನ್ಸೂಚನೆ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ" :
               "Forecast Control Center"}
            </h2>
            <span className="text-xs text-muted block mt-1">
              {activeLanguage === "hi" ? "एआई-संचालित पर्यावरणीय पूर्वानुमानित खुफिया कार्यक्षेत्र" :
               activeLanguage === "te" ? "AI-ఆధారిత పర్యావరణ ముందస్తు హెచ్చరికల వర్క్‌స్పేస్" :
               activeLanguage === "ta" ? "AI-ஆற்றல் பெற்ற சுற்றுச்சூழல் கணிப்பு நுண்ணறிவு பணிப்பகுதி" :
               activeLanguage === "kn" ? "AI-ಚಾಲಿತ ಪರಿಸರ ಮುನ್ಸೂಚನೆ ಕಾರ್ಯಕ್ಷೇತ್ರ" :
               "AI-powered Environmental Predictive Intelligence Workspace"}
            </span>
          </div>
          
          <QuickActions 
            onExport={handleExportData}
            onCompare={handleCompareTrigger}
            onViewMap={onNavigateToMap}
          />
        </div>

        <FilterPanel 
          locations={wards.map(w => w.name)}
          selectedLocation={selectedLocation}
          onChangeLocation={handleLocationChange}
          selectedMetric={selectedMetric}
          onChangeMetric={setSelectedMetric}
          selectedHorizon={selectedHorizon}
          onChangeHorizon={setSelectedHorizon}
        />
      </div>

      {seriesState === "error" && (
        <div className="glass-card p-4 text-xs text-warning">Hourly forecast is temporarily unavailable. Showing current readings only; reopen this page to retry.</div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <ForecastSummaryCard title="Current AQI" value={currentAqi} badgeText="Live" colorClass="border-success/20 text-success bg-success/5" subtitle="24h-average CPCB index" />
        <ForecastSummaryCard title="24 Hour Lead" value={forecastAqi(24)} trend={trendOf(forecastAqi(24))} subtitle="Modelled AQI tomorrow, same hour" />
        <ForecastSummaryCard title="48 Hour Lead" value={forecastAqi(48)} trend={trendOf(forecastAqi(48))} subtitle="Modelled AQI in two days" />
        <ForecastSummaryCard title="72 Hour Lead" value={forecastAqi(72)} trend={trendOf(forecastAqi(72))} subtitle="Modelled AQI in three days" />
        <ForecastSummaryCard title="Peak Next 24h" value={peak ? peak.aqi : "–"} subtitle={peak ? `Around ${fmtHour(peak.t, true)}` : undefined} />
        <ForecastSummaryCard title="Environmental Health" value={currentHealthScore} subtitle="Derived from current AQI" />
      </div>

      {/* Main Charts & Method Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <ForecastChart wardName={selectedWard.name} data={hourlyData} />
          {hasYesterday && <ComparisonChart data={comparisonData} />}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <MethodCard />
          <AISummaryCard
            overviewText={narrativeExplanation}
            keyTrends={keyTrends}
            riskLevel={riskLevel}
            attentionAreas={attentionAreas}
          />
        </div>
      </div>

      {/* Details Ledger Table */}
      <ForecastTable data={tableData} />

      {/* Compare Locations Modal Workflow */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-theme flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border/60">
              <div>
                <h3 className="text-sm sm:text-base font-black text-foreground">Compare Neighborhood Forecasts</h3>
                <p className="text-[10px] text-muted">Select locations to overlay air quality metrics side-by-side</p>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="w-8 h-8 rounded-full border border-border hover:bg-muted/15 flex items-center justify-center text-muted hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Ward Selector Checklist */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted">Select Locations to Include:</span>
                <div className="flex gap-2 flex-wrap">
                  {wards.map((w) => {
                    const isChecked = comparedWardsList.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          if (isChecked) {
                            if (comparedWardsList.length > 1) {
                              setComparedWardsList(comparedWardsList.filter(id => id !== w.id));
                            }
                          } else {
                            setComparedWardsList([...comparedWardsList, w.id]);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                          isChecked 
                            ? "bg-primary/15 border-primary/30 text-primary" 
                            : "bg-muted/5 border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                        <span>{w.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-side Table */}
              <div className="border border-border rounded-xl overflow-x-auto w-full bg-muted/5">
                <table className="w-full border-collapse text-[11px] leading-normal text-foreground min-w-[500px]">
                  <thead>
                    <tr className="bg-card border-b border-border/85 text-muted font-bold">
                      <th className="px-4 py-2.5 text-left">Ward Name</th>
                      <th className="px-4 py-2.5 text-left">Live AQI</th>
                      <th className="px-4 py-2.5 text-left">Temperature</th>
                      <th className="px-4 py-2.5 text-left">Humidity</th>
                      <th className="px-4 py-2.5 text-left">Wind Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wards.filter(w => comparedWardsList.includes(w.id)).map((w) => {
                      const displayAqi = w.aqi;
                      const aqiColor = displayAqi > 150 ? "text-danger" : displayAqi > 100 ? "text-warning" : "text-success";
                      return (
                        <tr key={w.id} className="border-b border-border/40 last:border-0">
                          <td className="px-4 py-3 font-extrabold text-foreground">{w.name}</td>
                          <td className={`px-4 py-3 font-extrabold ${aqiColor}`}>{displayAqi}</td>
                          <td className="px-4 py-3 font-semibold">{formatTemp(w.temperature)}</td>
                          <td className="px-4 py-3 font-semibold">{w.humidity}%</td>
                          <td className="px-4 py-3 font-semibold">{formatWind(w.wind_speed)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Recharts AQI BarChart overlay */}
              <div className="flex flex-col gap-2.5 h-64 mt-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted">Comparative AQI Chart:</span>
                <div className="flex-1 w-full min-h-[200px]">
                  <BarResponsiveContainer width="100%" height="100%">
                    <BarChart data={
                      wards
                        .filter(w => comparedWardsList.includes(w.id))
                        .map(w => ({ name: w.name, AQI: w.aqi }))
                    }>
                      <BarCartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <BarXAxis dataKey="name" stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
                      <BarYAxis stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
                      <BarTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '10px', borderRadius: '8px' }} />
                      <Bar dataKey="AQI" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={28} />
                    </BarChart>
                  </BarResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
