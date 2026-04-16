// MapLibre GL JS configuration with free OpenStreetMap tiles
// No API key or credit card required!

export interface MapConfig {
  container: string | HTMLElement;
  style: string | object;
  center: [number, number];
  zoom: number;
}

// Free OpenStreetMap style for MapLibre GL JS
export const DEFAULT_MAP_CONFIG = {
  style: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 19,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
      },
    ],
    id: "blank",
  },
  center: [4.8988, 52.3674] as [number, number],
  zoom: 10,
};
