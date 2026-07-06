import React, { createContext, useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type WeatherMode = "Sunny" | "Cloudy" | "Rain" | "Windy";
export type AQILevel = "Good" | "Moderate" | "Poor" | "VeryPoor" | "Severe";

interface EnvironmentalContextType {
  weatherMode: WeatherMode;
  aqiLevel: AQILevel;
  windSpeed: number;
  aqi: number;
}

const EnvironmentalContext = createContext<EnvironmentalContextType>({
  weatherMode: "Sunny",
  aqiLevel: "Moderate",
  windSpeed: 5.0,
  aqi: 100,
});

export const useEnvironmentalTheme = () => useContext(EnvironmentalContext);

interface EnvironmentalThemeProviderProps {
  children: React.ReactNode;
  selectedWard: {
    aqi: number;
    weather_condition?: string;
    wind_speed?: number;
  };
}

export function EnvironmentalThemeProvider({
  children,
  selectedWard,
}: EnvironmentalThemeProviderProps) {
  const aqi = selectedWard.aqi;
  const windSpeed = selectedWard.wind_speed ?? 5.0;
  
  // Map weather condition text to core modes
  const rawWeather = (selectedWard.weather_condition || "Sunny").toLowerCase();
  let weatherMode: WeatherMode = "Sunny";
  if (rawWeather.includes("cloud") || rawWeather.includes("overcast") || rawWeather.includes("mist")) {
    weatherMode = "Cloudy";
  } else if (rawWeather.includes("rain") || rawWeather.includes("drizzle") || rawWeather.includes("shower") || rawWeather.includes("storm") || rawWeather.includes("wet")) {
    weatherMode = "Rain";
  } else if (rawWeather.includes("wind") || rawWeather.includes("breeze") || windSpeed > 6.0) {
    weatherMode = "Windy";
  } else {
    weatherMode = "Sunny";
  }

  // Map AQI to levels
  let aqiLevel: AQILevel = "Moderate";
  if (aqi <= 50) aqiLevel = "Good";
  else if (aqi <= 100) aqiLevel = "Moderate";
  else if (aqi <= 200) aqiLevel = "Poor";
  else if (aqi <= 300) aqiLevel = "VeryPoor";
  else aqiLevel = "Severe";

  // Dynamic CSS Variables injection
  useEffect(() => {
    const root = document.documentElement;
    
    // Config values based on mode
    let glassReflection = "";
    let accentGlow = "";
    let aqiTint = "";
    
    // Weather reflections
    if (weatherMode === "Sunny") {
      glassReflection = "linear-gradient(135deg, rgba(251, 191, 36, 0.09) 0%, transparent 50%, rgba(251, 191, 36, 0.03) 100%)";
      accentGlow = "rgba(245, 158, 11, 0.15)";
    } else if (weatherMode === "Cloudy") {
      glassReflection = "linear-gradient(135deg, rgba(203, 213, 225, 0.05) 0%, transparent 70%)";
      accentGlow = "rgba(148, 163, 184, 0.1)";
    } else if (weatherMode === "Rain") {
      glassReflection = "linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, transparent 60%, rgba(56, 189, 248, 0.04) 100%)";
      accentGlow = "rgba(14, 165, 233, 0.15)";
    } else { // Windy
      glassReflection = "linear-gradient(135deg, rgba(34, 211, 238, 0.07) 0%, transparent 50%)";
      accentGlow = "rgba(34, 211, 238, 0.12)";
    }

    // AQI Tint overlays
    if (aqiLevel === "Good") {
      aqiTint = "rgba(16, 185, 129, 0.02)";
    } else if (aqiLevel === "Moderate") {
      aqiTint = "rgba(2, 132, 199, 0.01)";
    } else if (aqiLevel === "Poor") {
      aqiTint = "rgba(249, 115, 22, 0.04)";
    } else if (aqiLevel === "VeryPoor") {
      aqiTint = "rgba(239, 68, 68, 0.06)";
    } else { // Severe
      aqiTint = "rgba(225, 29, 72, 0.09)";
    }

    root.style.setProperty("--env-card-reflection", glassReflection);
    root.style.setProperty("--env-accent-glow", accentGlow);
    root.style.setProperty("--env-aqi-tint", aqiTint);
  }, [weatherMode, aqiLevel]);

  return (
    <EnvironmentalContext.Provider value={{ weatherMode, aqiLevel, windSpeed, aqi }}>
      {children}
    </EnvironmentalContext.Provider>
  );
}

// Particle Canvas Implementation
export function EnvironmentalAmbience() {
  const { weatherMode, aqiLevel, windSpeed } = useEnvironmentalTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Classes
    class SunParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;

        if (this.opacity <= 0 || this.y < 0) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.opacity = Math.random() * 0.5 + 0.2;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(251, 191, 36, 0.4)";
        ctx.fillStyle = `rgba(253, 224, 71, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class RainParticle {
      x: number;
      y: number;
      length: number;
      speedY: number;
      speedX: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.length = Math.random() * 15 + 10;
        this.speedY = Math.random() * 8 + 6;
        this.speedX = -1.5;
        this.opacity = Math.random() * 0.3 + 0.15;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
          // Add occasional water ripples at bottom
          if (Math.random() > 0.7) {
            ripples.push(new WaterRipple(this.x, height - Math.random() * 80));
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = `rgba(186, 230, 253, ${this.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.speedX * 1.5, this.y + this.length);
        ctx.stroke();
      }
    }

    class WaterRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      fadeSpeed: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = Math.random() * 25 + 10;
        this.opacity = 0.4;
        this.fadeSpeed = Math.random() * 0.008 + 0.005;
      }

      update() {
        this.radius += 0.5;
        this.opacity -= this.fadeSpeed;
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = `rgba(14, 165, 233, ${this.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius, this.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    class WindParticle {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      opacity: number;
      angleOffset: number;

      constructor() {
        this.x = Math.random() * width - 100;
        this.y = Math.random() * height;
        this.length = Math.random() * 60 + 40;
        this.speedX = Math.random() * 2.5 + 2.0;
        this.speedY = 0;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.angleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        // Faint wave pattern
        this.y += Math.sin(this.x * 0.008 + this.angleOffset) * 0.4;

        if (this.x > width) {
          this.x = -150;
          this.y = Math.random() * height;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = `rgba(165, 243, 252, ${this.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.stroke();
      }
    }

    class PollutionParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      angle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.1 + 0.05;
        this.opacity = Math.random() * 0.35 + 0.15;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX + Math.sin(this.angle) * 0.05;
        this.y += this.speedY;
        this.angle += 0.01;

        if (this.y > height) {
          this.y = -10;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = aqiLevel === "Severe" 
          ? `rgba(239, 68, 68, ${this.opacity})` 
          : `rgba(120, 113, 108, ${this.opacity})`; // dusty red or gray
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize lists
    const suns: SunParticle[] = [];
    const rains: RainParticle[] = [];
    const ripples: WaterRipple[] = [];
    const winds: WindParticle[] = [];
    const pollutions: PollutionParticle[] = [];

    const initParticles = () => {
      suns.length = 0;
      rains.length = 0;
      ripples.length = 0;
      winds.length = 0;
      pollutions.length = 0;

      if (weatherMode === "Sunny") {
        for (let i = 0; i < 40; i++) suns.push(new SunParticle());
      } else if (weatherMode === "Rain") {
        for (let i = 0; i < 80; i++) rains.push(new RainParticle());
      }
      
      // Wind particles (always active if wind is high, or mode is wind)
      if (weatherMode === "Windy" || windSpeed > 6.0) {
        const count = weatherMode === "Windy" ? 30 : 15;
        for (let i = 0; i < count; i++) winds.push(new WindParticle());
      }

      // AQI pollution particles (Poor, Very Poor, Severe)
      if (aqiLevel === "Poor") {
        for (let i = 0; i < 15; i++) pollutions.push(new PollutionParticle());
      } else if (aqiLevel === "VeryPoor") {
        for (let i = 0; i < 35; i++) pollutions.push(new PollutionParticle());
      } else if (aqiLevel === "Severe") {
        for (let i = 0; i < 60; i++) pollutions.push(new PollutionParticle());
      }
    };

    initParticles();

    // Listen to resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (weatherMode === "Sunny") {
        suns.forEach((p) => {
          p.update();
          p.draw();
        });
      } else if (weatherMode === "Rain") {
        rains.forEach((p) => {
          p.update();
          p.draw();
        });
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.update();
          r.draw();
          if (r.opacity <= 0) ripples.splice(i, 1);
        }
      }

      winds.forEach((p) => {
        p.update();
        p.draw();
      });

      pollutions.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [weatherMode, aqiLevel, windSpeed]);

  // Framer Motion ambient lighting overlays
  const getAmbientStyles = () => {
    const isSunny = weatherMode === "Sunny";
    const isCloudy = weatherMode === "Cloudy";
    const isRain = weatherMode === "Rain";

    let radialGlows = "";
    let backgroundOverlay = "";

    // Weather background bases
    if (isSunny) {
      backgroundOverlay = "linear-gradient(to bottom, rgba(253, 230, 138, 0.04), rgba(7, 11, 20, 0))";
      radialGlows = "radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.08) 0%, transparent 45%)";
    } else if (isCloudy) {
      backgroundOverlay = "linear-gradient(to bottom, rgba(100, 116, 139, 0.03), rgba(7, 11, 20, 0))";
      radialGlows = "radial-gradient(circle at 50% 25%, rgba(148, 163, 184, 0.06) 0%, transparent 55%)";
    } else if (isRain) {
      backgroundOverlay = "linear-gradient(to bottom, rgba(14, 165, 233, 0.05), rgba(7, 11, 20, 0))";
      radialGlows = "radial-gradient(circle at 40% 15%, rgba(56, 189, 248, 0.08) 0%, transparent 40%)";
    } else { // Windy
      backgroundOverlay = "linear-gradient(to bottom, rgba(34, 211, 238, 0.03), rgba(7, 11, 20, 0))";
      radialGlows = "radial-gradient(circle at 60% 30%, rgba(34, 211, 238, 0.06) 0%, transparent 45%)";
    }

    // AQI modifications
    let aqiOverlay = "";
    if (aqiLevel === "Good") {
      aqiOverlay = "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)";
    } else if (aqiLevel === "Poor") {
      aqiOverlay = "radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.09) 0%, transparent 50%)";
    } else if (aqiLevel === "VeryPoor") {
      aqiOverlay = "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.09) 0%, transparent 50%)";
    } else if (aqiLevel === "Severe") {
      aqiOverlay = "radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.12) 0%, transparent 50%)";
    }

    return { radialGlows, backgroundOverlay, aqiOverlay };
  };

  const { radialGlows, backgroundOverlay, aqiOverlay } = getAmbientStyles();
  const showCloudShadows = weatherMode === "Cloudy";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Canvas for weather & pollution particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-70" />

      {/* Cross-fade of weather overlay color tints */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${weatherMode}-${aqiLevel}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{ background: backgroundOverlay }}
        />
      </AnimatePresence>

      {/* Weather glow circles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${weatherMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{ background: radialGlows }}
        />
      </AnimatePresence>

      {/* AQI Atmosphere overlays */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`aqi-${aqiLevel}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{ background: aqiOverlay }}
        />
      </AnimatePresence>

      {/* Cloudy Overcast Floating Shadows animation */}
      {showCloudShadows && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-5"
        >
          <div className="absolute top-[10%] left-[-20%] w-[60%] h-[35%] bg-slate-950/40 rounded-full blur-[150px] animate-float" style={{ animationDuration: "35s" }} />
          <div className="absolute bottom-[20%] right-[-10%] w-[55%] h-[30%] bg-slate-950/30 rounded-full blur-[140px] animate-float" style={{ animationDuration: "42s" }} />
        </motion.div>
      )}

      {/* AQI Poor/VeryPoor/Severe Haze blur overlays */}
      {aqiLevel !== "Good" && aqiLevel !== "Moderate" && (
        <div 
          className="absolute inset-0 z-5 transition-all duration-1000"
          style={{
            backdropFilter: aqiLevel === "Poor" 
              ? "blur(0.5px)" 
              : aqiLevel === "VeryPoor" 
              ? "blur(1.2px)" 
              : "blur(2.2px)",
            opacity: aqiLevel === "Poor" 
              ? 0.1 
              : aqiLevel === "VeryPoor" 
              ? 0.22 
              : 0.35
          }}
        />
      )}
    </div>
  );
}
