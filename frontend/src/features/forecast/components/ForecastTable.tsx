import { ArrowUpRight, ArrowDownRight, Equal } from "lucide-react";
import { cn } from "../../../utils/cn";
import { extraTranslations } from "../../../utils/i18n_extra";
import { useSettings } from "../../../contexts/SettingsContext";

interface ForecastTableProps {
  data: any[];
}

export function ForecastTable({ data }: ForecastTableProps) {
  const { language, formatTemp, formatWind } = useSettings();
  const activeLanguage = language;
  const tExtra = extraTranslations[activeLanguage] || extraTranslations["en"];

  const getAQIColorClass = (aqi: number) => {
    if (aqi <= 50) return "text-success font-bold";
    if (aqi <= 100) return "text-secondary font-bold";
    if (aqi <= 200) return "text-warning font-bold";
    return "text-danger font-bold";
  };

  const getAQIBadgeText = (aqi: number) => {
    if (activeLanguage === "hi") {
      if (aqi <= 50) return "अच्छा";
      if (aqi <= 100) return "संतोषजनक";
      if (aqi <= 200) return "मध्यम";
      return "खराब / गंभीर";
    }
    if (activeLanguage === "te") {
      if (aqi <= 50) return "మంచిది";
      if (aqi <= 100) return "సంతృప్తికరం";
      if (aqi <= 200) return "సాధారణం";
      return "ప్రమాదకరం";
    }
    if (activeLanguage === "ta") {
      if (aqi <= 50) return "நல்லது";
      if (aqi <= 100) return "திருப்திகரமானது";
      if (aqi <= 200) return "மிதமானது";
      return "மோசமானது / தீவிரமானது";
    }
    if (activeLanguage === "kn") {
      if (aqi <= 50) return "ಉತ್ತಮ";
      if (aqi <= 100) return "ತೃಪ್ತಿದಾಯಕ";
      if (aqi <= 200) return "ಸಾಧಾರಣ";
      return "ಕಳಪೆ / ತೀವ್ರ";
    }
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Satisfactory";
    if (aqi <= 200) return "Moderate";
    return "Poor / Severe";
  };

  const getHorizonLabel = (time: string) => {
    if (time.includes("Now")) return tExtra.horizonNow || time;
    if (time.includes("+6h")) return tExtra.horizon6h || time;
    if (time.includes("+12h")) return tExtra.horizon12h || time;
    if (time.includes("+24h")) return tExtra.horizon24h || time;
    if (time.includes("+48h")) return tExtra.horizon48h || time;
    if (time.includes("+72h")) return tExtra.horizon72h || time;
    return time;
  };

  const tempLabel = activeLanguage === "hi" ? "तापमान" : activeLanguage === "te" ? "ఉష్ణోగ్రత" : activeLanguage === "ta" ? "வெப்பநிலை" : activeLanguage === "kn" ? "ತಾಪಮಾನ" : "Temp";
  const humidityLabel = activeLanguage === "hi" ? "आर्द्रता" : activeLanguage === "te" ? "తేమ" : activeLanguage === "ta" ? "ஈரப்பதம்" : activeLanguage === "kn" ? "ಆರ್ದ್ರತೆ" : "Humidity";

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div>
        <h4 className="font-bold text-sm text-foreground">{tExtra.forecastLedgerGrid}</h4>
        <span className="text-[10px] text-muted mt-1 block">{tExtra.forecastLedgerSub}</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/5 text-muted font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5 pr-4">{tExtra.leadTime}</th>
              <th className="p-3.5 pr-4 text-center">{tExtra.predictedAqi}</th>
              <th className="p-3.5 pr-4 text-center">{tExtra.category}</th>
              <th className="p-3.5 pr-4 text-center">{tempLabel}</th>
              <th className="p-3.5 pr-4 text-center">{humidityLabel}</th>
              <th className="p-3.5 pr-4 text-center">{tExtra.windVectors}</th>
              <th className="p-3.5 pr-4 text-center">{tExtra.confidence}</th>
              <th className="p-3.5 pr-4 text-center">{tExtra.trends}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/5 transition-colors">
                <td className="p-3.5 font-bold">{getHorizonLabel(row.time)}</td>
                <td className={cn("p-3.5 text-center font-extrabold", getAQIColorClass(row.aqi))}>{row.aqi}</td>
                <td className="p-3.5 text-center font-semibold text-muted">{getAQIBadgeText(row.aqi)}</td>
                <td className="p-3.5 text-center font-medium">{formatTemp(row.temp)}</td>
                <td className="p-3.5 text-center font-medium">{row.humidity}%</td>
                <td className="p-3.5 text-center font-medium">{formatWind(row.wind)}</td>
                <td className="p-3.5 text-center font-black text-primary">{row.confidence}%</td>
                <td className="p-3.5 text-center font-semibold text-muted">
                  <div className="flex items-center justify-center gap-1">
                    {row.trend === "rising" ? (
                      <span className="text-danger flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5 animate-pulse" /> {tExtra.rising}</span>
                    ) : row.trend === "falling" ? (
                      <span className="text-success flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5 animate-pulse" /> {tExtra.falling}</span>
                    ) : (
                      <span className="text-muted flex items-center gap-0.5"><Equal className="w-3.5 h-3.5" /> {tExtra.stable}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
