import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { BrandMark } from "../../components/shell/AppShell";
import { cn } from "../../utils/cn";

interface WardLike { id: number; name: string; aqi: number; pm2_5: number; pm10: number }
interface Forecast { horizon_hours: number; predicted_aqi: number; confidence_score: number }

interface LandingPageProps {
  ward: WardLike;
  wards: WardLike[];
  forecast: Forecast[];
  locationLabel: string;
  telemetryLabel: string;
  aqiCategory: (aqi: number) => string;
  aqiColor: (aqi: number) => string;
  onLaunch: (target: "dashboard" | "map") => void;
}

const glide = [0.22, 1, 0.36, 1] as const;

const TAGLINES = [
  "Real-time air quality intelligence",
  "AI-powered 72-hour forecasting",
  "A digital twin of the city's air",
  "Explainable pollution attribution",
  "Policy simulation before deployment",
];

const WEEK = [
  { d: "Mon", aqi: 120 }, { d: "Tue", aqi: 145 }, { d: "Wed", aqi: 182 }, { d: "Thu", aqi: 198 },
  { d: "Fri", aqi: 168 }, { d: "Sat", aqi: 125 }, { d: "Sun", aqi: 110 },
];

const ACTIONS = [
  { title: "Restrict heavy vehicles", desc: "Divert diesel transport from junctions during commute peaks.", impact: "-22" },
  { title: "Water sprinkling", desc: "Deploy sprinklers across active construction corridors.", impact: "-18" },
  { title: "Electric transit boost", desc: "Increase e-bus frequency near IT clusters.", impact: "-12" },
];

export function LandingPage(p: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [tagline, setTagline] = useState(0);
  const [stage, setStage] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setTagline((i) => (i + 1) % TAGLINES.length), 3800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setStage((s) => (s + 1) % 4), 7000);
    return () => clearInterval(id);
  }, [autoplay]);

  const stages = [
    { n: "01", title: "Monitor", lead: "Monitor urban air loads instantly.", body: "Continuous readings compile particulates and dispersion conditions, resolved down to each ward." },
    { n: "02", title: "Predict", lead: "Predict spikes before they arrive.", body: "Gradient-boosted models forecast ward-level AQI 24, 48 and 72 hours ahead with confidence bands." },
    { n: "03", title: "Explain", lead: "Isolate what is driving pollution.", body: "Attribution separates traffic, construction, industry and dust so every number has a cause." },
    { n: "04", title: "Act", lead: "Simulate policy before deploying it.", body: "Sandbox interventions, compare expected impact and transmit directives to municipal teams." },
  ];
  const peak = [...p.wards].sort((a, b) => b.aqi - a.aqi)[0];

  return (
    <div className="relative min-h-dvh text-foreground">
      {/* Floating nav */}
      <div className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 z-50 flex justify-center">
        <nav className={cn("w-full max-w-6xl flex items-center justify-between rounded-full pl-3 pr-2 py-2 transition-all duration-500", scrolled ? "glass-strong" : "bg-transparent border border-transparent")}>
          <div className="flex items-center gap-2.5">
            <BrandMark className="w-9 h-9" />
            <span className="text-lg font-medium tracking-tight">PranaAI</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm text-muted">
            {stages.map((s, i) => (
              <a key={s.n} href="#how" onClick={() => { setStage(i); setAutoplay(false); }} className="px-4 py-2 rounded-full hover:text-foreground hover:bg-foreground/[0.06]">
                {s.title}
              </a>
            ))}
          </div>
          <button onClick={() => p.onLaunch("dashboard")} className="btn-primary h-10 px-5 text-sm cursor-pointer">
            Launch Mission Control
          </button>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative min-h-dvh max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-16 grid grid-cols-12 gap-y-14 lg:gap-x-10 items-center">
        <div className="col-span-12 lg:col-span-7 min-w-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: glide }} className="inline-flex max-w-full items-center gap-2.5 glass rounded-full pl-3 pr-4 py-1.5 text-xs text-muted">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.aqiColor(p.ward.aqi) }} />
            <span className="truncate">Live · {p.ward.name}, {p.locationLabel} · AQI {p.ward.aqi}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: glide, delay: 0.05 }}
            className="mt-7 text-[clamp(2.9rem,7.2vw,6.25rem)] leading-[0.95] font-extralight tracking-[-0.045em]"
          >
            Environmental intelligence,
            <span className="block text-foreground/55">reimagined.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: glide, delay: 0.12 }} className="mt-7 max-w-lg text-base sm:text-lg leading-relaxed text-foreground/70">
            PranaAI predicts, explains and helps cities act on urban air pollution — from live ward readings to policy simulation.
          </motion.p>

          <div className="mt-5 h-6 text-sm text-primary overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span key={tagline} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35 }}>
                {TAGLINES[tagline]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => p.onLaunch("dashboard")} className="btn-primary h-12 px-7 text-sm cursor-pointer">
              Launch Mission Control <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => p.onLaunch("map")} className="btn-ghost h-12 px-7 text-sm cursor-pointer">
              <MapIcon className="w-4 h-4" strokeWidth={1.6} /> View Live Environmental Map
            </button>
          </div>
        </div>

        {/* Live window */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: glide, delay: 0.2 }} className="col-span-12 lg:col-span-5 relative min-w-0">
          <div className="glass-strong rounded-[2.25rem] p-6 sm:p-7 relative">
            <div className="eyebrow">Air quality index · {p.ward.name}</div>
            <div className="mt-3 flex items-end gap-4">
              <span className="display-metric text-[clamp(5.5rem,12vw,8.5rem)]">{p.ward.aqi}</span>
              <div className="pb-3">
                <div className="text-2xl font-light" style={{ color: `color-mix(in oklab, ${p.aqiColor(p.ward.aqi)} 70%, var(--foreground))` }}>{p.aqiCategory(p.ward.aqi)}</div>
                <div className="text-xs text-muted mt-1 tabular">PM2.5 {p.ward.pm2_5} µg/m³</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {p.forecast.slice(0, 3).map((f) => (
                <div key={f.horizon_hours} className="rounded-2xl bg-foreground/[0.05] px-3 py-3">
                  <div className="text-[11px] text-muted">+{f.horizon_hours}h</div>
                  <div className="mt-1 text-xl font-light tabular">{f.predicted_aqi}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-muted">{p.telemetryLabel}</div>
          </div>
          {peak && (
            <div className="hidden sm:flex glass-strong rounded-3xl px-5 py-4 absolute -bottom-10 right-6 items-center gap-4 animate-float">
              <span className="w-2 h-2 rounded-full" style={{ background: p.aqiColor(peak.aqi) }} />
              <div>
                <div className="text-[11px] text-muted">Highest ward</div>
                <div className="text-sm">{peak.name} · <span className="tabular">{peak.aqi}</span></div>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* How it works: stage strip + live preview */}
      <section id="how" className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 scroll-mt-24">
        <div className="glass rounded-[1.75rem] p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1">
          {stages.map((s, i) => (
            <button
              key={s.n}
              onClick={() => { setStage(i); setAutoplay(false); }}
              aria-pressed={stage === i}
              className={cn("relative text-left rounded-[1.4rem] px-5 py-4 cursor-pointer", stage === i ? "text-foreground" : "text-muted hover:text-foreground")}
            >
              {stage === i && <motion.span layoutId="stage-active" className="absolute inset-0 rounded-[1.4rem] bg-foreground/[0.08] border border-[var(--glass-border)]" transition={{ type: "spring", stiffness: 380, damping: 36 }} />}
              <span className="relative block text-[11px] tabular text-muted">{s.n}</span>
              <span className="relative block mt-1 text-lg font-light">{s.title}</span>
              {stage === i && autoplay && (
                <motion.span key={`bar-${i}`} className="absolute left-5 right-5 bottom-2 h-px bg-primary origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7, ease: "linear" }} />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6 items-stretch">
          <AnimatePresence mode="wait">
            <motion.div key={`text-${stage}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: glide }} className="col-span-12 lg:col-span-5 flex flex-col justify-center py-4">
              <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight leading-tight">{stages[stage].lead}</h2>
              <p className="mt-4 text-foreground/70 leading-relaxed">{stages[stage].body}</p>
            </motion.div>
          </AnimatePresence>

          <div className="col-span-12 lg:col-span-7 glass-card p-6 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div key={`panel-${stage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative h-full">
                {stage === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {p.wards.slice(0, 4).map((w) => (
                      <div key={w.id} className="rounded-2xl bg-foreground/[0.04] px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm">{w.name}</div>
                          <div className="text-xs text-muted mt-0.5 tabular">PM2.5 {w.pm2_5} µg/m³</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-light tabular">{w.aqi}</div>
                          <div className="text-[11px]" style={{ color: `color-mix(in oklab, ${p.aqiColor(w.aqi)} 70%, var(--foreground))` }}>{p.aqiCategory(w.aqi)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {stage === 1 && (
                  <div className="flex flex-col gap-3">
                    {p.forecast.slice(0, 3).map((f) => (
                      <div key={f.horizon_hours} className="rounded-2xl bg-foreground/[0.04] px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm">+{f.horizon_hours} hour horizon</div>
                          <div className="text-xs text-muted mt-0.5">{Math.round(f.confidence_score * 100)}% confidence</div>
                        </div>
                        <div className="text-2xl font-light tabular">{f.predicted_aqi}</div>
                      </div>
                    ))}
                  </div>
                )}
                {stage === 2 && (
                  <div className="h-[250px]">
                    <div className="eyebrow mb-2">Weekly AQI · {p.ward.name}</div>
                    <ResponsiveContainer width="100%" height="90%">
                      <AreaChart data={WEEK} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="landing-week" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                        <Area type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={1.75} fill="url(#landing-week)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {stage === 3 && (
                  <div className="flex flex-col gap-3">
                    {ACTIONS.map((a) => (
                      <div key={a.title} className="rounded-2xl bg-foreground/[0.04] px-5 py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm">{a.title}</div>
                          <div className="text-xs text-muted mt-0.5">{a.desc}</div>
                        </div>
                        <div className="text-2xl font-light text-success tabular shrink-0">{a.impact}</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <div className="glass-strong rounded-[2.5rem] px-6 sm:px-12 py-14 sm:py-20 text-center">
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extralight tracking-tight leading-tight max-w-3xl mx-auto">
            Explore your city's environmental intelligence.
          </h2>
          <p className="mt-5 text-foreground/70 max-w-lg mx-auto">Forecasts, attribution, a live city twin and an AI copilot — no sign-in required.</p>
          <button onClick={() => p.onLaunch("dashboard")} className="btn-primary h-12 px-8 text-sm mt-9 cursor-pointer">
            Launch Mission Control <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <footer className="mt-10 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted">
          <span>
            © 2026 PranaAI · <a href="#/privacy" className="hover:text-foreground underline-offset-2 hover:underline">Privacy</a> ·{" "}
            <a href="#/security" className="hover:text-foreground underline-offset-2 hover:underline">Security</a>
          </span>
          <span>{p.wards.length} wards monitored · {p.locationLabel}</span>
        </footer>
      </section>
    </div>
  );
}
