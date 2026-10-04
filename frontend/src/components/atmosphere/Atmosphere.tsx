import { memo, useEffect, useMemo, useRef } from "react";

/**
 * Immersive city atmosphere behind the whole product.
 * The scene is data-driven: sky tint, haze density and suspended particulates
 * all follow the selected ward's AQI (CPCB bands), so the environment itself
 * communicates air quality before any number is read.
 */

type Band = 0 | 1 | 2 | 3 | 4 | 5;

const bandOf = (aqi: number): Band =>
  aqi <= 50 ? 0 : aqi <= 100 ? 1 : aqi <= 200 ? 2 : aqi <= 300 ? 3 : aqi <= 400 ? 4 : 5;

// [skyTop, skyMid, horizon, bloom]
const DARK: Record<Band, [string, string, string, string]> = {
  0: ["#06101f", "#0e2746", "#2f7393", "#7fd3e6"],
  1: ["#07121f", "#102847", "#3d6c88", "#93c4e6"],
  2: ["#08121f", "#162a45", "#5f6f86", "#b3c0d4"],
  3: ["#0b111d", "#242838", "#7e6656", "#e0b48a"],
  4: ["#0d0f19", "#2c2433", "#8f5a4b", "#e79f80"],
  5: ["#0f0c14", "#33202b", "#975043", "#ef8e74"],
};
const LIGHT: Record<Band, [string, string, string, string]> = {
  0: ["#7fb0d8", "#bdd8ee", "#eaf4fa", "#ffffff"],
  1: ["#8fb4d4", "#c4d9ea", "#ebf1f5", "#ffffff"],
  2: ["#a2b6c8", "#cdd8e2", "#e9e8e2", "#fffaf0"],
  3: ["#b0b2b6", "#d6d0c6", "#ebdfcd", "#fff1dc"],
  4: ["#b3a8a5", "#d7c6bb", "#e9d4c2", "#ffe6d2"],
  5: ["#b5a19d", "#d6bdb2", "#e6c8b6", "#ffdcc8"],
};
const HAZE: Record<Band, number> = { 0: 0.12, 1: 0.22, 2: 0.36, 3: 0.5, 4: 0.62, 5: 0.74 };

// Deterministic PRNG so the skyline is stable between renders
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; spire: boolean };
type Win = { x: number; y: number };

function buildLayer(seed: number, minH: number, maxH: number, minW: number, maxW: number) {
  const rnd = mulberry32(seed);
  const buildings: Building[] = [];
  let x = -20;
  while (x < 1620) {
    const w = minW + rnd() * (maxW - minW);
    const tall = rnd() > 0.86;
    const h = minH + rnd() * (maxH - minH) * (tall ? 1.35 : 1);
    buildings.push({ x, w, h, spire: tall && rnd() > 0.4 });
    x += w + (rnd() > 0.7 ? rnd() * 10 : 1);
  }
  return buildings;
}

function windowsFor(buildings: Building[], seed: number): Win[] {
  const rnd = mulberry32(seed);
  const wins: Win[] = [];
  for (const b of buildings) {
    for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += 7) {
      for (let wy = 400 - b.h + 10; wy < 392; wy += 11) {
        if (rnd() > 0.955) wins.push({ x: wx, y: wy });
      }
    }
  }
  return wins.slice(0, 260);
}

const Skyline = memo(function Skyline({ lit }: { lit: boolean }) {
  const layers = useMemo(
    () => [
      buildLayer(7, 120, 230, 26, 70),
      buildLayer(19, 80, 190, 34, 90),
      buildLayer(31, 30, 105, 46, 120),
    ],
    []
  );
  const windows = useMemo(() => windowsFor(layers[2], 53), [layers]);

  const path = (bs: Building[]) =>
    bs
      .map((b) => {
        const top = 400 - b.h;
        const spire = b.spire ? `L${b.x + b.w / 2 - 1.5},${top} L${b.x + b.w / 2},${top - 26} L${b.x + b.w / 2 + 1.5},${top} ` : "";
        return `M${b.x},400 L${b.x},${top} ${spire}L${b.x + b.w},${top} L${b.x + b.w},400 Z`;
      })
      .join(" ");

  return (
    <>
      {layers.map((bs, i) => (
        <svg
          key={i}
          className="atmo-layer absolute inset-x-0 bottom-0 w-[112%] -left-[6%] h-[42vh] min-h-[240px]"
          style={{ ["--depth" as string]: String(4 + i * 7), opacity: [0.55, 0.78, 1][i] }}
          viewBox="0 0 1600 400"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden
        >
          <path d={path(bs)} style={{ fill: `var(--atmo-city-${i})` }} />
          {i === 2 && lit && (
            <g style={{ fill: "var(--atmo-window)" }}>
              {windows.map((w, j) => (
                <rect key={j} x={w.x} y={w.y} width="2.4" height="3.2" rx="0.6" />
              ))}
            </g>
          )}
          {/* haze sits between layers so distance reads as depth */}
          <rect x="0" y="0" width="1600" height="400" fill="url(#atmo-fog)" opacity={[0.9, 0.55, 0.35][i]} />
        </svg>
      ))}
    </>
  );
});

const Particles = memo(function Particles({ count }: { count: number }) {
  const parts = useMemo(() => {
    const rnd = mulberry32(97);
    return Array.from({ length: 48 }, () => ({
      left: rnd() * 100,
      top: 30 + rnd() * 70,
      size: 1 + rnd() * 2.6,
      dur: 14 + rnd() * 22,
      delay: -rnd() * 30,
      dx: 20 + rnd() * 90,
      op: 0.25 + rnd() * 0.45,
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {parts.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: "var(--atmo-particle)",
            animation: `float-particle ${p.dur}s linear ${p.delay}s infinite`,
            ["--p-dx" as string]: `${p.dx}px`,
            ["--p-opacity" as string]: String(p.op),
          }}
        />
      ))}
    </div>
  );
});

interface AtmosphereProps {
  aqi: number;
  theme: "light" | "dark";
}

export function Atmosphere({ aqi, theme }: AtmosphereProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const band = bandOf(aqi);
  const [skyTop, skyMid, horizon, bloom] = (theme === "dark" ? DARK : LIGHT)[band];
  const haze = HAZE[band];
  const isDark = theme === "dark";
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const particleCount = Math.round((coarse ? 0.5 : 1) * Math.min(48, 8 + aqi / 7));

  // Pointer parallax (fine pointers only), batched into one rAF write of two CSS vars
  useEffect(() => {
    const el = rootRef.current;
    if (!el || coarse || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / window.innerWidth) - 0.5).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / window.innerHeight) - 0.5).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [coarse]);

  const vars = {
    "--atmo-top": skyTop,
    "--atmo-mid": skyMid,
    "--atmo-horizon": horizon,
    "--atmo-bloom": bloom,
    "--atmo-haze": String(haze),
    "--atmo-city-0": isDark ? `color-mix(in oklab, ${skyMid} 70%, ${horizon})` : `color-mix(in oklab, ${skyTop} 55%, ${horizon})`,
    "--atmo-city-1": isDark ? `color-mix(in oklab, ${skyTop} 70%, ${skyMid})` : `color-mix(in oklab, ${skyTop} 75%, #51627a)`,
    "--atmo-city-2": isDark ? "#050b16" : "#5a6b82",
    "--atmo-window": isDark ? "rgba(255, 214, 160, 0.55)" : "transparent",
    "--atmo-particle": isDark ? `color-mix(in oklab, ${bloom} 70%, white)` : "rgba(90, 80, 70, 0.5)",
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className="atmosphere fixed inset-0 z-0 overflow-hidden pointer-events-none" style={vars} aria-hidden>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="atmo-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--atmo-horizon)", stopOpacity: 0 }} />
            <stop offset="0.7" style={{ stopColor: "var(--atmo-horizon)", stopOpacity: "calc(var(--atmo-haze) * 0.8)" }} />
            <stop offset="1" style={{ stopColor: "var(--atmo-horizon)", stopOpacity: "var(--atmo-haze)" }} />
          </linearGradient>
        </defs>
      </svg>

      {/* sky */}
      <div className="atmo-sky absolute inset-0" />
      {/* light bloom (sun/moon diffused through the air column) */}
      <div className="atmo-layer atmo-bloom absolute" style={{ ["--depth" as string]: "2" }} />
      {/* slow drifting high haze bands */}
      <div className="atmo-drift absolute inset-x-0 top-[18%] h-[38%]" />

      <Skyline lit={isDark} />

      {/* ground fog: denser when air is worse */}
      <div className="atmo-ground absolute inset-x-0 bottom-0 h-[42vh]" />
      <Particles count={particleCount} />
      {/* vignette + grain keep the frame readable and the scene filmic */}
      <div className="atmo-vignette absolute inset-0" />
      <div className="atmo-grain absolute inset-0" />
    </div>
  );
}
