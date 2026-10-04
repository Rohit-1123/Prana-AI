import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Globe, Moon, Search, Sun, X, MoreHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../../utils/i18n";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** shown in the mobile bottom bar; the rest go into the "More" sheet */
  primary?: boolean;
}

export function BrandMark({ className }: { className?: string }) {
  return <img src="/icon-192.png" alt="PranaAI" width={192} height={192} className={cn("object-contain", className)} />;
}

/** Isolated so the per-tick re-render stays inside this tiny component. */
export function LiveClock({ timezone }: { timezone: "IST" | "UTC" }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const tz = timezone === "UTC" ? "UTC" : "Asia/Kolkata";
  const day = now.toLocaleDateString([], { weekday: "long", timeZone: tz });
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: tz });
  return (
    <span className="tabular">
      {day} · {time} {timezone}
    </span>
  );
}

export function greetingKey(timezone: "IST" | "UTC") {
  const hour = Number(
    new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: timezone === "UTC" ? "UTC" : "Asia/Kolkata" })
  );
  return hour < 12 ? "greetMorning" : hour < 17 ? "greetAfternoon" : "greetEvening";
}

interface WardOption {
  id: number;
  name: string;
  aqi: number;
}

export function WardSearch({
  wards,
  onSelect,
  placeholder,
  autoFocus,
  className,
}: {
  wards: WardOption[];
  onSelect: (w: WardOption) => void;
  placeholder: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const matches = q.trim() ? wards.filter((w) => w.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8) : [];

  const choose = (w: WardOption) => {
    onSelect(w);
    setQ("");
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        role="combobox"
        aria-expanded={open && matches.length > 0}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setCursor(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, matches.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
          if (e.key === "Enter" && matches[cursor]) choose(matches[cursor]);
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full h-11 rounded-full glass pl-11 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50"
      />
      <AnimatePresence>
        {open && q.trim() && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            role="listbox"
            className="absolute left-0 right-0 top-13 z-50 rounded-3xl bg-card border border-border shadow-lg p-1.5 backdrop-blur-2xl"
          >
            {matches.length === 0 && <li className="px-4 py-3 text-sm text-muted">No matching wards</li>}
            {matches.map((w, i) => (
              <li key={w.id} role="option" aria-selected={i === cursor}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(w)}
                  onMouseEnter={() => setCursor(i)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm text-left cursor-pointer",
                    i === cursor ? "bg-foreground/[0.07]" : ""
                  )}
                >
                  <span>{w.name}</span>
                  <span className="text-xs text-muted tabular">AQI {w.aqi}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LanguageMenu({ language, onChange, align = "right", drop = "down" }: { language: LanguageCode; onChange: (l: LanguageCode) => void; align?: "left" | "right"; drop?: "down" | "up" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="icon-btn w-auto px-3.5 gap-2 text-xs font-medium" aria-label="Language" aria-expanded={open}>
        <Globe className="w-4 h-4" strokeWidth={1.6} />
        <span className="hidden xl:inline">{current?.nativeName}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn("absolute z-50 w-44", drop === "up" ? "bottom-12" : "top-12", " rounded-3xl bg-card border border-border shadow-lg p-1.5 backdrop-blur-2xl", align === "right" ? "right-0" : "left-0")}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm cursor-pointer hover:bg-foreground/[0.06]",
                  language === l.code && "text-primary"
                )}
              >
                <span>{l.nativeName}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted">{l.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavRail({ items, active, onNavigate }: { items: NavItem[]; active: string; onNavigate: (id: string) => void }) {
  return (
    <nav aria-label="Primary" className="hidden lg:flex flex-col items-center gap-1 glass rounded-full w-[84px] py-5 my-6 ml-5 shrink-0 self-start sticky top-6">
      <BrandMark className="w-10 h-10 mb-5" />
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            data-nav={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex flex-col items-center gap-1 w-[68px] py-2.5 rounded-[1.4rem] cursor-pointer",
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="rail-active"
                className="absolute inset-0 rounded-[1.4rem] bg-foreground/[0.09] border"
                style={{ borderColor: "var(--glass-border)" }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <item.icon className="relative w-[19px] h-[19px]" strokeWidth={isActive ? 1.9 : 1.5} />
            <span className="relative text-[10px] leading-none font-medium tracking-wide truncate max-w-[60px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function MobileNav({
  items,
  active,
  onNavigate,
  moreLabel,
  moreExtras,
}: {
  items: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  moreLabel: string;
  moreExtras?: ReactNode;
}) {
  const [sheet, setSheet] = useState(false);
  const primary = items.filter((i) => i.primary);
  const secondary = items.filter((i) => !i.primary);
  const secondaryActive = secondary.some((i) => i.id === active);

  return (
    <>
      <nav aria-label="Primary" className="lg:hidden fixed bottom-3 inset-x-3 z-40 glass-strong rounded-full h-16 px-2 flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
        {primary.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              data-nav={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={cn("relative flex flex-col items-center justify-center gap-1 h-12 w-12 rounded-full cursor-pointer", isActive ? "text-foreground" : "text-muted")}
            >
              {isActive && (
                <motion.span layoutId="mobile-active" className="absolute inset-0 rounded-full bg-foreground/[0.1]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
              )}
              <item.icon className="relative w-5 h-5" strokeWidth={isActive ? 1.9 : 1.5} />
            </button>
          );
        })}
        <button
          onClick={() => setSheet(true)}
          aria-label={moreLabel}
          className={cn("relative flex items-center justify-center h-12 w-12 rounded-full cursor-pointer", secondaryActive ? "text-foreground bg-foreground/[0.1]" : "text-muted")}
        >
          <MoreHorizontal className="w-5 h-5" strokeWidth={1.6} />
        </button>
      </nav>

      <AnimatePresence>
        {sheet && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div className="absolute inset-0 bg-[#020814]/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute bottom-0 inset-x-0 rounded-t-[2rem] bg-card border-t border-border p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow">{moreLabel}</span>
                <button onClick={() => setSheet(false)} className="icon-btn w-9 h-9" aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              {secondary.map((item) => (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => { onNavigate(item.id); setSheet(false); }}
                  className={cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base cursor-pointer", active === item.id ? "bg-foreground/[0.08] text-foreground" : "text-foreground/90 hover:bg-foreground/[0.05]")}
                >
                  <item.icon className="w-5 h-5 text-muted" strokeWidth={1.6} />
                  {item.label}
                </button>
              ))}
              {moreExtras && <div className="mt-3 pt-4 border-t border-border flex items-center gap-3">{moreExtras}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface AppShellProps {
  items: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  eyebrow: ReactNode;
  title: ReactNode;
  search: ReactNode;
  language: LanguageCode;
  onLanguageChange: (l: LanguageCode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  hasUnread: boolean;
  onOpenNotifications: () => void;
  moreLabel: string;
  children: ReactNode;
}

export function AppShell({
  items,
  active,
  onNavigate,
  eyebrow,
  title,
  search,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  hasUnread,
  onOpenNotifications,
  moreLabel,
  children,
}: AppShellProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const [mobileSearch, setMobileSearch] = useState(false);

  // new page starts at the top
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [active]);

  const themeButton = (
    <button onClick={onToggleTheme} className="icon-btn" aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}>
      {isDark ? <Sun className="w-4 h-4" strokeWidth={1.6} /> : <Moon className="w-4 h-4" strokeWidth={1.6} />}
    </button>
  );

  return (
    <div className="relative z-10 h-dvh p-2 sm:p-4 lg:p-6 flex">
      <div className="app-frame relative flex-1 flex min-w-0 rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.75rem] overflow-hidden">
        <NavRail items={items} active={active} onNavigate={onNavigate} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 lg:pt-7 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <BrandMark className="w-9 h-9 lg:hidden shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted truncate">{eyebrow}</div>
                <div className="text-base sm:text-lg font-medium tracking-tight truncate">{title}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:block w-56 xl:w-72">{search}</div>
              <button onClick={() => setMobileSearch((s) => !s)} className="icon-btn md:hidden" aria-label="Search">
                {mobileSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" strokeWidth={1.6} />}
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <LanguageMenu language={language} onChange={onLanguageChange} />
                {themeButton}
              </div>
              <button onClick={onOpenNotifications} className="icon-btn relative" aria-label="Notifications">
                <Bell className="w-4 h-4" strokeWidth={1.6} />
                {hasUnread && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-danger" />}
              </button>
            </div>
          </header>

          <AnimatePresence initial={false}>
            {mobileSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden px-4 sm:px-6 pb-3 relative z-30"
                onClick={(e) => { if ((e.target as HTMLElement).closest("button")) setMobileSearch(false); }}
              >
                {search}
              </motion.div>
            )}
          </AnimatePresence>

          <main ref={scrollRef} data-scroll-root className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-2 pb-28 lg:pb-10">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      <MobileNav
        items={items}
        active={active}
        onNavigate={onNavigate}
        moreLabel={moreLabel}
        moreExtras={
          <>
            <LanguageMenu language={language} onChange={onLanguageChange} align="left" drop="up" />
            {themeButton}
          </>
        }
      />
    </div>
  );
}
