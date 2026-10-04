import { useEffect, useRef } from "react";
import L from "leaflet";
import { basemapUrl, basemapOptions } from "../../utils/mapTiles";
import { aqiColor, aqiLabel } from "../../utils/aqi";

const esc = (v: unknown) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

interface Options {
  enabled: boolean;
  containerId: string;
  isDark: boolean;
  wards: any[];
  focus: any;
  onSelect: (ward: any) => void;
}

/** Draws the dashboard's overview map: one AQI badge per place, the focused place labelled. */
export function useMissionMap({ enabled, containerId, isDark, wards, focus, onSelect }: Options) {
  // Latest handler without making the map rebuild on every render
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!enabled) return;

    let map: L.Map | null = null;
    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) return;
      if ((container as any)._leaflet_id) (container as any)._leaflet_id = null;

      map = L.map(containerId, { zoomControl: false, attributionControl: true }).setView([focus.latitude, focus.longitude], 12);
      L.tileLayer(basemapUrl(isDark), basemapOptions).addTo(map);
      map.attributionControl.setPrefix(false);

      const bounds = L.latLngBounds([]);

      wards.forEach((ward) => {
        const color = aqiColor(ward.aqi);
        const isFocus = ward.name === focus.name;
        const size = isFocus ? 46 : 34;
        const icon = L.divIcon({
          className: "aqi-badge",
          html: `
            <div style="position:relative;display:flex;align-items:center;gap:8px;width:max-content;font-family:Manrope,sans-serif;">
              <span style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:rgba(8,18,34,0.66);border:2px solid ${color};box-shadow:0 0 0 ${isFocus ? 8 : 4}px ${color}26,0 10px 24px -8px rgba(0,0,0,0.6);color:#F2F7FC;font-size:${isFocus ? 14 : 11}px;font-weight:600;backdrop-filter:blur(8px);">${esc(ward.aqi)}</span>
              ${isFocus ? `<span style="padding:6px 12px;border-radius:9999px;background:rgba(8,18,34,0.66);border:1px solid rgba(255,255,255,0.16);color:#F2F7FC;font-size:12px;font-weight:500;white-space:nowrap;backdrop-filter:blur(8px);">${esc(ward.name)}</span>` : ""}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker([ward.latitude, ward.longitude], {
          icon,
          keyboard: true,
          title: `${ward.name} · AQI ${ward.aqi}`,
          zIndexOffset: isFocus ? 1000 : 0
        }).addTo(map!);

        if (!isFocus) marker.bindTooltip(esc(ward.name), { direction: "top", offset: [0, -size / 2], className: "aqi-tooltip" });
        bounds.extend([ward.latitude, ward.longitude]);

        const btnId = `btn-select-map-${ward.id}`;
        marker.bindPopup(`
          <div style="color: var(--foreground); font-family: Manrope, sans-serif; font-size: 12px; line-height: 1.5; padding: 4px 2px; min-width: 190px;">
            <div style="font-size: 16px; font-weight: 500;">${esc(ward.name)}</div>
            <div style="display:flex; align-items:baseline; gap:8px; margin-top:6px;"><span style="font-size: 30px; font-weight: 200; letter-spacing:-0.04em;">${esc(ward.aqi)}</span><span style="color:${color}">${esc(aqiLabel(ward.aqi))}</span></div>
            <div style="color: var(--muted);">PM2.5 ${esc(ward.pm2_5)} · PM10 ${esc(ward.pm10)} µg/m³</div>${!isFocus ? `<button id="${btnId}" style="margin-top: 10px; font-size: 12px; padding: 8px 12px; background: var(--primary); border: none; border-radius: 9999px; color: var(--on-primary); cursor: pointer; font-weight: 600; width: 100%;">Focus this place</button>` : ""}
          </div>
        `, { closeButton: false });

        marker.on("popupopen", () => {
          const btn = document.getElementById(btnId);
          if (btn) btn.onclick = () => { onSelectRef.current(ward); map?.closePopup(); };
        });
      });

      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15), { animate: false });
    }, 100);

    return () => {
      clearTimeout(timer);
      // stop in-flight pan/zoom animations first, otherwise Leaflet throws "_leaflet_pos" on teardown
      map?.stop();
      map?.off();
      map?.remove();
    };
  }, [enabled, containerId, isDark, wards, focus]);
}
