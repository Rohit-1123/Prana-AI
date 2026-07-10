import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { useTheme } from "../../../hooks/useTheme";
import { SearchBar } from "./SearchBar";
import { MapControls } from "./MapControls";
import { Legend } from "./Legend";
import { cn } from "../../../utils/cn";

interface MapViewProps {
  wards: any[];
  selectedWard: any;
  onSelectWard: (ward: any) => void;
}

export function MapView({ wards, selectedWard, onSelectWard }: MapViewProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const heatmapLayerRef = useRef<L.FeatureGroup | null>(null);
  const hasAppliedInitialOverviewRef = useRef(false);

  const [layersState] = useState<any>({
    aqi: true,
    weather: true,
    traffic: false,
    hospitals: false,
    schools: false,
    industries: false,
    construction: false,
    greenCover: false,
    roads: false
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  // National overview center for the hyperlocal multi-city map.
  const defaultCenter: [number, number] = [21.0, 79.0];
  const defaultZoom = 4.5;

  const cityClusters = [
    {
      city: "Hyderabad",
      aqi: 48,
      center: [17.385, 78.4867] as [number, number],
      places: [
        { name: "Gachibowli", latitude: 17.4401, longitude: 78.3489, aqi: 52 },
        { name: "Madhapur", latitude: 17.4483, longitude: 78.3915, aqi: 61 },
        { name: "Kondapur", latitude: 17.4622, longitude: 78.3572, aqi: 56 },
        { name: "Hitech City", latitude: 17.4504, longitude: 78.3809, aqi: 64 },
        { name: "Jubilee Hills", latitude: 17.4325, longitude: 78.4075, aqi: 45 },
        { name: "Begumpet", latitude: 17.4448, longitude: 78.4600, aqi: 50 },
        { name: "Secunderabad", latitude: 17.4399, longitude: 78.4983, aqi: 54 },
        { name: "Charminar", latitude: 17.3616, longitude: 78.4747, aqi: 63 },
        { name: "Kukatpally", latitude: 17.4855, longitude: 78.4100, aqi: 58 },
        { name: "Uppal", latitude: 17.4019, longitude: 78.5602, aqi: 53 },
        { name: "LB Nagar", latitude: 17.3457, longitude: 78.5522, aqi: 52 },
        { name: "Nampally", latitude: 17.3918, longitude: 78.4678, aqi: 60 },
        { name: "Miyapur", latitude: 17.4966, longitude: 78.3483, aqi: 49 },
        { name: "Mehdipatnam", latitude: 17.3971, longitude: 78.4316, aqi: 55 }
      ]
    },
    {
      city: "Chennai",
      aqi: 59,
      center: [13.0827, 80.2707] as [number, number],
      places: [
        { name: "Adyar", latitude: 13.0012, longitude: 80.2565, aqi: 54 },
        { name: "Velachery", latitude: 12.9819, longitude: 80.2184, aqi: 57 },
        { name: "Guindy", latitude: 13.0102, longitude: 80.2120, aqi: 61 },
        { name: "Anna Nagar", latitude: 13.0878, longitude: 80.2091, aqi: 56 },
        { name: "Tambaram", latitude: 12.9249, longitude: 80.1000, aqi: 52 }
      ]
    },
    {
      city: "Bangalore",
      aqi: 56,
      center: [12.9716, 77.5946] as [number, number],
      places: [
        { name: "Whitefield", latitude: 12.9698, longitude: 77.7500, aqi: 58 },
        { name: "Hoodi", latitude: 12.995, longitude: 77.711, aqi: 60 },
        { name: "Indiranagar", latitude: 12.9784, longitude: 77.6408, aqi: 53 },
        { name: "Electronic City", latitude: 12.8456, longitude: 77.6603, aqi: 62 },
        { name: "Koramangala", latitude: 12.9352, longitude: 77.6245, aqi: 55 }
      ]
    },
    {
      city: "Mumbai",
      aqi: 61,
      center: [19.076, 72.8777] as [number, number],
      places: [
        { name: "Andheri", latitude: 19.1136, longitude: 72.8697, aqi: 63 },
        { name: "Bandra", latitude: 19.0544, longitude: 72.8406, aqi: 60 },
        { name: "Powai", latitude: 19.1176, longitude: 72.9060, aqi: 58 },
        { name: "Lower Parel", latitude: 18.9944, longitude: 72.8258, aqi: 66 }
      ]
    },
    {
      city: "Delhi",
      aqi: 125,
      center: [28.6139, 77.209] as [number, number],
      places: [
        { name: "Connaught Place", latitude: 28.6315, longitude: 77.2167, aqi: 121 },
        { name: "Saket", latitude: 28.5245, longitude: 77.2066, aqi: 117 },
        { name: "Anand Vihar", latitude: 28.6469, longitude: 77.3160, aqi: 136 },
        { name: "Dwarka", latitude: 28.5921, longitude: 77.0460, aqi: 112 },
        { name: "Lajpat Nagar", latitude: 28.5677, longitude: 77.2431, aqi: 124 }
      ]
    }
  ] as const;

  const searchableLocations = [
    ...wards.map((ward) => ({
      id: `ward-${ward.id}`,
      name: ward.name,
      city: "Hyderabad",
      label: "Ward",
      latitude: ward.latitude,
      longitude: ward.longitude,
      aqi: ward.aqi,
      sourceWard: ward
    })),
    ...cityClusters.flatMap((cluster) => [
      {
        id: `city-${cluster.city}`,
        name: cluster.city,
        city: cluster.city,
        label: "City",
        latitude: cluster.center[0],
        longitude: cluster.center[1],
        aqi: cluster.aqi,
        sourceWard: null
      },
      ...cluster.places.map((place) => ({
        id: `place-${cluster.city}-${place.name}`,
        name: place.name,
        city: cluster.city,
        label: "Place",
        latitude: place.latitude,
        longitude: place.longitude,
        aqi: place.aqi,
        sourceWard: null
      }))
    ])
  ];

  // Initialize Map
  useEffect(() => {
    const map = L.map("digital-twin-map", {
      zoomControl: false, // Custom controls mapped instead
      attributionControl: false
    }).setView(defaultCenter, defaultZoom);

    mapRef.current = map;

    // Load initial theme tile
    const isDark = resolvedTheme === "dark";
    const mapTilesUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const tileLayer = L.tileLayer(mapTilesUrl, {
      maxZoom: 20
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Initialize overlays feature groups
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    const heatmapGroup = L.featureGroup().addTo(map);
    heatmapLayerRef.current = heatmapGroup;

    return () => {
      map.remove();
      hasAppliedInitialOverviewRef.current = false;
    };
  }, []);

  // Sync Leaflet tile layer style when theme changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const isDark = resolvedTheme === "dark";
    const mapTilesUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current.setUrl(mapTilesUrl);
  }, [resolvedTheme]);

  // Keep the initial national overview on first paint, then allow location selection to recenter.
  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasAppliedInitialOverviewRef.current) {
      hasAppliedInitialOverviewRef.current = true;
      return;
    }

    mapRef.current.setView([selectedWard.latitude, selectedWard.longitude], 13, {
      animate: true,
      duration: 1.0
    });
  }, [selectedWard]);

  // Render Overlay Vectors (AQI, Weather circles)
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    const heatmapGroup = heatmapLayerRef.current;
    if (!map || !markersGroup || !heatmapGroup) return;

    markersGroup.clearLayers();
    heatmapGroup.clearLayers();

    // Detect the currently selected active city based on the wards passed as props
    let activeCityName = "Hyderabad";
    if (wards.length > 0) {
      const firstWardName = wards[0]?.name || "";
      if (firstWardName.includes("Whitefield")) {
        activeCityName = "Bangalore";
      } else if (firstWardName.includes("Adyar")) {
        activeCityName = "Chennai";
      } else if (firstWardName.includes("Connaught")) {
        activeCityName = "Delhi";
      } else if (firstWardName.includes("Andheri")) {
        activeCityName = "Mumbai";
      } else {
        activeCityName = "Hyderabad";
      }
    }

    wards.forEach((w) => {
      const isSelected = w.id === selectedWard.id;
      const displayAqi = w.aqi;
      const color = displayAqi <= 50 ? "#4ADE80" : displayAqi <= 100 ? "#3B82F6" : displayAqi <= 200 ? "#FACC15" : "#EF4444";

      // 1. AQI Hotspots Heatmap placeholders
      if (layersState.aqi) {
        L.circle([w.latitude, w.longitude], {
          stroke: false,
          fillColor: color,
          fillOpacity: isSelected ? 0.55 : 0.35,
          radius: 1500
        }).addTo(heatmapGroup);
      }

      // 2. Weather conditions markers
      if (layersState.weather) {
        const weatherIcon = L.divIcon({
          className: "custom-div-icon",
          html: `
            <div class="flex items-center gap-1 bg-card/90 border border-border px-2 py-1 rounded-lg shadow-theme text-[9px] font-bold text-foreground hover:scale-105 active:scale-95 transition-all">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${color};"></span>
              <span>${w.name} (AQI: ${displayAqi})</span>
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        });

        const weatherMarker = L.marker([w.latitude, w.longitude], { icon: weatherIcon }).addTo(markersGroup);
        weatherMarker.on("click", () => {
          onSelectWard(w);
        });
      }

      // 3. Traffic Density vectors
      if (layersState.traffic) {
        // Draw simulated linear roads lines
        L.polyline([
          [w.latitude - 0.005, w.longitude - 0.005],
          [w.latitude + 0.005, w.longitude + 0.005]
        ], {
          color: w.traffic_congestion > 70 ? "#EF4444" : "#4ADE80",
          weight: 4,
          opacity: 0.65
        }).addTo(markersGroup);
      }

      // 4. Asset Overlays (Hospitals, schools, construction)
      if (layersState.hospitals) {
        L.circle([w.latitude + 0.002, w.longitude - 0.003], { radius: 100, color: "#3B82F6", fillOpacity: 0.8 }).addTo(markersGroup)
          .bindPopup(`<strong class="text-xs text-foreground block font-bold">IT Corridor Specialty Care</strong><span class="text-[10px] text-muted block mt-0.5">${w.name} Municipal Node</span>`);
      }
      if (layersState.schools) {
        L.circle([w.latitude - 0.004, w.longitude + 0.002], { radius: 100, color: "#A855F7", fillOpacity: 0.8 }).addTo(markersGroup)
          .bindPopup(`<strong class="text-xs text-foreground block font-bold">Public Green School Zone</strong><span class="text-[10px] text-muted block mt-0.5">${w.name} Primary Node</span>`);
      }
      if (layersState.construction) {
        L.circle([w.latitude + 0.003, w.longitude + 0.004], { radius: 150, color: "#F59E0B", fillOpacity: 0.8 }).addTo(markersGroup)
          .bindPopup(`<strong class="text-xs text-foreground block font-bold">Real Estate Building Node</strong><span class="text-[10px] text-muted block mt-0.5">Particulate dust warning active</span>`);
      }
    });

    cityClusters.forEach((cluster) => {
      if (cluster.city === activeCityName) return;
      const clusterColor = cluster.aqi <= 50 ? "#4ADE80" : cluster.aqi <= 100 ? "#3B82F6" : cluster.aqi <= 200 ? "#FACC15" : "#EF4444";
      const cityIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div class="flex items-center gap-1.5 bg-card/92 border border-border px-3 py-2 rounded-2xl shadow-theme text-[10px] font-bold text-foreground backdrop-blur-md">
            <span class="w-2 h-2 rounded-full" style="background-color: ${clusterColor}; box-shadow: 0 0 0 4px ${clusterColor}22;"></span>
            <span>${cluster.city} (AQI: ${cluster.aqi})</span>
          </div>
        `,
        iconSize: [140, 28],
        iconAnchor: [70, 14]
      });

      L.marker(cluster.center, { icon: cityIcon }).addTo(markersGroup);

      cluster.places.forEach((place, index) => {
        const placeColor = place.aqi <= 50 ? "#4ADE80" : place.aqi <= 100 ? "#3B82F6" : place.aqi <= 200 ? "#FACC15" : "#EF4444";
        const offsetLat = place.latitude + (index % 2 === 0 ? 0.003 : -0.003);
        const offsetLng = place.longitude + (index % 3 === 0 ? 0.004 : -0.004);
        const placeIcon = L.divIcon({
          className: "custom-div-icon",
          html: `
            <div class="flex items-center gap-1 bg-card/90 border border-border px-2 py-1 rounded-lg shadow-theme text-[9px] font-bold text-foreground hover:scale-105 active:scale-95 transition-all backdrop-blur-sm">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${placeColor};"></span>
              <span>${place.name} (AQI: ${place.aqi})</span>
            </div>
          `,
          iconSize: [120, 20],
          iconAnchor: [60, 10]
        });

        L.marker([offsetLat, offsetLng], { icon: placeIcon }).addTo(markersGroup);
      });
    });

  }, [wards, selectedWard, layersState]);

  // Floating controls handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleLocateMe = () => {
    if (!mapRef.current) return;
    mapRef.current.setView(defaultCenter, 13, { animate: true });
    // Focus default centroid Hyderabad
    const centroid = wards.find(w => w.name === "Gachibowli") || wards[0];
    onSelectWard(centroid);
  };
  const handleResetView = () => {
    mapRef.current?.setView(defaultCenter, defaultZoom, { animate: true });
  };
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Resize Leaflet Map when toggling fullscreen
  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 120);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  return (
    <div className={cn(
      "w-full h-full relative border border-border rounded-2xl overflow-hidden bg-background shadow-theme select-none",
      isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "min-h-[460px] h-[550px]"
    )}>

      {/* 1. Leaflet Canvas Element */}
      <div id="digital-twin-map" className="w-full h-full z-0" />

      {/* 2. Floating Search autocomplete */}
      <SearchBar
        locations={searchableLocations}
        onSelectLocation={(location) => {
          const selectedLocation = location.sourceWard || {
            ...selectedWard,
            id: location.id,
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            aqi: location.aqi,
            pm2_5: selectedWard.pm2_5,
            pm10: selectedWard.pm10
          };

          onSelectWard(selectedLocation);
          mapRef.current?.setView([location.latitude, location.longitude], 13, {
            animate: true,
            duration: 1.0
          });
        }}
      />

      {/* 3. Floating Map navigation controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocateMe={handleLocateMe}
        onResetView={handleResetView}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 5. Floating category Legends */}
      <Legend />



    </div>
  );
}
