export function Legend() {
  const scale = [
    { label: "Good (0-50)", color: "bg-success" },
    { label: "Satisfactory (51-100)", color: "bg-secondary" },
    { label: "Moderate (101-200)", color: "bg-warning" },
    { label: "Severe (201+)", color: "bg-danger" }
  ];

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-theme flex flex-col gap-2 text-[9px] font-bold tracking-tight text-foreground w-44 animate-in fade-in duration-200">
      <div>
        <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted block mb-0.5">AQI Color Legend</span>
        <span className="text-[7.5px] text-muted leading-none font-medium block">Hyderabad Ward Categories</span>
      </div>

      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-border/80">
        {scale.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded ${item.color} shrink-0`} />
            <span className="text-[10px] font-semibold text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
