<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import { getMapboxAccessToken, DEFAULT_MAP_CONFIG } from '../lib/mapbox';
  import type { Venue } from '../lib/types';

  interface Props {
    venues?: Venue[];
    center?: [number, number];
    zoom?: number;
    onVenueClick?: (venue: Venue) => void;
  }

  let {
    venues = [],
    center = DEFAULT_MAP_CONFIG.center,
    zoom = DEFAULT_MAP_CONFIG.zoom,
    onVenueClick,
  }: Props = $props();

  let mapContainer: HTMLDivElement;
  let map: mapboxgl.Map | null = null;
  let markers: mapboxgl.Marker[] = [];

  onMount(() => {
    mapboxgl.accessToken = getMapboxAccessToken();

    map = new mapboxgl.Map({
      container: mapContainer,
      style: DEFAULT_MAP_CONFIG.style,
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    updateMarkers();
  });

  onDestroy(() => {
    markers.forEach(marker => marker.remove());
    map?.remove();
  });

  function updateMarkers() {
    if (!map) return;

    markers.forEach(marker => marker.remove());
    markers = [];

    venues.forEach(venue => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#3b82f6';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([venue.longitude, venue.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 style="margin: 0 0 8px 0; font-weight: 600;">${venue.name}</h3>
             <p style="margin: 0; color: #666;">${venue.address}</p>`
          )
        )
        .addTo(map!);

      if (onVenueClick) {
        el.addEventListener('click', () => onVenueClick(venue));
      }

      markers.push(marker);
    });

    if (venues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      venues.forEach(venue => {
        bounds.extend([venue.longitude, venue.latitude]);
      });
      map?.fitBounds(bounds, { padding: 50 });
    }
  }

  $effect(() => {
    venues;
    updateMarkers();
  });
</script>

<div bind:this={mapContainer} class="map-container"></div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
  }

  :global(.mapboxgl-popup-content) {
    padding: 12px;
    border-radius: 8px;
  }

  :global(.mapboxgl-popup-close-button) {
    font-size: 18px;
    padding: 4px 8px;
  }
</style>
