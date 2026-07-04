import { FileText, Calendar, Play } from "lucide-react";

export interface ReportTemplate {
  id: string;
  title: string;
  desc: string;
  type: string;
  lastGenerated: string;
}

interface ReportCardProps {
  report: ReportTemplate;
  onGenerate: (id: string) => void;
  onPreview: (report: ReportTemplate) => void;
}

export function ReportCard({ report, onGenerate, onPreview }: ReportCardProps) {
  return (
    <div className="glass-card p-5 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
      
      <div>
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted font-extrabold flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-primary" /> {report.type}
          </span>
          <span className="text-[9px] text-muted flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Gen: {report.lastGenerated}
          </span>
        </div>
        <h4 className="font-bold text-foreground text-xs mt-3 leading-snug">{report.title}</h4>
        <p className="text-[11px] text-muted mt-1 leading-normal font-sans">{report.desc}</p>
      </div>

      <div className="flex gap-2.5 mt-5 pt-3 border-t border-border/60">
        <button
          onClick={() => onGenerate(report.id)}
          className="flex-1 btn-primary py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
        >
          <Play className="w-3 h-3 text-white fill-white shrink-0" />
          <span>Compile</span>
        </button>
        <button
          onClick={() => onPreview(report)}
          className="flex-1 btn-secondary py-2 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer border border-border bg-card text-foreground hover:bg-muted/10"
        >
          <span>Preview Details</span>
        </button>
      </div>

    </div>
  );
}
