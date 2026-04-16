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
      osm: {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  center: [-74.006, 40.7128] as [number, number],
  zoom: 12,
};
