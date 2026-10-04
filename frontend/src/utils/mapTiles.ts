// Keyless basemaps that suit the atmospheric UI. (CARTO basemaps now require an API key.)
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";

export const basemapUrl = (isDark: boolean) =>
  `${ESRI}/${isDark ? "World_Dark_Gray_Base" : "World_Light_Gray_Base"}/MapServer/tile/{z}/{y}/{x}`;

export const basemapOptions = {
  attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
  maxNativeZoom: 16,
  maxZoom: 18,
};
