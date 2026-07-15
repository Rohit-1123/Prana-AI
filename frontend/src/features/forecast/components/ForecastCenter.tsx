import { useState, useEffect } from "react";
import { ForecastSummaryCard } from "./ForecastSummaryCard";
import { FilterPanel } from "./FilterPanel";
import { QuickActions } from "./QuickActions";
import { ForecastChart } from "./ForecastChart";
import { ConfidenceGauge } from "./ConfidenceGauge";
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

  // Timeline points data
  const timelinePoints = [
    { id: "now", label: "Now", hours: 0, aqiOffset: 0, tempOffset: 0 },
    { id: "6h", label: "6 Hours", hours: 6, aqiOffset: 4, tempOffset: -2 },
    { id: "12h", label: "12 Hours", hours: 12, aqiOffset: 8, tempOffset: -4 },
    { id: "24h", label: "24 Hours", hours: 24, aqiOffset: 12, tempOffset: 1 },
    { id: "48h", label: "48 Hours", hours: 48, aqiOffset: 18, tempOffset: 2 },
    { id: "72h", label: "72 Hours", hours: 72, aqiOffset: -8, tempOffset: -1 }
  ];

  const selectedPointId = "24h";
  const activePt = timelinePoints.find(p => p.id === selectedPointId) || timelinePoints[3];

  // Active base metrics
  const activeBaseAqi = selectedWard.aqi;
  const activeBaseTemp = selectedWard.temperature;

  // Visual summary offsets
  const currentAqi = activeBaseAqi;
  const forecast24Aqi = activeBaseAqi + 12;
  const forecast48Aqi = activeBaseAqi + 18;
  const forecast72Aqi = activeBaseAqi - 8;
  const currentHealthScore = selectedWard.environmental_health_score;

  // Timeline-dependent active values
  const activeTimelineAqi = activeBaseAqi + activePt.aqiOffset;
  const activeTimelineTemp = activeBaseTemp + activePt.tempOffset;

  // Mock hourly graph data for ForecastChart
  const mockHourlyData = Array.from({ length: 24 }, (_, hourIdx) => {
    const hourStr = `${(8 + hourIdx) % 24}:00`;
    const offset = Math.sin(hourIdx / 3) * 15;
    return {
      time: hourStr,
      aqi: Math.floor(activeTimelineAqi + offset),
      temp: Number((activeTimelineTemp + Math.sin(hourIdx / 4) * 3).toFixed(1)),
      humidity: Math.floor(selectedWard.humidity + Math.cos(hourIdx / 5) * 12),
      wind: Number((selectedWard.wind_speed + Math.sin(hourIdx / 3) * 1.5).toFixed(1))
    };
  });

  // Mock comparison chart data (Yesterday vs Today)
  const mockComparisonData = Array.from({ length: 12 }, (_, idx) => {
    const hourStr = `${idx * 2}:00`;
    const baseOffset = Math.sin(idx / 2) * 20;
    return {
      hour: hourStr,
      yesterday: Math.floor(activeBaseAqi * 0.9 + baseOffset),
      today: Math.floor(activeBaseAqi * 1.05 + baseOffset)
    };
  });

  // Mock Forecast Ledger Table Data
  const mockTableData = [
    { time: "Horizon Now", aqi: activeBaseAqi, temp: activeBaseTemp, humidity: selectedWard.humidity, wind: selectedWard.wind_speed, confidence: 98, trend: "stable" },
    { time: "Horizon +6h", aqi: activeBaseAqi + 4, temp: Number((activeBaseTemp - 2).toFixed(1)), humidity: selectedWard.humidity + 5, wind: selectedWard.wind_speed - 0.5, confidence: 96, trend: "rising" },
    { time: "Horizon +12h", aqi: activeBaseAqi + 8, temp: Number((activeBaseTemp - 4).toFixed(1)), humidity: selectedWard.humidity + 8, wind: selectedWard.wind_speed + 1.2, confidence: 95, trend: "rising" },
    { time: "Horizon +24h", aqi: activeBaseAqi + 12, temp: Number((activeBaseTemp + 1).toFixed(1)), humidity: selectedWard.humidity + 2, wind: selectedWard.wind_speed + 0.8, confidence: 93, trend: "rising" },
    { time: "Horizon +48h", aqi: activeBaseAqi + 18, temp: Number((activeBaseTemp + 2).toFixed(1)), humidity: selectedWard.humidity - 4, wind: selectedWard.wind_speed + 0.2, confidence: 91, trend: "rising" },
    { time: "Horizon +72h", aqi: activeBaseAqi - 8, temp: Number((activeBaseTemp - 1).toFixed(1)), humidity: selectedWard.humidity - 8, wind: selectedWard.wind_speed - 1.2, confidence: 88, trend: "falling" }
  ];

  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparedWardsList, setComparedWardsList] = useState<number[]>([selectedWard.id]);

  useEffect(() => {
    setComparedWardsList([selectedWard.id]);
  }, [selectedWard.id]);

  const handleExportData = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const csvHeader = "Horizon,Predicted AQI,Temperature,Humidity,Confidence\n";
      const csvRows = mockTableData.map(r => `${r.time},${r.aqi},${r.temp},${r.humidity},${r.confidence}%`).join("\n");
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prana-forecast-${selectedWard.name}.csv`;
      link.click();
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
            <p><strong>Focus Location:</strong> ${selectedWard.name}, Hyderabad IT Corridor</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Horizon</th>
                  <th>Predicted AQI</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Wind Speed</th>
                  <th>Prediction Confidence</th>
                </tr>
              </thead>
              <tbody>
                ${mockTableData.map(r => `
                  <tr>
                    <td>${r.time}</td>
                    <td><strong>${r.aqi}</strong></td>
                    <td>${formatTemp(r.temp)}</td>
                    <td>${r.humidity}%</td>
                    <td>${formatWind(r.wind)}</td>
                    <td>${r.confidence}%</td>
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
    <div className="flex flex-col gap-8 select-none">
      
      {/* Filters & Actions top row */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-foreground">
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

      {/* Summary Cards Grid */}
      {(() => {
        const factors24h = [
          { name: "Traffic Congestion", impact: 18, trend: "up" as const, explanation: "Commute hour heavy vehicle gridlock on Outer Ring Road junctions.", confidence: 94 },
          { name: "Low Wind Speed", impact: 11, trend: "up" as const, explanation: "Weak local winds limit horizontal transport and dispersion.", confidence: 95 },
          { name: "Construction Activity", impact: 9, trend: "up" as const, explanation: "Unmitigated demolition work in Financial District centroids.", confidence: 91 },
          { name: "High Temperature", impact: 6, trend: "up" as const, explanation: "Thermal boundary layer compression traps particulate loads.", confidence: 90 },
          { name: "Industrial Emissions", impact: 4, trend: "stable" as const, explanation: "Nominal factory stack emissions from outer periphery.", confidence: 92 }
        ];

        const factors48h = [
          { name: "Traffic Congestion", impact: 14, trend: "up" as const, explanation: "Commute peaks combined with localized detours.", confidence: 93 },
          { name: "Low Wind Speed", impact: 15, trend: "up" as const, explanation: "High atmospheric pressure systems create calm air blocks.", confidence: 94 },
          { name: "Construction Activity", impact: 12, trend: "up" as const, explanation: "Intense concrete mixing operations near Madhapur zones.", confidence: 89 },
          { name: "High Temperature", impact: 5, trend: "up" as const, explanation: "Moderate solar radiation intensifies secondary aerosol synthesis.", confidence: 88 },
          { name: "Industrial Emissions", impact: 6, trend: "up" as const, explanation: "Increased kiln emissions from industrial clusters.", confidence: 91 }
        ];

        const factors72h = [
          { name: "Traffic Congestion", impact: 9, trend: "down" as const, explanation: "Projected weekend drop in commercial vehicle commute count.", confidence: 91 },
          { name: "Low Wind Speed", impact: 8, trend: "down" as const, explanation: "Stronger western breeze triggers particulate dispersion relief.", confidence: 92 },
          { name: "Construction Activity", impact: 10, trend: "up" as const, explanation: "Active digging phases in Hitech City grid areas.", confidence: 88 },
          { name: "High Temperature", impact: 3, trend: "down" as const, explanation: "Minor temperature dip weakens thermal inversion boundaries.", confidence: 85 },
          { name: "Industrial Emissions", impact: 5, trend: "stable" as const, explanation: "Steady baseline output from manufacturing nodes.", confidence: 90 }
        ];

        return (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            <ForecastSummaryCard 
              title={activeLanguage === "hi" ? "वर्तमान एक्यूआई" : activeLanguage === "te" ? "ప్రస్తుత AQI" : activeLanguage === "ta" ? "தற்போதைய AQI" : activeLanguage === "kn" ? "ಪ್ರಸ್ತುತ AQI" : "Current AQI"} 
              value={currentAqi} 
              badgeText="Live" 
              colorClass="border-success/20 text-success bg-success/5" 
              subtitle="Live particulate sensor value" 
            />
            <ForecastSummaryCard 
              title={activeLanguage === "hi" ? "24 घंटे का पूर्वानुमान" : activeLanguage === "te" ? "24 గంటల అంచనా" : activeLanguage === "ta" ? "24 மணி நேர முன்னறிವಿப்பு" : activeLanguage === "kn" ? "24 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ" : "24 Hour Lead"} 
              value={forecast24Aqi} 
              trend={forecast24Aqi > currentAqi ? "up" : "down"} 
              subtitle="Predicted tomorrow aqi" 
              factors={factors24h} 
            />
            <ForecastSummaryCard 
              title={activeLanguage === "hi" ? "48 घंटे का पूर्वानुमान" : activeLanguage === "te" ? "48 గంటల అంచనా" : activeLanguage === "ta" ? "48 மணி நேர முன்னறிವಿப்பு" : activeLanguage === "kn" ? "48 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ" : "48 Hour Lead"} 
              value={forecast48Aqi} 
              trend={forecast48Aqi > currentAqi ? "up" : "down"} 
              subtitle="Mid range forecast trend" 
              factors={factors48h} 
            />
            <ForecastSummaryCard 
              title={activeLanguage === "hi" ? "72 घंटे का पूर्वानुमान" : activeLanguage === "te" ? "72 గంటల అంచనా" : activeLanguage === "ta" ? "72 மணி நேர முன்னறிவிப்பு" : activeLanguage === "kn" ? "72 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ" : "72 Hour Lead"} 
              value={forecast72Aqi} 
              trend={forecast72Aqi > currentAqi ? "up" : "down"} 
              subtitle="AI regression trend"
              factors={factors72h} 
            />
            <ForecastSummaryCard 
              title={activeLanguage === "hi" ? "पर्यावरण स्वास्थ्य" : activeLanguage === "te" ? "పర్యావరణ ఆరోగ్యం" : activeLanguage === "ta" ? "சுற்றுச்சூழல் சுகாதாரம்" : activeLanguage === "kn" ? "ಪರಿಸರ ಆರೋಗ್ಯ" : "Environmental Health"} 
              value={currentHealthScore} 
              badgeText="Good" 
              colorClass="border-primary/20 text-primary bg-primary/5" 
              subtitle="Weighted safety index scale" 
            />
                            <ForecastSummaryCard title="Prediction Confidence" value="93.4%" badgeText="High" colorClass="border-secondary/20 text-secondary bg-secondary/5" subtitle="AI validation score" />
          </div>
        );
      })()}

      {/* Main Charts & Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recharts interactive forecast area chart */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <ForecastChart 
            wardName={selectedWard.name}
            data={mockHourlyData}
          />

          <ComparisonChart 
            data={mockComparisonData}
          />
        </div>

        {/* Right: Confidence progress gauge list */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <ConfidenceGauge 
            overallConfidence={93}
            qualityScore={88}
            availability={96}
            reliability={91}
          />

          <AISummaryCard 
            overviewText={narrativeExplanation}
            keyTrends={[
              "Traffic-associated soot spikes at commute peaks.",
              "Sprinkling deployments cut construction particulate indices by 18%.",
              "Light local winds limit soot dispersion."
            ]}
            riskLevel={activeTimelineAqi > 150 ? "High" : "Medium"}
            attentionAreas={[
              "Gachibowli Ring Road Junctions",
              "Madhapur IT Corridor Bypass"
            ]}
          />
        </div>

      </div>

      {/* Details Ledger Table */}
      <ForecastTable 
        data={mockTableData}
      />

      {/* Compare Locations Modal Workflow */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
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
                      <th className="px-4 py-2.5 text-left">Confidence</th>
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
                          <td className="px-4 py-3 font-semibold text-muted">93%</td>
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
