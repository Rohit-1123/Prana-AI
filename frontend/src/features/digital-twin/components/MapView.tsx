import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { aqiColor } from "../../../utils/aqi";
import { basemapUrl, basemapOptions } from "../../../utils/mapTiles";
import { CITY_BY_WARD } from "../../../data/mockCities";
import { useTheme } from "../../../hooks/useTheme";
import { SearchBar } from "./SearchBar";
import { MapControls } from "./MapControls";
import { Legend } from "./Legend";
import { cn } from "../../../utils/cn";

interface MapViewProps {
  /** Every place in every city, with live readings merged in. */
  wards: any[];
  selectedWard: any;
  onSelectWard: (ward: any) => void;
}

const NATIONAL_CENTER: [number, number] = [21.0, 79.0];
const NATIONAL_ZOOM = 5;
const CITY_ZOOM_MIN = 8; // below this, show one bubble per city instead of every place
const esc = (v: unknown) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function MapView({ wards, selectedWard, onSelectWard }: MapViewProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.FeatureGroup | null>(null);
  const [zoom, setZoom] = useState(11);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // City summaries come from the live place readings, never from fixed numbers
  const cities = useMemo(() => {
    const byCity = new Map<string, any[]>();
    wards.forEach((w) => {
      const c = CITY_BY_WARD[w.name];
      if (c) byCity.set(c, [...(byCity.get(c) ?? []), w]);
    });
    return [...byCity].map(([city, ws]) => ({
      city,
      aqi: Math.round(ws.reduce((a, w) => a + Number(w.aqi), 0) / ws.length),
      center: [ws.reduce((a, w) => a + w.latitude, 0) / ws.length, ws.reduce((a, w) => a + w.longitude, 0) / ws.length] as [number, number]
    }));
  }, [wards]);

  const searchableLocations = useMemo(() => [
    ...cities.map((c) => ({ id: `city-${c.city}`, name: c.city, city: c.city, label: "City", latitude: c.center[0], longitude: c.center[1], aqi: c.aqi, sourceWard: null })),
    ...wards.map((w) => ({ id: `ward-${w.id}`, name: w.name, city: CITY_BY_WARD[w.name] ?? "", label: "Place", latitude: w.latitude, longitude: w.longitude, aqi: w.aqi, sourceWard: w }))
  ], [cities, wards]);

  // Create the map once, opened on the selected place's city
  useEffect(() => {
    const map = L.map("digital-twin-map", { zoomControl: false, attributionControl: true })
      .setView([selectedWard.latitude, selectedWard.longitude], 11);
    mapRef.current = map;
    tileLayerRef.current = L.tileLayer(basemapUrl(resolvedTheme === "dark"), basemapOptions).addTo(map);
    map.attributionControl.setPrefix(false);
    markersRef.current = L.featureGroup().addTo(map);
    setZoom(map.getZoom());
    map.on("zoomend", () => setZoom(map.getZoom()));
    return () => {
      map.stop();
      map.off();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- created once; later changes are handled by the effects below
  }, []);

  useEffect(() => {
    tileLayerRef.current?.setUrl(basemapUrl(resolvedTheme === "dark"));
  }, [resolvedTheme]);

  // Move to a place when it is selected from anywhere in the app
  const firstSelection = useRef(true);
  useEffect(() => {
    if (firstSelection.current) { firstSelection.current = false; return; }
    mapRef.current?.setView([selectedWard.latitude, selectedWard.longitude], 13, { animate: true, duration: 1.0 });
  }, [selectedWard]);

  // Draw markers: city bubbles when zoomed out, place badges when zoomed in
  const onSelectRef = useRef(onSelectWard);
  onSelectRef.current = onSelectWard;
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;
    group.clearLayers();

    if (zoom < CITY_ZOOM_MIN) {
      cities.forEach((c) => {
        const color = aqiColor(c.aqi);
        const icon = L.divIcon({
          className: "custom-div-icon",
          html: `<div class="flex items-center gap-1.5 bg-card/92 border border-border px-3 py-2 rounded-2xl shadow-theme text-[10px] font-bold text-foreground backdrop-blur-md whitespace-nowrap"><span class="w-2 h-2 rounded-full" style="background-color:${color};box-shadow:0 0 0 4px ${color}22;"></span><span>${esc(c.city)} · AQI ${c.aqi}</span></div>`,
          iconSize: [150, 28],
          iconAnchor: [75, 14]
        });
        L.marker(c.center, { icon, title: `${c.city} · AQI ${c.aqi}` })
          .on("click", () => map.setView(c.center, 11, { animate: true }))
          .addTo(group);
      });
      return;
    }

    wards.forEach((w) => {
      const color = aqiColor(w.aqi);
      const isSelected = w.name === selectedWard.name;
      L.circle([w.latitude, w.longitude], { stroke: false, fillColor: color, fillOpacity: isSelected ? 0.5 : 0.3, radius: 1500 }).addTo(group);
      const icon = L.divIcon({
        className: "custom-div-icon",
        html: `<div class="flex items-center gap-1 bg-card/90 border ${isSelected ? "border-primary" : "border-border"} px-2 py-1 rounded-lg shadow-theme text-[9px] font-bold text-foreground whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full" style="background-color:${color};"></span><span>${esc(w.name)} · AQI ${esc(w.aqi)}</span></div>`,
        iconSize: [130, 20],
        iconAnchor: [65, 10]
      });
      L.marker([w.latitude, w.longitude], { icon, title: `${w.name} · AQI ${w.aqi}`, zIndexOffset: isSelected ? 1000 : 0 })
        .on("click", () => onSelectRef.current(w))
        .addTo(group);
    });
  }, [wards, cities, selectedWard, zoom]);

  const handleLocateMe = () => mapRef.current?.setView([selectedWard.latitude, selectedWard.longitude], 13, { animate: true });
  const handleResetView = () => mapRef.current?.setView(NATIONAL_CENTER, NATIONAL_ZOOM, { animate: true });

  // Resize Leaflet Map when toggling fullscreen
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 120);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  return (
    <div className={cn(
      "w-full h-full relative border border-border rounded-2xl overflow-hidden bg-background shadow-theme select-none",
      isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "min-h-[460px] h-[550px]"
    )}>
      <div id="digital-twin-map" className="w-full h-full z-0" />

      <SearchBar
        locations={searchableLocations}
        onSelectLocation={(location) => {
          if (location.sourceWard) onSelectWard(location.sourceWard);
          else mapRef.current?.setView([location.latitude, location.longitude], 11, { animate: true, duration: 1.0 });
        }}
      />

      <MapControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onLocateMe={handleLocateMe}
        onResetView={handleResetView}
        onToggleFullscreen={() => setIsFullscreen((f) => !f)}
      />

      <Legend />
    </div>
  );
}
