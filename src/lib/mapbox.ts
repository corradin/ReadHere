export function getMapboxAccessToken(): string {
  const token = import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Missing Mapbox access token');
  }
  return token;
}

export interface MapConfig {
  container: string | HTMLElement;
  style: string;
  center: [number, number];
  zoom: number;
}

export const DEFAULT_MAP_CONFIG = {
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-74.006, 40.7128] as [number, number],
  zoom: 12,
};
