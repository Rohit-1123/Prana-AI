import { AQI_BANDS, aqiPosition, mainPollutant } from "../../../utils/aqi";
import { useSettings } from "../../../contexts/SettingsContext";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Map as MapIcon, MessageSquare, RefreshCw, TrendingUp } from "lucide-react";
import { Area, AreaChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "../../../utils/cn";

interface Forecast {
  horizon_hours: number;
  predicted_aqi: number;
  confidence_score: number;
  trend: string;
}

interface WardLike {
  id: number;
  name: string;
  aqi: number;
  pm2_5: number;
  wind_speed: number;
  updated?: string;
  pm10: number;
  humidity: number;
  environmental_health_score: number;
}

interface CityBeacon {
  name: string;
  state: string;
  aqi: number;
  forecast: number;
}

interface DashboardHomeProps {
  t: (key: string) => string;
  ward: WardLike;
  forecast: Forecast[];
  predictedAqi: number;
  isSimulating: boolean;
  narrative: string;
  telemetryLabel: string;
  loading: boolean;
  sources: { source: string; percentage: number }[];
  cities: CityBeacon[];
  selectedCity: string;
  onSelectCity: (name: string) => void;
  wards: WardLike[];
  onSelectWard: (ward: WardLike) => void;
  nextAction?: { title: string; desc: string; impact: string };
  aqiCategory: (aqi: number) => string;
  aqiColor: (aqi: number) => string;
  onNavigate: (page: string) => void;
  notice?: ReactNode;
  briefings: ReactNode;
}

const glide = [0.22, 1, 0.36, 1] as const;

function Trend({ from, to }: { from: number; to: number }) {
  const d = to - from;
  if (Math.abs(d) < 3) return <ArrowRight className="w-3.5 h-3.5 text-muted" strokeWidth={1.6} />;
  return d > 0
    ? <ArrowUpRight className="w-3.5 h-3.5 text-warning" strokeWidth={1.6} />
    : <ArrowDownRight className="w-3.5 h-3.5 text-success" strokeWidth={1.6} />;
}

function HealthRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, score));
  return (
    <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="3" />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - v / 100) }}
        transition={{ duration: 1.1, ease: glide }}
      />
    </svg>
  );
}

export function DashboardHome(p: DashboardHomeProps) {
  const { t, ward, forecast } = p;
  const { formatWind } = useSettings();
  const [horizon, setHorizon] = useState(0); // 0 = now, 1..3 = forecast index + 1

  const points = [
    { key: t("nowLabel"), aqi: ward.aqi, sim: p.predictedAqi, conf: 1 },
    ...forecast.slice(0, 3).map((f) => ({
      key: `+${f.horizon_hours}h`,
      aqi: f.predicted_aqi,
      sim: Math.max(10, f.predicted_aqi - (ward.aqi - p.predictedAqi)),
      conf: f.confidence_score,
    })),
  ];
  const shown = points[horizon] ?? points[0];
  const sources = [...p.sources].sort((a, b) => b.percentage - a.percentage).slice(0, 4);
  const maxShare = Math.max(...sources.map((s) => s.percentage), 1);
  const ranking = [...p.wards].sort((a, b) => b.aqi - a.aqi).slice(0, 8);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {p.notice}

      {/* ---------- HERO ---------- */}
      <section className="grid grid-cols-12 gap-5 lg:gap-6">
        <div className="col-span-12 xl:col-span-7 flex flex-col justify-between gap-10 lg:min-h-[560px] pt-2 lg:pt-6">
          <div>
            <div className="flex items-center gap-2.5 eyebrow">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: p.aqiColor(shown.aqi) }} />
                <span className="relative w-2 h-2 rounded-full" style={{ background: p.aqiColor(shown.aqi) }} />
              </span>
              <span>{horizon === 0 ? t("aqiNow") : `${t("forecastFor")} · ${shown.key}`}</span>
              <span className="normal-case tracking-normal font-normal opacity-80 hidden sm:inline">· {p.telemetryLabel}</span>
              {p.loading && <RefreshCw className="w-3 h-3 animate-spin" aria-label="Updating" />}
            </div>

            <div className="mt-4 lg:mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={shown.aqi + shown.key}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: glide }}
                  className="display-metric text-[clamp(6.5rem,17vw,12.5rem)] text-foreground"
                >
                  {shown.aqi}
                </motion.span>
              </AnimatePresence>
              <div className="pb-3 lg:pb-6">
                <div className="text-3xl lg:text-4xl font-light tracking-tight" style={{ color: `color-mix(in oklab, ${p.aqiColor(shown.aqi)} 70%, var(--foreground))` }}>
                  {p.aqiCategory(shown.aqi)}
                </div>
                <div className="mt-1.5 text-sm text-muted tabular">
                  PM2.5 {ward.pm2_5} · PM10 {ward.pm10} µg/m³
                </div>
                <div className="mt-1 text-xs text-muted">
                  Main pollutant: {mainPollutant(ward.pm2_5, ward.pm10)}
                  {ward.updated && ` · Updated ${new Date(ward.updated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-foreground/75 line-clamp-4">{p.narrative}</p>

            {/* CPCB scale: equal-width bands with a marker at the value shown */}
            <div className="mt-6 max-w-xl" role="img" aria-label={`AQI ${shown.aqi} on the India CPCB scale, ${p.aqiCategory(shown.aqi)}`}>
              <div className="relative flex h-1.5 gap-0.5 rounded-full">
                {AQI_BANDS.map((b) => <span key={b.label} className="flex-1 first:rounded-l-full last:rounded-r-full" style={{ background: b.color }} />)}
                <span
                  className="absolute -top-1 w-0.5 h-3.5 rounded bg-foreground shadow"
                  style={{ left: `${aqiPosition(shown.aqi)}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted tabular">
                <span>Good</span><span>Moderate</span><span>Severe</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => p.onNavigate("copilot")} className="btn-primary h-11 px-6 text-sm cursor-pointer">
                <MessageSquare className="w-4 h-4" strokeWidth={1.8} /> {t("askCopilot")}
              </button>
              <button onClick={() => p.onNavigate("prediction")} className="btn-ghost h-11 px-5 text-sm cursor-pointer">
                <TrendingUp className="w-4 h-4" strokeWidth={1.6} /> {t("openForecast")}
              </button>
              <button onClick={() => p.onNavigate("map")} className="btn-ghost h-11 px-5 text-sm cursor-pointer hidden sm:inline-flex">
                <MapIcon className="w-4 h-4" strokeWidth={1.6} /> {t("openMap")}
              </button>
            </div>
          </div>

          {/* Horizon strip */}
          <div role="tablist" aria-label={t("outlookTitle")} className="glass rounded-[1.75rem] p-1.5 grid grid-cols-4">
            {points.map((pt, i) => {
              const active = i === horizon;
              return (
                <button
                  key={pt.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setHorizon(i)}
                  className={cn("relative rounded-[1.4rem] px-2 sm:px-4 py-3 sm:py-4 text-left cursor-pointer", active ? "text-foreground" : "text-muted hover:text-foreground")}
                >
                  {active && (
                    <motion.span layoutId="horizon-active" className="absolute inset-0 rounded-[1.4rem] bg-foreground/[0.08] border border-[var(--glass-border)]" transition={{ type: "spring", stiffness: 420, damping: 38 }} />
                  )}
                  <span className="relative flex items-center justify-between text-[11px] sm:text-xs font-medium">
                    {pt.key}
                    {i > 0 && <Trend from={points[i - 1].aqi} to={pt.aqi} />}
                  </span>
                  <span className="relative block mt-1.5 text-2xl sm:text-3xl font-light tracking-tight tabular">{pt.aqi}</span>
                  <span className="relative hidden sm:flex items-center gap-1.5 mt-1 text-[11px] text-muted">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.aqiColor(pt.aqi) }} />
                    {p.aqiCategory(pt.aqi)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating modules */}
        <div className="col-span-12 xl:col-span-5 grid grid-cols-2 gap-4 lg:gap-5 content-start">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: glide, delay: 0.05 }} className="glass-card lift col-span-2 p-5 lg:p-6">
            <div className="relative flex items-start justify-between">
              <div>
                <div className="eyebrow">{t("outlookTitle")}</div>
                <div className="mt-2 text-sm text-muted">
                  {p.isSimulating ? "Baseline vs. simulated policy" : `${ward.name} · peak ${Math.max(...points.map((x) => x.aqi))}`}
                </div>
              </div>
              <span className="text-xs text-muted tabular">{shown.key}</span>
            </div>
            <div className="relative h-36 mt-3 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={points} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="outlook-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="key" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} dy={6} />
                  <YAxis hide domain={["dataMin - 25", "dataMax + 25"]} />
                  <Tooltip
                    cursor={{ stroke: "var(--border)" }}
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, fontSize: 12, color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--muted)" }}
                  />
                  <Area type="monotone" dataKey="aqi" name="AQI" stroke="var(--primary)" strokeWidth={1.75} fill="url(#outlook-fill)" animationDuration={900} />
                  {p.isSimulating && (
                    <Area type="monotone" dataKey="sim" name="Simulated" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                  )}
                  <ReferenceDot x={shown.key} y={shown.aqi} r={5} fill="var(--primary)" stroke="var(--background)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: glide, delay: 0.12 }} className="glass-card lift col-span-2 sm:col-span-1 p-5 lg:p-6">
            <div className="relative eyebrow">{t("sourcesTitle")} <span className="normal-case tracking-normal text-warning/90">· indicative</span></div>
            <ul className="relative mt-4 flex flex-col gap-3.5">
              {sources.map((s, i) => (
                <li key={s.source}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className={i === 0 ? "text-foreground" : "text-foreground/80"}>{s.source}</span>
                    <span className="text-muted tabular text-xs">{s.percentage}%</span>
                  </div>
                  <div className="mt-1.5 h-[3px] rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))", opacity: 1 - i * 0.18 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.percentage / maxShare) * 100}%` }}
                      transition={{ duration: 0.9, ease: glide, delay: 0.15 + i * 0.06 }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: glide, delay: 0.18 }} className="glass-card lift col-span-2 sm:col-span-1 p-5 lg:p-6">
            <div className="relative eyebrow">{t("healthTitle")}</div>
            <div className="relative mt-2 flex items-center gap-3">
              <div className="relative">
                <HealthRing score={ward.environmental_health_score} />
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-extralight tabular">{ward.environmental_health_score}</span>
              </div>
              <dl className="text-xs flex flex-col gap-2 min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted">Humidity</dt><dd className="tabular">{Math.round(ward.humidity)}%</dd></div>
                <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted">Wind</dt><dd className="tabular">{formatWind(ward.wind_speed)}</dd></div>
                <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted">PM2.5</dt><dd className="tabular">{ward.pm2_5} µg/m³</dd></div>
              </dl>
            </div>
          </motion.div>

          {p.nextAction && ward.aqi > 100 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: glide, delay: 0.24 }} className="glass-card lift col-span-2 p-5 lg:p-6">
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow">{t("nextActionTitle")}</div>
                  <div className="mt-2.5 text-base font-medium">{p.nextAction.title}</div>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{p.nextAction.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-light text-success tabular">{p.nextAction.impact}</div>
                </div>
              </div>
              <button onClick={() => p.onNavigate("reports")} className="relative mt-4 btn-ghost h-9 px-4 text-xs cursor-pointer">
                {t("simulate")} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------- CITIES STRIP ---------- */}
      <section>
        <div className="eyebrow mb-3">{t("citiesTitle")}</div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 snap-x">
          {p.cities.map((c) => {
            const active = c.name === p.selectedCity;
            return (
              <button
                key={c.name}
                onClick={() => p.onSelectCity(c.name)}
                aria-pressed={active}
                className={cn(
                  "snap-start shrink-0 min-w-[10.5rem] sm:min-w-[12rem] text-left rounded-[1.5rem] px-5 py-4 border cursor-pointer lift",
                  active ? "bg-foreground/[0.1] border-[var(--glass-border)] shadow-glass" : "bg-foreground/[0.03] border-transparent hover:bg-foreground/[0.06]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.aqiColor(c.aqi) }} />
                </div>
                <div className="text-[11px] text-muted">{c.state}</div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-light tabular tracking-tight">{c.aqi}</span>
                  <span className="flex items-center gap-1 text-xs text-muted tabular pb-1">
                    <Trend from={c.aqi} to={c.forecast} /> {c.forecast}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- MAP + RANKING ---------- */}
      <section className="grid grid-cols-12 gap-5 lg:gap-6">
        <div className="glass-card col-span-12 xl:col-span-8 p-0 flex flex-col">
          <div className="relative flex flex-wrap items-center justify-between gap-3 px-5 lg:px-6 pt-5 pb-4">
            <div>
              <div className="eyebrow">{t("mapTitle")}</div>
              <div className="mt-1.5 text-sm text-muted">{ward.name} and surrounding wards</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="h-1 w-40 rounded-full" style={{ background: "linear-gradient(90deg,#10B981,#84CC16,#FBBF24,#F97316,#EF4444,#991B1B)" }} />
              <div className="w-40 flex justify-between text-[10px] text-muted tabular"><span>0</span><span>100</span><span>200</span><span>300</span><span>400+</span></div>
            </div>
          </div>
          <div className="relative mx-2 mb-2 rounded-[1.4rem] overflow-hidden h-[340px] sm:h-[420px]">
            <div id="mission-map-canvas" className="absolute inset-0" />
          </div>
        </div>

        <div className="glass-card col-span-12 xl:col-span-4 p-5 lg:p-6">
          <div className="relative eyebrow">Ward ranking · highest AQI</div>
          <ol className="relative mt-4 flex flex-col">
            {ranking.map((w, i) => (
              <li key={w.id}>
                <button
                  onClick={() => p.onSelectWard(w)}
                  className={cn(
                    "w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-left cursor-pointer hover:bg-foreground/[0.05]",
                    w.name === ward.name && "bg-foreground/[0.07]"
                  )}
                >
                  <span className="w-5 text-xs text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm truncate">{w.name}</span>
                  <span className="w-16 h-[3px] rounded-full bg-foreground/10 overflow-hidden hidden sm:block">
                    <span className="block h-full rounded-full" style={{ width: `${Math.min(100, (w.aqi / 300) * 100)}%`, background: p.aqiColor(w.aqi) }} />
                  </span>
                  <span className="w-10 text-right text-sm tabular">{w.aqi}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- BRIEFINGS ---------- */}
      <section className="flex flex-col gap-5 lg:gap-6">
        <div className="eyebrow">{t("insightsTitle")}</div>
        {p.briefings}
      </section>
    </div>
  );
}
