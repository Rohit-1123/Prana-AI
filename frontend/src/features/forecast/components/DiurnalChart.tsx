import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";

interface DiurnalChartProps {
  wardName: string;
}

export function DiurnalChart({ wardName }: DiurnalChartProps) {
  const [showAqi, setShowAqi] = useState(true);
  const [showPm25, setShowPm25] = useState(true);
  const [showPm10, setShowPm10] = useState(true);

  const mockDiurnalData = [
    { time: "8:00", aqi: 180, pm10: 110, pm25: 78 },
    { time: "9:00", aqi: 190, pm10: 115, pm25: 83 },
    { time: "10:00", aqi: 195, pm10: 120, pm25: 85 },
    { time: "11:00", aqi: 198, pm10: 122, pm25: 86 },
    { time: "12:00", aqi: 197, pm10: 120, pm25: 85 },
    { time: "13:00", aqi: 193, pm10: 118, pm25: 82 },
    { time: "14:00", aqi: 185, pm10: 112, pm25: 77 },
    { time: "15:00", aqi: 178, pm10: 105, pm25: 72 },
    { time: "16:00", aqi: 170, pm10: 98, pm25: 70 },
    { time: "17:00", aqi: 168, pm10: 97, pm25: 69 },
    { time: "18:00", aqi: 167, pm10: 98, pm25: 70 },
    { time: "19:00", aqi: 171, pm10: 101, pm25: 72 }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 w-full shadow-theme select-none">
      
      {/* Title Header with Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-foreground">Diurnal Pollutant Timelines: <strong className="text-primary">{wardName}</strong></h3>
          <p className="text-[10px] text-muted mt-1">Toggle data lines below to customize the active series evaluation</p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowAqi(!showAqi)}
            className={`px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
              showAqi 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-muted/5 border-border text-muted"
            }`}
          >
            AQI VALUE
          </button>
          <button
            onClick={() => setShowPm25(!showPm25)}
            className={`px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
              showPm25 
                ? "bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]" 
                : "bg-muted/5 border-border text-muted"
            }`}
          >
            PM2.5 COUNT
          </button>
          <button
            onClick={() => setShowPm10(!showPm10)}
            className={`px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
              showPm10 
                ? "bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]" 
                : "bg-muted/5 border-border text-muted"
            }`}
          >
            PM10 COUNT
          </button>
        </div>
      </div>

      {/* Legend Indicator list */}
      <div className="flex gap-4 justify-start text-[10px] font-bold text-muted">
        {showAqi && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary block"></span>
            <span>Overall AQI</span>
          </div>
        )}
        {showPm10 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] block"></span>
            <span>PM10 (µg/m³)</span>
          </div>
        )}
        {showPm25 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] block"></span>
            <span>PM2.5 (µg/m³)</span>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockDiurnalData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqiDiurnal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPm10Diurnal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPm25Diurnal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} domain={[0, 200]} />
            <ChartTooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '10px', borderRadius: '8px' }} />
            
            {showAqi && (
              <Area 
                type="monotone" 
                dataKey="aqi" 
                stroke="var(--primary)" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorAqiDiurnal)" 
              />
            )}
            {showPm10 && (
              <Area 
                type="monotone" 
                dataKey="pm10" 
                stroke="#38BDF8" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorPm10Diurnal)" 
              />
            )}
            {showPm25 && (
              <Area 
                type="monotone" 
                dataKey="pm25" 
                stroke="#00E5FF" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorPm25Diurnal)" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
