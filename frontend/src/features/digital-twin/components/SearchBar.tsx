import { useState } from "react";
import { Search, MapPin, X, History } from "lucide-react";

interface SearchBarProps {
  locations: any[];
  onSelectLocation: (location: any) => void;
}

export function SearchBar({ locations, onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("prana-recent-searches") || "[]");
  });

  const filtered = query.trim()
    ? locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()) || String(location.city || "").toLowerCase().includes(query.toLowerCase()) || String(location.label || "").toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (location: any) => {
    onSelectLocation(location);
    setQuery("");
    setShowSuggestions(false);
    
    // Save to recents
    const updated = [location.name, ...recentSearches.filter(name => name !== location.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("prana-recent-searches", JSON.stringify(updated));
  };

  const handleClearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("prana-recent-searches");
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-72 sm:w-80">
      <div className="relative bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-theme flex items-center px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
        <Search className="w-4 h-4 text-muted mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search neighborhood, landmark..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="bg-transparent border-none outline-none text-xs text-foreground placeholder-muted w-full focus:ring-0"
        />
        {query && (
          <button onClick={() => setQuery("")} className="p-0.5 rounded-full hover:bg-muted/10 text-muted">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)}></div>
          <div className="absolute left-0 top-11 w-full bg-card border border-border rounded-xl shadow-theme p-2 z-20 flex flex-col gap-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {query.trim() ? (
              filtered.length > 0 ? (
                filtered.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleSelect(w)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted/10 text-left text-foreground transition-colors w-full cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="flex-1 flex justify-between items-center">
                      <span>{w.name}</span>
                      <span className="text-[10px] text-muted">AQI {w.aqi}</span>
                    </div>
                  </button>
                ))
              ) : (
                <span className="px-3 py-2 text-xs text-muted block italic">No locations found</span>
              )
            ) : (
              <>
                {recentSearches.length > 0 && (
                  <div className="flex justify-between items-center px-2 py-1 border-b border-border mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted flex items-center gap-1">
                      <History className="w-3 h-3" /> Recent Searches
                    </span>
                    <button onClick={handleClearRecents} className="text-[9px] font-bold text-danger hover:underline">Clear</button>
                  </div>
                )}
                {recentSearches.length > 0 ? (
                  recentSearches.map((name, idx) => {
                    const matchedLocation = locations.find(location => location.name === name);
                    return (
                      <button
                        key={idx}
                        onClick={() => matchedLocation && handleSelect(matchedLocation)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-muted/10 text-left text-foreground transition-colors w-full cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span>{name}</span>
                      </button>
                    );
                  })
                ) : (
                  <span className="px-3 py-3 text-xs text-muted block italic text-center">Type to search neighborhoods, landmarks, and city areas...</span>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
