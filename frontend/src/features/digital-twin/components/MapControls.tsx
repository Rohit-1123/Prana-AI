import { Plus, Minus, Compass, Maximize, RotateCcw } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetView,
  onToggleFullscreen
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex flex-col bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-theme overflow-hidden">
        <button 
          onClick={onZoomIn} 
          title="Zoom In"
          className="p-2.5 hover:bg-muted/10 text-foreground transition-colors border-b border-border cursor-pointer flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={onZoomOut} 
          title="Zoom Out"
          className="p-2.5 hover:bg-muted/10 text-foreground transition-colors cursor-pointer flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onLocateMe}
        title="Locate Centroid"
        className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-2.5 shadow-theme hover:bg-muted/10 text-foreground transition-colors cursor-pointer flex items-center justify-center"
      >
        <Compass className="w-4 h-4" />
      </button>

      <button
        onClick={onResetView}
        title="Reset View Boundaries"
        className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-2.5 shadow-theme hover:bg-muted/10 text-foreground transition-colors cursor-pointer flex items-center justify-center"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={onToggleFullscreen}
        title="Toggle Fullscreen"
        className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-2.5 shadow-theme hover:bg-muted/10 text-foreground transition-colors cursor-pointer flex items-center justify-center"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
}
