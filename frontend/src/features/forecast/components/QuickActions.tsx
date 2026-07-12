import { useState } from "react";
import { Download, Landmark, Map, ChevronDown, FileSpreadsheet, File } from "lucide-react";

interface QuickActionsProps {
  onExport: (format: "csv" | "pdf") => void;
  onCompare: () => void;
  onViewMap: () => void;
}

export function QuickActions({
  onExport,
  onCompare,
  onViewMap
}: QuickActionsProps) {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  return (
    <div className="flex gap-3 flex-wrap items-center relative select-none z-30">
      
      {/* Export Forecast Button with Dropdown Workflow */}
      <div className="relative">
        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Export Forecast</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {showExportDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)}></div>
            <div className="absolute left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-theme p-1.5 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => {
                  onExport("csv");
                  setShowExportDropdown(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-muted/10 text-left transition-colors w-full cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                <span>Download CSV Ledger</span>
              </button>
              <button
                onClick={() => {
                  onExport("pdf");
                  setShowExportDropdown(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-muted/10 text-left transition-colors w-full cursor-pointer"
              >
                <File className="w-4 h-4 text-secondary" />
                <span>Download tabular PDF</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Compare Locations Button */}
      <button
        onClick={onCompare}
        className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-semibold cursor-pointer border border-border bg-card text-foreground hover:bg-muted/10"
      >
        <Landmark className="w-4 h-4 shrink-0" />
        <span>Compare Locations</span>
      </button>

      {/* View Digital Twin Button */}
      <button
        onClick={onViewMap}
        className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-semibold cursor-pointer border border-border bg-card text-foreground hover:bg-muted/10"
      >
        <Map className="w-4 h-4 shrink-0" />
        <span>View Digital Twin</span>
      </button>

    </div>
  );
}
