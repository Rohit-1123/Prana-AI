import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Bell, TrendingUp } from "lucide-react";

interface BottomAnalyticsProps {
  ward: any;
}

export function BottomAnalytics({ ward }: BottomAnalyticsProps) {
  const mockTimelineData = [
    { name: "Mon", aqi: Math.floor(ward.aqi * 0.95), temp: ward.temperature - 1 },
    { name: "Tue", aqi: Math.floor(ward.aqi * 1.02), temp: ward.temperature },
    { name: "Wed", aqi: Math.floor(ward.aqi * 0.98), temp: ward.temperature + 0.5 },
    { name: "Thu", aqi: Math.floor(ward.aqi * 1.05), temp: ward.temperature + 1 },
    { name: "Fri", aqi: Math.floor(ward.aqi * 1.08), temp: ward.temperature },
    { name: "Sat", aqi: Math.floor(ward.aqi * 1.05), temp: ward.temperature - 0.5 },
    { name: "Sun", aqi: ward.aqi, temp: ward.temperature }
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-5 w-full shadow-theme select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <span className="font-extrabold text-xs sm:text-sm text-foreground">
            Neighborhood Environmental Analytics & Alerts Timeline: <strong className="text-primary">{ward.name}</strong>
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-muted">7-Day Analysis</span>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Pollutant Trend Chart */}
        <div className="md:col-span-8 flex flex-col gap-3 h-full overflow-hidden">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted block flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> 7-Day Particulate Load Trend (AQI)
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
            <Bell className="w-4 h-4 text-primary" /> Active Neighborhood Alerts
          </span>
          <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow max-h-[176px] pr-1 mt-2">
            {[
              { title: "Traffic Soot Alert", desc: "Diesel congestion elevated PM2.5 levels.", time: "1 hr ago" },
              { title: "Calm Wind Conditions", desc: "Dispersion values limited due to light winds.", time: "4 hrs ago" },
              { title: "Construction Dust Warning", desc: "Local building sites particulate drift warning.", time: "1 day ago" }
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
