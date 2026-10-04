import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart3, Bell, TrendingUp } from "lucide-react";
import { useSeries } from "../../forecast/useSeries";
import { aqiLabel } from "../../../utils/aqi";

interface BottomAnalyticsProps {
  ward: any;
}

const hourLabel = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString([], { weekday: "short" })} ${String(d.getHours()).padStart(2, "0")}:00`;
};

export function BottomAnalytics({ ward }: BottomAnalyticsProps) {
  const { series, state } = useSeries(ward.latitude, ward.longitude);
  const nowIdx = series.findIndex((r) => r.is_forecast) - 1;
  const data = series.map((r) => ({ name: hourLabel(r.t), aqi: r.aqi }));

  // Notes computed from the numbers, not canned alerts
  const ahead = series.slice(nowIdx + 1, nowIdx + 49);
  const notes: { title: string; desc: string }[] = [];
  if (ahead.length) {
    const peak = ahead.reduce((a, b) => (b.aqi > a.aqi ? b : a));
    const best = ahead.reduce((a, b) => (b.aqi < a.aqi ? b : a));
    const avgWind = ahead.reduce((a, r) => a + (r.wind_speed ?? 0), 0) / ahead.length;
    if (peak.aqi > 100) notes.push({ title: `${aqiLabel(peak.aqi)} air expected`, desc: `AQI may reach ${peak.aqi} around ${hourLabel(peak.t)}.` });
    if (avgWind < 2.5) notes.push({ title: "Calm winds", desc: `Average wind over the next 48 hours is ${avgWind.toFixed(1)} m/s, so pollution disperses slowly.` });
    if (best.aqi < ward.aqi - 10) notes.push({ title: "Cleaner window ahead", desc: `AQI should fall to about ${best.aqi} around ${hourLabel(best.t)}.` });
    if (!notes.length) notes.push({ title: "No concerns", desc: `Air quality is expected to stay ${aqiLabel(peak.aqi)} (AQI ${peak.aqi} at most) for the next 48 hours.` });
  }

  return (
    <div className="glass-card p-6 flex flex-col gap-5 w-full shadow-theme">
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <span className="font-extrabold text-xs sm:text-sm text-foreground">
            AQI timeline: <strong className="text-primary">{ward.name}</strong>
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-muted">Last 24h + next 72h</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 flex flex-col gap-3 h-full overflow-hidden">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> Hourly AQI (24h average, CPCB)
          </span>
          <div className="w-full h-44 mt-2">
            {state === "error" ? (
              <p className="text-xs text-warning">Hourly data is temporarily unavailable.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAqiTwin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} interval={11} />
                  <YAxis stroke="var(--muted)" fontSize={9} axisLine={false} tickLine={false} />
                  <ChartTooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", fontSize: "10px", borderRadius: "8px" }} />
                  {nowIdx >= 0 && <ReferenceLine x={data[nowIdx]?.name} stroke="var(--muted)" strokeDasharray="3 3" label={{ value: "now", fill: "var(--muted)", fontSize: 9, position: "top" }} />}
                  <Area type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAqiTwin)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-3 h-full overflow-hidden border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-primary" /> Outlook notes
          </span>
          <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow max-h-[176px] pr-1 mt-2">
            {notes.map((n) => (
              <div key={n.title} className="bg-muted/5 border border-border p-3 rounded-xl flex flex-col gap-1 text-xs">
                <span className="text-foreground font-bold">{n.title}</span>
                <p className="text-muted text-[10.5px] leading-relaxed">{n.desc}</p>
              </div>
            ))}
            {!notes.length && state === "loading" && <p className="text-xs text-muted">Loading…</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
