import { AQI_BANDS } from "../../../utils/aqi";

export function Legend() {
  return (
    <div className="hidden sm:block absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-theme flex flex-col gap-2 text-[9px] font-bold tracking-tight text-foreground w-48 animate-in fade-in duration-200">
      <div>
        <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mb-0.5">India AQI (CPCB)</span>
        <span className="text-[7.5px] text-muted leading-none font-medium block">24-hour average, from model data</span>
      </div>

      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-border/80">
        {AQI_BANDS.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded shrink-0" style={{ background: b.color }} />
            <span className="text-[10px] font-semibold text-foreground">{b.label} <span className="text-muted font-normal">({b.range})</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
